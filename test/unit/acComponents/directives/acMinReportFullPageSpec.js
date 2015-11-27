'use strict';

describe("acComponents.directives.acMinReportFullPage", function() {
  var element, scope, $compile, acReportData, vm;
  var mockSub = {"subid":"abc69863-1c25-4e7b-b384-aa2a4e60f878","latlng":[52.64306343665892,-116.49902343749999],"datetime":"2015-11-19T19:22:00+02:00","uploads":["2015/11/19/cf0ea510-55dd-4792-b720-2bd869630c68.jpeg","2015/11/19/7270c151-bb92-4ce1-95a6-14a0bdff8be0.jpeg","2015/11/19/240a7d14-07f9-468f-b2bd-d4fa2dce5b56.jpeg"],"user":"iulian.gioada","title":"auto: Quick Report","obs":[{"obtype":"weather","obid":"1d2d41eb-49fc-426c-a4e3-589205264620","shareUrl":"http://avalanche.ca/share/auto-quick-report/1d2d41eb-49fc-426c-a4e3-589205264620","ob":{"snowfallRate":null,"newSnow24Hours":null,"windDirection":null,"stormStartDate":null,"minTemp":null,"precipitationType":null,"temperature":null,"weatherObsComment":null,"maxTemp":null,"windSpeed":null,"rainfallRate":null,"precipitation24Hours":null,"skyCondition":{"Scattered clouds (2/8-4/8)":true,"Broken clouds (5/8-7/8)":false,"Overcast (8/8)":false,"Few clouds (<2/8)":true,"Clear":false,"Fog":false},"stormSnowAmount":null,"temperatureTrend":null,"tempLatlng":"52.64306343665892,-116.49902343749999"}},{"obtype":"snowpack","obid":"b86ffd22-7cb0-4256-96ea-239660fe5ec5","shareUrl":"http://avalanche.ca/share/auto-quick-report/b86ffd22-7cb0-4256-96ea-239660fe5ec5","ob":{"snowpackWhumpfingObserved":"Yes","snowpackTestInitiation":"Easy","snowpackFootPenetration":null,"snowpackSiteAspect":"SW","snowpackSledPenetration":null,"snowpackSiteElevationBand":"Treeline","snowpackObsType":"Point Observation","snowpackSiteElevation":null,"snowpackTestFracture":"Sudden (\"Pop\" or \"Drop\")","snowpackTestFailure":null,"snowpackSurfaceCondition":{"New Snow":false,"Variable":false,"Surface Hoar":false,"Corn":false,"Facets":false,"Crust":false},"snowpackCrackingObserved":"No","snowpackSkiPenetration":null,"snowpackDepth":null,"tempLatlng":"52.64306343665892,-116.49902343749999","snowpackObsComment":null}},{"obtype":"avalanche","obid":"6ce528ed-65d2-4430-8930-2e42ab667bf0","shareUrl":"http://avalanche.ca/share/auto-quick-report/6ce528ed-65d2-4430-8930-2e42ab667bf0","ob":{"windExposure":null,"runoutZoneElevation":null,"weakLayerCrystalType":{"Surface hoar and facets":false,"Depth hoar":false,"Surface hoar":false,"Storm snow":false,"Facets":false},"avalancheSize":"3.5","avalancheCharacter":{"Cornice with slab":false,"Persistent slab":false,"Wet slab":false,"Storm slab":false,"Deep persistent slab":false,"Loose dry":false,"Cornice only":true,"Loose wet":false},"avalancheObsComment":null,"slabWidth":null,"crustNearWeakLayer":null,"runLength":null,"avalancheNumber":"51-100","startZoneAspect":null,"startZoneElevationBand":null,"startZoneElevation":null,"slabThickness":null,"startZoneIncline":null,"triggerSubtype":null,"triggerDistance":null,"tempLatlng":"52.64306343665892,-116.49902343749999","triggerType":"Snowmobile","avalancheOccurrenceEpoch":null,"vegetationCover":null}},{"obtype":"quick","obid":"5c67c0ef-0a59-41e1-8efb-c24b386581f2","shareUrl":"http://avalanche.ca/share/auto-quick-report/5c67c0ef-0a59-41e1-8efb-c24b386581f2","ob":{"avalancheConditions":{"sound":false,"snow":false,"slab":false,"temp":false},"ridingConditions":{"snowConditions":{"prompt":"Snow conditions were:","type":"multiple","options":{"Wet":false,"Powder":false,"Wind affected":true,"Hard":false,"Crusty":false,"Heavy":false,"Deep powder":false}},"ridingQuality":{"selected":"Amazing","prompt":"Riding quality was:","type":"single","options":["Amazing","Good","OK","Terrible"]},"stayedAway":{"prompt":"We stayed away from:","type":"multiple","options":{"Alpine slopes":false,"Cut-blocks":false,"Sunny slopes":false,"Convex slopes":false,"Open trees":false,"Steep slopes":false}},"rideType":{"prompt":"We rode:","type":"multiple","options":{"Alpine slopes":false,"Dense trees":false,"Cut-blocks":false,"Sunny slopes":false,"Convex slopes":false,"Open trees":false,"Mellow slopes":false,"Steep slopes":false}},"weather":{"prompt":"The day was:","type":"multiple","options":{"Wet":false,"Stormy":false,"Cold":false,"Cloudy":false,"Sunny":false,"Foggy":false,"Warm":false,"Windy":false}}},"tempLatlng":"52.64306343665892,-116.49902343749999","comment":null}}],"shareUrl":"http://avalanche-canada-min.elasticbeanstalk.com/share/auto-quick-report/abc69863-1c25-4e7b-b384-aa2a4e60f878","thumbs":["http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/cf0ea510-55dd-4792-b720-2bd869630c68.jpeg","http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/7270c151-bb92-4ce1-95a6-14a0bdff8be0.jpeg","http://avalanche-canada-min.elasticbeanstalk.com/api/min/uploads/2015/11/19/240a7d14-07f9-468f-b2bd-d4fa2dce5b56.jpeg"],"dateFormatted":"Nov 19th, 2015 at 17:22 UTC"};

  beforeEach(module('acComponents.directives'));
  beforeEach(module('acComponents.templates'));
  beforeEach(module('acComponents.services'));
  beforeEach(module('acComponents.controllers'));
  beforeEach(module('acComponents.config'));
  beforeEach(module('acComponents.filters'));


  beforeEach(inject(function(_$compile_, $rootScope, _acReportData_) {
    scope = $rootScope;
    $compile = _$compile_;
    acReportData = _acReportData_;
  }));

  beforeEach(function (){
    scope.sub = mockSub;
    element = angular.element('<div ac-min-report-full-page report="sub"></div>');
    var isolateScope = $compile(element)(scope);
    scope.$digest();
    vm = isolateScope.isolateScope();
  });

  it("should init scope", function () {
    expect(vm).to.be.defined;
    expect(vm.print).to.be.defined;
  });

  it("on init, load report with 4 observations", function () {
    expect(vm.activeReports).to.have.length(4);
  });

});
