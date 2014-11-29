angular.module('acComponents.services')
    .factory('acObservation', function ($http, AC_API_ROOT_URL) {
        return {
            byPeriod: function (period) {
                var opt = {params: {period: period || '2:days'}};

                return $http.get(AC_API_ROOT_URL+'/api/min/observations', opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = AC_API_ROOT_URL+'/api/min/observations/' + obid + format;
                
                return $http.get(obUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    });