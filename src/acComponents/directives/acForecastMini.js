angular.module('acComponents.directives')
    .directive('acForecastMini', function () {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
            }
        };
    });