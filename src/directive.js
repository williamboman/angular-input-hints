'use strict';

angular
  .module('wb.inputHinter.directive', [])

  .directive('inputHinter', function (inputHinter) {
    return {
      restrict: 'A',
      scope: {
        inputHinter: '@',
        waitBeforeDeleteMs: '@waitBeforeDeleting',
        waitInBetweenMs: '@waitInBetween',
        writeSpeedMs: '@writeSpeed',
        deleteSpeedMs: '@deleteSpeed'
      },
      replace: true,
      link: function (scope, element, attr) {
        var userConfig = {
          waitBeforeDeleteMs: attr.waitBeforeDeleteMs,
          waitInBetweenMs: attr.waitInBetweenMs,
          writeSpeedMs: attr.writeSpeedMs,
          deleteSpeedMs: attr.deleteSpeedMs,
          delimiter: attr.delimiter
        };

        var ticker = new inputHinter(userConfig);

        ticker.placeholders = attr.inputHinter.split('|');

        ticker.onTick = function (newPlaceholderText) {
          element.attr('placeholder', newPlaceholderText);
        };

        scope.Ticker.init();
      },
      controller: ['$scope', 'inputHinter',
        function ($scope, inputHinter) {

          $scope.Ticker = new inputPholders();

          $scope.Ticker.placeholders = $scope.inputPholders.split('|');
          $scope.Ticker.userConfig = cleanedUserConfig;
        }
      ]
    };
  });
