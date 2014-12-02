angular.module('acComponents.directives')
    .directive('fileModel', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    })
    .directive('acMin', function($timeout, acQuickReportData, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store) {
        return {
            templateUrl: 'submission-form.html',
            replace: true,
            link: function($scope, el, attrs) {
                $scope.report = {
                    title: 'auto: Quick Report',
                    datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    latlng: [],
                    files: [],
                    ridingConditions: angular.copy(acQuickReportData.ridingConditions),
                    avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
                    comment: ''
                };

                $scope.addSubmission = function() {
                    $('#myModal').modal('show');
                };

                $scope.submit = function() {
                    var token = store.get('token');
                    if(token) {
                        acSubmission.submit($scope.report, token).then(function(result) {
                            if (result.data) {
                                console.log('submission: ' + result.data.subid);
                            }
                        });
                    }
                };
            }
        };
    });
