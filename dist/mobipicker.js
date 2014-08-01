/*! Angular Directive for mobiscroll picker - v0.0.0 - 2014-07-31
* Copyright (c) 2014 I Made Agus Setiawan; Licensed  */
angular.module('hari.ui', [])

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

              if (['date', 'time'].indexOf(inst.settings.preset) >= 0) {
                setter(scope, angular.copy(elm.mobiscroll('getDate')));
              } else if (['select'].indexOf(inst.settings.preset) >= 0) {
                setter(scope, angular.copy(elm.mobiscroll('getValue')));
              }
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
              var inst = $element.mobiscroll('getInst');

              if ((newValue instanceof Date) && ['date', 'time'].indexOf(inst.settings.preset) >= 0) {
                $element.mobiscroll('setDate', newValue, true);
              } else if (['select'].indexOf(inst.settings.preset) >= 0) {
                $element.mobiscroll('setValue', [newValue], true);
              }
            },
            true
          );
        }
      ]
    };

    return directive;
  }
]);