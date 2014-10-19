// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('acComponents.config', [])
    .value('acComponents.config', {
        debug: true
    });

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
        'ngSanitize'
    ]);
