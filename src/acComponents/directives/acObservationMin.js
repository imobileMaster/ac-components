angular.module('acComponents.directives')
  .directive('acObservationMin', function (acAvalancheReportData) {
    return {
      templateUrl: 'min-observation-drawer.html',
      scope: {
        sub: '=observation',
        sponsor: '=sponsor'
      },
      link: function (scope, el, attrs) {
        el.addClass('ac-observation-drawer');
        var avalancheObject = acAvalancheReportData;
        console.log(scope.sub);

        scope.reportTypes = ['quick', 'avalanche', 'snowpack', 'weather', 'incident'];
        scope.closeDrawer = closeDrawer;
        scope.formatContent = formatContent;


        function closeDrawer() {
          scope.sub = null;
        }

        function formatContent(content){
          console.log(content);
        }
      }
    };
  });
