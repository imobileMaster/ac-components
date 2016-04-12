'use strict';

angular.module('acComponents.directives')
    .directive('acSpringConditions', function () {
        return {
            restrict: 'E',
            templateUrl: 'spring-conditions.html',
            scope: { forecast: '=' }
        };
    })
    .directive('acSpringConditionsText', function () {
        return {
            restrict: 'E',
            template: '<p>' +
                'The avalanche danger is variable and can range from Low to ' +
                'High. Travelling early in the day is recommended, as conditions ' +
                'can change rapidly in short periods of time due to daytime ' +
                'warming. Pay careful attention to the integrity of the surface ' +
                'crusts formed overnight and rising air temperatures during the ' +
                'day. Dry slab avalanche danger may also exist during spring ' +
                'snow storms.</p>' +
                '<p><a target="_blank" href="http://www.avalanche.ca/fxresources/spring_ovw.pdf">More Spring Conditions Details</a>' +
             '</p>'
        };
    });
