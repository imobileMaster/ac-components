angular.module('acComponents.services')
  .factory('acReportData', function(acQuickReportData, acAvalancheReportData, acSnowpackReportData, acWeatherReportData, acIncidentReportData) {

    return {
      quick: acQuickReportData,
      avalanche: acAvalancheReportData,
      snowpack: acSnowpackReportData,
      weather: acWeatherReportData,
      incident: acIncidentReportData
    };

  });
