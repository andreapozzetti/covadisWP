/* BIKESHARING LIST CONTROLLER */
angular.module('CityshuttleListCtrl', [])
.controller('cityshuttleListCtrl', function($scope, $routeParams, $window, $location, $timeout, parking, bikesharing, cityshuttle, goBack) {

  /* BACK BUTTON */


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

  $scope.loading = false;
  
  $scope.cityshuttleList = cityshuttle.getAllCityshuttle().then(function(data) {
    $scope.loading = true;
    $scope.cityshuttleList = data;
    return $scope.cityshuttleList;
  });

  /* ORDER LIST */

  $scope.order = 'userDistance';
  $scope.reverse = false;

  $scope.setOrder = function(order,reverse){
    $scope.order = order;
    $scope.reverse = reverse;
  }

  $scope.cityshuttleInfo = function(idCityshuttle){
      $location.path("/cityshuttle/"+idCityshuttle);
  }

  /*


  $scope.initLoad = function(){
    if(angular.element($window).scrollTop() == 0){
      angular.element($window).scrollTop(100);
    }
    else{
      angular.element($window).scrollTop(100)
    }  
  }

  var listElement = document.getElementById("list");

  if(device.platform == "iOS"){
  
    listElement.addEventListener("touchend", function(e){
      window.onscroll = function(ev) {
      if($window.pageYOffset == 0){
        parking.getFreeParking().then(function(){
          $scope.parkingList = parking.getAllParking().then(function(data) {
            $scope.parkingList = data;
            angular.element($window).scrollTop(100);
            return $scope.parkingList;
          });
        })
      }
      else if(angular.element($window).scrollTop() < 100){
      angular.element($window).scrollTop(100);
      }
      };

    }, false);
  }
  
    if(device.platform == "Android"){
  
    listElement.addEventListener("touchend", function(e){
      if($window.pageYOffset == 0){
        parking.getFreeParking().then(function(){
          $scope.parkingList = parking.getAllParking().then(function(data) {
            $scope.parkingList = data;
            angular.element($window).scrollTop(100);
            return $scope.parkingList;
          });
        })
      }
      else if(angular.element($window).scrollTop() < 100){
      angular.element($window).scrollTop(100);
      }
    }, false);
  }

  */


   
})