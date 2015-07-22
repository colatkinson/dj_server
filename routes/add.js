var sc = require('../soundcloud');
var player = require('../player_wrap');
var Player = require('player');
var express = require('express');
var router = express.Router();

var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');

/* GET users listing. */
router.post('/', function(req, res, next) {
  //console.log(req.query);
  sc.getStreamUrl(req.param('url'), function(url) {
      //var playerplayer = new Player(url).play().play();
      //console.log(playerplayer);
      /*player.player.add(url);
      player.player.play();
      console.log('p', player.player);*/
      //request(url).pipe(new lame.Decoder).pipe(new Speaker);
      player.add(url);
      player.play();
  });
  // res.send('respond with a resource');
  res.redirect('/');
});

module.exports = router;
