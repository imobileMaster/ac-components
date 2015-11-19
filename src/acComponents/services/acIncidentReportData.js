angular.module('acComponents.services')
  .service('acIncidentReportData', function(acFormUtils) {

    var fields = {

      groupActivity: {
        type: 'checkbox',
        prompt: 'Activity:',
        options: {
          'Snowmobiling': false,
          'Skiing': false,
          'Climbing/Mountaineering': false,
          'Hiking/Scrambling': false,
          'Snowshoeing': false,
          'Tobogganing': false,
          'Other': false
        },
        inline: true,
        helpText: 'If other, please describe in Incident Description.',
        order: 1
      },

      groupSize: {
        type: 'number',
        prompt: 'Number of people in the group:',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 2
      },

      numberFullyBuried: {
        type: 'number',
        prompt: 'Number of people fully buried:',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 3
      },

      numberPartlyBuriedImpairedBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, breathing impaired:',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 4
      },

      numberPartlyBuriedAbleBreathing: {
        type: 'number',
        prompt: 'Number of people partly buried, able to breathe normally:',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 5
      },

      numberCaughtOnly: {
        type: 'number',
        prompt: 'Number of people caught and not buried:',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 6
      },

      numberPeopleInjured: {
        type: 'number',
        prompt: 'Number of people caught only and not fully or partly buried:',
        options: {
          'min': 0,
          'max': 400
        },
        value: null,
        errorMessage: 'Number between 0 and 400 please.',
        order: 7
      },

      terrainShapeTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Terrain shape at Trigger Point:',
        options: ['Convex', 'Planar', 'Concave', 'Unsupported'],
        value: null,
        helpText: 'Convex: a roll. Concave: bowl-shaped. Planar: smooth with no significant convexities or concavities. Unsupported: a slope that drops off abruptly at the bottom.',
        order: 8
      },

      snowDepthTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Snow depth at Trigger Point:',
        options: ['Shallow', 'Deep', 'Average', 'Variable'],
        helpText: 'The depth of the snowpack compared to the average conditions in the area. Shallow: shallower than average. Deep: deeper than average. Average: about the same as everywhere else. Variable: depth varies significantly in the place where the avalanche started.',
        value: null,
        order: 9
      },

      terrainTrap: {
        type: 'checkbox',
        prompt: 'Terrain Trap:',
        options: {
          'No obvious terrain trap': false,
          'Gully or depression': false,
          'Slope transition or bench': false,
          'Trees': false,
          'Cliff': false
        },
        inline: true,
        helpText: 'Terrain traps are features that increase the consequences of an avalanche.',
        order: 10
      },

      incidentDescription: {
        prompt: 'Incident Description:',
        type: 'textarea',
        value: null,
        helpText: 'No names and no judging please.',
        guidelines: 'http://www.avalanche.ca/fxresources/Submissions+Guidelines.pdf',
        order: 11
      }
    };

    return acFormUtils.buildReport(fields);
  });
