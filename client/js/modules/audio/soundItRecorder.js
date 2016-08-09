var Recorder = require('./recorder');

var SoundItRecorder = function (stream) {
    this.recorder = new Recorder( stream );
    this.recorder.initialize();
};

SoundItRecorder.prototype.startRecording = function () {

};

SoundItRecorder.prototype.stopRecording = function () {

};
