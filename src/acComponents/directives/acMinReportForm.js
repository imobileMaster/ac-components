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

                initReport();

                $scope.additionalFields = {
                  avalancheReport : {
                    name: 'Avalanche',
                    text: 'Add Avalanche information, then build a comprehensive report by filling out details on other observation tabs: Snow, Weather and Incident.'
                  },
                  snowpackReport : {
                    name: 'Snow',
                    text: 'Add Snow information, then build a comprehensive report by filling out details on other observation tabs: Avalanche, Weather and Incident.'
                  },
                  weatherReport : {
                    name: 'Weather',
                    text: 'Add Weather information, then build a comprehensive report by filling out details on other observation tabs: Snow, Weather and Incident.'
                  },
                  incidentReport : {
                    name: 'Incident',
                    text: 'Add Incident information, then build a comprehensive report by filling out details on other observation tabs: Avalanche, Snow and Weather.'
                  }
                };

                $scope.getTabExtraClasses = function (tab) {
                  return {
                    completed: tabCompleted(tab)
                  }
                };

                function tabCompleted (tab) {
                  if (tab === 'quickReport') {
                    return acQuickReportData.isCompleted();
                  } else {
                    return $scope.report.obs[tab].isCompleted();
                  }
                }

                function initReport() {
                  $scope.report = {
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
                }

                function resetForm() {
                    $timeout(function () {
                        resetFields();
                        initReport();
                        $scope.minsubmitting = false;
                        $scope.minerror = false;
                    }, 0);
                }

                function resetFields() {
                  acAvalancheReportData.reset();
                  acIncidentReportData.reset();
                  acSnowpackReportData.reset();
                  acWeatherReportData.reset();
                }

                $scope.resetForm = resetForm;

                $scope.submitForm = function() {

                    var reqObj = _.cloneDeep($scope.report);


                    reqObj.obs = _.reduce($scope.report.obs, function(total, item, key){
                        if (key === 'quickReport') {
                          total.quickReport = angular.copy(item);
                        } else if (item.isCompleted()){
                          total[key] = item.getDTO();
                        }
                        return total;
                    }, {});

                    console.log('to be sent: ', reqObj.obs);
//return;
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
