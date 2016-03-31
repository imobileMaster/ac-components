angular.module('acComponents.directives')
    .directive('acHotZoneMini', function ($state, $stateParams, acHotZoneReportData) {
        return {
            templateUrl: 'hot-zone-mini.html',
            scope: {
              hotZone: '=acHotZone',
              region: '=acRegion'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');

                angular.extend($scope, {
                    infoSummary: acHotZoneReportData.staticInfo.infoSummary,
                    noDataSummary: acHotZoneReportData.staticInfo.noDataSummary,
                    formatDate: function (date) {
                        if (date) {
                            return new Date(date);
                        }
                        return date;
                    },
                    viewFullPage: function (id) {
                        $state.go('ac.hzr', { subid:id });
                    },
                    closeDrawer: function () {
                        $scope.hotZone = null;
                        if($stateParams.regionid) {
                            $state.go('ac.map');
                        }
                    }
                });
            }
        };
    });
;
