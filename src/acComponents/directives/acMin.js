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

    .directive('acMin', function(acMinReportData, acReport) {
        return {
            templateUrl: 'min-report.html',
            replace: true,
            link: function(scope, el, attrs) {
                scope.report = {
                    title: '',
                    datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    location: [-40, 83.3],
                    files: [],
                    ridingConditions: angular.copy(acMinReportData.ridingConditions),
                    avalancheConditions: angular.copy(acMinReportData.avalancheConditions),
                    narrative: ''
                };

                scope.submitReport = function() {
                    console.log('report submitting..');
                    //validate the form data
                    acReport.prepareData(scope.report)
                        .then(acReport.sendReport)
                        .then(function(result) {
                            console.log('submission: ' + result.data.subid);
                        });
                };

            }
        };
    });
