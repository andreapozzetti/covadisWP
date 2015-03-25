//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	
	var height = $( document ).height();
	$('#map').css('height', height);
	
	var parkingMarkers = new L.layerGroup();
	var bikesharingMarkers = new L.layerGroup();
	var cityshuttleMarkers = new L.layerGroup();
	
	var map = L.map('map', {zoomControl:false}).setView([45.80806, 9.08518], 15);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			zoomControl: false,
			attributionControl: false
	}).addTo(map);
	
	setTimeout(map.invalidateSize.bind(map));
	
	var userMarker;
	
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
		
		if(!userMarker){
			
			map.panTo(new L.LatLng(latitude, longitude));
			userMarker = L.userMarker([latitude, longitude], {pulsing:false, smallIcon:false})
			.addTo(map);			
		}
		userMarker.setLatLng([latitude, longitude]).update();
		
		parkingList(function(data){
					
			var userLatitude = localStorage.getItem("userLatitude");
			var userLongitude = localStorage.getItem("userLongitude");
					  
			var greenIcon = L.icon({
				iconUrl: 'img/parking_green.png',
				iconSize:     [32, 37], // size of the icon
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});
			var orangeIcon = L.icon({
				iconUrl: 'img/parking_yellow.png',
				iconSize:     [32, 37], // size of the icon
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});
			var redIcon = L.icon({
				iconUrl: 'img/parking_red.png',
				iconSize:     [32, 37], // size of the icon
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});

			for(var i=0;i<data.length;i++){
							
			  var R = 6371; // km
			  var dLat = (data[i].latitude-userLatitude) * Math.PI / 180;
			  var dLon = (data[i].longitude-userLongitude) * Math.PI / 180;

			  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data[i].latitude * Math.PI / 180 ) *
				Math.sin(dLon/2) * Math.sin(dLon/2);

			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var distance = (R * c).toFixed(1); //Km
							
			  switch (true) {
				case (data[i].freeParkingNumber>=30):
					var color = greenIcon;

					break;
				case (data[i].freeParkingNumber<30 && data[i].freeParkingNumber>=10):
						var color = orangeIcon;
					break;
				case (data[i].freeParkingNumber<10):
						var color = redIcon;
					break;
				break;
			  }

			  var popupContent = "<a href='parking.html#"+data[i].idParking+"' class='map-popup'><h4>"+data[i].name+" ("+data[i].freeParkingNumber+"/"+data[i].totalParkingNumber+")</h4><p>"+data[i].address+" - "+distance+"Km   <i class='fa fa-angle-right'></i></p></a>"

			  parkingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)],{icon: color})
			  .bindPopup(popupContent, {closeButton: false}))
			  //.bindLabel(data[i].name, { noHide: true, direction: 'auto'}));
			}

			map.addLayer(parkingMarkers);
		});
		
		bikesharingList(function(data){
			
			var userLatitude = localStorage.getItem("userLatitude");
			var userLongitude = localStorage.getItem("userLongitude");
		
			var bikeIcon = L.icon({
				iconUrl: 'img/bicycle.png',
				iconSize:     [32, 37], // size of the icon
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});

			for(var i=0;i<data.length;i++){
				
			  var R = 6371; // km
			  var dLat = (data[i].latitude-userLatitude) * Math.PI / 180;
			  var dLon = (data[i].longitude-userLongitude) * Math.PI / 180;

			  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data[i].latitude * Math.PI / 180 ) *
				Math.sin(dLon/2) * Math.sin(dLon/2);

			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var distance = (R * c).toFixed(1); //Km

			  var popupContent = "<a href='bikesharing.html#"+data[i].idBikesharing+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+distance+"Km   <i class='fa fa-angle-right'></i></p></a>";
					  
			  bikesharingMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: bikeIcon})
				.bindPopup(popupContent, {closeButton: false}))
			  //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

			}

			map.addLayer(bikesharingMarkers);
		
		});
		
		cityshuttleList(function(data){
			
			var userLatitude = localStorage.getItem("userLatitude");
			var userLongitude = localStorage.getItem("userLongitude");
		
			var busIcon = L.icon({
				iconUrl: 'img/bus.png',
				iconSize:     [32, 37], // size of the icon
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});

			for(var i=0;i<data.length;i++){
				
			  var R = 6371; // km
			  var dLat = (data[i].latitude-userLatitude) * Math.PI / 180;
			  var dLon = (data[i].longitude-userLongitude) * Math.PI / 180;

			  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(data[i].latitude * Math.PI / 180 ) *
				Math.sin(dLon/2) * Math.sin(dLon/2);

			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var distance = (R * c).toFixed(1); //Km

			  var popupContent = "<a href='cityshuttle.html#"+data[i].idCityshuttle+"' class='map-popup'><h4>"+data[i].name+"</h4><p>"+data[i].address+" - "+distance+"Km   <i class='fa fa-angle-right'></i></p></a>";
					  
			  cityshuttleMarkers.addLayer(L.marker([parseFloat(data[i].latitude), parseFloat(data[i].longitude)], {icon: busIcon})
				.bindPopup(popupContent, {closeButton: false}))
			  //  .bindLabel(data[i].name, { noHide: true, direction: 'auto'}));

			}

			map.addLayer(bikesharingMarkers);
		
		});
	
	}; // end of onSuccess
	
	$( ".parking" ).click(function() {
	  if($( this ).toggleClass( "parking-active").hasClass('parking-active')){
		map.addLayer(parkingMarkers); 
	  }
	  else{
		map.removeLayer(parkingMarkers);  
	  }
	});
	
	$( ".bikesharing" ).click(function() {
	   if($( this ).toggleClass( "bike-active" ).hasClass('bike-active')){
		map.addLayer(bikesharingMarkers); 
	  }
	  else{
		map.removeLayer(bikesharingMarkers);  
	  }
	});
	
	$( ".cityshuttle" ).click(function() {
	  if($( this ).toggleClass( "cityshuttle-active" ).hasClass('cityshuttle-active')){
		map.addLayer(cityshuttleMarkers); 
	  }
	  else{
		map.removeLayer(cityshuttleMarkers);  
	  }
	});
	
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
	
} //DEVICE READY

//})	

	
