angular.module('Ctrl', [])

/* LANGUAGE CONTROLLER */

.controller('languageCtrl', function($scope, $routeParams, $location, gettextCatalog) {

  $scope.chooseLanguage = function(language){
      localStorage.setItem("language", language);
      gettextCatalog.setCurrentLanguage(language);
      $location.path("/setup");
  
  }
   
})

/* SETUP CONTROLLER */

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

/* test CONTROLLER */

.controller('testCtrl', function($scope, $routeParams, $location, database, gettextCatalog) {
//.controller('HomeCtrl', function($scope, geolocation, notificationPromptPermission, notificationHasPermission, notificationSetup, notificationOnAdd) {

  /*
  geolocation.getPosition(function(position){
      $scope.latitude = position.coords.latitude;
      $scope.longitude = position.coords.longitude;
      alert($scope.latitude);
  });
  
  */
  /*
  notificationPromptPermission.promptNotification(function(granted){
      $scope.grantedPer = granted;
  });
  */
  
  /*
  notificationHasPermission.hasPermission(function(granted){
	  $scope.grantedHas = granted;
  });


setInterval(function(){
  notificationSetup.showNotification(function(){
      
  });
}, 5000);

  */

  // Language switcher
    $scope.languages = {
        current: gettextCatalog.currentLanguage,
        available: {
        'it': 'Ita',
        'en': 'Eng'
        }
    };

    $scope.$watch('languages.current', function (lang) {
        if (!lang) {
            return;
        }

        gettextCatalog.setCurrentLanguage(lang);
    });
	

  
  /*

  notificationOnAdd(function(id, state, json){

      $scope.id = id;
      $scope.state = state;
      $scope.json = json;
      
  });

  */


 
  /*

  $scope.parkingList = parkingList.list().then(function(data) {

      $scope.parkingList = data;
      
        angular.forEach($scope.parkingList, function(obj){
          $scope.number = Math.floor(Math.random() * ((10-2)+1) + 2);
          obj.freeCarPark = $scope.number;
        });

      return $scope.parkingList;

  });

  */

  /* --------------------------------------------------------------------------------------- */

  /* WEB SQL*/
  
  
  /*
  
  database.ckeckDB().then(function(data) {

	$scope.parkingList = database.getAllParking().then(function(data) {
      $scope.parkingList = data;
      return $scope.parkingList;
	})
	  
  });

*/
  
  /*
;
  


  $scope.parkingInfo = function(idParking){
      $location.path("/parking/"+idParking);
      

  }
  
  
*/

  /* INDEX DB */

  /*
  
  $scope.parkingList = indexedDB.setItems().then(function(data) {

      console.log(data);
      $scope.parkingList = data;
      return $scope.parkingList;

  });


  */


  /* --------------------------------------------------------------------------------------- */
  


  /*


      setInterval(function(){

        $scope.parkingList = angular.forEach($scope.parkingList, function(obj){
          $scope.number = Math.floor(Math.random() * ((10-2)+1) + 2);
          obj.freeCarPark = $scope.number;
        });

        $scope.$apply();

      }, 5000);

  console.log($scope.parkingList);
  
  */  
})

