angular.module('acComponents.services')
  .service('acHotZoneReportData', function(acFormUtils) {

    var criticalFactors = {

      persistentAvalancheProblem: {
        type: 'radio',
        inline: false,
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
        prompt: 'Critical factors comments:',
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
          'Below treeline': false
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
          'Convex': false,
          'Unsupported': false,
          'Lee slopes': false,
          'Crossloaded slopes': false,
          'Shallow snowpack': false,
          'Variable depth snowpack': false,
          'Steeper than [enter number below]': false,
          'Other [describe below]': false
        },
        inline: true,
        helpText: 'Use input boxes below if "steeper than" and/or "other."',
        order: 7
      },

      steeperThan: {
        title: null,
        type: 'number',
        prompt: 'Steeper than:',
        value: null,
        order: 8,
        errorMessage: 'Please enter steeper than value',
        placeholder: 'Steeper than incline: number between 0 and 90',
        options: {
          'min': 0,
          'max': 90
        },
        constraint: {
          field: 'terrainFeatures',
          option: 'Steeper than [enter number below]'
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
          option: 'Other [describe below]'
        }
      },

      terrainAvoidanceComments: {
        prompt: 'Terrain avoidance comments:',
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

    var staticInfo = {
      infoSummary: '<p>Hot Zone Reports are being tested as pilot projects in some regions. After testing is complete, Avalanche Canada will determine whether to continue producing Hot Zone Reports.</p><p>Hot Zone Reports are not the equivalent of a daily avalanche forecast. They are general summaries of local conditions and provide general risk management advice for users who have enough training and knowledge to recognize avalanche terrain and use the information here as part of their risk management process.</p><p>Conditions may vary significantly over space so the boundaries of this Hot Zone Report as shown on the map should not be taken literally. They are a general representation of the area within which the information and advice contained in the report may be applicable. Conditions may vary significantly over time. The information and associated advice and recommendations may become invalid before the “valid until” date.</p><p>Hot Zone Reports are based largely on Mountain Information Network submissions from this area. You can help by reporting your observations using the <a href="http://www.avalanche.ca/mountain-information-network">Mountain Information Network.</a></p><p>All users, but especially those with little or no avalanche training are advised to be familiar with and utilize avalanche risk reduction procedures at all times to lower the chance of an avalanche accident and reduce the severity of consequences if one does occur.</p><p>Even if all the information in this report is correct and you follow all the recommendations in this Hot Zone Report and apply all <a href="http://res.cloudinary.com/avalanche-ca/image/upload/v1458593761/Avalanche_Risk_Reduction_Procedures_mcidhq.pdf">avalanche risk reduction procedures</a>, you can still be caught in an avalanche. Ensure all members of your party have an avalanche transceiver, probe, and shovel on their person at all times; that everyone has been trained in and practiced the use of avalanche rescue gear; and that all rescue equipment is well maintained and has been tested. </p><p>If you have questions or concerns about Hot Zone Reports or want to learn more about how to get a Hot Zone Report in your area, contact: Avalanche Canada’s Public Avalanche Warning Service Manager, Karl Klassen at <a href="mailto:kklassen@avalanche.ca">kklassen@avalanche.ca.</a></p>',
      noDataSummary: '<p>Hot Zone Reports rely on regular and numerous Mountain Information Network posts to provide the data required to produce a report. No or few MIN posts means no Hot Zone Report. You can support your local Hot Zone Report by regularly submitting to the MIN. Submissions that contain weather, snowpack, and avalanche information are best but you don’t need to be an advanced or expert user to help: quick reports are fast and easy and they provide useful information, especially if accompanied by photos and comments.</p><p>At all times, a conservative and cautious approach to travel in or through avalanche terrain is strongly recommended. In particular <a href="http://res.cloudinary.com/avalanche-ca/image/upload/v1458593761/Avalanche_Risk_Reduction_Procedures_mcidhq.pdf">avalanche risk reduction procedures</a>, which should be considered at all times by all users, should be even more rigorously applied by everyone in areas where or at times when little data is available.</p><p>If you have questions or concerns about Hot Zone Reports or want to learn more about how to get a Hot Zone Report in your area, contact: Avalanche Canada’s Public Avalanche Warning Service Manager, Karl Klassen at <a href="mailto:kklassen@avalanche.ca">kklassen@avalanche.ca.</a></p>'
    };

    return {
      criticalFactors: acFormUtils.buildReport(criticalFactors),
      terrainAvoidanceList: acFormUtils.buildReport(terrainAvoidanceList),
      travelAdvice: acFormUtils.buildReport(travelAdvice),
      staticInfo: staticInfo
    };
  });
