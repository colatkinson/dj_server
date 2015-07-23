var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');
var secrets = require('./secrets');
//var app = require('./app');

module.exports = {
    _ind: 0,
    playlist: [],
    Track: function(url, title, artist, artwork) {
        this.url = url;
        this.title = title;
        this.artist = artist;
        this.artwork = artwork;
    },
    playing: false,
    stream: null,
    add: function(entry) {
        this.playlist.push(entry);
        //app.io.emit('song added', this.playlist)
    },
    play: function() {
        console.log('play called', this.playing, this._ind);
        if(!this.playing && this.playlist.length > this._ind) {
            this.playing = true;
            this.stream = request(this.playlist[this._ind].url + '?client_id=' + secrets.clientId);

            // Ugly, yet functional
            var parent = this;
            var decoder = new lame.Decoder();
            decoder._ind = this._ind;
            decoder.on('format', function(format) {
                console.log(parent._ind, this._ind);
                if(this._ind == parent._ind) {
                    parent.stream = decoder.pipe(new Speaker);
                }
            });
            this.stream.pipe(decoder);

            this.stream.on('end', function() {
                // Only play if this song is playing
                if(parent.playing) {
                    console.log('calling next');
                    parent.next();
                }
            });
        }
    },
    stop: function() {
        if(this.stream) {
            this.playing = false;
            this.stream.end();
        }
    },
    next: function() {
        this.stop();
        var parent = this;
            parent._ind += 1;
            parent.play();
            parent.onSongChange();
    },
    prev: function() {
        this.stop();
        this._ind -= 1;
        this.play();
        this.onSongChange();
    },
    play_track: function(index) {
        console.log(this.playing);
        this.stop();
        console.log(this.stream);
        this.stream.end();
        this._ind = index;
        console.log(this._ind, this.playing);
        this.play();
        this.onSongChange();
    },
    onSongChange: function() {}
}