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
    .directive('acMinReportForm', function($state, $q, $timeout, acBreakpoint, acQuickReportData, acAvalancheReportData, acIncidentReportData, acSnowpackReportData, acWeatherReportData, acFormUtils, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store, $anchorScroll, $modal) {
        return {
            templateUrl: 'min-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {

                var submissionGuidelinesLink = 'http://www.avalanche.ca/fxresources/Submissions+Guidelines.pdf';

                initReport();

                $scope.additionalFields = {
                  avalancheReport : {
                    name: 'Avalanche',
                    text: 'Share information about a single, notable avalanche or tell us about overall avalanche conditions by describing many avalanches in a general sense. Aspect, elevation, trigger, dimensions/size are key data.'
                  },
                  snowpackReport : {
                    name: 'Snowpack',
                    text: 'Snowpack depth, layering, and bonding are key data. Test results are very useful.'
                  },
                  weatherReport : {
                    name: 'Weather',
                    text: 'Key data includes information about current and accumulated precipitation, wind speed and direction, temperatures, and cloud cover.'
                  },
                  incidentReport : {
                    name: 'Incident',
                    text: 'Sharing incidents can help us all learn. Describe close calls and accidents here. Be sensitive to the privacy of others. Before reporting serious accidents check our <a href="'+submissionGuidelinesLink+'" target="_blank">submission guidelines</a>.'
                  }
                };

                $scope.atleastOneTabCompleted = false;

                $scope.getTabExtraClasses = function (tab) {
                  var completed = tabCompleted(tab);

                  $scope.atleastOneTabCompleted = $scope.atleastOneTabCompleted || completed;

                  return {
                    completed: completed
                  }
                };

                $scope.scrollToTop = function () {
                  $anchorScroll.yOffset = 100;
                  $anchorScroll('top');
                };

                function tabCompleted (tab) {
                  if (tab === 'quickReport') {
                    return acQuickReportData.isCompleted($scope.report.obs.quickReport);
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

                $scope.goBack = function () {
                  resetForm();
                  $state.go('ac.map');
                };

                $scope.submitForm = function() {

                    var reqObj = _.cloneDeep($scope.report);

                    reqObj.obs = _.reduce($scope.report.obs, function(total, item, key){
                        if (key === 'quickReport') {
                          if (acQuickReportData.isCompleted(item)) {
                            total.quickReport = item;
                          }
                        } else if (item.isCompleted()){
                          total[key] = item.getDTO();
                        }
                        return total;
                    }, {});

                    if (_.keys(reqObj.obs).length === 0) {
                      return $q.reject('incomplete-form');
                    }

                    //console.log('to be sent: ', reqObj.obs);
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

                $scope.openMapModal = function () {
                  var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'min-map-modal.html',
                    controller: 'acMapModal',
                    size: 'lg',
                    windowClass: 'map-modal',
                    resolve: {
                      latlng: function () {
                        return $scope.report.latlng
                      }
                    }
                  });

                  modalInstance.result.then(function (latlng) {
                    $scope.report.latlng = latlng;
                  });
                };

                var watch = $scope.$watchCollection(function () { return [$scope.report.latlng, $scope.report.tempLatlng]; }, function (newVal, oldVal) {
                  if (newVal) {
                    if (newVal[0] !== oldVal[0]) {
                      $scope.report.tempLatlng = $scope.report.latlng.join(',');
                      newVal[1] = $scope.report.tempLatlng;
                      $scope.tempLatlngModified = false;
                    }
                    if (newVal[1] && newVal[1] !== newVal[0].join(',')) {
                      $scope.tempLatlngModified = true;
                    }
                  }
                });

                $scope.$on('$destroy', function () {
                  watch();
                });

                $scope.saveLocation = function () {
                  if (acFormUtils.validateLocationString($scope.report.tempLatlng)) {
                    $scope.report.latlng = $scope.report.tempLatlng.split(',');
                    $scope.tempLatlngModified = false;
                    $scope.invalidLatLng = false;
                  } else {
                    $scope.invalidLatLng = true;
                  }
                };
            }
        };
    });
