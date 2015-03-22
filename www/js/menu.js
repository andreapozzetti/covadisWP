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
	

}