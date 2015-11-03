angular.module('acComponents.services')
  .factory('acAvalancheReportData', function() {
    var avalancheData = {

      avalancheObsComment: {
        prompt: 'Avalanche Observation Comment',
        type: 'textarea',
        value: '',
        helpText: 'Please add additional information, for example terrain, aspect, elevation etc. especially if describing many avalanches together.',
        getDTO: function (){
          return this.value;
        }
      },

      avalancheOccurrenceDate: {
        prompt: 'Avalanche Observation Date',
        type: 'date',
        value: null
      },

      avalancheOccurrenceTime: {
        prompt: 'Avalanche Observation Time',
        type: 'time',
        value: null
      },

      avalancheOccurrenceEpoch: {
        prompt: 'Avalanche Observation Datetime',
        type: 'datetime',
        value: new Date(),
        getDTO: function (){
          return this.value;
        }
      },

      avalancheNumber: {
        prompt: 'Number of avalanches in this report',
        type: 'radio',
        inline: true,
        options: ['1', '2-5', '6-10', '11-50', '51-100'],
        value: null,
        getDTO: function (){
          return this.value;
        }
      },


      avalancheSize: {
        prompt: 'Avalanche Size',
        type: 'radio',
        inline: true,
        value: null,
        options: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
        helpText: 'Use Canadian size classification. Size 1 is relatively harmless to people. Size 2 can bury, injure or kill a person. Size 3 can bury and destroy a car. Size 4 can destroy a railway car. Size 5 can destroy 40 hectares of forest.',
        getDTO: function (){
          return this.value;
        }
      },

      slabThickness: {
        type: 'number',
        prompt: 'Slab Thickness (centimetres)',
        value: null,
        options: {
          min: 10,
          max: 500,
          step: 10
        },
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      slabWidth: {
        type: 'number',
        prompt: 'Slab Width (meters)',
        value: null,
        options: {
          min: 1,
          max: 3000,
          step: 100
        },
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      runLength: {
        type: 'number',
        prompt: 'Run length (meters)',
        options: {
          min: 1,
          max: 10000,
          step: 100
        },
        value: null,
        helpText: 'Length from crown to toe of debris.',
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      avalancheCharacter: {
        type: 'checkbox',
        prompt: 'Avalanche Character',
        limit: 3,
        options: {
          'Loose wet': false,
          'Loose dry': false,
          'Storm slab': false,
          'Persistent slab': false,
          'Deep persistent slab': false,
          'Wet slab': false,
          'Cornice only': false,
          'Cornice with slab': false
        },
        validation: function(){
          var noOfSelected = _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

          return noOfSelected<= this.limit;
        },
        getDTO: function (){
          return this.options;
        }
      },

      triggerType: {
        type: 'dropdown',
        prompt: 'Trigger Type',
        value: null,
        getDTO: function (){
          return this.value;
        }
      },

      triggerSubtype: {
        type: 'dropdown',
        prompt: 'Trigger Subtype',
        value: null,
        options: ['Accidental', 'Intentional', 'Remote'],
        helpText: 'A remote trigger is when the avalanche starts some distance away from where the trigger was  applied.',
        getDTO: function (){
          return this.value;
        }
      },

      triggerDistance: {
        type: 'number',
        prompt: 'Remote Trigger Distance (metres)',
        options: {
          min: 0,
          max: 2000,
          step: 50
        },
        helpText: 'If a remote trigger, enter how far from the trigger point is the nearest part of the crown.',
        value: null,
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      startZoneAspect: {
        type: 'radio',
        inline: true,
        prompt: 'Start Zone Aspect',
        options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        value: null,
        getDTO: function (){
          return this.value;
        }
      },

      startZoneElevationBand: {
        prompt: 'Start Zone Elevation Band',
        type: 'radio',
        inline: true,
        options: ['Alpine', 'Treeline', 'Below Treeline'],
        value: null,
        getDTO: function (){
          return this.value;
        }
      },


      startZoneElevation: {
        type: 'number',
        prompt: 'Start Zone Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 5000,
          step: 50
        },
        value: null,
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      startZoneIncline: {
        type: 'number',
        prompt: 'Start Zone Incline',
        options: {
          min: 0,
          max: 90,
          step: 5
        },
        value: null,
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      runoutZoneElevation: {
        type: 'number',
        prompt: 'Runout Zone Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 5000,
          step: 50
        },
        helpText: 'The lowest point of the debris.',
        value: null,
        validation: function(n){
          return parseInt(n) >= this.options.min && parseInt(n) <= this.options.max;
        },
        getDTO: function (){
          return this.value;
        }
      },

      weakLayerBurialDate: {
        prompt: 'Weak Layer Burial Date',
        type: 'datetime',
        helpText:'Date the weak layer was buried.',
        value: null,
        getDTO: function (){
          return this.value;
        }
      },

      weakLayerCrystalType: {
        type: 'checkbox',
        prompt: 'Weak Layer Crystal Type',
        limit: 2,
        options: {
          'Surface hoar': false,
          'Facets': false,
          'Surface hoar and facets': false,
          'Depth hoar': false,
          'Storm snow': false
        },
        validation: function(){
          var noOfSelected = _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

          return noOfSelected<= this.limit;
        },
        getDTO: function (){
          return this.options;
        }
      },

      crustNearWeakLayer:{
        prompt: 'Crust Near Weak Layer',
        type: 'radio',
        inline: true,
        options: ['Yes', 'No'],
        value: null,
        getDTO: function (){
          return this.value;
        }
      },

      windExposure: {
        type: 'checkbox',
        prompt: 'Wind Exposure',
        limit: 1,
        options: {
          'Lee slope': false,
          'Windward slope': false,
          'Down flow': false,
          'Cross-loaded slope': false,
          'Reverse-loaded slope': false,
          'No wind exposure': false
        },
        validation: function(){
          var noOfSelected = _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

          return noOfSelected<= this.limit;
        },
        getDTO: function (){
          return this.options;
        }
      },

      vegetationCover: {
        type: 'dropdown',
        prompt: 'Vegetation cover',
        value: null,
        options: ['Open slope', 'Sparse trees or gladed slope', 'Dense trees'],
        getDTO: function (){
          return this.value;
        }
      }

    };

    var inputCheckbox = {
      getDTO: function (){
        return this.options;
      }
    };

    var inputOther = {
      getDTO: function (){
        return this.value;
      }
    };


    (function (){
      _.forEach(avalancheData, function (field){
        if (angular.isDefined(field.options)){
          _.assign(field, inputCheckbox);
        } else {
          _.assign(field, inputOther);
        }
      });
    })();

    return {
      fields: avalancheData,
      validate: validate,
      getDTO: getDTO
    };

    function validate(){
      _.forEach(avalancheData, function (field){
        field.validation();
      });
    }

    function getDTO(){
      _.forEach(avalancheData, function (field){
        field.getDTO();
      });
    }

  });
