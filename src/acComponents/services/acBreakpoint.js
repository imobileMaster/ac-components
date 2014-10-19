angular.module('acComponents.services')
    .factory('acBreakpoint', function ($rootScope, $timeout, $window) {
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
    });