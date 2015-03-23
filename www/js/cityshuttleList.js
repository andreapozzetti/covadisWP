//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	$(".loader").show();
	$(".list-group").hide();
		
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
							
		cityshuttleList(function(data){
							
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
			
			localStorage.setItem("cityshuttleListData", JSON.stringify(data));
			sorting("distance");
			
			$(".loader").hide();
			$(".list-group").show();
			
		});
	
	}; //end of onSuccess
	
	function cityshuttleList(cityshuttleData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/cityshuttle",
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
	
	function sorting(sort){
		
		switch (sort){
			case "distance":
				var cityshuttleListData = JSON.parse(localStorage.getItem("cityshuttleListData"));
				cityshuttleListData.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance) } );
				
				$( "#list" ).html( "" );
				for(var i=0;i<cityshuttleListData.length;i++){
					
					var listElement = '<a href="cityshuttle.html#'+cityshuttleListData[i].idCityshuttle+'" class="list-group-item"><h4 class="list-group-item-heading">'+cityshuttleListData[i].name+'</h4><p class="list-group-item-text">'+cityshuttleListData[i].address+' - '+cityshuttleListData[i].distance+' Km</p></a>';
					$( "#list" ).append( listElement );	
				}
			
				break;
			case "name":
				var cityshuttleListData = JSON.parse(localStorage.getItem("cityshuttleListData"));				
				cityshuttleListData.sort(function (a, b) { a = a.name; b = b.name; return a.localeCompare(b) });
				
				$( "#list" ).html( "" );
				for(var i=0;i<cityshuttleListData.length;i++){
					
					var listElement = '<a href="cityshuttle.html#'+cityshuttleListData[i].idCityshuttle+'" class="list-group-item"><h4 class="list-group-item-heading">'+cityshuttleListData[i].name+'</h4><p class="list-group-item-text">'+cityshuttleListData[i].address+' - '+cityshuttleListData[i].distance+' Km</p></a>';
					
					$( "#list" ).append( listElement );	
				}
				
				break;
		}

	}
	
	$( "a#distance" ).click(function() {
	  sorting("distance");
	  $( this ).toggleClass( "active");
	  $( "a#name" ).toggleClass( "active");
	});
	
	$( "a#name" ).click(function() {
	  sorting("name");
	  $( this ).toggleClass( "active");
	  $( "a#distance" ).toggleClass( "active");
	});
	
} //DEVICE READY
	
//})	

	
