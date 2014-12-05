angular.module('acComponents.directives')
    .directive('acSocialShare', function () {
        return {
            templateUrl: 'social-share.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });