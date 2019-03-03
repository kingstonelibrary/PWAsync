var dbName = 'PWADB';
// var dbVersion = '1.0.0'
var storeName  = 'PWAdata';
var data = {id : 'sync-test', name : 'testData'};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
    navigator.serviceWorker.ready
             .then((registration) => {
                document.getElementById('button').addEventListener('click', () => {

                    var openReq  = indexedDB.open(dbName);   //　DB名を指定して接続。DBがなければ新規作成される。

                    openReq.onupgradeneeded = function(event){          //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
                        console.log('db upgrade');                      // オブジェクトストア(TABLE)の作成、削除はDBの更新時に実行されるonupgradeneededの中でしかできない。
                        var db = event.target.result;
                        db.createObjectStore(storeName, {keyPath : 'id'})
                    }
                    openReq.onsuccess = function(event){                //onupgradeneededの後に実行。更新がない場合はこれだけ実行
                        console.log('db open success');
                        var db = event.target.result;
                        var trans = db.transaction(storeName, 'readwrite');
                        var store = trans.objectStore(storeName);
                        var putReq = store.put(data);
                        putReq.onsuccess = function(){
                        console.log('put data success');
                        }
                        trans.oncomplete = function(){                  // トランザクション完了時(putReq.onsuccessの後)に実行
                        console.log('transaction complete');
                        }
                        db.close();                                     // 接続を解除する
                    }
                    openReq.onerror = function(event){
                    console.log('db open error');
                    }

                    registration.sync.register('sync-test')            // 引数にはタグ名を設定（このタグ名を IndexedDB に保存するキーとかにしておくといい）    
                        .then(() => {
                            console.log('sync registerd');
                        })
                        .catch(console.error.bind(console));
                 }, false);
             })
             .catch(console.error.bind(console));                       // ここまでがデータ登録

    let getBtn = document.getElementById('retrieve');
    let area = document.getElementsByClassName('res');
    getBtn.addEventListener('click',function(){
        var keyValue = data.id;
        var openReq = indexedDB.open(dbName);
        openReq.onsuccess = function(event){
        var db = event.target.result;
        var trans = db.transaction(storeName, 'readonly');
        var store = trans.objectStore(storeName);
        var getReq = store.get(keyValue);
    
        getReq.onsuccess = function(event){
            // alert("id:" + event.target.result.id + "&name:" +  event.target.result.name)
            area[0].innerHTML = "id:" + event.target.result.id + "&name:" +  event.target.result.name; // {id : 'A1', name : 'test'}
        }
        }
    })
}

