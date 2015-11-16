angular.module('acComponents.directives')
  .directive('acObservationMin', function (acReportData, acConfig) {
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
        }

        function changeTab(tab){
          scope.sub.requested = tab;
          processTabInfo(scope.sub);
        }

        scope.$watch('sub', function(newValue, oldValue){
            if(newValue && newValue !== oldValue){
              processTabInfo(newValue);
            }
        });

        function processTabInfo(newObj){
          var requestedObj = _.filter(newObj.obs, function (ob){
            return newObj.requested === ob.obtype;
          });

          if(newObj.requested === 'quick'){
            requestedObj = _.filter(newObj.obs, function (ob){
              return newObj.requested === ob.obtype;
            });
            scope.activeTab = mapQuickObject(requestedObj[0].ob);
            return;
          }

          scope.activeTab = acReportData[newObj.requested].mapDisplayResponse(requestedObj[0].ob);
        }

        function mapQuickObject(ob){
          var quickTab = [];

          if(ob.avalancheConditions && mapAvalancheConditions(ob.avalancheConditions).length >0){
            quickTab.push({
              prompt: 'Avalanche conditions',
              type:'checkbox',
              order: 2,
              value: mapAvalancheConditions(ob.avalancheConditions)
            });
          }

          _.forEach(ob.ridingConditions, function (item, key){
              if(item.type === 'single' && item.selected){
                if (item.selected){
                  quickTab.push({
                    prompt: item.prompt,
                    type:'radio',
                    order: 1,
                    value: item.selected
                  });
                }
              }

              if(item.type === 'multiple' && item.options){
                _.filter(item.options, function(it, key){
                  if (it){
                    quickTab.push({
                      prompt: item.prompt,
                      type:'radio',
                      order: 1,
                      value: key
                    });
                  }
                });
              }
          });

          return quickTab;
        }

        function mapAvalancheConditions(av){
          var avalanches = [];
          if(av.slab){
            avalanches.push('Slab avalanches today or yesterday.');
          }
          if(av.sound){
            avalanches.push('Whumphing or drum-like sounds or shooting cracks.');
          }
          if(av.snow){
            avalanches.push('30cm + of new snow, or significant drifitng, or rain in the last 48 hours.');
          }
          if(av.temp){
            avalanches.push('Rapid temperature rise to near zero degrees or wet surface snow.');
          }
          return avalanches;
        }

      }
    };
  });
