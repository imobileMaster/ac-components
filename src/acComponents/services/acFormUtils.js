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

    return {
      assignUtils: assignUtils
    };

    function assignUtils(field) {
      return inputTypes[field.type];
    }

  });
