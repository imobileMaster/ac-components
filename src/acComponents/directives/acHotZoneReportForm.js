angular.module('acComponents.directives')
    .directive('acHotZoneReportForm', function($state, $rootScope, $q, $timeout, acBreakpoint, acReportData, acFormUtils, acHZRSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store, $anchorScroll, $modal, ngToast) {
        return {
            templateUrl: 'hot-zone-report-form.html',
            replace: true,
            scope: {
                hotZones: '=acHotZones'
            },
            link: function($scope, el, attrs) {

                resetFields();
                initReport();

                $scope.scrollToTop = function () {
                  $anchorScroll.yOffset = 100;
                  $anchorScroll('top');
                };

                function initReport() {
                  $scope.report = {
                    headline: '',
                    dateissued: moment().format('YYYY-MM-DD hh:mm A'),
                    datevalid: moment().format('YYYY-MM-DD hh:mm A'),
                    hotzoneid: null,
                    files: [],
                    data: {
                      criticalFactors: acReportData.hotzone.criticalFactors,
                      alpineTerrainAvoidance: acReportData.hotzone.alpineTerrainAvoidance,
                      treelineTerrainAvoidance: acReportData.hotzone.treelineTerrainAvoidance,
                      belowTreelineTerrainAvoidance: acReportData.hotzone.belowTreelineTerrainAvoidance
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
                  acReportData.hotzone.alpineTerrainAvoidance.reset();
                  acReportData.hotzone.treelineTerrainAvoidance.reset();
                  acReportData.hotzone.belowTreelineTerrainAvoidance.reset();
                }

                $scope.resetForm = resetForm;

                $scope.goBack = function (formDirty) {
                      resetFields();
                      initReport();
                      $state.go('ac.map');
                };

                $scope.submitForm = function() {
                    if (!$scope.report.hotzoneid) {
                        $scope.invalidLocation = true;
                        return;
                    }

                    var reqObj = _.cloneDeep($scope.report);

                    reqObj.data = _.reduce($scope.report.data, function(total, item, key){
                        if (item.isCompleted()){
                          total[key] = item.getDTO();
                        }
                        return total;
                    }, {});

                    var token = store.get('token');
                    if (token) {
                        $scope.submitting = true;
                        return acHZRSubmission.submit(reqObj, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $state.go('ac.map');
                                ngToast.create({
                                  content: 'Your report was successfully submitted.',
                                  class: 'alert alert-success',
                                  dismissOnTimeout: true,
                                  dismissButton: true,
                                  dismissButtonHtml: '&times;'
                                });


                                return result;
                            } else {
                                $scope.submitting = false;
                                $scope.error = true;
                                return $q.reject('error');
                            }
                        }, function(err) {
                            $scope.submitting = false;
                            $scope.error = true;
                            $scope.errormsg = err;
                            return $q.reject(err);
                        });
                    } else {
                        return $q.reject('auth-error');
                    }
                };

            }
        };
    });
