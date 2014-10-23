angular.module('acComponents.directives')
    .directive('acMapboxMap', function ($rootScope, $window, $timeout, acBreakpoint, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
        return {
            template: '<div id="map"></div>',
            replace: true,
            scope: {
                mapboxAccessToken: '@',
                mapboxMapId: '@',
                sidebar: '@acMapSidebar',
                region: '=acRegion',
                regions: '=acRegions',
                obs: '=',
                filters: '='
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
                        }
                    }
                };

                L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
                var map = L.mapbox.map(el[0].id, MAPBOX_MAP_ID, {attributionControl: false});

                var provinces = L.mapbox.geocoder('mapbox.places-province-v1');

                provinces.query('British-Columbia', function (err, results) {
                    var bcBounds = L.latLngBounds([results.bounds[1], results.bounds[0]], [results.bounds[3], results.bounds[2]]);
                    map.fitBounds(bcBounds);
                });

                // var sidebar = L.control.sidebar($scope.sidebar, {
                //     position: 'right'
                // }).addTo(map);


                // function invalidateSize() {
                //     el.height($($window).height()-75);
                //     map.invalidateSize();
                // }

                // angular.element(document).ready(invalidateSize);
                // angular.element($window).bind('resize', invalidateSize);

                // function refreshObsLayer() {
                //     if (map.hasLayer(layers.obs)){
                //         map.removeLayer(layers.obs);
                //     }

                //     layers.obs = L.geoJson($scope.obs, {
                //         pointToLayer: function (featureData, latlng) {
                //             var icons = {
                //                 avalanche: L.AwesomeMarkers.icon({prefix: 'fa', icon: 'eye', markerColor: 'red'}),
                //                 incident: L.AwesomeMarkers.icon({prefix: 'fa', icon: 'warning', markerColor: 'blue'}),
                //                 simple: L.AwesomeMarkers.icon({prefix: 'fa', icon: 'warning', markerColor: 'orange'}),
                //                 snowpack: L.AwesomeMarkers.icon({prefix: 'fa', icon: 'bar-chart', markerColor: 'darkred'}),
                //                 weather: L.AwesomeMarkers.icon({prefix: 'fa', icon: 'warning', markerColor: 'green'})
                //             };

                //             return L.marker(latlng, {icon: icons[featureData.properties.obsType]});
                //         },
                //         filter: function (featureData, layer) {
                //             return _.contains($scope.filters.obsType, featureData.properties.obsType);
                //         }
                //     }).addTo(map);
                // }

                map.on('moveend', function () {
                    if(layers.dangerIcons) {
                        if(map.getZoom() <= 6 && map.hasLayer(layers.dangerIcons)) {
                            map.removeLayer(layers.dangerIcons);
                        } else if (map.getZoom() > 6 && !map.hasLayer(layers.dangerIcons)){
                            map.addLayer(layers.dangerIcons);
                        }
                    }
                });

                map.on('zoomend', function () {
                    var mapZoom = map.getZoom();
                    var opacity = 0.2;

                    if(layers.currentRegion) {
                        if(mapZoom <= 9) {
                            styles.region.selected.fillOpacity = opacity;
                            layers.currentRegion.setStyle(styles.region.selected);
                        } else if(mapZoom > 9 && mapZoom < 13){
                            switch(mapZoom){
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

                    // if(layers.obs && mapZoom > 7 && !map.hasLayer(layers.obs)) {
                    //     $scope.filters.obsType = ['avalanche', 'incident', 'snowpack', 'simple', 'weather'];
                    //     $scope.filters.obsPeriod = ['7:days'];
                    //     map.addLayer(layers.obs);
                    // } else if(layers.obs && mapZoom <= 7 && map.hasLayer(layers.obs)){
                    //     $scope.filters.obsType = [];
                    //     map.removeLayer(layers.obs);
                    // }

                });

                $scope.$watch('region', function (region) {
                    if(region && layers.regions) {
                        layers.regions.eachLayer(function (layer) {
                            var style = (layer === region ? styles.region.selected : styles.region.default);
                            layer.setStyle(style);
                            layers.currentRegion = layer;
                        });
                    }
                });

                $scope.$watch('regions', function (regions) {
                    if(regions && regions.features) {

                        layers.regions = L.geoJson($scope.regions, {
                            style: function(feature) {
                                return styles.region.default;
                            },
                            onEachFeature: function (featureData, layer) {
                                layer.bindLabel(featureData.properties.name, {noHide: true});

                                function showRegion(evt){
                                    if(map.getZoom() < 9) {
                                        map.fitBounds(layer.getBounds());
                                    } else {
                                        map.panTo(evt.latlng);
                                    }

                                    $scope.$apply(function () {
                                        $scope.region = layer;
                                    });
                                }

                                layer.on('click', showRegion);

                                if(featureData.properties.centroid) {
                                    var centroid = L.latLng(featureData.properties.centroid[1], featureData.properties.centroid[0]);
                                    layer.feature.properties.centroid = centroid;

                                    L.marker(centroid, {
                                        icon: L.icon({
                                            iconUrl: 'http://localhost:9000'+featureData.properties.dangerIconUrl,
                                            iconSize: [80, 80]
                                        })
                                    }).on('click', showRegion).addTo(layers.dangerIcons);
                                }

                            }
                        }).addTo(map);
                    }
                });

                // $scope.$watch('obs', function (obs) {
                //     if(obs && obs.features) {
                //         refreshObsLayer();
                //     }
                // });

                // $scope.$watchCollection('filters.obsType', refreshObsLayer);
            }
        };
    });