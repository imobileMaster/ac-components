angular.module('acComponents.services')
  .factory('acIncidentReportData', function() {
    var incidentData = {
      incidentDescription: {
        prompt: 'Incident Description. No names and no judging please.',
        type: 'textarea',
        value: null
      },

      groupActivity: {
        type: 'checkbox',
        prompt: 'Activity',
        options: {
          'Snowmobiling': false,
          'Skiing': false,
          'Climbing/Mountaineering': false,
          'Hiking/Scrambling': false,
          'Snowshoeing': false,
          'Tobogganing': false,
          'Other': false
        },
        helpText: 'If other, please describe in Incident Description.'
      },

      groupSize: {
        type: 'number',
        prompt: 'Number of people in the group',
        options: {
          'min': 0,
          'max': 100
        },
        value: null
      },

      numberFullyBuried: {
        type: 'number',
        prompt: 'Number of people fully buried',
        options: {
          'min': 0,
          'max': 100
        },
        value: null
      },

      numberPartlyBuriedImpairedBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, breathing impaired',
        options: {
          'min': 0,
          'max': 100
        },
        value: null
      },

      numberPartlyBuriedAbleBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, able to breathe normally',
        options: {
          'min': 0,
          'max': 100
        },
        value: null
      },

      numberCaughtOnly: {
        type: 'number',
        prompt: 'Number of people caught and not buried',
        options: {
          'min': 0,
          'max': 100
        },
        value: null
      },

      numberPeopleInjured: {
        type: 'number',
        prompt: 'Number of people caught only and not fully or partly buried',
        options: {
          'min': 0,
          'max': 400
        },
        value: null
      },

      terrainShapeTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Terrain shape at Trigger Point',
        options: ['Convex', 'Planar', 'Concave', 'Unsupported'],
        value: null,
        helpText: 'Convex: a roll. Concave: bowl-shaped. Planar: smooth with no significant convexities or concavities. Unsupported: a slope that drops off abruptly at the bottom.'
      },

      snowDepthTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Snow depth at Trigger Point',
        options: ['Shallow', 'Deep', 'Average', 'Variable'],
        helpText: 'The depth of the snowpack compared to the average conditions in the area. Shallow: shallower than average. Deep: deeper than average. Average: about the same as everywhere else. Variable: depth varies significantly in the place where the avalanche started.',
        value: null
      },

      terrainTrap: {
        type: 'checkbox',
        prompt: 'Terrain Trap',
        options: {
          'No obvious terrain trap': false,
          'Gully or depression': false,
          'Slope transition or bench': false,
          'Trees': false,
          'Cliff': false
        },
        helpText: 'Terrain traps are features that increase the consequences of an avalanche.'
      }
    };

    return {
      fields: incidentData
    };
  });
