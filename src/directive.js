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
