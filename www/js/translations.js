angular.module("gettext")
.run(['gettextCatalog', function (gettextCatalog) {
    gettextCatalog.setStrings('it', {
    	"Setup Completed":"Setup Completato",
    	"Test":"Prova"
    });

}]);