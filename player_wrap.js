var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');

module.exports = {
    _ind: 0,
    playlist: [],
    playing: false,
    stream: null,
    add: function(url) {
        this.playlist.push(url);
    },
    play: function() {
        console.log('play called');
        if(!this.playing && this.playlist.length > this._ind) {
            this.playing = true;
            this.stream = request(this.playlist[this._ind]);

            var decoder = new lame.Decoder();
            decoder.on('format', function(format) {
                this.stream = decoder.pipe(new Speaker);
            });
            this.stream.pipe(decoder);

            // Ugly, yet functional
            var parent = this;
            this.stream.on('end', function() {
                console.log("ended", parent.playing);
                if(parent.playing) {
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
        this._ind += 1;
        this.stop();
        this.play();
    }
}