'use strict';

angular.module('acComponents.controllers')
  .controller('acBackModal', function ($scope, $modalInstance) {

    $scope.discardAndExit = function () {
      $modalInstance.close(true);
    };

    $scope.stayOnThePage = function () {
      $modalInstance.dismiss();
    };

  });
