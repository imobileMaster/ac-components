angular.module('acComponents.services')
    .factory('acSubmission', function ($q, $http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/submissions';
        var sizeLimit = 25000000;
        var allowedExtentions = ['png', 'jpg', 'jpeg', 'gif'];
        var fileViolationErrorMsg = 'Invalid file! Files have to be smaller than 25 MB and of type: ' + allowedExtentions.join(', ');

        function fileIsValid(file){
            var fileExtention = file.name.split('.').pop().toLowerCase();
            return file.size < sizeLimit && allowedExtentions.indexOf(fileExtention) !== -1;
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
                        data.append(key, moment(value).format());
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
                
                return $http.get(endpointUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    });