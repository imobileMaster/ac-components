angular.module('acComponents.directives')
  .directive('acTabStyle', function () {
    return {
      link: function ($scope, el, attrs) {
        attrs.$observe('acTabStyle', applyStyle);

        function applyStyle (newVal) {
          var res = JSON.parse(newVal);
          _.forEach(res, function (val, cssClass) {
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
