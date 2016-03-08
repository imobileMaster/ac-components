angular.module('acComponents.directives')
    .directive('acHotZoneReportForm', function($state, $rootScope, $q, $timeout, acBreakpoint, acReportData, acFormUtils, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store, $anchorScroll, $modal, ngToast) {
        return {
            templateUrl: 'hot-zone-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {

                resetFields();
                initReport();

                $scope.scrollToTop = function () {
                  $anchorScroll.yOffset = 100;
                  $anchorScroll('top');
                };

                function tabCompleted (tab) {
                  if (tab === 'quickReport') {
                    return acReportData.quick.isCompleted($scope.report.obs.quickReport);
                  } else {
                    return $scope.report.obs[tab].isCompleted();
                  }
                }

                function initReport() {
                  $scope.report = {
                    headline: '',
                    dateissue: moment().format('YYYY-MM-DD hh:mm A'),
                    datevalid: moment().format('YYYY-MM-DD hh:mm A'),
                    latlng: [],
                    files: [],
                    obs: {
                      criticalFactors: angular.copy(acReportData.hotzone.criticalFactors),
                      terrainAvoidanceList: angular.copy(acReportData.hotzone.terrainAvoidanceList),
                      travelAdvice: angular.copy(acReportData.hotzone.travelAdvice)
                    }
                  };
                }

                function resetForm() {
                    $timeout(function () {
                        resetFields();
                        initReport();
                        $scope.submitting = false;
                        $scope.error = false;
                    }, 0);
                }

                function resetFields() {
                  acReportData.hotzone.criticalFactors.reset();
                  acReportData.hotzone.terrainAvoidanceList.reset();
                  acReportData.hotzone.travelAdvice.reset();
                }

                $scope.resetForm = resetForm;

                $scope.goBack = function (formDirty) {

                  //if (formDirty) {
                  //  var goingBack = shouldDiscard();
                  //  goingBack.then(exit);
                  //} else {
                  //  exit();
                  //}
                  //
                  //function exit() {
                      resetFields();
                      initReport();
                      $state.go('ac.map');
                  //}
                };

                $scope.submitForm = function() {

                    // var reqObj = _.cloneDeep($scope.report);

                    // reqObj.obs = _.reduce($scope.report.obs, function(total, item, key){
                    //     if (key === 'quickReport') {
                    //       if (acReportData.quick.isCompleted(item)) {
                    //         total.quickReport = item;
                    //       }
                    //     } else if (item.isCompleted()){
                    //       total[key] = item.getDTO();
                    //     }
                    //     return total;
                    // }, {});

                    // //if (_.keys(reqObj.obs).length === 0) {
                    // //  return $q.reject('incomplete-form');
                    // //}

                    // var token = store.get('token');
                    // if (token) {
                    //     $scope.submitting = true;
                    //     return acSubmission.submit(reqObj, token).then(function(result) {
                    //         if (result.data && !('error' in result.data)) {
                    //             $state.go('ac.map');
                    //             ngToast.create({
                    //               content: 'Your report was successfully submitted.',
                    //               class: 'alert alert-success',
                    //               dismissOnTimeout: true,
                    //               dismissButton: true,
                    //               dismissButtonHtml: '&times;'
                    //             });


                    //             return result;
                    //         } else {
                    //             $scope.submitting = false;
                    //             $scope.error = true;
                    //             return $q.reject('error');
                    //         }
                    //     }, function(err) {
                    //         $scope.submitting = false;
                    //         $scope.error = true;
                    //         $scope.errormsg = err;
                    //         return $q.reject(err);
                    //     });
                    // } else {
                    //     return $q.reject('auth-error');
                    // }
                };


                function shouldDiscard() {
                  var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'min-back-modal.html',
                    controller: 'acBackModal',
                    size: 'lg',
                    windowClass: 'back-modal',
                    keyboard: false,
                    backdrop: 'static'
                  });

                  return modalInstance.result;
                }


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
