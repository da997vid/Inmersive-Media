//html5.js
var video1 = document.getElementById('video1');
var video2 = document.getElementById('video2');
var media = document.querySelector('video');
video2.style.display = "none";


function changeVideo() {
    var selectedVideo = document.getElementById("video_list").value;

    if (selectedVideo == 'video1') {
        video1.style.display = "block";
        video2.style.display = "none";
        media = video1;
    }
    else if (selectedVideo == 'video2') {
        video2.style.display = "block";
        video1.style.display = "none";
        media = video2;
    }

    media.addEventListener("seeked", function(e) {
        var currTime = media.currentTime
        if (host) {
            seekOther(roomnum, currTime)
        }
    })

    media.onvolumechange = function() {
        var volume = media.volume;
        if (host) {
            volumeOther(roomnum, volume)
        }
    }
}

media.addEventListener("seeked", function(e) {
    var currTime = media.currentTime
    if (host) {
        seekOther(roomnum, currTime)
    }
});

media.onvolumechange = function() {
    var volume = media.volume;
    if (host) {
        volumeOther(roomnum, volume)
    }
}

// Play/pause function
function html5Play() {
    if (media.paused) {
        media.play();
    } else {
        media.pause();
    }
}

