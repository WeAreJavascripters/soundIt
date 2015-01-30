var audioContext;
var mediaStream;
var analyser;
var delay;
var gain;
var binArray = [];
var totalLength = 0;
var recording;
var startTime;
var endTime;
var duration;
var isIdiotized;
var idiotLevel;
var totalBytes;
var processor;
var recorder;
var timeLimit = 13;
var deleted = false;

$("html").on("click", ".si_Record", function(e){ 
    e.preventDefault();
    var $button = $(e.target);
    totalBytes = [];
    navigator.webkitGetUserMedia(
        {audio:true}, 
        function(stream){
            recording = true;
            toggleRecorderButtons();
            timeOutRecord();
            audioContext = new AudioContext();
            mediaStream = audioContext.createMediaStreamSource(stream);
            recorder = new Recorder(mediaStream);
            recorder.record();
        },
        function(e){}
    );
    
    function playSound(buffer){
        mediaStream.connect(processor);
        processor.connect(audioContext.destination);
    };
})

$("html").on("click", ".si_RecordStop", function(e){
    e.preventDefault();
    recorder.stop();
    mediaStream.mediaStream.stop();
    createDownloadLink();
    toggleRecorderButtons();
    togglePlayDelete();
    resetInitialState();
    
    function createDownloadLink() {
        recorder && recorder.exportWAV(function(blob) {
          var url = URL.createObjectURL(blob);
          var au = document.createElement('audio');

          au.controls = false;
          au.src = url;
          $("#recorder").append(au);
        });
      }
});

$("html").on("click", ".si_play", function(e){
    var audioTag = $("#recorder audio").get(0);
    audioTag.play();
    toggleRecorderPlayButtons();
});

$("html").on("click", ".si_stop", function(e){
    var audioTag = $("#recorder audio").get(0);
    audioTag.pause();
    audioTag.currentTime = 0;
    toggleRecorderPlayButtons();
});

$("html").on("click", ".si_deleteRecord", function(e){
    var audioTag = $("#recorder audio").get(0);
    audioTag.pause();
    audioTag.currentTime = 0;
    recorder.clear();
    $(audioTag).remove();
    resetInitialState();
    togglePlayDelete();
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

var timeOutRecord = function () {
    setTimeout(function(){
        timeLimit--;
        console.log(timeLimit);
        if(recording){
            if(timeLimit > 0){
                $("#recorder .si_RecordStop").find(".countdown").html(timeLimit);
                timeOutRecord();
            }else{
                $(".si_RecordStop").trigger("click")
            }
        }
    }, 1000);
};

var resetInitialState = function(){
    timeLimit = 13;
    recording = false;
};

var togglePlayDelete = function(){
    $("#recorder .si_deleteRecord").toggleClass("hidden");
    $("#recorder .si_play").toggleClass("hidden");
};

var toggleRecorderButtons = function () {
    $("#recorder .si_Record").toggleClass("hidden");
    $("#recorder .si_RecordStop").toggleClass("hidden").find(".countdown").html(timeLimit);
}
var toggleRecorderPlayButtons = function () {
    $("#recorder .si_stop").toggleClass("hidden");
    $("#recorder .si_play").toggleClass("hidden");
}
