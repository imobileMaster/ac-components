'use strict';

angular.module('acComponents.filters')
    .filter('dateUtc', function () {
        return function (datePST, format) {
            if (datePST) {
                return moment.utc(datePST).format(format) ;
            }
        };
    });
