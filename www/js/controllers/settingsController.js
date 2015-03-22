/* SETTINGS CONTROLLER */
angular.module('SettingsCtrl', [])

.controller('languageCtrl', function($scope, $routeParams, $window, $location, $timeout, parking, bikesharing, gettextCatalog, goBack) {

  $scope.chooseLanguage = function(language){
      localStorage.setItem("language", language);
      gettextCatalog.setCurrentLanguage(language);
      $location.path("/settings");
  
  }

})

.controller('settingsCtrl', function($scope, $routeParams, $window, $location, $timeout, parking, bikesharing, gettextCatalog, goBack) {


})
