import soundcloud
import gi
gi.require_version('Gst', '1.0')
from gi.repository import GObject, Gst, Gtk

import flask
from flask import Flask, render_template, request
app = Flask(__name__)

f = open("secret", "r")
client = f.read().strip()
f.close()
print(client)

client = soundcloud.Client(client_id=client)

class Player:
    playlist = []
    ind = 0

    def __init__(self):
        Gst.init_check(None)
        IS_GST010 = Gst.version()[0] == 0
        self.player = Gst.ElementFactory.make("playbin", "player")
        fakesink = Gst.ElementFactory.make("fakesink", "fakesink")
        self.player.set_property("video-sink", fakesink)
        bus = self.player.get_bus()
        self.player.connect("about-to-finish",  self.on_finished)
        self.playing = False

    def set_track(self, track):
        self.stop()
        self.track = track

    def add_to_playlist(self, url):
        self.playlist.append(url)
        # if len(self.playlist) == 1:
        if not self.playing:
            self.set_track(client.get("/resolve", url=self.playlist[self.ind]))
        # self.play()
        print("ayy", self.ind, self.playlist)
        print(self.player.get_state(Gst.CLOCK_TIME_NONE))

    def play(self):
        if not self.playing:
            self.stop()
            print(get_track_url(client, self.track))
            self.player.set_property("uri", get_track_url(client, self.track))
            self.player.set_state(Gst.State.PLAYING)
            self.playing = True

    def stop(self):
        self.player.set_state(Gst.State.NULL)
        self.playing = False

    def on_message(self, bus, message):
        t = message.type
        if t == Gst.Message.EOS:
            self.player.set_state(Gst.State.NULL)
            self.playing = False
        elif t == Gst.Message.ERROR:
            self.player.set_state(Gst.State.NULL)
            err, debug = message.parse_error()
            print("Error: %s" % err, debug)
            self.playing = False

        self.updateButtons()

    def on_finished(self, player):
        # self.playing = False
        self.stop()

        self.ind += 1
        print(self.ind, self.playlist)
        if self.ind < len(self.playlist):
            self.set_track(client.get("/resolve", url=self.playlist[self.ind]))
            self.play()

player = Player()

@app.route('/')
def index():
    print(player.playing)
    return render_template('main.html', player=player)

@app.route('/play', methods=["POST"])
def do_play():
    url = request.form["url"]
    # track = client.get("/resolve", url=url)
    #player.set_track(track)
    #play_track(client, track)
    player.add_to_playlist(url)
    player.play()
    return flask.redirect(flask.url_for('index'))

def get_track(client, track_id):
    return client.get("/tracks/%s" % track_id)

def get_track_url(client, track):
    print(track.stream_url)
    stream_url = client.get(track.stream_url, allow_redirects=False)
    return stream_url.location

def play_track(client, track):
    print("%s by %s" % (track.title, track.user["username"]))
    url = get_track_url(client, track)

    Gst.init_check(None)
    IS_GST010 = Gst.version()[0] == 0
    player = Gst.ElementFactory.make("playbin", "player")
    fakesink = Gst.ElementFactory.make("fakesink", "fakesink")
    player.set_property("video-sink", fakesink)
    bus = player.get_bus()

    #bus.add_signal_watch_full()
    #bus.connect("message", self.on_message)
    #self.player.connect("about-to-finish",  self.on_finished)

    player.set_property("uri", url)
    player.set_state(Gst.State.PLAYING)

# def main():
    # client = soundcloud.Client(client_id='edc707219bcc43422ee53bd653a0b2f7')
    # track = get_track(client, 293)
    # track = client.get("/resolve", url="https://soundcloud.com/xxx/maya-payne-if-only")
    # play_track(client, track)

if __name__ == '__main__':
    # main()
    app.run("0.0.0.0", debug=True)
