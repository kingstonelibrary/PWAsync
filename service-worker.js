'use strict';

self.addEventListener('install', (event) => {
    console.info('install', event);
});

self.addEventListener('activate', (event) => {
    console.info('activate', event);
});

self.addEventListener('sync', (event) => {
    console.info('sync', event);
    var keyValue = 'A1';

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
