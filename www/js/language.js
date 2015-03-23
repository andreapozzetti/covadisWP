//$(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
var langs = ['en', 'it'];
var langCode = '';
var langJS = null;


var translate = function (jsdata)
{	
	$("[tkey]").each (function (index)
	{
		var strTr = jsdata [$(this).attr ('tkey')];
	    $(this).html (strTr);
	});
}


langCode = navigator.language.substr (0, 2);

console.log(langCode);

if (langs.indexOf(langCode) > (-1)){
	$.getJSON('js/lang/'+langCode+'.json', translate);
}
else{
	$.getJSON('js/lang/en.json', translate);
}

} //end of deviceReady

});



