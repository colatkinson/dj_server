var request = require('request');

var clientId = '***REMOVED***';

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
            // callback(json.stream_url + '?client_id=' + clientId);
            request.head(json.stream_url + '?client_id=' + clientId).on('response', function(response) {
                console.log(response);
                callback(response.request.uri.href);
            });
        });
    });
}
module.exports.getStreamUrl = getStreamUrl;
