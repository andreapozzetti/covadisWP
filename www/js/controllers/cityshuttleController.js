/* CITYSHUTTLE CONTROLLER */

angular.module('CityshuttleCtrl', [])
.controller('cityshuttleCtrl', function($scope, $routeParams, $window, $location, parking, bikesharing, cityshuttle, androidNavigate, push, goBack) {

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

  $scope.cityshuttleInfo = cityshuttle.getCityshuttle($routeParams.idCityshuttle).then(function(data) {

    var language = "it";
    if(language == "it"){var description = data.description_it}
    else{ var description = data.description_it } 

    var cityshuttleData = {
                        idCityshuttle: data.idCityshuttle,
                        name: data.name,
                        address: data.address,
                        latitude: data.latutude,
                        longitude: data.longitude,
                        description: description,
                        userDistance: data.userDistance,
                        img: data.img
                      }

    $scope.loading = true;

    $scope.cityshuttleInfo = cityshuttleData;
    
    return $scope.cityshuttleInfo;
  
  });

  $scope.navigate = function(idCityshuttle,cityshuttleName,cityshuttleLatitude,cityshuttleLongitude){

    localStorage.setItem("idCityshuttle", idCityshuttle);
    localStorage.setItem("cityshuttleName", cityshuttleName);

    $scope.coordinates = ""+parseFloat(cityshuttleLatitude).toFixed(5)+","+parseFloat(cityshuttleLongitude).toFixed(5)+"";
    
      switch (device.platform) {
          case ("Android" || "android"):
              androidNavigate.startNavigator($scope.coordinates, function(){});
              break;
          case "iOS":
              window.location.href = "maps:q="+$scope.coordinates+"";
              break;
          case "windows":
              console.log("windows phone");
              break;
      } 
  }
   
})