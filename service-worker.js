'use strict';

var dbName = 'PWADB';
// var dbVersion = '1.0.0'
var storeName  = 'PWAdata';

self.addEventListener('install', (event) => {
    console.info('install', event);
});

self.addEventListener('activate', (event) => {
    console.info('activate', event);
});

self.addEventListener('sync', (event) => {
    console.info('sync', event);
    var keyValue = 'sync-test';

    var openReq = indexedDB.open(dbName);
    
      openReq.onsuccess = function(event){
        var db = event.target.result;
        var trans = db.transaction(storeName, 'readonly');
        var store = trans.objectStore(storeName);
        var getReq = store.get(keyValue);
    
        getReq.onsuccess = function(event){
          console.log(event.target.result); // {id : 'A1', name : 'test'}
        }
      }
});
