angular.module('acComponents.directives')
    .directive('acHotZoneMini', function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'hot-zone-mini.html',
            scope: {},
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;
            }
        };
    });
;
