var sc = require('../soundcloud');
var player = require('../player_wrap');
var Player = require('player');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  //console.log(req.query);
  sc.getStreamUrl(req.param('url'), function(url) {
      console.log(url);
      var playerplayer = new Player(url).play();
      //player.player.add(url);
      //player.player.play();
      //console.log('p', player.player);
  });
  // res.send('respond with a resource');
  res.redirect('/');
});

module.exports = router;
