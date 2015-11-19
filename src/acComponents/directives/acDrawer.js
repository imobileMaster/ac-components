angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            scope: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
              $scope.drawerPosition = attrs.acDrawerPosition;
            }
        };
    });
