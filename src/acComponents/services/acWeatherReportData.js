angular.module('acComponents.services')
  .factory('acWeatherReportData', function(acFormUtils) {
    var fields = {
      weatherObsComment: {
        type: 'textarea',
        prompt: 'Weather Observation Comment',
        value: null,
        order: 1
      },

      skyCondition: {
        type: 'checkbox',
        prompt: 'Cloud Cover:',
        options: {
          'Clear': false,
          'Few clouds (<2/8)': false,
          'Scattered clouds (2/8-4/8)': false,
          'Broken clouds (5/8-7/8)': false,
          'Overcast (8/8)': false,
          'Fog': false
        },
        helpText: 'Values expressed in eighths refer to the proportion of the sky that was covered with clouds. E.g. 2/8 refers to a sky approximately one quarter covered with cloud.',
        order: 2
      },

      precipitationType: {
        type: 'checkbox',
        prompt: 'Precipitation Type:',
        options: {
          'Snow': false,
          'Rain': false,
          'None': false
        },
        order: 3
      },

      snowfallRate: {
        type: 'number',
        prompt: 'Snowfall Rate (cm/hour):',
        options: {
          min: 1,
          max: 20
        },
        value: null,
        helpText: 'If there was no snow, please leave this field blank.',
        order: 4
      },

      rainfallRate: {
        type: 'radio',
        prompt: 'Rainfall rate:',
        options: ['Drizzle', 'Showers', 'Raining', 'Pouring'],
        value: null,
        helpText: 'If there was no rain, please leave this field blank.',
        order: 5
      },

      temperature: {
        type: 'number',
        prompt: 'Temperature at time of observation (deg C):',
        options: {
          min: -50,
          max: 40
        },
        value: null,
        order: 6
      },

      minTemp: {
        type: 'number',
        prompt: 'Minimum temperature in last 24 hours (deg C)',
        options: {
          'min': -50,
          'max': 30
        },
        value: null,
        order: 7
      },

      maxTemp: {
        type: 'number',
        prompt: 'Maximum temperature in last 24 hours (deg C):',
        options: {
          min: -40,
          max: 40
        },
        value: null,
        order: 8
      },

      temperatureTrend: {
        type: 'radio',
        prompt: 'Temperature Trend:',
        options: ['Falling', 'Steady', 'Rising'],
        value: null,
        helpText: 'Describe how the temperature changed in the last 3 hours.',
        order: 9
      },

      newSnow24Hours: {
        type: 'number',
        prompt: 'Amount of new snow in last 24 hours (centimetres):',
        options: {
          min: 0,
          max: 100
        },
        value: null,
        order: 10
      },

      precipitation24Hours: {
        type: 'number',
        prompt: 'Total rain and snow combined in last 24 hours (millimetres):',
        options: {
          min: 0,
          max: 100
        },
        value: null,
        order: 11
      },

      stormSnowAmount: {
        type: 'number',
        prompt: 'Total snow from the most recent storm (cm):',
        options: {
          min: 0,
          max: 300
        },
        value: null,
        helpText: 'Please enter the amount of snow that has fallen during the current storm cycle. You can specify a storm start date to describe the time period over which this snow fell.',
        order: 12
      },

      stormStartDate: {
        type: 'datetime',
        prompt: 'Storm Start Date',
        value: null,
        helpText: 'The date on which the most recent storm started. Leave blank if there has not been a recent storm.',
        order: 13
      },

      windSpeed: {
        type: 'dropdown',
        prompt: 'Wind Speed',
        options: ['Calm', 'Light (1-25 km/h)', 'Moderate (26-40 km/h)', 'Strong (41-60 km/h)', 'Extreme (>60 km/h)'],
        value: null,
        helpText: 'Calm: smoke rises. Light: flags and twigs move. Moderate: snow begins to drift. Strong: whole tress in motion. Extreme: difficulty walking.',
        order: 14
      },

      windDirection: {
        type: 'radio',
        prompt: 'Wind Direction',
        options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        value: null,
        order: 15
      },

      blowingSnow: {
        type: 'radio',
        prompt: 'Blowing Snow',
        options: ['None', 'Light', 'Moderate', 'Intense'],
        helpText: 'How much snow is blowing at ridge crest elevation. Light: localized snow drifting. Moderate: a plume of snow is visible. Intense: a large plume moving snow well down the slope.',
        value: null,
        order: 16
      }
    };

    return acFormUtils.buildReport(fields);

  });
