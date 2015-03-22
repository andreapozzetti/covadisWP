'use strict';
/* Services */
angular.module('Service', [])

.service('goBack', function () {
  
  var property = false;

  return {
            getProperty: function () {
            return property;
          },
            setProperty: function(value) {
                property = value;
          }
        };
})

.factory('geolocation', function($rootScope, $q) {
  return {
    getPosition: function (options) {

      var deferred;
      deferred = $q.defer();

      navigator.geolocation.watchPosition(function (position) {
        return deferred.resolve(position); 
      },
      function (error) {
        return deferred.resolve(error); 
      },
      { maximumAge: 30000, timeout: 30000, enableHighAccuracy: true });

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
    saveregId: function (regId, Userdevice, idParking, parkingName, alertTime, userLanguage) {
      var deferred;
      deferred = $q.defer();
      return $http.post('http://131.175.59.106:3210/api/users', {"regId": regId, "device": Userdevice, "userLanguage": userLanguage, "idParking": idParking, "parkingName": parkingName, "alertTime": alertTime})
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

    var query;
    return query = {

    checkInstallation : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
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

    install: function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS parking (idParking INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, totalParkingNumber INTEGER, freeParking INTEGER, minPrice INTEGER, maxPrice INTEGER, timetable TEXT, description_it TEXT, description_en TEXT, img TEXT, userDistance REAL, lastUpdate INTEGER)');
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

    getData: function() {

      var deferred = $q.defer();

      return $http.get('http://131.175.59.106:3210/api/parking')
        .success(function(data) {
          var idParkingArray = [];

          for(var i=0;i<data.length;i++){
            idParkingArray.push(data[i].idParking);
            query.setupParking(data[i])
          }
          query.checkToRemove(idParkingArray);
          return deferred.resolve(true);
        })
        .error(function(msg) {
          console.log("error get parking data");
          return deferred.resolve(false);
        })
        return deferred.promise;
    },

    arrayContains: function(array, value) {
      return array.indexOf(value) > -1;
    },

    setupParking: function(data) {

      var deferred = $q.defer();
      
      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS parking (idParking INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, totalParkingNumber INTEGER, freeParking INTEGER, minPrice INTEGER, maxPrice INTEGER, timetable TEXT, description_it TEXT, description_en TEXT, img TEXT, userDistance REAL, lastUpdate INTEGER)');
        tx.executeSql('SELECT * FROM parking WHERE idParking = '+ data.idParking +'', [], function (tx, results) {
          if(results.rows.length == 0){
            query.insertParking(data);
            return deferred.resolve(true);
          }
          else{
            if(results.rows.item(0).lastUpdate < data.lastUpdate){
              query.updateParking(data);
              return deferred.resolve(true);
            }
            else{
              console.log("parking db already updated");
            }
          }
        });
      });
      return deferred.promise;
    },

    checkToRemove: function(newIdArray) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('SELECT * FROM parking', [], function (tx, results) {
          var length = results.rows.length;
          var oldIdArray = [];

          for(var i=0;i<length;i++){
            oldIdArray.push(results.rows.item(i).idParking);
          }

          for(var r=0;r<oldIdArray.length;r++){
            var test = query.arrayContains(newIdArray, oldIdArray[r]);
            if(test != true){
              console.log("Parking "+ oldIdArray[r] + " to remove");
              query.deleteParking(oldIdArray[r]);
            }     
          }

        });
      });

      return false;
    },

    insertParking: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        
        return tx.executeSql("INSERT INTO parking (idParking, name, address, latitude, longitude, totalParkingNumber, freeParking, minPrice, maxPrice, timetable, description_it, description_en, img, userDistance, lastUpdate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            [data.idParking, data.name, data.address, data.latitude, data.longitude, data.totalParkingNumber, data.freeParkingNumber, data.minPrice, data.maxPrice, JSON.stringify(data.timetable), data.description_it, data.description_en, data.img, 0.0, data.lastUpdate], function(tx, res) {
                              return true;
                            });
      });
      return false;
    },

    updateParking: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('UPDATE parking SET idParking=?, name=?, address=?, latitude=?, longitude=?, totalParkingNumber=?, minPrice=?, maxPrice=?, timetable=?, description_it=?, description_en=?, img=?, lastUpdate=? WHERE idParking=?', [data.idParking, data.name, data.address, data.latitude, data.longitude, data.totalParkingNumber, data.minPrice, data.maxPrice, JSON.stringify(data.timetable), data.description_it, data.description_en, data.img, data.lastUpdate, data.idParking], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    deleteParking: function(idParking) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('DELETE FROM parking WHERE idParking = '+ idParking +' ', [], function(tx, res) {
          return true;
        });
      });

      return false;
    },

    distance: function(userLatitude, userLongitude){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

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
      var distance = (R * c).toFixed(1); //kilometers

      return distance;

    },

    updateParkingDistance: function(idParking, distance) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        
        return tx.executeSql('UPDATE parking SET userDistance=? WHERE idParking=?', [distance, idParking], function(tx, res) {
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
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('UPDATE parking SET freeParking=? WHERE idParking=?', [freeParking, idParking], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    getAllParking: function(){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

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
                            timetable: results.rows.item(i).timetable,
                            description_it: results.rows.item(i).description_it,
                            description_en: results.rows.item(i).description_en,
                            userDistance: results.rows.item(i).userDistance,
                            img: results.rows.item(i).img
                });
                
              }
             
              deferred.resolve(data);
          }, 
          function(e) {
              console.log(e);
          });
        });
      return deferred.promise;
    },

    getParking: function(idParking){

      var data = {};
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM parking WHERE idParking = '+ idParking +'', [], function (tx, results) {
              
                data = { 
                        idParking : results.rows.item(0).idParking,
                        name : results.rows.item(0).name,
                        address : results.rows.item(0).address,
                        latitude : results.rows.item(0).latitude,
                        longitude: results.rows.item(0).longitude,
                        totalParkingNumber: results.rows.item(0).totalParkingNumber,
                        freeParking: results.rows.item(0).freeParking,
                        minPrice: results.rows.item(0).minPrice,
                        maxPrice: results.rows.item(0).maxPrice,
                        timetable: results.rows.item(0).timetable,
                        description_it: results.rows.item(0).description_it,
                        description_en: results.rows.item(0).description_en,
                        userDistance: results.rows.item(0).userDistance,
                        img: results.rows.item(0).img
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

.factory('bikesharing', function($document, $window, $rootScope, $http, $log, $q) {

    var query;
    return query = {

    checkInstallation : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE name='bikesharing' and type='table'", [], function(tx, res) {
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

    install: function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS bikesharing (idBikesharing INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, img TEXT, description_it TEXT, description_en TEXT, userDistance REAL, lastUpdate INTEGER)');
        tx.executeSql("SELECT * FROM bikesharing", [], function(tx, res) {
          if (res.rows.length == 0) {
            return $http.get('http://131.175.59.106:3210/api/bikesharing')
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

    getData: function() {

      var deferred = $q.defer();

      return $http.get('http://131.175.59.106:3210/api/bikesharing')
        .success(function(data) {
          var idBikesharingArray = [];

            for(var i=0;i<data.length;i++){
              idBikesharingArray.push(data[i].idBikesharing);
              query.setupBikesharing(data[i])
            }
            query.checkToRemove(idBikesharingArray);
            return deferred.resolve(true);
        })
        .error(function(msg) {
          console.log("error get bikesharing data");
          return deferred.resolve(false);
        })
      return deferred.promise;
    },

    setupBikesharing: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      var lastUpdate = new Date().getTime();
      
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS bikesharing (idBikesharing INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, img TEXT, description_it TEXT, description_en TEXT, userDistance REAL, lastUpdate INTEGER)');
        tx.executeSql('SELECT * FROM bikesharing WHERE idBikesharing = '+ data.idBikesharing +'', [], function (tx, results) {
          if(results.rows.length == 0){
            query.insertBikesharing(data,lastUpdate);
          }
          else{
            if(results.rows.item(0).lastUpdate < data.lastUpdate){
              query.updateBikesharing(data);
            }
            else{
              console.log("bikesharing db already updated");
            }
          }
        });
      });
      return false;
    },

    checkToRemove: function(newIdArray) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('SELECT * FROM bikesharing', [], function (tx, results) {
          var length = results.rows.length;
          var oldIdArray = [];

          for(var i=0;i<length;i++){
            oldIdArray.push(results.rows.item(i).idBikesharing);
          }

          for(var r=0;r<oldIdArray.length;r++){
            var test = query.arrayContains(newIdArray, oldIdArray[r]);
            if(test != true){
              console.log("Bikesharing "+ oldIdArray[r] + " to remove");
              query.deleteBikesharing(oldIdArray[r]);
            }     
          }

        });
      });

      return false;
    },

    arrayContains: function(array, value) {
      return array.indexOf(value) > -1;
    },

    insertBikesharing: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        
        return tx.executeSql("INSERT INTO bikesharing (idBikesharing, name, address, latitude, longitude, img, description_it, description_en, userDistance, lastUpdate) VALUES (?,?,?,?,?,?,?,?,?,?)",
                            [data.idBikesharing, data.name, data.address, data.latitude, data.longitude, data.img, data.description_it, data.description_en, 0.0, data.lastUpdate], function(tx, res) {
                              return true;
                            });
      });
      return false;
    },

    updateBikesharing: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('UPDATE bikesharing SET idBikesharing=?, name=?, address=?, latitude=?, longitude=?, description_it=?, description_en=?, img=?, lastUpdate=? WHERE idBikesharing=?', [data.idBikesharing, data.name, data.address, data.latitude, data.longitude, data.description_it, data.description_en, data.img, data.lastUpdate, data.idBikesharing], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    deleteBikesharing: function(idBikesharing) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('DELETE FROM bikesharing WHERE idBikesharing = '+ idBikesharing +' ', [], function(tx, res) {
          return true;
        });
      });

      return false;
    },

    distance: function(userLatitude, userLongitude){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          
          return tx.executeSql('SELECT * FROM bikesharing', [], function (tx, results) {
              var len = results.rows.length, i;
              for (i = 0; i < len; i++){

                var distance = query.calculateDistance(userLatitude, userLongitude, results.rows.item(i).latitude, results.rows.item(i).longitude);
                var idBikesharing = results.rows.item(i).idBikesharing;

                query.updateBikesharingDistance(idBikesharing, distance);
              
              }
              return deferred.resolve(true);
          }, 
          function(e) {
              console.log("ERROR:" + e.message);
          });
        });
      return deferred.promise;
    },

    calculateDistance: function(userLatitude, userLongitude, bikesharingLatitude, bikesharingLongitude){

      var R = 6371; // km

      var dLat = (bikesharingLatitude-userLatitude) * Math.PI / 180;
      var dLon = (bikesharingLongitude-userLongitude) * Math.PI / 180;

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(bikesharingLatitude * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distance = (R * c).toFixed(1); //kilometers

      return distance;

    },

    updateBikesharingDistance: function(idBikesharing, distance) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        
        return tx.executeSql('UPDATE bikesharing SET userDistance=? WHERE idBikesharing=?', [distance, idBikesharing], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    getAllBikesharing: function(){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM bikesharing', [], function (tx, results) {
              var len = results.rows.length, i;
              
              for (i = 0; i < len; i++){
              
                data.push({ idBikesharing : results.rows.item(i).idBikesharing,
                            name : results.rows.item(i).name,
                            address : results.rows.item(i).address,
                            latitude : results.rows.item(i).latitude,
                            longitude: results.rows.item(i).longitude,
                            description_it: results.rows.item(i).description_it,
                            description_en: results.rows.item(i).description_en,
                            userDistance: results.rows.item(i).userDistance,
                            img: results.rows.item(i).img
                });
                
              }
             
              deferred.resolve(data);
          }, 
          function(e) {
              console.log(e);
          });
        });
      return deferred.promise;
    },

    getBikesharing: function(idBikesharing){

      var data = {};
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM bikesharing WHERE idBikesharing = '+ idBikesharing +'', [], function (tx, results) {
              
                data = { 
                        idBikesharing : results.rows.item(0).idBikesharing,
                        name : results.rows.item(0).name,
                        address : results.rows.item(0).address,
                        latitude : results.rows.item(0).latitude,
                        longitude: results.rows.item(0).longitude,
                        timetable: results.rows.item(0).timetable,
                        description_it: results.rows.item(0).description_it,
                        description_en: results.rows.item(0).description_en,
                        userDistance: results.rows.item(0).userDistance,
                        img: results.rows.item(0).img
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

.factory('cityshuttle', function($document, $window, $rootScope, $http, $log, $q) {

    var query;
    return query = {

    checkInstallation : function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE name='cityshuttle' and type='table'", [], function(tx, res) {
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

    install: function() {

      var deferred;
      deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS cityshuttle (idCityshuttle INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, img TEXT, description_it TEXT, description_en TEXT, userDistance REAL, lastUpdate INTEGER)');
        tx.executeSql("SELECT * FROM cityshuttle", [], function(tx, res) {
          if (res.rows.length == 0) {
            return $http.get('http://131.175.59.106:3210/api/cityshuttle')
                        .success(function(data) {
                          for(var i=0; i<data.length;i++){
                            query.insertCityshuttle(data[i]);
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

    getData: function() {

      var deferred = $q.defer();

      return $http.get('http://131.175.59.106:3210/api/cityshuttle')
        .success(function(data) {
          var idCityshuttleArray = [];
            for(var i=0;i<data.length;i++){
              idCityshuttleArray.push(data[i].idCityshuttle);
              query.setupCityshuttle(data[i])
            }
            query.checkToRemove(idCityshuttleArray);
            return deferred.resolve(true);
        })
        .error(function(msg) {
          console.log("error get cityshuttle data");
          return deferred.resolve(false);
        })
      return deferred.promise;
    },

    setupCityshuttle: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS cityshuttle (idCityshuttle INTEGER, name TEXT, address TEXT, latitude TEXT, longitude TEXT, img TEXT, description_it TEXT, description_en TEXT, userDistance REAL, lastUpdate INTEGER)');
        tx.executeSql('SELECT * FROM cityshuttle WHERE idCityshuttle = '+ data.idCityshuttle +'', [], function (tx, results) {
          if(results.rows.length == 0){
            query.insertCityshuttle(data);
          }
          else{
            if(results.rows.item(0).lastUpdate < data.lastUpdate){
              query.updateCityshuttle(data);
            }
            else{
              console.log("cityshuttle db already updated");
            }
          }
        });
      });

      return false;
    },

    checkToRemove: function(newIdArray) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('SELECT * FROM cityshuttle', [], function (tx, results) {
          var length = results.rows.length;
          var oldIdArray = [];

          for(var i=0;i<length;i++){
            oldIdArray.push(results.rows.item(i).idCityshuttle);
          }

          for(var r=0;r<oldIdArray.length;r++){
            var test = query.arrayContains(newIdArray, oldIdArray[r]);
            if(test != true){
              console.log("Cityshuttle "+ oldIdArray[r] + " to remove");
              query.deleteCityshuttle(oldIdArray[r]);
            }     
          }

        });
      });

      return false;
    },

    arrayContains: function(array, value) {
      return array.indexOf(value) > -1;
    },

    insertCityshuttle: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO cityshuttle (idCityshuttle, name, address, latitude, longitude, img, description_it, description_en, userDistance, lastUpdate) VALUES (?,?,?,?,?,?,?,?,?,?)",
                            [data.idCityshuttle, data.name, data.address, data.latitude, data.longitude, data.img, data.description_it, data.description_en, 0.0, data.lastUpdate], function(tx, res) {
                              return true;
                            });
      });
      return false;
    },

    updateCityshuttle: function(data) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('UPDATE cityshuttle SET idCityshuttle=?, name=?, address=?, latitude=?, longitude=?, description_it=?, description_en=?, img=?, lastUpdate=? WHERE idCityshuttle=?', [data.idCityshuttle, data.name, data.address, data.latitude, data.longitude, data.description_it, data.description_en, data.img, data.lastUpdate, data.idCityshuttle], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    deleteCityshuttle: function(idCityshuttle) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        return tx.executeSql('DELETE FROM cityshuttle WHERE idCityshuttle = '+ idCityshuttle +' ', [], function(tx, res) {
          return true;
        });
      });

      return false;
    },

    distance: function(userLatitude, userLongitude){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          
          return tx.executeSql('SELECT * FROM cityshuttle', [], function (tx, results) {
              var len = results.rows.length, i;
              for (i = 0; i < len; i++){

                var distance = query.calculateDistance(userLatitude, userLongitude, results.rows.item(i).latitude, results.rows.item(i).longitude);
                var idCityshuttle = results.rows.item(i).idCityshuttle;

                query.updateCityshuttleDistance(idCityshuttle, distance);
              
              }
              return deferred.resolve(true);
          }, 
          function(e) {
              console.log("ERROR:" + e.message);
          });
        });
      return deferred.promise;
    },

    calculateDistance: function(userLatitude, userLongitude, cityshuttleLatitude, cityshuttleLongitude){

      var R = 6371; // km

      var dLat = (cityshuttleLatitude-userLatitude) * Math.PI / 180;
      var dLon = (cityshuttleLongitude-userLongitude) * Math.PI / 180;

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLatitude * Math.PI / 180 ) * Math.cos(cityshuttleLatitude * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distance = (R * c).toFixed(1); //kilometers

      return distance;

    },

    updateCityshuttleDistance: function(idCityshuttle, distance) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});
      
      db.transaction(function(tx) {
        
        return tx.executeSql('UPDATE cityshuttle SET userDistance=? WHERE idCityshuttle=?', [distance, idCityshuttle], function(tx, res) {
                              return true;
                            });
      });

      return false;
    },

    getAllCityshuttle: function(){

      var data = [];
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM cityshuttle', [], function (tx, results) {
              var len = results.rows.length, i;
              
              for (i = 0; i < len; i++){
              
                data.push({ idCityshuttle : results.rows.item(i).idCityshuttle,
                            name : results.rows.item(i).name,
                            address : results.rows.item(i).address,
                            latitude : results.rows.item(i).latitude,
                            longitude: results.rows.item(i).longitude,
                            description_it: results.rows.item(i).description_it,
                            description_en: results.rows.item(i).description_en,
                            userDistance: results.rows.item(i).userDistance,
                            img: results.rows.item(i).img
                });
                
              }
             
              deferred.resolve(data);
          }, 
          function(e) {
              console.log(e);
          });
        });
      return deferred.promise;
    },

    getCityshuttle: function(idCityshuttle){

      var data = {};
      var deferred = $q.defer();

      var dbSize = 5 * 1024 * 1024; // 5MB
      //var db = openDatabase('coVadis', '1.0', 'Park List', dbSize);
	  var db = window.sqlitePlugin.openDatabase({name: "coVadis.db", location: 1});

        db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM cityshuttle WHERE idCityshuttle = '+ idCityshuttle +'', [], function (tx, results) {
              
                data = { 
                        idCityshuttle : results.rows.item(0).idCityshuttle,
                        name : results.rows.item(0).name,
                        address : results.rows.item(0).address,
                        latitude : results.rows.item(0).latitude,
                        longitude: results.rows.item(0).longitude,
                        timetable: results.rows.item(0).timetable,
                        description_it: results.rows.item(0).description_it,
                        description_en: results.rows.item(0).description_en,
                        userDistance: results.rows.item(0).userDistance,
                        img: results.rows.item(0).img
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