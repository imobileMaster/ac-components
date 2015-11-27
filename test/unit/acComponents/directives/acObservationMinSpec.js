'use strict';

describe("acComponents.directives.acObservationMin", function() {
    var element, scope, $compile, acReportData, acConfig, $stateParams, $state, vm;
    var mockSub = {"subid":"abc69863-1c25-4e7b-b384-aa2a4e60f878","latlng":[52.64306343665892,-116.49902343749999],"datetime":"2015-11-19T19:22:00+02:00","uploads":["2015/11/19/cf0ea510-55dd-4792-b720-2bd869630c68.jpeg","2015/11/19/7270c151-bb92-4ce1-95a6-14a0bdff8be0.jpeg","2015/11/19/240a7d14-07f9-468f-b2bd-d4fa2dce5b56.jpeg"],"user":"iulian.gioada","title":"auto: Quick Report","obs":[{"obtype":"weather","obid":"1d2d41eb-49fc-426c-a4e3-589205264620","shareUrl":"http://avalanche.ca/share/auto-quick-report/1d2d41eb-49fc-426c-a4e3-589205264620","ob":{"snowfallRate":null,"newSnow24Hours":null,"windDirection":null,"stormStartDate":null,"minTemp":null,"precipitationType":null,"temperature":null,"weatherObsComment":null,"maxTemp":null,"windSpeed":null,"rainfallRate":null,"precipitation24Hours":null,"skyCondition":{"Scattered clouds (2/8-4/8)":true,"Broken clouds (5/8-7/8)":false,"Overcast (8/8)":false,"Few clouds (<2/8)":true,"Clear":false,"Fog":false},"stormSnowAmount":null,"temperatureTrend":null,"tempLatlng":"52.64306343665892,-116.49902343749999"}},{"obtype":"snowpack","obid":"b86ffd22-7cb0-4256-96ea-239660fe5ec5","shareUrl":"http://avalanche.ca/share/auto-quick-report/b86ffd22-7cb0-4256-96ea-239660fe5ec5","ob":{"snowpackWhumpfingObserved":"Yes","snowpackTestInitiation":"Easy","snowpackFootPenetration":null,"snowpackSiteAspect":"SW","snowpackSledPenetration":null,"snowpackSiteElevationBand":"Treeline","snowpackObsType":"Point Observation","snowpackSiteElevation":null,"snowpackTestFracture":"Sudden (\"Pop\" or \"Drop\")","snowpackTestFailure":null,"snowpackSurfaceCondition":{"New Snow":false,"Variable":false,"Surface Hoar":false,"Corn":false,"Facets":false,"Crust":false},"snowpackCrackingObserved":"No","snowpackSkiPenetration":null,"snowpackDepth":null,"tempLatlng":"52.64306343665892,-116.49902343749999","snowpackObsComment":null}},{"obtype":"avalanche","obid":"6ce528ed-65d2-4430-8930-2e42ab667bf0","shareUrl":"http://avalanche.ca/share/auto-quick-report/6ce528ed-65d2-4430-8930-2e42ab667bf0","ob":{"windExposure":null,"runoutZoneElevation":null,"weakLayerCrystalType":{"Surface hoar and facets":false,"Depth hoar":false,"Surface hoar":false,"Storm snow":false,"Facets":false},"avalancheSize":"3.5","avalancheCharacter":{"Cornice with slab":false,"Persistent slab":false,"Wet slab":false,"Storm slab":false,"Deep persistent slab":false,"Loose dry":false,"Cornice only":true,"Loose wet":false},"avalancheObsComment":null,"slabWidth":null,"crustNearWeakLayer":null,"runLength":null,"avalancheNumber":"51-100","startZoneAspect":null,"startZoneElevationBand":null,"startZoneElevation":null,"slabThickness":null,"startZoneIncline":null,"triggerSubtype":null,"triggerDistance":null,"tempLatlng":"52.64306343665892,-116.49902343749999","triggerType":"Snowmobile","avalancheOccurrenceEpoch":null,"vegetationCover":null}},{"obtype":"quick","obid":"5c67c0ef-0a59-41e1-8efb-c24b386581f2","shareUrl":"http://avalanche.ca/share/auto-quick-report/5c67c0ef-0a59-41e1-8efb-c24b386581f2","ob":{"avalancheConditions":{"sound":false,"snow":false,"slab":false,"temp":false},"ridingConditions":{"snowConditions":{"prompt":"Snow conditions were:","type":"multiple","options":{"Wet":false,"Powder":false,"Wind affected":true,"Hard":false,"Crusty":false,"Heavy":false,"Deep powder":false}},"ridingQuality":{"selected":"Amazing","prompt":"Riding quality was:","type":"single","options":["Amazing","Good","OK","Terrible"]},"stayedAway":{"prompt":"We stayed away from:","type":"multiple","options":{"Alpine slopes":false,"Cut-blocks":false,"Sunny slopes":false,"Convex slopes":false,"Open trees":false,"Steep slopes":false}},"rideType":{"prompt":"We rode:","type":"multiple","options":{"Alpine slopes":false,"Dense trees":false,"Cut-blocks":false,"Sunny slopes":false,"Convex slopes":false,"Open trees":false,"Mellow slopes":false,"Steep slopes":false}},"weather":{"prompt":"The day was:","type":"multiple","options":{"Wet":false,"Stormy":false,"Cold":false,"Cloudy":false,"Sunny":false,"Foggy":false,"Warm":false,"Windy":false}}},"tempLatlng":"52.64306343665892,-116.49902343749999","comment":null}}],"shareUrl":"http://avalanche-canada-min.elasticbeanstalk.com/share/auto-quick-report/abc69863-1c25-4e7b-b384-aa2a4e60f878","thumbs":["http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/cf0ea510-55dd-4792-b720-2bd869630c68.jpeg","http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/7270c151-bb92-4ce1-95a6-14a0bdff8be0.jpeg","http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/240a7d14-07f9-468f-b2bd-d4fa2dce5b56.jpeg"],"dateFormatted":"Nov 19th, 2015 at 17:22 UTC"};

    beforeEach(module('acComponents.directives'));
    beforeEach(module('acComponents.templates'));
    beforeEach(module('acComponents.services'));
    beforeEach(module('acComponents.controllers'));
    beforeEach(module('acComponents.config'));
    beforeEach(module('acComponents.filters'));

    beforeEach(module(function($provide){
        $provide.service('$stateParams', function (){
          return { subid: '12345'};
        });

        $provide.service('$state', function (){
          return { go: function (route, params){return {route: route, params: params};}}
        });
    }));


    beforeEach(inject(function(_$compile_, $rootScope, _acReportData_, _acConfig_) {
        scope = $rootScope;
        $compile = _$compile_;
        acReportData = _acReportData_;
        acConfig = _acConfig_;
    }));

    beforeEach(function (){
      element = angular.element('<div ac-observation-min></div>');
      var isolateScope = $compile(element)(scope);
      scope.$digest();
      vm = isolateScope.isolateScope();
      vm.sub = mockSub;
    });

    it("should init scope", function () {
      expect(vm).to.be.defined;
      expect(vm.changeTab).to.be.defined;
      expect(vm.closeDrawer).to.be.defined;
      expect(vm.viewFullPage).to.be.defined;
      expect(vm.reportTypes).to.have.length(5);
      expect(vm.activeTab).to.be.empty;
    });

    it("hasReport('quick') is completed", function () {
      var tab = vm.hasReport('quick');
      expect(tab).to.equals('completed');
    });

    it("hasReport('incident') is disabled", function () {
      var tab = vm.hasReport('incident');
      expect(tab).to.equals('disabled');
    });

    it("changeTab('quick') to set requested tab to quick ", function () {
      vm.changeTab('quick');
      expect(vm.sub.requested).to.equal('quick');
      expect(vm.activeTab).not.to.be.empty;
    });
    it("changeTab('weather') activeTab not to be empty ", function () {
      vm.changeTab('weather');
      expect(vm.activeTab).not.to.be.empty;
    });

    it("changeTab('incident') to return ", function () {
      var disabled = vm.changeTab('incident');
      expect(disabled).to.not.be.undefined;
    });

    it("when closing drawer should empty sub object ", function () {
      vm.closeDrawer();
      expect(vm.sub).to.be.null;
    });

});
