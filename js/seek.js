
function seekOther(roomnum, currTime) {
    socket.emit('seek other', {
        room: roomnum,
        time: currTime
    });
}

socket.on('justSeek', function(data) {
    console.log("Seeking Event!")
    currTime = data.time
    var clientTime = media.currentTime
    if (clientTime < currTime - .2 || clientTime > currTime + .2) {
        media.currentTime = currTime
    }
});

