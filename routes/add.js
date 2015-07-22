var sc = require('../soundcloud');
var player = require('../player_wrap');
var express = require('express');
var router = express.Router();

var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');

/* GET users listing. */
router.post('/', function(req, res, next) {
  //console.log(req.query);
  sc.getStreamUrl(req.param('url'), function(url) {
      player.add(url);
      player.play();
  });
  res.redirect('/');
});

module.exports = router;
