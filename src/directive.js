'use strict';

angular
  .module('wb.inputHinter.directive', [])

  .directive('inputHinter', function (inputHinter) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var userConfig = {
          waitBeforeDeleteMs: attr.waitBeforeDeleteMs,
          waitInBetweenMs: attr.waitInBetweenMs,
          writeSpeedMs: attr.writeSpeedMs,
          deleteSpeedMs: attr.deleteSpeedMs,
          delimiter: attr.delimiter
        };

        // Unset non-existing config values.
        angular.forEach(userConfig, function (key, val) {
          if( typeof val === 'undefined' ) {
            delete userConfig[key];
          }
        });

        var ticker = new inputHinter(userConfig);

        ticker.placeholders = attr.inputHinter.split('|');

        ticker.onTick = function (newPlaceholderText) {
          element.attr('placeholder', newPlaceholderText);
        };

        scope.Ticker.init();
      }
    };
  });
