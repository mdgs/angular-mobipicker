/* 
 * @Author: ims13
 * @Date:   2014-07-29 11:14:56
 * @Last Modified by:   ims13
 * @Last Modified time: 2014-10-09 15:06:37
 */
angular.module('hari.ui', [])

.directive('mobiPicker', ['$parse', '$timeout',

  function($parse, $timeout) {

    // regexp for time
    var reg12 = new RegExp(/^(1[012]|[1-9]):[0-5][0-9](\s)?(am|pm)$/i);
    var reg24 = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/i);

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
          customTime: false,

          onSelect: function(valueText, inst) {
            // console.log('select');
            // scope.$apply(function() {
            //   var getter = $parse(attrs['mobiPicker']);
            //   var setter = getter.assign;

            //   if (['date', 'time'].indexOf(inst.settings.preset) >= 0) {
            //     setter(scope, angular.copy(elm.mobiscroll('getDate')));
            //   } else if (['select'].indexOf(inst.settings.preset) >= 0) {
            //     setter(scope, angular.copy(elm.mobiscroll('getValue')));
            //   }
            // });
          },

          onClose: function(valueText, btn, inst) {
            var getter = $parse(attrs['mobiPicker']);
            var setter = getter.assign;

            $timeout(function() {
              switch (btn) {
                case 'set':
                  scope.$apply(function() {

                    // special request time as string 12 hours format & 24 format
                    if (inst.settings.customTime && ['time'].indexOf(inst.settings.preset) >= 0) {
                      var comp = elm.mobiscroll('getValue');
                      var time = ('0' + comp[0]).substr(-2) + ':';
                      time += ('0' + comp[1]).substr(-2);

                      // if time with am/pm, the comp element consist of 3 items
                      if (comp.length > 2) { //--> am/pm
                        time += '' + comp[2] === '0' ? ' AM' : ' PM';
                      }
                      console.log(comp);
                      setter(scope, time);
                    }

                    // 
                    else if (['date', 'time'].indexOf(inst.settings.preset) >= 0) {
                      setter(scope, angular.copy(elm.mobiscroll('getDate')));
                    }

                    // 
                    else if (['select'].indexOf(inst.settings.preset) >= 0) {
                      setter(scope, angular.copy(elm.mobiscroll('getValue')));
                    }


                  });
                  break;
                case 'clear':
                  scope.$apply(function() {
                    setter(scope, null);
                  });
                  break;
              }
            }, 0, false);
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
              var inst = $element.mobiscroll('getInst');

              $timeout(function() {
                if ((newValue instanceof Date) && ['date', 'time'].indexOf(inst.settings.preset) >= 0) {
                  $element.mobiscroll('setDate', newValue, true);
                }

                // // special request for time as string 12 hours format & 24 hours
                else if (inst.settings.customTime && ['time'].indexOf(inst.settings.preset) >= 0 &&
                  (reg12.test(newValue) || reg24.test(newValue))) {
                  $element.mobiscroll('setValue', newValue, true);
                }

                // 
                else if (['select'].indexOf(inst.settings.preset) >= 0) {
                  $element.mobiscroll('setValue', [newValue], true);
                }

              }, 0, false);
            },
            true
          );
        }
      ]
    };

    return directive;
  }
]);