'use strict';

describe("acComponents.services.acImageCache", function() {
    var $httpBackend, acImageCache;

    beforeEach(module('acComponents.services'));

    beforeEach(inject(function(_$httpBackend_, _acImageCache_) {
        $httpBackend = _$httpBackend_;
        acImageCache = _acImageCache_;
    }));

    it("caches one image", function () {
        $httpBackend.expectGET('/image1.png').respond(200, '');
        
        acImageCache.cache(['/image1.png']);

        $httpBackend.flush();
    });

    it("caches four images", function () {
        $httpBackend.expectGET('/image1.png').respond(200, '');
        $httpBackend.expectGET('/image2.png').respond(200, '');
        $httpBackend.expectGET('/image3.png').respond(200, '');
        $httpBackend.expectGET('/image4.png').respond(200, '');

        acImageCache.cache(['/image1.png', '/image2.png', '/image3.png', '/image4.png']);

        $httpBackend.flush();
    });
});