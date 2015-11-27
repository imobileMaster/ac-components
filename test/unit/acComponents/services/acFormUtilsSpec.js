describe("acComponents.services.acFormUtils", function() {
  var acFormUtils, mockFields;

  beforeEach(module('acComponents.services'));

  beforeEach(inject(function(_acFormUtils_) {
    acFormUtils = _acFormUtils_;
    mockFields = {
      number: {
        type: 'number',
        prompt: 'number',
        order: 1,
        options: {
          min: 0,
          max: 10
        },
        value: null
      },
      checkbox: {
        type: 'checkbox',
        limit: 2,
        prompt: 'checkbox',
        order: 2,
        options: {
          opt1: false,
          opt2: false,
          opt3: false,
          opt4: false
        }
      },
      radio: {
        type: 'radio',
        prompt: 'radio',
        order: 3,
        options: ['opt1', 'opt2', 'opt3'],
        value: null
      },
      dropdown: {
        type: 'dropdown',
        prompt: 'dropdown',
        order: 4,
        options: ['opt1', 'opt2', 'opt3'],
        value: null
      },
      textarea: {
        type: 'textarea',
        prompt: 'textarea',
        value: null,
        order: 5
      },
      datetime: {
        type: 'datetime',
        prompt: 'datetime',
        value: null,
        order: 6
      }
    };
  }));

  describe(".buildReport()", function() {

    var report;

    beforeEach(function () {
      report = acFormUtils.buildReport(mockFields);
    });

    it("should return an object", function () {
      expect(angular.isObject(report)).to.equal(true);
    });

    it("should return an object with the augmented fields", function () {
      _.forEach(report.fields, function (field, key) {
        expect(angular.isObject(mockFields[key])).to.equal(true);
        expect(field).to.have.ownProperty('reset');
        expect(field).to.have.ownProperty('getDTO');
        expect(field).to.have.ownProperty('validate');
        expect(field).to.have.ownProperty('isCompleted');
        expect(field).to.have.ownProperty('getDisplayObject');
      });
    });

    it("should return an object with helper methods", function () {
      expect(report).to.have.ownProperty('reset');
      expect(report).to.have.ownProperty('getDTO');
      expect(report).to.have.ownProperty('validate');
      expect(report).to.have.ownProperty('isCompleted');
      expect(report).to.have.ownProperty('mapDisplayResponse');
    });

    it(".reset() should reset all fields", function () {
      report.fields.checkbox.options.opt1 = true;
      report.fields.textarea.value = "test string";
      report.fields.radio.value = 'opt1';
      report.fields.datetime.value = 'test value';
      report.fields.number.value = 1;

      report.reset();

      _.forEach(report.fields, function (field, key) {
        if (field.type === 'checkbox') {
          expect(field.options).to.equal(mockFields[key].options);
        } else {
          expect(field.value).to.equal(null);
        }
      });
    });

    it(".getDTO() should return object with each field DTO", function () {
      var dtos = report.getDTO();

      _.forEach(mockFields, function (field, key) {
        var fieldDTO = report.fields[key].getDTO();

        expect(dtos[key]).to.eql(fieldDTO);
      });
    });

    it(".validateFields should return an empty object if form is valid", function () {
      report.fields.checkbox.options.opt1 = true;
      report.fields.textarea.value = "test string";
      report.fields.radio.value = 'opt1';
      report.fields.datetime.value = 'test value';
      report.fields.number.value = 1;

      expect(report.validate()).to.eql({});
    });

    it(".validateFields should return an object with keys that have errors", function () {
      report.fields.checkbox.options.opt1 = true;
      report.fields.checkbox.options.opt2 = true;
      report.fields.checkbox.options.opt3 = true;
      report.fields.number.value = -1;

      expect(report.validate()).to.eql({checkbox: true, number: true});
    });

    it(".isCompleted should return true if there is at least one field completed in the any tab", function () {
      report.fields.checkbox.options.opt1 = true;

      expect(report.isCompleted()).to.equal(true);
    });

    it(".isCompleted should return false if there is no field completed in the any tab", function () {
      expect(report.isCompleted()).to.equal(false);
    });

    it(".mapDisplayResponse should return an object with fields display objects", function () {
      var responseData = {
        number: 1,
        checkbox: {
          opt1: true,
          opt2: true,
          opt3: true,
          opt4: true
        },
        radio: 'opt1',
        dropdown: 'opt2',
        textarea: 'test value',
        datetime: '2015-23-11'
      };

      var mergedData = report.mapDisplayResponse(responseData);

      _.forEach(mergedData, function (field) {
          expect(field.prompt).to.equal(report.fields[field.type].prompt);

          if (field.type !== 'checkbox') {
            expect(field.value).to.eql(responseData[field.type]);
          } else {
            expect(field.value).to.eql(Object.keys(responseData[field.type]));
          }
      });

    });

    describe ('checkbox', function () {
      it(".getDTO() should return a list of options as DTO", function () {
        expect(report.fields.checkbox.getDTO()).to.eql(mockFields.checkbox.options);
      });

      it(".validate() should validate by the number of fields checked and the set limit", function () {
        report.fields.checkbox.limit = 2;
        report.fields.checkbox.options.opt1 = true;
        report.fields.checkbox.options.opt2 = true;

        expect(report.fields.checkbox.validate()).to.equal(true);

        report.fields.checkbox.limit = 1;

        expect(report.fields.checkbox.validate()).to.equal(false);
      });

      it(".reset() should reset the options", function () {
        report.fields.checkbox.options.opt2 = true;
        report.fields.checkbox.reset();

        var numberSelected = report.fields.checkbox.getNumberSelected();

        expect(numberSelected).to.equal(0);
      });

      it(".getNumberSelected() should return the number of options selected", function () {
        report.fields.checkbox.options.opt2 = true;

        var numberSelected = report.fields.checkbox.getNumberSelected();

        expect(numberSelected).to.equal(1);
      });

      it(".getDisplayObject() should return a display object", function () {
        var displayObject = report.fields.checkbox.getDisplayObject();

        expect(angular.isObject(displayObject)).to.equal(true);
        expect(displayObject.prompt).to.equal(report.fields.checkbox.prompt);
        expect(displayObject.order).to.equal(report.fields.checkbox.order);
        expect(displayObject.type).to.equal(report.fields.checkbox.type);
      });

    });

    describe ('number', function () {
      it(".getDTO() should return the value", function () {
        var numberFieldValue = 10;
        report.fields.number.value = numberFieldValue;

        expect(report.fields.number.getDTO()).to.equal(numberFieldValue);
      });

      it(".validate() should validate the value based on the min and max interval or null value", function () {
        report.fields.number.value = null;

        expect(report.fields.number.validate()).to.equal(true);

        report.fields.number.value = 10;
        report.fields.number.options.min = 0;
        report.fields.number.options.max = 10;

        expect(report.fields.number.validate()).to.equal(true);

        report.fields.number.value = 11;

        expect(report.fields.number.validate()).to.equal(false);
      });

      it(".reset() should reset the value", function () {
        report.fields.number.value = 10;
        report.fields.number.reset();

        expect(report.fields.number.value).to.equal(null);
      });

      it(".getDisplayObject() should return a display object", function () {
        var displayObject = report.fields.number.getDisplayObject();

        expect(angular.isObject(displayObject)).to.equal(true);
        expect(displayObject.prompt).to.equal(report.fields.number.prompt);
        expect(displayObject.order).to.equal(report.fields.number.order);
        expect(displayObject.type).to.equal(report.fields.number.type);
      });
    });

    describe ('dropdown, textarea, radio, datetime', function () {
      var commonFieldTypes = ['dropdown', 'textarea', 'radio', 'datetime'];

      it(".getDTO() should return the value", function () {
        var fieldValue = 10;

        _.forEach(commonFieldTypes, function (field) {
          report.fields[field].value = fieldValue;

          expect(report.fields[field].getDTO()).to.equal(fieldValue);
        });

      });

      it(".validate() should return true", function () {
        _.forEach(commonFieldTypes, function (field) {
          expect(report.fields[field].validate()).to.equal(true);
        });
      });

      it(".reset() should reset the value", function () {
        var fieldValue = 10;

        _.forEach(commonFieldTypes, function (field) {
          report.fields[field].value = fieldValue;
          report.fields[field].reset();
          expect(report.fields[field].value).to.equal(null);
        });
      });

      it(".getDisplayObject() should return a display object", function () {
        _.forEach(commonFieldTypes, function (field) {

          var displayObject = report.fields.number.getDisplayObject();

          expect(angular.isObject(displayObject)).to.equal(true);
          expect(displayObject.prompt).to.equal(report.fields.number.prompt);
          expect(displayObject.order).to.equal(report.fields.number.order);
          expect(displayObject.type).to.equal(report.fields.number.type);
        });
      });
    });
  });

  describe(".validateLocation()", function() {

    it ('should return false if the given argument is not a string', function () {
      expect(acFormUtils.validateLocationString(123)).to.equal(false);
    });

    it ('should return false if the coordinates are not separated by comma', function () {
      expect(acFormUtils.validateLocationString('123.123')).to.equal(false);
    });

    it ('should return false if the coordinates are not numbers separated by comma', function () {
      expect(acFormUtils.validateLocationString('aaa,bbb')).to.equal(false);
    });

    it ('should return true if the coordinates are correct', function () {
      expect(acFormUtils.validateLocationString('-100.124346343,124.124235354673')).to.equal(true);
    })

  });
});
