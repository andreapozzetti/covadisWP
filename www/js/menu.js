/*
  Slidemenu
*/
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	$( "button#menu" ).click(function() {
	  $( "div.site-container" ).toggleClass( "menu-active" );
	});
	
	$( "button#back" ).click(function() {
	  window.history.back()
	});
	
	$( "a.bus-timetable" ).click(function() {
	  var ref-bus = window.open('http://www.asfautolinee.it/Portals/5/Documents/Orari/I1213/urbano/Urbano-invernale.pdf', '_blank', 'location=no');
	});
	
	$( "a.boat-timetable" ).click(function() {
	  var ref-boat = window.open('http://www.navigazionelaghi.it/ita/c_orari.asp', '_blank', 'location=no');
	});
	
	$( "a.shopincomo" ).click(function() {
	  var ref-shopincomo = window.open('shopincomo://', '_system');
	});
	

}