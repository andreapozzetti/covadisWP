/*
  Slidemenu
*/
//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	$( "button#menu" ).click(function() {
	  $( "div.site-container" ).toggleClass( "menu-active" );
	});
	
	$( "button#back" ).click(function() {
	  window.history.back();
	});
	
	$( "a.bus-timetable" ).click(function() {
	  var refbus = window.open('http://www.asfautolinee.it/', '_blank', 'location=no');
	});
	
	$( "a.boat-timetable" ).click(function() {
	  var refboat = window.open('http://www.navigazionelaghi.it/', '_blank', 'location=no');
	});
	
	$( "a.shopincomo" ).click(function() {
	  var refshopincomo = window.open('http://www.windowsphone.com/it-it/store/app/shopincomo/ddcf9cb6-2689-4e43-b0ae-66b147977c3f', '_system');
	});
	

} //end of deviceReady

//});