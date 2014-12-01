angular.module('acComponents.directives')
    .directive('fileModel', function($parse) {
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
    })
    .directive('acMin', function($timeout, acMinReportData, acReport, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
        return {
            templateUrl: 'min-report.html',
            replace: true,
            link: function(scope, el, attrs) {
                scope.report = {
                    title: '',
                    datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    latlng: [],
                    files: [],
                    ridingConditions: angular.copy(acMinReportData.ridingConditions),
                    avalancheConditions: angular.copy(acMinReportData.avalancheConditions),
                    comment: ''
                };

                scope.submitReport = function() {
                    console.log('report submitting..');
                    //validate the form data
                    acReport.prepareData(scope.report)
                        .then(acReport.sendReport)
                        .then(function(result) {
                            if (result.data) {
                                console.log('submission: ' + result.data.subid);
                            }
                        });
                };

                var map, marker;
                scope.showMap = function() {
                    if (!map) {
                        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
                        map = L.mapbox.map('location-map', MAPBOX_MAP_ID, {
                            attributionControl: false
                        });
                        map.on('click', onMapClick);
                    }
                };

                //TODO-JPB remove as this is only necessary for the bootstrap modal. The map cannot be
                //rendered before the modal is displayed as it's width is set to 100% and the container
                //is 0px when the modal is not shown.
                angular.element(document.getElementById('myModal')).on('shown.bs.modal', function(e) {
                    scope.showMap();
                });

                function onMapClick(e) {
                    if (!marker) {
                        scope.$apply(function() {
                            scope.report.latlng[0] = e.latlng.lat;
                            scope.report.latlng[1] = e.latlng.lng;
                        });
                        var latlng = new L.LatLng(e.latlng.lat, e.latlng.lng);

                        marker = L.marker(latlng, {
                            icon: L.mapbox.marker.icon({
                                'marker-color': 'f79118'
                            }),
                            draggable: true
                        });

                        marker
                            .bindPopup('Position: ' + e.latlng.toString().substr(6) + "<br/>(drag to relocate)")
                            .addTo(map)
                            .openPopup();

                        marker.on('dragend', function(e) {
                            var position = marker.getLatLng();
                            scope.$apply(function() {
                                scope.report.latlng[0] = position.lat;
                                scope.report.latlng[1] = position.lng;
                            });
                            marker.setPopupContent('Position: ' + position.toString().substr(6) + "<br/>(drag to relocate)");
                            marker.openPopup();
                        });
                    }
                }
            }
        };
    });
