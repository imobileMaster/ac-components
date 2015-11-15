angular.module('acComponents.directives')
    .directive('acForecastMini', function (AC_API_ROOT_URL) {
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
;
