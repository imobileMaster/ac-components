// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('acComponents.config', [])
    .value('acComponents.config', {
        debug: true
    })
    .value('acConfig',{
        reportTypes : ['quick', 'avalanche', 'snowpack', 'weather', 'incident'],
        minFilters: ['avalanche', 'quick', 'snowpack', 'incident', 'weather'],
        dateFilters : ['7-days','1-days','3-days', '14-days', '30-days']
  })
    //.constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com');
    .constant('AC_API_ROOT_URL', 'http://localhost:9000');

// Modules
angular.module('acComponents.controllers', []);
angular.module('acComponents.directives', []);
angular.module('acComponents.filters', []);
angular.module('acComponents.services', []);
angular.module('acComponents',
    [
        'acComponents.config',
        'acComponents.controllers',
        'acComponents.directives',
        'acComponents.filters',
        'acComponents.services',
        'acComponents.templates',
        'ngSanitize'
    ]);
