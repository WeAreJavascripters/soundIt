var audioContext;
var mediaStream;
$("html").on("click", ".startRec", function(e){
    $(e.target).hide();
    $(".stopRec").show();
    navigator.webkitGetUserMedia(
        {audio:true}, 
        function(stream){
            //var audio = document.querySelector("audio");
            //audio.src = window.URL.createObjectURL(stream);
            audioContext = new AudioContext();
            mediaStream = audioContext.createMediaStreamSource(stream);
            
            //$("audio source").attr("src", window.URL.createObjectURL(stream));
            //console.log(stream)
        },
        function(e){
            console.log(123)
        }
    );
    //var worker = new Worker("./js/recorder.js");
})

$("html").on("click", ".stopRec", function(e){
    $(e.target).hide();
    $(".startRec").show();
    navigator.webkitGetUserMedia(
        {audio:true}, 
        function(stream){
            var audio = document.querySelector("audio");
            audio.src = null;
            stream.stop();
            
            //$("audio source").attr("src", window.URL.createObjectURL(stream));
            //console.log(stream)
        },
        function(e){
            console.log(123)
        }
    );
})
