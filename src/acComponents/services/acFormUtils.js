angular.module('acComponents.services')
  .factory('acFormUtils', function() {

    var inputDefault = {
      getDTO: function (){
        return this.value;
      },
      validate: function(){
        return true;
      },
      reset: function () {
        this.value = null;
      },
      isCompleted: function () {
        return !_.isEmpty(this.value);
      },
      getDisplayObject: function(){
        return {
          prompt: this.prompt,
          order: (this.order)?this.order:50,
          type: this.type
        }
      }
    };

    var inputTypes = {
      checkbox: {
        getDTO: function (){
          return this.options;
        },
        validate: function(){
          if (angular.isDefined(this.limit)) {
            var noOfSelected = this.getNumberSelected();

            return noOfSelected <= this.limit;
          }

          return true;
        },
        reset: function () {
          var options = this.options;
          _.forEach(this.options, function (option, key) {
            options[key] = false;
          });
        },
        isCompleted: function () {
          var noOfSelected = this.getNumberSelected();

          return noOfSelected > 0;
        },
        getNumberSelected: function () {
          return _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

        },
        getDisplayObject: inputDefault.getDisplayObject
      },
      number:{
        getDTO: function (){
          return this.value;
        },
        validate: function(){
          return (this.value == null) || parseInt(this.value) >= this.options.min && parseInt(this.value) <= this.options.max;
        },
        reset: inputDefault.reset,
        isCompleted: inputDefault.isCompleted,
        getDisplayObject: inputDefault.getDisplayObject
      },
      dropdown: inputDefault,
      textarea: inputDefault,
      radio: inputDefault,
      datetime: inputDefault
    };

    return {
      buildReport: buildReport,
      validateLocationString: validateLocation
    };

    function buildReport(fields) {
      if (!angular.isDefined(fields)) {
        throw new Error('Please provide fields');
      }

      _.forEach(fields, function (field) {
        _.assign(field, assignUtils(field));
      });

      return {
        fields: fields,
        getDTO: getDTO,
        validate: validateFields,
        reset: resetFields,
        isCompleted: isCompleted,
        mapDisplayResponse: mapDisplayResponse
      };

      function assignUtils(field) {
        return inputTypes[field.type];
      }

      function getDTO() {
        return _.reduce(fields, function (dtos, field, key) {
          dtos[key] = field.getDTO();
          return dtos;
        }, {});
      }

      function validateFields() {
        return _.reduce(fields, function (errors, field, key) {
          var err = field.validate();
          if (err) {
            errors[key].push(err);
          }

          return errors;
        });
      }

      function resetFields() {
        _.invoke(fields, 'reset');
      }

      function isCompleted () {
        var total = _.reduce(fields, function (acc, field, key) {
          acc += field.isCompleted() ? 1 : 0;

          return acc;
        }, 0);

        return total > 0;
      }

      function mapDisplayResponse(ob) {
        if (_.isEmpty(ob)) return;

        var merged = _.reduce(ob, function (results, value, key) {
          if (_.isUndefined(results[key]) && value) {
            results[key] = {};
          }

          if (value && !_.isEmpty(parseValue(value))) {
            results[key] = (fields[key])?fields[key].getDisplayObject():{};
            results[key].value = parseValue(value);
          }

          return results;
        }, {});

        return _.sortBy(_.values(merged), 'order');
      }

      function parseValue(field) {
        if (_.isPlainObject(field)) {
          return _.reduce(field, function (array, item, key) {
            if (item) {
              array.push(key);
            }
            return array;
          }, [])
        } else {
          return field;
        }
      };
    }

    function validateLocation (locationString) {
      try {

        if (locationString.indexOf(',') === -1) {
          return false;
        }

        var latLng = locationString.split(',');

        if (latLng.length !== 2) {
          return false;
        }

        var location = L.latLng(latLng[0], latLng[1]);

        return angular.isNumber(location.lat) && angular.isNumber(location.lng);

      } catch (e) {
        return false;
      }
    }

  });
