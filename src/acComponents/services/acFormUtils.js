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
      }
    };

    var inputTypes = {
      checkbox: {
        getDTO: function (){
          return this.options;
        },
        validate: function(){
          var noOfSelected = this.getNumberSelected();

          return noOfSelected<= this.limit;
        },
        reset: function () {
          var options = this.options;
          this.options.forEach(function (option, key) {
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

        }
      },
      number:{
        getDTO: function (){
          return this.value;
        },
        validate: function(){
          return (this.value == null) || parseInt(this.value) >= this.options.min && parseInt(this.value) <= this.options.max;
        },
        reset: inputDefault.reset,
        isCompleted: inputDefault.isCompleted
      },
      dropdown: inputDefault,
      textarea: inputDefault,
      radio: inputDefault,
      datetime: inputDefault
    };

    return {
      buildReport: buildReport
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
        isCompleted: isCompleted
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
    }



  });
