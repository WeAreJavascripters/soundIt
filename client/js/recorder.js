var storageWorkerPath = "./js/workers/dataStorageWorker.js"
var codecWorkerPath = "./js/workers/codecWorker.js"

var Recorder = function(stream){
    var audioContext;
    var mediaStream;
    var processor;
    var isRecording = false;
    var storageWorker;
    var codecWorker;
    var channel;
    var dataStorageChannel;
    var handlingFunctions = {
        'displayAudio': displayAudio,
        'finish': finish
    };

    initializeWorkers();
    initializeChannel();
    initializeBuffers();
    initializeAudioContext();
    createMediaStream();
    createProcessor();
    setProcessorEvent();
    initializeConnection();
    
    return {
        rec: startRecording,
        stop: stopRecording,
    };
    
    function initializeWorkers(){
        channel = new MessageChannel();
        dataStorageChannel = new MessageChannel();
        storageWorker = this.storageWorker = new Worker(storageWorkerPath);
        codecWorker = this.codecWorker = new Worker(codecWorkerPath);
        storageWorker.postMessage({command: 'init'}, [channel.port1, dataStorageChannel.port2]);
        codecWorker.postMessage({command: 'init'}, [channel.port2]);
    };
    
    function initializeChannel(){
        dataStorageChannel.port1.start();
        dataStorageChannel.port1.onmessage = function(e){
            var command = e.data.command || 'log';
            handlingFunctions[command](e);
        }
    };

    function initializeBuffers(){
        storageWorker.postMessage({
            command: 'reset'
        })
    };
    
    function initializeAudioContext(){
        audioContext = new AudioContext();
    };
    
    function createMediaStream(){
        mediaStream = audioContext.createMediaStreamSource(stream);
    };
    
    function createProcessor(){
        var creatingProcessorFunction = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
        processor = creatingProcessorFunction.call(audioContext, 4096, 2, 2);
    };
    
    function setProcessorEvent(){
        processor.onaudioprocess = function(e){
            storeAudioInfo(e);
        }
    };
        
    function storeAudioInfo(e){
        if(isRecording){
            var inputData = e.inputBuffer;
            var leftChannelData = inputData.getChannelData(0);
            var rightChannelData = inputData.getChannelData(1);
            storageWorker.postMessage({
                command: 'store',
                left: leftChannelData,
                right: rightChannelData
            });
        }
    }
    
    function initializeConnection(){
        mediaStream.connect(processor);
        processor.connect(audioContext.destination);
    };

    function startRecording(){
        initializeBuffers();
        isRecording = true;
    };
    
    function stopRecording(){
        isRecording = false;
        console.log("stop!");
    };
    
    function finish(){
        createBlob();
        alert("Done!");
    };
    
    function createBlob(){
        storageWorker.postMessage({
            command: 'createAudio'
        });
    };
    
    function displayAudio(e){
        var blob = e.data.blob;
        var url;
        var audioElement;
        var recorderContainer;
        var previousAudioElement;
        
        getRecorderContainer();
        getPreviousAudioElement();
        removePreviousAudio();
        createURL();
        createAudioElement();
        appendAudioElement();
        initializeBuffers();
        
        function getRecorderContainer(){
            recorderContainer = document.getElementById("recorder")
        };
        
        function getPreviousAudioElement(){
            previousAudioElement = recorderContainer.getElementsByTagName("audio");
        };
        
        function removePreviousAudio(){
            if(previousAudioElement.length){
                previousAudioElement[0].remove();
            }
        };
        
        function createURL(){
            url = URL.createObjectURL(blob);
        };

        function createAudioElement(){
            audioElement = document.createElement('audio');
            audioElement.controls = false;
            audioElement.src = url;
        };

        function appendAudioElement(){
            recorderContainer.appendChild(audioElement);
        };
    }
}