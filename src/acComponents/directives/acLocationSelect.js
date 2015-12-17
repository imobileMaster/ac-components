angular.module('acComponents.directives')
    .directive('acLocationSelect', function(MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $timeout) {
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
    });
