/* HOME CONTROLLER */
angular.module('HomeCtrl', [])
.controller('homeCtrl', function($scope, $routeParams, $location, $timeout, geolocation, parking, bikesharing, cityshuttle, gettextCatalog, push) {
	
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	
  var language = "it";
  
  /* SLIDE MENU + MENU BUTTONS */

  $scope.slide = false;

  $scope.slideMenu = function(){
    $scope.slide = $scope.slide === true ? false: true;
  }

  $scope.map = function(){
    $scope.slide = false;
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
  
  /* START APP */
	  	  
	var map = L.map('map', {zoomControl:false}).setView([45.80806, 9.08518], 15);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			zoomControl: false,
			attributionControl: false
	}).addTo(map);
	
	setTimeout(map.invalidateSize.bind(map));
	
	var userMarker;

	if(localStorage.getItem("userLatitude") == undefined){
    
	geolocation.getPosition().then(function(position){

        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        localStorage.setItem("userLatitude", $scope.latitude);
        localStorage.setItem("userLongitude", $scope.longitude);
		$scope.loadData();
		
		if(!userMarker){
			
			map.panTo(new L.LatLng($scope.latitude, $scope.longitude));
			$scope.loading = false;

			userMarker = L.marker([$scope.latitude, $scope.longitude])
			.addTo(map);		  
		}
		userMarker.setLatLng([$scope.latitude, $scope.longitude]).update();

    });
	
	}
	else{
		loadData();
	}
	
	function loadData(){
		
	var parkingMarkers = new L.layerGroup();
	var bikesharingMarkers = new L.layerGroup();
	var cityshuttleMarkers = new L.layerGroup();
		
	/* PARKING DATA */
		
      parking.list().then(function(data) {
		  
		var userLatitude = localStorage.getItem("userLatitude");
        var userLongitude = localStorage.getItem("userLongitude");
		  		  
		var greenIcon = L.icon({
			iconUrl: 'img/parking_green.png',
			iconSize:     [32, 37], // size of the icon
			popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
		});
		var orangeIcon = L.icon({
			iconUrl: 'img/parking_yellow.png',
			iconSize:     [32, 37], // size of the icon
			popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
		});
		var redIcon = L.icon({
			iconUrl: 'img/parking_red.png',
			iconSize:     [32, 37], // size of the icon
			popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
		});

        for(var i=0;i<data.length;i++){
						
		  var R = 6371; // km
		  var dLat = (data[i].latitude-userLatitude) * Math.PI / 180;
		  var dLon = (data[i].longitude-userLongitude) * Math.PI / 180;

		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data[i].latitude * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);

		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		  var distance = (R * c * 1000).toFixed(1); //meters
						
          switch (true) {
            case (data[i].freeParkingNumber>100):
                var color = greenIcon;

                break;
            case (data[i].freeParkingNumber>30):
                 	var color = orangeIcon;
                break;
            case (data[i].freeParkingNumber<10):
				 	var color = redIcon;
                break;
            break;
          }

          var popupContent = "<a href='#/parking/"+data[i].idParking+"' class='map-popup'><h4>"+data[i].name+" ("+data[i].freeParkingNumber+"/"+data[i].totalParkingNumber+")</h4><p>"+data[i].address+" - "+distance+"Km   <i class='fa fa-angle-right'></i></p></a>"

          parkingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)],{icon: color})
          .bindPopup(popupContent, {closeButton: false}))
          //.bindLabel(data[i].name, { noHide: true, direction: 'auto'}));
        }

        $scope.showHideParking = true;
        map.addLayer(parkingMarkers);
     
      });
	  
  /* BIKESHARING DATA */
  

  bikesharing.list().then(function(data) {
	  
	var bikeIcon = L.icon({
		iconUrl: 'img/bicycle.png',
		iconSize:     [32, 37], // size of the icon
		popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
	});

    for(var i=0;i<data.length;i++){

      var popupContent = "<a href='#/bikesharing/"+data[i].idBikesharing+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+data[i].userDistance+"Km   <i class='fa fa-angle-right'></i></p></a>";
              
      bikesharingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: bikeIcon})
        .bindPopup(popupContent, {closeButton: false}))
      //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

    }

    $scope.showHideBikesharing = true;
    map.addLayer(bikesharingMarkers);
     
  });
  


  /* CITYSHUTTLE DATA */
  
  
  cityshuttle.list().then(function(data) {
	  
	var busIcon = L.icon({
		iconUrl: 'img/bus.png',
		iconSize:     [32, 37], // size of the icon
		popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
	});

    for(var i=0;i<data.length;i++){

      var popupContent = "<a href='#/cityshuttle/"+data[i].idCityshuttle+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+data[i].userDistance+"Km   <i class='fa fa-angle-right'></i></p></a>";
              
      cityshuttleMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: busIcon})
        .bindPopup(popupContent, {closeButton: false}))
      //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

    }

    $scope.showHideCityshuttle = false;
     
  });
	
  $scope.showParking = function(){
    $scope.showHideParking = $scope.showHideParking === true ? false: true;
    if($scope.showHideParking == false){
      map.removeLayer(parkingMarkers);
    }
    else{
      map.addLayer(parkingMarkers);
    }
    
  }
  
  $scope.showBikesharing = function(){
    $scope.showHideBikesharing = $scope.showHideBikesharing === true ? false: true;
    if($scope.showHideBikesharing == false){
      map.removeLayer(bikesharingMarkers);
    }
    else{
      map.addLayer(bikesharingMarkers);
    }
    
  }

  $scope.showCityshuttle = function(){
    $scope.showHideCityshuttle = $scope.showHideCityshuttle === true ? false: true;
    if($scope.showHideCityshuttle == false){
      map.removeLayer(cityshuttleMarkers);
    }
    else{
      map.addLayer(cityshuttleMarkers);
    }
    
  }
  
  
  	}

}//DEVICE READY
	  
})