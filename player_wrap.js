var Player = require('player')

module.exports.player = new Player([]).on('error', function(err){
          // when error occurs
          console.log(err);
          });
