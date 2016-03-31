angular.module('acComponents.directives')
    .directive('acForecastMini', function ($state, $stateParams, AC_API_ROOT_URL) {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast',
                dangerRating: '=dangerRating',
                disclaimer: '=disclaimer',
                sponsor: '=sponsor'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;
                $scope.closeDrawer = function () {
                    $scope.forecast = null;
                    if($stateParams.regionid) {
                        $state.go('ac.map');
                    }
                };
            }
        };
    })
    .directive('acForecastMiniExternal', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-external.html',
            scope: { forecast: '=' },
        };
    })
    .directive('acForecastMiniParks', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-parks.html',
            scope: { forecast: '=' },
        };
    })
    .directive('acForecastMiniAvalx', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-avalx.html',
            scope: {
                forecast: '=',
                dangerRating: '=',
                disclaimer: '=',
                sponsor: '='
            }
        };
    })
    .directive('whistlerLinks', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'wbc-links.html'
        };
    });
;
