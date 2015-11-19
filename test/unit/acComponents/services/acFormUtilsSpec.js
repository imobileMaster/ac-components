'use strict';

describe("acComponents.services.acFormUtils", function() {
  var acFormUtils, mockFields;

  beforeEach(module('acComponents.services'));

  beforeEach(inject(function(_acFormUtils_) {
    acFormUtils = _acFormUtils_;
    mockFields = {
      number: {
        type: 'number',
        value: null
      },
      checkbox: {
        type: 'checkbox',
        options: {
          opt1: false,
          opt2: false
        }
      },
      radio: {
        type: 'radio',
        options: ['opt1', 'opt2', 'opt3'],
        value: null
      },
      dropdown: {
        type: 'dropdown',
        options: ['opt1', 'opt2', 'opt3'],
        value: null
      }
    };
  }));

  describe("buildReport", function() {

    xit("should return an object", function () {
      var report = acFormUtils.buildReport(mockFields);

      expect(angular.isObject(report)).to.equal(true);
    });


  });
});
