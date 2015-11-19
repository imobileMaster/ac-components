'use strict';

angular.module('acComponents.controllers')
  .controller('acMapModal', function ($scope, $modalInstance, latlng, $timeout) {

    $scope.params = {
      latlng: latlng
    };

    $scope.save = function () {
      $modalInstance.close($scope.params.latlng);
    };

    $modalInstance.opened.then(function () {
      $timeout( function () {
        $scope.show = true;
      }, 0);
    })
  });
