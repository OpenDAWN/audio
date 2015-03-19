var waves = require('../waves-audio');
var audioContext = waves.audioContext;
var AudioBufferLoader = require('waves-loaders').AudioBufferLoader;
var GranularEngine = waves.GranularEngine;
var PlayerEngine = waves.PlayerEngine;
var PlayControl = waves.PlayControl;
var SegmentEngine = waves.SegmentEngine;
var Transport = waves.Transport;

var audioBufferLoader = new AudioBufferLoader();
var transport = new Transport(audioContext);
var playControl = new PlayControl(transport);

var engine;
var playing = false;

function loadApp() {
	audioBufferLoader.load('https://cdn.rawgit.com/Ircam-RnD/audio-files/master/drumLoop.wav').then(function(buffer) {
		engine = new GranularEngine(audioContext);
		engine.buffer = buffer;
		engine.connect(audioContext.destination);
		transport.add(engine, 0, buffer.duration);
		playControl.setLoopBoundaries(0, buffer.duration);
		playControl.loop = true;
	});

	document.getElementById('play-button').onclick = function(event) {	
		if (!playing) {
			playControl.start();
				this.textContent = "Pause";
			playing = true;
		} else {
			playControl.pause();
			this.textContent = "Play";
			playing = false;
		}
	}

	document.getElementById('speed-range')
		.addEventListener('input', function(event) {
			playControl.speed = (+this.value);
			document.getElementById('speed').textContent = this.value;
		});
}

document.addEventListener("DOMContentLoaded", function(event) {
	loadApp();
});