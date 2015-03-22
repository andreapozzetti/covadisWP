'use strict';
document.addEventListener("deviceready", function() { 
angular.element(document).ready(function () { 
// retrieve the DOM element that had the ng-app attribute
var domElement = document.querySelector("html");
angular.bootstrap(domElement, ["coVadis"]); }); 
}, false);



// public/js/app.js
angular.module('coVadis', ['ngRoute', 'appRoutes', 'gettext', 'setLanguage', 'Ctrl', 'HomeCtrl', 'ParkListCtrl', 'ParkCtrl', 'BikesharingListCtrl', 'BikesharingCtrl', 'CityshuttleListCtrl', 'CityshuttleCtrl', 'Service']);


// Declare app level module which depends on filters, and services
angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: 'views/home.html', controller: 'homeCtrl'})
		.when('/language', {templateUrl: 'views/language.html', controller: 'languageCtrl'})
		.when('/setup', {templateUrl: 'views/setup.html', controller: 'setupCtrl'})
		.when('/parking', {templateUrl: 'views/parkingList.html', controller: 'parkingListCtrl'})
		.when('/parking/:idParking', {templateUrl: 'views/parking.html', controller: 'parkingCtrl'})
		.when('/bikesharing', {templateUrl: 'views/bikesharingList.html', controller: 'bikesharingListCtrl'})
		.when('/bikesharing/:idBikesharing', {templateUrl: 'views/bikesharing.html', controller: 'bikesharingCtrl'})
		.when('/cityshuttle', {templateUrl: 'views/cityshuttleList.html', controller: 'cityshuttleListCtrl'})
		.when('/cityshuttle/:idCityshuttle', {templateUrl: 'views/cityshuttle.html', controller: 'cityshuttleCtrl'})
		.when('/settings', {templateUrl: 'views/settings.html', controller: 'settingsCtrl'})
		.otherwise({redirectTo: '/'});
}])


angular.module('setLanguage', ['gettext'])
.run(function (gettextCatalog) {
    gettextCatalog.currentLanguage = localStorage.getItem('language');
});

