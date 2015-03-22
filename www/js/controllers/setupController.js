/* SETUP CONTROLLER */
angular.module('SetupCtrl', [])
.controller('setupCtrl', function($scope, $routeParams, $location, parking, bikesharing, gettextCatalog) {
  parking.setupDB().then(function(response) {
    $scope.parking = "50%";
    bikesharing.setupDB().then(function(response) {
      $scope.bikesharing = "50%";
      $scope.setupComplete = true;
    });
  });
  $scope.home = function(){
    $location.path("/");
  } 
})