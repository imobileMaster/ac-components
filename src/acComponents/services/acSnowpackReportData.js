angular.module('acComponents.services')
  .factory('acSnowpackReportData', function(acFormUtils) {

    var fields = {

      snowpackObsType: {
        type: 'radio',
        prompt: 'Is this a point observation or a summary of your day?',
        options: ['Point Observation', 'Summary'],
        value: null,
        helpText: 'Please add additional information about the snowpack, especially notes about weak layer, how the snow varied by aspect/elevation, and details of any slope testing performed.'
      },

      snowpackObsComment: {
        type: 'textarea',
        prompt: 'Snowpack Observation Comment',
        value: null
      },

      snowpackSiteElevation: {
        type: 'number',
        prompt: 'Snowpack Site Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 4000
        },
        value: null
      },

      snowpackSiteElevationBand: {
        type: 'radio',
        prompt: 'Snowpack Site Elevation Band',
        options: ['Alpine', 'Treeline', 'Below Treeline'],
        value: null
      },

      snowpackSiteAspect: {
        type: 'radio',
        prompt: 'Snowpack Site Aspect',
        options: [
          'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'
        ]
      },

      snowpackDepth: {
        type: 'number',
        prompt: 'Snowpack Depth (centimetres)',
        options: {
          min: 0,
          max: 10000
        },
        helpText:'Total height of snow in centimetres. Averaged if this is a summary.'
      },

      snowpackWhumpfingObserved:{
        type: 'radio',
        prompt: 'Did you observe whumpfing?',
        options: ['Yes', 'No'],
        selected: null,
        helpText: 'A whumpf is a rapid settlement of the snowpack caused by the collapse of a weak layer. It is accompanied by an audible noise.'
      },

      snowpackCrackingObserved:{
        type: 'radio',
        prompt: 'Did you observe cracking?',
        options: ['Yes', 'No'],
        selected: null,
        helpText: 'Cracking is shooting cracks radiating more than a couple of metres from your sled or skis. '
      },

      snowpackSurfaceCondition: {
        type: 'checkbox',
        prompt: 'Surface condition',
        options: {
          'New Snow': false,
          'Crust': false,
          'Surface Hoar': false,
          'Facets': false,
          'Corn': false,
          'Variable': false
        }
      },

      snowpackFootPenetration: {
        type: 'number',
        prompt: 'Foot Penetration (centimeters)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far you sink into the snow when standing on one fully-weighted foot.'
      },

      snowpackSkiPenetration: {
        type: 'number',
        prompt: 'Ski Penetration (centimeters)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far  you sink into the snow when standing on one fully-weighted ski.'
      },

      snowpackSledPenetration: {
        type: 'number',
        prompt: 'Sled Penetration (centimeters)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'The depth a sled sinks into the snow after stopping slowly on level terrain.'
      },

      snowpackTestInitiation: {
        type: 'radio',
        prompt: 'Snowpack Test Result',
        options: ['None', 'Very Easy', 'Easy', 'Moderate', 'Hard'],
        helpText: 'Average if you did a number of tests.'
      },

      snowpackTestFracture: {
        type: 'radio',
        prompt: 'Snowpack Test Fracture Character',
        options: ['Sudden ("Pop" or "Drop")', 'Resistant', 'Uneven break'],
        helpText: 'Average if you did a number of tests. Describe further in comments if variable results.'
      },

      snowpackTestFailure: {
        type: 'number',
        prompt: 'Snowpack Test Failure Depth',
        options: {
          min: 0,
          max: 200
        },
        helpText:'Depth below the surface that failure occurred.'
      }
    };

    function getDTO () {
      return _.reduce(fields, function (dtos, field, key) {
        dtos[key] = field.getDTO();
        return dtos;
      }, {});
    }

    function validate () {
      return _.reduce(fields, function (errors, field, key) {
        var err = field.validate();
        if (err) {
          errors[key].push(err);
        }

        return errors;
      });
    }

    (function () {
      _.forEach(fields, function (field) {
        _.assign(field, acFormUtils.assignUtils(field));
      });
    })();

    return {
      fields: fields,
      getDTO: getDTO,
      validate: validate
    }
  });
