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

    var alpineTerrainAvoidance = {

      aspect: {
        type: 'checkbox',
        prompt: 'Aspect:',
        options: {
          'All': false,
          'N': false,
          'NE': false,
          'E': false,
          'SE': false,
          'S': false,
          'SW': false,
          'W': false,
          'NW': false
        },
        inline: true,
        order: 1
      },

      terrainFeatures: {
        type: 'checkbox',
        prompt: 'Alpine terrain features:',
        options: {
          'Convex': false,
          'Unsupported': false,
          'Lee slopes': false,
          'Crossloaded slopes': false,
          'Shallow snowpack': false,
          'Variable depth snowpack': false
        },
        inline: true,
        order: 7
      },

      terrainAvoidanceComments: {
        prompt: 'Travel advice:',
        type: 'textarea',
        value: null,
        order: 10
      }

    };

    var treelineTerrainAvoidance = {

      aspect: {
        type: 'checkbox',
        prompt: 'Aspect:',
        options: {
          'All': false,
          'N': false,
          'NE': false,
          'E': false,
          'SE': false,
          'S': false,
          'SW': false,
          'W': false,
          'NW': false
        },
        inline: true,
        order: 1
      },

      terrainFeatures: {
        type: 'checkbox',
        prompt: 'Treeline terrain features:',
        options: {
          'Convex': false,
          'Unsupported': false,
          'Lee slopes': false,
          'Crossloaded slopes': false,
          'Shallow snowpack': false,
          'Variable depth snowpack': false
        },
        inline: true,
        order: 7
      },

      terrainAvoidanceComments: {
        prompt: 'Travel advice:',
        type: 'textarea',
        value: null,
        order: 10
      }

    };

    var belowTreelineTerrainAvoidance = {

      aspect: {
        type: 'checkbox',
        prompt: 'Aspect:',
        options: {
          'All': false,
          'N': false,
          'NE': false,
          'E': false,
          'SE': false,
          'S': false,
          'SW': false,
          'W': false,
          'NW': false
        },
        inline: true,
        order: 1
      },

      terrainFeatures: {
        type: 'checkbox',
        prompt: 'Below treeline terrain features:',
        options: {
          'Convex': false,
          'Unsupported': false,
          'Lee slopes': false,
          'Creeks': false,
          'Runout zones': false,
          'Cutblocks': false
        },
        inline: true,
        order: 7
      },

      terrainAvoidanceComments: {
        prompt: 'Travel advice:',
        type: 'textarea',
        value: null,
        order: 10
      }

    };

    var staticInfo = {
      infoSummary: '<p>Hot Zone Reports are being tested as pilot projects in some regions. After testing is complete, Avalanche Canada will determine whether to continue producing Hot Zone Reports.</p><p>Hot Zone Reports are not the equivalent of a daily avalanche forecast. They are general summaries of local conditions and provide general risk management advice for users who have enough training and knowledge to recognize avalanche terrain and use the information here as part of their risk management process.</p><p>Conditions may vary significantly over space so the boundaries of this Hot Zone Report as shown on the map should not be taken literally. They are a general representation of the area within which the information and advice contained in the report may be applicable. Conditions may vary significantly over time. The information and associated advice and recommendations may become invalid before the “valid until” date.</p><p>Hot Zone Reports are based largely on Mountain Information Network submissions from this area. You can help by reporting your observations using the <a href="http://www.avalanche.ca/mountain-information-network">Mountain Information Network.</a></p><p>All users, but especially those with little or no avalanche training are advised to be familiar with and utilize avalanche risk reduction procedures at all times to lower the chance of an avalanche accident and reduce the severity of consequences if one does occur.</p><p>Even if all the information in this report is correct and you follow all the recommendations in this Hot Zone Report and apply all <a href="http://res.cloudinary.com/avalanche-ca/image/upload/v1458593761/Avalanche_Risk_Reduction_Procedures_mcidhq.pdf">avalanche risk reduction procedures</a>, you can still be caught in an avalanche. Ensure all members of your party have an avalanche transceiver, probe, and shovel on their person at all times; that everyone has been trained in and practiced the use of avalanche rescue gear; and that all rescue equipment is well maintained and has been tested. </p><p>If you have questions or concerns about Hot Zone Reports or want to learn more about how to get a Hot Zone Report in your area, contact: Avalanche Canada’s Public Avalanche Warning Service Manager, Karl Klassen at <a href="mailto:kklassen@avalanche.ca">kklassen@avalanche.ca.</a></p>',
      noDataSummary: '<p>Hot Zone Reports rely on regular and numerous Mountain Information Network posts to provide the data required to produce a report. No or few MIN posts means no Hot Zone Report. You can support your local Hot Zone Report by regularly submitting to the MIN. Submissions that contain weather, snowpack, and avalanche information are best but you don’t need to be an advanced or expert user to help: quick reports are fast and easy and they provide useful information, especially if accompanied by photos and comments.</p><p>At all times, a conservative and cautious approach to travel in or through avalanche terrain is strongly recommended. In particular <a href="http://res.cloudinary.com/avalanche-ca/image/upload/v1458593761/Avalanche_Risk_Reduction_Procedures_mcidhq.pdf">avalanche risk reduction procedures</a>, which should be considered at all times by all users, should be even more rigorously applied by everyone in areas where or at times when little data is available.</p><p>If you have questions or concerns about Hot Zone Reports or want to learn more about how to get a Hot Zone Report in your area, contact: Avalanche Canada’s Public Avalanche Warning Service Manager, Karl Klassen at <a href="mailto:kklassen@avalanche.ca">kklassen@avalanche.ca.</a></p>'
    };

    return {
      criticalFactors: acFormUtils.buildReport(criticalFactors),
      alpineTerrainAvoidance: acFormUtils.buildReport(alpineTerrainAvoidance),
      treelineTerrainAvoidance: acFormUtils.buildReport(treelineTerrainAvoidance),
      belowTreelineTerrainAvoidance: acFormUtils.buildReport(belowTreelineTerrainAvoidance),
      staticInfo: staticInfo
    };
  });
