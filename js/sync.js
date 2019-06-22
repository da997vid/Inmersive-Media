// Calls the play video function on the server
function playVideo(roomnum) {
    socket.emit('play video', {
        room: roomnum
    });
}

// Calls the sync function on the server
function syncVideo(roomnum) {
    var currTime = 0
    var state
    var videoId = id

    currTime = media.currentTime;
    state = media.paused;

    socket.emit('sync video', {
        room: roomnum,
        time: currTime,
        state: state,
        videoId: videoId
    });

}

// This return the current time
function getTime() {
    return media.currentTime;
}

function seekTo(time) {
    media.currentTime = currTime
    media.play()
}









//------------------------------//
// Client Synchronization Stuff //
//------------------------------//

var roomnum = 1
var id = "M7lc1UVf-VE"

// Calls the play/pause function
socket.on('playVideoClient', function(data) {
    html5Play()
});

socket.on('pauseVideoClient', function(data) {
    media.pause()
});

// Syncs the video client
socket.on('syncVideoClient', function(data) {
    var currTime = data.time
    var state = data.state
    var videoId = data.videoId
    console.log("current time is: " + currTime)
    console.log("curr vid id: " + id + " " + videoId)
    console.log("state" + state)

    // This syncs the time and state

    media.currentTime = currTime

    // Sync player state
    // IF parent player was paused
    if (state) {
        media.pause()
    } else {
        media.play()
    }
    

});



