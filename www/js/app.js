'use strict';



document.addEventListener("deviceready", function() { 
angular.element(document).ready(function () { 
// retrieve the DOM element that had the ng-app attribute
var domElement = document.querySelector("html");
angular.bootstrap(domElement, ["coVadis"]); }); 
}, false);



// public/js/app.js
angular.module('coVadis', ['ngRoute', 'appRoutes', 'gettext', 'setLanguage', 'HomeCtrl']);


// Declare app level module which depends on filters, and services
angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: 'views/home.html', controller: 'homeCtrl'})
		//.when('/language', {templateUrl: 'views/language.html', controller: 'languageCtrl'})
		//.when('/setup', {templateUrl: 'views/setup.html', controller: 'setupCtrl'})
		//.when('/parking', {templateUrl: 'views/parkingList.html', controller: 'parkingListCtrl'})
		//.when('/parking/:idParking', {templateUrl: 'views/parking.html', controller: 'parkingCtrl'})
		//.when('/parkingmap', {templateUrl: 'views/parkingMap.html', controller: 'parkingMapCtrl'})
		//.when('/bikesharing', {templateUrl: 'views/bikesharing.html', controller: 'bikesharingCtrl'})
		//.when('/bus', {templateUrl: 'views/bus.html', controller: 'busCtrl'})
		//.when('/settings', {templateUrl: 'views/settings.html', controller: 'settingsCtrl'})
		.otherwise({redirectTo: '/'});
}])


angular.module('setLanguage', ['gettext'])
.run(function (gettextCatalog) {
    gettextCatalog.currentLanguage = localStorage.getItem('language');
});

