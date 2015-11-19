'use strict';

describe("acComponents.services.acForecast", function() {
    var $httpBackend, acForecast, apiUrl;

    beforeEach(module('acComponents.config'));
    beforeEach(module('acComponents.services'));

    beforeEach(inject(function(_$httpBackend_, _acForecast_, _AC_API_ROOT_URL_) {
        $httpBackend = _$httpBackend_;
        acForecast = _acForecast_;
        apiUrl = _AC_API_ROOT_URL_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    describe("fetch", function() {

        it("requests forecasts by relative path", function () {
            $httpBackend.expectGET(apiUrl+'/api/forecasts').respond(200, {});
            acForecast.fetch();
            $httpBackend.flush();
        });

        it("caches forecasts after first fetch", function () {
            $httpBackend.expectGET(apiUrl+'/api/forecasts').respond(200, {});
            acForecast.fetch();
            $httpBackend.flush();
            acForecast.fetch();
        });

        it("returns a promise", function () {
            $httpBackend.expectGET(apiUrl+'/api/forecasts').respond(200, {});
            var p = acForecast.fetch();
            $httpBackend.flush();

            expect(p).to.have.ownProperty('then');
        });

        it("returns a promise even if forcasts are cached", function () {
            $httpBackend.expectGET(apiUrl+'/api/forecasts').respond(200, {});
            acForecast.fetch();
            $httpBackend.flush();

            var p = acForecast.fetch();
            expect(p).to.have.ownProperty('then');
        });
    });
});
