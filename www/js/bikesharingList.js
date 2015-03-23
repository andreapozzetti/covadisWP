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
							
		bikesharingList(function(data){
							
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
			
			localStorage.setItem("bikesharingListData", JSON.stringify(data));
			sorting("distance");
			$(".loader").hide();
			$(".list-group").show();
			
		});
	
	}; //end of onSuccess
	
	function bikesharingList(bikesharingData) {
		$.ajax({
			url: "http://131.175.59.106:3210/api/bikesharing",
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
	
	function sorting(sort){
		
		switch (sort){
			case "distance":
				var bikesharingListData = JSON.parse(localStorage.getItem("bikesharingListData"));
				bikesharingListData.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance) } );
				
				$( "#list" ).html( "" );
				for(var i=0;i<bikesharingListData.length;i++){
					
					var listElement = '<a href="bikesharing.html#'+bikesharingListData[i].idBikesharing+'" class="list-group-item"><h4 class="list-group-item-heading">'+bikesharingListData[i].name+'</h4><p class="list-group-item-text">'+bikesharingListData[i].address+' - '+bikesharingListData[i].distance+' Km</p></a>';
					$( "#list" ).append( listElement );	
				}
			
				break;
			case "name":
			
				var bikesharingListData = JSON.parse(localStorage.getItem("bikesharingListData"));
				bikesharingListData.sort(function (a, b) { a = a.name; b = b.name; return a.localeCompare(b) });
				
				$( "#list" ).html( "" );
				for(var i=0;i<bikesharingListData.length;i++){
					
					var listElement = '<a href="bikesharing.html#'+bikesharingListData[i].idBikesharing+'" class="list-group-item"><h4 class="list-group-item-heading">'+bikesharingListData[i].name+'</h4><p class="list-group-item-text">'+bikesharingListData[i].address+' - '+bikesharingListData[i].distance+' Km</p></a>';
					
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

	
