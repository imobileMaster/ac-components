angular.module('acComponents.directives')
    .directive('acForecastMini', function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;

                $scope.externalLinkClicked = function(url){
                  $scope.$emit('ac.acForecastMini.linkClicked', url);
                };
            }
        };
    });
