angular.module('acComponents.directives')
  .directive('acMapboxMap', function ($rootScope, $window, $location, $timeout, $state, acBreakpoint, acObservation, acForecast, acSubmission, acHZRSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $stateParams, acConfig, localStorageService) {
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
  });
