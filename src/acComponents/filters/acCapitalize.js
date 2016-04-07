angular.module('acComponents.filters')
    .filter('acCapitalize', function () {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
