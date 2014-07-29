/* 
 * @Author: ims13
 * @Date:   2014-07-29 11:14:56
 * @Last Modified by:   ims13
 * @Last Modified time: 2014-07-29 14:42:33
 */
angular.module('hari', [])

.directive('mobiPicker', ['$parse',
  function($parse) {

    var directive = {
      restrict: 'A',

      // update scope variable, component -> scope
      link: function(scope, elm, attrs) {

        // default option
        var options = {
          preset: 'date',
          theme: 'default',
          mode: 'scroller',
          display: 'modal',
          animate: 'none',

          onSelect: function(valueText, inst) {
            scope.$apply(function() {
              var getter = $parse(attrs['mobiPicker']);
              var setter = getter.assign;

              setter(scope, angular.copy(elm.mobiscroll('getDate')));
            });
          }
        };

        // prepare initialization object for scroller
        var initOptS = attrs['mobiPickerOptions'] || '{}';
        var initOpt = scope.$eval(initOptS);

        angular.extend(options, initOpt);

        // init scroller
        // elm.mobiscroll()[options.preset](options);
        elm.scroller(options);

      },

      // update picker component, scope -> component
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {

          $scope.$watch(
            // watched variable in scope object
            function() {
              var getter = $parse($attrs['mobiPicker']);
              return getter($scope);
            },
            // action for change
            function(newValue) {
              if (!(newValue instanceof Date)) {
                throw new Error("'" + $attrs['mobiPicker'] + "' must be a Date object");
              }

              var inst = $element.mobiscroll('getInst');
              $element.mobiscroll('setDate', newValue);
              $element.val(inst.val);
            },
            true
          );
        }
      ]
    };

    return directive;
  }
]);