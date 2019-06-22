// Create HTML5 Player
socket.on('createHTML5', function(data) {
    //video_select = data.video;
    var video1 = document.getElementById('video1');
    var video2 = document.getElementById('video2');

    var you = document.getElementById('playerArea');
    you.style.display = 'none';

    var html5 = document.getElementById('HTML5Area');
    html5.style.display = 'block';

    if (data.video == 'video1') {
        video1.style.display = "block";
        video2.style.display = "none";
        media = video1;
    }
    else if (data.video == 'video2') {
        video2.style.display = "block";
        video1.style.display = "none";
        media = video2;
    }
});

