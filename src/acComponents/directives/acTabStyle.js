angular.module('acComponents.directives')
  .directive('acTabStyle', function () {
    return {
      link: function ($scope, el, attrs) {
        attrs.$observe('acTabStyle', applyStyle);

        function applyStyle (newVal) {
          var res = JSON.parse(newVal);

          _.forEach(res, function (val, cssClass) {
            if(cssClass === 'tab') {
              el.find('a').addClass(val);
            }

            if (val) {
              el.removeClass(cssClass).addClass(cssClass);
            } else {
              el.removeClass(cssClass);
            }
          });
        }
      }
    };
  });
