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
                    $timeout(function () {
                        for (var field in $scope.report) {
                            if(field in reportTemplate) {
                                if(field === 'ridingConditions' || field === 'avalancheConditions'){
                                    $scope.report[field] = angular.copy(reportTemplate[field]);
                                } else {
                                    $scope.report[field] = reportTemplate[field];
                                }
                            }
                        }
                        delete $scope.report.subid;
                    }, 0);
                }

                $scope.resetForm = resetForm;

                $scope.submitForm = function() {
                    var token = store.get('token');
                    if(token) {
                        $scope.minsubmitting = true;
                        acSubmission.submit($scope.report, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $scope.minsubmitting = false;
                                $scope.report.subid = result.data.subid;
                                console.log('submission: ' + result.data.subid);
                            } else {
                                $scope.minsubmitting = false;
                                $scope.minerror = true;
                            }
                        }, function () {
                            $scope.minsubmitting = false;
                            $scope.minerror = true;
                        });
                    }
                };
            }
        };
    });
