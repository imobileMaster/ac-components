angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
                $scope.expanded = false;

                $scope.toggleObs = function() {
                  $scope.$emit('ac.acDraw.toggleObs');
                };

                $scope.toggleDate = function(filter){
                  $scope.expanded = !$scope.expanded;
                  $scope.$emit('ac.acDraw.toggleDate', filter);
                }
            }
        };
    });
