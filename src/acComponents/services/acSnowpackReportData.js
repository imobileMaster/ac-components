angular.module('acComponents.services')
  .service('acSnowpackReportData', function() {

    this.snowpackObservation = {

      obsType: {
        prompt: 'Is this a point observation or a summary of your day?',
        type: 'single',
        options: ['Point Observation', 'Summary'],
        selected: null
      },

      obsComment: {
        prompt: 'Snowpack Observation Comment',
        type: 'textarea',
        value: ''
      },

      siteElevation: {
        type: 'number',
        prompt: 'Snowpack Site Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 4000,
          default:0,
          step: 100
        }
      },

      siteElevationBand: {
        prompt: 'Snowpack Site Elevation Band',
        type: 'single',
        options: ['Alpine', 'Treeline', 'Below Treeline'],
        selected: null
      },

      siteAspect: {
        type: 'multiple',
        prompt: 'Snowpack Site Aspect',
        options: {
          'N': false,
          'NE': false,
          'E': false,
          'SE': false,
          'S': false,
          'SW': false,
          'W': false,
          'NW': false
        }
      },

      depth: {
        type: 'number',
        prompt: 'Snowpack Depth (centimetres)',
        options: {
          min: 0,
          max: 10000,
          default:0,
          step: 100
        },
        helpText:'Total height of snow in centimetres. Averaged if this is a summary.'
      },

      whumpfingObserved:{
        prompt: 'Did you observe whumpfing?',
        type: 'single',
        options: ['Yes', 'No'],
        selected: null,
        helpText: 'A whumpf is a rapid settlement of the snowpack caused by the collapse of a weak layer. It is accompanied by an audiable noise.'
      },

      crackingObserved:{
        prompt: 'Did you observe cracking?',
        type: 'single',
        options: ['Yes', 'No'],
        selected: null,
        helpText: 'Cracking is shooting cracks radiating more than a couple of metres from your sled or skis. '
      },

      surfaceCondition: {
        type: 'multiple',
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

      footPenetration: {
        type: 'number',
        prompt: 'Foot Penetration (centimetres)',
        options: {
          min: 0,
          max: 200,
          default:0,
          step: 50
        },
        helpText:'How far  you sink into the snow when standing on one fully-weighted foot.'
      },

      skiPenetration: {
        type: 'number',
        prompt: 'Ski Penetration (centimetres)',
        options: {
          min: 0,
          max: 200,
          default:0,
          step: 50
        },
        helpText:'How far  you sink into the snow when standing on one fully-weighted ski.'
      },

      sledPenetration: {
        type: 'number',
        prompt: 'Sled Penetration (centimetres)',
        options: {
          min: 0,
          max: 200,
          default:0,
          step: 50
        },
        helpText:'The depth a sled sinks into the snow after stopping slowly on level terrain.'
      },

      testInitiation: {
        type: 'multiple',
        prompt: 'Snowpack Test Result',
        options: {
          'None': false,
          'Very Easy': false,
          'Easy': false,
          'Moderate': false,
          'Hard': false
        },
        helpText: 'Average if you did a number of tests.'
      },

      testFracture: {
        type: 'multiple',
        prompt: 'Snowpack Test Fracture Character',
        options: {
          'Sudden ("Pop" or "Drop")': false,
          'Resistant': false,
          'Uneven break': false
        },
        helpText: 'Average if you did a number of tests. Describe further in comments if variable results.'
      },

      testFailure: {
        type: 'number',
        prompt: 'Snowpack Test Failure Depth',
        options: {
          min: 0,
          max: 200,
          default:0,
          step: 50
        },
        helpText:'Depth below the surface that failure occurred.'
      }
    };
  });
