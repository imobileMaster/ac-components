'use strict';

angular.module('acComponents.directives')
    .directive('acSummerConditions', function () {
        return {
            restrict: 'E',
            templateUrl: 'summer-conditions.html',
            scope: { forecast: '=' }
        };
    })
    .directive('acSummerConditionsText', function () {
        return {
            templateUrl: 'summer-conditions-text.html'
        };
    });
