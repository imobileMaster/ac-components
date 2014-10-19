angular.module('acComponents.services')
    .factory('acObservation', function ($http) {
        return {
            byPeriod: function (period) {
                var opt = {params: {period: period}};

                return $http.get('api/observations', opt).then(function (res) {
                    return res.data;
                });
            }
        };
    });