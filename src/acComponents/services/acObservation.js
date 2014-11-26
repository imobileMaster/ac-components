angular.module('acComponents.services')
    .factory('acObservation', function ($http, AC_API_ROOT_URL) {
        return {
            byPeriod: function (period) {
                var opt = {params: {period: period || '2:days'}};

                return $http.get(AC_API_ROOT_URL+'/api/min/observations', opt).then(function (res) {
                    return res.data;
                });
            }
        };
    });