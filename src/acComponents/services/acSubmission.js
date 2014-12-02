angular.module('acComponents.services')
    .factory('acSubmission', function ($q, $http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/submissions';

        function prepareData(reportData) {
            var formData = new FormData();

            //process files
            if (reportData.files && reportData.files.length > 0) {
                angular.forEach(reportData.files, function(file, counter) {
                    //TODO-JPB check file type image/video for now just image
                    if (file) {
                        formData.append('file' + counter, file, 'image-' + counter + '.jpg');
                    }
                });
            }

            //process data
            angular.forEach(reportData, function(value, key) {
                if (key !== 'files' && key !== 'latlng' && angular.isObject(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (key === 'latlng') {
                    formData.append(key, JSON.stringify(value));
                } else if (key === 'datetime') {
                    formData.append(key, moment(value).format());
                } else if (key !== 'files' && !angular.isObject(value)) {
                    formData.append(key, value);
                }
            });

            return $q.when(formData);
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
                
                return $http.get(endpointUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    });