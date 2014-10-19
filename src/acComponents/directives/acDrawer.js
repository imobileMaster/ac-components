angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
                
            }
        };
    });