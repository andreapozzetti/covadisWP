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
    function (lng) {
		var lang = lng.value;
		var langCode = lang.substring(0,2);

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
	},
    function () {alert('Error getting language\n');}
);



} //end of deviceReady

//});



