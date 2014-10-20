'use strict';

describe("acComponents.services.acObservation", function() {
    var $httpBackend, acObservation;

    beforeEach(module('acComponents.services'));

    beforeEach(inject(function(_$httpBackend_, _acObservation_) {
        $httpBackend = _$httpBackend_;
        acObservation = _acObservation_;
    }));

    it("passes the period as a query param", function () {
        $httpBackend.expectGET('api/observations?period=2:days').respond(200, '');
        
        acObservation.byPeriod('2:days');

        $httpBackend.flush();
    });
});