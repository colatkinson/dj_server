window.onload = function() {
    var socket = io();

    socket.on('song added', function(data) {
        console.log(data);
        var list = document.getElementById('playlist');
        list.innerHTML = '';
        for(var i = 0; i < data.playlist.length; i++) {
            var node = document.createElement('li');
            var textnode = document.createTextNode(data.playlist[i].title + ' by ' + data.playlist[i].artist);
            
            //var img = document.createElement('img');
            //img.src = data.playlist[i].artwork;
            var gradDef = '0, 0, 0, 0.5';
            var grad = gradDef;
            if(i == data.ind) {
                grad = '255, 85, 0, 0.5';
            }
            node.style.backgroundImage = 'linear-gradient(to bottom, rgba(' + grad + '), rgba(' + grad + ')), url(' + data.playlist[i].artwork + ')';

            node.dataset.ind = i;

            if(i == data.ind) {
                document.querySelector('#curSong').innerText = data.playlist[i].title + ' by ' + data.playlist[i].artist;
                document.querySelector('#controls').style.backgroundImage = 'linear-gradient(to bottom, rgba(' + gradDef + '), rgba(' + gradDef + ')), url(' + data.playlist[i].artwork + ')';
            }

            node.appendChild(textnode);
            //node.appendChild(img);
            list.appendChild(node);
        }
    });

    socket.on('playing', function(data) {
        if(data) {
            document.querySelector('#play').className = 'fa fa-pause';
        } else {
            document.querySelector('#play').className = 'fa fa-play';
        }
    });

    function onAlbumsClick(e) {
        if (e.target !== e.currentTarget) {
            // console.log(e.target);
            socket.emit('select song', e.target.dataset.ind);
        }
        e.stopPropagation();
    }
    document.querySelector("#playlist").addEventListener("click", onAlbumsClick, false);

    document.getElementById('urlForm').onsubmit = function() {
        socket.emit('add song', document.getElementById('urlInput').value);
        document.getElementById('urlInput').value = '';

        return false;
    };

    document.querySelector('#play').onclick = function() {
        socket.emit('toggle song');
    };
    document.querySelector('#next').onclick = function() {
        socket.emit('next song');
    };
    document.querySelector('#prev').onclick = function() {
        socket.emit('prev song');
    };
}

window.onscroll = function() {
    console.log('scroll');
    if(document.body.scrollTop) {
        console.log('wham')
        document.querySelector('header').className = 'scrolled';
    } else {
        document.querySelector('header').className = '';
    }
};