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


langCode = "it";

navigator.globalization.getPreferredLanguage(
    function (language) {
		$( ".parking" ).html( language );
	},
    function () {alert('Error getting language\n');}
);

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
					"map" : "Test",
					"parking" : "Parking",
					"bus-timetable" : "Bus Timetable",
					"boat-timetable" : "Boat Timetable"
				}
	translate(data);
}

} //end of deviceReady

//});



