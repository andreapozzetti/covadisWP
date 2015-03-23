//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
			
	var idCityshuttle = window.location.hash.substr(1);
	
	function cityshuttle(idCityshuttle,cityshuttleData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/cityshuttle/"+idCityshuttle+"",
			dataType: 'json',
			async: false
		})
		.done(function(data) {
			cityshuttleData(data);
		})
		.fail(function(error) {
			console.log(error)
		})
	}
						
	cityshuttle(idCityshuttle, function(data){
						
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
				
		$( ".distance" ).html(data.distance+"Km");
		$( ".name" ).html(data.name);
		$( ".address" ).html(data.address);
		$( ".description" ).html(data.description_it);
						
	});
		
} //DEVICE READY
	
//})	

	