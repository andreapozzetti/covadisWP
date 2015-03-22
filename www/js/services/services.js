'use strict';
/* Services */
angular.module('Service', [])

.factory('geolocation', function($rootScope, $q) {
  return {
    getPosition: function (options) {

      var deferred;
      deferred = $q.defer();

      navigator.geolocation.getCurrentPosition(function (position) {
        return deferred.resolve(position); 
      },
      function (error) {
        return deferred.resolve(error); 
      },
      { maximumAge: 30000, timeout: 30000, enableHighAccuracy: false });

    return deferred.promise;
    }
  };
})

.factory('androidNavigate', function ($rootScope) {
  return {
    startNavigator: function (coordinates) {

      navigator.google_navigate.navigate(coordinates, function() {
          var that = this, args = arguments;
          $rootScope.$apply(function () {
            granted.apply(that, args);
          });
      }, function(errMsg) {
          var that = this, args = arguments;
          $rootScope.$apply(function () {
            granted.apply(that, args);
          });
      });
      
    }
  };
})

.factory('push', function($document, $window, $rootScope, $http, $log, $q) {
  return {

    saveregId: function (regId, Userdevice, idParking, parkingName) {

      var deferred;
      deferred = $q.defer();
      
      return $http.post('http://131.175.59.106:3210/api/users', {"regId": regId, "device": Userdevice, "idParking": idParking, "parkingName": parkingName, "time": new Date().getTime()})
              
              .success(function(data) {
              
                return deferred.resolve(data);
            
              })
              .error(function(msg) {
            
                return deferred.resolve(msg);
            
              });
      
    return deferred.promise;

    }

  };
})

.factory('parking', function($document, $window, $rootScope, $http, $log, $q) {
  return {
   list : function() {
     var deferred = $q.defer();
		$http.get('http://131.175.59.106:3210/api/parking')
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
     return deferred.promise;
   }
  }
 })
 
 .factory('bikesharing', function($document, $window, $rootScope, $http, $log, $q) {
  return {
   list : function() {
     var deferred = $q.defer();
		$http.get('http://131.175.59.106:3210/api/bikesharing')
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
     return deferred.promise;
   }
  }
 })
 
 .factory('cityshuttle', function($document, $window, $rootScope, $http, $log, $q) {
  return {
   list : function() {
     var deferred = $q.defer();
		$http.get('http://131.175.59.106:3210/api/cityshuttle')
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
     return deferred.promise;
   }
  }
 })

/*
.factory('parking', function($document, $window, $rootScope, $http, $log, $q) {

    var query;
    return query = {

    setupDB : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS parking (idParking INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, totalParkingNumber INTEGER, freeParking INTEGER, minPrice INTEGER, maxPrice INTEGER, userDistance REAL, lastBasicInfoUpdate INTEGER, lastUpdate INTEGER)');

        tx.executeSql("SELECT * FROM parking", [], function(tx, res) {
		  
		      if (res.rows.length == 0) {

            return $http.get('http://131.175.59.106:3210/api/parking')
            
            .success(function(data) {
              
              for(var i=0; i<data.length;i++){
                query.insertParking(data[i]);
              }
              return deferred.resolve(true);
            
            })
            .error(function(msg) {
            
              return deferred.resolve(false);
            
            });

          }

          else{

            return deferred.resolve(true);
          
          }
        });
      });

      return deferred.promise;
    
    },

    checkDB : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        tx.executeSql("SELECT name FROM sqlite_master WHERE name='parking' and type='table'", [], function(tx, res) {

          if (res.rows.length > 0) {
            
            return deferred.resolve(true);
            
          }
          else{

            return deferred.resolve(false);
          
          }
        });
      });

      return deferred.promise;
    
    },

    insertParking: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        return tx.executeSql("INSERT INTO parking (idParking, name, address, latitude, longitude, totalParkingNumber, freeParking, minPrice, maxPrice, userDistance, lastBasicInfoUpdate, lastUpdate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                            [data.idParking, data.name, data.address, data.latitude, data.longitude, data.totalParkingNumber, data.freeParkingNumber, data.minPrice, data.maxPrice, 0.0,new Date().getTime(), new Date().getTime()], function(tx, res) {
                              return true;
                            });
      });
      return false;
    },

    distance: function(userLatitude, userLongitude){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);

        db.transaction(function (tx) {
          
          return tx.executeSql('SELECT * FROM parking', [], function (tx, results) {
              var len = results.rows.length, i;
              for (i = 0; i < len; i++){

                var distance = query.calculateDistance(userLatitude, userLongitude, results.rows.item(i).latitude, results.rows.item(i).longitude);
                var idParking = results.rows.item(i).idParking;

                query.updateParkingDistance(idParking, distance);
              
              }
              return deferred.resolve(true);
          }, 
          function(e) {
              console.log("ERROR:" + e.message);
          });
        });
      return deferred.promise;
    },

    calculateDistance: function(userLatitude, userLongitude, parkingLatitude, parkingLongitude){

      var R = 6371; // km

      var dLat = (parkingLatitude-userLatitude) * Math.PI / 180;
      var dLon = (parkingLongitude-userLongitude) * Math.PI / 180;

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(parkingLatitude * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distance = (R * c * 1000).toFixed(1); //meters

      
      return distance;

    },

    updateParkingDistance: function(idParking, distance) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        return tx.executeSql('UPDATE parking SET userDistance=?, lastUpdate=? WHERE idParking=?', [distance, new Date().getTime(), idParking], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    getFreeParking: function(){

     var deferred = $q.defer();
     return $http.get('http://131.175.59.106:3210/api/freeparking')
       .success(function(data) {
          for (var i = 0; i < data.length; i++){
            var idParking = parseInt(data[i].idParking);
            var numberOfFreeParking = parseInt(data[i].freeParkingNumber);
            query.updateFreeParkingDB(idParking,numberOfFreeParking);
          }
            return deferred.resolve(true);
       }).error(function(msg, code) {
          return deferred.resolve(false);
       });
     return deferred.promise;

    },

    updateFreeParkingDB: function(idParking, freeParking) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        return tx.executeSql('UPDATE parking SET freeParking=?, lastUpdate=? WHERE idParking=?', [freeParking, new Date().getTime(), idParking], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    getAllParking: function(){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM parking', [], function (tx, results) {
              var len = results.rows.length, i;
              for (i = 0; i < len; i++){
                data.push({ idParking : results.rows.item(i).idParking,
                            name : results.rows.item(i).name,
                            address : results.rows.item(i).address,
                            latitude : results.rows.item(i).latitude,
                            longitude: results.rows.item(i).longitude,
                            totalParkingNumber: results.rows.item(i).totalParkingNumber,
                            freeParking: results.rows.item(i).freeParking,
                            minPrice: results.rows.item(i).minPrice,
                            maxPrice: results.rows.item(i).maxPrice,
                            userDistance: results.rows.item(i).userDistance
                });
              }
              deferred.resolve(data);
          }, 
          function(e) {
              console.log("ERROR:" + e.message);
          });
        });
      return deferred.promise;
    },

    getParking: function(idParking){

      var data = {};
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM parking WHERE idParking = '+ idParking +'', [], function (tx, results) {
              
                data = { 
                        idParking : results.rows.item(0).idParking,
                        name : results.rows.item(0).name,
                        address : results.rows.item(0).address,
                        latitude : results.rows.item(0).latitude,
                        longitude: results.rows.item(0).longitude,
                        totalParkingNumber: results.rows.item(0).totalParkingNumber,
                        minPrice: results.rows.item(0).minPrice,
                        maxPrice: results.rows.item(0).maxPrice,
                        userDistance: results.rows.item(0).userDistance,
                }
              
              deferred.resolve(data);
          }, 
          function(e) {
              console.log("ERROR:" + e.message);
          });
        });
      return deferred.promise;
    }
    
  };
})
*/
/*
.factory('bikesharing', function($document, $window, $rootScope, $http, $log, $q) {

    var query;
    return query = {


    setupDB : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS bikesharing (idBikesharing INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, totalBikeNumber INTEGER, freeBikes INTEGER, lastUpdate INTEGER)');

        tx.executeSql("SELECT * FROM bikesharing", [], function(tx, res) {
      
          if (res.rows.length == 0) {

            return $http.get('http://www.andreapozzetti.eu/covadis/bikesharingList.json')
            
            .success(function(data) {
              
              for(var i=0; i<data.length;i++){
                query.insertBikesharing(data[i]);
              }
              return deferred.resolve(true);
            
            })
            .error(function(msg) {
            
              return deferred.resolve(false);
            
            });

          }

          else{

            return deferred.resolve(true);
          
          }
        });
      });

      return deferred.promise;
    
    },

    insertBikesharing: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
      
      db.transaction(function(tx) {
        
        return tx.executeSql("INSERT INTO bikesharing (idBikesharing, name, address, latitude, longitude, totalBikeNumber, freeBikes, lastUpdate) VALUES (?,?,?,?,?,?,?,?)",
                            [data.idBikesharing, data.name, data.address, data.latitude, data.longitude, data.totalBikeNumber, 0, new Date().getTime()], function(tx, res) {
                              return true;
                            });
      });
      return false;
    }

  };
})
*/

/*

.factory('indexedDB', function($document, $window, $rootScope, $http, $log, $q) {

  var factory;
  var setUp=false;
  var db;
  return factory = {

  init: function() {
    var deferred = $q.defer();

    if(setUp) {
      deferred.resolve(true);
      return deferred.promise;
    }
    
    var openRequest = window.indexedDB.open("coVadis",1);
  
    openRequest.onerror = function(e) {
      console.log("Error opening db");
      console.dir(e);
      deferred.reject(e.toString());
    };

    openRequest.onupgradeneeded = function(e) {
  
      var thisDb = e.target.result;
      var objectStore;
      
      //CREATE TABLE IF NOT EXIST
      if(!thisDb.objectStoreNames.contains("parking")) {
        objectStore = thisDb.createObjectStore("parking", { keyPath: "id", autoIncrement:true });
        //objectStore.createIndex("titlelc", "titlelc", { unique: false });
        //objectStore.createIndex("tags","tags", {unique:false,multiEntry:true});
      }
  
    };

    openRequest.onsuccess = function(e) {
      db = e.target.result;
      
      db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's
        // requests!
        deferred.reject("Database error: " + event.target.errorCode);
      };
      
      setUp=true;
      deferred.resolve(true);

    
    };  

    return deferred.promise;
  },

  setUp: function() {
    var deferred = $q.defer();
    
    factory.init().then(function() {

      var result;
      var handleResult = function(event) {

        result = event.target.result

      };  
      
      var transaction = db.transaction(["parking"], "readonly");

      var objectStore = transaction.objectStore("parking");
          objectStore.openCursor().onsuccess = handleResult;

      transaction.oncomplete = function(event) {
              deferred.resolve(result);

      }     
    
    });
    return deferred.promise;
  },

  setItems: function() {
    //Should this call init() too? maybe
    var deferred = $q.defer();
    
    factory.setUp().then(function(res) {

    if (res == null)
    {

    var transaction;
    var item;
    var i = 0;

      $http.get('http://www.andreapozzetti.eu/covadis/parkingList.json')
      .success(function(data) {

        transaction = db.transaction(["parking"], "readwrite");
        item = transaction.objectStore("parking");

        putNext(data);

        function putNext(data){
          if (i<data.length) {
            ++i;
            console.log(i);
            item.put({   
                      idParking : data[i-1].idParking,
                      name : data[i-1].name,
                      address : data[i-1].address,
                      latitude : data[i-1].latitude,
                      longitude: data[i-1].longitude,
                      totalParkingNumber : data[i-1].totalParkingNumber,
                      minPrice : data[i-1].minPrice,
                      maxPrice : data[i-1].maxPrice
                    }).onsuccess = putNext(data);
          } 
          else {   // complete
            console.log('populate complete');
              transaction.oncomplete = function(event) {
              factory.getAllParking().then(function(res){
                deferred.resolve(res);
              });
              
              };
          }

        }

      }).error(function(msg) {
        return deferred.resolve(false);
      });
    }
    else{
      
      factory.getAllParking().then(function(res){
        deferred.resolve(res);
      });

    }
    });
    return deferred.promise;
  },

  getAllParking: function() {
    var deferred = $q.defer();
    
    factory.init().then(function() {

      var result = [];

      var handleResult = function(event) {  
        var cursor = event.target.result;
        if (cursor) {
          result.push({
                        idParking:cursor.value.idParking,
                        name:cursor.value.name,
                        address:cursor.value.address,
                        latitude:cursor.value.latitude,
                        longitude:cursor.value.longitude,
                        totalParkingNumber:cursor.value.totalParkingNumber,
                        minPrice:cursor.value.minPrice,
                        maxPrice:cursor.value.maxPrice
                      });
          cursor.continue();
        }
      };  
      
      var transaction = db.transaction(["parking"], "readonly");  
      var objectStore = transaction.objectStore("parking");
            objectStore.openCursor().onsuccess = handleResult;

      transaction.oncomplete = function(event) {
        deferred.resolve(result);
      };
    
    });
    return deferred.promise;
  },

  isSupported: function() {
    return ("indexedDB" in window);   
  },
  
  deleteNote: function(key) {
    var deferred = $q.defer();
    var t = db.transaction(["note"], "readwrite");
    var request = t.objectStore("note").delete(key);
    t.oncomplete = function(event) {
      deferred.resolve();
    };
    return deferred.promise;
  },
  
  getNote: function(key) {

    var deferred = $q.defer();

    var transaction = db.transaction(["note"]);  
    var objectStore = transaction.objectStore("note");  
    var request = objectStore.get(key);  

    request.onsuccess = function(event) {  
      var note = request.result;
      deferred.resolve(note);
    }; 
    
    return deferred.promise;
  },
  
  getNotes: function() {
    var deferred = $q.defer();
    
    init().then(function() {

      var result = [];


      var handleResult = function(event) {  
        var cursor = event.target.result;
        if (cursor) {
          result.push({key:cursor.key, title:cursor.value.title, updated:cursor.value.updated});
          cursor.continue();
        }
      };  
      
      var transaction = db.transaction(["note"], "readonly");  
      var objectStore = transaction.objectStore("note");
            objectStore.openCursor().onsuccess = handleResult;

      transaction.oncomplete = function(event) {
        deferred.resolve(result);
      };
    
    });
    return deferred.promise;
  },
  
  ready: function() {
    return setUp;
  },
  
  saveNote: function(note) {
    //Should this call init() too? maybe
    var deferred = $q.defer();

    if(!note.id) note.id = "";
    
    var titlelc = note.title.toLowerCase();
    
    //handle tags
    var tags = [];
    if(note.tags && note.tags.length) tags = note.tags.split(",");
    
    var t = db.transaction(["note"], "readwrite");
    
        if(note.id === "") {
            t.objectStore("note")
                            .add({title:note.title,body:note.body,updated:new Date().getTime(),titlelc:titlelc,tags:tags});
        } else {
            t.objectStore("note")
                            .put({title:note.title,body:note.body,updated:new Date(),id:Number(note.id),titlelc:titlelc,tags:tags});
        }

    t.oncomplete = function(event) {
      deferred.resolve();
    };

    return deferred.promise;
  },
  
  supportsIDB: function() {
    return "indexedDB" in window; 
  }
  
  }

});


*/





