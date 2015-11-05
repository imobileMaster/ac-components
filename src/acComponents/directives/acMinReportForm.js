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
    .directive('acMinReportForm', function($q, $timeout, acQuickReportData, acAvalancheReportData, acIncidentReportData, acSnowpackReportData, acWeatherReportData, acFormUtils, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store) {
        return {
            templateUrl: 'min-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {

                var reportTemplate = {
                    title: 'auto: Quick Report',
                    datetime: moment().format('YYYY-MM-DD hh:mm A'),
                    latlng: [],
                    files: [],
                    obs: {
                      quickReport: {
                        ridingConditions: angular.copy(acQuickReportData.ridingConditions),
                        avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
                        comment: null
                      },
                      avalancheReport: acAvalancheReportData,
                      incidentReport: acIncidentReportData,
                      snowpackReport: acSnowpackReportData,
                      weatherReport: acWeatherReportData
                    }
                };
                //$scope.report = _.cloneDeep(reportTemplate);

                $scope.report = reportTemplate;

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
                        $scope.minsubmitting = false;
                        $scope.minerror = false;
                    }, 0);
                }

                $scope.resetForm = resetForm;

                $scope.submitForm = function() {

                    var reqObj = _.cloneDeep($scope.report);


                    reqObj.obs = _.reduce($scope.report.obs, function(total, item, key){
                        if (key === 'quickReport') {
                          total.quickReport = angular.copy(item);
                        } else if (key === 'incidentReport') {
                          total.incidentReport = item.getDTO();
                        } else {
                          total[key] = acFormUtils.getDTOForFields(item.fields);
                        }
                        return total;
                    }, {});

                    console.log('to be sent: ', reqObj.obs);

                    var token = store.get('token');
                    if (token) {
                        $scope.minsubmitting = true;
                        return acSubmission.submit(reqObj, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $scope.minsubmitting = false;
                                $scope.report.subid = result.data.subid;
                                $scope.report.shareUrl = result.data.obs[0].shareUrl;
                                console.log('submission: ' + result.data.subid);
                                return result;
                            } else {
                                $scope.minsubmitting = false;
                                $scope.minerror = true;
                                return $q.reject('error');
                            }
                        }, function(err) {
                            $scope.minsubmitting = false;
                            $scope.minerror = true;
                            $scope.minerrormsg = err;
                            return $q.reject(err);
                        });
                    } else {
                        return $q.reject('auth-error');
                    }
                };
            }
        };
    });
