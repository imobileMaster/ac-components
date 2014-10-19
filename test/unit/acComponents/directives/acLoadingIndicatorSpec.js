'use strict';

describe("acComponents.directives.acLoadingIndicator", function() {
    var element, scope, $compile;
 
    beforeEach(module('acComponents.directives'));
    beforeEach(module('acComponents.templates'));
 
    beforeEach(inject(function(_$compile_, $rootScope) {
        scope = $rootScope;
        $compile = _$compile_;
    }));
    
    it("has a class of ac-loading-indicator", function () {
        element = angular.element('<div ac-loading-indicator></dv>');
        $compile(element)(scope);
        scope.$digest();

        expect(element).to.have.class('ac-loading-indicator');
    });

    it("has 5 child div", function () {
        element = angular.element('<div ac-loading-indicator></dv>');
        $compile(element)(scope);
        scope.$digest();
        var rects = element.find('div');

        expect(rects.length).to.be.equal(5);
    });

    it("has 5 child div with class rect[i]", function () {
        element = angular.element('<div ac-loading-indicator></dv>');
        $compile(element)(scope);
        scope.$digest();
        var rects = element.find('div');

        expect(rects.eq(0)).to.have.class('rect1');
        expect(rects.eq(1)).to.have.class('rect2');
        expect(rects.eq(2)).to.have.class('rect3');
        expect(rects.eq(3)).to.have.class('rect4');
        expect(rects.eq(4)).to.have.class('rect5');
    });
});