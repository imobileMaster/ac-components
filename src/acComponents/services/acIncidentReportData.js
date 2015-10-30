angular.module('acComponents.services')
  .service('acIncidentReportData', function() {
    this.incidentData = {
      incidentDescription: {
        prompt: 'Incident Description. No names and no judging please:',
        type: 'textarea',
        value: ''
      },

      groupActivity: {
        type: 'multiple',
        prompt: 'Activity:',
        options: {
          'Snowmobiling': false,
          'Skiing': false,
          'Climbing/Mountaineering': false,
          'Hiking/Scrambling': false,
          'Snowshoeing': false,
          'Toboganning': false,
          'Other': false
        },
        helpText: 'If other, please describe in Incident Description.'
      },

      groupSize: {
        type: 'number',
        prompt: 'Number of people in the group:',
        options: {
          'min': 0,
          'max': 100,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      numberFullyBuried: {
        type: 'number',
        prompt: 'Number of people fully buried:',
        options: {
          'min': 0,
          'max': 100,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      numberPartlyBuriedImpairedBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, breathing impaired:',
        options: {
          'min': 0,
          'max': 100,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      numberPartlyBuriedAbleBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, able to breathe normally:',
        options: {
          'min': 0,
          'max': 100,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      numberCaughtOnly: {
        type: 'number',
        prompt: 'Number of people caught and not buried:',
        options: {
          'min': 0,
          'max': 100,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      numberPeopleInjured: {
        type: 'number',
        prompt: 'Number of people caught only and not fully or partly buried:',
        options: {
          'min': 0,
          'max': 400,
          'default': 0,
          'step': 1
        },
        value: 0
      },

      terrainShapeTriggerPoint: {
        type: 'multiple',
        prompt: 'Terrain shape at Trigger Point:',
        options: {
          'Convex': false,
          'Planar': false,
          'Concave': false,
          'Unsupported': false
        },
        helpText: 'Convex: a roll. Concave: bowl-shaped. Planar: smooth with no significant convexities or concavities. Unsupported: a slope that drops off abruptly at the bottom.'
      },

      snowDepthTriggerPoint: {
        type: 'multiple',
        prompt: 'Snow depth at Trigger Point:',
        options: {
          'Shallow': false,
          'Deep': false,
          'Average': false,
          'Variable': false
        },
        helpText: 'The depth of the snowpack compared to the average conditions in the area. Shallow: shallower than average. Deep: deeper than average. Average: about the same as everywhere else. Variable: depth varies significantly in the place where the avalanche started.'
      },

      terrainTrap: {
        type: 'multiple',
        prompt: 'Terrain Trap:',
        options: {
          'No obvious terrain trap': false,
          'Gully or depression': false,
          'Slope transition or bench': false,
          'Trees': false,
          'Cliff': false
        },
        helpText: 'Terrain traps are features that increase the consequences of an avalanche.'
      },

      numberInvolved: {
        type: 'calculated',
        fields: ['groupSize', 'numberFullyBuried', 'numberPartlyBuriedImpairedBreathing', 'numberPartlyBuriedAbleBreathing'],
        value: 0
      }
    };
  });
