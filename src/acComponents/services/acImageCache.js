angular.module('acComponents.services')
    .factory('acImageCache', function($http) {
        return {
            cache: function (images) {
                images.forEach(function (i) {
                    $http.get(i);
                });
            }
        };
    });