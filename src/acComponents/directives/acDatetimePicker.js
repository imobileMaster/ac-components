angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return {
          scope: {
            showOnlyDate: '=',
            showOnlyTime: '=',
            maxDateToday: '=',
            minDateToday: '='
          },
          link: function (scope, el) {
            if(jQuery().datetimepicker) {


              var options = {
                maxDate: (scope.maxDateToday === true) ? new Date() : new Date(new Date().setYear(new Date().getFullYear() + 1)),
                minDate: (scope.minDateToday === true) ? new Date() : new Date(new Date().setYear(new Date().getFullYear() + 1)),
                pickTime: !scope.showOnlyDate,
                format: (scope.showOnlyTime ? 'LT' : scope.showOnlyDate ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"),
                pickDate: scope.showOnlyTime ? !scope.showOnlyTime : true
              };

              el.datetimepicker(options);

              jQuery(window).scroll(function() {
                if(el.data("DateTimePicker") !== undefined) {
                    el.data("DateTimePicker").hide();
                }
              });
            }
          }
        }
    });
