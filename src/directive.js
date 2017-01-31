angular
  .module('wb.inputHints.directive', [])

  .directive('inputHints', ['InputHints', '$parse',
    function (InputHints, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          var userConfig = {
            waitBeforeDeleteMs: attr.waitBeforeDeleting || attr.waitBeforeDelete,
            waitInBetweenMs: attr.waitInBetween,
            writeSpeedMs: attr.writeSpeed,
            deleteSpeedMs: attr.deleteSpeed
          };

          // Unset non-existing config values.
          angular.forEach(userConfig, function (val, key) {
            if( typeof val === 'undefined' ) {
              delete userConfig[key];
            }
          });

          var placeholders = $parse(attr.inputHints)(scope);
          var ticker = new InputHints(userConfig, placeholders);

          ticker.onTick = function (newPlaceholderText) {
            element.attr('placeholder', newPlaceholderText);
          };

          ticker.init();
        }
      };
    }
  ]);
