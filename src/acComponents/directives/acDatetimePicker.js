angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return {
          scope: {
            showOnlyDate: '='
          },
          link: function (scope, el) {
            if(jQuery().datetimepicker) {
              var options = {
                pickTime: !scope.showOnlyDate,
                format: scope.showOnlyDate ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"
              };
              el.datetimepicker(options);
            }
          }
        }
    });
