import Recorder from './recorder.js';

var SoundItRecorder = function () {};
import {Events as Events} from 'backbone';


SoundItRecorder.recordingOptions = {
    audio: true
};

SoundItRecorder.prototype.startRecording = function () {

    navigator.mediaDevices.getUserMedia(SoundItRecorder.recordingOptions)
        .then((stream) => {
            this.audioContext = new AudioContext();
            this.mediaStream = this.audioContext.createMediaStreamSource(stream);
            this.recorder = this.recorder || new Recorder(stream);
            this.recorder.setProcessorListener();
            this.recorder.initializeFlow();
            this.recorder.isRecording = true;
        })
        .catch((e) => {
            alert('Error while initializing user media: ', arguments);
        });
};

SoundItRecorder.prototype.stopRecording = function () {
    this.recorder.isRecording = false;
    var currentTrack = this.mediaStream.mediaStream.getTracks()[0];
    currentTrack.stop();
    //this.recorder.finish();
};

export default SoundItRecorder;
