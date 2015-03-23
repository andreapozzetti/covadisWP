//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
			
	var idParking = window.location.hash.substr(1);
	
	function parking(idParking,parkingData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/parking/"+idParking+"",
			dataType: 'json',
			async: false
		})
		.done(function(data) {
			parkingData(data);
		})
		.fail(function(error) {
			console.log(error)
		})
	}
						
	parking(idParking, function(data){
						
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
		
          switch (true) {
            case (data.freeParkingNumber>100):
                var color = "parking-number-success";

                break;
            case (data.freeParkingNumber>30):
                 	var color = "parking-number-warning";
                break;
            case (data.freeParkingNumber<10):
				 	var color = "parking-number-alert";
                break;
            break;
          }
		
		$( ".distance" ).html(data.distance+"Km");
		$( ".name" ).html(data.name);
		$( ".address" ).html(data.address);
		$( ".number" ).html(data.freeParkingNumber+"/<small>"+data.totalParkingNumber+"</small>");
		$( ".number-container" ).addClass(color);
		$( ".description" ).html(data.description_it);
		
		$( ".monday" ).html("Monday: "+data.timetable.monday);
		$( ".tuesday" ).html("Tuesday: "+data.timetable.tuesday);
		$( ".wednesday" ).html("Wednesday: "+data.timetable.wednesday);
		$( ".thursday" ).html("Thursday: "+data.timetable.thursday);
		$( ".friday" ).html("Friday: "+data.timetable.friday);
		$( ".saturday" ).html("Saturday: "+data.timetable.saturday);
		$( ".sunday" ).html("Sunday: "+data.timetable.sunday);
		
		$( ".cost-min" ).html("Min: "+data.minPrice);
		$( ".cost-max" ).html("Max: "+data.maxPrice);
		
	});
		
} //DEVICE READY
	
//})	

	
