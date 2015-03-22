/* PARKING CONTROLLER */

angular.module('ParkCtrl', [])
.controller('parkingCtrl', function($scope, $routeParams, $window, $location, parking, bikesharing, androidNavigate, push, goBack) {

  /* BACK BUTTON */

  $scope.back = function(){
    $window.history.back();
  }

  /* LOADING */

  $scope.loading = false;

  /* SLIDE MENU + MENU BUTTONS */

  var language = "it";

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

  $scope.parkingInfo = parking.getParking($routeParams.idParking).then(function(data) {

    var language = "it";
    if(language == "it"){var description = data.description_it}
    else{ var description = data.description_it } 

    var parkingData = {
                        idParking: data.idParking,
                        name: data.name,
                        address: data.address,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        totalParkingNumber: data.totalParkingNumber,
                        freeParking: data.freeParking,
                        minPrice: data.minPrice,
                        maxPrice: data.maxPrice,
                        timetable: JSON.parse(data.timetable),
                        description: description,
                        userDistance: data.userDistance,
                        img: data.img
                      }

    $scope.loading = true;

    $scope.parkingInfo = parkingData;
    
    return $scope.parkingInfo;
  
  });

  $scope.navigate = function(idParking,parkingName,parkingLatitude,parkingLongitude,alertTime){

    sessionStorage.setItem("idParking", idParking);
    sessionStorage.setItem("parkingName", parkingName);
    sessionStorage.setItem("alertTime", alertTime);

    $scope.coordinates = ""+parseFloat(parkingLatitude).toFixed(5)+","+parseFloat(parkingLongitude).toFixed(5)+"";
    
      var pushNotification = window.plugins.pushNotification;

      switch (device.platform) {
          case ("Android" || "android"):
              pushNotification.register(successHandler, errorHandler, {"senderID":"192576884107","ecb":"onNotification"});
              androidNavigate.startNavigator($scope.coordinates, function(){});
              break;
          case "iOS":
              pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
              window.location.href = "maps:q="+$scope.coordinates+"";
              break;
          case "windows":
              console.log("windows phone");
              break;
      } 

      // Android
      window.onNotification = function(e) {

        switch( e.event ) {
            case 'registered':
              if ( e.regid.length > 0 ) {
                var regId = e.regid;
                var Userdevice = device.platform;
                var idParking = sessionStorage.getItem('idParking');
                var parkingName = sessionStorage.getItem('parkingName');
                var alertTime = sessionStorage.getItem('alertTime');
                var userLanguage = "it";

                push.saveregId(regId, Userdevice, idParking, parkingName, alertTime, userLanguage).then(function(response){
                  var res = JSON.stringify(response);
                })
              }
              break;
            
            case 'message':
              if (e.foreground) {  
                var my_media = new Media(e.sound);
                my_media.play();
                navigator.notification.alert(e.payload.message);
              }
              break;
            case 'error':
              console.log("error");
              break;
        }
      }

      // iOS
      window.onNotificationAPN = function(e) {
        if (e.alert) {
          // showing an alert
          navigator.notification.alert(e.alert);
        }          
        if (e.sound) {
          var snd = new Media(e.sound);
          snd.play();
        }     
        if (e.badge) {
          pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
        }
      }

      function tokenHandler (token) {
        
        var Userdevice = device.platform;
        var idParking = sessionStorage.getItem('idParking');
        var parkingName = sessionStorage.getItem('parkingName');
        var alertTime = sessionStorage.getItem('alertTime');
        var userLanguage = "it";
 
        push.saveregId(token, Userdevice, idParking, parkingName, alertTime, userLanguage).then(function(response){
          var res = JSON.stringify(response);
        })

      }

      function successHandler (result) {
        console.log(result);
      }
                
      function errorHandler (error) {
        console.log(error);
      }

  }
   
})