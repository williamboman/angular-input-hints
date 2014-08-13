/*
 * angular-input-placeholders
 *
 * Animates input placeholders to make it look like they are being typed in realtime.
 *
 * (c) 2014 William Boman <william@redwill.se>
 * License: MIT
 */

(function () {
  'use strict';

  angular.module('wb.inputPholders', [])
    .directive('inputPholders', function () {
      return {
        restrict: 'A',
        scope: {
          inputPholders: '@',
          waitBeforeDeleteMs: '@inputPholdersWaitBeforeDeleting',
          waitInBetweenMs: '@inputPholdersWaitInBetween',
          writeSpeedMs: '@inputPholdersWriteSpeed',
          deleteSpeedMs: '@inputPholdersDeleteSpeed'
        },
        replace: true,
        link: function (scope, element) {
          scope.Ticker.onTick = function (newPlaceholderText) {
            element.attr('placeholder', newPlaceholderText);
          };

          scope.Ticker.init();
        },
        controller: ['$scope', 'inputPholders',
          function ($scope, inputPholders) {
            var userConfig = {
              waitBeforeDeleteMs: $scope.waitBeforeDeleteMs,
              waitInBetweenMs: $scope.waitInBetweenMs,
              writeSpeedMs: $scope.writeSpeedMs,
              deleteSpeedMs: $scope.deleteSpeedMs
            };
            var cleanedUserConfig = {};

            angular.forEach(userConfig, function (configItem, key) {
              switch( key ) {
                case 'waitBeforeDeleteMs':
                case 'waitInBetweenMs':
                case 'writeSpeedMs':
                case 'deleteSpeedMs':
                  if( /^\d+$/.test(configItem) ) {
                    cleanedUserConfig[key] = parseInt(configItem);
                  }
                  break;
              }
            });

            $scope.Ticker = inputPholders.newTicker();

            $scope.Ticker.placeholders = $scope.inputPholders.split('|');
            $scope.Ticker.userConfig = cleanedUserConfig;
          }
        ]
      };
    })

    .provider('inputPholders', function () {
      var config = this.config = {
        waitBeforeDeleteMs: 2000,
        waitInBetweenMs: 300,
        writeSpeedMs: 100,
        deleteSpeedMs: 60
      };

      this.$get = ['$timeout',
        function ($timeout) {

          function Ticker() {
            this.currentPlaceholderText = '';
            this.currentPlaceholdersIndex = 0;
            this.currentPlaceholderIndex = 0;
            this.isDeleting = false;
            this.timeout = undefined;

            this.config = config;
          }

          Ticker.prototype = {
            init: function () {
              if( !this.placeholders ) {
                throw new TypeError('[wb.inputPholder] This instance of Ticker is missing Ticker.placeholders property.');
              }

              if( this.userConfig ) {
                angular.extend(this.config, this.userConfig);
              }

              if( !this.onTick || typeof this.onTick !== 'function' ) {
                throw new TypeError('[wb.inputPholder] This instance of Ticker is missing a valid Ticker.onTick callback function.');
              }

              this.tick();
            },
            stop: function () {
              $timeout.cancel(this.timeout);
            },
            resume: function () {
              this.tick();
            },
            tick: function () {
              var _this = this;
              // Cancel any possible duplicate timeout.
              $timeout.cancel(this.timeout);

              if( !this.isDeleting ) {
                this.currentPlaceholderIndex++;
              } else {
                this.currentPlaceholderIndex--;
              }

              if( this.currentPlaceholderIndex > this.placeholders[this.currentPlaceholdersIndex].length ) {
                // Reached maximum length of the current string. Start delete timeout.
                this.isDeleting = true;

                this.timeout = $timeout(function () {
                  _this.tick();
                }, this.getTickTime('beforeDeleting'));
                return;
              } else if( this.currentPlaceholderIndex < 0 ) {
                // Reached 0 length of the current string. Start next string timeout.
                this.isDeleting = false;
                this.currentPlaceholdersIndex++;

                if( this.currentPlaceholdersIndex >= this.placeholders.length ) {
                  this.currentPlaceholdersIndex = 0;
                }

                this.timeout = $timeout(function () {
                  _this.tick();
                }, this.getTickTime('inBetween'));
                return;
              }

              this.currentPlaceholderText = this.placeholders[this.currentPlaceholdersIndex].substr(0, this.currentPlaceholderIndex);

              this.onTick(this.currentPlaceholderText);

              this.timeout = $timeout(function () {
                _this.tick();
              }, this.isDeleting ? this.getTickTime('deleting') : this.getTickTime('writing'));
            },
            getTickTime: function (what) {
              switch( what ) {
                case 'writing':
                  return this.config.writeSpeedMs-(Math.random()*this.config.writeSpeedMs);

                case 'deleting':
                  return this.config.deleteSpeedMs-(Math.random()*this.config.deleteSpeedMs);

                case 'beforeDeleting':
                  return this.config.waitBeforeDeleteMs;

                case 'inBetween':
                  return this.config.waitInBetweenMs;

                default:
                  throw new ReferenceError('Trying to get a non-existent tick-time.');
              }
            }
          };

          return {
            newTicker: function () {
              return new Ticker();
            }
          };
        }
      ];
    });
})();
