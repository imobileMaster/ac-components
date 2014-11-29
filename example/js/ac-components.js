(function() {


// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('acComponents.config', [])
    .value('acComponents.config', {
        debug: true
    })
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com');

// Modules
angular.module('acComponents.directives', []);
angular.module('acComponents.filters', []);
angular.module('acComponents.services', []);
angular.module('acComponents',
    [
        'acComponents.config',
        'acComponents.directives',
        'acComponents.filters',
        'acComponents.services',
        'acComponents.templates',
        'ngSanitize'
    ]);

angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
                
            }
        };
    });
angular.module('acComponents.directives')
    .directive('acForecastMini', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;
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
    .directive('acMapboxMap', ["$rootScope", "$window", "$location", "$timeout", "acBreakpoint", "acObservation", "acForecast", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", function ($rootScope, $window, $location, $timeout, acBreakpoint, acObservation, acForecast, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
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

<<<<<<< HEAD
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
                            var dangerIconSize = dangerIcon.options.icon.options.iconSize[0];
                            if ((zoom > 6 && dangerIconSize === 60) || (zoom <= 6 && dangerIconSize === 80)) {
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

=======
>>>>>>> added MIN form as modal to example
                function refreshObsLayer() {
                    if (map.hasLayer(layers.obs)){
                        map.removeLayer(layers.obs);
                    }

                    if($scope.obs.length > 0 ) {
                        var markers = $scope.obs.map(function (ob) {
                            var popup = L.popup();

                            function togglePopup(){
                                
                            };

                            var marker = L.marker(ob.latlng, {
                                icon: L.mapbox.marker.icon({
                                    'marker-size': 'small',
                                    'marker-color': '#09c'
                                })
                            });

                            marker.on('click', function () {
<<<<<<< HEAD
                                acObservation.getOne(ob.obid, 'html').then(function (obHtml) {
                                    var popup = L.popup({maxWidth: 400});

                                    popup.setContent(obHtml);
=======
                                $http.get(AC_API_ROOT_URL+'/api/min/observations/' + ob.obid + '.html').then(function (res) {
                                    var html = res.data;
                                    popup.setContent(html);
>>>>>>> added MIN form as modal to example
                                    marker.bindPopup(popup);
                                    marker.togglePopup();
                                });
                            });

                            marker.setZIndexOffset(100);

                            return marker;
                        });

<<<<<<< HEAD
                        layers.obs = L.featureGroup(markers);
                        layers.obs.bringToFront();
=======
                        layers.obs = L.featureGroup(markers).addTo(map);
>>>>>>> added MIN form as modal to example
                    }
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

                map.on('dragend', setRegionFocus);

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
                    $log.info('map zoom', mapZoom);

                    var opacity = 0.2;

                    setRegionFocus();

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

<<<<<<< HEAD
                $scope.$watch('regions', function (newRegions, oldRegions) {
                    if(newRegions && newRegions.features) {
                        initRegionsLayer();
                    }
                });

                $scope.$watch('obs', function (newObs, oldObs) {
                    if(newObs) {
=======
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

                                    L.marker(centroid, {
                                        icon: L.icon({
                                            iconUrl: AC_API_ROOT_URL+featureData.properties.dangerIconUrl,
                                            iconSize: [80, 80]
                                        })
                                    }).on('click', showRegion).addTo(layers.dangerIcons);
                                }

                            }
                        }).addTo(map);
                    }
                });

                $scope.$watch('obs', function (obs) {
                    if(obs) {
>>>>>>> added MIN form as modal to example
                        refreshObsLayer();
                    }
                });

                $scope.$watch('ob', function (newObs, oldObs) {
                    if(newObs && newObs.latlng) {
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

    .directive('acMin', ["acMinReportData", "acReport", function(acMinReportData, acReport) {
        return {
            templateUrl: 'min-report.html',
            replace: true,
            link: function(scope, el, attrs) {
                scope.report = {
                    title: '',
                    datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    location: [-40, 83.3],
                    files: [],
                    ridingConditions: angular.copy(acMinReportData.ridingConditions),
                    avalancheConditions: angular.copy(acMinReportData.avalancheConditions),
                    narrative: ''
                };

                scope.submitReport = function() {
                    console.log('report submitting..');
                    //validate the form data
                    acReport.prepareData(scope.report)
                        .then(acReport.sendReport)
                        .then(function(result) {
                            console.log('submission: ' + result.data.subid);
                        });
                };

            }
        };
    }]);

angular.module('acComponents.filters')
    .filter('acNormalizeForecastTitle', function () {
        return function (item) {
            if (item) {
                return item.replace(/^Avalanche (Forecast|Bulletin) - /g, '');
            }
        };
    });
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
                        cacheDangerIcons();
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
    //    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-env.elasticbeanstalk.com')
    .constant('AC_QA_API_ROOT_URL', 'http://avalanche-canada-qa.elasticbeanstalk.com/');

angular.module('acComponents.services')
    .factory('acReport', ["$http", "$q", "AC_QA_API_ROOT_URL", function($http, $q, AC_QA_API_ROOT_URL) {

        var apiUrl = AC_QA_API_ROOT_URL; //todo use config value to pick URL

        //public
        function prepareData(reportData) {
            var fd = new FormData();
            //process files
            if (reportData.files && reportData.files.length > 0) {
                angular.forEach(reportData.files, function(file, counter) {
                    //check file type image/video for now just image
                    if (file) {
                        fd.append('file' + counter, file, 'image-' + counter + '.jpg');
                    }
                });
            }

            //process data
            angular.forEach(reportData, function(value, key) {
                if (key !== 'files' && angular.isObject(value)) {
                    // TODO-JPB clean up strings
                    //   fd.append(key, angular.toJson(value));
                    console.log('appending: ' + key + ':' + JSON.stringify(value));

                } else if (key === 'datetime') {
                    fd.append(key, moment(value).format());
                    console.log('appending: ' + key + ':' + moment(value).format());
                } else if (key !== 'files') {
                    fd.append(key, value);
                    console.log('appending: ' + key + ':' + value);
                }
            });
            return $q.when(fd);
        }

        function sendReport(formData) {
            var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJhMTg2YzQ0YzBmNzhhMTQzMzIyYmY1N2E5ZjZkMzc5NyIsImVtYWlsIjoianAuYmhhdm5hbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImxhc3RfcGFzc3dvcmRfcmVzZXQiOiIyMDE0LTExLTExVDE3OjExOjIyLjQ0NloiLCJjbGllbnRJRCI6Im1jZ3pnbGJGazJnMU9jak9mVVpBMWZycWpaZGNzVmdDIiwicGljdHVyZSI6Imh0dHBzOi8vc2VjdXJlLmdyYXZhdGFyLmNvbS9hdmF0YXIvNjYzZmFkYWM4YzNkNWM2ZWZiNTZlMjBjMmMzMzliNjI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGc3NsLmdzdGF0aWMuY29tJTJGczIlMkZwcm9maWxlcyUyRmltYWdlcyUyRnNpbGhvdWV0dGU4MC5wbmciLCJ1c2VyX2lkIjoiYXV0aDB8NTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwibmFtZSI6ImpwLmJoYXZuYW5pQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoianAuYmhhdm5hbmkiLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiNTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwicHJvdmlkZXIiOiJhdXRoMCIsImNvbm5lY3Rpb24iOiJVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbiIsImlzU29jaWFsIjpmYWxzZX1dLCJjcmVhdGVkX2F0IjoiMjAxNC0xMS0xMVQxNzoxMTozMi42ODRaIiwiZ2xvYmFsX2NsaWVudF9pZCI6IjVHR0t2WkVSOUkyeGZ3Y28zbExyN0FTYUhoWHc3YUQ5IiwiaXNzIjoiaHR0cHM6Ly9hdmFsYW5jaGVjYS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwiYXVkIjoibWNnemdsYkZrMmcxT2NqT2ZVWkExZnJxalpkY3NWZ0MiLCJleHAiOjE0MTcyNDAzMTEsImlhdCI6MTQxNzIwNDMxMX0.hAiw6ijdsi-jfel3bxx1ISIkHT0WFwi59WzCMRF2V9A';
            return $http.post(apiUrl + '/api/min/submissions', formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Bearer ' + token
                    }
                })
                .success(onSuccess)
                .error(onError);
        }

        // function getReports() {}

        // function getReport(id) {}

        //private
        function onError(error) {
            console.error(error);
            return $q.reject(error);
        }

        function onSuccess(response) {
            console.log(response);
            return response.data;
        }

        //public API
        return {
            prepareData: prepareData,
            sendReport: sendReport,
            // getReports: getReports,
            // getReport: getReport
        };

    }]);

angular.module('acComponents.services')
    .service('acMinReportData', function() {
        this.avalancheConditions = {
            type: 'multiple',
            prompt: '',
            options: {
                'Slab avalanches today or yesterday': false,
                'Whumphing or drum-like sounds or shooting cracks': false,
                '30cm+ of new snow, or significant drifting, or rain in the last 48 hours': false,
                'Rapid temperature rise near zero': false
            }
        };

        this.ridingConditions = {
            ridingQuality: {
                prompt: 'Riding quality was:',
                type: 'single',
                options: ['Amazing', 'Good', 'OK', 'Terrible'],
                selected: ''
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
    });

angular.module('acComponents.services')
    .factory('acObservation', ["$http", "AC_API_ROOT_URL", function ($http, AC_API_ROOT_URL) {
        return {
            byPeriod: function (period) {
                var opt = {params: {period: period || '2:days'}};

                return $http.get(AC_API_ROOT_URL+'/api/min/observations', opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = AC_API_ROOT_URL+'/api/min/observations/' + obid + format;
                
                return $http.get(obUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);
angular.module("acComponents.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("drawer.html","<div class=\"ac-drawer\"><a ng-click=\"drawer.visible = false\" class=\"ac-drawer-close visible-xs\"><i class=\"fa fa-close fa-lg\"></i></a><div class=\"ac-drawer-tools\"><ul><li ng-click=\"drawer.visible = !drawer.visible\"><i class=\"fa fa-file-text-o fa-fw fa-2x fa-inverse ac-middle\"></i></li></ul></div><div ng-transclude=\"ng-transclude\" class=\"ac-drawer-body\"></div></div>");
$templateCache.put("forecast-mini.html","<div class=\"panel\"><div ng-show=\"forecast.externalUrl\" class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-forecast-region\">{{ forecast.name }}</h3></div></div><div class=\"row\"><div class=\"col-xs-12\"><p>The avalanche forecast for this region is produced by one of our partner agencies.\nThe link below will take you to the forecast page on the partner agency\'s own website.</p><a ng-href=\"{{forecast.externalUrl}}\" target=\"_blank\"><i class=\"fa fa-external-link\"></i>  Open partner forecast in new window.</a></div></div></div><div ng-hide=\"forecast.externalUrl\" class=\"panel-body ac-forecast-mini-body\"><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"ac-forecast-region\">{{ forecast.bulletinTitle | acNormalizeForecastTitle }}</h4></div></div><div class=\"row ac-forecast-dates\"><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">DATE ISSUED</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.dateIssued | date:\'EEEE MMMM d, y h:mm a\' | uppercase }}</span></dt></dl></div><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">VALID UNTIL</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.validUntil | date:\'EEEE MMMM d, y h:mm a\' | uppercase }}</span></dt></dl></div></div><div class=\"row\"><div class=\"col-xs-12\"><p class=\"ac-forecast-highlights\"><strong ng-bind-html=\"forecast.highlights\"></strong></p></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul role=\"tablist\" class=\"nav nav-pills\"><li class=\"active\"><a href=\"\" role=\"tab\" data-target=\"#forecast\" data-toggle=\"tab\">Forecast</a></li><li><a href=\"\" role=\"tab\" data-target=\"#problems\" data-toggle=\"tab\">Problems</a></li><li><a href=\"\" role=\"tab\" data-target=\"#details\" data-toggle=\"tab\">Details</a></li><li><a href=\"/forecasts/{{forecast.region}}\" role=\"tab\" data-toggle=\"tab\">Full Page</a></li></ul><div class=\"tab-content\"><div id=\"forecast\" class=\"tab-pane active\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"panel panel-primary\"><div class=\"panel-heading\">{{ forecast.dangerRatings[0].date | date:\'EEEE\' }}</div><div class=\"panel-body ac-forecast-nowcast\"><img ng-show=\"forecast.region\" ng-src=\"{{forecast.region &amp;&amp; apiUrl+\'/api/forecasts/\' + forecast.region  + \'/nowcast.svg\' || \'\'}}\" class=\"ac-nowcast\"/></div><table class=\"table table-condensed ac-forecast-days\"><thead class=\"ac-thead-dark\"><tr><th></th><th>{{ forecast.dangerRatings[1].date | date:\'EEEE\' }}</th><th>{{ forecast.dangerRatings[2].date | date:\'EEEE\' }}</th></tr></thead><tbody><tr><td class=\"ac-veg-zone--alp\"><strong>Alpine</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.alp.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.alp.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--tln\"><strong>Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.tln.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.tln.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--btl\"><strong>Bellow Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.btl.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.btl.replace(\':\', \' \') }}</strong></td></tr><tr><td><strong>Confidence:</strong></td><td colspan=\"2\"><span class=\"ac-text-default\">{{ forecast.confidence }}</span></td></tr></tbody></table></div></div></div></div><div id=\"problems\" class=\"tab-pane\"><div id=\"problemsAccordion\" class=\"panel-group\"><div ng-repeat=\"problem in forecast.problems\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#problem{{$index}}\" data-toggle=\"collapse\" data-parent=\"#problemsAccordion\">{{ problem.type }}<i class=\"fa fa-fw fa-level-down pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"problem{{$index}}\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Elevations?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--elevations\"><img ng-src=\"{{problem.icons.elevations}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Aspects?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--aspects\"><img ng-src=\"{{problem.icons.aspects}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Chances of Avalanches?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--likelihood\"><img ng-src=\"{{problem.icons.likelihood}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Expected Size?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--expected-size\"><img ng-src=\"{{problem.icons.expectedSize}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-12\"><p ng-bind-html=\"problem.comment\" class=\"ac-problem narative\"></p><div class=\"panel panel-default ac-problem-travel-advice\"><div class=\"panel-heading\"><strong class=\"small\">Travel and Terrain Advice</strong></div><div class=\"panel-body\"><p ng-bind-html=\"problem.travelAndTerrainAdvice\"></p></div></div></div></div></div></div></div></div></div><div id=\"details\" class=\"tab-pane\"><div id=\"detailsAccordion\" class=\"panel-group\"><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#avalancheSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Avalanche Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"avalancheSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.avalancheSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#snowpackSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Snowpack Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"snowpackSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.snowpackSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#weatherForecast\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Weather Forecast<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"weatherForecast\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.weatherForecast\" class=\"panel-body\"></div></div></div></div></div></div></div></div></div></div>");
$templateCache.put("loading-indicator.html","<div class=\"ac-loading-indicator\"><div class=\"rect1\"></div><div class=\"rect2\"></div><div class=\"rect3\"></div><div class=\"rect4\"></div><div class=\"rect5\"></div></div>");
$templateCache.put("min-report.html","<div class=\"min-report\"><div class=\"min-report-button\"><button data-toggle=\"modal\" data-target=\"#myModal\" class=\"btn btn-primary btn-lg\">File MIN Report</button></div><div id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button data-dismiss=\"modal\" class=\"close\"><span>close</span></button><h4 class=\"modal-title\">Mountain Information Network Report</h4></div><div class=\"modal-body\"><form role=\"form\"><div class=\"form-group\"><label for=\"report-title\"><i class=\"fa fa-newspaper-o\"></i> Report title</label><input id=\"report-title\" type=\"text\" placeholder=\"auto: Quick Report\" ng-model=\"report.title\" class=\"form-control\"/></div><div class=\"form-group\"><label for=\"report-datetime\"><i class=\"fa fa-clock-o\"></i> Date and Time</label><input id=\"report-datetime\" type=\"datetime-local\" placeholder=\"\" ng-model=\"report.datetime\" class=\"form-control\"/></div><div class=\"form-group\"><label for=\"report-location\"><i class=\"fa fa-map-marker\"></i> Location</label><div class=\"form-control\">({{ report.location[0] }}, {{ report.location[1] }})</div></div><div class=\"form-group\"><label for=\"report-files\"><i class=\"fa fa-clock-o\"></i> Add photo</label><input id=\"report-files\" type=\"file\" file-model=\"report.files\" class=\"form-control\"/><div>0 photos added</div></div><div id=\"min-collapsible-form\" role=\"tablist\" class=\"panel-group\"><div class=\"panel panel-default\"><div id=\"riding-conditions-heading\" role=\"tap\" class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#riding-conditions\" href=\"#riding-conditions-collapse\" aria-expanded=\"true\" aria-controls=\"riding-conditions-collapse\">Riding conditions</a></h4></div><div id=\"riding-conditions-collapse\" role=\"tabpanel\" aria-labelledby=\"riding-conditions-collapse\" class=\"panel-collapse collapse in\"><div class=\"panel-body\"><div ng-repeat=\"(item, ridingCondition) in report.ridingConditions\" class=\"form-group\">{{ ridingCondition.prompt }}<div ng-if=\"ridingCondition.type==\'multiple\'\" ng-repeat=\"(option, enabled) in ridingCondition.options\" class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.ridingConditions.options[option]\"/>{{option}}</label></div><div ng-if=\"ridingCondition.type==\'single\'\" ng-repeat=\"option in ridingCondition.options\" class=\"radio\"><label><input type=\"radio\" ng-model=\"report.ridingConditions.item.selected\" ng-value=\"option\"/>{{option}}</label></div></div></div></div></div><div class=\"panel panel-default\"><div id=\"avalanche-conditions\" role=\"tap\" class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#avalanche-conditions\" href=\"#avalanche-conditions-collapse\" aria-expanded=\"true\" aria-controls=\"avalanche-conditions-collapse\">Avalanche conditions</a></h4></div><div id=\"avalanche-conditions-collapse\" role=\"tabpanel\" aria-labelledby=\"avalanche-conditions-collapse\" class=\"panel-collapse collapse in\"><div class=\"panel-body\"><div class=\"form-group\"><div ng-repeat=\"(option, enabled) in report.avalancheConditions.options\" class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.avalancheConditions.options[option]\"/>{{ option }}</label></div></div></div></div></div></div><div class=\"form-group\"><label>Comments</label><textarea rows=\"3\" ng-model=\"report.narrative\" class=\"form-control\"></textarea></div><button type=\"button\" ng-click=\"submitReport()\" class=\"btn btn-default\">SUBMIT REPORT</button></form></div><div class=\"modal-footer\"><button data-dismiss=\"modal\" class=\"btn btn-default\">Close</button></div></div></div></div></div>");}]);
}());