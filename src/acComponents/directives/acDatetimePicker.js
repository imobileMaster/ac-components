angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return function () {
            if(jQuery().datetimepicker) {
                var options = {
                    format: "YYYY-MM-DD hh:mm A"
                };
                $('.min-form').first().find('[type="datetime"]').datetimepicker(options);
            }
        }
    });