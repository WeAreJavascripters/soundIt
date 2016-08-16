var leftBufferData;
var rightBufferData;
var encodedData;
var totalLength = 0;
var ports;
var count = 0;

var handlingFunctions = {
    'init': initialize,
    'store': storeData,
    'reset': resetData,
    'storeEncoded': storeEncodedData,
    'createAudio': createAudio,
    'log': log
};

self.onmessage = function(e){
    var command = e.data.command;
    handlingFunctions[command](e);
};

function initialize(event){
    resetData();
    ports = event.ports;
    setPortListener();
}

function setPortListener(){
    ports[0].start();
    ports[0].onmessage = function(e){
        var command = e.data.command || 'log';
        handlingFunctions[command](e);
    };
    ports[1].start();
    ports[1].onmessage = function(e){
        var command = e.data.command || 'log';
        handlingFunctions[command](e);
    };
}

function storeData(e){
    var data = e.data;
    leftBufferData.push(data.left);
    rightBufferData.push(data.right);
    totalLength += data.left.length;
    count++;
    ports[0].postMessage({
        command: 'encode',
        data: {
            left: data.left,
            right: data.right
        }
    });
}

function resetData(){
    leftBufferData = [];
    rightBufferData = [];
    encodedData = [];
    totalLength = 0;
}

function storeEncodedData(event){
    var encodedPiece = event.data.data;
    count--;
    for(var i = 0; i < encodedPiece.size; i++){
        encodedData.push(encodedPiece.data[i]);
    }
    console.log('stored: ', encodedPiece.size);
    if(count <= 0){
        console.log('finished!');
        ports[1].postMessage({
            command: 'finish'
        });  
    }
}

function createAudio(){
    var blob;
    
    createBlob();
    sendBlob();    
    
    function createBlob(){
        blob = new Blob([new Uint8Array(encodedData)], {type:"audio/mp3"});
    }
    
    function sendBlob(){
        ports[1].postMessage({
            command: 'displayAudio',
            blob: blob
        });  
    }
}

function log(e){
    console.log('storage: ', e);
}