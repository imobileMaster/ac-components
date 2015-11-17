angular.module('acComponents.directives')
  .directive('acSubmissionFormValidator', function () {
    return {
      require: '^form',
      link: function ($scope, el, attrs, ctrl) {
        $scope.validate = function (fieldName, field) {
          if (!field.validate()) {
            setFormValidity(fieldName, false);
          } else {
            setFormValidity(fieldName, true);
          }
        };

        function setFormValidity(fieldName, state) {
          if (angular.isDefined(ctrl[fieldName])) {
            ctrl[fieldName].$setValidity(fieldName, state);
          }
        }
      }
    };
  });
