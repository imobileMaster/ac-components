angular.module('acComponents.directives')
  .directive('acMinReportFullPage', function (acReportData) {
    return {
      templateUrl: 'min-report-fullpage.html',
      scope: {
        sub: '=report',
        sponsor: '=sponsor'
      },
      link: function (scope, el, attrs) {
        el.addClass('ac-observation-drawer');

        scope.print = print;
        scope.activeReports = [];

        processReportInfo();

        function processReportInfo() {
          scope.activeReports = _.reduce(scope.sub.obs, function (results, item, key){
                results.push({
                  obtype: item.obtype,
                  ob: acReportData[item.obtype].mapDisplayResponse(item.ob)
                });
              return results;
          },[]);

          scope.activeReports = _.sortBy(scope.activeReports, function(obj) {
            return ['quick', 'avalanche', 'snowpack', 'weather', 'incident'].indexOf(obj.obtype);
          });

        }

        function print(){
          window.print();
        }

      }
    };
  });
