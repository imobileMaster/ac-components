angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return {
          scope: {
            showOnlyDate: '=',
            showOnlyTime: '='
          },
          link: function (scope, el) {
            if(jQuery().datetimepicker) {

              var options = {
                pickTime: !scope.showOnlyDate,
                format: (scope.showOnlyTime ? 'LT' : scope.showOnlyDate ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"),
                pickDate: scope.showOnlyTime ? !scope.showOnlyTime : true
              };
              el.datetimepicker(options);
            }
          }
        }
    });
