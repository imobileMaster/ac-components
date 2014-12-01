angular.module('acComponents.directives')
    .directive('acMapboxMap', function ($rootScope, $window, $location, $timeout, acBreakpoint, acObservation, acForecast, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
        return {
            template: '<div id="map"></div>',
            replace: true,
            scope: {
                region: '=acRegion',
                regions: '=acRegions',
                obs: '=acObs',
                ob: '=acOb'
            },
            link: function ($scope, el, attrs) {
                $scope.device = {};
                var layers = {
                    dangerIcons: L.featureGroup()
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
                    }
                };

                L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
                var map = L.mapbox.map(el[0].id, MAPBOX_MAP_ID, {attributionControl: false});
                map.setView([52.3, -120.74966],6);

                /*var provinces = L.mapbox.geocoder('mapbox.places-province-v1');
                provinces.query('British-Columbia', function (err, results) {
                    var bcBounds = L.latLngBounds([results.bounds[1], results.bounds[0]], [results.bounds[3], results.bounds[2]]);
                    map.fitBounds(bcBounds);
                });*/

                L.control.locate({
                    locateOptions: {
                        maxZoom: 14
                    }
                }).addTo(map);

                acBreakpoint.setBreakpoints({
                    xs: 480,
                    sm: 600,
                    md: 1025,
                });

                $rootScope.$on('breakpoint', function (e, breakpoint) {
                    $scope.device.size = breakpoint;
                });

                function getInvalidateSize(topOffset) {
                    return function () {
                        el.height($($window).height()-Number(topOffset));
                        map.invalidateSize();
                    }
                }

                if(attrs.topOffset) {
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
                };

                function initRegionsLayer(){
                    layers.regions = L.geoJson($scope.regions, {
                        style: function(feature) {
                            return styles.region.default;
                        },
                        onEachFeature: function (featureData, layer) {
                            layer.bindLabel(featureData.properties.name);

                            function showRegion(evt){
                                if(map.getZoom() < 9) {
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

                            layer.on('click', showRegion);

                            layer.on('mouseover', function() {
                                if(layer == layers.currentRegion){
                                    layer.setStyle(styles.region.selectedhover);
                                } else {
                                    layer.setStyle(styles.region.hover);
                                }
                            });

                            layer.on('mouseout', function() {
                                if(layer == layers.currentRegion){
                                    layer.setStyle(styles.region.selected);
                                } else {
                                    layer.setStyle(styles.region.default);
                                }
                            });

                            if(featureData.properties.centroid) {
                                var centroid = L.latLng(featureData.properties.centroid[1], featureData.properties.centroid[0]);

                                var marker = L.marker(centroid);
                                var icon = getDangerIcon({regionId: featureData.id});

                                marker.setIcon(icon);
                                marker.setZIndexOffset(200);
                                marker.on('click', showRegion);
                                marker.bindLabel(featureData.properties.name, {pane: 'popupPane'});

                                layers.dangerIcons.addLayer(marker);
                            }
                        }
                    });

                    refreshLayers();
                }

                function refreshDangerIconsLayer(){
                    layers.dangerIcons.eachLayer(function (dangerIconLayer) {
                        var iconUrl = dangerIconLayer.options.icon.options.iconUrl;
                        var icon = getDangerIcon({ iconUrl: iconUrl });

                        dangerIconLayer.setIcon(icon);
                    });
                }

                function refreshLayers(){
                    var zoom = map.getZoom();

                    if(layers.regions) {
                        var regionsVisible = map.hasLayer(layers.regions);

                        if(zoom < 6 && regionsVisible) {
                            map.removeLayer(layers.regions);
                        } else if (zoom >= 6 && !regionsVisible) {
                            map.addLayer(layers.regions);
                        } else if (zoom > 10 && regionsVisible) {
                            map.removeLayer(layers.regions);
                        }
                    }

                    if(layers.dangerIcons) {
                        var dangerIconsVisible = map.hasLayer(layers.dangerIcons);

                        if(map.getZoom() < 6 && dangerIconsVisible) {
                            map.removeLayer(layers.dangerIcons);
                        } else if (map.getZoom() >= 6 && !dangerIconsVisible){
                            map.addLayer(layers.dangerIcons);
                        }

                        var dangerIcon = layers.dangerIcons.getLayers()[0];
                        if(dangerIcon){
                            var dangerIconSize = dangerIcon.options.icon.options.iconSize;
                            if ((zoom > 6 && dangerIconSize === [60, 60]) || (dangerIconSize === [80, 80])) {
                                refreshDangerIconsLayer();
                            } 
                        }
                    }

                    if(layers.obs) {
                        var obsVisible = map.hasLayer(layers.obs);

                        if(map.getZoom() < 7 && obsVisible) {
                            map.removeLayer(layers.obs);
                        } else if (map.getZoom() >= 7 && !obsVisible){
                            map.addLayer(layers.obs);
                        }
                    }

                    var opacity = 0.2;
                    if(layers.currentRegion) {
                        if(zoom <= 9) {
                            styles.region.selected.fillOpacity = opacity;
                            layers.currentRegion.setStyle(styles.region.selected);
                        } else if(zoom > 9 && zoom < 13){
                            switch(zoom){
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

                function refreshObsLayer() {
                    if (map.hasLayer(layers.obs)){
                        map.removeLayer(layers.obs);
                    }

                    if($scope.obs.length > 0 ) {
                        var markers = $scope.obs.map(function (ob) {

                            var marker = L.marker(ob.latlng, {
                                icon: L.mapbox.marker.icon({
                                    'marker-size': 'small',
                                    'marker-color': '#09c'
                                })
                            });

                            marker.on('click', function () {
                                acObservation.getOne(ob.obid, 'html').then(function (obHtml) {
                                    var popup = L.popup({maxWidth: 400});

                                    popup.setContent(obHtml);
                                    marker.bindPopup(popup);
                                    marker.togglePopup();
                                });
                            });

                            marker.setZIndexOffset(100);

                            return marker;
                        });

                        layers.obs = L.featureGroup(markers);
                        layers.obs.bringToFront();
                    }

                    refreshLayers();
                }

                function updateRegionLayer(){
                    layers.regions.eachLayer(function (layer) {
                        if(layer === $scope.region){
                            layer.setStyle(styles.region.selected);
                        } else {
                            layer.setStyle(styles.region.default);
                        }
                    });
                }

                function latLngToGeoJSON(latlng){
                    return {
                        type: 'Point',
                        coordinates: [latlng.lng, latlng.lat]
                    };
                }

                function getMapPadding(){
                    switch($scope.device.size) {
                        case 'xs':
                            return L.point([0, 0]);
                        case 'sm':
                            return L.point([350, 0]);
                        case 'md':
                        case 'lg':
                            return L.point([480, 0]);
                        default:
                            return L.point([0,0]);
                    }
                }

                function getMapOffset(){
                    return getMapPadding().divideBy(2);
                }

                // offfset can be negative i.e. [-240, 0]
                function offsetLatLng(latlng, offset){
                    var point = map.latLngToLayerPoint(latlng);
                    return map.layerPointToLatLng(point.subtract(offset));
                }

                function getMapCenter(){
                    var offset = getMapOffset();
                    return offsetLatLng(map.getCenter(), offset);
                }

                function getMapBounds() {
                    var latLngBounds = map.getBounds();
                    var min = map.latLngToLayerPoint(latLngBounds.getNorthWest());
                    var max = map.latLngToLayerPoint(latLngBounds.getSouthEast());
                    var padding = getMapPadding();

                    var bounds = L.bounds(min, max.subtract(padding));
                    var nw = map.layerPointToLatLng(bounds.max);
                    var se = map.layerPointToLatLng(bounds.min);

                    return L.latLngBounds(nw, se);
                }

                function getMapCenterBuffer(){
                    var mapCenter = getMapCenter();
                    var centerPoint = map.latLngToLayerPoint(mapCenter);
                    var buffer = L.bounds([centerPoint.x-50, centerPoint.y-50], [centerPoint.x+50, centerPoint.y+50]);

                    var nw = map.layerPointToLatLng(buffer.max);
                    var se = map.layerPointToLatLng(buffer.min);

                    return  L.latLngBounds(nw, se);
                }

                function setRegionFocus() {
                    if(map.getZoom() >= 8) {
                        var region;
                        var centerBuffer = getMapCenterBuffer();
                        var regions = layers.regions.getLayers();
                        var mapCenter = getMapCenter();
                        var mapBounds = getMapBounds();

                        var intersectsCenterBuffer = _.filter(regions, function (r) {
                            return centerBuffer.intersects(r.getBounds());
                        });

                        var withinMapBounds = _.filter(regions, function (r) {
                            return mapBounds.contains(r.getBounds());
                        });

                        var containsMapCenter = _.find(regions, function (r) {
                            return gju.pointInPolygon(latLngToGeoJSON(mapCenter), r.feature.geometry);
                        });

                        var centroidInMapBounds = _.filter(regions, function (r) {
                            return mapBounds.contains(r.feature.properties.centroid);
                        });

                        var intersectsCenterBufferAnWithinMapBounds = _.intersection(intersectsCenterBuffer, withinMapBounds);

                        if(intersectsCenterBufferAnWithinMapBounds.length === 1){
                            region = intersectsCenterBufferAnWithinMapBounds[0];
                        } else if(intersectsCenterBufferAnWithinMapBounds.length > 1) {
                            region = _.min(intersectsCenterBufferAnWithinMapBounds, function (r) {
                                return r.feature.properties.centroid.distanceTo(mapCenter);
                            });
                        } else if(centroidInMapBounds.length === 1){
                            region = centroidInMapBounds[0];
                        } else if(centroidInMapBounds.length > 1){
                            region = _.min(centroidInMapBounds, function (r) {
                                return r.feature.properties.centroid.distanceTo(mapCenter);
                            });
                        } else if (containsMapCenter) {
                            region = containsMapCenter;
                        }

                        $scope.$apply(function () {
                            $scope.region = region;
                        });
                    }
                }



                map.on('load', refreshLayers);
                map.on('dragend', setRegionFocus);
                map.on('zoomend', refreshLayers);

                $scope.$watch('region', function (newRegion, oldRegion) {
                    if(layers.regions && newRegion && newRegion !== oldRegion) {
                        updateRegionLayer();
                    }
                });

                $scope.$watch('regions', function (newRegions, oldRegions) {
                    if(newRegions && newRegions.features) {
                        initRegionsLayer();
                    }
                });

                $scope.$watch('obs', function (newObs, oldObs) {
                    if(newObs) {
                        refreshObsLayer();
                    }
                });

                $scope.$watch('ob', function (newObs, oldObs) {
                    if(newObs.latlng) {
                        acObservation.getOne(newObs.obid, 'html').then(function (obHtml) {
                            var marker = L.marker(newObs.latlng, {
                                icon: L.mapbox.marker.icon({
                                    'marker-size': 'small',
                                    'marker-color': '#09c'
                                })
                            });

                            marker.bindPopup(obHtml, {maxWidth: 400});
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
                    }
                });

            }
        };
    });
