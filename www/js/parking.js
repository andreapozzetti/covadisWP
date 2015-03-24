//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	$(".loader").show();
	$(".page-header").hide();
	$(".page-content").hide();
			
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
		
		localStorage.setItem("idParking", data.idParking);
		localStorage.setItem("parkingName", data.name);
		
		var geoPosition = parseFloat(data.latitude).toFixed(5)+","+parseFloat(data.longitude).toFixed(5);
		localStorage.setItem("geoPosition", geoPosition);
		
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

		$(".loader").hide();
		$(".page-header").show();
		$(".page-content").show();
		
		$( ".distance" ).html(data.distance+"Km");
		$( ".name" ).html(data.name);
		$( ".address" ).html(data.address);
		$( ".number" ).html(data.freeParkingNumber+"/<small>"+data.totalParkingNumber+"</small>");
		$( ".number-container" ).addClass(color);
		$( ".description" ).html(data.description_it);
		
		$( ".monday" ).html("<span tkey='monday'>Monday</span>"+data.timetable.monday);
		$( ".tuesday" ).html("<span tkey='tuesday'>Tuesday</span>"+data.timetable.tuesday);
		$( ".wednesday" ).html("<span tkey='wednesday'>Wednesday</span>"+data.timetable.wednesday);
		$( ".thursday" ).html("<span tkey='thursday'>thursday</span>"+data.timetable.thursday);
		$( ".friday" ).html("<span tkey='friday'>friday</span>"+data.timetable.friday);
		$( ".saturday" ).html("<span tkey='saturday'>saturday</span>"+data.timetable.saturday);
		$( ".sunday" ).html("<span tkey='sunday'>sunday</span>"+data.timetable.sunday);
		
		$( ".cost-min" ).html("Min: "+data.minPrice);
		$( ".cost-max" ).html("Max: "+data.maxPrice);
		
	});
		
	function push(alertTime,pushData) {
		
		var pushNotification;
		var idParking = localStorage.getItem("idParking");
		var parkingName = localStorage.getItem("parkingName");
		
        pushNotification = window.plugins.pushNotification;
		pushNotification.register(channelHandler,errorHandler,{"channelName": "https://covadis.azure-mobile.net/","ecb": "onNotificationWP8","uccb": "channelHandler","errcb": "jsonErrorHandler"});

		

		
		$.ajax({
			method: "POST",
			url: "http://131.175.59.106:3210/api/users",
			dataType: 'json',
			data: {"regId": "123456", "device": "Windows", "userLanguage": "it", "idParking": idParking, "parkingName": parkingName, "alertTime": alertTime},
			async: false
		})
		.done(function(data) {
			pushData(data);
		})
		.fail(function(error) {
			console.log(error)
		})
	}
	
	$( "button.navigate-15" ).click(function() {
		var alertTime = 15;
		var geoPosition = localStorage.getItem("geoPosition");
		push(alertTime,function(data){});
		window.location.href = "maps:"+geoPosition+"";
	});
	
	$( "button.navigate-30" ).click(function() {
		var alertTime = 30;
		var geoPosition = localStorage.getItem("geoPosition");
		push(alertTime,function(data){});
		window.location.href = "maps:"+geoPosition+"";
	});
			
} //DEVICE READY
	
//})	

	
