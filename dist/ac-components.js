(function() {


// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('acComponents.config', [])
    .value('acComponents.config', {
        debug: true
    })
    .value('acConfig',{
        reportTypes : ['quick', 'avalanche', 'snowpack', 'weather', 'incident'],
        minFilters: ['avalanche', 'quick', 'snowpack', 'incident', 'weather'],
        dateFilters : ['1-days','3-days', '7-days','14-days', '30-days'],
        maxZoom: 20
  })
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-min.elasticbeanstalk.com');
    //.constant('AC_API_ROOT_URL', 'http://localhost:9000');

// Modules
angular.module('acComponents.controllers', []);
angular.module('acComponents.directives', []);
angular.module('acComponents.filters', []);
angular.module('acComponents.services', []);
angular.module('acComponents',
    [
        'acComponents.config',
        'acComponents.controllers',
        'acComponents.directives',
        'acComponents.filters',
        'acComponents.services',
        'acComponents.templates',
        'ngSanitize'
    ]);

'use strict';

angular.module('acComponents.controllers')
  .controller('acBackModal', ["$scope", "$modalInstance", function ($scope, $modalInstance) {

    $scope.discardAndExit = function () {
      $modalInstance.close(true);
    };

    $scope.stayOnThePage = function () {
      $modalInstance.dismiss();
    };

  }]);

'use strict';

angular.module('acComponents.controllers')
  .controller('acMapModal', ["$scope", "$modalInstance", "latlng", "$timeout", function ($scope, $modalInstance, latlng, $timeout) {

    $scope.params = {
      latlng: latlng
    };

    $scope.save = function () {
      $scope.params.latlng[0] = $scope.params.latlng[0].toFixed(5);
      $scope.params.latlng[1] = $scope.params.latlng[1].toFixed(5);
      $modalInstance.close($scope.params.latlng);
    };

    $modalInstance.opened.then(function () {
      $timeout( function () {
        $scope.show = true;
      }, 0);
    })
  }]);

angular.module('acComponents.directives')
  .directive('acAllminIcon', function () {
    return {
      replace: true,
      templateUrl: 'allmin-icon.html',
      link: function ($scope, el, attrs) {

      }
    };
  });

angular.module('acComponents.directives')
    .directive('acDangerIcon', function () {
        return {
            replace: true,
            templateUrl: 'danger-icon.html',
            link: function ($scope, el, attrs) {
                
            }
        };
    });
angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return {
          scope: {
            showOnlyDate: '=',
            showOnlyTime: '=',
            maxDateToday: '=',
            minDateToday: '='
          },
          link: function (scope, el) {
            if(jQuery().datetimepicker) {


              var options = {
                maxDate: (scope.maxDateToday === true) ? new Date() : new Date(new Date().setYear(new Date().getFullYear() + 1)),
                minDate: (scope.minDateToday === true) ? new Date() : new Date(new Date().setYear(new Date().getFullYear() + 1)),
                pickTime: !scope.showOnlyDate,
                format: (scope.showOnlyTime ? 'LT' : scope.showOnlyDate ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"),
                pickDate: scope.showOnlyTime ? !scope.showOnlyTime : true
              };

              el.datetimepicker(options);

              jQuery(window).scroll(function() {
                if(el.data("DateTimePicker") !== undefined) {
                    el.data("DateTimePicker").hide();
                }
              });
            }
          }
        }
    });

angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            scope: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
              $scope.drawerPosition = attrs.acDrawerPosition;
            }
        };
    });

angular.module('acComponents.directives')
  .directive('acEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.acEnter);
          });

          event.preventDefault();
        }
      });
    };
});

angular.module('acComponents.directives')
    .directive('acForecastMini', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast',
                dangerRating: '=dangerRating',
                disclaimer: '=disclaimer',
                sponsor: '=sponsor'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;
            }
        };
    }])
    .directive('acForecastMiniExternal', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-external.html',
            scope: { forecast: '=' },
        };
    }])
    .directive('acForecastMiniParks', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-parks.html',
            scope: { forecast: '=' },
        };
    }])
    .directive('acForecastMiniAvalx', ["$state", "$stateParams", "AC_API_ROOT_URL", function ($state, $stateParams, AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'forecast-mini-avalx.html',
            scope: {
                forecast: '=',
                dangerRating: '=',
                disclaimer: '=',
                sponsor: '='
            },
            link: function ($scope, el, attrs) {
                $scope.closeDrawer = function () {
                    $scope.forecast = null;
                    if($stateParams.regionid) {
                        $state.go('ac.map', {regionid: null}, {notify:false, reload:false});
                    }
                }
            }
        };
    }])
    .directive('whistlerLinks', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            restrict: 'E',
            templateUrl: 'wbc-links.html'
        };
    }]);
;

angular.module('acComponents.directives')
    .directive('acHotZoneMini', ["$state", "$stateParams", "acHotZoneReportData", function ($state, $stateParams, acHotZoneReportData) {
        return {
            templateUrl: 'hot-zone-mini.html',
            scope: {
              hotZone: '=acHotZone',
              region: '=acRegion',
              sponsor: '=sponsor'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');

                angular.extend($scope, {
                    infoSummary: acHotZoneReportData.staticInfo.infoSummary,
                    noDataSummary: acHotZoneReportData.staticInfo.noDataSummary,
                    formatDate: function (date) {
                        if (date) {
                            return new Date(date);
                        }
                        return date;
                    },
                    viewFullPage: function (id) {
                        var url = $state.href('ac.hzr', { subid:id });
                        window.open(url, '_blank');
                    },
                    closeDrawer: function () {
                        $scope.hotZone = null;
                        if($stateParams.regionid) {
                            $state.go('ac.map', {regionid: null}, {notify:false, reload:false});
                        }
                    }
                });
            }
        };
    }]);
;

angular.module('acComponents.directives')
    .directive('acHotZoneReportForm', ["$state", "$rootScope", "$q", "$timeout", "acBreakpoint", "acReportData", "acFormUtils", "acHZRSubmission", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "store", "$anchorScroll", "$modal", "ngToast", function($state, $rootScope, $q, $timeout, acBreakpoint, acReportData, acFormUtils, acHZRSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store, $anchorScroll, $modal, ngToast) {
        return {
            templateUrl: 'hot-zone-report-form.html',
            replace: true,
            scope: {
                hotZones: '=acHotZones'
            },
            link: function($scope, el, attrs) {

                resetFields();
                initReport();

                $scope.scrollToTop = function () {
                  $anchorScroll.yOffset = 100;
                  $anchorScroll('top');
                };

                function initReport() {
                  $scope.report = {
                    headline: '',
                    dateissued: moment().format('YYYY-MM-DD hh:mm A'),
                    datevalid: moment().format('YYYY-MM-DD hh:mm A'),
                    hotzoneid: null,
                    files: [],
                    data: {
                      criticalFactors: acReportData.hotzone.criticalFactors,
                      alpineTerrainAvoidance: acReportData.hotzone.alpineTerrainAvoidance,
                      treelineTerrainAvoidance: acReportData.hotzone.treelineTerrainAvoidance,
                      belowTreelineTerrainAvoidance: acReportData.hotzone.belowTreelineTerrainAvoidance
                    }
                  };
                }

                function resetForm() {
                    $timeout(function () {
                        resetFields();
                        initReport();
                        $scope.submitting = false;
                        $scope.error = false;
                    }, 0);
                }

                function resetFields() {
                  acReportData.hotzone.criticalFactors.reset();
                  acReportData.hotzone.alpineTerrainAvoidance.reset();
                  acReportData.hotzone.treelineTerrainAvoidance.reset();
                  acReportData.hotzone.belowTreelineTerrainAvoidance.reset();
                }

                $scope.resetForm = resetForm;

                $scope.goBack = function (formDirty) {
                      resetFields();
                      initReport();
                      $state.go('ac.map');
                };

                $scope.checkAll = function (key, items) {
                    if (key === 'All' && items[key]) {
                        for (var key in items) {
                            items[key] = true;
                        }
                    } else if (key === 'All' && !items[key]) {
                        for (var key in items) {
                            items[key] = false;
                        }
                    } else if (items['All']) {
                        items['All'] = false;
                    }
                };

                $scope.submitForm = function() {
                    if (!$scope.report.hotzoneid) {
                        $scope.invalidLocation = true;
                        return;
                    }

                    var reqObj = _.cloneDeep($scope.report);

                    reqObj.data = _.reduce($scope.report.data, function(total, item, key){
                        if (item.isCompleted()){
                          total[key] = item.getDTO();
                        }
                        return total;
                    }, {});

                    var token = store.get('token');
                    if (token) {
                        $scope.submitting = true;
                        return acHZRSubmission.submit(reqObj, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $state.go('ac.map');
                                ngToast.create({
                                  content: 'Your report was successfully submitted.',
                                  class: 'alert alert-success',
                                  dismissOnTimeout: true,
                                  dismissButton: true,
                                  dismissButtonHtml: '&times;'
                                });


                                return result;
                            } else {
                                $scope.submitting = false;
                                $scope.error = true;
                                return $q.reject('error');
                            }
                        }, function(err) {
                            $scope.submitting = false;
                            $scope.error = true;
                            $scope.errormsg = err;
                            return $q.reject(err);
                        });
                    } else {
                        return $q.reject('auth-error');
                    }
                };

            }
        };
    }]);

angular.module('acComponents.directives')
    .directive('acHotZoneReportFullPage', ["acHotZoneReportData", function (acHotZoneReportData) {
        return {
            templateUrl: 'hot-zone-report-fullpage.html',
            scope: {
                report: '=report',
                sponsor: '=sponsor'
        },
        link: function ($scope, el, attrs) {
            el.addClass('ac-observation-drawer');
            angular.extend($scope, {
                infoSummary: acHotZoneReportData.staticInfo.infoSummary,
                print: function () {
                    window.print();
                },
                formatDate: function (date) {
                    if (date) {
                        return new Date(date);
                    }
                    return date;
                }
            });
        }
    };
}]);

angular.module('acComponents.directives')
    .directive('acLoadingIndicator', function () {
        return {
            templateUrl: 'loading-indicator.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.directives')
    .directive('acLocationSelect', ["MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "$timeout", function(MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $timeout) {
        return {
            scope: {
                latlng: '='
            },
            link: function($scope, el, attrs) {
                var map, marker;
                L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;

                function setLatlng(latlng){
                    $timeout(function () {
                        $scope.latlng = [latlng.lat, latlng.lng];
                    }, 0);
                }

                $('#minForm').on('shown.bs.modal', function (e) {
                    map.invalidateSize();
                });

                map = L.mapbox.map(el[0], MAPBOX_MAP_ID, {
                    attributionControl: false,
                    scrollWheelZoom: true
                }).on('click', function (e) {
                    if (!marker) {
                        setLatlng(e.latlng);
                        createMarker (e.latlng);

                    } else if(marker && !map.hasLayer(marker)) {
                        setLatlng(e.latlng);
                        marker
                            .setLatLng(e.latlng)
                            .addTo(map)
                            .openPopup();
                    }
                });

                map.setView([52.3, -120.74966], 5);

                var watch = $scope.$watch('latlng', function (latlng) {
                    var location;
                    if (marker && latlng.length === 0) {
                        map.removeLayer(marker);
                    } else if (!marker && latlng.length > 0) {
                        location = L.latLng(latlng[0], latlng[1]);
                        createMarker(location);
                        map.panTo(location);
                    } else if (marker && latlng.length > 0) {
                        location = L.latLng(latlng[0], latlng[1]);
                        marker.setLatLng(location);
                        setPopupContent(location);
                        map.panTo(location);
                    }
                });

                $scope.$on('$destroy', function () {
                  watch();
                });

                function setPopupContent(location) {
                  marker.setPopupContent('Position: ' + location.toString().substr(6) + '<br/>(drag to relocate)');
                  marker.openPopup();
                }

                function createMarker (latlng) {
                    marker = L.marker(latlng, {
                      icon: L.mapbox.marker.icon({
                        'marker-color': '4B6D6F'
                      }),
                      draggable: true
                    });

                    marker.bindPopup('Position: ' + latlng.toString().substr(6) + '<br/>(drag to relocate)')
                      .addTo(map)
                      .openPopup();

                    marker.on('dragend', function(e) {
                      var location = marker.getLatLng();
                      setPopupContent(location);
                      setLatlng(location);
                    });
                  }
            }
        };
    }]);

angular.module('acComponents.directives')
  .directive('acMapboxMap', ["$rootScope", "$window", "$location", "$timeout", "$state", "acBreakpoint", "acObservation", "acForecast", "acSubmission", "acHZRSubmission", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "$stateParams", "acConfig", "localStorageService", function ($rootScope, $window, $location, $timeout, $state, acBreakpoint, acObservation, acForecast, acSubmission, acHZRSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $stateParams, acConfig, localStorageService) {
    return {
      template: '<div id="map"></div>',
      replace: true,
      scope: {
        region: '=acRegion',
        regions: '=acRegions',
        showRegions: '=acShowRegions',
        showHotZones: '=acShowHotZones',
        obs: '=acObs',
        ob: '=acOb',
        minFilters: '=acMinFilters',
        currentReport: '=acReport',
        activeHotZones: '=acActiveHotZones'
      },
      link: function ($scope, el, attrs) {
        $scope.device = {};
        $scope.showRegions = $scope.showRegions || true;
        $scope.showHotZones = $scope.showHotZones || true;
        $scope.visibleObs = [];

        var mapConfig = {
          maxZoom: acConfig.maxZoom,
          mapSetup: {
            attributionControl: false,
            center: [52.3, -120.74966],
            maxZoom: acConfig.maxZoom,
            minZoom: 4,
            zoom: 6,
            zoomControl: false
          },
          cluster:{
            iconCreateFunction: createClusterIcon,
            zoomToBoundsOnClick: false
          },
          setFeatureLayer: function (lat, lng, type, subid){
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lat, lng]
              },
              extra: {subid: subid},
              properties: {
                'marker-size': 'small',
                'marker-color': getMarkerColor(type),
                zIndexOffset: 1000
              }
            }
          }
        };

        if($location.path().indexOf('focus') !== -1) {
          mapConfig.mapSetup.zoom = localStorageService.get('mapZoom') || mapConfig.mapSetup.zoom;
          mapConfig.mapSetup.center = localStorageService.get('mapCenter') || mapConfig.mapSetup.center;
        }

        var layers = {
          dangerIcons: L.featureGroup(),
          hotZoneMarkers: L.featureGroup(),
          regions: L.layerGroup()
        };
        var styles = {
          region: {
            default: {
              fillColor: 'transparent',
              color: 'transparent'
            },
            selected: {
              fillColor: '#489BDF'
            },
            hover: {
              color: '#B43A7E'
            },
            selectedhover: {
              fillColor: '#489BDF',
              color: '#B43A7E'
            }
          },
          reportType: {
            incident: '#F44336',
            quick: '#4CAF50',
            avalanche: '#03A9F4',
            snowpack: '#3F51B5',
            weather: '#FFC107'
          },
          clusterColor: '#607D8B'
        };

        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
        var map = L.mapbox.map(el[0].id, MAPBOX_MAP_ID, mapConfig.mapSetup);
        var clusterOverlays = L.layerGroup().addTo(map);

        addMapControls();

        function addMapControls(){
          L.control.locate({
            locateOptions: {
              maxZoom: mapConfig.maxZoom
            },
            position: 'bottomright'
          }).addTo(map);

          new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
        }


        acBreakpoint.setBreakpoints({
          xs: 480,
          sm: 600,
          md: 1025
        });

        $rootScope.$on('breakpoint', function (e, breakpoint) {
          $scope.device.size = breakpoint;
        });

        function getInvalidateSize(topOffset) {
          return function () {
            el.height($($window).height() - Number(topOffset));
            map.invalidateSize();
          }
        }

        if (attrs.topOffset) {
          var offset = Number(attrs.topOffset);
          var invalidateSize = getInvalidateSize(offset);

          angular.element(document).ready(invalidateSize);
          angular.element($window).bind('resize', invalidateSize);
        }

        function getDangerIcon(options) {
          var size = map.getZoom() <= 6 ? 60 : 80;
          return L.icon({
            iconUrl: options.iconUrl || acForecast.getDangerIconUrl(options.regionId),
            iconSize: [size, size],
            labelAnchor: [6, 0]
          });
        }

        function getHotZoneIcon(type) {
          var size = map.getZoom() <= 6 ? 60 : 80;
          return L.icon({
            iconUrl: '/api/hzr/' + type + '/icon.svg',
            iconSize: [size, size],
            labelAnchor: [6, 0]
          });
        }

        function showRegion(layer) {
          if (map.getZoom() < 9) {
            var padding = getMapPadding();

            map.fitBounds(layer.getBounds(), {
              paddingBottomRight: padding
            });
          }

          layers.currentRegion = layer;

          $scope.$apply(function () {
            $scope.region = layer;
          });
        }

        function initRegionsLayer() {
          L.geoJson($scope.regions, {
            style: function (feature) {
              return styles.region.default;
            },
            onEachFeature: function (featureData, layer) {

              if (!isHotZone(layer.feature)) {
                layer.bindLabel(featureData.properties.name);

                layer.on('click', function (evt) {
                  showRegion(layer);
                  $state.go('ac.forecast', {regionid: layer.feature.id || layer.feature.properties.id}, {notify:false, reload:false});
                });

                layer.on('mouseover', function () {
                  if (layers.currentRegion && layer == layers.currentRegion) {
                    layer.setStyle(styles.region.selectedhover);
                  } else {
                    layer.setStyle(styles.region.hover);
                  }
                });

                layer.on('mouseout', function () {
                  if (layers.currentRegion && layer == layers.currentRegion) {
                    layer.setStyle(styles.region.selected);
                  } else {
                    layer.setStyle(styles.region.default);
                  }
                });
                layers.regions.addLayer(layer);
              }

              if (featureData.properties.centroid) {
                var centroid = L.latLng(featureData.properties.centroid[1], featureData.properties.centroid[0]);

                var marker = L.marker(centroid);
                var icon;

                if (isHotZone(layer.feature)) {
                  var type = hotZoneActive(layer.feature) ? 'active' : 'inactive';
                  icon = getHotZoneIcon(type);
                  marker.options.id = featureData.properties.id;
                  layers.hotZoneMarkers.addLayer(marker);
                } else {
                  icon = getDangerIcon({regionId: featureData.id});
                  layers.dangerIcons.addLayer(marker);
                }
                marker.setIcon(icon);
                var zindex = 1;
                marker.setZIndexOffset(zindex);

                if (isHotZone(layer.feature) && newHotZone(layer.feature)) {
                  marker.bindLabel('*New Hot Zone Report* ' + featureData.properties.name);
                } else {
                  marker.bindLabel(featureData.properties.name);
                }

                marker.on('click', function () {
                  showRegion(layer);
                  $state.go('ac.forecast', {regionid: layer.feature.id || layer.feature.properties.id}, {notify:false, reload:false});
                });
              }
            }
          });
          setTimeout(function() {
            if($location.path().indexOf('forecast') !== -1) {
              var currentLayer = _.findWhere(layers.regions.getLayers(), function (region) {
                return region.feature.id === $stateParams.regionid;
              });
              if (currentLayer) {
                showRegion(currentLayer);
                return;
              }
              var currentMarker = _.findWhere(layers.hotZoneMarkers.getLayers(), function (marker) {
                return marker.options.id === $stateParams.regionid;
              });
              if (currentMarker) {
                currentMarker.fire('click');
              }
            }
          }, 500);
          refreshLayers();
        }

        function refreshDangerIconsLayer() {
          layers.dangerIcons.eachLayer(function (dangerIconLayer) {
            var iconUrl = dangerIconLayer.options.icon.options.iconUrl;
            var icon = getDangerIcon({iconUrl: iconUrl});

            dangerIconLayer.setIcon(icon);
          });
        }

        function refreshLayers() {
          var zoom = map.getZoom();
          var regionsUpdated = false;

          if (layers.regions) {
            var regionsVisible = map.hasLayer(layers.regions);

            if (zoom < 6 && regionsVisible) {
              map.removeLayer(layers.regions);
            } else if (regionsVisible && !$scope.showRegions) {
              map.removeLayer(layers.regions);
            } else if (zoom >=6 && !regionsVisible && $scope.showRegions) {
              map.addLayer(layers.regions);
            }
          }

          if (layers.hotZoneMarkers) {
            var hotZonesVisible = map.hasLayer(layers.hotZoneMarkers);

            if (zoom < 6 && hotZonesVisible) {
              map.removeLayer(layers.hotZoneMarkers);
            } else if (zoom >=6 && hotZonesVisible && !$scope.showHotZones) {
              map.removeLayer(layers.hotZoneMarkers);
            } else if (zoom >= 6 && !hotZonesVisible && $scope.showHotZones) {
              map.addLayer(layers.hotZoneMarkers);
            }
          }

          if (layers.dangerIcons) {
            var dangerIconsVisible = map.hasLayer(layers.dangerIcons);

            if (zoom < 6 && dangerIconsVisible) {
              map.removeLayer(layers.dangerIcons);
            } else if (zoom >=6 && !dangerIconsVisible && $scope.showRegions) {
              map.addLayer(layers.dangerIcons);
            } else if (zoom >= 6 && dangerIconsVisible && !$scope.showRegions) {
              map.removeLayer(layers.dangerIcons);
            }

            var dangerIcon = layers.dangerIcons.getLayers()[0];
            if (dangerIcon) {
              var dangerIconSize = dangerIcon.options.icon.options.iconSize[0];
              if ((zoom > 6 && dangerIconSize === 60) || (zoom <= 6 && dangerIconSize === 80)) {
                refreshDangerIconsLayer();
              }
            }
          }

          var opacity = 0.2;
          if (layers.currentRegion && !isHotZone(layers.currentRegion.feature)) {
            if (zoom <= 9) {
              styles.region.selected.fillOpacity = opacity;
              layers.currentRegion.setStyle(styles.region.selected);
            } else if (zoom > 9 && zoom < 13) {
              switch (zoom) {
                case 10:
                  opacity = 0.15;
                  break;
                case 11:
                  opacity = 0.10;
                  break;
                case 12:
                  opacity = 0.05;
                  break;
              }
              styles.region.selected.fillOpacity = opacity;
              layers.currentRegion.setStyle(styles.region.selected);
            } else {
              layers.currentRegion.setStyle(styles.region.default);
            }
          }
        }

        function getMarkerColor(type) {
          if (_.isUndefined(type)){
            type = 'quick';
          }
          return styles.reportType[type];
        }

        function setReport(ob) {
          $rootScope.requestInProgress = true;

          acSubmission.getOne(ob.subid).then(function(results) {
            results.requested = ob.obtype;
            $scope.currentReport = results;
            $rootScope.requestInProgress = false;
          });

          map.setView(ob.latlng, map.getZoom());
          localStorageService.set('mapZoom', map.getZoom());
          localStorageService.set('mapCenter', map.getCenter());
        }

        function refreshObsLayer() {
          clusterOverlays.clearLayers();

          if ($scope.obs && $scope.obs.length > 0) {
            var markers = new L.markerClusterGroup(mapConfig.cluster).addTo(clusterOverlays);

            $scope.obs.map(function (ob) {

              var marker = L.mapbox.featureLayer(mapConfig.setFeatureLayer(ob.latlng[1], ob.latlng[0], ob.obtype, ob.subid))
                .setFilter(function () {
                  if (_.indexOf($scope.minFilters, ob.obtype) !== -1) {
                    return true;
                  } else {
                    return false;
                  }
                });
              marker.subid = ob.subid;

              marker.on('click', function (e) {
                setReport(ob);
                $state.go('ac.focus', {markerid: ob.subid}, {notify:false, reload:false});
              });

              marker.eachLayer(function (layer) {
                markers.addLayer(layer);
              });
              $scope.visibleObs.push(marker);
            });

            markers.on('clusterclick', function (e){
              var cluster = e.layer;

              if(cluster.multipleReports){
                cluster.zoomToBounds();
              }else{
                cluster.spiderfy();
              }
            });

            setTimeout(function() {
              if($location.path().indexOf('focus') !== -1) {
                var currentMarker = _.findWhere($scope.visibleObs, function (marker) {
                  return marker.subid === $stateParams.markerid;
                });
                setReport(_.findWhere($scope.obs, function (ob) {
                  return ob.subid === $stateParams.markerid;
                }));

                _.each(markers._featureGroup.getLayers(), function(cluster) {
                  if(typeof cluster.getAllChildMarkers === 'function') {
                    // run through the clusters and find a marker in the cluster.
                    _.each(cluster.getAllChildMarkers(), function(marker) {
                      _.each(currentMarker.getLayers(), function(layer) {
                        if(marker._latlng.lat === layer._latlng.lat && marker._latlng.lng === layer._latlng.lng) {
                          cluster.spiderfy();
                          return false;
                        }
                      });
                    });
                  }
                });
              }
            }, 500);

          } else {

            clusterOverlays.clearLayers();
          }

          refreshLayers();
        }

        function latLngToGeoJSON(latlng) {
          return {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat]
          };
        }

        function getMapPadding() {
          switch ($scope.device.size) {
            case 'xs':
              return L.point([0, 0]);
            case 'sm':
              return L.point([350, 0]);
            case 'md':
            case 'lg':
              return L.point([480, 0]);
            default:
              return L.point([0, 0]);
          }
        }

        function getMapOffset() {
          return getMapPadding().divideBy(2);
        }

        // offfset can be negative i.e. [-240, 0]
        function offsetLatLng(latlng, offset) {
          var point = map.latLngToLayerPoint(latlng);
          return map.layerPointToLatLng(point.subtract(offset));
        }

        function getMapCenter() {
          var offset = getMapOffset();
          return offsetLatLng(map.getCenter(), offset);
        }


        function setRegionFocus() {
          var regionLayers = layers.regions.getLayers();
          var mapCenter = getMapCenter();

          var region = _.find(regionLayers, function (r) {
            return gju.pointInPolygon(latLngToGeoJSON(mapCenter), r.feature.geometry);
          });

          if (!region) {
            region = _.min(regionLayers, function (r) {
              var centroid = L.latLng(r.feature.properties.centroid[1], r.feature.properties.centroid[0]);
              return centroid.distanceTo(mapCenter);
            });
          }

          if (region) setRegion(region);
        }

        function setRegion(region) {

          var regionType =region.feature.properties.type;
          if(regionType === 'link'|| regionType === 'parks') {
            var url = region.feature.properties.url;
            if(region.feature.properties.type === 'parks') {
                url = region.feature.properties.externalUrl
            }
            $window.open(url, '_blank');
            // Stop the card from displaying
            $scope.region = undefined;
            return;
          }


          layers.currentRegion = region;
          if ($scope.region !== region) {
            $timeout(function () {
              $scope.region = region;
            }, 10);
          }

          layers.regions.eachLayer(function (layer) {
            if (layer === region) {
              layer.setStyle(styles.region.selected);
            } else {
              layer.setStyle(styles.region.default);
            }
          });
        }

        map.on('load', refreshLayers);
        //map.on('dragend', setRegionFocus);
        map.on('zoomend', refreshLayers);

        $scope.$watch('region', function (newRegion, oldRegion) {
          if (layers.regions && newRegion && newRegion !== oldRegion) {
            setRegion(newRegion);
          }
        });

        $scope.$watch('regions', function (newRegions, oldRegions) {
          if (newRegions && newRegions.features && $scope.activeHotZones) {
            initRegionsLayer();
          }
        });

        $scope.$watch('activeHotZones', function (newHotZones, oldHotZones) {
          if ($scope.regions && $scope.regions.features && newHotZones) {
            initRegionsLayer();
          }
        });

        $scope.$watch('showRegions', function (newShowRegions, oldShowRegions) {
          if (newShowRegions !== oldShowRegions) {
            refreshLayers();
          }
        });

        $scope.$watch('showHotZones', function (newShowHotZones, oldShowHotZones) {
          if (newShowHotZones !== oldShowHotZones) {
            refreshLayers();
          }
        });

        $scope.$watch('obs', function (newObs, oldObs) {
          if (newObs) {
            refreshObsLayer();
          }
        });

        $scope.$watch('minFilters', function (newObs, oldObs) {
          if (newObs) {
            refreshObsLayer();
          }
        }, true);

        $scope.$watch('currentReport', function(newVal, oldVal){

          if($stateParams.subid && newVal && newVal.latlng){
            clusterOverlays.clearLayers();
            var markers = new L.markerClusterGroup(mapConfig.cluster).addTo(clusterOverlays);

            newVal.obs.map(function (ob) {
              var marker = L.mapbox.featureLayer(mapConfig.setFeatureLayer(newVal.latlng[1], newVal.latlng[0],ob.obtype, ob.subid))
                .setFilter(function () {
                  if (_.indexOf($scope.minFilters, ob.obtype) !== -1) {
                    return true;
                  } else {
                    return false;
                  }
              });;

              marker.on('click', function (e) {
                $rootScope.requestInProgress = true;

                acSubmission.getOne(newVal.subid).then(function(results){
                  results.requested = ob.obtype;
                  $scope.currentReport = results;
                  $rootScope.requestInProgress = false;
                });
              });

              marker.eachLayer(function (layer) {
                markers.addLayer(layer);
              });
            });
            map.setView(newVal.latlng, 10);
          }
        }, true);

        $scope.$watch('ob', function (newObs, oldObs) {
          if (newObs && newObs.latlng) {
            acObservation.getOne(newObs.obid, 'html').then(function (obHtml) {
              var marker = L.marker(newObs.latlng, {
                icon: L.mapbox.marker.icon({
                  'marker-size': 'small',
                  'marker-color': '#09c'
                })
              });
              var maxHeight = map.getSize().y - 100;

              marker.bindPopup(obHtml, {maxHeight: maxHeight, maxWidth: 400, autoPanPaddingTopLeft: [0, 30]});
              marker.on('popupclose', function () {
                map.removeLayer(marker);
                $timeout(function () {
                  $location.path('/');
                }, 0);
              });

              marker.setZIndexOffset(10000);
              map.addLayer(marker);

              marker.togglePopup();
            });
            acObservation.getOne(newObs.obid, 'json').then(function (ob) {
              // add opengraph tags
              $rootScope.ogTags = [{type: 'title', value: ob.title},
                {type: 'image', value: ob.thumbs[0]},
                {type: 'description', value: ob.comment}];
            });
          }
        });

        function createClusterIcon(cluster){
          var childMakers = cluster.getAllChildMarkers();

          var uniqMarkers = _.uniq(childMakers, function(m) { return m.feature.extra.subid; }).length;

          cluster.multipleReports = (uniqMarkers > 1);

          return new L.DivIcon({ html: '<div><span>' + uniqMarkers + '</span></div>', className: 'marker-cluster marker-cluster-sm', iconSize: new L.Point(40, 40) });
        }

        function hotZoneActive(feature) {
          return _.findWhere($scope.activeHotZones, {hotzoneid: feature.properties.id});
        }

        function isHotZone(feature) {
          return feature && feature.properties && feature.properties.type === 'hotzone';
        }

        function newHotZone(feature) {
          var zone = _.findWhere($scope.activeHotZones, {hotzoneid: feature.properties.id});
          if (zone && zone.new) {
            return true;
          }
          return false;
        }

      }
    };
  }]);

angular.module('acComponents.directives')
    .directive('fileModel', ["$parse", function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    }])
    .directive('acMinReportForm', ["$state", "$rootScope", "$q", "$timeout", "acBreakpoint", "acReportData", "acFormUtils", "acSubmission", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "store", "$anchorScroll", "$modal", "ngToast", function($state, $rootScope, $q, $timeout, acBreakpoint, acReportData, acFormUtils, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store, $anchorScroll, $modal, ngToast) {
        return {
            templateUrl: 'min-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {

                var submissionGuidelinesLink = 'http://www.avalanche.ca/fxresources/Submissions+Guidelines.pdf';

                resetFields();
                initReport();

                $scope.additionalFields = {
                  avalancheReport : {
                    name: 'avalanche',
                    text: 'Share information about a single, notable avalanche or tell us about overall avalanche conditions by describing many avalanches in a general sense. Aspect, elevation, trigger, dimensions/size are key data.'
                  },
                  snowpackReport : {
                    name: 'snowpack',
                    text: 'Snowpack depth, layering, and bonding are key data. Test results are very useful.'
                  },
                  weatherReport : {
                    name: 'weather',
                    text: 'Key data includes information about current and accumulated precipitation, wind speed and direction, temperatures, and cloud cover.'
                  },
                  incidentReport : {
                    name: 'incident',
                    text: 'Sharing incidents can help us all learn. Describe close calls and accidents here. Be sensitive to the privacy of others. Before reporting serious accidents check our <a href="'+submissionGuidelinesLink+'" target="_blank">submission guidelines</a>.'
                  }
                };

                $scope.tabs = {
                  quickReport: true,
                  avalancheReport: false,
                  snowpackReport: false,
                  weatherReport: false,
                  incidentReport: false
                };

                $scope.atleastOneTabCompleted = false;

                $scope.getTabExtraClasses = function (tab) {
                  var completed = tabCompleted(tab);

                  $scope.atleastOneTabCompleted = $scope.atleastOneTabCompleted || completed;

                  return {
                    completed: completed,
                    tab: tab.replace('Report','')
                  }
                };

                $scope.scrollToTop = function () {
                  $anchorScroll.yOffset = 100;
                  $anchorScroll('top');
                };

                function tabCompleted (tab) {
                  if (tab === 'quickReport') {
                    return acReportData.quick.isCompleted($scope.report.obs.quickReport);
                  } else {
                    return $scope.report.obs[tab].isCompleted();
                  }
                }

                function initReport() {
                  $scope.report = {
                    title: '',
                    datetime: moment().format('YYYY-MM-DD hh:mm A'),
                    latlng: [],
                    files: [],
                    obs: {
                      quickReport: {
                        ridingConditions: angular.copy(acReportData.quick.ridingConditions),
                        avalancheConditions: angular.copy(acReportData.quick.avalancheConditions),
                        comment: angular.copy(acReportData.quick.comment)
                      },
                      avalancheReport: acReportData.avalanche,
                      incidentReport: acReportData.incident,
                      snowpackReport: acReportData.snowpack,
                      weatherReport: acReportData.weather
                    }
                  };
                }

                function resetForm() {
                    $timeout(function () {
                        resetFields();
                        initReport();
                        $scope.minsubmitting = false;
                        $scope.minerror = false;
                    }, 0);
                }

                function resetFields() {
                  acReportData.avalanche.reset();
                  acReportData.incident.reset();
                  acReportData.snowpack.reset();
                  acReportData.weather.reset();
                }

                $scope.resetForm = resetForm;

                $scope.goBack = function (formDirty) {

                  //if (formDirty) {
                  //  var goingBack = shouldDiscard();
                  //  goingBack.then(exit);
                  //} else {
                  //  exit();
                  //}
                  //
                  //function exit() {
                      resetFields();
                      initReport();
                      $state.go('ac.map');
                  //}
                };

                $scope.submitForm = function(form) {
                    if (!form.$valid || $scope.minsubmitting) return;

                    var reqObj = _.cloneDeep($scope.report);

                    reqObj.obs = _.reduce($scope.report.obs, function(total, item, key){
                        if (key === 'quickReport') {
                          if (acReportData.quick.isCompleted(item)) {
                            total.quickReport = item;
                          }
                        } else if (item.isCompleted()){
                          total[key] = item.getDTO();
                        }
                        return total;
                    }, {});

                    //if (_.keys(reqObj.obs).length === 0) {
                    //  return $q.reject('incomplete-form');
                    //}

                    var token = store.get('token');
                    if (token) {
                        $scope.minsubmitting = true;
                        return acSubmission.submit(reqObj, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $state.go('ac.map');
                                ngToast.create({
                                  content: 'Your report was successfully submitted.',
                                  class: 'alert alert-success',
                                  dismissOnTimeout: true,
                                  dismissButton: true,
                                  dismissButtonHtml: '&times;'
                                });


                                return result;
                            } else {
                                $scope.minsubmitting = false;
                                $scope.minerror = true;
                                return $q.reject('error');
                            }
                        }, function(err) {
                            $scope.minsubmitting = false;
                            $scope.minerror = true;
                            $scope.minerrormsg = err;
                            return $q.reject(err);
                        });
                    } else {
                        return $q.reject('auth-error');
                    }
                };


                function shouldDiscard() {
                  var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'min-back-modal.html',
                    controller: 'acBackModal',
                    size: 'lg',
                    windowClass: 'back-modal',
                    keyboard: false,
                    backdrop: 'static'
                  });

                  return modalInstance.result;
                }


                $scope.openMapModal = function () {
                  var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'min-map-modal.html',
                    controller: 'acMapModal',
                    size: 'lg',
                    windowClass: 'map-modal',
                    resolve: {
                      latlng: function () {
                        return $scope.report.latlng
                      }
                    }
                  });

                  modalInstance.result.then(function (latlng) {
                    $scope.report.latlng = latlng;
                  });
                };

                var watch = $scope.$watchCollection(function () { return [$scope.report.latlng, $scope.report.tempLatlng]; }, function (newVal, oldVal) {
                  if (newVal) {
                    if (newVal[0] !== oldVal[0]) {
                      $scope.report.tempLatlng = $scope.report.latlng.join(',');
                      newVal[1] = $scope.report.tempLatlng;
                      $scope.tempLatlngModified = false;
                    }
                    if (newVal[1] && newVal[1] !== newVal[0].join(',')) {
                      $scope.tempLatlngModified = true;
                    }
                  }
                });

                $scope.$on('$destroy', function () {
                  watch();
                });

                $scope.saveLocation = function () {
                  if (acFormUtils.validateLocationString($scope.report.tempLatlng)) {
                    $scope.report.latlng = $scope.report.tempLatlng.split(',');
                    $scope.tempLatlngModified = false;
                    $scope.invalidLatLng = false;
                  } else {
                    $scope.invalidLatLng = true;
                  }
                };
            }
        };
    }]);

angular.module('acComponents.directives')
  .directive('acMinReportFullPage', ["acReportData", function (acReportData) {
    return {
      templateUrl: 'min-report-fullpage.html',
      scope: {
        sub: '=report',
        sponsor: '=sponsor'
      },
      link: function (scope, el, attrs) {
        el.addClass('ac-observation-drawer');

        scope.print = print;
        scope.activeReports = [];

        processReportInfo();

        function processReportInfo() {
          scope.activeReports = _.reduce(scope.sub.obs, function (results, item, key){
                results.push({
                  obtype: item.obtype,
                  ob: acReportData[item.obtype].mapDisplayResponse(item.ob)
                });
              return results;
          },[]);

          scope.activeReports = _.sortBy(scope.activeReports, function(obj) {
            return ['quick', 'avalanche', 'snowpack', 'weather', 'incident'].indexOf(obj.obtype);
          });

        }

        function print(){
          window.print();
        }

      }
    };
  }]);

angular.module('acComponents.directives')
    .directive('acMinReportModal', function () {
        return {
            templateUrl: 'min-report-modal.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.directives')
  .directive('acObservationMin', ["acReportData", "acConfig", "$stateParams", "$state", function (acReportData, acConfig, $stateParams, $state) {
    return {
      templateUrl: 'min-observation-drawer.html',
      scope: {
        sub: '=observation',
        sponsor: '=sponsor'
      },
      link: function (scope, el, attrs) {
        el.addClass('ac-observation-drawer');

        scope.activeTab = {};
        scope.reportTypes = acConfig.reportTypes;
        scope.hasReport = hasReport;
        scope.changeTab = changeTab;
        scope.closeDrawer = closeDrawer;
        scope.viewFullPage = viewFullPage;

        function hasReport(type) {
          if (!scope.sub) return;

          var completedReports = _.reduce(scope.sub.obs, function (list, item) {
            list.push(item.obtype);
            return list;
          }, []);

          if (_.indexOf(completedReports, type) !== -1) {
            return 'completed';
          } else {
            return 'disabled';
          }
        }

        function closeDrawer() {
          scope.sub = null;
          if($stateParams.subid || $stateParams.markerid) {
            $state.go('ac.map', {markerid: null}, {notify:false, reload:false});
          }
        }

        function changeTab(tab) {
          if (hasReport(tab) === 'disabled') {
            return false;
          } else {
            scope.sub.requested = tab;
            processTabInfo(scope.sub);
          }
        }

        scope.$watch('sub', function (newValue, oldValue) {
          if (newValue && newValue.latlng) {
            processTabInfo(newValue);
          }
        });

        function processTabInfo(newObj) {
          newObj.requested = requestedTab(newObj);

          var requestedObj = _.filter(newObj.obs, function (ob) {
            return newObj.requested === ob.obtype;
          });

          if (requestedObj[0].ob) {
            scope.activeTab = acReportData[newObj.requested].mapDisplayResponse(requestedObj[0].ob);
          }
        }

        function requestedTab(newObj){
          if(newObj.requested){
            return newObj.requested;
          } else {
            var requested = null;
            _.forEach(scope.reportTypes, function (item){
              if(_.some(newObj.obs, {obtype:item})){
                requested = item;
                return false;
              }
            });
            return requested;
          }
        }

        function viewFullPage(id){
          var url = $state.href('ac.reports', { subid:id });
          window.open(url, '_blank');
        }

      }
    };
  }]);

angular.module('acComponents.directives')
    .directive('acSocialShare', function () {
        return {
            templateUrl: 'social-share.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.directives')
  .directive('acSubmissionFormValidator', function () {
    return {
      require: '^form',
      link: function ($scope, el, attrs, ctrl) {
        $scope.validate = function (fieldName, field) {
          if (!field.validate()) {
            setFormValidity(fieldName, false);
          } else {
            setFormValidity(fieldName, true);
          }
        };

        function setFormValidity(fieldName, state) {
          if (angular.isDefined(ctrl[fieldName])) {
            ctrl[fieldName].$setValidity(fieldName, state);
          }
        }

        $scope.$watch('atleastOneTabCompleted', function (newVal) {
          if (angular.isDefined(newVal)) {
            ctrl.$setValidity('atleastOneTab', newVal);
          }
        });
      }
    };
  });

angular.module('acComponents.directives')
  .directive('acTabStyle', function () {
    return {
      link: function ($scope, el, attrs) {
        attrs.$observe('acTabStyle', applyStyle);

        function applyStyle (newVal) {
          var res = JSON.parse(newVal);

          _.forEach(res, function (val, cssClass) {
            if(cssClass === 'tab') {
              el.find('a').addClass(val);
            }

            if (val) {
              el.removeClass(cssClass).addClass(cssClass);
            } else {
              el.removeClass(cssClass);
            }
          });
        }
      }
    };
  });

angular.module('acComponents.filters')
    .filter('acCapitalize', function () {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });

angular.module('acComponents.filters')
    .filter('acFormatList', function () {
        return function (input) {
            if (input && input !== 'N/A') {
                var formattedString = '';
                for (var key in input) {
                    if (input[key]) {
                        formattedString = formattedString + ', ' + key;
                    }
                }
                return formattedString.replace(', ', '');
            }
            return input;
        };
    });

angular.module('acComponents.filters')
    .filter('acNormalizeForecastTitle', function () {
        return function (item) {
            if (item) {
                return item.replace(/^Avalanche (Forecast|Bulletin) - /g, '');
            }
        };
    });
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
      var datetime = moment(datetimeString, 'YYYY-MM-DD hh:mm');
      var offset = moment.parseZone(datetime).zone();
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

      return datetime.format('MMM Do, YYYY');
    }
  });

angular.module('acComponents.services')
  .factory('acAvalancheReportData', ["acFormUtils", function(acFormUtils) {
    var fields = {

      avalancheOccurrenceEpoch: {
        title: 'Avalanche date/time:',
        prompt: 'Avalanche date:',
        type: 'datetime',
        showOnlyDate: true,
        value: null,
        order: 1,
        placeholder: 'Click to select date (required)',
        subTitle: 'If you triggered or witnessed an avalanche add date/time.',
        maxDateToday: true
      },

      avalancheOccurrenceTime: {
        title: null,
        prompt: 'Avalanche time:',
        type: 'datetime',
        showOnlyTime: true,
        value: null,
        order: 1,
        placeholder: 'Click to select time (optional)'
      },

      avalancheObservation: {
        title: null,
        subTitle: 'If you observed evidence of recent avalanches, estimate occurrence time.',
        prompt: 'Estimated occurrence time:',
        type: 'radio',
        inline: true,
        options: ['12 hrs ago', '12-24 hrs ago', '>24-48 hrs ago', '>48 hrs ago'],
        value: null,
        order: 2
      },

      avalancheNumber: {
        prompt: 'Number of avalanches in this report:',
        type: 'radio',
        inline: true,
        options: ['1', '2-5', '6-10', '11-50', '51-100'],
        value: null,
        order: 2
      },

      avalancheSize: {
        prompt: 'Avalanche size:',
        type: 'radio',
        inline: true,
        value: null,
        options: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
        helpText: 'Use Canadian size classification. Size 1 is relatively harmless to people. Size 2 can bury, injure or kill a person. Size 3 can bury and destroy a car. Size 4 can destroy a railway car. Size 5 can destroy 40 hectares of forest.',
        order: 3
      },

      slabThickness: {
        type: 'number',
        prompt: 'Slab thickness (cm):',
        value: null,
        options: {
          min: 10,
          max: 500
        },
        errorMessage: 'Number between 10 and 500 please.',
        order: 4
      },

      slabWidth: {
        type: 'number',
        prompt: 'Slab width (m):',
        value: null,
        options: {
          min: 1,
          max: 3000
        },
        errorMessage: 'Number between 1 and 3000 please.',
        order: 5
      },

      runLength: {
        type: 'number',
        prompt: 'Run length (m):',
        options: {
          min: 1,
          max: 10000
        },
        value: null,
        errorMessage: 'Number between 1 and 10000 please.',
        helpText: 'Length from crown to toe of debris.',
        order: 6
      },

      avalancheCharacter: {
        type: 'checkbox',
        prompt: 'Avalanche character:',
        limit: 3,
        inline: true,
        options: {
          'Storm slab': false,
          'Wind slab': false,
          'Persistent slab': false,
          'Deep persistent slab': false,
          'Wet slab': false,
          'Cornice only': false,
          'Cornice with slab': false,
          'Loose wet': false,
          'Loose dry': false
        },
        order: 7,
        errorMessage: 'Please check maximum 3 options.'
      },

      triggerType: {
        type: 'radio',
        prompt: 'Trigger type:',
        inline: true,
        options:['Natural', 'Skier', 'Snowmobile', 'Other vehicle', 'Helicopter', 'Explosives'],
        value: null,
        order: 8
      },

      triggerSubtype: {
        type: 'radio',
        prompt: 'Trigger subtype:',
        value: null,
        inline: true,
        options: ['Accidental', 'Intentional', 'Remote'],
        helpText: 'A remote trigger is when the avalanche starts some distance away from where the trigger was  applied.',
        order: 9
      },

      triggerDistance: {
        type: 'number',
        prompt: 'Remote trigger distance (m):',
        options: {
          min: 0,
          max: 2000
        },
        helpText: 'If a remote trigger, enter how far from the trigger point is the nearest part of the crown.',
        value: null,
        errorMessage: 'Number between 0 and 2000 please.',
        order: 10
      },

      startZoneAspect: {
        type: 'checkbox',
        inline: true,
        prompt: 'Start zone aspect:',
        options: {
          'N': false, 
          'NE': false, 
          'E': false, 
          'SE': false, 
          'S': false, 
          'SW': false, 
          'W': false, 
          'NW': false
        },
        value: null,
        order: 11,
        limit: 3,
        errorMessage: 'Please check maximum 3 options.'
      },

      startZoneElevationBand: {
        prompt: 'Start zone elevation band:',
        type: 'checkbox',
        inline: true,
        options: {
          'Alpine': false, 
          'Treeline': false, 
          'Below treeline': false
        },
        value: null,
        order: 12
      },

      startZoneElevation: {
        type: 'number',
        prompt: 'Start zone elevation (m):',
        options: {
          min: 0,
          max: 5000
        },
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 13
      },

      startZoneIncline: {
        type: 'number',
        prompt: 'Start zone incline:',
        options: {
          min: 0,
          max: 90
        },
        value: null,
        errorMessage: 'Number between 0 and 90 please.',
        order: 14
      },

      runoutZoneElevation: {
        type: 'number',
        prompt: 'Runout zone elevation:',
        options: {
          min: 0,
          max: 5000
        },
        placeholder: 'Metres above sea level',
        helpText: 'The lowest point of the debris.',
        value: null,
        errorMessage: 'Number between 0 and 5000 please.',
        order: 15
      },

      weakLayerBurialDate: {
        prompt: 'Weak layer burial date:',
        type: 'datetime',
        showOnlyDate: true,
        helpText:'Date the weak layer was buried.',
        order: 16,
        value: null,
        maxDateToday: true
      },

      weakLayerCrystalType: {
        type: 'checkbox',
        prompt: 'Weak layer crystal type:',
        limit: 2,
        inline: true,
        options: {
          'Surface hoar': false,
          'Facets': false,
          'Surface hoar and facets': false,
          'Depth hoar': false,
          'Storm snow': false
        },
        order: 17,
        errorMessage: 'Please check maximum 2 options.'
      },

      crustNearWeakLayer:{
        prompt: 'Crust near weak layer:',
        type: 'radio',
        inline: true,
        options: ['Yes', 'No'],
        value: null,
        order: 18
      },

      windExposure: {
        type: 'radio',
        prompt: 'Wind exposure:',
        options: ['Lee slope', 'Cross-loaded slope', 'Windward slope', 'Down flow', 'Reverse-loaded slope', 'No wind exposure'],
        value: null,
        inline: true,
        order: 19
      },

      vegetationCover: {
        type: 'radio',
        prompt: 'Vegetation cover:',
        value: null,
        inline: true,
        options: ['Open slope', 'Sparse trees or gladed slope', 'Dense trees'],
        order: 20
      },

      avalancheObsComment: {
        prompt: 'Avalanche observation comment',
        type: 'textarea',
        value: null,
        helpText: 'Please add additional information, for example terrain, aspect, elevation etc. especially if describing many avalanches together.',
        order: 21
      }

    };

    return acFormUtils.buildReport(fields);

  }]);

angular.module('acComponents.services')
    .factory('acBreakpoint', ["$rootScope", "$timeout", "$window", function ($rootScope, $timeout, $window) {
        return {
            setBreakpoints: function (breakpoints) { // {xs: 400, sm: 600, md: 1025}
                var breakpoint;

                function broadcastBreakpoint() {
                    var bp;
                    var width = $($window).width();

                    if(width < breakpoints.xs) {
                        bp = 'xs';
                    } else if(width >= breakpoints.xs && width < breakpoints.sm) {
                        bp = 'sm';
                    } else if(width >= breakpoints.sm && width < breakpoints.md) {
                        bp = 'md';
                    } else {
                        bp = 'lg';
                    }

                    if(!breakpoint || bp !== breakpoint) {
                        breakpoint = bp;
                        $timeout(function () {
                            $rootScope.$broadcast('breakpoint', breakpoint);
                        }, 0);
                    }
                }

                broadcastBreakpoint();
                angular.element($window).bind('resize', broadcastBreakpoint);
            }
        };
    }]);
angular.module('acComponents.services')
    .factory('acForecast', ["$http", "$q", "acImageCache", "AC_API_ROOT_URL", function ($http, $q, acImageCache, AC_API_ROOT_URL) {
        var forecasts;
        var apiUrl = AC_API_ROOT_URL; // todo: move to constants

        function cacheDangerIcons(){
            var dangerIcons = _.map(forecasts.features, function (f) {
                return apiUrl + f.properties.dangerIconUrl;
            });

            acImageCache.cache(dangerIcons);
        }

        return {
            fetch: function () {
                var deferred = $q.defer();

                if(forecasts) {
                    deferred.resolve(forecasts);
                } else {
                    $http.get(apiUrl + '/api/forecasts').then(function (res) {
                        forecasts = res.data;
                        deferred.resolve(forecasts);
                    });
                }

                return deferred.promise;
            },
            getOne: function (regionId) {
                return $q.when(this.fetch()).then(function () {
                    var region = _.find(forecasts.features, {id: regionId});

                    return $http.get(apiUrl + region.properties.forecastUrl).then(function (res) {
                        return res.data;
                    });
                });
            },
            getDangerIconUrl: function(regionId) {
                var region = _.find(forecasts.features, {id: regionId});
                
                return AC_API_ROOT_URL + region.properties.dangerIconUrl
            }
        };
    }]);
angular.module('acComponents.services')
  .factory('acFormUtils', function() {

    var inputDefault = {
      getDTO: function (){
        return this.value;
      },
      validate: function(){
        return true;
      },
      reset: function () {
        this.value = null;
      },
      isCompleted: function () {
        return !_.isEmpty(this.value);
      },
      getDisplayObject: function(){
        return {
          prompt: this.prompt,
          order: (this.order)?this.order:50,
          type: this.type
        }
      }
    };

    var inputTypes = {
      checkbox: {
        getDTO: function (){
          return this.options;
        },
        validate: function(){
          if (angular.isDefined(this.limit)) {
            var noOfSelected = this.getNumberSelected();

            return noOfSelected <= this.limit;
          }

          return true;
        },
        reset: function () {
          var options = this.options;
          _.forEach(this.options, function (option, key) {
            options[key] = false;
          });
        },
        isCompleted: function () {
          var noOfSelected = this.getNumberSelected();

          return noOfSelected > 0;
        },
        getNumberSelected: function () {
          return _.reduce(this.options, function(total, option){
            if (option){
              total++;
            }
            return total;
          }, 0);

        },
        getDisplayObject: inputDefault.getDisplayObject
      },
      number:{
        getDTO: inputDefault.getDTO,
        validate: function(){
          return (this.value == null) || parseInt(this.value) >= this.options.min && parseInt(this.value) <= this.options.max;
        },
        reset: inputDefault.reset,
        isCompleted: function () {
          return this.value !== null;
        },
        getDisplayObject: inputDefault.getDisplayObject
      },
      dropdown: inputDefault,
      textarea: inputDefault,
      radio: inputDefault,
      datetime: inputDefault,
      calculated: {
        getDTO: inputDefault.getDTO,
        validate: inputDefault.validate,
        reset: inputDefault.reset,
        isCompleted: function () {
          return false;
        },
        getDisplayObject: inputDefault.getDisplayObject
      },
      text: inputDefault
    };

    return {
      buildReport: buildReport,
      validateLocationString: validateLocation
    };

    function buildReport(fields) {
      if (!angular.isDefined(fields)) {
        throw new Error('Please provide fields');
      }

      _.forEach(fields, function (field) {
        _.assign(field, assignUtils(field));
      });

      return {
        fields: fields,
        getDTO: getDTO,
        validate: validateFields,
        reset: resetFields,
        isCompleted: isCompleted,
        mapDisplayResponse: mapDisplayResponse
      };

      function assignUtils(field) {
        return inputTypes[field.type];
      }

      function getDTO() {
        return _.reduce(fields, function (dtos, field, key) {

          if (field.type === 'calculated') {
            dtos[key] = getCalculatedFieldValue(field, fields);
          } else {
            dtos[key] = field.getDTO();
          }

          return dtos;
        }, {});
      }

      function getCalculatedFieldValue(field, fields) {
        return _.reduce(field.computeFields, function (total, key) {
          total += fields[key].value;

          return total;
        }, 0);
      }

      function validateFields() {
        return _.reduce(fields, function (errors, field, key) {
          var err = field.validate();
          if (!err) {
            errors[key] = true;
          }

          return errors;
        }, {});
      }

      function resetFields() {
        _.invoke(fields, 'reset');
      }

      function isCompleted () {
        var total = _.reduce(fields, function (acc, field, key) {
          acc += field.isCompleted() ? 1 : 0;

          return acc;
        }, 0);

        return total > 0;
      }

      function mapDisplayResponse(ob) {
        if (_.isEmpty(ob)) return;

        var merged = _.reduce(ob, function (results, value, key) {
          if (_.isUndefined(results[key]) && value !== null && angular.isDefined(value)) {
            results[key] = {};
          }

          var parsedValue = parseValue(value);

          if (angular.isDefined(value) && value !== null && !_.isEmpty(parsedValue.toString())) {
            results[key] = (fields[key])?fields[key].getDisplayObject():{};
            results[key].value = parsedValue;
          }

          return results;
        }, {});

        return _.sortBy(_.values(merged), 'order');
      }

      function parseValue(field) {
        if (_.isPlainObject(field)) {
          return _.reduce(field, function (array, item, key) {
            if (item) {
              array.push(key);
            }
            return array;
          }, [])
        } else {
          return field;
        }
      }
    }

    function validateLocation (locationString) {
      try {

        if (locationString.indexOf(',') === -1) {
          return false;
        }

        var latLng = locationString.split(',');

        if (latLng.length !== 2) {
          return false;
        }

        var lat = parseFloat(latLng[0]),
          lng = parseFloat(latLng[1]);

        return !(isNaN(lat) || isNaN(lng));

      } catch (e) {
        return false;
      }
    }

  });

angular.module('acComponents.services')
    .factory('acHZRSubmission', ["$q", "$http", "AC_API_ROOT_URL", function ($q, $http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/hzr/submissions';
        var sizeLimit = 25000000;
        var allowedMimeTypes = ['image/png', 'image/jpeg'];
        var fileViolationErrorMsg = 'Invalid file! Files have to be smaller than 25 MB and of type: ' + allowedMimeTypes.join(', ');

        function fileIsValid(file){
            return file.size < sizeLimit && allowedMimeTypes.indexOf(file.type) !== -1;
        }

        function fileAreValid(files){
            return _.reduce(files, function (memo, file) {
                return memo && fileIsValid(file);
            }, true);
        }

        function prepareData(reportData) {
            var deferred = $q.defer();

            if(fileAreValid(reportData.files)){
                var formData =  _.reduce(reportData, function (data, value, key) {
                    if(key === 'files') {
                        _.forEach(value, function(file, counter) {
                            data.append('file' + counter, file, file.name);
                        });
                    } else if(_.isPlainObject(value) || _.isArray(value)) {
                        data.append(key, JSON.stringify(value));
                    } else if(key === 'datetime') {
                        data.append(key, moment(value, 'YYYY-MM-DD hh:mm A').format());
                    } else if(_.isString(value)) {
                        data.append(key, value);
                    }

                    return data;
                }, new FormData());

                deferred.resolve(formData);
            } else {
                deferred.reject(fileViolationErrorMsg);
            }

            return deferred.promise;
        }

        return {
            submit: function (submission, token) {
                return prepareData(submission).then(function (formData) {
                    return $http.post(endpointUrl, formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Bearer ' + token
                        }
                    });
                });
            },
            getAll: function () {
                return $http.get(endpointUrl).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = endpointUrl + obid + format;
                var obIdUrl = endpointUrl + '/' + obid;

                return $http.get(obIdUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);

angular.module('acComponents.services')
  .service('acHotZoneReportData', ["acFormUtils", function(acFormUtils) {

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
  }]);

angular.module('acComponents.services')
    .factory('acImageCache', ["$http", function($http) {
        return {
            cache: function (images) {
                images.forEach(function (i) {
                    $http.get(i);
                });
            }
        };
    }]);
angular.module('acComponents.services')
  .service('acIncidentReportData', ["acFormUtils", function(acFormUtils) {

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
        helpText: 'If other, please describe it below.',
        order: 1
      },

      otherActivityDescription: {
        title: null,
        type: 'text',
        prompt: 'Describe other activity',
        value: null,
        order: 2,
        errorMessage: 'Please describe what other activity.',
        constraint: {
          field: 'groupActivity',
          option: 'Other'
        }
      },

      groupSize: {
        type: 'number',
        title: 'Group details:',
        prompt: 'Total in the group?',
        subTitle: 'Total in the group?',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 3
      },

      numberFullyBuried: {
        type: 'number',
        prompt: 'People fully buried?',
        subTitle: 'People fully buried?',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 4
      },

      numberPartlyBuriedImpairedBreathing: {
        type: 'number',
        prompt: 'People partly buried with impaired breathing?',
        subTitle: 'People partly buried with impaired breathing?',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 5
      },

      numberPartlyBuriedAbleBreathing: {
        type: 'number',
        prompt: 'People partly buried with normal breathing?',
        subTitle: 'People partly buried with normal breathing?',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 6
      },

      numberCaughtOnly: {
        type: 'number',
        prompt: 'People injured (caught but not buried)?',
        subTitle: 'People injured (caught but not buried)?',
        options: {
          'min': 0,
          'max': 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 7
      },

      numberPeopleInjured: {
        type: 'number',
        prompt: 'People not injured (caught but not buried)?',
        subTitle: 'People not injured (caught but not buried)?',
        options: {
          'min': 0,
          'max': 400
        },
        value: null,
        errorMessage: 'Number between 0 and 400 please.',
        order: 8
      },

      terrainShapeTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Terrain shape at trigger point:',
        options: ['Convex', 'Planar', 'Concave', 'Unsupported'],
        value: null,
        helpText: 'Convex: a roll. Concave: bowl-shaped. Planar: smooth with no significant convexities or concavities. Unsupported: a slope that drops off abruptly at the bottom.',
        order: 9
      },

      snowDepthTriggerPoint: {
        type: 'radio',
        inline: true,
        prompt: 'Snow depth at trigger point:',
        options: ['Shallow', 'Deep', 'Average', 'Variable'],
        helpText: 'The depth of the snowpack compared to the average conditions in the area. Shallow: shallower than average. Deep: deeper than average. Average: about the same as everywhere else. Variable: depth varies significantly in the place where the avalanche started.',
        value: null,
        order: 10
      },

      terrainTrap: {
        type: 'checkbox',
        prompt: 'Terrain trap:',
        options: {
          'No obvious terrain trap': false,
          'Gully or depression': false,
          'Slope transition or bench': false,
          'Trees': false,
          'Cliff': false
        },
        inline: true,
        helpText: 'Terrain traps are features that increase the consequences of an avalanche.',
        order: 11
      },

      incidentDescription: {
        prompt: 'Incident description',
        type: 'textarea',
        value: null,
        helpText: 'No names and no judging please.',
        guidelines: 'http://www.avalanche.ca/fxresources/Submissions+Guidelines.pdf',
        order: 12
      },

      numberInvolved: {
        type: 'calculated',
        value: 0,
        computeFields: ['numberFullyBuried', 'numberPartlyBuriedImpairedBreathing', 'numberPartlyBuriedAbleBreathing', 'numberCaughtOnly', 'numberPeopleInjured']
      }
    };

    return acFormUtils.buildReport(fields);
  }]);

angular.module('acComponents.services')
    .factory('acObservation', ["$http", "AC_API_ROOT_URL", function ($http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/observations';

        return {
            byPeriod: function (period) {
                var opt = {params: {last: period || '2:days'}};

                return $http.get(endpointUrl, opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = endpointUrl + '/' + obid + format;

                return $http.get(obUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);

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

        this.comment = null;

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

        this.mapDisplayResponse = function(ob) {
          var quickTab = [];

          if (ob.avalancheConditions && mapAvalancheConditions(ob.avalancheConditions).length > 0) {
            quickTab.push({
              prompt: 'Avalanche conditions',
              type: 'checkbox',
              order: 2,
              value: mapAvalancheConditions(ob.avalancheConditions)
            });
          }

          _.forEach(ob.ridingConditions, function (item, key) {
            if (item.type === 'single' && item.selected) {
              if (item.selected) {
                quickTab.push({
                  prompt: item.prompt,
                  type: 'radio',
                  order: 1,
                  value: item.selected
                });
              }
            }

            if (item.type === 'multiple' && item.options) {
              var selected = _.reduce(item.options, function (select, it, key) {
                if (it) {
                  select.push(key);
                }
                return select;
              },[]);

              if (!_.isEmpty(selected)){
                quickTab.push({
                  prompt: item.prompt,
                  type: 'checkbox',
                  order: 1,
                  value: selected
                });
              }
            }
          });

          if (ob.comment) {
            quickTab.push({
              type: 'textarea',
              prompt: 'Comment',
              value: ob.comment,
              order: 100
            });
          }

          return quickTab;
        };

        function mapAvalancheConditions(av) {
          var avalanches = [];
          if (av.slab) {
            avalanches.push('Slab avalanches today or yesterday.');
          }
          if (av.sound) {
            avalanches.push('Whumpfing or drum-like sounds or shooting cracks.');
          }
          if (av.snow) {
            avalanches.push('30cm + of new snow, or significant drifting, or rain in the last 48 hours.');
          }
          if (av.temp) {
            avalanches.push('Rapid temperature rise to near zero degrees or wet surface snow.');
          }
          return avalanches;
        }
  }
    );

angular.module('acComponents.services')
  .factory('acReportData', ["acQuickReportData", "acAvalancheReportData", "acSnowpackReportData", "acWeatherReportData", "acIncidentReportData", "acHotZoneReportData", function(acQuickReportData, acAvalancheReportData, acSnowpackReportData, acWeatherReportData, acIncidentReportData, acHotZoneReportData) {

    return {
      quick: acQuickReportData,
      avalanche: acAvalancheReportData,
      snowpack: acSnowpackReportData,
      weather: acWeatherReportData,
      incident: acIncidentReportData,
      hotzone: acHotZoneReportData
    };

  }]);

angular.module('acComponents.services')
  .factory('acSnowpackReportData', ["acFormUtils", function(acFormUtils) {

    var fields = {

      snowpackObsType: {
        type: 'radio',
        prompt: 'Is this a point observation or a summary of your day?',
        options: ['Point observation', 'Summary'],
        inline: true,
        value: null,
        order: 1
      },

      snowpackSiteElevation: {
        type: 'number',
        prompt: 'Elevation:',
        options: {
          min: 0,
          max: 4000
        },
        placeholder: 'Metres above sea level',
        value: null,
        errorMessage: 'Number between 0 and 4000 please.',
        order: 2
      },

      snowpackSiteElevationBand: {
        type: 'checkbox',
        prompt: 'Elevation band:',
        options: {
          'Alpine': false, 
          'Treeline': false, 
          'Below treeline': false
        },
        inline: true,
        value: null,
        order: 3
      },

      snowpackSiteAspect: {
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
          'NW': false
        },
        value: null,
        inline: true,
        order: 4,
        limit: 3,
        errorMessage: 'Please check maximum 3 options.'
      },

      snowpackDepth: {
        type: 'number',
        prompt: 'Snowpack depth (cm):',
        options: {
          min: 0,
          max: 10000
        },
        helpText:'Total height of snow in centimetres. Averaged if this is a summary.',
        value: null,
        errorMessage: 'Number between 0 and 10000 please.',
        order: 5
      },

      snowpackWhumpfingObserved:{
        type: 'radio',
        prompt: 'Did you observe whumpfing?',
        options: ['Yes', 'No'],
        inline: true,
        value: null,
        helpText: 'A whumpf is a rapid settlement of the snowpack caused by the collapse of a weak layer. It is accompanied by an audible noise.',
        order: 6
      },

      snowpackCrackingObserved:{
        type: 'radio',
        prompt: 'Did you observe cracking?',
        options: ['Yes', 'No'],
        inline: true,
        value: null,
        helpText: 'Cracking is shooting cracks radiating more than a couple of metres from your sled or skis.',
        order: 7
      },

      snowpackSurfaceCondition: {
        type: 'checkbox',
        prompt: 'Surface condition:',
        options: {
          'New snow': false,
          'Crust': false,
          'Surface hoar': false,
          'Facets': false,
          'Corn': false,
          'Variable': false
        },
        inline: true,
        order: 8
      },

      snowpackFootPenetration: {
        type: 'number',
        prompt: 'Foot penetration (cm):',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far you sink into the snow when standing on one fully-weighted foot.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 9
      },

      snowpackSkiPenetration: {
        type: 'number',
        prompt: 'Ski penetration (cm):',
        options: {
          min: 0,
          max: 200
        },
        helpText:'How far  you sink into the snow when standing on one fully-weighted ski.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 10
      },

      snowpackSledPenetration: {
        type: 'number',
        prompt: 'Sled penetration (cm):',
        options: {
          min: 0,
          max: 200
        },
        helpText:'The depth a sled sinks into the snow after stopping slowly on level terrain.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 11
      },

      snowpackTestInitiation: {
        type: 'radio',
        prompt: 'Snowpack test result:',
        options: ['None', 'Very easy', 'Easy', 'Moderate', 'Hard'],
        helpText: 'Average if you did a number of tests.',
        value: null,
        inline: true,
        order: 12
      },

      snowpackTestFracture: {
        type: 'radio',
        prompt: 'Snowpack test fracture character:',
        options: ['Sudden ("pop" or "drop")', 'Resistant', 'Uneven break'],
        helpText: 'Average if you did a number of tests. Describe further in comments if variable results.',
        value: null,
        inline: true,
        order: 13
      },

      snowpackTestFailure: {
        type: 'number',
        prompt: 'Snowpack test failure depth:',
        options: {
          min: 0,
          max: 200
        },
        helpText:'Depth below the surface that failure occurred.',
        value: null,
        errorMessage: 'Number between 0 and 200 please.',
        order: 14
      },

      snowpackTestFailureLayerCrystalType: {
        type: 'checkbox',
        prompt: 'Snowpack test failure layer crystal type:',
        limit: 2,
        options: {
          'Surface hoar': false,
          'Facets': false,
          'Depth hoar': false,
          'Storm snow': false,
          'Crust': false,
          'Other': false
        },
        inline: true,
        order: 15,
        errorMessage: 'Please check maximum 2 options.'
      },

      snowpackObsComment: {
        type: 'textarea',
        prompt: 'Observation comment:',
        value: null,
        helpText: 'Please add additional information about the snowpack, especially notes about weak layer, how the snow varied by aspect/elevation, and details of any slope testing performed.',
        order: 16
      }
    };

    return acFormUtils.buildReport(fields);

  }]);

angular.module('acComponents.services')
    .factory('acSubmission', ["$q", "$http", "AC_API_ROOT_URL", function ($q, $http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/submissions';
        var sizeLimit = 25000000;
        var allowedMimeTypes = ['image/png', 'image/jpeg'];
        var fileViolationErrorMsg = 'Invalid file! Files have to be smaller than 25 MB and of type: ' + allowedMimeTypes.join(', ');

        function fileIsValid(file){
            return file.size < sizeLimit && allowedMimeTypes.indexOf(file.type) !== -1;
        }

        function fileAreValid(files){
            return _.reduce(files, function (memo, file) {
                return memo && fileIsValid(file);
            }, true);
        }

        function prepareData(reportData) {
            var deferred = $q.defer();

            if(fileAreValid(reportData.files)){
                var formData =  _.reduce(reportData, function (data, value, key) {
                    if(key === 'files') {
                        _.forEach(value, function(file, counter) {
                            data.append('file' + counter, file, file.name);
                        });
                    } else if(_.isPlainObject(value) || _.isArray(value)) {
                        data.append(key, JSON.stringify(value));
                    } else if(key === 'datetime') {
                        data.append(key, moment(value, 'YYYY-MM-DD hh:mm A').format());
                    } else if(_.isString(value)) {
                        data.append(key, value);
                    }

                    return data;
                }, new FormData());

                deferred.resolve(formData);
            } else {
                deferred.reject(fileViolationErrorMsg);
            }

            return deferred.promise;
        }

        return {
            submit: function (submission, token) {
                return prepareData(submission).then(function (formData) {
                    return $http.post(endpointUrl, formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Bearer ' + token
                        }
                    });
                });
            },
            byPeriod: function (period) {
                var opt = {params: {period: period || '2:days'}};

                return $http.get(endpointUrl, opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = endpointUrl + obid + format;
                var obIdUrl = endpointUrl + '/' + obid;

                return $http.get(obIdUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);

angular.module('acComponents.services')
  .factory('acWeatherReportData', ["acFormUtils", function(acFormUtils) {
    var fields = {
      skyCondition: {
        type: 'radio',
        prompt: 'Cloud cover:',
        options: ['Clear', 'Few clouds (<2/8)', 'Scattered clouds (2/8-4/8)', 'Broken clouds (5/8-7/8)', 'Overcast (8/8)', 'Fog'],
        inline: true,
        helpText: 'Values expressed in eighths refer to the proportion of the sky that was covered with clouds. E.g. 2/8 refers to a sky approximately one quarter covered with cloud.',
        order: 1
      },

      precipitationType: {
        type: 'radio',
        prompt: 'Precipitation type:',
        options: ['Snow', 'Rain', 'Mixed snow & rain', 'None'],
        value: null,
        inline: true,
        order: 2
      },

      snowfallRate: {
        type: 'number',
        prompt: 'Snowfall rate (cm/hour):',
        options: {
          min: 1,
          max: 20
        },
        value: null,
        helpText: 'If there was no snow, please leave this field blank.',
        errorMessage: 'Number between 1 and 20 please.',
        order: 3
      },

      rainfallRate: {
        type: 'radio',
        prompt: 'Rainfall rate:',
        options: ['Drizzle', 'Showers', 'Raining', 'Pouring'],
        value: null,
        inline: true,
        helpText: 'If there was no rain, please leave this field blank.',
        order: 4
      },

      temperature: {
        type: 'number',
        prompt: 'Temperature at time of observation (deg C):',
        options: {
          min: -50,
          max: 40
        },
        value: null,
        errorMessage: 'Number between -50 and 40 please.',
        order: 5
      },

      minTemp: {
        type: 'number',
        prompt: 'Minimum temperature in last 24 hours (deg C)',
        options: {
          'min': -50,
          'max': 30
        },
        value: null,
        errorMessage: 'Number between -50 and 30 please.',
        order: 6
      },

      maxTemp: {
        type: 'number',
        prompt: 'Maximum temperature in last 24 hours (deg C):',
        options: {
          min: -40,
          max: 40
        },
        value: null,
        errorMessage: 'Number between -40 and 40 please.',
        order: 7
      },

      temperatureTrend: {
        type: 'radio',
        prompt: 'Temperature trend:',
        options: ['Falling', 'Steady', 'Rising'],
        value: null,
        inline: true,
        helpText: 'Describe how the temperature changed in the last 3 hours.',
        order: 8
      },

      newSnow24Hours: {
        type: 'number',
        prompt: 'Amount of new snow in last 24 hours (cm):',
        options: {
          min: 0,
          max: 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 9
      },

      precipitation24Hours: {
        type: 'number',
        prompt: 'Total rain and snow combined in last 24 hours (mm):',
        options: {
          min: 0,
          max: 100
        },
        value: null,
        errorMessage: 'Number between 0 and 100 please.',
        order: 10
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
        errorMessage: 'Number between 0 and 300 please.',
        order: 11
      },

      stormStartDate: {
        type: 'datetime',
        prompt: 'Storm start date:',
        showOnlyDate: true,
        value: null,
        helpText: 'The date on which the most recent storm started. Leave blank if there has not been a recent storm.',
        order: 12,
        maxDateToday: true
      },

      windSpeed: {
        type: 'radio',
        prompt: 'Wind speed:',
        options: ['Calm', 'Light (1-25 km/h)', 'Moderate (26-40 km/h)', 'Strong (41-60 km/h)', 'Extreme (>60 km/h)'],
        value: null,
        inline: true,
        helpText: 'Calm: smoke rises. Light: flags and twigs move. Moderate: snow begins to drift. Strong: whole tress in motion. Extreme: difficulty walking.',
        order: 13
      },

      windDirection: {
        type: 'radio',
        prompt: 'Wind direction:',
        options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        inline: true,
        value: null,
        order: 14
      },

      blowingSnow: {
        type: 'radio',
        prompt: 'Blowing snow:',
        options: ['None', 'Light', 'Moderate', 'Intense'],
        inline: true,
        helpText: 'How much snow is blowing at ridge crest elevation. Light: localized snow drifting. Moderate: a plume of snow is visible. Intense: a large plume moving snow well down the slope.',
        order: 15,
        value: null
      },

      weatherObsComment: {
        type: 'textarea',
        prompt: 'Weather observation comment',
        value: null,
        order: 16
      }
    };

    return acFormUtils.buildReport(fields);

  }]);

angular.module("acComponents.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("allmin-icon.html","<svg width=\"28px\" height=\"28px\" viewbox=\"0 0 28 28\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\"><title>all_min</title><g id=\"Styleguide\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\"><g id=\"02_01_Second-proposal-#2\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-30.000000, -101.000000)\" stroke=\"#FFFFFF\"><g id=\"all_min\" sketch:type=\"MSLayerGroup\" transform=\"translate(31.000000, 102.000000)\"><circle id=\"Oval-6\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\" cx=\"13\" cy=\"13\" r=\"13\"></circle><path id=\"Oval-5\" d=\"M20.6424365,23.5174622 C18.4973383,25.078868 15.8562401,26 13,26 C10.1408573,26 7.49729401,25.0769949 5.35102528,23.5126999 C5.35616485,23.5157039 5.35879172,23.5172209 5.35879172,23.5172209 L12.9999995,13 L20.6412083,23.5172209 C20.6412083,23.5172209 20.6416198,23.5173052 20.6424365,23.5174622 Z\" fill=\"#F44336\" sketch:type=\"MSShapeGroup\"></path><path id=\"Oval-1\" d=\"M13,0 C7.1843333,0 2.26060446,3.81883989 0.599648246,9.08568486 C0.623290506,9.01855468 0.636265288,8.98277907 0.636265288,8.98277907 L12.9999995,13 L13,0 Z\" fill=\"#03A9F4\" sketch:type=\"MSShapeGroup\"></path><path id=\"Oval-1\" d=\"M13,0 C18.8156667,0 23.7393955,3.81883989 25.4003518,9.08568486 C25.3767095,9.01855468 25.3637347,8.98277907 25.3637347,8.98277907 L13.0000005,13 L13,0 Z\" fill=\"#3F51B5\" sketch:type=\"MSShapeGroup\"></path><path id=\"Oval-3\" d=\"M7.63867216,23.5467443 C10.8878189,21.1834812 13.0000005,17.3516752 13.0000005,13.0265428 C13.0000005,11.6211191 12.7769788,10.2677848 12.3643955,9 L12.3637352,9.00932187 L0,13.0265428 L7.64120875,23.5437637 C7.64120875,23.5437637 7.64035873,23.5447686 7.63867216,23.5467443 Z\" fill=\"#4CAF50\" sketch:type=\"MSShapeGroup\" transform=\"translate(6.500000, 16.273372) scale(-1, 1) translate(-6.500000, -16.273372) \"></path><path id=\"Oval-3\" d=\"M20.6386717,23.5202015 C23.8878184,21.1569384 26,17.3251324 26,13 C26,11.5945763 25.7769784,10.241242 25.364395,8.97345721 L25.3637347,8.98277907 L12.9999995,13 L20.6412083,23.5172209 C20.6412083,23.5172209 20.6403583,23.5182258 20.6386717,23.5202015 Z\" fill=\"#FFC107\" sketch:type=\"MSShapeGroup\"></path></g></g></g></svg>");
$templateCache.put("danger-icon.html","<div class=\"danger-icon\"><svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"398.5 12.1 555 560\" enable-background=\"new 398.5 12.1 555 560\" xml:space=\"preserve\"><polygon id=\"alp\" points=\"747.7,218.1 623.1,197.6 678.8,109.8\"></polygon><polygon id=\"tln\" points=\"794.2,291 542.8,323.6 616.7,207.4 755.5,230.3\"></polygon><polygon id=\"btl\" points=\"858.3,391.8 499.4,391.8 535.1,335.5 800.6,301.1\"></polygon></svg><span>FORECAST</span></div>");
$templateCache.put("drawer.html","<div class=\"ac-drawer\"><div class=\"ac-drawer-tools\"><ul><li ng-if=\"drawerPosition === \'right\' &amp;&amp; isForecaster\" ng-click=\"goToHotZoneReport()\" class=\"ac-submit-report-tab on\"><i class=\"fa fa-plus fa-2x\"></i><i class=\"fa fa-exclamation-triangle fa-inverse fa-2x\"></i><span>Create HZR Report</span></li><li ng-if=\"drawerPosition === \'right\'\" ng-click=\"toggleForecast(\'hotzone\')\" ng-class=\"{on: hotZonesVisible}\" class=\"ac-report-tab\"><i class=\"fa fa-exclamation-triangle fa-inverse fa-2x\"></i><span>Hot Zone Report</span></li><li ng-if=\"drawerPosition === \'right\'\" ng-click=\"toggleForecast(\'region\')\" ng-class=\"{on: regionsVisible}\" style=\"margin-bottom: 50px;\"><div ac-danger-icon=\"ac-danger-icon\" style=\"height: 60px; width:60px;\"></div></li><li ng-if=\"drawerPosition === \'left\'\" ng-click=\"goToSubmitReport()\" class=\"ac-submit-report-tab on\"><i class=\"fa fa-plus fa-2x\"></i><i class=\"fa fa-tasks fa-inverse fa-2x\"></i><span>Create report</span></li><li ng-if=\"drawerPosition === \'left\'\" class=\"ac-filters ac-min-filters\"><ul ng-init=\"expandedMin = false\" ng-class=\"{opened: expandedMin}\" class=\"list-inline\"><li ng-click=\"expandedMin = !expandedMin\" class=\"ac-default-button on\"><i class=\"fa fa-map-marker fa-inverse fa-2x\"></i><span>MIN Filters</span></li><li ng-repeat=\"minFilter in minFilters\" ng-if=\"expandedMin\" ng-click=\"toggleFilter(\'minFilter:\'+ minFilter)\" ng-class=\"{on: getMinFilters(minFilter)}\"><div ac-allmin-icon=\"ac-allmin-icon\" ng-if=\"minFilter === \'all min\'\" class=\"report-allmin\"></div><i ng-class=\"\'report-\'+ minFilter\" ng-if=\"minFilter !== \'all min\'\" class=\"fa fa-map-marker fa-inverse fa-2x\"></i><span ng-class=\"{\'no-top\': minFilter == \'all min\' }\">{{ minFilter }}</span></li></ul></li><li ng-if=\"drawerPosition === \'left\'\" class=\"ac-filters ac-default-filters\"><ul ng-class=\"{opened: expandedDate}\" class=\"list-inline\"><li ng-click=\"toggleDateFilters()\" class=\"ac-default-button on\"><i class=\"fa fa-calendar fa-inverse fa-2x\"></i><span>Date filter</span></li><li ng-repeat=\"dateFilter in dateFilters\" ng-if=\"expandedDate\" ng-click=\"toggleFilter(\'obsPeriod:\'+dateFilter);\" ng-class=\"{on: filters.obsPeriod === dateFilter}\"><i class=\"fa fa-calendar fa-inverse fa-2x\"></i><span>{{ dateFilter }}</span></li></ul></li><!--Previous behaviour where date filter selected is visible--><!--li.ac-filters.ac-date-filters(ng-if=\"drawerPosition === \'left\'\")--><!--  ul.list-inline(ng-class=\"{opened: expandedDate}\")--><!--    li.on(ng-click=\"toggleDateFilters()\")--><!--      i.fa.fa-calendar.fa-inverse.fa-2x--><!--      span {{ filters.obsPeriod }}--><!--    li(ng-repeat=\"dateFilter in dateFilters\", ng-if=\"expandedDate\", ng-click=\"toggleFilter(\'obsPeriod:\'+dateFilter);\", ng-class=\"{hidden: filters.obsPeriod === dateFilter}\")--><!--      i.fa.fa-calendar.fa-inverse.fa-2x--><!--      span {{ dateFilter }}--></ul></div><div ng-transclude=\"ng-transclude\" class=\"ac-drawer-body\"></div></div>");
$templateCache.put("forecast-mini-avalx.html","<div class=\"panel-body ac-forecast-mini-body\"><div class=\"row\"><div class=\"col-xs-1\"><div ng-click=\"closeDrawer()\" class=\"pull-left close-drawer\"><i class=\"fa fa-close\"></i></div></div><div style=\"margin: 10px 0;\" class=\"col-xs-5\"><h4 class=\"ac-forecast-region\">{{ forecast.bulletinTitle | acNormalizeForecastTitle }}</h4></div><div ng-switch=\"forecast.region\"><div ng-switch-when=\"kananaskis\" class=\"col-xs-6\"><a target=\"_blank\" href=\"\" class=\"pull-right\"><img style=\"width:75px;\" src=\"http://www.avalanche.ca/assets/images/kananaskis.jpg\"/></a></div><div ng-switch-when=\"whistler-blackcomb\" class=\"col-xs-6 ac-forcast-mini--wbc-logo\"><div class=\"logo-row\">\n  <img class=\"wbc-logo\" src=\"https://res.cloudinary.com/avalanche-ca/image/upload/c_scale,w_190/v1447367526/logos/OriginalSizeLogos/WBWhoosh_RedBlack.png\" />\n</div>\n<div class=\"logo-row\">\n  <img class=\"xc-logo\" src=\"https://res.cloudinary.com/avalanche-ca/image/upload/c_scale,w_55/v1447367393/logos/OriginalSizeLogos/EC_black.png\" />\n  <img class=\"whs-logo\" src=\"https://res.cloudinary.com/avalanche-ca/image/upload/c_scale,w_136/v1447367393/logos/OriginalSizeLogos/Whistler_HeliSki_Logo.png\"/>\n</div>\n</div><div ng-switch-default=\"ng-switch-default\" class=\"col-xs-6\"><a target=\"_blank\" href=\"{{sponsor.getText(&quot;sponsor.url&quot;)}}\" class=\"pull-right\"><img src=\"{{sponsor.getText(&quot;sponsor.image-229&quot;)}}\"/></a></div></div></div><div class=\"row ac-forecast-dates\"><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">DATE ISSUED</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.dateIssued | date:\'EEEE MMMM d, y h:mm a\'  | uppercase }}</span></dt></dl></div><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">VALID UNTIL</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.validUntil | date:\'EEEE MMMM d, y h:mm a\' | uppercase }}</span></dt></dl></div></div><div class=\"row\"><div class=\"col-xs-12\"><p class=\"ac-forecast-highlights\"><strong ng-bind-html=\"forecast.highlights\"></strong></p></div></div><div class=\"row\"><div style=\"padding-right:0\" class=\"col-xs-12 observation-tabs\"><ul role=\"tablist\" style=\"text-transform: uppercase;\" class=\"nav nav-pills\"><li class=\"active\"><a href=\"\" role=\"tab\" data-target=\"#forecast\" data-toggle=\"tab\">Forecast</a></li><li><a href=\"\" role=\"tab\" data-target=\"#problems\" data-toggle=\"tab\">Problems</a></li><li><a href=\"\" role=\"tab\" data-target=\"#details\" data-toggle=\"tab\">Details</a></li><li><a href=\"/forecasts/{{forecast.region}}\" target=\"_blank\" role=\"tab\">Full Page</a></li><li><a href=\"/weather\" target=\"_blank\" role=\"tab\">Weather</a></li></ul><div class=\"tab-content\"><div id=\"forecast\" class=\"tab-pane active\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"panel panel-primary\"><div class=\"panel-heading\">{{ forecast.dangerRatings[0].date | dateUtc:\'dddd\' }}</div><div class=\"panel-body ac-forecast-nowcast\"><img ng-show=\"forecast.region\" ng-src=\"{{forecast.region &amp;&amp; apiUrl+\'/api/forecasts/\' + forecast.region  + \'/nowcast.svg\' || \'\'}}\" class=\"ac-nowcast\"/></div><table class=\"table table-condensed ac-forecast-days\"><thead class=\"ac-thead-dark\"><tr><th></th><th>{{ forecast.dangerRatings[1].date | dateUtc:\'dddd\' }}</th><th>{{ forecast.dangerRatings[2].date | dateUtc:\'dddd\' }}</th></tr></thead><tbody><tr><td class=\"ac-veg-zone--alp\"><strong>Alpine</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.alp.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.alp.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--tln\"><strong>Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.tln.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.tln.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--btl\"><strong>Below Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.btl.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.btl.replace(\':\', \' \') }}</strong></td></tr><tr><td><strong>Confidence:</strong></td><td colspan=\"2\"><span class=\"ac-text-default\">{{ forecast.confidence }}</span></td></tr></tbody></table><footer id=\"forecast-bulletin\" class=\"col-xs-12\"></footer><div class=\"panel-group\"><div ng-switch=\"forecast.region\"><div ng-switch-when=\"whistler-blackcomb\"><whistler-links></whistler-links></div><div ng-switch-default=\"ng-switch-default\"><div class=\"panel panel-default first\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#collapseTwo\" data-parent=\"#accordion\" data-toggle=\"collapse\" class=\"collapsed\">{{dangerRating.getText(\'generic.title\')}}</a></h4><div id=\"collapseTwo\" class=\"collapse\"><div ng-bind-html=\"dangerRating.getStructuredText(\'generic.body\').asHtml(ctx)\" class=\"panel-body\"></div></div></div><div class=\"panel panel-default last\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#collapseOne\" data-parent=\"#accordion\" data-toggle=\"collapse\" class=\"collapsed\">{{disclaimer.getText(\'generic.title\')}}</a></h4><div id=\"collapseOne\" class=\"collapse\"><div ng-bind-html=\"disclaimer.getStructuredText(\'generic.body\').asHtml(ctx)\" class=\"panel-body\"></div></div></div></div></div></div></div></div></div></div><div id=\"problems\" class=\"tab-pane\"><div id=\"problemsAccordion\" class=\"panel-group\"><div ng-repeat=\"problem in forecast.problems\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#problem{{$index}}\" data-toggle=\"collapse\" data-parent=\"#problemsAccordion\">{{ problem.type }}<i class=\"fa fa-fw fa-level-down pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"problem{{$index}}\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Elevations?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--elevations\"><img ng-src=\"{{problem.icons.elevations}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Aspects?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--aspects\"><img ng-src=\"{{problem.icons.aspects}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Chances of Avalanches?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--likelihood\"><img ng-src=\"{{problem.icons.likelihood}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Expected Size?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--expected-size\"><img ng-src=\"{{problem.icons.expectedSize}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-12\"><p ng-bind-html=\"problem.comment\" class=\"ac-problem narative\"></p><div class=\"panel panel-default ac-problem-travel-advice\"><div class=\"panel-heading\"><strong class=\"small\">Travel and Terrain Advice</strong></div><div class=\"panel-body\"><p ng-bind-html=\"problem.travelAndTerrainAdvice\"></p></div></div></div></div></div></div></div></div></div><div id=\"details\" class=\"tab-pane\"><div id=\"detailsAccordion\" class=\"panel-group\"><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#avalancheSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Avalanche Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"avalancheSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.avalancheSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#snowpackSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Snowpack Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"snowpackSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.snowpackSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#weatherForecast\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Weather Forecast<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"weatherForecast\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.weatherForecast\" class=\"panel-body\"></div></div></div></div></div></div></div></div></div>");
$templateCache.put("forecast-mini-external.html","<div style=\"min-height: 500px;\" class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-forecast-region\">{{ forecast.name }}</h3></div></div><div class=\"row\"><div class=\"col-xs-12\"><p>Avalanche information for this region is available &nbsp;<a ng-href=\"{{forecast.externalUrl}}\" target=\"_blank\"><i class=\"fa fa-external-link\">here.</i></a></p></div></div></div>");
$templateCache.put("forecast-mini-parks.html","<div style=\"min-height: 500px;\" class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-forecast-region\">{{ forecast.name }}</h3></div></div><div class=\"row\"><div class=\"col-xs-12\"><p>Avalanche information for this region is available &nbsp;<a ng-href=\"{{forecast.parksUrl}}\" target=\"_blank\"><i class=\"fa fa-external-link\">here.</i></a></p></div></div></div>");
$templateCache.put("forecast-mini.html","<div class=\"panel\"><div ng-show=\"forecast.externalUrl\"><ac-forecast-mini-external forecast=\'forecast\' /></div><div ng-show=\"forecast.parksUrl\"><ac-forecast-mini-parks forecast=\'forecast\' /></div><div ng-hide=\"forecast.externalUrl || forecast.parksUrl\"><ac-forecast-mini-avalx forecast=\'forecast\' danger-rating=\'dangerRating\' disclaimer=\'disclaimer\' sponsor=\'sponsor\' /></div></div>");
$templateCache.put("hot-zone-mini.html","<div class=\"panel\"><div class=\"panel-body ac-forecast-mini-body\"><div class=\"row\"><div class=\"col-xs-1\"><div ng-click=\"closeDrawer()\" class=\"pull-left close-drawer\"><i class=\"fa fa-close\"></i></div></div><div style=\"margin: 10px 0; padding: 0;\" class=\"col-xs-6\"><h4 class=\"ac-forecast-region\">{{ region.name }} Pilot Project</h4></div><div class=\"col-xs-5\"><a target=\"_blank\" href=\"http://www.avalanche.ca\" class=\"pull-right\"><img src=\"http://www.avalanche.ca/assets/avalanche_canada.svg\"/></a></div></div><div class=\"row\"><div ng-if=\"hotZone !== &quot;default&quot;\" style=\"margin: 10px 0;\" class=\"col-sm-12 section-label full-page-link\"><div ng-click=\"viewFullPage(hotZone.subid)\" class=\"pull-right\"><i class=\"fa fa-external-link\"></i><span>&nbsp; FULL PAGE</span></div></div></div><div class=\"row ac-forecast-dates\"><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">DATE ISSUED</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ formatDate(hotZone.report.dateissued) || \'N/A\'| date:\'EEEE MMMM d, y h:mm a\'  | uppercase }}</span></dt></dl></div><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">VALID UNTIL</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ formatDate(hotZone.report.datevalid)  || \'N/A\'| date:\'EEEE MMMM d, y h:mm a\' | uppercase }}</span></dt></dl></div></div><div ng-if=\"hotZone !== &quot;default&quot;\" class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-hot-zone-headline\">{{ hotZone.report.headline }}</h3></div></div><div ng-if=\"hotZone === &quot;default&quot;\" class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-hot-zone-headline\">A Hot Zone Report is not available.</h3></div></div><div ng-if=\"hotZone.report.uploads.length &gt; 0\" class=\"row\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-camera\"></i><span>   Uploads (click/tap to enlarge)</span></div><div class=\"col-sm-12\"><ul class=\"list-inline\"><li ng-repeat=\"url in hotZone.report.thumbs\"><a ng-href=\"{{url}}\" target=\"_blank\"><img ng-src=\"{{url}}\" width=\"75\" alt=\"{{hotZone.report.headline}}\"/></a></li></ul></div></div><div class=\"row\"><div class=\"col-xs-12\"><div id=\"infoAccordion\" class=\"panel-group\"><div ng-if=\"hotZone !== &quot;default&quot;\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#criticalSummary\" data-toggle=\"collapse\" data-parent=\"#infoAccordion\">Critical Factors Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"criticalSummary\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\">Critical factors influence avalanche hazard. The more critical factors, the greater the potential for avalanches.</div></div><div class=\"row-fluid section-label\"><i class=\"fa fa-info-circle\"></i><span>Information</span></div><ul class=\"observation-information\"><li class=\"observation-item\">Persistent avalanche problem: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.persistentAvalancheProblem || \'N/A\' }}</span></li><li class=\"observation-item\">Slab avalanches in the last 48 hours: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.slabAvalanches || \'N/A\' }}</span></li><li class=\"observation-item\">Signs of instability: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.instability || \'N/A\' }}</span></li><li class=\"observation-item\">Recent snowfall > 30cm: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.recentSnowfall || \'N/A\' }}</span></li><li class=\"observation-item\">Recent rainfall: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.recentRainfall || \'N/A\' }}</span></li><li class=\"observation-item\">Recent windloading: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.recentWindloading || \'N/A\' }}</span></li><li class=\"observation-item\">Significant warming: &nbsp;<span class=\"value\">{{ hotZone.report.data.criticalFactors.significantWarming || \'N/A\' }}</span></li></ul><div class=\"observation-item comments\"><div class=\"row-fluid section-label\"><i class=\"fa fa-comment\"></i><span>Comments</span></div><div class=\"row-fluid\"><div class=\"col-sm-12\">{{ hotZone.report.data.criticalFactors.criticalFactorsComments || \'N/A\' }}</div></div></div></div></div></div><div ng-if=\"hotZone !== &quot;default&quot;\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#terrainSummary\" data-toggle=\"collapse\" data-parent=\"#infoAccordion\">Terrain and Travel Advice<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"terrainSummary\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\">To minimize risk, always:<ul><li>Expose only one person at a time in avalanche terrain.</li><li>Group up only in safe locations well away from avalanche runout zones.</li><li>Avoid terrain traps whenever possible.</li></ul></div></div><div class=\"row\"><div class=\"col-xs-12\">And while this report is valid:<ul><li>AVOID terrain features marked with a &nbsp;<i class=\"fa fa-check-square-o terrain-highlight\"></i></li><li>Follow the travel advice below.</li></ul></div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>ALPINE</h4></div></div><div class=\"row\"><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.alpineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.alpineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ hotZone.report.data.alpineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>TREELINE</h4></div></div><div class=\"row\"><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.treelineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.treelineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ hotZone.report.data.treelineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>BELOW TREELINE</h4></div></div><div class=\"row\"><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.belowTreelineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-6\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in hotZone.report.data.belowTreelineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right terrain-icon\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa pull-right\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ hotZone.report.data.belowTreelineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div></div></div></div><div ng-if=\"hotZone === &quot;default&quot;\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#noDataSummary\" data-toggle=\"collapse\" data-parent=\"#infoAccordion\">More Information<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"noDataSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"noDataSummary\" class=\"panel-body\"></div></div></div><div style=\"margin-bottom: 10px;\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#infoSummary\" data-toggle=\"collapse\" data-parent=\"#infoAccordion\">About<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"infoSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"infoSummary\" class=\"panel-body\"></div></div></div></div></div></div></div></div>");
$templateCache.put("hot-zone-report-form.html","<div class=\"min-form\"><form name=\"acHotZoneForm\" novalidate=\"novalidate\" ng-if=\"!report.subid\" role=\"form\" ac-submission-form-validator=\"ac-submission-form-validator\"><div class=\"form-fields col-xs-12 no-padding\"><div class=\"col-xs-12 col-md-4 form-left-column\"><div class=\"required-info clearfix\"><h3 class=\"form-subtitle\">Step 1. Required Info</h3><div class=\"required-info-data col-xs-12\"><div ng-class=\"{\'has-error\': !acHotZoneForm.title.$valid &amp;&amp; acHotZoneForm.title.$dirty }\" class=\"form-group\"><h4>Headline</h4><input type=\"text\" name=\"title\" ng-model=\"report.headline\" placeholder=\"e.g. two - three sentences\" required=\"required\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': !acHotZoneForm.dateissued.$valid}\" class=\"form-group\"><h4> Date of issue</h4><input type=\"datetime\" name=\"dateissued\" ng-model=\"report.dateissued\" ac-datetime-picker=\"ac-datetime-picker\" max-date-today=\"false\" min-date-today=\"true\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': !acHotZoneForm.datevalid.$valid}\" class=\"form-group\"><h4> Valid until</h4><input type=\"datetime\" name=\"datevalid\" ng-model=\"report.datevalid\" ac-datetime-picker=\"ac-datetime-picker\" max-date-today=\"false\" min-date-today=\"true\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': invalidLocation}\" class=\"form-group\"><h4> Region</h4><div ng-repeat=\"option in hotZones\" style=\"margin-top: 10px;\" class=\"radio col-md-6 col-xs-12\"><label style=\"color: black;\"><input type=\"radio\" ng-model=\"report.hotzoneid\" value=\"{{option.properties.id}}\" ng-click=\"invalidLocation = false\"/>{{option.properties.name}}</label></div></div></div></div><div class=\"uploads\"><h3 class=\"form-subtitle\">Step 2. Uploads</h3><p>Add a photo (.jpg or .png).</p><div class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i>If uploading more than one photo, select all and submit photos together.</p></div><div class=\"form-group\"><div class=\"col-xs-12 no-padding btn-file\"><div class=\"col-xs-3 no-padding\"><span class=\"btn btn-default btn-styled\">Browse</span></div><input type=\"text\" readonly=\"readonly\" placeholder=\".jpg or .png\" value=\"{{ report.files.length ? report.files.length + \' photos added\' : null}}\" class=\"col-xs-9 no-padding\"/><input type=\"file\" name=\"uploads\" file-model=\"report.files\" accept=\".png,.jpg,.jpeg\" multiple=\"multiple\"/></div></div></div></div><div class=\"col-xs-12 col-md-8 form-right-column\"><div class=\"row\"><div class=\"col-xs-12\"><h3 style=\"margin: 7.5px 0;\" id=\"top\" class=\"form-subtitle\">Step 3. Report Details</h3></div></div><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"form-subsection\">Critical Factors Summary</h4></div></div><div style=\"margin: 0;\" class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, av) in report.data.criticalFactors.fields\" ng-if=\"av.type!==\'calculated\'\" class=\"field col-xs-12\"><h4 ng-if=\"av.title === undefined &amp;&amp; av.subTitle === undefined\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.prompt }}</strong></h4><h4 ng-if=\"av.title !== undefined &amp;&amp; av.title !== null\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.title }}</strong></h4><h5 ng-if=\"av.subTitle !== undefined\" class=\"col-xs-12 no-padding\">{{ ::av.subTitle }}</h5><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"av.helpText\" class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i><span>{{ ::av.helpText}}</span><span ng-if=\"av.guidelines\"><a href=\"{{ ::av.guidelines}}\" target=\"_blank\">Submission guidelines</a></span></p></div><div ng-if=\"av.type==\'checkbox\'\" ng-repeat=\"(option, enabled) in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"checkbox col-md-6 col-xs-12\"><label><input type=\"checkbox\" name=\"{{::item}}\" ng-model=\"av.options[option]\" ng-click=\"validate(item, av)\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'radio\'\" ng-repeat=\"option in av.options\" ng-class=\"{\'inline\':av.inline}\" style=\"margin: 0;\" class=\"radio col-md-12 col-xs-12\"><label><input type=\"radio\" ng-model=\"report.data.criticalFactors.fields[item].value\" value=\"{{ ::option}}\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'number\'\" ng-class=\"{\'inline\':av.inline}\" class=\"number col-xs-12\"><label><input type=\"number\" name=\"{{::item}}\" placeholder=\"{{ av.placeholder ? av.placeholder : \'Number between \'+ av.options.min +\' and \'+av.options.max }}\" ng-model=\"report.data.criticalFactors.fields[item].value\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'text\'\" ng-class=\"{\'inline\':av.inline}\" class=\"text col-xs-12\"><label><input type=\"text\" name=\"{{::item}}\" placeholder=\"{{ ::av.prompt }}\" ng-model=\"report.data.criticalFactors.fields[item].value\" ng-required=\"report.data.criticalFactors.fields[av.constraint.field].options[av.constraint.option]\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'dropdown\'\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"select col-md-6 col-xs-12 no-padding\"><select ng-options=\"option for option in av.options\" ng-model=\"report.data.criticalFactors.fields[item].value\" class=\"form-control\"><option value=\"\">Select option</option></select></div><div ng-if=\"av.type==\'textarea\'\" class=\"textarea col-xs-12\"><textarea rows=\"3\" ng-model=\"report.data.criticalFactors.fields[item].value\" class=\"form-control\"></textarea></div><div ng-if=\"av.type==\'datetime\'\" class=\"datetime-input col-xs-12\"><label for=\"datetime\"><input type=\"datetime\" ng-model=\"report.data.criticalFactors.fields[item].value\" ac-datetime-picker=\"ac-datetime-picker\" show-only-date=\"av.showOnlyDate\" show-only-time=\"av.showOnlyTime\" max-date-today=\"av.maxDateToday\" placeholder=\"{{av.placeholder ? av.placeholder : \'Click to select date\'}}\" class=\"form-control\"/></label></div><div ng-if=\"acHotZoneForm[item].$invalid\" class=\"error col-xs-12 no-padding\">{{::av.errorMessage}}</div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"form-subsection\">Alpine Terrain Avoidance</h4></div></div><div style=\"margin: 0;\" class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, av) in report.data.alpineTerrainAvoidance.fields\" ng-if=\"av.type!==\'calculated\'\" class=\"field col-xs-12\"><h4 ng-if=\"av.title === undefined &amp;&amp; av.subTitle === undefined\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.prompt }}</strong></h4><h4 ng-if=\"av.title !== undefined &amp;&amp; av.title !== null\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.title }}</strong></h4><h5 ng-if=\"av.subTitle !== undefined\" class=\"col-xs-12 no-padding\">{{ ::av.subTitle }}</h5><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"av.helpText\" class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i><span>{{ ::av.helpText}}</span><span ng-if=\"av.guidelines\"><a href=\"{{ ::av.guidelines}}\" target=\"_blank\">Submission guidelines</a></span></p></div><div ng-if=\"av.type==\'checkbox\'\" ng-repeat=\"(option, enabled) in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd, \'col-md-12\': av.prompt===\'Elevation band:\'}\" ng-style=\"av.prompt===\'Elevation band:\' &amp;&amp; {\'margin\': \'0\'}\" class=\"checkbox col-md-6 col-xs-12\"><label><input type=\"checkbox\" name=\"{{::item}}\" ng-model=\"av.options[option]\" ng-click=\"checkAll(option, av.options)\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'radio\'\" ng-repeat=\"option in av.options\" ng-class=\"{\'inline\':av.inline}\" style=\"margin-top: 0;\" class=\"radio col-md-12 col-xs-12\"><label><input type=\"radio\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" value=\"{{ ::option}}\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'number\'\" ng-class=\"{\'inline\':av.inline}\" class=\"number col-xs-12\"><label><input type=\"number\" name=\"{{::item}}\" placeholder=\"{{ av.placeholder ? av.placeholder : \'Number between \'+ av.options.min +\' and \'+av.options.max }}\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'text\'\" ng-class=\"{\'inline\':av.inline}\" class=\"text col-xs-12\"><label><input type=\"text\" name=\"{{::item}}\" placeholder=\"{{ ::av.prompt }}\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" ng-required=\"report.data.alpineTerrainAvoidance.fields[av.constraint.field].options[av.constraint.option]\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'dropdown\'\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"select col-md-6 col-xs-12 no-padding\"><select ng-options=\"option for option in av.options\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" class=\"form-control\"><option value=\"\">Select option</option></select></div><div ng-if=\"av.type==\'textarea\'\" class=\"textarea col-xs-12\"><textarea rows=\"3\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" class=\"form-control\"></textarea></div><div ng-if=\"av.type==\'datetime\'\" class=\"datetime-input col-xs-12\"><label for=\"datetime\"><input type=\"datetime\" ng-model=\"report.data.alpineTerrainAvoidance.fields[item].value\" ac-datetime-picker=\"ac-datetime-picker\" show-only-date=\"av.showOnlyDate\" show-only-time=\"av.showOnlyTime\" max-date-today=\"av.maxDateToday\" placeholder=\"{{av.placeholder ? av.placeholder : \'Click to select date\'}}\" class=\"form-control\"/></label></div><div ng-if=\"acHotZoneForm[item].$invalid\" class=\"error col-xs-12 no-padding\">{{::av.errorMessage}}</div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"form-subsection\">Treeline Terrain Avoidance</h4></div></div><div style=\"margin: 0;\" class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, av) in report.data.treelineTerrainAvoidance.fields\" ng-if=\"av.type!==\'calculated\'\" class=\"field col-xs-12\"><h4 ng-if=\"av.title === undefined &amp;&amp; av.subTitle === undefined\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.prompt }}</strong></h4><h4 ng-if=\"av.title !== undefined &amp;&amp; av.title !== null\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.title }}</strong></h4><h5 ng-if=\"av.subTitle !== undefined\" class=\"col-xs-12 no-padding\">{{ ::av.subTitle }}</h5><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"av.helpText\" class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i><span>{{ ::av.helpText}}</span><span ng-if=\"av.guidelines\"><a href=\"{{ ::av.guidelines}}\" target=\"_blank\">Submission guidelines</a></span></p></div><div ng-if=\"av.type==\'checkbox\'\" ng-repeat=\"(option, enabled) in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd, \'col-md-12\': av.prompt===\'Elevation band:\'}\" ng-style=\"av.prompt===\'Elevation band:\' &amp;&amp; {\'margin\': \'0\'}\" class=\"checkbox col-md-6 col-xs-12\"><label><input type=\"checkbox\" name=\"{{::item}}\" ng-model=\"av.options[option]\" ng-click=\"checkAll(option, av.options)\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'radio\'\" ng-repeat=\"option in av.options\" ng-class=\"{\'inline\':av.inline}\" style=\"margin-top: 0;\" class=\"radio col-md-12 col-xs-12\"><label><input type=\"radio\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" value=\"{{ ::option}}\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'number\'\" ng-class=\"{\'inline\':av.inline}\" class=\"number col-xs-12\"><label><input type=\"number\" name=\"{{::item}}\" placeholder=\"{{ av.placeholder ? av.placeholder : \'Number between \'+ av.options.min +\' and \'+av.options.max }}\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'text\'\" ng-class=\"{\'inline\':av.inline}\" class=\"text col-xs-12\"><label><input type=\"text\" name=\"{{::item}}\" placeholder=\"{{ ::av.prompt }}\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" ng-required=\"report.data.treelineTerrainAvoidance.fields[av.constraint.field].options[av.constraint.option]\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'dropdown\'\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"select col-md-6 col-xs-12 no-padding\"><select ng-options=\"option for option in av.options\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" class=\"form-control\"><option value=\"\">Select option</option></select></div><div ng-if=\"av.type==\'textarea\'\" class=\"textarea col-xs-12\"><textarea rows=\"3\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" class=\"form-control\"></textarea></div><div ng-if=\"av.type==\'datetime\'\" class=\"datetime-input col-xs-12\"><label for=\"datetime\"><input type=\"datetime\" ng-model=\"report.data.treelineTerrainAvoidance.fields[item].value\" ac-datetime-picker=\"ac-datetime-picker\" show-only-date=\"av.showOnlyDate\" show-only-time=\"av.showOnlyTime\" max-date-today=\"av.maxDateToday\" placeholder=\"{{av.placeholder ? av.placeholder : \'Click to select date\'}}\" class=\"form-control\"/></label></div><div ng-if=\"acHotZoneForm[item].$invalid\" class=\"error col-xs-12 no-padding\">{{::av.errorMessage}}</div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"form-subsection\">Below Treeline Terrain Avoidance</h4></div></div><div style=\"margin: 0;\" class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, av) in report.data.belowTreelineTerrainAvoidance.fields\" ng-if=\"av.type!==\'calculated\'\" class=\"field col-xs-12\"><h4 ng-if=\"av.title === undefined &amp;&amp; av.subTitle === undefined\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.prompt }}</strong></h4><h4 ng-if=\"av.title !== undefined &amp;&amp; av.title !== null\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.title }}</strong></h4><h5 ng-if=\"av.subTitle !== undefined\" class=\"col-xs-12 no-padding\">{{ ::av.subTitle }}</h5><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"av.helpText\" class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i><span>{{ ::av.helpText}}</span><span ng-if=\"av.guidelines\"><a href=\"{{ ::av.guidelines}}\" target=\"_blank\">Submission guidelines</a></span></p></div><div ng-if=\"av.type==\'checkbox\'\" ng-repeat=\"(option, enabled) in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd, \'col-md-12\': av.prompt===\'Elevation band:\'}\" ng-style=\"av.prompt===\'Elevation band:\' &amp;&amp; {\'margin\': \'0\'}\" class=\"checkbox col-md-6 col-xs-12\"><label><input type=\"checkbox\" name=\"{{::item}}\" ng-model=\"av.options[option]\" ng-click=\"checkAll(option, av.options)\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'radio\'\" ng-repeat=\"option in av.options\" ng-class=\"{\'inline\':av.inline}\" style=\"margin-top: 0;\" class=\"radio col-md-12 col-xs-12\"><label><input type=\"radio\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" value=\"{{ ::option}}\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'number\'\" ng-class=\"{\'inline\':av.inline}\" class=\"number col-xs-12\"><label><input type=\"number\" name=\"{{::item}}\" placeholder=\"{{ av.placeholder ? av.placeholder : \'Number between \'+ av.options.min +\' and \'+av.options.max }}\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'text\'\" ng-class=\"{\'inline\':av.inline}\" class=\"text col-xs-12\"><label><input type=\"text\" name=\"{{::item}}\" placeholder=\"{{ ::av.prompt }}\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" ng-required=\"report.data.belowTreelineTerrainAvoidance.fields[av.constraint.field].options[av.constraint.option]\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'dropdown\'\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"select col-md-6 col-xs-12 no-padding\"><select ng-options=\"option for option in av.options\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" class=\"form-control\"><option value=\"\">Select option</option></select></div><div ng-if=\"av.type==\'textarea\'\" class=\"textarea col-xs-12\"><textarea rows=\"3\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" class=\"form-control\"></textarea></div><div ng-if=\"av.type==\'datetime\'\" class=\"datetime-input col-xs-12\"><label for=\"datetime\"><input type=\"datetime\" ng-model=\"report.data.belowTreelineTerrainAvoidance.fields[item].value\" ac-datetime-picker=\"ac-datetime-picker\" show-only-date=\"av.showOnlyDate\" show-only-time=\"av.showOnlyTime\" max-date-today=\"av.maxDateToday\" placeholder=\"{{av.placeholder ? av.placeholder : \'Click to select date\'}}\" class=\"form-control\"/></label></div><div ng-if=\"acHotZoneForm[item].$invalid\" class=\"error col-xs-12 no-padding\">{{::av.errorMessage}}</div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div></div></div><div class=\"footer-buttons col-xs-12 no-padding\"><input type=\"button\" value=\"Back\" ng-click=\"goBack(acHotZoneForm.$dirty)\" class=\"btn btn-default btn-styled\"/><div class=\"submit-btn\"><i ng-show=\"submitting\" class=\"fa fa-fw fa-lg fa-spinner fa-spin\"></i><input type=\"button\" ng-click=\"submitForm()\" id=\"submit\" value=\"SUBMIT\" ng-disabled=\"report.latlng.length === 0 || submitting\" class=\"btn btn-default btn-styled\"/></div></div></form><div ng-if=\"error\"><div role=\"alert\" class=\"alert alert-danger\"><p>There was an error submitting your report.</p><p ng-if=\"errormsg\">{{errormsg}}</p></div></div></div>");
$templateCache.put("hot-zone-report-fullpage.html","<div class=\"panel\"><div class=\"panel-body\"><div class=\"row\"><header class=\"col-xs-12\"><div id=\"header-inner\"><h1>{{ report.hotzoneid | acCapitalize }} Pilot Project</h1><div><div id=\"forecast-sponsor-desktop\" class=\"hidden-xs\"><p>Brought to you by</p><a target=\"_blank\" href=\"http://www.avalanche.ca\"><img src=\"http://www.avalanche.ca/assets/avalanche_canada.svg\"/></a></div></div><div ng-click=\"print()\" style=\"position: absolute; top: 130px; right: 0;\" class=\"section-label print-link pull-right\"><i class=\"fa fa-external-link\"></i><span>&nbsp; Print Friendly</span></div></div></header><section id=\"forecast-date\" class=\"col-xs-12\"><div id=\"date-issued\" class=\"forecast-date-inner\">Date Issued &nbsp;<br class=\"visible-xs-inline\"/><span> {{ formatDate(report.report.dateissued) | date:\'EEE MMMM d, h:mm a\' | uppercase }}</span></div><div id=\"date-valid\" style=\"width: 574px;\" class=\"forecast-date-inner\">&nbsp; Valid Until &nbsp;<br class=\"visible-xs-inline\"/><span>{{ formatDate(report.report.datevalid) | date:\'EEE MMMM d, h:mm a\' | uppercase }}</span></div><div id=\"date-issued\" ng-if=\"report.user\" class=\"forecast-date-inner\">Forecaster &nbsp;<br class=\"visible-xs-inline\"/><span>{{ report.user }}</span></div><div id=\"date-valid\" ng-if=\"report.user\" style=\"width: 574px;\" class=\"forecast-date-inner\"></div></section><section id=\"forecast-body\" class=\"col-xs-12 col-md-12\"><div id=\"highlights\" class=\"print-margin\"><h2>{{report.report.headline}}</h2></div><div ng-if=\"report.report.uploads.length &gt; 0\" class=\"upload-n-share\"><div class=\"row-fluid observation-title\">Uploads</div><div class=\"row\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-camera\"></i><span>Uploads (click/tap to enlarge)</span></div><div class=\"col-sm-12\"><ul class=\"list-inline\"><li ng-repeat=\"url in report.report.thumbs\"><a ng-href=\"{{::url}}\" target=\"_blank\"><img ng-src=\"{{::url}}\" width=\"75\" alt=\"{{::report.report.headline}}\"/></a></li></ul></div></div></div><div class=\"panel-group\"><div class=\"panel panel-primary\"><div class=\"panel-heading\">Critical Factors Summary</div><div class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\">Critical factors influence avalanche hazard. The more critical factors, the greater the potential for avalanches.</div></div><div class=\"row-fluid section-label\"><i class=\"fa fa-info-circle\"></i><span>Information</span></div><ul class=\"observation-information\"><li class=\"observation-item\">Persistent avalanche problem: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.persistentAvalancheProblem || \'N/A\' }}</span></li><li class=\"observation-item\">Slab avalanches in the last 48 hours: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.slabAvalanches || \'N/A\' }}</span></li><li class=\"observation-item\">Signs of instability: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.instability || \'N/A\' }}</span></li><li class=\"observation-item\">Recent snowfall > 30cm: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.recentSnowfall || \'N/A\' }}</span></li><li class=\"observation-item\">Recent rainfall: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.recentRainfall || \'N/A\' }}</span></li><li class=\"observation-item\">Recent windloading: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.recentWindloading || \'N/A\' }}</span></li><li class=\"observation-item\">Significant warming: &nbsp;<span class=\"value\">{{ report.report.data.criticalFactors.significantWarming || \'N/A\' }}</span></li></ul><div class=\"observation-item comments\"><div class=\"row-fluid section-label\"><i class=\"fa fa-comment\"></i><span>Comments</span></div><div class=\"row-fluid\"><div class=\"col-sm-12\">{{ report.report.data.criticalFactors.criticalFactorsComments || \'N/A\' }}</div></div></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\">Terrain and Travel Advice</div><div class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\">To minimize risk, always:<ul><li>Expose only one person at a time in avalanche terrain.</li><li>Group up only in safe locations well away from avalanche runout zones.</li><li>Avoid terrain traps whenever possible.</li></ul></div></div><div class=\"row\"><div class=\"col-xs-12\">And while this report is valid:<ul><li>AVOID terrain features marked with a &nbsp;<i class=\"fa fa-check-square-o terrain-highlight\"></i></li><li>Follow the travel advice below.</li></ul></div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>ALPINE</h4></div></div><div class=\"row\"><div class=\"col-xs-3\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.alpineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-3\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.alpineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ report.report.data.alpineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>TREELINE</h4></div></div><div class=\"row\"><div class=\"col-xs-3\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.treelineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-3\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.treelineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ report.report.data.treelineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div><div class=\"row\"><div class=\"col-xs-12 terrain-title\"><h4>BELOW TREELINE</h4></div></div><div class=\"row\"><div class=\"col-xs-3\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Aspect:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.belowTreelineTerrainAvoidance.aspect\" ng-class=\"{\'terrain-highlight\': value}\" ng-if=\"name !== \'All\'\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div><div class=\"col-xs-8\"><div class=\"row\"><div class=\"col-xs-12\"><strong>Terrain features:</strong></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul class=\"terrain-list\"><li ng-repeat=\"(name, value) in report.report.data.belowTreelineTerrainAvoidance.terrainFeatures\" ng-class=\"{\'terrain-highlight\': value}\"><div class=\"row\"><div class=\"col-xs-2 sm-pad-right\"><i ng-class=\"{\'fa-square-o\': !value, \'fa-check-square-o\': value}\" class=\"fa\"></i></div><div class=\"col-xs-10 sm-pad-left\"><span class=\"pull-left\">{{ name }}</span></div></div></li></ul></div></div></div></div><div class=\"row\"><div class=\"col-xs-12\"><strong>Travel advice:</strong></div><div class=\"col-xs-12\">{{ report.report.data.belowTreelineTerrainAvoidance.terrainAvoidanceComments || \'N/A\' }}</div></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\">More Information</div><div ng-bind-html=\"infoSummary\" class=\"panel-body\"></div></div></div></section></div></div></div>");
$templateCache.put("loading-indicator.html","<div class=\"ac-loading-indicator\"><div class=\"rect1\"></div><div class=\"rect2\"></div><div class=\"rect3\"></div><div class=\"rect4\"></div><div class=\"rect5\"></div></div>");
$templateCache.put("min-back-modal.html","<div class=\"modal-body\"><p>Are you sure you want to exit?</p><p>You will lose all your data!</p></div><div class=\"modal-footer\"><button type=\"button\" ng-click=\"discardAndExit()\" class=\"btn btn-default\">Yes</button><button type=\"button\" ng-click=\"stayOnThePage()\" class=\"btn btn-primary\">No</button></div>");
$templateCache.put("min-map-modal.html","<div class=\"modal-body\"><input type=\"button\" value=\"Save and close\" ng-click=\"save()\" class=\"btn btn-default save-button\"/><div ac-location-select=\"ac-location-select\" latlng=\"params.latlng\" style=\"height: 100%; width: 100%;\" ng-if=\"show\"></div></div>");
$templateCache.put("min-observation-drawer.html","<div class=\"panel\"><div class=\"panel-body\"><div class=\"row\"><div ng-click=\"closeDrawer()\" class=\"pull-right close-drawer\"><i class=\"fa fa-close\"></i></div><div class=\"col-sm-8 col-xs-12\"><h3>{{sub.title}}</h3></div><div class=\"col-sm-3 col-xs-12\"><a target=\"_blank\" href=\"{{sponsor.getText(&quot;sponsor.url&quot;)}}\" class=\"pull-right\"><img ng-src=\"{{sponsor.getText(&quot;sponsor.image-229&quot;)}}\"/></a></div></div><div class=\"row submission-header\"><div class=\"col-sm-6 section-label\"><i class=\"fa fa-clock-o\"></i><span>Submitted</span></div><div class=\"col-sm-6 section-label full-page-link\"><div ng-click=\"viewFullPage(sub.subid)\" class=\"pull-right\"><i class=\"fa fa-external-link\"></i><span>full page</span></div></div><div class=\"col-sm-12\"><p>By <span> {{sub.user}} </span></p><p>On {{sub.dateFormatted}}</p></div></div></div><div class=\"panel-body\"><div class=\"row-fluid observation-tabs\"><ul role=\"tablist\" class=\"nav nav-pills nav-justified\"><li ng-repeat=\"tab in reportTypes\" role=\"presentation\" ng-class=\"[hasReport(tab),{active: tab === sub.requested}]\"><a ng-click=\"changeTab(tab)\" style=\"text-transform: uppercase;\" ng-class=\"tab\">{{::tab}}</a></li></ul></div><div class=\"row-fluid\"><div class=\"tab-content\"><div ng-repeat=\"tab in reportTypes\" role=\"tabpanel\" id=\"{{tab}}\" ng-class=\"{active: tab === sub.requested}\" class=\"tab-pane\"><div class=\"row-fluid section-label\"><i class=\"fa fa-info-circle\"></i><span>Information</span></div><div ng-repeat=\"ob in sub.obs\"><div ng-if=\"ob.obtype === sub.requested\" ng-repeat=\"item in activeTab\" class=\"submission-header\"><ul class=\"observation-information\"><li ng-if=\"item.type === \'number\' || item.type === \'radio\' || item.type === \'dropdown\' || item.type === \'text\' \" class=\"observation-item\">{{item.prompt}} <span class=\"value\">{{item.value}}</span></li><li ng-if=\"item.type === \'checkbox\'\" class=\"observation-item\">{{item.prompt}}<ul><li ng-repeat=\"op in item.value track by $index\"><span class=\"value\">{{op}}</span><span ng-if=\"!$last\" class=\"value\">, </span></li></ul></li><li ng-if=\"item.type === \'datetime\'\" class=\"observation-item\">{{item.prompt}}<span>&nbsp; {{item.value}}</span></li></ul><div ng-if=\"item.type === \'textarea\'\" class=\"observation-item comments\"><div class=\"row-fluid section-label\"><i class=\"fa fa-comment\"></i><span>Comments</span></div><div class=\"row-fluid\"><div class=\"col-sm-12\">{{item.value}}</div></div></div></div></div></div></div></div></div><div class=\"panel-body upload-n-share\"><div ng-if=\"sub.uploads.length &gt; 0\" class=\"row\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-camera\"></i><span>Uploads (click/tap to enlarge)</span></div><div class=\"col-sm-12\"><ul class=\"list-inline\"><li ng-repeat=\"url in sub.thumbs\"><a ng-href=\"{{url}}\" target=\"_blank\"><img ng-src=\"{{url}}\" width=\"75\" alt=\"{{sub.title}}\"/></a></li></ul></div></div><div class=\"row\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-share-square-o\"></i><span>Share this report</span></div><div class=\"col-sm-12\"><div class=\"col-sm-12\"><ul class=\"list-inline\"><li><a ng-href=\"https://twitter.com/intent/tweet?status={{sub.shareUrl}}\"><i class=\"fa fa-twitter fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://www.facebook.com/sharer/sharer.php?u={{sub.shareUrl}}\"><i class=\"fa fa-facebook fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://plus.google.com/share?url={{sub.shareUrl}}\"><i class=\"fa fa-google-plus fa-fw fa-lg\"></i></a></li></ul></div></div></div></div></div>");
$templateCache.put("min-report-form.html","<div class=\"min-form\"><form name=\"acMinForm\" novalidate=\"novalidate\" ng-if=\"!report.subid\" role=\"form\" ac-submission-form-validator=\"ac-submission-form-validator\"><div class=\"form-fields col-xs-12 no-padding\"><div class=\"col-xs-12 col-md-4 form-left-column\"><div class=\"required-info clearfix\"><h3 class=\"form-subtitle\">Step 1. Required Info</h3><div class=\"required-info-data col-xs-12\"><div ng-class=\"{\'has-error\': !acMinForm.title.$valid &amp;&amp; acMinForm.title.$dirty }\" class=\"form-group\"><h4>Name your report</h4><input type=\"text\" name=\"title\" ng-model=\"report.title\" placeholder=\"e.g. Upper Raft River\" required=\"required\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': !acMinForm.datetime.$valid}\" class=\"form-group\"><h4> Submission date and time</h4><input type=\"datetime\" name=\"datetime\" ng-model=\"report.datetime\" ac-datetime-picker=\"ac-datetime-picker\" max-date-today=\"true\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': invalidLatLng}\" class=\"form-group\"><h4> Enter location by map</h4><div ng-click=\"openMapModal()\" class=\"btn-map\"><i class=\"fa fa-map-o\"></i></div><h4>or enter location by lat/long</h4><input type=\"text\" ng-class=\"{\'modified\': tempLatlngModified}\" name=\"tempLatlng\" ac-enter=\"saveLocation()\" ng-model=\"report.tempLatlng\" placeholder=\"e.g. 51.522, -188.883\" required=\"required\" class=\"form-control latlng\"/><div role=\"button\" ng-if=\"tempLatlngModified\" ng-click=\"saveLocation()\" class=\"save-location\"><i class=\"fa fa-map-marker\"></i></div><div ng-if=\"invalidLatLng\" class=\"error col-xs-12 no-padding\">Invalid coordinates format</div></div></div></div><div class=\"uploads\"><h3 class=\"form-subtitle\">Step 2. Uploads</h3><p>Add a photo (.jpg or .png) to help tell your story.</p><div class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i>If uploading more than one photo, select all and submit photos together.</p></div><div class=\"form-group\"><div class=\"col-xs-12 no-padding btn-file\"><div class=\"col-xs-3 no-padding\"><span class=\"btn btn-default btn-styled\">Browse</span></div><input type=\"text\" readonly=\"readonly\" placeholder=\".jpg or .png\" value=\"{{ report.files.length ? report.files.length + \' photos added\' : null}}\" class=\"col-xs-9 no-padding\"/><input type=\"file\" name=\"uploads\" file-model=\"report.files\" accept=\".png,.jpg,.jpeg\" multiple=\"multiple\"/></div></div></div></div><div class=\"col-xs-12 col-md-8 form-right-column\"><h3 id=\"top\" class=\"form-subtitle\">Step 3. Observations</h3><div class=\"announcement\">Add information on one, some, or all tabs, then click SUBMIT at the bottom.</div><tabset type=\"pills\" class=\"observation-tabs\"><!--Quick report--><tab ac-tab-style=\"{{getTabExtraClasses(\'quickReport\')}}\" active=\"tabs[\'quickReport\']\"><tab-heading class=\"tab-head\">Quick</tab-heading><div class=\"tab-text col-xs-12 col-md-8 no-padding\">Use the Quick Report to quickly share information about your trip. You can create a comprehensive\nreport by adding more details in the Avalanche, Snowpack, Weather, and/or Incident tabs.</div><div class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, ridingCondition) in report.obs.quickReport.ridingConditions\" class=\"field col-xs-12\"><h4 class=\"field-title col-xs-12 no-padding\"><strong>{{ ::ridingCondition.prompt }}</strong></h4><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"ridingCondition.type==\'multiple\'\" ng-repeat=\"(option, enabled) in ridingCondition.options\" ng-class=\"{\'column-left\':$odd}\" class=\"checkbox col-xs-12 col-md-6 inline\"><label><input type=\"checkbox\" name=\"{{ ::item}}\" ng-model=\"ridingCondition.options[option]\"/>{{ ::option}}</label></div><div ng-if=\"ridingCondition.type==\'single\'\" ng-repeat=\"option in ridingCondition.options\" class=\"radio col-xs-12 col-md-6 inline\"><label><input type=\"radio\" name=\"{{ ::item}}\" ng-model=\"ridingCondition.selected\" ng-value=\"option\"/>{{ ::option}}</label></div></div><div class=\"options col-xs-12 col-md-4\"></div></div><div class=\"field col-xs-12\"><h4 class=\"field-title col-xs-12 no-padding\"><strong>Avalanche conditions</strong></h4><div class=\"options col-xs-12 col-md-8\"><div class=\"checkbox col-xs-12\"><label><input type=\"checkbox\" name=\"slab\" ng-model=\"report.obs.quickReport.avalancheConditions.slab\"/>Slab avalanches today or yesterday.</label></div><div class=\"checkbox col-xs-12\"><label><input type=\"checkbox\" name=\"sound\" ng-model=\"report.obs.quickReport.avalancheConditions.sound\"/>Whumpfing or drum-like sounds or shooting cracks.</label></div><div class=\"checkbox col-xs-12\"><label><input type=\"checkbox\" name=\"snow\" ng-model=\"report.obs.quickReport.avalancheConditions.snow\"/>30cm + of new snow, or significant drifitng, or rain in the last 48 hours.</label></div><div class=\"checkbox col-xs-12\"><label><input type=\"checkbox\" name=\"temp\" ng-model=\"report.obs.quickReport.avalancheConditions.temp\"/>Rapid temperature rise to near zero degrees or wet surface snow.</label></div></div><div class=\"options col-xs-12 col-md-4\"></div></div><div class=\"field col-xs-12\"><h4 class=\"field-title col-xs-12 no-padding\"><strong>Comments</strong></h4><div class=\"options col-xs-12 col-md-8\"><div class=\"help-text\"><p><a href=\"http://www.avalanche.ca/fxresources/Submissions+Guidelines.pdf\" target=\"_blank\">Submission guidelines</a></p></div><div class=\"textarea col-xs-12\"><textarea rows=\"3\" name=\"comment\" ng-model=\"report.obs.quickReport.comment\" style=\"resize: vertical;\" class=\"form-control\"></textarea></div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div></tab><tab ng-repeat=\"(key, tab) in additionalFields\" ac-tab-style=\"{{getTabExtraClasses(key)}}\" active=\"tabs[key]\"><tab-heading class=\"tab-head\">{{ ::tab.name}}</tab-heading><div ng-bind-html=\"tab.text\" class=\"tab-text col-xs-12 col-md-8 no-padding\"></div><div class=\"fields-group col-xs-12 no-padding\"><div ng-repeat=\"(item, av) in report.obs[key].fields\" ng-if=\"av.type!==\'calculated\'\" class=\"field col-xs-12\"><h4 ng-if=\"av.title === undefined &amp;&amp; av.subTitle === undefined\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.prompt }}</strong></h4><h4 ng-if=\"av.title !== undefined &amp;&amp; av.title !== null\" class=\"field-title col-xs-12 no-padding\"><strong>{{ ::av.title }}</strong></h4><h5 ng-if=\"av.subTitle !== undefined\" class=\"col-xs-12 no-padding\">{{ ::av.subTitle }}</h5><div class=\"options col-xs-12 col-md-8\"><div ng-if=\"av.helpText\" class=\"help-text\"><p><i class=\"fa fa-question-circle\"></i><span>{{ ::av.helpText}}</span><span ng-if=\"av.guidelines\"><a href=\"{{ ::av.guidelines}}\" target=\"_blank\">Submission guidelines</a></span></p></div><div ng-if=\"av.type==\'checkbox\'\" ng-repeat=\"(option, enabled) in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"checkbox col-md-6 col-xs-12\"><label><input type=\"checkbox\" name=\"{{::item}}\" ng-model=\"av.options[option]\" ng-click=\"validate(item, av)\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'radio\'\" ng-repeat=\"option in av.options\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"radio col-md-6 col-xs-12\"><label><input type=\"radio\" ng-model=\"report.obs[key].fields[item].value\" value=\"{{ ::option}}\"/>{{ ::option}}</label></div><div ng-if=\"av.type==\'number\'\" ng-class=\"{\'inline\':av.inline}\" class=\"number col-xs-12\"><label><input type=\"number\" name=\"{{::item}}\" placeholder=\"{{ av.placeholder ? av.placeholder : \'Number between \'+ av.options.min +\' and \'+av.options.max }}\" ng-model=\"report.obs[key].fields[item].value\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'text\'\" ng-class=\"{\'inline\':av.inline}\" class=\"text col-xs-12\"><label><input type=\"text\" name=\"{{::item}}\" placeholder=\"{{ ::av.prompt }}\" ng-model=\"report.obs[key].fields[item].value\" ng-required=\"report.obs[key].fields[av.constraint.field].options[av.constraint.option]\" ng-blur=\"validate(item, av)\" class=\"form-control\"/></label></div><div ng-if=\"av.type==\'dropdown\'\" ng-class=\"{\'inline\':av.inline, \'column-left\':$odd}\" class=\"select col-md-6 col-xs-12 no-padding\"><select ng-options=\"option for option in av.options\" ng-model=\"report.obs[key].fields[item].value\" class=\"form-control\"><option value=\"\">Select option</option></select></div><div ng-if=\"av.type==\'textarea\'\" class=\"textarea col-xs-12\"><textarea rows=\"3\" ng-model=\"report.obs[key].fields[item].value\" class=\"form-control\"></textarea></div><div ng-if=\"av.type==\'datetime\'\" class=\"datetime-input col-xs-12\"><label for=\"datetime\"><input type=\"datetime\" ng-model=\"report.obs[key].fields[item].value\" ac-datetime-picker=\"ac-datetime-picker\" show-only-date=\"av.showOnlyDate\" show-only-time=\"av.showOnlyTime\" max-date-today=\"av.maxDateToday\" placeholder=\"{{av.placeholder ? av.placeholder : \'Click to select date\'}}\" class=\"form-control\"/></label></div><div ng-if=\"acMinForm[item].$invalid\" class=\"error col-xs-12 no-padding\">{{::av.errorMessage}}</div></div><div class=\"options col-xs-12 col-md-4\"></div></div></div></tab></tabset><tabset type=\"pills\" class=\"observation-tabs bottom col-xs-12 no-padding\"><!--Quick report--><tab ac-tab-style=\"{{getTabExtraClasses(\'quickReport\')}}\" active=\"tabs[\'quickReport\']\" ng-click=\"scrollToTop()\"><tab-heading class=\"tab-head\">Quick</tab-heading></tab><tab ng-repeat=\"(key, tab) in additionalFields\" ac-tab-style=\"{{getTabExtraClasses(key)}}\" active=\"tabs[key]\" ng-click=\"scrollToTop()\"><tab-heading class=\"tab-head\">{{ ::tab.name}}</tab-heading></tab></tabset></div></div><div class=\"footer-buttons col-xs-12 no-padding\"><input type=\"button\" value=\"Back\" ng-click=\"goBack(acMinForm.$dirty)\" class=\"btn btn-default btn-styled\"/><div class=\"submit-btn\"><i ng-show=\"minsubmitting\" class=\"fa fa-fw fa-lg fa-spinner fa-spin\"></i><input type=\"button\" ng-click=\"submitForm(acMinForm)\" id=\"submit\" value=\"SUBMIT\" ng-disabled=\"report.latlng.length === 0 || minsubmitting\" class=\"btn btn-default btn-styled\"/></div></div></form><div ng-if=\"minerror\"><div role=\"alert\" class=\"alert alert-danger\"><p>There was an error submitting your report.</p><p ng-if=\"minerrormsg\">{{minerrormsg}}</p></div></div></div>");
$templateCache.put("min-report-fullpage.html","<div class=\"panel\"><div class=\"panel-body\"><div class=\"row\"><div ng-click=\"closeDrawer()\" class=\"pull-right close-drawer\"><i class=\"fa fa-close\"></i></div><div class=\"col-sm-8 col-xs-12\"><h3>{{::sub.title}}</h3></div><div class=\"col-sm-3 col-xs-12\"><a target=\"_blank\" href=\"{{sponsor.getText(&quot;sponsor.url&quot;)}}\" class=\"pull-right\"><img ng-src=\"{{sponsor.getText(&quot;sponsor.image-229&quot;)}}\"/></a></div></div><div class=\"row submission-header\"><div class=\"col-sm-6 section-label\"><i class=\"fa fa-clock-o\"></i><span>Submitted</span></div><div class=\"col-sm-6 section-label print-link\"><div ng-click=\"print()\" class=\"pull-right\"><i class=\"fa fa-print\"></i><span>Print friendly</span></div></div><div class=\"col-sm-12\"><p>By <span> {{::sub.user}} </span></p><p>On {{::sub.dateFormatted}}</p></div></div></div><div ng-repeat=\"report in activeReports\" class=\"panel-body observation-list\"><div class=\"row-fluid observation-title\">{{::report.obtype}} report</div><div class=\"row-fluid\"><div class=\"row-fluid section-label\"><i class=\"fa fa-info-circle\"></i><span>Information</span></div><div ng-repeat=\"item in report.ob\" class=\"submission-header\"><ul class=\"observation-information\"><li ng-if=\"item.type === \'number\' || item.type === \'radio\'|| item.type === \'dropdown\'\" class=\"observation-item\">{{::item.prompt}} <span class=\"value\">{{::item.value}}</span></li><li ng-if=\"item.type === \'checkbox\'\" class=\"observation-item\">{{::item.prompt}}<ul><li ng-repeat=\"op in item.value track by $index\"><span class=\"value\">{{op}}</span><span ng-if=\"!$last\" class=\"value\">, </span></li></ul></li><li ng-if=\"item.type === \'datetime\'\" class=\"observation-item\">{{::item.prompt}}<span>&nbsp; {{::item.value | dateformat}}</span></li></ul><div ng-if=\"item.type === \'textarea\'\" class=\"observation-item comments\"><div class=\"row-fluid section-label\"><i class=\"fa fa-comment\"></i><span>Comments</span></div><div class=\"row-fluid\"><div class=\"col-sm-12\">{{::item.value}}</div></div></div></div></div></div><div class=\"panel-body upload-n-share\"><div class=\"row-fluid observation-title\">Uploads</div><div ng-if=\"sub.uploads.length &gt; 0\" class=\"row\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-camera\"></i><span>Uploads (click/tap to enlarge)</span></div><div class=\"col-sm-12\"><ul class=\"list-inline\"><li ng-repeat=\"url in sub.thumbs\"><a ng-href=\"{{::url}}\" target=\"_blank\"><img ng-src=\"{{::url}}\" width=\"75\" alt=\"{{::sub.title}}\"/></a></li></ul></div></div><div class=\"row share-report\"><div class=\"col-sm-12 section-label\"><i class=\"fa fa-share-square-o\"></i><span>Share this report</span></div><div class=\"col-sm-12\"><div class=\"col-sm-12\"><ul class=\"list-inline\"><li><a ng-href=\"https://twitter.com/intent/tweet?status={{::sub.shareUrl}}\"><i class=\"fa fa-twitter fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://www.facebook.com/sharer/sharer.php?u={{::sub.shareUrl}}\"><i class=\"fa fa-facebook fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://plus.google.com/share?url={{::sub.shareUrl}}\"><i class=\"fa fa-google-plus fa-fw fa-lg\"></i></a></li></ul></div></div></div></div></div>");
$templateCache.put("min-report-modal.html","<div id=\"minForm\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button data-dismiss=\"modal\" class=\"close\"><span>close</span></button><h4 class=\"modal-title\">Mountain Information Network Report</h4></div><div class=\"modal-body\"><div ac-min-report-form=\"ac-min-report-form\"></div></div></div></div></div>");
$templateCache.put("min-report-popup-modal.html","<div id=\"mobileMapPopup\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"></div>                <a href=\"#\" data-dismiss=\"modal\" style=\"position: absolute; right: 10px; top: 10px;\" class=\"pull-right\"><i class=\"fa fa-close fa-lg\"></i></a></div></div></div>");
$templateCache.put("social-share.html","<div class=\"well\"><H4>Share this report:</H4><ul class=\"list-inline\"><li><a href=\"https://twitter.com/intent/tweet?url=http://avalanche.ca\"><i class=\"fa fa-twitter fa-fw fa-lg\"></i></a></li><li><a href=\"https://www.facebook.com/sharer/sharer.php?u=http://avalanche.ca\"><i class=\"fa fa-facebook fa-fw fa-lg\"></i></a></li><li><a href=\"https://plus.google.com/share?url=http://avalanche.ca\"><i class=\"fa fa-google-plus fa-fw fa-lg\"></i></a></li></ul></div>");
$templateCache.put("wbc-links.html","<div class=\"row ac-forecast-mini--whistler-links\"><div class=\"col-xs-10\"><div class=\"panel panel-default first\"><a href=\"\" data-target=\"#collapseTwo\" data-parent=\"#accordion\" data-toggle=\"collapse\" class=\"collapsed\">{{disclaimer.getText(\'generic.title\')}}</a><div id=\"collapseTwo\" class=\"collapse\"><div class=\"panel-body\"> <h3>USE AT YOUR OWN RISK</h3><p>The Whistler Blackcomb Avalanche Bulletin, and other information and services provided by Whistler Blackcomb and Avalanche Canada are intended for personal and recreational purposes only</p><p><b>THIS INFORMATION IS PROVIDED \"AS IS\" AND IN NO EVENT SHALL THE PROVIDERS BE LIABLE FOR ANY DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES RESULTING FROM DISCOMFORT, INJURY, OR DEATH, CLAIMS BY THIRD PARTIES OR FOR OTHER SIMILAR COSTS, OR ANY SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, ARISING OUT OF THE USE OF THE INFORMATION.</b></p><p>The user acknowledges that it is impossible to accurately predict natural events such as avalanches in every instance, and uses the data in this bulletin with this always foremost in mind. The accuracy or reliability of the data is not guaranteed or warranted in any way and the Providers disclaim liability of any kind whatsoever, including, without limitation, liability for quality, performance, merchantability and fitness for a particular purpose arising out of the use, or inability to use the data.</p></div></div></div><div><a target=\"_blank\" href=\"http://www.whistlerblackcomb.com/\">Whistler-Blackcomb Website</a></div><div><a target=\"_blank\" href=\"http://www.whistlerheliskiing.com/\">Whistler Heli-skiing Website</a></div><div><a target=\"_blank\" href=\"http://www.extremelycanadian.com/\">Extremely Canadian Website</a></div></div><div class=\"col-xs-2 social-media\"><div><a href=\"https://twitter.com/whistlerblckcmb\"><i class=\"fa fa-twitter-square\"></i></a></div><div><a href=\"https://www.facebook.com/whistlerblackcomb\"><i class=\"fa fa-facebook-square\"></i></a></div><div><a href=\"/api/forecasts/whistler-blackcomb.rss\"><i class=\"fa fa-rss-square\"></i></a></div></div></div>");}]);
}());