var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sc = require('./soundcloud');
var player = require('./player_wrap');

var routes = require('./routes/index');
var users = require('./routes/users');
var add = require('./routes/add');

var app = express();
//var server = require('http').Server(app);
var io = require('socket.io')();
app.io = io;

// server.listen(8000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/add', add);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function addTrack(json) {
  var art = 'https://placehold.it/500x500';
  if(json.artwork_url) {
    art = json.artwork_url.replace(/large/g, 't500x500');
  }
  player.add(new player.Track(json.stream_url, json.title, json.user.username, art));
}

io.on('connection', function (socket) {
  // console.log(socket);
  /*socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });*/
  io.emit('song added', {ind: player._ind, playlist: player.playlist});
  player.onSongChange = function() {
    io.emit('song added', {ind: player._ind, playlist: player.playlist});
  };
  socket.on('add song', function (data) {
    sc.resolveUrl(data, function(json) {
      console.log(json.kind);
      if(json.kind == 'track') {
        console.log(json, 'adding track')
        addTrack(json);
      } else if(json.kind == 'playlist') {
        for(var i = 0; i < json.tracks.length; i++) {
          /*var cur = json.tracks[i];
          cur.artwork_url.replace(/-large\./g, '-t500x500.');
          player.add(new player.Track(cur.stream_url, cur.title, cur.user.username, cur.artwork_url));*/
          addTrack(json.tracks[i]);
        }
      }
      player.play();
      io.emit('song added', {ind: player._ind, playlist: player.playlist});
      io.emit('playing', player.playing);
    });
  });

  socket.on('select song', function(data) {
    console.log(data);
    player.play_track(parseInt(data));
    io.emit('playing', player.playing);
  });

  socket.on('toggle song', function(data) {
    if(!player.playing) {
      player.play();
    } else {
      player.stop();
    }
    io.emit('playing', player.playing);
  });

  socket.on('next song', function(data) {
    player.next();
  });
  socket.on('prev song', function(data) {
    player.prev();
  });
});


module.exports = app;
