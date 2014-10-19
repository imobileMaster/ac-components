angular.module('acComponents.services')
    .factory('acForecast', function ($http, acImageCache) {
        var forecasts;

        function cacheDangerIcons(){
            var dangerIcons = _.map(forecasts.features, function (f) {
                return f.properties.dangerIconUrl;
            });

            acImageCache.cache(dangerIcons);
        }

        return {
            fetch: function () {
                return $http.get('api/forecasts').then(function (res) {
                    forecasts = res.data;
                    cacheDangerIcons();
                    return forecasts;
                });
            },
            getOne: function (region) {
                region = _.find(forecasts.features, {id: region});

                return $http.get(region.properties.forecastUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    });