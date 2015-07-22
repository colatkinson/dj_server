window.onload = function() {
    var socket = io();

    socket.on('song added', function(data) {
        console.log(data);
        var list = document.getElementById('playlist');
        list.innerHTML = '';
        for(var i = 0; i < data.playlist.length; i++) {
            var node = document.createElement('li');
            var textnode = document.createTextNode(((i == data.ind) ? '* ' : '') + data.playlist[i].title + ' by ' + data.playlist[i].artist);
            if(i == data.ind) {
                console.log(1738);
                textnode.innerText = '*' + textnode.innerText;
            }
            node.appendChild(textnode);
            list.appendChild(node);
        }
    });

    document.getElementById('urlForm').onsubmit = function() {
        socket.emit('add song', document.getElementById('urlInput').value);
        document.getElementById('urlInput').value = '';

        return false;
    }
}