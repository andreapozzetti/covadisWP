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

navigator.globalization.getPreferredLanguage(
    function (lng) {
		var lang = lng.value;
		var langCode = lang.substring(0,2);
		
		localStorage.setItem("userLanguage", langCode);

		if (langs.indexOf(langCode) > (-1)){
			var data = {
							"map" : "Mappa",
							"parking" : "Parcheggi",
							"bus-timetable" : "Orari Bus",
							"boat-timetable" : "Orari Battelli",
							"go-to-parking" : "Portami al parcheggio",
							"go-to-bikesharing" : "Portami alla stazione bikesharing",
							"go-to-cityshuttle" : "Portami alla stazione cityshuttle",
							"order-by-distance" : "Ordina per distanza",
							"order-by-name" : "Ordina per nome",
							"order-by-freeparking" : "Ordina per posti liberi",
							"timetable" : "Orari",
							"cost-per-hour" : "Costi orari",
							"monday" : "Lunedi",
							"tuesday" : "Martedi",
							"wednesday" : "Mercoledi",
							"thursday" : "Giovedi",
							"friday" : "Venerdi",
							"saturday" : "Sabato",
							"sunday" : "Domenica",
							"alert-15": "Avvisami se i posti liberi diventano meno di 5 nei prossimi 15 minuti",
							"alert-30": "Avvisami se i posti liberi diventano meno di 5 nei prossimi 30 minuti"
						}
			translate(data);
		}
		else{
			var data = {
							"map" : "Map",
							"parking" : "Parking",
							"bus-timetable" : "Bus Timetable",
							"boat-timetable" : "Boat Timetable",
							"order-by-distance" : "Order by distance",
							"order-by-name" : "Order by name",
							"order-by-freeparking" : "Order by free parking",
							"timetable" : "Timetable",
							"cost-per-hour" : "Cost per hour",
							"monday" : "monday",
							"tuesday" : "tuesday",
							"wednesday" : "wednesday",
							"thursday" : "thursday",
							"friday" : "friday",
							"saturday" : "saturday",
							"sunday" : "sunday",
							"alert-15": "ALERT me if number of free parking became less than 5 in the next 15 minutes",
							"alert-30": "ALERT me if number of free parking became less than 5 in the next 30 minutes"
						}
			translate(data);
		}
	},
    function () {alert('Error getting language\n');}
);



} //end of deviceReady

//});



