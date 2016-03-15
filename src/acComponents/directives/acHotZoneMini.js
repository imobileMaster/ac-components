angular.module('acComponents.directives')
    .directive('acHotZoneMini', function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'hot-zone-mini.html',
            scope: {
              hotZone: '=acHotZone',
              region: '=acRegion'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;
                $scope.infoSummary = '<p>Hot Zone Reports are being tested as pilot projects in some regions. After testing is complete, Avalanche Canada will determine whether to continue producing Hot Zone Reports.</p><p>Hot Zone Reports are not the equivalent of a daily avalanche forecast. They are general summaries of local conditions and provide general risk management advice for users who have enough training and knowledge to recognize avalanche terrain and use the information here as part of their risk management process.</p><p>Conditions may vary significantly over space so the boundaries of this Hot Zone Report as shown on the map should not be taken literally. They are a general representation of the area within which the information and advice contained in the report may be applicable. Conditions may vary significantly over time. The information and associated advice and recommendations may become invalid before the “valid until” date.</p><p>Hot Zone Reports are based largely on Mountain Information Network submissions from this area. You can help by reporting your observations using the <a href="http://www.avalanche.ca/mountain-information-network">Mountain Information Network.</a></p><p>All users, but especially those with little or no avalanche training are advised to be familiar with and utilize avalanche risk reduction procedures at all times to lower the chance of an avalanche accident and reduce the severity of consequences if one does occur.</p><p>Even if all the information in this report is correct and you follow all the recommendations in this Hot Zone Report and apply all avalanche risk reduction procedures, you can still be caught in an avalanche. Ensure all members of your party have an avalanche transceiver, probe, and shovel on their person at all times; that everyone has been trained in and practiced the use of avalanche rescue gear; and that all rescue equipment is well maintained and has been tested. </p><p>If you have questions or concerns about Hot Zone Reports or want to learn more about how to get a Hot Zone Report in your area, contact: Avalanche Canada’s Public Avalanche Warning Service Manager, Karl Klassen at <a href="mailto:kklassen@avalanche.ca">kklassen@avalanche.ca.</a></p>';
            }
        };
    });
;
