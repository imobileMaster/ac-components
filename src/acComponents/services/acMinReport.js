angular.module('acComponents.services')
    //    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-env.elasticbeanstalk.com')
    .constant('AC_QA_API_ROOT_URL', 'http://avalanche-canada-qa.elasticbeanstalk.com');

angular.module('acComponents.services')
    .factory('acReport', function($http, $q, AC_QA_API_ROOT_URL) {

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
          //TODO-JPB -remove
            var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJhMTg2YzQ0YzBmNzhhMTQzMzIyYmY1N2E5ZjZkMzc5NyIsImVtYWlsIjoianAuYmhhdm5hbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImxhc3RfcGFzc3dvcmRfcmVzZXQiOiIyMDE0LTExLTExVDE3OjExOjIyLjQ0NloiLCJjbGllbnRJRCI6Im1jZ3pnbGJGazJnMU9jak9mVVpBMWZycWpaZGNzVmdDIiwicGljdHVyZSI6Imh0dHBzOi8vc2VjdXJlLmdyYXZhdGFyLmNvbS9hdmF0YXIvNjYzZmFkYWM4YzNkNWM2ZWZiNTZlMjBjMmMzMzliNjI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGc3NsLmdzdGF0aWMuY29tJTJGczIlMkZwcm9maWxlcyUyRmltYWdlcyUyRnNpbGhvdWV0dGU4MC5wbmciLCJ1c2VyX2lkIjoiYXV0aDB8NTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwibmFtZSI6ImpwLmJoYXZuYW5pQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoianAuYmhhdm5hbmkiLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiNTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwicHJvdmlkZXIiOiJhdXRoMCIsImNvbm5lY3Rpb24iOiJVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbiIsImlzU29jaWFsIjpmYWxzZX1dLCJjcmVhdGVkX2F0IjoiMjAxNC0xMS0xMVQxNzoxMTozMi42ODRaIiwiZ2xvYmFsX2NsaWVudF9pZCI6IjVHR0t2WkVSOUkyeGZ3Y28zbExyN0FTYUhoWHc3YUQ5IiwiaXNzIjoiaHR0cHM6Ly9hdmFsYW5jaGVjYS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTQ2MjNkZDNmZTQ0MWViZDI2YmM0ZGU4IiwiYXVkIjoibWNnemdsYkZrMmcxT2NqT2ZVWkExZnJxalpkY3NWZ0MiLCJleHAiOjE0MTczMjgwNTgsImlhdCI6MTQxNzI5MjA1OH0.BdPuqZVUrlUB1KMZTIV8o1h63KNfqW2Zo1clDEGLloc';
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

    });
