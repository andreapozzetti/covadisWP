/* HOME CONTROLLER */
angular.module('HomeCtrl', [])
.controller('homeCtrl', function($scope, $routeParams, $location, $timeout, $window, geolocation, parking, bikesharing, cityshuttle, gettextCatalog, push, goBack) {

  /* LANGUANGE */

  var language = "it";
  localStorage.setItem("language", language);

  /*
  navigator.globalization.getPreferredLanguage(
    function (lng) {
      var lang = lng.value;
      language = lang.substring(0, 2);
      localStorage.setItem("language", language);
      gettextCatalog.setCurrentLanguage(language);
    },
    function () {
      console.log('Error getting language\n');
    }
  );
  */

  /* BACK BUTTON */



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
    $scope.slide = false;
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
    if(language == "it"){window.open('http://www.asfautolinee.it/Portals/5/Documents/Orari/I1213/urbano/Urbano-invernale.pdf', '_blank', 'location=no,enableViewportScale=yes'); }
    else{ window.open('http://www.asfautolinee.it/Portals/5/Documents/Orari/I1213/urbano/Urbano-invernale.pdf', '_blank', 'location=no,enableViewportScale=yes');  } 
  }

  $scope.boattimetable = function(){
    $scope.slide = false;
    if(language == "it"){window.open('http://www.navigazionelaghi.it/ita/c_orari.asp', '_blank', 'location=no,enableViewportScale=yes'); }
    else{ window.open('http://www.navigazionelaghi.it/eng/c_orari.asp', '_blank', 'location=no,enableViewportScale=yes');  } 
  }

  $scope.settings = function(){
    $scope.slide = false;
    $location.path("/settings");
  }
  
/*
  $scope.shopincomo = function(){
    if(device.platform == "iOS"){
      appAvailability.check('shopincomo://',
      function() {  // Success callback
        window.open('shopincomo://', '_system');
      },
      function() {  // Error callback
        window.open('itms-apps://itunes.apple.com/it/app/shopincomo/id886182483?mt=8', '_system')
      });
    }

    if(device.platform == "Android"){
      appAvailability.check('com.shopincomo.shopincomo',
      function() {  // Success callback
        window.open('shopincomo://', '_system');
      },
      function() {  // Error callback
        window.open('market://details?id=com.shopincomo.shopincomo&hl=it', '_system')
      });
    }

  } // end of open ShopInComo function
  
*/

    /*

    var slidemenuElement = document.getElementById("slide-menu");
    var content = document.getElementById("content");
    var startCoords, endCoords, offset;

    slidemenuElement.addEventListener("touchstart", function(event){
        startCoords = endCoords = event.changedTouches[0].pageX;
    }, false);

    slidemenuElement.addEventListener("touchend", function(event){
      if(startCoords != endCoords){
        $scope.slideMenu();
      }
    }, false);
      //slidemenu.addEventListener("touchcancel", handleCancel, false);
      //slidemenu.addEventListener("touchleave", handleEnd, false);
    slidemenuElement.addEventListener("touchmove", function(event){
      endCoords = event.changedTouches[0].pageX;
      //console.log(event.touches[0].pageX);
      //this.style.left = -event.touches[0].pageX + 'px';
      var offset = startCoords-endCoords;
      if(offset >0 && offset < 200){
        content.style.left = (200 - offset) + 'px';
      }
    }, false);

    */


  /* MAP */


  //$scope.windowHeight = '{ "height": "'+($window.innerHeight)+'px" }';
  
  $scope.windowHeight = '{ "height": "500px" }';

  //var userLatitude = sessionStorage.getItem("userLatitude");
  //var userLongitude = sessionStorage.getItem("userLongitude");

  var map = L.map('map', {zoomControl:false}).setView([45.80806, 9.08518], 15);
  //map.spin(true, {lines: 11, length: 11, width: 5});

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      detectRetina: true
  }).addTo(map);

  setTimeout(map.invalidateSize.bind(map));

  /* GEOLOCATION */
  
  /*
  parking.checkInstallation().then(function(response) {
    if(response == true){
      parking.getData().then(function(response) {
        $scope.bikesharingInstallation();
      });
    }
    else{
      parking.install().then(function(response) {
        $scope.bikesharingInstallation();
      });
    }
  })


  $scope.bikesharingInstallation = function(){
    bikesharing.checkInstallation().then(function(response) {
      if(response == true){
        bikesharing.getData().then(function(response) {
          $scope.cityshuttleInstallation();
        });
      }
      else{
        bikesharing.install().then(function(response) {
          $scope.cityshuttleInstallation();
        });
      }
    })
  }

  $scope.cityshuttleInstallation = function(){
    cityshuttle.checkInstallation().then(function(response) {
      if(response == true){
        cityshuttle.getData().then(function(response) {
          $scope.loadData();
        });
      }
      else{
        cityshuttle.install().then(function(response) {
          $scope.loadData();
        });
      }
    })
  }
  
  */
  
  
  //var parkingMarkers = new L.layerGroup();
  //var bikesharingMarkers = new L.layerGroup();
  //var cityshuttleMarkers = new L.layerGroup();
  
  /*

  $scope.loadData = function(){

    var userMarker;

    geolocation.getPosition().then(function(position){

      //$scope.latitude = position.coords.latitude;
      //$scope.longitude = position.coords.longitude;
	  $scope.latitude = "45.810273";
      $scope.longitude = "9.086490";
      sessionStorage.setItem("userLatitude", $scope.latitude);
      sessionStorage.setItem("userLongitude", $scope.longitude);

      if(!userMarker){
        
        map.panTo(new L.LatLng($scope.latitude, $scope.longitude));

        userMarker = L.marker([$scope.latitude, $scope.longitude])
        .bindLabel("Hey! i'm you", { noHide: true, direction: 'auto'})
        .addTo(map);
		
        map.spin(false);
      
      }
      userMarker.setLatLng([$scope.latitude, $scope.longitude]).update();
      
      parking.distance($scope.latitude,$scope.longitude).then(function(response) {
        bikesharing.distance($scope.latitude,$scope.longitude).then(function(response) {
          cityshuttle.distance($scope.latitude,$scope.longitude).then(function(response) {
                $scope.loading = true;
          });
        });
      });

    });
	
	

    /* PARKING DATA */
	
	/*
	
    parking.getFreeParking().then(function(){

      parking.getAllParking().then(function(data) {

        for(var i=0;i<data.length;i++){
          switch (true) {
            case (data[i].freeParking>100):
                var iconColor = 'green'
                break;
            case (data[i].freeParking>30):
                var iconColor = 'orange'
                break;
            case (data[i].freeParking<10):
                var iconColor = 'red'
                break;
            break;
          }

          var popupContent = "<a href='#/parking/"+data[i].idParking+"' class='map-popup'><h4>"+data[i].name+" ("+data[i].freeParking+"/"+data[i].totalParkingNumber+")</h4><p>"+data[i].address+" - "+data[i].userDistance+"Km   <i class='fa fa-angle-right'></i></p></a>"
          
          //parkingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: L.AwesomeMarkers.icon({icon: 'car', prefix: 'fa', markerColor: iconColor}) })
          // .bindPopup(popupContent, {closeButton: false})
          // .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));
        }

        $scope.showHideParking = true;
        //map.addLayer(parkingMarkers);
     
      });
    })
	
	*/
	
  /* BIKESHARING DATA */
  
  /*

  bikesharing.getAllBikesharing().then(function(data) {

    for(var i=0;i<data.length;i++){

      var popupContent = "<a href='#/bikesharing/"+data[i].idBikesharing+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+data[i].userDistance+"Km   <i class='fa fa-angle-right'></i></p></a>";
              
      //bikesharingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: L.AwesomeMarkers.icon({icon: 'bicycle', prefix: 'fa', markerColor: 'cadetblue'}) })
      //  .bindPopup(popupContent, {closeButton: false})
      //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

    }

    $scope.showHideBikesharing = true;
    //map.addLayer(bikesharingMarkers);
     
  });
  
  */

  /* CITYSHUTTLE DATA */
  
  /*

  cityshuttle.getAllCityshuttle().then(function(data) {

    for(var i=0;i<data.length;i++){

      var popupContent = "<a href='#/cityshuttle/"+data[i].idCityshuttle+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+data[i].userDistance+"Km   <i class='fa fa-angle-right'></i></p></a>";
              
      //cityshuttleMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: L.AwesomeMarkers.icon({icon: 'bus', prefix: 'fa', markerColor: 'blue'}) })
      //  .bindPopup(popupContent, {closeButton: false})
      //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

    }

    $scope.showHideCityshuttle = false;
     
  });
  
 

  } // END OF LOAD DATA
  
 */
  
  /*

  $scope.showParking = function(){
    $scope.showHideParking = $scope.showHideParking === true ? false: true;
    if($scope.showHideParking == false){
      //map.removeLayer(parkingMarkers);
    }
    else{
      //map.addLayer(parkingMarkers);
    }
    
  }


  $scope.showBikesharing = function(){
    $scope.showHideBikesharing = $scope.showHideBikesharing === true ? false: true;
    if($scope.showHideBikesharing == false){
      //map.removeLayer(bikesharingMarkers);
    }
    else{
      //map.addLayer(bikesharingMarkers);
    }
    
  }

  $scope.showCityshuttle = function(){
    $scope.showHideCityshuttle = $scope.showHideCityshuttle === true ? false: true;
    if($scope.showHideCityshuttle == false){
      //map.removeLayer(cityshuttleMarkers);
    }
    else{
      //map.addLayer(cityshuttleMarkers);
    }
    
  }
  
  */

  /*  */






  /* CHECK DB + GEOLOCATING */

  /*
  parking.checkDB().then(function(response) {
    if(!response){
      $location.path("/language");
    }
    else{
      $scope.start();
    }
  
  });

  $scope.start = function(){
    
    geolocation.getPosition(function(position){

        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        sessionStorage.setItem("userLatitude", $scope.latitude);
        sessionStorage.setItem("userLongitude", $scope.longitude);

        parking.distance($scope.latitude,$scope.longitude).then(function(response) {
          $scope.loading = true;
          //parking.freeParking().then(function(response) {
          //$scope.loading = false;
          //});
        });

    });
  }

  */

   
})