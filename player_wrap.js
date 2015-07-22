//var Player = require('player');
var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');
var fs = require('fs');
var wav = require('wav');

/*module.exports.player = new Player([]).on('error', function(err){
          // when error occurs
          console.log(err);
          });*/
var debug = console.log;
/*module.exports.player = new Player('https://ec-media.sndcdn.com/t6djX3HFkvKh.128.mp3?f10880d39085a94a0418a7ef69b03d522cd6dfee9399eeb9a522029b6af1be3d81e7dde268c3142e54f7d9a656c912c268ae1f62cfec2a79d525a81fcfac156a59a11e8059').enable('stream')
  .on('downloading', function(song) {
    debug('im downloading... ');
    debug(song);
  })
  .on('playing', function(song) {
    debug('im playing... ');
    debug(song);
  })
  .on('playend', function(song) {
    debug('play done, switching to next one ...');
  })
  .on('error', function(err) {
    debug('Opps...!')
    debug(err);
  }).play();
*/

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
            //this.stream = request(this.playlist[this._ind]).pipe(new lame.Decoder).pipe(new Speaker);
            this.stream = request(this.playlist[this._ind]);//.pipe(new lame.Decoder).pipe(fs.createWriteStream('file.wav'));
            var decoder = new lame.Decoder();
            decoder.on('format', function(format) {
                // console.log(format);
                //var writer = new wav.Writer(format);
                //decoder.pipe(writer).pipe(fs.createWriteStream('file.wav'));
                this.stream = decoder.pipe(new Speaker);
            });
            this.stream.pipe(decoder);
            console.log(this.stream);
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
        console.log(this.playlist[this._ind]);
        this.stop();
        this.play();
    }
}