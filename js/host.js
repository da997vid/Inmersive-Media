//-----------------------------------------------------------------------------
// Host stuff
var host = false
var notifyfix = false

// Sets the host for the room
socket.on('setHost', function(data) {
    notifyfix = true
    console.log("You are the new host!")
    host = true
});

// This grabs data and calls sync FROM the host
socket.on('getData', function(data) {
    console.log("Hi im the host, you called?")
    socket.emit('sync host', {});
});




// If user gets disconnected from the host, give warning!
function disconnected() {
    // boolean to prevent alert on join
    if (notifyfix == false) {
        notifyfix = true
    }


}

// Grab all host data
function getHostData(roomnum) {
    socket.emit('get host data', {
        room: roomnum
    });
}


//-----------------------------------------------------------------------------
