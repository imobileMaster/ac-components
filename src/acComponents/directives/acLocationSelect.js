angular.module('acComponents.directives')
    .directive('acLocationSelect', function(MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $timeout) {
        return {
            template: '<div style="height: 300px; width: 100%;"></div>',
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
                    scrollWheelZoom: false
                }).on('click', function (e) {
                    if (!marker) {

                        setLatlng(e.latlng);

                        marker = L.marker(e.latlng, {
                            icon: L.mapbox.marker.icon({
                                'marker-color': 'f79118'
                            }),
                            draggable: true
                        });

                        marker.bindPopup('Position: ' + e.latlng.toString().substr(6) + '<br/>(drag to relocate)')
                            .addTo(map)
                            .openPopup();

                        marker.on('dragend', function(e) {
                            var location = marker.getLatLng();
                            marker.setPopupContent('Position: ' + location.toString().substr(6) + '<br/>(drag to relocate)');
                            marker.openPopup();

                            setLatlng(location);
                        });
                    }
                });

                $scope.$watch('latlng', function (latlng) {
                    if (marker && latlng[0] === 0 && latlng[1] === 0) {
                        map.removeLayer(marker);
                    }
                });
            }
        };
    });
