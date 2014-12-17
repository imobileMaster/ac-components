angular.module('acComponents.directives')
    .directive('acDangerIcon', function () {
        return {
            replace: true,
            templateUrl: 'danger-icon.html',
            link: function ($scope, el, attrs) {
                
            }
        };
    });