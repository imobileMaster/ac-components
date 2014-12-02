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
    .directive('acMinReportForm', function($timeout, acQuickReportData, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store) {
        return {
            templateUrl: 'min-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {
                var reportTemplate = {
                    title: 'auto: Quick Report',
                    datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    latlng: [],
                    files: [],
                    ridingConditions: angular.copy(acQuickReportData.ridingConditions),
                    avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
                    comment: null
                };
                $scope.report = angular.copy(reportTemplate);

                function resetForm() {
                    for (var field in $scope.report) {
                        if(field in reportTemplate) {
                            $scope.report[field] = angular.copy(reportTemplate[field]);
                        } else {
                            $scope.report[field] = null;
                        }
                    }
                }

                $scope.resetForm = resetForm;

                $scope.submitForm = function() {
                    var token = store.get('token');
                    if(token) {
                        acSubmission.submit($scope.report, token).then(function(result) {
                            if (result.data) {
                                $scope.report = result.data;
                                console.log('submission: ' + result.data.subid);
                            }
                        });
                    }
                };
            }
        };
    });
