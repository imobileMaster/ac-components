angular.module('acComponents.directives')
    .directive('acHotZoneReportFullPage', function (acHotZoneReportData) {
        return {
            templateUrl: 'hot-zone-report-fullpage.html',
            scope: {
                report: '=report'
        },
        link: function ($scope, el, attrs) {
            el.addClass('ac-observation-drawer');
            angular.extend($scope, {
                infoSummary: acHotZoneReportData.staticInfo.infoSummary,
                print: function () {
                    window.print();
                },
                formatDate: function (date) {
                    if (date) {
                        return new Date(date);
                    }
                    return date;
                }
            });
        }
    };
});
