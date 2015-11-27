'use strict';

angular.module('acComponents.filters')
    .filter('dateUtc', function () {
        return function (datePST, format) {
            if (datePST) {
                return moment.utc(datePST).format(format) ;
            }
        };
    })
  .filter('dateformat', function(){
    return function formatDate(datetimeString){
      var datetime = moment(datetimeString);
      var offset = moment.parseZone(datetimeString).zone();
      var prefixes = {
        480: 'P',
        420: 'M',
        360: 'C',
        300: 'E',
        240: 'A',
        180: 'N'
      };
      var suffix = datetime.isDST() ? 'DT' : 'ST';
      var zoneAbbr = 'UTC';

      if(offset in prefixes) {
        zoneAbbr = prefixes[offset] + suffix;
        datetime.subtract(offset, 'minutes');
      }

      return datetime.format('MMM Do, YYYY [at] HH:mm [' + zoneAbbr + ']')
    }
  });
