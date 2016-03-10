angular.module('acComponents.services')
    .factory('acHotZone', function ($http, $q, acImageCache, AC_API_ROOT_URL) {
        var hotZones;
        var apiUrl = AC_API_ROOT_URL;

        return {
            fetch: function () {
                var deferred = $q.defer();

                if(hotZones) {
                    deferred.resolve(hotZones);
                } else {
                    $http.get(apiUrl + '/api/hotzones').then(function (res) {
                        hotZones = res.data;
                        deferred.resolve(hotZones);
                    });
                }

                return deferred.promise;
            },
            getOne: function (regionId) {
                return $q.when(this.fetch()).then(function () {
                    var region = _.find(hotZones.features, {id: regionId});
                    return region;
                });
            }
        };
    });
