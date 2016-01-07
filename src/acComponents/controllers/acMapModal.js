'use strict';

angular.module('acComponents.controllers')
  .controller('acMapModal', function ($scope, $modalInstance, latlng, $timeout) {

    $scope.params = {
      latlng: latlng
    };

    $scope.save = function () {
      $scope.params.latlng[0] = $scope.params.latlng[0].toFixed(5);
      $scope.params.latlng[1] = $scope.params.latlng[1].toFixed(5);
      $modalInstance.close($scope.params.latlng);
    };

    $modalInstance.opened.then(function () {
      $timeout( function () {
        $scope.show = true;
      }, 0);
    })
  });
