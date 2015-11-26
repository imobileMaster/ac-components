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
            },
            controller: function($scope) {
                $scope.forecastType = function() {
                    if(typeof $scope.forecast !== 'undefined') {
                        if($scope.forecast.parksUrl) {
                          return 'PARKS';
                        } else {
                          return 'AVALX';
                        } 
                        
                    }
                    
                };
            }
        };
    })
    .directive('whistlerLinks', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'wbc-links.html'
        };
    })
    .directive('acForecastMiniParksLinks', function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            scope: { 
                forecast: '=',
            },
            resolve: {
                links: function($scope, $q) {
                    console.log('Some info for ya:', $scope.forecast);
                    return $q.resolve($scope.forecast.id);
                }
            },
            link: {
                pre:  console.log.bind(console, "in pre-link"),
                post: console.log.bind(console, "in post-link")
            },
            controller: console.log.bind(console, 'running controller'),
            templateUrl: 'forecast-mini-parks-links.html'
        };
    })
;
