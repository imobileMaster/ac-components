angular.module('acComponents.services')
  .service('acHotZoneReportData', function(acFormUtils) {

    var criticalFactors = {

      persistentAvalancheProblem: {
        type: 'radio',
        inline: true,
        prompt: 'Persistent avalanche problem:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 1
      },

      slabAvalanches: {
        type: 'radio',
        inline: true,
        prompt: 'Slab avalanches in the last 48 hours:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 2
      },

      instability: {
        type: 'radio',
        inline: true,
        prompt: 'Signs of instability:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 3
      },

      recentSnowfall: {
        type: 'radio',
        inline: true,
        prompt: 'Recent snowfall > 30cm:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 4
      },

      recentRainfall: {
        type: 'radio',
        inline: true,
        prompt: 'Recent rainfall:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 5
      },

      recentWindloading: {
        type: 'radio',
        inline: true,
        prompt: 'Recent windloading:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 6
      },

      significantWarming: {
        type: 'radio',
        inline: true,
        prompt: 'Significant warming:',
        options: ['Yes', 'No', 'Unknown'],
        value: null,
        order: 7
      },

      criticalFactorsComments: {
        prompt: 'Comments:',
        type: 'textarea',
        value: null,
        order: 8
      }

    };

    var terrainAvoidanceList = {

      aspect: {
        type: 'checkbox',
        prompt: 'Aspect:',
        options: {
          'N': false,
          'NE': false,
          'E': false,
          'SE': false,
          'S': false,
          'SW': false,
          'W': false,
          'NW': false,
          'All': false
        },
        inline: true,
        order: 1
      },

      elevationBand: {
        type: 'checkbox',
        prompt: 'Elevation band:',
        options: {
          'Alpine': false,
          'Treeline': false,
          'Below Treeline': false
        },
        inline: true,
        order: 2
      },

      elevationBelow: {
        type: 'number',
        prompt: 'Elevation below:',
        options: {
          'min': 0,
          'max': 5000
        },
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 3
      },

      elevationAbove: {
        type: 'number',
        prompt: 'Elevation above:',
        options: {
          'min': 0,
          'max': 5000
        },
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 4
      },

      elevationBetweenLow: {
        type: 'number',
        prompt: 'Elevation between:',
        options: {
          'min': 0,
          'max': 5000
        },
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 5
      },

      elevationBetweenHigh: {
        type: 'number',
        subTitle: 'and',
        options: {
          'min': 0,
          'max': 5000
        },
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 6
      },

      terrainFeatures: {
        type: 'checkbox',
        prompt: 'Terrain features:',
        options: {
          'Steeper than [fill out below]': false,
          'Convex': false,
          'Unsupported': false,
          'Lee Slopes': false,
          'Crossloaded Slopes': false,
          'Shallow Snowpack': false,
          'Variable Depth Snowpack': false,
          'Other': false
        },
        inline: true,
        helpText: 'If "steeper than" and/or  "other", please describe it below.',
        order: 7
      },

      steeperThan: {
        title: null,
        type: 'text',
        prompt: 'Steeper than:',
        value: null,
        order: 8,
        errorMessage: 'Please enter steeper than value',
        constraint: {
          field: 'terrainFeatures',
          option: 'Steeper than [fill out below]'
        }
      },

      otherTerrainFeatures: {
        title: null,
        type: 'text',
        prompt: 'Describe other terrain features',
        value: null,
        order: 9,
        errorMessage: 'Please describe what other terrain features.',
        constraint: {
          field: 'terrainFeatures',
          option: 'Other'
        }
      },

      terrainAvoidanceComments: {
        prompt: 'Comments',
        type: 'textarea',
        value: null,
        order: 10
      }

    };

    var travelAdvice = {
      travelAdviceStatement1: {
        prompt: 'Travel advice statement 1:',
        type: 'textarea',
        value: null,
        order: 1
      },

      travelAdviceStatement2: {
        prompt: 'Travel advice statement 2:',
        type: 'textarea',
        value: null,
        order: 2
      },

      travelAdviceStatement3: {
        prompt: 'Travel advice statement 3:',
        type: 'textarea',
        value: null,
        order: 3
      },

      travelAdviceComments: {
        prompt: 'Travel advice comments:',
        type: 'textarea',
        value: null,
        order: 4
      }

    };

    return {
      criticalFactors: acFormUtils.buildReport(criticalFactors),
      terrainAvoidanceList: acFormUtils.buildReport(terrainAvoidanceList),
      travelAdvice: acFormUtils.buildReport(travelAdvice)
    };
  });
