(function () {
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src', 'js/lib/winstore-jscompat.js');
    if (document.body) {
    	document.body.appendChild(scriptElem);
    } else {
    	document.head.appendChild(scriptElem);
    }
}());