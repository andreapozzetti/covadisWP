/* PARKING LIST CONTROLLER */
angular.module('ParkingListCtrl', [])
.controller('parkingListCtrl', function($scope, $routeParams, $location, parking, bikesharing) {
	
  var language = "it";
  
  /* SLIDE MENU + MENU BUTTONS */

  $scope.slide = false;

  $scope.slideMenu = function(){
    $scope.slide = $scope.slide === true ? false: true;
  }

  $scope.map = function(){
    //$scope.slide = false;
    $location.path("/");
  }

  $scope.parking = function(){
    //$scope.slide = false;
    $location.path("/parking");
  }

  $scope.bikesharing = function(){
    $scope.slide = false;
    $location.path("/bikesharing");
  }

  $scope.cityshuttle = function(){
    $scope.slide = false;
    $location.path("/cityshuttle");
  }

  $scope.bustimetable = function(){
    $scope.slide = false;
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		if(language == "it"){ var ref = window.open('http://www.asfautolinee.it/Portals/5/Documents/Orari/I1213/urbano/Urbano-invernale.pdf', '_blank', 'location=no'); }
		else{ var ref = window.open('http://www.asfautolinee.it/Portals/5/Documents/Orari/I1213/urbano/Urbano-invernale.pdf', '_blank', 'location=no');  } 
	}
  }

  $scope.boattimetable = function(){
    $scope.slide = false;
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		if(language == "it"){ var ref = window.open('http://www.navigazionelaghi.it/ita/c_orari.asp', '_blank', 'location=no'); }
		else{ var ref = window.open('http://www.navigazionelaghi.it/eng/c_orari.asp', '_blank', 'location=no');  }
	}
  }

  $scope.settings = function(){
    $scope.slide = false;
    $location.path("/settings");
  }
  
  var userLatitude = localStorage.getItem("userLatitude");
  var userLongitude = localStorage.getItem("userLongitude");

  $scope.parkingList = parking.list().then(function(data) {
    $scope.parkingList = data;
		angular.forEach(data, function(obj){
		  var R = 6371; // km
		  var dLat = (obj.latitude-userLatitude) * Math.PI / 180;
		  var dLon = (obj.longitude-userLongitude) * Math.PI / 180;

		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(obj.latitude * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);

		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		  var distance = (R * c * 1000).toFixed(1); //meters
			obj.userDistance = distance;
		});
    return $scope.parkingList;
  });

  $scope.order = 'userDistance';
  $scope.reverse = false;

  $scope.setOrder = function(order,reverse){
    $scope.order = order;
    $scope.reverse = reverse;
  }

  $scope.updateParking = function(){

    parking.getFreeParking().then(function(){
      $scope.parkingList = parking.getAllParking().then(function(data) {
        $scope.parkingList = data;
        return $scope.parkingList;
      });

    })

  }
   
})