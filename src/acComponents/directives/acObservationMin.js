angular.module('acComponents.directives')
  .directive('acObservationMin', function (acReportData, acConfig, $stateParams, $state) {
    return {
      templateUrl: 'min-observation-drawer.html',
      scope: {
        sub: '=observation',
        sponsor: '=sponsor'
      },
      link: function (scope, el, attrs) {
        el.addClass('ac-observation-drawer');

        scope.activeTab = {};
        scope.reportTypes = acConfig.reportTypes;
        scope.hasReport = hasReport;
        scope.changeTab = changeTab;
        scope.closeDrawer = closeDrawer;
        scope.viewFullPage = viewFullPage;

        function hasReport(type) {
          if (!scope.sub) return;

          var completedReports = _.reduce(scope.sub.obs, function (list, item) {
            list.push(item.obtype);
            return list;
          }, []);

          if (_.indexOf(completedReports, type) !== -1) {
            return 'completed';
          } else {
            return 'disabled';
          }
        }

        function closeDrawer() {
          scope.sub = null;
          if($stateParams.subid || $stateParams.markerid) {
            $state.go('ac.map', {markerid: null}, {notify:false, reload:false});
          }
        }

        function changeTab(tab) {
          if (hasReport(tab) === 'disabled') {
            return false;
          } else {
            scope.sub.requested = tab;
            processTabInfo(scope.sub);
          }
        }

        scope.$watch('sub', function (newValue, oldValue) {
          if (newValue && newValue.latlng) {
            processTabInfo(newValue);
          }
        });

        function processTabInfo(newObj) {
          newObj.requested = requestedTab(newObj);

          var requestedObj = _.filter(newObj.obs, function (ob) {
            return newObj.requested === ob.obtype;
          });

          if (requestedObj[0].ob) {
            scope.activeTab = acReportData[newObj.requested].mapDisplayResponse(requestedObj[0].ob);
          }
        }

        function requestedTab(newObj){
          if(newObj.requested){
            return newObj.requested;
          } else {
            var requested = null;
            _.forEach(scope.reportTypes, function (item){
              if(_.some(newObj.obs, {obtype:item})){
                requested = item;
                return false;
              }
            });
            return requested;
          }
        }

        function viewFullPage(id){
          var url = $state.href('ac.reports', { subid:id });
          window.open(url, '_blank');
        }

      }
    };
  });
