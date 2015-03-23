//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
		
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
	function onError(error) {
		console.log('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	};

	function onSuccess(position){

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        localStorage.setItem("userLatitude", latitude);
        localStorage.setItem("userLongitude", longitude);
							
		parkingList(function(data){
							
			var userLatitude = localStorage.getItem("userLatitude");
			var userLongitude = localStorage.getItem("userLongitude");
							  
			for(var i=0;i<data.length;i++){
									
				var R = 6371; // km
				var dLat = (data[i].latitude-userLatitude) * Math.PI / 180;
				var dLon = (data[i].longitude-userLongitude) * Math.PI / 180;
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
						Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data[i].latitude * Math.PI / 180 ) *
						Math.sin(dLon/2) * Math.sin(dLon/2);

				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var distance = (R * c).toFixed(1); //Km
						
				data[i].distance = distance;
			}
			
			localStorage.setItem("parkingListData", JSON.stringify(data));
			sorting("distance");
			
		});
	
	}; //end of onSuccess
	
	function parkingList(parkingData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/parking",
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
	
	function sorting(sort){
		
		switch (sort){
			case "distance":
				var parkingListData = JSON.parse(localStorage.getItem("parkingListData"));
				parkingListData.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance) } );
				
				$( "#list" ).html( "" );
				for(var i=0;i<parkingListData.length;i++){
					
					switch (true) {
						case (parkingListData[i].freeParkingNumber>100):
							var color = "badge-success";
							break;
						case (parkingListData[i].freeParkingNumber>30):
								var color = "badge-warning";
							break;
						case (parkingListData[i].freeParkingNumber<10):
								var color = "badge-alert";
							break;
						break;
					}
				
					var listElement = '<a href="parking.html#'+parkingListData[i].idParking+'" class="list-group-item"><span class="badge '+color+'">'+parkingListData[i].freeParkingNumber+'/'+parkingListData[i].totalParkingNumber+'</span><h4 class="list-group-item-heading">'+parkingListData[i].name+'</h4><p class="list-group-item-text">'+parkingListData[i].address+' - '+parkingListData[i].distance+' Km</p></a>';
					$( "#list" ).append( listElement );	
				}
			
				break;
			case "freeParking":
			
				var parkingListData = JSON.parse(localStorage.getItem("parkingListData"));
				parkingListData.sort(function(a,b) { return parseFloat(b.freeParkingNumber) - parseFloat(a.freeParkingNumber) } );
				$( "#list" ).html( "" );
				for(var i=0;i<parkingListData.length;i++){
					switch (true) {
						case (parkingListData[i].freeParkingNumber>100):
							var color = "badge-success";
							break;
						case (parkingListData[i].freeParkingNumber>30):
								var color = "badge-warning";
							break;
						case (parkingListData[i].freeParkingNumber<10):
								var color = "badge-alert";
							break;
						break;
					}
				
					var listElement = '<a href="parking.html#'+parkingListData[i].idParking+'" class="list-group-item"><span class="badge '+color+'">'+parkingListData[i].freeParkingNumber+'/'+parkingListData[i].totalParkingNumber+'</span><h4 class="list-group-item-heading">'+parkingListData[i].name+'</h4><p class="list-group-item-text">'+parkingListData[i].address+' - '+parkingListData[i].distance+' Km</p></a>';
					
					$( "#list" ).append( listElement );	
				}
				
				break;
		}

	}
	
	$( "a#distance" ).click(function() {
	  sorting("distance");
	});
	
	$( "a#freeparking" ).click(function() {
	  sorting("freeParking");
	});
	
} //DEVICE READY
	
//})	

	
