angular.module('acComponents.directives')
  .directive('acEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.acEnter);
          });

          event.preventDefault();
        }
      });
    };
});
