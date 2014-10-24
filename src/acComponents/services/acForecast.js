angular.module('acComponents.services')
    .factory('acForecast', function ($http, $q, acImageCache) {
        var forecasts;
        var apiUrl = 'http://localhost:9000'; // todo: move to constants

        function cacheDangerIcons(){
            var dangerIcons = _.map(forecasts.features, function (f) {
                return apiUrl + f.properties.dangerIconUrl;
            });

            acImageCache.cache(dangerIcons);
        }

        return {
            fetch: function () {
                if(forecasts) {
                    return forecasts;
                } else {
                    return $http.get(apiUrl + '/api/forecasts').then(function (res) {
                        forecasts = res.data;
                        cacheDangerIcons();
                        return forecasts;
                    });
                }
            },
            getOne: function (region) {
                return $q.when(this.fetch()).then(function () {
                    region = _.find(forecasts.features, {id: region});

                    return $http.get(apiUrl + region.properties.forecastUrl).then(function (res) {
                        return res.data;
                    });
                });
            }
        };
    });