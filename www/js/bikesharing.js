//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	$(".loader").show();
	$(".page-header").hide();
	$(".page-content").hide();
			
	var idBikesharing = window.location.hash.substr(1);
	
	function bikesharing(idBikesharing,bikesharingData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/bikesharing/"+idBikesharing+"",
			dataType: 'json',
			async: false
		})
		.done(function(data) {
			bikesharingData(data);
		})
		.fail(function(error) {
			console.log(error)
		})
	}
						
	bikesharing(idBikesharing, function(data){
						
		var userLatitude = localStorage.getItem("userLatitude");
		var userLongitude = localStorage.getItem("userLongitude");
						  
		var R = 6371; // km
		var dLat = (data.latitude-userLatitude) * Math.PI / 180;
		var dLon = (data.longitude-userLongitude) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data.latitude * Math.PI / 180 ) *
				Math.sin(dLon/2) * Math.sin(dLon/2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var distance = (R * c).toFixed(1); //Km
					
		data.distance = distance;
		
		var geoPosition = parseFloat(data.latitude).toFixed(5)+","+parseFloat(data.longitude).toFixed(5);
		localStorage.setItem("geoPosition", geoPosition);
		
		$(".loader").hide();
		$(".page-header").show();
		$(".page-content").show();
				
		$( ".distance" ).html(data.distance+"Km");
		$( ".name" ).html(data.name);
		$( ".address" ).html(data.address);
		$( ".description" ).html(data.description_it);
						
	});
	
	$( "button.navigate" ).click(function() {
		var geoPosition = localStorage.getItem("geoPosition")
		window.location.href = "maps:"+geoPosition+"";

	});
		
} //DEVICE READY
	
//})	

	
