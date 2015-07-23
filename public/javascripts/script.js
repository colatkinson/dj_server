window.onload = function() {
    var socket = io();

    socket.on('song added', function(data) {
        console.log(data);
        var list = document.getElementById('playlist');
        list.innerHTML = '';
        for(var i = 0; i < data.playlist.length; i++) {
            var node = document.createElement('li');
            var textnode = document.createTextNode(((i == data.ind) ? '* ' : '') + data.playlist[i].title + ' by ' + data.playlist[i].artist);
            
            //var img = document.createElement('img');
            //img.src = data.playlist[i].artwork;
            node.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + data.playlist[i].artwork + ')';

            node.appendChild(textnode);
            //node.appendChild(img);
            list.appendChild(node);
        }
    });

    document.getElementById('urlForm').onsubmit = function() {
        socket.emit('add song', document.getElementById('urlInput').value);
        document.getElementById('urlInput').value = '';

        return false;
    }
}