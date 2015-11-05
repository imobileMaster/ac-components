angular.module('acComponents.services')
  .factory('acFormUtils', function() {

    var inputDefault = {
      getDTO: function (){
        return this.value;
      },
      validate: function(){
        return true;
      }
    };

    var inputTypes = {
      checkbox: {
        getDTO: function (){
          return this.options;
        },
        validate: function(){
          var noOfSelected = _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

          return noOfSelected<= this.limit;
        }
      },
      number:{
        getDTO: function (){
          return this.value;
        },
        validate: function(){
          return (this.value == null) || parseInt(this.value) >= this.options.min && parseInt(this.value) <= this.options.max;
        }
      },
      dropdown: inputDefault,
      textarea: inputDefault,
      radio: inputDefault,
      datetime: inputDefault
    };

    return{
      getDTOForFields: getDTO,
      validateFields: validate
    };


    function assignDTO(fields){
      _.forEach(fields, function (field){
        if (angular.isDefined(field.type)){
          field.getDTO = inputTypes[field.type].getDTO.bind(field);
        }
      });
    }

    function getDTO (fields) {
      assignDTO(fields);
      return _.reduce(fields, function (dtos, field, key) {
        dtos[key] = field.getDTO();
        return dtos;
      }, {});
    }

    function assignValidation(fields){
      _.forEach(fields, function (field){
        if (angular.isDefined(field.type)){
          field.validate = inputTypes[field.type].validate.bind(field);
        }
      });
    }

    function validate(fields){
      assignValidation(fields);

      return _.reduce(fields, function (errors, field, key) {
        if (!field.validate()){
          errors.push(field.prompt);
        }
        return errors;
      }, []);
    }


  });
