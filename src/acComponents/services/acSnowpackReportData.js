angular.module('acComponents.services')
  .factory('acSnowpackReportData', function(acFormUtils) {

    var fields = {

      snowpackObsType: {
        type: 'radio',
        prompt: 'Is this a point observation or a summary of your day?',
        options: ['Point Observation', 'Summary'],
        inline: true,
        value: null,
        order: 1
      },

      snowpackSiteElevation: {
        type: 'number',
        prompt: 'Site Elevation (m above sea level)',
        options: {
          min: 0,
          max: 4000
        },
        value: null,
        errorMessage: 'Number between 0 and 4000 please.',
        order: 2
      },

      snowpackSiteElevationBand: {
        type: 'radio',
        prompt: 'Site Elevation Band',
        options: ['Alpine', 'Treeline', 'Below Treeline'],
        inline: true,
        value: null,
        order: 3
      },

      snowpackSiteAspect: {
        type: 'radio',
        prompt: 'Site Aspect',
        options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        value: null,
        inline: true,
        order: 4
      },

      snowpackDepth: {
        type: 'number',
        prompt: 'Depth (cm)',
        options: {
          min: 0,
          max: 10000
        },
        helpText:'Total height of snow in centimetres. Averaged if this is a summary.',
        value: null,
        errorMessage: 'Number between 0 and 10000 please.',
        order: 5
      },

      snowpackWhumpfingObserved:{
        type: 'radio',
        prompt: 'Did you observe whumpfing?',
        options: ['Yes', 'No'],
        inline: true,
        value: null,
        helpText: 'A whumpf is a rapid settlement of the snowpack caused by the collapse of a weak layer. It is accompanied by an audible noise.',
        order: 6
      },

      snowpackCrackingObserved:{
        type: 'radio',
        prompt: 'Did you observe cracking?',
        options: ['Yes', 'No'],
        inline: true,
        value: null,
        helpText: 'Cracking is shooting cracks radiating more than a couple of metres from your sled or skis.',
        order: 7
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
        },
        inline: true,
        order: 8
      },

      snowpackFootPenetration: {
        type: 'number',
        prompt: 'Foot Penetration (cm)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far you sink into the snow when standing on one fully-weighted foot.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 9
      },

      snowpackSkiPenetration: {
        type: 'number',
        prompt: 'Ski Penetration (cm)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far  you sink into the snow when standing on one fully-weighted ski.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 10
      },

      snowpackSledPenetration: {
        type: 'number',
        prompt: 'Sled Penetration (cm)',
        options: {
          min: 0,
          max: 200
        },
        helpText:'The depth a sled sinks into the snow after stopping slowly on level terrain.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 11
      },

      snowpackTestInitiation: {
        type: 'radio',
        prompt: 'Test Result',
        options: ['None', 'Very Easy', 'Easy', 'Moderate', 'Hard'],
        helpText: 'Average if you did a number of tests.',
        value: null,
        inline: true,
        order: 12
      },

      snowpackTestFracture: {
        type: 'radio',
        prompt: 'Test Fracture Character',
        options: ['Sudden ("Pop" or "Drop")', 'Resistant', 'Uneven break'],
        helpText: 'Average if you did a number of tests. Describe further in comments if variable results.',
        value: null,
        inline: true,
        order: 13
      },

      snowpackTestFailure: {
        type: 'number',
        prompt: 'Test Failure Depth',
        options: {
          min: 0,
          max: 200
        },
        helpText:'Depth below the surface that failure occurred.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 14
      },

      snowpackObsComment: {
        type: 'textarea',
        prompt: 'Observation Comment',
        value: null,
        helpText: 'Please add additional information about the snowpack, especially notes about weak layer, how the snow varied by aspect/elevation, and details of any slope testing performed.',
        order: 15
      }
    };

    return acFormUtils.buildReport(fields);

  });
