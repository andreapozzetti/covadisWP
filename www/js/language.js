//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
var langs = ['en', 'it'];
var langCode = '';
var langJS = null;


function translate(jsdata)
{	
	$("[tkey]").each (function (index)
	{
		var strTr = jsdata [$(this).attr ('tkey')];
	    $(this).html (strTr);
	});
}


langCode = navigator.language.substr (0, 2);

if (langs.indexOf(langCode) > (-1)){
	var data = {
					"map" : "Mappa",
					"parking" : "Parcheggi",
					"bus-timetable" : "Orari Bus",
					"boat-timetable" : "Orari Battelli"
				}
	translate(data);
}
else{
	var data = {
					"map" : "Map",
					"parking" : "Parking",
					"bus-timetable" : "Bus Timetable",
					"boat-timetable" : "Boat Timetable"
				}
	translate(data);
}

} //end of deviceReady

//});



