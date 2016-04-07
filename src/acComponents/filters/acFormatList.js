angular.module('acComponents.filters')
    .filter('acFormatList', function () {
        return function (input) {
            if (input && input !== 'N/A') {
                var formattedString = '';
                for (var key in input) {
                    if (input[key]) {
                        formattedString = formattedString + ', ' + key;
                    }
                }
                return formattedString.replace(', ', '');
            }
            return input;
        };
    });
