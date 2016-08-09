importScripts("../../lib/js/libmp3lame.min.js")

var lm;
var ports;
var encodedData;
var handlingFunctions = {
    'init': initialize,
    'log': log,
    'encode': encode
};

self.onmessage = function(e){
    var command = e.data.command;
    handlingFunctions[command](e);
};

function initialize(event){
    ports = event.ports;
    setPortListener();
};

function initialize(event){
    ports = event.ports;
    setPortListener();
    initLameCodec();
};

function setPortListener(){
    ports[0].start();
    ports[0].onmessage = function(e){
        var command = e.data.command || 'log';
        handlingFunctions[command](e);
    }
};

function initLameCodec(){
    lm = Lame.init();
    Lame.set_mode(lm, Lame.JOINT_STEREO);
    Lame.set_num_channels(lm, 2);
    Lame.set_out_samplerate(lm, 48000);
    Lame.set_bitrate(lm, 128);
    Lame.init_params(lm);
};

function log(event){
    console.log('codec: ', e);
};

function encode(event){
    var data = event.data.data;
    var left = data.left;
    var right = data.right;
    var encoded;
    encoded = Lame.encode_buffer_ieee_float(lm, left, right);
    ports[0].postMessage({
        command: 'storeEncoded',
        data: encoded
    });
};
