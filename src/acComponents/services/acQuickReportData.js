angular.module('acComponents.services')
    .service('acQuickReportData', function() {
        this.avalancheConditions = {
            'slab': false,
            'sound': false,
            'snow': false,
            'temp': false
        };

        this.ridingConditions = {
            ridingQuality: {
                prompt: 'Riding quality was:',
                type: 'single',
                options: ['Amazing', 'Good', 'OK', 'Terrible'],
                selected: null
            },

            snowConditions: {
                type: 'multiple',
                prompt: 'Snow conditions were:',
                options: {
                    'Crusty': false,
                    'Powder': false,
                    'Deep powder': false,
                    'Wet': false,
                    'Heavy': false,
                    'Wind affected': false,
                    'Hard': false
                }
            },

            rideType: {
                type: 'multiple',
                prompt: 'We rode:',
                options: {
                    'Mellow slopes': false,
                    'Steep slopes': false,
                    'Convex slopes': false,
                    'Sunny slopes': false,
                    'Cut-blocks': false,
                    'Open trees': false,
                    'Dense trees': false,
                    'Alpine slopes': false
                }
            },

            stayedAway: {
                type: 'multiple',
                prompt: 'We stayed away from:',
                options: {
                    'Steep slopes': false,
                    'Convex slopes': false,
                    'Sunny slopes': false,
                    'Cut-blocks': false,
                    'Open trees': false,
                    'Alpine slopes': false
                }
            },

            weather: {
                type: 'multiple',
                prompt: 'The day was:',
                options: {
                    'Stormy': false,
                    'Windy': false,
                    'Sunny': false,
                    'Cold': false,
                    'Warm': false,
                    'Cloudy': false,
                    'Foggy': false,
                    'Wet': false
                }
            }
        };


        // this function is different from the other isCompleted functions because we had to preserve the form of the service
        // in order to keep the functionality of the mobile app.
        this.isCompleted = function (fields) {

          var avalancheConditionsCompleted = checkedOption(fields.avalancheConditions);

          var ridingConditionsCompleted = _.reduce(fields.ridingConditions, function (total, item, key) {
            if (item.type === 'single' && !_.isEmpty(item.selected)) {
              total++;
            } else if (item.type === 'multiple') {
              var itemCompleted = checkedOption(item.options);

              if (itemCompleted > 0) {
                total++;
              }
            }

            return total;
          }, 0);

          var commentCompleted = !_.isEmpty(fields.comment) ? 1 : 0;

          return avalancheConditionsCompleted + ridingConditionsCompleted + commentCompleted > 0;

          function checkedOption (collection) {
            return _.reduce(collection, function (total, value) {
              return total + value ? 1 : 0;
            }, 0);
          }
        };
  }
    );
