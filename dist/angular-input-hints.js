/*
	angular-input-hints v1.0.0
	https://github.com/williamboman/angular-input-hints

	Copyright (c) 2014 William Boman <william@redwill.se>

	License: MIT (https://github.com/williamboman/angular-input-hints/blob/master/LICENSE)
*/


(function (angular) {
  'use strict';
angular.module('wb.inputHints', [
  'wb.inputHints.service',
  'wb.inputHints.directive'
]);

angular
  .module('wb.inputHints.directive', [])

  .directive('inputHints', ['inputHints',
    function (inputHints) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          var userConfig = {
            waitBeforeDeleteMs: attr.waitBeforeDeleting || attr.waitBeforeDelete,
            waitInBetweenMs: attr.waitInBetween,
            writeSpeedMs: attr.writeSpeed,
            deleteSpeedMs: attr.deleteSpeed,
            delimiter: attr.delimiter
          };

          // Unset non-existing config values.
          angular.forEach(userConfig, function (val, key) {
            if( typeof val === 'undefined' ) {
              delete userConfig[key];
            }
          });

          var ticker = new inputHints(userConfig);

          ticker.placeholders = attr.inputHints;

          ticker.onTick = function (newPlaceholderText) {
            element.attr('placeholder', newPlaceholderText);
          };

          ticker.init();
        }
      };
    }
  ]);

angular
  .module('wb.inputHints.service', [])

  .provider('inputHints', function () {
    var config = this.config = {
      waitBeforeDeleteMs: 2000,
      waitInBetweenMs: 300,
      writeSpeedMs: 100,
      deleteSpeedMs: 60,
      delimiter: '|'
    };

    this.$get = ['$timeout',
      function ($timeout) {

        function Ticker(userConfig) {
          userConfig = userConfig || {};
          this.currentPlaceholderText = '';
          this.currentPlaceholdersIndex = 0;
          this.currentPlaceholderIndex = 0;
          this.isDeleting = false;
          this.timeout = undefined;

          this.config = angular.copy(config);
          angular.extend(this.config, userConfig);
        }

        Ticker.prototype = {
          init: function () {
            if( !this.placeholders ) {
              throw new TypeError('[wb.inputHints] This instance of Ticker is missing Ticker.placeholders property.');
            }
            this.placeholders = this.placeholders.split(this.config.delimiter);

            if( this.userConfig ) {
              angular.extend(this.config, this.userConfig);
            }

            if( !this.onTick || typeof this.onTick !== 'function' ) {
              throw new TypeError('[wb.inputHints] This instance of Ticker is missing a valid Ticker.onTick callback function.');
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

        return Ticker;
      }
    ];
  });
})(window.angular);
