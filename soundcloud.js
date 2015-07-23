var request = require('request');
var secrets = require('./secrets');

var clientId = secrets.clientId;

function resolveUrl(url, callback) {
    request({url: 'http://api.soundcloud.com/resolve?url=' + url +'&client_id=' + clientId}, function(error, response, body) {
        var json = JSON.parse(body);
        callback(json);
    });
}
module.exports.resolveUrl = resolveUrl;

function getStreamUrl(url, callback) {
    resolveUrl(url, function(data) {
        request(data.uri + '?client_id=' + clientId, function(error, response, body) {
            var json = JSON.parse(body);
            callback(json.stream_url + '?client_id=' + clientId);
        });
    });
}
module.exports.getStreamUrl = getStreamUrl;
