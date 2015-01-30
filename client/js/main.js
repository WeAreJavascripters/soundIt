var audioContext;
var mediaStream;
var analyser;
var delay;
var gain;
var binArray = [];
var mustUpdate;
var startTime;
var endTime;
var duration;
var isIdiotized;
var idiotLevel;
var totalBytes;
var processor;
$("html").on("click", ".startRec", function(e){ 
    e.preventDefault();
    $(e.target).hide();
    $(".stopRec").show();
    isIdiotized = $("#idiot").is(":checked");
    totalBytes = [];
    navigator.webkitGetUserMedia(
        {audio:true}, 
        function(stream){
            mustUpdate = true;
            //var audio = document.querySelector("audio");
            //audio.src = window.URL.createObjectURL(stream);
            audioContext = new AudioContext();
            mediaStream = audioContext.createMediaStreamSource(stream);
            processor = mediaStream.context.createScriptProcessor(4096, 2, 2);
            processor.onaudioprocess = function(e){
                if(mustUpdate){
                    var audioObject = {
                        l: e.inputBuffer.getChannelData(0),
                        r: e.inputBuffer.getChannelData(1)
                    }
                    binArray.push(audioObject);
                }
            }
            if(isIdiotized){
                delay = audioContext.createDelay();
                gain = audioContext.createGain();
                gain.gain.value= 2;
                delay.delayTime.value = $("#idiotLevel").val() || 0.25;
            }
            //binArray = new Uint8Array(analyser.frequencyBinCount);
            //startTime = Date.now();
            playSound();
            $("audio source").attr("src", window.URL.createObjectURL(stream));
            //console.log(stream)
        },
        function(e){
            console.log(123)
        }
    );
    
    function playSound(buffer){
        if(delay){
            mediaStream.connect(delay);
            delay.connect(gain);
            gain.connect(audioContext.destination);
        }else{
            mediaStream.connect(processor);
            processor.connect(audioContext.destination);
        }
    };
    
    //var worker = new Worker("./js/recorder.js");
})

$("html").on("click", ".stopRec", function(e){
    e.preventDefault();
    mustUpdate = false;
    mediaStream.mediaStream.stop();
    $(e.target).hide();
    $(".startRec").show();
    
});

$("html").on("change", "#idiotLevel", function(e){
    var valueContainer = $("#idiotLevelRes");
    var value = $(e.target).val();
    idiotLevel = value/100;
    if(delay){
        delay.delayTime.value = idiotLevel;
    }
    valueContainer.html(idiotLevel);
});

$("html").on("click", "#download", function(e){
    var link = $("#downloadLink");
    var total;
    var count = 0;
    var wav = encodeWAV()
    if(totalBytes){
        var blob = new Blob(totalBytes, {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        link.attr("href", url);
        link.attr("download", "caca")
        link.trigger("click");
    }
});

var writeString = function(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}


var encodeWAV = function(samples){
  var buffer = new ArrayBuffer(44 + samples.length);
  var view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, 2, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 4, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}


