/* PARKING MAP CONTROLLER */

angular.module('ParkMapCtrl', [])
.controller('parkingMapCtrl', function($scope, $routeParams, $window, $location, parking, bikesharing, goBack) {

  $scope.back = goBack.getProperty();
  console.log($scope.back);
  goBack.setProperty(false);

  $scope.backToHomeFromParkingMap = function(){
    $location.path("/");
    goBack.setProperty(true);
  }

  //angular.element(window).scrollTop(0);
  //window.onscroll = function(ev) {};

  $scope.windowHeight = '{ "height": "'+($window.innerHeight)+'px", "margin-top": "53px" }';

  var userLatitude = sessionStorage.getItem("userLatitude");
  var userLongitude = sessionStorage.getItem("userLongitude");

  var map = L.map('map', {zoomControl:false}).setView([userLatitude, userLongitude], 15);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet',
      maxZoom: 18,
      detectRetina: true
  }).addTo(map);

  L.marker([userLatitude, userLongitude], {icon: L.AwesomeMarkers.icon({icon: 'user', prefix: 'fa', markerColor: 'blue'}) })
   .bindLabel("Hey! i'm you", { noHide: true, direction: 'auto'})
   .addTo(map);

  setTimeout(map.invalidateSize.bind(map));
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

      L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: L.AwesomeMarkers.icon({icon: 'car', prefix: 'fa', markerColor: iconColor}) })
       .bindLabel(data[i].name, { noHide: true, direction: 'auto'})
       .addTo(map);
    }
  
  });
 
  $scope.showList = function(visualization){

      $location.path("/parking/");
      goBack.setProperty(true);

  }

 
   
})