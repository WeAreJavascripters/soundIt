var storageWorkerPath = "./js/workers/dataStorageWorker.js";
var codecWorkerPath = "./js/workers/codecWorker.js";

var Recorder = function (stream) {
    this.stream = stream;
};

Recorder.prototype.initialize = function () {
    this._initializeWorkers();
    this._initializeChannel();
    this._initializeBuffers();
    this._initializeAudioContext();
};

Recorder.prototype._initializeWorkers = function () {
    this.channel = new MessageChannel();
    this.dataStorageChannel = new MessageChannel();
    this.storageWorker = new Worker(storageWorkerPath);
    this.codecWorker = new Worker(codecWorkerPath);
    this.storageWorker.postMessage({
        command: 'init'
    }, [this.channel.port1, this.dataStorageChannel.port2]);
    this.codecWorker.postMessage({
        command: 'init'
    }, [this.channel.port2]);
};

Recorder.prototype._initializeChannel = function () {
    this.dataStorageChannel.port1.start();
    this.dataStorageChannel.port1.onmessage = (e) => {
        var command = e.data.command || 'log';
        this.handlingFunctions[command](e);
    };
};

Recorder.prototype._initializeBuffers = function () {
    this.storageWorker.postMessage({
        command: 'reset'
    });
};

Recorder.prototype._initializeAudioContext = function () {
    this.audioContext = new AudioContext();
};

Recorder.prototype.createMediaStream = function () {
    this.mediaStream = this.audioContext.createMediaStreamSource(this.stream);
};

Recorder.prototype.createProcessor = function () {
    var creatingProcessorFunction = this.audioContext.createScriptProcessor || this.audioContext.createJavaScriptNode;
    this.processor = creatingProcessorFunction.call(this.audioContext, 4096, 2, 2);
};

Recorder.prototype.setProcessorListener = function () {
    this.processor.onaudioprocess = (e) => {
        this.storeAudioInfo(e);
    };
};

Recorder.prototype.initializeFlow = function () {
    this.mediaStream.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
};

Recorder.prototype.handlingFunctions = {
    'displayAudio': this.displayAudio,
    'finish': this.finish
};

Recorder.prototype.displayAudio = function (e) {
};

Recorder.prototype.finish = function(){
    
}

module.exports = {

    createRecorder: function (stream) {
        return new Recorder(stream);
    }

};
