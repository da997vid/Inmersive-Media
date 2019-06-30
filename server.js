var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
rooms = [];
videos = [];
video_socket = [];
// Store all of the sockets and their respective room numbers
userrooms = {}

// Set given room for url parameter
var given_room = ""
var actual_socket_room = ""
var actual_socket_video = ""

app.use(express.static(__dirname + '/'));

server.listen(process.env.PORT || 3000);
console.log('Server Started . . .');

app.get('/:room', function(req, res) {
    given_room = req.params.room
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket) {
    // Connect Socket
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Set default room, if provided in url
    socket.emit('set id', {
        id: given_room
    })

    socket.on('reset url', function(data) {
        given_room = ""
    });

    // Disconnect
    socket.on('disconnect', function(data) {

        // If socket username is found
        if (users.indexOf(socket.username) != -1) {
            users.splice((users.indexOf(socket.username)), 1);

        }

        connections.splice(connections.indexOf(socket), 1);
        console.log(socket.id + ' Disconnected: %s sockets connected', connections.length);

    });

    

    // ------------------------------------------------------------------------
    // New room
    socket.on('new room', function(data, callback) {
        // Roomnum passed through
        socket.roomnum = data.room;
        socket.video = data.video;
        console.log("SocketvideoData ::::::: " + socket.video);

        // This stores the room data for all sockets
        userrooms[socket.id] = data

        var host = null
        var init = false


        // Adds the room to a global array
        if (!rooms.includes(socket.roomnum)) {
            rooms.push(socket.roomnum);
            console.log("Sala añadida al array")
            console.log(rooms)
        }
        if (socket.video !== null) {
            videos.push(socket.video);
            console.log("Video añadido al array")
            console.log(videos)
        }
        

        // Checks if the room exists or not
        if (io.sockets.adapter.rooms['room-' + socket.roomnum] === undefined) {
            socket.send(socket.id)
            // Sets the first socket to join as the host
            host = socket.id
            init = true
            // Set the host on the client side
            socket.emit('setHost');
        } else {
            host = io.sockets.adapter.rooms['room-' + socket.roomnum].host
        }

        console.log("Ahora mismo el host es: " + host);

        // Actually join the room
        console.log(socket.username + " connected to room-" + socket.roomnum)
        socket.join("room-" + socket.roomnum);

        // Sets the default values when first initializing
        if (init) {
            // Sets the host
            io.sockets.adapter.rooms['room-' + socket.roomnum].host = host
            // Default Player
            io.sockets.adapter.rooms['room-' + socket.roomnum].currPlayer = 0
            // Host username
            io.sockets.adapter.rooms['room-' + socket.roomnum].hostName = socket.username
            // Default video
            io.sockets.adapter.rooms['room-' + socket.roomnum].currVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            // Keep list of online users
            io.sockets.adapter.rooms['room-' + socket.roomnum].users = [socket.username]
            //video
            io.sockets.adapter.rooms['room-' + socket.roomnum].video = socket.video
            
        }


        //Comprobar el video elegido
        if (socket.video === null){
            console.log("Socketvideo NULL");
            io.sockets.in("room-" + socket.roomnum).emit('createHTML5', {video: videos[videos.length-1]});
        }
        else {
            console.log("Socketvideo NOT NULL");
            io.sockets.in("room-" + socket.roomnum).emit('createHTML5', {video: socket.video});
        }

        io.sockets.in("room-" + socket.roomnum).emit('createHTML5', {});
        

        // Get time from host which calls change time for that socket
        if (socket.id != host) {
            console.log("call the damn host " + host)
            // Push to users in the room
            io.sockets.adapter.rooms['room-' + socket.roomnum].users.push(socket.username)


        } else {
            console.log("I am the host")

        }
        
        // Update online users
        updateRoomUsers(socket.roomnum);
        actual_socket_room = socket.roomnum;
        actual_socket_video = socket.video;
        

        //Chat Function
        socket.on('set emoji', function(data){
            // socket.emit('change emoji', {src: data});
            socket.broadcast.emit('change emoji', {src: data});
        });

    });

    if ( connections.length > 1) {
        //Update Room List
        updateRoomList(rooms);
    }

    



    // ------------------------------------------------------------------------
    // ------------------------- Socket Functions -----------------------------
    // ------------------------------------------------------------------------

    // Play video
    socket.on('play video', function(data) {
        var roomnum = data.room
        console.log("He pulsado el play")
        io.sockets.in("room-" + roomnum).emit('playVideoClient');
        
    });

    
    socket.on('seek other', function(data) {
        var roomnum = data.room
        var currTime = data.time
        socket.broadcast.to("room-" + roomnum).emit('justSeek', {
            time: currTime
        });

    });

    socket.on('volume other', function(data) {
        var roomnum = data.room
        var volume = data.volume
        socket.broadcast.to("room-" + roomnum).emit('justVolume', {
            volume: volume
        });

    });

    // Sync video
    socket.on('sync video', function(data) {
        if (io.sockets.adapter.rooms['room-' + socket.roomnum] !== undefined) {
            var roomnum = data.room
            var currTime = data.time
            var volume = data.volume
            var state = data.state
            var videoId = data.videoId
            var playerId = 0
            
            io.sockets.in("room-" + roomnum).emit('syncVideoClient', {
                time: currTime,
                volume: volume,
                state: state,
                videoId: videoId,
                playerId: playerId
            })
        }
    });

    socket.on('get data from room', function(data) {
        getDataFromRooms(data);
    });


    // New User
    socket.on('new user', function(data, callback) {
        callback(true);
        // Data is username
        var encodedUser = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        socket.username = encodedUser;
        users.push(socket.username);
    });

    


    // Update the room usernames
    function updateRoomUsers(roomnum) {
        if (io.sockets.adapter.rooms['room-' + socket.roomnum] !== undefined) {
            var roomUsers = io.sockets.adapter.rooms['room-' + socket.roomnum].users
            io.sockets.in("room-" + roomnum).emit('get users', roomUsers)
        }
    }

    //Update Room List
    function updateRoomList(rooms) {
        if (rooms.length > 0){
            socket.emit('get rooms', rooms)
            console.log("Emit Rooms: " + rooms)
        }
    }

    function getDataFromRooms(room_selected) {
        var roomUsers = io.sockets.adapter.rooms['room-' + room_selected].users
        var videoName = io.sockets.adapter.rooms['room-' + room_selected].video
        socket.emit('set room data', {
            users: roomUsers,
            roomSocket: room_selected,
            video: videoName
        });
        console.log("Room Data: " +  room_selected, roomUsers, videoName);
    }

})
