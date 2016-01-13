'use strict';

describe("acComponents.services.acObservation", function() {
    var $httpBackend, acObservation, apiUrl;

    beforeEach(module('acComponents.config'));
    beforeEach(module('acComponents.services'));

    beforeEach(inject(function(_$httpBackend_, _acObservation_, _AC_API_ROOT_URL_) {
        $httpBackend = _$httpBackend_;
        acObservation = _acObservation_;
        apiUrl = _AC_API_ROOT_URL_;
    }));

    it("passes the period as a query param", function () {
        $httpBackend.expectGET(apiUrl+'/api/min/observations?client=web&last=2:days').respond(200, '');

        acObservation.byPeriod('2:days');

        $httpBackend.flush();
    });
});
