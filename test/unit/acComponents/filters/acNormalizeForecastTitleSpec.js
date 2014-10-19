'use strict';

describe("acComponents.filters.acNormalizeForecastTitle", function() {
    var $filter;

    beforeEach(module('acComponents.filters'));

    beforeEach(inject(function(_$filter_) {
        $filter = _$filter_;
    }));

    it("removes 'Avalanche Forecast - ' from string", function () {
        var normalize = $filter('acNormalizeForecastTitle');

        expect(normalize('Avalanche Forecast - for Mars')).to.be.equal('for Mars');
    });

    it("removes 'Avalanche Bulletin - ' from string", function () {
        var normalize = $filter('acNormalizeForecastTitle');

        expect(normalize('Avalanche Bulletin - for Atlantis')).to.be.equal('for Atlantis');
    });

    it("leaves strings without Avalanche Forecast and Avalanche Bulletin other alone", function () {
        var normalize = $filter('acNormalizeForecastTitle');

        expect(normalize('for Atlantis')).to.be.equal('for Atlantis');
    });
});