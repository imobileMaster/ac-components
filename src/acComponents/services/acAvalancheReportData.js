angular.module('acComponents.services')
  .service('acAvalancheReportData', function() {

    this.avalancheData = {

      avalancheObsComment: {
        prompt: 'Avalanche Observation Comment',
        type: 'textarea',
        value: '',
        helpText: 'Please add additional information, for example terrain, aspect, elevation etc. especially if describing many avalanches together.'
      },

      avalancheOccurrenceDate: {
        prompt: 'Avalanche Observation Date',
        type: 'date',
        selected: null
      },

      avalancheOccurrenceTime: {
        prompt: 'Avalanche Observation Time',
        type: 'time',
        selected: null
      },

      avalancheOccurrenceEpoch: {
        prompt: 'Avalanche Observation Datetime',
        type: 'datetime',
        selected: null
      },

      avalancheNumber: {
        prompt: 'Number of avalanches in this report',
        type: 'single',
        options: ['1', '2-5', '6-10', '11-50', '51-100'],
        selected: null
      },

      avalancheSize: {
        prompt: 'Avalanche Size',
        type: 'single',
        options: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
        selected: null,
        helpText: 'Use Canadian size classification. Size 1 is relatively harmless to people. Size 2 can bury, injure or kill a person. Size 3 can bury and destroy a car. Size 4 can destroy a railway car. Size 5 can destroy 40 hectartes of forest.'
      },

      slabThinckness: {
        type: 'number',
        prompt: 'Slab Thickness (centimetres)',
        options: {
          min: 10,
          max: 500,
          step: 10
        }
      },

      slabWidth: {
        type: 'number',
        prompt: 'Slab Width (meters)',
        options: {
          min: 1,
          max: 3000,
          step: 100
        }
      },

      runLength: {
        type: 'number',
        prompt: 'Run length (meters)',
        options: {
          min: 1,
          max: 10000,
          step: 100
        },
        helpText: 'Length from crown to toe of debris.'
      },

      avalancheCharacter: {
        type: 'multiple',
        prompt: 'Avalanche Character',
        options: {
          'Loose wet': false,
          'Loose dry': false,
          'Storm slab': false,
          'Persistent slab': false,
          'Deep persistent slab': false,
          'Wet slab': false,
          'Cornice only': false,
          'Cornice with slab': false
        }
      },

      triggerType: {
        type: 'multiple',
        prompt: 'Trigger Type',
        options: {
          'Natural': false,
          'Skier': false,
          'Snowmobile': false,
          'Other vehicle': false,
          'Helicopter': false,
          'Explosives': false
        }
      },

      triggerSubtype: {
        type: 'multiple',
        prompt: 'Trigger Subtype',
        options: {
          'Accidental': false,
          'Intentional': false,
          'Remote': false
        },
        helpText: 'A remote trigger is when the avalanche starts some distance away from where the trigger was  applied.'
      },

      triggerDistance: {
        type: 'number',
        prompt: 'Remote Trigger Distance (metres)',
        options: {
          min: 0,
          max: 2000,
          step: 50
        },
        helpText: 'If a remote trigger, enter how far from the trigger point is the nearest part of the crown.'
      },

      startZoneAspect: {
        type: 'multiple',
        prompt: 'Start Zone Aspect',
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

      startZoneElevationBand: {
        prompt: 'Start Zone Elevation Band',
        type: 'single',
        options: ['Alpine', 'Treeline', 'Below Treeline'],
        selected: null
      },


      startZoneElevation: {
        type: 'number',
        prompt: 'Start Zone Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 5000,
          step: 50
        }
      },

      startZoneIncline: {
        type: 'number',
        prompt: 'Start Zone Incline',
        options: {
          min: 0,
          max: 90,
          step: 5
        }
      },

      runoutZoneElevation: {
        type: 'number',
        prompt: 'Runout Zone Elevation (metres above sea level)',
        options: {
          min: 0,
          max: 5000,
          step: 50
        },
        helpText: 'The lowest point of the debris.'
      },

      weakLayerBurialDate: {
        prompt: 'Weak Layer Burial Date',
        type: 'date',
        selected: null,
        helpText:'Date the weak layer was buried.'
      },

      weakLayerCrystalType: {
        type: 'multiple',
        prompt: 'Weak Layer Crystal Type',
        options: {
          'Surface hoar': false,
          'Facets': false,
          'Surface hoar and facets': false,
          'Depth hoar': false,
          'Storm snow': false
        }
      },

      crustNearWeakLayer:{
        prompt: 'Crust Near Weak Layer',
        type: 'single',
        options: ['Yes', 'No'],
        selected: null
      },

      windExposure: {
        type: 'multiple',
        prompt: 'Wind Exposure',
        options: {
          'Lee slope': false,
          'Windward slope': false,
          'Down flow': false,
          'Cross-loaded slope': false,
          'Reverse-loaded slope': false,
          'No wind exposure': false
        }
      },

      vegetationCover: {
        type: 'multiple',
        prompt: 'Vegetation cover',
        options: {
          'Open slope': false,
          'Sparse trees or gladed slope': false,
          'Dense trees': false
        }
      }

    };
  });
