(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
"use strict";
(function(global, exports, perf) {
  "use strict";
  function fixSetTarget(param) {
    if (!param) {
      return;
    }
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }
  if (window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext")) {
    window.AudioContext = webkitAudioContext;
    if (!AudioContext.prototype.hasOwnProperty("createGain"))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty("createDelay"))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty("createScriptProcessor"))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    if (!AudioContext.prototype.hasOwnProperty("createPeriodicWave"))
      AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };
    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };
    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function(when, offset, duration) {
          if (offset || duration)
            this.noteGrainOn(when, offset, duration);
          else
            this.noteOn(when);
        };
      }
      if (!node.stop)
        node.stop = node.noteOff;
      fixSetTarget(node.playbackRate);
      return node;
    };
    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };
    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };
    if (AudioContext.prototype.hasOwnProperty("createOscillator")) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn;
        if (!node.stop)
          node.stop = node.noteOff;
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }
})(window);


//# sourceURL=/Users/rvincent/audio/dist/core/ac-monkeypatch.js
},{}],2:[function(require,module,exports){
"use strict";
"use strict";
require("./ac-monkeypatch");
module.exports = new AudioContext();


//# sourceURL=/Users/rvincent/audio/dist/core/audio-context.js
},{"./ac-monkeypatch":1}],3:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var defaultAudioContext = require("./audio-context");
var TimeEngine = (function() {
  function TimeEngine() {
    var audioContext = arguments[0] === undefined ? defaultAudioContext : arguments[0];
    _classCallCheck(this, TimeEngine);
    this.audioContext = audioContext;
    this.master = null;
    this["interface"] = null;
    this.outputNode = null;
  }
  _createClass(TimeEngine, {
    currentTime: {get: function() {
        return this.audioContext.currentTime;
      }},
    currentPosition: {get: function() {
        return 0;
      }},
    resetNextTime: {value: function resetNextTime() {
        var time = arguments[0] === undefined ? null : arguments[0];
      }},
    resetNextPosition: {value: function resetNextPosition() {
        var position = arguments[0] === undefined ? null : arguments[0];
      }},
    __setGetters: {value: function __setGetters(getCurrentTime, getCurrentPosition) {
        if (getCurrentTime) {
          Object.defineProperty(this, "currentTime", {
            configurable: true,
            get: getCurrentTime
          });
        }
        if (getCurrentPosition) {
          Object.defineProperty(this, "currentPosition", {
            configurable: true,
            get: getCurrentPosition
          });
        }
      }},
    __deleteGetters: {value: function __deleteGetters() {
        delete this.currentTime;
        delete this.currentPosition;
      }},
    implementsScheduled: {value: function implementsScheduled() {
        return this.advanceTime && this.advanceTime instanceof Function;
      }},
    implementsTransported: {value: function implementsTransported() {
        return this.syncPosition && this.syncPosition instanceof Function && this.advancePosition && this.advancePosition instanceof Function;
      }},
    implementsSpeedControlled: {value: function implementsSpeedControlled() {
        return this.syncSpeed && this.syncSpeed instanceof Function;
      }},
    setScheduled: {value: function setScheduled(master, resetNextTime, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "scheduled";
        this.__setGetters(getCurrentTime, getCurrentPosition);
        if (resetNextTime)
          this.resetNextTime = resetNextTime;
      }},
    setTransported: {value: function setTransported(master, resetNextPosition, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "transported";
        this.__setGetters(getCurrentTime, getCurrentPosition);
        if (resetNextPosition)
          this.resetNextPosition = resetNextPosition;
      }},
    setSpeedControlled: {value: function setSpeedControlled(master, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "speed-controlled";
        this.__setGetters(getCurrentTime, getCurrentPosition);
      }},
    resetInterface: {value: function resetInterface() {
        this.__deleteGetters();
        delete this.resetNextTime;
        delete this.resetNextPosition;
        this.master = null;
        this["interface"] = null;
      }},
    connect: {value: function connect(target) {
        this.outputNode.connect(target);
        return this;
      }},
    disconnect: {value: function disconnect(connection) {
        this.outputNode.disconnect(connection);
        return this;
      }}
  });
  return TimeEngine;
})();
module.exports = TimeEngine;


//# sourceURL=/Users/rvincent/audio/dist/core/time-engine.js
},{"./audio-context":2,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29}],4:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
var GranularEngine = (function(_TimeEngine) {
  function GranularEngine(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, GranularEngine);
    _get(_core.Object.getPrototypeOf(GranularEngine.prototype), "constructor", this).call(this, audioContext);
    this.buffer = options.buffer || null;
    this.periodAbs = options.periodAbs || 0.01;
    this.periodRel = options.periodRel || 0;
    this.periodVar = options.periodVar || 0;
    this.position = options.position || 0;
    this.positionVar = options.positionVar || 0.003;
    this.durationAbs = options.durationAbs || 0.1;
    this.durationRel = options.durationRel || 0;
    this.attackAbs = options.attackAbs || 0;
    this.attackRel = options.attackRel || 0.5;
    this.attackShape = options.attackShape || "lin";
    this.releaseAbs = options.releaseAbs || 0;
    this.releaseRel = options.releaseRel || 0.5;
    this.releaseShape = options.releaseShape || "lin";
    this.expRampOffset = options.expRampOffset || 0.0001;
    this.resampling = options.resampling || 0;
    this.resamplingVar = options.resamplingVar || 0;
    this.centered = options.centered || true;
    this.cyclic = options.cyclic || false;
    this.__gainNode = audioContext.createGain();
    this.__gainNode.gain.value = options.gain || 1;
    this.outputNode = this.__gainNode;
  }
  _inherits(GranularEngine, _TimeEngine);
  _createClass(GranularEngine, {
    bufferDuration: {get: function() {
        var bufferDuration = this.buffer.duration;
        if (this.buffer.wrapAroundExtention)
          bufferDuration -= this.buffer.wrapAroundExtention;
        return bufferDuration;
      }},
    currentPosition: {get: function() {
        return this.position;
      }},
    advanceTime: {value: function advanceTime(time) {
        return time + this.trigger(time);
      }},
    playbackLength: {get: function() {
        return this.bufferDuration;
      }},
    gain: {
      set: function(value) {
        this.__gainNode.gain.value = value;
      },
      get: function() {
        return this.__gainNode.gain.value;
      }
    },
    trigger: {value: function trigger(time) {
        var outputNode = arguments[1] === undefined ? this.outputNode : arguments[1];
        var audioContext = this.audioContext;
        var grainTime = time || audioContext.currentTime;
        var grainPeriod = this.periodAbs;
        var grainPosition = this.currentPosition;
        var grainDuration = this.durationAbs;
        if (this.buffer) {
          var resamplingRate = 1;
          if (this.resampling !== 0 || this.resamplingVar > 0) {
            var randomResampling = (Math.random() - 0.5) * 2 * this.resamplingVar;
            resamplingRate = Math.pow(2, (this.resampling + randomResampling) / 1200);
          }
          grainPeriod += this.periodRel * grainDuration;
          grainDuration += this.durationRel * grainPeriod;
          if (this.periodVar > 0)
            grainPeriod += 2 * (Math.random() - 0.5) * this.periodVar * grainPeriod;
          if (this.centered)
            grainPosition -= 0.5 * grainDuration;
          if (this.positionVar > 0)
            grainPosition += (2 * Math.random() - 1) * this.positionVar;
          var bufferDuration = this.bufferDuration;
          if (grainPosition < 0 || grainPosition >= bufferDuration) {
            if (this.cyclic) {
              var cycles = grainPosition / bufferDuration;
              grainPosition = (cycles - Math.floor(cycles)) * bufferDuration;
              if (grainPosition + grainDuration > this.buffer.duration)
                grainDuration = this.buffer.duration - grainPosition;
            } else {
              if (grainPosition < 0) {
                grainTime -= grainPosition;
                grainDuration += grainPosition;
                grainPosition = 0;
              }
              if (grainPosition + grainDuration > bufferDuration)
                grainDuration = bufferDuration - grainPosition;
            }
          }
          if (this.gain > 0 && grainDuration >= 0.001) {
            var envelopeNode = audioContext.createGain();
            var attack = this.attackAbs + this.attackRel * grainDuration;
            var release = this.releaseAbs + this.releaseRel * grainDuration;
            if (attack + release > grainDuration) {
              var factor = grainDuration / (attack + release);
              attack *= factor;
              release *= factor;
            }
            var attackEndTime = grainTime + attack;
            var grainEndTime = grainTime + grainDuration;
            var releaseStartTime = grainEndTime - release;
            if (this.attackShape === "lin") {
              envelopeNode.gain.setValueAtTime(0, grainTime);
              envelopeNode.gain.linearRampToValueAtTime(1, attackEndTime);
            } else {
              envelopeNode.gain.setValueAtTime(this.expRampOffset, grainTime);
              envelopeNode.gain.exponentialRampToValueAtTime(1, attackEndTime);
            }
            if (releaseStartTime > attackEndTime)
              envelopeNode.gain.setValueAtTime(1, releaseStartTime);
            if (this.releaseShape === "lin") {
              envelopeNode.gain.linearRampToValueAtTime(0, grainEndTime);
            } else {
              envelopeNode.gain.exponentialRampToValueAtTime(this.expRampOffset, grainEndTime);
            }
            envelopeNode.connect(outputNode);
            var source = audioContext.createBufferSource();
            source.buffer = this.buffer;
            source.playbackRate.value = resamplingRate;
            source.connect(envelopeNode);
            source.start(grainTime, grainPosition);
            source.stop(grainTime + grainDuration / resamplingRate);
          }
        }
        return grainPeriod;
      }}
  });
  return GranularEngine;
})(TimeEngine);
module.exports = GranularEngine;


//# sourceURL=/Users/rvincent/audio/dist/engines/granular-engine.js
},{"../core/time-engine":3,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],5:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
var Metronome = (function(_TimeEngine) {
  function Metronome(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, Metronome);
    _get(_core.Object.getPrototypeOf(Metronome.prototype), "constructor", this).call(this, audioContext);
    this.period = options.period || 1;
    this.clickFreq = options.clickFreq || 600;
    this.clickAttack = options.clickAttack || 0.002;
    this.clickRelease = options.clickRelease || 0.098;
    this.__phase = 0;
    this.__gainNode = this.audioContext.createGain();
    this.__gainNode.gain.value = options.gain || 1;
    this.outputNode = this.__gainNode;
  }
  _inherits(Metronome, _TimeEngine);
  _createClass(Metronome, {
    advanceTime: {value: function advanceTime(time) {
        this.trigger(time);
        return time + this.period;
      }},
    syncPosition: {value: function syncPosition(time, position, speed) {
        var nextPosition = (Math.floor(position / this.period) + this.__phase) * this.period;
        if (speed > 0 && nextPosition < position)
          nextPosition += this.period;
        else if (speed < 0 && nextPosition > position)
          nextPosition -= this.period;
        return nextPosition;
      }},
    advancePosition: {value: function advancePosition(time, position, speed) {
        this.trigger(time);
        if (speed < 0) {
          return position - this.period;
        }
        return position + this.period;
      }},
    trigger: {value: function trigger(time) {
        var audioContext = this.audioContext;
        var clickAttack = this.clickAttack;
        var clickRelease = this.clickRelease;
        var period = this.period;
        if (period < clickAttack + clickRelease) {
          var scale = period / (clickAttack + clickRelease);
          clickAttack *= scale;
          clickRelease *= scale;
        }
        this.__envNode = audioContext.createGain();
        this.__envNode.gain.value = 0;
        this.__envNode.gain.setValueAtTime(0, time);
        this.__envNode.gain.linearRampToValueAtTime(1, time + clickAttack);
        this.__envNode.gain.exponentialRampToValueAtTime(1e-7, time + clickAttack + clickRelease);
        this.__envNode.gain.setValueAtTime(0, time);
        this.__envNode.connect(this.__gainNode);
        this.__osc = audioContext.createOscillator();
        this.__osc.frequency.value = this.clickFreq;
        this.__osc.start(0);
        this.__osc.stop(time + clickAttack + clickRelease);
        this.__osc.connect(this.__envNode);
      }},
    gain: {
      set: function(value) {
        this.__gainNode.gain.value = value;
      },
      get: function() {
        return this.__gainNode.gain.value;
      }
    },
    phase: {
      set: function(phase) {
        this.__phase = phase - Math.floor(phase);
        this.resetNextPosition();
      },
      get: function() {
        return this.__phase;
      }
    }
  });
  return Metronome;
})(TimeEngine);
module.exports = Metronome;


//# sourceURL=/Users/rvincent/audio/dist/engines/metronome.js
},{"../core/time-engine":3,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],6:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
var PlayerEngine = (function(_TimeEngine) {
  function PlayerEngine(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, PlayerEngine);
    _get(_core.Object.getPrototypeOf(PlayerEngine.prototype), "constructor", this).call(this, audioContext);
    this.transport = null;
    this.buffer = options.buffer || null;
    this.fadeTime = 0.005;
    this.__time = 0;
    this.__position = 0;
    this.__speed = 0;
    this.__cyclic = false;
    this.__bufferSource = null;
    this.__envNode = null;
    this.__playingSpeed = 1;
    this.__gainNode = this.audioContext.createGain();
    this.__gainNode.gain.value = options.gain || 1;
    this.outputNode = this.__gainNode;
  }
  _inherits(PlayerEngine, _TimeEngine);
  _createClass(PlayerEngine, {
    __start: {value: function __start(time, position, speed) {
        var audioContext = this.audioContext;
        if (this.buffer) {
          var bufferDuration = this.buffer.duration;
          if (this.buffer.wrapAroundExtension)
            bufferDuration -= this.buffer.wrapAroundExtension;
          if (this.__cyclic && (position < 0 || position >= bufferDuration)) {
            var phase = position / bufferDuration;
            position = (phase - Math.floor(phase)) * bufferDuration;
          }
          if (position >= 0 && position < bufferDuration && speed > 0) {
            this.__envNode = audioContext.createGain();
            this.__envNode.gain.setValueAtTime(0, time);
            this.__envNode.gain.linearRampToValueAtTime(1, time + this.fadeTime);
            this.__envNode.connect(this.__gainNode);
            this.__bufferSource = audioContext.createBufferSource();
            this.__bufferSource.buffer = this.buffer;
            this.__bufferSource.playbackRate.value = speed;
            this.__bufferSource.loop = this.__cyclic;
            this.__bufferSource.loopStart = 0;
            this.__bufferSource.loopEnd = bufferDuration;
            this.__bufferSource.start(time, position);
            this.__bufferSource.connect(this.__envNode);
          }
        }
      }},
    __halt: {value: function __halt(time) {
        if (this.__bufferSource) {
          this.__envNode.gain.cancelScheduledValues(time);
          this.__envNode.gain.setValueAtTime(this.__envNode.gain.value, time);
          this.__envNode.gain.linearRampToValueAtTime(0, time + this.fadeTime);
          this.__bufferSource.stop(time + this.fadeTime);
          this.__bufferSource = null;
          this.__envNode = null;
        }
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        var seek = arguments[3] === undefined ? false : arguments[3];
        var lastSpeed = this.__speed;
        if (speed !== lastSpeed || seek) {
          if (seek || lastSpeed * speed < 0) {
            this.__halt(time);
            this.__start(time, position, speed);
          } else if (lastSpeed === 0 || seek) {
            this.__start(time, position, speed);
          } else if (speed === 0) {
            this.__halt(time);
          } else if (this.__bufferSource) {
            this.__bufferSource.playbackRate.setValueAtTime(speed, time);
          }
          this.__speed = speed;
        }
      }},
    cyclic: {
      set: function(cyclic) {
        if (cyclic !== this.__cyclic) {
          var time = this.currentTime;
          var position = this.currentosition;
          this.__halt(time);
          this.__cyclic = cyclic;
          if (this.__speed !== 0)
            this.__start(time, position, this.__speed);
        }
      },
      get: function() {
        return this.__cyclic;
      }
    },
    gain: {
      set: function(value) {
        var time = this.__sync();
        this.__gainNode.cancelScheduledValues(time);
        this.__gainNode.setValueAtTime(this.__gainNode.gain.value, time);
        this.__gainNode.linearRampToValueAtTime(0, time + this.fadeTime);
      },
      get: function() {
        return this.__gainNode.gain.value;
      }
    }
  });
  return PlayerEngine;
})(TimeEngine);
module.exports = PlayerEngine;


//# sourceURL=/Users/rvincent/audio/dist/engines/player-engine.js
},{"../core/time-engine":3,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],7:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
function getCurrentOrPreviousIndex(sortedArray, value) {
  var index = arguments[2] === undefined ? 0 : arguments[2];
  var size = sortedArray.length;
  if (size > 0) {
    var firstVal = sortedArray[0];
    var lastVal = sortedArray[size - 1];
    if (value < firstVal)
      index = -1;
    else if (value >= lastVal)
      index = size - 1;
    else {
      if (index < 0 || index >= size)
        index = Math.floor((size - 1) * (value - firstVal) / (lastVal - firstVal));
      while (sortedArray[index] > value)
        index--;
      while (sortedArray[index + 1] <= value)
        index++;
    }
  }
  return index;
}
function getCurrentOrNextIndex(sortedArray, value) {
  var index = arguments[2] === undefined ? 0 : arguments[2];
  var size = sortedArray.length;
  if (size > 0) {
    var firstVal = sortedArray[0];
    var lastVal = sortedArray[size - 1];
    if (value <= firstVal)
      index = 0;
    else if (value >= lastVal)
      index = size;
    else {
      if (index < 0 || index >= size)
        index = Math.floor((size - 1) * (value - firstVal) / (lastVal - firstVal));
      while (sortedArray[index] < value)
        index++;
      while (sortedArray[index + 1] >= value)
        index--;
    }
  }
  return index;
}
var SegmentEngine = (function(_TimeEngine) {
  function SegmentEngine(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, SegmentEngine);
    _get(_core.Object.getPrototypeOf(SegmentEngine.prototype), "constructor", this).call(this, audioContext);
    this.buffer = options.buffer || null;
    this.periodAbs = options.periodAbs || 0.1;
    this.periodRel = options.periodRel || 0;
    this.periodVar = options.periodVar || 0;
    this.positionArray = options.positionArray || [0];
    this.positionVar = options.positionVar || 0;
    this.durationArray = options.durationArray || [0];
    this.durationAbs = options.durationAbs || 0;
    this.durationRel = options.durationRel || 1;
    this.offsetArray = options.offsetArray || [0];
    this.offsetAbs = options.offsetAbs || -0.005;
    this.offsetRel = options.offsetRel || 0;
    this.delay = options.delay || 0.005;
    this.attackAbs = options.attackAbs || 0.005;
    this.attackRel = options.attackRel || 0;
    this.releaseAbs = options.releaseAbs || 0.005;
    this.releaseRel = options.releaseRel || 0;
    this.resampling = options.resampling || 0;
    this.resamplingVar = options.resamplingVar || 0;
    this.segmentIndex = options.segmentIndex || 0;
    this.cyclic = options.cyclic || false;
    this.__cyclicOffset = 0;
    this.__gainNode = audioContext.createGain();
    this.__gainNode.gain.value = options.gain || 1;
    this.outputNode = this.__gainNode;
  }
  _inherits(SegmentEngine, _TimeEngine);
  _createClass(SegmentEngine, {
    bufferDuration: {get: function() {
        var bufferDuration = this.buffer.duration;
        if (this.buffer.wrapAroundExtention)
          bufferDuration -= this.buffer.wrapAroundExtention;
        return bufferDuration;
      }},
    advanceTime: {value: function advanceTime(time, position, speed) {
        return time + this.trigger(time);
      }},
    syncPosition: {value: function syncPosition(time, position, speed) {
        var index = this.segmentIndex;
        var cyclicOffset = 0;
        var bufferDuration = this.bufferDuration;
        if (this.cyclic) {
          var cycles = position / bufferDuration;
          cyclicOffset = Math.floor(cycles) * bufferDuration;
          position -= cyclicOffset;
        }
        if (speed > 0) {
          index = getCurrentOrNextIndex(this.positionArray, position);
          if (index >= this.positionArray.length) {
            index = 0;
            cyclicOffset += bufferDuration;
            if (!this.cyclic) {
              return Infinity;
            }
          }
        } else if (speed < 0) {
          index = getCurrentOrPreviousIndex(this.positionArray, position);
          if (index < 0) {
            index = this.positionArray.length - 1;
            cyclicOffset -= bufferDuration;
            if (!this.cyclic) {
              return -Infinity;
            }
          }
        } else {
          return Infinity;
        }
        this.segmentIndex = index;
        this.__cyclicOffset = cyclicOffset;
        return cyclicOffset + this.positionArray[index];
      }},
    advancePosition: {value: function advancePosition(time, position, speed) {
        var index = this.segmentIndex;
        var cyclicOffset = this.__cyclicOffset;
        this.trigger(time);
        if (speed > 0) {
          index++;
          if (index >= this.positionArray.length) {
            index = 0;
            cyclicOffset += this.bufferDuration;
            if (!this.cyclic) {
              return Infinity;
            }
          }
        } else {
          index--;
          if (index < 0) {
            index = this.positionArray.length - 1;
            cyclicOffset -= this.bufferDuration;
            if (!this.cyclic) {
              return -Infinity;
            }
          }
        }
        this.segmentIndex = index;
        this.__cyclicOffset = cyclicOffset;
        return cyclicOffset + this.positionArray[index];
      }},
    gain: {
      set: function(value) {
        this.__gainNode.gain.value = value;
      },
      get: function() {
        return this.__gainNode.gain.value;
      }
    },
    trigger: {value: function trigger(audioTime) {
        var audioContext = this.audioContext;
        var segmentTime = audioTime || audioContext.currentTime + this.delay;
        var segmentPeriod = this.periodAbs;
        var segmentIndex = this.segmentIndex;
        if (this.buffer) {
          var segmentPosition = 0;
          var segmentDuration = 0;
          var segmentOffset = 0;
          var resamplingRate = 1;
          var bufferDuration = this.bufferDuration;
          if (this.cyclic)
            segmentIndex = segmentIndex % this.positionArray.length;
          else
            segmentIndex = Math.max(0, Math.min(segmentIndex, this.positionArray.length - 1));
          if (this.positionArray)
            segmentPosition = this.positionArray[segmentIndex] || 0;
          if (this.durationArray)
            segmentDuration = this.durationArray[segmentIndex] || 0;
          if (this.offsetArray)
            segmentOffset = this.offsetArray[segmentIndex] || 0;
          if (this.resampling !== 0 || this.resamplingVar > 0) {
            var randomResampling = (Math.random() - 0.5) * 2 * this.resamplingVar;
            resamplingRate = Math.pow(2, (this.resampling + randomResampling) / 1200);
          }
          if (segmentDuration === 0 || this.periodRel > 0) {
            var nextSegementIndex = segmentIndex + 1;
            var nextPosition,
                nextOffset;
            if (nextSegementIndex === this.positionArray.length) {
              if (this.cyclic) {
                nextPosition = this.positionArray[0] + bufferDuration;
                nextOffset = this.offsetArray[0];
              } else {
                nextPosition = bufferDuration;
                nextOffset = 0;
              }
            } else {
              nextPosition = this.positionArray[nextSegementIndex];
              nextOffset = this.offsetArray[nextSegementIndex];
            }
            var interSegmentDistance = nextPosition - segmentPosition;
            if (segmentOffset > 0)
              interSegmentDistance -= segmentOffset;
            if (nextOffset > 0)
              interSegmentDistance += nextOffset;
            if (interSegmentDistance < 0)
              interSegmentDistance = 0;
            if (segmentDuration === 0)
              segmentDuration = interSegmentDistance;
            segmentPeriod += this.periodRel * interSegmentDistance;
          }
          segmentDuration *= this.durationRel;
          segmentDuration += this.durationAbs;
          segmentOffset *= this.offsetRel;
          segmentOffset += this.offsetAbs;
          if (segmentOffset < 0) {
            segmentDuration -= segmentOffset;
            segmentPosition += segmentOffset;
            segmentTime += segmentOffset / resamplingRate;
          } else {
            segmentTime -= segmentOffset / resamplingRate;
          }
          if (this.positionVar > 0)
            segmentPosition += 2 * (Math.random() - 0.5) * this.positionVar;
          if (segmentPosition < 0) {
            segmentDuration += segmentPosition;
            segmentPosition = 0;
          }
          if (segmentPosition + segmentDuration > this.buffer.duration)
            segmentDuration = this.buffer.duration - segmentPosition;
          if (this.gain > 0 && segmentDuration > 0) {
            var envelopeNode = audioContext.createGain();
            var attack = this.attackAbs + this.attackRel * segmentDuration;
            var release = this.releaseAbs + this.releaseRel * segmentDuration;
            if (attack + release > segmentDuration) {
              var factor = segmentDuration / (attack + release);
              attack *= factor;
              release *= factor;
            }
            var attackEndTime = segmentTime + attack;
            var segmentEndTime = segmentTime + segmentDuration;
            var releaseStartTime = segmentEndTime - release;
            envelopeNode.gain.value = this.gain;
            envelopeNode.gain.setValueAtTime(0, segmentTime);
            envelopeNode.gain.linearRampToValueAtTime(this.gain, attackEndTime);
            if (releaseStartTime > attackEndTime)
              envelopeNode.gain.setValueAtTime(this.gain, releaseStartTime);
            envelopeNode.gain.linearRampToValueAtTime(0, segmentEndTime);
            envelopeNode.connect(this.__gainNode);
            var source = audioContext.createBufferSource();
            source.buffer = this.buffer;
            source.playbackRate.value = resamplingRate;
            source.connect(envelopeNode);
            envelopeNode.connect(this.__gainNode);
            source.start(segmentTime, segmentPosition);
            source.stop(segmentTime + segmentDuration / resamplingRate);
          }
        }
        return segmentPeriod;
      }}
  });
  return SegmentEngine;
})(TimeEngine);
module.exports = SegmentEngine;


//# sourceURL=/Users/rvincent/audio/dist/engines/segment-engine.js
},{"../core/time-engine":3,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],8:[function(require,module,exports){
"use strict";
"use strict";
var Scheduler = require("./scheduler");
var SimpleScheduler = require("./simple-scheduler");
var scheduler = null;
var simpleScheduler = null;
module.exports.getScheduler = function(audioContext) {
  if (scheduler === null) {
    scheduler = new Scheduler(audioContext, {});
  }
  return scheduler;
};
module.exports.getSimpleScheduler = function(audioContext) {
  if (simpleScheduler === null) {
    simpleScheduler = new SimpleScheduler(audioContext, {});
  }
  return simpleScheduler;
};


//# sourceURL=/Users/rvincent/audio/dist/masters/factories.js
},{"./scheduler":10,"./simple-scheduler":11}],9:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
var _require = require("./factories");
var getScheduler = _require.getScheduler;
var PlayControlSchedulerHook = (function(_TimeEngine) {
  function PlayControlSchedulerHook(playControl) {
    _classCallCheck(this, PlayControlSchedulerHook);
    _get(_core.Object.getPrototypeOf(PlayControlSchedulerHook.prototype), "constructor", this).call(this);
    this.__playControl = playControl;
  }
  _inherits(PlayControlSchedulerHook, _TimeEngine);
  _createClass(PlayControlSchedulerHook, {advanceTime: {value: function advanceTime(time) {
        var playControl = this.__playControl;
        var position = playControl.__getPositionAtTime(time);
        var nextPosition = playControl.__engine.advancePosition(time, position, playControl.__speed);
        if (nextPosition !== Infinity) {
          return playControl.__getTimeAtPosition(nextPosition);
        }
        return Infinity;
      }}});
  return PlayControlSchedulerHook;
})(TimeEngine);
var PlayControlLoopControl = (function(_TimeEngine2) {
  function PlayControlLoopControl(playControl) {
    _classCallCheck(this, PlayControlLoopControl);
    _get(_core.Object.getPrototypeOf(PlayControlLoopControl.prototype), "constructor", this).call(this);
    this.__playControl = playControl;
    this.speed = null;
  }
  _inherits(PlayControlLoopControl, _TimeEngine2);
  _createClass(PlayControlLoopControl, {advanceTime: {value: function advanceTime(time) {
        if (this.speed > 0) {
          this.__playControl.syncSpeed(time, this.__playControl.__loopStart, this.speed, true);
          return this.__playControl.__getTimeAtPosition(this.__playControl.__loopEnd);
        } else if (this.speed < 0) {
          this.__playControl.syncSpeed(time, this.__playControl.__loopEnd, this.speed, true);
          return this.__playControl.__getTimeAtPosition(this.__playControl.__loopStart);
        }
        return Infinity;
      }}});
  return PlayControlLoopControl;
})(TimeEngine);
var PlayControl = (function(_TimeEngine3) {
  function PlayControl(engine) {
    var _this = this;
    _classCallCheck(this, PlayControl);
    _get(_core.Object.getPrototypeOf(PlayControl.prototype), "constructor", this).call(this, engine.audioContext);
    this.scheduler = getScheduler(engine.audioContext);
    this.__engine = null;
    this.__interface = null;
    this.__schedulerHook = null;
    this.__loopControl = null;
    this.__loopStart = 0;
    this.__loopEnd = Infinity;
    this.__time = 0;
    this.__position = 0;
    this.__speed = 0;
    this.__nextPosition = Infinity;
    this.__playingSpeed = 1;
    if (engine.master)
      throw new Error("object has already been added to a master");
    var speed = this.__speed;
    var getCurrentTime = function() {
      return _this.currentTime;
    };
    var getCurrentPosition = function() {
      return _this.currentPosition;
    };
    if (engine.implementsSpeedControlled()) {
      this.__engine = engine;
      this.__interface = "speed-controlled";
      engine.setSpeedControlled(this, getCurrentTime, getCurrentPosition);
    } else if (engine.implementsTransported()) {
      this.__engine = engine;
      this.__interface = "transported";
      engine.setTransported(this, 0, function() {
        var nextEnginePosition = arguments[0] === undefined ? null : arguments[0];
        if (nextEnginePosition === null) {
          var time = _this.scheduler.currentTime;
          var position = _this.__getPositionAtTime(time);
          nextEnginePosition = engine.syncPosition(time, position, _this.__speed);
        }
        _this.__resetNextPosition(nextEnginePosition);
      }, getCurrentTime, getCurrentPosition);
    } else if (engine.implementsScheduled()) {
      this.__engine = engine;
      this.__interface = "scheduled";
      this.scheduler.add(engine, Infinity, getCurrentPosition);
    } else {
      throw new Error("object cannot be added to play control");
    }
  }
  _inherits(PlayControl, _TimeEngine3);
  _createClass(PlayControl, {
    __getTimeAtPosition: {value: function __getTimeAtPosition(position) {
        return this.__time + (position - this.__position) / this.__speed;
      }},
    __getPositionAtTime: {value: function __getPositionAtTime(time) {
        return this.__position + (time - this.__time) * this.__speed;
      }},
    __sync: {value: function __sync() {
        var now = this.currentTime;
        this.__position += (now - this.__time) * this.__speed;
        this.__time = now;
        return now;
      }},
    __resetNextPosition: {value: function __resetNextPosition(nextPosition) {
        if (this.__schedulerHook)
          this.__schedulerHook.resetNextTime(this.__getTimeAtPosition(nextPosition));
        this.__nextPosition = nextPosition;
      }},
    currentTime: {get: function() {
        return this.scheduler.currentTime;
      }},
    currentPosition: {get: function() {
        return this.__position + (this.scheduler.currentTime - this.__time) * this.__speed;
      }},
    loop: {
      set: function(enable) {
        if (enable) {
          if (this.__loopStart > -Infinity && this.__loopEnd < Infinity) {
            this.__loopControl = new PlayControlLoopControl(this);
            this.scheduler.add(this.__loopControl, Infinity);
          }
        } else if (this.__loopControl) {
          this.scheduler.remove(this.__loopControl);
          this.__loopControl = null;
        }
      },
      get: function() {
        return !!this.__loopControl;
      }
    },
    setLoopBoundaries: {value: function setLoopBoundaries(start, end) {
        if (end >= start) {
          this.__loopStart = start;
          this.__loopEnd = end;
        } else {
          this.__loopStart = end;
          this.__loopEnd = start;
        }
        this.loop = this.loop;
      }},
    loopStart: {
      set: function(startTime) {
        this.setLoopBoundaries(startTime, this.__loopEnd);
      },
      get: function() {
        return this.__loopStart;
      }
    },
    loopEnd: {
      set: function(endTime) {
        this.setLoopBoundaries(this.__loopStart, endTime);
      },
      get: function() {
        return this.__loopEnd;
      }
    },
    __applyLoopBoundaries: {value: function __applyLoopBoundaries(position, speed, seek) {
        if (this.__loopControl) {
          if (speed > 0 && position >= this.__loopEnd) {
            return this.__loopStart + (position - this.__loopStart) % (this.__loopEnd - this.__loopStart);
          } else if (speed < 0 && position < this.__loopStart) {
            return this.__loopEnd - (this.__loopEnd - position) % (this.__loopEnd - this.__loopStart);
          }
        }
        return position;
      }},
    __rescheduleLoopControl: {value: function __rescheduleLoopControl(position, speed) {
        if (this.__loopControl) {
          if (speed > 0) {
            this.__loopControl.speed = speed;
            this.scheduler.reset(this.__loopControl, this.__getTimeAtPosition(this.__loopEnd));
          } else if (speed < 0) {
            this.__loopControl.speed = speed;
            this.scheduler.reset(this.__loopControl, this.__getTimeAtPosition(this.__loopStart));
          } else {
            this.scheduler.reset(this.__loopControl, Infinity);
          }
        }
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        var seek = arguments[3] === undefined ? false : arguments[3];
        var lastSpeed = this.__speed;
        if (speed !== lastSpeed || seek) {
          if (seek || lastSpeed === 0)
            position = this.__applyLoopBoundaries(position, speed);
          this.__time = time;
          this.__position = position;
          this.__speed = speed;
          switch (this.__interface) {
            case "speed-controlled":
              this.__engine.syncSpeed(time, position, speed, seek);
              break;
            case "transported":
              var nextPosition = this.__nextPosition;
              if (seek) {
                nextPosition = this.__engine.syncPosition(time, position, speed);
              } else if (lastSpeed === 0) {
                nextPosition = this.__engine.syncPosition(time, position, speed);
                this.__schedulerHook = new PlayControlSchedulerHook(this);
                this.scheduler.add(this.__schedulerHook, Infinity);
              } else if (speed === 0) {
                nextPosition = Infinity;
                if (this.__engine.syncSpeed)
                  this.__engine.syncSpeed(time, position, 0);
                this.scheduler.remove(this.__schedulerHook);
                this.__schedulerHook = null;
              } else if (speed * lastSpeed < 0) {
                nextPosition = this.__engine.syncPosition(time, position, speed);
              } else if (this.__engine.syncSpeed) {
                this.__engine.syncSpeed(time, position, speed);
              }
              this.__resetNextPosition(nextPosition);
              break;
            case "scheduled":
              if (lastSpeed === 0)
                this.__scheduledEngine.resetNextTime(0);
              else if (speed === 0)
                this.__scheduledEngine.resetNextTime(Infinity);
              break;
          }
          this.__rescheduleLoopControl(position, speed);
        }
      }},
    start: {value: function start() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, this.__playingSpeed);
      }},
    pause: {value: function pause() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
      }},
    stop: {value: function stop() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
        this.seek(0);
      }},
    speed: {
      set: function(speed) {
        var time = this.__sync();
        if (speed >= 0) {
          if (speed < 0.0625)
            speed = 0.0625;
          else if (speed > 16)
            speed = 16;
        } else {
          if (speed < -16)
            speed = -16;
          else if (speed > -0.0625)
            speed = -0.0625;
        }
        this.__playingSpeed = speed;
        if (this.__speed !== 0)
          this.syncSpeed(time, this.__position, speed);
      },
      get: function() {
        return this.__playingSpeed;
      }
    },
    seek: {value: function seek(position) {
        if (position !== this.__position) {
          var time = this.__sync();
          this.__position = position;
          this.syncSpeed(time, position, this.__speed, true);
        }
      }},
    clear: {value: function clear() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
        this.__engine.resetInterface();
      }}
  });
  return PlayControl;
})(TimeEngine);
module.exports = PlayControl;


//# sourceURL=/Users/rvincent/audio/dist/masters/play-control.js
},{"../core/time-engine":3,"./factories":8,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],10:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var PriorityQueue = require("../utils/priority-queue-heap");
var TimeEngine = require("../core/time-engine");
function arrayRemove(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
var Scheduler = (function() {
  function Scheduler(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, Scheduler);
    this.audioContext = audioContext;
    this.__queue = new PriorityQueue();
    this.__engines = [];
    this.__currentTime = null;
    this.__nextTime = Infinity;
    this.__timeout = null;
    this.period = options.period || 0.025;
    this.lookahead = options.lookahead || 0.1;
  }
  _createClass(Scheduler, {
    __tick: {value: function __tick() {
        var audioContext = this.audioContext;
        var nextTime = this.__nextTime;
        this.__timeout = null;
        while (nextTime <= audioContext.currentTime + this.lookahead) {
          this.__currentTime = nextTime;
          var engine = this.__queue.head;
          var time = engine.advanceTime(this.__currentTime);
          if (time && time < Infinity) {
            nextTime = this.__queue.move(engine, Math.max(time, this.__currentTime));
          } else {
            nextTime = this.__queue.remove(engine);
            if (!time && engine.master === this) {
              engine.resetInterface();
            }
          }
        }
        this.__currentTime = null;
        this.__reschedule(nextTime);
      }},
    __reschedule: {value: function __reschedule(nextTime) {
        var _this = this;
        if (this.__timeout) {
          clearTimeout(this.__timeout);
          this.__timeout = null;
        }
        if (nextTime !== Infinity) {
          this.__nextTime = nextTime;
          var timeOutDelay = Math.max(nextTime - this.audioContext.currentTime - this.lookahead, this.period);
          this.__timeout = setTimeout(function() {
            _this.__tick();
          }, timeOutDelay * 1000);
        }
      }},
    currentTime: {get: function() {
        return this.__currentTime || this.audioContext.currentTime + this.lookahead;
      }},
    add: {value: function add(engine) {
        var _this = this;
        var time = arguments[1] === undefined ? this.currentTime : arguments[1];
        var getCurrentPosition = arguments[2] === undefined ? null : arguments[2];
        if (engine instanceof Function) {
          engine = {advanceTime: engine};
        } else {
          if (!engine.implementsScheduled())
            throw new Error("object cannot be added to scheduler");
          if (engine.master)
            throw new Error("object has already been added to a master");
          this.__engines.push(engine);
          engine.setScheduled(this, function(time) {
            var nextTime = _this.__queue.move(engine, time);
            _this.__reschedule(nextTime);
          }, function() {
            return _this.currentTime;
          }, getCurrentPosition);
        }
        var nextTime = this.__queue.insert(engine, time);
        this.__reschedule(nextTime);
        return engine;
      }},
    remove: {value: function remove(engine) {
        var master = engine.master;
        if (master) {
          if (master !== this)
            throw new Error("object has not been added to this scheduler");
          engine.resetInterface();
          arrayRemove(this.__engines, engine);
        }
        var nextTime = this.__queue.remove(engine);
        this.__reschedule(nextTime);
      }},
    reset: {value: function reset(engine, time) {
        var nextTime = this.__queue.move(engine, time);
        this.__reschedule(nextTime);
      }},
    clear: {value: function clear() {
        if (this.__timeout) {
          clearTimeout(this.__timeout);
          this.__timeout = null;
        }
        this.__queue.clear();
        this.__engines.length = 0;
      }}
  });
  return Scheduler;
})();
module.exports = Scheduler;


//# sourceURL=/Users/rvincent/audio/dist/masters/scheduler.js
},{"../core/time-engine":3,"../utils/priority-queue-heap":16,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29}],11:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var TimeEngine = require("../core/time-engine");
function arrayRemove(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
var SimpleScheduler = (function() {
  function SimpleScheduler(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, SimpleScheduler);
    this.audioContext = audioContext;
    this.__engines = [];
    this.__schedEngines = [];
    this.__schedTimes = [];
    this.__currentTime = null;
    this.__timeout = null;
    this.period = options.period || 0.025;
    this.lookahead = options.lookahead || 0.1;
  }
  _createClass(SimpleScheduler, {
    __scheduleEngine: {value: function __scheduleEngine(engine, time) {
        this.__schedEngines.push(engine);
        this.__schedTimes.push(time);
      }},
    __rescheduleEngine: {value: function __rescheduleEngine(engine, time) {
        var index = this.__schedEngines.indexOf(engine);
        if (index >= 0) {
          if (time !== Infinity) {
            this.__schedTimes[index] = time;
          } else {
            this.__schedEngines.splice(index, 1);
            this.__schedTimes.splice(index, 1);
          }
        }
      }},
    __unscheduleEngine: {value: function __unscheduleEngine(engine) {
        var index = this.__schedEngines.indexOf(engine);
        if (index >= 0) {
          this.__schedEngines.splice(index, 1);
          this.__schedTimes.splice(index, 1);
        }
      }},
    __resetTick: {value: function __resetTick() {
        if (this.__schedEngines.length > 0) {
          if (!this.__timeout)
            this.__tick();
        } else if (this.__timeout) {
          clearTimeout(this.__timeout);
          this.__timeout = null;
        }
      }},
    __tick: {value: function __tick() {
        var _this = this;
        var audioContext = this.audioContext;
        var i = 0;
        while (i < this.__schedEngines.length) {
          var engine = this.__schedEngines[i];
          var time = this.__schedTimes[i];
          while (time && time <= audioContext.currentTime + this.lookahead) {
            time = Math.max(time, audioContext.currentTime);
            this.__currentTime = time;
            time = engine.advanceTime(time);
          }
          if (time && time < Infinity) {
            this.__schedTimes[i++] = time;
          } else {
            this.__unscheduleEngine(engine);
            if (!time && arrayRemove(this.__engines, engine))
              engine.resetInterface();
          }
        }
        this.__currentTime = null;
        this.__timeout = null;
        if (this.__schedEngines.length > 0) {
          this.__timeout = setTimeout(function() {
            _this.__tick();
          }, this.period * 1000);
        }
      }},
    currentTime: {get: function() {
        return this.__currentTime || this.audioContext.currentTime + this.lookahead;
      }},
    callback: {value: function callback(callbackFunction) {
        var time = arguments[1] === undefined ? this.currentTime : arguments[1];
        var engineWrapper = {advanceTime: callbackFunction};
        this.__scheduleEngine(engineWrapper, time);
        this.__resetTick();
        return engineWrapper;
      }},
    add: {value: function add(engine) {
        var _this = this;
        var time = arguments[1] === undefined ? this.currentTime : arguments[1];
        var getCurrentPosition = arguments[2] === undefined ? null : arguments[2];
        if (engine instanceof Function) {
          engine = {advanceTime: engine};
        } else {
          if (!engine.implementsScheduled())
            throw new Error("object cannot be added to scheduler");
          if (engine.master)
            throw new Error("object has already been added to a master");
          this.__engines.push(engine);
          engine.setScheduled(this, function(time) {
            _this.__rescheduleEngine(engine, time);
            _this.__resetTick();
          }, function() {
            return _this.currentTime;
          }, getCurrentPosition);
        }
        this.__scheduleEngine(engine, time);
        this.__resetTick();
        return engine;
      }},
    remove: {value: function remove(engine) {
        var master = engine.master;
        if (master) {
          if (master !== this)
            throw new Error("object has not been added to this scheduler");
          engine.resetInterface();
          arrayRemove(this.__engines, engine);
        }
        this.__unscheduleEngine(engine);
        this.__resetTick();
      }},
    reset: {value: function reset(engine, time) {
        this.__rescheduleEngine(engine, time);
        this.__resetTick();
      }},
    clear: {value: function clear() {
        if (this.__timeout) {
          clearTimeout(this.__timeout);
          this.__timeout = null;
        }
        this.__schedEngines.length = 0;
        this.__schedTimes.length = 0;
      }}
  });
  return SimpleScheduler;
})();
module.exports = SimpleScheduler;


//# sourceURL=/Users/rvincent/audio/dist/masters/simple-scheduler.js
},{"../core/time-engine":3,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29}],12:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _core = require("babel-runtime/core-js")["default"];
var TimeEngine = require("../core/time-engine");
var PriorityQueue = require("../utils/priority-queue-heap");
var _require = require("./factories");
var getScheduler = _require.getScheduler;
function removeCouple(firstArray, secondArray, firstElement) {
  var index = firstArray.indexOf(firstElement);
  if (index >= 0) {
    var secondElement = secondArray[index];
    firstArray.splice(index, 1);
    secondArray.splice(index, 1);
    return secondElement;
  }
  return null;
}
var Transported = (function(_TimeEngine) {
  function Transported(transport, engine, startPosition, endPosition, offsetPosition) {
    _classCallCheck(this, Transported);
    this.__transport = transport;
    this.__engine = engine;
    this.__startPosition = startPosition;
    this.__endPosition = endPosition;
    this.__offsetPosition = offsetPosition;
    this.__scalePosition = 1;
    this.__haltPosition = Infinity;
  }
  _inherits(Transported, _TimeEngine);
  _createClass(Transported, {
    setBoundaries: {value: function setBoundaries(startPosition, endPosition) {
        var _this = this;
        var offsetPosition = arguments[2] === undefined ? startPosition : arguments[2];
        var scalePosition = arguments[3] === undefined ? 1 : arguments[3];
        return (function() {
          _this.__startPosition = startPosition;
          _this.__endPosition = endPosition;
          _this.__offsetPosition = offsetPosition;
          _this.__scalePosition = scalePosition;
          _this.resetNextPosition();
        })();
      }},
    start: {value: function start(time, position, speed) {}},
    stop: {value: function stop(time, position) {}},
    syncPosition: {value: function syncPosition(time, position, speed) {
        if (speed > 0) {
          if (position < this.__startPosition) {
            if (this.__haltPosition === null)
              this.stop(time, position - this.__offsetPosition);
            this.__haltPosition = this.__endPosition;
            return this.__startPosition;
          } else if (position <= this.__endPosition) {
            this.start(time, position - this.__offsetPosition, speed);
            this.__haltPosition = null;
            return this.__endPosition;
          }
        } else {
          if (position >= this.__endPosition) {
            if (this.__haltPosition === null)
              this.stop(time, position - this.__offsetPosition);
            this.__haltPosition = this.__startPosition;
            return this.__endPosition;
          } else if (position > this.__startPosition) {
            this.start(time, position - this.__offsetPosition, speed);
            this.__haltPosition = null;
            return this.__startPosition;
          }
        }
        if (this.__haltPosition === null)
          this.stop(time, position);
        this.__haltPosition = Infinity;
        return Infinity;
      }},
    advancePosition: {value: function advancePosition(time, position, speed) {
        var haltPosition = this.__haltPosition;
        if (haltPosition !== null) {
          this.start(time, position - this.__offsetPosition, speed);
          this.__haltPosition = null;
          return haltPosition;
        }
        if (this.__haltPosition === null)
          this.stop(time, position - this.__offsetPosition);
        this.__haltPosition = Infinity;
        return Infinity;
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        if (speed === 0)
          this.stop(time, position - this.__offsetPosition);
      }},
    destroy: {value: function destroy() {
        this.__transport = null;
        this.__engine = null;
      }}
  });
  return Transported;
})(TimeEngine);
var TransportedTransported = (function(_Transported) {
  function TransportedTransported(transport, engine, startPosition, endPosition, offsetPosition) {
    var _this = this;
    _classCallCheck(this, TransportedTransported);
    _get(_core.Object.getPrototypeOf(TransportedTransported.prototype), "constructor", this).call(this, transport, engine, startPosition, endPosition, offsetPosition);
    engine.setTransported(this, function() {
      var nextEnginePosition = arguments[0] === undefined ? null : arguments[0];
      if (nextEnginePosition !== null)
        nextEnginePosition += _this.__offsetPosition;
      _this.resetNextPosition(nextEnginePosition);
    }, function() {
      return _this.__transport.scheduler.currentTime;
    }, function() {
      return _this.__transport.currentPosition - _this.__offsetPosition;
    });
  }
  _inherits(TransportedTransported, _Transported);
  _createClass(TransportedTransported, {
    syncPosition: {value: function syncPosition(time, position, speed) {
        if (speed > 0 && position < this.__endPosition)
          position = Math.max(position, this.__startPosition);
        else if (speed < 0 && position >= this.__startPosition)
          position = Math.min(position, this.__endPosition);
        return this.__offsetPosition + this.__engine.syncPosition(time, position - this.__offsetPosition, speed);
      }},
    advancePosition: {value: function advancePosition(time, position, speed) {
        position = this.__offsetPosition + this.__engine.advancePosition(time, position - this.__offsetPosition, speed);
        if (speed > 0 && position < this.__endPosition || speed < 0 && position >= this.__startPosition) {
          return position;
        }
        return Infinity;
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        if (this.__engine.syncSpeed)
          this.__engine.syncSpeed(time, position, speed);
      }},
    destroy: {value: function destroy() {
        this.__engine.resetInterface();
        _get(_core.Object.getPrototypeOf(TransportedTransported.prototype), "destroy", this).call(this);
      }}
  });
  return TransportedTransported;
})(Transported);
var TransportedSpeedControlled = (function(_Transported2) {
  function TransportedSpeedControlled(transport, engine, startPosition, endPosition, offsetPosition) {
    var _this = this;
    _classCallCheck(this, TransportedSpeedControlled);
    _get(_core.Object.getPrototypeOf(TransportedSpeedControlled.prototype), "constructor", this).call(this, transport, engine, startPosition, endPosition, offsetPosition);
    engine.setSpeedControlled(this, function() {
      return _this.__transport.scheduler.currentTime;
    }, function() {
      return _this.__transport.currentPosition - _this.__offsetPosition;
    });
  }
  _inherits(TransportedSpeedControlled, _Transported2);
  _createClass(TransportedSpeedControlled, {
    start: {value: function start(time, position, speed) {
        this.__engine.syncSpeed(time, position, speed, true);
      }},
    stop: {value: function stop(time, position) {
        this.__engine.syncSpeed(time, position, 0);
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        if (this.__haltPosition === null)
          this.__engine.syncSpeed(time, position, speed);
      }},
    destroy: {value: function destroy() {
        this.__engine.syncSpeed(this.__transport.currentTime, this.__transport.currentPosition - this.__offsetPosition, 0);
        this.__engine.resetInterface();
        _get(_core.Object.getPrototypeOf(TransportedSpeedControlled.prototype), "destroy", this).call(this);
      }}
  });
  return TransportedSpeedControlled;
})(Transported);
var TransportedScheduled = (function(_Transported3) {
  function TransportedScheduled(transport, engine, startPosition, endPosition, offsetPosition) {
    var _this = this;
    _classCallCheck(this, TransportedScheduled);
    _get(_core.Object.getPrototypeOf(TransportedScheduled.prototype), "constructor", this).call(this, transport, engine, startPosition, endPosition, offsetPosition);
    this.__transport.scheduler.add(engine, Infinity, function() {
      return (_this.__transport.currentPosition - _this.__offsetPosition) * _this.__scalePosition;
    });
  }
  _inherits(TransportedScheduled, _Transported3);
  _createClass(TransportedScheduled, {
    start: {value: function start(time, position, speed) {
        this.__engine.resetNextTime(time);
      }},
    stop: {value: function stop(time, position) {
        this.__engine.resetNextTime(Infinity);
      }},
    destroy: {value: function destroy() {
        this.__transport.scheduler.remove(this.__engine);
        _get(_core.Object.getPrototypeOf(TransportedScheduled.prototype), "destroy", this).call(this);
      }}
  });
  return TransportedScheduled;
})(Transported);
var TransportSchedulerHook = (function(_TimeEngine2) {
  function TransportSchedulerHook(transport) {
    _classCallCheck(this, TransportSchedulerHook);
    _get(_core.Object.getPrototypeOf(TransportSchedulerHook.prototype), "constructor", this).call(this);
    this.__transport = transport;
  }
  _inherits(TransportSchedulerHook, _TimeEngine2);
  _createClass(TransportSchedulerHook, {advanceTime: {value: function advanceTime(time) {
        var transport = this.__transport;
        var position = transport.__getPositionAtTime(time);
        var nextPosition = transport.advancePosition(time, position, transport.__speed);
        if (nextPosition !== Infinity) {
          return transport.__getTimeAtPosition(nextPosition);
        }
        return Infinity;
      }}});
  return TransportSchedulerHook;
})(TimeEngine);
var Transport = (function(_TimeEngine3) {
  function Transport(audioContext) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, Transport);
    _get(_core.Object.getPrototypeOf(Transport.prototype), "constructor", this).call(this, audioContext);
    this.scheduler = getScheduler(this.audioContext);
    this.__engines = [];
    this.__transported = [];
    this.__schedulerHook = null;
    this.__transportQueue = new PriorityQueue();
    this.__time = 0;
    this.__position = 0;
    this.__speed = 0;
    this.__nextPosition = Infinity;
  }
  _inherits(Transport, _TimeEngine3);
  _createClass(Transport, {
    __getPositionAtTime: {value: function __getPositionAtTime(time) {
        return this.__position + (time - this.__time) * this.__speed;
      }},
    __getTimeAtPosition: {value: function __getTimeAtPosition(position) {
        return this.__time + (position - this.__position) / this.__speed;
      }},
    __syncTransportedPosition: {value: function __syncTransportedPosition(time, position, speed) {
        var numTransportedEngines = this.__transported.length;
        if (numTransportedEngines > 0) {
          var engine,
              nextEnginePosition;
          this.__transportQueue.clear();
          this.__transportQueue.reverse = speed < 0;
          for (var i = 0; i < numTransportedEngines; i++) {
            engine = this.__transported[i];
            nextEnginePosition = engine.syncPosition(time, position, speed);
            this.__transportQueue.insert(engine, nextEnginePosition);
          }
        }
        return this.__transportQueue.time;
      }},
    __syncTransportedSpeed: {value: function __syncTransportedSpeed(time, position, speed) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = _core.$for.getIterator(this.__transported),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var transported = _step.value;
            transported.syncSpeed(time, position, speed);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }},
    currentTime: {get: function() {
        return this.scheduler.currentTime;
      }},
    currentPosition: {get: function() {
        return this.__position + (this.scheduler.currentTime - this.__time) * this.__speed;
      }},
    resetNextPosition: {value: function resetNextPosition(nextPosition) {
        if (this.__schedulerHook)
          this.__schedulerHook.resetNextTime(this.__getTimeAtPosition(nextPosition));
        this.__nextPosition = nextPosition;
      }},
    syncPosition: {value: function syncPosition(time, position, speed) {
        this.__time = time;
        this.__position = position;
        this.__speed = speed;
        return this.__syncTransportedPosition(time, position, speed);
      }},
    advancePosition: {value: function advancePosition(time, position, speed) {
        var nextEngine = this.__transportQueue.head;
        var nextEnginePosition = nextEngine.advancePosition(time, position, speed);
        this.__nextPosition = this.__transportQueue.move(nextEngine, nextEnginePosition);
        return this.__nextPosition;
      }},
    syncSpeed: {value: function syncSpeed(time, position, speed) {
        var seek = arguments[3] === undefined ? false : arguments[3];
        var lastSpeed = this.__speed;
        this.__time = time;
        this.__position = position;
        this.__speed = speed;
        if (speed !== lastSpeed || seek && speed !== 0) {
          var nextPosition = this.__nextPosition;
          if (seek || speed * lastSpeed < 0) {
            nextPosition = this.__syncTransportedPosition(time, position, speed);
          } else if (lastSpeed === 0) {
            nextPosition = this.__syncTransportedPosition(time, position, speed);
            this.__schedulerHook = new TransportSchedulerHook(this);
            this.scheduler.add(this.__schedulerHook, Infinity);
          } else if (speed === 0) {
            nextPosition = Infinity;
            this.__syncTransportedSpeed(time, position, 0);
            this.scheduler.remove(this.__schedulerHook);
            delete this.__schedulerHook;
          } else {
            this.__syncTransportedSpeed(time, position, speed);
          }
          this.resetNextPosition(nextPosition);
        }
      }},
    add: {value: function add(engine) {
        var _this = this;
        var startPosition = arguments[1] === undefined ? -Infinity : arguments[1];
        var endPosition = arguments[2] === undefined ? Infinity : arguments[2];
        var offsetPosition = arguments[3] === undefined ? startPosition : arguments[3];
        return (function() {
          var transported = null;
          if (offsetPosition === -Infinity)
            offsetPosition = 0;
          if (engine.master)
            throw new Error("object has already been added to a master");
          if (engine.implementsTransported())
            transported = new TransportedTransported(_this, engine, startPosition, endPosition, offsetPosition);
          else if (engine.implementsSpeedControlled())
            transported = new TransportedSpeedControlled(_this, engine, startPosition, endPosition, offsetPosition);
          else if (engine.implementsScheduled())
            transported = new TransportedScheduled(_this, engine, startPosition, endPosition, offsetPosition);
          else
            throw new Error("object cannot be added to a transport");
          if (transported) {
            var speed = _this.__speed;
            _this.__engines.push(engine);
            _this.__transported.push(transported);
            transported.setTransported(_this, function() {
              var nextEnginePosition = arguments[0] === undefined ? null : arguments[0];
              var speed = _this.__speed;
              if (speed !== 0) {
                if (nextEnginePosition === null)
                  nextEnginePosition = transported.syncPosition(_this.currentTime, _this.currentPosition, speed);
                var nextPosition = _this.__transportQueue.move(transported, nextEnginePosition);
                _this.resetNextPosition(nextPosition);
              }
            }, function() {
              return _this.__transport.scheduler.currentTime;
            }, function() {
              return _this.__transport.currentPosition - _this.__offsetPosition;
            });
            if (speed !== 0) {
              var nextEnginePosition = transported.syncPosition(_this.currentTime, _this.currentPosition, speed);
              var nextPosition = _this.__transportQueue.insert(transported, nextEnginePosition);
              _this.resetNextPosition(nextPosition);
            }
          }
          return transported;
        })();
      }},
    remove: {value: function remove(engineOrTransported) {
        var engine = engineOrTransported;
        var transported = removeCouple(this.__engines, this.__transported, engineOrTransported);
        if (!transported) {
          engine = removeCouple(this.__transported, this.__engines, engineOrTransported);
          transported = engineOrTransported;
        }
        if (engine && transported) {
          var nextPosition = this.__transportQueue.remove(transported);
          transported.resetInterface();
          transported.destroy();
          if (this.__speed !== 0)
            this.resetNextPosition(nextPosition);
        } else {
          throw new Error("object has not been added to this transport");
        }
      }},
    clear: {value: function clear() {
        this.syncSpeed(this.currentTime, this.currentPosition, 0);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = _core.$for.getIterator(this.__transported),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var transported = _step.value;
            transported.resetInterface();
            transported.destroy();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }}
  });
  return Transport;
})(TimeEngine);
module.exports = Transport;


//# sourceURL=/Users/rvincent/audio/dist/masters/transport.js
},{"../core/time-engine":3,"../utils/priority-queue-heap":16,"./factories":8,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],13:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var Heap = (function() {
  function Heap() {
    _classCallCheck(this, Heap);
    this.currentSize = 0;
    this.heapList = [];
  }
  _createClass(Heap, {
    __percUp: {value: function __percUp(i) {}},
    __percDown: {value: function __percDown(i) {}},
    remove: {value: function remove(item) {}},
    buildHeap: {value: function buildHeap(list) {}},
    empty: {value: function empty() {}},
    __childPosition: {value: function __childPosition(i) {
        if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue < this.heapList[i * 2 + 1].heapValue) {
          return i * 2;
        } else {
          return i * 2 + 1;
        }
      }},
    insert: {value: function insert(value, object) {
        this.heapList.push({
          object: object,
          heapValue: value
        });
        this.currentSize++;
        this.__percUp(this.currentSize);
      }},
    update: {value: function update(object, value) {
        for (var i = 1; i <= this.currentSize; i++) {
          if (object === this.heapList[i].object) {
            this.heapList[i].heapValue = value;
            this.__percUp(this.currentSize);
          }
        }
      }},
    deleteHead: {value: function deleteHead() {
        var referenceValue = this.heapList[1];
        this.heapList[1] = this.heapList[this.currentSize];
        this.currentSize--;
        this.heapList.pop();
        this.__percDown(1);
        return referenceValue;
      }},
    headObject: {value: function headObject() {
        return this.heapList[1].object;
      }},
    headValue: {value: function headValue() {
        return this.heapList[1].heapValue;
      }},
    list: {value: function list() {
        return this.heapList;
      }},
    size: {value: function size() {
        return this.currentSize;
      }},
    contains: {value: function contains(object) {
        for (var i = 1; i <= this.currentSize; i++) {
          if (object === this.heapList[i].object) {
            return true;
          }
        }
        return false;
      }},
    isEmpty: {value: function isEmpty() {
        return this.currentSize === 0;
      }}
  });
  return Heap;
})();
module.exports = Heap;


//# sourceURL=/Users/rvincent/audio/dist/utils/heap/heap.js
},{"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29}],14:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var Heap = require("./heap");
var MaxHeap = (function(_Heap) {
  function MaxHeap() {
    _classCallCheck(this, MaxHeap);
    _get(_core.Object.getPrototypeOf(MaxHeap.prototype), "constructor", this).call(this);
    this.heapList = [{
      object: {},
      heapValue: Infinity
    }];
  }
  _inherits(MaxHeap, _Heap);
  _createClass(MaxHeap, {
    __percUp: {value: function __percUp(i) {
        var ceiledIndex,
            tmp;
        while (Math.floor(i / 2) > 0) {
          ceiledIndex = Math.ceil(i / 2);
          if (this.heapList[i].heapValue > this.heapList[ceiledIndex].heapValue) {
            tmp = this.heapList[ceiledIndex];
            this.heapList[ceiledIndex] = this.heapList[i];
            this.heapList[i] = tmp;
          }
          i = ceiledIndex;
        }
      }},
    __percDown: {value: function __percDown(i) {
        var refPos,
            tmp;
        while (i * 2 <= this.currentSize) {
          refPos = this.__childPosition(i);
          if (this.heapList[i].heapValue < this.heapList[refPos].heapValue) {
            tmp = this.heapList[i];
            this.heapList[i] = this.heapList[refPos];
            this.heapList[refPos] = tmp;
          }
          i = refPos;
        }
      }},
    remove: {value: function remove(item) {
        for (var i = 0; i <= this.currentSize; i++) {
          if (item === this.heapList[i].object) {
            this.heapList[i].heapValue = Infinity;
            this.__percUp(this.currentSize);
            this.deleteHead();
          }
        }
        if (!this.isEmpty()) {
          return this.headValue();
        }
        return Infinity;
      }},
    buildHeap: {value: function buildHeap(list) {
        this.currentSize = list.length;
        this.heapList = [{
          object: {},
          heapValue: Infinity
        }].concat(list);
        var i = list.length;
        while (i > 0) {
          this.__percUp(i);
          i--;
        }
      }},
    empty: {value: function empty() {
        this.heapList = [{
          object: {},
          heapValue: Infinity
        }];
        this.currentSize = 0;
      }}
  });
  return MaxHeap;
})(Heap);
module.exports = MaxHeap;


//# sourceURL=/Users/rvincent/audio/dist/utils/heap/max-heap.js
},{"./heap":13,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],15:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _inherits = require("babel-runtime/helpers/inherits")["default"];
var _get = require("babel-runtime/helpers/get")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var _core = require("babel-runtime/core-js")["default"];
var Heap = require("./heap");
var MinHeap = (function(_Heap) {
  function MinHeap() {
    _classCallCheck(this, MinHeap);
    _get(_core.Object.getPrototypeOf(MinHeap.prototype), "constructor", this).call(this);
    this.heapList = [{
      object: {},
      heapValue: 0
    }];
  }
  _inherits(MinHeap, _Heap);
  _createClass(MinHeap, {
    __percUp: {value: function __percUp(i) {
        var ceiledIndex,
            tmp;
        while (Math.floor(i / 2) > 0) {
          ceiledIndex = Math.ceil(i / 2);
          if (this.heapList[i].heapValue < this.heapList[ceiledIndex].heapValue) {
            tmp = this.heapList[ceiledIndex];
            this.heapList[ceiledIndex] = this.heapList[i];
            this.heapList[i] = tmp;
          }
          i = ceiledIndex;
        }
      }},
    __percDown: {value: function __percDown(i) {
        var refPos,
            tmp;
        while (i * 2 <= this.currentSize) {
          refPos = this.__childPosition(i);
          if (this.heapList[i].heapValue > this.heapList[refPos].heapValue) {
            tmp = this.heapList[i];
            this.heapList[i] = this.heapList[refPos];
            this.heapList[refPos] = tmp;
          }
          i = refPos;
        }
      }},
    remove: {value: function remove(item) {
        for (var i = 0; i <= this.currentSize; i++) {
          if (item === this.heapList[i].object) {
            this.heapList[i].heapValue = 0;
            this.__percUp(this.currentSize);
            this.deleteHead();
          }
        }
        if (!this.isEmpty()) {
          return this.headValue();
        }
        return Infinity;
      }},
    buildHeap: {value: function buildHeap(list) {
        this.currentSize = list.length;
        this.heapList = [{
          object: {},
          heapValue: 0
        }].concat(list);
        var i = list.length - 1;
        while (i > 0) {
          this.__percUp(i);
          i--;
        }
      }},
    empty: {value: function empty() {
        this.heapList = [{
          object: {},
          heapValue: 0
        }];
        this.currentSize = 0;
      }}
  });
  return MinHeap;
})(Heap);
module.exports = MinHeap;


//# sourceURL=/Users/rvincent/audio/dist/utils/heap/min-heap.js
},{"./heap":13,"babel-runtime/core-js":27,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29,"babel-runtime/helpers/get":30,"babel-runtime/helpers/inherits":31}],16:[function(require,module,exports){
"use strict";
"use strict";
var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];
var _createClass = require("babel-runtime/helpers/create-class")["default"];
var MinHeap = require("./heap/min-heap");
var MaxHeap = require("./heap/max-heap");
var PriorityQueue = (function() {
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);
    this.__heap = new MinHeap();
    this.__reverse = false;
  }
  _createClass(PriorityQueue, {
    insert: {value: function insert(object, time) {
        if (time !== Infinity && time != -Infinity) {
          this.__heap.insert(time, object);
          return this.__heap.headValue();
        }
        return this.remove(object);
      }},
    move: {value: function move(object, time) {
        if (time !== Infinity && time != -Infinity) {
          if (this.__heap.contains(object)) {
            this.__heap.update(object, time);
          } else {
            this.__heap.insert(time, object);
          }
          return this.__heap.headValue();
        }
        return this.remove(object);
      }},
    remove: {value: function remove(object) {
        return this.__heap.remove(object);
      }},
    clear: {value: function clear() {
        this.__heap.empty();
        return Infinity;
      }},
    head: {get: function() {
        if (!this.__heap.isEmpty()) {
          return this.__heap.headObject();
        }
        return null;
      }},
    time: {get: function() {
        if (!this.__heap.isEmpty())
          return this.__heap.headValue();
        return Infinity;
      }},
    reverse: {
      get: function() {
        return this.__reverse;
      },
      set: function(value) {
        if (value !== this.__reverse) {
          var heapList = this.__heap.list();
          heapList.shift();
          if (value) {
            this.__heap = new MaxHeap();
          } else {
            this.__heap = new MinHeap();
          }
          this.__heap.buildHeap(heapList);
          this.__reverse = value;
        }
      }
    },
    toString: {value: function toString() {
        var list = this.__heap.list();
        var string = "Size: " + this.__heap.size() + " ";
        for (var i = 0; i < list.length; i++) {
          var obj = list[i];
          string += obj.object.constructor.name + " at " + obj.heapValue + " ";
        }
        return string;
      }}
  });
  return PriorityQueue;
})();
module.exports = PriorityQueue;


//# sourceURL=/Users/rvincent/audio/dist/utils/priority-queue-heap.js
},{"./heap/max-heap":14,"./heap/min-heap":15,"babel-runtime/helpers/class-call-check":28,"babel-runtime/helpers/create-class":29}],17:[function(require,module,exports){
"use strict";
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
  };
  document.getElementById('speed-range').addEventListener('input', function(event) {
    playControl.speed = (+this.value);
    document.getElementById('speed').textContent = this.value;
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  loadApp();
});


//# sourceURL=/Users/rvincent/audio/examples/index.es6.js
},{"../waves-audio":32,"waves-loaders":26}],18:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Loader = require("./loader");

/**
 * Gets called if a parameter is missing and the expression
 * specifying the default value is evaluated.
 * @function
 */
function throwIfMissing() {
  throw new Error("Missing parameter");
}

var audioContext = new AudioContext();

/**
 * AudioBufferLoader
 * @class
 * @classdesc Promise based implementation of XMLHttpRequest Level 2 for GET method and decode audio data for arraybuffer.
 * Inherit from Loader class
 */

var AudioBufferLoader = (function (_Loader) {

  /**
   * @constructs
   * Set the responseType to 'arraybuffer' and initialize options.
   */

  function AudioBufferLoader() {
    _classCallCheck(this, AudioBufferLoader);

    this.options = {
      wrapAroundExtension: 0
    };
    this.responseType = "arraybuffer";
    _get(_core.Object.getPrototypeOf(AudioBufferLoader.prototype), "constructor", this).call(this, this.responseType);
  }

  _inherits(AudioBufferLoader, _Loader);

  _createClass(AudioBufferLoader, {
    load: {

      /**
       * @function - Method for promise audio file loading and decoding.
       * @param {(string|string[])} fileURLs - The URL(s) of the audio files to load. Accepts a URL pointing to the file location or an array of URLs.
       * @param {{wrapAroundExtension: number}} [options] - Object with a wrapAroundExtension key which set the length, in seconds to be copied from the begining
       * at the end of the returned AudioBuffer
       * @returns {Promise}
       */

      value: function load() {
        var fileURLs = arguments[0] === undefined ? throwIfMissing() : arguments[0];
        var options = arguments[1] === undefined ? {} : arguments[1];

        this.options = options;
        this.options.wrapAroundExtension = this.options.wrapAroundExtension || 0;
        return _get(_core.Object.getPrototypeOf(AudioBufferLoader.prototype), "load", this).call(this, fileURLs);
      }
    },
    loadOne: {

      /**
       * @function - Load a single audio file, decode it in an AudioBuffer, return a Promise
       * @private
       * @param {string} fileURL - The URL of the audio file location to load.
       * @returns {Promise}
       */

      value: function loadOne(fileURL) {
        return _get(_core.Object.getPrototypeOf(AudioBufferLoader.prototype), "loadOne", this).call(this, fileURL).then(this.decodeAudioData.bind(this), function (error) {
          throw error;
        });
      }
    },
    loadAll: {

      /**
       * @function - Load all audio files at once in a single array, decode them in an array of AudioBuffers, and return a Promise.
       * @private
       * @param {string[]} fileURLs - The URLs array of the audio files to load.
       * @returns {Promise}
       */

      value: function loadAll(fileURLs) {
        var _this = this;

        return _get(_core.Object.getPrototypeOf(AudioBufferLoader.prototype), "loadAll", this).call(this, fileURLs).then(function (arraybuffers) {
          return _core.Promise.all(arraybuffers.map(function (arraybuffer) {
            return _this.decodeAudioData.bind(_this)(arraybuffer);
          }));
        }, function (error) {
          throw error; // TODO: better error handler
        });
      }
    },
    decodeAudioData: {

      /**
       * @function - Decode Audio Data, return a Promise
       * @private
       * @param {arraybuffer} - The arraybuffer of the loaded audio file to be decoded.
       * @returns {Promise}
       */

      value: function decodeAudioData(arraybuffer) {
        var _this = this;

        return new _core.Promise(function (resolve, reject) {
          audioContext.decodeAudioData(arraybuffer, // returned audio data array
          function (buffer) {
            if (_this.options.wrapAroundExtension === 0) resolve(buffer);else resolve(_this.__wrapAround(buffer));
          }, function (error) {
            reject(new Error("DecodeAudioData error"));
          });
        });
      }
    },
    __wrapAround: {

      /**
       * @function - WrapAround, copy the begining input buffer to the end of an output buffer
       * @private
       * @param {arraybuffer} inBuffer {arraybuffer} - The input buffer
       * @returns {arraybuffer} - The processed buffer (with frame copied from the begining to the end)
       */

      value: function __wrapAround(inBuffer) {
        var length = inBuffer.length + this.options.wrapAroundExtension * inBuffer.sampleRate;
        var outBuffer = audioContext.createBuffer(inBuffer.numberOfChannels, length, inBuffer.sampleRate);
        var arrayChData, arrayOutChData;

        for (var channel = 0; channel < inBuffer.numberOfChannels; channel++) {
          arrayChData = inBuffer.getChannelData(channel);
          arrayOutChData = outBuffer.getChannelData(channel);

          arrayOutChData.forEach(function (sample, index) {
            if (index < inBuffer.length) arrayOutChData[index] = arrayChData[index];else arrayOutChData[index] = arrayChData[index - inBuffer.length];
          });
        }

        return outBuffer;
      }
    }
  });

  return AudioBufferLoader;
})(Loader);

module.exports = AudioBufferLoader;

},{"./loader":19,"babel-runtime/core-js":21,"babel-runtime/helpers/class-call-check":22,"babel-runtime/helpers/create-class":23,"babel-runtime/helpers/get":24,"babel-runtime/helpers/inherits":25}],19:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

/**
 * Gets called if a parameter is missing and the expression
 * specifying the default value is evaluated.
 * @function
 */
function throwIfMissing() {
  throw new Error("Missing parameter");
}

/**
 * Loader
 * @class
 * @classdesc Promise based implementation of XMLHttpRequest Level 2 for GET method.
 */

var Loader = (function () {

  /**
   * @constructs
   * @param {string} [responseType=""] - responseType's value, "text" (equal to ""), "arraybuffer", "blob", "document" or "json"
   */

  function Loader() {
    var responseType = arguments[0] === undefined ? "" : arguments[0];

    _classCallCheck(this, Loader);

    _get(_core.Object.getPrototypeOf(Loader.prototype), "constructor", this).call(this);
    this.responseType = responseType;
    // rename to `onProgress` ?
    this.progressCb = undefined;
  }

  _createClass(Loader, {
    load: {

      /**
       * @function - Method for a promise based file loading.
       * Internally switch between loadOne and loadAll.
       * @public
       * @param {(string|string[])} fileURLs - The URL(s) of the files to load. Accepts a URL pointing to the file location or an array of URLs.
       * @returns {Promise}
       */

      value: function load() {
        var fileURLs = arguments[0] === undefined ? throwIfMissing() : arguments[0];

        if (fileURLs === undefined) throw new Error("load needs at least a url to load");
        if (Array.isArray(fileURLs)) {
          return this.loadAll(fileURLs);
        } else {
          return this.loadOne(fileURLs);
        }
      }
    },
    loadOne: {

      /**
       * @function - Load a single file
       * @private
       * @param {string} fileURL - The URL of the file to load.
       * @returns {Promise}
       */

      value: function loadOne(fileURL) {
        return this.fileLoadingRequest(fileURL);
      }
    },
    loadAll: {

      /**
       * @function - Load all files at once in a single array and return a Promise
       * @private
       * @param {string[]} fileURLs - The URLs array of the files to load.
       * @returns {Promise}
       */

      value: function loadAll(fileURLs) {
        var urlsCount = fileURLs.length,
            promises = [];

        for (var i = 0; i < urlsCount; ++i) {
          promises.push(this.fileLoadingRequest(fileURLs[i], i));
        }

        return _core.Promise.all(promises);
      }
    },
    fileLoadingRequest: {

      /**
       * @function - Load a file asynchronously, return a Promise.
       * @private
       * @param {string} url - The URL of the file to load
       * @param {string} [index] - The index of the file in the array of files to load
       * @returns {Promise}
       */

      value: function fileLoadingRequest(url, index) {
        var _this = this;

        var promise = new _core.Promise(function (resolve, reject) {
          var request = new XMLHttpRequest();
          request.open("GET", url, true);
          request.index = index;

          request.responseType = _this.responseType;
          request.addEventListener("load", function () {
            // Test request.status value, as 404 will also get there
            if (request.status === 200 || request.status === 304) {
              // Hack for iOS 7, to remove as soon as possible
              if (this.responseType === "json" && typeof request.response === "string") {
                request.response = JSON.parse(request.response);
              }
              resolve(request.response);
            } else {
              reject(new Error(request.statusText));
            }
          });
          request.addEventListener("progress", function (evt) {
            if (_this.progressCallback) {
              if (index !== undefined) {
                _this.progressCallback({
                  index: index,
                  value: evt.loaded / evt.total,
                  loaded: evt.loaded,
                  total: evt.total
                });
              } else {
                _this.progressCallback({
                  value: evt.loaded / evt.total,
                  loaded: evt.loaded,
                  total: evt.total
                });
              }
            }
          });
          // Manage network errors
          request.addEventListener("error", function () {
            reject(new Error("Network Error"));
          });

          request.send();
        });
        return promise;
      }
    },
    progressCallback: {

      /**
       * @function - Get the callback function to get the progress of file loading process.
       * This is only for the file loading progress as decodeAudioData doesn't
       * expose a decode progress value.
       * @returns {Loader~progressCallback}
       */

      get: function () {
        return this.progressCb;
      },

      /**
       * @function - Set the callback function to get the progress of file loading process.
       * This is only for the file loading progress as decodeAudioData doesn't
       * expose a decode progress value.
       * @param {Loader~progressCallback} callback - The callback that handles the response.
       */
      set: function (callback) {
        this.progressCb = callback;
      }
    }
  });

  return Loader;
})();

module.exports = Loader;

},{"babel-runtime/core-js":21,"babel-runtime/helpers/class-call-check":22,"babel-runtime/helpers/create-class":23,"babel-runtime/helpers/get":24}],20:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Loader = require("./loader");
var AudioBufferLoader = require("./audio-buffer-loader");

/**
 * Gets called if a parameter is missing and the expression
 * specifying the default value is evaluated.
 * @function
 */
function throwIfMissing() {
  throw new Error("Missing parameter");
}

/**
 * SuperLoader
 * @class
 * @classdesc Helper to load multiple type of files, and get them in their useful type, json for json files, AudioBuffer for audio files.
 */

var SuperLoader = (function () {

  /**
   * @constructs
   * Use composition to setup appropriate file loaders
   */

  function SuperLoader() {
    _classCallCheck(this, SuperLoader);

    this.bufferLoader = new AudioBufferLoader();
    this.loader = new Loader("json");
  }

  _createClass(SuperLoader, {
    load: {

      /**
       * @function - Method for promise audio and json file loading (and decoding for audio).
       * @param {(string|string[])} fileURLs - The URL(s) of the files to load. Accepts a URL pointing to the file location or an array of URLs.
       * @param {{wrapAroundExtension: number}} [options] - Object with a wrapAroundExtension key which set the length, in seconds to be copied from the begining
       * at the end of the returned AudioBuffer
       * @returns {Promise}
       */

      value: function load() {
        var fileURLs = arguments[0] === undefined ? throwIfMissing() : arguments[0];
        var options = arguments[1] === undefined ? {} : arguments[1];

        this.options = options;
        this.options.wrapAroundExtension = this.options.wrapAroundExtension || 0;
        if (Array.isArray(fileURLs)) {
          var i = -1;
          var pos = [[], []]; // pos is used to track the positions of each fileURL
          var otherURLs = fileURLs.filter(function (url, index) {
            // var extname = path.extname(url);
            var parts = url.split(".");
            var extname = parts[parts.length - 1];
            i += 1;
            if (extname == "json") {
              pos[0].push(i);
              return true;
            } else {
              pos[1].push(i);
              return false;
            }
          });

          // var audioURLs = _.difference(fileURLs, otherURLs);
          var audioURLs = fileURLs.filter(function (url) {
            if (otherURLs.indexOf(url) === -1) {
              return url;
            }
          });

          var promises = [];

          if (otherURLs.length > 0) promises.push(this.loader.load(otherURLs));
          if (audioURLs.length > 0) promises.push(this.bufferLoader.load(audioURLs, this.options));

          return new _core.Promise(function (resolve, reject) {
            _core.Promise.all(promises).then(function (datas) {
              // Need to reorder and flatten all of these fulfilled promises
              // @todo this is ugly
              if (datas.length === 1) {
                resolve(datas[0]);
              } else {
                var outData = [];
                for (var j = 0; j < pos.length; j++) {
                  for (var k = 0; k < pos[j].length; k++) {
                    outData[pos[j][k]] = datas[j][k];
                  }
                }
                resolve(outData);
              }
            }, function (error) {
              throw error;
            });
          });
        }
      }
    }
  });

  return SuperLoader;
})();

module.exports = SuperLoader;

},{"./audio-buffer-loader":18,"./loader":19,"babel-runtime/core-js":21,"babel-runtime/helpers/class-call-check":22,"babel-runtime/helpers/create-class":23}],21:[function(require,module,exports){
/**
 * Core.js 0.6.1
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(global, framework, undefined){
'use strict';

/******************************************************************************
 * Module : common                                                            *
 ******************************************************************************/

  // Shortcuts for [[Class]] & property names
var OBJECT          = 'Object'
  , FUNCTION        = 'Function'
  , ARRAY           = 'Array'
  , STRING          = 'String'
  , NUMBER          = 'Number'
  , REGEXP          = 'RegExp'
  , DATE            = 'Date'
  , MAP             = 'Map'
  , SET             = 'Set'
  , WEAKMAP         = 'WeakMap'
  , WEAKSET         = 'WeakSet'
  , SYMBOL          = 'Symbol'
  , PROMISE         = 'Promise'
  , MATH            = 'Math'
  , ARGUMENTS       = 'Arguments'
  , PROTOTYPE       = 'prototype'
  , CONSTRUCTOR     = 'constructor'
  , TO_STRING       = 'toString'
  , TO_STRING_TAG   = TO_STRING + 'Tag'
  , TO_LOCALE       = 'toLocaleString'
  , HAS_OWN         = 'hasOwnProperty'
  , FOR_EACH        = 'forEach'
  , ITERATOR        = 'iterator'
  , FF_ITERATOR     = '@@' + ITERATOR
  , PROCESS         = 'process'
  , CREATE_ELEMENT  = 'createElement'
  // Aliases global objects and prototypes
  , Function        = global[FUNCTION]
  , Object          = global[OBJECT]
  , Array           = global[ARRAY]
  , String          = global[STRING]
  , Number          = global[NUMBER]
  , RegExp          = global[REGEXP]
  , Date            = global[DATE]
  , Map             = global[MAP]
  , Set             = global[SET]
  , WeakMap         = global[WEAKMAP]
  , WeakSet         = global[WEAKSET]
  , Symbol          = global[SYMBOL]
  , Math            = global[MATH]
  , TypeError       = global.TypeError
  , RangeError      = global.RangeError
  , setTimeout      = global.setTimeout
  , setImmediate    = global.setImmediate
  , clearImmediate  = global.clearImmediate
  , parseInt        = global.parseInt
  , isFinite        = global.isFinite
  , process         = global[PROCESS]
  , nextTick        = process && process.nextTick
  , document        = global.document
  , html            = document && document.documentElement
  , navigator       = global.navigator
  , define          = global.define
  , console         = global.console || {}
  , ArrayProto      = Array[PROTOTYPE]
  , ObjectProto     = Object[PROTOTYPE]
  , FunctionProto   = Function[PROTOTYPE]
  , Infinity        = 1 / 0
  , DOT             = '.';

// http://jsperf.com/core-js-isobject
function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
// Native function?
var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);

// Object internal [[Class]] or toStringTag
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
var toString = ObjectProto[TO_STRING];
function setToStringTag(it, tag, stat){
  if(it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))hidden(it, SYMBOL_TAG, tag);
}
function cof(it){
  return toString.call(it).slice(8, -1);
}
function classof(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[SYMBOL_TAG]) == 'string' ? T : cof(O);
}

// Function
var call  = FunctionProto.call
  , apply = FunctionProto.apply
  , REFERENCE_GET;
// Partial apply
function part(/* ...args */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , args   = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , i = 0, j = 0, _args;
    if(!holder && !_length)return invoke(fn, args, that);
    _args = args.slice();
    if(holder)for(;length > i; i++)if(_args[i] === _)_args[i] = arguments[j++];
    while(_length > j)_args.push(arguments[j++]);
    return invoke(fn, _args, that);
  }
}
// Optional / simple context binding
function ctx(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    }
    case 2: return function(a, b){
      return fn.call(that, a, b);
    }
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    }
  } return function(/* ...args */){
      return fn.apply(that, arguments);
  }
}
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
function invoke(fn, args, that){
  var un = that === undefined;
  switch(args.length | 0){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
}

// Object:
var create           = Object.create
  , getPrototypeOf   = Object.getPrototypeOf
  , setPrototypeOf   = Object.setPrototypeOf
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , getOwnDescriptor = Object.getOwnPropertyDescriptor
  , getKeys          = Object.keys
  , getNames         = Object.getOwnPropertyNames
  , getSymbols       = Object.getOwnPropertySymbols
  , isFrozen         = Object.isFrozen
  , has              = ctx(call, ObjectProto[HAS_OWN], 2)
  // Dummy, fix for not array-like ES3 string in es5 module
  , ES5Object        = Object
  , Dict;
function toObject(it){
  return ES5Object(assertDefined(it));
}
function returnIt(it){
  return it;
}
function returnThis(){
  return this;
}
function get(object, key){
  if(has(object, key))return object[key];
}
function ownKeys(it){
  assertObject(it);
  return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
}
// 19.1.2.1 Object.assign(target, source, ...)
var assign = Object.assign || function(target, source){
  var T = Object(assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = ES5Object(arguments[i++])
      , keys   = getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
function keyOf(object, el){
  var O      = toObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
}

// Array
// array('str1,str2,str3') => ['str1', 'str2', 'str3']
function array(it){
  return String(it).split(',');
}
var push    = ArrayProto.push
  , unshift = ArrayProto.unshift
  , slice   = ArrayProto.slice
  , splice  = ArrayProto.splice
  , indexOf = ArrayProto.indexOf
  , forEach = ArrayProto[FOR_EACH];
/*
 * 0 -> forEach
 * 1 -> map
 * 2 -> filter
 * 3 -> some
 * 4 -> every
 * 5 -> find
 * 6 -> findIndex
 */
function createArrayMethod(type){
  var isMap       = type == 1
    , isFilter    = type == 2
    , isSome      = type == 3
    , isEvery     = type == 4
    , isFindIndex = type == 6
    , noholes     = type == 5 || isFindIndex;
  return function(callbackfn/*, that = undefined */){
    var O      = Object(assertDefined(this))
      , that   = arguments[1]
      , self   = ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = isMap ? Array(length) : isFilter ? [] : undefined
      , val, res;
    for(;length > index; index++)if(noholes || index in self){
      val = self[index];
      res = f(val, index, O);
      if(type){
        if(isMap)result[index] = res;             // map
        else if(res)switch(type){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(isEvery)return false;           // every
      }
    }
    return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
  }
}
function createArrayContains(isContains){
  return function(el /*, fromIndex = 0 */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = toIndex(arguments[1], length);
    if(isContains && el != el){
      for(;length > index; index++)if(sameNaN(O[index]))return isContains || index;
    } else for(;length > index; index++)if(isContains || index in O){
      if(O[index] === el)return isContains || index;
    } return !isContains && -1;
  }
}
function generic(A, B){
  // strange IE quirks mode bug -> use typeof vs isFunction
  return typeof A == 'function' ? A : B;
}

// Math
var MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991
  , pow    = Math.pow
  , abs    = Math.abs
  , ceil   = Math.ceil
  , floor  = Math.floor
  , max    = Math.max
  , min    = Math.min
  , random = Math.random
  , trunc  = Math.trunc || function(it){
      return (it > 0 ? floor : ceil)(it);
    }
// 20.1.2.4 Number.isNaN(number)
function sameNaN(number){
  return number != number;
}
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it) ? 0 : trunc(it);
}
// 7.1.15 ToLength
function toLength(it){
  return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
}
function toIndex(index, length){
  var index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
}
function lz(num){
  return num > 9 ? num : '0' + num;
}

function createReplacer(regExp, replace, isStatic){
  var replacer = isObject(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  }
}
function createPointAt(toString){
  return function(pos){
    var s = String(assertDefined(this))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return toString ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? toString ? s.charAt(i) : a
      : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  }
}

// Assertion & errors
var REDUCE_ERROR = 'Reduce of empty object with no initial value';
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
function assertDefined(it){
  if(it == undefined)throw TypeError('Function called on null or undefined');
  return it;
}
function assertFunction(it){
  assert(isFunction(it), it, ' is not a function!');
  return it;
}
function assertObject(it){
  assert(isObject(it), it, ' is not an object!');
  return it;
}
function assertInstance(it, Constructor, name){
  assert(it instanceof Constructor, name, ": use the 'new' operator!");
}

// Property descriptors & Symbol
function descriptor(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  }
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return defineProperty(object, key, descriptor(bitmap, value));
  } : simpleSet;
}
function uid(key){
  return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
}
function getWellKnownSymbol(name, setter){
  return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
}
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
      try {
        return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;
      } catch(e){}
    }()
  , sid    = 0
  , hidden = createDefiner(1)
  , set    = Symbol ? simpleSet : hidden
  , safeSymbol = Symbol || uid;
function assignHidden(target, src){
  for(var key in src)hidden(target, key, src[key]);
  return target;
}

var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables')
  , ArrayUnscopables   = ArrayProto[SYMBOL_UNSCOPABLES] || {}
  , SYMBOL_TAG         = getWellKnownSymbol(TO_STRING_TAG)
  , SYMBOL_SPECIES     = getWellKnownSymbol('species')
  , SYMBOL_ITERATOR;
function setSpecies(C){
  if(DESC && (framework || !isNative(C)))defineProperty(C, SYMBOL_SPECIES, {
    configurable: true,
    get: returnThis
  });
}

/******************************************************************************
 * Module : common.export                                                     *
 ******************************************************************************/

var NODE = cof(process) == PROCESS
  , core = {}
  , path = framework ? global : core
  , old  = global.core
  , exportGlobal
  // type bitmap
  , FORCED = 1
  , GLOBAL = 2
  , STATIC = 4
  , PROTO  = 8
  , BIND   = 16
  , WRAP   = 32;
function $define(type, name, source){
  var key, own, out, exp
    , isGlobal = type & GLOBAL
    , target   = isGlobal ? global : (type & STATIC)
        ? global[name] : (global[name] || ObjectProto)[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // there is a similar native
    own = !(type & FORCED) && target && key in target
      && (!isFunction(target[key]) || isNative(target[key]));
    // export native or passed
    out = (own ? target : source)[key];
    // prevent global pollution for namespaces
    if(!framework && isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & BIND && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & WRAP && !framework && target[key] == out){
      exp = function(param){
        return this instanceof out ? new out(param) : out(param);
      }
      exp[PROTOTYPE] = out[PROTOTYPE];
    } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
    // extend global
    if(framework && target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && hidden(target, key, out);
    }
    // export
    if(exports[key] != out)hidden(exports, key, exp);
  }
}
// CommonJS export
if(typeof module != 'undefined' && module.exports)module.exports = core;
// RequireJS export
else if(isFunction(define) && define.amd)define(function(){return core});
// Export to global object
else exportGlobal = true;
if(exportGlobal || framework){
  core.noConflict = function(){
    global.core = old;
    return core;
  }
  global.core = core;
}

/******************************************************************************
 * Module : common.iterators                                                  *
 ******************************************************************************/

SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR);
var ITER  = safeSymbol('iter')
  , KEY   = 1
  , VALUE = 2
  , Iterators = {}
  , IteratorPrototype = {}
    // Safari has byggy iterators w/o `next`
  , BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, returnThis);
function setIterator(O, value){
  hidden(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  FF_ITERATOR in ArrayProto && hidden(O, FF_ITERATOR, value);
}
function createIterator(Constructor, NAME, next, proto){
  Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor[PROTOTYPE]
    , iter  = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
  if(framework){
    // Define iterator
    setIterator(proto, iter);
    if(iter !== value){
      var iterProto = getPrototypeOf(iter.call(new Constructor));
      // Set @@toStringTag to native iterators
      setToStringTag(iterProto, NAME + ' Iterator', true);
      // FF fix
      has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
    }
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = returnThis;
  return iter;
}
function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET){
  function createIter(kind){
    return function(){
      return new Constructor(this, kind);
    }
  }
  createIterator(Constructor, NAME, next);
  var entries = createIter(KEY+VALUE)
    , values  = createIter(VALUE);
  if(DEFAULT == VALUE)values = defineIterator(Base, NAME, values, 'values');
  else entries = defineIterator(Base, NAME, entries, 'entries');
  if(DEFAULT){
    $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
      entries: entries,
      keys: IS_SET ? values : createIter(KEY),
      values: values
    });
  }
}
function iterResult(done, value){
  return {value: value, done: !!done};
}
function isIterable(it){
  var O      = Object(it)
    , Symbol = global[SYMBOL]
    , hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
  return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
}
function getIterator(it){
  var Symbol  = global[SYMBOL]
    , ext     = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
  return assertObject(getIter.call(it));
}
function stepCall(fn, value, entries){
  return entries ? invoke(fn, value) : fn(value);
}
function checkDangerIterClosing(fn){
  var danger = true;
  var O = {
    next: function(){ throw 1 },
    'return': function(){ danger = false }
  };
  O[SYMBOL_ITERATOR] = returnThis;
  try {
    fn(O);
  } catch(e){}
  return danger;
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)ret.call(iterator);
}
function safeIterClose(exec, iterator){
  try {
    exec(iterator);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
function forOf(iterable, entries, fn, that){
  safeIterClose(function(iterator){
    var f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false){
      return closeIterator(iterator);
    }
  }, getIterator(iterable));
}

/******************************************************************************
 * Module : es6.symbol                                                        *
 ******************************************************************************/

// ECMAScript 6 symbols shim
!function(TAG, SymbolRegistry, AllSymbols, setter){
  // 19.4.1.1 Symbol([description])
  if(!isNative(Symbol)){
    Symbol = function(description){
      assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
      var tag = uid(description)
        , sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
      AllSymbols[tag] = sym;
      DESC && setter && defineProperty(ObjectProto, tag, {
        configurable: true,
        set: function(value){
          hidden(this, tag, value);
        }
      });
      return sym;
    }
    hidden(Symbol[PROTOTYPE], TO_STRING, function(){
      return this[TAG];
    });
  }
  $define(GLOBAL + WRAP, {Symbol: Symbol});
  
  var symbolStatics = {
    // 19.4.2.1 Symbol.for(key)
    'for': function(key){
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = Symbol(key);
    },
    // 19.4.2.4 Symbol.iterator
    iterator: SYMBOL_ITERATOR || getWellKnownSymbol(ITERATOR),
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: part.call(keyOf, SymbolRegistry),
    // 19.4.2.10 Symbol.species
    species: SYMBOL_SPECIES,
    // 19.4.2.13 Symbol.toStringTag
    toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
    // 19.4.2.14 Symbol.unscopables
    unscopables: SYMBOL_UNSCOPABLES,
    pure: safeSymbol,
    set: set,
    useSetter: function(){setter = true},
    useSimple: function(){setter = false}
  };
  // 19.4.2.2 Symbol.hasInstance
  // 19.4.2.3 Symbol.isConcatSpreadable
  // 19.4.2.6 Symbol.match
  // 19.4.2.8 Symbol.replace
  // 19.4.2.9 Symbol.search
  // 19.4.2.11 Symbol.split
  // 19.4.2.12 Symbol.toPrimitive
  forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'),
    function(it){
      symbolStatics[it] = getWellKnownSymbol(it);
    }
  );
  $define(STATIC, SYMBOL, symbolStatics);
  
  setToStringTag(Symbol, SYMBOL);
  
  $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
      return result;
    },
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
      return result;
    }
  });
  
  // 20.2.1.9 Math[@@toStringTag]
  setToStringTag(Math, MATH, true);
  // 24.3.3 JSON[@@toStringTag]
  setToStringTag(global.JSON, 'JSON', true);
}(safeSymbol('tag'), {}, {}, true);

/******************************************************************************
 * Module : es6.object.statics                                                *
 ******************************************************************************/

!function(){
  var objectStatic = {
    // 19.1.3.1 Object.assign(target, source)
    assign: assign,
    // 19.1.3.10 Object.is(value1, value2)
    is: function(x, y){
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    }
  };
  // 19.1.3.19 Object.setPrototypeOf(O, proto)
  // Works with __proto__ only. Old v8 can't works with null proto objects.
  '__proto__' in ObjectProto && function(buggy, set){
    try {
      set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
      set({}, ArrayProto);
    } catch(e){ buggy = true }
    objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto){
      assertObject(O);
      assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
      if(buggy)O.__proto__ = proto;
      else set(O, proto);
      return O;
    }
  }();
  $define(STATIC, OBJECT, objectStatic);
}();

/******************************************************************************
 * Module : es6.object.statics-accept-primitives                              *
 ******************************************************************************/

!function(){
  // Object static methods accept primitives
  function wrapObjectMethod(key, MODE){
    var fn  = Object[key]
      , exp = core[OBJECT][key]
      , f   = 0
      , o   = {};
    if(!exp || isNative(exp)){
      o[key] = MODE == 1 ? function(it){
        return isObject(it) ? fn(it) : it;
      } : MODE == 2 ? function(it){
        return isObject(it) ? fn(it) : true;
      } : MODE == 3 ? function(it){
        return isObject(it) ? fn(it) : false;
      } : MODE == 4 ? function(it, key){
        return fn(toObject(it), key);
      } : function(it){
        return fn(toObject(it));
      };
      try { fn(DOT) }
      catch(e){ f = 1 }
      $define(STATIC + FORCED * f, OBJECT, o);
    }
  }
  wrapObjectMethod('freeze', 1);
  wrapObjectMethod('seal', 1);
  wrapObjectMethod('preventExtensions', 1);
  wrapObjectMethod('isFrozen', 2);
  wrapObjectMethod('isSealed', 2);
  wrapObjectMethod('isExtensible', 3);
  wrapObjectMethod('getOwnPropertyDescriptor', 4);
  wrapObjectMethod('getPrototypeOf');
  wrapObjectMethod('keys');
  wrapObjectMethod('getOwnPropertyNames');
}();

/******************************************************************************
 * Module : es6.number.statics                                                *
 ******************************************************************************/

!function(isInteger){
  $define(STATIC, NUMBER, {
    // 20.1.2.1 Number.EPSILON
    EPSILON: pow(2, -52),
    // 20.1.2.2 Number.isFinite(number)
    isFinite: function(it){
      return typeof it == 'number' && isFinite(it);
    },
    // 20.1.2.3 Number.isInteger(number)
    isInteger: isInteger,
    // 20.1.2.4 Number.isNaN(number)
    isNaN: sameNaN,
    // 20.1.2.5 Number.isSafeInteger(number)
    isSafeInteger: function(number){
      return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
    },
    // 20.1.2.6 Number.MAX_SAFE_INTEGER
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    // 20.1.2.10 Number.MIN_SAFE_INTEGER
    MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
    // 20.1.2.12 Number.parseFloat(string)
    parseFloat: parseFloat,
    // 20.1.2.13 Number.parseInt(string, radix)
    parseInt: parseInt
  });
// 20.1.2.3 Number.isInteger(number)
}(Number.isInteger || function(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
});

/******************************************************************************
 * Module : es6.math                                                          *
 ******************************************************************************/

// ECMAScript 6 shim
!function(){
  // 20.2.2.28 Math.sign(x)
  var E    = Math.E
    , exp  = Math.exp
    , log  = Math.log
    , sqrt = Math.sqrt
    , sign = Math.sign || function(x){
        return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
      };
  
  // 20.2.2.5 Math.asinh(x)
  function asinh(x){
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
  }
  // 20.2.2.14 Math.expm1(x)
  function expm1(x){
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  }
    
  $define(STATIC, MATH, {
    // 20.2.2.3 Math.acosh(x)
    acosh: function(x){
      return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
    },
    // 20.2.2.5 Math.asinh(x)
    asinh: asinh,
    // 20.2.2.7 Math.atanh(x)
    atanh: function(x){
      return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
    },
    // 20.2.2.9 Math.cbrt(x)
    cbrt: function(x){
      return sign(x = +x) * pow(abs(x), 1 / 3);
    },
    // 20.2.2.11 Math.clz32(x)
    clz32: function(x){
      return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
    },
    // 20.2.2.12 Math.cosh(x)
    cosh: function(x){
      return (exp(x = +x) + exp(-x)) / 2;
    },
    // 20.2.2.14 Math.expm1(x)
    expm1: expm1,
    // 20.2.2.16 Math.fround(x)
    // TODO: fallback for IE9-
    fround: function(x){
      return new Float32Array([x])[0];
    },
    // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
    hypot: function(value1, value2){
      var sum  = 0
        , len1 = arguments.length
        , len2 = len1
        , args = Array(len1)
        , larg = -Infinity
        , arg;
      while(len1--){
        arg = args[len1] = +arguments[len1];
        if(arg == Infinity || arg == -Infinity)return Infinity;
        if(arg > larg)larg = arg;
      }
      larg = arg || 1;
      while(len2--)sum += pow(args[len2] / larg, 2);
      return larg * sqrt(sum);
    },
    // 20.2.2.18 Math.imul(x, y)
    imul: function(x, y){
      var UInt16 = 0xffff
        , xn = +x
        , yn = +y
        , xl = UInt16 & xn
        , yl = UInt16 & yn;
      return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
    },
    // 20.2.2.20 Math.log1p(x)
    log1p: function(x){
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
    },
    // 20.2.2.21 Math.log10(x)
    log10: function(x){
      return log(x) / Math.LN10;
    },
    // 20.2.2.22 Math.log2(x)
    log2: function(x){
      return log(x) / Math.LN2;
    },
    // 20.2.2.28 Math.sign(x)
    sign: sign,
    // 20.2.2.30 Math.sinh(x)
    sinh: function(x){
      return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
    },
    // 20.2.2.33 Math.tanh(x)
    tanh: function(x){
      var a = expm1(x = +x)
        , b = expm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
    },
    // 20.2.2.34 Math.trunc(x)
    trunc: trunc
  });
}();

/******************************************************************************
 * Module : es6.string                                                        *
 ******************************************************************************/

!function(fromCharCode){
  function assertNotRegExp(it){
    if(cof(it) == REGEXP)throw TypeError();
  }
  
  $define(STATIC, STRING, {
    // 21.1.2.2 String.fromCodePoint(...codePoints)
    fromCodePoint: function(x){
      var res = []
        , len = arguments.length
        , i   = 0
        , code
      while(len > i){
        code = +arguments[i++];
        if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
        res.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
        );
      } return res.join('');
    },
    // 21.1.2.4 String.raw(callSite, ...substitutions)
    raw: function(callSite){
      var raw = toObject(callSite.raw)
        , len = toLength(raw.length)
        , sln = arguments.length
        , res = []
        , i   = 0;
      while(len > i){
        res.push(String(raw[i++]));
        if(i < sln)res.push(String(arguments[i]));
      } return res.join('');
    }
  });
  
  $define(PROTO, STRING, {
    // 21.1.3.3 String.prototype.codePointAt(pos)
    codePointAt: createPointAt(false),
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
    endsWith: function(searchString /*, endPosition = @length */){
      assertNotRegExp(searchString);
      var that = String(assertDefined(this))
        , endPosition = arguments[1]
        , len = toLength(that.length)
        , end = endPosition === undefined ? len : min(toLength(endPosition), len);
      searchString += '';
      return that.slice(end - searchString.length, end) === searchString;
    },
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
    includes: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
    },
    // 21.1.3.13 String.prototype.repeat(count)
    repeat: function(count){
      var str = String(assertDefined(this))
        , res = ''
        , n   = toInteger(count);
      if(0 > n || n == Infinity)throw RangeError("Count can't be negative");
      for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
      return res;
    },
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
    startsWith: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      var that  = String(assertDefined(this))
        , index = toLength(min(arguments[1], that.length));
      searchString += '';
      return that.slice(index, index + searchString.length) === searchString;
    }
  });
}(String.fromCharCode);

/******************************************************************************
 * Module : es6.array.statics                                                 *
 ******************************************************************************/

!function(){
  $define(STATIC + FORCED * checkDangerIterClosing(Array.from), ARRAY, {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
      var O       = Object(assertDefined(arrayLike))
        , mapfn   = arguments[1]
        , mapping = mapfn !== undefined
        , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
        , index   = 0
        , length, result, step;
      if(isIterable(O)){
        result = new (generic(this, Array));
        safeIterClose(function(iterator){
          for(; !(step = iterator.next()).done; index++){
            result[index] = mapping ? f(step.value, index) : step.value;
          }
        }, getIterator(O));
      } else {
        result = new (generic(this, Array))(length = toLength(O.length));
        for(; length > index; index++){
          result[index] = mapping ? f(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }
  });
  
  $define(STATIC, ARRAY, {
    // 22.1.2.3 Array.of( ...items)
    of: function(/* ...args */){
      var index  = 0
        , length = arguments.length
        , result = new (generic(this, Array))(length);
      while(length > index)result[index] = arguments[index++];
      result.length = length;
      return result;
    }
  });
  
  setSpecies(Array);
}();

/******************************************************************************
 * Module : es6.array.prototype                                               *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){
      var O     = Object(assertDefined(this))
        , len   = toLength(O.length)
        , to    = toIndex(target, len)
        , from  = toIndex(start, len)
        , end   = arguments[2]
        , fin   = end === undefined ? len : toIndex(end, len)
        , count = min(fin - from, len - to)
        , inc   = 1;
      if(from < to && to < from + count){
        inc  = -1;
        from = from + count - 1;
        to   = to + count - 1;
      }
      while(count-- > 0){
        if(from in O)O[to] = O[from];
        else delete O[to];
        to += inc;
        from += inc;
      } return O;
    },
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    fill: function(value /*, start = 0, end = @length */){
      var O      = Object(assertDefined(this))
        , length = toLength(O.length)
        , index  = toIndex(arguments[1], length)
        , end    = arguments[2]
        , endPos = end === undefined ? length : toIndex(end, length);
      while(endPos > index)O[index++] = value;
      return O;
    },
    // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
    find: createArrayMethod(5),
    // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
    findIndex: createArrayMethod(6)
  });
  
  if(framework){
    // 22.1.3.31 Array.prototype[@@unscopables]
    forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){
      ArrayUnscopables[it] = true;
    });
    SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
  }
}();

/******************************************************************************
 * Module : es6.iterators                                                     *
 ******************************************************************************/

!function(at){
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  defineStdIterators(Array, ARRAY, function(iterated, kind){
    set(this, ITER, {o: toObject(iterated), i: 0, k: kind});
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , kind  = iter.k
      , index = iter.i++;
    if(!O || index >= O.length){
      iter.o = undefined;
      return iterResult(1);
    }
    if(kind == KEY)  return iterResult(0, index);
    if(kind == VALUE)return iterResult(0, O[index]);
                     return iterResult(0, [index, O[index]]);
  }, VALUE);
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators[ARGUMENTS] = Iterators[ARRAY];
  
  // 21.1.3.27 String.prototype[@@iterator]()
  defineStdIterators(String, STRING, function(iterated){
    set(this, ITER, {o: String(iterated), i: 0});
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , index = iter.i
      , point;
    if(index >= O.length)return iterResult(1);
    point = at.call(O, index);
    iter.i += point.length;
    return iterResult(0, point);
  });
}(createPointAt(true));

/******************************************************************************
 * Module : web.immediate                                                     *
 ******************************************************************************/

// setImmediate shim
// Node.js 0.9+ & IE10+ has setImmediate, else:
isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE){
  var postMessage      = global.postMessage
    , addEventListener = global.addEventListener
    , MessageChannel   = global.MessageChannel
    , counter          = 0
    , queue            = {}
    , defer, channel, port;
  setImmediate = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    }
    defer(counter);
    return counter;
  }
  clearImmediate = function(id){
    delete queue[id];
  }
  function run(id){
    if(has(queue, id)){
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  }
  function listner(event){
    run(event.data);
  }
  // Node.js 0.8-
  if(NODE){
    defer = function(id){
      nextTick(part.call(run, id));
    }
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
    defer = function(id){
      postMessage(id, '*');
    }
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')){
    defer = function(id){
      html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run(id);
      }
    }
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(run, 0, id);
    }
  }
}('onreadystatechange');
$define(GLOBAL + BIND, {
  setImmediate:   setImmediate,
  clearImmediate: clearImmediate
});

/******************************************************************************
 * Module : es6.promise                                                       *
 ******************************************************************************/

// ES6 promises shim
// Based on https://github.com/getify/native-promise-only/
!function(Promise, test){
  isFunction(Promise) && isFunction(Promise.resolve)
  && Promise.resolve(test = new Promise(function(){})) == test
  || function(asap, RECORD){
    function isThenable(it){
      var then;
      if(isObject(it))then = it.then;
      return isFunction(then) ? then : false;
    }
    function handledRejectionOrHasOnRejected(promise){
      var record = promise[RECORD]
        , chain  = record.c
        , i      = 0
        , react;
      if(record.h)return true;
      while(chain.length > i){
        react = chain[i++];
        if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
      }
    }
    function notify(record, reject){
      var chain = record.c;
      if(reject || chain.length)asap(function(){
        var promise = record.p
          , value   = record.v
          , ok      = record.s == 1
          , i       = 0;
        if(reject && !handledRejectionOrHasOnRejected(promise)){
          setTimeout(function(){
            if(!handledRejectionOrHasOnRejected(promise)){
              if(NODE){
                if(!process.emit('unhandledRejection', value, promise)){
                  // default node.js behavior
                }
              } else if(isFunction(console.error)){
                console.error('Unhandled promise rejection', value);
              }
            }
          }, 1e3);
        } else while(chain.length > i)!function(react){
          var cb = ok ? react.ok : react.fail
            , ret, then;
          try {
            if(cb){
              if(!ok)record.h = true;
              ret = cb === true ? value : cb(value);
              if(ret === react.P){
                react.rej(TypeError(PROMISE + '-chain cycle'));
              } else if(then = isThenable(ret)){
                then.call(ret, react.res, react.rej);
              } else react.res(ret);
            } else react.rej(value);
          } catch(err){
            react.rej(err);
          }
        }(chain[i++]);
        chain.length = 0;
      });
    }
    function resolve(value){
      var record = this
        , then, wrapper;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      try {
        if(then = isThenable(value)){
          wrapper = {r: record, d: false}; // wrap
          then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
        } else {
          record.v = value;
          record.s = 1;
          notify(record);
        }
      } catch(err){
        reject.call(wrapper || {r: record, d: false}, err); // wrap
      }
    }
    function reject(value){
      var record = this;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      record.v = value;
      record.s = 2;
      notify(record, true);
    }
    function getConstructor(C){
      var S = assertObject(C)[SYMBOL_SPECIES];
      return S != undefined ? S : C;
    }
    // 25.4.3.1 Promise(executor)
    Promise = function(executor){
      assertFunction(executor);
      assertInstance(this, Promise, PROMISE);
      var record = {
        p: this,      // promise
        c: [],        // chain
        s: 0,         // state
        d: false,     // done
        v: undefined, // value
        h: false      // handled rejection
      };
      hidden(this, RECORD, record);
      try {
        executor(ctx(resolve, record, 1), ctx(reject, record, 1));
      } catch(err){
        reject.call(record, err);
      }
    }
    assignHidden(Promise[PROTOTYPE], {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function(onFulfilled, onRejected){
        var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
        var react = {
          ok:   isFunction(onFulfilled) ? onFulfilled : true,
          fail: isFunction(onRejected)  ? onRejected  : false
        } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){
          react.res = assertFunction(resolve);
          react.rej = assertFunction(reject);
        }), record = this[RECORD];
        record.c.push(react);
        record.s && notify(record);
        return P;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function(onRejected){
        return this.then(undefined, onRejected);
      }
    });
    assignHidden(Promise, {
      // 25.4.4.1 Promise.all(iterable)
      all: function(iterable){
        var Promise = getConstructor(this)
          , values  = [];
        return new Promise(function(resolve, reject){
          forOf(iterable, false, push, values);
          var remaining = values.length
            , results   = Array(remaining);
          if(remaining)forEach.call(values, function(promise, index){
            Promise.resolve(promise).then(function(value){
              results[index] = value;
              --remaining || resolve(results);
            }, reject);
          });
          else resolve(results);
        });
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function(iterable){
        var Promise = getConstructor(this);
        return new Promise(function(resolve, reject){
          forOf(iterable, false, function(promise){
            Promise.resolve(promise).then(resolve, reject);
          });
        });
      },
      // 25.4.4.5 Promise.reject(r)
      reject: function(r){
        return new (getConstructor(this))(function(resolve, reject){
          reject(r);
        });
      },
      // 25.4.4.6 Promise.resolve(x)
      resolve: function(x){
        return isObject(x) && RECORD in x && getPrototypeOf(x) === this[PROTOTYPE]
          ? x : new (getConstructor(this))(function(resolve, reject){
            resolve(x);
          });
      }
    });
  }(nextTick || setImmediate, safeSymbol('record'));
  setToStringTag(Promise, PROMISE);
  setSpecies(Promise);
  $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
}(global[PROMISE]);

/******************************************************************************
 * Module : es6.collections                                                   *
 ******************************************************************************/

// ECMAScript 6 collections shim
!function(){
  var UID   = safeSymbol('uid')
    , O1    = safeSymbol('O1')
    , WEAK  = safeSymbol('weak')
    , LEAK  = safeSymbol('leak')
    , LAST  = safeSymbol('last')
    , FIRST = safeSymbol('first')
    , SIZE  = DESC ? safeSymbol('size') : 'size'
    , uid   = 0
    , tmp   = {};
  
  function getCollection(C, NAME, methods, commonMethods, isMap, isWeak){
    var ADDER = isMap ? 'set' : 'add'
      , proto = C && C[PROTOTYPE]
      , O     = {};
    function initFromIterable(that, iterable){
      if(iterable != undefined)forOf(iterable, isMap, that[ADDER], that);
      return that;
    }
    function fixSVZ(key, chain){
      var method = proto[key];
      if(framework)proto[key] = function(a, b){
        var result = method.call(this, a === 0 ? 0 : a, b);
        return chain ? this : result;
      };
    }
    if(!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))){
      // create collection constructor
      C = isWeak
        ? function(iterable){
            assertInstance(this, C, NAME);
            set(this, UID, uid++);
            initFromIterable(this, iterable);
          }
        : function(iterable){
            var that = this;
            assertInstance(that, C, NAME);
            set(that, O1, create(null));
            set(that, SIZE, 0);
            set(that, LAST, undefined);
            set(that, FIRST, undefined);
            initFromIterable(that, iterable);
          };
      assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
      isWeak || !DESC || defineProperty(C[PROTOTYPE], 'size', {get: function(){
        return assertDefined(this[SIZE]);
      }});
    } else {
      var Native = C
        , inst   = new C
        , chain  = inst[ADDER](isWeak ? {} : -0, 1)
        , buggyZero;
      // wrap to init collections from iterable
      if(checkDangerIterClosing(function(O){ new C(O) })){
        C = function(iterable){
          assertInstance(this, C, NAME);
          return initFromIterable(new Native, iterable);
        }
        C[PROTOTYPE] = proto;
        if(framework)proto[CONSTRUCTOR] = C;
      }
      isWeak || inst[FOR_EACH](function(val, key){
        buggyZero = 1 / key === -Infinity;
      });
      // fix converting -0 key to +0
      if(buggyZero){
        fixSVZ('delete');
        fixSVZ('has');
        isMap && fixSVZ('get');
      }
      // + fix .add & .set for chaining
      if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
    }
    setToStringTag(C, NAME);
    setSpecies(C);
    
    O[NAME] = C;
    $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
    
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    isWeak || defineStdIterators(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return iterResult(1);
      }
      // return step by kind
      if(kind == KEY)  return iterResult(0, entry.k);
      if(kind == VALUE)return iterResult(0, entry.v);
                       return iterResult(0, [entry.k, entry.v]);   
    }, isMap ? KEY+VALUE : VALUE, !isMap);
    
    return C;
  }
  
  function fastKey(it, create){
    // return primitive with prefix
    if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
    // can't set id to frozen object
    if(isFrozen(it))return 'F';
    if(!has(it, UID)){
      // not necessary to add id
      if(!create)return 'E';
      // add missing object id
      hidden(it, UID, ++uid);
    // return object id with prefix
    } return 'O' + it[UID];
  }
  function getEntry(that, key){
    // fast case
    var index = fastKey(key), entry;
    if(index != 'F')return that[O1][index];
    // frozen object case
    for(entry = that[FIRST]; entry; entry = entry.n){
      if(entry.k == key)return entry;
    }
  }
  function def(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry)entry.v = value;
    // create new entry
    else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index != 'F')that[O1][index] = entry;
    } return that;
  }

  var collectionMethods = {
    // 23.1.3.1 Map.prototype.clear()
    // 23.2.3.2 Set.prototype.clear()
    clear: function(){
      for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
        entry.r = true;
        if(entry.p)entry.p = entry.p.n = undefined;
        delete data[entry.i];
      }
      that[FIRST] = that[LAST] = undefined;
      that[SIZE] = 0;
    },
    // 23.1.3.3 Map.prototype.delete(key)
    // 23.2.3.4 Set.prototype.delete(value)
    'delete': function(key){
      var that  = this
        , entry = getEntry(that, key);
      if(entry){
        var next = entry.n
          , prev = entry.p;
        delete that[O1][entry.i];
        entry.r = true;
        if(prev)prev.n = next;
        if(next)next.p = prev;
        if(that[FIRST] == entry)that[FIRST] = next;
        if(that[LAST] == entry)that[LAST] = prev;
        that[SIZE]--;
      } return !!entry;
    },
    // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
    // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
    forEach: function(callbackfn /*, that = undefined */){
      var f = ctx(callbackfn, arguments[1], 3)
        , entry;
      while(entry = entry ? entry.n : this[FIRST]){
        f(entry.v, entry.k, this);
        // revert to the last existing entry
        while(entry && entry.r)entry = entry.p;
      }
    },
    // 23.1.3.7 Map.prototype.has(key)
    // 23.2.3.7 Set.prototype.has(value)
    has: function(key){
      return !!getEntry(this, key);
    }
  }
  
  // 23.1 Map Objects
  Map = getCollection(Map, MAP, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function(key){
      var entry = getEntry(this, key);
      return entry && entry.v;
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function(key, value){
      return def(this, key === 0 ? 0 : key, value);
    }
  }, collectionMethods, true);
  
  // 23.2 Set Objects
  Set = getCollection(Set, SET, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function(value){
      return def(this, value = value === 0 ? 0 : value, value);
    }
  }, collectionMethods);
  
  function defWeak(that, key, value){
    if(isFrozen(assertObject(key)))leakStore(that).set(key, value);
    else {
      has(key, WEAK) || hidden(key, WEAK, {});
      key[WEAK][that[UID]] = value;
    } return that;
  }
  function leakStore(that){
    return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
  }
  
  var weakMethods = {
    // 23.3.3.2 WeakMap.prototype.delete(key)
    // 23.4.3.3 WeakSet.prototype.delete(value)
    'delete': function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this)['delete'](key);
      return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
    },
    // 23.3.3.4 WeakMap.prototype.has(key)
    // 23.4.3.4 WeakSet.prototype.has(value)
    has: function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this).has(key);
      return has(key, WEAK) && has(key[WEAK], this[UID]);
    }
  };
  
  // 23.3 WeakMap Objects
  WeakMap = getCollection(WeakMap, WEAKMAP, {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function(key){
      if(isObject(key)){
        if(isFrozen(key))return leakStore(this).get(key);
        if(has(key, WEAK))return key[WEAK][this[UID]];
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function(key, value){
      return defWeak(this, key, value);
    }
  }, weakMethods, true, true);
  
  // IE11 WeakMap frozen keys fix
  if(framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
    forEach.call(array('delete,has,get,set'), function(key){
      var method = WeakMap[PROTOTYPE][key];
      WeakMap[PROTOTYPE][key] = function(a, b){
        // store frozen objects on leaky map
        if(isObject(a) && isFrozen(a)){
          var result = leakStore(this)[key](a, b);
          return key == 'set' ? this : result;
        // store all the rest on native weakmap
        } return method.call(this, a, b);
      };
    });
  }
  
  // 23.4 WeakSet Objects
  WeakSet = getCollection(WeakSet, WEAKSET, {
    // 23.4.3.1 WeakSet.prototype.add(value)
    add: function(value){
      return defWeak(this, value, true);
    }
  }, weakMethods, false, true);
}();

/******************************************************************************
 * Module : es6.reflect                                                       *
 ******************************************************************************/

!function(){
  function Enumerate(iterated){
    var keys = [], key;
    for(key in iterated)keys.push(key);
    set(this, ITER, {o: iterated, a: keys, i: 0});
  }
  createIterator(Enumerate, OBJECT, function(){
    var iter = this[ITER]
      , keys = iter.a
      , key;
    do {
      if(iter.i >= keys.length)return iterResult(1);
    } while(!((key = keys[iter.i++]) in iter.o));
    return iterResult(0, key);
  });
  
  function wrap(fn){
    return function(it){
      assertObject(it);
      try {
        return fn.apply(undefined, arguments), true;
      } catch(e){
        return false;
      }
    }
  }
  
  function reflectGet(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
    if(desc)return has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getPrototypeOf(target))
      ? reflectGet(proto, propertyKey, receiver)
      : undefined;
  }
  function reflectSet(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = getOwnDescriptor(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getPrototypeOf(target))){
        return reflectSet(proto, propertyKey, V, receiver);
      }
      ownDesc = descriptor(0);
    }
    if(has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
      existingDescriptor.value = V;
      return defineProperty(receiver, propertyKey, existingDescriptor), true;
    }
    return ownDesc.set === undefined
      ? false
      : (ownDesc.set.call(receiver, V), true);
  }
  var isExtensible = Object.isExtensible || returnIt;
  
  var reflect = {
    // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
    apply: ctx(call, apply, 3),
    // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
    construct: function(target, argumentsList /*, newTarget*/){
      var proto    = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE]
        , instance = create(isObject(proto) ? proto : ObjectProto)
        , result   = apply.call(target, instance, argumentsList);
      return isObject(result) ? result : instance;
    },
    // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
    defineProperty: wrap(defineProperty),
    // 26.1.4 Reflect.deleteProperty(target, propertyKey)
    deleteProperty: function(target, propertyKey){
      var desc = getOwnDescriptor(assertObject(target), propertyKey);
      return desc && !desc.configurable ? false : delete target[propertyKey];
    },
    // 26.1.5 Reflect.enumerate(target)
    enumerate: function(target){
      return new Enumerate(assertObject(target));
    },
    // 26.1.6 Reflect.get(target, propertyKey [, receiver])
    get: reflectGet,
    // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
    getOwnPropertyDescriptor: function(target, propertyKey){
      return getOwnDescriptor(assertObject(target), propertyKey);
    },
    // 26.1.8 Reflect.getPrototypeOf(target)
    getPrototypeOf: function(target){
      return getPrototypeOf(assertObject(target));
    },
    // 26.1.9 Reflect.has(target, propertyKey)
    has: function(target, propertyKey){
      return propertyKey in target;
    },
    // 26.1.10 Reflect.isExtensible(target)
    isExtensible: function(target){
      return !!isExtensible(assertObject(target));
    },
    // 26.1.11 Reflect.ownKeys(target)
    ownKeys: ownKeys,
    // 26.1.12 Reflect.preventExtensions(target)
    preventExtensions: wrap(Object.preventExtensions || returnIt),
    // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
    set: reflectSet
  }
  // 26.1.14 Reflect.setPrototypeOf(target, proto)
  if(setPrototypeOf)reflect.setPrototypeOf = function(target, proto){
    return setPrototypeOf(assertObject(target), proto), true;
  };
  
  $define(GLOBAL, {Reflect: {}});
  $define(STATIC, 'Reflect', reflect);
}();

/******************************************************************************
 * Module : es7.proposals                                                     *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // https://github.com/domenic/Array.prototype.includes
    includes: createArrayContains(true)
  });
  $define(PROTO, STRING, {
    // https://github.com/mathiasbynens/String.prototype.at
    at: createPointAt(true)
  });
  
  function createObjectToArray(isEntries){
    return function(object){
      var O      = toObject(object)
        , keys   = getKeys(object)
        , length = keys.length
        , i      = 0
        , result = Array(length)
        , key;
      if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
      else while(length > i)result[i] = O[keys[i++]];
      return result;
    }
  }
  $define(STATIC, OBJECT, {
    // https://gist.github.com/WebReflection/9353781
    getOwnPropertyDescriptors: function(object){
      var O      = toObject(object)
        , result = {};
      forEach.call(ownKeys(O), function(key){
        defineProperty(result, key, descriptor(0, getOwnDescriptor(O, key)));
      });
      return result;
    },
    // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues
    values:  createObjectToArray(false),
    entries: createObjectToArray(true)
  });
  $define(STATIC, REGEXP, {
    // https://gist.github.com/kangax/9698100
    escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
  });
}();

/******************************************************************************
 * Module : es7.abstract-refs                                                 *
 ******************************************************************************/

// https://github.com/zenparsing/es-abstract-refs
!function(REFERENCE){
  REFERENCE_GET = getWellKnownSymbol(REFERENCE+'Get', true);
  var REFERENCE_SET = getWellKnownSymbol(REFERENCE+SET, true)
    , REFERENCE_DELETE = getWellKnownSymbol(REFERENCE+'Delete', true);
  
  $define(STATIC, SYMBOL, {
    referenceGet: REFERENCE_GET,
    referenceSet: REFERENCE_SET,
    referenceDelete: REFERENCE_DELETE
  });
  
  hidden(FunctionProto, REFERENCE_GET, returnThis);
  
  function setMapMethods(Constructor){
    if(Constructor){
      var MapProto = Constructor[PROTOTYPE];
      hidden(MapProto, REFERENCE_GET, MapProto.get);
      hidden(MapProto, REFERENCE_SET, MapProto.set);
      hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
    }
  }
  setMapMethods(Map);
  setMapMethods(WeakMap);
}('reference');

/******************************************************************************
 * Module : core.dict                                                         *
 ******************************************************************************/

!function(DICT){
  Dict = function(iterable){
    var dict = create(null);
    if(iterable != undefined){
      if(isIterable(iterable)){
        forOf(iterable, true, function(key, value){
          dict[key] = value;
        });
      } else assign(dict, iterable);
    }
    return dict;
  }
  Dict[PROTOTYPE] = null;
  
  function DictIterator(iterated, kind){
    set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
  }
  createIterator(DictIterator, DICT, function(){
    var iter = this[ITER]
      , O    = iter.o
      , keys = iter.a
      , kind = iter.k
      , key;
    do {
      if(iter.i >= keys.length){
        iter.o = undefined;
        return iterResult(1);
      }
    } while(!has(O, key = keys[iter.i++]));
    if(kind == KEY)  return iterResult(0, key);
    if(kind == VALUE)return iterResult(0, O[key]);
                     return iterResult(0, [key, O[key]]);
  });
  function createDictIter(kind){
    return function(it){
      return new DictIterator(it, kind);
    }
  }
  
  /*
   * 0 -> forEach
   * 1 -> map
   * 2 -> filter
   * 3 -> some
   * 4 -> every
   * 5 -> find
   * 6 -> findKey
   * 7 -> mapPairs
   */
  function createDictMethod(type){
    var isMap    = type == 1
      , isEvery  = type == 4;
    return function(object, callbackfn, that /* = undefined */){
      var f      = ctx(callbackfn, that, 3)
        , O      = toObject(object)
        , result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined
        , key, val, res;
      for(key in O)if(has(O, key)){
        val = O[key];
        res = f(val, key, object);
        if(type){
          if(isMap)result[key] = res;             // map
          else if(res)switch(type){
            case 2: result[key] = val; break      // filter
            case 3: return true;                  // some
            case 5: return val;                   // find
            case 6: return key;                   // findKey
            case 7: result[res[0]] = res[1];      // mapPairs
          } else if(isEvery)return false;         // every
        }
      }
      return type == 3 || isEvery ? isEvery : result;
    }
  }
  function createDictReduce(isTurn){
    return function(object, mapfn, init){
      assertFunction(mapfn);
      var O      = toObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , i      = 0
        , memo, key, result;
      if(isTurn)memo = init == undefined ? new (generic(this, Dict)) : Object(init);
      else if(arguments.length < 3){
        assert(length, REDUCE_ERROR);
        memo = O[keys[i++]];
      } else memo = Object(init);
      while(length > i)if(has(O, key = keys[i++])){
        result = mapfn(memo, O[key], key, object);
        if(isTurn){
          if(result === false)break;
        } else memo = result;
      }
      return memo;
    }
  }
  var findKey = createDictMethod(6);
  function includes(object, el){
    return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
  }
  
  var dictMethods = {
    keys:    createDictIter(KEY),
    values:  createDictIter(VALUE),
    entries: createDictIter(KEY+VALUE),
    forEach: createDictMethod(0),
    map:     createDictMethod(1),
    filter:  createDictMethod(2),
    some:    createDictMethod(3),
    every:   createDictMethod(4),
    find:    createDictMethod(5),
    findKey: findKey,
    mapPairs:createDictMethod(7),
    reduce:  createDictReduce(false),
    turn:    createDictReduce(true),
    keyOf:   keyOf,
    includes:includes,
    // Has / get / set own property
    has: has,
    get: get,
    set: createDefiner(0),
    isDict: function(it){
      return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
    }
  };
  
  if(REFERENCE_GET)for(var key in dictMethods)!function(fn){
    function method(){
      for(var args = [this], i = 0; i < arguments.length;)args.push(arguments[i++]);
      return invoke(fn, args);
    }
    fn[REFERENCE_GET] = function(){
      return method;
    }
  }(dictMethods[key]);
  
  $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
}('Dict');

/******************************************************************************
 * Module : core.$for                                                         *
 ******************************************************************************/

!function(ENTRIES, FN){  
  function $for(iterable, entries){
    if(!(this instanceof $for))return new $for(iterable, entries);
    this[ITER]    = getIterator(iterable);
    this[ENTRIES] = !!entries;
  }
  
  createIterator($for, 'Wrapper', function(){
    return this[ITER].next();
  });
  var $forProto = $for[PROTOTYPE];
  setIterator($forProto, function(){
    return this[ITER]; // unwrap
  });
  
  function createChainIterator(next){
    function Iter(I, fn, that){
      this[ITER]    = getIterator(I);
      this[ENTRIES] = I[ENTRIES];
      this[FN]      = ctx(fn, that, I[ENTRIES] ? 2 : 1);
    }
    createIterator(Iter, 'Chain', next, $forProto);
    setIterator(Iter[PROTOTYPE], returnThis); // override $forProto iterator
    return Iter;
  }
  
  var MapIter = createChainIterator(function(){
    var step = this[ITER].next();
    return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
  });
  
  var FilterIter = createChainIterator(function(){
    for(;;){
      var step = this[ITER].next();
      if(step.done || stepCall(this[FN], step.value, this[ENTRIES]))return step;
    }
  });
  
  assignHidden($forProto, {
    of: function(fn, that){
      forOf(this, this[ENTRIES], fn, that);
    },
    array: function(fn, that){
      var result = [];
      forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
      return result;
    },
    filter: function(fn, that){
      return new FilterIter(this, fn, that);
    },
    map: function(fn, that){
      return new MapIter(this, fn, that);
    }
  });
  
  $for.isIterable  = isIterable;
  $for.getIterator = getIterator;
  
  $define(GLOBAL + FORCED, {$for: $for});
}('entries', safeSymbol('fn'));

/******************************************************************************
 * Module : core.delay                                                        *
 ******************************************************************************/

// https://esdiscuss.org/topic/promise-returning-delay-function
$define(GLOBAL + FORCED, {
  delay: function(time){
    return new Promise(function(resolve){
      setTimeout(resolve, time, true);
    });
  }
});

/******************************************************************************
 * Module : core.binding                                                      *
 ******************************************************************************/

!function(_, toLocaleString){
  // Placeholder
  core._ = path._ = path._ || {};

  $define(PROTO + FORCED, FUNCTION, {
    part: part,
    only: function(numberArguments, that /* = @ */){
      var fn     = assertFunction(this)
        , n      = toLength(numberArguments)
        , isThat = arguments.length > 1;
      return function(/* ...args */){
        var length = min(n, arguments.length)
          , args   = Array(length)
          , i      = 0;
        while(length > i)args[i] = arguments[i++];
        return invoke(fn, args, isThat ? that : this);
      }
    }
  });
  
  function tie(key){
    var that  = this
      , bound = {};
    return hidden(that, _, function(key){
      if(key === undefined || !(key in that))return toLocaleString.call(that);
      return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
    })[_](key);
  }
  
  hidden(path._, TO_STRING, function(){
    return _;
  });
  
  hidden(ObjectProto, _, tie);
  DESC || hidden(ArrayProto, _, tie);
  // IE8- dirty hack - redefined toLocaleString is not enumerable
}(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);

/******************************************************************************
 * Module : core.object                                                       *
 ******************************************************************************/

!function(){
  function define(target, mixin){
    var keys   = ownKeys(toObject(mixin))
      , length = keys.length
      , i = 0, key;
    while(length > i)defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
    return target;
  };
  $define(STATIC + FORCED, OBJECT, {
    isObject: isObject,
    classof: classof,
    define: define,
    make: function(proto, mixin){
      return define(create(proto), mixin);
    }
  });
}();

/******************************************************************************
 * Module : core.array                                                        *
 ******************************************************************************/

$define(PROTO + FORCED, ARRAY, {
  turn: function(fn, target /* = [] */){
    assertFunction(fn);
    var memo   = target == undefined ? [] : Object(target)
      , O      = ES5Object(this)
      , length = toLength(O.length)
      , index  = 0;
    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
    return memo;
  }
});
if(framework)ArrayUnscopables.turn = true;

/******************************************************************************
 * Module : core.number                                                       *
 ******************************************************************************/

!function(numberMethods){  
  function NumberIterator(iterated){
    set(this, ITER, {l: toLength(iterated), i: 0});
  }
  createIterator(NumberIterator, NUMBER, function(){
    var iter = this[ITER]
      , i    = iter.i++;
    return i < iter.l ? iterResult(0, i) : iterResult(1);
  });
  defineIterator(Number, NUMBER, function(){
    return new NumberIterator(this);
  });
  
  numberMethods.random = function(lim /* = 0 */){
    var a = +this
      , b = lim == undefined ? 0 : +lim
      , m = min(a, b);
    return random() * (max(a, b) - m) + m;
  };

  forEach.call(array(
      // ES3:
      'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
      // ES6:
      'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
    ), function(key){
      var fn = Math[key];
      if(fn)numberMethods[key] = function(/* ...args */){
        // ie9- dont support strict mode & convert `this` to object -> convert it to number
        var args = [+this]
          , i    = 0;
        while(arguments.length > i)args.push(arguments[i++]);
        return invoke(fn, args);
      }
    }
  );
  
  $define(PROTO + FORCED, NUMBER, numberMethods);
}({});

/******************************************************************************
 * Module : core.string                                                       *
 ******************************************************************************/

!function(){
  var escapeHTMLDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }, unescapeHTMLDict = {}, key;
  for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
  $define(PROTO + FORCED, STRING, {
    escapeHTML:   createReplacer(/[&<>"']/g, escapeHTMLDict),
    unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
  });
}();

/******************************************************************************
 * Module : core.date                                                         *
 ******************************************************************************/

!function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR){
  function createFormat(prefix){
    return function(template, locale /* = current */){
      var that = this
        , dict = locales[has(locales, locale) ? locale : current];
      function get(unit){
        return that[prefix + unit]();
      }
      return String(template).replace(formatRegExp, function(part){
        switch(part){
          case 's'  : return get(SECONDS);                  // Seconds : 0-59
          case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
          case 'm'  : return get(MINUTES);                  // Minutes : 0-59
          case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
          case 'h'  : return get(HOURS);                    // Hours   : 0-23
          case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
          case 'D'  : return get(DATE);                     // Date    : 1-31
          case 'DD' : return lz(get(DATE));                 // Date    : 01-31
          case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
          case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
          case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
          case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
          case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
          case 'Y'  : return get(YEAR);                     // Year    : 2014
          case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
        } return part;
      });
    }
  }
  function addLocale(lang, locale){
    function split(index){
      var result = [];
      forEach.call(array(locale.months), function(it){
        result.push(it.replace(flexioRegExp, '$' + index));
      });
      return result;
    }
    locales[lang] = [array(locale.weekdays), split(1), split(2)];
    return core;
  }
  $define(PROTO + FORCED, DATE, {
    format:    createFormat('get'),
    formatUTC: createFormat('getUTC')
  });
  addLocale(current, {
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'
  });
  addLocale('ru', {
    weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
    months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
            'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
  });
  core.locale = function(locale){
    return has(locales, locale) ? current = locale : current;
  };
  core.addLocale = addLocale;
}(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');

/******************************************************************************
 * Module : core.global                                                       *
 ******************************************************************************/

$define(GLOBAL + FORCED, {global: global});

/******************************************************************************
 * Module : js.array.statics                                                  *
 ******************************************************************************/

// JavaScript 1.6 / Strawman array statics shim
!function(arrayStatics){
  function setArrayStatics(keys, length){
    forEach.call(array(keys), function(key){
      if(key in ArrayProto)arrayStatics[key] = ctx(call, ArrayProto[key], length);
    });
  }
  setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
  setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
  setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
                  'reduce,reduceRight,copyWithin,fill,turn');
  $define(STATIC, ARRAY, arrayStatics);
}({});

/******************************************************************************
 * Module : web.dom.itarable                                                  *
 ******************************************************************************/

!function(NodeList){
  if(framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])){
    hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
  }
  Iterators.NodeList = Iterators[ARRAY];
}(global.NodeList);

/******************************************************************************
 * Module : core.log                                                          *
 ******************************************************************************/

!function(log, enabled){
  // Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
  forEach.call(array('assert,clear,count,debug,dir,dirxml,error,exception,' +
      'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
      'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
      'timelineEnd,timeStamp,trace,warn'), function(key){
    log[key] = function(){
      if(enabled && key in console)return apply.call(console[key], console, arguments);
    };
  });
  $define(GLOBAL + FORCED, {log: assign(log.log, log, {
    enable: function(){
      enabled = true;
    },
    disable: function(){
      enabled = false;
    }
  })});
}({}, true);
}(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), false);
module.exports = { "default": module.exports, __esModule: true };

},{}],22:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],23:[function(require,module,exports){
"use strict";

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var key in props) {
      var prop = props[key];
      prop.configurable = true;
      if (prop.value) prop.writable = true;
    }

    Object.defineProperties(target, props);
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{}],24:[function(require,module,exports){
"use strict";

var _core = require("babel-runtime/core-js")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;

    var desc = _core.Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = _core.Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js":21}],25:[function(require,module,exports){
"use strict";

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{}],26:[function(require,module,exports){
/**
 * @file Loaders: AudioBuffer loader and utilities
 * @author Samuel Goldszmidt
 * @version 0.1.1
 */

// CommonJS function export
module.exports = {
  Loader: require('./dist/loader'),
  AudioBufferLoader: require('./dist/audio-buffer-loader'),
  SuperLoader: require('./dist/super-loader')
};

},{"./dist/audio-buffer-loader":18,"./dist/loader":19,"./dist/super-loader":20}],27:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],28:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],29:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],30:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"babel-runtime/core-js":27,"dup":24}],31:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],32:[function(require,module,exports){
"use strict";
'use strict';
var wavesAudio = {
  audioContext: require('./dist/core/audio-context'),
  TimeEngine: require('./dist/core/time-engine'),
  GranularEngine: require('./dist/engines/granular-engine'),
  Metronome: require('./dist/engines/metronome'),
  PlayerEngine: require('./dist/engines/player-engine'),
  SegmentEngine: require('./dist/engines/segment-engine'),
  PlayControl: require('./dist/masters/play-control'),
  Transport: require('./dist/masters/transport'),
  Scheduler: require('./dist/masters/scheduler'),
  SimpleScheduler: require('./dist/masters/simple-scheduler'),
  PriorityQueue: require('./dist/utils/priority-queue-heap'),
  getScheduler: require('./dist/masters/factories').getScheduler,
  getSimpleScheduler: require('./dist/masters/factories').getSimpleScheduler
};
module.exports = wavesAudio;


//# sourceURL=/Users/rvincent/audio/waves-audio.js
},{"./dist/core/audio-context":2,"./dist/core/time-engine":3,"./dist/engines/granular-engine":4,"./dist/engines/metronome":5,"./dist/engines/player-engine":6,"./dist/engines/segment-engine":7,"./dist/masters/factories":8,"./dist/masters/play-control":9,"./dist/masters/scheduler":10,"./dist/masters/simple-scheduler":11,"./dist/masters/transport":12,"./dist/utils/priority-queue-heap":16}]},{},[17])(17)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9jb3JlL2FjLW1vbmtleXBhdGNoLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvY29yZS9hdWRpby1jb250ZXh0LmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvY29yZS90aW1lLWVuZ2luZS5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L2VuZ2luZXMvZ3JhbnVsYXItZW5naW5lLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvZW5naW5lcy9tZXRyb25vbWUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9lbmdpbmVzL3BsYXllci1lbmdpbmUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9lbmdpbmVzL3NlZ21lbnQtZW5naW5lLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy9mYWN0b3JpZXMuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9tYXN0ZXJzL3BsYXktY29udHJvbC5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L21hc3RlcnMvc2NoZWR1bGVyLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy9zaW1wbGUtc2NoZWR1bGVyLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy90cmFuc3BvcnQuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC91dGlscy9oZWFwL2hlYXAuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC91dGlscy9oZWFwL21heC1oZWFwLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvdXRpbHMvaGVhcC9taW4taGVhcC5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L3V0aWxzL3ByaW9yaXR5LXF1ZXVlLWhlYXAuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZXhhbXBsZXMvaW5kZXguZXM2LmpzIiwiZXM2L3N1cGVyLWxvYWRlci5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMuanMiLCJub2RlX21vZHVsZXMvd2F2ZXMtbG9hZGVycy9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2suanMiLCJub2RlX21vZHVsZXMvd2F2ZXMtbG9hZGVycy9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL3dhdmVzLWxvYWRlcnMvbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL3dhdmVzLWxvYWRlcnMuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vd2F2ZXMtYXVkaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBLFdBQVcsQ0FBQztBQW1EWixBQUFDLFNBQVUsTUFBSyxDQUFHLENBQUEsT0FBTSxDQUFHLENBQUEsSUFBRyxDQUFHO0FBQ2hDLGFBQVcsQ0FBQztBQUVaLFNBQVMsYUFBVyxDQUFFLEtBQUksQ0FBRztBQUMzQixPQUFJLENBQUMsS0FBSSxDQUFHO0FBRVYsWUFBTTtJQUNSO0FBQUEsQUFBQyxPQUFJLENBQUMsS0FBSSxnQkFBZ0I7QUFBRyxVQUFJLGdCQUFnQixFQUFJLENBQUEsS0FBSSxxQkFBcUIsQ0FBQztBQUFBLEVBQ2pGO0FBQUEsQUFFQSxLQUFJLE1BQUssZUFBZSxBQUFDLENBQUMsb0JBQW1CLENBQUMsQ0FBQSxFQUFLLEVBQUMsTUFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQTtBQUFBLFdBQVcsQ0FBQztBQUVaLEFBQUksRUFBQSxDQUFBLFVBQVMsRUFBSTtBQUVmLGFBQVcsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDJCQUEwQixDQUFDO0FBQ2pELFdBQVMsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLHlCQUF3QixDQUFDO0FBRTdDLGVBQWEsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLGdDQUErQixDQUFDO0FBQ3hELFVBQVEsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDBCQUF5QixDQUFDO0FBQzdDLGFBQVcsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDhCQUE2QixDQUFDO0FBQ3BELGNBQVksQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLCtCQUE4QixDQUFDO0FBRXRELFlBQVUsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDZCQUE0QixDQUFDO0FBQ2xELFVBQVEsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDBCQUF5QixDQUFDO0FBRTdDLFVBQVEsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDBCQUF5QixDQUFDO0FBQzdDLGdCQUFjLENBQUcsQ0FBQSxPQUFNLEFBQUMsQ0FBQyxpQ0FBZ0MsQ0FBQztBQUUxRCxjQUFZLENBQUcsQ0FBQSxPQUFNLEFBQUMsQ0FBQyxrQ0FBaUMsQ0FBQztBQUV6RCxhQUFXLENBQUcsQ0FBQSxPQUFNLEFBQUMsQ0FBQywwQkFBeUIsQ0FBQyxhQUFhO0FBQzdELG1CQUFpQixDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsMEJBQXlCLENBQUMsbUJBQW1CO0FBQUEsQUFDM0UsQ0FBQztBQUlELEtBQUssUUFBUSxFQUFJLFdBQVMsQ0FBQztBQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBDb3B5cmlnaHQgMjAxMyBDaHJpcyBXaWxzb25cblxuICAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAgIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiAgIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAgIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG4vKiBcblxuVGhpcyBtb25rZXlwYXRjaCBsaWJyYXJ5IGlzIGludGVuZGVkIHRvIGJlIGluY2x1ZGVkIGluIHByb2plY3RzIHRoYXQgYXJlXG53cml0dGVuIHRvIHRoZSBwcm9wZXIgQXVkaW9Db250ZXh0IHNwZWMgKGluc3RlYWQgb2Ygd2Via2l0QXVkaW9Db250ZXh0KSwgXG5hbmQgdGhhdCB1c2UgdGhlIG5ldyBuYW1pbmcgYW5kIHByb3BlciBiaXRzIG9mIHRoZSBXZWIgQXVkaW8gQVBJIChlLmcuIFxudXNpbmcgQnVmZmVyU291cmNlTm9kZS5zdGFydCgpIGluc3RlYWQgb2YgQnVmZmVyU291cmNlTm9kZS5ub3RlT24oKSksIGJ1dCBtYXlcbmhhdmUgdG8gcnVuIG9uIHN5c3RlbXMgdGhhdCBvbmx5IHN1cHBvcnQgdGhlIGRlcHJlY2F0ZWQgYml0cy5cblxuVGhpcyBsaWJyYXJ5IHNob3VsZCBiZSBoYXJtbGVzcyB0byBpbmNsdWRlIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIFxudW5wcmVmaXhlZCBcIkF1ZGlvQ29udGV4dFwiLCBhbmQvb3IgaWYgaXQgc3VwcG9ydHMgdGhlIG5ldyBuYW1lcy4gIFxuXG5UaGUgcGF0Y2hlcyB0aGlzIGxpYnJhcnkgaGFuZGxlczpcbmlmIHdpbmRvdy5BdWRpb0NvbnRleHQgaXMgdW5zdXBwb3J0ZWQsIGl0IHdpbGwgYmUgYWxpYXNlZCB0byB3ZWJraXRBdWRpb0NvbnRleHQoKS5cbmlmIEF1ZGlvQnVmZmVyU291cmNlTm9kZS5zdGFydCgpIGlzIHVuaW1wbGVtZW50ZWQsIGl0IHdpbGwgYmUgcm91dGVkIHRvIG5vdGVPbigpIG9yXG5ub3RlR3JhaW5PbigpLCBkZXBlbmRpbmcgb24gcGFyYW1ldGVycy5cblxuVGhlIGZvbGxvd2luZyBhbGlhc2VzIG9ubHkgdGFrZSBlZmZlY3QgaWYgdGhlIG5ldyBuYW1lcyBhcmUgbm90IGFscmVhZHkgaW4gcGxhY2U6XG5cbkF1ZGlvQnVmZmVyU291cmNlTm9kZS5zdG9wKCkgaXMgYWxpYXNlZCB0byBub3RlT2ZmKClcbkF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCkgaXMgYWxpYXNlZCB0byBjcmVhdGVHYWluTm9kZSgpXG5BdWRpb0NvbnRleHQuY3JlYXRlRGVsYXkoKSBpcyBhbGlhc2VkIHRvIGNyZWF0ZURlbGF5Tm9kZSgpXG5BdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKCkgaXMgYWxpYXNlZCB0byBjcmVhdGVKYXZhU2NyaXB0Tm9kZSgpXG5BdWRpb0NvbnRleHQuY3JlYXRlUGVyaW9kaWNXYXZlKCkgaXMgYWxpYXNlZCB0byBjcmVhdGVXYXZlVGFibGUoKVxuT3NjaWxsYXRvck5vZGUuc3RhcnQoKSBpcyBhbGlhc2VkIHRvIG5vdGVPbigpXG5Pc2NpbGxhdG9yTm9kZS5zdG9wKCkgaXMgYWxpYXNlZCB0byBub3RlT2ZmKClcbk9zY2lsbGF0b3JOb2RlLnNldFBlcmlvZGljV2F2ZSgpIGlzIGFsaWFzZWQgdG8gc2V0V2F2ZVRhYmxlKClcbkF1ZGlvUGFyYW0uc2V0VGFyZ2V0QXRUaW1lKCkgaXMgYWxpYXNlZCB0byBzZXRUYXJnZXRWYWx1ZUF0VGltZSgpXG5cblRoaXMgbGlicmFyeSBkb2VzIE5PVCBwYXRjaCB0aGUgZW51bWVyYXRlZCB0eXBlIGNoYW5nZXMsIGFzIGl0IGlzIFxucmVjb21tZW5kZWQgaW4gdGhlIHNwZWNpZmljYXRpb24gdGhhdCBpbXBsZW1lbnRhdGlvbnMgc3VwcG9ydCBib3RoIGludGVnZXJcbmFuZCBzdHJpbmcgdHlwZXMgZm9yIEF1ZGlvUGFubmVyTm9kZS5wYW5uaW5nTW9kZWwsIEF1ZGlvUGFubmVyTm9kZS5kaXN0YW5jZU1vZGVsIFxuQmlxdWFkRmlsdGVyTm9kZS50eXBlIGFuZCBPc2NpbGxhdG9yTm9kZS50eXBlLlxuXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGV4cG9ydHMsIHBlcmYpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgZnVuY3Rpb24gZml4U2V0VGFyZ2V0KHBhcmFtKSB7XG4gICAgaWYgKCFwYXJhbSkge1xuICAgICAgLy8gaWYgTllJLCBqdXN0IHJldHVyblxuICAgICAgcmV0dXJuO1xuICAgIH1pZiAoIXBhcmFtLnNldFRhcmdldEF0VGltZSkgcGFyYW0uc2V0VGFyZ2V0QXRUaW1lID0gcGFyYW0uc2V0VGFyZ2V0VmFsdWVBdFRpbWU7XG4gIH1cblxuICBpZiAod2luZG93Lmhhc093blByb3BlcnR5KFwid2Via2l0QXVkaW9Db250ZXh0XCIpICYmICF3aW5kb3cuaGFzT3duUHJvcGVydHkoXCJBdWRpb0NvbnRleHRcIikpIHtcbiAgICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2Via2l0QXVkaW9Db250ZXh0O1xuXG4gICAgaWYgKCFBdWRpb0NvbnRleHQucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiY3JlYXRlR2FpblwiKSkgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVHYWluID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVHYWluTm9kZTtcbiAgICBpZiAoIUF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoXCJjcmVhdGVEZWxheVwiKSkgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEZWxheSA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlRGVsYXlOb2RlO1xuICAgIGlmICghQXVkaW9Db250ZXh0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShcImNyZWF0ZVNjcmlwdFByb2Nlc3NvclwiKSkgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUphdmFTY3JpcHROb2RlO1xuICAgIGlmICghQXVkaW9Db250ZXh0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShcImNyZWF0ZVBlcmlvZGljV2F2ZVwiKSkgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVQZXJpb2RpY1dhdmUgPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZVdhdmVUYWJsZTtcblxuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaW50ZXJuYWxfY3JlYXRlR2FpbiA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlR2FpbjtcbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUdhaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuaW50ZXJuYWxfY3JlYXRlR2FpbigpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuZ2Fpbik7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5pbnRlcm5hbF9jcmVhdGVEZWxheSA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlRGVsYXk7XG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEZWxheSA9IGZ1bmN0aW9uIChtYXhEZWxheVRpbWUpIHtcbiAgICAgIHZhciBub2RlID0gbWF4RGVsYXlUaW1lID8gdGhpcy5pbnRlcm5hbF9jcmVhdGVEZWxheShtYXhEZWxheVRpbWUpIDogdGhpcy5pbnRlcm5hbF9jcmVhdGVEZWxheSgpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuZGVsYXlUaW1lKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmludGVybmFsX2NyZWF0ZUJ1ZmZlclNvdXJjZSA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlQnVmZmVyU291cmNlO1xuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlQnVmZmVyU291cmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLmludGVybmFsX2NyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgaWYgKCFub2RlLnN0YXJ0KSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSBmdW5jdGlvbiAod2hlbiwgb2Zmc2V0LCBkdXJhdGlvbikge1xuICAgICAgICAgIGlmIChvZmZzZXQgfHwgZHVyYXRpb24pIHRoaXMubm90ZUdyYWluT24od2hlbiwgb2Zmc2V0LCBkdXJhdGlvbik7ZWxzZSB0aGlzLm5vdGVPbih3aGVuKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghbm9kZS5zdG9wKSBub2RlLnN0b3AgPSBub2RlLm5vdGVPZmY7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5wbGF5YmFja1JhdGUpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcblxuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaW50ZXJuYWxfY3JlYXRlRHluYW1pY3NDb21wcmVzc29yID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3I7XG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuaW50ZXJuYWxfY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS50aHJlc2hvbGQpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUua25lZSk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5yYXRpbyk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5yZWR1Y3Rpb24pO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuYXR0YWNrKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLnJlbGVhc2UpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcblxuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaW50ZXJuYWxfY3JlYXRlQmlxdWFkRmlsdGVyID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVCaXF1YWRGaWx0ZXI7XG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVCaXF1YWRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuaW50ZXJuYWxfY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5mcmVxdWVuY3kpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuZGV0dW5lKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLlEpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuZ2Fpbik7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgaWYgKEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoXCJjcmVhdGVPc2NpbGxhdG9yXCIpKSB7XG4gICAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmludGVybmFsX2NyZWF0ZU9zY2lsbGF0b3IgPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZU9zY2lsbGF0b3I7XG4gICAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZU9zY2lsbGF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5pbnRlcm5hbF9jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICAgIGlmICghbm9kZS5zdGFydCkgbm9kZS5zdGFydCA9IG5vZGUubm90ZU9uO1xuICAgICAgICBpZiAoIW5vZGUuc3RvcCkgbm9kZS5zdG9wID0gbm9kZS5ub3RlT2ZmO1xuICAgICAgICBpZiAoIW5vZGUuc2V0UGVyaW9kaWNXYXZlKSBub2RlLnNldFBlcmlvZGljV2F2ZSA9IG5vZGUuc2V0V2F2ZVRhYmxlO1xuICAgICAgICBmaXhTZXRUYXJnZXQobm9kZS5mcmVxdWVuY3kpO1xuICAgICAgICBmaXhTZXRUYXJnZXQobm9kZS5kZXR1bmUpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59KSh3aW5kb3cpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3UVVGcFJFRXNRVUZCUXl4RFFVRkJMRlZCUVZVc1RVRkJUU3hGUVVGRkxFOUJRVThzUlVGQlJTeEpRVUZKTEVWQlFVVTdRVUZEYUVNc1kwRkJXU3hEUVVGRE96dEJRVVZpTEZkQlFWTXNXVUZCV1N4RFFVRkRMRXRCUVVzc1JVRkJSVHRCUVVNelFpeFJRVUZKTEVOQlFVTXNTMEZCU3pzN1FVRkRVaXhoUVVGUE8wdEJRVUVzUVVGRFZDeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1JVRkRlRUlzUzBGQlN5eERRVUZETEdWQlFXVXNSMEZCUnl4TFFVRkxMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTTdSMEZEZEVRN08wRkJSVVFzVFVGQlNTeE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVsQlF6TkRMRU5CUVVNc1RVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eGpRVUZqTEVOQlFVTXNSVUZCUlR0QlFVTXhReXhWUVVGTkxFTkJRVU1zV1VGQldTeEhRVUZITEd0Q1FVRnJRaXhEUVVGRE96dEJRVVY2UXl4UlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eGpRVUZqTEVOQlFVTXNXVUZCV1N4RFFVRkRMRVZCUTNSRUxGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNWVUZCVlN4SFFVRkhMRmxCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zWTBGQll5eERRVUZETzBGQlF6VkZMRkZCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVTBGQlV5eERRVUZETEdOQlFXTXNRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkRka1FzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRWRCUVVjc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eGxRVUZsTEVOQlFVTTdRVUZET1VVc1VVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkRMSFZDUVVGMVFpeERRVUZETEVWQlEycEZMRmxCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zY1VKQlFYRkNMRWRCUVVjc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eHZRa0ZCYjBJc1EwRkJRenRCUVVNM1JpeFJRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1JVRkRPVVFzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMR1ZCUVdVc1EwRkJRenM3UVVGSGNrWXNaMEpCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zYlVKQlFXMUNMRWRCUVVjc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eFZRVUZWTEVOQlFVTTdRVUZETDBVc1owSkJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNWVUZCVlN4SFFVRkhMRmxCUVZjN1FVRkROME1zVlVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTTdRVUZEZEVNc2EwSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRlRUlzWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZEWWl4RFFVRkRPenRCUVVWR0xHZENRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRzlDUVVGdlFpeEhRVUZITEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRE8wRkJRMnBHTEdkQ1FVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExGZEJRVmNzUjBGQlJ5eFZRVUZUTEZsQlFWa3NSVUZCUlR0QlFVTXhSQ3hWUVVGSkxFbEJRVWtzUjBGQlJ5eFpRVUZaTEVkQlFVY3NTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEZsQlFWa3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNSVUZCUlN4RFFVRkRPMEZCUTJoSExHdENRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRemRDTEdGQlFVOHNTVUZCU1N4RFFVRkRPMHRCUTJJc1EwRkJRenM3UVVGRlJpeG5Ra0ZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXd5UWtGQk1rSXNSMEZCUnl4WlFVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExHdENRVUZyUWl4RFFVRkRPMEZCUXk5R0xHZENRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMR3RDUVVGclFpeEhRVUZITEZsQlFWYzdRVUZEY2tRc1ZVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETERKQ1FVRXlRaXhGUVVGRkxFTkJRVU03UVVGRE9VTXNWVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRFppeFpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRlZCUVZjc1NVRkJTU3hGUVVGRkxFMUJRVTBzUlVGQlJTeFJRVUZSTEVWQlFVYzdRVUZETDBNc1kwRkJTeXhOUVVGTkxFbEJRVWtzVVVGQlVTeEZRVU55UWl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRkxFbEJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVXNVVUZCVVN4RFFVRkZMRU5CUVVNc1MwRkZNME1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUlN4SlFVRkpMRU5CUVVVc1EwRkJRenRUUVVOMlFpeERRVUZETzA5QlEwZzdRVUZEUkN4VlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGRFdpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03UVVGRE0wSXNhMEpCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZEYUVNc1lVRkJUeXhKUVVGSkxFTkJRVU03UzBGRFlpeERRVUZET3p0QlFVVkdMR2RDUVVGWkxFTkJRVU1zVTBGQlV5eERRVUZETEdsRFFVRnBReXhIUVVGSExGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU03UVVGRE0wY3NaMEpCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zZDBKQlFYZENMRWRCUVVjc1dVRkJWenRCUVVNelJDeFZRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc2FVTkJRV2xETEVWQlFVVXNRMEZCUXp0QlFVTndSQ3hyUWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVNM1FpeHJRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU40UWl4clFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTjZRaXhyUWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVNM1FpeHJRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU14UWl4clFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXpRaXhoUVVGUExFbEJRVWtzUTBGQlF6dExRVU5pTEVOQlFVTTdPMEZCUlVZc1owSkJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNNa0pCUVRKQ0xFZEJRVWNzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4clFrRkJhMElzUTBGQlF6dEJRVU12Uml4blFrRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eHJRa0ZCYTBJc1IwRkJSeXhaUVVGWE8wRkJRM0pFTEZWQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXd5UWtGQk1rSXNSVUZCUlN4RFFVRkRPMEZCUXpsRExHdENRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRemRDTEd0Q1FVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlF6RkNMR3RDUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNKQ0xHdENRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRM2hDTEdGQlFVOHNTVUZCU1N4RFFVRkRPMHRCUTJJc1EwRkJRenM3UVVGRlJpeFJRVUZKTEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1kwRkJZeXhEUVVGRkxHdENRVUZyUWl4RFFVRkZMRVZCUVVVN1FVRkRMMFFzYTBKQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc2VVSkJRWGxDTEVkQlFVY3NXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNRMEZCUXp0QlFVTXpSaXhyUWtGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4blFrRkJaMElzUjBGQlJ5eFpRVUZYTzBGQlEyNUVMRmxCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eDVRa0ZCZVVJc1JVRkJSU3hEUVVGRE8wRkJRelZETEZsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVOaUxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVNelFpeFpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkRXaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkRNMElzV1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUTNaQ0xFbEJRVWtzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVNelF5eHZRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4dlFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhsUVVGUExFbEJRVWtzUTBGQlF6dFBRVU5pTEVOQlFVTTdTMEZEU0R0SFFVTkdPME5CUTBZc1EwRkJRU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZGSWl3aVptbHNaU0k2SW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFJRU52Y0hseWFXZG9kQ0F5TURFeklFTm9jbWx6SUZkcGJITnZibHh1WEc0Z0lDQk1hV05sYm5ObFpDQjFibVJsY2lCMGFHVWdRWEJoWTJobElFeHBZMlZ1YzJVc0lGWmxjbk5wYjI0Z01pNHdJQ2gwYUdVZ1hDSk1hV05sYm5ObFhDSXBPMXh1SUNBZ2VXOTFJRzFoZVNCdWIzUWdkWE5sSUhSb2FYTWdabWxzWlNCbGVHTmxjSFFnYVc0Z1kyOXRjR3hwWVc1alpTQjNhWFJvSUhSb1pTQk1hV05sYm5ObExseHVJQ0FnV1c5MUlHMWhlU0J2WW5SaGFXNGdZU0JqYjNCNUlHOW1JSFJvWlNCTWFXTmxibk5sSUdGMFhHNWNiaUFnSUNBZ0lDQm9kSFJ3T2k4dmQzZDNMbUZ3WVdOb1pTNXZjbWN2YkdsalpXNXpaWE12VEVsRFJVNVRSUzB5TGpCY2JseHVJQ0FnVlc1c1pYTnpJSEpsY1hWcGNtVmtJR0o1SUdGd2NHeHBZMkZpYkdVZ2JHRjNJRzl5SUdGbmNtVmxaQ0IwYnlCcGJpQjNjbWwwYVc1bkxDQnpiMlowZDJGeVpWeHVJQ0FnWkdsemRISnBZblYwWldRZ2RXNWtaWElnZEdobElFeHBZMlZ1YzJVZ2FYTWdaR2x6ZEhKcFluVjBaV1FnYjI0Z1lXNGdYQ0pCVXlCSlUxd2lJRUpCVTBsVExGeHVJQ0FnVjBsVVNFOVZWQ0JYUVZKU1FVNVVTVVZUSUU5U0lFTlBUa1JKVkVsUFRsTWdUMFlnUVU1WklFdEpUa1FzSUdWcGRHaGxjaUJsZUhCeVpYTnpJRzl5SUdsdGNHeHBaV1F1WEc0Z0lDQlRaV1VnZEdobElFeHBZMlZ1YzJVZ1ptOXlJSFJvWlNCemNHVmphV1pwWXlCc1lXNW5kV0ZuWlNCbmIzWmxjbTVwYm1jZ2NHVnliV2x6YzJsdmJuTWdZVzVrWEc0Z0lDQnNhVzFwZEdGMGFXOXVjeUIxYm1SbGNpQjBhR1VnVEdsalpXNXpaUzVjYmlvdlhHNWNiaThxSUZ4dVhHNVVhR2x6SUcxdmJtdGxlWEJoZEdOb0lHeHBZbkpoY25rZ2FYTWdhVzUwWlc1a1pXUWdkRzhnWW1VZ2FXNWpiSFZrWldRZ2FXNGdjSEp2YW1WamRITWdkR2hoZENCaGNtVmNibmR5YVhSMFpXNGdkRzhnZEdobElIQnliM0JsY2lCQmRXUnBiME52Ym5SbGVIUWdjM0JsWXlBb2FXNXpkR1ZoWkNCdlppQjNaV0pyYVhSQmRXUnBiME52Ym5SbGVIUXBMQ0JjYm1GdVpDQjBhR0YwSUhWelpTQjBhR1VnYm1WM0lHNWhiV2x1WnlCaGJtUWdjSEp2Y0dWeUlHSnBkSE1nYjJZZ2RHaGxJRmRsWWlCQmRXUnBieUJCVUVrZ0tHVXVaeTRnWEc1MWMybHVaeUJDZFdabVpYSlRiM1Z5WTJWT2IyUmxMbk4wWVhKMEtDa2dhVzV6ZEdWaFpDQnZaaUJDZFdabVpYSlRiM1Z5WTJWT2IyUmxMbTV2ZEdWUGJpZ3BLU3dnWW5WMElHMWhlVnh1YUdGMlpTQjBieUJ5ZFc0Z2IyNGdjM2x6ZEdWdGN5QjBhR0YwSUc5dWJIa2djM1Z3Y0c5eWRDQjBhR1VnWkdWd2NtVmpZWFJsWkNCaWFYUnpMbHh1WEc1VWFHbHpJR3hwWW5KaGNua2djMmh2ZFd4a0lHSmxJR2hoY20xc1pYTnpJSFJ2SUdsdVkyeDFaR1VnYVdZZ2RHaGxJR0p5YjNkelpYSWdjM1Z3Y0c5eWRITWdYRzUxYm5CeVpXWnBlR1ZrSUZ3aVFYVmthVzlEYjI1MFpYaDBYQ0lzSUdGdVpDOXZjaUJwWmlCcGRDQnpkWEJ3YjNKMGN5QjBhR1VnYm1WM0lHNWhiV1Z6TGlBZ1hHNWNibFJvWlNCd1lYUmphR1Z6SUhSb2FYTWdiR2xpY21GeWVTQm9ZVzVrYkdWek9seHVhV1lnZDJsdVpHOTNMa0YxWkdsdlEyOXVkR1Y0ZENCcGN5QjFibk4xY0hCdmNuUmxaQ3dnYVhRZ2QybHNiQ0JpWlNCaGJHbGhjMlZrSUhSdklIZGxZbXRwZEVGMVpHbHZRMjl1ZEdWNGRDZ3BMbHh1YVdZZ1FYVmthVzlDZFdabVpYSlRiM1Z5WTJWT2IyUmxMbk4wWVhKMEtDa2dhWE1nZFc1cGJYQnNaVzFsYm5SbFpDd2dhWFFnZDJsc2JDQmlaU0J5YjNWMFpXUWdkRzhnYm05MFpVOXVLQ2tnYjNKY2JtNXZkR1ZIY21GcGJrOXVLQ2tzSUdSbGNHVnVaR2x1WnlCdmJpQndZWEpoYldWMFpYSnpMbHh1WEc1VWFHVWdabTlzYkc5M2FXNW5JR0ZzYVdGelpYTWdiMjVzZVNCMFlXdGxJR1ZtWm1WamRDQnBaaUIwYUdVZ2JtVjNJRzVoYldWeklHRnlaU0J1YjNRZ1lXeHlaV0ZrZVNCcGJpQndiR0ZqWlRwY2JseHVRWFZrYVc5Q2RXWm1aWEpUYjNWeVkyVk9iMlJsTG5OMGIzQW9LU0JwY3lCaGJHbGhjMlZrSUhSdklHNXZkR1ZQWm1Zb0tWeHVRWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVWRoYVc0b0tTQnBjeUJoYkdsaGMyVmtJSFJ2SUdOeVpXRjBaVWRoYVc1T2IyUmxLQ2xjYmtGMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWRVpXeGhlU2dwSUdseklHRnNhV0Z6WldRZ2RHOGdZM0psWVhSbFJHVnNZWGxPYjJSbEtDbGNia0YxWkdsdlEyOXVkR1Y0ZEM1amNtVmhkR1ZUWTNKcGNIUlFjbTlqWlhOemIzSW9LU0JwY3lCaGJHbGhjMlZrSUhSdklHTnlaV0YwWlVwaGRtRlRZM0pwY0hST2IyUmxLQ2xjYmtGMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWUVpYSnBiMlJwWTFkaGRtVW9LU0JwY3lCaGJHbGhjMlZrSUhSdklHTnlaV0YwWlZkaGRtVlVZV0pzWlNncFhHNVBjMk5wYkd4aGRHOXlUbTlrWlM1emRHRnlkQ2dwSUdseklHRnNhV0Z6WldRZ2RHOGdibTkwWlU5dUtDbGNiazl6WTJsc2JHRjBiM0pPYjJSbExuTjBiM0FvS1NCcGN5QmhiR2xoYzJWa0lIUnZJRzV2ZEdWUFptWW9LVnh1VDNOamFXeHNZWFJ2Y2s1dlpHVXVjMlYwVUdWeWFXOWthV05YWVhabEtDa2dhWE1nWVd4cFlYTmxaQ0IwYnlCelpYUlhZWFpsVkdGaWJHVW9LVnh1UVhWa2FXOVFZWEpoYlM1elpYUlVZWEpuWlhSQmRGUnBiV1VvS1NCcGN5QmhiR2xoYzJWa0lIUnZJSE5sZEZSaGNtZGxkRlpoYkhWbFFYUlVhVzFsS0NsY2JseHVWR2hwY3lCc2FXSnlZWEo1SUdSdlpYTWdUazlVSUhCaGRHTm9JSFJvWlNCbGJuVnRaWEpoZEdWa0lIUjVjR1VnWTJoaGJtZGxjeXdnWVhNZ2FYUWdhWE1nWEc1eVpXTnZiVzFsYm1SbFpDQnBiaUIwYUdVZ2MzQmxZMmxtYVdOaGRHbHZiaUIwYUdGMElHbHRjR3hsYldWdWRHRjBhVzl1Y3lCemRYQndiM0owSUdKdmRHZ2dhVzUwWldkbGNseHVZVzVrSUhOMGNtbHVaeUIwZVhCbGN5Qm1iM0lnUVhWa2FXOVFZVzV1WlhKT2IyUmxMbkJoYm01cGJtZE5iMlJsYkN3Z1FYVmthVzlRWVc1dVpYSk9iMlJsTG1ScGMzUmhibU5sVFc5a1pXd2dYRzVDYVhGMVlXUkdhV3gwWlhKT2IyUmxMblI1Y0dVZ1lXNWtJRTl6WTJsc2JHRjBiM0pPYjJSbExuUjVjR1V1WEc1Y2Jpb3ZYRzRvWm5WdVkzUnBiMjRnS0dkc2IySmhiQ3dnWlhod2IzSjBjeXdnY0dWeVppa2dlMXh1SUNBbmRYTmxJSE4wY21samRDYzdYRzVjYmlBZ1puVnVZM1JwYjI0Z1ptbDRVMlYwVkdGeVoyVjBLSEJoY21GdEtTQjdYRzRnSUNBZ2FXWWdLQ0Z3WVhKaGJTa2dMeThnYVdZZ1RsbEpMQ0JxZFhOMElISmxkSFZ5Ymx4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lHbG1JQ2doY0dGeVlXMHVjMlYwVkdGeVoyVjBRWFJVYVcxbEtWeHVJQ0FnSUNBZ2NHRnlZVzB1YzJWMFZHRnlaMlYwUVhSVWFXMWxJRDBnY0dGeVlXMHVjMlYwVkdGeVoyVjBWbUZzZFdWQmRGUnBiV1U3SUZ4dUlDQjlYRzVjYmlBZ2FXWWdLSGRwYm1SdmR5NW9ZWE5QZDI1UWNtOXdaWEowZVNnbmQyVmlhMmwwUVhWa2FXOURiMjUwWlhoMEp5a2dKaVlnWEc0Z0lDQWdJQ0FoZDJsdVpHOTNMbWhoYzA5M2JsQnliM0JsY25SNUtDZEJkV1JwYjBOdmJuUmxlSFFuS1NrZ2UxeHVJQ0FnSUhkcGJtUnZkeTVCZFdScGIwTnZiblJsZUhRZ1BTQjNaV0pyYVhSQmRXUnBiME52Ym5SbGVIUTdYRzVjYmlBZ0lDQnBaaUFvSVVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVhR0Z6VDNkdVVISnZjR1Z5ZEhrb0oyTnlaV0YwWlVkaGFXNG5LU2xjYmlBZ0lDQWdJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUjJGcGJpQTlJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUjJGcGJrNXZaR1U3WEc0Z0lDQWdhV1lnS0NGQmRXUnBiME52Ym5SbGVIUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNUtDZGpjbVZoZEdWRVpXeGhlU2NwS1Z4dUlDQWdJQ0FnUVhWa2FXOURiMjUwWlhoMExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWRVpXeGhlU0E5SUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFJHVnNZWGxPYjJSbE8xeHVJQ0FnSUdsbUlDZ2hRWFZrYVc5RGIyNTBaWGgwTG5CeWIzUnZkSGx3WlM1b1lYTlBkMjVRY205d1pYSjBlU2duWTNKbFlYUmxVMk55YVhCMFVISnZZMlZ6YzI5eUp5a3BYRzRnSUNBZ0lDQkJkV1JwYjBOdmJuUmxlSFF1Y0hKdmRHOTBlWEJsTG1OeVpXRjBaVk5qY21sd2RGQnliMk5sYzNOdmNpQTlJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsU21GMllWTmpjbWx3ZEU1dlpHVTdYRzRnSUNBZ2FXWWdLQ0ZCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1S0NkamNtVmhkR1ZRWlhKcGIyUnBZMWRoZG1VbktTbGNiaUFnSUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxVR1Z5YVc5a2FXTlhZWFpsSUQwZ1FYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVlhZWFpsVkdGaWJHVTdYRzVjYmx4dUlDQWdJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdWFXNTBaWEp1WVd4ZlkzSmxZWFJsUjJGcGJpQTlJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUjJGcGJqdGNiaUFnSUNCQmRXUnBiME52Ym5SbGVIUXVjSEp2ZEc5MGVYQmxMbU55WldGMFpVZGhhVzRnUFNCbWRXNWpkR2x2YmlncElIc2dYRzRnSUNBZ0lDQjJZWElnYm05a1pTQTlJSFJvYVhNdWFXNTBaWEp1WVd4ZlkzSmxZWFJsUjJGcGJpZ3BPMXh1SUNBZ0lDQWdabWw0VTJWMFZHRnlaMlYwS0c1dlpHVXVaMkZwYmlrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm05a1pUdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ1FYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVwYm5SbGNtNWhiRjlqY21WaGRHVkVaV3hoZVNBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSR1ZzWVhrN1hHNGdJQ0FnUVhWa2FXOURiMjUwWlhoMExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWRVpXeGhlU0E5SUdaMWJtTjBhVzl1S0cxaGVFUmxiR0Y1VkdsdFpTa2dleUJjYmlBZ0lDQWdJSFpoY2lCdWIyUmxJRDBnYldGNFJHVnNZWGxVYVcxbElEOGdkR2hwY3k1cGJuUmxjbTVoYkY5amNtVmhkR1ZFWld4aGVTaHRZWGhFWld4aGVWUnBiV1VwSURvZ2RHaHBjeTVwYm5SbGNtNWhiRjlqY21WaGRHVkVaV3hoZVNncE8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdVpHVnNZWGxVYVcxbEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWIyUmxPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQkJkV1JwYjBOdmJuUmxlSFF1Y0hKdmRHOTBlWEJsTG1sdWRHVnlibUZzWDJOeVpXRjBaVUoxWm1abGNsTnZkWEpqWlNBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sTzF4dUlDQWdJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUW5WbVptVnlVMjkxY21ObElEMGdablZ1WTNScGIyNG9LU0I3SUZ4dUlDQWdJQ0FnZG1GeUlHNXZaR1VnUFNCMGFHbHpMbWx1ZEdWeWJtRnNYMk55WldGMFpVSjFabVpsY2xOdmRYSmpaU2dwTzF4dUlDQWdJQ0FnYVdZZ0tDRnViMlJsTG5OMFlYSjBLU0I3WEc0Z0lDQWdJQ0FnSUc1dlpHVXVjM1JoY25RZ1BTQm1kVzVqZEdsdmJpQW9JSGRvWlc0c0lHOW1abk5sZEN3Z1pIVnlZWFJwYjI0Z0tTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDQnZabVp6WlhRZ2ZId2daSFZ5WVhScGIyNGdLVnh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV1YjNSbFIzSmhhVzVQYmlnZ2QyaGxiaXdnYjJabWMyVjBMQ0JrZFhKaGRHbHZiaUFwTzF4dUlDQWdJQ0FnSUNBZ0lHVnNjMlZjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Ym05MFpVOXVLQ0IzYUdWdUlDazdYRzRnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb0lXNXZaR1V1YzNSdmNDbGNiaUFnSUNBZ0lDQWdibTlrWlM1emRHOXdJRDBnYm05a1pTNXViM1JsVDJabU8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdWNHeGhlV0poWTJ0U1lYUmxLVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnViMlJsTzF4dUlDQWdJSDA3WEc1Y2JpQWdJQ0JCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtbHVkR1Z5Ym1Gc1gyTnlaV0YwWlVSNWJtRnRhV056UTI5dGNISmxjM052Y2lBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSSGx1WVcxcFkzTkRiMjF3Y21WemMyOXlPMXh1SUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSSGx1WVcxcFkzTkRiMjF3Y21WemMyOXlJRDBnWm5WdVkzUnBiMjRvS1NCN0lGeHVJQ0FnSUNBZ2RtRnlJRzV2WkdVZ1BTQjBhR2x6TG1sdWRHVnlibUZzWDJOeVpXRjBaVVI1Ym1GdGFXTnpRMjl0Y0hKbGMzTnZjaWdwTzF4dUlDQWdJQ0FnWm1sNFUyVjBWR0Z5WjJWMEtHNXZaR1V1ZEdoeVpYTm9iMnhrS1R0Y2JpQWdJQ0FnSUdacGVGTmxkRlJoY21kbGRDaHViMlJsTG10dVpXVXBPMXh1SUNBZ0lDQWdabWw0VTJWMFZHRnlaMlYwS0c1dlpHVXVjbUYwYVc4cE8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdWNtVmtkV04wYVc5dUtUdGNiaUFnSUNBZ0lHWnBlRk5sZEZSaGNtZGxkQ2h1YjJSbExtRjBkR0ZqYXlrN1hHNGdJQ0FnSUNCbWFYaFRaWFJVWVhKblpYUW9ibTlrWlM1eVpXeGxZWE5sS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1YjJSbE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNCQmRXUnBiME52Ym5SbGVIUXVjSEp2ZEc5MGVYQmxMbWx1ZEdWeWJtRnNYMk55WldGMFpVSnBjWFZoWkVacGJIUmxjaUE5SUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFFtbHhkV0ZrUm1sc2RHVnlPMXh1SUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxRbWx4ZFdGa1JtbHNkR1Z5SUQwZ1puVnVZM1JwYjI0b0tTQjdJRnh1SUNBZ0lDQWdkbUZ5SUc1dlpHVWdQU0IwYUdsekxtbHVkR1Z5Ym1Gc1gyTnlaV0YwWlVKcGNYVmhaRVpwYkhSbGNpZ3BPMXh1SUNBZ0lDQWdabWw0VTJWMFZHRnlaMlYwS0c1dlpHVXVabkpsY1hWbGJtTjVLVHRjYmlBZ0lDQWdJR1pwZUZObGRGUmhjbWRsZENodWIyUmxMbVJsZEhWdVpTazdYRzRnSUNBZ0lDQm1hWGhUWlhSVVlYSm5aWFFvYm05a1pTNVJLVHRjYmlBZ0lDQWdJR1pwZUZObGRGUmhjbWRsZENodWIyUmxMbWRoYVc0cE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1dlpHVTdYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lHbG1JQ2hCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1S0NBblkzSmxZWFJsVDNOamFXeHNZWFJ2Y2ljZ0tTa2dlMXh1SUNBZ0lDQWdRWFZrYVc5RGIyNTBaWGgwTG5CeWIzUnZkSGx3WlM1cGJuUmxjbTVoYkY5amNtVmhkR1ZQYzJOcGJHeGhkRzl5SUQwZ1FYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVlBjMk5wYkd4aGRHOXlPMXh1SUNBZ0lDQWdRWFZrYVc5RGIyNTBaWGgwTG5CeWIzUnZkSGx3WlM1amNtVmhkR1ZQYzJOcGJHeGhkRzl5SUQwZ1puVnVZM1JwYjI0b0tTQjdJRnh1SUNBZ0lDQWdJQ0IyWVhJZ2JtOWtaU0E5SUhSb2FYTXVhVzUwWlhKdVlXeGZZM0psWVhSbFQzTmphV3hzWVhSdmNpZ3BPMXh1SUNBZ0lDQWdJQ0JwWmlBb0lXNXZaR1V1YzNSaGNuUXBYRzRnSUNBZ0lDQWdJQ0FnYm05a1pTNXpkR0Z5ZENBOUlHNXZaR1V1Ym05MFpVOXVPeUJjYmlBZ0lDQWdJQ0FnYVdZZ0tDRnViMlJsTG5OMGIzQXBYRzRnSUNBZ0lDQWdJQ0FnYm05a1pTNXpkRzl3SUQwZ2JtOWtaUzV1YjNSbFQyWm1PMXh1SUNBZ0lDQWdJQ0JwWmlBb0lXNXZaR1V1YzJWMFVHVnlhVzlrYVdOWFlYWmxLVnh1SUNBZ0lDQWdJQ0FnSUc1dlpHVXVjMlYwVUdWeWFXOWthV05YWVhabElEMGdibTlrWlM1elpYUlhZWFpsVkdGaWJHVTdYRzRnSUNBZ0lDQWdJR1pwZUZObGRGUmhjbWRsZENodWIyUmxMbVp5WlhGMVpXNWplU2s3WEc0Z0lDQWdJQ0FnSUdacGVGTmxkRlJoY21kbGRDaHViMlJsTG1SbGRIVnVaU2s3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ1YjJSbE8xeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNGdJSDFjYm4wb2QybHVaRzkzS1NrN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gbW9ua2V5cGF0Y2ggb2xkIHdlYkF1ZGlvQVBJXG5yZXF1aXJlKFwiLi9hYy1tb25rZXlwYXRjaFwiKTtcbi8vIGV4cG9zZXMgYSBzaW5nbGUgaW5zdGFuY2Vcbm1vZHVsZS5leHBvcnRzID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdRVUZEUVN4UFFVRlBMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXpzN1FVRkZOVUlzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRmxCUVZrc1JVRkJSU3hEUVVGRElpd2labWxzWlNJNkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUcxdmJtdGxlWEJoZEdOb0lHOXNaQ0IzWldKQmRXUnBiMEZRU1Z4dWNtVnhkV2x5WlNnbkxpOWhZeTF0YjI1clpYbHdZWFJqYUNjcE8xeHVMeThnWlhod2IzTmxjeUJoSUhOcGJtZHNaU0JwYm5OMFlXNWpaVnh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J1WlhjZ1FYVmthVzlEYjI1MFpYaDBLQ2s3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGRlZmF1bHRBdWRpb0NvbnRleHQgPSByZXF1aXJlKFwiLi9hdWRpby1jb250ZXh0XCIpO1xuXG4vKipcbiAqIEBjbGFzcyBUaW1lRW5naW5lXG4gKiBAY2xhc3NkZXNjIEJhc2UgY2xhc3MgZm9yIHRpbWUgZW5naW5lc1xuICpcbiAqIFRpbWUgZW5naW5lcyBhcmUgY29tcG9uZW50cyB0aGF0IGdlbmVyYXRlIG1vcmUgb3IgbGVzcyByZWd1bGFyIGF1ZGlvIGV2ZW50cyBhbmQvb3IgcGxheWJhY2sgYSBtZWRpYSBzdHJlYW0uXG4gKiBUaGV5IGltcGxlbWVudCBvbmUgb3IgbXVsdGlwbGUgaW50ZXJmYWNlcyB0byBiZSBzeW5jaHJvbml6ZWQgYnkgYSBtYXN0ZXIgc3VjaCBhcyBhIHNjaGVkdWxlciwgYSB0cmFuc3BvcnQgb3IgYSBwbGF5LWNvbnRyb2wuXG4gKiBUaGUgcHJvdmlkZWQgaW50ZXJmYWNlcyBhcmUgXCJzY2hlZHVsZWRcIiwgXCJ0cmFuc3BvcnRlZFwiLCBhbmQgXCJwbGF5LWNvbnRyb2xsZWRcIi5cbiAqXG4gKiBJbiB0aGUgXCJzY2hlZHVsZWRcIiBpbnRlcmZhY2UgdGhlIGVuZ2luZSBpbXBsZW1lbnRzIGEgbWV0aG9kIFwiYWR2YW5jZVRpbWVcIiB0aGF0IGlzIGNhbGxlZCBieSB0aGUgbWFzdGVyICh1c3VhbGx5IHRoZSBzY2hlZHVsZXIpXG4gKiBhbmQgcmV0dXJucyB0aGUgZGVsYXkgdW50aWwgdGhlIG5leHQgY2FsbCBvZiBcImFkdmFuY2VUaW1lXCIuIFRoZSBtYXN0ZXIgcHJvdmlkZXMgdGhlIGVuZ2luZSB3aXRoIGEgZnVuY3Rpb24gXCJyZXNldE5leHRUaW1lXCJcbiAqIHRvIHJlc2NoZWR1bGUgdGhlIG5leHQgY2FsbCB0byBhbm90aGVyIHRpbWUuXG4gKlxuICogSW4gdGhlIFwidHJhbnNwb3J0ZWRcIiBpbnRlcmZhY2UgdGhlIG1hc3RlciAodXN1YWxseSBhIHRyYW5zcG9ydCkgZmlyc3QgY2FsbHMgdGhlIG1ldGhvZCBcInN5bmNQb3NpdGlvblwiIHRoYXQgcmV0dXJucyB0aGUgcG9zaXRpb25cbiAqIG9mIHRoZSBmaXJzdCBldmVudCBnZW5lcmF0ZWQgYnkgdGhlIGVuZ2luZSByZWdhcmRpbmcgdGhlIHBsYXlpbmcgZGlyZWN0aW9uIChzaWduIG9mIHRoZSBzcGVlZCBhcmd1bWVudCkuIEV2ZW50cyBhcmUgZ2VuZXJhdGVkXG4gKiB0aHJvdWdoIHRoZSBtZXRob2QgXCJhZHZhbmNlUG9zaXRpb25cIiB0aGF0IHJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IGV2ZW50IGdlbmVyYXRlZCB0aHJvdWdoIFwiYWR2YW5jZVBvc2l0aW9uXCIuXG4gKlxuICogSW4gdGhlIFwic3BlZWQtY29udHJvbGxlZFwiIGludGVyZmFjZSB0aGUgZW5naW5lIGlzIGNvbnRyb2xsZWQgYnkgdGhlIG1ldGhvZCBcInN5bmNTcGVlZFwiLlxuICpcbiAqIEZvciBhbGwgaW50ZXJmYWNlcyB0aGUgZW5naW5lIGlzIHByb3ZpZGVkIHdpdGggdGhlIGF0dHJpYnV0ZSBnZXR0ZXJzIFwiY3VycmVudFRpbWVcIiBhbmQgXCJjdXJyZW50UG9zaXRpb25cIiAoZm9yIHRoZSBjYXNlIHRoYXQgdGhlIG1hc3RlclxuICogZG9lcyBub3QgaW1wbGVtZW50IHRoZXNlIGF0dHJpYnV0ZSBnZXR0ZXJzLCB0aGUgYmFzZSBjbGFzcyBwcm92aWRlcyBkZWZhdWx0IGltcGxlbWVudGF0aW9ucykuXG4gKi9cblxudmFyIFRpbWVFbmdpbmUgPSAoZnVuY3Rpb24gKCkge1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gVGltZUVuZ2luZSgpIHtcbiAgICB2YXIgYXVkaW9Db250ZXh0ID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBkZWZhdWx0QXVkaW9Db250ZXh0IDogYXJndW1lbnRzWzBdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRpbWVFbmdpbmUpO1xuXG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IG1hc3RlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5tYXN0ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW50ZXJmYWNlIGN1cnJlbnRseSB1c2VkXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzW1wiaW50ZXJmYWNlXCJdID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE91dHB1dCBhdWRpbyBub2RlXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm91dHB1dE5vZGUgPSBudWxsO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFRpbWVFbmdpbmUsIHtcbiAgICBjdXJyZW50VGltZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIEdldCB0aGUgdGltZSBlbmdpbmUncyBjdXJyZW50IG1hc3RlciB0aW1lXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiBwcm92aWRlZCBieSB0aGUgbWFzdGVyLlxuICAgICAgICovXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBjdXJyZW50UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgdGhlIHRpbWUgZW5naW5lJ3MgY3VycmVudCBtYXN0ZXIgcG9zaXRpb25cbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZSBtYXN0ZXIuXG4gICAgICAgKi9cblxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXROZXh0VGltZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIEZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZSBzY2hlZHVsZXIgdG8gcmVzZXQgdGhlIGVuZ2luZSdzIG5leHQgdGltZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgbmV3IGVuZ2luZSB0aW1lIChpbW1lZGlhdGVseSBpZiBub3Qgc3BlY2lmaWVkKVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldE5leHRUaW1lKCkge1xuICAgICAgICB2YXIgdGltZSA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2V0TmV4dFBvc2l0aW9uOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIHRyYW5zcG9ydCB0byByZXNldCB0aGUgbmV4dCBwb3NpdGlvbiBvciB0byByZXF1ZXN0IHJlc3luY2hyb25pemluZyB0aGUgZW5naW5lJ3MgcG9zaXRpb25cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiBuZXcgZW5naW5lIHBvc2l0aW9uICh3aWxsIGNhbGwgc3luY1Bvc2l0aW9uIHdpdGggdGhlIGN1cnJlbnQgcG9zaXRpb24gaWYgbm90IHNwZWNpZmllZClcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXROZXh0UG9zaXRpb24oKSB7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fc2V0R2V0dGVyczoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc2V0R2V0dGVycyhnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChnZXRDdXJyZW50VGltZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRUaW1lXCIsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogZ2V0Q3VycmVudFRpbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJjdXJyZW50UG9zaXRpb25cIiwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiBnZXRDdXJyZW50UG9zaXRpb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgX19kZWxldGVHZXR0ZXJzOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19kZWxldGVHZXR0ZXJzKCkge1xuICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50VGltZTtcbiAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW1wbGVtZW50c1NjaGVkdWxlZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIHRpbWUgZW5naW5lIGltcGxlbWVudHMgdGhlIHNjaGVkdWxlZCBpbnRlcmZhY2VcbiAgICAgICAqKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGltcGxlbWVudHNTY2hlZHVsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkdmFuY2VUaW1lICYmIHRoaXMuYWR2YW5jZVRpbWUgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGltcGxlbWVudHNUcmFuc3BvcnRlZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIHRpbWUgZW5naW5lIGltcGxlbWVudHMgdGhlIHRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgICAgICoqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaW1wbGVtZW50c1RyYW5zcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jUG9zaXRpb24gJiYgdGhpcy5zeW5jUG9zaXRpb24gaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiB0aGlzLmFkdmFuY2VQb3NpdGlvbiAmJiB0aGlzLmFkdmFuY2VQb3NpdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW1wbGVtZW50c1NwZWVkQ29udHJvbGxlZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIHRpbWUgZW5naW5lIGltcGxlbWVudHMgdGhlIHNwZWVkLWNvbnRyb2xsZWQgaW50ZXJmYWNlXG4gICAgICAgKiovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jU3BlZWQgJiYgdGhpcy5zeW5jU3BlZWQgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldFNjaGVkdWxlZDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFNjaGVkdWxlZChtYXN0ZXIsIHJlc2V0TmV4dFRpbWUsIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5tYXN0ZXIgPSBtYXN0ZXI7XG4gICAgICAgIHRoaXNbXCJpbnRlcmZhY2VcIl0gPSBcInNjaGVkdWxlZFwiO1xuXG4gICAgICAgIHRoaXMuX19zZXRHZXR0ZXJzKGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuXG4gICAgICAgIGlmIChyZXNldE5leHRUaW1lKSB0aGlzLnJlc2V0TmV4dFRpbWUgPSByZXNldE5leHRUaW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0VHJhbnNwb3J0ZWQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRUcmFuc3BvcnRlZChtYXN0ZXIsIHJlc2V0TmV4dFBvc2l0aW9uLCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMubWFzdGVyID0gbWFzdGVyO1xuICAgICAgICB0aGlzW1wiaW50ZXJmYWNlXCJdID0gXCJ0cmFuc3BvcnRlZFwiO1xuXG4gICAgICAgIHRoaXMuX19zZXRHZXR0ZXJzKGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuXG4gICAgICAgIGlmIChyZXNldE5leHRQb3NpdGlvbikgdGhpcy5yZXNldE5leHRQb3NpdGlvbiA9IHJlc2V0TmV4dFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0U3BlZWRDb250cm9sbGVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3BlZWRDb250cm9sbGVkKG1hc3RlciwgZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbikge1xuICAgICAgICB0aGlzLm1hc3RlciA9IG1hc3RlcjtcbiAgICAgICAgdGhpc1tcImludGVyZmFjZVwiXSA9IFwic3BlZWQtY29udHJvbGxlZFwiO1xuXG4gICAgICAgIHRoaXMuX19zZXRHZXR0ZXJzKGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXRJbnRlcmZhY2U6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldEludGVyZmFjZSgpIHtcbiAgICAgICAgdGhpcy5fX2RlbGV0ZUdldHRlcnMoKTtcblxuICAgICAgICBkZWxldGUgdGhpcy5yZXNldE5leHRUaW1lO1xuICAgICAgICBkZWxldGUgdGhpcy5yZXNldE5leHRQb3NpdGlvbjtcblxuICAgICAgICB0aGlzLm1hc3RlciA9IG51bGw7XG4gICAgICAgIHRoaXNbXCJpbnRlcmZhY2VcIl0gPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29ubmVjdDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIENvbm5lY3QgYXVkaW8gbm9kZVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBhdWRpbyBub2RlXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QodGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub3V0cHV0Tm9kZS5jb25uZWN0KHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGlzY29ubmVjdDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIERpc2Nvbm5lY3QgYXVkaW8gbm9kZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbm5lY3Rpb24gY29ubmVjdGlvbiB0byBiZSBkaXNjb25uZWN0ZWRcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdChjb25uZWN0aW9uKSB7XG4gICAgICAgIHRoaXMub3V0cHV0Tm9kZS5kaXNjb25uZWN0KGNvbm5lY3Rpb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBUaW1lRW5naW5lO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lRW5naW5lO1xuLyogd3JpdHRlbiBpbiBFQ01Bc2NyaXB0IDYgKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIGF1ZGlvIHRpbWUgZW5naW5lIGJhc2UgY2xhc3NcbiAqIEBhdXRob3IgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCBWaWN0b3IuU2FpekBpcmNhbS5mciwgS2FyaW0uQmFya2F0aUBpcmNhbS5mclxuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZQUVN4SlFVRkpMRzFDUVVGdFFpeEhRVUZITEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZET3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdTVUYxUWk5RExGVkJRVlU3T3pzN096dEJRVXRJTEZkQlRGQXNWVUZCVlN4SFFVdHJRenRSUVVGd1F5eFpRVUZaTEdkRFFVRkhMRzFDUVVGdFFqczdNRUpCVERGRExGVkJRVlU3TzBGQlRWb3NVVUZCU1N4RFFVRkRMRmxCUVZrc1IwRkJSeXhaUVVGWkxFTkJRVU03T3pzN096dEJRVTFxUXl4UlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6czdPenM3TzBGQlRXNUNMRkZCUVVrc1lVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF6czdPenM3TzBGQlRYUkNMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzU1VGQlNTeERRVUZETzBkQlEzaENPenRsUVhwQ1J5eFZRVUZWTzBGQmFVTldMR1ZCUVZjN096czdPenM3T3p0WFFVRkJMRmxCUVVjN1FVRkRhRUlzWlVGQlR5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJRenRQUVVOMFF6czdRVUZSUnl4dFFrRkJaVHM3T3pzN096czdPMWRCUVVFc1dVRkJSenRCUVVOd1FpeGxRVUZQTEVOQlFVTXNRMEZCUXp0UFFVTldPenRCUVUxRUxHbENRVUZoT3pzN096czdPMkZCUVVFc2VVSkJRV003V1VGQllpeEpRVUZKTEdkRFFVRkhMRWxCUVVrN1QwRkJTVHM3UVVGTk4wSXNjVUpCUVdsQ096czdPenM3TzJGQlFVRXNOa0pCUVd0Q08xbEJRV3BDTEZGQlFWRXNaME5CUVVjc1NVRkJTVHRQUVVGSk96dEJRVVZ5UXl4blFrRkJXVHRoUVVGQkxITkNRVUZETEdOQlFXTXNSVUZCUlN4clFrRkJhMElzUlVGQlJUdEJRVU12UXl4WlFVRkpMR05CUVdNc1JVRkJSVHRCUVVOc1FpeG5Ra0ZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFVkJRVVVzWVVGQllTeEZRVUZGTzBGQlEzcERMSGRDUVVGWkxFVkJRVVVzU1VGQlNUdEJRVU5zUWl4bFFVRkhMRVZCUVVVc1kwRkJZenRYUVVOd1FpeERRVUZETEVOQlFVTTdVMEZEU2pzN1FVRkZSQ3haUVVGSkxHdENRVUZyUWl4RlFVRkZPMEZCUTNSQ0xHZENRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hwUWtGQmFVSXNSVUZCUlR0QlFVTTNReXgzUWtGQldTeEZRVUZGTEVsQlFVazdRVUZEYkVJc1pVRkJSeXhGUVVGRkxHdENRVUZyUWp0WFFVTjRRaXhEUVVGRExFTkJRVU03VTBGRFNqdFBRVU5HT3p0QlFVVkVMRzFDUVVGbE8yRkJRVUVzTWtKQlFVYzdRVUZEYUVJc1pVRkJUeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlEzaENMR1ZCUVU4c1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF6dFBRVU0zUWpzN1FVRkxSQ3gxUWtGQmJVSTdPenM3T3p0aFFVRkJMQ3RDUVVGSE8wRkJRM0JDTEdWQlFWRXNTVUZCU1N4RFFVRkRMRmRCUVZjc1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eFpRVUZaTEZGQlFWRXNRMEZCUlR0UFFVTnVSVHM3UVVGTFJDeDVRa0ZCY1VJN096czdPenRoUVVGQkxHbERRVUZITzBGQlEzUkNMR1ZCUTBVc1NVRkJTU3hEUVVGRExGbEJRVmtzU1VGQlNTeEpRVUZKTEVOQlFVTXNXVUZCV1N4WlFVRlpMRkZCUVZFc1NVRkRNVVFzU1VGQlNTeERRVUZETEdWQlFXVXNTVUZCU1N4SlFVRkpMRU5CUVVNc1pVRkJaU3haUVVGWkxGRkJRVkVzUTBGRGFFVTdUMEZEU0RzN1FVRkxSQ3cyUWtGQmVVSTdPenM3T3p0aFFVRkJMSEZEUVVGSE8wRkJRekZDTEdWQlFWRXNTVUZCU1N4RFFVRkRMRk5CUVZNc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eFpRVUZaTEZGQlFWRXNRMEZCUlR0UFFVTXZSRHM3UVVGRlJDeG5Ra0ZCV1R0aFFVRkJMSE5DUVVGRExFMUJRVTBzUlVGQlJTeGhRVUZoTEVWQlFVVXNZMEZCWXl4RlFVRkZMR3RDUVVGclFpeEZRVUZGTzBGQlEzUkZMRmxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETzBGQlEzSkNMRmxCUVVrc1lVRkJWU3hIUVVGSExGZEJRVmNzUTBGQlF6czdRVUZGTjBJc1dVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eGpRVUZqTEVWQlFVVXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6czdRVUZGZEVRc1dVRkJTU3hoUVVGaExFVkJRMllzU1VGQlNTeERRVUZETEdGQlFXRXNSMEZCUnl4aFFVRmhMRU5CUVVNN1QwRkRkRU03TzBGQlJVUXNhMEpCUVdNN1lVRkJRU3gzUWtGQlF5eE5RVUZOTEVWQlFVVXNhVUpCUVdsQ0xFVkJRVVVzWTBGQll5eEZRVUZGTEd0Q1FVRnJRaXhGUVVGRk8wRkJRelZGTEZsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hEUVVGRE8wRkJRM0pDTEZsQlFVa3NZVUZCVlN4SFFVRkhMR0ZCUVdFc1EwRkJRenM3UVVGRkwwSXNXVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhqUVVGakxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenM3UVVGRmRFUXNXVUZCU1N4cFFrRkJhVUlzUlVGRGJrSXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEhRVUZITEdsQ1FVRnBRaXhEUVVGRE8wOUJRemxET3p0QlFVVkVMSE5DUVVGclFqdGhRVUZCTERSQ1FVRkRMRTFCUVUwc1JVRkJSU3hqUVVGakxFVkJRVVVzYTBKQlFXdENMRVZCUVVVN1FVRkROMFFzV1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4TlFVRk5MRU5CUVVNN1FVRkRja0lzV1VGQlNTeGhRVUZWTEVkQlFVY3NhMEpCUVd0Q0xFTkJRVU03TzBGQlJYQkRMRmxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zWTBGQll5eEZRVUZGTEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03VDBGRGRrUTdPMEZCUlVRc2EwSkJRV003WVVGQlFTd3dRa0ZCUnp0QlFVTm1MRmxCUVVrc1EwRkJReXhsUVVGbExFVkJRVVVzUTBGQlF6czdRVUZGZGtJc1pVRkJUeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETzBGQlF6RkNMR1ZCUVU4c1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRPenRCUVVVNVFpeFpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOdVFpeFpRVUZKTEdGQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNN1QwRkRka0k3TzBGQlRVUXNWMEZCVHpzN096czdPenRoUVVGQkxHbENRVUZETEUxQlFVMHNSVUZCUlR0QlFVTmtMRmxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJoRExHVkJRVThzU1VGQlNTeERRVUZETzA5QlEySTdPMEZCVFVRc1kwRkJWVHM3T3pzN096dGhRVUZCTEc5Q1FVRkRMRlZCUVZVc1JVRkJSVHRCUVVOeVFpeFpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU4yUXl4bFFVRlBMRWxCUVVrc1EwRkJRenRQUVVOaU96czdPMU5CTjBwSExGVkJRVlU3T3p0QlFXZExhRUlzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlZMRU5CUVVNaUxDSm1hV3hsSWpvaVpYTTJMM1YwYVd4ekwzQnlhVzl5YVhSNUxYRjFaWFZsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9nZDNKcGRIUmxiaUJwYmlCRlEwMUJjMk55YVhCMElEWWdLaTljYmk4cUtseHVJQ29nUUdacGJHVnZkbVZ5ZG1sbGR5QlhRVlpGSUdGMVpHbHZJSFJwYldVZ1pXNW5hVzVsSUdKaGMyVWdZMnhoYzNOY2JpQXFJRUJoZFhSb2IzSWdUbTl5WW1WeWRDNVRZMmh1Wld4c1FHbHlZMkZ0TG1aeUxDQldhV04wYjNJdVUyRnBla0JwY21OaGJTNW1jaXdnUzJGeWFXMHVRbUZ5YTJGMGFVQnBjbU5oYlM1bWNseHVJQ292WEc1Y0luVnpaU0J6ZEhKcFkzUmNJanRjYmx4dWRtRnlJR1JsWm1GMWJIUkJkV1JwYjBOdmJuUmxlSFFnUFNCeVpYRjFhWEpsS0Z3aUxpOWhkV1JwYnkxamIyNTBaWGgwWENJcE8xeHVYRzR2S2lwY2JpQXFJRUJqYkdGemN5QlVhVzFsUlc1bmFXNWxYRzRnS2lCQVkyeGhjM05rWlhOaklFSmhjMlVnWTJ4aGMzTWdabTl5SUhScGJXVWdaVzVuYVc1bGMxeHVJQ3BjYmlBcUlGUnBiV1VnWlc1bmFXNWxjeUJoY21VZ1kyOXRjRzl1Wlc1MGN5QjBhR0YwSUdkbGJtVnlZWFJsSUcxdmNtVWdiM0lnYkdWemN5QnlaV2QxYkdGeUlHRjFaR2x2SUdWMlpXNTBjeUJoYm1RdmIzSWdjR3hoZVdKaFkyc2dZU0J0WldScFlTQnpkSEpsWVcwdVhHNGdLaUJVYUdWNUlHbHRjR3hsYldWdWRDQnZibVVnYjNJZ2JYVnNkR2x3YkdVZ2FXNTBaWEptWVdObGN5QjBieUJpWlNCemVXNWphSEp2Ym1sNlpXUWdZbmtnWVNCdFlYTjBaWElnYzNWamFDQmhjeUJoSUhOamFHVmtkV3hsY2l3Z1lTQjBjbUZ1YzNCdmNuUWdiM0lnWVNCd2JHRjVMV052Ym5SeWIyd3VYRzRnS2lCVWFHVWdjSEp2ZG1sa1pXUWdhVzUwWlhKbVlXTmxjeUJoY21VZ1hDSnpZMmhsWkhWc1pXUmNJaXdnWENKMGNtRnVjM0J2Y25SbFpGd2lMQ0JoYm1RZ1hDSndiR0Y1TFdOdmJuUnliMnhzWldSY0lpNWNiaUFxWEc0Z0tpQkpiaUIwYUdVZ1hDSnpZMmhsWkhWc1pXUmNJaUJwYm5SbGNtWmhZMlVnZEdobElHVnVaMmx1WlNCcGJYQnNaVzFsYm5SeklHRWdiV1YwYUc5a0lGd2lZV1IyWVc1alpWUnBiV1ZjSWlCMGFHRjBJR2x6SUdOaGJHeGxaQ0JpZVNCMGFHVWdiV0Z6ZEdWeUlDaDFjM1ZoYkd4NUlIUm9aU0J6WTJobFpIVnNaWElwWEc0Z0tpQmhibVFnY21WMGRYSnVjeUIwYUdVZ1pHVnNZWGtnZFc1MGFXd2dkR2hsSUc1bGVIUWdZMkZzYkNCdlppQmNJbUZrZG1GdVkyVlVhVzFsWENJdUlGUm9aU0J0WVhOMFpYSWdjSEp2ZG1sa1pYTWdkR2hsSUdWdVoybHVaU0IzYVhSb0lHRWdablZ1WTNScGIyNGdYQ0p5WlhObGRFNWxlSFJVYVcxbFhDSmNiaUFxSUhSdklISmxjMk5vWldSMWJHVWdkR2hsSUc1bGVIUWdZMkZzYkNCMGJ5QmhibTkwYUdWeUlIUnBiV1V1WEc0Z0tseHVJQ29nU1c0Z2RHaGxJRndpZEhKaGJuTndiM0owWldSY0lpQnBiblJsY21aaFkyVWdkR2hsSUcxaGMzUmxjaUFvZFhOMVlXeHNlU0JoSUhSeVlXNXpjRzl5ZENrZ1ptbHljM1FnWTJGc2JITWdkR2hsSUcxbGRHaHZaQ0JjSW5ONWJtTlFiM05wZEdsdmJsd2lJSFJvWVhRZ2NtVjBkWEp1Y3lCMGFHVWdjRzl6YVhScGIyNWNiaUFxSUc5bUlIUm9aU0JtYVhKemRDQmxkbVZ1ZENCblpXNWxjbUYwWldRZ1lua2dkR2hsSUdWdVoybHVaU0J5WldkaGNtUnBibWNnZEdobElIQnNZWGxwYm1jZ1pHbHlaV04wYVc5dUlDaHphV2R1SUc5bUlIUm9aU0J6Y0dWbFpDQmhjbWQxYldWdWRDa3VJRVYyWlc1MGN5QmhjbVVnWjJWdVpYSmhkR1ZrWEc0Z0tpQjBhSEp2ZFdkb0lIUm9aU0J0WlhSb2IyUWdYQ0poWkhaaGJtTmxVRzl6YVhScGIyNWNJaUIwYUdGMElISmxkSFZ5Ym5NZ2RHaGxJSEJ2YzJsMGFXOXVJRzltSUhSb1pTQnVaWGgwSUdWMlpXNTBJR2RsYm1WeVlYUmxaQ0IwYUhKdmRXZG9JRndpWVdSMllXNWpaVkJ2YzJsMGFXOXVYQ0l1WEc0Z0tseHVJQ29nU1c0Z2RHaGxJRndpYzNCbFpXUXRZMjl1ZEhKdmJHeGxaRndpSUdsdWRHVnlabUZqWlNCMGFHVWdaVzVuYVc1bElHbHpJR052Ym5SeWIyeHNaV1FnWW5rZ2RHaGxJRzFsZEdodlpDQmNJbk41Ym1OVGNHVmxaRndpTGx4dUlDcGNiaUFxSUVadmNpQmhiR3dnYVc1MFpYSm1ZV05sY3lCMGFHVWdaVzVuYVc1bElHbHpJSEJ5YjNacFpHVmtJSGRwZEdnZ2RHaGxJR0YwZEhKcFluVjBaU0JuWlhSMFpYSnpJRndpWTNWeWNtVnVkRlJwYldWY0lpQmhibVFnWENKamRYSnlaVzUwVUc5emFYUnBiMjVjSWlBb1ptOXlJSFJvWlNCallYTmxJSFJvWVhRZ2RHaGxJRzFoYzNSbGNseHVJQ29nWkc5bGN5QnViM1FnYVcxd2JHVnRaVzUwSUhSb1pYTmxJR0YwZEhKcFluVjBaU0JuWlhSMFpYSnpMQ0IwYUdVZ1ltRnpaU0JqYkdGemN5QndjbTkyYVdSbGN5QmtaV1poZFd4MElHbHRjR3hsYldWdWRHRjBhVzl1Y3lrdVhHNGdLaTljYm1Oc1lYTnpJRlJwYldWRmJtZHBibVVnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWTI5dWMzUnlkV04wYjNKY2JpQWdJQ292WEc0Z0lHTnZibk4wY25WamRHOXlLR0YxWkdsdlEyOXVkR1Y0ZENBOUlHUmxabUYxYkhSQmRXUnBiME52Ym5SbGVIUXBJSHRjYmlBZ0lDQjBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDQTlJR0YxWkdsdlEyOXVkR1Y0ZER0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFTjFjbkpsYm5RZ2JXRnpkR1Z5WEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDlpYW1WamRIMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbTFoYzNSbGNpQTlJRzUxYkd3N1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkpiblJsY21aaFkyVWdZM1Z5Y21WdWRHeDVJSFZ6WldSY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VTNSeWFXNW5mVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11YVc1MFpYSm1ZV05sSUQwZ2JuVnNiRHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUU5MWRIQjFkQ0JoZFdScGJ5QnViMlJsWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDlpYW1WamRIMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbTkxZEhCMWRFNXZaR1VnUFNCdWRXeHNPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRDQjBhR1VnZEdsdFpTQmxibWRwYm1VbmN5QmpkWEp5Wlc1MElHMWhjM1JsY2lCMGFXMWxYRzRnSUNBcUlFQjBlWEJsSUh0R2RXNWpkR2x2Ym4xY2JpQWdJQ3BjYmlBZ0lDb2dWR2hwY3lCbWRXNWpkR2x2YmlCd2NtOTJhV1JsWkNCaWVTQjBhR1VnYldGemRHVnlMbHh1SUNBZ0tpOWNiaUFnWjJWMElHTjFjbkpsYm5SVWFXMWxLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDNWpkWEp5Wlc1MFZHbHRaVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSFpYUWdkR2hsSUhScGJXVWdaVzVuYVc1bEozTWdZM1Z5Y21WdWRDQnRZWE4wWlhJZ2NHOXphWFJwYjI1Y2JpQWdJQ29nUUhSNWNHVWdlMFoxYm1OMGFXOXVmVnh1SUNBZ0tseHVJQ0FnS2lCVWFHbHpJR1oxYm1OMGFXOXVJSEJ5YjNacFpHVmtJR0o1SUhSb1pTQnRZWE4wWlhJdVhHNGdJQ0FxTDF4dUlDQm5aWFFnWTNWeWNtVnVkRkJ2YzJsMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQXdPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVaMWJtTjBhVzl1SUhCeWIzWnBaR1ZrSUdKNUlIUm9aU0J6WTJobFpIVnNaWElnZEc4Z2NtVnpaWFFnZEdobElHVnVaMmx1WlNkeklHNWxlSFFnZEdsdFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZEdsdFpTQnVaWGNnWlc1bmFXNWxJSFJwYldVZ0tHbHRiV1ZrYVdGMFpXeDVJR2xtSUc1dmRDQnpjR1ZqYVdacFpXUXBYRzRnSUNBcUwxeHVJQ0J5WlhObGRFNWxlSFJVYVcxbEtIUnBiV1VnUFNCdWRXeHNLU0I3ZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJHZFc1amRHbHZiaUJ3Y205MmFXUmxaQ0JpZVNCMGFHVWdkSEpoYm5Od2IzSjBJSFJ2SUhKbGMyVjBJSFJvWlNCdVpYaDBJSEJ2YzJsMGFXOXVJRzl5SUhSdklISmxjWFZsYzNRZ2NtVnplVzVqYUhKdmJtbDZhVzVuSUhSb1pTQmxibWRwYm1VbmN5QndiM05wZEdsdmJseHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnY0c5emFYUnBiMjRnYm1WM0lHVnVaMmx1WlNCd2IzTnBkR2x2YmlBb2QybHNiQ0JqWVd4c0lITjVibU5RYjNOcGRHbHZiaUIzYVhSb0lIUm9aU0JqZFhKeVpXNTBJSEJ2YzJsMGFXOXVJR2xtSUc1dmRDQnpjR1ZqYVdacFpXUXBYRzRnSUNBcUwxeHVJQ0J5WlhObGRFNWxlSFJRYjNOcGRHbHZiaWh3YjNOcGRHbHZiaUE5SUc1MWJHd3BJSHQ5WEc1Y2JpQWdYMTl6WlhSSFpYUjBaWEp6S0dkbGRFTjFjbkpsYm5SVWFXMWxMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0JwWmlBb1oyVjBRM1Z5Y21WdWRGUnBiV1VwSUh0Y2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENBblkzVnljbVZ1ZEZScGJXVW5MQ0I3WEc0Z0lDQWdJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ1oyVjBPaUJuWlhSRGRYSnlaVzUwVkdsdFpWeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaWtnZTF4dUlDQWdJQ0FnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIUm9hWE1zSUNkamRYSnlaVzUwVUc5emFYUnBiMjRuTENCN1hHNGdJQ0FnSUNBZ0lHTnZibVpwWjNWeVlXSnNaVG9nZEhKMVpTeGNiaUFnSUNBZ0lDQWdaMlYwT2lCblpYUkRkWEp5Wlc1MFVHOXphWFJwYjI1Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lGOWZaR1ZzWlhSbFIyVjBkR1Z5Y3lncElIdGNiaUFnSUNCa1pXeGxkR1VnZEdocGN5NWpkWEp5Wlc1MFZHbHRaVHRjYmlBZ0lDQmtaV3hsZEdVZ2RHaHBjeTVqZFhKeVpXNTBVRzl6YVhScGIyNDdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJobFkyc2dkMmhsZEdobGNpQjBhR1VnZEdsdFpTQmxibWRwYm1VZ2FXMXdiR1Z0Wlc1MGN5QjBhR1VnYzJOb1pXUjFiR1ZrSUdsdWRHVnlabUZqWlZ4dUlDQWdLaW92WEc0Z0lHbHRjR3hsYldWdWRITlRZMmhsWkhWc1pXUW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaDBhR2x6TG1Ga2RtRnVZMlZVYVcxbElDWW1JSFJvYVhNdVlXUjJZVzVqWlZScGJXVWdhVzV6ZEdGdVkyVnZaaUJHZFc1amRHbHZiaWs3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EyaGxZMnNnZDJobGRHaGxjaUIwYUdVZ2RHbHRaU0JsYm1kcGJtVWdhVzF3YkdWdFpXNTBjeUIwYUdVZ2RISmhibk53YjNKMFpXUWdhVzUwWlhKbVlXTmxYRzRnSUNBcUtpOWNiaUFnYVcxd2JHVnRaVzUwYzFSeVlXNXpjRzl5ZEdWa0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNCMGFHbHpMbk41Ym1OUWIzTnBkR2x2YmlBbUppQjBhR2x6TG5ONWJtTlFiM05wZEdsdmJpQnBibk4wWVc1alpXOW1JRVoxYm1OMGFXOXVJQ1ltWEc0Z0lDQWdJQ0IwYUdsekxtRmtkbUZ1WTJWUWIzTnBkR2x2YmlBbUppQjBhR2x6TG1Ga2RtRnVZMlZRYjNOcGRHbHZiaUJwYm5OMFlXNWpaVzltSUVaMWJtTjBhVzl1WEc0Z0lDQWdLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGFHVmpheUIzYUdWMGFHVnlJSFJvWlNCMGFXMWxJR1Z1WjJsdVpTQnBiWEJzWlcxbGJuUnpJSFJvWlNCemNHVmxaQzFqYjI1MGNtOXNiR1ZrSUdsdWRHVnlabUZqWlZ4dUlDQWdLaW92WEc0Z0lHbHRjR3hsYldWdWRITlRjR1ZsWkVOdmJuUnliMnhzWldRb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoMGFHbHpMbk41Ym1OVGNHVmxaQ0FtSmlCMGFHbHpMbk41Ym1OVGNHVmxaQ0JwYm5OMFlXNWpaVzltSUVaMWJtTjBhVzl1S1R0Y2JpQWdmVnh1WEc0Z0lITmxkRk5qYUdWa2RXeGxaQ2h0WVhOMFpYSXNJSEpsYzJWMFRtVjRkRlJwYldVc0lHZGxkRU4xY25KbGJuUlVhVzFsTENCblpYUkRkWEp5Wlc1MFVHOXphWFJwYjI0cElIdGNiaUFnSUNCMGFHbHpMbTFoYzNSbGNpQTlJRzFoYzNSbGNqdGNiaUFnSUNCMGFHbHpMbWx1ZEdWeVptRmpaU0E5SUZ3aWMyTm9aV1IxYkdWa1hDSTdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmMyVjBSMlYwZEdWeWN5aG5aWFJEZFhKeVpXNTBWR2x0WlN3Z1oyVjBRM1Z5Y21WdWRGQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lHbG1JQ2h5WlhObGRFNWxlSFJVYVcxbEtWeHVJQ0FnSUNBZ2RHaHBjeTV5WlhObGRFNWxlSFJVYVcxbElEMGdjbVZ6WlhST1pYaDBWR2x0WlR0Y2JpQWdmVnh1WEc0Z0lITmxkRlJ5WVc1emNHOXlkR1ZrS0cxaGMzUmxjaXdnY21WelpYUk9aWGgwVUc5emFYUnBiMjRzSUdkbGRFTjFjbkpsYm5SVWFXMWxMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxtMWhjM1JsY2lBOUlHMWhjM1JsY2p0Y2JpQWdJQ0IwYUdsekxtbHVkR1Z5Wm1GalpTQTlJRndpZEhKaGJuTndiM0owWldSY0lqdGNibHh1SUNBZ0lIUm9hWE11WDE5elpYUkhaWFIwWlhKektHZGxkRU4xY25KbGJuUlVhVzFsTENCblpYUkRkWEp5Wlc1MFVHOXphWFJwYjI0cE8xeHVYRzRnSUNBZ2FXWWdLSEpsYzJWMFRtVjRkRkJ2YzJsMGFXOXVLVnh1SUNBZ0lDQWdkR2hwY3k1eVpYTmxkRTVsZUhSUWIzTnBkR2x2YmlBOUlISmxjMlYwVG1WNGRGQnZjMmwwYVc5dU8xeHVJQ0I5WEc1Y2JpQWdjMlYwVTNCbFpXUkRiMjUwY205c2JHVmtLRzFoYzNSbGNpd2daMlYwUTNWeWNtVnVkRlJwYldVc0lHZGxkRU4xY25KbGJuUlFiM05wZEdsdmJpa2dlMXh1SUNBZ0lIUm9hWE11YldGemRHVnlJRDBnYldGemRHVnlPMXh1SUNBZ0lIUm9hWE11YVc1MFpYSm1ZV05sSUQwZ1hDSnpjR1ZsWkMxamIyNTBjbTlzYkdWa1hDSTdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmMyVjBSMlYwZEdWeWN5aG5aWFJEZFhKeVpXNTBWR2x0WlN3Z1oyVjBRM1Z5Y21WdWRGQnZjMmwwYVc5dUtUdGNiaUFnZlZ4dVhHNGdJSEpsYzJWMFNXNTBaWEptWVdObEtDa2dlMXh1SUNBZ0lIUm9hWE11WDE5a1pXeGxkR1ZIWlhSMFpYSnpLQ2s3WEc1Y2JpQWdJQ0JrWld4bGRHVWdkR2hwY3k1eVpYTmxkRTVsZUhSVWFXMWxPMXh1SUNBZ0lHUmxiR1YwWlNCMGFHbHpMbkpsYzJWMFRtVjRkRkJ2YzJsMGFXOXVPMXh1WEc0Z0lDQWdkR2hwY3k1dFlYTjBaWElnUFNCdWRXeHNPMXh1SUNBZ0lIUm9hWE11YVc1MFpYSm1ZV05sSUQwZ2JuVnNiRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGIyNXVaV04wSUdGMVpHbHZJRzV2WkdWY2JpQWdJQ29nUUhCaGNtRnRJSHRQWW1wbFkzUjlJSFJoY21kbGRDQmhkV1JwYnlCdWIyUmxYRzRnSUNBcUwxeHVJQ0JqYjI1dVpXTjBLSFJoY21kbGRDa2dlMXh1SUNBZ0lIUm9hWE11YjNWMGNIVjBUbTlrWlM1amIyNXVaV04wS0hSaGNtZGxkQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE03WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1JHbHpZMjl1Ym1WamRDQmhkV1JwYnlCdWIyUmxYRzRnSUNBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCamIyNXVaV04wYVc5dUlHTnZibTVsWTNScGIyNGdkRzhnWW1VZ1pHbHpZMjl1Ym1WamRHVmtYRzRnSUNBcUwxeHVJQ0JrYVhOamIyNXVaV04wS0dOdmJtNWxZM1JwYjI0cElIdGNiaUFnSUNCMGFHbHpMbTkxZEhCMWRFNXZaR1V1WkdselkyOXVibVZqZENoamIyNXVaV04wYVc5dUtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJwYldWRmJtZHBibVU3WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBHcmFudWxhckVuZ2luZVxuICovXG5cbnZhciBHcmFudWxhckVuZ2luZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgaW5pdGlhbCBhdWRpbyBidWZmZXIgZm9yIGdyYW51bGFyIHN5bnRoZXNpc1xuICAgKlxuICAgKiBUaGUgZW5naW5lIGltcGxlbWVudHMgdGhlIFwic2NoZWR1bGVkXCIgaW50ZXJmYWNlLlxuICAgKiBUaGUgZ3JhaW4gcG9zaXRpb24gKGdyYWluIG9uc2V0IG9yIGNlbnRlciB0aW1lIGluIHRoZSBhdWRpbyBidWZmZXIpIGlzIG9wdGlvbmFsbHlcbiAgICogZGV0ZXJtaW5lZCBieSB0aGUgZW5naW5lJ3MgY3VycmVudFBvc2l0aW9uIGF0dHJpYnV0ZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gR3JhbnVsYXJFbmdpbmUoYXVkaW9Db250ZXh0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEdyYW51bGFyRW5naW5lKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKEdyYW51bGFyRW5naW5lLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgLyoqXG4gICAgICogQXVkaW8gYnVmZmVyXG4gICAgICogQHR5cGUge0F1ZGlvQnVmZmVyfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVyID0gb3B0aW9ucy5idWZmZXIgfHwgbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFic29sdXRlIGdyYWluIHBlcmlvZCBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kQWJzID0gb3B0aW9ucy5wZXJpb2RBYnMgfHwgMC4wMTtcblxuICAgIC8qKlxuICAgICAqIEdyYWluIHBlcmlvZCByZWxhdGl2ZSB0byBhYnNvbHV0ZSBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wZXJpb2RSZWwgPSBvcHRpb25zLnBlcmlvZFJlbCB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogQW1vdXQgb2YgcmFuZG9tIGdyYWluIHBlcmlvZCB2YXJpYXRpb24gcmVsYXRpdmUgdG8gZ3JhaW4gcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZFZhciA9IG9wdGlvbnMucGVyaW9kVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBHcmFpbiBwb3NpdGlvbiAob25zZXQgdGltZSBpbiBhdWRpbyBidWZmZXIpIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wb3NpdGlvbiA9IG9wdGlvbnMucG9zaXRpb24gfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSBncmFpbiBwb3NpdGlvbiB2YXJpYXRpb24gaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBvc2l0aW9uVmFyID0gb3B0aW9ucy5wb3NpdGlvblZhciB8fCAwLjAwMztcblxuICAgIC8qKlxuICAgICAqIEFic29sdXRlIGdyYWluIGR1cmF0aW9uIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kdXJhdGlvbkFicyA9IG9wdGlvbnMuZHVyYXRpb25BYnMgfHwgMC4xOyAvLyBhYnNvbHV0ZSBncmFpbiBkdXJhdGlvblxuXG4gICAgLyoqXG4gICAgICogR3JhaW4gZHVyYXRpb24gcmVsYXRpdmUgdG8gZ3JhaW4gcGVyaW9kIChvdmVybGFwKVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kdXJhdGlvblJlbCA9IG9wdGlvbnMuZHVyYXRpb25SZWwgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFic29sdXRlIGF0dGFjayB0aW1lIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hdHRhY2tBYnMgPSBvcHRpb25zLmF0dGFja0FicyB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogQXR0YWNrIHRpbWUgcmVsYXRpdmUgdG8gZ3JhaW4gZHVyYXRpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNrUmVsID0gb3B0aW9ucy5hdHRhY2tSZWwgfHwgMC41O1xuXG4gICAgLyoqXG4gICAgICogU2hhcGUgb2YgYXR0YWNrXG4gICAgICogQHR5cGUge1N0cmluZ30gJ2xpbicgZm9yIGxpbmVhciByYW1wLCAnZXhwJyBmb3IgZXhwb25lbnRpYWxcbiAgICAgKi9cbiAgICB0aGlzLmF0dGFja1NoYXBlID0gb3B0aW9ucy5hdHRhY2tTaGFwZSB8fCBcImxpblwiO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgcmVsZWFzZSB0aW1lIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZWxlYXNlQWJzID0gb3B0aW9ucy5yZWxlYXNlQWJzIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlIHRpbWUgcmVsYXRpdmUgdG8gZ3JhaW4gZHVyYXRpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucmVsZWFzZVJlbCA9IG9wdGlvbnMucmVsZWFzZVJlbCB8fCAwLjU7XG5cbiAgICAvKipcbiAgICAgKiBTaGFwZSBvZiByZWxlYXNlXG4gICAgICogQHR5cGUge1N0cmluZ30gJ2xpbicgZm9yIGxpbmVhciByYW1wLCAnZXhwJyBmb3IgZXhwb25lbnRpYWxcbiAgICAgKi9cbiAgICB0aGlzLnJlbGVhc2VTaGFwZSA9IG9wdGlvbnMucmVsZWFzZVNoYXBlIHx8IFwibGluXCI7XG5cbiAgICAvKipcbiAgICAgKiBPZmZzZXQgKHN0YXJ0L2VuZCB2YWx1ZSkgZm9yIGV4cG9uZW50aWFsIGF0dGFjay9yZWxlYXNlXG4gICAgICogQHR5cGUge051bWJlcn0gb2Zmc2V0XG4gICAgICovXG4gICAgdGhpcy5leHBSYW1wT2Zmc2V0ID0gb3B0aW9ucy5leHBSYW1wT2Zmc2V0IHx8IDAuMDAwMTtcblxuICAgIC8qKlxuICAgICAqIEdyYWluIHJlc2FtcGxpbmcgaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nID0gb3B0aW9ucy5yZXNhbXBsaW5nIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBbW91dCBvZiByYW5kb20gcmVzYW1wbGluZyB2YXJpYXRpb24gaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nVmFyID0gb3B0aW9ucy5yZXNhbXBsaW5nVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBncmFpbiBwb3NpdGlvbiByZWZlcnMgdG8gdGhlIGNlbnRlciBvZiB0aGUgZ3JhaW4gKG9yIHRoZSBiZWdpbm5pbmcpXG4gICAgICogQHR5cGUge0Jvb2x9XG4gICAgICovXG4gICAgdGhpcy5jZW50ZXJlZCA9IG9wdGlvbnMuY2VudGVyZWQgfHwgdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGF1ZGlvIGJ1ZmZlciBhbmQgZ3JhaW4gcG9zaXRpb24gYXJlIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICogQHR5cGUge0Jvb2x9XG4gICAgICovXG4gICAgdGhpcy5jeWNsaWMgPSBvcHRpb25zLmN5Y2xpYyB8fCBmYWxzZTtcblxuICAgIHRoaXMuX19nYWluTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUgPSBvcHRpb25zLmdhaW4gfHwgMTtcblxuICAgIHRoaXMub3V0cHV0Tm9kZSA9IHRoaXMuX19nYWluTm9kZTtcbiAgfVxuXG4gIF9pbmhlcml0cyhHcmFudWxhckVuZ2luZSwgX1RpbWVFbmdpbmUpO1xuXG4gIF9jcmVhdGVDbGFzcyhHcmFudWxhckVuZ2luZSwge1xuICAgIGJ1ZmZlckR1cmF0aW9uOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXIuZHVyYXRpb247XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyLndyYXBBcm91bmRFeHRlbnRpb24pIGJ1ZmZlckR1cmF0aW9uIC09IHRoaXMuYnVmZmVyLndyYXBBcm91bmRFeHRlbnRpb247XG5cbiAgICAgICAgcmV0dXJuIGJ1ZmZlckR1cmF0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudFBvc2l0aW9uOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgYXR0cmlidXRlXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzY2hlZHVsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVRpbWUodGltZSkge1xuICAgICAgICByZXR1cm4gdGltZSArIHRoaXMudHJpZ2dlcih0aW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBsYXliYWNrTGVuZ3RoOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyRHVyYXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBnYWluOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IGdhaW5cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBsaW5lYXIgZ2FpbiBmYWN0b3JcbiAgICAgICAqL1xuXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgZ2FpblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IGdhaW5cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIGEgZ3JhaW5cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIGdyYWluIHN5bnRoZXNpcyBhdWRpbyB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHBlcmlvZCB0byBuZXh0IGdyYWluXG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIGF0IGFueSB0aW1lICh3aGV0aGVyIHRoZSBlbmdpbmUgaXMgc2NoZWR1bGVkIG9yIG5vdClcbiAgICAgICAqIHRvIGdlbmVyYXRlIGEgc2luZ2xlIGdyYWluIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBncmFpbiBwYXJhbWV0ZXJzLlxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0cmlnZ2VyKHRpbWUpIHtcbiAgICAgICAgdmFyIG91dHB1dE5vZGUgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMub3V0cHV0Tm9kZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBncmFpblRpbWUgPSB0aW1lIHx8IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgICAgdmFyIGdyYWluUGVyaW9kID0gdGhpcy5wZXJpb2RBYnM7XG4gICAgICAgIHZhciBncmFpblBvc2l0aW9uID0gdGhpcy5jdXJyZW50UG9zaXRpb247XG4gICAgICAgIHZhciBncmFpbkR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbkFicztcblxuICAgICAgICBpZiAodGhpcy5idWZmZXIpIHtcbiAgICAgICAgICB2YXIgcmVzYW1wbGluZ1JhdGUgPSAxO1xuXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHJlc2FtcGxpbmdcbiAgICAgICAgICBpZiAodGhpcy5yZXNhbXBsaW5nICE9PSAwIHx8IHRoaXMucmVzYW1wbGluZ1ZhciA+IDApIHtcbiAgICAgICAgICAgIHZhciByYW5kb21SZXNhbXBsaW5nID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMiAqIHRoaXMucmVzYW1wbGluZ1ZhcjtcbiAgICAgICAgICAgIHJlc2FtcGxpbmdSYXRlID0gTWF0aC5wb3coMiwgKHRoaXMucmVzYW1wbGluZyArIHJhbmRvbVJlc2FtcGxpbmcpIC8gMTIwMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JhaW5QZXJpb2QgKz0gdGhpcy5wZXJpb2RSZWwgKiBncmFpbkR1cmF0aW9uO1xuICAgICAgICAgIGdyYWluRHVyYXRpb24gKz0gdGhpcy5kdXJhdGlvblJlbCAqIGdyYWluUGVyaW9kO1xuXG4gICAgICAgICAgLy8gZ3JhaW4gcGVyaW9kIHJhbmRvbiB2YXJpYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wZXJpb2RWYXIgPiAwKSBncmFpblBlcmlvZCArPSAyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wZXJpb2RWYXIgKiBncmFpblBlcmlvZDtcblxuICAgICAgICAgIC8vIGNlbnRlciBncmFpblxuICAgICAgICAgIGlmICh0aGlzLmNlbnRlcmVkKSBncmFpblBvc2l0aW9uIC09IDAuNSAqIGdyYWluRHVyYXRpb247XG5cbiAgICAgICAgICAvLyByYW5kb21pemUgZ3JhaW4gcG9zaXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvblZhciA+IDApIGdyYWluUG9zaXRpb24gKz0gKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSkgKiB0aGlzLnBvc2l0aW9uVmFyO1xuXG4gICAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgIC8vIHdyYXAgb3IgY2xpcCBncmFpbiBwb3NpdGlvbiBhbmQgZHVyYXRpb24gaW50byBidWZmZXIgZHVyYXRpb25cbiAgICAgICAgICBpZiAoZ3JhaW5Qb3NpdGlvbiA8IDAgfHwgZ3JhaW5Qb3NpdGlvbiA+PSBidWZmZXJEdXJhdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3ljbGljKSB7XG4gICAgICAgICAgICAgIHZhciBjeWNsZXMgPSBncmFpblBvc2l0aW9uIC8gYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICAgIGdyYWluUG9zaXRpb24gPSAoY3ljbGVzIC0gTWF0aC5mbG9vcihjeWNsZXMpKSAqIGJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgICAgICAgIGlmIChncmFpblBvc2l0aW9uICsgZ3JhaW5EdXJhdGlvbiA+IHRoaXMuYnVmZmVyLmR1cmF0aW9uKSBncmFpbkR1cmF0aW9uID0gdGhpcy5idWZmZXIuZHVyYXRpb24gLSBncmFpblBvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGdyYWluUG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgZ3JhaW5UaW1lIC09IGdyYWluUG9zaXRpb247XG4gICAgICAgICAgICAgICAgZ3JhaW5EdXJhdGlvbiArPSBncmFpblBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGdyYWluUG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGdyYWluUG9zaXRpb24gKyBncmFpbkR1cmF0aW9uID4gYnVmZmVyRHVyYXRpb24pIGdyYWluRHVyYXRpb24gPSBidWZmZXJEdXJhdGlvbiAtIGdyYWluUG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbWFrZSBncmFpblxuICAgICAgICAgIGlmICh0aGlzLmdhaW4gPiAwICYmIGdyYWluRHVyYXRpb24gPj0gMC4wMDEpIHtcbiAgICAgICAgICAgIC8vIG1ha2UgZ3JhaW4gZW52ZWxvcGVcbiAgICAgICAgICAgIHZhciBlbnZlbG9wZU5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICAgICAgdmFyIGF0dGFjayA9IHRoaXMuYXR0YWNrQWJzICsgdGhpcy5hdHRhY2tSZWwgKiBncmFpbkR1cmF0aW9uO1xuICAgICAgICAgICAgdmFyIHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VBYnMgKyB0aGlzLnJlbGVhc2VSZWwgKiBncmFpbkR1cmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoYXR0YWNrICsgcmVsZWFzZSA+IGdyYWluRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgdmFyIGZhY3RvciA9IGdyYWluRHVyYXRpb24gLyAoYXR0YWNrICsgcmVsZWFzZSk7XG4gICAgICAgICAgICAgIGF0dGFjayAqPSBmYWN0b3I7XG4gICAgICAgICAgICAgIHJlbGVhc2UgKj0gZmFjdG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0YWNrRW5kVGltZSA9IGdyYWluVGltZSArIGF0dGFjaztcbiAgICAgICAgICAgIHZhciBncmFpbkVuZFRpbWUgPSBncmFpblRpbWUgKyBncmFpbkR1cmF0aW9uO1xuICAgICAgICAgICAgdmFyIHJlbGVhc2VTdGFydFRpbWUgPSBncmFpbkVuZFRpbWUgLSByZWxlYXNlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRhY2tTaGFwZSA9PT0gXCJsaW5cIikge1xuICAgICAgICAgICAgICBlbnZlbG9wZU5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBncmFpblRpbWUpO1xuICAgICAgICAgICAgICBlbnZlbG9wZU5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBhdHRhY2tFbmRUaW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKHRoaXMuZXhwUmFtcE9mZnNldCwgZ3JhaW5UaW1lKTtcbiAgICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgxLCBhdHRhY2tFbmRUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlbGVhc2VTdGFydFRpbWUgPiBhdHRhY2tFbmRUaW1lKSBlbnZlbG9wZU5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLCByZWxlYXNlU3RhcnRUaW1lKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmVsZWFzZVNoYXBlID09PSBcImxpblwiKSB7XG4gICAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGdyYWluRW5kVGltZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbnZlbG9wZU5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZXhwUmFtcE9mZnNldCwgZ3JhaW5FbmRUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cbiAgICAgICAgICAgIC8vIG1ha2Ugc291cmNlXG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXG4gICAgICAgICAgICBzb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgICAgICBzb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlID0gcmVzYW1wbGluZ1JhdGU7XG4gICAgICAgICAgICBzb3VyY2UuY29ubmVjdChlbnZlbG9wZU5vZGUpO1xuXG4gICAgICAgICAgICBzb3VyY2Uuc3RhcnQoZ3JhaW5UaW1lLCBncmFpblBvc2l0aW9uKTtcbiAgICAgICAgICAgIHNvdXJjZS5zdG9wKGdyYWluVGltZSArIGdyYWluRHVyYXRpb24gLyByZXNhbXBsaW5nUmF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyYWluUGVyaW9kO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIEdyYW51bGFyRW5naW5lO1xufSkoVGltZUVuZ2luZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbnVsYXJFbmdpbmU7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gZ3JhbnVsYXIgc3ludGhlc2lzIGVuZ2luZVxuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGUFFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN096czdPMGxCU3pGRExHTkJRV003T3pzN096czdPenM3UVVGVFVDeFhRVlJRTEdOQlFXTXNRMEZUVGl4WlFVRlpMRVZCUVdVN1VVRkJaQ3hQUVVGUExHZERRVUZITEVWQlFVVTdPekJDUVZScVF5eGpRVUZqT3p0QlFWVm9RaXh4UTBGV1JTeGpRVUZqTERaRFFWVldMRmxCUVZrc1JVRkJSVHM3T3pzN08wRkJUWEJDTEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzU1VGQlNTeEpRVUZKTEVOQlFVTTdPenM3T3p0QlFVMXlReXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRWxCUVVrc1NVRkJTU3hEUVVGRE96czdPenM3UVVGTk0wTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFhoRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1NVRkJTU3hEUVVGRExFTkJRVU03T3pzN096dEJRVTE0UXl4UlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVsQlFVa3NRMEZCUXl4RFFVRkRPenM3T3pzN1FVRk5kRU1zVVVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhKUVVGSkxFdEJRVXNzUTBGQlF6czdPenM3TzBGQlRXaEVMRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWY3NTVUZCU1N4SFFVRkhMRU5CUVVNN096czdPenRCUVUwNVF5eFJRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRTlCUVU4c1EwRkJReXhYUVVGWExFbEJRVWtzUTBGQlF5eERRVUZET3pzN096czdRVUZOTlVNc1VVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUWGhETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1MwRkJTeXhEUVVGRE96czdPenM3UVVGTmFFUXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFRGRExGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1NVRkJTU3hIUVVGSExFTkJRVU03T3pzN096dEJRVTAxUXl4UlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN1FVRk5iRVFzVVVGQlNTeERRVUZETEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc1lVRkJZU3hKUVVGSkxFMUJRVTBzUTBGQlF6czdPenM3TzBGQlRYSkVMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenRCUVUweFF5eFJRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGaExFbEJRVWtzUTBGQlF5eERRVUZET3pzN096czdRVUZOYUVRc1VVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVVUZCVVN4SlFVRkpMRWxCUVVrc1EwRkJRenM3T3pzN08wRkJUWHBETEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTTdPMEZCUlhSRExGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRelZETEZGQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1EwRkJRenM3UVVGRkwwTXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETzBkQlEyNURPenRaUVd4SlJ5eGpRVUZqT3p0bFFVRmtMR05CUVdNN1FVRnZTV1FzYTBKQlFXTTdWMEZCUVN4WlFVRkhPMEZCUTI1Q0xGbEJRVWtzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRE96dEJRVVV4UXl4WlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zYlVKQlFXMUNMRVZCUTJwRExHTkJRV01zU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeERRVUZET3p0QlFVVndSQ3hsUVVGUExHTkJRV01zUTBGQlF6dFBRVU4yUWpzN1FVRkhSeXh0UWtGQlpUczdPenRYUVVGQkxGbEJRVWM3UVVGRGNFSXNaVUZCVHl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wOUJRM1JDT3p0QlFVZEVMR1ZCUVZjN096czdZVUZCUVN4eFFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRGFFSXNaVUZCVHl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UFFVTnNRenM3UVVGRlJ5eHJRa0ZCWXp0WFFVRkJMRmxCUVVjN1FVRkRia0lzWlVGQlR5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRPMDlCUXpWQ096dEJRV05ITEZGQlFVazdPenM3T3pzN1YwRlNRU3hWUVVGRExFdEJRVXNzUlVGQlJUdEJRVU5rTEZsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdUMEZEY0VNN096czdPenRYUVUxUExGbEJRVWM3UVVGRFZDeGxRVUZQTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF6dFBRVU51UXpzN1FVRlZSQ3hYUVVGUE96czdPenM3T3pzN096dGhRVUZCTEdsQ1FVRkRMRWxCUVVrc1JVRkJaME03V1VGQk9VSXNWVUZCVlN4blEwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZUczdRVUZEZUVNc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTnlReXhaUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVsQlFVa3NXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJRenRCUVVOcVJDeFpRVUZKTEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRMnBETEZsQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU03UVVGRGVrTXNXVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF6czdRVUZGY2tNc1dVRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNZMEZCU1N4alFVRmpMRWRCUVVjc1EwRkJSeXhEUVVGRE96czdRVUZIZWtJc1kwRkJTU3hKUVVGSkxFTkJRVU1zVlVGQlZTeExRVUZMTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1lVRkJZU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU51UkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVRXNSMEZCU1N4RFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF6dEJRVU40UlN3d1FrRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUnl4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJRU3hIUVVGSkxFbEJRVTBzUTBGQlF5eERRVUZETzFkQlF5OUZPenRCUVVWRUxIRkNRVUZYTEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhoUVVGaExFTkJRVU03UVVGRE9VTXNkVUpCUVdFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEZkQlFWY3NRMEZCUXpzN08wRkJSMmhFTEdOQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGSExFVkJRM1JDTEZkQlFWY3NTVUZCU1N4RFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVkQlFVY3NRMEZCUVN4QlFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTTdPenRCUVVjMVJTeGpRVUZKTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUTJZc1lVRkJZU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eGhRVUZoTEVOQlFVTTdPenRCUVVkMlF5eGpRVUZKTEVsQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1EwRkJReXhGUVVOMFFpeGhRVUZoTEVsQlFVa3NRMEZCUXl4RFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03TzBGQlJXaEZMR05CUVVrc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTTdPenRCUVVkNlF5eGpRVUZKTEdGQlFXRXNSMEZCUnl4RFFVRkRMRWxCUVVrc1lVRkJZU3hKUVVGSkxHTkJRV01zUlVGQlJUdEJRVU40UkN4blFrRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNhMEpCUVVrc1RVRkJUU3hIUVVGSExHRkJRV0VzUjBGQlJ5eGpRVUZqTEVOQlFVTTdRVUZETlVNc01rSkJRV0VzUjBGQlJ5eERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZCTEVkQlFVa3NZMEZCWXl4RFFVRkRPenRCUVVVdlJDeHJRa0ZCU1N4aFFVRmhMRWRCUVVjc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4RlFVTjBSQ3hoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRWRCUVVjc1lVRkJZU3hEUVVGRE8yRkJRM2hFTEUxQlFVMDdRVUZEVEN4clFrRkJTU3hoUVVGaExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEzSkNMSGxDUVVGVExFbEJRVWtzWVVGQllTeERRVUZETzBGQlF6TkNMRFpDUVVGaExFbEJRVWtzWVVGQllTeERRVUZETzBGQlF5OUNMRFpDUVVGaExFZEJRVWNzUTBGQlF5eERRVUZETzJWQlEyNUNPenRCUVVWRUxHdENRVUZKTEdGQlFXRXNSMEZCUnl4aFFVRmhMRWRCUVVjc1kwRkJZeXhGUVVOb1JDeGhRVUZoTEVkQlFVY3NZMEZCWXl4SFFVRkhMR0ZCUVdFc1EwRkJRenRoUVVOc1JEdFhRVU5HT3pzN1FVRkhSQ3hqUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NRMEZCUXl4SlFVRkpMR0ZCUVdFc1NVRkJTU3hMUVVGTExFVkJRVVU3TzBGQlJUTkRMR2RDUVVGSkxGbEJRVmtzUjBGQlJ5eFpRVUZaTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1FVRkROME1zWjBKQlFVa3NUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4aFFVRmhMRU5CUVVNN1FVRkROMFFzWjBKQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4aFFVRmhMRU5CUVVNN08wRkJSV2hGTEdkQ1FVRkpMRTFCUVUwc1IwRkJSeXhQUVVGUExFZEJRVWNzWVVGQllTeEZRVUZGTzBGQlEzQkRMR3RDUVVGSkxFMUJRVTBzUjBGQlJ5eGhRVUZoTEVsQlFVa3NUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJRU3hCUVVGRExFTkJRVU03UVVGRGFFUXNiMEpCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU03UVVGRGFrSXNjVUpCUVU4c1NVRkJTU3hOUVVGTkxFTkJRVU03WVVGRGJrSTdPMEZCUlVRc1owSkJRVWtzWVVGQllTeEhRVUZITEZOQlFWTXNSMEZCUnl4TlFVRk5MRU5CUVVNN1FVRkRka01zWjBKQlFVa3NXVUZCV1N4SFFVRkhMRk5CUVZNc1IwRkJSeXhoUVVGaExFTkJRVU03UVVGRE4wTXNaMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NXVUZCV1N4SFFVRkhMRTlCUVU4c1EwRkJRenM3UVVGRk9VTXNaMEpCUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUzBGQlN5eExRVUZMTEVWQlFVVTdRVUZET1VJc01FSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVjc1JVRkJSU3hUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU5xUkN3d1FrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGSExFVkJRVVVzWVVGQllTeERRVUZETEVOQlFVTTdZVUZETDBRc1RVRkJUVHRCUVVOTUxEQkNRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTJoRkxEQkNRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRFJDUVVFMFFpeERRVUZETEVOQlFVY3NSVUZCUlN4aFFVRmhMRU5CUVVNc1EwRkJRenRoUVVOd1JUczdRVUZGUkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4aFFVRmhMRVZCUTJ4RExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVjc1JVRkJSU3huUWtGQlowSXNRMEZCUXl4RFFVRkRPenRCUVVVeFJDeG5Ra0ZCU1N4SlFVRkpMRU5CUVVNc1dVRkJXU3hMUVVGTExFdEJRVXNzUlVGQlJUdEJRVU12UWl3d1FrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGSExFVkJRVVVzV1VGQldTeERRVUZETEVOQlFVTTdZVUZET1VRc1RVRkJUVHRCUVVOTUxEQkNRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRFJDUVVFMFFpeERRVUZETEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU03WVVGRGJFWTdPMEZCUlVRc2QwSkJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN096dEJRVWRxUXl4blFrRkJTU3hOUVVGTkxFZEJRVWNzV1VGQldTeERRVUZETEd0Q1FVRnJRaXhGUVVGRkxFTkJRVU03TzBGQlJTOURMR3RDUVVGTkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkROVUlzYTBKQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhIUVVGSExHTkJRV01zUTBGQlF6dEJRVU16UXl4clFrRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXpzN1FVRkZOMElzYTBKQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZETzBGQlEzWkRMR3RDUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4aFFVRmhMRWRCUVVjc1kwRkJZeXhEUVVGRExFTkJRVU03VjBGRGVrUTdVMEZEUmpzN1FVRkZSQ3hsUVVGUExGZEJRVmNzUTBGQlF6dFBRVU53UWpzN096dFRRWHBTUnl4alFVRmpPMGRCUVZNc1ZVRkJWVHM3UVVFMFVuWkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWTBGQll5eERRVUZESWl3aVptbHNaU0k2SW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFJSGR5YVhSMFpXNGdhVzRnUlVOTlFYTmpjbWx3ZENBMklDb3ZYRzR2S2lwY2JpQXFJRUJtYVd4bGIzWmxjblpwWlhjZ1YwRldSU0JoZFdScGJ5Qm5jbUZ1ZFd4aGNpQnplVzUwYUdWemFYTWdaVzVuYVc1bFhHNGdLaUJBWVhWMGFHOXlJRTV2Y21KbGNuUXVVMk5vYm1Wc2JFQnBjbU5oYlM1bWNpd2dWbWxqZEc5eUxsTmhhWHBBYVhKallXMHVabklzSUV0aGNtbHRMa0poY210aGRHbEFhWEpqWVcwdVpuSmNiaUFxTDF4dVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JuWmhjaUJVYVcxbFJXNW5hVzVsSUQwZ2NtVnhkV2x5WlNoY0lpNHVMMk52Y21VdmRHbHRaUzFsYm1kcGJtVmNJaWs3WEc1Y2JpOHFLbHh1SUNvZ1FHTnNZWE56SUVkeVlXNTFiR0Z5Ulc1bmFXNWxYRzRnS2k5Y2JtTnNZWE56SUVkeVlXNTFiR0Z5Ulc1bmFXNWxJR1Y0ZEdWdVpITWdWR2x0WlVWdVoybHVaU0I3WEc0Z0lDOHFLbHh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBZ0lDb2dRSEJoY21GdElIdEJkV1JwYjBKMVptWmxjbjBnWW5WbVptVnlJR2x1YVhScFlXd2dZWFZrYVc4Z1luVm1abVZ5SUdadmNpQm5jbUZ1ZFd4aGNpQnplVzUwYUdWemFYTmNiaUFnSUNwY2JpQWdJQ29nVkdobElHVnVaMmx1WlNCcGJYQnNaVzFsYm5SeklIUm9aU0JjSW5OamFHVmtkV3hsWkZ3aUlHbHVkR1Z5Wm1GalpTNWNiaUFnSUNvZ1ZHaGxJR2R5WVdsdUlIQnZjMmwwYVc5dUlDaG5jbUZwYmlCdmJuTmxkQ0J2Y2lCalpXNTBaWElnZEdsdFpTQnBiaUIwYUdVZ1lYVmthVzhnWW5WbVptVnlLU0JwY3lCdmNIUnBiMjVoYkd4NVhHNGdJQ0FxSUdSbGRHVnliV2x1WldRZ1lua2dkR2hsSUdWdVoybHVaU2R6SUdOMWNuSmxiblJRYjNOcGRHbHZiaUJoZEhSeWFXSjFkR1V1WEc0Z0lDQXFMMXh1SUNCamIyNXpkSEoxWTNSdmNpaGhkV1JwYjBOdmJuUmxlSFFzYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ2MzVndaWElvWVhWa2FXOURiMjUwWlhoMEtUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUYxWkdsdklHSjFabVpsY2x4dUlDQWdJQ0FxSUVCMGVYQmxJSHRCZFdScGIwSjFabVpsY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtSjFabVpsY2lBOUlHOXdkR2x2Ym5NdVluVm1abVZ5SUh4OElHNTFiR3c3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQlluTnZiSFYwWlNCbmNtRnBiaUJ3WlhKcGIyUWdhVzRnYzJWalhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTA1MWJXSmxjbjFjYmlBZ0lDQWdLaTljYmlBZ0lDQjBhR2x6TG5CbGNtbHZaRUZpY3lBOUlHOXdkR2x2Ym5NdWNHVnlhVzlrUVdKeklIeDhJREF1TURFN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkhjbUZwYmlCd1pYSnBiMlFnY21Wc1lYUnBkbVVnZEc4Z1lXSnpiMngxZEdVZ1pIVnlZWFJwYjI1Y2JpQWdJQ0FnS2lCQWRIbHdaU0I3VG5WdFltVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Y0dWeWFXOWtVbVZzSUQwZ2IzQjBhVzl1Y3k1d1pYSnBiMlJTWld3Z2ZId2dNRHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVGdGIzVjBJRzltSUhKaGJtUnZiU0JuY21GcGJpQndaWEpwYjJRZ2RtRnlhV0YwYVc5dUlISmxiR0YwYVhabElIUnZJR2R5WVdsdUlIQmxjbWx2WkZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV3WlhKcGIyUldZWElnUFNCdmNIUnBiMjV6TG5CbGNtbHZaRlpoY2lCOGZDQXdPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUjNKaGFXNGdjRzl6YVhScGIyNGdLRzl1YzJWMElIUnBiV1VnYVc0Z1lYVmthVzhnWW5WbVptVnlLU0JwYmlCelpXTmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNHOXphWFJwYjI0Z1BTQnZjSFJwYjI1ekxuQnZjMmwwYVc5dUlIeDhJREE3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmJXOTFkQ0J2WmlCeVlXNWtiMjBnWjNKaGFXNGdjRzl6YVhScGIyNGdkbUZ5YVdGMGFXOXVJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d2IzTnBkR2x2YmxaaGNpQTlJRzl3ZEdsdmJuTXVjRzl6YVhScGIyNVdZWElnZkh3Z01DNHdNRE03WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQlluTnZiSFYwWlNCbmNtRnBiaUJrZFhKaGRHbHZiaUJwYmlCelpXTmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVpIVnlZWFJwYjI1QlluTWdQU0J2Y0hScGIyNXpMbVIxY21GMGFXOXVRV0p6SUh4OElEQXVNVHNnTHk4Z1lXSnpiMngxZEdVZ1ozSmhhVzRnWkhWeVlYUnBiMjVjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVkeVlXbHVJR1IxY21GMGFXOXVJSEpsYkdGMGFYWmxJSFJ2SUdkeVlXbHVJSEJsY21sdlpDQW9iM1psY214aGNDbGNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVpIVnlZWFJwYjI1U1pXd2dQU0J2Y0hScGIyNXpMbVIxY21GMGFXOXVVbVZzSUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJCWW5OdmJIVjBaU0JoZEhSaFkyc2dkR2x0WlNCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVZWFIwWVdOclFXSnpJRDBnYjNCMGFXOXVjeTVoZEhSaFkydEJZbk1nZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUYwZEdGamF5QjBhVzFsSUhKbGJHRjBhWFpsSUhSdklHZHlZV2x1SUdSMWNtRjBhVzl1WEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbUYwZEdGamExSmxiQ0E5SUc5d2RHbHZibk11WVhSMFlXTnJVbVZzSUh4OElEQXVOVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZOb1lYQmxJRzltSUdGMGRHRmphMXh1SUNBZ0lDQXFJRUIwZVhCbElIdFRkSEpwYm1kOUlDZHNhVzRuSUdadmNpQnNhVzVsWVhJZ2NtRnRjQ3dnSjJWNGNDY2dabTl5SUdWNGNHOXVaVzUwYVdGc1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWhkSFJoWTJ0VGFHRndaU0E5SUc5d2RHbHZibk11WVhSMFlXTnJVMmhoY0dVZ2ZId2dKMnhwYmljN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkJZbk52YkhWMFpTQnlaV3hsWVhObElIUnBiV1VnYVc0Z2MyVmpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxuSmxiR1ZoYzJWQlluTWdQU0J2Y0hScGIyNXpMbkpsYkdWaGMyVkJZbk1nZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkpsYkdWaGMyVWdkR2x0WlNCeVpXeGhkR2wyWlNCMGJ5Qm5jbUZwYmlCa2RYSmhkR2x2Ymx4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV5Wld4bFlYTmxVbVZzSUQwZ2IzQjBhVzl1Y3k1eVpXeGxZWE5sVW1Wc0lIeDhJREF1TlR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGTm9ZWEJsSUc5bUlISmxiR1ZoYzJWY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VTNSeWFXNW5mU0FuYkdsdUp5Qm1iM0lnYkdsdVpXRnlJSEpoYlhBc0lDZGxlSEFuSUdadmNpQmxlSEJ2Ym1WdWRHbGhiRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Y21Wc1pXRnpaVk5vWVhCbElEMGdiM0IwYVc5dWN5NXlaV3hsWVhObFUyaGhjR1VnZkh3Z0oyeHBiaWM3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCUFptWnpaWFFnS0hOMFlYSjBMMlZ1WkNCMllXeDFaU2tnWm05eUlHVjRjRzl1Wlc1MGFXRnNJR0YwZEdGamF5OXlaV3hsWVhObFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTA1MWJXSmxjbjBnYjJabWMyVjBYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVsZUhCU1lXMXdUMlptYzJWMElEMGdiM0IwYVc5dWN5NWxlSEJTWVcxd1QyWm1jMlYwSUh4OElEQXVNREF3TVR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZHlZV2x1SUhKbGMyRnRjR3hwYm1jZ2FXNGdZMlZ1ZEZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV5WlhOaGJYQnNhVzVuSUQwZ2IzQjBhVzl1Y3k1eVpYTmhiWEJzYVc1bklIeDhJREE3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmJXOTFkQ0J2WmlCeVlXNWtiMjBnY21WellXMXdiR2x1WnlCMllYSnBZWFJwYjI0Z2FXNGdZMlZ1ZEZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV5WlhOaGJYQnNhVzVuVm1GeUlEMGdiM0IwYVc5dWN5NXlaWE5oYlhCc2FXNW5WbUZ5SUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJYYUdWMGFHVnlJSFJvWlNCbmNtRnBiaUJ3YjNOcGRHbHZiaUJ5WldabGNuTWdkRzhnZEdobElHTmxiblJsY2lCdlppQjBhR1VnWjNKaGFXNGdLRzl5SUhSb1pTQmlaV2RwYm01cGJtY3BYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwSnZiMng5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1alpXNTBaWEpsWkNBOUlHOXdkR2x2Ym5NdVkyVnVkR1Z5WldRZ2ZId2dkSEoxWlR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGZG9aWFJvWlhJZ2RHaGxJR0YxWkdsdklHSjFabVpsY2lCaGJtUWdaM0poYVc0Z2NHOXphWFJwYjI0Z1lYSmxJR052Ym5OcFpHVnlaV1FnWVhNZ1kzbGpiR2xqWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMEp2YjJ4OVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWplV05zYVdNZ1BTQnZjSFJwYjI1ekxtTjVZMnhwWXlCOGZDQm1ZV3h6WlR0Y2JseHVJQ0FnSUhSb2FYTXVYMTluWVdsdVRtOWtaU0E5SUdGMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJR2RsZENCaWRXWm1aWEpFZFhKaGRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2k1M2NtRndRWEp2ZFc1a1JYaDBaVzUwYVc5dUtWeHVJQ0FnSUNBZ1luVm1abVZ5UkhWeVlYUnBiMjRnTFQwZ2RHaHBjeTVpZFdabVpYSXVkM0poY0VGeWIzVnVaRVY0ZEdWdWRHbHZianRjYmx4dUlDQWdJSEpsZEhWeWJpQmlkV1ptWlhKRWRYSmhkR2x2Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRlJwYldWRmJtZHBibVVnWVhSMGNtbGlkWFJsWEc0Z0lHZGxkQ0JqZFhKeVpXNTBVRzl6YVhScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Y0c5emFYUnBiMjQ3WEc0Z0lIMWNibHh1SUNBdkx5QlVhVzFsUlc1bmFXNWxJRzFsZEdodlpDQW9jMk5vWldSMWJHVmtJR2x1ZEdWeVptRmpaU2xjYmlBZ1lXUjJZVzVqWlZScGJXVW9kR2x0WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYVcxbElDc2dkR2hwY3k1MGNtbG5aMlZ5S0hScGJXVXBPMXh1SUNCOVhHNWNiaUFnWjJWMElIQnNZWGxpWVdOclRHVnVaM1JvS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGTmxkQ0JuWVdsdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0IyWVd4MVpTQnNhVzVsWVhJZ1oyRnBiaUJtWVdOMGIzSmNiaUFnSUNvdlhHNGdJSE5sZENCbllXbHVLSFpoYkhWbEtTQjdYRzRnSUNBZ2RHaHBjeTVmWDJkaGFXNU9iMlJsTG1kaGFXNHVkbUZzZFdVZ1BTQjJZV3gxWlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnWjJGcGJseHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdOMWNuSmxiblFnWjJGcGJseHVJQ0FnS2k5Y2JpQWdaMlYwSUdkaGFXNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5bllXbHVUbTlrWlM1bllXbHVMblpoYkhWbE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJ5YVdkblpYSWdZU0JuY21GcGJseHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZEdsdFpTQm5jbUZwYmlCemVXNTBhR1Z6YVhNZ1lYVmthVzhnZEdsdFpWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUhCbGNtbHZaQ0IwYnlCdVpYaDBJR2R5WVdsdVhHNGdJQ0FxWEc0Z0lDQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z1kyRnVJR0psSUdOaGJHeGxaQ0JoZENCaGJua2dkR2x0WlNBb2QyaGxkR2hsY2lCMGFHVWdaVzVuYVc1bElHbHpJSE5qYUdWa2RXeGxaQ0J2Y2lCdWIzUXBYRzRnSUNBcUlIUnZJR2RsYm1WeVlYUmxJR0VnYzJsdVoyeGxJR2R5WVdsdUlHRmpZMjl5WkdsdVp5QjBieUIwYUdVZ1kzVnljbVZ1ZENCbmNtRnBiaUJ3WVhKaGJXVjBaWEp6TGx4dUlDQWdLaTljYmlBZ2RISnBaMmRsY2loMGFXMWxMQ0J2ZFhSd2RYUk9iMlJsSUQwZ2RHaHBjeTV2ZFhSd2RYUk9iMlJsS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dUlDQWdJSFpoY2lCbmNtRnBibFJwYldVZ1BTQjBhVzFsSUh4OElHRjFaR2x2UTI5dWRHVjRkQzVqZFhKeVpXNTBWR2x0WlR0Y2JpQWdJQ0IyWVhJZ1ozSmhhVzVRWlhKcGIyUWdQU0IwYUdsekxuQmxjbWx2WkVGaWN6dGNiaUFnSUNCMllYSWdaM0poYVc1UWIzTnBkR2x2YmlBOUlIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVPMXh1SUNBZ0lIWmhjaUJuY21GcGJrUjFjbUYwYVc5dUlEMGdkR2hwY3k1a2RYSmhkR2x2YmtGaWN6dGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2lrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEpsYzJGdGNHeHBibWRTWVhSbElEMGdNUzR3TzF4dVhHNGdJQ0FnSUNBdkx5QmpZV3hqZFd4aGRHVWdjbVZ6WVcxd2JHbHVaMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVjbVZ6WVcxd2JHbHVaeUFoUFQwZ01DQjhmQ0IwYUdsekxuSmxjMkZ0Y0d4cGJtZFdZWElnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCeVlXNWtiMjFTWlhOaGJYQnNhVzVuSUQwZ0tFMWhkR2d1Y21GdVpHOXRLQ2tnTFNBd0xqVXBJQ29nTWk0d0lDb2dkR2hwY3k1eVpYTmhiWEJzYVc1blZtRnlPMXh1SUNBZ0lDQWdJQ0J5WlhOaGJYQnNhVzVuVW1GMFpTQTlJRTFoZEdndWNHOTNLREl1TUN3Z0tIUm9hWE11Y21WellXMXdiR2x1WnlBcklISmhibVJ2YlZKbGMyRnRjR3hwYm1jcElDOGdNVEl3TUM0d0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdaM0poYVc1UVpYSnBiMlFnS3owZ2RHaHBjeTV3WlhKcGIyUlNaV3dnS2lCbmNtRnBia1IxY21GMGFXOXVPMXh1SUNBZ0lDQWdaM0poYVc1RWRYSmhkR2x2YmlBclBTQjBhR2x6TG1SMWNtRjBhVzl1VW1Wc0lDb2daM0poYVc1UVpYSnBiMlE3WEc1Y2JpQWdJQ0FnSUM4dklHZHlZV2x1SUhCbGNtbHZaQ0J5WVc1a2IyNGdkbUZ5YVdGMGFXOXVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXdaWEpwYjJSV1lYSWdQaUF3TGpBcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUdWeWFXOWtJQ3M5SURJdU1DQXFJQ2hOWVhSb0xuSmhibVJ2YlNncElDMGdNQzQxS1NBcUlIUm9hWE11Y0dWeWFXOWtWbUZ5SUNvZ1ozSmhhVzVRWlhKcGIyUTdYRzVjYmlBZ0lDQWdJQzh2SUdObGJuUmxjaUJuY21GcGJseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkyVnVkR1Z5WldRcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUc5emFYUnBiMjRnTFQwZ01DNDFJQ29nWjNKaGFXNUVkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdMeThnY21GdVpHOXRhWHBsSUdkeVlXbHVJSEJ2YzJsMGFXOXVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXdiM05wZEdsdmJsWmhjaUErSURBcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUc5emFYUnBiMjRnS3owZ0tESXVNQ0FxSUUxaGRHZ3VjbUZ1Wkc5dEtDa2dMU0F4S1NBcUlIUm9hWE11Y0c5emFYUnBiMjVXWVhJN1hHNWNiaUFnSUNBZ0lIWmhjaUJpZFdabVpYSkVkWEpoZEdsdmJpQTlJSFJvYVhNdVluVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUM4dklIZHlZWEFnYjNJZ1kyeHBjQ0JuY21GcGJpQndiM05wZEdsdmJpQmhibVFnWkhWeVlYUnBiMjRnYVc1MGJ5QmlkV1ptWlhJZ1pIVnlZWFJwYjI1Y2JpQWdJQ0FnSUdsbUlDaG5jbUZwYmxCdmMybDBhVzl1SUR3Z01DQjhmQ0JuY21GcGJsQnZjMmwwYVc5dUlENDlJR0oxWm1abGNrUjFjbUYwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU41WTJ4cFl5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhaaGNpQmplV05zWlhNZ1BTQm5jbUZwYmxCdmMybDBhVzl1SUM4Z1luVm1abVZ5UkhWeVlYUnBiMjQ3WEc0Z0lDQWdJQ0FnSUNBZ1ozSmhhVzVRYjNOcGRHbHZiaUE5SUNoamVXTnNaWE1nTFNCTllYUm9MbVpzYjI5eUtHTjVZMnhsY3lrcElDb2dZblZtWm1WeVJIVnlZWFJwYjI0N1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1ozSmhhVzVRYjNOcGRHbHZiaUFySUdkeVlXbHVSSFZ5WVhScGIyNGdQaUIwYUdsekxtSjFabVpsY2k1a2RYSmhkR2x2YmlsY2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVJIVnlZWFJwYjI0Z1BTQjBhR2x6TG1KMVptWmxjaTVrZFhKaGRHbHZiaUF0SUdkeVlXbHVVRzl6YVhScGIyNDdYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHZHlZV2x1VUc5emFYUnBiMjRnUENBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCbmNtRnBibFJwYldVZ0xUMGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVJIVnlZWFJwYjI0Z0t6MGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVVHOXphWFJwYjI0Z1BTQXdPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNobmNtRnBibEJ2YzJsMGFXOXVJQ3NnWjNKaGFXNUVkWEpoZEdsdmJpQStJR0oxWm1abGNrUjFjbUYwYVc5dUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnWjNKaGFXNUVkWEpoZEdsdmJpQTlJR0oxWm1abGNrUjFjbUYwYVc5dUlDMGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJ0WVd0bElHZHlZV2x1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWVdsdUlENGdNQ0FtSmlCbmNtRnBia1IxY21GMGFXOXVJRDQ5SURBdU1EQXhLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHMWhhMlVnWjNKaGFXNGdaVzUyWld4dmNHVmNiaUFnSUNBZ0lDQWdkbUZ5SUdWdWRtVnNiM0JsVG05a1pTQTlJR0YxWkdsdlEyOXVkR1Y0ZEM1amNtVmhkR1ZIWVdsdUtDazdYRzRnSUNBZ0lDQWdJSFpoY2lCaGRIUmhZMnNnUFNCMGFHbHpMbUYwZEdGamEwRmljeUFySUhSb2FYTXVZWFIwWVdOclVtVnNJQ29nWjNKaGFXNUVkWEpoZEdsdmJqdGNiaUFnSUNBZ0lDQWdkbUZ5SUhKbGJHVmhjMlVnUFNCMGFHbHpMbkpsYkdWaGMyVkJZbk1nS3lCMGFHbHpMbkpsYkdWaGMyVlNaV3dnS2lCbmNtRnBia1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaGhkSFJoWTJzZ0t5QnlaV3hsWVhObElENGdaM0poYVc1RWRYSmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFpoY2lCbVlXTjBiM0lnUFNCbmNtRnBia1IxY21GMGFXOXVJQzhnS0dGMGRHRmpheUFySUhKbGJHVmhjMlVwTzF4dUlDQWdJQ0FnSUNBZ0lHRjBkR0ZqYXlBcVBTQm1ZV04wYjNJN1hHNGdJQ0FnSUNBZ0lDQWdjbVZzWldGelpTQXFQU0JtWVdOMGIzSTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMllYSWdZWFIwWVdOclJXNWtWR2x0WlNBOUlHZHlZV2x1VkdsdFpTQXJJR0YwZEdGamF6dGNiaUFnSUNBZ0lDQWdkbUZ5SUdkeVlXbHVSVzVrVkdsdFpTQTlJR2R5WVdsdVZHbHRaU0FySUdkeVlXbHVSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQWdJSFpoY2lCeVpXeGxZWE5sVTNSaGNuUlVhVzFsSUQwZ1ozSmhhVzVGYm1SVWFXMWxJQzBnY21Wc1pXRnpaVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1aGRIUmhZMnRUYUdGd1pTQTlQVDBnSjJ4cGJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2d3TGpBc0lHZHlZV2x1VkdsdFpTazdYRzRnSUNBZ0lDQWdJQ0FnWlc1MlpXeHZjR1ZPYjJSbExtZGhhVzR1YkdsdVpXRnlVbUZ0Y0ZSdlZtRnNkV1ZCZEZScGJXVW9NUzR3TENCaGRIUmhZMnRGYm1SVWFXMWxLVHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2gwYUdsekxtVjRjRkpoYlhCUFptWnpaWFFzSUdkeVlXbHVWR2x0WlNrN1hHNGdJQ0FnSUNBZ0lDQWdaVzUyWld4dmNHVk9iMlJsTG1kaGFXNHVaWGh3YjI1bGJuUnBZV3hTWVcxd1ZHOVdZV3gxWlVGMFZHbHRaU2d4TGpBc0lHRjBkR0ZqYTBWdVpGUnBiV1VwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hKbGJHVmhjMlZUZEdGeWRGUnBiV1VnUGlCaGRIUmhZMnRGYm1SVWFXMWxLVnh1SUNBZ0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNW5ZV2x1TG5ObGRGWmhiSFZsUVhSVWFXMWxLREV1TUN3Z2NtVnNaV0Z6WlZOMFlYSjBWR2x0WlNrN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVjbVZzWldGelpWTm9ZWEJsSUQwOVBTQW5iR2x1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1Z1ZG1Wc2IzQmxUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXVNQ3dnWjNKaGFXNUZibVJVYVcxbEtUdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0JsYm5abGJHOXdaVTV2WkdVdVoyRnBiaTVsZUhCdmJtVnVkR2xoYkZKaGJYQlViMVpoYkhWbFFYUlVhVzFsS0hSb2FYTXVaWGh3VW1GdGNFOW1abk5sZEN3Z1ozSmhhVzVGYm1SVWFXMWxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHVnVkbVZzYjNCbFRtOWtaUzVqYjI1dVpXTjBLRzkxZEhCMWRFNXZaR1VwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRzFoYTJVZ2MyOTFjbU5sWEc0Z0lDQWdJQ0FnSUhaaGNpQnpiM1Z5WTJVZ1BTQmhkV1JwYjBOdmJuUmxlSFF1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sS0NrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExtSjFabVpsY2lBOUlIUm9hWE11WW5WbVptVnlPMXh1SUNBZ0lDQWdJQ0J6YjNWeVkyVXVjR3hoZVdKaFkydFNZWFJsTG5aaGJIVmxJRDBnY21WellXMXdiR2x1WjFKaGRHVTdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNWpiMjV1WldOMEtHVnVkbVZzYjNCbFRtOWtaU2s3WEc1Y2JpQWdJQ0FnSUNBZ2MyOTFjbU5sTG5OMFlYSjBLR2R5WVdsdVZHbHRaU3dnWjNKaGFXNVFiM05wZEdsdmJpazdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNXpkRzl3S0dkeVlXbHVWR2x0WlNBcklHZHlZV2x1UkhWeVlYUnBiMjRnTHlCeVpYTmhiWEJzYVc1blVtRjBaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlHZHlZV2x1VUdWeWFXOWtPMXh1SUNCOVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUjNKaGJuVnNZWEpGYm1kcGJtVTdJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFRpbWVFbmdpbmUgPSByZXF1aXJlKFwiLi4vY29yZS90aW1lLWVuZ2luZVwiKTtcblxudmFyIE1ldHJvbm9tZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgZnVuY3Rpb24gTWV0cm9ub21lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNZXRyb25vbWUpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoTWV0cm9ub21lLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgLyoqXG4gICAgICogTWV0cm9ub21lIHBlcmlvZCBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gb3B0aW9ucy5wZXJpb2QgfHwgMTtcblxuICAgIC8qKlxuICAgICAqIE1ldHJvbm9tZSBjbGljayBmcmVxdWVuY3lcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2xpY2tGcmVxID0gb3B0aW9ucy5jbGlja0ZyZXEgfHwgNjAwO1xuXG4gICAgLyoqXG4gICAgICogTWV0cm9ub21lIGNsaWNrIGF0dGFjayB0aW1lXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWNrQXR0YWNrID0gb3B0aW9ucy5jbGlja0F0dGFjayB8fCAwLjAwMjtcblxuICAgIC8qKlxuICAgICAqIE1ldHJvbm9tZSBjbGljayByZWxlYXNlIHRpbWVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2xpY2tSZWxlYXNlID0gb3B0aW9ucy5jbGlja1JlbGVhc2UgfHwgMC4wOTg7XG5cbiAgICB0aGlzLl9fcGhhc2UgPSAwO1xuXG4gICAgdGhpcy5fX2dhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluIHx8IDE7XG5cbiAgICB0aGlzLm91dHB1dE5vZGUgPSB0aGlzLl9fZ2Fpbk5vZGU7XG4gIH1cblxuICBfaW5oZXJpdHMoTWV0cm9ub21lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKE1ldHJvbm9tZSwge1xuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzY2hlZHVsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVRpbWUodGltZSkge1xuICAgICAgICB0aGlzLnRyaWdnZXIodGltZSk7XG4gICAgICAgIHJldHVybiB0aW1lICsgdGhpcy5wZXJpb2Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHRyYW5zcG9ydGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IChNYXRoLmZsb29yKHBvc2l0aW9uIC8gdGhpcy5wZXJpb2QpICsgdGhpcy5fX3BoYXNlKSAqIHRoaXMucGVyaW9kO1xuXG4gICAgICAgIGlmIChzcGVlZCA+IDAgJiYgbmV4dFBvc2l0aW9uIDwgcG9zaXRpb24pIG5leHRQb3NpdGlvbiArPSB0aGlzLnBlcmlvZDtlbHNlIGlmIChzcGVlZCA8IDAgJiYgbmV4dFBvc2l0aW9uID4gcG9zaXRpb24pIG5leHRQb3NpdGlvbiAtPSB0aGlzLnBlcmlvZDtcblxuICAgICAgICByZXR1cm4gbmV4dFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWR2YW5jZVBvc2l0aW9uOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcih0aW1lKTtcblxuICAgICAgICBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvc2l0aW9uIC0gdGhpcy5wZXJpb2Q7XG4gICAgICAgIH1yZXR1cm4gcG9zaXRpb24gKyB0aGlzLnBlcmlvZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIG1ldHJvbm9tZSBjbGlja1xuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgbWV0cm9ub21lIGNsaWNrIHN5bnRoZXNpcyBhdWRpbyB0aW1lXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIodGltZSkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBjbGlja0F0dGFjayA9IHRoaXMuY2xpY2tBdHRhY2s7XG4gICAgICAgIHZhciBjbGlja1JlbGVhc2UgPSB0aGlzLmNsaWNrUmVsZWFzZTtcbiAgICAgICAgdmFyIHBlcmlvZCA9IHRoaXMucGVyaW9kO1xuXG4gICAgICAgIGlmIChwZXJpb2QgPCBjbGlja0F0dGFjayArIGNsaWNrUmVsZWFzZSkge1xuICAgICAgICAgIHZhciBzY2FsZSA9IHBlcmlvZCAvIChjbGlja0F0dGFjayArIGNsaWNrUmVsZWFzZSk7XG4gICAgICAgICAgY2xpY2tBdHRhY2sgKj0gc2NhbGU7XG4gICAgICAgICAgY2xpY2tSZWxlYXNlICo9IHNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX2Vudk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLl9fZW52Tm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCB0aW1lICsgY2xpY2tBdHRhY2spO1xuICAgICAgICB0aGlzLl9fZW52Tm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMWUtNywgdGltZSArIGNsaWNrQXR0YWNrICsgY2xpY2tSZWxlYXNlKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgIHRoaXMuX19vc2MgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgICB0aGlzLl9fb3NjLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuY2xpY2tGcmVxO1xuICAgICAgICB0aGlzLl9fb3NjLnN0YXJ0KDApO1xuICAgICAgICB0aGlzLl9fb3NjLnN0b3AodGltZSArIGNsaWNrQXR0YWNrICsgY2xpY2tSZWxlYXNlKTtcbiAgICAgICAgdGhpcy5fX29zYy5jb25uZWN0KHRoaXMuX19lbnZOb2RlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdhaW46IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgZ2FpblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIGxpbmVhciBnYWluIGZhY3RvclxuICAgICAgICovXG5cbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gdmFsdWU7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBnYWluXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgZ2FpblxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGhhc2U6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgcGhhc2UgcGFyYW1ldGVyXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gcGhhc2UgbWV0cm9ub21lIHBoYXNlICgwLi4uMSlcbiAgICAgICAqL1xuXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChwaGFzZSkge1xuICAgICAgICB0aGlzLl9fcGhhc2UgPSBwaGFzZSAtIE1hdGguZmxvb3IocGhhc2UpO1xuICAgICAgICB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uKCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBwaGFzZSBwYXJhbWV0ZXJcbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gdmFsdWUgb2YgcGhhc2UgcGFyYW1ldGVyXG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3BoYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIE1ldHJvbm9tZTtcbn0pKFRpbWVFbmdpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldHJvbm9tZTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBtZXRyb25vbWUgZW5naW5lXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZQUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenM3U1VGRk1VTXNVMEZCVXp0QlFVTkdMRmRCUkZBc1UwRkJVeXhEUVVORUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FVUnNReXhUUVVGVE96dEJRVVZZTEhGRFFVWkZMRk5CUVZNc05rTkJSVXdzV1VGQldTeEZRVUZGT3pzN096czdRVUZOY0VJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUV3hETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1MwRkJTeXhEUVVGRE96czdPenM3UVVGTmFFUXNVVUZCU1N4RFFVRkRMRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zV1VGQldTeEpRVUZKTEV0QlFVc3NRMEZCUXpzN1FVRkZiRVFzVVVGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSV3BDTEZGQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTnFSQ3hSUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEVOQlFVTTdPMEZCUlM5RExGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJRenRIUVVOdVF6czdXVUZzUTBjc1UwRkJVenM3WlVGQlZDeFRRVUZUTzBGQmNVTmlMR1ZCUVZjN096czdZVUZCUVN4eFFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRGFFSXNXVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU51UWl4bFFVRlBMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETzA5QlF6TkNPenRCUVVkRUxHZENRVUZaT3pzN08yRkJRVUVzYzBKQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRGJFTXNXVUZCU1N4WlFVRlpMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJYSkdMRmxCUVVrc1MwRkJTeXhIUVVGSExFTkJRVU1zU1VGQlNTeFpRVUZaTEVkQlFVY3NVVUZCVVN4RlFVTjBReXhaUVVGWkxFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVTjZRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NXVUZCV1N4SFFVRkhMRkZCUVZFc1JVRkRNME1zV1VGQldTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN08wRkJSVGxDTEdWQlFVOHNXVUZCV1N4RFFVRkRPMDlCUTNKQ096dEJRVWRFTEcxQ1FVRmxPenM3TzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN1FVRkZia0lzV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXp0QlFVTllMR2xDUVVGUExGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMU5CUVVFc1FVRkZhRU1zVDBGQlR5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRQUVVNdlFqczdRVUZOUkN4WFFVRlBPenM3T3pzN08yRkJRVUVzYVVKQlFVTXNTVUZCU1N4RlFVRkZPMEZCUTFvc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTnlReXhaUVVGSkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMEZCUTI1RExGbEJRVWtzV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRja01zV1VGQlNTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenM3UVVGRmVrSXNXVUZCU1N4TlFVRk5MRWRCUVVrc1YwRkJWeXhIUVVGSExGbEJRVmtzUVVGQlF5eEZRVUZGTzBGQlEzcERMR05CUVVrc1MwRkJTeXhIUVVGSExFMUJRVTBzU1VGQlNTeFhRVUZYTEVkQlFVY3NXVUZCV1N4RFFVRkJMRUZCUVVNc1EwRkJRenRCUVVOc1JDeHhRa0ZCVnl4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVOeVFpeHpRa0ZCV1N4SlFVRkpMRXRCUVVzc1EwRkJRenRUUVVOMlFqczdRVUZGUkN4WlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExGbEJRVmtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTXpReXhaUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJSeXhEUVVGRE8wRkJRMmhETEZsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zV1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUnl4RlFVRkZMRWxCUVVrc1IwRkJSeXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU55UlN4WlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhKUVVGVExFVkJRVVVzU1VGQlNTeEhRVUZITEZkQlFWY3NSMEZCUnl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNdlJpeFpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpWRExGbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGZUVNc1dVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFpRVUZaTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzUTBGQlF6dEJRVU0zUXl4WlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNMVF5eFpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU53UWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NWMEZCVnl4SFFVRkhMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMjVFTEZsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UFFVTndRenM3UVVGalJ5eFJRVUZKT3pzN096czdPMWRCVWtFc1ZVRkJReXhMUVVGTExFVkJRVVU3UVVGRFpDeFpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzA5QlEzQkRPenM3T3pzN1YwRk5UeXhaUVVGSE8wRkJRMVFzWlVGQlR5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03VDBGRGJrTTdPMEZCWlVjc1UwRkJTenM3T3pzN096dFhRVlJCTEZWQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTJZc1dVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU42UXl4WlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVWQlFVVXNRMEZCUXp0UFFVTXhRanM3T3pzN08xZEJUVkVzV1VGQlJ6dEJRVU5XTEdWQlFVOHNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJRenRQUVVOeVFqczdPenRUUVRsSVJ5eFRRVUZUTzBkQlFWTXNWVUZCVlRzN1FVRnBTV3hETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRElpd2labWxzWlNJNkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxSUhkeWFYUjBaVzRnYVc0Z1JVTk5RWE5qY21sd2RDQTJJQ292WEc0dktpcGNiaUFxSUVCbWFXeGxiM1psY25acFpYY2dWMEZXUlNCaGRXUnBieUJ0WlhSeWIyNXZiV1VnWlc1bmFXNWxYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblF1VTJOb2JtVnNiRUJwY21OaGJTNW1jaXdnVm1samRHOXlMbE5oYVhwQWFYSmpZVzB1Wm5Jc0lFdGhjbWx0TGtKaGNtdGhkR2xBYVhKallXMHVabkpjYmlBcUwxeHVYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiblpoY2lCVWFXMWxSVzVuYVc1bElEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXZkR2x0WlMxbGJtZHBibVZjSWlrN1hHNWNibU5zWVhOeklFMWxkSEp2Ym05dFpTQmxlSFJsYm1SeklGUnBiV1ZGYm1kcGJtVWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaGhkV1JwYjBOdmJuUmxlSFFzSUc5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lITjFjR1Z5S0dGMVpHbHZRMjl1ZEdWNGRDazdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJOWlhSeWIyNXZiV1VnY0dWeWFXOWtJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d1pYSnBiMlFnUFNCdmNIUnBiMjV6TG5CbGNtbHZaQ0I4ZkNBeE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dUV1YwY205dWIyMWxJR05zYVdOcklHWnlaWEYxWlc1amVWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amJHbGphMFp5WlhFZ1BTQnZjSFJwYjI1ekxtTnNhV05yUm5KbGNTQjhmQ0EyTURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQk5aWFJ5YjI1dmJXVWdZMnhwWTJzZ1lYUjBZV05ySUhScGJXVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVkyeHBZMnRCZEhSaFkyc2dQU0J2Y0hScGIyNXpMbU5zYVdOclFYUjBZV05ySUh4OElEQXVNREF5TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1RXVjBjbTl1YjIxbElHTnNhV05ySUhKbGJHVmhjMlVnZEdsdFpWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amJHbGphMUpsYkdWaGMyVWdQU0J2Y0hScGIyNXpMbU5zYVdOclVtVnNaV0Z6WlNCOGZDQXdMakE1T0R0Y2JseHVJQ0FnSUhSb2FYTXVYMTl3YUdGelpTQTlJREE3WEc1Y2JpQWdJQ0IwYUdsekxsOWZaMkZwYms1dlpHVWdQU0IwYUdsekxtRjFaR2x2UTI5dWRHVjRkQzVqY21WaGRHVkhZV2x1S0NrN1hHNGdJQ0FnZEdocGN5NWZYMmRoYVc1T2IyUmxMbWRoYVc0dWRtRnNkV1VnUFNCdmNIUnBiMjV6TG1kaGFXNGdmSHdnTVR0Y2JseHVJQ0FnSUhSb2FYTXViM1YwY0hWMFRtOWtaU0E5SUhSb2FYTXVYMTluWVdsdVRtOWtaVHRjYmlBZ2ZWeHVYRzRnSUM4dklGUnBiV1ZGYm1kcGJtVWdiV1YwYUc5a0lDaHpZMmhsWkhWc1pXUWdhVzUwWlhKbVlXTmxLVnh1SUNCaFpIWmhibU5sVkdsdFpTaDBhVzFsS1NCN1hHNGdJQ0FnZEdocGN5NTBjbWxuWjJWeUtIUnBiV1VwTzF4dUlDQWdJSEpsZEhWeWJpQjBhVzFsSUNzZ2RHaHBjeTV3WlhKcGIyUTdYRzRnSUgxY2JseHVJQ0F2THlCVWFXMWxSVzVuYVc1bElHMWxkR2h2WkNBb2RISmhibk53YjNKMFpXUWdhVzUwWlhKbVlXTmxLVnh1SUNCemVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHNWxlSFJRYjNOcGRHbHZiaUE5SUNoTllYUm9MbVpzYjI5eUtIQnZjMmwwYVc5dUlDOGdkR2hwY3k1d1pYSnBiMlFwSUNzZ2RHaHBjeTVmWDNCb1lYTmxLU0FxSUhSb2FYTXVjR1Z5YVc5a08xeHVYRzRnSUNBZ2FXWWdLSE53WldWa0lENGdNQ0FtSmlCdVpYaDBVRzl6YVhScGIyNGdQQ0J3YjNOcGRHbHZiaWxjYmlBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBclBTQjBhR2x6TG5CbGNtbHZaRHRjYmlBZ0lDQmxiSE5sSUdsbUlDaHpjR1ZsWkNBOElEQWdKaVlnYm1WNGRGQnZjMmwwYVc5dUlENGdjRzl6YVhScGIyNHBYRzRnSUNBZ0lDQnVaWGgwVUc5emFYUnBiMjRnTFQwZ2RHaHBjeTV3WlhKcGIyUTdYRzVjYmlBZ0lDQnlaWFIxY200Z2JtVjRkRkJ2YzJsMGFXOXVPMXh1SUNCOVhHNWNiaUFnTHk4Z1ZHbHRaVVZ1WjJsdVpTQnRaWFJvYjJRZ0tIUnlZVzV6Y0c5eWRHVmtJR2x1ZEdWeVptRmpaU2xjYmlBZ1lXUjJZVzVqWlZCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lIUm9hWE11ZEhKcFoyZGxjaWgwYVcxbEtUdGNibHh1SUNBZ0lHbG1JQ2h6Y0dWbFpDQThJREFwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdjRzl6YVhScGIyNGdMU0IwYUdsekxuQmxjbWx2WkR0Y2JseHVJQ0FnSUhKbGRIVnliaUJ3YjNOcGRHbHZiaUFySUhSb2FYTXVjR1Z5YVc5a08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJ5YVdkblpYSWdiV1YwY205dWIyMWxJR05zYVdOclhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0IwYVcxbElHMWxkSEp2Ym05dFpTQmpiR2xqYXlCemVXNTBhR1Z6YVhNZ1lYVmthVzhnZEdsdFpWeHVJQ0FnS2k5Y2JpQWdkSEpwWjJkbGNpaDBhVzFsS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dUlDQWdJSFpoY2lCamJHbGphMEYwZEdGamF5QTlJSFJvYVhNdVkyeHBZMnRCZEhSaFkyczdYRzRnSUNBZ2RtRnlJR05zYVdOclVtVnNaV0Z6WlNBOUlIUm9hWE11WTJ4cFkydFNaV3hsWVhObE8xeHVJQ0FnSUhaaGNpQndaWEpwYjJRZ1BTQjBhR2x6TG5CbGNtbHZaRHRjYmx4dUlDQWdJR2xtSUNod1pYSnBiMlFnUENBb1kyeHBZMnRCZEhSaFkyc2dLeUJqYkdsamExSmxiR1ZoYzJVcEtTQjdYRzRnSUNBZ0lDQjJZWElnYzJOaGJHVWdQU0J3WlhKcGIyUWdMeUFvWTJ4cFkydEJkSFJoWTJzZ0t5QmpiR2xqYTFKbGJHVmhjMlVwTzF4dUlDQWdJQ0FnWTJ4cFkydEJkSFJoWTJzZ0tqMGdjMk5oYkdVN1hHNGdJQ0FnSUNCamJHbGphMUpsYkdWaGMyVWdLajBnYzJOaGJHVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVmWDJWdWRrNXZaR1VnUFNCaGRXUnBiME52Ym5SbGVIUXVZM0psWVhSbFIyRnBiaWdwTzF4dUlDQWdJSFJvYVhNdVgxOWxiblpPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0F3TGpBN1hHNGdJQ0FnZEdocGN5NWZYMlZ1ZGs1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2d3TENCMGFXMWxLVHRjYmlBZ0lDQjBhR2x6TGw5ZlpXNTJUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtERXVNQ3dnZEdsdFpTQXJJR05zYVdOclFYUjBZV05yS1R0Y2JpQWdJQ0IwYUdsekxsOWZaVzUyVG05a1pTNW5ZV2x1TG1WNGNHOXVaVzUwYVdGc1VtRnRjRlJ2Vm1Gc2RXVkJkRlJwYldVb01DNHdNREF3TURBeExDQjBhVzFsSUNzZ1kyeHBZMnRCZEhSaFkyc2dLeUJqYkdsamExSmxiR1ZoYzJVcE8xeHVJQ0FnSUhSb2FYTXVYMTlsYm5aT2IyUmxMbWRoYVc0dWMyVjBWbUZzZFdWQmRGUnBiV1VvTUN3Z2RHbHRaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVkyOXVibVZqZENoMGFHbHpMbDlmWjJGcGJrNXZaR1VwTzF4dVhHNGdJQ0FnZEdocGN5NWZYMjl6WXlBOUlHRjFaR2x2UTI5dWRHVjRkQzVqY21WaGRHVlBjMk5wYkd4aGRHOXlLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyOXpZeTVtY21WeGRXVnVZM2t1ZG1Gc2RXVWdQU0IwYUdsekxtTnNhV05yUm5KbGNUdGNiaUFnSUNCMGFHbHpMbDlmYjNOakxuTjBZWEowS0RBcE8xeHVJQ0FnSUhSb2FYTXVYMTl2YzJNdWMzUnZjQ2gwYVcxbElDc2dZMnhwWTJ0QmRIUmhZMnNnS3lCamJHbGphMUpsYkdWaGMyVXBPMXh1SUNBZ0lIUm9hWE11WDE5dmMyTXVZMjl1Ym1WamRDaDBhR2x6TGw5ZlpXNTJUbTlrWlNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVMlYwSUdkaGFXNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUhaaGJIVmxJR3hwYm1WaGNpQm5ZV2x1SUdaaFkzUnZjbHh1SUNBZ0tpOWNiaUFnYzJWMElHZGhhVzRvZG1Gc2RXVXBJSHRjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVdVoyRnBiaTUyWVd4MVpTQTlJSFpoYkhWbE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCbllXbHVYRzRnSUNBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ1kzVnljbVZ1ZENCbllXbHVYRzRnSUNBcUwxeHVJQ0JuWlhRZ1oyRnBiaWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElIQm9ZWE5sSUhCaGNtRnRaWFJsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdjR2hoYzJVZ2JXVjBjbTl1YjIxbElIQm9ZWE5sSUNnd0xpNHVNU2xjYmlBZ0lDb3ZYRzRnSUhObGRDQndhR0Z6WlNod2FHRnpaU2tnZTF4dUlDQWdJSFJvYVhNdVgxOXdhR0Z6WlNBOUlIQm9ZWE5sSUMwZ1RXRjBhQzVtYkc5dmNpaHdhR0Z6WlNrN1hHNGdJQ0FnZEdocGN5NXlaWE5sZEU1bGVIUlFiM05wZEdsdmJpZ3BPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRDQndhR0Z6WlNCd1lYSmhiV1YwWlhKY2JpQWdJQ29nUUhKbGRIVnliaUI3VG5WdFltVnlmU0IyWVd4MVpTQnZaaUJ3YUdGelpTQndZWEpoYldWMFpYSmNiaUFnSUNvdlhHNGdJR2RsZENCd2FHRnpaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgzQm9ZWE5sTzF4dUlDQjlYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RXVjBjbTl1YjIxbE95SmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFRpbWVFbmdpbmUgPSByZXF1aXJlKFwiLi4vY29yZS90aW1lLWVuZ2luZVwiKTtcblxudmFyIFBsYXllckVuZ2luZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgZnVuY3Rpb24gUGxheWVyRW5naW5lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbGF5ZXJFbmdpbmUpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheWVyRW5naW5lLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgdGhpcy50cmFuc3BvcnQgPSBudWxsOyAvLyBzZXQgd2hlbiBhZGRlZCB0byB0cmFuc3BvcnRlclxuXG4gICAgLyoqXG4gICAgICogQXVkaW8gYnVmZmVyXG4gICAgICogQHR5cGUge0F1ZGlvQnVmZmVyfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVyID0gb3B0aW9ucy5idWZmZXIgfHwgbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEZhZGUgdGltZSBmb3IgY2hhaW5pbmcgc2VnbWVudHMgKGUuZy4gaW4gc3RhcnQsIHN0b3AsIGFuZCBzZWVrKVxuICAgICAqIEB0eXBlIHtBdWRpb0J1ZmZlcn1cbiAgICAgKi9cbiAgICB0aGlzLmZhZGVUaW1lID0gMC4wMDU7XG5cbiAgICB0aGlzLl9fdGltZSA9IDA7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gMDtcbiAgICB0aGlzLl9fc3BlZWQgPSAwO1xuICAgIHRoaXMuX19jeWNsaWMgPSBmYWxzZTtcblxuICAgIHRoaXMuX19idWZmZXJTb3VyY2UgPSBudWxsO1xuICAgIHRoaXMuX19lbnZOb2RlID0gbnVsbDtcblxuICAgIHRoaXMuX19wbGF5aW5nU3BlZWQgPSAxO1xuXG4gICAgdGhpcy5fX2dhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluIHx8IDE7XG5cbiAgICB0aGlzLm91dHB1dE5vZGUgPSB0aGlzLl9fZ2Fpbk5vZGU7XG4gIH1cblxuICBfaW5oZXJpdHMoUGxheWVyRW5naW5lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKFBsYXllckVuZ2luZSwge1xuICAgIF9fc3RhcnQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3N0YXJ0KHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXIuZHVyYXRpb247XG5cbiAgICAgICAgICBpZiAodGhpcy5idWZmZXIud3JhcEFyb3VuZEV4dGVuc2lvbikgYnVmZmVyRHVyYXRpb24gLT0gdGhpcy5idWZmZXIud3JhcEFyb3VuZEV4dGVuc2lvbjtcblxuICAgICAgICAgIGlmICh0aGlzLl9fY3ljbGljICYmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gYnVmZmVyRHVyYXRpb24pKSB7XG4gICAgICAgICAgICB2YXIgcGhhc2UgPSBwb3NpdGlvbiAvIGJ1ZmZlckR1cmF0aW9uO1xuICAgICAgICAgICAgcG9zaXRpb24gPSAocGhhc2UgLSBNYXRoLmZsb29yKHBoYXNlKSkgKiBidWZmZXJEdXJhdGlvbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocG9zaXRpb24gPj0gMCAmJiBwb3NpdGlvbiA8IGJ1ZmZlckR1cmF0aW9uICYmIHNwZWVkID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgdGltZSArIHRoaXMuZmFkZVRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlID0gc3BlZWQ7XG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlLmxvb3AgPSB0aGlzLl9fY3ljbGljO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5sb29wU3RhcnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5sb29wRW5kID0gYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlLnN0YXJ0KHRpbWUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UuY29ubmVjdCh0aGlzLl9fZW52Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2hhbHQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2hhbHQodGltZSkge1xuICAgICAgICBpZiAodGhpcy5fX2J1ZmZlclNvdXJjZSkge1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRpbWUpO1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUodGhpcy5fX2Vudk5vZGUuZ2Fpbi52YWx1ZSwgdGltZSk7XG4gICAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0aW1lICsgdGhpcy5mYWRlVGltZSk7XG4gICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5zdG9wKHRpbWUgKyB0aGlzLmZhZGVUaW1lKTtcblxuICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzcGVlZC1jb250cm9sbGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIHNlZWsgPSBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzNdO1xuXG4gICAgICAgIHZhciBsYXN0U3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICAgICAgaWYgKHNwZWVkICE9PSBsYXN0U3BlZWQgfHwgc2Vlaykge1xuICAgICAgICAgIGlmIChzZWVrIHx8IGxhc3RTcGVlZCAqIHNwZWVkIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5fX2hhbHQodGltZSk7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RTcGVlZCA9PT0gMCB8fCBzZWVrKSB7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9faGFsdCh0aW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX19idWZmZXJTb3VyY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLnNldFZhbHVlQXRUaW1lKHNwZWVkLCB0aW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9fc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY3ljbGljOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IHdoZXRoZXIgdGhlIGF1ZGlvIGJ1ZmZlciBpcyBjb25zaWRlcmVkIGFzIGN5Y2xpY1xuICAgICAgICogQHBhcmFtIHtCb29sfSBjeWNsaWMgd2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGlzIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICAgKi9cblxuICAgICAgc2V0OiBmdW5jdGlvbiAoY3ljbGljKSB7XG4gICAgICAgIGlmIChjeWNsaWMgIT09IHRoaXMuX19jeWNsaWMpIHtcbiAgICAgICAgICB2YXIgdGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5jdXJyZW50b3NpdGlvbjtcblxuICAgICAgICAgIHRoaXMuX19oYWx0KHRpbWUpO1xuICAgICAgICAgIHRoaXMuX19jeWNsaWMgPSBjeWNsaWM7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX3NwZWVkICE9PSAwKSB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHRoaXMuX19zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHdoZXRoZXIgdGhlIGF1ZGlvIGJ1ZmZlciBpcyBjb25zaWRlcmVkIGFzIGN5Y2xpY1xuICAgICAgICogQHJldHVybiB7Qm9vbH0gd2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGlzIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2N5Y2xpYztcbiAgICAgIH1cbiAgICB9LFxuICAgIGdhaW46IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgZ2FpblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIGxpbmVhciBnYWluIGZhY3RvclxuICAgICAgICovXG5cbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcblxuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRpbWUpO1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuc2V0VmFsdWVBdFRpbWUodGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUsIHRpbWUpO1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdGltZSArIHRoaXMuZmFkZVRpbWUpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgZ2FpblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IGdhaW5cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBQbGF5ZXJFbmdpbmU7XG59KShUaW1lRW5naW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJFbmdpbmU7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gcGxheWVyIGVuZ2luZVxuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGUFFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1NVRkZNVU1zV1VGQldUdEJRVU5NTEZkQlJGQXNXVUZCV1N4RFFVTktMRmxCUVZrc1JVRkJaMEk3VVVGQlpDeFBRVUZQTEdkRFFVRkhMRVZCUVVVN096QkNRVVJzUXl4WlFVRlpPenRCUVVWa0xIRkRRVVpGTEZsQlFWa3NOa05CUlZJc1dVRkJXU3hGUVVGRk96dEJRVVZ3UWl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6czdPenM3TzBGQlRYUkNMRkZCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNTVUZCU1N4SlFVRkpMRU5CUVVNN096czdPenRCUVUxeVF5eFJRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJRenM3UVVGRmRFSXNVVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFFSXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGNFSXNVVUZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU03TzBGQlJYUkNMRkZCUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6TkNMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVjBRaXhSUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZlRUlzVVVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlEycEVMRkZCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdRVUZGTDBNc1VVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRPMGRCUTI1RE96dFpRV2hEUnl4WlFVRlpPenRsUVVGYUxGbEJRVms3UVVGclEyaENMRmRCUVU4N1lVRkJRU3hwUWtGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVNM1FpeFpRVUZKTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRE96dEJRVVZ5UXl4WlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRFppeGpRVUZKTEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF6czdRVUZGTVVNc1kwRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEcxQ1FVRnRRaXhGUVVOcVF5eGpRVUZqTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXh0UWtGQmJVSXNRMEZCUXpzN1FVRkZjRVFzWTBGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4TFFVRkxMRkZCUVZFc1IwRkJSeXhEUVVGRExFbEJRVWtzVVVGQlVTeEpRVUZKTEdOQlFXTXNRMEZCUVN4QlFVRkRMRVZCUVVVN1FVRkRha1VzWjBKQlFVa3NTMEZCU3l4SFFVRkhMRkZCUVZFc1IwRkJSeXhqUVVGakxFTkJRVU03UVVGRGRFTXNiMEpCUVZFc1IwRkJSeXhEUVVGRExFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGQkxFZEJRVWtzWTBGQll5eERRVUZETzFkQlEzcEVPenRCUVVWRUxHTkJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNTVUZCU1N4UlFVRlJMRWRCUVVjc1kwRkJZeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZETTBRc1owSkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NXVUZCV1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRek5ETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRelZETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRExFVkJRVVVzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOeVJTeG5Ra0ZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenRCUVVWNFF5eG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhaUVVGWkxFTkJRVU1zYTBKQlFXdENMRVZCUVVVc1EwRkJRenRCUVVONFJDeG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjZReXhuUWtGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU12UXl4blFrRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEyeERMR2RDUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNSMEZCUnl4alFVRmpMRU5CUVVNN1FVRkROME1zWjBKQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhuUWtGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFkQlF6ZERPMU5CUTBZN1QwRkRSanM3UVVGRlJDeFZRVUZOTzJGQlFVRXNaMEpCUVVNc1NVRkJTU3hGUVVGRk8wRkJRMWdzV1VGQlNTeEpRVUZKTEVOQlFVTXNZMEZCWXl4RlFVRkZPMEZCUTNaQ0xHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJoRUxHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGNFVXNZMEZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRja1VzWTBGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZMME1zWTBGQlNTeERRVUZETEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRNMElzWTBGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1UwRkRka0k3VDBGRFJqczdRVUZIUkN4aFFVRlRPenM3TzJGQlFVRXNiVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFXZENPMWxCUVdRc1NVRkJTU3huUTBGQlJ5eExRVUZMT3p0QlFVTXpReXhaUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPenRCUVVVM1FpeFpRVUZKTEV0QlFVc3NTMEZCU3l4VFFVRlRMRWxCUVVrc1NVRkJTU3hGUVVGRk8wRkJReTlDTEdOQlFVa3NTVUZCU1N4SlFVRkpMRk5CUVZNc1IwRkJSeXhMUVVGTExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEycERMR2RDUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJ4Q0xHZENRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdWMEZEY2tNc1RVRkJUU3hKUVVGSkxGTkJRVk1zUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTJ4RExHZENRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdWMEZEY2tNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETEVWQlFVVTdRVUZEZEVJc1owSkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1YwRkRia0lzVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4alFVRmpMRVZCUVVVN1FVRkRPVUlzWjBKQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1dVRkJXU3hEUVVGRExHTkJRV01zUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1YwRkRPVVE3TzBGQlJVUXNZMEZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU03VTBGRGRFSTdUMEZEUmpzN1FVRjFRa2NzVlVGQlRUczdPenM3T3p0WFFXcENRU3hWUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5xUWl4WlFVRkpMRTFCUVUwc1MwRkJTeXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTzBGQlF6VkNMR05CUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTTdRVUZETlVJc1kwRkJTU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZia01zWTBGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOc1FpeGpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTFCUVUwc1EwRkJRenM3UVVGRmRrSXNZMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFTkJRVU1zUlVGRGNFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRUUVVNNVF6dFBRVU5HT3pzN096czdWMEZOVXl4WlFVRkhPMEZCUTFnc1pVRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzA5QlEzUkNPenRCUVd0Q1J5eFJRVUZKT3pzN096czdPMWRCV2tFc1ZVRkJReXhMUVVGTExFVkJRVVU3UVVGRFpDeFpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03TzBGQlJYcENMRmxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNXVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEycEZMRmxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1QwRkRiRVU3T3pzN096dFhRVTFQTEZsQlFVYzdRVUZEVkN4bFFVRlBMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0UFFVTnVRenM3T3p0VFFUZEpSeXhaUVVGWk8wZEJRVk1zVlVGQlZUczdRVUZuU25KRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NXVUZCV1N4RFFVRkRJaXdpWm1sc1pTSTZJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUlIZHlhWFIwWlc0Z2FXNGdSVU5OUVhOamNtbHdkQ0EySUNvdlhHNHZLaXBjYmlBcUlFQm1hV3hsYjNabGNuWnBaWGNnVjBGV1JTQmhkV1JwYnlCd2JHRjVaWElnWlc1bmFXNWxYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblF1VTJOb2JtVnNiRUJwY21OaGJTNW1jaXdnVm1samRHOXlMbE5oYVhwQWFYSmpZVzB1Wm5Jc0lFdGhjbWx0TGtKaGNtdGhkR2xBYVhKallXMHVabkpjYmlBcUwxeHVYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiblpoY2lCVWFXMWxSVzVuYVc1bElEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXZkR2x0WlMxbGJtZHBibVZjSWlrN1hHNWNibU5zWVhOeklGQnNZWGxsY2tWdVoybHVaU0JsZUhSbGJtUnpJRlJwYldWRmJtZHBibVVnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0IwYUdsekxuUnlZVzV6Y0c5eWRDQTlJRzUxYkd3N0lDOHZJSE5sZENCM2FHVnVJR0ZrWkdWa0lIUnZJSFJ5WVc1emNHOXlkR1Z5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRXUnBieUJpZFdabVpYSmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1FYVmthVzlDZFdabVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVpZFdabVpYSWdQU0J2Y0hScGIyNXpMbUoxWm1abGNpQjhmQ0J1ZFd4c08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dSbUZrWlNCMGFXMWxJR1p2Y2lCamFHRnBibWx1WnlCelpXZHRaVzUwY3lBb1pTNW5MaUJwYmlCemRHRnlkQ3dnYzNSdmNDd2dZVzVrSUhObFpXc3BYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwRjFaR2x2UW5WbVptVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Wm1Ga1pWUnBiV1VnUFNBd0xqQXdOVHRjYmx4dUlDQWdJSFJvYVhNdVgxOTBhVzFsSUQwZ01EdGNiaUFnSUNCMGFHbHpMbDlmY0c5emFYUnBiMjRnUFNBd08xeHVJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJREE3WEc0Z0lDQWdkR2hwY3k1ZlgyTjVZMnhwWXlBOUlHWmhiSE5sTzF4dVhHNGdJQ0FnZEdocGN5NWZYMkoxWm1abGNsTnZkWEpqWlNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnZEdocGN5NWZYM0JzWVhscGJtZFRjR1ZsWkNBOUlERTdYRzVjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVZ1BTQjBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJRjlmYzNSaGNuUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11WW5WbVptVnlLU0I3WEc0Z0lDQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZblZtWm1WeUxuZHlZWEJCY205MWJtUkZlSFJsYm5OcGIyNHBYRzRnSUNBZ0lDQWdJR0oxWm1abGNrUjFjbUYwYVc5dUlDMDlJSFJvYVhNdVluVm1abVZ5TG5keVlYQkJjbTkxYm1SRmVIUmxibk5wYjI0N1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOWZZM2xqYkdsaklDWW1JQ2h3YjNOcGRHbHZiaUE4SURBZ2ZId2djRzl6YVhScGIyNGdQajBnWW5WbVptVnlSSFZ5WVhScGIyNHBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQndhR0Z6WlNBOUlIQnZjMmwwYVc5dUlDOGdZblZtWm1WeVJIVnlZWFJwYjI0N1hHNGdJQ0FnSUNBZ0lIQnZjMmwwYVc5dUlEMGdLSEJvWVhObElDMGdUV0YwYUM1bWJHOXZjaWh3YUdGelpTa3BJQ29nWW5WbVptVnlSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNod2IzTnBkR2x2YmlBK1BTQXdJQ1ltSUhCdmMybDBhVzl1SUR3Z1luVm1abVZ5UkhWeVlYUnBiMjRnSmlZZ2MzQmxaV1FnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOWxiblpPYjJSbElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVWRoYVc0b0tUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVoyRnBiaTV6WlhSV1lXeDFaVUYwVkdsdFpTZ3dMQ0IwYVcxbEtUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVoyRnBiaTVzYVc1bFlYSlNZVzF3Vkc5V1lXeDFaVUYwVkdsdFpTZ3hMQ0IwYVcxbElDc2dkR2hwY3k1bVlXUmxWR2x0WlNrN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5bGJuWk9iMlJsTG1OdmJtNWxZM1FvZEdocGN5NWZYMmRoYVc1T2IyUmxLVHRjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVUoxWm1abGNsTnZkWEpqWlNncE8xeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxMbUoxWm1abGNpQTlJSFJvYVhNdVluVm1abVZ5TzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuQnNZWGxpWVdOclVtRjBaUzUyWVd4MVpTQTlJSE53WldWa08xeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxMbXh2YjNBZ1BTQjBhR2x6TGw5ZlkzbGpiR2xqTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExteHZiM0JUZEdGeWRDQTlJREE3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTlpZFdabVpYSlRiM1Z5WTJVdWJHOXZjRVZ1WkNBOUlHSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuTjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMkoxWm1abGNsTnZkWEpqWlM1amIyNXVaV04wS0hSb2FYTXVYMTlsYm5aT2IyUmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JmWDJoaGJIUW9kR2x0WlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWZaVzUyVG05a1pTNW5ZV2x1TG1OaGJtTmxiRk5qYUdWa2RXeGxaRlpoYkhWbGN5aDBhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlsYm5aT2IyUmxMbWRoYVc0dWMyVjBWbUZzZFdWQmRGUnBiV1VvZEdocGN5NWZYMlZ1ZGs1dlpHVXVaMkZwYmk1MllXeDFaU3dnZEdsdFpTazdYRzRnSUNBZ0lDQjBhR2x6TGw5ZlpXNTJUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXNJSFJwYldVZ0t5QjBhR2x6TG1aaFpHVlVhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlpZFdabVpYSlRiM1Z5WTJVdWMzUnZjQ2gwYVcxbElDc2dkR2hwY3k1bVlXUmxWR2x0WlNrN1hHNWNiaUFnSUNBZ0lIUm9hWE11WDE5aWRXWm1aWEpUYjNWeVkyVWdQU0J1ZFd4c08xeHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdWRrNXZaR1VnUFNCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUZScGJXVkZibWRwYm1VZ2JXVjBhRzlrSUNoemNHVmxaQzFqYjI1MGNtOXNiR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdjM2x1WTFOd1pXVmtLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkN3Z2MyVmxheUE5SUdaaGJITmxLU0I3WEc0Z0lDQWdkbUZ5SUd4aGMzUlRjR1ZsWkNBOUlIUm9hWE11WDE5emNHVmxaRHRjYmx4dUlDQWdJR2xtSUNoemNHVmxaQ0FoUFQwZ2JHRnpkRk53WldWa0lIeDhJSE5sWldzcElIdGNiaUFnSUNBZ0lHbG1JQ2h6WldWcklIeDhJR3hoYzNSVGNHVmxaQ0FxSUhOd1pXVmtJRHdnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmFHRnNkQ2gwYVcxbEtUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzTjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR3hoYzNSVGNHVmxaQ0E5UFQwZ01DQjhmQ0J6WldWcktTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXpkR0Z5ZENoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h6Y0dWbFpDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmFHRnNkQ2gwYVcxbEtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9kR2hwY3k1ZlgySjFabVpsY2xOdmRYSmpaU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuQnNZWGxpWVdOclVtRjBaUzV6WlhSV1lXeDFaVUYwVkdsdFpTaHpjR1ZsWkN3Z2RHbHRaU2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJSE53WldWa08xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlRaWFFnZDJobGRHaGxjaUIwYUdVZ1lYVmthVzhnWW5WbVptVnlJR2x6SUdOdmJuTnBaR1Z5WldRZ1lYTWdZM2xqYkdsalhHNGdJQ0FxSUVCd1lYSmhiU0I3UW05dmJIMGdZM2xqYkdsaklIZG9aWFJvWlhJZ2RHaGxJR0YxWkdsdklHSjFabVpsY2lCcGN5QmpiMjV6YVdSbGNtVmtJR0Z6SUdONVkyeHBZMXh1SUNBZ0tpOWNiaUFnYzJWMElHTjVZMnhwWXloamVXTnNhV01wSUh0Y2JpQWdJQ0JwWmlBb1kzbGpiR2xqSUNFOVBTQjBhR2x6TGw5ZlkzbGpiR2xqS1NCN1hHNGdJQ0FnSUNCMllYSWdkR2x0WlNBOUlIUm9hWE11WTNWeWNtVnVkRlJwYldVN1hHNGdJQ0FnSUNCMllYSWdjRzl6YVhScGIyNGdQU0IwYUdsekxtTjFjbkpsYm5SdmMybDBhVzl1TzF4dVhHNGdJQ0FnSUNCMGFHbHpMbDlmYUdGc2RDaDBhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlqZVdOc2FXTWdQU0JqZVdOc2FXTTdYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbDlmYzNCbFpXUWdJVDA5SURBcFhHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5emRHRnlkQ2gwYVcxbExDQndiM05wZEdsdmJpd2dkR2hwY3k1ZlgzTndaV1ZrS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IyVjBJSGRvWlhSb1pYSWdkR2hsSUdGMVpHbHZJR0oxWm1abGNpQnBjeUJqYjI1emFXUmxjbVZrSUdGeklHTjVZMnhwWTF4dUlDQWdLaUJBY21WMGRYSnVJSHRDYjI5c2ZTQjNhR1YwYUdWeUlIUm9aU0JoZFdScGJ5QmlkV1ptWlhJZ2FYTWdZMjl1YzJsa1pYSmxaQ0JoY3lCamVXTnNhV05jYmlBZ0lDb3ZYRzRnSUdkbGRDQmplV05zYVdNb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTlqZVdOc2FXTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElHZGhhVzVjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIWmhiSFZsSUd4cGJtVmhjaUJuWVdsdUlHWmhZM1J2Y2x4dUlDQWdLaTljYmlBZ2MyVjBJR2RoYVc0b2RtRnNkV1VwSUh0Y2JpQWdJQ0IyWVhJZ2RHbHRaU0E5SUhSb2FYTXVYMTl6ZVc1aktDazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVdVkyRnVZMlZzVTJOb1pXUjFiR1ZrVm1Gc2RXVnpLSFJwYldVcE8xeHVJQ0FnSUhSb2FYTXVYMTluWVdsdVRtOWtaUzV6WlhSV1lXeDFaVUYwVkdsdFpTaDBhR2x6TGw5ZloyRnBiazV2WkdVdVoyRnBiaTUyWVd4MVpTd2dkR2x0WlNrN1hHNGdJQ0FnZEdocGN5NWZYMmRoYVc1T2IyUmxMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXNJSFJwYldVZ0t5QjBhR2x6TG1aaFpHVlVhVzFsS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnWjJGcGJseHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdOMWNuSmxiblFnWjJGcGJseHVJQ0FnS2k5Y2JpQWdaMlYwSUdkaGFXNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5bllXbHVUbTlrWlM1bllXbHVMblpoYkhWbE8xeHVJQ0I5WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVR3hoZVdWeVJXNW5hVzVsT3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50T3JQcmV2aW91c0luZGV4KHNvcnRlZEFycmF5LCB2YWx1ZSkge1xuICB2YXIgaW5kZXggPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMl07XG5cbiAgdmFyIHNpemUgPSBzb3J0ZWRBcnJheS5sZW5ndGg7XG5cbiAgaWYgKHNpemUgPiAwKSB7XG4gICAgdmFyIGZpcnN0VmFsID0gc29ydGVkQXJyYXlbMF07XG4gICAgdmFyIGxhc3RWYWwgPSBzb3J0ZWRBcnJheVtzaXplIC0gMV07XG5cbiAgICBpZiAodmFsdWUgPCBmaXJzdFZhbCkgaW5kZXggPSAtMTtlbHNlIGlmICh2YWx1ZSA+PSBsYXN0VmFsKSBpbmRleCA9IHNpemUgLSAxO2Vsc2Uge1xuICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSBpbmRleCA9IE1hdGguZmxvb3IoKHNpemUgLSAxKSAqICh2YWx1ZSAtIGZpcnN0VmFsKSAvIChsYXN0VmFsIC0gZmlyc3RWYWwpKTtcblxuICAgICAgd2hpbGUgKHNvcnRlZEFycmF5W2luZGV4XSA+IHZhbHVlKSBpbmRleC0tO1xuXG4gICAgICB3aGlsZSAoc29ydGVkQXJyYXlbaW5kZXggKyAxXSA8PSB2YWx1ZSkgaW5kZXgrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRPck5leHRJbmRleChzb3J0ZWRBcnJheSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzJdO1xuXG4gIHZhciBzaXplID0gc29ydGVkQXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzaXplID4gMCkge1xuICAgIHZhciBmaXJzdFZhbCA9IHNvcnRlZEFycmF5WzBdO1xuICAgIHZhciBsYXN0VmFsID0gc29ydGVkQXJyYXlbc2l6ZSAtIDFdO1xuXG4gICAgaWYgKHZhbHVlIDw9IGZpcnN0VmFsKSBpbmRleCA9IDA7ZWxzZSBpZiAodmFsdWUgPj0gbGFzdFZhbCkgaW5kZXggPSBzaXplO2Vsc2Uge1xuICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSBpbmRleCA9IE1hdGguZmxvb3IoKHNpemUgLSAxKSAqICh2YWx1ZSAtIGZpcnN0VmFsKSAvIChsYXN0VmFsIC0gZmlyc3RWYWwpKTtcblxuICAgICAgd2hpbGUgKHNvcnRlZEFycmF5W2luZGV4XSA8IHZhbHVlKSBpbmRleCsrO1xuXG4gICAgICB3aGlsZSAoc29ydGVkQXJyYXlbaW5kZXggKyAxXSA+PSB2YWx1ZSkgaW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbi8qKlxuICogQGNsYXNzIFNlZ21lbnRFbmdpbmVcbiAqL1xuXG52YXIgU2VnbWVudEVuZ2luZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgaW5pdGlhbCBhdWRpbyBidWZmZXIgZm9yIGdyYW51bGFyIHN5bnRoZXNpc1xuICAgKlxuICAgKiBUaGUgZW5naW5lIGltcGxlbWVudHMgdGhlIFwic2NoZWR1bGVkXCIgYW5kIFwidHJhbnNwb3J0ZWRcIiBpbnRlcmZhY2VzLlxuICAgKiBXaGVuIFwic2NoZWR1bGVkXCIsIHRoZSBlbmdpbmUgIGdlbmVyYXRlcyBzZWdtZW50cyBtb3JlIG9yIGxlc3PCoHBlcmlvZGljYWxseVxuICAgKiAoY29udHJvbGxlZCBieSB0aGUgcGVyaW9kQWJzLCBwZXJpb2RSZWwsIGFuZCBwZXJpb1ZhciBhdHRyaWJ1dGVzKS5cbiAgICogV2hlbiBcInRyYW5zcG9ydGVkXCIsIHRoZSBlbmdpbmUgZ2VuZXJhdGVzIHNlZ21lbnRzIGF0IHRoZSBwb3NpdGlvbiBvZiB0aGVpciBvbnNldCB0aW1lLlxuICAgKi9cblxuICBmdW5jdGlvbiBTZWdtZW50RW5naW5lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZWdtZW50RW5naW5lKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFNlZ21lbnRFbmdpbmUucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGF1ZGlvQ29udGV4dCk7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJcbiAgICAgKiBAdHlwZSB7QXVkaW9CdWZmZXJ9XG4gICAgICovXG4gICAgdGhpcy5idWZmZXIgPSBvcHRpb25zLmJ1ZmZlciB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgc2VnbWVudCBwZXJpb2QgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZEFicyA9IG9wdGlvbnMucGVyaW9kQWJzIHx8IDAuMTtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgcGVyaW9kIHJlbGF0aXZlIHRvIGludGVyLXNlZ21lbnQgZGlzdGFuY2VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kUmVsID0gb3B0aW9ucy5wZXJpb2RSZWwgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSBzZWdtZW50IHBlcmlvZCB2YXJpYXRpb24gcmVsYXRpdmUgdG8gc2VnbWVudCBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kVmFyID0gb3B0aW9ucy5wZXJpb2RWYXIgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHNlZ21lbnQgcG9zaXRpb25zIChvbnNldCB0aW1lcyBpbiBhdWRpbyBidWZmZXIpIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gb3B0aW9ucy5wb3NpdGlvbkFycmF5IHx8IFswXTtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSBzZWdtZW50IHBvc2l0aW9uIHZhcmlhdGlvbiBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucG9zaXRpb25WYXIgPSBvcHRpb25zLnBvc2l0aW9uVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBzZWdtZW50IGR1cmF0aW9ucyBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuZHVyYXRpb25BcnJheSA9IG9wdGlvbnMuZHVyYXRpb25BcnJheSB8fCBbMF07XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSBzZWdtZW50IGR1cmF0aW9uIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kdXJhdGlvbkFicyA9IG9wdGlvbnMuZHVyYXRpb25BYnMgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgZHVyYXRpb24gcmVsYXRpdmUgdG8gZ2l2ZW4gc2VnbWVudCBkdXJhdGlvbiBvciBpbnRlci1zZWdtZW50IGRpc3RhbmNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmR1cmF0aW9uUmVsID0gb3B0aW9ucy5kdXJhdGlvblJlbCB8fCAxO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2Ygc2VnbWVudCBvZmZzZXRzIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICpcbiAgICAgKiBvZmZzZXQgPiAwOiB0aGUgc2VnbWVudCdzIHJlZmVyZW5jZSBwb3NpdGlvbiBpcyBhZnRlciB0aGUgZ2l2ZW4gc2VnbWVudCBwb3NpdGlvblxuICAgICAqIG9mZnNldCA8IDA6IHRoZSBnaXZlbiBzZWdtZW50IHBvc2l0aW9uIGlzIHRoZSBzZWdtZW50J3MgcmVmZXJlbmNlIHBvc2l0aW9uIGFuZCB0aGUgZHVyYXRpb24gaGFzIHRvIGJlIGNvcnJlY3RlZCBieSB0aGUgb2Zmc2V0XG4gICAgICovXG4gICAgdGhpcy5vZmZzZXRBcnJheSA9IG9wdGlvbnMub2Zmc2V0QXJyYXkgfHwgWzBdO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgc2VnbWVudCBvZmZzZXQgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm9mZnNldEFicyA9IG9wdGlvbnMub2Zmc2V0QWJzIHx8IC0wLjAwNTtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgb2Zmc2V0IHJlbGF0aXZlIHRvIHNlZ21lbnQgZHVyYXRpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2V0UmVsID0gb3B0aW9ucy5vZmZzZXRSZWwgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgYnkgd2hpY2ggYWxsIHNlZ21lbnRzIGFyZSBkZWxheWVkIChlc3BlY2lhbGx5IHRvIHJlYWxpemUgc2VnbWVudCBvZmZzZXRzKVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kZWxheSA9IG9wdGlvbnMuZGVsYXkgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSBhdHRhY2sgdGltZSBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNrQWJzID0gb3B0aW9ucy5hdHRhY2tBYnMgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2sgdGltZSByZWxhdGl2ZSB0byBzZWdtZW50IGR1cmF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmF0dGFja1JlbCA9IG9wdGlvbnMuYXR0YWNrUmVsIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSByZWxlYXNlIHRpbWUgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnJlbGVhc2VBYnMgPSBvcHRpb25zLnJlbGVhc2VBYnMgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlIHRpbWUgcmVsYXRpdmUgdG8gc2VnbWVudCBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZWxlYXNlUmVsID0gb3B0aW9ucy5yZWxlYXNlUmVsIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBTZWdtZW50IHJlc2FtcGxpbmcgaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nID0gb3B0aW9ucy5yZXNhbXBsaW5nIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBbW91dCBvZiByYW5kb20gcmVzYW1wbGluZyB2YXJpYXRpb24gaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nVmFyID0gb3B0aW9ucy5yZXNhbXBsaW5nVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBvZlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zZWdtZW50SW5kZXggPSBvcHRpb25zLnNlZ21lbnRJbmRleCB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGFuZCBzZWdtZW50IGluZGljZXMgYXJlIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICogQHR5cGUge0Jvb2x9XG4gICAgICovXG4gICAgdGhpcy5jeWNsaWMgPSBvcHRpb25zLmN5Y2xpYyB8fCBmYWxzZTtcbiAgICB0aGlzLl9fY3ljbGljT2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuX19nYWluTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUgPSBvcHRpb25zLmdhaW4gfHwgMTtcblxuICAgIHRoaXMub3V0cHV0Tm9kZSA9IHRoaXMuX19nYWluTm9kZTtcbiAgfVxuXG4gIF9pbmhlcml0cyhTZWdtZW50RW5naW5lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKFNlZ21lbnRFbmdpbmUsIHtcbiAgICBidWZmZXJEdXJhdGlvbjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidWZmZXJEdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uKSBidWZmZXJEdXJhdGlvbiAtPSB0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uO1xuXG4gICAgICAgIHJldHVybiBidWZmZXJEdXJhdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgcmV0dXJuIHRpbWUgKyB0aGlzLnRyaWdnZXIodGltZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHRyYW5zcG9ydGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zZWdtZW50SW5kZXg7XG4gICAgICAgIHZhciBjeWNsaWNPZmZzZXQgPSAwO1xuICAgICAgICB2YXIgYnVmZmVyRHVyYXRpb24gPSB0aGlzLmJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmN5Y2xpYykge1xuICAgICAgICAgIHZhciBjeWNsZXMgPSBwb3NpdGlvbiAvIGJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgICAgY3ljbGljT2Zmc2V0ID0gTWF0aC5mbG9vcihjeWNsZXMpICogYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgcG9zaXRpb24gLT0gY3ljbGljT2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgIGluZGV4ID0gZ2V0Q3VycmVudE9yTmV4dEluZGV4KHRoaXMucG9zaXRpb25BcnJheSwgcG9zaXRpb24pO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN5Y2xpY09mZnNldCArPSBidWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmN5Y2xpYykge1xuICAgICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNwZWVkIDwgMCkge1xuICAgICAgICAgIGluZGV4ID0gZ2V0Q3VycmVudE9yUHJldmlvdXNJbmRleCh0aGlzLnBvc2l0aW9uQXJyYXksIHBvc2l0aW9uKTtcblxuICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjeWNsaWNPZmZzZXQgLT0gYnVmZmVyRHVyYXRpb247XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5jeWNsaWMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIC1JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWdtZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5fX2N5Y2xpY09mZnNldCA9IGN5Y2xpY09mZnNldDtcblxuICAgICAgICByZXR1cm4gY3ljbGljT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VQb3NpdGlvbjoge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAodHJhbnNwb3J0ZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNlZ21lbnRJbmRleDtcbiAgICAgICAgdmFyIGN5Y2xpY09mZnNldCA9IHRoaXMuX19jeWNsaWNPZmZzZXQ7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKHRpbWUpO1xuXG4gICAgICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN5Y2xpY09mZnNldCArPSB0aGlzLmJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY3ljbGljKSB7XG4gICAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXgtLTtcblxuICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjeWNsaWNPZmZzZXQgLT0gdGhpcy5idWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmN5Y2xpYykge1xuICAgICAgICAgICAgICByZXR1cm4gLUluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VnbWVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuX19jeWNsaWNPZmZzZXQgPSBjeWNsaWNPZmZzZXQ7XG5cbiAgICAgICAgcmV0dXJuIGN5Y2xpY09mZnNldCArIHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG4gICAgICB9XG4gICAgfSxcbiAgICBnYWluOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IGdhaW5cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBsaW5lYXIgZ2FpbiBmYWN0b3JcbiAgICAgICAqL1xuXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgZ2FpblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IGdhaW5cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIGEgc2VnbWVudFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSBzZWdtZW50IHN5bnRoZXNpcyBhdWRpbyB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHBlcmlvZCB0byBuZXh0IHNlZ21lbnRcbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWQgYXQgYW55IHRpbWUgKHdoZXRoZXIgdGhlIGVuZ2luZSBpcyBzY2hlZHVsZWQvdHJhbnNwb3J0ZWQgb3Igbm90KVxuICAgICAgICogdG8gZ2VuZXJhdGUgYSBzaW5nbGUgc2VnbWVudCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc2VnbWVudCBwYXJhbWV0ZXJzLlxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0cmlnZ2VyKGF1ZGlvVGltZSkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBzZWdtZW50VGltZSA9IGF1ZGlvVGltZSB8fCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyB0aGlzLmRlbGF5O1xuICAgICAgICB2YXIgc2VnbWVudFBlcmlvZCA9IHRoaXMucGVyaW9kQWJzO1xuICAgICAgICB2YXIgc2VnbWVudEluZGV4ID0gdGhpcy5zZWdtZW50SW5kZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnRQb3NpdGlvbiA9IDA7XG4gICAgICAgICAgdmFyIHNlZ21lbnREdXJhdGlvbiA9IDA7XG4gICAgICAgICAgdmFyIHNlZ21lbnRPZmZzZXQgPSAwO1xuICAgICAgICAgIHZhciByZXNhbXBsaW5nUmF0ZSA9IDE7XG4gICAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgIGlmICh0aGlzLmN5Y2xpYykgc2VnbWVudEluZGV4ID0gc2VnbWVudEluZGV4ICUgdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aDtlbHNlIHNlZ21lbnRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNlZ21lbnRJbmRleCwgdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDEpKTtcblxuICAgICAgICAgIGlmICh0aGlzLnBvc2l0aW9uQXJyYXkpIHNlZ21lbnRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb25BcnJheVtzZWdtZW50SW5kZXhdIHx8IDA7XG5cbiAgICAgICAgICBpZiAodGhpcy5kdXJhdGlvbkFycmF5KSBzZWdtZW50RHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uQXJyYXlbc2VnbWVudEluZGV4XSB8fCAwO1xuXG4gICAgICAgICAgaWYgKHRoaXMub2Zmc2V0QXJyYXkpIHNlZ21lbnRPZmZzZXQgPSB0aGlzLm9mZnNldEFycmF5W3NlZ21lbnRJbmRleF0gfHwgMDtcblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSByZXNhbXBsaW5nXG4gICAgICAgICAgaWYgKHRoaXMucmVzYW1wbGluZyAhPT0gMCB8fCB0aGlzLnJlc2FtcGxpbmdWYXIgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcmFuZG9tUmVzYW1wbGluZyA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIgKiB0aGlzLnJlc2FtcGxpbmdWYXI7XG4gICAgICAgICAgICByZXNhbXBsaW5nUmF0ZSA9IE1hdGgucG93KDIsICh0aGlzLnJlc2FtcGxpbmcgKyByYW5kb21SZXNhbXBsaW5nKSAvIDEyMDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSBpbnRlci1zZWdtZW50IGRpc3RhbmNlXG4gICAgICAgICAgaWYgKHNlZ21lbnREdXJhdGlvbiA9PT0gMCB8fCB0aGlzLnBlcmlvZFJlbCA+IDApIHtcbiAgICAgICAgICAgIHZhciBuZXh0U2VnZW1lbnRJbmRleCA9IHNlZ21lbnRJbmRleCArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uLCBuZXh0T2Zmc2V0O1xuXG4gICAgICAgICAgICBpZiAobmV4dFNlZ2VtZW50SW5kZXggPT09IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY3ljbGljKSB7XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkFycmF5WzBdICsgYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICAgICAgbmV4dE9mZnNldCA9IHRoaXMub2Zmc2V0QXJyYXlbMF07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICAgICAgbmV4dE9mZnNldCA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb25BcnJheVtuZXh0U2VnZW1lbnRJbmRleF07XG4gICAgICAgICAgICAgIG5leHRPZmZzZXQgPSB0aGlzLm9mZnNldEFycmF5W25leHRTZWdlbWVudEluZGV4XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGludGVyU2VnbWVudERpc3RhbmNlID0gbmV4dFBvc2l0aW9uIC0gc2VnbWVudFBvc2l0aW9uO1xuXG4gICAgICAgICAgICAvLyBjb3JyZWN0IGludGVyLXNlZ21lbnQgZGlzdGFuY2UgYnkgb2Zmc2V0c1xuICAgICAgICAgICAgLy8gICBvZmZzZXQgPiAwOiB0aGUgc2VnbWVudCdzIHJlZmVyZW5jZSBwb3NpdGlvbiBpcyBhZnRlciB0aGUgZ2l2ZW4gc2VnbWVudCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHNlZ21lbnRPZmZzZXQgPiAwKSBpbnRlclNlZ21lbnREaXN0YW5jZSAtPSBzZWdtZW50T2Zmc2V0O1xuXG4gICAgICAgICAgICBpZiAobmV4dE9mZnNldCA+IDApIGludGVyU2VnbWVudERpc3RhbmNlICs9IG5leHRPZmZzZXQ7XG5cbiAgICAgICAgICAgIGlmIChpbnRlclNlZ21lbnREaXN0YW5jZSA8IDApIGludGVyU2VnbWVudERpc3RhbmNlID0gMDtcblxuICAgICAgICAgICAgLy8gdXNlIGludGVyLXNlZ21lbnQgZGlzdGFuY2UgaW5zdGVhZCBvZiBzZWdtZW50IGR1cmF0aW9uXG4gICAgICAgICAgICBpZiAoc2VnbWVudER1cmF0aW9uID09PSAwKSBzZWdtZW50RHVyYXRpb24gPSBpbnRlclNlZ21lbnREaXN0YW5jZTtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHBlcmlvZCByZWxhdGl2ZSB0byBpbnRlciBtYXJrZXIgZGlzdGFuY2VcbiAgICAgICAgICAgIHNlZ21lbnRQZXJpb2QgKz0gdGhpcy5wZXJpb2RSZWwgKiBpbnRlclNlZ21lbnREaXN0YW5jZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBhZGQgcmVsYXRpdmUgYW5kIGFic29sdXRlIHNlZ21lbnQgZHVyYXRpb25cbiAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKj0gdGhpcy5kdXJhdGlvblJlbDtcbiAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKz0gdGhpcy5kdXJhdGlvbkFicztcblxuICAgICAgICAgIC8vIGFkZCByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgc2VnbWVudCBvZmZzZXRcbiAgICAgICAgICBzZWdtZW50T2Zmc2V0ICo9IHRoaXMub2Zmc2V0UmVsO1xuICAgICAgICAgIHNlZ21lbnRPZmZzZXQgKz0gdGhpcy5vZmZzZXRBYnM7XG5cbiAgICAgICAgICAvLyBhcHBseSBzZWdtZW50IG9mZnNldFxuICAgICAgICAgIC8vICAgb2Zmc2V0ID4gMDogdGhlIHNlZ21lbnQncyByZWZlcmVuY2UgcG9zaXRpb24gaXMgYWZ0ZXIgdGhlIGdpdmVuIHNlZ21lbnQgcG9zaXRpb25cbiAgICAgICAgICAvLyAgIG9mZnNldCA8IDA6IHRoZSBnaXZlbiBzZWdtZW50IHBvc2l0aW9uIGlzIHRoZSBzZWdtZW50J3MgcmVmZXJlbmNlIHBvc2l0aW9uIGFuZCB0aGUgZHVyYXRpb24gaGFzIHRvIGJlIGNvcnJlY3RlZCBieSB0aGUgb2Zmc2V0XG4gICAgICAgICAgaWYgKHNlZ21lbnRPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICBzZWdtZW50RHVyYXRpb24gLT0gc2VnbWVudE9mZnNldDtcbiAgICAgICAgICAgIHNlZ21lbnRQb3NpdGlvbiArPSBzZWdtZW50T2Zmc2V0O1xuICAgICAgICAgICAgc2VnbWVudFRpbWUgKz0gc2VnbWVudE9mZnNldCAvIHJlc2FtcGxpbmdSYXRlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWdtZW50VGltZSAtPSBzZWdtZW50T2Zmc2V0IC8gcmVzYW1wbGluZ1JhdGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmFuZG9taXplIHNlZ21lbnQgcG9zaXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvblZhciA+IDApIHNlZ21lbnRQb3NpdGlvbiArPSAyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wb3NpdGlvblZhcjtcblxuICAgICAgICAgIC8vIHNob3J0ZW4gZHVyYXRpb24gb2Ygc2VnbWVudHMgb3ZlciB0aGUgZWRnZXMgb2YgdGhlIGJ1ZmZlclxuICAgICAgICAgIGlmIChzZWdtZW50UG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKz0gc2VnbWVudFBvc2l0aW9uO1xuICAgICAgICAgICAgc2VnbWVudFBvc2l0aW9uID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudFBvc2l0aW9uICsgc2VnbWVudER1cmF0aW9uID4gdGhpcy5idWZmZXIuZHVyYXRpb24pIHNlZ21lbnREdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uIC0gc2VnbWVudFBvc2l0aW9uO1xuXG4gICAgICAgICAgLy8gbWFrZSBzZWdtZW50XG4gICAgICAgICAgaWYgKHRoaXMuZ2FpbiA+IDAgJiYgc2VnbWVudER1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgLy8gbWFrZSBzZWdtZW50IGVudmVsb3BlXG4gICAgICAgICAgICB2YXIgZW52ZWxvcGVOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgICAgIHZhciBhdHRhY2sgPSB0aGlzLmF0dGFja0FicyArIHRoaXMuYXR0YWNrUmVsICogc2VnbWVudER1cmF0aW9uO1xuICAgICAgICAgICAgdmFyIHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VBYnMgKyB0aGlzLnJlbGVhc2VSZWwgKiBzZWdtZW50RHVyYXRpb247XG5cbiAgICAgICAgICAgIGlmIChhdHRhY2sgKyByZWxlYXNlID4gc2VnbWVudER1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBmYWN0b3IgPSBzZWdtZW50RHVyYXRpb24gLyAoYXR0YWNrICsgcmVsZWFzZSk7XG4gICAgICAgICAgICAgIGF0dGFjayAqPSBmYWN0b3I7XG4gICAgICAgICAgICAgIHJlbGVhc2UgKj0gZmFjdG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0YWNrRW5kVGltZSA9IHNlZ21lbnRUaW1lICsgYXR0YWNrO1xuICAgICAgICAgICAgdmFyIHNlZ21lbnRFbmRUaW1lID0gc2VnbWVudFRpbWUgKyBzZWdtZW50RHVyYXRpb247XG4gICAgICAgICAgICB2YXIgcmVsZWFzZVN0YXJ0VGltZSA9IHNlZ21lbnRFbmRUaW1lIC0gcmVsZWFzZTtcblxuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4udmFsdWUgPSB0aGlzLmdhaW47XG5cbiAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHNlZ21lbnRUaW1lKTtcbiAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ2FpbiwgYXR0YWNrRW5kVGltZSk7XG5cbiAgICAgICAgICAgIGlmIChyZWxlYXNlU3RhcnRUaW1lID4gYXR0YWNrRW5kVGltZSkgZW52ZWxvcGVOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUodGhpcy5nYWluLCByZWxlYXNlU3RhcnRUaW1lKTtcblxuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgc2VnbWVudEVuZFRpbWUpO1xuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmNvbm5lY3QodGhpcy5fX2dhaW5Ob2RlKTtcblxuICAgICAgICAgICAgLy8gbWFrZSBzb3VyY2VcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cbiAgICAgICAgICAgIHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgICAgIHNvdXJjZS5wbGF5YmFja1JhdGUudmFsdWUgPSByZXNhbXBsaW5nUmF0ZTtcbiAgICAgICAgICAgIHNvdXJjZS5jb25uZWN0KGVudmVsb3BlTm9kZSk7XG4gICAgICAgICAgICBlbnZlbG9wZU5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICBzb3VyY2Uuc3RhcnQoc2VnbWVudFRpbWUsIHNlZ21lbnRQb3NpdGlvbik7XG4gICAgICAgICAgICBzb3VyY2Uuc3RvcChzZWdtZW50VGltZSArIHNlZ21lbnREdXJhdGlvbiAvIHJlc2FtcGxpbmdSYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VnbWVudFBlcmlvZDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBTZWdtZW50RW5naW5lO1xufSkoVGltZUVuZ2luZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudEVuZ2luZTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBzb3VuZCBzZWdtZW50IGVuZ2luZVxuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGUFFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZhRVFzVTBGQlV5eDVRa0ZCZVVJc1EwRkJReXhYUVVGWExFVkJRVVVzUzBGQlN5eEZRVUZoTzAxQlFWZ3NTMEZCU3l4blEwRkJSeXhEUVVGRE96dEJRVU01UkN4TlFVRkpMRWxCUVVrc1IwRkJSeXhYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZET3p0QlFVVTVRaXhOUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZEV2l4UlFVRkpMRkZCUVZFc1IwRkJSeXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZET1VJc1VVRkJTU3hQUVVGUExFZEJRVWNzVjBGQlZ5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmNFTXNVVUZCU1N4TFFVRkxMRWRCUVVjc1VVRkJVU3hGUVVOc1FpeExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkRVaXhKUVVGSkxFdEJRVXNzU1VGQlNTeFBRVUZQTEVWQlEzWkNMRXRCUVVzc1IwRkJSeXhKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEV0QlEyUTdRVUZEU0N4VlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFbEJRVWtzUzBGQlN5eEpRVUZKTEVsQlFVa3NSVUZETlVJc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGQkxFbEJRVXNzUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUVN4QlFVRkRMRWxCUVVrc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlFTeEJRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZOMFVzWVVGQlR5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1MwRkJTeXhGUVVNdlFpeExRVUZMTEVWQlFVVXNRMEZCUXpzN1FVRkZWaXhoUVVGUExGZEJRVmNzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhGUVVOd1F5eExRVUZMTEVWQlFVVXNRMEZCUXp0TFFVTllPMGRCUTBZN08wRkJSVVFzVTBGQlR5eExRVUZMTEVOQlFVTTdRMEZEWkRzN1FVRkZSQ3hUUVVGVExIRkNRVUZ4UWl4RFFVRkRMRmRCUVZjc1JVRkJSU3hMUVVGTExFVkJRV0U3VFVGQldDeExRVUZMTEdkRFFVRkhMRU5CUVVNN08wRkJRekZFTEUxQlFVa3NTVUZCU1N4SFFVRkhMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUbENMRTFCUVVrc1NVRkJTU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU5hTEZGQlFVa3NVVUZCVVN4SFFVRkhMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU01UWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhYUVVGWExFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWd1F5eFJRVUZKTEV0QlFVc3NTVUZCU1N4UlFVRlJMRVZCUTI1Q0xFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNTMEZEVUN4SlFVRkpMRXRCUVVzc1NVRkJTU3hQUVVGUExFVkJRM1pDTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkRWanRCUVVOSUxGVkJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hGUVVNMVFpeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVRXNTVUZCU3l4TFFVRkxMRWRCUVVjc1VVRkJVU3hEUVVGQkxFRkJRVU1zU1VGQlNTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkJMRUZCUVVNc1EwRkJReXhEUVVGRE96dEJRVVUzUlN4aFFVRlBMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eExRVUZMTEVWQlF5OUNMRXRCUVVzc1JVRkJSU3hEUVVGRE96dEJRVVZXTEdGQlFVOHNWMEZCVnl4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeExRVUZMTEVWQlEzQkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wdEJRMWc3UjBGRFJqczdRVUZGUkN4VFFVRlBMRXRCUVVzc1EwRkJRenREUVVOa096czdPenM3U1VGTFN5eGhRVUZoT3pzN096czdPenM3T3p0QlFWVk9MRmRCVmxBc1lVRkJZU3hEUVZWTUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FWWnNReXhoUVVGaE96dEJRVmRtTEhGRFFWaEZMR0ZCUVdFc05rTkJWMVFzV1VGQldTeEZRVUZGT3pzN096czdRVUZOY0VJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRWxCUVVrc1EwRkJRenM3T3pzN08wRkJUWEpETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRWxCUVVrc1EwRkJReXhEUVVGRE96czdPenM3UVVGTmVFTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFhoRExGRkJRVWtzUTBGQlF5eGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMR0ZCUVdFc1NVRkJTU3hEUVVGRExFTkJRVWNzUTBGQlF5eERRVUZET3pzN096czdRVUZOY0VRc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUVFZETEZGQlFVa3NRMEZCUXl4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExHRkJRV0VzU1VGQlNTeERRVUZETEVOQlFVY3NRMEZCUXl4RFFVRkRPenM3T3pzN1FVRk5jRVFzVVVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRUVkRMRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWY3NTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenM3T3p0QlFWTTFReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1EwRkJReXhEUVVGSExFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRXaEVMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJRenM3T3pzN08wRkJUVGRETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeERRVUZETEVOQlFVTTdPenM3T3p0QlFVMTRReXhSUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1MwRkJTeXhEUVVGRE96czdPenM3UVVGTmNFTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEV0QlFVc3NRMEZCUXpzN096czdPMEZCVFRWRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1NVRkJTU3hEUVVGRExFTkJRVU03T3pzN096dEJRVTE0UXl4UlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN1FVRk5PVU1zVVVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRURkRMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenRCUVUweFF5eFJRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGaExFbEJRVWtzUTBGQlF5eERRVUZET3pzN096czdRVUZOYUVRc1VVRkJTU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNXVUZCV1N4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUVGxETEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEZEVNc1VVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhoQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRelZETEZGQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1EwRkJRenM3UVVGRkwwTXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETzBkQlEyNURPenRaUVc1S1J5eGhRVUZoT3p0bFFVRmlMR0ZCUVdFN1FVRnhTbUlzYTBKQlFXTTdWMEZCUVN4WlFVRkhPMEZCUTI1Q0xGbEJRVWtzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRE96dEJRVVV4UXl4WlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zYlVKQlFXMUNMRVZCUTJwRExHTkJRV01zU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeERRVUZET3p0QlFVVndSQ3hsUVVGUExHTkJRV01zUTBGQlF6dFBRVU4yUWpzN1FVRkhSQ3hsUVVGWE96czdPMkZCUVVFc2NVSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRha01zWlVGQlR5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU5zUXpzN1FVRkhSQ3huUWtGQldUczdPenRoUVVGQkxITkNRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhGUVVGRk8wRkJRMnhETEZsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU03UVVGRE9VSXNXVUZCU1N4WlFVRlpMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRM0pDTEZsQlFVa3NZMEZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU03TzBGQlJYcERMRmxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5tTEdOQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1IwRkJSeXhqUVVGakxFTkJRVU03TzBGQlJYWkRMSE5DUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhqUVVGakxFTkJRVU03UVVGRGJrUXNhMEpCUVZFc1NVRkJTU3haUVVGWkxFTkJRVU03VTBGRE1VSTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEySXNaVUZCU3l4SFFVRkhMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJUVkVMR05CUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNSRExHbENRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTFZc2QwSkJRVmtzU1VGQlNTeGpRVUZqTEVOQlFVTTdPMEZCUlM5Q0xHZENRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwN1FVRkRaQ3h4UWtGQlR5eFJRVUZSTEVOQlFVTTdZVUZCUVR0WFFVTnVRanRUUVVOR0xFMUJRVTBzU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNCQ0xHVkJRVXNzUjBGQlJ5eDVRa0ZCZVVJc1EwRkJReXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVWb1JTeGpRVUZKTEV0QlFVc3NSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRZaXhwUWtGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4M1FrRkJXU3hKUVVGSkxHTkJRV01zUTBGQlF6czdRVUZGTDBJc1owSkJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFR0QlFVTmtMSEZDUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETzJGQlFVRTdWMEZEY0VJN1UwRkRSaXhOUVVGTk8wRkJRMHdzYVVKQlFVOHNVVUZCVVN4RFFVRkRPMU5CUTJwQ096dEJRVVZFTEZsQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRekZDTEZsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1dVRkJXU3hEUVVGRE96dEJRVVZ1UXl4bFFVRlBMRmxCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMDlCUTJwRU96dEJRVWRFTEcxQ1FVRmxPenM3TzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTTVRaXhaUVVGSkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRPenRCUVVWMlF5eFpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE96dEJRVVZ1UWl4WlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRFlpeGxRVUZMTEVWQlFVVXNRMEZCUXpzN1FVRkZVaXhqUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOMFF5eHBRa0ZCU3l4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOV0xIZENRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJRenM3UVVGRmNFTXNaMEpCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRUdEJRVU5rTEhGQ1FVRlBMRkZCUVZFc1EwRkJRenRoUVVGQk8xZEJRMjVDTzFOQlEwWXNUVUZCVFR0QlFVTk1MR1ZCUVVzc1JVRkJSU3hEUVVGRE96dEJRVVZTTEdOQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOaUxHbENRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkRMSGRDUVVGWkxFbEJRVWtzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZjRU1zWjBKQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUVHRCUVVOa0xIRkNRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRPMkZCUVVFN1YwRkRjRUk3VTBGRFJqczdRVUZGUkN4WlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU14UWl4WlFVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExGbEJRVmtzUTBGQlF6czdRVUZGYmtNc1pVRkJUeXhaUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRQUVVOcVJEczdRVUZqUnl4UlFVRkpPenM3T3pzN08xZEJVa0VzVlVGQlF5eExRVUZMTEVWQlFVVTdRVUZEWkN4WlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMDlCUTNCRE96czdPenM3VjBGTlR5eFpRVUZITzBGQlExUXNaVUZCVHl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdUMEZEYmtNN08wRkJWVVFzVjBGQlR6czdPenM3T3pzN096czdZVUZCUVN4cFFrRkJReXhUUVVGVExFVkJRVVU3UVVGRGFrSXNXVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU55UXl4WlFVRkpMRmRCUVZjc1IwRkJSeXhUUVVGVExFbEJRVWtzV1VGQldTeERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRM0pGTEZsQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGJrTXNXVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6czdRVUZGY2tNc1dVRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNZMEZCU1N4bFFVRmxMRWRCUVVjc1EwRkJSeXhEUVVGRE8wRkJRekZDTEdOQlFVa3NaVUZCWlN4SFFVRkhMRU5CUVVjc1EwRkJRenRCUVVNeFFpeGpRVUZKTEdGQlFXRXNSMEZCUnl4RFFVRkhMRU5CUVVNN1FVRkRlRUlzWTBGQlNTeGpRVUZqTEVkQlFVY3NRMEZCUnl4RFFVRkRPMEZCUTNwQ0xHTkJRVWtzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNN08wRkJSWHBETEdOQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkRZaXhaUVVGWkxFZEJRVWNzV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJSWGhFTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmxCUVZrc1JVRkJSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZ3Uml4alFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRM0JDTEdWQlFXVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN1FVRkZNVVFzWTBGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVTndRaXhsUVVGbExFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03TzBGQlJURkVMR05CUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGRGJFSXNZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenM3UVVGSGRFUXNZMEZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWU3hMUVVGTExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOdVJDeG5Ra0ZCU1N4blFrRkJaMElzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhIUVVGSExFTkJRVUVzUjBGQlNTeERRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRCUVVONFJTd3dRa0ZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlJ5eEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhuUWtGQlowSXNRMEZCUVN4SFFVRkpMRWxCUVUwc1EwRkJReXhEUVVGRE8xZEJReTlGT3pzN1FVRkhSQ3hqUVVGSkxHVkJRV1VzUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGREwwTXNaMEpCUVVrc2FVSkJRV2xDTEVkQlFVY3NXVUZCV1N4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4WlFVRlpMRVZCUVVVc1ZVRkJWU3hEUVVGRE96dEJRVVUzUWl4blFrRkJTU3hwUWtGQmFVSXNTMEZCU3l4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU51UkN4clFrRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNORUpCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMR05CUVdNc1EwRkJRenRCUVVOMFJDd3dRa0ZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEYkVNc1RVRkJUVHRCUVVOTUxEUkNRVUZaTEVkQlFVY3NZMEZCWXl4RFFVRkRPMEZCUXpsQ0xEQkNRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPMlZCUTJoQ08yRkJRMFlzVFVGQlRUdEJRVU5NTERCQ1FVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRM0pFTEhkQ1FVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8yRkJRMnhFT3p0QlFVVkVMR2RDUVVGSkxHOUNRVUZ2UWl4SFFVRkhMRmxCUVZrc1IwRkJSeXhsUVVGbExFTkJRVU03T3pzN1FVRkpNVVFzWjBKQlFVa3NZVUZCWVN4SFFVRkhMRU5CUVVNc1JVRkRia0lzYjBKQlFXOUNMRWxCUVVrc1lVRkJZU3hEUVVGRE96dEJRVVY0UXl4blFrRkJTU3hWUVVGVkxFZEJRVWNzUTBGQlF5eEZRVU5vUWl4dlFrRkJiMElzU1VGQlNTeFZRVUZWTEVOQlFVTTdPMEZCUlhKRExHZENRVUZKTEc5Q1FVRnZRaXhIUVVGSExFTkJRVU1zUlVGRE1VSXNiMEpCUVc5Q0xFZEJRVWNzUTBGQlF5eERRVUZET3pzN1FVRkhNMElzWjBKQlFVa3NaVUZCWlN4TFFVRkxMRU5CUVVNc1JVRkRka0lzWlVGQlpTeEhRVUZITEc5Q1FVRnZRaXhEUVVGRE96czdRVUZIZWtNc2VVSkJRV0VzU1VGQlNTeEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRzlDUVVGdlFpeERRVUZETzFkQlEzaEVPenM3UVVGSFJDeDVRa0ZCWlN4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRGNFTXNlVUpCUVdVc1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkhjRU1zZFVKQlFXRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRMmhETEhWQ1FVRmhMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF6czdPenM3UVVGTGFFTXNZMEZCU1N4aFFVRmhMRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRM0pDTERKQ1FVRmxMRWxCUVVrc1lVRkJZU3hEUVVGRE8wRkJRMnBETERKQ1FVRmxMRWxCUVVrc1lVRkJZU3hEUVVGRE8wRkJRMnBETEhWQ1FVRlhMRWxCUVVzc1lVRkJZU3hIUVVGSExHTkJRV01zUVVGQlF5eERRVUZETzFkQlEycEVMRTFCUVUwN1FVRkRUQ3gxUWtGQlZ5eEpRVUZMTEdGQlFXRXNSMEZCUnl4alFVRmpMRUZCUVVNc1EwRkJRenRYUVVOcVJEczdPMEZCUjBRc1kwRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVOQlFVTXNSVUZEZEVJc1pVRkJaU3hKUVVGSkxFTkJRVWNzU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGQkxFRkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGSGNFVXNZMEZCU1N4bFFVRmxMRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRM1pDTERKQ1FVRmxMRWxCUVVrc1pVRkJaU3hEUVVGRE8wRkJRMjVETERKQ1FVRmxMRWRCUVVjc1EwRkJReXhEUVVGRE8xZEJRM0pDT3p0QlFVVkVMR05CUVVrc1pVRkJaU3hIUVVGSExHVkJRV1VzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1JVRkRNVVFzWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hIUVVGSExHVkJRV1VzUTBGQlF6czdPMEZCUnpORUxHTkJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRWxCUVVrc1pVRkJaU3hIUVVGSExFTkJRVU1zUlVGQlJUczdRVUZGZUVNc1owSkJRVWtzV1VGQldTeEhRVUZITEZsQlFWa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVNM1F5eG5Ra0ZCU1N4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMR1ZCUVdVc1EwRkJRenRCUVVNdlJDeG5Ra0ZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMR1ZCUVdVc1EwRkJRenM3UVVGRmJFVXNaMEpCUVVrc1RVRkJUU3hIUVVGSExFOUJRVThzUjBGQlJ5eGxRVUZsTEVWQlFVVTdRVUZEZEVNc2EwSkJRVWtzVFVGQlRTeEhRVUZITEdWQlFXVXNTVUZCU1N4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGQkxFRkJRVU1zUTBGQlF6dEJRVU5zUkN4dlFrRkJUU3hKUVVGSkxFMUJRVTBzUTBGQlF6dEJRVU5xUWl4eFFrRkJUeXhKUVVGSkxFMUJRVTBzUTBGQlF6dGhRVU51UWpzN1FVRkZSQ3huUWtGQlNTeGhRVUZoTEVkQlFVY3NWMEZCVnl4SFFVRkhMRTFCUVUwc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4alFVRmpMRWRCUVVjc1YwRkJWeXhIUVVGSExHVkJRV1VzUTBGQlF6dEJRVU51UkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4alFVRmpMRWRCUVVjc1QwRkJUeXhEUVVGRE96dEJRVVZvUkN4M1FrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRenM3UVVGRmNFTXNkMEpCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVY3NSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVOdVJDeDNRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZET3p0QlFVVndSU3huUWtGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhoUVVGaExFVkJRMnhETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGYUVVc2QwSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNkVUpCUVhWQ0xFTkJRVU1zUTBGQlJ5eEZRVUZGTEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXk5RUxIZENRVUZaTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdPMEZCUjNSRExHZENRVUZKTEUxQlFVMHNSMEZCUnl4WlFVRlpMRU5CUVVNc2EwSkJRV3RDTEVWQlFVVXNRMEZCUXpzN1FVRkZMME1zYTBKQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU0xUWl4clFrRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVkQlFVY3NZMEZCWXl4RFFVRkRPMEZCUXpORExHdENRVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRemRDTEhkQ1FVRlpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zYTBKQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhGUVVGRkxHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6TkRMR3RDUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4bFFVRmxMRWRCUVVjc1kwRkJZeXhEUVVGRExFTkJRVU03VjBGRE4wUTdVMEZEUmpzN1FVRkZSQ3hsUVVGUExHRkJRV0VzUTBGQlF6dFBRVU4wUWpzN096dFRRVE5hUnl4aFFVRmhPMGRCUVZNc1ZVRkJWVHM3UVVFNFduUkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZESWl3aVptbHNaU0k2SW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFJSGR5YVhSMFpXNGdhVzRnUlVOTlFYTmpjbWx3ZENBMklDb3ZYRzR2S2lwY2JpQXFJRUJtYVd4bGIzWmxjblpwWlhjZ1YwRldSU0JoZFdScGJ5QnpiM1Z1WkNCelpXZHRaVzUwSUdWdVoybHVaVnh1SUNvZ1FHRjFkR2h2Y2lCT2IzSmlaWEowTGxOamFHNWxiR3hBYVhKallXMHVabklzSUZacFkzUnZjaTVUWVdsNlFHbHlZMkZ0TG1aeUxDQkxZWEpwYlM1Q1lYSnJZWFJwUUdseVkyRnRMbVp5WEc0Z0tpOWNibHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzUyWVhJZ1ZHbHRaVVZ1WjJsdVpTQTlJSEpsY1hWcGNtVW9YQ0l1TGk5amIzSmxMM1JwYldVdFpXNW5hVzVsWENJcE8xeHVYRzVtZFc1amRHbHZiaUJuWlhSRGRYSnlaVzUwVDNKUWNtVjJhVzkxYzBsdVpHVjRLSE52Y25SbFpFRnljbUY1TENCMllXeDFaU3dnYVc1a1pYZ2dQU0F3S1NCN1hHNGdJSFpoY2lCemFYcGxJRDBnYzI5eWRHVmtRWEp5WVhrdWJHVnVaM1JvTzF4dVhHNGdJR2xtSUNoemFYcGxJRDRnTUNrZ2UxeHVJQ0FnSUhaaGNpQm1hWEp6ZEZaaGJDQTlJSE52Y25SbFpFRnljbUY1V3pCZE8xeHVJQ0FnSUhaaGNpQnNZWE4wVm1Gc0lEMGdjMjl5ZEdWa1FYSnlZWGxiYzJsNlpTQXRJREZkTzF4dVhHNGdJQ0FnYVdZZ0tIWmhiSFZsSUR3Z1ptbHljM1JXWVd3cFhHNGdJQ0FnSUNCcGJtUmxlQ0E5SUMweE8xeHVJQ0FnSUdWc2MyVWdhV1lnS0haaGJIVmxJRDQ5SUd4aGMzUldZV3dwWEc0Z0lDQWdJQ0JwYm1SbGVDQTlJSE5wZW1VZ0xTQXhPMXh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnYVdZZ0tHbHVaR1Y0SUR3Z01DQjhmQ0JwYm1SbGVDQStQU0J6YVhwbEtWeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlFMWhkR2d1Wm14dmIzSW9LSE5wZW1VZ0xTQXhLU0FxSUNoMllXeDFaU0F0SUdacGNuTjBWbUZzS1NBdklDaHNZWE4wVm1Gc0lDMGdabWx5YzNSV1lXd3BLVHRjYmx4dUlDQWdJQ0FnZDJocGJHVWdLSE52Y25SbFpFRnljbUY1VzJsdVpHVjRYU0ErSUhaaGJIVmxLVnh1SUNBZ0lDQWdJQ0JwYm1SbGVDMHRPMXh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9jMjl5ZEdWa1FYSnlZWGxiYVc1a1pYZ2dLeUF4WFNBOFBTQjJZV3gxWlNsY2JpQWdJQ0FnSUNBZ2FXNWtaWGdyS3p0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYVc1a1pYZzdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHZGxkRU4xY25KbGJuUlBjazVsZUhSSmJtUmxlQ2h6YjNKMFpXUkJjbkpoZVN3Z2RtRnNkV1VzSUdsdVpHVjRJRDBnTUNrZ2UxeHVJQ0IyWVhJZ2MybDZaU0E5SUhOdmNuUmxaRUZ5Y21GNUxteGxibWQwYUR0Y2JseHVJQ0JwWmlBb2MybDZaU0ErSURBcElIdGNiaUFnSUNCMllYSWdabWx5YzNSV1lXd2dQU0J6YjNKMFpXUkJjbkpoZVZzd1hUdGNiaUFnSUNCMllYSWdiR0Z6ZEZaaGJDQTlJSE52Y25SbFpFRnljbUY1VzNOcGVtVWdMU0F4WFR0Y2JseHVJQ0FnSUdsbUlDaDJZV3gxWlNBOFBTQm1hWEp6ZEZaaGJDbGNiaUFnSUNBZ0lHbHVaR1Y0SUQwZ01EdGNiaUFnSUNCbGJITmxJR2xtSUNoMllXeDFaU0ErUFNCc1lYTjBWbUZzS1Z4dUlDQWdJQ0FnYVc1a1pYZ2dQU0J6YVhwbE8xeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRHdnTUNCOGZDQnBibVJsZUNBK1BTQnphWHBsS1Z4dUlDQWdJQ0FnSUNCcGJtUmxlQ0E5SUUxaGRHZ3VabXh2YjNJb0tITnBlbVVnTFNBeEtTQXFJQ2gyWVd4MVpTQXRJR1pwY25OMFZtRnNLU0F2SUNoc1lYTjBWbUZzSUMwZ1ptbHljM1JXWVd3cEtUdGNibHh1SUNBZ0lDQWdkMmhwYkdVZ0tITnZjblJsWkVGeWNtRjVXMmx1WkdWNFhTQThJSFpoYkhWbEtWeHVJQ0FnSUNBZ0lDQnBibVJsZUNzck8xeHVYRzRnSUNBZ0lDQjNhR2xzWlNBb2MyOXlkR1ZrUVhKeVlYbGJhVzVrWlhnZ0t5QXhYU0ErUFNCMllXeDFaU2xjYmlBZ0lDQWdJQ0FnYVc1a1pYZ3RMVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdhVzVrWlhnN1hHNTlYRzVjYmk4cUtseHVJQ29nUUdOc1lYTnpJRk5sWjIxbGJuUkZibWRwYm1WY2JpQXFMMXh1WTJ4aGMzTWdVMlZuYldWdWRFVnVaMmx1WlNCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nUUdOdmJuTjBjblZqZEc5eVhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhWa2FXOUNkV1ptWlhKOUlHSjFabVpsY2lCcGJtbDBhV0ZzSUdGMVpHbHZJR0oxWm1abGNpQm1iM0lnWjNKaGJuVnNZWElnYzNsdWRHaGxjMmx6WEc0Z0lDQXFYRzRnSUNBcUlGUm9aU0JsYm1kcGJtVWdhVzF3YkdWdFpXNTBjeUIwYUdVZ1hDSnpZMmhsWkhWc1pXUmNJaUJoYm1RZ1hDSjBjbUZ1YzNCdmNuUmxaRndpSUdsdWRHVnlabUZqWlhNdVhHNGdJQ0FxSUZkb1pXNGdYQ0p6WTJobFpIVnNaV1JjSWl3Z2RHaGxJR1Z1WjJsdVpTQWdaMlZ1WlhKaGRHVnpJSE5sWjIxbGJuUnpJRzF2Y21VZ2IzSWdiR1Z6YzhLZ2NHVnlhVzlrYVdOaGJHeDVYRzRnSUNBcUlDaGpiMjUwY205c2JHVmtJR0o1SUhSb1pTQndaWEpwYjJSQlluTXNJSEJsY21sdlpGSmxiQ3dnWVc1a0lIQmxjbWx2Vm1GeUlHRjBkSEpwWW5WMFpYTXBMbHh1SUNBZ0tpQlhhR1Z1SUZ3aWRISmhibk53YjNKMFpXUmNJaXdnZEdobElHVnVaMmx1WlNCblpXNWxjbUYwWlhNZ2MyVm5iV1Z1ZEhNZ1lYUWdkR2hsSUhCdmMybDBhVzl1SUc5bUlIUm9aV2x5SUc5dWMyVjBJSFJwYldVdVhHNGdJQ0FxTDF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRXUnBieUJpZFdabVpYSmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1FYVmthVzlDZFdabVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVpZFdabVpYSWdQU0J2Y0hScGIyNXpMbUoxWm1abGNpQjhmQ0J1ZFd4c08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdjMlZuYldWdWRDQndaWEpwYjJRZ2FXNGdjMlZqWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbkJsY21sdlpFRmljeUE5SUc5d2RHbHZibk11Y0dWeWFXOWtRV0p6SUh4OElEQXVNVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZObFoyMWxiblFnY0dWeWFXOWtJSEpsYkdGMGFYWmxJSFJ2SUdsdWRHVnlMWE5sWjIxbGJuUWdaR2x6ZEdGdVkyVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNHVnlhVzlrVW1Wc0lEMGdiM0IwYVc5dWN5NXdaWEpwYjJSU1pXd2dmSHdnTUR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFRnRiM1YwSUc5bUlISmhibVJ2YlNCelpXZHRaVzUwSUhCbGNtbHZaQ0IyWVhKcFlYUnBiMjRnY21Wc1lYUnBkbVVnZEc4Z2MyVm5iV1Z1ZENCd1pYSnBiMlJjYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVjR1Z5YVc5a1ZtRnlJRDBnYjNCMGFXOXVjeTV3WlhKcGIyUldZWElnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUZ5Y21GNUlHOW1JSE5sWjIxbGJuUWdjRzl6YVhScGIyNXpJQ2h2Ym5ObGRDQjBhVzFsY3lCcGJpQmhkV1JwYnlCaWRXWm1aWElwSUdsdUlITmxZMXh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXdiM05wZEdsdmJrRnljbUY1SUQwZ2IzQjBhVzl1Y3k1d2IzTnBkR2x2YmtGeWNtRjVJSHg4SUZzd0xqQmRPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUVcxdmRYUWdiMllnY21GdVpHOXRJSE5sWjIxbGJuUWdjRzl6YVhScGIyNGdkbUZ5YVdGMGFXOXVJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d2IzTnBkR2x2YmxaaGNpQTlJRzl3ZEdsdmJuTXVjRzl6YVhScGIyNVdZWElnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUZ5Y21GNUlHOW1JSE5sWjIxbGJuUWdaSFZ5WVhScGIyNXpJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1a2RYSmhkR2x2YmtGeWNtRjVJRDBnYjNCMGFXOXVjeTVrZFhKaGRHbHZia0Z5Y21GNUlIeDhJRnN3TGpCZE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdjMlZuYldWdWRDQmtkWEpoZEdsdmJpQnBiaUJ6WldOY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VG5WdFltVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WkhWeVlYUnBiMjVCWW5NZ1BTQnZjSFJwYjI1ekxtUjFjbUYwYVc5dVFXSnpJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlRaV2R0Wlc1MElHUjFjbUYwYVc5dUlISmxiR0YwYVhabElIUnZJR2RwZG1WdUlITmxaMjFsYm5RZ1pIVnlZWFJwYjI0Z2IzSWdhVzUwWlhJdGMyVm5iV1Z1ZENCa2FYTjBZVzVqWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVrZFhKaGRHbHZibEpsYkNBOUlHOXdkR2x2Ym5NdVpIVnlZWFJwYjI1U1pXd2dmSHdnTVR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFRnljbUY1SUc5bUlITmxaMjFsYm5RZ2IyWm1jMlYwY3lCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ2IyWm1jMlYwSUQ0Z01Eb2dkR2hsSUhObFoyMWxiblFuY3lCeVpXWmxjbVZ1WTJVZ2NHOXphWFJwYjI0Z2FYTWdZV1owWlhJZ2RHaGxJR2RwZG1WdUlITmxaMjFsYm5RZ2NHOXphWFJwYjI1Y2JpQWdJQ0FnS2lCdlptWnpaWFFnUENBd09pQjBhR1VnWjJsMlpXNGdjMlZuYldWdWRDQndiM05wZEdsdmJpQnBjeUIwYUdVZ2MyVm5iV1Z1ZENkeklISmxabVZ5Wlc1alpTQndiM05wZEdsdmJpQmhibVFnZEdobElHUjFjbUYwYVc5dUlHaGhjeUIwYnlCaVpTQmpiM0p5WldOMFpXUWdZbmtnZEdobElHOW1abk5sZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWIyWm1jMlYwUVhKeVlYa2dQU0J2Y0hScGIyNXpMbTltWm5ObGRFRnljbUY1SUh4OElGc3dMakJkTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FXSnpiMngxZEdVZ2MyVm5iV1Z1ZENCdlptWnpaWFFnYVc0Z2MyVmpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtOW1abk5sZEVGaWN5QTlJRzl3ZEdsdmJuTXViMlptYzJWMFFXSnpJSHg4SUMwd0xqQXdOVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZObFoyMWxiblFnYjJabWMyVjBJSEpsYkdGMGFYWmxJSFJ2SUhObFoyMWxiblFnWkhWeVlYUnBiMjVjYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXViMlptYzJWMFVtVnNJRDBnYjNCMGFXOXVjeTV2Wm1aelpYUlNaV3dnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlJwYldVZ1lua2dkMmhwWTJnZ1lXeHNJSE5sWjIxbGJuUnpJR0Z5WlNCa1pXeGhlV1ZrSUNobGMzQmxZMmxoYkd4NUlIUnZJSEpsWVd4cGVtVWdjMlZuYldWdWRDQnZabVp6WlhSektWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1a1pXeGhlU0E5SUc5d2RHbHZibk11WkdWc1lYa2dmSHdnTUM0d01EVTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJCWW5OdmJIVjBaU0JoZEhSaFkyc2dkR2x0WlNCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVZWFIwWVdOclFXSnpJRDBnYjNCMGFXOXVjeTVoZEhSaFkydEJZbk1nZkh3Z01DNHdNRFU3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRIUmhZMnNnZEdsdFpTQnlaV3hoZEdsMlpTQjBieUJ6WldkdFpXNTBJR1IxY21GMGFXOXVYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtRjBkR0ZqYTFKbGJDQTlJRzl3ZEdsdmJuTXVZWFIwWVdOclVtVnNJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkJZbk52YkhWMFpTQnlaV3hsWVhObElIUnBiV1VnYVc0Z2MyVmpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxuSmxiR1ZoYzJWQlluTWdQU0J2Y0hScGIyNXpMbkpsYkdWaGMyVkJZbk1nZkh3Z01DNHdNRFU3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCU1pXeGxZWE5sSUhScGJXVWdjbVZzWVhScGRtVWdkRzhnYzJWbmJXVnVkQ0JrZFhKaGRHbHZibHh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaV3hsWVhObFVtVnNJRDBnYjNCMGFXOXVjeTV5Wld4bFlYTmxVbVZzSUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJUWldkdFpXNTBJSEpsYzJGdGNHeHBibWNnYVc0Z1kyVnVkRnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaWE5oYlhCc2FXNW5JRDBnYjNCMGFXOXVjeTV5WlhOaGJYQnNhVzVuSUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJCYlc5MWRDQnZaaUJ5WVc1a2IyMGdjbVZ6WVcxd2JHbHVaeUIyWVhKcFlYUnBiMjRnYVc0Z1kyVnVkRnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaWE5oYlhCc2FXNW5WbUZ5SUQwZ2IzQjBhVzl1Y3k1eVpYTmhiWEJzYVc1blZtRnlJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkpibVJsZUNCdlpseHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1elpXZHRaVzUwU1c1a1pYZ2dQU0J2Y0hScGIyNXpMbk5sWjIxbGJuUkpibVJsZUNCOGZDQXdPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVjJobGRHaGxjaUIwYUdVZ1lYVmthVzhnWW5WbVptVnlJR0Z1WkNCelpXZHRaVzUwSUdsdVpHbGpaWE1nWVhKbElHTnZibk5wWkdWeVpXUWdZWE1nWTNsamJHbGpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwSnZiMng5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amVXTnNhV01nUFNCdmNIUnBiMjV6TG1ONVkyeHBZeUI4ZkNCbVlXeHpaVHRjYmlBZ0lDQjBhR2x6TGw5ZlkzbGpiR2xqVDJabWMyVjBJRDBnTUR0Y2JseHVJQ0FnSUhSb2FYTXVYMTluWVdsdVRtOWtaU0E5SUdGMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJR2RsZENCaWRXWm1aWEpFZFhKaGRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2k1M2NtRndRWEp2ZFc1a1JYaDBaVzUwYVc5dUtWeHVJQ0FnSUNBZ1luVm1abVZ5UkhWeVlYUnBiMjRnTFQwZ2RHaHBjeTVpZFdabVpYSXVkM0poY0VGeWIzVnVaRVY0ZEdWdWRHbHZianRjYmx4dUlDQWdJSEpsZEhWeWJpQmlkV1ptWlhKRWRYSmhkR2x2Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRlJwYldWRmJtZHBibVVnYldWMGFHOWtJQ2gwY21GdWMzQnZjblJsWkNCcGJuUmxjbVpoWTJVcFhHNGdJR0ZrZG1GdVkyVlVhVzFsS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFXMWxJQ3NnZEdocGN5NTBjbWxuWjJWeUtIUnBiV1VwTzF4dUlDQjlYRzVjYmlBZ0x5OGdWR2x0WlVWdVoybHVaU0J0WlhSb2IyUWdLSFJ5WVc1emNHOXlkR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdjM2x1WTFCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJSFJvYVhNdWMyVm5iV1Z1ZEVsdVpHVjRPMXh1SUNBZ0lIWmhjaUJqZVdOc2FXTlBabVp6WlhRZ1BTQXdPMXh1SUNBZ0lIWmhjaUJpZFdabVpYSkVkWEpoZEdsdmJpQTlJSFJvYVhNdVluVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVqZVdOc2FXTXBJSHRjYmlBZ0lDQWdJSFpoY2lCamVXTnNaWE1nUFNCd2IzTnBkR2x2YmlBdklHSjFabVpsY2tSMWNtRjBhVzl1TzF4dVhHNGdJQ0FnSUNCamVXTnNhV05QWm1aelpYUWdQU0JOWVhSb0xtWnNiMjl5S0dONVkyeGxjeWtnS2lCaWRXWm1aWEpFZFhKaGRHbHZianRjYmlBZ0lDQWdJSEJ2YzJsMGFXOXVJQzA5SUdONVkyeHBZMDltWm5ObGREdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JwYm1SbGVDQTlJR2RsZEVOMWNuSmxiblJQY2s1bGVIUkpibVJsZUNoMGFHbHpMbkJ2YzJsMGFXOXVRWEp5WVhrc0lIQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRDQ5SUhSb2FYTXVjRzl6YVhScGIyNUJjbkpoZVM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2FXNWtaWGdnUFNBd08xeHVJQ0FnSUNBZ0lDQmplV05zYVdOUFptWnpaWFFnS3owZ1luVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtTjVZMnhwWXlsY2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1NXNW1hVzVwZEhrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNCbGJITmxJR2xtSUNoemNHVmxaQ0E4SURBcElIdGNiaUFnSUNBZ0lHbHVaR1Y0SUQwZ1oyVjBRM1Z5Y21WdWRFOXlVSEpsZG1sdmRYTkpibVJsZUNoMGFHbHpMbkJ2YzJsMGFXOXVRWEp5WVhrc0lIQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRHdnTUNrZ2UxeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVTNXNaVzVuZEdnZ0xTQXhPMXh1SUNBZ0lDQWdJQ0JqZVdOc2FXTlBabVp6WlhRZ0xUMGdZblZtWm1WeVJIVnlZWFJwYjI0N1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbU41WTJ4cFl5bGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdMVWx1Wm1sdWFYUjVPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpXZHRaVzUwU1c1a1pYZ2dQU0JwYm1SbGVEdGNiaUFnSUNCMGFHbHpMbDlmWTNsamJHbGpUMlptYzJWMElEMGdZM2xqYkdsalQyWm1jMlYwTzF4dVhHNGdJQ0FnY21WMGRYSnVJR041WTJ4cFkwOW1abk5sZENBcklIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVWdHBibVJsZUYwN1hHNGdJSDFjYmx4dUlDQXZMeUJVYVcxbFJXNW5hVzVsSUcxbGRHaHZaQ0FvZEhKaGJuTndiM0owWldRZ2FXNTBaWEptWVdObEtWeHVJQ0JoWkhaaGJtTmxVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ2RHaHBjeTV6WldkdFpXNTBTVzVrWlhnN1hHNGdJQ0FnZG1GeUlHTjVZMnhwWTA5bVpuTmxkQ0E5SUhSb2FYTXVYMTlqZVdOc2FXTlBabVp6WlhRN1hHNWNiaUFnSUNCMGFHbHpMblJ5YVdkblpYSW9kR2x0WlNrN1hHNWNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JwYm1SbGVDc3JPMXh1WEc0Z0lDQWdJQ0JwWmlBb2FXNWtaWGdnUGowZ2RHaHBjeTV3YjNOcGRHbHZia0Z5Y21GNUxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlEQTdYRzRnSUNBZ0lDQWdJR041WTJ4cFkwOW1abk5sZENBclBTQjBhR2x6TG1KMVptWmxja1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1amVXTnNhV01wWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUVsdVptbHVhWFI1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnBibVJsZUMwdE8xeHVYRzRnSUNBZ0lDQnBaaUFvYVc1a1pYZ2dQQ0F3S1NCN1hHNGdJQ0FnSUNBZ0lHbHVaR1Y0SUQwZ2RHaHBjeTV3YjNOcGRHbHZia0Z5Y21GNUxteGxibWQwYUNBdElERTdYRzRnSUNBZ0lDQWdJR041WTJ4cFkwOW1abk5sZENBdFBTQjBhR2x6TG1KMVptWmxja1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1amVXTnNhV01wWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUMxSmJtWnBibWwwZVR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxuTmxaMjFsYm5SSmJtUmxlQ0E5SUdsdVpHVjRPMXh1SUNBZ0lIUm9hWE11WDE5amVXTnNhV05QWm1aelpYUWdQU0JqZVdOc2FXTlBabVp6WlhRN1hHNWNiaUFnSUNCeVpYUjFjbTRnWTNsamJHbGpUMlptYzJWMElDc2dkR2hwY3k1d2IzTnBkR2x2YmtGeWNtRjVXMmx1WkdWNFhUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJUWlhRZ1oyRnBibHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2RtRnNkV1VnYkdsdVpXRnlJR2RoYVc0Z1ptRmpkRzl5WEc0Z0lDQXFMMXh1SUNCelpYUWdaMkZwYmloMllXeDFaU2tnZTF4dUlDQWdJSFJvYVhNdVgxOW5ZV2x1VG05a1pTNW5ZV2x1TG5aaGJIVmxJRDBnZG1Gc2RXVTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUjJWMElHZGhhVzVjYmlBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQmpkWEp5Wlc1MElHZGhhVzVjYmlBZ0lDb3ZYRzRnSUdkbGRDQm5ZV2x1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZaMkZwYms1dlpHVXVaMkZwYmk1MllXeDFaVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCVWNtbG5aMlZ5SUdFZ2MyVm5iV1Z1ZEZ4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZWFZrYVc5VWFXMWxJSE5sWjIxbGJuUWdjM2x1ZEdobGMybHpJR0YxWkdsdklIUnBiV1ZjYmlBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQndaWEpwYjJRZ2RHOGdibVY0ZENCelpXZHRaVzUwWEc0Z0lDQXFYRzRnSUNBcUlGUm9hWE1nWm5WdVkzUnBiMjRnWTJGdUlHSmxJR05oYkd4bFpDQmhkQ0JoYm5rZ2RHbHRaU0FvZDJobGRHaGxjaUIwYUdVZ1pXNW5hVzVsSUdseklITmphR1ZrZFd4bFpDOTBjbUZ1YzNCdmNuUmxaQ0J2Y2lCdWIzUXBYRzRnSUNBcUlIUnZJR2RsYm1WeVlYUmxJR0VnYzJsdVoyeGxJSE5sWjIxbGJuUWdZV05qYjNKa2FXNW5JSFJ2SUhSb1pTQmpkWEp5Wlc1MElITmxaMjFsYm5RZ2NHRnlZVzFsZEdWeWN5NWNiaUFnSUNvdlhHNGdJSFJ5YVdkblpYSW9ZWFZrYVc5VWFXMWxLU0I3WEc0Z0lDQWdkbUZ5SUdGMVpHbHZRMjl1ZEdWNGRDQTlJSFJvYVhNdVlYVmthVzlEYjI1MFpYaDBPMXh1SUNBZ0lIWmhjaUJ6WldkdFpXNTBWR2x0WlNBOUlHRjFaR2x2VkdsdFpTQjhmQ0JoZFdScGIwTnZiblJsZUhRdVkzVnljbVZ1ZEZScGJXVWdLeUIwYUdsekxtUmxiR0Y1TzF4dUlDQWdJSFpoY2lCelpXZHRaVzUwVUdWeWFXOWtJRDBnZEdocGN5NXdaWEpwYjJSQlluTTdYRzRnSUNBZ2RtRnlJSE5sWjIxbGJuUkpibVJsZUNBOUlIUm9hWE11YzJWbmJXVnVkRWx1WkdWNE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVluVm1abVZ5S1NCN1hHNGdJQ0FnSUNCMllYSWdjMlZuYldWdWRGQnZjMmwwYVc5dUlEMGdNQzR3TzF4dUlDQWdJQ0FnZG1GeUlITmxaMjFsYm5SRWRYSmhkR2x2YmlBOUlEQXVNRHRjYmlBZ0lDQWdJSFpoY2lCelpXZHRaVzUwVDJabWMyVjBJRDBnTUM0d08xeHVJQ0FnSUNBZ2RtRnlJSEpsYzJGdGNHeHBibWRTWVhSbElEMGdNUzR3TzF4dUlDQWdJQ0FnZG1GeUlHSjFabVpsY2tSMWNtRjBhVzl1SUQwZ2RHaHBjeTVpZFdabVpYSkVkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZM2xqYkdsaktWeHVJQ0FnSUNBZ0lDQnpaV2R0Wlc1MFNXNWtaWGdnUFNCelpXZHRaVzUwU1c1a1pYZ2dKU0IwYUdsekxuQnZjMmwwYVc5dVFYSnlZWGt1YkdWdVozUm9PMXh1SUNBZ0lDQWdaV3h6WlZ4dUlDQWdJQ0FnSUNCelpXZHRaVzUwU1c1a1pYZ2dQU0JOWVhSb0xtMWhlQ2d3TENCTllYUm9MbTFwYmloelpXZHRaVzUwU1c1a1pYZ3NJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlUzVzWlc1bmRHZ2dMU0F4S1NrN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuQnZjMmwwYVc5dVFYSnlZWGtwWEc0Z0lDQWdJQ0FnSUhObFoyMWxiblJRYjNOcGRHbHZiaUE5SUhSb2FYTXVjRzl6YVhScGIyNUJjbkpoZVZ0elpXZHRaVzUwU1c1a1pYaGRJSHg4SURBN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtUjFjbUYwYVc5dVFYSnlZWGtwWEc0Z0lDQWdJQ0FnSUhObFoyMWxiblJFZFhKaGRHbHZiaUE5SUhSb2FYTXVaSFZ5WVhScGIyNUJjbkpoZVZ0elpXZHRaVzUwU1c1a1pYaGRJSHg4SURBN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOW1abk5sZEVGeWNtRjVLVnh1SUNBZ0lDQWdJQ0J6WldkdFpXNTBUMlptYzJWMElEMGdkR2hwY3k1dlptWnpaWFJCY25KaGVWdHpaV2R0Wlc1MFNXNWtaWGhkSUh4OElEQTdYRzVjYmlBZ0lDQWdJQzh2SUdOaGJHTjFiR0YwWlNCeVpYTmhiWEJzYVc1blhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1eVpYTmhiWEJzYVc1bklDRTlQU0F3SUh4OElIUm9hWE11Y21WellXMXdiR2x1WjFaaGNpQStJREFwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJSEpoYm1SdmJWSmxjMkZ0Y0d4cGJtY2dQU0FvVFdGMGFDNXlZVzVrYjIwb0tTQXRJREF1TlNrZ0tpQXlMakFnS2lCMGFHbHpMbkpsYzJGdGNHeHBibWRXWVhJN1hHNGdJQ0FnSUNBZ0lISmxjMkZ0Y0d4cGJtZFNZWFJsSUQwZ1RXRjBhQzV3YjNjb01pNHdMQ0FvZEdocGN5NXlaWE5oYlhCc2FXNW5JQ3NnY21GdVpHOXRVbVZ6WVcxd2JHbHVaeWtnTHlBeE1qQXdMakFwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmpZV3hqZFd4aGRHVWdhVzUwWlhJdGMyVm5iV1Z1ZENCa2FYTjBZVzVqWlZ4dUlDQWdJQ0FnYVdZZ0tITmxaMjFsYm5SRWRYSmhkR2x2YmlBOVBUMGdNQ0I4ZkNCMGFHbHpMbkJsY21sdlpGSmxiQ0ErSURBcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUc1bGVIUlRaV2RsYldWdWRFbHVaR1Y0SUQwZ2MyVm5iV1Z1ZEVsdVpHVjRJQ3NnTVR0Y2JpQWdJQ0FnSUNBZ2RtRnlJRzVsZUhSUWIzTnBkR2x2Yml3Z2JtVjRkRTltWm5ObGREdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2JtVjRkRk5sWjJWdFpXNTBTVzVrWlhnZ1BUMDlJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlUzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1amVXTnNhV01wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVWc3dYU0FySUdKMVptWmxja1IxY21GMGFXOXVPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JtVjRkRTltWm5ObGRDQTlJSFJvYVhNdWIyWm1jMlYwUVhKeVlYbGJNRjA3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlHSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQWdJQ0FnSUNBZ0lDQWdibVY0ZEU5bVpuTmxkQ0E5SURBN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlVnR1WlhoMFUyVm5aVzFsYm5SSmJtUmxlRjA3WEc0Z0lDQWdJQ0FnSUNBZ2JtVjRkRTltWm5ObGRDQTlJSFJvYVhNdWIyWm1jMlYwUVhKeVlYbGJibVY0ZEZObFoyVnRaVzUwU1c1a1pYaGRPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RtRnlJR2x1ZEdWeVUyVm5iV1Z1ZEVScGMzUmhibU5sSUQwZ2JtVjRkRkJ2YzJsMGFXOXVJQzBnYzJWbmJXVnVkRkJ2YzJsMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUM4dklHTnZjbkpsWTNRZ2FXNTBaWEl0YzJWbmJXVnVkQ0JrYVhOMFlXNWpaU0JpZVNCdlptWnpaWFJ6WEc0Z0lDQWdJQ0FnSUM4dklDQWdiMlptYzJWMElENGdNRG9nZEdobElITmxaMjFsYm5RbmN5QnlaV1psY21WdVkyVWdjRzl6YVhScGIyNGdhWE1nWVdaMFpYSWdkR2hsSUdkcGRtVnVJSE5sWjIxbGJuUWdjRzl6YVhScGIyNWNiaUFnSUNBZ0lDQWdhV1lnS0hObFoyMWxiblJQWm1aelpYUWdQaUF3S1Z4dUlDQWdJQ0FnSUNBZ0lHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxJQzA5SUhObFoyMWxiblJQWm1aelpYUTdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tHNWxlSFJQWm1aelpYUWdQaUF3S1Z4dUlDQWdJQ0FnSUNBZ0lHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxJQ3M5SUc1bGVIUlBabVp6WlhRN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0dsdWRHVnlVMlZuYldWdWRFUnBjM1JoYm1ObElEd2dNQ2xjYmlBZ0lDQWdJQ0FnSUNCcGJuUmxjbE5sWjIxbGJuUkVhWE4wWVc1alpTQTlJREE3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdkWE5sSUdsdWRHVnlMWE5sWjIxbGJuUWdaR2x6ZEdGdVkyVWdhVzV6ZEdWaFpDQnZaaUJ6WldkdFpXNTBJR1IxY21GMGFXOXVYRzRnSUNBZ0lDQWdJR2xtSUNoelpXZHRaVzUwUkhWeVlYUnBiMjRnUFQwOUlEQXBYRzRnSUNBZ0lDQWdJQ0FnYzJWbmJXVnVkRVIxY21GMGFXOXVJRDBnYVc1MFpYSlRaV2R0Wlc1MFJHbHpkR0Z1WTJVN1hHNWNiaUFnSUNBZ0lDQWdMeThnWTJGc1kzVnNZWFJsSUhCbGNtbHZaQ0J5Wld4aGRHbDJaU0IwYnlCcGJuUmxjaUJ0WVhKclpYSWdaR2x6ZEdGdVkyVmNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQmxjbWx2WkNBclBTQjBhR2x6TG5CbGNtbHZaRkpsYkNBcUlHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCaFpHUWdjbVZzWVhScGRtVWdZVzVrSUdGaWMyOXNkWFJsSUhObFoyMWxiblFnWkhWeVlYUnBiMjVjYmlBZ0lDQWdJSE5sWjIxbGJuUkVkWEpoZEdsdmJpQXFQU0IwYUdsekxtUjFjbUYwYVc5dVVtVnNPMXh1SUNBZ0lDQWdjMlZuYldWdWRFUjFjbUYwYVc5dUlDczlJSFJvYVhNdVpIVnlZWFJwYjI1QlluTTdYRzVjYmlBZ0lDQWdJQzh2SUdGa1pDQnlaV3hoZEdsMlpTQmhibVFnWVdKemIyeDFkR1VnYzJWbmJXVnVkQ0J2Wm1aelpYUmNiaUFnSUNBZ0lITmxaMjFsYm5SUFptWnpaWFFnS2owZ2RHaHBjeTV2Wm1aelpYUlNaV3c3WEc0Z0lDQWdJQ0J6WldkdFpXNTBUMlptYzJWMElDczlJSFJvYVhNdWIyWm1jMlYwUVdKek8xeHVYRzRnSUNBZ0lDQXZMeUJoY0hCc2VTQnpaV2R0Wlc1MElHOW1abk5sZEZ4dUlDQWdJQ0FnTHk4Z0lDQnZabVp6WlhRZ1BpQXdPaUIwYUdVZ2MyVm5iV1Z1ZENkeklISmxabVZ5Wlc1alpTQndiM05wZEdsdmJpQnBjeUJoWm5SbGNpQjBhR1VnWjJsMlpXNGdjMlZuYldWdWRDQndiM05wZEdsdmJseHVJQ0FnSUNBZ0x5OGdJQ0J2Wm1aelpYUWdQQ0F3T2lCMGFHVWdaMmwyWlc0Z2MyVm5iV1Z1ZENCd2IzTnBkR2x2YmlCcGN5QjBhR1VnYzJWbmJXVnVkQ2R6SUhKbFptVnlaVzVqWlNCd2IzTnBkR2x2YmlCaGJtUWdkR2hsSUdSMWNtRjBhVzl1SUdoaGN5QjBieUJpWlNCamIzSnlaV04wWldRZ1lua2dkR2hsSUc5bVpuTmxkRnh1SUNBZ0lDQWdhV1lnS0hObFoyMWxiblJQWm1aelpYUWdQQ0F3S1NCN1hHNGdJQ0FnSUNBZ0lITmxaMjFsYm5SRWRYSmhkR2x2YmlBdFBTQnpaV2R0Wlc1MFQyWm1jMlYwTzF4dUlDQWdJQ0FnSUNCelpXZHRaVzUwVUc5emFYUnBiMjRnS3owZ2MyVm5iV1Z1ZEU5bVpuTmxkRHRjYmlBZ0lDQWdJQ0FnYzJWbmJXVnVkRlJwYldVZ0t6MGdLSE5sWjIxbGJuUlBabVp6WlhRZ0x5QnlaWE5oYlhCc2FXNW5VbUYwWlNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCelpXZHRaVzUwVkdsdFpTQXRQU0FvYzJWbmJXVnVkRTltWm5ObGRDQXZJSEpsYzJGdGNHeHBibWRTWVhSbEtUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnY21GdVpHOXRhWHBsSUhObFoyMWxiblFnY0c5emFYUnBiMjVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbkJ2YzJsMGFXOXVWbUZ5SUQ0Z01DbGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQnZjMmwwYVc5dUlDczlJREl1TUNBcUlDaE5ZWFJvTG5KaGJtUnZiU2dwSUMwZ01DNDFLU0FxSUhSb2FYTXVjRzl6YVhScGIyNVdZWEk3WEc1Y2JpQWdJQ0FnSUM4dklITm9iM0owWlc0Z1pIVnlZWFJwYjI0Z2IyWWdjMlZuYldWdWRITWdiM1psY2lCMGFHVWdaV1JuWlhNZ2IyWWdkR2hsSUdKMVptWmxjbHh1SUNBZ0lDQWdhV1lnS0hObFoyMWxiblJRYjNOcGRHbHZiaUE4SURBcElIdGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRFUjFjbUYwYVc5dUlDczlJSE5sWjIxbGJuUlFiM05wZEdsdmJqdGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQnZjMmwwYVc5dUlEMGdNRHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tITmxaMjFsYm5SUWIzTnBkR2x2YmlBcklITmxaMjFsYm5SRWRYSmhkR2x2YmlBK0lIUm9hWE11WW5WbVptVnlMbVIxY21GMGFXOXVLVnh1SUNBZ0lDQWdJQ0J6WldkdFpXNTBSSFZ5WVhScGIyNGdQU0IwYUdsekxtSjFabVpsY2k1a2RYSmhkR2x2YmlBdElITmxaMjFsYm5SUWIzTnBkR2x2Ymp0Y2JseHVJQ0FnSUNBZ0x5OGdiV0ZyWlNCelpXZHRaVzUwWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWVdsdUlENGdNQ0FtSmlCelpXZHRaVzUwUkhWeVlYUnBiMjRnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUcxaGEyVWdjMlZuYldWdWRDQmxiblpsYkc5d1pWeHVJQ0FnSUNBZ0lDQjJZWElnWlc1MlpXeHZjR1ZPYjJSbElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVWRoYVc0b0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdGMGRHRmpheUE5SUhSb2FYTXVZWFIwWVdOclFXSnpJQ3NnZEdocGN5NWhkSFJoWTJ0U1pXd2dLaUJ6WldkdFpXNTBSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQWdJSFpoY2lCeVpXeGxZWE5sSUQwZ2RHaHBjeTV5Wld4bFlYTmxRV0p6SUNzZ2RHaHBjeTV5Wld4bFlYTmxVbVZzSUNvZ2MyVm5iV1Z1ZEVSMWNtRjBhVzl1TzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2hoZEhSaFkyc2dLeUJ5Wld4bFlYTmxJRDRnYzJWbmJXVnVkRVIxY21GMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RtRnlJR1poWTNSdmNpQTlJSE5sWjIxbGJuUkVkWEpoZEdsdmJpQXZJQ2hoZEhSaFkyc2dLeUJ5Wld4bFlYTmxLVHRjYmlBZ0lDQWdJQ0FnSUNCaGRIUmhZMnNnS2owZ1ptRmpkRzl5TzF4dUlDQWdJQ0FnSUNBZ0lISmxiR1ZoYzJVZ0tqMGdabUZqZEc5eU8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZG1GeUlHRjBkR0ZqYTBWdVpGUnBiV1VnUFNCelpXZHRaVzUwVkdsdFpTQXJJR0YwZEdGamF6dGNiaUFnSUNBZ0lDQWdkbUZ5SUhObFoyMWxiblJGYm1SVWFXMWxJRDBnYzJWbmJXVnVkRlJwYldVZ0t5QnpaV2R0Wlc1MFJIVnlZWFJwYjI0N1hHNGdJQ0FnSUNBZ0lIWmhjaUJ5Wld4bFlYTmxVM1JoY25SVWFXMWxJRDBnYzJWbmJXVnVkRVZ1WkZScGJXVWdMU0J5Wld4bFlYTmxPMXh1WEc0Z0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNW5ZV2x1TG5aaGJIVmxJRDBnZEdocGN5NW5ZV2x1TzF4dVhHNGdJQ0FnSUNBZ0lHVnVkbVZzYjNCbFRtOWtaUzVuWVdsdUxuTmxkRlpoYkhWbFFYUlVhVzFsS0RBdU1Dd2djMlZuYldWdWRGUnBiV1VwTzF4dUlDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1c2FXNWxZWEpTWVcxd1ZHOVdZV3gxWlVGMFZHbHRaU2gwYUdsekxtZGhhVzRzSUdGMGRHRmphMFZ1WkZScGJXVXBPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHlaV3hsWVhObFUzUmhjblJVYVcxbElENGdZWFIwWVdOclJXNWtWR2x0WlNsY2JpQWdJQ0FnSUNBZ0lDQmxiblpsYkc5d1pVNXZaR1V1WjJGcGJpNXpaWFJXWVd4MVpVRjBWR2x0WlNoMGFHbHpMbWRoYVc0c0lISmxiR1ZoYzJWVGRHRnlkRlJwYldVcE8xeHVYRzRnSUNBZ0lDQWdJR1Z1ZG1Wc2IzQmxUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXVNQ3dnYzJWbmJXVnVkRVZ1WkZScGJXVXBPMXh1SUNBZ0lDQWdJQ0JsYm5abGJHOXdaVTV2WkdVdVkyOXVibVZqZENoMGFHbHpMbDlmWjJGcGJrNXZaR1VwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRzFoYTJVZ2MyOTFjbU5sWEc0Z0lDQWdJQ0FnSUhaaGNpQnpiM1Z5WTJVZ1BTQmhkV1JwYjBOdmJuUmxlSFF1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sS0NrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExtSjFabVpsY2lBOUlIUm9hWE11WW5WbVptVnlPMXh1SUNBZ0lDQWdJQ0J6YjNWeVkyVXVjR3hoZVdKaFkydFNZWFJsTG5aaGJIVmxJRDBnY21WellXMXdiR2x1WjFKaGRHVTdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNWpiMjV1WldOMEtHVnVkbVZzYjNCbFRtOWtaU2s3WEc0Z0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNWpiMjV1WldOMEtIUm9hWE11WDE5bllXbHVUbTlrWlNrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExuTjBZWEowS0hObFoyMWxiblJVYVcxbExDQnpaV2R0Wlc1MFVHOXphWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQnpiM1Z5WTJVdWMzUnZjQ2h6WldkdFpXNTBWR2x0WlNBcklITmxaMjFsYm5SRWRYSmhkR2x2YmlBdklISmxjMkZ0Y0d4cGJtZFNZWFJsS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdjMlZuYldWdWRGQmxjbWx2WkR0Y2JpQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmxaMjFsYm5SRmJtZHBibVU3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBzY2hlZHVsZXJzIHNob3VsZCBiZSBzaW5nbGV0b25zXG52YXIgU2NoZWR1bGVyID0gcmVxdWlyZShcIi4vc2NoZWR1bGVyXCIpO1xudmFyIFNpbXBsZVNjaGVkdWxlciA9IHJlcXVpcmUoXCIuL3NpbXBsZS1zY2hlZHVsZXJcIik7XG52YXIgc2NoZWR1bGVyID0gbnVsbDtcbnZhciBzaW1wbGVTY2hlZHVsZXIgPSBudWxsO1xuXG4vLyBzY2hlZHVsZXIgZmFjdG9yeVxubW9kdWxlLmV4cG9ydHMuZ2V0U2NoZWR1bGVyID0gZnVuY3Rpb24gKGF1ZGlvQ29udGV4dCkge1xuICBpZiAoc2NoZWR1bGVyID09PSBudWxsKSB7XG4gICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcihhdWRpb0NvbnRleHQsIHt9KTtcbiAgfVxuXG4gIHJldHVybiBzY2hlZHVsZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5nZXRTaW1wbGVTY2hlZHVsZXIgPSBmdW5jdGlvbiAoYXVkaW9Db250ZXh0KSB7XG4gIGlmIChzaW1wbGVTY2hlZHVsZXIgPT09IG51bGwpIHtcbiAgICBzaW1wbGVTY2hlZHVsZXIgPSBuZXcgU2ltcGxlU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCwge30pO1xuICB9XG5cbiAgcmV0dXJuIHNpbXBsZVNjaGVkdWxlcjtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN1FVRkZRU3hKUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNN1FVRkRka01zU1VGQlNTeGxRVUZsTEVkQlFVY3NUMEZCVHl4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVOQlFVTTdRVUZEY0VRc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzSkNMRWxCUVVrc1pVRkJaU3hIUVVGSExFbEJRVWtzUTBGQlF6czdPMEZCUnpOQ0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNXVUZCV1N4SFFVRkhMRlZCUVZNc1dVRkJXU3hGUVVGRk8wRkJRMjVFTEUxQlFVa3NVMEZCVXl4TFFVRkxMRWxCUVVrc1JVRkJSVHRCUVVOMFFpeGhRVUZUTEVkQlFVY3NTVUZCU1N4VFFVRlRMRU5CUVVNc1dVRkJXU3hGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlF6ZERPenRCUVVWRUxGTkJRVThzVTBGQlV5eERRVUZETzBOQlEyeENMRU5CUVVNN08wRkJSVVlzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFZRVUZUTEZsQlFWa3NSVUZCUlR0QlFVTjZSQ3hOUVVGSkxHVkJRV1VzUzBGQlN5eEpRVUZKTEVWQlFVVTdRVUZETlVJc2JVSkJRV1VzUjBGQlJ5eEpRVUZKTEdWQlFXVXNRMEZCUXl4WlFVRlpMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03UjBGRGVrUTdPMEZCUlVRc1UwRkJUeXhsUVVGbExFTkJRVU03UTBGRGVFSXNRMEZCUXlJc0ltWnBiR1VpT2lKbGN6WXZkWFJwYkhNdmNISnBiM0pwZEhrdGNYVmxkV1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmNiaTh2SUhOamFHVmtkV3hsY25NZ2MyaHZkV3hrSUdKbElITnBibWRzWlhSdmJuTmNiblpoY2lCVFkyaGxaSFZzWlhJZ1BTQnlaWEYxYVhKbEtDY3VMM05qYUdWa2RXeGxjaWNwTzF4dWRtRnlJRk5wYlhCc1pWTmphR1ZrZFd4bGNpQTlJSEpsY1hWcGNtVW9KeTR2YzJsdGNHeGxMWE5qYUdWa2RXeGxjaWNwTzF4dWRtRnlJSE5qYUdWa2RXeGxjaUE5SUc1MWJHdzdYRzUyWVhJZ2MybHRjR3hsVTJOb1pXUjFiR1Z5SUQwZ2JuVnNiRHRjYmx4dUx5OGdjMk5vWldSMWJHVnlJR1poWTNSdmNubGNibTF2WkhWc1pTNWxlSEJ2Y25SekxtZGxkRk5qYUdWa2RXeGxjaUE5SUdaMWJtTjBhVzl1S0dGMVpHbHZRMjl1ZEdWNGRDa2dlMXh1SUNCcFppQW9jMk5vWldSMWJHVnlJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdjMk5vWldSMWJHVnlJRDBnYm1WM0lGTmphR1ZrZFd4bGNpaGhkV1JwYjBOdmJuUmxlSFFzSUh0OUtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnpZMmhsWkhWc1pYSTdYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3k1blpYUlRhVzF3YkdWVFkyaGxaSFZzWlhJZ1BTQm1kVzVqZEdsdmJpaGhkV1JwYjBOdmJuUmxlSFFwSUh0Y2JpQWdhV1lnS0hOcGJYQnNaVk5qYUdWa2RXeGxjaUE5UFQwZ2JuVnNiQ2tnZTF4dUlDQWdJSE5wYlhCc1pWTmphR1ZrZFd4bGNpQTlJRzVsZHlCVGFXMXdiR1ZUWTJobFpIVnNaWElvWVhWa2FXOURiMjUwWlhoMExDQjdmU2s3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYzJsdGNHeGxVMk5vWldSMWJHVnlPMXh1ZlRzaVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKFwiLi9mYWN0b3JpZXNcIik7XG5cbnZhciBnZXRTY2hlZHVsZXIgPSBfcmVxdWlyZS5nZXRTY2hlZHVsZXI7XG5cbnZhciBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2sgPSAoZnVuY3Rpb24gKF9UaW1lRW5naW5lKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sU2NoZWR1bGVySG9vayhwbGF5Q29udHJvbCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2spO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheUNvbnRyb2xTY2hlZHVsZXJIb29rLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2wgPSBwbGF5Q29udHJvbDtcbiAgfVxuXG4gIF9pbmhlcml0cyhQbGF5Q29udHJvbFNjaGVkdWxlckhvb2ssIF9UaW1lRW5naW5lKTtcblxuICBfY3JlYXRlQ2xhc3MoUGxheUNvbnRyb2xTY2hlZHVsZXJIb29rLCB7XG4gICAgYWR2YW5jZVRpbWU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgICAgIHZhciBwbGF5Q29udHJvbCA9IHRoaXMuX19wbGF5Q29udHJvbDtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gcGxheUNvbnRyb2wuX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKTtcbiAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IHBsYXlDb250cm9sLl9fZW5naW5lLmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgcGxheUNvbnRyb2wuX19zcGVlZCk7XG5cbiAgICAgICAgaWYgKG5leHRQb3NpdGlvbiAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXR1cm4gcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICB9cmV0dXJuIEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFBsYXlDb250cm9sU2NoZWR1bGVySG9vaztcbn0pKFRpbWVFbmdpbmUpO1xuXG52YXIgUGxheUNvbnRyb2xMb29wQ29udHJvbCA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUyKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sTG9vcENvbnRyb2wocGxheUNvbnRyb2wpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGxheUNvbnRyb2xMb29wQ29udHJvbCk7XG5cbiAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihQbGF5Q29udHJvbExvb3BDb250cm9sLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2wgPSBwbGF5Q29udHJvbDtcbiAgICB0aGlzLnNwZWVkID0gbnVsbDtcbiAgfVxuXG4gIF9pbmhlcml0cyhQbGF5Q29udHJvbExvb3BDb250cm9sLCBfVGltZUVuZ2luZTIpO1xuXG4gIF9jcmVhdGVDbGFzcyhQbGF5Q29udHJvbExvb3BDb250cm9sLCB7XG4gICAgYWR2YW5jZVRpbWU6IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNjaGVkdWxlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICAgIHRoaXMuX19wbGF5Q29udHJvbC5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3BsYXlDb250cm9sLl9fbG9vcFN0YXJ0LCB0aGlzLnNwZWVkLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLl9fZ2V0VGltZUF0UG9zaXRpb24odGhpcy5fX3BsYXlDb250cm9sLl9fbG9vcEVuZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zcGVlZCA8IDApIHtcbiAgICAgICAgICB0aGlzLl9fcGxheUNvbnRyb2wuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wbGF5Q29udHJvbC5fX2xvb3BFbmQsIHRoaXMuc3BlZWQsIHRydWUpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fcGxheUNvbnRyb2wuX19sb29wU3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBQbGF5Q29udHJvbExvb3BDb250cm9sO1xufSkoVGltZUVuZ2luZSk7XG5cbnZhciBQbGF5Q29udHJvbCA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUzKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sKGVuZ2luZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGxheUNvbnRyb2wpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheUNvbnRyb2wucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGVuZ2luZS5hdWRpb0NvbnRleHQpO1xuXG4gICAgLy8gZnV0dXJlIGFzc2lnbm1lbnRcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHdhdmVzLmdldFNjaGVkdWxlcihlbmdpbmUuYXVkaW9Db250ZXh0KTtcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHJlcXVpcmUoXCJzY2hlZHVsZXJcIik7XG4gICAgLy8gdGVzdFxuICAgIHRoaXMuc2NoZWR1bGVyID0gZ2V0U2NoZWR1bGVyKGVuZ2luZS5hdWRpb0NvbnRleHQpO1xuXG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gICAgdGhpcy5fX2ludGVyZmFjZSA9IG51bGw7XG4gICAgdGhpcy5fX3NjaGVkdWxlckhvb2sgPSBudWxsO1xuXG4gICAgdGhpcy5fX2xvb3BDb250cm9sID0gbnVsbDtcbiAgICB0aGlzLl9fbG9vcFN0YXJ0ID0gMDtcbiAgICB0aGlzLl9fbG9vcEVuZCA9IEluZmluaXR5O1xuXG4gICAgLy8gc3luY2hyb25pemVkIHRpZSwgcG9zaXRpb24sIGFuZCBzcGVlZFxuICAgIHRoaXMuX190aW1lID0gMDtcbiAgICB0aGlzLl9fcG9zaXRpb24gPSAwO1xuICAgIHRoaXMuX19zcGVlZCA9IDA7XG5cbiAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAvLyBub24temVybyBcInVzZXJcIiBzcGVlZFxuICAgIHRoaXMuX19wbGF5aW5nU3BlZWQgPSAxO1xuXG4gICAgaWYgKGVuZ2luZS5tYXN0ZXIpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIGEgbWFzdGVyXCIpO1xuXG4gICAgdmFyIHNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgdmFyIGdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRUaW1lO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0Q3VycmVudFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICB9O1xuXG4gICAgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKCkpIHtcbiAgICAgIC8vIGFkZCB0aW1lIGVuZ2luZSB0aGF0IGltcGxlbWVudHMgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAgICAgIHRoaXMuX19lbmdpbmUgPSBlbmdpbmU7XG4gICAgICB0aGlzLl9faW50ZXJmYWNlID0gXCJzcGVlZC1jb250cm9sbGVkXCI7XG4gICAgICBlbmdpbmUuc2V0U3BlZWRDb250cm9sbGVkKHRoaXMsIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoZW5naW5lLmltcGxlbWVudHNUcmFuc3BvcnRlZCgpKSB7XG4gICAgICAvLyBhZGQgdGltZSBlbmdpbmUgdGhhdCBpbXBsZW1lbnRzIHRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgIHRoaXMuX19pbnRlcmZhY2UgPSBcInRyYW5zcG9ydGVkXCI7XG5cbiAgICAgIGVuZ2luZS5zZXRUcmFuc3BvcnRlZCh0aGlzLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgLy8gcmVzZXROZXh0UG9zaXRpb25cbiAgICAgICAgaWYgKG5leHRFbmdpbmVQb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHZhciB0aW1lID0gX3RoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIHZhciBwb3NpdGlvbiA9IF90aGlzLl9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSk7XG4gICAgICAgICAgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgX3RoaXMuX19zcGVlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5fX3Jlc2V0TmV4dFBvc2l0aW9uKG5leHRFbmdpbmVQb3NpdGlvbik7XG4gICAgICB9LCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU2NoZWR1bGVkKCkpIHtcbiAgICAgIC8vIGFkZCB0aW1lIGVuZ2luZSB0aGF0IGltcGxlbWVudHMgc2NoZWR1bGVkIGludGVyZmFjZVxuICAgICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgIHRoaXMuX19pbnRlcmZhY2UgPSBcInNjaGVkdWxlZFwiO1xuXG4gICAgICB0aGlzLnNjaGVkdWxlci5hZGQoZW5naW5lLCBJbmZpbml0eSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGNhbm5vdCBiZSBhZGRlZCB0byBwbGF5IGNvbnRyb2xcIik7XG4gICAgfVxuICB9XG5cbiAgX2luaGVyaXRzKFBsYXlDb250cm9sLCBfVGltZUVuZ2luZTMpO1xuXG4gIF9jcmVhdGVDbGFzcyhQbGF5Q29udHJvbCwge1xuICAgIF9fZ2V0VGltZUF0UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBFeHRyYXBvbGF0ZSB0cmFuc3BvcnQgdGltZSBmb3IgZ2l2ZW4gcG9zaXRpb25cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiBwb3NpdGlvblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBleHRyYXBvbGF0ZWQgdGltZVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdGltZSArIChwb3NpdGlvbiAtIHRoaXMuX19wb3NpdGlvbikgLyB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2dldFBvc2l0aW9uQXRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRXh0cmFwb2xhdGUgcGxheWluZyBwb3NpdGlvbiBmb3IgZ2l2ZW4gdGltZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZVxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBleHRyYXBvbGF0ZWQgcG9zaXRpb25cbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fc3luYzoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc3luYygpIHtcbiAgICAgICAgdmFyIG5vdyA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgIHRoaXMuX19wb3NpdGlvbiArPSAobm93IC0gdGhpcy5fX3RpbWUpICogdGhpcy5fX3NwZWVkO1xuICAgICAgICB0aGlzLl9fdGltZSA9IG5vdztcbiAgICAgICAgcmV0dXJuIG5vdztcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fcmVzZXROZXh0UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgcG9zaXRpb25cbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBwbGF5aW5nIHBvc2l0aW9uXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9fc2NoZWR1bGVySG9vaykgdGhpcy5fX3NjaGVkdWxlckhvb2sucmVzZXROZXh0VGltZSh0aGlzLl9fZ2V0VGltZUF0UG9zaXRpb24obmV4dFBvc2l0aW9uKSk7XG5cbiAgICAgICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IG5leHRQb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHRpbWVcbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCB0aW1lXG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHBsYXktY29udHJvbCBpcyBhZGRlZCB0byBhIG1hc3Rlci5cbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudFBvc2l0aW9uOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgcGxheWluZyBwb3NpdGlvblxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSByZXBsYWNlZCB3aGVuIHRoZSBwbGF5LWNvbnRyb2wgaXMgYWRkZWQgdG8gYSBtYXN0ZXIuXG4gICAgICAgKi9cblxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb29wOiB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uIChlbmFibGUpIHtcbiAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9fbG9vcFN0YXJ0ID4gLUluZmluaXR5ICYmIHRoaXMuX19sb29wRW5kIDwgSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRoaXMuX19sb29wQ29udHJvbCA9IG5ldyBQbGF5Q29udHJvbExvb3BDb250cm9sKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19sb29wQ29udHJvbCwgSW5maW5pdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgICAgICB0aGlzLnNjaGVkdWxlci5yZW1vdmUodGhpcy5fX2xvb3BDb250cm9sKTtcbiAgICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX19sb29wQ29udHJvbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldExvb3BCb3VuZGFyaWVzOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnQsIGVuZCkge1xuICAgICAgICBpZiAoZW5kID49IHN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5fX2xvb3BTdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHRoaXMuX19sb29wRW5kID0gZW5kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19sb29wU3RhcnQgPSBlbmQ7XG4gICAgICAgICAgdGhpcy5fX2xvb3BFbmQgPSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9vcCA9IHRoaXMubG9vcDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvb3BTdGFydDoge1xuICAgICAgc2V0OiBmdW5jdGlvbiAoc3RhcnRUaW1lKSB7XG4gICAgICAgIHRoaXMuc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnRUaW1lLCB0aGlzLl9fbG9vcEVuZCk7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbG9vcFN0YXJ0O1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9vcEVuZDoge1xuICAgICAgc2V0OiBmdW5jdGlvbiAoZW5kVGltZSkge1xuICAgICAgICB0aGlzLnNldExvb3BCb3VuZGFyaWVzKHRoaXMuX19sb29wU3RhcnQsIGVuZFRpbWUpO1xuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BFbmQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2FwcGx5TG9vcEJvdW5kYXJpZXM6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2FwcGx5TG9vcEJvdW5kYXJpZXMocG9zaXRpb24sIHNwZWVkLCBzZWVrKSB7XG4gICAgICAgIGlmICh0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgICAgICBpZiAoc3BlZWQgPiAwICYmIHBvc2l0aW9uID49IHRoaXMuX19sb29wRW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BTdGFydCArIChwb3NpdGlvbiAtIHRoaXMuX19sb29wU3RhcnQpICUgKHRoaXMuX19sb29wRW5kIC0gdGhpcy5fX2xvb3BTdGFydCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVlZCA8IDAgJiYgcG9zaXRpb24gPCB0aGlzLl9fbG9vcFN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BFbmQgLSAodGhpcy5fX2xvb3BFbmQgLSBwb3NpdGlvbikgJSAodGhpcy5fX2xvb3BFbmQgLSB0aGlzLl9fbG9vcFN0YXJ0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBfX3Jlc2NoZWR1bGVMb29wQ29udHJvbDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVzY2hlZHVsZUxvb3BDb250cm9sKHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAodGhpcy5fX2xvb3BDb250cm9sKSB7XG4gICAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fX2xvb3BDb250cm9sLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5yZXNldCh0aGlzLl9fbG9vcENvbnRyb2wsIHRoaXMuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fbG9vcEVuZCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVyLnJlc2V0KHRoaXMuX19sb29wQ29udHJvbCwgdGhpcy5fX2dldFRpbWVBdFBvc2l0aW9uKHRoaXMuX19sb29wU3RhcnQpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIucmVzZXQodGhpcy5fX2xvb3BDb250cm9sLCBJbmZpbml0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jU3BlZWQ6IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNwZWVkLWNvbnRyb2xsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgc2VlayA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbM107XG5cbiAgICAgICAgdmFyIGxhc3RTcGVlZCA9IHRoaXMuX19zcGVlZDtcblxuICAgICAgICBpZiAoc3BlZWQgIT09IGxhc3RTcGVlZCB8fCBzZWVrKSB7XG4gICAgICAgICAgaWYgKHNlZWsgfHwgbGFzdFNwZWVkID09PSAwKSBwb3NpdGlvbiA9IHRoaXMuX19hcHBseUxvb3BCb3VuZGFyaWVzKHBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICB0aGlzLl9fdGltZSA9IHRpbWU7XG4gICAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgdGhpcy5fX3NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuX19pbnRlcmZhY2UpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzcGVlZC1jb250cm9sbGVkXCI6XG4gICAgICAgICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgc2Vlayk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwidHJhbnNwb3J0ZWRcIjpcbiAgICAgICAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IHRoaXMuX19uZXh0UG9zaXRpb247XG5cbiAgICAgICAgICAgICAgaWYgKHNlZWspIHtcbiAgICAgICAgICAgICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RTcGVlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIHN0YXJ0XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBzY2hlZHVsZXIgaG9vayB0byBzY2hlZHVsZXIgKHdpbGwgYmUgcmVzY2hlZHVsZWQgdG8gYXBwcm9wcmlhdGUgdGltZSBiZWxvdylcbiAgICAgICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG5ldyBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2sodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19zY2hlZHVsZXJIb29rLCBJbmZpbml0eSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9wXG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQpIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCAwKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzY2hlZHVsZXIgaG9vayBmcm9tIHNjaGVkdWxlclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVyLnJlbW92ZSh0aGlzLl9fc2NoZWR1bGVySG9vayk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlckhvb2sgPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWVkICogbGFzdFNwZWVkIDwgMCkge1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0cmFuc3BvcnQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLl9fcmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJzY2hlZHVsZWRcIjpcbiAgICAgICAgICAgICAgaWYgKGxhc3RTcGVlZCA9PT0gMCkgLy8gc3RhcnQgb3Igc2Vla1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRFbmdpbmUucmVzZXROZXh0VGltZSgwKTtlbHNlIGlmIChzcGVlZCA9PT0gMCkgLy8gc3RvcFxuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRFbmdpbmUucmVzZXROZXh0VGltZShJbmZpbml0eSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX19yZXNjaGVkdWxlTG9vcENvbnRyb2wocG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3RhcnQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTdGFydCBwbGF5aW5nXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB2YXIgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wb3NpdGlvbiwgdGhpcy5fX3BsYXlpbmdTcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXVzZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFBhdXNlIHBsYXlpbmdcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcbiAgICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0b3A6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wIHBsYXlpbmdcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgICAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIDApO1xuICAgICAgICB0aGlzLnNlZWsoMCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzcGVlZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIFNldCBwbGF5aW5nIHNwZWVkXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgcGxheWluZyBzcGVlZCAobm9uLXplcm8gc3BlZWQgYmV0d2VlbiAtMTYgYW5kIC0xLzE2IG9yIGJldHdlZW4gMS8xNiBhbmQgMTYpXG4gICAgICAgKi9cblxuICAgICAgc2V0OiBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuXG4gICAgICAgIGlmIChzcGVlZCA+PSAwKSB7XG4gICAgICAgICAgaWYgKHNwZWVkIDwgMC4wNjI1KSBzcGVlZCA9IDAuMDYyNTtlbHNlIGlmIChzcGVlZCA+IDE2KSBzcGVlZCA9IDE2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzcGVlZCA8IC0xNikgc3BlZWQgPSAtMTY7ZWxzZSBpZiAoc3BlZWQgPiAtMC4wNjI1KSBzcGVlZCA9IC0wLjA2MjU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fcGxheWluZ1NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zcGVlZCAhPT0gMCkgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBwbGF5aW5nIHNwZWVkXG4gICAgICAgKiBAcmV0dXJuIGN1cnJlbnQgcGxheWluZyBzcGVlZFxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wbGF5aW5nU3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZWVrOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IChqdW1wIHRvKSBwbGF5aW5nIHBvc2l0aW9uXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGFyZ2V0IHBvc2l0aW9uXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlZWsocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSB0aGlzLl9fcG9zaXRpb24pIHtcbiAgICAgICAgICB2YXIgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHRoaXMuX19zcGVlZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIHRpbWUgZW5naW5lIGZyb20gdGhlIHRyYW5zcG9ydFxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgICAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIDApO1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gUGxheUNvbnRyb2w7XG59KShUaW1lRW5naW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Q29udHJvbDtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBwbGF5IGNvbnRyb2wgY2xhc3MgKHRpbWUtZW5naW5lIG1hc3RlciksIHByb3ZpZGVzIHBsYXkgY29udHJvbCB0byBhIHNpbmdsZSBlbmdpbmVcbiAqIEBhdXRob3IgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCBWaWN0b3IuU2FpekBpcmNhbS5mciwgS2FyaW0uQmFya2F0aUBpcmNhbS5mclxuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOXRZWE4wWlhKekwzQnNZWGt0WTI5dWRISnZiQzVsY3pZdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPMEZCVDBFc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03TzJWQlEzcENMRTlCUVU4c1EwRkJReXhoUVVGaExFTkJRVU03TzBsQlFYWkRMRmxCUVZrc1dVRkJXaXhaUVVGWk96dEpRVVZhTEhkQ1FVRjNRanRCUVVOcVFpeFhRVVJRTEhkQ1FVRjNRaXhEUVVOb1FpeFhRVUZYTEVWQlFVVTdNRUpCUkhKQ0xIZENRVUYzUWpzN1FVRkZNVUlzY1VOQlJrVXNkMEpCUVhkQ0xEWkRRVVZzUWp0QlFVTlNMRkZCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzVjBGQlZ5eERRVUZETzBkQlEyeERPenRaUVVwSExIZENRVUYzUWpzN1pVRkJlRUlzZDBKQlFYZENPMEZCVFRWQ0xHVkJRVmM3WVVGQlFTeHhRa0ZCUXl4SlFVRkpMRVZCUVVVN1FVRkRhRUlzV1VGQlNTeFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRCUVVOeVF5eFpRVUZKTEZGQlFWRXNSMEZCUnl4WFFVRlhMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRja1FzV1VGQlNTeFpRVUZaTEVkQlFVY3NWMEZCVnl4RFFVRkRMRkZCUVZFc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZEdMRmxCUVVrc1dVRkJXU3hMUVVGTExGRkJRVkU3UVVGRE0wSXNhVUpCUVU4c1YwRkJWeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8xTkJRVUVzUVVGRmRrUXNUMEZCVHl4UlFVRlJMRU5CUVVNN1QwRkRha0k3T3pzN1UwRm1SeXgzUWtGQmQwSTdSMEZCVXl4VlFVRlZPenRKUVd0Q00wTXNjMEpCUVhOQ08wRkJRMllzVjBGRVVDeHpRa0ZCYzBJc1EwRkRaQ3hYUVVGWExFVkJRVVU3TUVKQlJISkNMSE5DUVVGelFqczdRVUZGZUVJc2NVTkJSa1VzYzBKQlFYTkNMRFpEUVVWb1FqdEJRVU5TTEZGQlFVa3NRMEZCUXl4aFFVRmhMRWRCUVVjc1YwRkJWeXhEUVVGRE8wRkJRMnBETEZGQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRE8wZEJRMjVDT3p0WlFVeEhMSE5DUVVGelFqczdaVUZCZEVJc2MwSkJRWE5DTzBGQlVURkNMR1ZCUVZjN096czdZVUZCUVN4eFFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRGFFSXNXVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU5zUWl4alFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOeVJpeHBRa0ZCVHl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVMEZETjBVc1RVRkJUU3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNwQ0xHTkJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEZOQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEyNUdMR2xDUVVGUExFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRUUVVNdlJUdEJRVU5FTEdWQlFVOHNVVUZCVVN4RFFVRkRPMDlCUTJwQ096czdPMU5CYWtKSExITkNRVUZ6UWp0SFFVRlRMRlZCUVZVN08wbEJiMEo2UXl4WFFVRlhPMEZCUTBvc1YwRkVVQ3hYUVVGWExFTkJRMGdzVFVGQlRTeEZRVUZGT3pzN01FSkJSR2hDTEZkQlFWYzdPMEZCUldJc2NVTkJSa1VzVjBGQlZ5dzJRMEZGVUN4TlFVRk5MRU5CUVVNc1dVRkJXU3hGUVVGRk96czdPenM3UVVGTk0wSXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhaUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWdVJDeFJRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOeVFpeFJRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVONFFpeFJRVUZKTEVOQlFVTXNaVUZCWlN4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRk5VSXNVVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRE1VSXNVVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGNrSXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhSUVVGUkxFTkJRVU03T3p0QlFVY3hRaXhSUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTm9RaXhSUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTndRaXhSUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZha0lzVVVGQlNTeERRVUZETEdOQlFXTXNSMEZCUnl4UlFVRlJMRU5CUVVNN096dEJRVWN2UWl4UlFVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExFTkJRVU1zUTBGQlF6czdRVUZGZUVJc1VVRkJTU3hOUVVGTkxFTkJRVU1zVFVGQlRTeEZRVU5tTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc01rTkJRVEpETEVOQlFVTXNRMEZCUXpzN1FVRkZMMFFzVVVGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJRenM3UVVGRmVrSXNVVUZCU1N4alFVRmpMRWRCUVVjc1dVRkJUVHRCUVVONlFpeGhRVUZQTEUxQlFVc3NWMEZCVnl4RFFVRkRPMHRCUTNwQ0xFTkJRVU03TzBGQlJVWXNVVUZCU1N4clFrRkJhMElzUjBGQlJ5eFpRVUZOTzBGQlF6ZENMR0ZCUVU4c1RVRkJTeXhsUVVGbExFTkJRVU03UzBGRE4wSXNRMEZCUXpzN1FVRkZSaXhSUVVGSkxFMUJRVTBzUTBGQlF5eDVRa0ZCZVVJc1JVRkJSU3hGUVVGRk96dEJRVVYwUXl4VlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFMUJRVTBzUTBGQlF6dEJRVU4yUWl4VlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExHdENRVUZyUWl4RFFVRkRPMEZCUTNSRExGbEJRVTBzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eEZRVUZGTEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03UzBGRGNrVXNUVUZCVFN4SlFVRkpMRTFCUVUwc1EwRkJReXh4UWtGQmNVSXNSVUZCUlN4RlFVRkZPenRCUVVWNlF5eFZRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTFCUVUwc1EwRkJRenRCUVVOMlFpeFZRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMR0ZCUVdFc1EwRkJRenM3UVVGRmFrTXNXVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF5eEZRVUZGTEZsQlFTdENPMWxCUVRsQ0xHdENRVUZyUWl4blEwRkJSeXhKUVVGSk96czdRVUZGZGtRc1dVRkJTU3hyUWtGQmEwSXNTMEZCU3l4SlFVRkpMRVZCUVVVN1FVRkRMMElzWTBGQlNTeEpRVUZKTEVkQlFVY3NUVUZCU3l4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRE8wRkJRM1JETEdOQlFVa3NVVUZCVVN4SFFVRkhMRTFCUVVzc2JVSkJRVzFDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRPVU1zTkVKQlFXdENMRWRCUVVjc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRTFCUVVzc1QwRkJUeXhEUVVGRExFTkJRVU03VTBGRGVFVTdPMEZCUlVRc1kwRkJTeXh0UWtGQmJVSXNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzA5QlF6bERMRVZCUVVVc1kwRkJZeXhGUVVGRkxHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1MwRkRlRU1zVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4dFFrRkJiVUlzUlVGQlJTeEZRVUZGT3p0QlFVVjJReXhWUVVGSkxFTkJRVU1zVVVGQlVTeEhRVUZITEUxQlFVMHNRMEZCUXp0QlFVTjJRaXhWUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEZkQlFWY3NRMEZCUXpzN1FVRkZMMElzVlVGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hGUVVGRkxGRkJRVkVzUlVGQlJTeHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wdEJRekZFTEUxQlFVMDdRVUZEVEN4WlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExIZERRVUYzUXl4RFFVRkRMRU5CUVVNN1MwRkRNMFE3UjBGRFJqczdXVUYwUlVjc1YwRkJWenM3WlVGQldDeFhRVUZYTzBGQk5rVm1MSFZDUVVGdFFqczdPenM3T3pzN1lVRkJRU3cyUWtGQlF5eFJRVUZSTEVWQlFVVTdRVUZETlVJc1pVRkJUeXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVUVzUjBGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMDlCUTJ4Rk96dEJRVTlFTEhWQ1FVRnRRanM3T3pzN096czdZVUZCUVN3MlFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRGVFSXNaVUZCVHl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVFc1IwRkJTU3hKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzA5QlF6bEVPenRCUVVWRUxGVkJRVTA3WVVGQlFTeHJRa0ZCUnp0QlFVTlFMRmxCUVVrc1IwRkJSeXhIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTTdRVUZETTBJc1dVRkJTU3hEUVVGRExGVkJRVlVzU1VGQlNTeERRVUZETEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGQkxFZEJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXp0QlFVTjBSQ3haUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVkQlFVY3NRMEZCUXp0QlFVTnNRaXhsUVVGUExFZEJRVWNzUTBGQlF6dFBRVU5hT3p0QlFVMUVMSFZDUVVGdFFqczdPenM3T3p0aFFVRkJMRFpDUVVGRExGbEJRVmtzUlVGQlJUdEJRVU5vUXl4WlFVRkpMRWxCUVVrc1EwRkJReXhsUVVGbExFVkJRM1JDTEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVTNSU3haUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEZsQlFWa3NRMEZCUXp0UFFVTndRenM3UVVGUlJ5eGxRVUZYT3pzN096czdPenM3VjBGQlFTeFpRVUZITzBGQlEyaENMR1ZCUVU4c1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTEVOQlFVTTdUMEZEYmtNN08wRkJVVWNzYlVKQlFXVTdPenM3T3pzN096dFhRVUZCTEZsQlFVYzdRVUZEY0VJc1pVRkJUeXhKUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03VDBGRGNFWTdPMEZCWTBjc1VVRkJTVHRYUVZwQkxGVkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNXVUZCU1N4TlFVRk5MRVZCUVVVN1FVRkRWaXhqUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVkQlFVY3NRMEZCUXl4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFJRVUZSTEVWQlFVVTdRVUZETjBRc1owSkJRVWtzUTBGQlF5eGhRVUZoTEVkQlFVY3NTVUZCU1N4elFrRkJjMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTjBSQ3huUWtGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0WFFVTnNSRHRUUVVOR0xFMUJRVTBzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVRkZPMEZCUXpkQ0xHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6dEJRVU14UXl4alFVRkpMRU5CUVVNc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF6dFRRVU16UWp0UFFVTkdPMWRCUlU4c1dVRkJSenRCUVVOVUxHVkJRVkVzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVVN1QwRkRMMEk3TzBGQlJVUXNjVUpCUVdsQ08yRkJRVUVzTWtKQlFVTXNTMEZCU3l4RlFVRkZMRWRCUVVjc1JVRkJSVHRCUVVNMVFpeFpRVUZKTEVkQlFVY3NTVUZCU1N4TFFVRkxMRVZCUVVVN1FVRkRhRUlzWTBGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRla0lzWTBGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SFFVRkhMRU5CUVVNN1UwRkRkRUlzVFVGQlRUdEJRVU5NTEdOQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1IwRkJSeXhEUVVGRE8wRkJRM1pDTEdOQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRE8xTkJRM2hDT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXp0UFFVTjJRanM3UVVGTlJ5eGhRVUZUTzFkQlNrRXNWVUZCUXl4VFFVRlRMRVZCUVVVN1FVRkRka0lzV1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1QwRkRia1E3VjBGRldTeFpRVUZITzBGQlEyUXNaVUZCVHl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRE8wOUJRM3BDT3p0QlFVMUhMRmRCUVU4N1YwRktRU3hWUVVGRExFOUJRVThzUlVGQlJUdEJRVU51UWl4WlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dFBRVU51UkR0WFFVVlZMRmxCUVVjN1FVRkRXaXhsUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTTdUMEZEZGtJN08wRkJSVVFzZVVKQlFYRkNPMkZCUVVFc0swSkJRVU1zVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRNME1zV1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVRkZPMEZCUTNSQ0xHTkJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNTVUZCU1N4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk03UVVGRGVrTXNiVUpCUVU4c1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGQkxFbEJRVXNzU1VGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGQkxFRkJRVU1zUTBGQlF6dHBRa0ZETTBZc1NVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1YwRkJWenRCUVVNdlF5eHRRa0ZCVHl4SlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4UlFVRlJMRU5CUVVFc1NVRkJTeXhKUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVFc1FVRkJReXhEUVVGRE8xZEJRVUU3VTBGRE4wWTdPMEZCUlVRc1pVRkJUeXhSUVVGUkxFTkJRVU03VDBGRGFrSTdPMEZCUlVRc01rSkJRWFZDTzJGQlFVRXNhVU5CUVVNc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU4yUXl4WlFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVU3UVVGRGRFSXNZMEZCU1N4TFFVRkxMRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRMklzWjBKQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU5xUXl4blFrRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1JVRkJSU3hKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTTdWMEZEY0VZc1RVRkJUU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZEY0VJc1owSkJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOcVF5eG5Ra0ZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEdGQlFXRXNSVUZCUlN4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU03VjBGRGRFWXNUVUZCVFR0QlFVTk1MR2RDUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzFkQlEzQkVPMU5CUTBZN1QwRkRSanM3UVVGSFJDeGhRVUZUT3pzN08yRkJRVUVzYlVKQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRV2RDTzFsQlFXUXNTVUZCU1N4blEwRkJSeXhMUVVGTE96dEJRVU16UXl4WlFVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZET3p0QlFVVTNRaXhaUVVGSkxFdEJRVXNzUzBGQlN5eFRRVUZUTEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUXk5Q0xHTkJRVWtzU1VGQlNTeEpRVUZKTEZOQlFWTXNTMEZCU3l4RFFVRkRMRVZCUTNwQ0xGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zVVVGQlVTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVWNlJDeGpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOdVFpeGpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMRkZCUVZFc1EwRkJRenRCUVVNelFpeGpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJRenM3UVVGRmNrSXNhMEpCUVZFc1NVRkJTU3hEUVVGRExGZEJRVmM3UVVGRGRFSXNhVUpCUVVzc2EwSkJRV3RDTzBGQlEzSkNMR3RDUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3h2UWtGQlRUczdRVUZCUVN4QlFVVlNMR2xDUVVGTExHRkJRV0U3UVVGRGFFSXNhMEpCUVVrc1dVRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTTdPMEZCUlhaRExHdENRVUZKTEVsQlFVa3NSVUZCUlR0QlFVTlNMRFJDUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0bFFVTnNSU3hOUVVGTkxFbEJRVWtzVTBGQlV5eExRVUZMTEVOQlFVTXNSVUZCUlRzN1FVRkZNVUlzTkVKQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE96czdRVUZIYWtVc2IwSkJRVWtzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4M1FrRkJkMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXhSQ3h2UWtGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExHVkJRV1VzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0bFFVTndSQ3hOUVVGTkxFbEJRVWtzUzBGQlN5eExRVUZMTEVOQlFVTXNSVUZCUlRzN1FVRkZkRUlzTkVKQlFWa3NSMEZCUnl4UlFVRlJMRU5CUVVNN08wRkJSWGhDTEc5Q1FVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eEZRVU42UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE96czdRVUZITjBNc2IwSkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4dlFrRkJTU3hEUVVGRExHVkJRV1VzUjBGQlJ5eEpRVUZKTEVOQlFVTTdaVUZETjBJc1RVRkJUU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFRRVUZUTEVkQlFVY3NRMEZCUXl4RlFVRkZPenRCUVVOb1F5dzBRa0ZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03WlVGRGJFVXNUVUZCVFN4SlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEyeERMRzlDUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzJWQlEyaEVPenRCUVVWRUxHdENRVUZKTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZEZGtNc2IwSkJRVTA3TzBGQlFVRXNRVUZGVWl4cFFrRkJTeXhYUVVGWE8wRkJRMlFzYTBKQlFVa3NVMEZCVXl4TFFVRkxMRU5CUVVNN1FVRkRha0lzYjBKQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkRja01zU1VGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXp0QlFVTnNRaXh2UWtGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExHRkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnFSQ3h2UWtGQlRUdEJRVUZCTEZkQlExUTdPMEZCUlVRc1kwRkJTU3hEUVVGRExIVkNRVUYxUWl4RFFVRkRMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dFRRVU12UXp0UFFVTkdPenRCUVV0RUxGTkJRVXM3T3pzN096dGhRVUZCTEdsQ1FVRkhPMEZCUTA0c1dVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTNwQ0xGbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMDlCUXpWRU96dEJRVXRFTEZOQlFVczdPenM3T3p0aFFVRkJMR2xDUVVGSE8wRkJRMDRzV1VGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wRkJRM3BDTEZsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1QwRkRNVU03TzBGQlMwUXNVVUZCU1RzN096czdPMkZCUVVFc1owSkJRVWM3UVVGRFRDeFpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRGVrSXNXVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVONlF5eFpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRMlE3TzBGQkswSkhMRk5CUVVzN096czdPenM3VjBGNlFrRXNWVUZCUXl4TFFVRkxMRVZCUVVVN1FVRkRaaXhaUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN08wRkJSWHBDTEZsQlFVa3NTMEZCU3l4SlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVOa0xHTkJRVWtzUzBGQlN5eEhRVUZITEUxQlFVMHNSVUZEYUVJc1MwRkJTeXhIUVVGSExFMUJRVTBzUTBGQlF5eExRVU5hTEVsQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1JVRkRha0lzUzBGQlN5eEhRVUZITEVWQlFVVXNRMEZCUXp0VFFVTmtMRTFCUVUwN1FVRkRUQ3hqUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlFVVXNSVUZEWWl4TFFVRkxMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUzBGRFZDeEpRVUZKTEV0QlFVc3NSMEZCUnl4RFFVRkRMRTFCUVUwc1JVRkRkRUlzUzBGQlN5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRPMU5CUTI1Q096dEJRVVZFTEZsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1MwRkJTeXhEUVVGRE96dEJRVVUxUWl4WlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFdEJRVXNzUTBGQlF5eEZRVU53UWl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE8wOUJRMmhFT3pzN096czdWMEZOVVN4WlFVRkhPMEZCUTFZc1pVRkJUeXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETzA5QlF6VkNPenRCUVUxRUxGRkJRVWs3T3pzN096czdZVUZCUVN4alFVRkRMRkZCUVZFc1JVRkJSVHRCUVVOaUxGbEJRVWtzVVVGQlVTeExRVUZMTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRhRU1zWTBGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wRkJRM3BDTEdOQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1VVRkJVU3hEUVVGRE8wRkJRek5DTEdOQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8xTkJRM0JFTzA5QlEwWTdPMEZCUzBRc1UwRkJTenM3T3pzN08yRkJRVUVzYVVKQlFVYzdRVUZEVGl4WlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdRVUZEZWtJc1dVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU42UXl4WlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExHTkJRV01zUlVGQlJTeERRVUZETzA5QlEyaERPenM3TzFOQk9WVkhMRmRCUVZjN1IwRkJVeXhWUVVGVk96dEJRV2xXY0VNc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFhRVUZYTEVOQlFVTWlMQ0ptYVd4bElqb2laWE0yTDIxaGMzUmxjbk12Y0d4aGVTMWpiMjUwY205c0xtVnpOaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFJSGR5YVhSMFpXNGdhVzRnUlVOTlFYTmpjbWx3ZENBMklDb3ZYRzR2S2lwY2JpQXFJRUJtYVd4bGIzWmxjblpwWlhjZ1YwRldSU0JoZFdScGJ5QndiR0Y1SUdOdmJuUnliMndnWTJ4aGMzTWdLSFJwYldVdFpXNW5hVzVsSUcxaGMzUmxjaWtzSUhCeWIzWnBaR1Z6SUhCc1lYa2dZMjl1ZEhKdmJDQjBieUJoSUhOcGJtZHNaU0JsYm1kcGJtVmNiaUFxSUVCaGRYUm9iM0lnVG05eVltVnlkQzVUWTJodVpXeHNRR2x5WTJGdExtWnlMQ0JXYVdOMGIzSXVVMkZwZWtCcGNtTmhiUzVtY2l3Z1MyRnlhVzB1UW1GeWEyRjBhVUJwY21OaGJTNW1jbHh1SUNvdlhHNG5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUJVYVcxbFJXNW5hVzVsSUQwZ2NtVnhkV2x5WlNoY0lpNHVMMk52Y21VdmRHbHRaUzFsYm1kcGJtVmNJaWs3WEc1MllYSWdleUJuWlhSVFkyaGxaSFZzWlhJZ2ZTQTlJSEpsY1hWcGNtVW9KeTR2Wm1GamRHOXlhV1Z6SnlrN1hHNWNibU5zWVhOeklGQnNZWGxEYjI1MGNtOXNVMk5vWldSMWJHVnlTRzl2YXlCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2lod2JHRjVRMjl1ZEhKdmJDa2dlMXh1SUNBZ0lITjFjR1Z5S0NrN1hHNGdJQ0FnZEdocGN5NWZYM0JzWVhsRGIyNTBjbTlzSUQwZ2NHeGhlVU52Ym5SeWIydzdYRzRnSUgxY2JseHVJQ0JoWkhaaGJtTmxWR2x0WlNoMGFXMWxLU0I3WEc0Z0lDQWdkbUZ5SUhCc1lYbERiMjUwY205c0lEMGdkR2hwY3k1ZlgzQnNZWGxEYjI1MGNtOXNPMXh1SUNBZ0lIWmhjaUJ3YjNOcGRHbHZiaUE5SUhCc1lYbERiMjUwY205c0xsOWZaMlYwVUc5emFYUnBiMjVCZEZScGJXVW9kR2x0WlNrN1hHNGdJQ0FnZG1GeUlHNWxlSFJRYjNOcGRHbHZiaUE5SUhCc1lYbERiMjUwY205c0xsOWZaVzVuYVc1bExtRmtkbUZ1WTJWUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnY0d4aGVVTnZiblJ5YjJ3dVgxOXpjR1ZsWkNrN1hHNWNiaUFnSUNCcFppQW9ibVY0ZEZCdmMybDBhVzl1SUNFOVBTQkpibVpwYm1sMGVTbGNiaUFnSUNBZ0lISmxkSFZ5YmlCd2JHRjVRMjl1ZEhKdmJDNWZYMmRsZEZScGJXVkJkRkJ2YzJsMGFXOXVLRzVsZUhSUWIzTnBkR2x2YmlrN1hHNWNiaUFnSUNCeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc0Z0lIMWNibjFjYmx4dVkyeGhjM01nVUd4aGVVTnZiblJ5YjJ4TWIyOXdRMjl1ZEhKdmJDQmxlSFJsYm1SeklGUnBiV1ZGYm1kcGJtVWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaHdiR0Y1UTI5dWRISnZiQ2tnZTF4dUlDQWdJSE4xY0dWeUtDazdYRzRnSUNBZ2RHaHBjeTVmWDNCc1lYbERiMjUwY205c0lEMGdjR3hoZVVOdmJuUnliMnc3WEc0Z0lDQWdkR2hwY3k1emNHVmxaQ0E5SUc1MWJHdzdYRzRnSUgxY2JseHVJQ0F2THlCVWFXMWxSVzVuYVc1bElHMWxkR2h2WkNBb2MyTm9aV1IxYkdWa0lHbHVkR1Z5Wm1GalpTbGNiaUFnWVdSMllXNWpaVlJwYldVb2RHbHRaU2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbk53WldWa0lENGdNQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZYM0JzWVhsRGIyNTBjbTlzTG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0IwYUdsekxsOWZjR3hoZVVOdmJuUnliMnd1WDE5c2IyOXdVM1JoY25Rc0lIUm9hWE11YzNCbFpXUXNJSFJ5ZFdVcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTl3YkdGNVEyOXVkSEp2YkM1ZlgyZGxkRlJwYldWQmRGQnZjMmwwYVc5dUtIUm9hWE11WDE5d2JHRjVRMjl1ZEhKdmJDNWZYMnh2YjNCRmJtUXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9kR2hwY3k1emNHVmxaQ0E4SURBcElIdGNiaUFnSUNBZ0lIUm9hWE11WDE5d2JHRjVRMjl1ZEhKdmJDNXplVzVqVTNCbFpXUW9kR2x0WlN3Z2RHaHBjeTVmWDNCc1lYbERiMjUwY205c0xsOWZiRzl2Y0VWdVpDd2dkR2hwY3k1emNHVmxaQ3dnZEhKMVpTazdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNCc1lYbERiMjUwY205c0xsOWZaMlYwVkdsdFpVRjBVRzl6YVhScGIyNG9kR2hwY3k1ZlgzQnNZWGxEYjI1MGNtOXNMbDlmYkc5dmNGTjBZWEowS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlFbHVabWx1YVhSNU8xeHVJQ0I5WEc1OVhHNWNibU5zWVhOeklGQnNZWGxEYjI1MGNtOXNJR1Y0ZEdWdVpITWdWR2x0WlVWdVoybHVaU0I3WEc0Z0lHTnZibk4wY25WamRHOXlLR1Z1WjJsdVpTa2dlMXh1SUNBZ0lITjFjR1Z5S0dWdVoybHVaUzVoZFdScGIwTnZiblJsZUhRcE8xeHVYRzRnSUNBZ0x5OGdablYwZFhKbElHRnpjMmxuYm0xbGJuUmNiaUFnSUNBdkx5QjBhR2x6TG5OamFHVmtkV3hsY2lBOUlIZGhkbVZ6TG1kbGRGTmphR1ZrZFd4bGNpaGxibWRwYm1VdVlYVmthVzlEYjI1MFpYaDBLVHRjYmlBZ0lDQXZMeUIwYUdsekxuTmphR1ZrZFd4bGNpQTlJSEpsY1hWcGNtVW9YQ0p6WTJobFpIVnNaWEpjSWlrN1hHNGdJQ0FnTHk4Z2RHVnpkRnh1SUNBZ0lIUm9hWE11YzJOb1pXUjFiR1Z5SUQwZ1oyVjBVMk5vWldSMWJHVnlLR1Z1WjJsdVpTNWhkV1JwYjBOdmJuUmxlSFFwTzF4dVhHNGdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpTQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZYMmx1ZEdWeVptRmpaU0E5SUc1MWJHdzdYRzRnSUNBZ2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc2dQU0J1ZFd4c08xeHVYRzRnSUNBZ2RHaHBjeTVmWDJ4dmIzQkRiMjUwY205c0lEMGdiblZzYkR0Y2JpQWdJQ0IwYUdsekxsOWZiRzl2Y0ZOMFlYSjBJRDBnTUR0Y2JpQWdJQ0IwYUdsekxsOWZiRzl2Y0VWdVpDQTlJRWx1Wm1sdWFYUjVPMXh1WEc0Z0lDQWdMeThnYzNsdVkyaHliMjVwZW1Wa0lIUnBaU3dnY0c5emFYUnBiMjRzSUdGdVpDQnpjR1ZsWkZ4dUlDQWdJSFJvYVhNdVgxOTBhVzFsSUQwZ01EdGNiaUFnSUNCMGFHbHpMbDlmY0c5emFYUnBiMjRnUFNBd08xeHVJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJREE3WEc1Y2JpQWdJQ0IwYUdsekxsOWZibVY0ZEZCdmMybDBhVzl1SUQwZ1NXNW1hVzVwZEhrN1hHNWNiaUFnSUNBdkx5QnViMjR0ZW1WeWJ5QmNJblZ6WlhKY0lpQnpjR1ZsWkZ4dUlDQWdJSFJvYVhNdVgxOXdiR0Y1YVc1blUzQmxaV1FnUFNBeE8xeHVYRzRnSUNBZ2FXWWdLR1Z1WjJsdVpTNXRZWE4wWlhJcFhHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdlltcGxZM1FnYUdGeklHRnNjbVZoWkhrZ1ltVmxiaUJoWkdSbFpDQjBieUJoSUcxaGMzUmxjbHdpS1R0Y2JseHVJQ0FnSUhaaGNpQnpjR1ZsWkNBOUlIUm9hWE11WDE5emNHVmxaRHRjYmx4dUlDQWdJSFpoY2lCblpYUkRkWEp5Wlc1MFZHbHRaU0E5SUNncElEMCtJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1OMWNuSmxiblJVYVcxbE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNCMllYSWdaMlYwUTNWeWNtVnVkRkJ2YzJsMGFXOXVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnBaaUFvWlc1bmFXNWxMbWx0Y0d4bGJXVnVkSE5UY0dWbFpFTnZiblJ5YjJ4c1pXUW9LU2tnZTF4dUlDQWdJQ0FnTHk4Z1lXUmtJSFJwYldVZ1pXNW5hVzVsSUhSb1lYUWdhVzF3YkdWdFpXNTBjeUJ6Y0dWbFpDMWpiMjUwY205c2JHVmtJR2x1ZEdWeVptRmpaVnh1SUNBZ0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlNBOUlHVnVaMmx1WlR0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlwYm5SbGNtWmhZMlVnUFNCY0luTndaV1ZrTFdOdmJuUnliMnhzWldSY0lqdGNiaUFnSUNBZ0lHVnVaMmx1WlM1elpYUlRjR1ZsWkVOdmJuUnliMnhzWldRb2RHaHBjeXdnWjJWMFEzVnljbVZ1ZEZScGJXVXNJR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaWs3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2hsYm1kcGJtVXVhVzF3YkdWdFpXNTBjMVJ5WVc1emNHOXlkR1ZrS0NrcElIdGNiaUFnSUNBZ0lDOHZJR0ZrWkNCMGFXMWxJR1Z1WjJsdVpTQjBhR0YwSUdsdGNHeGxiV1Z1ZEhNZ2RISmhibk53YjNKMFpXUWdhVzUwWlhKbVlXTmxYRzRnSUNBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsSUQwZ1pXNW5hVzVsTzF4dUlDQWdJQ0FnZEdocGN5NWZYMmx1ZEdWeVptRmpaU0E5SUZ3aWRISmhibk53YjNKMFpXUmNJanRjYmx4dUlDQWdJQ0FnWlc1bmFXNWxMbk5sZEZSeVlXNXpjRzl5ZEdWa0tIUm9hWE1zSURBc0lDaHVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNGdQU0J1ZFd4c0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUM4dklISmxjMlYwVG1WNGRGQnZjMmwwYVc5dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h1WlhoMFJXNW5hVzVsVUc5emFYUnBiMjRnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnZEdsdFpTQTlJSFJvYVhNdWMyTm9aV1IxYkdWeUxtTjFjbkpsYm5SVWFXMWxPMXh1SUNBZ0lDQWdJQ0FnSUhaaGNpQndiM05wZEdsdmJpQTlJSFJvYVhNdVgxOW5aWFJRYjNOcGRHbHZia0YwVkdsdFpTaDBhVzFsS1R0Y2JpQWdJQ0FnSUNBZ0lDQnVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNGdQU0JsYm1kcGJtVXVjM2x1WTFCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0IwYUdsekxsOWZjM0JsWldRcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYM0psYzJWMFRtVjRkRkJ2YzJsMGFXOXVLRzVsZUhSRmJtZHBibVZRYjNOcGRHbHZiaWs3WEc0Z0lDQWdJQ0I5TENCblpYUkRkWEp5Wlc1MFZHbHRaU3dnWjJWMFEzVnljbVZ1ZEZCdmMybDBhVzl1S1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0dWdVoybHVaUzVwYlhCc1pXMWxiblJ6VTJOb1pXUjFiR1ZrS0NrcElIdGNiaUFnSUNBZ0lDOHZJR0ZrWkNCMGFXMWxJR1Z1WjJsdVpTQjBhR0YwSUdsdGNHeGxiV1Z1ZEhNZ2MyTm9aV1IxYkdWa0lHbHVkR1Z5Wm1GalpWeHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdVoybHVaU0E5SUdWdVoybHVaVHRjYmlBZ0lDQWdJSFJvYVhNdVgxOXBiblJsY21aaFkyVWdQU0JjSW5OamFHVmtkV3hsWkZ3aU8xeHVYRzRnSUNBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2k1aFpHUW9aVzVuYVc1bExDQkpibVpwYm1sMGVTd2daMlYwUTNWeWNtVnVkRkJ2YzJsMGFXOXVLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWIySnFaV04wSUdOaGJtNXZkQ0JpWlNCaFpHUmxaQ0IwYnlCd2JHRjVJR052Ym5SeWIyeGNJaWs3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVWNGRISmhjRzlzWVhSbElIUnlZVzV6Y0c5eWRDQjBhVzFsSUdadmNpQm5hWFpsYmlCd2IzTnBkR2x2Ymx4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdjRzl6YVhScGIyNGdjRzl6YVhScGIyNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlNCbGVIUnlZWEJ2YkdGMFpXUWdkR2x0WlZ4dUlDQWdLaTljYmlBZ1gxOW5aWFJVYVcxbFFYUlFiM05wZEdsdmJpaHdiM05wZEdsdmJpa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmZEdsdFpTQXJJQ2h3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl3YjNOcGRHbHZiaWtnTHlCMGFHbHpMbDlmYzNCbFpXUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUlhoMGNtRndiMnhoZEdVZ2NHeGhlV2x1WnlCd2IzTnBkR2x2YmlCbWIzSWdaMmwyWlc0Z2RHbHRaVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2RHbHRaU0IwYVcxbFhHNGdJQ0FxSUVCeVpYUjFjbTRnZTA1MWJXSmxjbjBnWlhoMGNtRndiMnhoZEdWa0lIQnZjMmwwYVc5dVhHNGdJQ0FxTDF4dUlDQmZYMmRsZEZCdmMybDBhVzl1UVhSVWFXMWxLSFJwYldVcElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZYM0J2YzJsMGFXOXVJQ3NnS0hScGJXVWdMU0IwYUdsekxsOWZkR2x0WlNrZ0tpQjBhR2x6TGw5ZmMzQmxaV1E3WEc0Z0lIMWNibHh1SUNCZlgzTjVibU1vS1NCN1hHNGdJQ0FnZG1GeUlHNXZkeUE5SUhSb2FYTXVZM1Z5Y21WdWRGUnBiV1U3WEc0Z0lDQWdkR2hwY3k1ZlgzQnZjMmwwYVc5dUlDczlJQ2h1YjNjZ0xTQjBhR2x6TGw5ZmRHbHRaU2tnS2lCMGFHbHpMbDlmYzNCbFpXUTdYRzRnSUNBZ2RHaHBjeTVmWDNScGJXVWdQU0J1YjNjN1hHNGdJQ0FnY21WMGRYSnVJRzV2ZHp0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnWTNWeWNtVnVkQ0J0WVhOMFpYSWdjRzl6YVhScGIyNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlNCamRYSnlaVzUwSUhCc1lYbHBibWNnY0c5emFYUnBiMjVjYmlBZ0lDb3ZYRzRnSUY5ZmNtVnpaWFJPWlhoMFVHOXphWFJwYjI0b2JtVjRkRkJ2YzJsMGFXOXVLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMTl6WTJobFpIVnNaWEpJYjI5cktWeHVJQ0FnSUNBZ2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc3VjbVZ6WlhST1pYaDBWR2x0WlNoMGFHbHpMbDlmWjJWMFZHbHRaVUYwVUc5emFYUnBiMjRvYm1WNGRGQnZjMmwwYVc5dUtTazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmJtVjRkRkJ2YzJsMGFXOXVJRDBnYm1WNGRGQnZjMmwwYVc5dU8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCamRYSnlaVzUwSUcxaGMzUmxjaUIwYVcxbFhHNGdJQ0FxSUVCeVpYUjFjbTRnZTA1MWJXSmxjbjBnWTNWeWNtVnVkQ0IwYVcxbFhHNGdJQ0FxWEc0Z0lDQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z2QybHNiQ0JpWlNCeVpYQnNZV05sWkNCM2FHVnVJSFJvWlNCd2JHRjVMV052Ym5SeWIyd2dhWE1nWVdSa1pXUWdkRzhnWVNCdFlYTjBaWEl1WEc0Z0lDQXFMMXh1SUNCblpYUWdZM1Z5Y21WdWRGUnBiV1VvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWMyTm9aV1IxYkdWeUxtTjFjbkpsYm5SVWFXMWxPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRDQmpkWEp5Wlc1MElHMWhjM1JsY2lCd2IzTnBkR2x2Ymx4dUlDQWdLaUJBY21WMGRYSnVJSHRPZFcxaVpYSjlJR04xY25KbGJuUWdjR3hoZVdsdVp5QndiM05wZEdsdmJseHVJQ0FnS2x4dUlDQWdLaUJVYUdseklHWjFibU4wYVc5dUlIZHBiR3dnWW1VZ2NtVndiR0ZqWldRZ2QyaGxiaUIwYUdVZ2NHeGhlUzFqYjI1MGNtOXNJR2x6SUdGa1pHVmtJSFJ2SUdFZ2JXRnpkR1Z5TGx4dUlDQWdLaTljYmlBZ1oyVjBJR04xY25KbGJuUlFiM05wZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNCdmMybDBhVzl1SUNzZ0tIUm9hWE11YzJOb1pXUjFiR1Z5TG1OMWNuSmxiblJVYVcxbElDMGdkR2hwY3k1ZlgzUnBiV1VwSUNvZ2RHaHBjeTVmWDNOd1pXVmtPMXh1SUNCOVhHNWNiaUFnYzJWMElHeHZiM0FvWlc1aFlteGxLU0I3WEc0Z0lDQWdhV1lnS0dWdVlXSnNaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11WDE5c2IyOXdVM1JoY25RZ1BpQXRTVzVtYVc1cGRIa2dKaVlnZEdocGN5NWZYMnh2YjNCRmJtUWdQQ0JKYm1acGJtbDBlU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmYkc5dmNFTnZiblJ5YjJ3Z1BTQnVaWGNnVUd4aGVVTnZiblJ5YjJ4TWIyOXdRMjl1ZEhKdmJDaDBhR2x6S1R0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WTJobFpIVnNaWEl1WVdSa0tIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDd2dTVzVtYVc1cGRIa3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCcFppQW9kR2hwY3k1ZlgyeHZiM0JEYjI1MGNtOXNLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmphR1ZrZFd4bGNpNXlaVzF2ZG1Vb2RHaHBjeTVmWDJ4dmIzQkRiMjUwY205c0tUdGNiaUFnSUNBZ0lIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDQTlJRzUxYkd3N1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1oyVjBJR3h2YjNBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNnaElYUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDazdYRzRnSUgxY2JseHVJQ0J6WlhSTWIyOXdRbTkxYm1SaGNtbGxjeWh6ZEdGeWRDd2daVzVrS1NCN1hHNGdJQ0FnYVdZZ0tHVnVaQ0ErUFNCemRHRnlkQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZYMnh2YjNCVGRHRnlkQ0E5SUhOMFlYSjBPMXh1SUNBZ0lDQWdkR2hwY3k1ZlgyeHZiM0JGYm1RZ1BTQmxibVE3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11WDE5c2IyOXdVM1JoY25RZ1BTQmxibVE3WEc0Z0lDQWdJQ0IwYUdsekxsOWZiRzl2Y0VWdVpDQTlJSE4wWVhKME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXViRzl2Y0NBOUlIUm9hWE11Ykc5dmNEdGNiaUFnZlZ4dVhHNGdJSE5sZENCc2IyOXdVM1JoY25Rb2MzUmhjblJVYVcxbEtTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSTWIyOXdRbTkxYm1SaGNtbGxjeWh6ZEdGeWRGUnBiV1VzSUhSb2FYTXVYMTlzYjI5d1JXNWtLVHRjYmlBZ2ZWeHVYRzRnSUdkbGRDQnNiMjl3VTNSaGNuUW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5c2IyOXdVM1JoY25RN1hHNGdJSDFjYmx4dUlDQnpaWFFnYkc5dmNFVnVaQ2hsYm1SVWFXMWxLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUk1iMjl3UW05MWJtUmhjbWxsY3loMGFHbHpMbDlmYkc5dmNGTjBZWEowTENCbGJtUlVhVzFsS1R0Y2JpQWdmVnh1WEc0Z0lHZGxkQ0JzYjI5d1JXNWtLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmJHOXZjRVZ1WkR0Y2JpQWdmVnh1WEc0Z0lGOWZZWEJ3YkhsTWIyOXdRbTkxYm1SaGNtbGxjeWh3YjNOcGRHbHZiaXdnYzNCbFpXUXNJSE5sWldzcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZlgyeHZiM0JEYjI1MGNtOXNLU0I3WEc0Z0lDQWdJQ0JwWmlBb2MzQmxaV1FnUGlBd0lDWW1JSEJ2YzJsMGFXOXVJRDQ5SUhSb2FYTXVYMTlzYjI5d1JXNWtLVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyeHZiM0JUZEdGeWRDQXJJQ2h3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTlzYjI5d1UzUmhjblFwSUNVZ0tIUm9hWE11WDE5c2IyOXdSVzVrSUMwZ2RHaHBjeTVmWDJ4dmIzQlRkR0Z5ZENrN1hHNGdJQ0FnSUNCbGJITmxJR2xtSUNoemNHVmxaQ0E4SURBZ0ppWWdjRzl6YVhScGIyNGdQQ0IwYUdsekxsOWZiRzl2Y0ZOMFlYSjBLVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyeHZiM0JGYm1RZ0xTQW9kR2hwY3k1ZlgyeHZiM0JGYm1RZ0xTQndiM05wZEdsdmJpa2dKU0FvZEdocGN5NWZYMnh2YjNCRmJtUWdMU0IwYUdsekxsOWZiRzl2Y0ZOMFlYSjBLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2NHOXphWFJwYjI0N1hHNGdJSDFjYmx4dUlDQmZYM0psYzJOb1pXUjFiR1ZNYjI5d1EyOXVkSEp2YkNod2IzTnBkR2x2Yml3Z2MzQmxaV1FwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDJ4dmIzQkRiMjUwY205c0tTQjdYRzRnSUNBZ0lDQnBaaUFvYzNCbFpXUWdQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDNXpjR1ZsWkNBOUlITndaV1ZrTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5qYUdWa2RXeGxjaTV5WlhObGRDaDBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd3NJSFJvYVhNdVgxOW5aWFJVYVcxbFFYUlFiM05wZEdsdmJpaDBhR2x6TGw5ZmJHOXZjRVZ1WkNrcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHpjR1ZsWkNBOElEQXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMnh2YjNCRGIyNTBjbTlzTG5Od1pXVmtJRDBnYzNCbFpXUTdYRzRnSUNBZ0lDQWdJSFJvYVhNdWMyTm9aV1IxYkdWeUxuSmxjMlYwS0hSb2FYTXVYMTlzYjI5d1EyOXVkSEp2YkN3Z2RHaHBjeTVmWDJkbGRGUnBiV1ZCZEZCdmMybDBhVzl1S0hSb2FYTXVYMTlzYjI5d1UzUmhjblFwS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMk5vWldSMWJHVnlMbkpsYzJWMEtIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDd2dTVzVtYVc1cGRIa3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUZScGJXVkZibWRwYm1VZ2JXVjBhRzlrSUNoemNHVmxaQzFqYjI1MGNtOXNiR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdjM2x1WTFOd1pXVmtLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkN3Z2MyVmxheUE5SUdaaGJITmxLU0I3WEc0Z0lDQWdkbUZ5SUd4aGMzUlRjR1ZsWkNBOUlIUm9hWE11WDE5emNHVmxaRHRjYmx4dUlDQWdJR2xtSUNoemNHVmxaQ0FoUFQwZ2JHRnpkRk53WldWa0lIeDhJSE5sWldzcElIdGNiaUFnSUNBZ0lHbG1JQ2h6WldWcklIeDhJR3hoYzNSVGNHVmxaQ0E5UFQwZ01DbGNiaUFnSUNBZ0lDQWdjRzl6YVhScGIyNGdQU0IwYUdsekxsOWZZWEJ3YkhsTWIyOXdRbTkxYm1SaGNtbGxjeWh3YjNOcGRHbHZiaXdnYzNCbFpXUXBPMXh1WEc0Z0lDQWdJQ0IwYUdsekxsOWZkR2x0WlNBOUlIUnBiV1U3WEc0Z0lDQWdJQ0IwYUdsekxsOWZjRzl6YVhScGIyNGdQU0J3YjNOcGRHbHZianRjYmlBZ0lDQWdJSFJvYVhNdVgxOXpjR1ZsWkNBOUlITndaV1ZrTzF4dVhHNGdJQ0FnSUNCemQybDBZMmdnS0hSb2FYTXVYMTlwYm5SbGNtWmhZMlVwSUh0Y2JpQWdJQ0FnSUNBZ1kyRnpaU0JjSW5Od1pXVmtMV052Ym5SeWIyeHNaV1JjSWpwY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXNJSE5sWldzcE8xeHVJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVYRzRnSUNBZ0lDQWdJR05oYzJVZ1hDSjBjbUZ1YzNCdmNuUmxaRndpT2x4dUlDQWdJQ0FnSUNBZ0lIWmhjaUJ1WlhoMFVHOXphWFJwYjI0Z1BTQjBhR2x6TGw5ZmJtVjRkRkJ2YzJsMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSE5sWldzcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdVgxOWxibWRwYm1VdWMzbHVZMUJ2YzJsMGFXOXVLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hzWVhOMFUzQmxaV1FnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJSE4wWVhKMFhHNGdJQ0FnSUNBZ0lDQWdJQ0J1WlhoMFVHOXphWFJwYjI0Z1BTQjBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCaFpHUWdjMk5vWldSMWJHVnlJR2h2YjJzZ2RHOGdjMk5vWldSMWJHVnlJQ2gzYVd4c0lHSmxJSEpsYzJOb1pXUjFiR1ZrSUhSdklHRndjSEp2Y0hKcFlYUmxJSFJwYldVZ1ltVnNiM2NwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmMyTm9aV1IxYkdWeVNHOXZheUE5SUc1bGR5QlFiR0Y1UTI5dWRISnZiRk5qYUdWa2RXeGxja2h2YjJzb2RHaHBjeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2k1aFpHUW9kR2hwY3k1ZlgzTmphR1ZrZFd4bGNraHZiMnNzSUVsdVptbHVhWFI1S1R0Y2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLSE53WldWa0lEMDlQU0F3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCemRHOXdYRzRnSUNBZ0lDQWdJQ0FnSUNCdVpYaDBVRzl6YVhScGIyNGdQU0JKYm1acGJtbDBlVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYMTlsYm1kcGJtVXVjM2x1WTFOd1pXVmtLVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnTUNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklISmxiVzkyWlNCelkyaGxaSFZzWlhJZ2FHOXZheUJtY205dElITmphR1ZrZFd4bGNseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXpZMmhsWkhWc1pYSXVjbVZ0YjNabEtIUm9hWE11WDE5elkyaGxaSFZzWlhKSWIyOXJLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDE5elkyaGxaSFZzWlhKSWIyOXJJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hOd1pXVmtJQ29nYkdGemRGTndaV1ZrSUR3Z01Da2dleUF2THlCamFHRnVaMlVnZEhKaGJuTndiM0owSUdScGNtVmpkR2x2Ymx4dUlDQWdJQ0FnSUNBZ0lDQWdibVY0ZEZCdmMybDBhVzl1SUQwZ2RHaHBjeTVmWDJWdVoybHVaUzV6ZVc1alVHOXphWFJwYjI0b2RHbHRaU3dnY0c5emFYUnBiMjRzSUhOd1pXVmtLVHRjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tIUm9hWE11WDE5bGJtZHBibVV1YzNsdVkxTndaV1ZrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOWZaVzVuYVc1bExuTjVibU5UY0dWbFpDaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMTl5WlhObGRFNWxlSFJRYjNOcGRHbHZiaWh1WlhoMFVHOXphWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVYRzRnSUNBZ0lDQWdJR05oYzJVZ1hDSnpZMmhsWkhWc1pXUmNJanBjYmlBZ0lDQWdJQ0FnSUNCcFppQW9iR0Z6ZEZOd1pXVmtJRDA5UFNBd0tTQXZMeUJ6ZEdGeWRDQnZjaUJ6WldWclhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOWZjMk5vWldSMWJHVmtSVzVuYVc1bExuSmxjMlYwVG1WNGRGUnBiV1VvTUNrN1hHNGdJQ0FnSUNBZ0lDQWdaV3h6WlNCcFppQW9jM0JsWldRZ1BUMDlJREFwSUM4dklITjBiM0JjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDE5elkyaGxaSFZzWldSRmJtZHBibVV1Y21WelpYUk9aWGgwVkdsdFpTaEpibVpwYm1sMGVTazdYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdVgxOXlaWE5qYUdWa2RXeGxURzl2Y0VOdmJuUnliMndvY0c5emFYUnBiMjRzSUhOd1pXVmtLVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTNSaGNuUWdjR3hoZVdsdVoxeHVJQ0FnS2k5Y2JpQWdjM1JoY25Rb0tTQjdYRzRnSUNBZ2RtRnlJSFJwYldVZ1BTQjBhR2x6TGw5ZmMzbHVZeWdwTzF4dUlDQWdJSFJvYVhNdWMzbHVZMU53WldWa0tIUnBiV1VzSUhSb2FYTXVYMTl3YjNOcGRHbHZiaXdnZEdocGN5NWZYM0JzWVhscGJtZFRjR1ZsWkNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVR0YxYzJVZ2NHeGhlV2x1WjF4dUlDQWdLaTljYmlBZ2NHRjFjMlVvS1NCN1hHNGdJQ0FnZG1GeUlIUnBiV1VnUFNCMGFHbHpMbDlmYzNsdVl5Z3BPMXh1SUNBZ0lIUm9hWE11YzNsdVkxTndaV1ZrS0hScGJXVXNJSFJvYVhNdVgxOXdiM05wZEdsdmJpd2dNQ2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1UzUnZjQ0J3YkdGNWFXNW5YRzRnSUNBcUwxeHVJQ0J6ZEc5d0tDa2dlMXh1SUNBZ0lIWmhjaUIwYVcxbElEMGdkR2hwY3k1ZlgzTjVibU1vS1R0Y2JpQWdJQ0IwYUdsekxuTjVibU5UY0dWbFpDaDBhVzFsTENCMGFHbHpMbDlmY0c5emFYUnBiMjRzSURBcE8xeHVJQ0FnSUhSb2FYTXVjMlZsYXlnd0tUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJUWlhRZ2NHeGhlV2x1WnlCemNHVmxaRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2MzQmxaV1FnY0d4aGVXbHVaeUJ6Y0dWbFpDQW9ibTl1TFhwbGNtOGdjM0JsWldRZ1ltVjBkMlZsYmlBdE1UWWdZVzVrSUMweEx6RTJJRzl5SUdKbGRIZGxaVzRnTVM4eE5pQmhibVFnTVRZcFhHNGdJQ0FxTDF4dUlDQnpaWFFnYzNCbFpXUW9jM0JsWldRcElIdGNiaUFnSUNCMllYSWdkR2x0WlNBOUlIUm9hWE11WDE5emVXNWpLQ2s3WEc1Y2JpQWdJQ0JwWmlBb2MzQmxaV1FnUGowZ01Da2dlMXh1SUNBZ0lDQWdhV1lnS0hOd1pXVmtJRHdnTUM0d05qSTFLVnh1SUNBZ0lDQWdJQ0J6Y0dWbFpDQTlJREF1TURZeU5UdGNiaUFnSUNBZ0lHVnNjMlVnYVdZZ0tITndaV1ZrSUQ0Z01UWXBYRzRnSUNBZ0lDQWdJSE53WldWa0lEMGdNVFk3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHbG1JQ2h6Y0dWbFpDQThJQzB4TmlsY2JpQWdJQ0FnSUNBZ2MzQmxaV1FnUFNBdE1UWTdYRzRnSUNBZ0lDQmxiSE5sSUdsbUlDaHpjR1ZsWkNBK0lDMHdMakEyTWpVcFhHNGdJQ0FnSUNBZ0lITndaV1ZrSUQwZ0xUQXVNRFl5TlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxsOWZjR3hoZVdsdVoxTndaV1ZrSUQwZ2MzQmxaV1E3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDNOd1pXVmtJQ0U5UFNBd0tWeHVJQ0FnSUNBZ2RHaHBjeTV6ZVc1alUzQmxaV1FvZEdsdFpTd2dkR2hwY3k1ZlgzQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwSUhCc1lYbHBibWNnYzNCbFpXUmNiaUFnSUNvZ1FISmxkSFZ5YmlCamRYSnlaVzUwSUhCc1lYbHBibWNnYzNCbFpXUmNiaUFnSUNvdlhHNGdJR2RsZENCemNHVmxaQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgzQnNZWGxwYm1kVGNHVmxaRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCVFpYUWdLR3AxYlhBZ2RHOHBJSEJzWVhscGJtY2djRzl6YVhScGIyNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUhCdmMybDBhVzl1SUhSaGNtZGxkQ0J3YjNOcGRHbHZibHh1SUNBZ0tpOWNiaUFnYzJWbGF5aHdiM05wZEdsdmJpa2dlMXh1SUNBZ0lHbG1JQ2h3YjNOcGRHbHZiaUFoUFQwZ2RHaHBjeTVmWDNCdmMybDBhVzl1S1NCN1hHNGdJQ0FnSUNCMllYSWdkR2x0WlNBOUlIUm9hWE11WDE5emVXNWpLQ2s3WEc0Z0lDQWdJQ0IwYUdsekxsOWZjRzl6YVhScGIyNGdQU0J3YjNOcGRHbHZianRjYmlBZ0lDQWdJSFJvYVhNdWMzbHVZMU53WldWa0tIUnBiV1VzSUhCdmMybDBhVzl1TENCMGFHbHpMbDlmYzNCbFpXUXNJSFJ5ZFdVcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaVzF2ZG1VZ2RHbHRaU0JsYm1kcGJtVWdabkp2YlNCMGFHVWdkSEpoYm5Od2IzSjBYRzRnSUNBcUwxeHVJQ0JqYkdWaGNpZ3BJSHRjYmlBZ0lDQjJZWElnZEdsdFpTQTlJSFJvYVhNdVgxOXplVzVqS0NrN1hHNGdJQ0FnZEdocGN5NXplVzVqVTNCbFpXUW9kR2x0WlN3Z2RHaHBjeTVmWDNCdmMybDBhVzl1TENBd0tUdGNiaUFnSUNCMGFHbHpMbDlmWlc1bmFXNWxMbkpsYzJWMFNXNTBaWEptWVdObEtDazdYRzRnSUgxY2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JRYkdGNVEyOXVkSEp2YkRzaVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZShcIi4uL3V0aWxzL3ByaW9yaXR5LXF1ZXVlLWhlYXBcIik7XG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG5mdW5jdGlvbiBhcnJheVJlbW92ZShhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZih2YWx1ZSk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgU2NoZWR1bGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTY2hlZHVsZXIpO1xuXG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICB0aGlzLl9fcXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuICAgIHRoaXMuX19lbmdpbmVzID0gW107XG5cbiAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX19uZXh0VGltZSA9IEluZmluaXR5O1xuICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHNjaGVkdWxlciAoc2V0VGltZW91dCkgcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kIHx8IDAuMDI1O1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIGxvb2thaGVhZCB0aW1lICg+IHBlcmlvZClcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQgfHwgMC4xO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNjaGVkdWxlciwge1xuICAgIF9fdGljazoge1xuXG4gICAgICAvLyBzZXRUaW1lb3V0IHNjaGVkdWxpbmcgbG9vcFxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX190aWNrKCkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19uZXh0VGltZTtcblxuICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG5cbiAgICAgICAgd2hpbGUgKG5leHRUaW1lIDw9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIHRoaXMubG9va2FoZWFkKSB7XG4gICAgICAgICAgdGhpcy5fX2N1cnJlbnRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICAgICAgICB2YXIgZW5naW5lID0gdGhpcy5fX3F1ZXVlLmhlYWQ7XG4gICAgICAgICAgdmFyIHRpbWUgPSBlbmdpbmUuYWR2YW5jZVRpbWUodGhpcy5fX2N1cnJlbnRUaW1lKTtcblxuICAgICAgICAgIGlmICh0aW1lICYmIHRpbWUgPCBJbmZpbml0eSkge1xuICAgICAgICAgICAgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUubW92ZShlbmdpbmUsIE1hdGgubWF4KHRpbWUsIHRoaXMuX19jdXJyZW50VGltZSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5yZW1vdmUoZW5naW5lKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRpbWUgZW5naW5lIGZyb20gc2NoZWR1bGVyIGlmIGFkdmFuY2VUaW1lIHJldHVybnMgbnVsbC91bmRmaW5lZFxuICAgICAgICAgICAgaWYgKCF0aW1lICYmIGVuZ2luZS5tYXN0ZXIgPT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX2N1cnJlbnRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGUobmV4dFRpbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNjaGVkdWxlOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19yZXNjaGVkdWxlKG5leHRUaW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX190aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dFRpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgdGhpcy5fX25leHRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICAgICAgICB2YXIgdGltZU91dERlbGF5ID0gTWF0aC5tYXgobmV4dFRpbWUgLSB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMubG9va2FoZWFkLCB0aGlzLnBlcmlvZCk7XG5cbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuX190aWNrKCk7XG4gICAgICAgICAgfSwgdGltZU91dERlbGF5ICogMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHNjaGVkdWxlciB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgc2NoZWR1bGVyIHRpbWUgaW5jbHVkaW5nIGxvb2thaGVhZFxuICAgICAgICovXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRUaW1lIHx8IHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgdGhpcy5sb29rYWhlYWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGQgYSB0aW1lIGVuZ2luZSBvciBhIHNpbXBsZSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc2NoZWR1bGVyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5naW5lIHRpbWUgZW5naW5lIHRvIGJlIGFkZGVkIHRvIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIHNjaGVkdWxpbmcgdGltZVxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gZ2V0IGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAqIEByZXR1cm4gaGFuZGxlIHRvIHRoZSBzY2hlZHVsZWQgZW5naW5lICh1c2UgZm9yIGNhbGxpbmcgZnVydGhlciBtZXRob2RzKVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZW5naW5lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHRpbWUgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuY3VycmVudFRpbWUgOiBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciBnZXRDdXJyZW50UG9zaXRpb24gPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgaWYgKGVuZ2luZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgLy8gY29uc3RydWN0IG1pbmltYWwgc2NoZWR1bGVkIHRpbWUgZW5naW5lXG4gICAgICAgICAgZW5naW5lID0ge1xuICAgICAgICAgICAgYWR2YW5jZVRpbWU6IGVuZ2luZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFlbmdpbmUuaW1wbGVtZW50c1NjaGVkdWxlZCgpKSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgY2Fubm90IGJlIGFkZGVkIHRvIHNjaGVkdWxlclwiKTtcblxuICAgICAgICAgIGlmIChlbmdpbmUubWFzdGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgICAgICAgIC8vIHJlZ2lzdGVyIGVuZ2luZVxuICAgICAgICAgIHRoaXMuX19lbmdpbmVzLnB1c2goZW5naW5lKTtcblxuICAgICAgICAgIC8vIHNldCBzY2hlZHVsZWQgaW50ZXJmYWNlXG4gICAgICAgICAgZW5naW5lLnNldFNjaGVkdWxlZCh0aGlzLCBmdW5jdGlvbiAodGltZSkge1xuXG4gICAgICAgICAgICB2YXIgbmV4dFRpbWUgPSBfdGhpcy5fX3F1ZXVlLm1vdmUoZW5naW5lLCB0aW1lKTtcbiAgICAgICAgICAgIF90aGlzLl9fcmVzY2hlZHVsZShuZXh0VGltZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIH0sIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzY2hlZHVsZSBlbmdpbmUgb3IgY2FsbGJhY2tcbiAgICAgICAgdmFyIG5leHRUaW1lID0gdGhpcy5fX3F1ZXVlLmluc2VydChlbmdpbmUsIHRpbWUpO1xuICAgICAgICB0aGlzLl9fcmVzY2hlZHVsZShuZXh0VGltZSk7XG5cbiAgICAgICAgcmV0dXJuIGVuZ2luZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIHRpbWUgZW5naW5lIGZyb20gdGhlIHNjaGVkdWxlclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayB0byBiZSByZW1vdmVkIGZyb20gdGhlIHNjaGVkdWxlclxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoZW5naW5lKSB7XG4gICAgICAgIHZhciBtYXN0ZXIgPSBlbmdpbmUubWFzdGVyO1xuXG4gICAgICAgIGlmIChtYXN0ZXIpIHtcblxuICAgICAgICAgIGlmIChtYXN0ZXIgIT09IHRoaXMpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBzY2hlZHVsZXJcIik7XG5cbiAgICAgICAgICBlbmdpbmUucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICBhcnJheVJlbW92ZSh0aGlzLl9fZW5naW5lcywgZW5naW5lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGUobmV4dFRpbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNjaGVkdWxlIGEgc2NoZWR1bGVkIHRpbWUgZW5naW5lIG9yIGNhbGxiYWNrIGF0IGEgZ2l2ZW4gdGltZVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayB0byBiZSByZXNjaGVkdWxlZFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZSB3aGVuIHRvIHJlc2NoZWR1bGVcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoZW5naW5lLCB0aW1lKSB7XG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5tb3ZlKGVuZ2luZSwgdGltZSk7XG4gICAgICAgIHRoaXMuX19yZXNjaGVkdWxlKG5leHRUaW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGFsbCBzY2hkZWR1bGVkIGNhbGxiYWNrcyBhbmQgZW5naW5lcyBmcm9tIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9fdGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3F1ZXVlLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX19lbmdpbmVzLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gU2NoZWR1bGVyO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZXI7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgc2NoZWR1bGVyIHNpbmdsZXRvbiBiYXNlZCBvbiBhdWRpbyB0aW1lICh0aW1lLWVuZ2luZSBtYXN0ZXIpXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTl0WVhOMFpYSnpMM05qYUdWa2RXeGxjaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZQUVN4SlFVRkpMR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zT0VKQlFUaENMRU5CUVVNc1EwRkJRenRCUVVNMVJDeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZhRVFzVTBGQlV5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOcVF5eE5RVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3p0QlFVVnFReXhOUVVGSkxFdEJRVXNzU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEWkN4VFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTjJRaXhYUVVGUExFbEJRVWtzUTBGQlF6dEhRVU5pT3p0QlFVVkVMRk5CUVU4c1MwRkJTeXhEUVVGRE8wTkJRMlE3TzBsQlJVc3NVMEZCVXp0QlFVTkdMRmRCUkZBc1UwRkJVeXhEUVVORUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FVUnNReXhUUVVGVE96dEJRVVZZTEZGQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1dVRkJXU3hEUVVGRE96dEJRVVZxUXl4UlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzWVVGQllTeEZRVUZGTEVOQlFVTTdRVUZEYmtNc1VVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhCQ0xGRkJRVWtzUTBGQlF5eGhRVUZoTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXpGQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NVVUZCVVN4RFFVRkRPMEZCUXpOQ0xGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRPenM3T3pzN1FVRk5kRUlzVVVGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF6czdPenM3TzBGQlRYUkRMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNTVUZCU1N4SFFVRkhMRU5CUVVNN1IwRkRNME03TzJWQmRFSkhMRk5CUVZNN1FVRjVRbUlzVlVGQlRUczdPenRoUVVGQkxHdENRVUZITzBGQlExQXNXVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU55UXl4WlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVXZRaXhaUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZkRUlzWlVGQlR5eFJRVUZSTEVsQlFVa3NXVUZCV1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlF6VkVMR05CUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZET3p0QlFVVTVRaXhqUVVGSkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNdlFpeGpRVUZKTEVsQlFVa3NSMEZCUnl4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1FVRkZiRVFzWTBGQlNTeEpRVUZKTEVsQlFVa3NTVUZCU1N4SFFVRkhMRkZCUVZFc1JVRkJSVHRCUVVNelFpeHZRa0ZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJRenRYUVVNeFJTeE5RVUZOTzBGQlEwd3NiMEpCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenM3TzBGQlIzWkRMR2RDUVVGSkxFTkJRVU1zU1VGQlNTeEpRVUZKTEUxQlFVMHNRMEZCUXl4TlFVRk5MRXRCUVVzc1NVRkJTU3hGUVVGRk8wRkJRMjVETEc5Q1FVRk5MRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03WVVGRGVrSTdWMEZGUmp0VFFVTkdPenRCUVVWRUxGbEJRVWtzUTBGQlF5eGhRVUZoTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXpGQ0xGbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1QwRkROMEk3TzBGQlJVUXNaMEpCUVZrN1lVRkJRU3h6UWtGQlF5eFJRVUZSTEVWQlFVVTdPenRCUVVOeVFpeFpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVN1FVRkRiRUlzYzBKQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE4wSXNZMEZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU03VTBGRGRrSTdPMEZCUlVRc1dVRkJTU3hSUVVGUkxFdEJRVXNzVVVGQlVTeEZRVUZGTzBGQlEzcENMR05CUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVVVGQlVTeERRVUZET3p0QlFVVXpRaXhqUVVGSkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXpzN1FVRkZkRWNzWTBGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4VlFVRlZMRU5CUVVNc1dVRkJUVHRCUVVOb1F5eHJRa0ZCU3l4TlFVRk5MRVZCUVVVc1EwRkJRenRYUVVObUxFVkJRVVVzV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRPMU5CUTNwQ08wOUJRMFk3TzBGQlRVY3NaVUZCVnpzN096czdPenRYUVVGQkxGbEJRVWM3UVVGRGFFSXNaVUZCVHl4SlFVRkpMRU5CUVVNc1lVRkJZU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03VDBGRE4wVTdPMEZCVTBRc1QwRkJSenM3T3pzN096czdPenRoUVVGQkxHRkJRVU1zVFVGQlRTeEZRVUZ6UkRzN08xbEJRWEJFTEVsQlFVa3NaME5CUVVjc1NVRkJTU3hEUVVGRExGZEJRVmM3V1VGQlJTeHJRa0ZCYTBJc1owTkJRVWNzU1VGQlNUczdRVUZETlVRc1dVRkJTU3hOUVVGTkxGbEJRVmtzVVVGQlVTeEZRVUZGT3p0QlFVVTVRaXhuUWtGQlRTeEhRVUZITzBGQlExQXNkVUpCUVZjc1JVRkJSU3hOUVVGTk8xZEJRM0JDTEVOQlFVTTdVMEZEU0N4TlFVRk5PMEZCUTB3c1kwRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eHRRa0ZCYlVJc1JVRkJSU3hGUVVNdlFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMSEZEUVVGeFF5eERRVUZETEVOQlFVTTdPMEZCUlhwRUxHTkJRVWtzVFVGQlRTeERRVUZETEUxQlFVMHNSVUZEWml4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExESkRRVUV5UXl4RFFVRkRMRU5CUVVNN096dEJRVWN2UkN4alFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXpzN08wRkJSelZDTEdkQ1FVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExFbEJRVWtzUlVGQlJTeFZRVUZETEVsQlFVa3NSVUZCU3pzN1FVRkZiRU1zWjBKQlFVa3NVVUZCVVN4SFFVRkhMRTFCUVVzc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRMME1zYTBKQlFVc3NXVUZCV1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8xZEJRemRDTEVWQlFVVXNXVUZCVFR0QlFVTlFMRzFDUVVGUExFMUJRVXNzVjBGQlZ5eERRVUZETzFkQlEzcENMRVZCUVVVc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0VFFVTjRRanM3TzBGQlIwUXNXVUZCU1N4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRMnBFTEZsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJUVkNMR1ZCUVU4c1RVRkJUU3hEUVVGRE8wOUJRMlk3TzBGQlRVUXNWVUZCVFRzN096czdPenRoUVVGQkxHZENRVUZETEUxQlFVMHNSVUZCUlR0QlFVTmlMRmxCUVVrc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTTdPMEZCUlROQ0xGbEJRVWtzVFVGQlRTeEZRVUZGT3p0QlFVVldMR05CUVVrc1RVRkJUU3hMUVVGTExFbEJRVWtzUlVGRGFrSXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNRMEZCUXl4RFFVRkRPenRCUVVWcVJTeG5Ra0ZCVFN4RFFVRkRMR05CUVdNc1JVRkJSU3hEUVVGRE8wRkJRM2hDTEhGQ1FVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0VFFVTnlRenM3UVVGRlJDeFpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXpReXhaUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMDlCUXpkQ096dEJRVTlFTEZOQlFVczdPenM3T3pzN08yRkJRVUVzWlVGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RlFVRkZPMEZCUTJ4Q0xGbEJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhaUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMDlCUXpkQ096dEJRVXRFTEZOQlFVczdPenM3T3p0aFFVRkJMR2xDUVVGSE8wRkJRMDRzV1VGQlNTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZPMEZCUTJ4Q0xITkNRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRemRDTEdOQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRE8xTkJRM1pDT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdRVUZEY2tJc1dVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMDlCUXpOQ096czdPMU5CYUV0SExGTkJRVk03T3p0QlFXMUxaaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0ltWnBiR1VpT2lKbGN6WXZiV0Z6ZEdWeWN5OXpZMmhsWkhWc1pYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpQjNjbWwwZEdWdUlHbHVJRVZEVFVGelkzSnBjSFFnTmlBcUwxeHVMeW9xWEc0Z0tpQkFabWxzWlc5MlpYSjJhV1YzSUZkQlZrVWdjMk5vWldSMWJHVnlJSE5wYm1kc1pYUnZiaUJpWVhObFpDQnZiaUJoZFdScGJ5QjBhVzFsSUNoMGFXMWxMV1Z1WjJsdVpTQnRZWE4wWlhJcFhHNGdLaUJBWVhWMGFHOXlJRTV2Y21KbGNuUXVVMk5vYm1Wc2JFQnBjbU5oYlM1bWNpd2dWbWxqZEc5eUxsTmhhWHBBYVhKallXMHVabklzSUV0aGNtbHRMa0poY210aGRHbEFhWEpqWVcwdVpuSmNiaUFxTDF4dUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc1MllYSWdVSEpwYjNKcGRIbFJkV1YxWlNBOUlISmxjWFZwY21Vb1hDSXVMaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlMxb1pXRndYQ0lwTzF4dWRtRnlJRlJwYldWRmJtZHBibVVnUFNCeVpYRjFhWEpsS0Z3aUxpNHZZMjl5WlM5MGFXMWxMV1Z1WjJsdVpWd2lLVHRjYmx4dVpuVnVZM1JwYjI0Z1lYSnlZWGxTWlcxdmRtVW9ZWEp5WVhrc0lIWmhiSFZsS1NCN1hHNGdJSFpoY2lCcGJtUmxlQ0E5SUdGeWNtRjVMbWx1WkdWNFQyWW9kbUZzZFdVcE8xeHVYRzRnSUdsbUlDaHBibVJsZUNBK1BTQXdLU0I3WEc0Z0lDQWdZWEp5WVhrdWMzQnNhV05sS0dsdVpHVjRMQ0F4S1R0Y2JpQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCbVlXeHpaVHRjYm4xY2JseHVZMnhoYzNNZ1UyTm9aV1IxYkdWeUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb1lYVmthVzlEYjI1MFpYaDBMQ0J2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNCMGFHbHpMbUYxWkdsdlEyOXVkR1Y0ZENBOUlHRjFaR2x2UTI5dWRHVjRkRHRjYmx4dUlDQWdJSFJvYVhNdVgxOXhkV1YxWlNBOUlHNWxkeUJRY21sdmNtbDBlVkYxWlhWbEtDazdYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaWE1nUFNCYlhUdGNibHh1SUNBZ0lIUm9hWE11WDE5amRYSnlaVzUwVkdsdFpTQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZYMjVsZUhSVWFXMWxJRDBnU1c1bWFXNXBkSGs3WEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ2MyTm9aV1IxYkdWeUlDaHpaWFJVYVcxbGIzVjBLU0J3WlhKcGIyUmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNHVnlhVzlrSUQwZ2IzQjBhVzl1Y3k1d1pYSnBiMlFnZkh6Q29EQXVNREkxTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ2MyTm9aV1IxYkdWeUlHeHZiMnRoYUdWaFpDQjBhVzFsSUNnK0lIQmxjbWx2WkNsY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VG5WdFltVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Ykc5dmEyRm9aV0ZrSUQwZ2IzQjBhVzl1Y3k1c2IyOXJZV2hsWVdRZ2ZIekNvREF1TVR0Y2JpQWdmVnh1WEc0Z0lDOHZJSE5sZEZScGJXVnZkWFFnYzJOb1pXUjFiR2x1WnlCc2IyOXdYRzRnSUY5ZmRHbGpheWdwSUh0Y2JpQWdJQ0IyWVhJZ1lYVmthVzlEYjI1MFpYaDBJRDBnZEdocGN5NWhkV1JwYjBOdmJuUmxlSFE3WEc0Z0lDQWdkbUZ5SUc1bGVIUlVhVzFsSUQwZ2RHaHBjeTVmWDI1bGVIUlVhVzFsTzF4dVhHNGdJQ0FnZEdocGN5NWZYM1JwYldWdmRYUWdQU0J1ZFd4c08xeHVYRzRnSUNBZ2QyaHBiR1VnS0c1bGVIUlVhVzFsSUR3OUlHRjFaR2x2UTI5dWRHVjRkQzVqZFhKeVpXNTBWR2x0WlNBcklIUm9hWE11Ykc5dmEyRm9aV0ZrS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDlmWTNWeWNtVnVkRlJwYldVZ1BTQnVaWGgwVkdsdFpUdGNibHh1SUNBZ0lDQWdkbUZ5SUdWdVoybHVaU0E5SUhSb2FYTXVYMTl4ZFdWMVpTNW9aV0ZrTzF4dUlDQWdJQ0FnZG1GeUlIUnBiV1VnUFNCbGJtZHBibVV1WVdSMllXNWpaVlJwYldVb2RHaHBjeTVmWDJOMWNuSmxiblJVYVcxbEtUdGNibHh1SUNBZ0lDQWdhV1lnS0hScGJXVWdKaVlnZEdsdFpTQThJRWx1Wm1sdWFYUjVLU0I3WEc0Z0lDQWdJQ0FnSUc1bGVIUlVhVzFsSUQwZ2RHaHBjeTVmWDNGMVpYVmxMbTF2ZG1Vb1pXNW5hVzVsTENCTllYUm9MbTFoZUNoMGFXMWxMQ0IwYUdsekxsOWZZM1Z5Y21WdWRGUnBiV1VwS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc1bGVIUlVhVzFsSUQwZ2RHaHBjeTVmWDNGMVpYVmxMbkpsYlc5MlpTaGxibWRwYm1VcE8xeHVYRzRnSUNBZ0lDQWdJQzh2SUhKbGJXOTJaU0IwYVcxbElHVnVaMmx1WlNCbWNtOXRJSE5qYUdWa2RXeGxjaUJwWmlCaFpIWmhibU5sVkdsdFpTQnlaWFIxY201eklHNTFiR3d2ZFc1a1ptbHVaV1JjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhVzFsSUNZbUlHVnVaMmx1WlM1dFlYTjBaWElnUFQwOUlIUm9hWE1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQmxibWRwYm1VdWNtVnpaWFJKYm5SbGNtWmhZMlVvS1RzZ0lDQWdJQ0FnSUNBZ1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11WDE5amRYSnlaVzUwVkdsdFpTQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZYM0psYzJOb1pXUjFiR1VvYm1WNGRGUnBiV1VwTzF4dUlDQjlYRzVjYmlBZ1gxOXlaWE5qYUdWa2RXeGxLRzVsZUhSVWFXMWxLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMTkwYVcxbGIzVjBLU0I3WEc0Z0lDQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHaHBjeTVmWDNScGJXVnZkWFFwTzF4dUlDQWdJQ0FnZEdocGN5NWZYM1JwYldWdmRYUWdQU0J1ZFd4c08xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaHVaWGgwVkdsdFpTQWhQVDBnU1c1bWFXNXBkSGtwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMTl1WlhoMFZHbHRaU0E5SUc1bGVIUlVhVzFsTzF4dVhHNGdJQ0FnSUNCMllYSWdkR2x0WlU5MWRFUmxiR0Y1SUQwZ1RXRjBhQzV0WVhnb0tHNWxlSFJVYVcxbElDMGdkR2hwY3k1aGRXUnBiME52Ym5SbGVIUXVZM1Z5Y21WdWRGUnBiV1VnTFNCMGFHbHpMbXh2YjJ0aGFHVmhaQ2tzSUhSb2FYTXVjR1Z5YVc5a0tUdGNibHh1SUNBZ0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzUnBZMnNvS1R0Y2JpQWdJQ0FnSUgwc0lIUnBiV1ZQZFhSRVpXeGhlU0FxSURFd01EQXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJIWlhRZ2MyTm9aV1IxYkdWeUlIUnBiV1ZjYmlBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQmpkWEp5Wlc1MElITmphR1ZrZFd4bGNpQjBhVzFsSUdsdVkyeDFaR2x1WnlCc2IyOXJZV2hsWVdSY2JpQWdJQ292WEc0Z0lHZGxkQ0JqZFhKeVpXNTBWR2x0WlNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZYMk4xY25KbGJuUlVhVzFsSUh4OElIUm9hWE11WVhWa2FXOURiMjUwWlhoMExtTjFjbkpsYm5SVWFXMWxJQ3NnZEdocGN5NXNiMjlyWVdobFlXUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUVdSa0lHRWdkR2x0WlNCbGJtZHBibVVnYjNJZ1lTQnphVzF3YkdVZ1kyRnNiR0poWTJzZ1puVnVZM1JwYjI0Z2RHOGdkR2hsSUhOamFHVmtkV3hsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdaVzVuYVc1bElIUnBiV1VnWlc1bmFXNWxJSFJ2SUdKbElHRmtaR1ZrSUhSdklIUm9aU0J6WTJobFpIVnNaWEpjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIUnBiV1VnYzJOb1pXUjFiR2x1WnlCMGFXMWxYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU4wYVc5dUlIUnZJR2RsZENCamRYSnlaVzUwSUhCdmMybDBhVzl1WEc0Z0lDQXFJRUJ5WlhSMWNtNGdhR0Z1Wkd4bElIUnZJSFJvWlNCelkyaGxaSFZzWldRZ1pXNW5hVzVsSUNoMWMyVWdabTl5SUdOaGJHeHBibWNnWm5WeWRHaGxjaUJ0WlhSb2IyUnpLVnh1SUNBZ0tpOWNiaUFnWVdSa0tHVnVaMmx1WlN3Z2RHbHRaU0E5SUhSb2FYTXVZM1Z5Y21WdWRGUnBiV1VzSUdkbGRFTjFjbkpsYm5SUWIzTnBkR2x2YmlBOUlHNTFiR3dwSUh0Y2JpQWdJQ0JwWmlBb1pXNW5hVzVsSUdsdWMzUmhibU5sYjJZZ1JuVnVZM1JwYjI0cElIdGNiaUFnSUNBZ0lDOHZJR052Ym5OMGNuVmpkQ0J0YVc1cGJXRnNJSE5qYUdWa2RXeGxaQ0IwYVcxbElHVnVaMmx1WlZ4dUlDQWdJQ0FnWlc1bmFXNWxJRDBnZTF4dUlDQWdJQ0FnSUNCaFpIWmhibU5sVkdsdFpUb2daVzVuYVc1bFhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JwWmlBb0lXVnVaMmx1WlM1cGJYQnNaVzFsYm5SelUyTm9aV1IxYkdWa0tDa3BYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJbTlpYW1WamRDQmpZVzV1YjNRZ1ltVWdZV1JrWldRZ2RHOGdjMk5vWldSMWJHVnlYQ0lwTzF4dVhHNGdJQ0FnSUNCcFppQW9aVzVuYVc1bExtMWhjM1JsY2lsY2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWIySnFaV04wSUdoaGN5QmhiSEpsWVdSNUlHSmxaVzRnWVdSa1pXUWdkRzhnWVNCdFlYTjBaWEpjSWlrN1hHNWNiaUFnSUNBZ0lDOHZJSEpsWjJsemRHVnlJR1Z1WjJsdVpWeHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdVoybHVaWE11Y0hWemFDaGxibWRwYm1VcE8xeHVYRzRnSUNBZ0lDQXZMeUJ6WlhRZ2MyTm9aV1IxYkdWa0lHbHVkR1Z5Wm1GalpWeHVJQ0FnSUNBZ1pXNW5hVzVsTG5ObGRGTmphR1ZrZFd4bFpDaDBhR2x6TENBb2RHbHRaU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdkbUZ5SUc1bGVIUlVhVzFsSUQwZ2RHaHBjeTVmWDNGMVpYVmxMbTF2ZG1Vb1pXNW5hVzVsTENCMGFXMWxLVHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYM0psYzJOb1pXUjFiR1VvYm1WNGRGUnBiV1VwTzF4dUlDQWdJQ0FnZlN3Z0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWpkWEp5Wlc1MFZHbHRaVHRjYmlBZ0lDQWdJSDBzSUdkbGRFTjFjbkpsYm5SUWIzTnBkR2x2YmlrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2MyTm9aV1IxYkdVZ1pXNW5hVzVsSUc5eUlHTmhiR3hpWVdOclhHNGdJQ0FnZG1GeUlHNWxlSFJVYVcxbElEMGdkR2hwY3k1ZlgzRjFaWFZsTG1sdWMyVnlkQ2hsYm1kcGJtVXNJSFJwYldVcE8xeHVJQ0FnSUhSb2FYTXVYMTl5WlhOamFHVmtkV3hsS0c1bGVIUlVhVzFsS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJsYm1kcGJtVTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WdGIzWmxJR0VnZEdsdFpTQmxibWRwYm1VZ1puSnZiU0IwYUdVZ2MyTm9aV1IxYkdWeVhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0JsYm1kcGJtVWdkR2x0WlNCbGJtZHBibVVnYjNJZ1kyRnNiR0poWTJzZ2RHOGdZbVVnY21WdGIzWmxaQ0JtY205dElIUm9aU0J6WTJobFpIVnNaWEpjYmlBZ0lDb3ZYRzRnSUhKbGJXOTJaU2hsYm1kcGJtVXBJSHRjYmlBZ0lDQjJZWElnYldGemRHVnlJRDBnWlc1bmFXNWxMbTFoYzNSbGNqdGNibHh1SUNBZ0lHbG1JQ2h0WVhOMFpYSXBJSHRjYmlBZ0lDQWdJRnh1SUNBZ0lDQWdhV1lnS0cxaGMzUmxjaUFoUFQwZ2RHaHBjeWxjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYjJKcVpXTjBJR2hoY3lCdWIzUWdZbVZsYmlCaFpHUmxaQ0IwYnlCMGFHbHpJSE5qYUdWa2RXeGxjbHdpS1R0Y2JseHVJQ0FnSUNBZ1pXNW5hVzVsTG5KbGMyVjBTVzUwWlhKbVlXTmxLQ2s3WEc0Z0lDQWdJQ0JoY25KaGVWSmxiVzkyWlNoMGFHbHpMbDlmWlc1bmFXNWxjeXdnWlc1bmFXNWxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjJZWElnYm1WNGRGUnBiV1VnUFNCMGFHbHpMbDlmY1hWbGRXVXVjbVZ0YjNabEtHVnVaMmx1WlNrN1hHNGdJQ0FnZEdocGN5NWZYM0psYzJOb1pXUjFiR1VvYm1WNGRGUnBiV1VwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxjMk5vWldSMWJHVWdZU0J6WTJobFpIVnNaV1FnZEdsdFpTQmxibWRwYm1VZ2IzSWdZMkZzYkdKaFkyc2dZWFFnWVNCbmFYWmxiaUIwYVcxbFhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0JsYm1kcGJtVWdkR2x0WlNCbGJtZHBibVVnYjNJZ1kyRnNiR0poWTJzZ2RHOGdZbVVnY21WelkyaGxaSFZzWldSY2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJSFJwYldVZ2RHbHRaU0IzYUdWdUlIUnZJSEpsYzJOb1pXUjFiR1ZjYmlBZ0lDb3ZYRzRnSUhKbGMyVjBLR1Z1WjJsdVpTd2dkR2x0WlNrZ2UxeHVJQ0FnSUhaaGNpQnVaWGgwVkdsdFpTQTlJSFJvYVhNdVgxOXhkV1YxWlM1dGIzWmxLR1Z1WjJsdVpTd2dkR2x0WlNrN1hHNGdJQ0FnZEdocGN5NWZYM0psYzJOb1pXUjFiR1VvYm1WNGRGUnBiV1VwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxiVzkyWlNCaGJHd2djMk5vWkdWa2RXeGxaQ0JqWVd4c1ltRmphM01nWVc1a0lHVnVaMmx1WlhNZ1puSnZiU0IwYUdVZ2MyTm9aV1IxYkdWeVhHNGdJQ0FxTDF4dUlDQmpiR1ZoY2lncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZlgzUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lHTnNaV0Z5VkdsdFpXOTFkQ2gwYUdsekxsOWZkR2x0Wlc5MWRDazdYRzRnSUNBZ0lDQjBhR2x6TGw5ZmRHbHRaVzkxZENBOUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1ZlgzRjFaWFZsTG1Oc1pXRnlLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlhNdWJHVnVaM1JvSUQwZ01EdGNiaUFnZlZ4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRk5qYUdWa2RXeGxjanNpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxuLyogd3JpdHRlbiBpbiBFQ01Bc2NyaXB0IDYgKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIHNpbXBsaWZpZWQgc2NoZWR1bGVyIHNpbmdsZXRvbiBiYXNlZCBvbiBhdWRpbyB0aW1lICh0aW1lLWVuZ2luZSBtYXN0ZXIpXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG5mdW5jdGlvbiBhcnJheVJlbW92ZShhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZih2YWx1ZSk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgU2ltcGxlU2NoZWR1bGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2ltcGxlU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaW1wbGVTY2hlZHVsZXIpO1xuXG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICB0aGlzLl9fZW5naW5lcyA9IFtdO1xuXG4gICAgdGhpcy5fX3NjaGVkRW5naW5lcyA9IFtdO1xuICAgIHRoaXMuX19zY2hlZFRpbWVzID0gW107XG5cbiAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHNjaGVkdWxlciAoc2V0VGltZW91dCkgcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kIHx8IDAuMDI1O1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIGxvb2thaGVhZCB0aW1lICg+IHBlcmlvZClcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQgfHwgMC4xO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNpbXBsZVNjaGVkdWxlciwge1xuICAgIF9fc2NoZWR1bGVFbmdpbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3NjaGVkdWxlRW5naW5lKGVuZ2luZSwgdGltZSkge1xuICAgICAgICB0aGlzLl9fc2NoZWRFbmdpbmVzLnB1c2goZW5naW5lKTtcbiAgICAgICAgdGhpcy5fX3NjaGVkVGltZXMucHVzaCh0aW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fcmVzY2hlZHVsZUVuZ2luZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVzY2hlZHVsZUVuZ2luZShlbmdpbmUsIHRpbWUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fX3NjaGVkRW5naW5lcy5pbmRleE9mKGVuZ2luZSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBpZiAodGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlZFRpbWVzW2luZGV4XSA9IHRpbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlZEVuZ2luZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlZFRpbWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBfX3Vuc2NoZWR1bGVFbmdpbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3Vuc2NoZWR1bGVFbmdpbmUoZW5naW5lKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX19zY2hlZEVuZ2luZXMuaW5kZXhPZihlbmdpbmUpO1xuXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX3NjaGVkRW5naW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHRoaXMuX19zY2hlZFRpbWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIF9fcmVzZXRUaWNrOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19yZXNldFRpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLl9fc2NoZWRFbmdpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX190aW1lb3V0KSB0aGlzLl9fdGljaygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX190aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIF9fdGljazoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fdGljaygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGVuZ2luZSA9IHRoaXMuX19zY2hlZEVuZ2luZXNbaV07XG4gICAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc2NoZWRUaW1lc1tpXTtcblxuICAgICAgICAgIHdoaWxlICh0aW1lICYmIHRpbWUgPD0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgdGhpcy5sb29rYWhlYWQpIHtcbiAgICAgICAgICAgIHRpbWUgPSBNYXRoLm1heCh0aW1lLCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fX2N1cnJlbnRUaW1lID0gdGltZTtcbiAgICAgICAgICAgIHRpbWUgPSBlbmdpbmUuYWR2YW5jZVRpbWUodGltZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRpbWUgJiYgdGltZSA8IEluZmluaXR5KSB7XG4gICAgICAgICAgICB0aGlzLl9fc2NoZWRUaW1lc1tpKytdID0gdGltZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fX3Vuc2NoZWR1bGVFbmdpbmUoZW5naW5lKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGVuZ2luZSBmcm9tIHNjaGVkdWxlclxuICAgICAgICAgICAgaWYgKCF0aW1lICYmIGFycmF5UmVtb3ZlKHRoaXMuX19lbmdpbmVzLCBlbmdpbmUpKSBlbmdpbmUucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuX190aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5fX3RpY2soKTtcbiAgICAgICAgICB9LCB0aGlzLnBlcmlvZCAqIDEwMDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjdXJyZW50VGltZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBzY2hlZHVsZXIgdGltZVxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHNjaGVkdWxlciB0aW1lIGluY2x1ZGluZyBsb29rYWhlYWRcbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jdXJyZW50VGltZSB8fCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIHRoaXMubG9va2FoZWFkO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FsbGJhY2s6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGQgYSBjYWxsYmFjayB0byB0aGUgc2NoZWR1bGVyXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbih0aW1lKSB0byBiZSBjYWxsZWRcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIG9mIGZpcnN0IGNhbGxiYWNrIChkZWZhdWx0IGlzIG5vdylcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgY2FsbGJhY2sgcGVyaW9kIChkZWZhdWx0IGlzIDAgZm9yIG9uZS1zaG90KVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSBzY2hlZHVsZWQgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY2FsbCByZW1vdmUgYW5kIHJlc2V0XG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbGxiYWNrKGNhbGxiYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHRpbWUgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuY3VycmVudFRpbWUgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdmFyIGVuZ2luZVdyYXBwZXIgPSB7XG4gICAgICAgICAgYWR2YW5jZVRpbWU6IGNhbGxiYWNrRnVuY3Rpb25cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fc2NoZWR1bGVFbmdpbmUoZW5naW5lV3JhcHBlciwgdGltZSk7XG4gICAgICAgIHRoaXMuX19yZXNldFRpY2soKTtcblxuICAgICAgICByZXR1cm4gZW5naW5lV3JhcHBlcjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbmdpbmUgdGltZSBlbmdpbmUgdG8gYmUgYWRkZWQgdG8gdGhlIHNjaGVkdWxlclxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgc2NoZWR1bGluZyB0aW1lXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChlbmdpbmUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgdGltZSA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5jdXJyZW50VGltZSA6IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIGdldEN1cnJlbnRQb3NpdGlvbiA9IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1syXTtcblxuICAgICAgICBpZiAoZW5naW5lIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAvLyBjb25zdHJ1Y3QgbWluaW1hbCBzY2hlZHVsZWQgdGltZSBlbmdpbmVcbiAgICAgICAgICBlbmdpbmUgPSB7XG4gICAgICAgICAgICBhZHZhbmNlVGltZTogZW5naW5lXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWVuZ2luZS5pbXBsZW1lbnRzU2NoZWR1bGVkKCkpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gc2NoZWR1bGVyXCIpO1xuXG4gICAgICAgICAgaWYgKGVuZ2luZS5tYXN0ZXIpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIGEgbWFzdGVyXCIpO1xuXG4gICAgICAgICAgLy8gcmVnaXN0ZXIgZW5naW5lXG4gICAgICAgICAgdGhpcy5fX2VuZ2luZXMucHVzaChlbmdpbmUpO1xuXG4gICAgICAgICAgLy8gc2V0IHNjaGVkdWxlZCBpbnRlcmZhY2VcbiAgICAgICAgICBlbmdpbmUuc2V0U2NoZWR1bGVkKHRoaXMsIGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgICAgICBfdGhpcy5fX3Jlc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKTtcbiAgICAgICAgICAgIF90aGlzLl9fcmVzZXRUaWNrKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIH0sIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2V0VGljaygpO1xuXG4gICAgICAgIHJldHVybiBlbmdpbmU7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmU6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgYSBzY2hlZHVsZWQgdGltZSBlbmdpbmUgb3IgY2FsbGJhY2sgZnJvbSB0aGUgc2NoZWR1bGVyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5naW5lIHRpbWUgZW5naW5lIG9yIGNhbGxiYWNrIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgc2NoZWR1bGVyXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShlbmdpbmUpIHtcbiAgICAgICAgdmFyIG1hc3RlciA9IGVuZ2luZS5tYXN0ZXI7XG5cbiAgICAgICAgaWYgKG1hc3Rlcikge1xuICAgICAgICAgIGlmIChtYXN0ZXIgIT09IHRoaXMpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBzY2hlZHVsZXJcIik7XG5cbiAgICAgICAgICBlbmdpbmUucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICBhcnJheVJlbW92ZSh0aGlzLl9fZW5naW5lcywgZW5naW5lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX191bnNjaGVkdWxlRW5naW5lKGVuZ2luZSk7XG4gICAgICAgIHRoaXMuX19yZXNldFRpY2soKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2V0OiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzY2hlZHVsZSBhIHNjaGVkdWxlZCB0aW1lIGVuZ2luZSBvciBjYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayB0byBiZSByZXNjaGVkdWxlZFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZSB3aGVuIHRvIHJlc2NoZWR1bGVcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoZW5naW5lLCB0aW1lKSB7XG4gICAgICAgIHRoaXMuX19yZXNjaGVkdWxlRW5naW5lKGVuZ2luZSwgdGltZSk7XG4gICAgICAgIHRoaXMuX19yZXNldFRpY2soKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9fdGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3NjaGVkRW5naW5lcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9fc2NoZWRUaW1lcy5sZW5ndGggPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFNpbXBsZVNjaGVkdWxlcjtcbn0pKCk7XG5cbi8vIGV4cG9ydCBzY2hlZHVsZXIgc2luZ2xldG9uXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXBsZVNjaGVkdWxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGTlFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZhRVFzVTBGQlV5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOcVF5eE5RVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3p0QlFVVnFReXhOUVVGSkxFdEJRVXNzU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEWkN4VFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTjJRaXhYUVVGUExFbEJRVWtzUTBGQlF6dEhRVU5pT3p0QlFVVkVMRk5CUVU4c1MwRkJTeXhEUVVGRE8wTkJRMlE3TzBsQlJVc3NaVUZCWlR0QlFVTlNMRmRCUkZBc1pVRkJaU3hEUVVOUUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FVUnNReXhsUVVGbE96dEJRVVZxUWl4UlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExGbEJRVmtzUTBGQlF6czdRVUZGYWtNc1VVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhCQ0xGRkJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNwQ0xGRkJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NSVUZCUlN4RFFVRkRPenRCUVVWMlFpeFJRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVNeFFpeFJRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJRenM3T3pzN08wRkJUWFJDTEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTTdPenM3T3p0QlFVMTBReXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRWxCUVVzc1IwRkJSeXhEUVVGRE8wZEJRelZET3p0bFFYWkNSeXhsUVVGbE8wRkJlVUp1UWl4dlFrRkJaMEk3WVVGQlFTd3dRa0ZCUXl4TlFVRk5MRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRemRDTEZsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlEycERMRmxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMDlCUXpsQ096dEJRVVZFTEhOQ1FVRnJRanRoUVVGQkxEUkNRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRMMElzV1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdPMEZCUldoRUxGbEJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTmtMR05CUVVrc1NVRkJTU3hMUVVGTExGRkJRVkVzUlVGQlJUdEJRVU55UWl4blFrRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1YwRkRha01zVFVGQlRUdEJRVU5NTEdkQ1FVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja01zWjBKQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0WFFVTndRenRUUVVOR08wOUJRMFk3TzBGQlJVUXNjMEpCUVd0Q08yRkJRVUVzTkVKQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNwQ0xGbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZET3p0QlFVVm9SQ3haUVVGSkxFdEJRVXNzU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEWkN4alFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja01zWTBGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzFOQlEzQkRPMDlCUTBZN08wRkJSVVFzWlVGQlZ6dGhRVUZCTEhWQ1FVRkhPMEZCUTFvc1dVRkJTU3hKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRiRU1zWTBGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUTJwQ0xFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0VFFVTnFRaXhOUVVGTkxFbEJRVWtzU1VGQlNTeERRVUZETEZOQlFWTXNSVUZCUlR0QlFVTjZRaXh6UWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVNM1FpeGpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJRenRUUVVOMlFqdFBRVU5HT3p0QlFVVkVMRlZCUVUwN1lVRkJRU3hyUWtGQlJ6czdPMEZCUTFBc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTnlReXhaUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlZZc1pVRkJUeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRja01zWTBGQlNTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU53UXl4alFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWb1F5eHBRa0ZCVHl4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSkxGbEJRVmtzUTBGQlF5eFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVOb1JTeG5Ra0ZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVOb1JDeG5Ra0ZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRE1VSXNaMEpCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMWRCUTJwRE96dEJRVVZFTEdOQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhSUVVGUkxFVkJRVVU3UVVGRE0wSXNaMEpCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1YwRkRMMElzVFVGQlRUdEJRVU5NTEdkQ1FVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN096dEJRVWRvUXl4blFrRkJTU3hEUVVGRExFbEJRVWtzU1VGQlNTeFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUlVGRE9VTXNUVUZCVFN4RFFVRkRMR05CUVdNc1JVRkJSU3hEUVVGRE8xZEJRek5DTzFOQlEwWTdPMEZCUlVRc1dVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZETVVJc1dVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdPMEZCUlhSQ0xGbEJRVWtzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRMnhETEdOQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1ZVRkJWU3hEUVVGRExGbEJRVTA3UVVGRGFFTXNhMEpCUVVzc1RVRkJUU3hGUVVGRkxFTkJRVU03VjBGRFppeEZRVUZGTEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExFTkJRVU03VTBGRGVFSTdUMEZEUmpzN1FVRk5SeXhsUVVGWE96czdPenM3TzFkQlFVRXNXVUZCUnp0QlFVTm9RaXhsUVVGUExFbEJRVWtzUTBGQlF5eGhRVUZoTEVsQlFVa3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXp0UFFVTTNSVHM3UVVGVFJDeFpRVUZST3pzN096czdPenM3TzJGQlFVRXNhMEpCUVVNc1owSkJRV2RDTEVWQlFUSkNPMWxCUVhwQ0xFbEJRVWtzWjBOQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjN08wRkJRMmhFTEZsQlFVa3NZVUZCWVN4SFFVRkhPMEZCUTJ4Q0xIRkNRVUZYTEVWQlFVVXNaMEpCUVdkQ08xTkJRemxDTEVOQlFVTTdPMEZCUlVZc1dVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU16UXl4WlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03TzBGQlJXNUNMR1ZCUVU4c1lVRkJZU3hEUVVGRE8wOUJRM1JDT3p0QlFVOUVMRTlCUVVjN096czdPenM3TzJGQlFVRXNZVUZCUXl4TlFVRk5MRVZCUVhORU96czdXVUZCY0VRc1NVRkJTU3huUTBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnp0WlFVRkZMR3RDUVVGclFpeG5RMEZCUnl4SlFVRkpPenRCUVVNMVJDeFpRVUZKTEUxQlFVMHNXVUZCV1N4UlFVRlJMRVZCUVVVN08wRkJSVGxDTEdkQ1FVRk5MRWRCUVVjN1FVRkRVQ3gxUWtGQlZ5eEZRVUZGTEUxQlFVMDdWMEZEY0VJc1EwRkJRenRUUVVOSUxFMUJRVTA3UVVGRFRDeGpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVWQlF5OUNMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zY1VOQlFYRkRMRU5CUVVNc1EwRkJRenM3UVVGRmVrUXNZMEZCU1N4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVObUxFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNNa05CUVRKRExFTkJRVU1zUTBGQlF6czdPMEZCUnk5RUxHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE96czdRVUZITlVJc1owSkJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRlZCUVVNc1NVRkJTU3hGUVVGTE8wRkJRMnhETEd0Q1FVRkxMR3RDUVVGclFpeERRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOMFF5eHJRa0ZCU3l4WFFVRlhMRVZCUVVVc1EwRkJRenRYUVVOd1FpeEZRVUZGTEZsQlFVMDdRVUZEVUN4dFFrRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF6dFhRVU42UWl4RlFVRkZMR3RDUVVGclFpeERRVUZETEVOQlFVTTdVMEZEZUVJN08wRkJSVVFzV1VGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTndReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdPMEZCUlc1Q0xHVkJRVThzVFVGQlRTeERRVUZETzA5QlEyWTdPMEZCVFVRc1ZVRkJUVHM3T3pzN096dGhRVUZCTEdkQ1FVRkRMRTFCUVUwc1JVRkJSVHRCUVVOaUxGbEJRVWtzVFVGQlRTeEhRVUZITEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN08wRkJSVE5DTEZsQlFVa3NUVUZCVFN4RlFVRkZPMEZCUTFZc1kwRkJTU3hOUVVGTkxFdEJRVXNzU1VGQlNTeEZRVU5xUWl4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExEWkRRVUUyUXl4RFFVRkRMRU5CUVVNN08wRkJSV3BGTEdkQ1FVRk5MRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03UVVGRGVFSXNjVUpCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMU5CUTNKRE96dEJRVVZFTEZsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTm9ReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdUMEZEY0VJN08wRkJUMFFzVTBGQlN6czdPenM3T3pzN1lVRkJRU3hsUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVWQlFVVTdRVUZEYkVJc1dVRkJTU3hEUVVGRExHdENRVUZyUWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU4wUXl4WlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03VDBGRGNFSTdPMEZCUlVRc1UwRkJTenRoUVVGQkxHbENRVUZITzBGQlEwNHNXVUZCU1N4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRMnhDTEhOQ1FVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF6ZENMR05CUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETzFOQlEzWkNPenRCUVVWRUxGbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNdlFpeFpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03VDBGRE9VSTdPenM3VTBGd1RVY3NaVUZCWlRzN096dEJRWGROY2tJc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eGxRVUZsTEVOQlFVTWlMQ0ptYVd4bElqb2laWE0yTDNWMGFXeHpMM0J5YVc5eWFYUjVMWEYxWlhWbExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvZ2QzSnBkSFJsYmlCcGJpQkZRMDFCYzJOeWFYQjBJRFlnS2k5Y2JpOHFLbHh1SUNvZ1FHWnBiR1Z2ZG1WeWRtbGxkeUJYUVZaRklITnBiWEJzYVdacFpXUWdjMk5vWldSMWJHVnlJSE5wYm1kc1pYUnZiaUJpWVhObFpDQnZiaUJoZFdScGJ5QjBhVzFsSUNoMGFXMWxMV1Z1WjJsdVpTQnRZWE4wWlhJcFhHNGdLaUJBWVhWMGFHOXlJRTV2Y21KbGNuUXVVMk5vYm1Wc2JFQnBjbU5oYlM1bWNpd2dWbWxqZEc5eUxsTmhhWHBBYVhKallXMHVabklzSUV0aGNtbHRMa0poY210aGRHbEFhWEpqWVcwdVpuSmNiaUFxTDF4dVhHNTJZWElnVkdsdFpVVnVaMmx1WlNBOUlISmxjWFZwY21Vb1hDSXVMaTlqYjNKbEwzUnBiV1V0Wlc1bmFXNWxYQ0lwTzF4dVhHNW1kVzVqZEdsdmJpQmhjbkpoZVZKbGJXOTJaU2hoY25KaGVTd2dkbUZzZFdVcElIdGNiaUFnZG1GeUlHbHVaR1Y0SUQwZ1lYSnlZWGt1YVc1a1pYaFBaaWgyWVd4MVpTazdYRzVjYmlBZ2FXWWdLR2x1WkdWNElENDlJREFwSUh0Y2JpQWdJQ0JoY25KaGVTNXpjR3hwWTJVb2FXNWtaWGdzSURFcE8xeHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlHWmhiSE5sTzF4dWZWeHVYRzVqYkdGemN5QlRhVzF3YkdWVFkyaGxaSFZzWlhJZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2loaGRXUnBiME52Ym5SbGVIUXNJRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwSUQwZ1lYVmthVzlEYjI1MFpYaDBPMXh1WEc0Z0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlhNZ1BTQmJYVHRjYmx4dUlDQWdJSFJvYVhNdVgxOXpZMmhsWkVWdVoybHVaWE1nUFNCYlhUdGNiaUFnSUNCMGFHbHpMbDlmYzJOb1pXUlVhVzFsY3lBOUlGdGRPMXh1WEc0Z0lDQWdkR2hwY3k1ZlgyTjFjbkpsYm5SVWFXMWxJRDBnYm5Wc2JEdGNiaUFnSUNCMGFHbHpMbDlmZEdsdFpXOTFkQ0E5SUc1MWJHdzdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJ6WTJobFpIVnNaWElnS0hObGRGUnBiV1Z2ZFhRcElIQmxjbWx2WkZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV3WlhKcGIyUWdQU0J2Y0hScGIyNXpMbkJsY21sdlpDQjhmQ0F3TGpBeU5UdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJSE5qYUdWa2RXeGxjaUJzYjI5cllXaGxZV1FnZEdsdFpTQW9QaUJ3WlhKcGIyUXBYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxteHZiMnRoYUdWaFpDQTlJRzl3ZEdsdmJuTXViRzl2YTJGb1pXRmtJSHg4SUNBd0xqRTdYRzRnSUgxY2JseHVJQ0JmWDNOamFHVmtkV3hsUlc1bmFXNWxLR1Z1WjJsdVpTd2dkR2x0WlNrZ2UxeHVJQ0FnSUhSb2FYTXVYMTl6WTJobFpFVnVaMmx1WlhNdWNIVnphQ2hsYm1kcGJtVXBPMXh1SUNBZ0lIUm9hWE11WDE5elkyaGxaRlJwYldWekxuQjFjMmdvZEdsdFpTazdYRzRnSUgxY2JseHVJQ0JmWDNKbGMyTm9aV1IxYkdWRmJtZHBibVVvWlc1bmFXNWxMQ0IwYVcxbEtTQjdYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdkR2hwY3k1ZlgzTmphR1ZrUlc1bmFXNWxjeTVwYm1SbGVFOW1LR1Z1WjJsdVpTazdYRzVjYmlBZ0lDQnBaaUFvYVc1a1pYZ2dQajBnTUNrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJwYldVZ0lUMDlJRWx1Wm1sdWFYUjVLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTl6WTJobFpGUnBiV1Z6VzJsdVpHVjRYU0E5SUhScGJXVTdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmMyTm9aV1JGYm1kcGJtVnpMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXpZMmhsWkZScGJXVnpMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdYMTkxYm5OamFHVmtkV3hsUlc1bmFXNWxLR1Z1WjJsdVpTa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJSFJvYVhNdVgxOXpZMmhsWkVWdVoybHVaWE11YVc1a1pYaFBaaWhsYm1kcGJtVXBPMXh1WEc0Z0lDQWdhV1lnS0dsdVpHVjRJRDQ5SURBcElIdGNiaUFnSUNBZ0lIUm9hWE11WDE5elkyaGxaRVZ1WjJsdVpYTXVjM0JzYVdObEtHbHVaR1Y0TENBeEtUdGNiaUFnSUNBZ0lIUm9hWE11WDE5elkyaGxaRlJwYldWekxuTndiR2xqWlNocGJtUmxlQ3dnTVNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1gxOXlaWE5sZEZScFkyc29LU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMTl6WTJobFpFVnVaMmx1WlhNdWJHVnVaM1JvSUQ0Z01Da2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbDlmZEdsdFpXOTFkQ2xjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYM1JwWTJzb0tUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tIUm9hWE11WDE5MGFXMWxiM1YwS1NCN1hHNGdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9kR2hwY3k1ZlgzUnBiV1Z2ZFhRcE8xeHVJQ0FnSUNBZ2RHaHBjeTVmWDNScGJXVnZkWFFnUFNCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJRjlmZEdsamF5Z3BJSHRjYmlBZ0lDQjJZWElnWVhWa2FXOURiMjUwWlhoMElEMGdkR2hwY3k1aGRXUnBiME52Ym5SbGVIUTdYRzRnSUNBZ2RtRnlJR2tnUFNBd08xeHVYRzRnSUNBZ2QyaHBiR1VnS0drZ1BDQjBhR2x6TGw5ZmMyTm9aV1JGYm1kcGJtVnpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdkbUZ5SUdWdVoybHVaU0E5SUhSb2FYTXVYMTl6WTJobFpFVnVaMmx1WlhOYmFWMDdYRzRnSUNBZ0lDQjJZWElnZEdsdFpTQTlJSFJvYVhNdVgxOXpZMmhsWkZScGJXVnpXMmxkTzF4dVhHNGdJQ0FnSUNCM2FHbHNaU0FvZEdsdFpTQW1KaUIwYVcxbElEdzlJR0YxWkdsdlEyOXVkR1Y0ZEM1amRYSnlaVzUwVkdsdFpTQXJJSFJvYVhNdWJHOXZhMkZvWldGa0tTQjdYRzRnSUNBZ0lDQWdJSFJwYldVZ1BTQk5ZWFJvTG0xaGVDaDBhVzFsTENCaGRXUnBiME52Ym5SbGVIUXVZM1Z5Y21WdWRGUnBiV1VwTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWTNWeWNtVnVkRlJwYldVZ1BTQjBhVzFsTzF4dUlDQWdJQ0FnSUNCMGFXMWxJRDBnWlc1bmFXNWxMbUZrZG1GdVkyVlVhVzFsS0hScGJXVXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHbHRaU0FtSmlCMGFXMWxJRHdnU1c1bWFXNXBkSGtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDNOamFHVmtWR2x0WlhOYmFTc3JYU0E5SUhScGJXVTdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmRXNXpZMmhsWkhWc1pVVnVaMmx1WlNobGJtZHBibVVwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQmxibWRwYm1VZ1puSnZiU0J6WTJobFpIVnNaWEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhVzFsSUNZbUlHRnljbUY1VW1WdGIzWmxLSFJvYVhNdVgxOWxibWRwYm1WekxDQmxibWRwYm1VcEtWeHVJQ0FnSUNBZ0lDQWdJR1Z1WjJsdVpTNXlaWE5sZEVsdWRHVnlabUZqWlNncE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVYMTlqZFhKeVpXNTBWR2x0WlNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11WDE5elkyaGxaRVZ1WjJsdVpYTXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZYM1JwYldWdmRYUWdQU0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYM1JwWTJzb0tUdGNiaUFnSUNBZ0lIMHNJSFJvYVhNdWNHVnlhVzlrSUNvZ01UQXdNQ2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRDQnpZMmhsWkhWc1pYSWdkR2x0WlZ4dUlDQWdLaUJBY21WMGRYSnVJSHRPZFcxaVpYSjlJR04xY25KbGJuUWdjMk5vWldSMWJHVnlJSFJwYldVZ2FXNWpiSFZrYVc1bklHeHZiMnRoYUdWaFpGeHVJQ0FnS2k5Y2JpQWdaMlYwSUdOMWNuSmxiblJVYVcxbEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmWTNWeWNtVnVkRlJwYldVZ2ZId2dkR2hwY3k1aGRXUnBiME52Ym5SbGVIUXVZM1Z5Y21WdWRGUnBiV1VnS3lCMGFHbHpMbXh2YjJ0aGFHVmhaRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQlpHUWdZU0JqWVd4c1ltRmpheUIwYnlCMGFHVWdjMk5vWldSMWJHVnlYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHTmhiR3hpWVdOcklHWjFibU4wYVc5dUtIUnBiV1VwSUhSdklHSmxJR05oYkd4bFpGeHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZEdsdFpTQnZaaUJtYVhKemRDQmpZV3hzWW1GamF5QW9aR1ZtWVhWc2RDQnBjeUJ1YjNjcFhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0J3WlhKcGIyUWdZMkZzYkdKaFkyc2djR1Z5YVc5a0lDaGtaV1poZFd4MElHbHpJREFnWm05eUlHOXVaUzF6YUc5MEtWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0UFltcGxZM1I5SUhOamFHVmtkV3hsWkNCdlltcGxZM1FnZEdoaGRDQmpZVzRnWW1VZ2RYTmxaQ0IwYnlCallXeHNJSEpsYlc5MlpTQmhibVFnY21WelpYUmNiaUFnSUNvdlhHNGdJR05oYkd4aVlXTnJLR05oYkd4aVlXTnJSblZ1WTNScGIyNHNJSFJwYldVZ1BTQjBhR2x6TG1OMWNuSmxiblJVYVcxbEtTQjdYRzRnSUNBZ2RtRnlJR1Z1WjJsdVpWZHlZWEJ3WlhJZ1BTQjdYRzRnSUNBZ0lDQmhaSFpoYm1ObFZHbHRaVG9nWTJGc2JHSmhZMnRHZFc1amRHbHZibHh1SUNBZ0lIMDdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmMyTm9aV1IxYkdWRmJtZHBibVVvWlc1bmFXNWxWM0poY0hCbGNpd2dkR2x0WlNrN1hHNGdJQ0FnZEdocGN5NWZYM0psYzJWMFZHbGpheWdwTzF4dVhHNGdJQ0FnY21WMGRYSnVJR1Z1WjJsdVpWZHlZWEJ3WlhJN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRV1JrSUdFZ2RHbHRaU0JsYm1kcGJtVWdkRzhnZEdobElITmphR1ZrZFd4bGNseHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnWlc1bmFXNWxJSFJwYldVZ1pXNW5hVzVsSUhSdklHSmxJR0ZrWkdWa0lIUnZJSFJvWlNCelkyaGxaSFZzWlhKY2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJSFJwYldVZ2MyTm9aV1IxYkdsdVp5QjBhVzFsWEc0Z0lDQXFMMXh1SUNCaFpHUW9aVzVuYVc1bExDQjBhVzFsSUQwZ2RHaHBjeTVqZFhKeVpXNTBWR2x0WlN3Z1oyVjBRM1Z5Y21WdWRGQnZjMmwwYVc5dUlEMGdiblZzYkNrZ2UxeHVJQ0FnSUdsbUlDaGxibWRwYm1VZ2FXNXpkR0Z1WTJWdlppQkdkVzVqZEdsdmJpa2dlMXh1SUNBZ0lDQWdMeThnWTI5dWMzUnlkV04wSUcxcGJtbHRZV3dnYzJOb1pXUjFiR1ZrSUhScGJXVWdaVzVuYVc1bFhHNGdJQ0FnSUNCbGJtZHBibVVnUFNCN1hHNGdJQ0FnSUNBZ0lHRmtkbUZ1WTJWVWFXMWxPaUJsYm1kcGJtVmNiaUFnSUNBZ0lIMDdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdsbUlDZ2haVzVuYVc1bExtbHRjR3hsYldWdWRITlRZMmhsWkhWc1pXUW9LU2xjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYjJKcVpXTjBJR05oYm01dmRDQmlaU0JoWkdSbFpDQjBieUJ6WTJobFpIVnNaWEpjSWlrN1hHNWNiaUFnSUNBZ0lHbG1JQ2hsYm1kcGJtVXViV0Z6ZEdWeUtWeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnZZbXBsWTNRZ2FHRnpJR0ZzY21WaFpIa2dZbVZsYmlCaFpHUmxaQ0IwYnlCaElHMWhjM1JsY2x3aUtUdGNibHh1SUNBZ0lDQWdMeThnY21WbmFYTjBaWElnWlc1bmFXNWxYRzRnSUNBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsY3k1d2RYTm9LR1Z1WjJsdVpTazdYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQnpZMmhsWkhWc1pXUWdhVzUwWlhKbVlXTmxYRzRnSUNBZ0lDQmxibWRwYm1VdWMyVjBVMk5vWldSMWJHVmtLSFJvYVhNc0lDaDBhVzFsS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXlaWE5qYUdWa2RXeGxSVzVuYVc1bEtHVnVaMmx1WlN3Z2RHbHRaU2s3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTl5WlhObGRGUnBZMnNvS1R0Y2JpQWdJQ0FnSUgwc0lDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVZM1Z5Y21WdWRGUnBiV1U3WEc0Z0lDQWdJQ0I5TENCblpYUkRkWEp5Wlc1MFVHOXphWFJwYjI0cE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVYMTl6WTJobFpIVnNaVVZ1WjJsdVpTaGxibWRwYm1Vc0lIUnBiV1VwTzF4dUlDQWdJSFJvYVhNdVgxOXlaWE5sZEZScFkyc29LVHRjYmx4dUlDQWdJSEpsZEhWeWJpQmxibWRwYm1VN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZ0YjNabElHRWdjMk5vWldSMWJHVmtJSFJwYldVZ1pXNW5hVzVsSUc5eUlHTmhiR3hpWVdOcklHWnliMjBnZEdobElITmphR1ZrZFd4bGNseHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnWlc1bmFXNWxJSFJwYldVZ1pXNW5hVzVsSUc5eUlHTmhiR3hpWVdOcklIUnZJR0psSUhKbGJXOTJaV1FnWm5KdmJTQjBhR1VnYzJOb1pXUjFiR1Z5WEc0Z0lDQXFMMXh1SUNCeVpXMXZkbVVvWlc1bmFXNWxLU0I3WEc0Z0lDQWdkbUZ5SUcxaGMzUmxjaUE5SUdWdVoybHVaUzV0WVhOMFpYSTdYRzVjYmlBZ0lDQnBaaUFvYldGemRHVnlLU0I3WEc0Z0lDQWdJQ0JwWmlBb2JXRnpkR1Z5SUNFOVBTQjBhR2x6S1Z4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdlltcGxZM1FnYUdGeklHNXZkQ0JpWldWdUlHRmtaR1ZrSUhSdklIUm9hWE1nYzJOb1pXUjFiR1Z5WENJcE8xeHVYRzRnSUNBZ0lDQmxibWRwYm1VdWNtVnpaWFJKYm5SbGNtWmhZMlVvS1R0Y2JpQWdJQ0FnSUdGeWNtRjVVbVZ0YjNabEtIUm9hWE11WDE5bGJtZHBibVZ6TENCbGJtZHBibVVwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVgxOTFibk5qYUdWa2RXeGxSVzVuYVc1bEtHVnVaMmx1WlNrN1hHNGdJQ0FnZEdocGN5NWZYM0psYzJWMFZHbGpheWdwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxjMk5vWldSMWJHVWdZU0J6WTJobFpIVnNaV1FnZEdsdFpTQmxibWRwYm1VZ2IzSWdZMkZzYkdKaFkydGNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUdWdVoybHVaU0IwYVcxbElHVnVaMmx1WlNCdmNpQmpZV3hzWW1GamF5QjBieUJpWlNCeVpYTmphR1ZrZFd4bFpGeHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZEdsdFpTQjBhVzFsSUhkb1pXNGdkRzhnY21WelkyaGxaSFZzWlZ4dUlDQWdLaTljYmlBZ2NtVnpaWFFvWlc1bmFXNWxMQ0IwYVcxbEtTQjdYRzRnSUNBZ2RHaHBjeTVmWDNKbGMyTm9aV1IxYkdWRmJtZHBibVVvWlc1bmFXNWxMQ0IwYVcxbEtUdGNiaUFnSUNCMGFHbHpMbDlmY21WelpYUlVhV05yS0NrN1hHNGdJSDFjYmx4dUlDQmpiR1ZoY2lncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZlgzUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lHTnNaV0Z5VkdsdFpXOTFkQ2gwYUdsekxsOWZkR2x0Wlc5MWRDazdYRzRnSUNBZ0lDQjBhR2x6TGw5ZmRHbHRaVzkxZENBOUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1ZlgzTmphR1ZrUlc1bmFXNWxjeTVzWlc1bmRHZ2dQU0F3TzF4dUlDQWdJSFJvYVhNdVgxOXpZMmhsWkZScGJXVnpMbXhsYm1kMGFDQTlJREE3WEc0Z0lIMWNibjFjYmx4dUx5OGdaWGh3YjNKMElITmphR1ZrZFd4bGNpQnphVzVuYkdWMGIyNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVMmx0Y0d4bFUyTm9aV1IxYkdWeU8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFRpbWVFbmdpbmUgPSByZXF1aXJlKFwiLi4vY29yZS90aW1lLWVuZ2luZVwiKTtcbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZShcIi4uL3V0aWxzL3ByaW9yaXR5LXF1ZXVlLWhlYXBcIik7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoXCIuL2ZhY3Rvcmllc1wiKTtcblxudmFyIGdldFNjaGVkdWxlciA9IF9yZXF1aXJlLmdldFNjaGVkdWxlcjtcblxuZnVuY3Rpb24gcmVtb3ZlQ291cGxlKGZpcnN0QXJyYXksIHNlY29uZEFycmF5LCBmaXJzdEVsZW1lbnQpIHtcbiAgdmFyIGluZGV4ID0gZmlyc3RBcnJheS5pbmRleE9mKGZpcnN0RWxlbWVudCk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICB2YXIgc2Vjb25kRWxlbWVudCA9IHNlY29uZEFycmF5W2luZGV4XTtcblxuICAgIGZpcnN0QXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBzZWNvbmRBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgcmV0dXJuIHNlY29uZEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFRyYW5zcG9ydGVkID0gKGZ1bmN0aW9uIChfVGltZUVuZ2luZSkge1xuICBmdW5jdGlvbiBUcmFuc3BvcnRlZCh0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zcG9ydGVkKTtcblxuICAgIHRoaXMuX190cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLl9fc3RhcnRQb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb247XG4gICAgdGhpcy5fX2VuZFBvc2l0aW9uID0gZW5kUG9zaXRpb247XG4gICAgdGhpcy5fX29mZnNldFBvc2l0aW9uID0gb2Zmc2V0UG9zaXRpb247XG4gICAgdGhpcy5fX3NjYWxlUG9zaXRpb24gPSAxO1xuICAgIHRoaXMuX19oYWx0UG9zaXRpb24gPSBJbmZpbml0eTsgLy8gZW5naW5lJ3MgbmV4dCBoYWx0IHBvc2l0aW9uIHdoZW4gbm90IHJ1bm5pbmcgKGlzIG51bGwgd2hlbiBlbmdpbmUgaGVzIGJlZW4gc3RhcnRlZClcbiAgfVxuXG4gIF9pbmhlcml0cyhUcmFuc3BvcnRlZCwgX1RpbWVFbmdpbmUpO1xuXG4gIF9jcmVhdGVDbGFzcyhUcmFuc3BvcnRlZCwge1xuICAgIHNldEJvdW5kYXJpZXM6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRCb3VuZGFyaWVzKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIG9mZnNldFBvc2l0aW9uID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBzdGFydFBvc2l0aW9uIDogYXJndW1lbnRzWzJdO1xuICAgICAgICB2YXIgc2NhbGVQb3NpdGlvbiA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gMSA6IGFyZ3VtZW50c1szXTtcbiAgICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMuX19zdGFydFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgICBfdGhpcy5fX2VuZFBvc2l0aW9uID0gZW5kUG9zaXRpb247XG4gICAgICAgICAgX3RoaXMuX19vZmZzZXRQb3NpdGlvbiA9IG9mZnNldFBvc2l0aW9uO1xuICAgICAgICAgIF90aGlzLl9fc2NhbGVQb3NpdGlvbiA9IHNjYWxlUG9zaXRpb247XG4gICAgICAgICAgX3RoaXMucmVzZXROZXh0UG9zaXRpb24oKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0YXJ0OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7fVxuICAgIH0sXG4gICAgc3RvcDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AodGltZSwgcG9zaXRpb24pIHt9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgICAgICBpZiAocG9zaXRpb24gPCB0aGlzLl9fc3RhcnRQb3NpdGlvbikge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fX2hhbHRQb3NpdGlvbiA9PT0gbnVsbCkgdGhpcy5zdG9wKHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IHRoaXMuX19lbmRQb3NpdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19zdGFydFBvc2l0aW9uO1xuICAgICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPD0gdGhpcy5fX2VuZFBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICAgIHRoaXMuX19oYWx0UG9zaXRpb24gPSBudWxsOyAvLyBlbmdpbmUgaXMgYWN0aXZlXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fZW5kUG9zaXRpb247XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwb3NpdGlvbiA+PSB0aGlzLl9fZW5kUG9zaXRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9faGFsdFBvc2l0aW9uID09PSBudWxsKSB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl9faGFsdFBvc2l0aW9uID0gdGhpcy5fX3N0YXJ0UG9zaXRpb247XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fZW5kUG9zaXRpb247XG4gICAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA+IHRoaXMuX19zdGFydFBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICAgIHRoaXMuX19oYWx0UG9zaXRpb24gPSBudWxsOyAvLyBlbmdpbmUgaXMgYWN0aXZlXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fX2hhbHRQb3NpdGlvbiA9PT0gbnVsbCkgdGhpcy5zdG9wKHRpbWUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLl9faGFsdFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgfVxuICAgIH0sXG4gICAgYWR2YW5jZVBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgaGFsdFBvc2l0aW9uID0gdGhpcy5fX2hhbHRQb3NpdGlvbjtcblxuICAgICAgICBpZiAoaGFsdFBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5zdGFydCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICByZXR1cm4gaGFsdFBvc2l0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RvcCBlbmdpbmVcbiAgICAgICAgaWYgKHRoaXMuX19oYWx0UG9zaXRpb24gPT09IG51bGwpIHRoaXMuc3RvcCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IEluZmluaXR5O1xuXG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN5bmNTcGVlZDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID09PSAwKSB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVzdHJveToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX190cmFuc3BvcnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9fZW5naW5lID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBUcmFuc3BvcnRlZDtcbn0pKFRpbWVFbmdpbmUpO1xuXG4vLyBUcmFuc3BvcnRlZFNjaGVkdWxlZCBoYXMgdG8gc3dpdGNoIG9uIGFuZCBvZmYgdGhlIHNjaGVkdWxlZCBlbmdpbmVzXG4vLyB3aGVuIHRoZSB0cmFuc3BvcnQgaGl0cyB0aGUgZW5naW5lJ3Mgc3RhcnQgYW5kIGVuZCBwb3NpdGlvblxuXG52YXIgVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCA9IChmdW5jdGlvbiAoX1RyYW5zcG9ydGVkKSB7XG4gIGZ1bmN0aW9uIFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQodHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCk7XG5cbiAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRlZFRyYW5zcG9ydGVkLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCB0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKTtcblxuICAgIGVuZ2luZS5zZXRUcmFuc3BvcnRlZCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmV4dEVuZ2luZVBvc2l0aW9uID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICAvLyByZXNldE5leHRQb3NpdGlvblxuICAgICAgaWYgKG5leHRFbmdpbmVQb3NpdGlvbiAhPT0gbnVsbCkgbmV4dEVuZ2luZVBvc2l0aW9uICs9IF90aGlzLl9fb2Zmc2V0UG9zaXRpb247XG5cbiAgICAgIF90aGlzLnJlc2V0TmV4dFBvc2l0aW9uKG5leHRFbmdpbmVQb3NpdGlvbik7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZ2V0Q3VycmVudFRpbWVcbiAgICAgIHJldHVybiBfdGhpcy5fX3RyYW5zcG9ydC5zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZ2V0IGN1cnJlbnRQb3NpdGlvblxuICAgICAgcmV0dXJuIF90aGlzLl9fdHJhbnNwb3J0LmN1cnJlbnRQb3NpdGlvbiAtIF90aGlzLl9fb2Zmc2V0UG9zaXRpb247XG4gICAgfSk7XG4gIH1cblxuICBfaW5oZXJpdHMoVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCwgX1RyYW5zcG9ydGVkKTtcblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCwge1xuICAgIHN5bmNQb3NpdGlvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCAmJiBwb3NpdGlvbiA8IHRoaXMuX19lbmRQb3NpdGlvbikgcG9zaXRpb24gPSBNYXRoLm1heChwb3NpdGlvbiwgdGhpcy5fX3N0YXJ0UG9zaXRpb24pO2Vsc2UgaWYgKHNwZWVkIDwgMCAmJiBwb3NpdGlvbiA+PSB0aGlzLl9fc3RhcnRQb3NpdGlvbikgcG9zaXRpb24gPSBNYXRoLm1pbihwb3NpdGlvbiwgdGhpcy5fX2VuZFBvc2l0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX29mZnNldFBvc2l0aW9uICsgdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIHNwZWVkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VQb3NpdGlvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24gKyB0aGlzLl9fZW5naW5lLmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgIGlmIChzcGVlZCA+IDAgJiYgcG9zaXRpb24gPCB0aGlzLl9fZW5kUG9zaXRpb24gfHwgc3BlZWQgPCAwICYmIHBvc2l0aW9uID49IHRoaXMuX19zdGFydFBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgICAgICB9cmV0dXJuIEluZmluaXR5O1xuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAodGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQpIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXN0cm95OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fX2VuZ2luZS5yZXNldEludGVyZmFjZSgpO1xuICAgICAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRlZFRyYW5zcG9ydGVkLnByb3RvdHlwZSksIFwiZGVzdHJveVwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQ7XG59KShUcmFuc3BvcnRlZCk7XG5cbi8vIFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkIGhhcyB0byBzdGFydCBhbmQgc3RvcCB0aGUgc3BlZWQtY29udHJvbGxlZCBlbmdpbmVzXG4vLyB3aGVuIHRoZSB0cmFuc3BvcnQgaGl0cyB0aGUgZW5naW5lJ3Mgc3RhcnQgYW5kIGVuZCBwb3NpdGlvblxuXG52YXIgVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQgPSAoZnVuY3Rpb24gKF9UcmFuc3BvcnRlZDIpIHtcbiAgZnVuY3Rpb24gVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQodHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuXG4gICAgZW5naW5lLnNldFNwZWVkQ29udHJvbGxlZCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnZXRDdXJyZW50VGltZVxuICAgICAgcmV0dXJuIF90aGlzLl9fdHJhbnNwb3J0LnNjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnZXQgY3VycmVudFBvc2l0aW9uXG4gICAgICByZXR1cm4gX3RoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uIC0gX3RoaXMuX19vZmZzZXRQb3NpdGlvbjtcbiAgICB9KTtcbiAgfVxuXG4gIF9pbmhlcml0cyhUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZCwgX1RyYW5zcG9ydGVkMik7XG5cbiAgX2NyZWF0ZUNsYXNzKFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkLCB7XG4gICAgc3RhcnQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0b3A6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKHRpbWUsIHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN5bmNTcGVlZDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX19oYWx0UG9zaXRpb24gPT09IG51bGwpIC8vIGVuZ2luZSBpcyBhY3RpdmVcbiAgICAgICAgICB0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVzdHJveToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRoaXMuX190cmFuc3BvcnQuY3VycmVudFRpbWUsIHRoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uLCAwKTtcbiAgICAgICAgdGhpcy5fX2VuZ2luZS5yZXNldEludGVyZmFjZSgpO1xuICAgICAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZC5wcm90b3R5cGUpLCBcImRlc3Ryb3lcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZDtcbn0pKFRyYW5zcG9ydGVkKTtcblxuLy8gVHJhbnNwb3J0ZWRTY2hlZHVsZWQgaGFzIHRvIHN3aXRjaCBvbiBhbmQgb2ZmIHRoZSBzY2hlZHVsZWQgZW5naW5lc1xuLy8gd2hlbiB0aGUgdHJhbnNwb3J0IGhpdHMgdGhlIGVuZ2luZSdzIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb25cblxudmFyIFRyYW5zcG9ydGVkU2NoZWR1bGVkID0gKGZ1bmN0aW9uIChfVHJhbnNwb3J0ZWQzKSB7XG4gIGZ1bmN0aW9uIFRyYW5zcG9ydGVkU2NoZWR1bGVkKHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zcG9ydGVkU2NoZWR1bGVkKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydGVkU2NoZWR1bGVkLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCB0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKTtcblxuICAgIHRoaXMuX190cmFuc3BvcnQuc2NoZWR1bGVyLmFkZChlbmdpbmUsIEluZmluaXR5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnZXQgY3VycmVudFBvc2l0aW9uXG4gICAgICByZXR1cm4gKF90aGlzLl9fdHJhbnNwb3J0LmN1cnJlbnRQb3NpdGlvbiAtIF90aGlzLl9fb2Zmc2V0UG9zaXRpb24pICogX3RoaXMuX19zY2FsZVBvc2l0aW9uO1xuICAgIH0pO1xuICB9XG5cbiAgX2luaGVyaXRzKFRyYW5zcG9ydGVkU2NoZWR1bGVkLCBfVHJhbnNwb3J0ZWQzKTtcblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNwb3J0ZWRTY2hlZHVsZWQsIHtcbiAgICBzdGFydDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0TmV4dFRpbWUodGltZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzdG9wOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCh0aW1lLCBwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0TmV4dFRpbWUoSW5maW5pdHkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVzdHJveToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX190cmFuc3BvcnQuc2NoZWR1bGVyLnJlbW92ZSh0aGlzLl9fZW5naW5lKTtcbiAgICAgICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoVHJhbnNwb3J0ZWRTY2hlZHVsZWQucHJvdG90eXBlKSwgXCJkZXN0cm95XCIsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gVHJhbnNwb3J0ZWRTY2hlZHVsZWQ7XG59KShUcmFuc3BvcnRlZCk7XG5cbnZhciBUcmFuc3BvcnRTY2hlZHVsZXJIb29rID0gKGZ1bmN0aW9uIChfVGltZUVuZ2luZTIpIHtcbiAgZnVuY3Rpb24gVHJhbnNwb3J0U2NoZWR1bGVySG9vayh0cmFuc3BvcnQpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0U2NoZWR1bGVySG9vayk7XG5cbiAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRTY2hlZHVsZXJIb29rLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9fdHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICB9XG5cbiAgX2luaGVyaXRzKFRyYW5zcG9ydFNjaGVkdWxlckhvb2ssIF9UaW1lRW5naW5lMik7XG5cbiAgX2NyZWF0ZUNsYXNzKFRyYW5zcG9ydFNjaGVkdWxlckhvb2ssIHtcbiAgICBhZHZhbmNlVGltZToge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAoc2NoZWR1bGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICAgICAgdmFyIHRyYW5zcG9ydCA9IHRoaXMuX190cmFuc3BvcnQ7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHRyYW5zcG9ydC5fX2dldFBvc2l0aW9uQXRUaW1lKHRpbWUpO1xuICAgICAgICB2YXIgbmV4dFBvc2l0aW9uID0gdHJhbnNwb3J0LmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgdHJhbnNwb3J0Ll9fc3BlZWQpO1xuXG4gICAgICAgIGlmIChuZXh0UG9zaXRpb24gIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmV0dXJuIHRyYW5zcG9ydC5fX2dldFRpbWVBdFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgICAgIH1yZXR1cm4gSW5maW5pdHk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gVHJhbnNwb3J0U2NoZWR1bGVySG9vaztcbn0pKFRpbWVFbmdpbmUpO1xuXG4vKipcbiAqIHh4eFxuICpcbiAqXG4gKi9cblxudmFyIFRyYW5zcG9ydCA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUzKSB7XG4gIGZ1bmN0aW9uIFRyYW5zcG9ydChhdWRpb0NvbnRleHQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0KTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgYXVkaW9Db250ZXh0KTtcblxuICAgIC8vIGZ1dHVyZSBhc3NpZ25tZW50XG4gICAgLy8gdGhpcy5zY2hlZHVsZXIgPSB3YXZlcy5nZXRTY2hlZHVsZXIoYXVkaW9Db250ZXh0KTtcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHJlcXVpcmUoXCJzY2hlZHVsZXJcIik7XG4gICAgLy8gdGVzdFxuICAgIHRoaXMuc2NoZWR1bGVyID0gZ2V0U2NoZWR1bGVyKHRoaXMuYXVkaW9Db250ZXh0KTtcblxuICAgIHRoaXMuX19lbmdpbmVzID0gW107XG4gICAgdGhpcy5fX3RyYW5zcG9ydGVkID0gW107XG5cbiAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG51bGw7XG4gICAgdGhpcy5fX3RyYW5zcG9ydFF1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoKTtcblxuICAgIC8vIHN5bmNyb25pemVkIHRpbWUsIHBvc2l0aW9uLCBhbmQgc3BlZWRcbiAgICB0aGlzLl9fdGltZSA9IDA7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gMDtcbiAgICB0aGlzLl9fc3BlZWQgPSAwO1xuXG4gICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IEluZmluaXR5O1xuICB9XG5cbiAgX2luaGVyaXRzKFRyYW5zcG9ydCwgX1RpbWVFbmdpbmUzKTtcblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNwb3J0LCB7XG4gICAgX19nZXRQb3NpdGlvbkF0VGltZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3Bvc2l0aW9uICsgKHRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2dldFRpbWVBdFBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19nZXRUaW1lQXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RpbWUgKyAocG9zaXRpb24gLSB0aGlzLl9fcG9zaXRpb24pIC8gdGhpcy5fX3NwZWVkO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc3luY1RyYW5zcG9ydGVkUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHZhciBudW1UcmFuc3BvcnRlZEVuZ2luZXMgPSB0aGlzLl9fdHJhbnNwb3J0ZWQubGVuZ3RoO1xuXG4gICAgICAgIGlmIChudW1UcmFuc3BvcnRlZEVuZ2luZXMgPiAwKSB7XG4gICAgICAgICAgdmFyIGVuZ2luZSwgbmV4dEVuZ2luZVBvc2l0aW9uO1xuXG4gICAgICAgICAgdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLmNsZWFyKCk7XG4gICAgICAgICAgdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLnJldmVyc2UgPSBzcGVlZCA8IDA7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVRyYW5zcG9ydGVkRW5naW5lczsgaSsrKSB7XG4gICAgICAgICAgICBlbmdpbmUgPSB0aGlzLl9fdHJhbnNwb3J0ZWRbaV07XG4gICAgICAgICAgICBuZXh0RW5naW5lUG9zaXRpb24gPSBlbmdpbmUuc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgICB0aGlzLl9fdHJhbnNwb3J0UXVldWUuaW5zZXJ0KGVuZ2luZSwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLnRpbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX3N5bmNUcmFuc3BvcnRlZFNwZWVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19zeW5jVHJhbnNwb3J0ZWRTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gX2NvcmUuJGZvci5nZXRJdGVyYXRvcih0aGlzLl9fdHJhbnNwb3J0ZWQpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNwb3J0ZWQgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgICAgdHJhbnNwb3J0ZWQuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yW1wicmV0dXJuXCJdKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHRpbWVcbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCB0aW1lXG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHRyYW5zcG9ydCBpcyBhZGRlZCB0byBhIG1hc3RlciAoaS5lLiB0cmFuc3BvcnQgb3IgcGxheS1jb250cm9sKS5cbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudFBvc2l0aW9uOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgcGxheWluZyBwb3NpdGlvblxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSByZXBsYWNlZCB3aGVuIHRoZSB0cmFuc3BvcnQgaXMgYWRkZWQgdG8gYSBtYXN0ZXIgKGkuZS4gdHJhbnNwb3J0IG9yIHBsYXktY29udHJvbCkuXG4gICAgICAgKi9cblxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXNldE5leHRQb3NpdGlvbjoge1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlc2V0IG5leHQgdHJhbnNwb3J0IHBvc2l0aW9uXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gbmV4dCB0cmFuc3BvcnQgcG9zaXRpb25cbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgdHJhbnNwb3J0IGlzIGFkZGVkIHRvIGEgbWFzdGVyIChpLmUuIHRyYW5zcG9ydCBvciBwbGF5LWNvbnRyb2wpLlxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldE5leHRQb3NpdGlvbihuZXh0UG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX19zY2hlZHVsZXJIb29rKSB0aGlzLl9fc2NoZWR1bGVySG9vay5yZXNldE5leHRUaW1lKHRoaXMuX19nZXRUaW1lQXRQb3NpdGlvbihuZXh0UG9zaXRpb24pKTtcblxuICAgICAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gbmV4dFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1Bvc2l0aW9uOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHRoaXMuX190aW1lID0gdGltZTtcbiAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuX19zcGVlZCA9IHNwZWVkO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fc3luY1RyYW5zcG9ydGVkUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VQb3NpdGlvbjoge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAodHJhbnNwb3J0ZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgbmV4dEVuZ2luZSA9IHRoaXMuX190cmFuc3BvcnRRdWV1ZS5oZWFkO1xuICAgICAgICB2YXIgbmV4dEVuZ2luZVBvc2l0aW9uID0gbmV4dEVuZ2luZS5hZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLm1vdmUobmV4dEVuZ2luZSwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX25leHRQb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN5bmNTcGVlZDoge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAoc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHZhciBzZWVrID0gYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1szXTtcblxuICAgICAgICB2YXIgbGFzdFNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgICAgIHRoaXMuX190aW1lID0gdGltZTtcbiAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuX19zcGVlZCA9IHNwZWVkO1xuXG4gICAgICAgIGlmIChzcGVlZCAhPT0gbGFzdFNwZWVkIHx8IHNlZWsgJiYgc3BlZWQgIT09IDApIHtcbiAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uID0gdGhpcy5fX25leHRQb3NpdGlvbjtcblxuICAgICAgICAgIC8vIHJlc3luYyB0cmFuc3BvcnRlZCBlbmdpbmVzXG4gICAgICAgICAgaWYgKHNlZWsgfHwgc3BlZWQgKiBsYXN0U3BlZWQgPCAwKSB7XG4gICAgICAgICAgICAvLyBzZWVrIG9yIHJldmVyc2UgZGlyZWN0aW9uXG4gICAgICAgICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fc3luY1RyYW5zcG9ydGVkUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RTcGVlZCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gc3RhcnRcbiAgICAgICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgICAgICAvLyBzY2hlZHVsZSB0cmFuc3BvcnQgaXRzZWxmXG4gICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG5ldyBUcmFuc3BvcnRTY2hlZHVsZXJIb29rKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19zY2hlZHVsZXJIb29rLCBJbmZpbml0eSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVlZCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gc3RvcFxuICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgICAgIHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRTcGVlZCh0aW1lLCBwb3NpdGlvbiwgMCk7XG5cbiAgICAgICAgICAgIC8vIHVuc2NoZWR1bGUgdHJhbnNwb3J0IGl0c2VsZlxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIucmVtb3ZlKHRoaXMuX19zY2hlZHVsZXJIb29rKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9fc2NoZWR1bGVySG9vaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hhbmdlIHNwZWVkIHdpdGhvdXQgcmV2ZXJzaW5nIGRpcmVjdGlvblxuICAgICAgICAgICAgdGhpcy5fX3N5bmNUcmFuc3BvcnRlZFNwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5yZXNldE5leHRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgdHJhbnNwb3J0XG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5naW5lIGVuZ2luZSB0byBiZSBhZGRlZCB0byB0aGUgdHJhbnNwb3J0XG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gc3RhcnQgcG9zaXRpb25cbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGVuZ2luZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBzdGFydFBvc2l0aW9uID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAtSW5maW5pdHkgOiBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gSW5maW5pdHkgOiBhcmd1bWVudHNbMl07XG4gICAgICAgIHZhciBvZmZzZXRQb3NpdGlvbiA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gc3RhcnRQb3NpdGlvbiA6IGFyZ3VtZW50c1szXTtcbiAgICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHRyYW5zcG9ydGVkID0gbnVsbDtcblxuICAgICAgICAgIGlmIChvZmZzZXRQb3NpdGlvbiA9PT0gLUluZmluaXR5KSBvZmZzZXRQb3NpdGlvbiA9IDA7XG5cbiAgICAgICAgICBpZiAoZW5naW5lLm1hc3RlcikgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gYSBtYXN0ZXJcIik7XG5cbiAgICAgICAgICBpZiAoZW5naW5lLmltcGxlbWVudHNUcmFuc3BvcnRlZCgpKSB0cmFuc3BvcnRlZCA9IG5ldyBUcmFuc3BvcnRlZFRyYW5zcG9ydGVkKF90aGlzLCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbik7ZWxzZSBpZiAoZW5naW5lLmltcGxlbWVudHNTcGVlZENvbnRyb2xsZWQoKSkgdHJhbnNwb3J0ZWQgPSBuZXcgVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQoX3RoaXMsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKTtlbHNlIGlmIChlbmdpbmUuaW1wbGVtZW50c1NjaGVkdWxlZCgpKSB0cmFuc3BvcnRlZCA9IG5ldyBUcmFuc3BvcnRlZFNjaGVkdWxlZChfdGhpcywgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO2Vsc2UgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGNhbm5vdCBiZSBhZGRlZCB0byBhIHRyYW5zcG9ydFwiKTtcblxuICAgICAgICAgIGlmICh0cmFuc3BvcnRlZCkge1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gX3RoaXMuX19zcGVlZDtcblxuICAgICAgICAgICAgX3RoaXMuX19lbmdpbmVzLnB1c2goZW5naW5lKTtcbiAgICAgICAgICAgIF90aGlzLl9fdHJhbnNwb3J0ZWQucHVzaCh0cmFuc3BvcnRlZCk7XG5cbiAgICAgICAgICAgIHRyYW5zcG9ydGVkLnNldFRyYW5zcG9ydGVkKF90aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgICAgLy8gcmVzZXROZXh0UG9zaXRpb25cbiAgICAgICAgICAgICAgdmFyIHNwZWVkID0gX3RoaXMuX19zcGVlZDtcblxuICAgICAgICAgICAgICBpZiAoc3BlZWQgIT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dEVuZ2luZVBvc2l0aW9uID09PSBudWxsKSBuZXh0RW5naW5lUG9zaXRpb24gPSB0cmFuc3BvcnRlZC5zeW5jUG9zaXRpb24oX3RoaXMuY3VycmVudFRpbWUsIF90aGlzLmN1cnJlbnRQb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IF90aGlzLl9fdHJhbnNwb3J0UXVldWUubW92ZSh0cmFuc3BvcnRlZCwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXNldE5leHRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGdldEN1cnJlbnRUaW1lXG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5fX3RyYW5zcG9ydC5zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGdldCBjdXJyZW50UG9zaXRpb25cbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9fdHJhbnNwb3J0LmN1cnJlbnRQb3NpdGlvbiAtIF90aGlzLl9fb2Zmc2V0UG9zaXRpb247XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNwZWVkICE9PSAwKSB7XG4gICAgICAgICAgICAgIC8vIHN5bmMgYW5kIHN0YXJ0XG4gICAgICAgICAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSB0cmFuc3BvcnRlZC5zeW5jUG9zaXRpb24oX3RoaXMuY3VycmVudFRpbWUsIF90aGlzLmN1cnJlbnRQb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uID0gX3RoaXMuX190cmFuc3BvcnRRdWV1ZS5pbnNlcnQodHJhbnNwb3J0ZWQsIG5leHRFbmdpbmVQb3NpdGlvbik7XG5cbiAgICAgICAgICAgICAgX3RoaXMucmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJhbnNwb3J0ZWQ7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmU6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgYSB0aW1lIGVuZ2luZSBmcm9tIHRoZSB0cmFuc3BvcnRcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbmdpbmVPclRyYW5zcG9ydGVkIGVuZ2luZSBvciB0cmFuc3BvcnRlZCB0byBiZSByZW1vdmVkIGZyb20gdGhlIHRyYW5zcG9ydFxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoZW5naW5lT3JUcmFuc3BvcnRlZCkge1xuICAgICAgICB2YXIgZW5naW5lID0gZW5naW5lT3JUcmFuc3BvcnRlZDtcbiAgICAgICAgdmFyIHRyYW5zcG9ydGVkID0gcmVtb3ZlQ291cGxlKHRoaXMuX19lbmdpbmVzLCB0aGlzLl9fdHJhbnNwb3J0ZWQsIGVuZ2luZU9yVHJhbnNwb3J0ZWQpO1xuXG4gICAgICAgIGlmICghdHJhbnNwb3J0ZWQpIHtcbiAgICAgICAgICBlbmdpbmUgPSByZW1vdmVDb3VwbGUodGhpcy5fX3RyYW5zcG9ydGVkLCB0aGlzLl9fZW5naW5lcywgZW5naW5lT3JUcmFuc3BvcnRlZCk7XG4gICAgICAgICAgdHJhbnNwb3J0ZWQgPSBlbmdpbmVPclRyYW5zcG9ydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZ2luZSAmJiB0cmFuc3BvcnRlZCkge1xuICAgICAgICAgIHZhciBuZXh0UG9zaXRpb24gPSB0aGlzLl9fdHJhbnNwb3J0UXVldWUucmVtb3ZlKHRyYW5zcG9ydGVkKTtcblxuICAgICAgICAgIHRyYW5zcG9ydGVkLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICAgICAgdHJhbnNwb3J0ZWQuZGVzdHJveSgpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX19zcGVlZCAhPT0gMCkgdGhpcy5yZXNldE5leHRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyB0cmFuc3BvcnRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGFsbCB0aW1lIGVuZ2luZXMgZnJvbSB0aGUgdHJhbnNwb3J0XG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN5bmNTcGVlZCh0aGlzLmN1cnJlbnRUaW1lLCB0aGlzLmN1cnJlbnRQb3NpdGlvbiwgMCk7XG5cbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gX2NvcmUuJGZvci5nZXRJdGVyYXRvcih0aGlzLl9fdHJhbnNwb3J0ZWQpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNwb3J0ZWQgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgICAgdHJhbnNwb3J0ZWQucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICAgIHRyYW5zcG9ydGVkLmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgICAgICBfaXRlcmF0b3JbXCJyZXR1cm5cIl0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFRyYW5zcG9ydDtcbn0pKFRpbWVFbmdpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcG9ydDtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyB0cmFuc3BvcnQgY2xhc3MgKHRpbWUtZW5naW5lIG1hc3RlciksIHByb3ZpZGVzIHN5bmNocm9uaXplZCBzY2hlZHVsaW5nIG9mIHRpbWUgZW5naW5lc1xuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5dFlYTjBaWEp6TDNSeVlXNXpjRzl5ZEM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZQUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNRMEZCUXpzN1pVRkRja01zVDBGQlR5eERRVUZETEdGQlFXRXNRMEZCUXpzN1NVRkJka01zV1VGQldTeFpRVUZhTEZsQlFWazdPMEZCUld4Q0xGTkJRVk1zV1VGQldTeERRVUZETEZWQlFWVXNSVUZCUlN4WFFVRlhMRVZCUVVVc1dVRkJXU3hGUVVGRk8wRkJRek5FTEUxQlFVa3NTMEZCU3l4SFFVRkhMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdPMEZCUlRkRExFMUJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTmtMRkZCUVVrc1lVRkJZU3hIUVVGSExGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zWTBGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE5VSXNaVUZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xGZEJRVThzWVVGQllTeERRVUZETzBkQlEzUkNPenRCUVVWRUxGTkJRVThzU1VGQlNTeERRVUZETzBOQlEySTdPMGxCUlVzc1YwRkJWenRCUVVOS0xGZEJSRkFzVjBGQlZ5eERRVU5JTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1lVRkJZU3hGUVVGRkxGZEJRVmNzUlVGQlJTeGpRVUZqTEVWQlFVVTdNRUpCUkhaRkxGZEJRVmM3TzBGQlJXSXNVVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRE4wSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhOUVVGTkxFTkJRVU03UVVGRGRrSXNVVUZCU1N4RFFVRkRMR1ZCUVdVc1IwRkJSeXhoUVVGaExFTkJRVU03UVVGRGNrTXNVVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhYUVVGWExFTkJRVU03UVVGRGFrTXNVVUZCU1N4RFFVRkRMR2RDUVVGblFpeEhRVUZITEdOQlFXTXNRMEZCUXp0QlFVTjJReXhSUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTjZRaXhSUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEZGQlFWRXNRMEZCUXp0SFFVTm9RenM3V1VGVVJ5eFhRVUZYT3p0bFFVRllMRmRCUVZjN1FVRlhaaXhwUWtGQllUdGhRVUZCTEhWQ1FVRkRMR0ZCUVdFc1JVRkJSU3hYUVVGWE96czdXVUZCUlN4alFVRmpMR2REUVVGSExHRkJRV0U3V1VGQlJTeGhRVUZoTEdkRFFVRkhMRU5CUVVNN05FSkJRVVU3UVVGRE0wWXNaMEpCUVVzc1pVRkJaU3hIUVVGSExHRkJRV0VzUTBGQlF6dEJRVU55UXl4blFrRkJTeXhoUVVGaExFZEJRVWNzVjBGQlZ5eERRVUZETzBGQlEycERMR2RDUVVGTExHZENRVUZuUWl4SFFVRkhMR05CUVdNc1EwRkJRenRCUVVOMlF5eG5Ra0ZCU3l4bFFVRmxMRWRCUVVjc1lVRkJZU3hEUVVGRE8wRkJRM0pETEdkQ1FVRkxMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdVMEZETVVJN1QwRkJRVHM3UVVGRlJDeFRRVUZMTzJGQlFVRXNaVUZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEZRVUZGT3p0QlFVTXZRaXhSUVVGSk8yRkJRVUVzWTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRVZCUVVVN08wRkJSWFpDTEdkQ1FVRlpPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTJJc1kwRkJTU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlRzN1FVRkZia01zWjBKQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1MwRkJTeXhKUVVGSkxFVkJRemxDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1owSkJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenM3UVVGRmVrTXNiVUpCUVU4c1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF6dFhRVU0zUWl4TlFVRk5MRWxCUVVrc1VVRkJVU3hKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVTdRVUZEZWtNc1owSkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJURkVMR2RDUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZNMElzYlVKQlFVOHNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRYUVVNelFqdFRRVU5HTEUxQlFVMDdRVUZEVEN4alFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTzBGQlEyeERMR2RDUVVGSkxFbEJRVWtzUTBGQlF5eGpRVUZqTEV0QlFVc3NTVUZCU1N4RlFVTTVRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN08wRkJSWEJFTEdkQ1FVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdPMEZCUlRORExHMUNRVUZQTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNN1YwRkRNMElzVFVGQlRTeEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hGUVVGRk8wRkJRekZETEdkQ1FVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVVeFJDeG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhKUVVGSkxFTkJRVU03TzBGQlJUTkNMRzFDUVVGUExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdWMEZETjBJN1UwRkRSanM3UVVGRlJDeFpRVUZKTEVsQlFVa3NRMEZCUXl4alFVRmpMRXRCUVVzc1NVRkJTU3hGUVVNNVFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGTlVJc1dVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTTdPMEZCUlM5Q0xHVkJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenRCUVVWRUxHMUNRVUZsTzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZka01zV1VGQlNTeFpRVUZaTEV0QlFVc3NTVUZCU1N4RlFVRkZPMEZCUTNwQ0xHTkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJURkVMR05CUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVXpRaXhwUWtGQlR5eFpRVUZaTEVOQlFVTTdVMEZEY2tJN096dEJRVWRFTEZsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1MwRkJTeXhKUVVGSkxFVkJRemxDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1dVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTTdPMEZCUlM5Q0xHVkJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenRCUVVWRUxHRkJRVk03WVVGQlFTeHRRa0ZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU12UWl4WlFVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRMklzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wOUJRM0pFT3p0QlFVVkVMRmRCUVU4N1lVRkJRU3h0UWtGQlJ6dEJRVU5TTEZsQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM2hDTEZsQlFVa3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRM1JDT3pzN08xTkJOVVpITEZkQlFWYzdSMEZCVXl4VlFVRlZPenM3T3p0SlFXbEhPVUlzYzBKQlFYTkNPMEZCUTJZc1YwRkVVQ3h6UWtGQmMwSXNRMEZEWkN4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RlFVRkZPenM3TUVKQlJIWkZMSE5DUVVGelFqczdRVUZGZUVJc2NVTkJSa1VzYzBKQlFYTkNMRFpEUVVWc1FpeFRRVUZUTEVWQlFVVXNUVUZCVFN4RlFVRkZMR0ZCUVdFc1JVRkJSU3hYUVVGWExFVkJRVVVzWTBGQll5eEZRVUZGT3p0QlFVVnlSU3hWUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4WlFVRXJRanRWUVVFNVFpeHJRa0ZCYTBJc1owTkJRVWNzU1VGQlNUczdPMEZCUlhCRUxGVkJRVWtzYTBKQlFXdENMRXRCUVVzc1NVRkJTU3hGUVVNM1FpeHJRa0ZCYTBJc1NVRkJTU3hOUVVGTExHZENRVUZuUWl4RFFVRkRPenRCUVVVNVF5eFpRVUZMTEdsQ1FVRnBRaXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1MwRkROVU1zUlVGQlJTeFpRVUZOT3p0QlFVVlFMR0ZCUVU4c1RVRkJTeXhYUVVGWExFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXp0TFFVTXZReXhGUVVGRkxGbEJRVTA3TzBGQlJWQXNZVUZCVHl4TlFVRkxMRmRCUVZjc1EwRkJReXhsUVVGbExFZEJRVWNzVFVGQlN5eG5Ra0ZCWjBJc1EwRkJRenRMUVVOcVJTeERRVUZETEVOQlFVTTdSMEZEU2pzN1dVRnFRa2NzYzBKQlFYTkNPenRsUVVGMFFpeHpRa0ZCYzBJN1FVRnRRakZDTEdkQ1FVRlpPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVU0xUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRExFdEJRMnBFTEVsQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1NVRkJTU3hSUVVGUkxFbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZEY0VRc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1pVRkJUeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRE1VYzdPMEZCUlVRc2JVSkJRV1U3WVVGQlFTeDVRa0ZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU55UXl4blFrRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEdWQlFXVXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6czdRVUZGYUVnc1dVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NVVUZCVVN4SlFVRkpMRWxCUVVrc1EwRkJReXhsUVVGbE8wRkJRemRHTEdsQ1FVRlBMRkZCUVZFc1EwRkJRenRUUVVGQkxFRkJSV3hDTEU5QlFVOHNVVUZCVVN4RFFVRkRPMDlCUTJwQ096dEJRVVZFTEdGQlFWTTdZVUZCUVN4dFFrRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTXZRaXhaUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RlFVTjZRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzA5QlEyeEVPenRCUVVWRUxGZEJRVTg3WVVGQlFTeHRRa0ZCUnp0QlFVTlNMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETDBJc2VVTkJOVU5GTEhOQ1FVRnpRaXg1UTBFMFExSTdUMEZEYWtJN096czdVMEUzUTBjc2MwSkJRWE5DTzBkQlFWTXNWMEZCVnpzN096czdTVUZyUkRGRExEQkNRVUV3UWp0QlFVTnVRaXhYUVVSUUxEQkNRVUV3UWl4RFFVTnNRaXhUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEdGQlFXRXNSVUZCUlN4WFFVRlhMRVZCUVVVc1kwRkJZeXhGUVVGRk96czdNRUpCUkhaRkxEQkNRVUV3UWpzN1FVRkZOVUlzY1VOQlJrVXNNRUpCUVRCQ0xEWkRRVVYwUWl4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RlFVRkZPenRCUVVWeVJTeFZRVUZOTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFVMDdPMEZCUlhCRExHRkJRVThzVFVGQlN5eFhRVUZYTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJRenRMUVVNdlF5eEZRVUZGTEZsQlFVMDdPMEZCUlZBc1lVRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NUVUZCU3l4blFrRkJaMElzUTBGQlF6dExRVU5xUlN4RFFVRkRMRU5CUVVNN1IwRkRTanM3V1VGWVJ5d3dRa0ZCTUVJN08yVkJRVEZDTERCQ1FVRXdRanRCUVdFNVFpeFRRVUZMTzJGQlFVRXNaVUZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU16UWl4WlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU4wUkRzN1FVRkZSQ3hSUVVGSk8yRkJRVUVzWTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUTI1Q0xGbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdUMEZETlVNN08wRkJSVVFzWVVGQlV6dGhRVUZCTEcxQ1FVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlF5OUNMRmxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUzBGQlN5eEpRVUZKTzBGQlF6bENMR05CUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRGJFUTdPMEZCUlVRc1YwRkJUenRoUVVGQkxHMUNRVUZITzBGQlExSXNXVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1SUxGbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkRMMElzZVVOQk4wSkZMREJDUVVFd1FpeDVRMEUyUWxvN1QwRkRha0k3T3pzN1UwRTVRa2NzTUVKQlFUQkNPMGRCUVZNc1YwRkJWenM3T3pzN1NVRnRRemxETEc5Q1FVRnZRanRCUVVOaUxGZEJSRkFzYjBKQlFXOUNMRU5CUTFvc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeGhRVUZoTEVWQlFVVXNWMEZCVnl4RlFVRkZMR05CUVdNc1JVRkJSVHM3T3pCQ1FVUjJSU3h2UWtGQmIwSTdPMEZCUlhSQ0xIRkRRVVpGTEc5Q1FVRnZRaXcyUTBGRmFFSXNVMEZCVXl4RlFVRkZMRTFCUVUwc1JVRkJSU3hoUVVGaExFVkJRVVVzVjBGQlZ5eEZRVUZGTEdOQlFXTXNSVUZCUlRzN1FVRkZja1VzVVVGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUlVGQlJTeFJRVUZSTEVWQlFVVXNXVUZCVFRzN1FVRkZja1FzWVVGQlR5eERRVUZETEUxQlFVc3NWMEZCVnl4RFFVRkRMR1ZCUVdVc1IwRkJSeXhOUVVGTExHZENRVUZuUWl4RFFVRkJMRWRCUVVrc1RVRkJTeXhsUVVGbExFTkJRVU03UzBGRE1VWXNRMEZCUXl4RFFVRkRPMGRCUTBvN08xbEJVa2NzYjBKQlFXOUNPenRsUVVGd1FpeHZRa0ZCYjBJN1FVRlZlRUlzVTBGQlN6dGhRVUZCTEdWQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRE0wSXNXVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdUMEZEYmtNN08wRkJSVVFzVVVGQlNUdGhRVUZCTEdOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOdVFpeFpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dFBRVU4yUXpzN1FVRkZSQ3hYUVVGUE8yRkJRVUVzYlVKQlFVYzdRVUZEVWl4WlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRMnBFTEhsRFFYQkNSU3h2UWtGQmIwSXNlVU5CYjBKT08wOUJRMnBDT3pzN08xTkJja0pITEc5Q1FVRnZRanRIUVVGVExGZEJRVmM3TzBsQmQwSjRReXh6UWtGQmMwSTdRVUZEWml4WFFVUlFMSE5DUVVGelFpeERRVU5rTEZOQlFWTXNSVUZCUlRzd1FrRkVia0lzYzBKQlFYTkNPenRCUVVWNFFpeHhRMEZHUlN4elFrRkJjMElzTmtOQlJXaENPMEZCUTFJc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFRRVUZUTEVOQlFVTTdSMEZET1VJN08xbEJTa2NzYzBKQlFYTkNPenRsUVVGMFFpeHpRa0ZCYzBJN1FVRlBNVUlzWlVGQlZ6czdPenRoUVVGQkxIRkNRVUZETEVsQlFVa3NSVUZCUlR0QlFVTm9RaXhaUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMEZCUTJwRExGbEJRVWtzVVVGQlVTeEhRVUZITEZOQlFWTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnVSQ3haUVVGSkxGbEJRVmtzUjBGQlJ5eFRRVUZUTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRCUVVWb1JpeFpRVUZKTEZsQlFWa3NTMEZCU3l4UlFVRlJPMEZCUXpOQ0xHbENRVUZQTEZOQlFWTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0VFFVRkJMRUZCUlhKRUxFOUJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenM3TzFOQmFFSkhMSE5DUVVGelFqdEhRVUZUTEZWQlFWVTdPenM3T3pzN08wbEJkMEo2UXl4VFFVRlRPMEZCUTBZc1YwRkVVQ3hUUVVGVExFTkJRMFFzV1VGQldTeEZRVUZuUWp0UlFVRmtMRTlCUVU4c1owTkJRVWNzUlVGQlJUczdNRUpCUkd4RExGTkJRVk03TzBGQlJWZ3NjVU5CUmtVc1UwRkJVeXcyUTBGRlRDeFpRVUZaTEVWQlFVVTdPenM3T3p0QlFVMXdRaXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03TzBGQlJXcEVMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzQkNMRkZCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzUlVGQlJTeERRVUZET3p0QlFVVjRRaXhSUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTTFRaXhSUVVGSkxFTkJRVU1zWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hoUVVGaExFVkJRVVVzUTBGQlF6czdPMEZCUnpWRExGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJoQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWcVFpeFJRVUZKTEVOQlFVTXNZMEZCWXl4SFFVRkhMRkZCUVZFc1EwRkJRenRIUVVOb1F6czdXVUYwUWtjc1UwRkJVenM3WlVGQlZDeFRRVUZUTzBGQmQwSmlMSFZDUVVGdFFqdGhRVUZCTERaQ1FVRkRMRWxCUVVrc1JVRkJSVHRCUVVONFFpeGxRVUZQTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03VDBGRE9VUTdPMEZCUlVRc2RVSkJRVzFDTzJGQlFVRXNOa0pCUVVNc1VVRkJVU3hGUVVGRk8wRkJRelZDTEdWQlFVOHNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkJMRWRCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dFBRVU5zUlRzN1FVRkZSQ3cyUWtGQmVVSTdZVUZCUVN4dFEwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTXZReXhaUVVGSkxIRkNRVUZ4UWl4SFFVRkhMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQlRTeERRVUZET3p0QlFVVjBSQ3haUVVGSkxIRkNRVUZ4UWl4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVNM1FpeGpRVUZKTEUxQlFVMHNSVUZCUlN4clFrRkJhMElzUTBGQlF6czdRVUZGTDBJc1kwRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wRkJRemxDTEdOQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eFBRVUZQTEVkQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1FVRkJReXhEUVVGRE96dEJRVVUxUXl4bFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NjVUpCUVhGQ0xFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZET1VNc2EwSkJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJReTlDTERoQ1FVRnJRaXhIUVVGSExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU5vUlN4blFrRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenRYUVVNeFJEdFRRVVZHT3p0QlFVVkVMR1ZCUVU4c1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJRenRQUVVOdVF6czdRVUZGUkN3d1FrRkJjMEk3WVVGQlFTeG5RMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUczdPenM3TzBGQlF6VkRMSE5FUVVGM1FpeEpRVUZKTEVOQlFVTXNZVUZCWVR0blFrRkJha01zVjBGQlZ6czdRVUZEYkVJc2RVSkJRVmNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dFhRVUZCT3pzN096czdPenM3T3pzN096czdUMEZEYUVRN08wRkJVVWNzWlVGQlZ6czdPenM3T3pzN08xZEJRVUVzV1VGQlJ6dEJRVU5vUWl4bFFVRlBMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETzA5QlEyNURPenRCUVZGSExHMUNRVUZsT3pzN096czdPenM3VjBGQlFTeFpRVUZITzBGQlEzQkNMR1ZCUVU4c1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVRXNSMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wOUJRM0JHT3p0QlFWRkVMSEZDUVVGcFFqczdPenM3T3pzN08yRkJRVUVzTWtKQlFVTXNXVUZCV1N4RlFVRkZPMEZCUXpsQ0xGbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZEZEVJc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGRGTEZsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1dVRkJXU3hEUVVGRE8wOUJRM0JET3p0QlFVZEVMR2RDUVVGWk96czdPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRia0lzV1VGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4UlFVRlJMRU5CUVVNN1FVRkRNMElzV1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNN08wRkJSWEpDTEdWQlFVOHNTVUZCU1N4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRE9VUTdPMEZCUjBRc2JVSkJRV1U3T3pzN1lVRkJRU3g1UWtGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOeVF5eFpRVUZKTEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUXpWRExGbEJRVWtzYTBKQlFXdENMRWRCUVVjc1ZVRkJWU3hEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVV6UlN4WlFVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03TzBGQlJXcEdMR1ZCUVU4c1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF6dFBRVU0xUWpzN1FVRkhSQ3hoUVVGVE96czdPMkZCUVVFc2JVSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVdkQ08xbEJRV1FzU1VGQlNTeG5RMEZCUnl4TFFVRkxPenRCUVVNelF5eFpRVUZKTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEJRVVUzUWl4WlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU51UWl4WlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExGRkJRVkVzUTBGQlF6dEJRVU16UWl4WlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGY2tJc1dVRkJTU3hMUVVGTExFdEJRVXNzVTBGQlV5eEpRVUZMTEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhCUVVGRExFVkJRVVU3UVVGRGFFUXNZMEZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF6czdPMEZCUjNaRExHTkJRVWtzU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4VFFVRlRMRWRCUVVjc1EwRkJReXhGUVVGRk96dEJRVVZxUXl4M1FrRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMWRCUTNSRkxFMUJRVTBzU1VGQlNTeFRRVUZUTEV0QlFVc3NRMEZCUXl4RlFVRkZPenRCUVVVeFFpeDNRa0ZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZET3pzN1FVRkhja1VzWjBKQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1NVRkJTU3h6UWtGQmMwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVONFJDeG5Ra0ZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRYUVVOd1JDeE5RVUZOTEVsQlFVa3NTMEZCU3l4TFFVRkxMRU5CUVVNc1JVRkJSVHM3UVVGRmRFSXNkMEpCUVZrc1IwRkJSeXhSUVVGUkxFTkJRVU03TzBGQlJYaENMR2RDUVVGSkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXpzN08wRkJSeTlETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN1FVRkROVU1zYlVKQlFVOHNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJRenRYUVVNM1FpeE5RVUZOT3p0QlFVVk1MR2RDUVVGSkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0WFFVTndSRHM3UVVGRlJDeGpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdVMEZEZEVNN1QwRkRSanM3UVVGUFJDeFBRVUZIT3pzN096czdPenRoUVVGQkxHRkJRVU1zVFVGQlRUczdPMWxCUVVVc1lVRkJZU3huUTBGQlJ5eERRVUZETEZGQlFWRTdXVUZCUlN4WFFVRlhMR2REUVVGSExGRkJRVkU3V1VGQlJTeGpRVUZqTEdkRFFVRkhMR0ZCUVdFN05FSkJRVVU3UVVGRE4wWXNZMEZCU1N4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE96dEJRVVYyUWl4alFVRkpMR05CUVdNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGRE9VSXNZMEZCWXl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRmNrSXNZMEZCU1N4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVObUxFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNNa05CUVRKRExFTkJRVU1zUTBGQlF6czdRVUZGTDBRc1kwRkJTU3hOUVVGTkxFTkJRVU1zY1VKQlFYRkNMRVZCUVVVc1JVRkRhRU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NjMEpCUVhOQ0xGRkJRVThzVFVGQlRTeEZRVUZGTEdGQlFXRXNSVUZCUlN4WFFVRlhMRVZCUVVVc1kwRkJZeXhEUVVGRExFTkJRVU1zUzBGRGFFY3NTVUZCU1N4TlFVRk5MRU5CUVVNc2VVSkJRWGxDTEVWQlFVVXNSVUZEZWtNc1YwRkJWeXhIUVVGSExFbEJRVWtzTUVKQlFUQkNMRkZCUVU4c1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RFFVRkRMRU5CUVVNc1MwRkRjRWNzU1VGQlNTeE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUlVGRGJrTXNWMEZCVnl4SFFVRkhMRWxCUVVrc2IwSkJRVzlDTEZGQlFVOHNUVUZCVFN4RlFVRkZMR0ZCUVdFc1JVRkJSU3hYUVVGWExFVkJRVVVzWTBGQll5eERRVUZETEVOQlFVTXNTMEZGYWtjc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eDFRMEZCZFVNc1EwRkJReXhEUVVGRE96dEJRVVV6UkN4alFVRkpMRmRCUVZjc1JVRkJSVHRCUVVObUxHZENRVUZKTEV0QlFVc3NSMEZCUnl4TlFVRkxMRTlCUVU4c1EwRkJRenM3UVVGRmVrSXNhMEpCUVVzc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTTFRaXhyUWtGQlN5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE96dEJRVVZ5UXl4MVFrRkJWeXhEUVVGRExHTkJRV01zVVVGQlR5eFpRVUVyUWp0clFrRkJPVUlzYTBKQlFXdENMR2REUVVGSExFbEJRVWs3T3p0QlFVVjZSQ3hyUWtGQlNTeExRVUZMTEVkQlFVY3NUVUZCU3l4UFFVRlBMRU5CUVVNN08wRkJSWHBDTEd0Q1FVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRVVU3UVVGRFppeHZRa0ZCU1N4clFrRkJhMElzUzBGQlN5eEpRVUZKTEVWQlF6ZENMR3RDUVVGclFpeEhRVUZITEZkQlFWY3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJTeXhYUVVGWExFVkJRVVVzVFVGQlN5eGxRVUZsTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSUzlHTEc5Q1FVRkpMRmxCUVZrc1IwRkJSeXhOUVVGTExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenRCUVVNdlJTeHpRa0ZCU3l4cFFrRkJhVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0bFFVTjBRenRoUVVOR0xFVkJRVVVzV1VGQlRUczdRVUZGVUN4eFFrRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RFFVRkRPMkZCUXk5RExFVkJRVVVzV1VGQlRUczdRVUZGVUN4eFFrRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NUVUZCU3l4blFrRkJaMElzUTBGQlF6dGhRVU5xUlN4RFFVRkRMRU5CUVVNN08wRkJSVWdzWjBKQlFVa3NTMEZCU3l4TFFVRkxMRU5CUVVNc1JVRkJSVHM3UVVGRlppeHJRa0ZCU1N4clFrRkJhMElzUjBGQlJ5eFhRVUZYTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVVzc1YwRkJWeXhGUVVGRkxFMUJRVXNzWlVGQlpTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJwSExHdENRVUZKTEZsQlFWa3NSMEZCUnl4TlFVRkxMR2RDUVVGblFpeERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRVZCUVVVc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXpzN1FVRkZha1lzYjBKQlFVc3NhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdZVUZEZEVNN1YwRkRSanM3UVVGRlJDeHBRa0ZCVHl4WFFVRlhMRU5CUVVNN1UwRkRjRUk3VDBGQlFUczdRVUZOUkN4VlFVRk5PenM3T3pzN08yRkJRVUVzWjBKQlFVTXNiVUpCUVcxQ0xFVkJRVVU3UVVGRE1VSXNXVUZCU1N4TlFVRk5MRWRCUVVjc2JVSkJRVzFDTEVOQlFVTTdRVUZEYWtNc1dVRkJTU3hYUVVGWExFZEJRVWNzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVY0Uml4WlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRk8wRkJRMmhDTEdkQ1FVRk5MRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMEZCUXk5RkxIRkNRVUZYTEVkQlFVY3NiVUpCUVcxQ0xFTkJRVU03VTBGRGJrTTdPMEZCUlVRc1dVRkJTU3hOUVVGTkxFbEJRVWtzVjBGQlZ5eEZRVUZGTzBGQlEzcENMR05CUVVrc1dVRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdPMEZCUlRkRUxIRkNRVUZYTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkROMElzY1VKQlFWY3NRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenM3UVVGRmRFSXNZMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFTkJRVU1zUlVGRGNFSXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMU5CUTNoRExFMUJRVTA3UVVGRFRDeG5Ra0ZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNRMEZCUXl4RFFVRkRPMU5CUTJoRk8wOUJRMFk3TzBGQlMwUXNVMEZCU3pzN096czdPMkZCUVVFc2FVSkJRVWM3UVVGRFRpeFpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenM3T3pzN096dEJRVVV4UkN4elJFRkJkMElzU1VGQlNTeERRVUZETEdGQlFXRTdaMEpCUVdwRExGZEJRVmM3TzBGQlEyeENMSFZDUVVGWExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETjBJc2RVSkJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0WFFVTjJRanM3T3pzN096czdPenM3T3pzN08wOUJRMFk3T3pzN1UwRnlVRWNzVTBGQlV6dEhRVUZUTEZWQlFWVTdPMEZCZDFCc1F5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRk5CUVZNc1EwRkJReUlzSW1acGJHVWlPaUpsY3pZdmJXRnpkR1Z5Y3k5MGNtRnVjM0J2Y25RdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lCM2NtbDBkR1Z1SUdsdUlFVkRUVUZ6WTNKcGNIUWdOaUFxTDF4dUx5b3FYRzRnS2lCQVptbHNaVzkyWlhKMmFXVjNJRmRCVmtVZ1lYVmthVzhnZEhKaGJuTndiM0owSUdOc1lYTnpJQ2gwYVcxbExXVnVaMmx1WlNCdFlYTjBaWElwTENCd2NtOTJhV1JsY3lCemVXNWphSEp2Ym1sNlpXUWdjMk5vWldSMWJHbHVaeUJ2WmlCMGFXMWxJR1Z1WjJsdVpYTmNiaUFxSUVCaGRYUm9iM0lnVG05eVltVnlkQzVUWTJodVpXeHNRR2x5WTJGdExtWnlMQ0JXYVdOMGIzSXVVMkZwZWtCcGNtTmhiUzVtY2l3Z1MyRnlhVzB1UW1GeWEyRjBhVUJwY21OaGJTNW1jbHh1SUNvdlhHNG5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUJVYVcxbFJXNW5hVzVsSUQwZ2NtVnhkV2x5WlNoY0lpNHVMMk52Y21VdmRHbHRaUzFsYm1kcGJtVmNJaWs3WEc1MllYSWdVSEpwYjNKcGRIbFJkV1YxWlNBOUlISmxjWFZwY21Vb1hDSXVMaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlMxb1pXRndYQ0lwTzF4dWRtRnlJSHNnWjJWMFUyTm9aV1IxYkdWeUlIMGdQU0J5WlhGMWFYSmxLQ2N1TDJaaFkzUnZjbWxsY3ljcE8xeHVYRzVtZFc1amRHbHZiaUJ5WlcxdmRtVkRiM1Z3YkdVb1ptbHljM1JCY25KaGVTd2djMlZqYjI1a1FYSnlZWGtzSUdacGNuTjBSV3hsYldWdWRDa2dlMXh1SUNCMllYSWdhVzVrWlhnZ1BTQm1hWEp6ZEVGeWNtRjVMbWx1WkdWNFQyWW9abWx5YzNSRmJHVnRaVzUwS1R0Y2JseHVJQ0JwWmlBb2FXNWtaWGdnUGowZ01Da2dlMXh1SUNBZ0lIWmhjaUJ6WldOdmJtUkZiR1Z0Wlc1MElEMGdjMlZqYjI1a1FYSnlZWGxiYVc1a1pYaGRPMXh1WEc0Z0lDQWdabWx5YzNSQmNuSmhlUzV6Y0d4cFkyVW9hVzVrWlhnc0lERXBPMXh1SUNBZ0lITmxZMjl1WkVGeWNtRjVMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzVjYmlBZ0lDQnlaWFIxY200Z2MyVmpiMjVrUld4bGJXVnVkRHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1ZFd4c08xeHVmVnh1WEc1amJHRnpjeUJVY21GdWMzQnZjblJsWkNCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2loMGNtRnVjM0J2Y25Rc0lHVnVaMmx1WlN3Z2MzUmhjblJRYjNOcGRHbHZiaXdnWlc1a1VHOXphWFJwYjI0c0lHOW1abk5sZEZCdmMybDBhVzl1S1NCN1hHNGdJQ0FnZEdocGN5NWZYM1J5WVc1emNHOXlkQ0E5SUhSeVlXNXpjRzl5ZER0Y2JpQWdJQ0IwYUdsekxsOWZaVzVuYVc1bElEMGdaVzVuYVc1bE8xeHVJQ0FnSUhSb2FYTXVYMTl6ZEdGeWRGQnZjMmwwYVc5dUlEMGdjM1JoY25SUWIzTnBkR2x2Ymp0Y2JpQWdJQ0IwYUdsekxsOWZaVzVrVUc5emFYUnBiMjRnUFNCbGJtUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNGdQU0J2Wm1aelpYUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmYzJOaGJHVlFiM05wZEdsdmJpQTlJREU3WEc0Z0lDQWdkR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZiaUE5SUVsdVptbHVhWFI1T3lBdkx5QmxibWRwYm1VbmN5QnVaWGgwSUdoaGJIUWdjRzl6YVhScGIyNGdkMmhsYmlCdWIzUWdjblZ1Ym1sdVp5QW9hWE1nYm5Wc2JDQjNhR1Z1SUdWdVoybHVaU0JvWlhNZ1ltVmxiaUJ6ZEdGeWRHVmtLVnh1SUNCOVhHNWNiaUFnYzJWMFFtOTFibVJoY21sbGN5aHpkR0Z5ZEZCdmMybDBhVzl1TENCbGJtUlFiM05wZEdsdmJpd2diMlptYzJWMFVHOXphWFJwYjI0Z1BTQnpkR0Z5ZEZCdmMybDBhVzl1TENCelkyRnNaVkJ2YzJsMGFXOXVJRDBnTVNrZ2UxeHVJQ0FnSUhSb2FYTXVYMTl6ZEdGeWRGQnZjMmwwYVc5dUlEMGdjM1JoY25SUWIzTnBkR2x2Ymp0Y2JpQWdJQ0IwYUdsekxsOWZaVzVrVUc5emFYUnBiMjRnUFNCbGJtUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNGdQU0J2Wm1aelpYUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmYzJOaGJHVlFiM05wZEdsdmJpQTlJSE5qWVd4bFVHOXphWFJwYjI0N1hHNGdJQ0FnZEdocGN5NXlaWE5sZEU1bGVIUlFiM05wZEdsdmJpZ3BPMXh1SUNCOVhHNWNiaUFnYzNSaGNuUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN2ZWeHVJQ0J6ZEc5d0tIUnBiV1VzSUhCdmMybDBhVzl1S1NCN2ZWeHVYRzRnSUhONWJtTlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwSUh0Y2JpQWdJQ0JwWmlBb2MzQmxaV1FnUGlBd0tTQjdYRzRnSUNBZ0lDQnBaaUFvY0c5emFYUnBiMjRnUENCMGFHbHpMbDlmYzNSaGNuUlFiM05wZEdsdmJpa2dlMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5ZmFHRnNkRkJ2YzJsMGFXOXVJRDA5UFNCdWRXeHNLVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjM1J2Y0NoMGFXMWxMQ0J3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJpazdYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOUlIUm9hWE11WDE5bGJtUlFiM05wZEdsdmJqdGNibHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgzTjBZWEowVUc5emFYUnBiMjQ3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hCdmMybDBhVzl1SUR3OUlIUm9hWE11WDE5bGJtUlFiM05wZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVJQzBnZEdocGN5NWZYMjltWm5ObGRGQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZiaUE5SUc1MWJHdzdJQzh2SUdWdVoybHVaU0JwY3lCaFkzUnBkbVZjYmx4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYMlZ1WkZCdmMybDBhVzl1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnBaaUFvY0c5emFYUnBiMjRnUGowZ2RHaHBjeTVmWDJWdVpGQnZjMmwwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbDlmYUdGc2RGQnZjMmwwYVc5dUlEMDlQU0J1ZFd4c0tWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWMzUnZjQ2gwYVcxbExDQndiM05wZEdsdmJpQXRJSFJvYVhNdVgxOXZabVp6WlhSUWIzTnBkR2x2YmlrN1hHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZiaUE5SUhSb2FYTXVYMTl6ZEdGeWRGQnZjMmwwYVc5dU8xeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZlpXNWtVRzl6YVhScGIyNDdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLSEJ2YzJsMGFXOXVJRDRnZEdocGN5NWZYM04wWVhKMFVHOXphWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emRHRnlkQ2gwYVcxbExDQndiM05wZEdsdmJpQXRJSFJvYVhNdVgxOXZabVp6WlhSUWIzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5b1lXeDBVRzl6YVhScGIyNGdQU0J1ZFd4c095QXZMeUJsYm1kcGJtVWdhWE1nWVdOMGFYWmxYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOXpkR0Z5ZEZCdmMybDBhVzl1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbDlmYUdGc2RGQnZjMmwwYVc5dUlEMDlQU0J1ZFd4c0tWeHVJQ0FnSUNBZ2RHaHBjeTV6ZEc5d0tIUnBiV1VzSUhCdmMybDBhVzl1S1R0Y2JseHVJQ0FnSUhSb2FYTXVYMTlvWVd4MFVHOXphWFJwYjI0Z1BTQkpibVpwYm1sMGVUdGNibHh1SUNBZ0lISmxkSFZ5YmlCSmJtWnBibWwwZVR0Y2JpQWdmVnh1WEc0Z0lHRmtkbUZ1WTJWUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQjJZWElnYUdGc2RGQnZjMmwwYVc5dUlEMGdkR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZianRjYmx4dUlDQWdJR2xtSUNob1lXeDBVRzl6YVhScGIyNGdJVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblFvZEdsdFpTd2djRzl6YVhScGIyNGdMU0IwYUdsekxsOWZiMlptYzJWMFVHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JseHVJQ0FnSUNBZ2RHaHBjeTVmWDJoaGJIUlFiM05wZEdsdmJpQTlJRzUxYkd3N1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCb1lXeDBVRzl6YVhScGIyNDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdjM1J2Y0NCbGJtZHBibVZjYmlBZ0lDQnBaaUFvZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOVBUMGdiblZzYkNsY2JpQWdJQ0FnSUhSb2FYTXVjM1J2Y0NoMGFXMWxMQ0J3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJpazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmFHRnNkRkJ2YzJsMGFXOXVJRDBnU1c1bWFXNXBkSGs3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdTVzVtYVc1cGRIazdYRzRnSUgxY2JseHVJQ0J6ZVc1alUzQmxaV1FvZEdsdFpTd2djRzl6YVhScGIyNHNJSE53WldWa0tTQjdYRzRnSUNBZ2FXWWdLSE53WldWa0lEMDlQU0F3S1Z4dUlDQWdJQ0FnZEdocGN5NXpkRzl3S0hScGJXVXNJSEJ2YzJsMGFXOXVJQzBnZEdocGN5NWZYMjltWm5ObGRGQnZjMmwwYVc5dUtUdGNiaUFnZlZ4dVhHNGdJR1JsYzNSeWIza29LU0I3WEc0Z0lDQWdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRDQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpTQTlJRzUxYkd3N1hHNGdJSDFjYm4xY2JseHVMeThnVkhKaGJuTndiM0owWldSVFkyaGxaSFZzWldRZ2FHRnpJSFJ2SUhOM2FYUmphQ0J2YmlCaGJtUWdiMlptSUhSb1pTQnpZMmhsWkhWc1pXUWdaVzVuYVc1bGMxeHVMeThnZDJobGJpQjBhR1VnZEhKaGJuTndiM0owSUdocGRITWdkR2hsSUdWdVoybHVaU2R6SUhOMFlYSjBJR0Z1WkNCbGJtUWdjRzl6YVhScGIyNWNibU5zWVhOeklGUnlZVzV6Y0c5eWRHVmtWSEpoYm5Od2IzSjBaV1FnWlhoMFpXNWtjeUJVY21GdWMzQnZjblJsWkNCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0hSeVlXNXpjRzl5ZEN3Z1pXNW5hVzVsTENCemRHRnlkRkJ2YzJsMGFXOXVMQ0JsYm1SUWIzTnBkR2x2Yml3Z2IyWm1jMlYwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0J6ZFhCbGNpaDBjbUZ1YzNCdmNuUXNJR1Z1WjJsdVpTd2djM1JoY25SUWIzTnBkR2x2Yml3Z1pXNWtVRzl6YVhScGIyNHNJRzltWm5ObGRGQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lHVnVaMmx1WlM1elpYUlVjbUZ1YzNCdmNuUmxaQ2gwYUdsekxDQW9ibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVJRDBnYm5Wc2JDa2dQVDRnZTF4dUlDQWdJQ0FnTHk4Z2NtVnpaWFJPWlhoMFVHOXphWFJwYjI1Y2JpQWdJQ0FnSUdsbUlDaHVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNGdJVDA5SUc1MWJHd3BYRzRnSUNBZ0lDQWdJRzVsZUhSRmJtZHBibVZRYjNOcGRHbHZiaUFyUFNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNDdYRzVjYmlBZ0lDQWdJSFJvYVhNdWNtVnpaWFJPWlhoMFVHOXphWFJwYjI0b2JtVjRkRVZ1WjJsdVpWQnZjMmwwYVc5dUtUdGNiaUFnSUNCOUxDQW9LU0E5UGlCN1hHNGdJQ0FnSUNBdkx5Qm5aWFJEZFhKeVpXNTBWR2x0WlZ4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUXVjMk5vWldSMWJHVnlMbU4xY25KbGJuUlVhVzFsTzF4dUlDQWdJSDBzSUNncElEMCtJSHRjYmlBZ0lDQWdJQzh2SUdkbGRDQmpkWEp5Wlc1MFVHOXphWFJwYjI1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZkSEpoYm5Od2IzSjBMbU4xY25KbGJuUlFiM05wZEdsdmJpQXRJSFJvYVhNdVgxOXZabVp6WlhSUWIzTnBkR2x2Ymp0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lITjVibU5RYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdJQ1ltSUhCdmMybDBhVzl1SUR3Z2RHaHBjeTVmWDJWdVpGQnZjMmwwYVc5dUtWeHVJQ0FnSUNBZ2NHOXphWFJwYjI0Z1BTQk5ZWFJvTG0xaGVDaHdiM05wZEdsdmJpd2dkR2hwY3k1ZlgzTjBZWEowVUc5emFYUnBiMjRwTzF4dUlDQWdJR1ZzYzJVZ2FXWWdLSE53WldWa0lEd2dNQ0FtSmlCd2IzTnBkR2x2YmlBK1BTQjBhR2x6TGw5ZmMzUmhjblJRYjNOcGRHbHZiaWxjYmlBZ0lDQWdJSEJ2YzJsMGFXOXVJRDBnVFdGMGFDNXRhVzRvY0c5emFYUnBiMjRzSUhSb2FYTXVYMTlsYm1SUWIzTnBkR2x2YmlrN1hHNWNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZYMjltWm5ObGRGQnZjMmwwYVc5dUlDc2dkR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0Z0xTQjBhR2x6TGw5ZmIyWm1jMlYwVUc5emFYUnBiMjRzSUhOd1pXVmtLVHRjYmlBZ2ZWeHVYRzRnSUdGa2RtRnVZMlZRYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCd2IzTnBkR2x2YmlBOUlIUm9hWE11WDE5dlptWnpaWFJRYjNOcGRHbHZiaUFySUhSb2FYTXVYMTlsYm1kcGJtVXVZV1IyWVc1alpWQnZjMmwwYVc5dUtIUnBiV1VzSUhCdmMybDBhVzl1SUMwZ2RHaHBjeTVmWDI5bVpuTmxkRkJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzVjYmlBZ0lDQnBaaUFvYzNCbFpXUWdQaUF3SUNZbUlIQnZjMmwwYVc5dUlEd2dkR2hwY3k1ZlgyVnVaRkJ2YzJsMGFXOXVJSHg4SUhOd1pXVmtJRHdnTUNBbUppQndiM05wZEdsdmJpQStQU0IwYUdsekxsOWZjM1JoY25SUWIzTnBkR2x2YmlsY2JpQWdJQ0FnSUhKbGRIVnliaUJ3YjNOcGRHbHZianRjYmx4dUlDQWdJSEpsZEhWeWJpQkpibVpwYm1sMGVUdGNiaUFnZlZ4dVhHNGdJSE41Ym1OVGNHVmxaQ2gwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVM0JsWldRcFhHNGdJQ0FnSUNCMGFHbHpMbDlmWlc1bmFXNWxMbk41Ym1OVGNHVmxaQ2gwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0I5WEc1Y2JpQWdaR1Z6ZEhKdmVTZ3BJSHRjYmlBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5KbGMyVjBTVzUwWlhKbVlXTmxLQ2s3WEc0Z0lDQWdjM1Z3WlhJdVpHVnpkSEp2ZVNncE8xeHVJQ0I5WEc1OVhHNWNiaTh2SUZSeVlXNXpjRzl5ZEdWa1UzQmxaV1JEYjI1MGNtOXNiR1ZrSUdoaGN5QjBieUJ6ZEdGeWRDQmhibVFnYzNSdmNDQjBhR1VnYzNCbFpXUXRZMjl1ZEhKdmJHeGxaQ0JsYm1kcGJtVnpYRzR2THlCM2FHVnVJSFJvWlNCMGNtRnVjM0J2Y25RZ2FHbDBjeUIwYUdVZ1pXNW5hVzVsSjNNZ2MzUmhjblFnWVc1a0lHVnVaQ0J3YjNOcGRHbHZibHh1WTJ4aGMzTWdWSEpoYm5Od2IzSjBaV1JUY0dWbFpFTnZiblJ5YjJ4c1pXUWdaWGgwWlc1a2N5QlVjbUZ1YzNCdmNuUmxaQ0I3WEc0Z0lHTnZibk4wY25WamRHOXlLSFJ5WVc1emNHOXlkQ3dnWlc1bmFXNWxMQ0J6ZEdGeWRGQnZjMmwwYVc5dUxDQmxibVJRYjNOcGRHbHZiaXdnYjJabWMyVjBVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnpkWEJsY2loMGNtRnVjM0J2Y25Rc0lHVnVaMmx1WlN3Z2MzUmhjblJRYjNOcGRHbHZiaXdnWlc1a1VHOXphWFJwYjI0c0lHOW1abk5sZEZCdmMybDBhVzl1S1R0Y2JseHVJQ0FnSUdWdVoybHVaUzV6WlhSVGNHVmxaRU52Ym5SeWIyeHNaV1FvZEdocGN5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0x5OGdaMlYwUTNWeWNtVnVkRlJwYldWY2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZkSEpoYm5Od2IzSjBMbk5qYUdWa2RXeGxjaTVqZFhKeVpXNTBWR2x0WlR0Y2JpQWdJQ0I5TENBb0tTQTlQaUI3WEc0Z0lDQWdJQ0F2THlCblpYUWdZM1Z5Y21WdWRGQnZjMmwwYVc5dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYM1J5WVc1emNHOXlkQzVqZFhKeVpXNTBVRzl6YVhScGIyNGdMU0IwYUdsekxsOWZiMlptYzJWMFVHOXphWFJwYjI0N1hHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dUlDQnpkR0Z5ZENoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXNJSFJ5ZFdVcE8xeHVJQ0I5WEc1Y2JpQWdjM1J2Y0NoMGFXMWxMQ0J3YjNOcGRHbHZiaWtnZTF4dUlDQWdJSFJvYVhNdVgxOWxibWRwYm1VdWMzbHVZMU53WldWa0tIUnBiV1VzSUhCdmMybDBhVzl1TENBd0tUdGNiaUFnZlZ4dVhHNGdJSE41Ym1OVGNHVmxaQ2gwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZiaUE5UFQwZ2JuVnNiQ2tnTHk4Z1pXNW5hVzVsSUdseklHRmpkR2wyWlZ4dUlDQWdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpTNXplVzVqVTNCbFpXUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JpQWdmVnh1WEc0Z0lHUmxjM1J5YjNrb0tTQjdYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaUzV6ZVc1alUzQmxaV1FvZEdocGN5NWZYM1J5WVc1emNHOXlkQzVqZFhKeVpXNTBWR2x0WlN3Z2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEM1amRYSnlaVzUwVUc5emFYUnBiMjRnTFNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNHNJREFwTzF4dUlDQWdJSFJvYVhNdVgxOWxibWRwYm1VdWNtVnpaWFJKYm5SbGNtWmhZMlVvS1R0Y2JpQWdJQ0J6ZFhCbGNpNWtaWE4wY205NUtDazdYRzRnSUgxY2JuMWNibHh1THk4Z1ZISmhibk53YjNKMFpXUlRZMmhsWkhWc1pXUWdhR0Z6SUhSdklITjNhWFJqYUNCdmJpQmhibVFnYjJabUlIUm9aU0J6WTJobFpIVnNaV1FnWlc1bmFXNWxjMXh1THk4Z2QyaGxiaUIwYUdVZ2RISmhibk53YjNKMElHaHBkSE1nZEdobElHVnVaMmx1WlNkeklITjBZWEowSUdGdVpDQmxibVFnY0c5emFYUnBiMjVjYm1Oc1lYTnpJRlJ5WVc1emNHOXlkR1ZrVTJOb1pXUjFiR1ZrSUdWNGRHVnVaSE1nVkhKaGJuTndiM0owWldRZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2loMGNtRnVjM0J2Y25Rc0lHVnVaMmx1WlN3Z2MzUmhjblJRYjNOcGRHbHZiaXdnWlc1a1VHOXphWFJwYjI0c0lHOW1abk5sZEZCdmMybDBhVzl1S1NCN1hHNGdJQ0FnYzNWd1pYSW9kSEpoYm5Od2IzSjBMQ0JsYm1kcGJtVXNJSE4wWVhKMFVHOXphWFJwYjI0c0lHVnVaRkJ2YzJsMGFXOXVMQ0J2Wm1aelpYUlFiM05wZEdsdmJpazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmRISmhibk53YjNKMExuTmphR1ZrZFd4bGNpNWhaR1FvWlc1bmFXNWxMQ0JKYm1acGJtbDBlU3dnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdMeThnWjJWMElHTjFjbkpsYm5SUWIzTnBkR2x2Ymx4dUlDQWdJQ0FnY21WMGRYSnVJQ2gwYUdsekxsOWZkSEpoYm5Od2IzSjBMbU4xY25KbGJuUlFiM05wZEdsdmJpQXRJSFJvYVhNdVgxOXZabVp6WlhSUWIzTnBkR2x2YmlrZ0tpQjBhR2x6TGw5ZmMyTmhiR1ZRYjNOcGRHbHZianRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUhOMFlYSjBLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkNrZ2UxeHVJQ0FnSUhSb2FYTXVYMTlsYm1kcGJtVXVjbVZ6WlhST1pYaDBWR2x0WlNoMGFXMWxLVHRjYmlBZ2ZWeHVYRzRnSUhOMGIzQW9kR2x0WlN3Z2NHOXphWFJwYjI0cElIdGNiaUFnSUNCMGFHbHpMbDlmWlc1bmFXNWxMbkpsYzJWMFRtVjRkRlJwYldVb1NXNW1hVzVwZEhrcE8xeHVJQ0I5WEc1Y2JpQWdaR1Z6ZEhKdmVTZ3BJSHRjYmlBZ0lDQjBhR2x6TGw5ZmRISmhibk53YjNKMExuTmphR1ZrZFd4bGNpNXlaVzF2ZG1Vb2RHaHBjeTVmWDJWdVoybHVaU2s3WEc0Z0lDQWdjM1Z3WlhJdVpHVnpkSEp2ZVNncE8xeHVJQ0I5WEc1OVhHNWNibU5zWVhOeklGUnlZVzV6Y0c5eWRGTmphR1ZrZFd4bGNraHZiMnNnWlhoMFpXNWtjeUJVYVcxbFJXNW5hVzVsSUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvZEhKaGJuTndiM0owS1NCN1hHNGdJQ0FnYzNWd1pYSW9LVHRjYmlBZ0lDQjBhR2x6TGw5ZmRISmhibk53YjNKMElEMGdkSEpoYm5Od2IzSjBPMXh1SUNCOVhHNWNiaUFnTHk4Z1ZHbHRaVVZ1WjJsdVpTQnRaWFJvYjJRZ0tITmphR1ZrZFd4bFpDQnBiblJsY21aaFkyVXBYRzRnSUdGa2RtRnVZMlZVYVcxbEtIUnBiV1VwSUh0Y2JpQWdJQ0IyWVhJZ2RISmhibk53YjNKMElEMGdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWREdGNiaUFnSUNCMllYSWdjRzl6YVhScGIyNGdQU0IwY21GdWMzQnZjblF1WDE5blpYUlFiM05wZEdsdmJrRjBWR2x0WlNoMGFXMWxLVHRjYmlBZ0lDQjJZWElnYm1WNGRGQnZjMmwwYVc5dUlEMGdkSEpoYm5Od2IzSjBMbUZrZG1GdVkyVlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2RISmhibk53YjNKMExsOWZjM0JsWldRcE8xeHVYRzRnSUNBZ2FXWWdLRzVsZUhSUWIzTnBkR2x2YmlBaFBUMGdTVzVtYVc1cGRIa3BYRzRnSUNBZ0lDQnlaWFIxY200Z2RISmhibk53YjNKMExsOWZaMlYwVkdsdFpVRjBVRzl6YVhScGIyNG9ibVY0ZEZCdmMybDBhVzl1S1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJKYm1acGJtbDBlVHRjYmlBZ2ZWeHVmVnh1WEc0dktpcGNiaUFxSUhoNGVGeHVJQ3BjYmlBcVhHNGdLaTljYm1Oc1lYTnpJRlJ5WVc1emNHOXlkQ0JsZUhSbGJtUnpJRlJwYldWRmJtZHBibVVnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0F2THlCbWRYUjFjbVVnWVhOemFXZHViV1Z1ZEZ4dUlDQWdJQzh2SUhSb2FYTXVjMk5vWldSMWJHVnlJRDBnZDJGMlpYTXVaMlYwVTJOb1pXUjFiR1Z5S0dGMVpHbHZRMjl1ZEdWNGRDazdYRzRnSUNBZ0x5OGdkR2hwY3k1elkyaGxaSFZzWlhJZ1BTQnlaWEYxYVhKbEtGd2ljMk5vWldSMWJHVnlYQ0lwTzF4dUlDQWdJQzh2SUhSbGMzUmNiaUFnSUNCMGFHbHpMbk5qYUdWa2RXeGxjaUE5SUdkbGRGTmphR1ZrZFd4bGNpaDBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsY3lBOUlGdGRPMXh1SUNBZ0lIUm9hWE11WDE5MGNtRnVjM0J2Y25SbFpDQTlJRnRkTzF4dVhHNGdJQ0FnZEdocGN5NWZYM05qYUdWa2RXeGxja2h2YjJzZ1BTQnVkV3hzTzF4dUlDQWdJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUlJkV1YxWlNBOUlHNWxkeUJRY21sdmNtbDBlVkYxWlhWbEtDazdYRzVjYmlBZ0lDQXZMeUJ6ZVc1amNtOXVhWHBsWkNCMGFXMWxMQ0J3YjNOcGRHbHZiaXdnWVc1a0lITndaV1ZrWEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1VnUFNBd08xeHVJQ0FnSUhSb2FYTXVYMTl3YjNOcGRHbHZiaUE5SURBN1hHNGdJQ0FnZEdocGN5NWZYM053WldWa0lEMGdNRHRjYmx4dUlDQWdJSFJvYVhNdVgxOXVaWGgwVUc5emFYUnBiMjRnUFNCSmJtWnBibWwwZVR0Y2JpQWdmVnh1WEc0Z0lGOWZaMlYwVUc5emFYUnBiMjVCZEZScGJXVW9kR2x0WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZjRzl6YVhScGIyNGdLeUFvZEdsdFpTQXRJSFJvYVhNdVgxOTBhVzFsS1NBcUlIUm9hWE11WDE5emNHVmxaRHRjYmlBZ2ZWeHVYRzRnSUY5ZloyVjBWR2x0WlVGMFVHOXphWFJwYjI0b2NHOXphWFJwYjI0cElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZYM1JwYldVZ0t5QW9jRzl6YVhScGIyNGdMU0IwYUdsekxsOWZjRzl6YVhScGIyNHBJQzhnZEdocGN5NWZYM053WldWa08xeHVJQ0I5WEc1Y2JpQWdYMTl6ZVc1alZISmhibk53YjNKMFpXUlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwSUh0Y2JpQWdJQ0IyWVhJZ2JuVnRWSEpoYm5Od2IzSjBaV1JGYm1kcGJtVnpJRDBnZEdocGN5NWZYM1J5WVc1emNHOXlkR1ZrTG14bGJtZDBhRHRjYmx4dUlDQWdJR2xtSUNodWRXMVVjbUZ1YzNCdmNuUmxaRVZ1WjJsdVpYTWdQaUF3S1NCN1hHNGdJQ0FnSUNCMllYSWdaVzVuYVc1bExDQnVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNDdYRzVjYmlBZ0lDQWdJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUlJkV1YxWlM1amJHVmhjaWdwTzF4dUlDQWdJQ0FnZEdocGN5NWZYM1J5WVc1emNHOXlkRkYxWlhWbExuSmxkbVZ5YzJVZ1BTQW9jM0JsWldRZ1BDQXdLVHRjYmx4dUlDQWdJQ0FnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCdWRXMVVjbUZ1YzNCdmNuUmxaRVZ1WjJsdVpYTTdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQmxibWRwYm1VZ1BTQjBhR2x6TGw5ZmRISmhibk53YjNKMFpXUmJhVjA3WEc0Z0lDQWdJQ0FnSUc1bGVIUkZibWRwYm1WUWIzTnBkR2x2YmlBOUlHVnVaMmx1WlM1emVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEZGMVpYVmxMbWx1YzJWeWRDaGxibWRwYm1Vc0lHNWxlSFJGYm1kcGJtVlFiM05wZEdsdmJpazdJQ0JjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmRISmhibk53YjNKMFVYVmxkV1V1ZEdsdFpUdGNiaUFnZlZ4dVhHNGdJRjlmYzNsdVkxUnlZVzV6Y0c5eWRHVmtVM0JsWldRb2RHbHRaU3dnY0c5emFYUnBiMjRzSUhOd1pXVmtLU0I3WEc0Z0lDQWdabTl5SUNoMllYSWdkSEpoYm5Od2IzSjBaV1FnYjJZZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEdWa0tWeHVJQ0FnSUNBZ2RISmhibk53YjNKMFpXUXVjM2x1WTFOd1pXVmtLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwSUdOMWNuSmxiblFnYldGemRHVnlJSFJwYldWY2JpQWdJQ29nUUhKbGRIVnliaUI3VG5WdFltVnlmU0JqZFhKeVpXNTBJSFJwYldWY2JpQWdJQ3BjYmlBZ0lDb2dWR2hwY3lCbWRXNWpkR2x2YmlCM2FXeHNJR0psSUhKbGNHeGhZMlZrSUhkb1pXNGdkR2hsSUhSeVlXNXpjRzl5ZENCcGN5QmhaR1JsWkNCMGJ5QmhJRzFoYzNSbGNpQW9hUzVsTGlCMGNtRnVjM0J2Y25RZ2IzSWdjR3hoZVMxamIyNTBjbTlzS1M1Y2JpQWdJQ292WEc0Z0lHZGxkQ0JqZFhKeVpXNTBWR2x0WlNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXpZMmhsWkhWc1pYSXVZM1Z5Y21WdWRGUnBiV1U3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IyVjBJR04xY25KbGJuUWdiV0Z6ZEdWeUlIQnZjMmwwYVc5dVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTA1MWJXSmxjbjBnWTNWeWNtVnVkQ0J3YkdGNWFXNW5JSEJ2YzJsMGFXOXVYRzRnSUNBcVhHNGdJQ0FxSUZSb2FYTWdablZ1WTNScGIyNGdkMmxzYkNCaVpTQnlaWEJzWVdObFpDQjNhR1Z1SUhSb1pTQjBjbUZ1YzNCdmNuUWdhWE1nWVdSa1pXUWdkRzhnWVNCdFlYTjBaWElnS0drdVpTNGdkSEpoYm5Od2IzSjBJRzl5SUhCc1lYa3RZMjl1ZEhKdmJDa3VYRzRnSUNBcUwxeHVJQ0JuWlhRZ1kzVnljbVZ1ZEZCdmMybDBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZjRzl6YVhScGIyNGdLeUFvZEdocGN5NXpZMmhsWkhWc1pYSXVZM1Z5Y21WdWRGUnBiV1VnTFNCMGFHbHpMbDlmZEdsdFpTa2dLaUIwYUdsekxsOWZjM0JsWldRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZ6WlhRZ2JtVjRkQ0IwY21GdWMzQnZjblFnY0c5emFYUnBiMjVjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlHNWxlSFFnZEhKaGJuTndiM0owSUhCdmMybDBhVzl1WEc0Z0lDQXFYRzRnSUNBcUlGUm9hWE1nWm5WdVkzUnBiMjRnZDJsc2JDQmlaU0J5WlhCc1lXTmxaQ0IzYUdWdUlIUm9aU0IwY21GdWMzQnZjblFnYVhNZ1lXUmtaV1FnZEc4Z1lTQnRZWE4wWlhJZ0tHa3VaUzRnZEhKaGJuTndiM0owSUc5eUlIQnNZWGt0WTI5dWRISnZiQ2t1WEc0Z0lDQXFMMXh1SUNCeVpYTmxkRTVsZUhSUWIzTnBkR2x2YmlodVpYaDBVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NWZYM05qYUdWa2RXeGxja2h2YjJzcFhHNGdJQ0FnSUNCMGFHbHpMbDlmYzJOb1pXUjFiR1Z5U0c5dmF5NXlaWE5sZEU1bGVIUlVhVzFsS0hSb2FYTXVYMTluWlhSVWFXMWxRWFJRYjNOcGRHbHZiaWh1WlhoMFVHOXphWFJwYjI0cEtUdGNibHh1SUNBZ0lIUm9hWE11WDE5dVpYaDBVRzl6YVhScGIyNGdQU0J1WlhoMFVHOXphWFJwYjI0N1hHNGdJSDFjYmx4dUlDQXZMeUJVYVcxbFJXNW5hVzVsSUcxbGRHaHZaQ0FvZEhKaGJuTndiM0owWldRZ2FXNTBaWEptWVdObEtWeHVJQ0J6ZVc1alVHOXphWFJwYjI0b2RHbHRaU3dnY0c5emFYUnBiMjRzSUhOd1pXVmtLU0I3WEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1VnUFNCMGFXMWxPMXh1SUNBZ0lIUm9hWE11WDE5d2IzTnBkR2x2YmlBOUlIQnZjMmwwYVc5dU8xeHVJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJSE53WldWa08xeHVYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTl6ZVc1alZISmhibk53YjNKMFpXUlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dUlDQjlYRzVjYmlBZ0x5OGdWR2x0WlVWdVoybHVaU0J0WlhSb2IyUWdLSFJ5WVc1emNHOXlkR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdZV1IyWVc1alpWQnZjMmwwYVc5dUtIUnBiV1VzSUhCdmMybDBhVzl1TENCemNHVmxaQ2tnZTF4dUlDQWdJSFpoY2lCdVpYaDBSVzVuYVc1bElEMGdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRGRjFaWFZsTG1obFlXUTdYRzRnSUNBZ2RtRnlJRzVsZUhSRmJtZHBibVZRYjNOcGRHbHZiaUE5SUc1bGVIUkZibWRwYm1VdVlXUjJZVzVqWlZCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZmJtVjRkRkJ2YzJsMGFXOXVJRDBnZEdocGN5NWZYM1J5WVc1emNHOXlkRkYxWlhWbExtMXZkbVVvYm1WNGRFVnVaMmx1WlN3Z2JtVjRkRVZ1WjJsdVpWQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmYm1WNGRGQnZjMmwwYVc5dU8xeHVJQ0I5WEc1Y2JpQWdMeThnVkdsdFpVVnVaMmx1WlNCdFpYUm9iMlFnS0hOd1pXVmtMV052Ym5SeWIyeHNaV1FnYVc1MFpYSm1ZV05sS1Z4dUlDQnplVzVqVTNCbFpXUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrTENCelpXVnJJRDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQjJZWElnYkdGemRGTndaV1ZrSUQwZ2RHaHBjeTVmWDNOd1pXVmtPMXh1WEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1VnUFNCMGFXMWxPMXh1SUNBZ0lIUm9hWE11WDE5d2IzTnBkR2x2YmlBOUlIQnZjMmwwYVc5dU8xeHVJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJSE53WldWa08xeHVYRzRnSUNBZ2FXWWdLSE53WldWa0lDRTlQU0JzWVhOMFUzQmxaV1FnZkh3Z0tITmxaV3NnSmlZZ2MzQmxaV1FnSVQwOUlEQXBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JtVjRkRkJ2YzJsMGFXOXVJRDBnZEdocGN5NWZYMjVsZUhSUWIzTnBkR2x2Ymp0Y2JseHVJQ0FnSUNBZ0x5OGdjbVZ6ZVc1aklIUnlZVzV6Y0c5eWRHVmtJR1Z1WjJsdVpYTmNiaUFnSUNBZ0lHbG1JQ2h6WldWcklIeDhJSE53WldWa0lDb2diR0Z6ZEZOd1pXVmtJRHdnTUNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ6WldWcklHOXlJSEpsZG1WeWMyVWdaR2x5WldOMGFXOXVYRzRnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlIUm9hWE11WDE5emVXNWpWSEpoYm5Od2IzSjBaV1JRYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHNZWE4wVTNCbFpXUWdQVDA5SURBcElIdGNiaUFnSUNBZ0lDQWdMeThnYzNSaGNuUmNiaUFnSUNBZ0lDQWdibVY0ZEZCdmMybDBhVzl1SUQwZ2RHaHBjeTVmWDNONWJtTlVjbUZ1YzNCdmNuUmxaRkJ2YzJsMGFXOXVLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNWNiaUFnSUNBZ0lDQWdMeThnYzJOb1pXUjFiR1VnZEhKaGJuTndiM0owSUdsMGMyVnNabHh1SUNBZ0lDQWdJQ0IwYUdsekxsOWZjMk5vWldSMWJHVnlTRzl2YXlBOUlHNWxkeUJVY21GdWMzQnZjblJUWTJobFpIVnNaWEpJYjI5cktIUm9hWE1wTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5qYUdWa2RXeGxjaTVoWkdRb2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc3NJRWx1Wm1sdWFYUjVLVHRjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvYzNCbFpXUWdQVDA5SURBcElIdGNiaUFnSUNBZ0lDQWdMeThnYzNSdmNGeHVJQ0FnSUNBZ0lDQnVaWGgwVUc5emFYUnBiMjRnUFNCSmJtWnBibWwwZVR0Y2JseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmMzbHVZMVJ5WVc1emNHOXlkR1ZrVTNCbFpXUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lEQXBPMXh1WEc0Z0lDQWdJQ0FnSUM4dklIVnVjMk5vWldSMWJHVWdkSEpoYm5Od2IzSjBJR2wwYzJWc1pseHVJQ0FnSUNBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2k1eVpXMXZkbVVvZEdocGN5NWZYM05qYUdWa2RXeGxja2h2YjJzcE8xeHVJQ0FnSUNBZ0lDQmtaV3hsZEdVZ2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyczdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJqYUdGdVoyVWdjM0JsWldRZ2QybDBhRzkxZENCeVpYWmxjbk5wYm1jZ1pHbHlaV04wYVc5dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5emVXNWpWSEpoYm5Od2IzSjBaV1JUY0dWbFpDaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbkpsYzJWMFRtVjRkRkJ2YzJsMGFXOXVLRzVsZUhSUWIzTnBkR2x2YmlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFRmtaQ0JoSUhScGJXVWdaVzVuYVc1bElIUnZJSFJvWlNCMGNtRnVjM0J2Y25SY2JpQWdJQ29nUUhCaGNtRnRJSHRQWW1wbFkzUjlJR1Z1WjJsdVpTQmxibWRwYm1VZ2RHOGdZbVVnWVdSa1pXUWdkRzhnZEdobElIUnlZVzV6Y0c5eWRGeHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnY0c5emFYUnBiMjRnYzNSaGNuUWdjRzl6YVhScGIyNWNiaUFnSUNvdlhHNGdJR0ZrWkNobGJtZHBibVVzSUhOMFlYSjBVRzl6YVhScGIyNGdQU0F0U1c1bWFXNXBkSGtzSUdWdVpGQnZjMmwwYVc5dUlEMGdTVzVtYVc1cGRIa3NJRzltWm5ObGRGQnZjMmwwYVc5dUlEMGdjM1JoY25SUWIzTnBkR2x2YmlrZ2UxeHVJQ0FnSUhaaGNpQjBjbUZ1YzNCdmNuUmxaQ0E5SUc1MWJHdzdYRzVjYmlBZ0lDQnBaaUFvYjJabWMyVjBVRzl6YVhScGIyNGdQVDA5SUMxSmJtWnBibWwwZVNsY2JpQWdJQ0FnSUc5bVpuTmxkRkJ2YzJsMGFXOXVJRDBnTUR0Y2JseHVJQ0FnSUdsbUlDaGxibWRwYm1VdWJXRnpkR1Z5S1Z4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYjJKcVpXTjBJR2hoY3lCaGJISmxZV1I1SUdKbFpXNGdZV1JrWldRZ2RHOGdZU0J0WVhOMFpYSmNJaWs3WEc1Y2JpQWdJQ0JwWmlBb1pXNW5hVzVsTG1sdGNHeGxiV1Z1ZEhOVWNtRnVjM0J2Y25SbFpDZ3BLVnh1SUNBZ0lDQWdkSEpoYm5Od2IzSjBaV1FnUFNCdVpYY2dWSEpoYm5Od2IzSjBaV1JVY21GdWMzQnZjblJsWkNoMGFHbHpMQ0JsYm1kcGJtVXNJSE4wWVhKMFVHOXphWFJwYjI0c0lHVnVaRkJ2YzJsMGFXOXVMQ0J2Wm1aelpYUlFiM05wZEdsdmJpazdYRzRnSUNBZ1pXeHpaU0JwWmlBb1pXNW5hVzVsTG1sdGNHeGxiV1Z1ZEhOVGNHVmxaRU52Ym5SeWIyeHNaV1FvS1NsY2JpQWdJQ0FnSUhSeVlXNXpjRzl5ZEdWa0lEMGdibVYzSUZSeVlXNXpjRzl5ZEdWa1UzQmxaV1JEYjI1MGNtOXNiR1ZrS0hSb2FYTXNJR1Z1WjJsdVpTd2djM1JoY25SUWIzTnBkR2x2Yml3Z1pXNWtVRzl6YVhScGIyNHNJRzltWm5ObGRGQnZjMmwwYVc5dUtUdGNiaUFnSUNCbGJITmxJR2xtSUNobGJtZHBibVV1YVcxd2JHVnRaVzUwYzFOamFHVmtkV3hsWkNncEtWeHVJQ0FnSUNBZ2RISmhibk53YjNKMFpXUWdQU0J1WlhjZ1ZISmhibk53YjNKMFpXUlRZMmhsWkhWc1pXUW9kR2hwY3l3Z1pXNW5hVzVsTENCemRHRnlkRkJ2YzJsMGFXOXVMQ0JsYm1SUWIzTnBkR2x2Yml3Z2IyWm1jMlYwVUc5emFYUnBiMjRwTzF4dUlDQWdJR1ZzYzJWY2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjSW05aWFtVmpkQ0JqWVc1dWIzUWdZbVVnWVdSa1pXUWdkRzhnWVNCMGNtRnVjM0J2Y25SY0lpazdYRzVjYmlBZ0lDQnBaaUFvZEhKaGJuTndiM0owWldRcElIdGNiaUFnSUNBZ0lIWmhjaUJ6Y0dWbFpDQTlJSFJvYVhNdVgxOXpjR1ZsWkR0Y2JseHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdVoybHVaWE11Y0hWemFDaGxibWRwYm1VcE8xeHVJQ0FnSUNBZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEdWa0xuQjFjMmdvZEhKaGJuTndiM0owWldRcE8xeHVYRzRnSUNBZ0lDQjBjbUZ1YzNCdmNuUmxaQzV6WlhSVWNtRnVjM0J2Y25SbFpDaDBhR2x6TENBb2JtVjRkRVZ1WjJsdVpWQnZjMmwwYVc5dUlEMGdiblZzYkNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0F2THlCeVpYTmxkRTVsZUhSUWIzTnBkR2x2Ymx4dUlDQWdJQ0FnSUNCMllYSWdjM0JsWldRZ1BTQjBhR2x6TGw5ZmMzQmxaV1E3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE53WldWa0lDRTlQU0F3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0c1bGVIUkZibWRwYm1WUWIzTnBkR2x2YmlBOVBUMGdiblZzYkNsY2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSRmJtZHBibVZRYjNOcGRHbHZiaUE5SUhSeVlXNXpjRzl5ZEdWa0xuTjVibU5RYjNOcGRHbHZiaWgwYUdsekxtTjFjbkpsYm5SVWFXMWxMQ0IwYUdsekxtTjFjbkpsYm5SUWIzTnBkR2x2Yml3Z2MzQmxaV1FwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUlJkV1YxWlM1dGIzWmxLSFJ5WVc1emNHOXlkR1ZrTENCdVpYaDBSVzVuYVc1bFVHOXphWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtVnpaWFJPWlhoMFVHOXphWFJwYjI0b2JtVjRkRkJ2YzJsMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlN3Z0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBdkx5Qm5aWFJEZFhKeVpXNTBWR2x0WlZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYM1J5WVc1emNHOXlkQzV6WTJobFpIVnNaWEl1WTNWeWNtVnVkRlJwYldVN1hHNGdJQ0FnSUNCOUxDQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDOHZJR2RsZENCamRYSnlaVzUwVUc5emFYUnBiMjVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUXVZM1Z5Y21WdWRGQnZjMmwwYVc5dUlDMGdkR2hwY3k1ZlgyOW1abk5sZEZCdmMybDBhVzl1TzF4dUlDQWdJQ0FnZlNrN1hHNWNiaUFnSUNBZ0lHbG1JQ2h6Y0dWbFpDQWhQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ6ZVc1aklHRnVaQ0J6ZEdGeWRGeHVJQ0FnSUNBZ0lDQjJZWElnYm1WNGRFVnVaMmx1WlZCdmMybDBhVzl1SUQwZ2RISmhibk53YjNKMFpXUXVjM2x1WTFCdmMybDBhVzl1S0hSb2FYTXVZM1Z5Y21WdWRGUnBiV1VzSUhSb2FYTXVZM1Z5Y21WdWRGQnZjMmwwYVc5dUxDQnpjR1ZsWkNrN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ1WlhoMFVHOXphWFJwYjI0Z1BTQjBhR2x6TGw5ZmRISmhibk53YjNKMFVYVmxkV1V1YVc1elpYSjBLSFJ5WVc1emNHOXlkR1ZrTENCdVpYaDBSVzVuYVc1bFVHOXphWFJwYjI0cE8xeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWNtVnpaWFJPWlhoMFVHOXphWFJwYjI0b2JtVjRkRkJ2YzJsMGFXOXVLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2RISmhibk53YjNKMFpXUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WdGIzWmxJR0VnZEdsdFpTQmxibWRwYm1VZ1puSnZiU0IwYUdVZ2RISmhibk53YjNKMFhHNGdJQ0FxSUVCd1lYSmhiU0I3YjJKcVpXTjBmU0JsYm1kcGJtVlBjbFJ5WVc1emNHOXlkR1ZrSUdWdVoybHVaU0J2Y2lCMGNtRnVjM0J2Y25SbFpDQjBieUJpWlNCeVpXMXZkbVZrSUdaeWIyMGdkR2hsSUhSeVlXNXpjRzl5ZEZ4dUlDQWdLaTljYmlBZ2NtVnRiM1psS0dWdVoybHVaVTl5VkhKaGJuTndiM0owWldRcElIdGNiaUFnSUNCMllYSWdaVzVuYVc1bElEMGdaVzVuYVc1bFQzSlVjbUZ1YzNCdmNuUmxaRHRjYmlBZ0lDQjJZWElnZEhKaGJuTndiM0owWldRZ1BTQnlaVzF2ZG1WRGIzVndiR1VvZEdocGN5NWZYMlZ1WjJsdVpYTXNJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUmxaQ3dnWlc1bmFXNWxUM0pVY21GdWMzQnZjblJsWkNrN1hHNWNiaUFnSUNCcFppQW9JWFJ5WVc1emNHOXlkR1ZrS1NCN1hHNGdJQ0FnSUNCbGJtZHBibVVnUFNCeVpXMXZkbVZEYjNWd2JHVW9kR2hwY3k1ZlgzUnlZVzV6Y0c5eWRHVmtMQ0IwYUdsekxsOWZaVzVuYVc1bGN5d2daVzVuYVc1bFQzSlVjbUZ1YzNCdmNuUmxaQ2s3WEc0Z0lDQWdJQ0IwY21GdWMzQnZjblJsWkNBOUlHVnVaMmx1WlU5eVZISmhibk53YjNKMFpXUTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR1Z1WjJsdVpTQW1KaUIwY21GdWMzQnZjblJsWkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJRzVsZUhSUWIzTnBkR2x2YmlBOUlIUm9hWE11WDE5MGNtRnVjM0J2Y25SUmRXVjFaUzV5WlcxdmRtVW9kSEpoYm5Od2IzSjBaV1FwTzF4dVhHNGdJQ0FnSUNCMGNtRnVjM0J2Y25SbFpDNXlaWE5sZEVsdWRHVnlabUZqWlNncE8xeHVJQ0FnSUNBZ2RISmhibk53YjNKMFpXUXVaR1Z6ZEhKdmVTZ3BPMXh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVmWDNOd1pXVmtJQ0U5UFNBd0tWeHVJQ0FnSUNBZ0lDQjBhR2x6TG5KbGMyVjBUbVY0ZEZCdmMybDBhVzl1S0c1bGVIUlFiM05wZEdsdmJpazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjSW05aWFtVmpkQ0JvWVhNZ2JtOTBJR0psWlc0Z1lXUmtaV1FnZEc4Z2RHaHBjeUIwY21GdWMzQnZjblJjSWlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxiVzkyWlNCaGJHd2dkR2x0WlNCbGJtZHBibVZ6SUdaeWIyMGdkR2hsSUhSeVlXNXpjRzl5ZEZ4dUlDQWdLaTljYmlBZ1kyeGxZWElvS1NCN1hHNGdJQ0FnZEdocGN5NXplVzVqVTNCbFpXUW9kR2hwY3k1amRYSnlaVzUwVkdsdFpTd2dkR2hwY3k1amRYSnlaVzUwVUc5emFYUnBiMjRzSURBcE8xeHVYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2RISmhibk53YjNKMFpXUWdiMllnZEdocGN5NWZYM1J5WVc1emNHOXlkR1ZrS1NCN1hHNGdJQ0FnSUNCMGNtRnVjM0J2Y25SbFpDNXlaWE5sZEVsdWRHVnlabUZqWlNncE8xeHVJQ0FnSUNBZ2RISmhibk53YjNKMFpXUXVaR1Z6ZEhKdmVTZ3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJ5WVc1emNHOXlkRHNpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxuLyoqXG4gKiBFUzYgSW1wbGVtZW50YXRpb24gb2YgYSBiaW5hcnkgaGVhcCBiYXNlZCBvbiA6XG4gKiBodHRwOi8vaW50ZXJhY3RpdmVweXRob24ub3JnL2NvdXJzZWxpYi9zdGF0aWMvcHl0aG9uZHMvVHJlZXMvaGVhcC5odG1sXG4gKlxuICogVGhlIEhlYXAgY2xhc3MgaXMgYW4gYWJzdHJhY3Rpb24gb2YgdGhlIGJpbmFyeSBoZWFwLiBJdCBpcyBpbXBsZW1lbnRlZCB0b1xuICogZ2l2ZSBtZXRob2RzIHJlbGF0ZWQgdG8gYm90aCBtaW4gYW5kIG1heCBoZWFwcy5cbiAqXG4gKiBAYXV0aG9yOiBSZW5hdWQgVmluY2VudCBodHRwczovL2dpdGh1Yi5jb20vcmVuYXVkZnZcbiAqKi9cblxudmFyIEhlYXAgPSAoZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBIZWFwKCkge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIZWFwKTtcblxuXHRcdHRoaXMuY3VycmVudFNpemUgPSAwO1xuXHRcdHRoaXMuaGVhcExpc3QgPSBbXTtcblx0fVxuXG5cdF9jcmVhdGVDbGFzcyhIZWFwLCB7XG5cdFx0X19wZXJjVXA6IHtcblxuXHRcdFx0Ly8gQWJzdHJhY3QgbWV0aG9kIHdoaWNoIGJyaW5ncyBlbGVtZW50cyB1cCB0aGUgdHJlZSBmcm9tIHRoZSBpIGluZGV4LlxuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gX19wZXJjVXAoaSkge31cblx0XHR9LFxuXHRcdF9fcGVyY0Rvd246IHtcblxuXHRcdFx0Ly8gQWJzdHJhY3QgbWV0aG9kIHdoaWNoIGJyaW5ncyBlbGVtZW50cyBkb3duIHRoZSB0cmVlIGZyb20gdGhlIGkgaW5kZXguXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBfX3BlcmNEb3duKGkpIHt9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0Ly8gUmVtb3ZlcyBhbiBvYmplY3QgZnJvbSB0aGUgaGVhcCwgaXRlbSBiZWluZyByZWZlcmluZyB0byB0aGUgbmVzdGVkIG9iamVjdFxuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKGl0ZW0pIHt9XG5cdFx0fSxcblx0XHRidWlsZEhlYXA6IHtcblxuXHRcdFx0Ly8gQnVpbGQgdGhlIGhlYXAgZnJvbSBhbiBvYmplY3QgbGlzdCBhbmQgc3RydWN0dXJlIGl0XG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBidWlsZEhlYXAobGlzdCkge31cblx0XHR9LFxuXHRcdGVtcHR5OiB7XG5cblx0XHRcdC8vIENsZWFyIHRoZSBsaXN0IGJ5IHJlcGxhY2luZyBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBzd2FwIG9iamVjdFxuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZW1wdHkoKSB7fVxuXHRcdH0sXG5cdFx0X19jaGlsZFBvc2l0aW9uOiB7XG5cblx0XHRcdC8qKlxuICAgICogU3RhdGljIG1ldGhvZCB1c2VkIHRvIGdldCBhIHNwZWNpZmljIGluZGV4IGRvd24gdGhlIHRyZWVcbiAgICAqIGZvciBzd2FwL3BlcmMgcHVycG9zZXMgaW4gdGhlIHBlcmMgZG93biBtZXRob2RcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gX19jaGlsZFBvc2l0aW9uKGkpIHtcblx0XHRcdFx0aWYgKGkgKiAyICsgMSA+IHRoaXMuY3VycmVudFNpemUgfHwgdGhpcy5oZWFwTGlzdFtpICogMl0uaGVhcFZhbHVlIDwgdGhpcy5oZWFwTGlzdFtpICogMiArIDFdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHRcdHJldHVybiBpICogMjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gaSAqIDIgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbnNlcnQ6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBJbnNlcnQgYSB2YWx1ZSB3aXRoIGFuIGFzc29jaWF0ZWQgb2JqZWN0IGluIHRoZSBoZWFwIHRyZWUuIFRoZSBwZXJjIHVwXG4gICAgKiBtZXRob2QgaW1wbGVtZW50YXRpb24gc2hvdWxkIGhhbmRsZSB3aGF0IHRvIGRvIHdpdGggdGhlIGhlYXBWYWx1ZSAoZWcgbWluXG4gICAgKiBvciBtYXggc29ydGluZykuXG4gICAgKlxuICAgICogQHBhcmFtcyB2YWx1ZSBiZWluZyB0aGUgaGVhcFZhbHVlIHVzZWQgZm9yIHNvcnRpbmcgYW5kIGFueSBvYmplY3RcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5zZXJ0KHZhbHVlLCBvYmplY3QpIHtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdC5wdXNoKHtcblx0XHRcdFx0XHRvYmplY3Q6IG9iamVjdCxcblx0XHRcdFx0XHRoZWFwVmFsdWU6IHZhbHVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplKys7XG5cdFx0XHRcdHRoaXMuX19wZXJjVXAodGhpcy5jdXJyZW50U2l6ZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1cGRhdGU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kIHRoZSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYW5kIHVwZGF0ZSBpdHMgaGVhcFZhbHVlLlxuICAgICogVGhlIHRyZWUgc2hvdWxkIHRoZSBiZSBzb3J0ZWQgdXNpbmcgcGVyYyB1cCB0byBicmluZyB0aGUgbmV4dCBkZXNpcmVkIHZhbHVlXG4gICAgKiBhcyB0aGUgaGVhZC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5jdXJyZW50U2l6ZTsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR0aGlzLl9fcGVyY1VwKHRoaXMuY3VycmVudFNpemUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGVsZXRlSGVhZDoge1xuXG5cdFx0XHQvKipcbiAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgaGVhZCAobWluaW1hbCkgb2YgaGVhcCBsaXN0LiBQdXRzIGl0IGF0IHRoZSBlbmQgb2ZcbiAgICAqIHRoZSBsaXN0IGFuZCB0YWtlcyBpdCBvdXQgd2l0aCBwb3AuIEFzc3VyZXMgdGhhdCB0aGUgdHJlZSBpcyByZXN0b3JlZC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZGVsZXRlSGVhZCgpIHtcblx0XHRcdFx0dmFyIHJlZmVyZW5jZVZhbHVlID0gdGhpcy5oZWFwTGlzdFsxXTsgLy8gcG9zIDAgYmVpbmcgdXNlZCBmb3IgcGVyY29sYXRpbmdcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFsxXSA9IHRoaXMuaGVhcExpc3RbdGhpcy5jdXJyZW50U2l6ZV07IC8vIGZpcnN0IGl0ZW0gaXMgbGFzdFxuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplLS07XG5cdFx0XHRcdHRoaXMuaGVhcExpc3QucG9wKCk7XG5cdFx0XHRcdHRoaXMuX19wZXJjRG93bigxKTsgLy8gZnJvbSBmaXJzdCBpdGVtLCByZXN0b3JlIHRyZWVcblx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZVZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhZE9iamVjdDoge1xuXG5cdFx0XHQvKipcbiAgICAqIFJldHVybnMgb2JqZWN0IHJlZmVyZW5jZSBvZiBoZWFkIHdpdGhvdXQgcmVtb3ZpbmcgaXQuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGhlYWRPYmplY3QoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmhlYXBMaXN0WzFdLm9iamVjdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhlYWRWYWx1ZToge1xuXG5cdFx0XHQvKipcbiAgICAqIFJldHVybnMgdmFsdWUgcmVmZXJlbmNlIG9mIGhlYWQgd2l0aG91dCByZW1vdmluZyBpdC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaGVhZFZhbHVlKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFwTGlzdFsxXS5oZWFwVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsaXN0OiB7XG5cblx0XHRcdC8qKlxuICAgICogTGlzdCBhY2Nlc3NvclxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBsaXN0KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFwTGlzdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNpemU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBDdXJyZW50IHNpemUgYWNjZXNzb3JcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2l6ZSgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY3VycmVudFNpemU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb250YWluczoge1xuXG5cdFx0XHQvKipcbiAgICogUmV0dXJucyB3aGV0ZXIgb3Igbm90IHRoZSBvYmplY3QgaXMgYWxyZWFkeSBpbiB0aGUgaGVhcFxuICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGNvbnRhaW5zKG9iamVjdCkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLmN1cnJlbnRTaXplOyBpKyspIHtcblx0XHRcdFx0XHRpZiAob2JqZWN0ID09PSB0aGlzLmhlYXBMaXN0W2ldLm9iamVjdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGlzRW1wdHk6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBoZWFwIGlzIGVtcHR5LlxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpc0VtcHR5KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jdXJyZW50U2l6ZSA9PT0gMDtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBIZWFwO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OW9aV0Z3TDJobFlYQXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenM3T3pzN096dEpRVk5OTEVsQlFVazdRVUZGUlN4VlFVWk9MRWxCUVVrc1IwRkZTenQzUWtGR1ZDeEpRVUZKT3p0QlFVZFNMRTFCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzSkNMRTFCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZETzBWQlEyNUNPenRqUVV4SkxFbEJRVWs3UVVGUlZDeFZRVUZST3pzN08xVkJRVUVzYTBKQlFVTXNRMEZCUXl4RlFVRkZMRVZCUVVVN08wRkJSMlFzV1VGQlZUczdPenRWUVVGQkxHOUNRVUZETEVOQlFVTXNSVUZCUlN4RlFVRkZPenRCUVVkb1FpeFJRVUZOT3pzN08xVkJRVUVzWjBKQlFVTXNTVUZCU1N4RlFVRkZMRVZCUVVVN08wRkJSMllzVjBGQlV6czdPenRWUVVGQkxHMUNRVUZETEVsQlFVa3NSVUZCUlN4RlFVRkZPenRCUVVkc1FpeFBRVUZMT3pzN08xVkJRVUVzYVVKQlFVY3NSVUZCUlRzN1FVRk5WaXhwUWtGQlpUczdPenM3T3p0VlFVRkJMSGxDUVVGRExFTkJRVU1zUlVGQlJUdEJRVU5zUWl4UlFVRkpMRUZCUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjc1NVRkRMMElzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eEhRVUZKTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRUZCUVVNc1JVRkJSVHRCUVVONFJTeFpRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkRZaXhOUVVGTk8wRkJRMDRzV1VGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOcVFqdEpRVU5FT3p0QlFWTkVMRkZCUVUwN096czdPenM3T3pzN1ZVRkJRU3huUWtGQlF5eExRVUZMTEVWQlFVVXNUVUZCVFN4RlFVRkZPMEZCUTNKQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUTJ4Q0xHRkJRVlVzVFVGQlRUdEJRVU5vUWl4blFrRkJZU3hMUVVGTE8wdEJRMnhDTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dEJRVU51UWl4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0SlFVTm9RenM3UVVGUFJDeFJRVUZOT3pzN096czdPenRWUVVGQkxHZENRVUZETEUxQlFVMHNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRja0lzVTBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRNME1zVTBGQlNTeE5RVUZOTEV0QlFVc3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZGtNc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRMjVETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzAxQlEyaERPMHRCUTBRN1NVRkRSRHM3UVVGTlJDeFpRVUZWT3pzN096czdPMVZCUVVFc2MwSkJRVWM3UVVGRFdpeFJRVUZKTEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzUkRMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdRVUZEYmtRc1VVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlEyNUNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEY0VJc1VVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnVRaXhYUVVGUExHTkJRV01zUTBGQlF6dEpRVU4wUWpzN1FVRkxSQ3haUVVGVk96czdPenM3VlVGQlFTeHpRa0ZCUnp0QlFVTmFMRmRCUVU4c1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNN1NVRkRMMEk3TzBGQlMwUXNWMEZCVXpzN096czdPMVZCUVVFc2NVSkJRVWM3UVVGRFdDeFhRVUZQTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETzBsQlEyeERPenRCUVV0RUxFMUJRVWs3T3pzN096dFZRVUZCTEdkQ1FVRkhPMEZCUTA0c1YwRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBsQlEzSkNPenRCUVV0RUxFMUJRVWs3T3pzN096dFZRVUZCTEdkQ1FVRkhPMEZCUTA0c1YwRkJUeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzBsQlEzaENPenRCUVV0RUxGVkJRVkU3T3pzN096dFZRVUZCTEd0Q1FVRkRMRTFCUVUwc1JVRkJSVHRCUVVOb1FpeFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVNelF5eFRRVUZKTEUxQlFVMHNTMEZCU3l4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTjJReXhoUVVGUExFbEJRVWtzUTBGQlF6dE5RVU5hTzB0QlEwUTdRVUZEUkN4WFFVRlBMRXRCUVVzc1EwRkJRenRKUVVOaU96dEJRVXRFTEZOQlFVODdPenM3T3p0VlFVRkJMRzFDUVVGSE8wRkJRMVFzVjBGQlR5eEpRVUZKTEVOQlFVTXNWMEZCVnl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVNNVFqczdPenRSUVROSVNTeEpRVUZKT3pzN1FVRXJTRllzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNaUxDSm1hV3hsSWpvaVpYTTJMM1YwYVd4ekwyaGxZWEF2YUdWaGNDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUlZNMklFbHRjR3hsYldWdWRHRjBhVzl1SUc5bUlHRWdZbWx1WVhKNUlHaGxZWEFnWW1GelpXUWdiMjRnT2x4dUlDb2dhSFIwY0RvdkwybHVkR1Z5WVdOMGFYWmxjSGwwYUc5dUxtOXlaeTlqYjNWeWMyVnNhV0l2YzNSaGRHbGpMM0I1ZEdodmJtUnpMMVJ5WldWekwyaGxZWEF1YUhSdGJGeHVJQ3BjYmlBcUlGUm9aU0JJWldGd0lHTnNZWE56SUdseklHRnVJR0ZpYzNSeVlXTjBhVzl1SUc5bUlIUm9aU0JpYVc1aGNua2dhR1ZoY0M0Z1NYUWdhWE1nYVcxd2JHVnRaVzUwWldRZ2RHOWNiaUFxSUdkcGRtVWdiV1YwYUc5a2N5QnlaV3hoZEdWa0lIUnZJR0p2ZEdnZ2JXbHVJR0Z1WkNCdFlYZ2dhR1ZoY0hNdVhHNGdLbHh1SUNvZ1FHRjFkR2h2Y2pvZ1VtVnVZWFZrSUZacGJtTmxiblFnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNKbGJtRjFaR1oyWEc0Z0tpb3ZYRzVqYkdGemN5QklaV0Z3SUh0Y2JseHVYSFJqYjI1emRISjFZM1J2Y2lncElIdGNibHgwWEhSMGFHbHpMbU4xY25KbGJuUlRhWHBsSUQwZ01EdGNibHgwWEhSMGFHbHpMbWhsWVhCTWFYTjBJRDBnVzEwN1hHNWNkSDFjYmx4dVhIUXZMeUJCWW5OMGNtRmpkQ0J0WlhSb2IyUWdkMmhwWTJnZ1luSnBibWR6SUdWc1pXMWxiblJ6SUhWd0lIUm9aU0IwY21WbElHWnliMjBnZEdobElHa2dhVzVrWlhndVhHNWNkRjlmY0dWeVkxVndLR2twSUh0OVhHNWNibHgwTHk4Z1FXSnpkSEpoWTNRZ2JXVjBhRzlrSUhkb2FXTm9JR0p5YVc1bmN5QmxiR1Z0Wlc1MGN5QmtiM2R1SUhSb1pTQjBjbVZsSUdaeWIyMGdkR2hsSUdrZ2FXNWtaWGd1WEc1Y2RGOWZjR1Z5WTBSdmQyNG9hU2tnZTMxY2JseHVYSFF2THlCU1pXMXZkbVZ6SUdGdUlHOWlhbVZqZENCbWNtOXRJSFJvWlNCb1pXRndMQ0JwZEdWdElHSmxhVzVuSUhKbFptVnlhVzVuSUhSdklIUm9aU0J1WlhOMFpXUWdiMkpxWldOMFhHNWNkSEpsYlc5MlpTaHBkR1Z0S1NCN2ZWeHVYRzVjZEM4dklFSjFhV3hrSUhSb1pTQm9aV0Z3SUdaeWIyMGdZVzRnYjJKcVpXTjBJR3hwYzNRZ1lXNWtJSE4wY25WamRIVnlaU0JwZEZ4dVhIUmlkV2xzWkVobFlYQW9iR2x6ZENrZ2UzMWNibHh1WEhRdkx5QkRiR1ZoY2lCMGFHVWdiR2x6ZENCaWVTQnlaWEJzWVdOcGJtY2dhWFFnZDJsMGFDQjBhR1VnWVhCd2NtOXdjbWxoZEdVZ2MzZGhjQ0J2WW1wbFkzUmNibHgwWlcxd2RIa29LU0I3ZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJUZEdGMGFXTWdiV1YwYUc5a0lIVnpaV1FnZEc4Z1oyVjBJR0VnYzNCbFkybG1hV01nYVc1a1pYZ2daRzkzYmlCMGFHVWdkSEpsWlZ4dVhIUWdLaUJtYjNJZ2MzZGhjQzl3WlhKaklIQjFjbkJ2YzJWeklHbHVJSFJvWlNCd1pYSmpJR1J2ZDI0Z2JXVjBhRzlrWEc1Y2RDQXFMMXh1WEhSZlgyTm9hV3hrVUc5emFYUnBiMjRvYVNrZ2UxeHVYSFJjZEdsbUlDZ29hU0FxSURJZ0t5QXhJRDRnZEdocGN5NWpkWEp5Wlc1MFUybDZaU2tnZkh4Y2JseDBYSFJjZENoMGFHbHpMbWhsWVhCTWFYTjBXMmtnS2lBeVhTNW9aV0Z3Vm1Gc2RXVWdQQ0RDb0hSb2FYTXVhR1ZoY0V4cGMzUmJhU0FxSURJZ0t5QXhYUzVvWldGd1ZtRnNkV1VwS1NCN1hHNWNkRngwWEhSeVpYUjFjbTRnYVNBcUlESTdYRzVjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEhKbGRIVnliaUJwSUNvZ01pQXJJREU3WEc1Y2RGeDBmVnh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUVsdWMyVnlkQ0JoSUhaaGJIVmxJSGRwZEdnZ1lXNGdZWE56YjJOcFlYUmxaQ0J2WW1wbFkzUWdhVzRnZEdobElHaGxZWEFnZEhKbFpTNGdWR2hsSUhCbGNtTWdkWEJjYmx4MElDb2diV1YwYUc5a0lHbHRjR3hsYldWdWRHRjBhVzl1SUhOb2IzVnNaQ0JvWVc1a2JHVWdkMmhoZENCMGJ5QmtieUIzYVhSb0lIUm9aU0JvWldGd1ZtRnNkV1VnS0dWbklHMXBibHh1WEhRZ0tpQnZjaUJ0WVhnZ2MyOXlkR2x1WnlrdVhHNWNkQ0FxWEc1Y2RDQXFJRUJ3WVhKaGJYTWdkbUZzZFdVZ1ltVnBibWNnZEdobElHaGxZWEJXWVd4MVpTQjFjMlZrSUdadmNpQnpiM0owYVc1bklHRnVaQ0JoYm5rZ2IySnFaV04wWEc1Y2RDQXFMMXh1WEhScGJuTmxjblFvZG1Gc2RXVXNJRzlpYW1WamRDa2dlMXh1WEhSY2RIUm9hWE11YUdWaGNFeHBjM1F1Y0hWemFDaDdYRzVjZEZ4MFhIUW5iMkpxWldOMEp6b2diMkpxWldOMExGeHVYSFJjZEZ4MEoyaGxZWEJXWVd4MVpTYzZJSFpoYkhWbFhHNWNkRngwZlNrN1hHNWNkRngwZEdocGN5NWpkWEp5Wlc1MFUybDZaU3NyTzF4dVhIUmNkSFJvYVhNdVgxOXdaWEpqVlhBb2RHaHBjeTVqZFhKeVpXNTBVMmw2WlNrN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dSbWx1WkNCMGFHVWdiMkpxWldOMElISmxabVZ5Wlc1alpTQnBiaUIwYUdVZ2FHVmhjQ0JzYVhOMElHRnVaQ0IxY0dSaGRHVWdhWFJ6SUdobFlYQldZV3gxWlM1Y2JseDBJQ29nVkdobElIUnlaV1VnYzJodmRXeGtJSFJvWlNCaVpTQnpiM0owWldRZ2RYTnBibWNnY0dWeVl5QjFjQ0IwYnlCaWNtbHVaeUIwYUdVZ2JtVjRkQ0JrWlhOcGNtVmtJSFpoYkhWbFhHNWNkQ0FxSUdGeklIUm9aU0JvWldGa0xseHVYSFFnS2k5Y2JseDBkWEJrWVhSbEtHOWlhbVZqZEN3Z2RtRnNkV1VwSUh0Y2JseDBYSFJtYjNJZ0tIWmhjaUJwSUQwZ01Uc2dhU0E4UFNCMGFHbHpMbU4xY25KbGJuUlRhWHBsT3lCcEt5c3BJSHRjYmx4MFhIUmNkR2xtSUNodlltcGxZM1FnUFQwOUlIUm9hWE11YUdWaGNFeHBjM1JiYVYwdWIySnFaV04wS1NCN1hHNWNkRngwWEhSY2RIUm9hWE11YUdWaGNFeHBjM1JiYVYwdWFHVmhjRlpoYkhWbElEMGdkbUZzZFdVN1hHNWNkRngwWEhSY2RIUm9hWE11WDE5d1pYSmpWWEFvZEdocGN5NWpkWEp5Wlc1MFUybDZaU2s3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUUxbGRHaHZaQ0IxYzJWa0lIUnZJR2RsZENCMGFHVWdhR1ZoWkNBb2JXbHVhVzFoYkNrZ2IyWWdhR1ZoY0NCc2FYTjBMaUJRZFhSeklHbDBJR0YwSUhSb1pTQmxibVFnYjJaY2JseDBJQ29nZEdobElHeHBjM1FnWVc1a0lIUmhhMlZ6SUdsMElHOTFkQ0IzYVhSb0lIQnZjQzRnUVhOemRYSmxjeUIwYUdGMElIUm9aU0IwY21WbElHbHpJSEpsYzNSdmNtVmtMbHh1WEhRZ0tpOWNibHgwWkdWc1pYUmxTR1ZoWkNncElIdGNibHgwWEhSMllYSWdjbVZtWlhKbGJtTmxWbUZzZFdVZ1BTQjBhR2x6TG1obFlYQk1hWE4wV3pGZE95QXZMeUJ3YjNNZ01DQmlaV2x1WnlCMWMyVmtJR1p2Y2lCd1pYSmpiMnhoZEdsdVoxeHVYSFJjZEhSb2FYTXVhR1ZoY0V4cGMzUmJNVjBnUFNCMGFHbHpMbWhsWVhCTWFYTjBXM1JvYVhNdVkzVnljbVZ1ZEZOcGVtVmRPeUF2THlCbWFYSnpkQ0JwZEdWdElHbHpJR3hoYzNSY2JseDBYSFIwYUdsekxtTjFjbkpsYm5SVGFYcGxMUzA3WEc1Y2RGeDBkR2hwY3k1b1pXRndUR2x6ZEM1d2IzQW9LVHRjYmx4MFhIUjBhR2x6TGw5ZmNHVnlZMFJ2ZDI0b01TazdJQzh2SUdaeWIyMGdabWx5YzNRZ2FYUmxiU3dnY21WemRHOXlaU0IwY21WbFhHNWNkRngwY21WMGRYSnVJSEpsWm1WeVpXNWpaVlpoYkhWbE8xeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRkpsZEhWeWJuTWdiMkpxWldOMElISmxabVZ5Wlc1alpTQnZaaUJvWldGa0lIZHBkR2h2ZFhRZ2NtVnRiM1pwYm1jZ2FYUXVYRzVjZENBcUwxeHVYSFJvWldGa1QySnFaV04wS0NrZ2UxeHVYSFJjZEhKbGRIVnliaUIwYUdsekxtaGxZWEJNYVhOMFd6RmRMbTlpYW1WamREdGNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJTWlhSMWNtNXpJSFpoYkhWbElISmxabVZ5Wlc1alpTQnZaaUJvWldGa0lIZHBkR2h2ZFhRZ2NtVnRiM1pwYm1jZ2FYUXVYRzVjZENBcUwxeHVYSFJvWldGa1ZtRnNkV1VvS1NCN1hHNWNkRngwY21WMGRYSnVJSFJvYVhNdWFHVmhjRXhwYzNSYk1WMHVhR1ZoY0ZaaGJIVmxPMXh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUV4cGMzUWdZV05qWlhOemIzSmNibHgwSUNvdlhHNWNkR3hwYzNRb0tTQjdYRzVjZEZ4MGNtVjBkWEp1SUhSb2FYTXVhR1ZoY0V4cGMzUTdYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nUTNWeWNtVnVkQ0J6YVhwbElHRmpZMlZ6YzI5eVhHNWNkQ0FxTDF4dVhIUnphWHBsS0NrZ2UxeHVYSFJjZEhKbGRIVnliaUIwYUdsekxtTjFjbkpsYm5SVGFYcGxPMXh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ29nVW1WMGRYSnVjeUIzYUdWMFpYSWdiM0lnYm05MElIUm9aU0J2WW1wbFkzUWdhWE1nWVd4eVpXRmtlU0JwYmlCMGFHVWdhR1ZoY0Z4dVhIUXFMMXh1WEhSamIyNTBZV2x1Y3lodlltcGxZM1FwSUh0Y2JseDBYSFJtYjNJZ0tIWmhjaUJwSUQwZ01Uc2dhU0E4UFNCMGFHbHpMbU4xY25KbGJuUlRhWHBsT3lCcEt5c3BJSHRjYmx4MFhIUmNkR2xtSUNodlltcGxZM1FnUFQwOUlIUm9hWE11YUdWaGNFeHBjM1JiYVYwdWIySnFaV04wS1NCN1hHNWNkRngwWEhSY2RISmxkSFZ5YmlCMGNuVmxPMXh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHgwWEhSeVpYUjFjbTRnWm1Gc2MyVTdYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nVW1WMGRYSnVjeUIzYUdWMGFHVnlJRzl5SUc1dmRDQjBhR1VnYUdWaGNDQnBjeUJsYlhCMGVTNWNibHgwSUNvdlhHNWNkR2x6Ulcxd2RIa29LU0I3WEc1Y2RGeDBjbVYwZFhKdUlIUm9hWE11WTNWeWNtVnVkRk5wZW1VZ1BUMDlJREE3WEc1Y2RIMWNibHh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFaGxZWEE3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9pbmhlcml0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2dldCA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0XCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBIZWFwID0gcmVxdWlyZShcIi4vaGVhcFwiKTtcbi8qKlxuICogRVM2IEltcGxlbWVudGF0aW9uIG9mIGEgbWF4aW11bSBiaW5hcnkgaGVhcCBiYXNlZCBvbiA6XG4gKiBodHRwOi8vaW50ZXJhY3RpdmVweXRob24ub3JnL2NvdXJzZWxpYi9zdGF0aWMvcHl0aG9uZHMvVHJlZXMvaGVhcC5odG1sXG4gKlxuICogVGhlIGhlYWQgKG9yIHBvc2l0aW9uIDEgaW4gdGhlIGFycmF5KSBzaG91bGQgYmUgdGhlIG9iamVjdCB3aXRoIG1heGltYWwgaGVhcFxuICogdmFsdWUuXG4gKlxuICogQGF1dGhvcjogUmVuYXVkIFZpbmNlbnQgaHR0cHM6Ly9naXRodWIuY29tL3JlbmF1ZGZ2XG4gKiovXG5cbnZhciBNYXhIZWFwID0gKGZ1bmN0aW9uIChfSGVhcCkge1xuXHRmdW5jdGlvbiBNYXhIZWFwKCkge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYXhIZWFwKTtcblxuXHRcdF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKE1heEhlYXAucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuXHRcdC8vIEVtcHR5IG9iamVjdCB3aXRoIG1heGltYWwgdmFsdWUgdXNlZCBmb3Igc3dhcGluZyBvbiB0aGUgZmlyc3QgaW5zZXJ0aW9uc1xuXHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0b2JqZWN0OiB7fSxcblx0XHRcdGhlYXBWYWx1ZTogSW5maW5pdHlcblx0XHR9XTtcblx0fVxuXG5cdF9pbmhlcml0cyhNYXhIZWFwLCBfSGVhcCk7XG5cblx0X2NyZWF0ZUNsYXNzKE1heEhlYXAsIHtcblx0XHRfX3BlcmNVcDoge1xuXG5cdFx0XHQvKipcbiAgICAqIE1ldGhvZCB1c2VkIHRvIG1haW50YWluIHRoZSBtYXggaGVhcCBwcm9wZXJ0eSBmcm9tIGEgY2VydGFpbiBpbmRleC4gSXQgaXNcbiAgICAqIHVzZWQgbG9jYWxseSBmcm9tIHRoZSBlbmQgb2YgdGhlIGhlYXAgbGlzdCB1cG9uIGluc2VydGlvbiwgdXBkYXRlIGFuZFxuICAgICogcmVtb3ZhbC4gSXQgcGVyY29sYXRlcyBtYXggdmFsdWVzIHVwIHRoZSBiaW5hcnkgdHJlZS5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gX19wZXJjVXAoaSkge1xuXHRcdFx0XHR2YXIgY2VpbGVkSW5kZXgsIHRtcDtcblxuXHRcdFx0XHR3aGlsZSAoTWF0aC5mbG9vcihpIC8gMikgPiAwKSB7XG5cdFx0XHRcdFx0Y2VpbGVkSW5kZXggPSBNYXRoLmNlaWwoaSAvIDIpO1xuXHRcdFx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgZ3JlYXRlciB0aGFuIHRoZSBvbmUgYXQgY2VpbGVkIGluZGV4XG5cdFx0XHRcdFx0aWYgKHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID4gdGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF0uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XTtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdID0gdGhpcy5oZWFwTGlzdFtpXTtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbaV0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aSA9IGNlaWxlZEluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRfX3BlcmNEb3duOiB7XG5cblx0XHRcdC8qKlxuICAgICogTWV0aG9kIHVzZWQgdG8gbWFpbnRhaW4gdGhlIG1pbiBoZWFwIHByb3BlcnR5IGZyb20gYSBjZXJ0YWluIGluZGV4LiBJdCBpc1xuICAgICogdXNlZCBsb2NhbGx5IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBkZWxldGlvbi4gSXRlbXMgYXJlIFxuICAgICogc3dhcGVkIGRvd24gdGhlIHRyZWUgaWYgdGhleSBoYXZlIGEgc21hbGxlciByZWZlcmVuY2UgdmFsdWUuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY0Rvd24oaSkge1xuXHRcdFx0XHR2YXIgcmVmUG9zLCB0bXA7XG5cblx0XHRcdFx0d2hpbGUgKGkgKiAyIDw9IHRoaXMuY3VycmVudFNpemUpIHtcblx0XHRcdFx0XHRyZWZQb3MgPSB0aGlzLl9fY2hpbGRQb3NpdGlvbihpKTtcblx0XHRcdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIHNtYWxsZXIgdGhhbiB0aGUgcmVmZXJlbmNlIGRvd24gdGhlIHRyZWVcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPCB0aGlzLmhlYXBMaXN0W3JlZlBvc10uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRoaXMuaGVhcExpc3RbcmVmUG9zXTtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbcmVmUG9zXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpID0gcmVmUG9zO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kcyB0aGUgaXRlbSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYnJpbmdzIGl0IHVwIHRoZSB0cmVlIGJ5XG4gICAgKiBoYXZpbmcgYW4gaW5maW5pdHkgdmFsdWUuIFRoZSB0cmVlIGlzIHRoZSBzb3J0ZWQgYW5kIHRoZSBoZWFkIGlzIHJlbW92ZWQuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpdGVtKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHRcdFx0XHRcdGlmIChpdGVtID09PSB0aGlzLmhlYXBMaXN0W2ldLm9iamVjdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPSBJbmZpbml0eTtcblx0XHRcdFx0XHRcdHRoaXMuX19wZXJjVXAodGhpcy5jdXJyZW50U2l6ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLmRlbGV0ZUhlYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuaGVhZFZhbHVlKCk7XG5cdFx0XHRcdH1yZXR1cm4gSW5maW5pdHk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRidWlsZEhlYXA6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBCdWlsZCBoZWFwIGZyb20gYW4gb2JqZWN0IGxpc3QgYW5kIHN0cnVjdHVyZSBpdCB3aXRoIGEgbWF4aW1hbCBzd2FwIFxuICAgICogcmVmZXJlbmNlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJ1aWxkSGVhcChsaXN0KSB7XG5cdFx0XHRcdHRoaXMuY3VycmVudFNpemUgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRcdFx0b2JqZWN0OiB7fSxcblx0XHRcdFx0XHRoZWFwVmFsdWU6IEluZmluaXR5XG5cdFx0XHRcdH1dLmNvbmNhdChsaXN0KTtcblxuXHRcdFx0XHR2YXIgaSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoaSA+IDApIHtcblx0XHRcdFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHRcdFx0XHRcdGktLTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZW1wdHk6IHtcblxuXHRcdFx0LyoqXG4gICAqIENsZWFyIHRoZSBsaXN0IHdpdGggYSBtYXhpbWFsIGhlYXBWYWx1ZSBzd2FwIHJlZmVyZW5jZVxuICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGVtcHR5KCkge1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0XHRcdFx0XHRvYmplY3Q6IHt9LFxuXHRcdFx0XHRcdGhlYXBWYWx1ZTogSW5maW5pdHlcblx0XHRcdFx0fV07XG5cdFx0XHRcdHRoaXMuY3VycmVudFNpemUgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIE1heEhlYXA7XG59KShIZWFwKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXhIZWFwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OW9aV0Z3TDIxaGVDMW9aV0Z3TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096dEJRVUZCTEVsQlFVa3NTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdPenM3T3pzN096czdTVUZWZEVJc1QwRkJUenRCUVVWRUxGVkJSazRzVDBGQlR5eEhRVVZGTzNkQ1FVWlVMRTlCUVU4N08wRkJSMWdzYlVOQlNFa3NUMEZCVHl3MlEwRkhTRHM3UVVGRlZDeE5RVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRU5CUVVNN1FVRkRhRUlzVjBGQlZTeEZRVUZGTzBGQlExb3NZMEZCWVN4UlFVRlJPMGRCUTNKQ0xFTkJRVU1zUTBGQlF6dEZRVU5JT3p0WFFWUkxMRTlCUVU4N08yTkJRVkFzVDBGQlR6dEJRV2RDV2l4VlFVRlJPenM3T3pzN096dFZRVUZCTEd0Q1FVRkRMRU5CUVVNc1JVRkJSVHRCUVVOWUxGRkJRVWtzVjBGQlZ5eEZRVUZGTEVkQlFVY3NRMEZCUXpzN1FVRkZja0lzVjBGQlR5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZETjBJc1owSkJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGYUVNc1UwRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1IwRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVOMlJTeFRRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4VlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE9VTXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEhRVUZITEVOQlFVTTdUVUZEZGtJN08wRkJSVVFzVFVGQlF5eEhRVUZITEZkQlFWY3NRMEZCUXp0TFFVTm9RanRKUVVORU96dEJRVTlCTEZsQlFWVTdPenM3T3pzN08xVkJRVUVzYjBKQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJJc1VVRkJTU3hOUVVGTkxFVkJRVVVzUjBGQlJ5eERRVUZET3p0QlFVVm9RaXhYUVVGUExFRkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU3l4SlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRk8wRkJRMjVETEZkQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVnNReXhUUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRMnBGTEZOQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzWkNMRlZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU42UXl4VlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVkQlFVY3NRMEZCUXp0TlFVTTFRanM3UVVGRlJDeE5RVUZETEVkQlFVY3NUVUZCVFN4RFFVRkRPMHRCUTFnN1NVRkRSRHM3UVVGTlFTeFJRVUZOT3pzN096czdPMVZCUVVFc1owSkJRVU1zU1VGQlNTeEZRVUZGTzBGQlExb3NVMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRE0wTXNVMEZCU1N4SlFVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRja01zVlVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhUUVVGVExFZEJRVWNzVVVGQlVTeERRVUZETzBGQlEzUkRMRlZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMEZCUTJoRExGVkJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0TlFVTnNRanRMUVVORU96dEJRVVZFTEZGQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRMnBDTEZsQlFVOHNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wdEJRVUVzUVVGRmVrSXNUMEZCVHl4UlFVRlJMRU5CUVVNN1NVRkRhRUk3TzBGQlRVUXNWMEZCVXpzN096czdPenRWUVVGQkxHMUNRVUZETEVsQlFVa3NSVUZCUlR0QlFVTm1MRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTXZRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTTdRVUZEYUVJc1lVRkJWU3hGUVVGRk8wRkJRMW9zWjBKQlFXRXNVVUZCVVR0TFFVTnlRaXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVWb1FpeFJRVUZKTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRM0JDTEZkQlFVOHNRMEZCUXl4SFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVObUxGTkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRha0lzVFVGQlF5eEZRVUZGTEVOQlFVTTdTMEZEU2p0SlFVTkVPenRCUVV0R0xFOUJRVXM3T3pzN096dFZRVUZCTEdsQ1FVRkhPMEZCUTFBc1VVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETzBGQlEyaENMR0ZCUVZVc1JVRkJSVHRCUVVOYUxHZENRVUZoTEZGQlFWRTdTMEZEY2tJc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRja0k3T3pzN1VVRnVSMHNzVDBGQlR6dEhRVUZUTEVsQlFVazdPMEZCZFVjelFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReUlzSW1acGJHVWlPaUpsY3pZdmRYUnBiSE12YUdWaGNDOXRZWGd0YUdWaGNDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQklaV0Z3SUQwZ2NtVnhkV2x5WlNnbkxpOW9aV0Z3SnlrN1hHNHZLaXBjYmlBcUlFVlROaUJKYlhCc1pXMWxiblJoZEdsdmJpQnZaaUJoSUcxaGVHbHRkVzBnWW1sdVlYSjVJR2hsWVhBZ1ltRnpaV1FnYjI0Z09seHVJQ29nYUhSMGNEb3ZMMmx1ZEdWeVlXTjBhWFpsY0hsMGFHOXVMbTl5Wnk5amIzVnljMlZzYVdJdmMzUmhkR2xqTDNCNWRHaHZibVJ6TDFSeVpXVnpMMmhsWVhBdWFIUnRiRnh1SUNwY2JpQXFJRlJvWlNCb1pXRmtJQ2h2Y2lCd2IzTnBkR2x2YmlBeElHbHVJSFJvWlNCaGNuSmhlU2tnYzJodmRXeGtJR0psSUhSb1pTQnZZbXBsWTNRZ2QybDBhQ0J0WVhocGJXRnNJR2hsWVhCY2JpQXFJSFpoYkhWbExseHVJQ3BjYmlBcUlFQmhkWFJvYjNJNklGSmxibUYxWkNCV2FXNWpaVzUwSUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eVpXNWhkV1JtZGx4dUlDb3FMMXh1SUdOc1lYTnpJRTFoZUVobFlYQWdaWGgwWlc1a2N5QklaV0Z3SUh0Y2JseHVJRngwWTI5dWMzUnlkV04wYjNJb0tTQjdYRzRnWEhSY2RITjFjR1Z5S0NrN1hHNWNkRngwTHk4Z1JXMXdkSGtnYjJKcVpXTjBJSGRwZEdnZ2JXRjRhVzFoYkNCMllXeDFaU0IxYzJWa0lHWnZjaUJ6ZDJGd2FXNW5JRzl1SUhSb1pTQm1hWEp6ZENCcGJuTmxjblJwYjI1elhHNWNkRngwZEdocGN5NW9aV0Z3VEdsemRDQTlJRnQ3WEc1Y2RGeDBYSFFuYjJKcVpXTjBKem9nZTMwc1hHNWNkRngwWEhRbmFHVmhjRlpoYkhWbEp6b2dTVzVtYVc1cGRIbGNibHgwWEhSOVhUdGNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJOWlhSb2IyUWdkWE5sWkNCMGJ5QnRZV2x1ZEdGcGJpQjBhR1VnYldGNElHaGxZWEFnY0hKdmNHVnlkSGtnWm5KdmJTQmhJR05sY25SaGFXNGdhVzVrWlhndUlFbDBJR2x6WEc1Y2RDQXFJSFZ6WldRZ2JHOWpZV3hzZVNCbWNtOXRJSFJvWlNCbGJtUWdiMllnZEdobElHaGxZWEFnYkdsemRDQjFjRzl1SUdsdWMyVnlkR2x2Yml3Z2RYQmtZWFJsSUdGdVpGeHVYSFFnS2lCeVpXMXZkbUZzTGlCSmRDQndaWEpqYjJ4aGRHVnpJRzFoZUNCMllXeDFaWE1nZFhBZ2RHaGxJR0pwYm1GeWVTQjBjbVZsTGx4dVhIUWdLaTljYmx4MElGOWZjR1Z5WTFWd0tHa3BJSHRjYmx4MElGeDBkbUZ5SUdObGFXeGxaRWx1WkdWNExDQjBiWEE3WEc1Y2JseDBJRngwZDJocGJHVWdLRTFoZEdndVpteHZiM0lvYVNBdklESXBJRDRnTUNrZ2UxeHVYSFFnWEhSY2RHTmxhV3hsWkVsdVpHVjRJRDBnVFdGMGFDNWpaV2xzS0drZ0x5QXlLVHRjYmx4MFhIUmNkQzh2SUVseklIUm9aU0JwZEdWdElHRjBJR2tnWjNKbFlYUmxjaUIwYUdGdUlIUm9aU0J2Ym1VZ1lYUWdZMlZwYkdWa0lHbHVaR1Y0WEc1Y2RGeDBYSFJwWmlBb2RHaHBjeTVvWldGd1RHbHpkRnRwWFM1b1pXRndWbUZzZFdVZ1BpRENvSFJvYVhNdWFHVmhjRXhwYzNSYlkyVnBiR1ZrU1c1a1pYaGRMbWhsWVhCV1lXeDFaU2tnZTF4dVhIUmNkRngwWEhSMGJYQWdQU0IwYUdsekxtaGxZWEJNYVhOMFcyTmxhV3hsWkVsdVpHVjRYVHRjYmx4MFhIUmNkRngwZEdocGN5NW9aV0Z3VEdsemRGdGpaV2xzWldSSmJtUmxlRjBnUFNCMGFHbHpMbWhsWVhCTWFYTjBXMmxkTzF4dVhIUmNkRngwWEhSMGFHbHpMbWhsWVhCTWFYTjBXMmxkSUQwZ2RHMXdPMXh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFJwSUQwZ1kyVnBiR1ZrU1c1a1pYZzdYRzVjZEZ4MGZWeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRTFsZEdodlpDQjFjMlZrSUhSdklHMWhhVzUwWVdsdUlIUm9aU0J0YVc0Z2FHVmhjQ0J3Y205d1pYSjBlU0JtY205dElHRWdZMlZ5ZEdGcGJpQnBibVJsZUM0Z1NYUWdhWE5jYmx4MElDb2dkWE5sWkNCc2IyTmhiR3g1SUdaeWIyMGdkR2hsSUhOMFlYSjBJRzltSUhSb1pTQm9aV0Z3SUd4cGMzUWdkWEJ2YmlCa1pXeGxkR2x2Ymk0Z1NYUmxiWE1nWVhKbElGeHVYSFFnS2lCemQyRndaV1FnWkc5M2JpQjBhR1VnZEhKbFpTQnBaaUIwYUdWNUlHaGhkbVVnWVNCemJXRnNiR1Z5SUhKbFptVnlaVzVqWlNCMllXeDFaUzVjYmx4MElDb3ZYRzVjZENCZlgzQmxjbU5FYjNkdUtHa3BJSHRjYmx4MElGeDBkbUZ5SUhKbFpsQnZjeXdnZEcxd08xeHVYRzVjZENCY2RIZG9hV3hsSUNnb2FTQXFJRElwSUR3OUlIUm9hWE11WTNWeWNtVnVkRk5wZW1VcElIdGNibHgwSUZ4MFhIUnlaV1pRYjNNZ1BTQjBhR2x6TGw5ZlkyaHBiR1JRYjNOcGRHbHZiaWhwS1R0Y2JseDBYSFJjZEM4dklFbHpJSFJvWlNCcGRHVnRJR0YwSUdrZ2MyMWhiR3hsY2lCMGFHRnVJSFJvWlNCeVpXWmxjbVZ1WTJVZ1pHOTNiaUIwYUdVZ2RISmxaVnh1WEhSY2RGeDBhV1lnS0hSb2FYTXVhR1ZoY0V4cGMzUmJhVjB1YUdWaGNGWmhiSFZsSUR3Z2RHaHBjeTVvWldGd1RHbHpkRnR5WldaUWIzTmRMbWhsWVhCV1lXeDFaU2tnZTF4dVhIUmNkRngwWEhSMGJYQWdQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRPMXh1WEhSY2RGeDBYSFIwYUdsekxtaGxZWEJNYVhOMFcybGRJRDBnZEdocGN5NW9aV0Z3VEdsemRGdHlaV1pRYjNOZE8xeHVYSFJjZEZ4MFhIUjBhR2x6TG1obFlYQk1hWE4wVzNKbFpsQnZjMTBnUFNCMGJYQTdYRzVjZEZ4MFhIUjlYRzVjYmx4MFhIUmNkR2tnUFNCeVpXWlFiM003WEc1Y2RGeDBmVnh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUVacGJtUnpJSFJvWlNCcGRHVnRJRzlpYW1WamRDQnlaV1psY21WdVkyVWdhVzRnZEdobElHaGxZWEFnYkdsemRDQmljbWx1WjNNZ2FYUWdkWEFnZEdobElIUnlaV1VnWW5sY2JseDBJQ29nYUdGMmFXNW5JR0Z1SUdsdVptbHVhWFI1SUhaaGJIVmxMaUJVYUdVZ2RISmxaU0JwY3lCMGFHVWdjMjl5ZEdWa0lHRnVaQ0IwYUdVZ2FHVmhaQ0JwY3lCeVpXMXZkbVZrTGx4dVhIUWdLaTljYmx4MElISmxiVzkyWlNocGRHVnRLU0I3WEc1Y2RDQmNkR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHc5SUhSb2FYTXVZM1Z5Y21WdWRGTnBlbVU3SUdrckt5a2dlMXh1WEhRZ1hIUmNkR2xtSUNocGRHVnRJRDA5UFNCMGFHbHpMbWhsWVhCTWFYTjBXMmxkTG05aWFtVmpkQ2tnZTF4dVhIUWdYSFJjZEZ4MGRHaHBjeTVvWldGd1RHbHpkRnRwWFM1b1pXRndWbUZzZFdVZ1BTQkpibVpwYm1sMGVUdGNibHgwSUZ4MFhIUmNkSFJvYVhNdVgxOXdaWEpqVlhBb2RHaHBjeTVqZFhKeVpXNTBVMmw2WlNrN1hHNWNkQ0JjZEZ4MFhIUjBhR2x6TG1SbGJHVjBaVWhsWVdRb0tUdGNibHgwSUZ4MFhIUjlYRzVjZENCY2RIMWNibHh1WEhRZ1hIUnBaaWdoZEdocGN5NXBjMFZ0Y0hSNUtDa3BJRnh1WEhRZ1hIUmNkSEpsZEhWeWJpQjBhR2x6TG1obFlXUldZV3gxWlNncE8xeHVYRzVjZENCY2RISmxkSFZ5YmlCSmJtWnBibWwwZVR0Y2JseDBJSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dRblZwYkdRZ2FHVmhjQ0JtY205dElHRnVJRzlpYW1WamRDQnNhWE4wSUdGdVpDQnpkSEoxWTNSMWNtVWdhWFFnZDJsMGFDQmhJRzFoZUdsdFlXd2djM2RoY0NCY2JseDBJQ29nY21WbVpYSmxibU5sWEc1Y2RDQXFMMXh1WEhRZ1luVnBiR1JJWldGd0tHeHBjM1FwSUh0Y2JseDBJRngwZEdocGN5NWpkWEp5Wlc1MFUybDZaU0E5SUd4cGMzUXViR1Z1WjNSb08xeHVYSFFnWEhSMGFHbHpMbWhsWVhCTWFYTjBJRDBnVzN0Y2JseDBJRngwWEhRbmIySnFaV04wSnpvZ2UzMHNYRzVjZENCY2RGeDBKMmhsWVhCV1lXeDFaU2M2SUVsdVptbHVhWFI1WEc1Y2RDQmNkSDFkTG1OdmJtTmhkQ2hzYVhOMEtUdGNibHgwSUZ4MFhHNWNkQ0JjZEhaaGNpQnBJRDBnYkdsemRDNXNaVzVuZEdnN1hHNWNkQ0JjZEhkb2FXeGxJQ2hwd3FBZ1BpRENvREFwSUh0Y2JseDBJRngwWEhSMGFHbHpMbDlmY0dWeVkxVndLR2twTzF4dVhIUWdYSFJjZEdrdExUdGNibHgwSUZ4MGZWeHVYSFFnZlZ4dVhHNWNkQzhxS2x4dVhIUXFJRU5zWldGeUlIUm9aU0JzYVhOMElIZHBkR2dnWVNCdFlYaHBiV0ZzSUdobFlYQldZV3gxWlNCemQyRndJSEpsWm1WeVpXNWpaVnh1WEhRcUwxeHVYSFJsYlhCMGVTZ3BJSHRjYmx4MFhIUjBhR2x6TG1obFlYQk1hWE4wSUQwZ1czdGNibHgwWEhSY2RDZHZZbXBsWTNRbk9pQjdmU3hjYmx4MFhIUmNkQ2RvWldGd1ZtRnNkV1VuT2lCSmJtWnBibWwwZVNCY2JseDBYSFI5WFR0Y2JseDBYSFIwYUdsekxtTjFjbkpsYm5SVGFYcGxJRDBnTUR0Y2JseDBmVnh1WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUV0Y0U0dWaGNEc2lYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIEhlYXAgPSByZXF1aXJlKFwiLi9oZWFwXCIpO1xuLyoqXG4gKiBFUzYgSW1wbGVtZW50YXRpb24gb2YgYSBtaW5pbXVtIGJpbmFyeSBoZWFwIGJhc2VkIG9uIDpcbiAqIGh0dHA6Ly9pbnRlcmFjdGl2ZXB5dGhvbi5vcmcvY291cnNlbGliL3N0YXRpYy9weXRob25kcy9UcmVlcy9oZWFwLmh0bWxcbiAqXG4gKiBUaGUgaGVhZCAob3IgcG9zaXRpb24gMSBpbiB0aGUgYXJyYXkpIHNob3VsZCBiZSB0aGUgb2JqZWN0IHdpdGggbWluaW1hbCBoZWFwXG4gKiB2YWx1ZS5cbiAqXG4gKiBAYXV0aG9yOiBSZW5hdWQgVmluY2VudCBodHRwczovL2dpdGh1Yi5jb20vcmVuYXVkZnZcbiAqKi9cblxudmFyIE1pbkhlYXAgPSAoZnVuY3Rpb24gKF9IZWFwKSB7XG5cdGZ1bmN0aW9uIE1pbkhlYXAoKSB7XG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pbkhlYXApO1xuXG5cdFx0X2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoTWluSGVhcC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcyk7XG5cdFx0Ly8gRW1wdHkgb2JqZWN0IHdpdGggbWluaW1hbCB2YWx1ZSB1c2VkIGZvciBzd2FwaW5nIG9uIHRoZSBmaXJzdCBpbnNlcnRpb25zXG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRvYmplY3Q6IHt9LFxuXHRcdFx0aGVhcFZhbHVlOiAwXG5cdFx0fV07XG5cdH1cblxuXHRfaW5oZXJpdHMoTWluSGVhcCwgX0hlYXApO1xuXG5cdF9jcmVhdGVDbGFzcyhNaW5IZWFwLCB7XG5cdFx0X19wZXJjVXA6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWluIGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG4gICAgKiB1c2VkIGxvY2FsbHkgZnJvbSB0aGUgZW5kIG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBpbnNlcnRpb24sIHVwZGF0ZSBhbmRcbiAgICAqIHJlbW92YWwuIEl0IHBlcmNvbGF0ZXMgbWluIHZhbHVlcyB1cCB0aGUgYmluYXJ5IHRyZWUuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY1VwKGkpIHtcblx0XHRcdFx0dmFyIGNlaWxlZEluZGV4LCB0bXA7XG5cblx0XHRcdFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHRcdFx0XHRcdGNlaWxlZEluZGV4ID0gTWF0aC5jZWlsKGkgLyAyKTtcblx0XHRcdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIHNtYWxsZXIgdGhhbiB0aGUgb25lIGF0IGNlaWxlZCBpbmRleFxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZSA8IHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHRcdFx0dG1wID0gdGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF07XG5cdFx0XHRcdFx0XHR0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XSA9IHRoaXMuaGVhcExpc3RbaV07XG5cdFx0XHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGkgPSBjZWlsZWRJbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0X19wZXJjRG93bjoge1xuXG5cdFx0XHQvKipcbiAgICAqIE1ldGhvZCB1c2VkIHRvIG1haW50YWluIHRoZSBtaW4gaGVhcCBwcm9wZXJ0eSBmcm9tIGEgY2VydGFpbiBpbmRleC4gSXQgaXNcbiAgICAqIHVzZWQgbG9jYWxseSBmcm9tIHRoZSBzdGFydCBvZiB0aGUgaGVhcCBsaXN0IHVwb24gZGVsZXRpb24uIEl0ZW1zIGFyZSBcbiAgICAqIHN3YXBlZCBkb3duIHRoZSB0cmVlIGlmIHRoZXkgaGF2ZSBhIGJpZ2dlciByZWZlcmVuY2UgdmFsdWUuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY0Rvd24oaSkge1xuXHRcdFx0XHR2YXIgcmVmUG9zLCB0bXA7XG5cblx0XHRcdFx0d2hpbGUgKGkgKiAyIDw9IHRoaXMuY3VycmVudFNpemUpIHtcblx0XHRcdFx0XHRyZWZQb3MgPSB0aGlzLl9fY2hpbGRQb3NpdGlvbihpKTtcblx0XHRcdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIGdyZWF0ZXIgdGhhbiB0aGUgcmVmZXJlbmNlIGRvd24gdGhlIHRyZWVcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPiB0aGlzLmhlYXBMaXN0W3JlZlBvc10uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRoaXMuaGVhcExpc3RbcmVmUG9zXTtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbcmVmUG9zXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpID0gcmVmUG9zO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kcyB0aGUgaXRlbSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYnJpbmdzIGl0IHVwIHRoZSB0cmVlIGJ5XG4gICAgKiBoYXZpbmcgYSAtaW5maW5pdHkgdmFsdWUuIFRoZSB0cmVlIGlzIHRoZSBzb3J0ZWQgYW5kIHRoZSBoZWFkIGlzIHJlbW92ZWQuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpdGVtKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHRcdFx0XHRcdGlmIChpdGVtID09PSB0aGlzLmhlYXBMaXN0W2ldLm9iamVjdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPSAwO1xuXHRcdFx0XHRcdFx0dGhpcy5fX3BlcmNVcCh0aGlzLmN1cnJlbnRTaXplKTtcblx0XHRcdFx0XHRcdHRoaXMuZGVsZXRlSGVhZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdGhpcy5pc0VtcHR5KCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFkVmFsdWUoKTtcblx0XHRcdFx0fXJldHVybiBJbmZpbml0eTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJ1aWxkSGVhcDoge1xuXG5cdFx0XHQvKipcbiAgICAqIEJ1aWxkIGhlYXAgZnJvbSBhbiBvYmplY3QgbGlzdCBhbmQgc3RydWN0dXJlIGl0IHdpdGggYSBtaW5pbWFsIHN3YXAgXG4gICAgKiByZWZlcmVuY2VcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYnVpbGRIZWFwKGxpc3QpIHtcblxuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0XHRcdG9iamVjdDoge30sXG5cdFx0XHRcdFx0aGVhcFZhbHVlOiAwXG5cdFx0XHRcdH1dLmNvbmNhdChsaXN0KTtcblxuXHRcdFx0XHR2YXIgaSA9IGxpc3QubGVuZ3RoIC0gMTtcblx0XHRcdFx0d2hpbGUgKGkgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fX3BlcmNVcChpKTtcblx0XHRcdFx0XHRpLS07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGVtcHR5OiB7XG5cblx0XHRcdC8qKlxuICAgKiBDbGVhciB0aGUgbGlzdCB3aXRoIGEgbWluaW1hbCBoZWFwVmFsdWUgc3dhcCByZWZlcmVuY2VcbiAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBlbXB0eSgpIHtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRcdFx0b2JqZWN0OiB7fSxcblx0XHRcdFx0XHRoZWFwVmFsdWU6IDBcblx0XHRcdFx0fV07XG5cdFx0XHRcdHRoaXMuY3VycmVudFNpemUgPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIE1pbkhlYXA7XG59KShIZWFwKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNaW5IZWFwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OW9aV0Z3TDIxcGJpMW9aV0Z3TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096dEJRVUZCTEVsQlFVa3NTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdPenM3T3pzN096czdTVUZWZEVJc1QwRkJUenRCUVVWRUxGVkJSazRzVDBGQlR5eEhRVVZGTzNkQ1FVWlVMRTlCUVU4N08wRkJSMWdzYlVOQlNFa3NUMEZCVHl3MlEwRkhTRHM3UVVGRlZDeE5RVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRU5CUVVNN1FVRkRhRUlzVjBGQlZTeEZRVUZGTzBGQlExb3NZMEZCWVN4RFFVRkRPMGRCUTJRc1EwRkJReXhEUVVGRE8wVkJRMGc3TzFkQlZFc3NUMEZCVHpzN1kwRkJVQ3hQUVVGUE8wRkJaMEphTEZWQlFWRTdPenM3T3pzN08xVkJRVUVzYTBKQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTFnc1VVRkJTU3hYUVVGWExFVkJRVVVzUjBGQlJ5eERRVUZET3p0QlFVVnlRaXhYUVVGUExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU0zUWl4blFrRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZvUXl4VFFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4SFFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNVMEZCVXl4RlFVRkZPMEZCUTNaRkxGTkJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJRMnBETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1YwRkJWeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNNVF5eFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFZEJRVWNzUTBGQlF6dE5RVU4yUWpzN1FVRkZSQ3hOUVVGRExFZEJRVWNzVjBGQlZ5eERRVUZETzB0QlEyaENPMGxCUTBRN08wRkJUMEVzV1VGQlZUczdPenM3T3pzN1ZVRkJRU3h2UWtGQlF5eERRVUZETEVWQlFVVTdRVUZEWWl4UlFVRkpMRTFCUVUwc1JVRkJSU3hIUVVGSExFTkJRVU03TzBGQlJXaENMRmRCUVU4c1FVRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZMTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVN1FVRkRia01zVjBGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJXeERMRk5CUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VFFVRlRMRVZCUVVVN1FVRkRha1VzVTBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRrSXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRM3BETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUjBGQlJ5eERRVUZETzAxQlF6VkNPenRCUVVWRUxFMUJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTTdTMEZEV0R0SlFVTkVPenRCUVUxQkxGRkJRVTA3T3pzN096czdWVUZCUVN4blFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRFdpeFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVNelF5eFRRVUZKTEVsQlFVa3NTMEZCU3l4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnlReXhWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGREwwSXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdRVUZEYUVNc1ZVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzAxQlEyeENPMHRCUTBRN08wRkJSVVFzVVVGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRha0lzV1VGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1MwRkJRU3hCUVVWNlFpeFBRVUZQTEZGQlFWRXNRMEZCUXp0SlFVTm9RanM3UVVGTlJDeFhRVUZUT3pzN096czdPMVZCUVVFc2JVSkJRVU1zU1VGQlNTeEZRVUZGT3p0QlFVVm1MRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTXZRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTTdRVUZEYUVJc1lVRkJWU3hGUVVGRk8wRkJRMW9zWjBKQlFXRXNRMEZCUXp0TFFVTmtMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdPMEZCUldoQ0xGRkJRVWtzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRM2hDTEZkQlFVOHNRMEZCUXl4SFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVObUxGTkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRha0lzVFVGQlF5eEZRVUZGTEVOQlFVTTdTMEZEU2p0SlFVTkVPenRCUVV0R0xFOUJRVXM3T3pzN096dFZRVUZCTEdsQ1FVRkhPMEZCUTFBc1VVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETzBGQlEyaENMR0ZCUVZVc1JVRkJSVHRCUVVOYUxHZENRVUZoTEVOQlFVTTdTMEZEWkN4RFFVRkRMRU5CUVVNN1FVRkRTQ3hSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTnlRanM3T3p0UlFYQkhTeXhQUVVGUE8wZEJRVk1zU1VGQlNUczdRVUYzUnpOQ0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRJaXdpWm1sc1pTSTZJbVZ6Tmk5MWRHbHNjeTlvWldGd0wyMXBiaTFvWldGd0xtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlFaGxZWEFnUFNCeVpYRjFhWEpsS0NjdUwyaGxZWEFuS1R0Y2JpOHFLbHh1SUNvZ1JWTTJJRWx0Y0d4bGJXVnVkR0YwYVc5dUlHOW1JR0VnYldsdWFXMTFiU0JpYVc1aGNua2dhR1ZoY0NCaVlYTmxaQ0J2YmlBNlhHNGdLaUJvZEhSd09pOHZhVzUwWlhKaFkzUnBkbVZ3ZVhSb2IyNHViM0puTDJOdmRYSnpaV3hwWWk5emRHRjBhV012Y0hsMGFHOXVaSE12VkhKbFpYTXZhR1ZoY0M1b2RHMXNYRzRnS2x4dUlDb2dWR2hsSUdobFlXUWdLRzl5SUhCdmMybDBhVzl1SURFZ2FXNGdkR2hsSUdGeWNtRjVLU0J6YUc5MWJHUWdZbVVnZEdobElHOWlhbVZqZENCM2FYUm9JRzFwYm1sdFlXd2dhR1ZoY0Z4dUlDb2dkbUZzZFdVdVhHNGdLbHh1SUNvZ1FHRjFkR2h2Y2pvZ1VtVnVZWFZrSUZacGJtTmxiblFnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNKbGJtRjFaR1oyWEc0Z0tpb3ZYRzRnWTJ4aGMzTWdUV2x1U0dWaGNDQmxlSFJsYm1SeklFaGxZWEFnZTF4dVhHNGdYSFJqYjI1emRISjFZM1J2Y2lncElIdGNiaUJjZEZ4MGMzVndaWElvS1R0Y2JseDBYSFF2THlCRmJYQjBlU0J2WW1wbFkzUWdkMmwwYUNCdGFXNXBiV0ZzSUhaaGJIVmxJSFZ6WldRZ1ptOXlJSE4zWVhCcGJtY2diMjRnZEdobElHWnBjbk4wSUdsdWMyVnlkR2x2Ym5OY2JseDBYSFIwYUdsekxtaGxZWEJNYVhOMElEMGdXM3RjYmx4MFhIUmNkQ2R2WW1wbFkzUW5PaUI3ZlN4Y2JseDBYSFJjZENkb1pXRndWbUZzZFdVbk9pQXdYRzVjZEZ4MGZWMDdYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nVFdWMGFHOWtJSFZ6WldRZ2RHOGdiV0ZwYm5SaGFXNGdkR2hsSUcxcGJpQm9aV0Z3SUhCeWIzQmxjblI1SUdaeWIyMGdZU0JqWlhKMFlXbHVJR2x1WkdWNExpQkpkQ0JwYzF4dVhIUWdLaUIxYzJWa0lHeHZZMkZzYkhrZ1puSnZiU0IwYUdVZ1pXNWtJRzltSUhSb1pTQm9aV0Z3SUd4cGMzUWdkWEJ2YmlCcGJuTmxjblJwYjI0c0lIVndaR0YwWlNCaGJtUmNibHgwSUNvZ2NtVnRiM1poYkM0Z1NYUWdjR1Z5WTI5c1lYUmxjeUJ0YVc0Z2RtRnNkV1Z6SUhWd0lIUm9aU0JpYVc1aGNua2dkSEpsWlM1Y2JseDBJQ292WEc1Y2RDQmZYM0JsY21OVmNDaHBLU0I3WEc1Y2RDQmNkSFpoY2lCalpXbHNaV1JKYm1SbGVDd2dkRzF3TzF4dVhHNWNkQ0JjZEhkb2FXeGxJQ2hOWVhSb0xtWnNiMjl5S0drZ0x5QXlLU0ErSURBcElIdGNibHgwSUZ4MFhIUmpaV2xzWldSSmJtUmxlQ0E5SUUxaGRHZ3VZMlZwYkNocElDOGdNaWs3WEc1Y2RGeDBYSFF2THlCSmN5QjBhR1VnYVhSbGJTQmhkQ0JwSUhOdFlXeHNaWElnZEdoaGJpQjBhR1VnYjI1bElHRjBJR05sYVd4bFpDQnBibVJsZUZ4dVhIUmNkRngwYVdZZ0tIUm9hWE11YUdWaGNFeHBjM1JiYVYwdWFHVmhjRlpoYkhWbElEd2d3cUIwYUdsekxtaGxZWEJNYVhOMFcyTmxhV3hsWkVsdVpHVjRYUzVvWldGd1ZtRnNkV1VwSUh0Y2JseDBYSFJjZEZ4MGRHMXdJRDBnZEdocGN5NW9aV0Z3VEdsemRGdGpaV2xzWldSSmJtUmxlRjA3WEc1Y2RGeDBYSFJjZEhSb2FYTXVhR1ZoY0V4cGMzUmJZMlZwYkdWa1NXNWtaWGhkSUQwZ2RHaHBjeTVvWldGd1RHbHpkRnRwWFR0Y2JseDBYSFJjZEZ4MGRHaHBjeTVvWldGd1RHbHpkRnRwWFNBOUlIUnRjRHRjYmx4MFhIUmNkSDFjYmx4dVhIUmNkRngwYVNBOUlHTmxhV3hsWkVsdVpHVjRPMXh1WEhSY2RIMWNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJOWlhSb2IyUWdkWE5sWkNCMGJ5QnRZV2x1ZEdGcGJpQjBhR1VnYldsdUlHaGxZWEFnY0hKdmNHVnlkSGtnWm5KdmJTQmhJR05sY25SaGFXNGdhVzVrWlhndUlFbDBJR2x6WEc1Y2RDQXFJSFZ6WldRZ2JHOWpZV3hzZVNCbWNtOXRJSFJvWlNCemRHRnlkQ0J2WmlCMGFHVWdhR1ZoY0NCc2FYTjBJSFZ3YjI0Z1pHVnNaWFJwYjI0dUlFbDBaVzF6SUdGeVpTQmNibHgwSUNvZ2MzZGhjR1ZrSUdSdmQyNGdkR2hsSUhSeVpXVWdhV1lnZEdobGVTQm9ZWFpsSUdFZ1ltbG5aMlZ5SUhKbFptVnlaVzVqWlNCMllXeDFaUzVjYmx4MElDb3ZYRzVjZENCZlgzQmxjbU5FYjNkdUtHa3BJSHRjYmx4MElGeDBkbUZ5SUhKbFpsQnZjeXdnZEcxd08xeHVYRzVjZENCY2RIZG9hV3hsSUNnb2FTQXFJRElwSUR3OUlIUm9hWE11WTNWeWNtVnVkRk5wZW1VcElIdGNibHgwSUZ4MFhIUnlaV1pRYjNNZ1BTQjBhR2x6TGw5ZlkyaHBiR1JRYjNOcGRHbHZiaWhwS1R0Y2JseDBYSFJjZEM4dklFbHpJSFJvWlNCcGRHVnRJR0YwSUdrZ1ozSmxZWFJsY2lCMGFHRnVJSFJvWlNCeVpXWmxjbVZ1WTJVZ1pHOTNiaUIwYUdVZ2RISmxaVnh1WEhSY2RGeDBhV1lnS0hSb2FYTXVhR1ZoY0V4cGMzUmJhVjB1YUdWaGNGWmhiSFZsSUQ0Z2RHaHBjeTVvWldGd1RHbHpkRnR5WldaUWIzTmRMbWhsWVhCV1lXeDFaU2tnZTF4dVhIUmNkRngwWEhSMGJYQWdQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRPMXh1WEhSY2RGeDBYSFIwYUdsekxtaGxZWEJNYVhOMFcybGRJRDBnZEdocGN5NW9aV0Z3VEdsemRGdHlaV1pRYjNOZE8xeHVYSFJjZEZ4MFhIUjBhR2x6TG1obFlYQk1hWE4wVzNKbFpsQnZjMTBnUFNCMGJYQTdYRzVjZEZ4MFhIUjlYRzVjYmx4MFhIUmNkR2tnUFNCeVpXWlFiM003WEc1Y2RGeDBmVnh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUVacGJtUnpJSFJvWlNCcGRHVnRJRzlpYW1WamRDQnlaV1psY21WdVkyVWdhVzRnZEdobElHaGxZWEFnYkdsemRDQmljbWx1WjNNZ2FYUWdkWEFnZEdobElIUnlaV1VnWW5sY2JseDBJQ29nYUdGMmFXNW5JR0VnTFdsdVptbHVhWFI1SUhaaGJIVmxMaUJVYUdVZ2RISmxaU0JwY3lCMGFHVWdjMjl5ZEdWa0lHRnVaQ0IwYUdVZ2FHVmhaQ0JwY3lCeVpXMXZkbVZrTGx4dVhIUWdLaTljYmx4MElISmxiVzkyWlNocGRHVnRLU0I3WEc1Y2RDQmNkR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHc5SUhSb2FYTXVZM1Z5Y21WdWRGTnBlbVU3SUdrckt5a2dlMXh1WEhRZ1hIUmNkR2xtSUNocGRHVnRJRDA5UFNCMGFHbHpMbWhsWVhCTWFYTjBXMmxkTG05aWFtVmpkQ2tnZTF4dVhIUWdYSFJjZEZ4MGRHaHBjeTVvWldGd1RHbHpkRnRwWFM1b1pXRndWbUZzZFdVZ1BTQXdPMXh1WEhRZ1hIUmNkRngwZEdocGN5NWZYM0JsY21OVmNDaDBhR2x6TG1OMWNuSmxiblJUYVhwbEtUdGNibHgwSUZ4MFhIUmNkSFJvYVhNdVpHVnNaWFJsU0dWaFpDZ3BPeUJjYmx4MElGeDBYSFI5WEc1Y2RDQmNkSDFjYmx4dVhIUWdYSFJwWmlnaGRHaHBjeTVwYzBWdGNIUjVLQ2twSUZ4dVhIUWdYSFJjZEhKbGRIVnliaUIwYUdsekxtaGxZV1JXWVd4MVpTZ3BPMXh1WEc1Y2RDQmNkSEpsZEhWeWJpQkpibVpwYm1sMGVUdGNibHgwSUgxY2JseHVYSFF2S2lwY2JseDBJQ29nUW5WcGJHUWdhR1ZoY0NCbWNtOXRJR0Z1SUc5aWFtVmpkQ0JzYVhOMElHRnVaQ0J6ZEhKMVkzUjFjbVVnYVhRZ2QybDBhQ0JoSUcxcGJtbHRZV3dnYzNkaGNDQmNibHgwSUNvZ2NtVm1aWEpsYm1ObFhHNWNkQ0FxTDF4dVhIUWdZblZwYkdSSVpXRndLR3hwYzNRcElIdGNibHh1WEhRZ1hIUjBhR2x6TG1OMWNuSmxiblJUYVhwbElEMGdiR2x6ZEM1c1pXNW5kR2c3WEc1Y2RDQmNkSFJvYVhNdWFHVmhjRXhwYzNRZ1BTQmJlMXh1WEhRZ1hIUmNkQ2R2WW1wbFkzUW5PaUI3ZlN4Y2JseDBJRngwWEhRbmFHVmhjRlpoYkhWbEp6b2dNRnh1WEhRZ1hIUjlYUzVqYjI1allYUW9iR2x6ZENrN1hHNWNibHgwSUZ4MGRtRnlJR2tnUFNCc2FYTjBMbXhsYm1kMGFDQXRJREU3WEc1Y2RDQmNkSGRvYVd4bElDaHB3cUFnUGlEQ29EQXBJSHRjYmx4MElGeDBYSFIwYUdsekxsOWZjR1Z5WTFWd0tHa3BPMXh1WEhRZ1hIUmNkR2t0TFR0Y2JseDBJRngwZlZ4dVhIUWdmVnh1WEc1Y2RDOHFLbHh1WEhRcUlFTnNaV0Z5SUhSb1pTQnNhWE4wSUhkcGRHZ2dZU0J0YVc1cGJXRnNJR2hsWVhCV1lXeDFaU0J6ZDJGd0lISmxabVZ5Wlc1alpWeHVYSFFxTDF4dVhIUmxiWEIwZVNncElIdGNibHgwWEhSMGFHbHpMbWhsWVhCTWFYTjBJRDBnVzN0Y2JseDBYSFJjZENkdlltcGxZM1FuT2lCN2ZTeGNibHgwWEhSY2RDZG9aV0Z3Vm1Gc2RXVW5PaUF3WEc1Y2RGeDBmVjA3WEc1Y2RGeDBkR2hwY3k1amRYSnlaVzUwVTJsNlpTQTlJREE3WEc1Y2RIMWNibHh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFMXBia2hsWVhBN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBNaW5IZWFwID0gcmVxdWlyZShcIi4vaGVhcC9taW4taGVhcFwiKTtcbnZhciBNYXhIZWFwID0gcmVxdWlyZShcIi4vaGVhcC9tYXgtaGVhcFwiKTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBwcmlvcml0eSBxdWV1ZSB1c2VkIGJ5IHNjaGVkdWxlciBhbmQgdHJhbnNwb3J0c1xuICogQGF1dGhvciBOb3JiZXJ0IFNjaG5lbGwgPE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mcj5cbiAqXG4gKiBGaXJzdCByYXRoZXIgc3R1cGlkIGltcGxlbWVudGF0aW9uIHRvIGJlIG9wdGltaXplZC4uLlxuICovXG5cbnZhciBQcmlvcml0eVF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gUHJpb3JpdHlRdWV1ZSgpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJpb3JpdHlRdWV1ZSk7XG5cblx0XHR0aGlzLl9faGVhcCA9IG5ldyBNaW5IZWFwKCk7XG5cdFx0dGhpcy5fX3JldmVyc2UgPSBmYWxzZTtcblx0fVxuXG5cdF9jcmVhdGVDbGFzcyhQcmlvcml0eVF1ZXVlLCB7XG5cdFx0aW5zZXJ0OiB7XG5cblx0XHRcdC8qKlxuICAgICogSW5zZXJ0IGFuIG9iamVjdCB0byB0aGUgcXVldWVcbiAgICAqIChmb3IgdGhpcyBwcmltaXRpdmUgdmVyc2lvbjogcHJldmVudCBzb3J0aW5nIGZvciBlYWNoIGVsZW1lbnQgYnkgY2FsbGluZ1xuICAgICogd2l0aCBcImZhbHNlXCIgYXMgdGhpcmQgYXJndW1lbnQpXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluc2VydChvYmplY3QsIHRpbWUpIHtcblx0XHRcdFx0aWYgKHRpbWUgIT09IEluZmluaXR5ICYmIHRpbWUgIT0gLUluZmluaXR5KSB7XG5cdFx0XHRcdFx0Ly8gYWRkIG5ldyBvYmplY3Rcblx0XHRcdFx0XHR0aGlzLl9faGVhcC5pbnNlcnQodGltZSwgb2JqZWN0KTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX2hlYXAuaGVhZFZhbHVlKCk7IC8vIHJldHVybiB0aW1lIG9mIGZpcnN0IG9iamVjdFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlKG9iamVjdCk7IC8vICAqKioqIE1ha2Ugc3VyZSBpdHMgbm90IGFub3RoZXIgdGltZSB5b3UnZCB3YW50XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtb3ZlOiB7XG5cblx0XHRcdC8qKlxuICAgICogTW92ZSBhbiBvYmplY3QgdG8gYW5vdGhlciB0aW1lIGluIHRoZSBxdWV1ZVxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBtb3ZlKG9iamVjdCwgdGltZSkge1xuXHRcdFx0XHRpZiAodGltZSAhPT0gSW5maW5pdHkgJiYgdGltZSAhPSAtSW5maW5pdHkpIHtcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9faGVhcC5jb250YWlucyhvYmplY3QpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9faGVhcC51cGRhdGUob2JqZWN0LCB0aW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fX2hlYXAuaW5zZXJ0KHRpbWUsIG9iamVjdCk7IC8vIGFkZCBuZXcgb2JqZWN0XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlKG9iamVjdCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBSZW1vdmUgYW4gb2JqZWN0IGZyb20gdGhlIHF1ZXVlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShvYmplY3QpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLnJlbW92ZShvYmplY3QpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2xlYXI6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBDbGVhciBxdWV1ZVxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRcdFx0dGhpcy5fX2hlYXAuZW1wdHkoKTtcblx0XHRcdFx0cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhZDoge1xuXG5cdFx0XHQvKipcbiAgICAqIEdldCBmaXJzdCBvYmplY3QgaW4gcXVldWVcbiAgICAqL1xuXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCF0aGlzLl9faGVhcC5pc0VtcHR5KCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX2hlYXAuaGVhZE9iamVjdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0aW1lOiB7XG5cblx0XHRcdC8qKlxuICAgICogR2V0IHRpbWUgb2YgZmlyc3Qgb2JqZWN0IGluIHF1ZXVlXG4gICAgKi9cblxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5fX2hlYXAuaXNFbXB0eSgpKSByZXR1cm4gdGhpcy5fX2hlYXAuaGVhZFZhbHVlKCk7XG5cblx0XHRcdFx0cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmV2ZXJzZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9fcmV2ZXJzZTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuICAgICogU2V0dGVyIGZvciB0aGUgcmV2ZXJzZSBhdHRyaWJ1dGUuIFdoZW4gcmV2ZXJzZSBpcyB0cnVlLCB0aGUgaGVhcCBzaG91bGQgYmVcbiAgICAqIG1heCBhbmQgd2hlbiBmYWxzZSwgbWluLiBUaGUgbmV3IGhlYXAgdHJlZSBzaG91bGQgY29udGFpbiB0aGUgc2FtZSBpdGVtc1xuICAgICogYXMgYmVmb3JlIGJ1dCBvcmRlcmVkIGluIHRoZSByaWdodCB3YXkuXG4gICAgKi9cblx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdC8vRXhlY3V0ZSBvbmx5IGlmIHZhbHVlIGlzIGRpZmZlcmVudFxuXHRcdFx0XHRpZiAodmFsdWUgIT09IHRoaXMuX19yZXZlcnNlKSB7XG5cdFx0XHRcdFx0dmFyIGhlYXBMaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdFx0XHRcdGhlYXBMaXN0LnNoaWZ0KCk7IC8vIHJlbW92ZSBzd2FwIHZhbHVlIChmaXJzdCBlbGVtIGluIGFycmF5KVxuXG5cdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9faGVhcCA9IG5ldyBNYXhIZWFwKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX19oZWFwID0gbmV3IE1pbkhlYXAoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLl9faGVhcC5idWlsZEhlYXAoaGVhcExpc3QpO1xuXHRcdFx0XHRcdHRoaXMuX19yZXZlcnNlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHRvU3RyaW5nOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0XHRcdHZhciBsaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdFx0XHR2YXIgc3RyaW5nID0gXCJTaXplOiBcIiArIHRoaXMuX19oZWFwLnNpemUoKSArIFwiIFwiO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgb2JqID0gbGlzdFtpXTtcblx0XHRcdFx0XHRzdHJpbmcgKz0gb2JqLm9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgYXQgXCIgKyBvYmouaGVhcFZhbHVlICsgXCIgXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHN0cmluZztcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBQcmlvcml0eVF1ZXVlO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlMxb1pXRndMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096dEJRVUZCTEVsQlFVa3NUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUTNwRExFbEJRVWtzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZET3pzN096czdPenM3U1VGVGJrTXNZVUZCWVR0QlFVVlFMRlZCUms0c1lVRkJZU3hIUVVWS08zZENRVVpVTEdGQlFXRTdPMEZCUjJwQ0xFMUJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NTVUZCU1N4UFFVRlBMRVZCUVVVc1EwRkJRenRCUVVNMVFpeE5RVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJRenRGUVVOMlFqczdZMEZNU1N4aFFVRmhPMEZCV1d4Q0xGRkJRVTA3T3pzN096czdPMVZCUVVFc1owSkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NSVUZCUlR0QlFVTndRaXhSUVVGSkxFbEJRVWtzUzBGQlN5eFJRVUZSTEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRk96dEJRVVV6UXl4VFFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRha01zV1VGQlR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wdEJReTlDT3p0QlFVVkVMRmRCUVU4c1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTXpRanM3UVVGTFJDeE5RVUZKT3pzN096czdWVUZCUVN4alFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFVkJRVVU3UVVGRGJFSXNVVUZCU1N4SlFVRkpMRXRCUVVzc1VVRkJVU3hKUVVGSkxFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlRzN1FVRkZNME1zVTBGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJUdEJRVU5xUXl4VlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1RVRkRha01zVFVGQlRUdEJRVU5PTEZWQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0TlFVTnFRenM3UVVGRlJDeFpRVUZQTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU03UzBGREwwSTdPMEZCUlVRc1YwRkJUeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUXpOQ096dEJRVXRFTEZGQlFVMDdPenM3T3p0VlFVRkJMR2RDUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5rTEZkQlFVOHNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTVUZEYkVNN08wRkJTMFFzVDBGQlN6czdPenM3TzFWQlFVRXNhVUpCUVVjN1FVRkRVQ3hSUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMEZCUTNCQ0xGZEJRVThzVVVGQlVTeERRVUZETzBsQlEyaENPenRCUVV0SExFMUJRVWs3T3pzN096dFJRVUZCTEZsQlFVYzdRVUZEVml4UlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVWQlFVVXNSVUZCUlR0QlFVTXpRaXhaUVVGUExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1MwRkRhRU03TzBGQlJVUXNWMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRXanM3UVVGTFJ5eE5RVUZKT3pzN096czdVVUZCUVN4WlFVRkhPMEZCUTFZc1VVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RlFVRkZMRVZCUTNwQ0xFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenM3UVVGRmFFTXNWMEZCVHl4UlFVRlJMRU5CUVVNN1NVRkRhRUk3TzBGQlYwY3NVMEZCVHp0UlFWUkJMRmxCUVVjN1FVRkRZaXhYUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTTdTVUZEZEVJN096czdPenM3VVVGUFZTeFZRVUZETEV0QlFVc3NSVUZCUlRzN1FVRkZiRUlzVVVGQlNTeExRVUZMTEV0QlFVc3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVNM1FpeFRRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETzBGQlEyeERMR0ZCUVZFc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF6czdRVUZGYWtJc1UwRkJTU3hMUVVGTExFVkJRVVU3UVVGRFZpeFZRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRWxCUVVrc1QwRkJUeXhGUVVGRkxFTkJRVU03VFVGRE5VSXNUVUZCVFR0QlFVTk9MRlZCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzU1VGQlNTeFBRVUZQTEVWQlFVVXNRMEZCUXp0TlFVTTFRanM3UVVGRlJDeFRRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU5vUXl4VFFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF6dExRVU4yUWp0SlFVTkVPenRCUVVWRUxGVkJRVkU3VlVGQlFTeHZRa0ZCUnp0QlFVTldMRkZCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkRPVUlzVVVGQlNTeE5RVUZOTEVkQlFVY3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVkQlFVY3NSMEZCUnl4RFFVRkRPMEZCUTJwRUxGTkJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNKRExGTkJRVWtzUjBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOc1FpeFhRVUZOTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeEhRVUZITEUxQlFVMHNSMEZCUnl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExFZEJRVWNzUTBGQlF6dExRVU55UlR0QlFVTkVMRmRCUVU4c1RVRkJUU3hEUVVGRE8wbEJRMlE3T3pzN1VVRTVSMGtzWVVGQllUczdPMEZCYVVodVFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMR0ZCUVdFc1EwRkJReUlzSW1acGJHVWlPaUpsY3pZdmRYUnBiSE12Y0hKcGIzSnBkSGt0Y1hWbGRXVXRhR1ZoY0M1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCTmFXNUlaV0Z3SUQwZ2NtVnhkV2x5WlNnbkxpOW9aV0Z3TDIxcGJpMW9aV0Z3SnlrN1hHNTJZWElnVFdGNFNHVmhjQ0E5SUhKbGNYVnBjbVVvSnk0dmFHVmhjQzl0WVhndGFHVmhjQ2NwTzF4dUx5b2dkM0pwZEhSbGJpQnBiaUJGUTAxQmMyTnlhWEIwSURZZ0tpOWNiaThxS2x4dUlDb2dRR1pwYkdWdmRtVnlkbWxsZHlCWFFWWkZJR0YxWkdsdklIQnlhVzl5YVhSNUlIRjFaWFZsSUhWelpXUWdZbmtnYzJOb1pXUjFiR1Z5SUdGdVpDQjBjbUZ1YzNCdmNuUnpYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblFnVTJOb2JtVnNiQ0E4VG05eVltVnlkQzVUWTJodVpXeHNRR2x5WTJGdExtWnlQbHh1SUNwY2JpQXFJRVpwY25OMElISmhkR2hsY2lCemRIVndhV1FnYVcxd2JHVnRaVzUwWVhScGIyNGdkRzhnWW1VZ2IzQjBhVzFwZW1Wa0xpNHVYRzRnS2k5Y2JseHVZMnhoYzNNZ1VISnBiM0pwZEhsUmRXVjFaU0I3WEc1Y2JseDBZMjl1YzNSeWRXTjBiM0lvS1NCN1hHNWNkRngwZEdocGN5NWZYMmhsWVhBZ1BTQnVaWGNnVFdsdVNHVmhjQ2dwTzF4dVhIUmNkSFJvYVhNdVgxOXlaWFpsY25ObElEMGdabUZzYzJVN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dTVzV6WlhKMElHRnVJRzlpYW1WamRDQjBieUIwYUdVZ2NYVmxkV1ZjYmx4MElDb2dLR1p2Y2lCMGFHbHpJSEJ5YVcxcGRHbDJaU0IyWlhKemFXOXVPaUJ3Y21WMlpXNTBJSE52Y25ScGJtY2dabTl5SUdWaFkyZ2daV3hsYldWdWRDQmllU0JqWVd4c2FXNW5YRzVjZENBcUlIZHBkR2dnWENKbVlXeHpaVndpSUdGeklIUm9hWEprSUdGeVozVnRaVzUwS1Z4dVhIUWdLaTljYmx4MGFXNXpaWEowS0c5aWFtVmpkQ3dnZEdsdFpTa2dlMXh1WEhSY2RHbG1JQ2gwYVcxbElDRTlQU0JKYm1acGJtbDBlU0FtSmlCMGFXMWxJQ0U5SUMxSmJtWnBibWwwZVNrZ2UxeHVYSFJjZEZ4MEx5OGdZV1JrSUc1bGR5QnZZbXBsWTNSY2JseDBYSFJjZEhSb2FYTXVYMTlvWldGd0xtbHVjMlZ5ZENoMGFXMWxMQ0J2WW1wbFkzUXBPMXh1WEhSY2RGeDBjbVYwZFhKdUlIUm9hWE11WDE5b1pXRndMbWhsWVdSV1lXeDFaU2dwT3lBdkx5QnlaWFIxY200Z2RHbHRaU0J2WmlCbWFYSnpkQ0J2WW1wbFkzUmNibHgwWEhSOVhHNWNibHgwWEhSeVpYUjFjbTRnZEdocGN5NXlaVzF2ZG1Vb2IySnFaV04wS1RzZ0x5OGdJQ29xS2lvZ1RXRnJaU0J6ZFhKbElHbDBjeUJ1YjNRZ1lXNXZkR2hsY2lCMGFXMWxJSGx2ZFNka0lIZGhiblJjYmx4MGZWeHVYRzVjZEM4cUtseHVYSFFnS2lCTmIzWmxJR0Z1SUc5aWFtVmpkQ0IwYnlCaGJtOTBhR1Z5SUhScGJXVWdhVzRnZEdobElIRjFaWFZsWEc1Y2RDQXFMMXh1WEhSdGIzWmxLRzlpYW1WamRDd2dkR2x0WlNrZ2UxeHVYSFJjZEdsbUlDaDBhVzFsSUNFOVBTQkpibVpwYm1sMGVTQW1KaUIwYVcxbElDRTlJQzFKYm1acGJtbDBlU2tnZTF4dVhHNWNkRngwWEhScFppQW9kR2hwY3k1ZlgyaGxZWEF1WTI5dWRHRnBibk1vYjJKcVpXTjBLU2tnZTF4dVhIUmNkRngwWEhSMGFHbHpMbDlmYUdWaGNDNTFjR1JoZEdVb2IySnFaV04wTENCMGFXMWxLVHRjYmx4MFhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUmNkSFJvYVhNdVgxOW9aV0Z3TG1sdWMyVnlkQ2gwYVcxbExDQnZZbXBsWTNRcE95QXZMeUJoWkdRZ2JtVjNJRzlpYW1WamRGeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUnlaWFIxY200Z2RHaHBjeTVmWDJobFlYQXVhR1ZoWkZaaGJIVmxLQ2s3WEc1Y2RGeDBmVnh1WEc1Y2RGeDBjbVYwZFhKdUlIUm9hWE11Y21WdGIzWmxLRzlpYW1WamRDazdYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nVW1WdGIzWmxJR0Z1SUc5aWFtVmpkQ0JtY205dElIUm9aU0J4ZFdWMVpWeHVYSFFnS2k5Y2JseDBjbVZ0YjNabEtHOWlhbVZqZENrZ2UxeHVYSFJjZEhKbGRIVnliaUIwYUdsekxsOWZhR1ZoY0M1eVpXMXZkbVVvYjJKcVpXTjBLVHRjYmx4MGZWeHVYRzVjZEM4cUtseHVYSFFnS2lCRGJHVmhjaUJ4ZFdWMVpWeHVYSFFnS2k5Y2JseDBZMnhsWVhJb0tTQjdYRzVjZEZ4MGRHaHBjeTVmWDJobFlYQXVaVzF3ZEhrb0tUdGNibHgwWEhSeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc1Y2RIMWNibHh1WEhRdktpcGNibHgwSUNvZ1IyVjBJR1pwY25OMElHOWlhbVZqZENCcGJpQnhkV1YxWlZ4dVhIUWdLaTljYmx4MFoyVjBJR2hsWVdRb0tTQjdYRzVjZEZ4MGFXWWdLQ0YwYUdsekxsOWZhR1ZoY0M1cGMwVnRjSFI1S0NrcElIdGNibHgwWEhSY2RISmxkSFZ5YmlCMGFHbHpMbDlmYUdWaGNDNW9aV0ZrVDJKcVpXTjBLQ2s3WEc1Y2RGeDBmVnh1WEc1Y2RGeDBjbVYwZFhKdUlHNTFiR3c3WEc1Y2RIMWNibHh1WEhRdktpcGNibHgwSUNvZ1IyVjBJSFJwYldVZ2IyWWdabWx5YzNRZ2IySnFaV04wSUdsdUlIRjFaWFZsWEc1Y2RDQXFMMXh1WEhSblpYUWdkR2x0WlNncElIdGNibHgwWEhScFppQW9JWFJvYVhNdVgxOW9aV0Z3TG1selJXMXdkSGtvS1NsY2JseDBYSFJjZEhKbGRIVnliaUIwYUdsekxsOWZhR1ZoY0M1b1pXRmtWbUZzZFdVb0tUdGNibHh1WEhSY2RISmxkSFZ5YmlCSmJtWnBibWwwZVR0Y2JseDBmVnh1WEc1Y2RHZGxkQ0J5WlhabGNuTmxLQ2tnZTF4dVhIUmNkSEpsZEhWeWJpQjBhR2x6TGw5ZmNtVjJaWEp6WlR0Y2JseDBmVnh1WEc1Y2RDOHFLbHh1WEhRZ0tpQlRaWFIwWlhJZ1ptOXlJSFJvWlNCeVpYWmxjbk5sSUdGMGRISnBZblYwWlM0Z1YyaGxiaUJ5WlhabGNuTmxJR2x6SUhSeWRXVXNJSFJvWlNCb1pXRndJSE5vYjNWc1pDQmlaVnh1WEhRZ0tpQnRZWGdnWVc1a0lIZG9aVzRnWm1Gc2MyVXNJRzFwYmk0Z1ZHaGxJRzVsZHlCb1pXRndJSFJ5WldVZ2MyaHZkV3hrSUdOdmJuUmhhVzRnZEdobElITmhiV1VnYVhSbGJYTmNibHgwSUNvZ1lYTWdZbVZtYjNKbElHSjFkQ0J2Y21SbGNtVmtJR2x1SUhSb1pTQnlhV2RvZENCM1lYa3VYRzVjZENBcUwxeHVYSFJ6WlhRZ2NtVjJaWEp6WlNoMllXeDFaU2tnZTF4dVhIUmNkQzh2UlhobFkzVjBaU0J2Ym14NUlHbG1JSFpoYkhWbElHbHpJR1JwWm1abGNtVnVkRnh1WEhSY2RHbG1JQ2gyWVd4MVpTQWhQVDBnZEdocGN5NWZYM0psZG1WeWMyVXBJSHRjYmx4MFhIUmNkSFpoY2lCb1pXRndUR2x6ZENBOUlIUm9hWE11WDE5b1pXRndMbXhwYzNRb0tUdGNibHgwWEhSY2RHaGxZWEJNYVhOMExuTm9hV1owS0NrN0lDOHZJSEpsYlc5MlpTQnpkMkZ3SUhaaGJIVmxJQ2htYVhKemRDQmxiR1Z0SUdsdUlHRnljbUY1S1Z4dVhHNWNkRngwWEhScFppQW9kbUZzZFdVcElIdGNibHgwWEhSY2RGeDBkR2hwY3k1ZlgyaGxZWEFnUFNCdVpYY2dUV0Y0U0dWaGNDZ3BPMXh1WEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBkR2hwY3k1ZlgyaGxZWEFnUFNCdVpYY2dUV2x1U0dWaGNDZ3BPMXh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFIwYUdsekxsOWZhR1ZoY0M1aWRXbHNaRWhsWVhBb2FHVmhjRXhwYzNRcE8xeHVYSFJjZEZ4MGRHaHBjeTVmWDNKbGRtVnljMlVnUFNCMllXeDFaVHRjYmx4MFhIUjlYRzVjZEgxY2JseHVYSFIwYjFOMGNtbHVaeWdwSUh0Y2JseDBYSFIyWVhJZ2JHbHpkQ0E5SUhSb2FYTXVYMTlvWldGd0xteHBjM1FvS1R0Y2JseDBYSFIyWVhJZ2MzUnlhVzVuSUQwZ1hDSlRhWHBsT2lCY0lpQXJJSFJvYVhNdVgxOW9aV0Z3TG5OcGVtVW9LU0FySUZ3aUlGd2lPMXh1WEhSY2RHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR2x6ZEM1c1pXNW5kR2c3SUdrckt5a2dlMXh1WEhSY2RGeDBkbUZ5SUc5aWFpQTlJR3hwYzNSYmFWMDdYRzVjZEZ4MFhIUnpkSEpwYm1jZ0t6MGdiMkpxTG05aWFtVmpkQzVqYjI1emRISjFZM1J2Y2k1dVlXMWxJQ3NnWENJZ1lYUWdYQ0lnS3lCdlltb3VhR1ZoY0ZaaGJIVmxJQ3NnWENJZ1hDSTdYRzVjZEZ4MGZWeHVYSFJjZEhKbGRIVnliaUJ6ZEhKcGJtYzdYRzVjZEgxY2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JRY21sdmNtbDBlVkYxWlhWbE95SmRmUT09IiwidmFyIHdhdmVzID0gcmVxdWlyZSgnLi4vd2F2ZXMtYXVkaW8nKTtcbnZhciBhdWRpb0NvbnRleHQgPSB3YXZlcy5hdWRpb0NvbnRleHQ7XG52YXIgQXVkaW9CdWZmZXJMb2FkZXIgPSByZXF1aXJlKCd3YXZlcy1sb2FkZXJzJykuQXVkaW9CdWZmZXJMb2FkZXI7XG52YXIgR3JhbnVsYXJFbmdpbmUgPSB3YXZlcy5HcmFudWxhckVuZ2luZTtcbnZhciBQbGF5ZXJFbmdpbmUgPSB3YXZlcy5QbGF5ZXJFbmdpbmU7XG52YXIgUGxheUNvbnRyb2wgPSB3YXZlcy5QbGF5Q29udHJvbDtcbnZhciBTZWdtZW50RW5naW5lID0gd2F2ZXMuU2VnbWVudEVuZ2luZTtcbnZhciBUcmFuc3BvcnQgPSB3YXZlcy5UcmFuc3BvcnQ7XG5cbnZhciBhdWRpb0J1ZmZlckxvYWRlciA9IG5ldyBBdWRpb0J1ZmZlckxvYWRlcigpO1xudmFyIHRyYW5zcG9ydCA9IG5ldyBUcmFuc3BvcnQoYXVkaW9Db250ZXh0KTtcbnZhciBwbGF5Q29udHJvbCA9IG5ldyBQbGF5Q29udHJvbCh0cmFuc3BvcnQpO1xuXG52YXIgZW5naW5lO1xudmFyIHBsYXlpbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gbG9hZEFwcCgpIHtcblx0YXVkaW9CdWZmZXJMb2FkZXIubG9hZCgnaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9JcmNhbS1SbkQvYXVkaW8tZmlsZXMvbWFzdGVyL2RydW1Mb29wLndhdicpLnRoZW4oZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0ZW5naW5lID0gbmV3IEdyYW51bGFyRW5naW5lKGF1ZGlvQ29udGV4dCk7XG5cdFx0ZW5naW5lLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRlbmdpbmUuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHRcdHRyYW5zcG9ydC5hZGQoZW5naW5lLCAwLCBidWZmZXIuZHVyYXRpb24pO1xuXHRcdHBsYXlDb250cm9sLnNldExvb3BCb3VuZGFyaWVzKDAsIGJ1ZmZlci5kdXJhdGlvbik7XG5cdFx0cGxheUNvbnRyb2wubG9vcCA9IHRydWU7XG5cdH0pO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5LWJ1dHRvbicpLm9uY2xpY2sgPSBmdW5jdGlvbihldmVudCkge1x0XG5cdFx0aWYgKCFwbGF5aW5nKSB7XG5cdFx0XHRwbGF5Q29udHJvbC5zdGFydCgpO1xuXHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gXCJQYXVzZVwiO1xuXHRcdFx0cGxheWluZyA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXlDb250cm9sLnBhdXNlKCk7XG5cdFx0XHR0aGlzLnRleHRDb250ZW50ID0gXCJQbGF5XCI7XG5cdFx0XHRwbGF5aW5nID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVkLXJhbmdlJylcblx0XHQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0cGxheUNvbnRyb2wuc3BlZWQgPSAoK3RoaXMudmFsdWUpO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVkJykudGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlO1xuXHRcdH0pO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXHRsb2FkQXBwKCk7XG59KTsiLCJ2YXIgTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXInKTtcbnZhciBBdWRpb0J1ZmZlckxvYWRlciA9IHJlcXVpcmUoJy4vYXVkaW8tYnVmZmVyLWxvYWRlcicpO1xuXG4vKipcbiAqIEdldHMgY2FsbGVkIGlmIGEgcGFyYW1ldGVyIGlzIG1pc3NpbmcgYW5kIHRoZSBleHByZXNzaW9uXG4gKiBzcGVjaWZ5aW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGV2YWx1YXRlZC5cbiAqIEBmdW5jdGlvblxuICovXG5mdW5jdGlvbiB0aHJvd0lmTWlzc2luZygpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHBhcmFtZXRlcicpO1xufVxuXG4vKipcbiAqIFN1cGVyTG9hZGVyXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgSGVscGVyIHRvIGxvYWQgbXVsdGlwbGUgdHlwZSBvZiBmaWxlcywgYW5kIGdldCB0aGVtIGluIHRoZWlyIHVzZWZ1bCB0eXBlLCBqc29uIGZvciBqc29uIGZpbGVzLCBBdWRpb0J1ZmZlciBmb3IgYXVkaW8gZmlsZXMuXG4gKi9cbmNsYXNzIFN1cGVyTG9hZGVyIHtcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogVXNlIGNvbXBvc2l0aW9uIHRvIHNldHVwIGFwcHJvcHJpYXRlIGZpbGUgbG9hZGVyc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5idWZmZXJMb2FkZXIgPSBuZXcgQXVkaW9CdWZmZXJMb2FkZXIoKTtcbiAgICB0aGlzLmxvYWRlciA9IG5ldyBMb2FkZXIoXCJqc29uXCIpO1xuICB9XG5cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIC0gTWV0aG9kIGZvciBwcm9taXNlIGF1ZGlvIGFuZCBqc29uIGZpbGUgbG9hZGluZyAoYW5kIGRlY29kaW5nIGZvciBhdWRpbykuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xzdHJpbmdbXSl9IGZpbGVVUkxzIC0gVGhlIFVSTChzKSBvZiB0aGUgZmlsZXMgdG8gbG9hZC4gQWNjZXB0cyBhIFVSTCBwb2ludGluZyB0byB0aGUgZmlsZSBsb2NhdGlvbiBvciBhbiBhcnJheSBvZiBVUkxzLlxuICAgKiBAcGFyYW0ge3t3cmFwQXJvdW5kRXh0ZW5zaW9uOiBudW1iZXJ9fSBbb3B0aW9uc10gLSBPYmplY3Qgd2l0aCBhIHdyYXBBcm91bmRFeHRlbnNpb24ga2V5IHdoaWNoIHNldCB0aGUgbGVuZ3RoLCBpbiBzZWNvbmRzIHRvIGJlIGNvcGllZCBmcm9tIHRoZSBiZWdpbmluZ1xuICAgKiBhdCB0aGUgZW5kIG9mIHRoZSByZXR1cm5lZCBBdWRpb0J1ZmZlclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGxvYWQoZmlsZVVSTHMgPSB0aHJvd0lmTWlzc2luZygpLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMub3B0aW9ucy53cmFwQXJvdW5kRXh0ZW5zaW9uID0gdGhpcy5vcHRpb25zLndyYXBBcm91bmRFeHRlbnNpb24gfHwgMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaWxlVVJMcykpIHtcbiAgICAgIHZhciBpID0gLTE7XG4gICAgICB2YXIgcG9zID0gW1xuICAgICAgICBbXSxcbiAgICAgICAgW11cbiAgICAgIF07IC8vIHBvcyBpcyB1c2VkIHRvIHRyYWNrIHRoZSBwb3NpdGlvbnMgb2YgZWFjaCBmaWxlVVJMXG4gICAgICB2YXIgb3RoZXJVUkxzID0gZmlsZVVSTHMuZmlsdGVyKGZ1bmN0aW9uKHVybCwgaW5kZXgpIHtcbiAgICAgICAgLy8gdmFyIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUodXJsKTtcbiAgICAgICAgdmFyIHBhcnRzID0gdXJsLnNwbGl0KCcuJyk7XG4gICAgICAgIHZhciBleHRuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKGV4dG5hbWUgPT0gJ2pzb24nKSB7XG4gICAgICAgICAgcG9zWzBdLnB1c2goaSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9zWzFdLnB1c2goaSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gdmFyIGF1ZGlvVVJMcyA9IF8uZGlmZmVyZW5jZShmaWxlVVJMcywgb3RoZXJVUkxzKTtcbiAgICAgIHZhciBhdWRpb1VSTHMgPSBmaWxlVVJMcy5maWx0ZXIoZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIGlmIChvdGhlclVSTHMuaW5kZXhPZih1cmwpID09PSAtMSkgeyByZXR1cm4gdXJsOyB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIHByb21pc2VzID0gW107XG5cbiAgICAgIGlmIChvdGhlclVSTHMubGVuZ3RoID4gMCkgcHJvbWlzZXMucHVzaCh0aGlzLmxvYWRlci5sb2FkKG90aGVyVVJMcykpO1xuICAgICAgaWYgKGF1ZGlvVVJMcy5sZW5ndGggPiAwKSBwcm9taXNlcy5wdXNoKHRoaXMuYnVmZmVyTG9hZGVyLmxvYWQoYXVkaW9VUkxzLCB0aGlzLm9wdGlvbnMpKTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oXG4gICAgICAgICAgKGRhdGFzKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHJlb3JkZXIgYW5kIGZsYXR0ZW4gYWxsIG9mIHRoZXNlIGZ1bGZpbGxlZCBwcm9taXNlc1xuICAgICAgICAgICAgLy8gQHRvZG8gdGhpcyBpcyB1Z2x5XG4gICAgICAgICAgICBpZiAoZGF0YXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZGF0YXNbMF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIG91dERhdGEgPSBbXTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwb3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHBvc1tqXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgb3V0RGF0YVtwb3Nbal1ba11dID0gZGF0YXNbal1ba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc29sdmUob3V0RGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3VwZXJMb2FkZXI7IiwiLyoqXG4gKiBDb3JlLmpzIDAuNi4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qc1xuICogTGljZW5zZTogaHR0cDovL3JvY2subWl0LWxpY2Vuc2Uub3JnXG4gKiDCqSAyMDE1IERlbmlzIFB1c2hrYXJldlxuICovXG4hZnVuY3Rpb24oZ2xvYmFsLCBmcmFtZXdvcmssIHVuZGVmaW5lZCl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgLy8gU2hvcnRjdXRzIGZvciBbW0NsYXNzXV0gJiBwcm9wZXJ0eSBuYW1lc1xyXG52YXIgT0JKRUNUICAgICAgICAgID0gJ09iamVjdCdcclxuICAsIEZVTkNUSU9OICAgICAgICA9ICdGdW5jdGlvbidcclxuICAsIEFSUkFZICAgICAgICAgICA9ICdBcnJheSdcclxuICAsIFNUUklORyAgICAgICAgICA9ICdTdHJpbmcnXHJcbiAgLCBOVU1CRVIgICAgICAgICAgPSAnTnVtYmVyJ1xyXG4gICwgUkVHRVhQICAgICAgICAgID0gJ1JlZ0V4cCdcclxuICAsIERBVEUgICAgICAgICAgICA9ICdEYXRlJ1xyXG4gICwgTUFQICAgICAgICAgICAgID0gJ01hcCdcclxuICAsIFNFVCAgICAgICAgICAgICA9ICdTZXQnXHJcbiAgLCBXRUFLTUFQICAgICAgICAgPSAnV2Vha01hcCdcclxuICAsIFdFQUtTRVQgICAgICAgICA9ICdXZWFrU2V0J1xyXG4gICwgU1lNQk9MICAgICAgICAgID0gJ1N5bWJvbCdcclxuICAsIFBST01JU0UgICAgICAgICA9ICdQcm9taXNlJ1xyXG4gICwgTUFUSCAgICAgICAgICAgID0gJ01hdGgnXHJcbiAgLCBBUkdVTUVOVFMgICAgICAgPSAnQXJndW1lbnRzJ1xyXG4gICwgUFJPVE9UWVBFICAgICAgID0gJ3Byb3RvdHlwZSdcclxuICAsIENPTlNUUlVDVE9SICAgICA9ICdjb25zdHJ1Y3RvcidcclxuICAsIFRPX1NUUklORyAgICAgICA9ICd0b1N0cmluZydcclxuICAsIFRPX1NUUklOR19UQUcgICA9IFRPX1NUUklORyArICdUYWcnXHJcbiAgLCBUT19MT0NBTEUgICAgICAgPSAndG9Mb2NhbGVTdHJpbmcnXHJcbiAgLCBIQVNfT1dOICAgICAgICAgPSAnaGFzT3duUHJvcGVydHknXHJcbiAgLCBGT1JfRUFDSCAgICAgICAgPSAnZm9yRWFjaCdcclxuICAsIElURVJBVE9SICAgICAgICA9ICdpdGVyYXRvcidcclxuICAsIEZGX0lURVJBVE9SICAgICA9ICdAQCcgKyBJVEVSQVRPUlxyXG4gICwgUFJPQ0VTUyAgICAgICAgID0gJ3Byb2Nlc3MnXHJcbiAgLCBDUkVBVEVfRUxFTUVOVCAgPSAnY3JlYXRlRWxlbWVudCdcclxuICAvLyBBbGlhc2VzIGdsb2JhbCBvYmplY3RzIGFuZCBwcm90b3R5cGVzXHJcbiAgLCBGdW5jdGlvbiAgICAgICAgPSBnbG9iYWxbRlVOQ1RJT05dXHJcbiAgLCBPYmplY3QgICAgICAgICAgPSBnbG9iYWxbT0JKRUNUXVxyXG4gICwgQXJyYXkgICAgICAgICAgID0gZ2xvYmFsW0FSUkFZXVxyXG4gICwgU3RyaW5nICAgICAgICAgID0gZ2xvYmFsW1NUUklOR11cclxuICAsIE51bWJlciAgICAgICAgICA9IGdsb2JhbFtOVU1CRVJdXHJcbiAgLCBSZWdFeHAgICAgICAgICAgPSBnbG9iYWxbUkVHRVhQXVxyXG4gICwgRGF0ZSAgICAgICAgICAgID0gZ2xvYmFsW0RBVEVdXHJcbiAgLCBNYXAgICAgICAgICAgICAgPSBnbG9iYWxbTUFQXVxyXG4gICwgU2V0ICAgICAgICAgICAgID0gZ2xvYmFsW1NFVF1cclxuICAsIFdlYWtNYXAgICAgICAgICA9IGdsb2JhbFtXRUFLTUFQXVxyXG4gICwgV2Vha1NldCAgICAgICAgID0gZ2xvYmFsW1dFQUtTRVRdXHJcbiAgLCBTeW1ib2wgICAgICAgICAgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICwgTWF0aCAgICAgICAgICAgID0gZ2xvYmFsW01BVEhdXHJcbiAgLCBUeXBlRXJyb3IgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXHJcbiAgLCBSYW5nZUVycm9yICAgICAgPSBnbG9iYWwuUmFuZ2VFcnJvclxyXG4gICwgc2V0VGltZW91dCAgICAgID0gZ2xvYmFsLnNldFRpbWVvdXRcclxuICAsIHNldEltbWVkaWF0ZSAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcclxuICAsIGNsZWFySW1tZWRpYXRlICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxyXG4gICwgcGFyc2VJbnQgICAgICAgID0gZ2xvYmFsLnBhcnNlSW50XHJcbiAgLCBpc0Zpbml0ZSAgICAgICAgPSBnbG9iYWwuaXNGaW5pdGVcclxuICAsIHByb2Nlc3MgICAgICAgICA9IGdsb2JhbFtQUk9DRVNTXVxyXG4gICwgbmV4dFRpY2sgICAgICAgID0gcHJvY2VzcyAmJiBwcm9jZXNzLm5leHRUaWNrXHJcbiAgLCBkb2N1bWVudCAgICAgICAgPSBnbG9iYWwuZG9jdW1lbnRcclxuICAsIGh0bWwgICAgICAgICAgICA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxyXG4gICwgbmF2aWdhdG9yICAgICAgID0gZ2xvYmFsLm5hdmlnYXRvclxyXG4gICwgZGVmaW5lICAgICAgICAgID0gZ2xvYmFsLmRlZmluZVxyXG4gICwgY29uc29sZSAgICAgICAgID0gZ2xvYmFsLmNvbnNvbGUgfHwge31cclxuICAsIEFycmF5UHJvdG8gICAgICA9IEFycmF5W1BST1RPVFlQRV1cclxuICAsIE9iamVjdFByb3RvICAgICA9IE9iamVjdFtQUk9UT1RZUEVdXHJcbiAgLCBGdW5jdGlvblByb3RvICAgPSBGdW5jdGlvbltQUk9UT1RZUEVdXHJcbiAgLCBJbmZpbml0eSAgICAgICAgPSAxIC8gMFxyXG4gICwgRE9UICAgICAgICAgICAgID0gJy4nO1xyXG5cclxuLy8gaHR0cDovL2pzcGVyZi5jb20vY29yZS1qcy1pc29iamVjdFxyXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XHJcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xyXG59XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcclxufVxyXG4vLyBOYXRpdmUgZnVuY3Rpb24/XHJcbnZhciBpc05hdGl2ZSA9IGN0eCgvLi8udGVzdCwgL1xcW25hdGl2ZSBjb2RlXFxdXFxzKlxcfVxccyokLywgMSk7XHJcblxyXG4vLyBPYmplY3QgaW50ZXJuYWwgW1tDbGFzc11dIG9yIHRvU3RyaW5nVGFnXHJcbi8vIGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcclxudmFyIHRvU3RyaW5nID0gT2JqZWN0UHJvdG9bVE9fU1RSSU5HXTtcclxuZnVuY3Rpb24gc2V0VG9TdHJpbmdUYWcoaXQsIHRhZywgc3RhdCl7XHJcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0W1BST1RPVFlQRV0sIFNZTUJPTF9UQUcpKWhpZGRlbihpdCwgU1lNQk9MX1RBRywgdGFnKTtcclxufVxyXG5mdW5jdGlvbiBjb2YoaXQpe1xyXG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XHJcbn1cclxuZnVuY3Rpb24gY2xhc3NvZihpdCl7XHJcbiAgdmFyIE8sIFQ7XHJcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xyXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1NZTUJPTF9UQUddKSA9PSAnc3RyaW5nJyA/IFQgOiBjb2YoTyk7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uXHJcbnZhciBjYWxsICA9IEZ1bmN0aW9uUHJvdG8uY2FsbFxyXG4gICwgYXBwbHkgPSBGdW5jdGlvblByb3RvLmFwcGx5XHJcbiAgLCBSRUZFUkVOQ0VfR0VUO1xyXG4vLyBQYXJ0aWFsIGFwcGx5XHJcbmZ1bmN0aW9uIHBhcnQoLyogLi4uYXJncyAqLyl7XHJcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXHJcbiAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgYXJncyAgID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIF8gICAgICA9IHBhdGguX1xyXG4gICAgLCBob2xkZXIgPSBmYWxzZTtcclxuICB3aGlsZShsZW5ndGggPiBpKWlmKChhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgdmFyIHRoYXQgICAgPSB0aGlzXHJcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCBpID0gMCwgaiA9IDAsIF9hcmdzO1xyXG4gICAgaWYoIWhvbGRlciAmJiAhX2xlbmd0aClyZXR1cm4gaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcclxuICAgIF9hcmdzID0gYXJncy5zbGljZSgpO1xyXG4gICAgaWYoaG9sZGVyKWZvcig7bGVuZ3RoID4gaTsgaSsrKWlmKF9hcmdzW2ldID09PSBfKV9hcmdzW2ldID0gYXJndW1lbnRzW2orK107XHJcbiAgICB3aGlsZShfbGVuZ3RoID4gailfYXJncy5wdXNoKGFyZ3VtZW50c1tqKytdKTtcclxuICAgIHJldHVybiBpbnZva2UoZm4sIF9hcmdzLCB0aGF0KTtcclxuICB9XHJcbn1cclxuLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXHJcbmZ1bmN0aW9uIGN0eChmbiwgdGhhdCwgbGVuZ3RoKXtcclxuICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgaWYofmxlbmd0aCAmJiB0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xyXG4gIHN3aXRjaChsZW5ndGgpe1xyXG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xyXG4gICAgfVxyXG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuLy8gRmFzdCBhcHBseVxyXG4vLyBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcclxuZnVuY3Rpb24gaW52b2tlKGZuLCBhcmdzLCB0aGF0KXtcclxuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XHJcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoIHwgMCl7XHJcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcclxuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcclxuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcclxuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcclxuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcclxuICAgIGNhc2UgNTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKTtcclxuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XHJcbn1cclxuXHJcbi8vIE9iamVjdDpcclxudmFyIGNyZWF0ZSAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlXHJcbiAgLCBnZXRQcm90b3R5cGVPZiAgID0gT2JqZWN0LmdldFByb3RvdHlwZU9mXHJcbiAgLCBzZXRQcm90b3R5cGVPZiAgID0gT2JqZWN0LnNldFByb3RvdHlwZU9mXHJcbiAgLCBkZWZpbmVQcm9wZXJ0eSAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XHJcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcclxuICAsIGdldE93bkRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXHJcbiAgLCBnZXRLZXlzICAgICAgICAgID0gT2JqZWN0LmtleXNcclxuICAsIGdldE5hbWVzICAgICAgICAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xyXG4gICwgZ2V0U3ltYm9scyAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNcclxuICAsIGlzRnJvemVuICAgICAgICAgPSBPYmplY3QuaXNGcm96ZW5cclxuICAsIGhhcyAgICAgICAgICAgICAgPSBjdHgoY2FsbCwgT2JqZWN0UHJvdG9bSEFTX09XTl0sIDIpXHJcbiAgLy8gRHVtbXksIGZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZyBpbiBlczUgbW9kdWxlXHJcbiAgLCBFUzVPYmplY3QgICAgICAgID0gT2JqZWN0XHJcbiAgLCBEaWN0O1xyXG5mdW5jdGlvbiB0b09iamVjdChpdCl7XHJcbiAgcmV0dXJuIEVTNU9iamVjdChhc3NlcnREZWZpbmVkKGl0KSk7XHJcbn1cclxuZnVuY3Rpb24gcmV0dXJuSXQoaXQpe1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiByZXR1cm5UaGlzKCl7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuZnVuY3Rpb24gZ2V0KG9iamVjdCwga2V5KXtcclxuICBpZihoYXMob2JqZWN0LCBrZXkpKXJldHVybiBvYmplY3Rba2V5XTtcclxufVxyXG5mdW5jdGlvbiBvd25LZXlzKGl0KXtcclxuICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gIHJldHVybiBnZXRTeW1ib2xzID8gZ2V0TmFtZXMoaXQpLmNvbmNhdChnZXRTeW1ib2xzKGl0KSkgOiBnZXROYW1lcyhpdCk7XHJcbn1cclxuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxyXG52YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSl7XHJcbiAgdmFyIFQgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0YXJnZXQpKVxyXG4gICAgLCBsID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBpID0gMTtcclxuICB3aGlsZShsID4gaSl7XHJcbiAgICB2YXIgUyAgICAgID0gRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxyXG4gICAgICAsIGtleXMgICA9IGdldEtleXMoUylcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGogICAgICA9IDBcclxuICAgICAgLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIFQ7XHJcbn1cclxuZnVuY3Rpb24ga2V5T2Yob2JqZWN0LCBlbCl7XHJcbiAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxyXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgLCBpbmRleCAgPSAwXHJcbiAgICAsIGtleTtcclxuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xyXG59XHJcblxyXG4vLyBBcnJheVxyXG4vLyBhcnJheSgnc3RyMSxzdHIyLHN0cjMnKSA9PiBbJ3N0cjEnLCAnc3RyMicsICdzdHIzJ11cclxuZnVuY3Rpb24gYXJyYXkoaXQpe1xyXG4gIHJldHVybiBTdHJpbmcoaXQpLnNwbGl0KCcsJyk7XHJcbn1cclxudmFyIHB1c2ggICAgPSBBcnJheVByb3RvLnB1c2hcclxuICAsIHVuc2hpZnQgPSBBcnJheVByb3RvLnVuc2hpZnRcclxuICAsIHNsaWNlICAgPSBBcnJheVByb3RvLnNsaWNlXHJcbiAgLCBzcGxpY2UgID0gQXJyYXlQcm90by5zcGxpY2VcclxuICAsIGluZGV4T2YgPSBBcnJheVByb3RvLmluZGV4T2ZcclxuICAsIGZvckVhY2ggPSBBcnJheVByb3RvW0ZPUl9FQUNIXTtcclxuLypcclxuICogMCAtPiBmb3JFYWNoXHJcbiAqIDEgLT4gbWFwXHJcbiAqIDIgLT4gZmlsdGVyXHJcbiAqIDMgLT4gc29tZVxyXG4gKiA0IC0+IGV2ZXJ5XHJcbiAqIDUgLT4gZmluZFxyXG4gKiA2IC0+IGZpbmRJbmRleFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlNZXRob2QodHlwZSl7XHJcbiAgdmFyIGlzTWFwICAgICAgID0gdHlwZSA9PSAxXHJcbiAgICAsIGlzRmlsdGVyICAgID0gdHlwZSA9PSAyXHJcbiAgICAsIGlzU29tZSAgICAgID0gdHlwZSA9PSAzXHJcbiAgICAsIGlzRXZlcnkgICAgID0gdHlwZSA9PSA0XHJcbiAgICAsIGlzRmluZEluZGV4ID0gdHlwZSA9PSA2XHJcbiAgICAsIG5vaG9sZXMgICAgID0gdHlwZSA9PSA1IHx8IGlzRmluZEluZGV4O1xyXG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIHRoYXQgICA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAsIHNlbGYgICA9IEVTNU9iamVjdChPKVxyXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IDBcclxuICAgICAgLCByZXN1bHQgPSBpc01hcCA/IEFycmF5KGxlbmd0aCkgOiBpc0ZpbHRlciA/IFtdIDogdW5kZWZpbmVkXHJcbiAgICAgICwgdmFsLCByZXM7XHJcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKG5vaG9sZXMgfHwgaW5kZXggaW4gc2VsZil7XHJcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xyXG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xyXG4gICAgICBpZih0eXBlKXtcclxuICAgICAgICBpZihpc01hcClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgICAvLyBtYXBcclxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxyXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcclxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcclxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcclxuICAgICAgICB9IGVsc2UgaWYoaXNFdmVyeSlyZXR1cm4gZmFsc2U7ICAgICAgICAgICAvLyBldmVyeVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXNGaW5kSW5kZXggPyAtMSA6IGlzU29tZSB8fCBpc0V2ZXJ5ID8gaXNFdmVyeSA6IHJlc3VsdDtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlDb250YWlucyhpc0NvbnRhaW5zKXtcclxuICByZXR1cm4gZnVuY3Rpb24oZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aCk7XHJcbiAgICBpZihpc0NvbnRhaW5zICYmIGVsICE9IGVsKXtcclxuICAgICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihzYW1lTmFOKE9baW5kZXhdKSlyZXR1cm4gaXNDb250YWlucyB8fCBpbmRleDtcclxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKGlzQ29udGFpbnMgfHwgaW5kZXggaW4gTyl7XHJcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gaXNDb250YWlucyB8fCBpbmRleDtcclxuICAgIH0gcmV0dXJuICFpc0NvbnRhaW5zICYmIC0xO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBnZW5lcmljKEEsIEIpe1xyXG4gIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgdnMgaXNGdW5jdGlvblxyXG4gIHJldHVybiB0eXBlb2YgQSA9PSAnZnVuY3Rpb24nID8gQSA6IEI7XHJcbn1cclxuXHJcbi8vIE1hdGhcclxudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFmZmZmZmZmZmZmZmZmIC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcclxuICAsIHBvdyAgICA9IE1hdGgucG93XHJcbiAgLCBhYnMgICAgPSBNYXRoLmFic1xyXG4gICwgY2VpbCAgID0gTWF0aC5jZWlsXHJcbiAgLCBmbG9vciAgPSBNYXRoLmZsb29yXHJcbiAgLCBtYXggICAgPSBNYXRoLm1heFxyXG4gICwgbWluICAgID0gTWF0aC5taW5cclxuICAsIHJhbmRvbSA9IE1hdGgucmFuZG9tXHJcbiAgLCB0cnVuYyAgPSBNYXRoLnRydW5jIHx8IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxuICAgIH1cclxuLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuZnVuY3Rpb24gc2FtZU5hTihudW1iZXIpe1xyXG4gIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xyXG59XHJcbi8vIDcuMS40IFRvSW50ZWdlclxyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xyXG4gIHJldHVybiBpc05hTihpdCkgPyAwIDogdHJ1bmMoaXQpO1xyXG59XHJcbi8vIDcuMS4xNSBUb0xlbmd0aFxyXG5mdW5jdGlvbiB0b0xlbmd0aChpdCl7XHJcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCBNQVhfU0FGRV9JTlRFR0VSKSA6IDA7XHJcbn1cclxuZnVuY3Rpb24gdG9JbmRleChpbmRleCwgbGVuZ3RoKXtcclxuICB2YXIgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xyXG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xyXG59XHJcbmZ1bmN0aW9uIGx6KG51bSl7XHJcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVJlcGxhY2VyKHJlZ0V4cCwgcmVwbGFjZSwgaXNTdGF0aWMpe1xyXG4gIHZhciByZXBsYWNlciA9IGlzT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XHJcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcclxuICB9IDogcmVwbGFjZTtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIFN0cmluZyhpc1N0YXRpYyA/IGl0IDogdGhpcykucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUG9pbnRBdCh0b1N0cmluZyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHBvcyl7XHJcbiAgICB2YXIgcyA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxyXG4gICAgICAsIGwgPSBzLmxlbmd0aFxyXG4gICAgICAsIGEsIGI7XHJcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIHRvU3RyaW5nID8gJycgOiB1bmRlZmluZWQ7XHJcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcclxuICAgICAgPyB0b1N0cmluZyA/IHMuY2hhckF0KGkpIDogYVxyXG4gICAgICA6IHRvU3RyaW5nID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xyXG4gIH1cclxufVxyXG5cclxuLy8gQXNzZXJ0aW9uICYgZXJyb3JzXHJcbnZhciBSRURVQ0VfRVJST1IgPSAnUmVkdWNlIG9mIGVtcHR5IG9iamVjdCB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xyXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcclxuICBpZighY29uZGl0aW9uKXRocm93IFR5cGVFcnJvcihtc2cyID8gbXNnMSArIG1zZzIgOiBtc2cxKTtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcclxuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdGdW5jdGlvbiBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RnVuY3Rpb24oaXQpe1xyXG4gIGFzc2VydChpc0Z1bmN0aW9uKGl0KSwgaXQsICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydE9iamVjdChpdCl7XHJcbiAgYXNzZXJ0KGlzT2JqZWN0KGl0KSwgaXQsICcgaXMgbm90IGFuIG9iamVjdCEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0SW5zdGFuY2UoaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcclxuICBhc3NlcnQoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvciwgbmFtZSwgXCI6IHVzZSB0aGUgJ25ldycgb3BlcmF0b3IhXCIpO1xyXG59XHJcblxyXG4vLyBQcm9wZXJ0eSBkZXNjcmlwdG9ycyAmIFN5bWJvbFxyXG5mdW5jdGlvbiBkZXNjcmlwdG9yKGJpdG1hcCwgdmFsdWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXHJcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXHJcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXHJcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gIG9iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XHJcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCBkZXNjcmlwdG9yKGJpdG1hcCwgdmFsdWUpKTtcclxuICB9IDogc2ltcGxlU2V0O1xyXG59XHJcbmZ1bmN0aW9uIHVpZChrZXkpe1xyXG4gIHJldHVybiBTWU1CT0wgKyAnKCcgKyBrZXkgKyAnKV8nICsgKCsrc2lkICsgcmFuZG9tKCkpW1RPX1NUUklOR10oMzYpO1xyXG59XHJcbmZ1bmN0aW9uIGdldFdlbGxLbm93blN5bWJvbChuYW1lLCBzZXR0ZXIpe1xyXG4gIHJldHVybiAoU3ltYm9sICYmIFN5bWJvbFtuYW1lXSkgfHwgKHNldHRlciA/IFN5bWJvbCA6IHNhZmVTeW1ib2wpKFNZTUJPTCArIERPVCArIG5hbWUpO1xyXG59XHJcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxyXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDIgfX0pLmEgPT0gMjtcclxuICAgICAgfSBjYXRjaChlKXt9XHJcbiAgICB9KClcclxuICAsIHNpZCAgICA9IDBcclxuICAsIGhpZGRlbiA9IGNyZWF0ZURlZmluZXIoMSlcclxuICAsIHNldCAgICA9IFN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGRlblxyXG4gICwgc2FmZVN5bWJvbCA9IFN5bWJvbCB8fCB1aWQ7XHJcbmZ1bmN0aW9uIGFzc2lnbkhpZGRlbih0YXJnZXQsIHNyYyl7XHJcbiAgZm9yKHZhciBrZXkgaW4gc3JjKWhpZGRlbih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuXHJcbnZhciBTWU1CT0xfVU5TQ09QQUJMRVMgPSBnZXRXZWxsS25vd25TeW1ib2woJ3Vuc2NvcGFibGVzJylcclxuICAsIEFycmF5VW5zY29wYWJsZXMgICA9IEFycmF5UHJvdG9bU1lNQk9MX1VOU0NPUEFCTEVTXSB8fCB7fVxyXG4gICwgU1lNQk9MX1RBRyAgICAgICAgID0gZ2V0V2VsbEtub3duU3ltYm9sKFRPX1NUUklOR19UQUcpXHJcbiAgLCBTWU1CT0xfU1BFQ0lFUyAgICAgPSBnZXRXZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKVxyXG4gICwgU1lNQk9MX0lURVJBVE9SO1xyXG5mdW5jdGlvbiBzZXRTcGVjaWVzKEMpe1xyXG4gIGlmKERFU0MgJiYgKGZyYW1ld29yayB8fCAhaXNOYXRpdmUoQykpKWRlZmluZVByb3BlcnR5KEMsIFNZTUJPTF9TUEVDSUVTLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6IHJldHVyblRoaXNcclxuICB9KTtcclxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb21tb24uZXhwb3J0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgTk9ERSA9IGNvZihwcm9jZXNzKSA9PSBQUk9DRVNTXHJcbiAgLCBjb3JlID0ge31cclxuICAsIHBhdGggPSBmcmFtZXdvcmsgPyBnbG9iYWwgOiBjb3JlXHJcbiAgLCBvbGQgID0gZ2xvYmFsLmNvcmVcclxuICAsIGV4cG9ydEdsb2JhbFxyXG4gIC8vIHR5cGUgYml0bWFwXHJcbiAgLCBGT1JDRUQgPSAxXHJcbiAgLCBHTE9CQUwgPSAyXHJcbiAgLCBTVEFUSUMgPSA0XHJcbiAgLCBQUk9UTyAgPSA4XHJcbiAgLCBCSU5EICAgPSAxNlxyXG4gICwgV1JBUCAgID0gMzI7XHJcbmZ1bmN0aW9uICRkZWZpbmUodHlwZSwgbmFtZSwgc291cmNlKXtcclxuICB2YXIga2V5LCBvd24sIG91dCwgZXhwXHJcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmIEdMT0JBTFxyXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogKHR5cGUgJiBTVEFUSUMpXHJcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IE9iamVjdFByb3RvKVtQUk9UT1RZUEVdXHJcbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcclxuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xyXG4gIGZvcihrZXkgaW4gc291cmNlKXtcclxuICAgIC8vIHRoZXJlIGlzIGEgc2ltaWxhciBuYXRpdmVcclxuICAgIG93biA9ICEodHlwZSAmIEZPUkNFRCkgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXRcclxuICAgICAgJiYgKCFpc0Z1bmN0aW9uKHRhcmdldFtrZXldKSB8fCBpc05hdGl2ZSh0YXJnZXRba2V5XSkpO1xyXG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcclxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XHJcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcclxuICAgIGlmKCFmcmFtZXdvcmsgJiYgaXNHbG9iYWwgJiYgIWlzRnVuY3Rpb24odGFyZ2V0W2tleV0pKWV4cCA9IHNvdXJjZVtrZXldO1xyXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcclxuICAgIGVsc2UgaWYodHlwZSAmIEJJTkQgJiYgb3duKWV4cCA9IGN0eChvdXQsIGdsb2JhbCk7XHJcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxyXG4gICAgZWxzZSBpZih0eXBlICYgV1JBUCAmJiAhZnJhbWV3b3JrICYmIHRhcmdldFtrZXldID09IG91dCl7XHJcbiAgICAgIGV4cCA9IGZ1bmN0aW9uKHBhcmFtKXtcclxuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIG91dCA/IG5ldyBvdXQocGFyYW0pIDogb3V0KHBhcmFtKTtcclxuICAgICAgfVxyXG4gICAgICBleHBbUFJPVE9UWVBFXSA9IG91dFtQUk9UT1RZUEVdO1xyXG4gICAgfSBlbHNlIGV4cCA9IHR5cGUgJiBQUk9UTyAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoY2FsbCwgb3V0KSA6IG91dDtcclxuICAgIC8vIGV4dGVuZCBnbG9iYWxcclxuICAgIGlmKGZyYW1ld29yayAmJiB0YXJnZXQgJiYgIW93bil7XHJcbiAgICAgIGlmKGlzR2xvYmFsKXRhcmdldFtrZXldID0gb3V0O1xyXG4gICAgICBlbHNlIGRlbGV0ZSB0YXJnZXRba2V5XSAmJiBoaWRkZW4odGFyZ2V0LCBrZXksIG91dCk7XHJcbiAgICB9XHJcbiAgICAvLyBleHBvcnRcclxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpaGlkZGVuKGV4cG9ydHMsIGtleSwgZXhwKTtcclxuICB9XHJcbn1cclxuLy8gQ29tbW9uSlMgZXhwb3J0XHJcbmlmKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpbW9kdWxlLmV4cG9ydHMgPSBjb3JlO1xyXG4vLyBSZXF1aXJlSlMgZXhwb3J0XHJcbmVsc2UgaWYoaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGNvcmV9KTtcclxuLy8gRXhwb3J0IHRvIGdsb2JhbCBvYmplY3RcclxuZWxzZSBleHBvcnRHbG9iYWwgPSB0cnVlO1xyXG5pZihleHBvcnRHbG9iYWwgfHwgZnJhbWV3b3JrKXtcclxuICBjb3JlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpe1xyXG4gICAgZ2xvYmFsLmNvcmUgPSBvbGQ7XHJcbiAgICByZXR1cm4gY29yZTtcclxuICB9XHJcbiAgZ2xvYmFsLmNvcmUgPSBjb3JlO1xyXG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbi5pdGVyYXRvcnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblNZTUJPTF9JVEVSQVRPUiA9IGdldFdlbGxLbm93blN5bWJvbChJVEVSQVRPUik7XHJcbnZhciBJVEVSICA9IHNhZmVTeW1ib2woJ2l0ZXInKVxyXG4gICwgS0VZICAgPSAxXHJcbiAgLCBWQUxVRSA9IDJcclxuICAsIEl0ZXJhdG9ycyA9IHt9XHJcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9XHJcbiAgICAvLyBTYWZhcmkgaGFzIGJ5Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXHJcbiAgLCBCVUdHWV9JVEVSQVRPUlMgPSAna2V5cycgaW4gQXJyYXlQcm90byAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpO1xyXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxyXG5zZXRJdGVyYXRvcihJdGVyYXRvclByb3RvdHlwZSwgcmV0dXJuVGhpcyk7XHJcbmZ1bmN0aW9uIHNldEl0ZXJhdG9yKE8sIHZhbHVlKXtcclxuICBoaWRkZW4oTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XHJcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxyXG4gIEZGX0lURVJBVE9SIGluIEFycmF5UHJvdG8gJiYgaGlkZGVuKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcclxuICBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gY3JlYXRlKHByb3RvIHx8IEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xyXG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xyXG59XHJcbmZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yKENvbnN0cnVjdG9yLCBOQU1FLCB2YWx1ZSwgREVGQVVMVCl7XHJcbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3JbUFJPVE9UWVBFXVxyXG4gICAgLCBpdGVyICA9IGdldChwcm90bywgU1lNQk9MX0lURVJBVE9SKSB8fCBnZXQocHJvdG8sIEZGX0lURVJBVE9SKSB8fCAoREVGQVVMVCAmJiBnZXQocHJvdG8sIERFRkFVTFQpKSB8fCB2YWx1ZTtcclxuICBpZihmcmFtZXdvcmspe1xyXG4gICAgLy8gRGVmaW5lIGl0ZXJhdG9yXHJcbiAgICBzZXRJdGVyYXRvcihwcm90bywgaXRlcik7XHJcbiAgICBpZihpdGVyICE9PSB2YWx1ZSl7XHJcbiAgICAgIHZhciBpdGVyUHJvdG8gPSBnZXRQcm90b3R5cGVPZihpdGVyLmNhbGwobmV3IENvbnN0cnVjdG9yKSk7XHJcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcclxuICAgICAgc2V0VG9TdHJpbmdUYWcoaXRlclByb3RvLCBOQU1FICsgJyBJdGVyYXRvcicsIHRydWUpO1xyXG4gICAgICAvLyBGRiBmaXhcclxuICAgICAgaGFzKHByb3RvLCBGRl9JVEVSQVRPUikgJiYgc2V0SXRlcmF0b3IoaXRlclByb3RvLCByZXR1cm5UaGlzKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxyXG4gIEl0ZXJhdG9yc1tOQU1FXSA9IGl0ZXI7XHJcbiAgLy8gRkYgJiB2OCBmaXhcclxuICBJdGVyYXRvcnNbTkFNRSArICcgSXRlcmF0b3InXSA9IHJldHVyblRoaXM7XHJcbiAgcmV0dXJuIGl0ZXI7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lU3RkSXRlcmF0b3JzKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQpe1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXIoa2luZCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xyXG4gIHZhciBlbnRyaWVzID0gY3JlYXRlSXRlcihLRVkrVkFMVUUpXHJcbiAgICAsIHZhbHVlcyAgPSBjcmVhdGVJdGVyKFZBTFVFKTtcclxuICBpZihERUZBVUxUID09IFZBTFVFKXZhbHVlcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIHZhbHVlcywgJ3ZhbHVlcycpO1xyXG4gIGVsc2UgZW50cmllcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIGVudHJpZXMsICdlbnRyaWVzJyk7XHJcbiAgaWYoREVGQVVMVCl7XHJcbiAgICAkZGVmaW5lKFBST1RPICsgRk9SQ0VEICogQlVHR1lfSVRFUkFUT1JTLCBOQU1FLCB7XHJcbiAgICAgIGVudHJpZXM6IGVudHJpZXMsXHJcbiAgICAgIGtleXM6IElTX1NFVCA/IHZhbHVlcyA6IGNyZWF0ZUl0ZXIoS0VZKSxcclxuICAgICAgdmFsdWVzOiB2YWx1ZXNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBpdGVyUmVzdWx0KGRvbmUsIHZhbHVlKXtcclxuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcclxufVxyXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGl0KXtcclxuICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxyXG4gICAgLCBTeW1ib2wgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICAgLCBoYXNFeHQgPSAoU3ltYm9sICYmIFN5bWJvbFtJVEVSQVRPUl0gfHwgRkZfSVRFUkFUT1IpIGluIE87XHJcbiAgcmV0dXJuIGhhc0V4dCB8fCBTWU1CT0xfSVRFUkFUT1IgaW4gTyB8fCBoYXMoSXRlcmF0b3JzLCBjbGFzc29mKE8pKTtcclxufVxyXG5mdW5jdGlvbiBnZXRJdGVyYXRvcihpdCl7XHJcbiAgdmFyIFN5bWJvbCAgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICAgLCBleHQgICAgID0gaXRbU3ltYm9sICYmIFN5bWJvbFtJVEVSQVRPUl0gfHwgRkZfSVRFUkFUT1JdXHJcbiAgICAsIGdldEl0ZXIgPSBleHQgfHwgaXRbU1lNQk9MX0lURVJBVE9SXSB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xyXG4gIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XHJcbn1cclxuZnVuY3Rpb24gc3RlcENhbGwoZm4sIHZhbHVlLCBlbnRyaWVzKXtcclxuICByZXR1cm4gZW50cmllcyA/IGludm9rZShmbiwgdmFsdWUpIDogZm4odmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrRGFuZ2VySXRlckNsb3NpbmcoZm4pe1xyXG4gIHZhciBkYW5nZXIgPSB0cnVlO1xyXG4gIHZhciBPID0ge1xyXG4gICAgbmV4dDogZnVuY3Rpb24oKXsgdGhyb3cgMSB9LFxyXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uKCl7IGRhbmdlciA9IGZhbHNlIH1cclxuICB9O1xyXG4gIE9bU1lNQk9MX0lURVJBVE9SXSA9IHJldHVyblRoaXM7XHJcbiAgdHJ5IHtcclxuICAgIGZuKE8pO1xyXG4gIH0gY2F0Y2goZSl7fVxyXG4gIHJldHVybiBkYW5nZXI7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VJdGVyYXRvcihpdGVyYXRvcil7XHJcbiAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcclxuICBpZihyZXQgIT09IHVuZGVmaW5lZClyZXQuY2FsbChpdGVyYXRvcik7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUl0ZXJDbG9zZShleGVjLCBpdGVyYXRvcil7XHJcbiAgdHJ5IHtcclxuICAgIGV4ZWMoaXRlcmF0b3IpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKTtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGZvck9mKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XHJcbiAgc2FmZUl0ZXJDbG9zZShmdW5jdGlvbihpdGVyYXRvcil7XHJcbiAgICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxyXG4gICAgICAsIHN0ZXA7XHJcbiAgICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpaWYoc3RlcENhbGwoZiwgc3RlcC52YWx1ZSwgZW50cmllcykgPT09IGZhbHNlKXtcclxuICAgICAgcmV0dXJuIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3IpO1xyXG4gICAgfVxyXG4gIH0sIGdldEl0ZXJhdG9yKGl0ZXJhYmxlKSk7XHJcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnN5bWJvbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG4hZnVuY3Rpb24oVEFHLCBTeW1ib2xSZWdpc3RyeSwgQWxsU3ltYm9scywgc2V0dGVyKXtcclxuICAvLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcclxuICBpZighaXNOYXRpdmUoU3ltYm9sKSl7XHJcbiAgICBTeW1ib2wgPSBmdW5jdGlvbihkZXNjcmlwdGlvbil7XHJcbiAgICAgIGFzc2VydCghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpLCBTWU1CT0wgKyAnIGlzIG5vdCBhICcgKyBDT05TVFJVQ1RPUik7XHJcbiAgICAgIHZhciB0YWcgPSB1aWQoZGVzY3JpcHRpb24pXHJcbiAgICAgICAgLCBzeW0gPSBzZXQoY3JlYXRlKFN5bWJvbFtQUk9UT1RZUEVdKSwgVEFHLCB0YWcpO1xyXG4gICAgICBBbGxTeW1ib2xzW3RhZ10gPSBzeW07XHJcbiAgICAgIERFU0MgJiYgc2V0dGVyICYmIGRlZmluZVByb3BlcnR5KE9iamVjdFByb3RvLCB0YWcsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICBoaWRkZW4odGhpcywgdGFnLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHN5bTtcclxuICAgIH1cclxuICAgIGhpZGRlbihTeW1ib2xbUFJPVE9UWVBFXSwgVE9fU1RSSU5HLCBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpc1tUQUddO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gICRkZWZpbmUoR0xPQkFMICsgV1JBUCwge1N5bWJvbDogU3ltYm9sfSk7XHJcbiAgXHJcbiAgdmFyIHN5bWJvbFN0YXRpY3MgPSB7XHJcbiAgICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcclxuICAgICdmb3InOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXHJcbiAgICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXHJcbiAgICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gU3ltYm9sKGtleSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXHJcbiAgICBpdGVyYXRvcjogU1lNQk9MX0lURVJBVE9SIHx8IGdldFdlbGxLbm93blN5bWJvbChJVEVSQVRPUiksXHJcbiAgICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcclxuICAgIGtleUZvcjogcGFydC5jYWxsKGtleU9mLCBTeW1ib2xSZWdpc3RyeSksXHJcbiAgICAvLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcclxuICAgIHNwZWNpZXM6IFNZTUJPTF9TUEVDSUVTLFxyXG4gICAgLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xyXG4gICAgdG9TdHJpbmdUYWc6IFNZTUJPTF9UQUcgPSBnZXRXZWxsS25vd25TeW1ib2woVE9fU1RSSU5HX1RBRywgdHJ1ZSksXHJcbiAgICAvLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXHJcbiAgICB1bnNjb3BhYmxlczogU1lNQk9MX1VOU0NPUEFCTEVTLFxyXG4gICAgcHVyZTogc2FmZVN5bWJvbCxcclxuICAgIHNldDogc2V0LFxyXG4gICAgdXNlU2V0dGVyOiBmdW5jdGlvbigpe3NldHRlciA9IHRydWV9LFxyXG4gICAgdXNlU2ltcGxlOiBmdW5jdGlvbigpe3NldHRlciA9IGZhbHNlfVxyXG4gIH07XHJcbiAgLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXHJcbiAgLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxyXG4gIC8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxyXG4gIC8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXHJcbiAgLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxyXG4gIC8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcclxuICAvLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXHJcbiAgZm9yRWFjaC5jYWxsKGFycmF5KCdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BsaXQsdG9QcmltaXRpdmUnKSxcclxuICAgIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgc3ltYm9sU3RhdGljc1tpdF0gPSBnZXRXZWxsS25vd25TeW1ib2woaXQpO1xyXG4gICAgfVxyXG4gICk7XHJcbiAgJGRlZmluZShTVEFUSUMsIFNZTUJPTCwgc3ltYm9sU3RhdGljcyk7XHJcbiAgXHJcbiAgc2V0VG9TdHJpbmdUYWcoU3ltYm9sLCBTWU1CT0wpO1xyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDICsgRk9SQ0VEICogIWlzTmF0aXZlKFN5bWJvbCksIE9CSkVDVCwge1xyXG4gICAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcclxuICAgIGdldE93blByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gICAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxyXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHZhciBuYW1lcyA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSksIHJlc3VsdCA9IFtdLCBrZXksIGkgPSAwO1xyXG4gICAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cclxuICBzZXRUb1N0cmluZ1RhZyhNYXRoLCBNQVRILCB0cnVlKTtcclxuICAvLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxyXG4gIHNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xyXG59KHNhZmVTeW1ib2woJ3RhZycpLCB7fSwge30sIHRydWUpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYub2JqZWN0LnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICB2YXIgb2JqZWN0U3RhdGljID0ge1xyXG4gICAgLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcclxuICAgIGFzc2lnbjogYXNzaWduLFxyXG4gICAgLy8gMTkuMS4zLjEwIE9iamVjdC5pcyh2YWx1ZTEsIHZhbHVlMilcclxuICAgIGlzOiBmdW5jdGlvbih4LCB5KXtcclxuICAgICAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxyXG4gIC8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrcyB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cclxuICAnX19wcm90b19fJyBpbiBPYmplY3RQcm90byAmJiBmdW5jdGlvbihidWdneSwgc2V0KXtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNldCA9IGN0eChjYWxsLCBnZXRPd25EZXNjcmlwdG9yKE9iamVjdFByb3RvLCAnX19wcm90b19fJykuc2V0LCAyKTtcclxuICAgICAgc2V0KHt9LCBBcnJheVByb3RvKTtcclxuICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZSB9XHJcbiAgICBvYmplY3RTdGF0aWMuc2V0UHJvdG90eXBlT2YgPSBzZXRQcm90b3R5cGVPZiA9IHNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8sIHByb3RvKXtcclxuICAgICAgYXNzZXJ0T2JqZWN0KE8pO1xyXG4gICAgICBhc3NlcnQocHJvdG8gPT09IG51bGwgfHwgaXNPYmplY3QocHJvdG8pLCBwcm90bywgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xyXG4gICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgICBlbHNlIHNldChPLCBwcm90byk7XHJcbiAgICAgIHJldHVybiBPO1xyXG4gICAgfVxyXG4gIH0oKTtcclxuICAkZGVmaW5lKFNUQVRJQywgT0JKRUNULCBvYmplY3RTdGF0aWMpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIC8vIE9iamVjdCBzdGF0aWMgbWV0aG9kcyBhY2NlcHQgcHJpbWl0aXZlc1xyXG4gIGZ1bmN0aW9uIHdyYXBPYmplY3RNZXRob2Qoa2V5LCBNT0RFKXtcclxuICAgIHZhciBmbiAgPSBPYmplY3Rba2V5XVxyXG4gICAgICAsIGV4cCA9IGNvcmVbT0JKRUNUXVtrZXldXHJcbiAgICAgICwgZiAgID0gMFxyXG4gICAgICAsIG8gICA9IHt9O1xyXG4gICAgaWYoIWV4cCB8fCBpc05hdGl2ZShleHApKXtcclxuICAgICAgb1trZXldID0gTU9ERSA9PSAxID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcclxuICAgICAgfSA6IE1PREUgPT0gMiA/IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcclxuICAgICAgfSA6IE1PREUgPT0gMyA/IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XHJcbiAgICAgIH0gOiBNT0RFID09IDQgPyBmdW5jdGlvbihpdCwga2V5KXtcclxuICAgICAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpLCBrZXkpO1xyXG4gICAgICB9IDogZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBmbih0b09iamVjdChpdCkpO1xyXG4gICAgICB9O1xyXG4gICAgICB0cnkgeyBmbihET1QpIH1cclxuICAgICAgY2F0Y2goZSl7IGYgPSAxIH1cclxuICAgICAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiBmLCBPQkpFQ1QsIG8pO1xyXG4gICAgfVxyXG4gIH1cclxuICB3cmFwT2JqZWN0TWV0aG9kKCdmcmVlemUnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdzZWFsJywgMSk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgncHJldmVudEV4dGVuc2lvbnMnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdpc0Zyb3plbicsIDIpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2lzU2VhbGVkJywgMik7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnaXNFeHRlbnNpYmxlJywgMyk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgNCk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0UHJvdG90eXBlT2YnKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdrZXlzJyk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlOYW1lcycpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5udW1iZXIuc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihpc0ludGVnZXIpe1xyXG4gICRkZWZpbmUoU1RBVElDLCBOVU1CRVIsIHtcclxuICAgIC8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXHJcbiAgICBFUFNJTE9OOiBwb3coMiwgLTUyKSxcclxuICAgIC8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXHJcbiAgICBpc0Zpbml0ZTogZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIGlzRmluaXRlKGl0KTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcclxuICAgIGlzSW50ZWdlcjogaXNJbnRlZ2VyLFxyXG4gICAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuICAgIGlzTmFOOiBzYW1lTmFOLFxyXG4gICAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxyXG4gICAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24obnVtYmVyKXtcclxuICAgICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICAgIE1BWF9TQUZFX0lOVEVHRVI6IE1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICAvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcclxuICAgIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxyXG4gICAgLy8gMjAuMS4yLjEyIE51bWJlci5wYXJzZUZsb2F0KHN0cmluZylcclxuICAgIHBhcnNlRmxvYXQ6IHBhcnNlRmxvYXQsXHJcbiAgICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXHJcbiAgICBwYXJzZUludDogcGFyc2VJbnRcclxuICB9KTtcclxuLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbn0oTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbihpdCl7XHJcbiAgcmV0dXJuICFpc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYubWF0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFQ01BU2NyaXB0IDYgc2hpbVxyXG4hZnVuY3Rpb24oKXtcclxuICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbiAgdmFyIEUgICAgPSBNYXRoLkVcclxuICAgICwgZXhwICA9IE1hdGguZXhwXHJcbiAgICAsIGxvZyAgPSBNYXRoLmxvZ1xyXG4gICAgLCBzcXJ0ID0gTWF0aC5zcXJ0XHJcbiAgICAsIHNpZ24gPSBNYXRoLnNpZ24gfHwgZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xyXG4gICAgICB9O1xyXG4gIFxyXG4gIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuICBmdW5jdGlvbiBhc2luaCh4KXtcclxuICAgIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogbG9nKHggKyBzcXJ0KHggKiB4ICsgMSkpO1xyXG4gIH1cclxuICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG4gIGZ1bmN0aW9uIGV4cG0xKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IGV4cCh4KSAtIDE7XHJcbiAgfVxyXG4gICAgXHJcbiAgJGRlZmluZShTVEFUSUMsIE1BVEgsIHtcclxuICAgIC8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcclxuICAgIGFjb3NoOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IGlzRmluaXRlKHgpID8gbG9nKHggLyBFICsgc3FydCh4ICsgMSkgKiBzcXJ0KHggLSAxKSAvIEUpICsgMSA6IHg7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG4gICAgYXNpbmg6IGFzaW5oLFxyXG4gICAgLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxyXG4gICAgYXRhbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBsb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcclxuICAgIGNicnQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xMSBNYXRoLmNsejMyKHgpXHJcbiAgICBjbHozMjogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA+Pj49IDApID8gMzIgLSB4W1RPX1NUUklOR10oMikubGVuZ3RoIDogMzI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxyXG4gICAgY29zaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuICAgIGV4cG0xOiBleHBtMSxcclxuICAgIC8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxyXG4gICAgLy8gVE9ETzogZmFsbGJhY2sgZm9yIElFOS1cclxuICAgIGZyb3VuZDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt4XSlbMF07XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXHJcbiAgICBoeXBvdDogZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpe1xyXG4gICAgICB2YXIgc3VtICA9IDBcclxuICAgICAgICAsIGxlbjEgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCBsZW4yID0gbGVuMVxyXG4gICAgICAgICwgYXJncyA9IEFycmF5KGxlbjEpXHJcbiAgICAgICAgLCBsYXJnID0gLUluZmluaXR5XHJcbiAgICAgICAgLCBhcmc7XHJcbiAgICAgIHdoaWxlKGxlbjEtLSl7XHJcbiAgICAgICAgYXJnID0gYXJnc1tsZW4xXSA9ICthcmd1bWVudHNbbGVuMV07XHJcbiAgICAgICAgaWYoYXJnID09IEluZmluaXR5IHx8IGFyZyA9PSAtSW5maW5pdHkpcmV0dXJuIEluZmluaXR5O1xyXG4gICAgICAgIGlmKGFyZyA+IGxhcmcpbGFyZyA9IGFyZztcclxuICAgICAgfVxyXG4gICAgICBsYXJnID0gYXJnIHx8IDE7XHJcbiAgICAgIHdoaWxlKGxlbjItLSlzdW0gKz0gcG93KGFyZ3NbbGVuMl0gLyBsYXJnLCAyKTtcclxuICAgICAgcmV0dXJuIGxhcmcgKiBzcXJ0KHN1bSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxyXG4gICAgaW11bDogZnVuY3Rpb24oeCwgeSl7XHJcbiAgICAgIHZhciBVSW50MTYgPSAweGZmZmZcclxuICAgICAgICAsIHhuID0gK3hcclxuICAgICAgICAsIHluID0gK3lcclxuICAgICAgICAsIHhsID0gVUludDE2ICYgeG5cclxuICAgICAgICAsIHlsID0gVUludDE2ICYgeW47XHJcbiAgICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcclxuICAgIGxvZzFwOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogbG9nKDEgKyB4KTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxyXG4gICAgbG9nMTA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjEwO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcclxuICAgIGxvZzI6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxyXG4gICAgc2lnbjogc2lnbixcclxuICAgIC8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcclxuICAgIHNpbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKGFicyh4ID0gK3gpIDwgMSkgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMiA6IChleHAoeCAtIDEpIC0gZXhwKC14IC0gMSkpICogKEUgLyAyKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXHJcbiAgICB0YW5oOiBmdW5jdGlvbih4KXtcclxuICAgICAgdmFyIGEgPSBleHBtMSh4ID0gK3gpXHJcbiAgICAgICAgLCBiID0gZXhwbTEoLXgpO1xyXG4gICAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXHJcbiAgICB0cnVuYzogdHJ1bmNcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oZnJvbUNoYXJDb2RlKXtcclxuICBmdW5jdGlvbiBhc3NlcnROb3RSZWdFeHAoaXQpe1xyXG4gICAgaWYoY29mKGl0KSA9PSBSRUdFWFApdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgfVxyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDLCBTVFJJTkcsIHtcclxuICAgIC8vIDIxLjEuMi4yIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpXHJcbiAgICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbih4KXtcclxuICAgICAgdmFyIHJlcyA9IFtdXHJcbiAgICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCBpICAgPSAwXHJcbiAgICAgICAgLCBjb2RlXHJcbiAgICAgIHdoaWxlKGxlbiA+IGkpe1xyXG4gICAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XHJcbiAgICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XHJcbiAgICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcclxuICAgICAgICAgID8gZnJvbUNoYXJDb2RlKGNvZGUpXHJcbiAgICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXHJcbiAgICAgICAgKTtcclxuICAgICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMi40IFN0cmluZy5yYXcoY2FsbFNpdGUsIC4uLnN1YnN0aXR1dGlvbnMpXHJcbiAgICByYXc6IGZ1bmN0aW9uKGNhbGxTaXRlKXtcclxuICAgICAgdmFyIHJhdyA9IHRvT2JqZWN0KGNhbGxTaXRlLnJhdylcclxuICAgICAgICAsIGxlbiA9IHRvTGVuZ3RoKHJhdy5sZW5ndGgpXHJcbiAgICAgICAgLCBzbG4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCByZXMgPSBbXVxyXG4gICAgICAgICwgaSAgID0gMDtcclxuICAgICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgICAgcmVzLnB1c2goU3RyaW5nKHJhd1tpKytdKSk7XHJcbiAgICAgICAgaWYoaSA8IHNsbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XHJcbiAgICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAkZGVmaW5lKFBST1RPLCBTVFJJTkcsIHtcclxuICAgIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxyXG4gICAgY29kZVBvaW50QXQ6IGNyZWF0ZVBvaW50QXQoZmFsc2UpLFxyXG4gICAgLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxyXG4gICAgZW5kc1dpdGg6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHZhciB0aGF0ID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICwgbGVuID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpXHJcbiAgICAgICAgLCBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogbWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcclxuICAgICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgICByZXR1cm4gdGhhdC5zbGljZShlbmQgLSBzZWFyY2hTdHJpbmcubGVuZ3RoLCBlbmQpID09PSBzZWFyY2hTdHJpbmc7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcclxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICAgIGFzc2VydE5vdFJlZ0V4cChzZWFyY2hTdHJpbmcpO1xyXG4gICAgICByZXR1cm4gISF+U3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMy4xMyBTdHJpbmcucHJvdG90eXBlLnJlcGVhdChjb3VudClcclxuICAgIHJlcGVhdDogZnVuY3Rpb24oY291bnQpe1xyXG4gICAgICB2YXIgc3RyID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCByZXMgPSAnJ1xyXG4gICAgICAgICwgbiAgID0gdG9JbnRlZ2VyKGNvdW50KTtcclxuICAgICAgaWYoMCA+IG4gfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XHJcbiAgICAgIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcclxuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHZhciB0aGF0ICA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgaW5kZXggPSB0b0xlbmd0aChtaW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xyXG4gICAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICAgIHJldHVybiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaFN0cmluZy5sZW5ndGgpID09PSBzZWFyY2hTdHJpbmc7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0oU3RyaW5nLmZyb21DaGFyQ29kZSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5hcnJheS5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoU1RBVElDICsgRk9SQ0VEICogY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhBcnJheS5mcm9tKSwgQVJSQVksIHtcclxuICAgIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZyb206IGZ1bmN0aW9uKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcclxuICAgICAgdmFyIE8gICAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxyXG4gICAgICAgICwgbWFwZm4gICA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcclxuICAgICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXHJcbiAgICAgICAgLCBpbmRleCAgID0gMFxyXG4gICAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXA7XHJcbiAgICAgIGlmKGlzSXRlcmFibGUoTykpe1xyXG4gICAgICAgIHJlc3VsdCA9IG5ldyAoZ2VuZXJpYyh0aGlzLCBBcnJheSkpO1xyXG4gICAgICAgIHNhZmVJdGVyQ2xvc2UoZnVuY3Rpb24oaXRlcmF0b3Ipe1xyXG4gICAgICAgICAgZm9yKDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKHN0ZXAudmFsdWUsIGluZGV4KSA6IHN0ZXAudmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZ2V0SXRlcmF0b3IoTykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IG5ldyAoZ2VuZXJpYyh0aGlzLCBBcnJheSkpKGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKSk7XHJcbiAgICAgICAgZm9yKDsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xyXG4gICAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxyXG4gICAgb2Y6IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICB2YXIgaW5kZXggID0gMFxyXG4gICAgICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICwgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSkobGVuZ3RoKTtcclxuICAgICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcclxuICAgICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBzZXRTcGVjaWVzKEFycmF5KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuYXJyYXkucHJvdG90eXBlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAkZGVmaW5lKFBST1RPLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgICBjb3B5V2l0aGluOiBmdW5jdGlvbih0YXJnZXQgLyogPSAwICovLCBzdGFydCAvKiA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xyXG4gICAgICB2YXIgTyAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGxlbiAgID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICAgLCB0byAgICA9IHRvSW5kZXgodGFyZ2V0LCBsZW4pXHJcbiAgICAgICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcclxuICAgICAgICAsIGVuZCAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICAgLCBmaW4gICA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbilcclxuICAgICAgICAsIGNvdW50ID0gbWluKGZpbiAtIGZyb20sIGxlbiAtIHRvKVxyXG4gICAgICAgICwgaW5jICAgPSAxO1xyXG4gICAgICBpZihmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpe1xyXG4gICAgICAgIGluYyAgPSAtMTtcclxuICAgICAgICBmcm9tID0gZnJvbSArIGNvdW50IC0gMTtcclxuICAgICAgICB0byAgID0gdG8gKyBjb3VudCAtIDE7XHJcbiAgICAgIH1cclxuICAgICAgd2hpbGUoY291bnQtLSA+IDApe1xyXG4gICAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XHJcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XHJcbiAgICAgICAgdG8gKz0gaW5jO1xyXG4gICAgICAgIGZyb20gKz0gaW5jO1xyXG4gICAgICB9IHJldHVybiBPO1xyXG4gICAgfSxcclxuICAgIC8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxyXG4gICAgZmlsbDogZnVuY3Rpb24odmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICAgIHZhciBPICAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcclxuICAgICAgICAsIGVuZCAgICA9IGFyZ3VtZW50c1syXVxyXG4gICAgICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcclxuICAgICAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gTztcclxuICAgIH0sXHJcbiAgICAvLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmaW5kOiBjcmVhdGVBcnJheU1ldGhvZCg1KSxcclxuICAgIC8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZmluZEluZGV4OiBjcmVhdGVBcnJheU1ldGhvZCg2KVxyXG4gIH0pO1xyXG4gIFxyXG4gIGlmKGZyYW1ld29yayl7XHJcbiAgICAvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2ZpbmQsZmluZEluZGV4LGZpbGwsY29weVdpdGhpbixlbnRyaWVzLGtleXMsdmFsdWVzJyksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgQXJyYXlVbnNjb3BhYmxlc1tpdF0gPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICBTWU1CT0xfVU5TQ09QQUJMRVMgaW4gQXJyYXlQcm90byB8fCBoaWRkZW4oQXJyYXlQcm90bywgU1lNQk9MX1VOU0NPUEFCTEVTLCBBcnJheVVuc2NvcGFibGVzKTtcclxuICB9XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lml0ZXJhdG9ycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGF0KXtcclxuICAvLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXHJcbiAgLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcclxuICAvLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXHJcbiAgLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiAgZGVmaW5lU3RkSXRlcmF0b3JzKEFycmF5LCBBUlJBWSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiB0b09iamVjdChpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcclxuICAvLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxuICB9LCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICAgLCBpbmRleCA9IGl0ZXIuaSsrO1xyXG4gICAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xyXG4gICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgIHJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgfVxyXG4gICAgaWYoa2luZCA9PSBLRVkpICByZXR1cm4gaXRlclJlc3VsdCgwLCBpbmRleCk7XHJcbiAgICBpZihraW5kID09IFZBTFVFKXJldHVybiBpdGVyUmVzdWx0KDAsIE9baW5kZXhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xyXG4gIH0sIFZBTFVFKTtcclxuICBcclxuICAvLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXHJcbiAgSXRlcmF0b3JzW0FSR1VNRU5UU10gPSBJdGVyYXRvcnNbQVJSQVldO1xyXG4gIFxyXG4gIC8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxuICBkZWZpbmVTdGRJdGVyYXRvcnMoU3RyaW5nLCBTVFJJTkcsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogU3RyaW5nKGl0ZXJhdGVkKSwgaTogMH0pO1xyXG4gIC8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxuICB9LCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAgICwgaW5kZXggPSBpdGVyLmlcclxuICAgICAgLCBwb2ludDtcclxuICAgIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgcG9pbnQgPSBhdC5jYWxsKE8sIGluZGV4KTtcclxuICAgIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XHJcbiAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBwb2ludCk7XHJcbiAgfSk7XHJcbn0oY3JlYXRlUG9pbnRBdCh0cnVlKSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IHdlYi5pbW1lZGlhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIHNldEltbWVkaWF0ZSBzaGltXHJcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIGVsc2U6XHJcbmlzRnVuY3Rpb24oc2V0SW1tZWRpYXRlKSAmJiBpc0Z1bmN0aW9uKGNsZWFySW1tZWRpYXRlKSB8fCBmdW5jdGlvbihPTlJFQURZU1RBVEVDSEFOR0Upe1xyXG4gIHZhciBwb3N0TWVzc2FnZSAgICAgID0gZ2xvYmFsLnBvc3RNZXNzYWdlXHJcbiAgICAsIGFkZEV2ZW50TGlzdGVuZXIgPSBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAgLCBNZXNzYWdlQ2hhbm5lbCAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXHJcbiAgICAsIGNvdW50ZXIgICAgICAgICAgPSAwXHJcbiAgICAsIHF1ZXVlICAgICAgICAgICAgPSB7fVxyXG4gICAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcclxuICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbihmbil7XHJcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcclxuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcclxuICAgICAgaW52b2tlKGlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZGVmZXIoY291bnRlcik7XHJcbiAgICByZXR1cm4gY291bnRlcjtcclxuICB9XHJcbiAgY2xlYXJJbW1lZGlhdGUgPSBmdW5jdGlvbihpZCl7XHJcbiAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gIH1cclxuICBmdW5jdGlvbiBydW4oaWQpe1xyXG4gICAgaWYoaGFzKHF1ZXVlLCBpZCkpe1xyXG4gICAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XHJcbiAgICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgICAgIGZuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGxpc3RuZXIoZXZlbnQpe1xyXG4gICAgcnVuKGV2ZW50LmRhdGEpO1xyXG4gIH1cclxuICAvLyBOb2RlLmpzIDAuOC1cclxuICBpZihOT0RFKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBuZXh0VGljayhwYXJ0LmNhbGwocnVuLCBpZCkpO1xyXG4gICAgfVxyXG4gIC8vIE1vZGVybiBicm93c2Vycywgc2tpcCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViV29ya2Vyc1xyXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxyXG4gIH0gZWxzZSBpZihhZGRFdmVudExpc3RlbmVyICYmIGlzRnVuY3Rpb24ocG9zdE1lc3NhZ2UpICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgcG9zdE1lc3NhZ2UoaWQsICcqJyk7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xyXG4gIC8vIFdlYldvcmtlcnNcclxuICB9IGVsc2UgaWYoaXNGdW5jdGlvbihNZXNzYWdlQ2hhbm5lbCkpe1xyXG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcclxuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xyXG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xyXG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XHJcbiAgLy8gSUU4LVxyXG4gIH0gZWxzZSBpZihkb2N1bWVudCAmJiBPTlJFQURZU1RBVEVDSEFOR0UgaW4gZG9jdW1lbnRbQ1JFQVRFX0VMRU1FTlRdKCdzY3JpcHQnKSl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgaHRtbC5hcHBlbmRDaGlsZChkb2N1bWVudFtDUkVBVEVfRUxFTUVOVF0oJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIHJ1bihpZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgc2V0VGltZW91dChydW4sIDAsIGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0oJ29ucmVhZHlzdGF0ZWNoYW5nZScpO1xyXG4kZGVmaW5lKEdMT0JBTCArIEJJTkQsIHtcclxuICBzZXRJbW1lZGlhdGU6ICAgc2V0SW1tZWRpYXRlLFxyXG4gIGNsZWFySW1tZWRpYXRlOiBjbGVhckltbWVkaWF0ZVxyXG59KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnByb21pc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRVM2IHByb21pc2VzIHNoaW1cclxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2dldGlmeS9uYXRpdmUtcHJvbWlzZS1vbmx5L1xyXG4hZnVuY3Rpb24oUHJvbWlzZSwgdGVzdCl7XHJcbiAgaXNGdW5jdGlvbihQcm9taXNlKSAmJiBpc0Z1bmN0aW9uKFByb21pc2UucmVzb2x2ZSlcclxuICAmJiBQcm9taXNlLnJlc29sdmUodGVzdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKCl7fSkpID09IHRlc3RcclxuICB8fCBmdW5jdGlvbihhc2FwLCBSRUNPUkQpe1xyXG4gICAgZnVuY3Rpb24gaXNUaGVuYWJsZShpdCl7XHJcbiAgICAgIHZhciB0aGVuO1xyXG4gICAgICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XHJcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHRoZW4pID8gdGhlbiA6IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKXtcclxuICAgICAgdmFyIHJlY29yZCA9IHByb21pc2VbUkVDT1JEXVxyXG4gICAgICAgICwgY2hhaW4gID0gcmVjb3JkLmNcclxuICAgICAgICAsIGkgICAgICA9IDBcclxuICAgICAgICAsIHJlYWN0O1xyXG4gICAgICBpZihyZWNvcmQuaClyZXR1cm4gdHJ1ZTtcclxuICAgICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XHJcbiAgICAgICAgcmVhY3QgPSBjaGFpbltpKytdO1xyXG4gICAgICAgIGlmKHJlYWN0LmZhaWwgfHwgaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChyZWFjdC5QKSlyZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbm90aWZ5KHJlY29yZCwgcmVqZWN0KXtcclxuICAgICAgdmFyIGNoYWluID0gcmVjb3JkLmM7XHJcbiAgICAgIGlmKHJlamVjdCB8fCBjaGFpbi5sZW5ndGgpYXNhcChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcclxuICAgICAgICAgICwgdmFsdWUgICA9IHJlY29yZC52XHJcbiAgICAgICAgICAsIG9rICAgICAgPSByZWNvcmQucyA9PSAxXHJcbiAgICAgICAgICAsIGkgICAgICAgPSAwO1xyXG4gICAgICAgIGlmKHJlamVjdCAmJiAhaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKSl7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCFoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2UpKXtcclxuICAgICAgICAgICAgICBpZihOT0RFKXtcclxuICAgICAgICAgICAgICAgIGlmKCFwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKSl7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbm9kZS5qcyBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZihpc0Z1bmN0aW9uKGNvbnNvbGUuZXJyb3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDFlMyk7XHJcbiAgICAgICAgfSBlbHNlIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpIWZ1bmN0aW9uKHJlYWN0KXtcclxuICAgICAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXHJcbiAgICAgICAgICAgICwgcmV0LCB0aGVuO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYoY2Ipe1xyXG4gICAgICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcclxuICAgICAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xyXG4gICAgICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcihQUk9NSVNFICsgJy1jaGFpbiBjeWNsZScpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XHJcbiAgICAgICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcclxuICAgICAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICAgICAgcmVhY3QucmVqKGVycik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfShjaGFpbltpKytdKTtcclxuICAgICAgICBjaGFpbi5sZW5ndGggPSAwO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlc29sdmUodmFsdWUpe1xyXG4gICAgICB2YXIgcmVjb3JkID0gdGhpc1xyXG4gICAgICAgICwgdGhlbiwgd3JhcHBlcjtcclxuICAgICAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gICAgICByZWNvcmQuZCA9IHRydWU7XHJcbiAgICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcclxuICAgICAgICAgIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcclxuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgocmVqZWN0LCB3cmFwcGVyLCAxKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgICAgICByZWNvcmQucyA9IDE7XHJcbiAgICAgICAgICBub3RpZnkocmVjb3JkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICByZWplY3QuY2FsbCh3cmFwcGVyIHx8IHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZXJyKTsgLy8gd3JhcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpe1xyXG4gICAgICB2YXIgcmVjb3JkID0gdGhpcztcclxuICAgICAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gICAgICByZWNvcmQuZCA9IHRydWU7XHJcbiAgICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgIHJlY29yZC5zID0gMjtcclxuICAgICAgbm90aWZ5KHJlY29yZCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcclxuICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoQylbU1lNQk9MX1NQRUNJRVNdO1xyXG4gICAgICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcclxuICAgIH1cclxuICAgIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXHJcbiAgICBQcm9taXNlID0gZnVuY3Rpb24oZXhlY3V0b3Ipe1xyXG4gICAgICBhc3NlcnRGdW5jdGlvbihleGVjdXRvcik7XHJcbiAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIFByb21pc2UsIFBST01JU0UpO1xyXG4gICAgICB2YXIgcmVjb3JkID0ge1xyXG4gICAgICAgIHA6IHRoaXMsICAgICAgLy8gcHJvbWlzZVxyXG4gICAgICAgIGM6IFtdLCAgICAgICAgLy8gY2hhaW5cclxuICAgICAgICBzOiAwLCAgICAgICAgIC8vIHN0YXRlXHJcbiAgICAgICAgZDogZmFsc2UsICAgICAvLyBkb25lXHJcbiAgICAgICAgdjogdW5kZWZpbmVkLCAvLyB2YWx1ZVxyXG4gICAgICAgIGg6IGZhbHNlICAgICAgLy8gaGFuZGxlZCByZWplY3Rpb25cclxuICAgICAgfTtcclxuICAgICAgaGlkZGVuKHRoaXMsIFJFQ09SRCwgcmVjb3JkKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBleGVjdXRvcihjdHgocmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KHJlamVjdCwgcmVjb3JkLCAxKSk7XHJcbiAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICByZWplY3QuY2FsbChyZWNvcmQsIGVycik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGFzc2lnbkhpZGRlbihQcm9taXNlW1BST1RPVFlQRV0sIHtcclxuICAgICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcclxuICAgICAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xyXG4gICAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKVtDT05TVFJVQ1RPUl0pW1NZTUJPTF9TUEVDSUVTXTtcclxuICAgICAgICB2YXIgcmVhY3QgPSB7XHJcbiAgICAgICAgICBvazogICBpc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogdHJ1ZSxcclxuICAgICAgICAgIGZhaWw6IGlzRnVuY3Rpb24ob25SZWplY3RlZCkgID8gb25SZWplY3RlZCAgOiBmYWxzZVxyXG4gICAgICAgIH0gLCBQID0gcmVhY3QuUCA9IG5ldyAoUyAhPSB1bmRlZmluZWQgPyBTIDogUHJvbWlzZSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIHJlYWN0LnJlcyA9IGFzc2VydEZ1bmN0aW9uKHJlc29sdmUpO1xyXG4gICAgICAgICAgcmVhY3QucmVqID0gYXNzZXJ0RnVuY3Rpb24ocmVqZWN0KTtcclxuICAgICAgICB9KSwgcmVjb3JkID0gdGhpc1tSRUNPUkRdO1xyXG4gICAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xyXG4gICAgICAgIHJlY29yZC5zICYmIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBQO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxyXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgYXNzaWduSGlkZGVuKFByb21pc2UsIHtcclxuICAgICAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXHJcbiAgICAgIGFsbDogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgIHZhciBQcm9taXNlID0gZ2V0Q29uc3RydWN0b3IodGhpcylcclxuICAgICAgICAgICwgdmFsdWVzICA9IFtdO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBwdXNoLCB2YWx1ZXMpO1xyXG4gICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcclxuICAgICAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xyXG4gICAgICAgICAgaWYocmVtYWluaW5nKWZvckVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSwgcmVqZWN0KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXHJcbiAgICAgIHJhY2U6IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICB2YXIgUHJvbWlzZSA9IGdldENvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxyXG4gICAgICByZWplY3Q6IGZ1bmN0aW9uKHIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgcmVqZWN0KHIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcclxuICAgICAgcmVzb2x2ZTogZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHgpICYmIFJFQ09SRCBpbiB4ICYmIGdldFByb3RvdHlwZU9mKHgpID09PSB0aGlzW1BST1RPVFlQRV1cclxuICAgICAgICAgID8geCA6IG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICAgIHJlc29sdmUoeCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfShuZXh0VGljayB8fCBzZXRJbW1lZGlhdGUsIHNhZmVTeW1ib2woJ3JlY29yZCcpKTtcclxuICBzZXRUb1N0cmluZ1RhZyhQcm9taXNlLCBQUk9NSVNFKTtcclxuICBzZXRTcGVjaWVzKFByb21pc2UpO1xyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VEICogIWlzTmF0aXZlKFByb21pc2UpLCB7UHJvbWlzZTogUHJvbWlzZX0pO1xyXG59KGdsb2JhbFtQUk9NSVNFXSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5jb2xsZWN0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVDTUFTY3JpcHQgNiBjb2xsZWN0aW9ucyBzaGltXHJcbiFmdW5jdGlvbigpe1xyXG4gIHZhciBVSUQgICA9IHNhZmVTeW1ib2woJ3VpZCcpXHJcbiAgICAsIE8xICAgID0gc2FmZVN5bWJvbCgnTzEnKVxyXG4gICAgLCBXRUFLICA9IHNhZmVTeW1ib2woJ3dlYWsnKVxyXG4gICAgLCBMRUFLICA9IHNhZmVTeW1ib2woJ2xlYWsnKVxyXG4gICAgLCBMQVNUICA9IHNhZmVTeW1ib2woJ2xhc3QnKVxyXG4gICAgLCBGSVJTVCA9IHNhZmVTeW1ib2woJ2ZpcnN0JylcclxuICAgICwgU0laRSAgPSBERVNDID8gc2FmZVN5bWJvbCgnc2l6ZScpIDogJ3NpemUnXHJcbiAgICAsIHVpZCAgID0gMFxyXG4gICAgLCB0bXAgICA9IHt9O1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGdldENvbGxlY3Rpb24oQywgTkFNRSwgbWV0aG9kcywgY29tbW9uTWV0aG9kcywgaXNNYXAsIGlzV2Vhayl7XHJcbiAgICB2YXIgQURERVIgPSBpc01hcCA/ICdzZXQnIDogJ2FkZCdcclxuICAgICAgLCBwcm90byA9IEMgJiYgQ1tQUk9UT1RZUEVdXHJcbiAgICAgICwgTyAgICAgPSB7fTtcclxuICAgIGZ1bmN0aW9uIGluaXRGcm9tSXRlcmFibGUodGhhdCwgaXRlcmFibGUpe1xyXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIGlzTWFwLCB0aGF0W0FEREVSXSwgdGhhdCk7XHJcbiAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZml4U1ZaKGtleSwgY2hhaW4pe1xyXG4gICAgICB2YXIgbWV0aG9kID0gcHJvdG9ba2V5XTtcclxuICAgICAgaWYoZnJhbWV3b3JrKXByb3RvW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbWV0aG9kLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTtcclxuICAgICAgICByZXR1cm4gY2hhaW4gPyB0aGlzIDogcmVzdWx0O1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgaWYoIWlzTmF0aXZlKEMpIHx8ICEoaXNXZWFrIHx8ICghQlVHR1lfSVRFUkFUT1JTICYmIGhhcyhwcm90bywgRk9SX0VBQ0gpICYmIGhhcyhwcm90bywgJ2VudHJpZXMnKSkpKXtcclxuICAgICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcclxuICAgICAgQyA9IGlzV2Vha1xyXG4gICAgICAgID8gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICAgICAgc2V0KHRoaXMsIFVJRCwgdWlkKyspO1xyXG4gICAgICAgICAgICBpbml0RnJvbUl0ZXJhYmxlKHRoaXMsIGl0ZXJhYmxlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICA6IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGF0LCBDLCBOQU1FKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIE8xLCBjcmVhdGUobnVsbCkpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgU0laRSwgMCk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBMQVNULCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGluaXRGcm9tSXRlcmFibGUodGhhdCwgaXRlcmFibGUpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgYXNzaWduSGlkZGVuKGFzc2lnbkhpZGRlbihDW1BST1RPVFlQRV0sIG1ldGhvZHMpLCBjb21tb25NZXRob2RzKTtcclxuICAgICAgaXNXZWFrIHx8ICFERVNDIHx8IGRlZmluZVByb3BlcnR5KENbUFJPVE9UWVBFXSwgJ3NpemUnLCB7Z2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBhc3NlcnREZWZpbmVkKHRoaXNbU0laRV0pO1xyXG4gICAgICB9fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgTmF0aXZlID0gQ1xyXG4gICAgICAgICwgaW5zdCAgID0gbmV3IENcclxuICAgICAgICAsIGNoYWluICA9IGluc3RbQURERVJdKGlzV2VhayA/IHt9IDogLTAsIDEpXHJcbiAgICAgICAgLCBidWdneVplcm87XHJcbiAgICAgIC8vIHdyYXAgdG8gaW5pdCBjb2xsZWN0aW9ucyBmcm9tIGl0ZXJhYmxlXHJcbiAgICAgIGlmKGNoZWNrRGFuZ2VySXRlckNsb3NpbmcoZnVuY3Rpb24oTyl7IG5ldyBDKE8pIH0pKXtcclxuICAgICAgICBDID0gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgQywgTkFNRSk7XHJcbiAgICAgICAgICByZXR1cm4gaW5pdEZyb21JdGVyYWJsZShuZXcgTmF0aXZlLCBpdGVyYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENbUFJPVE9UWVBFXSA9IHByb3RvO1xyXG4gICAgICAgIGlmKGZyYW1ld29yaylwcm90b1tDT05TVFJVQ1RPUl0gPSBDO1xyXG4gICAgICB9XHJcbiAgICAgIGlzV2VhayB8fCBpbnN0W0ZPUl9FQUNIXShmdW5jdGlvbih2YWwsIGtleSl7XHJcbiAgICAgICAgYnVnZ3laZXJvID0gMSAvIGtleSA9PT0gLUluZmluaXR5O1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gZml4IGNvbnZlcnRpbmcgLTAga2V5IHRvICswXHJcbiAgICAgIGlmKGJ1Z2d5WmVybyl7XHJcbiAgICAgICAgZml4U1ZaKCdkZWxldGUnKTtcclxuICAgICAgICBmaXhTVlooJ2hhcycpO1xyXG4gICAgICAgIGlzTWFwICYmIGZpeFNWWignZ2V0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gKyBmaXggLmFkZCAmIC5zZXQgZm9yIGNoYWluaW5nXHJcbiAgICAgIGlmKGJ1Z2d5WmVybyB8fCBjaGFpbiAhPT0gaW5zdClmaXhTVlooQURERVIsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XHJcbiAgICBzZXRTcGVjaWVzKEMpO1xyXG4gICAgXHJcbiAgICBPW05BTUVdID0gQztcclxuICAgICRkZWZpbmUoR0xPQkFMICsgV1JBUCArIEZPUkNFRCAqICFpc05hdGl2ZShDKSwgTyk7XHJcbiAgICBcclxuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxyXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxyXG4gICAgaXNXZWFrIHx8IGRlZmluZVN0ZEl0ZXJhdG9ycyhDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgICAgIHNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGs6IGtpbmR9KTtcclxuICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAgICAgLCBlbnRyeSA9IGl0ZXIubDtcclxuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxyXG4gICAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XHJcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cclxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxyXG4gICAgICBpZihraW5kID09IEtFWSkgIHJldHVybiBpdGVyUmVzdWx0KDAsIGVudHJ5LmspO1xyXG4gICAgICBpZihraW5kID09IFZBTFVFKXJldHVybiBpdGVyUmVzdWx0KDAsIGVudHJ5LnYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7ICAgXHJcbiAgICB9LCBpc01hcCA/IEtFWStWQUxVRSA6IFZBTFVFLCAhaXNNYXApO1xyXG4gICAgXHJcbiAgICByZXR1cm4gQztcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcclxuICAgIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcclxuICAgIGlmKCFpc09iamVjdChpdCkpcmV0dXJuICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XHJcbiAgICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxyXG4gICAgaWYoaXNGcm96ZW4oaXQpKXJldHVybiAnRic7XHJcbiAgICBpZighaGFzKGl0LCBVSUQpKXtcclxuICAgICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgaWRcclxuICAgICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xyXG4gICAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcclxuICAgICAgaGlkZGVuKGl0LCBVSUQsICsrdWlkKTtcclxuICAgIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcclxuICAgIH0gcmV0dXJuICdPJyArIGl0W1VJRF07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldEVudHJ5KHRoYXQsIGtleSl7XHJcbiAgICAvLyBmYXN0IGNhc2VcclxuICAgIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XHJcbiAgICBpZihpbmRleCAhPSAnRicpcmV0dXJuIHRoYXRbTzFdW2luZGV4XTtcclxuICAgIC8vIGZyb3plbiBvYmplY3QgY2FzZVxyXG4gICAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGRlZih0aGF0LCBrZXksIHZhbHVlKXtcclxuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcclxuICAgICAgLCBwcmV2LCBpbmRleDtcclxuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxyXG4gICAgaWYoZW50cnkpZW50cnkudiA9IHZhbHVlO1xyXG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcclxuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcclxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XHJcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcclxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxyXG4gICAgICB9O1xyXG4gICAgICBpZighdGhhdFtGSVJTVF0pdGhhdFtGSVJTVF0gPSBlbnRyeTtcclxuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcclxuICAgICAgdGhhdFtTSVpFXSsrO1xyXG4gICAgICAvLyBhZGQgdG8gaW5kZXhcclxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9XHJcblxyXG4gIHZhciBjb2xsZWN0aW9uTWV0aG9kcyA9IHtcclxuICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICBjbGVhcjogZnVuY3Rpb24oKXtcclxuICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXRbTzFdLCBlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcclxuICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XHJcbiAgICAgIH1cclxuICAgICAgdGhhdFtGSVJTVF0gPSB0aGF0W0xBU1RdID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGF0W1NJWkVdID0gMDtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcclxuICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KXtcclxuICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cclxuICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XHJcbiAgICAgICAgZGVsZXRlIHRoYXRbTzFdW2VudHJ5LmldO1xyXG4gICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcclxuICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XHJcbiAgICAgICAgaWYodGhhdFtGSVJTVF0gPT0gZW50cnkpdGhhdFtGSVJTVF0gPSBuZXh0O1xyXG4gICAgICAgIGlmKHRoYXRbTEFTVF0gPT0gZW50cnkpdGhhdFtMQVNUXSA9IHByZXY7XHJcbiAgICAgICAgdGhhdFtTSVpFXS0tO1xyXG4gICAgICB9IHJldHVybiAhIWVudHJ5O1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAgICwgZW50cnk7XHJcbiAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpc1tGSVJTVF0pe1xyXG4gICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XHJcbiAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXHJcbiAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gMjMuMSBNYXAgT2JqZWN0c1xyXG4gIE1hcCA9IGdldENvbGxlY3Rpb24oTWFwLCBNQVAsIHtcclxuICAgIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhpcywga2V5KTtcclxuICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0sIGNvbGxlY3Rpb25NZXRob2RzLCB0cnVlKTtcclxuICBcclxuICAvLyAyMy4yIFNldCBPYmplY3RzXHJcbiAgU2V0ID0gZ2V0Q29sbGVjdGlvbihTZXQsIFNFVCwge1xyXG4gICAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgY29sbGVjdGlvbk1ldGhvZHMpO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGRlZldlYWsodGhhdCwga2V5LCB2YWx1ZSl7XHJcbiAgICBpZihpc0Zyb3plbihhc3NlcnRPYmplY3Qoa2V5KSkpbGVha1N0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICBoYXMoa2V5LCBXRUFLKSB8fCBoaWRkZW4oa2V5LCBXRUFLLCB7fSk7XHJcbiAgICAgIGtleVtXRUFLXVt0aGF0W1VJRF1dID0gdmFsdWU7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH1cclxuICBmdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XHJcbiAgICByZXR1cm4gdGhhdFtMRUFLXSB8fCBoaWRkZW4odGhhdCwgTEVBSywgbmV3IE1hcClbTEVBS107XHJcbiAgfVxyXG4gIFxyXG4gIHZhciB3ZWFrTWV0aG9kcyA9IHtcclxuICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XHJcbiAgICAgIHJldHVybiBoYXMoa2V5LCBXRUFLKSAmJiBoYXMoa2V5W1dFQUtdLCB0aGlzW1VJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tVSURdXTtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcclxuICAgICAgcmV0dXJuIGhhcyhrZXksIFdFQUspICYmIGhhcyhrZXlbV0VBS10sIHRoaXNbVUlEXSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICAvLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xyXG4gIFdlYWtNYXAgPSBnZXRDb2xsZWN0aW9uKFdlYWtNYXAsIFdFQUtNQVAsIHtcclxuICAgIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKGlzT2JqZWN0KGtleSkpe1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5nZXQoa2V5KTtcclxuICAgICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbVUlEXV07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyAyMy4zLjMuNSBXZWFrTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWZXZWFrKHRoaXMsIGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0sIHdlYWtNZXRob2RzLCB0cnVlLCB0cnVlKTtcclxuICBcclxuICAvLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XHJcbiAgaWYoZnJhbWV3b3JrICYmIG5ldyBXZWFrTWFwKCkuc2V0KE9iamVjdC5mcmVlemUodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2RlbGV0ZSxoYXMsZ2V0LHNldCcpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgbWV0aG9kID0gV2Vha01hcFtQUk9UT1RZUEVdW2tleV07XHJcbiAgICAgIFdlYWtNYXBbUFJPVE9UWVBFXVtrZXldID0gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gbGVha3kgbWFwXHJcbiAgICAgICAgaWYoaXNPYmplY3QoYSkgJiYgaXNGcm96ZW4oYSkpe1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGxlYWtTdG9yZSh0aGlzKVtrZXldKGEsIGIpO1xyXG4gICAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXHJcbiAgICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcclxuICBXZWFrU2V0ID0gZ2V0Q29sbGVjdGlvbihXZWFrU2V0LCBXRUFLU0VULCB7XHJcbiAgICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZldlYWsodGhpcywgdmFsdWUsIHRydWUpO1xyXG4gICAgfVxyXG4gIH0sIHdlYWtNZXRob2RzLCBmYWxzZSwgdHJ1ZSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnJlZmxlY3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgZnVuY3Rpb24gRW51bWVyYXRlKGl0ZXJhdGVkKXtcclxuICAgIHZhciBrZXlzID0gW10sIGtleTtcclxuICAgIGZvcihrZXkgaW4gaXRlcmF0ZWQpa2V5cy5wdXNoKGtleSk7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBhOiBrZXlzLCBpOiAwfSk7XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKEVudW1lcmF0ZSwgT0JKRUNULCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAgICwga2V5cyA9IGl0ZXIuYVxyXG4gICAgICAsIGtleTtcclxuICAgIGRvIHtcclxuICAgICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XHJcbiAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBrZXkpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHdyYXAoZm4pe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpLCB0cnVlO1xyXG4gICAgICB9IGNhdGNoKGUpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiByZWZsZWN0R2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXVxyXG4gICAgICAsIGRlc2MgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSksIHByb3RvO1xyXG4gICAgaWYoZGVzYylyZXR1cm4gaGFzKGRlc2MsICd2YWx1ZScpXHJcbiAgICAgID8gZGVzYy52YWx1ZVxyXG4gICAgICA6IGRlc2MuZ2V0ID09PSB1bmRlZmluZWRcclxuICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XHJcbiAgICByZXR1cm4gaXNPYmplY3QocHJvdG8gPSBnZXRQcm90b3R5cGVPZih0YXJnZXQpKVxyXG4gICAgICA/IHJlZmxlY3RHZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcilcclxuICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlZmxlY3RTZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcclxuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXHJcbiAgICAgICwgb3duRGVzYyAgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcclxuICAgICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xyXG4gICAgaWYoIW93bkRlc2Mpe1xyXG4gICAgICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKXtcclxuICAgICAgICByZXR1cm4gcmVmbGVjdFNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcclxuICAgICAgfVxyXG4gICAgICBvd25EZXNjID0gZGVzY3JpcHRvcigwKTtcclxuICAgIH1cclxuICAgIGlmKGhhcyhvd25EZXNjLCAndmFsdWUnKSl7XHJcbiAgICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnZXRPd25EZXNjcmlwdG9yKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgZGVzY3JpcHRvcigwKTtcclxuICAgICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKSwgdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gZmFsc2VcclxuICAgICAgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xyXG4gIH1cclxuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCByZXR1cm5JdDtcclxuICBcclxuICB2YXIgcmVmbGVjdCA9IHtcclxuICAgIC8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxyXG4gICAgYXBwbHk6IGN0eChjYWxsLCBhcHBseSwgMyksXHJcbiAgICAvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXHJcbiAgICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uKHRhcmdldCwgYXJndW1lbnRzTGlzdCAvKiwgbmV3VGFyZ2V0Ki8pe1xyXG4gICAgICB2YXIgcHJvdG8gICAgPSBhc3NlcnRGdW5jdGlvbihhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXSlbUFJPVE9UWVBFXVxyXG4gICAgICAgICwgaW5zdGFuY2UgPSBjcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3RQcm90bylcclxuICAgICAgICAsIHJlc3VsdCAgID0gYXBwbHkuY2FsbCh0YXJnZXQsIGluc3RhbmNlLCBhcmd1bWVudHNMaXN0KTtcclxuICAgICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxyXG4gICAgZGVmaW5lUHJvcGVydHk6IHdyYXAoZGVmaW5lUHJvcGVydHkpLFxyXG4gICAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICAgIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgdmFyIGRlc2MgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS41IFJlZmxlY3QuZW51bWVyYXRlKHRhcmdldClcclxuICAgIGVudW1lcmF0ZTogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcclxuICAgIGdldDogcmVmbGVjdEdldCxcclxuICAgIC8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgcmV0dXJuIGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXHJcbiAgICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuIGdldFByb3RvdHlwZU9mKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICAgIGhhczogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXHJcbiAgICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICAgIHJldHVybiAhIWlzRXh0ZW5zaWJsZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxyXG4gICAgb3duS2V5czogb3duS2V5cyxcclxuICAgIC8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXHJcbiAgICBwcmV2ZW50RXh0ZW5zaW9uczogd3JhcChPYmplY3QucHJldmVudEV4dGVuc2lvbnMgfHwgcmV0dXJuSXQpLFxyXG4gICAgLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcclxuICAgIHNldDogcmVmbGVjdFNldFxyXG4gIH1cclxuICAvLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcclxuICBpZihzZXRQcm90b3R5cGVPZilyZWZsZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24odGFyZ2V0LCBwcm90byl7XHJcbiAgICByZXR1cm4gc2V0UHJvdG90eXBlT2YoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3RvKSwgdHJ1ZTtcclxuICB9O1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMLCB7UmVmbGVjdDoge319KTtcclxuICAkZGVmaW5lKFNUQVRJQywgJ1JlZmxlY3QnLCByZWZsZWN0KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczcucHJvcG9zYWxzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAkZGVmaW5lKFBST1RPLCBBUlJBWSwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXHJcbiAgICBpbmNsdWRlczogY3JlYXRlQXJyYXlDb250YWlucyh0cnVlKVxyXG4gIH0pO1xyXG4gICRkZWZpbmUoUFJPVE8sIFNUUklORywge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5hdFxyXG4gICAgYXQ6IGNyZWF0ZVBvaW50QXQodHJ1ZSlcclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RUb0FycmF5KGlzRW50cmllcyl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIGtleXMgICA9IGdldEtleXMob2JqZWN0KVxyXG4gICAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgICAsIGkgICAgICA9IDBcclxuICAgICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcclxuICAgICAgICAsIGtleTtcclxuICAgICAgaWYoaXNFbnRyaWVzKXdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gW2tleSA9IGtleXNbaSsrXSwgT1trZXldXTtcclxuICAgICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgJGRlZmluZShTVEFUSUMsIE9CSkVDVCwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vV2ViUmVmbGVjdGlvbi85MzUzNzgxXHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwgcmVzdWx0ID0ge307XHJcbiAgICAgIGZvckVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIGRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKDAsIGdldE93bkRlc2NyaXB0b3IoTywga2V5KSkpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcndhbGRyb24vdGMzOS1ub3Rlcy9ibG9iL21hc3Rlci9lczYvMjAxNC0wNC9hcHItOS5tZCM1MS1vYmplY3RlbnRyaWVzLW9iamVjdHZhbHVlc1xyXG4gICAgdmFsdWVzOiAgY3JlYXRlT2JqZWN0VG9BcnJheShmYWxzZSksXHJcbiAgICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXHJcbiAgfSk7XHJcbiAgJGRlZmluZShTVEFUSUMsIFJFR0VYUCwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20va2FuZ2F4Lzk2OTgxMDBcclxuICAgIGVzY2FwZTogY3JlYXRlUmVwbGFjZXIoLyhbXFxcXFxcLVtcXF17fSgpKis/LixeJHxdKS9nLCAnXFxcXCQxJywgdHJ1ZSlcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczcuYWJzdHJhY3QtcmVmcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1hYnN0cmFjdC1yZWZzXHJcbiFmdW5jdGlvbihSRUZFUkVOQ0Upe1xyXG4gIFJFRkVSRU5DRV9HRVQgPSBnZXRXZWxsS25vd25TeW1ib2woUkVGRVJFTkNFKydHZXQnLCB0cnVlKTtcclxuICB2YXIgUkVGRVJFTkNFX1NFVCA9IGdldFdlbGxLbm93blN5bWJvbChSRUZFUkVOQ0UrU0VULCB0cnVlKVxyXG4gICAgLCBSRUZFUkVOQ0VfREVMRVRFID0gZ2V0V2VsbEtub3duU3ltYm9sKFJFRkVSRU5DRSsnRGVsZXRlJywgdHJ1ZSk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIFNZTUJPTCwge1xyXG4gICAgcmVmZXJlbmNlR2V0OiBSRUZFUkVOQ0VfR0VULFxyXG4gICAgcmVmZXJlbmNlU2V0OiBSRUZFUkVOQ0VfU0VULFxyXG4gICAgcmVmZXJlbmNlRGVsZXRlOiBSRUZFUkVOQ0VfREVMRVRFXHJcbiAgfSk7XHJcbiAgXHJcbiAgaGlkZGVuKEZ1bmN0aW9uUHJvdG8sIFJFRkVSRU5DRV9HRVQsIHJldHVyblRoaXMpO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHNldE1hcE1ldGhvZHMoQ29uc3RydWN0b3Ipe1xyXG4gICAgaWYoQ29uc3RydWN0b3Ipe1xyXG4gICAgICB2YXIgTWFwUHJvdG8gPSBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdO1xyXG4gICAgICBoaWRkZW4oTWFwUHJvdG8sIFJFRkVSRU5DRV9HRVQsIE1hcFByb3RvLmdldCk7XHJcbiAgICAgIGhpZGRlbihNYXBQcm90bywgUkVGRVJFTkNFX1NFVCwgTWFwUHJvdG8uc2V0KTtcclxuICAgICAgaGlkZGVuKE1hcFByb3RvLCBSRUZFUkVOQ0VfREVMRVRFLCBNYXBQcm90b1snZGVsZXRlJ10pO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZXRNYXBNZXRob2RzKE1hcCk7XHJcbiAgc2V0TWFwTWV0aG9kcyhXZWFrTWFwKTtcclxufSgncmVmZXJlbmNlJyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZGljdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihESUNUKXtcclxuICBEaWN0ID0gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgdmFyIGRpY3QgPSBjcmVhdGUobnVsbCk7XHJcbiAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICBpZihpc0l0ZXJhYmxlKGl0ZXJhYmxlKSl7XHJcbiAgICAgICAgZm9yT2YoaXRlcmFibGUsIHRydWUsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBhc3NpZ24oZGljdCwgaXRlcmFibGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpY3Q7XHJcbiAgfVxyXG4gIERpY3RbUFJPVE9UWVBFXSA9IG51bGw7XHJcbiAgXHJcbiAgZnVuY3Rpb24gRGljdEl0ZXJhdG9yKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogdG9PYmplY3QoaXRlcmF0ZWQpLCBhOiBnZXRLZXlzKGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihEaWN0SXRlcmF0b3IsIERJQ1QsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBPICAgID0gaXRlci5vXHJcbiAgICAgICwga2V5cyA9IGl0ZXIuYVxyXG4gICAgICAsIGtpbmQgPSBpdGVyLmtcclxuICAgICAgLCBrZXk7XHJcbiAgICBkbyB7XHJcbiAgICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aCl7XHJcbiAgICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlKCFoYXMoTywga2V5ID0ga2V5c1tpdGVyLmkrK10pKTtcclxuICAgIGlmKGtpbmQgPT0gS0VZKSAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwga2V5KTtcclxuICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgT1trZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2tleSwgT1trZXldXSk7XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdEl0ZXIoa2luZCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gbmV3IERpY3RJdGVyYXRvcihpdCwga2luZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgICogMCAtPiBmb3JFYWNoXHJcbiAgICogMSAtPiBtYXBcclxuICAgKiAyIC0+IGZpbHRlclxyXG4gICAqIDMgLT4gc29tZVxyXG4gICAqIDQgLT4gZXZlcnlcclxuICAgKiA1IC0+IGZpbmRcclxuICAgKiA2IC0+IGZpbmRLZXlcclxuICAgKiA3IC0+IG1hcFBhaXJzXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdE1ldGhvZCh0eXBlKXtcclxuICAgIHZhciBpc01hcCAgICA9IHR5cGUgPT0gMVxyXG4gICAgICAsIGlzRXZlcnkgID0gdHlwZSA9PSA0O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2tmbiwgdGhhdCAvKiA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgIHZhciBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcclxuICAgICAgICAsIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIHJlc3VsdCA9IGlzTWFwIHx8IHR5cGUgPT0gNyB8fCB0eXBlID09IDIgPyBuZXcgKGdlbmVyaWModGhpcywgRGljdCkpIDogdW5kZWZpbmVkXHJcbiAgICAgICAgLCBrZXksIHZhbCwgcmVzO1xyXG4gICAgICBmb3Ioa2V5IGluIE8paWYoaGFzKE8sIGtleSkpe1xyXG4gICAgICAgIHZhbCA9IE9ba2V5XTtcclxuICAgICAgICByZXMgPSBmKHZhbCwga2V5LCBvYmplY3QpO1xyXG4gICAgICAgIGlmKHR5cGUpe1xyXG4gICAgICAgICAgaWYoaXNNYXApcmVzdWx0W2tleV0gPSByZXM7ICAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJlc3VsdFtrZXldID0gdmFsOyBicmVhayAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgIC8vIHNvbWVcclxuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAvLyBmaW5kXHJcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGtleTsgICAgICAgICAgICAgICAgICAgLy8gZmluZEtleVxyXG4gICAgICAgICAgICBjYXNlIDc6IHJlc3VsdFtyZXNbMF1dID0gcmVzWzFdOyAgICAgIC8vIG1hcFBhaXJzXHJcbiAgICAgICAgICB9IGVsc2UgaWYoaXNFdmVyeSlyZXR1cm4gZmFsc2U7ICAgICAgICAgLy8gZXZlcnlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHR5cGUgPT0gMyB8fCBpc0V2ZXJ5ID8gaXNFdmVyeSA6IHJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdFJlZHVjZShpc1R1cm4pe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgbWFwZm4sIGluaXQpe1xyXG4gICAgICBhc3NlcnRGdW5jdGlvbihtYXBmbik7XHJcbiAgICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXHJcbiAgICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgbWVtbywga2V5LCByZXN1bHQ7XHJcbiAgICAgIGlmKGlzVHVybiltZW1vID0gaW5pdCA9PSB1bmRlZmluZWQgPyBuZXcgKGdlbmVyaWModGhpcywgRGljdCkpIDogT2JqZWN0KGluaXQpO1xyXG4gICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAzKXtcclxuICAgICAgICBhc3NlcnQobGVuZ3RoLCBSRURVQ0VfRVJST1IpO1xyXG4gICAgICAgIG1lbW8gPSBPW2tleXNbaSsrXV07XHJcbiAgICAgIH0gZWxzZSBtZW1vID0gT2JqZWN0KGluaXQpO1xyXG4gICAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBrZXlzW2krK10pKXtcclxuICAgICAgICByZXN1bHQgPSBtYXBmbihtZW1vLCBPW2tleV0sIGtleSwgb2JqZWN0KTtcclxuICAgICAgICBpZihpc1R1cm4pe1xyXG4gICAgICAgICAgaWYocmVzdWx0ID09PSBmYWxzZSlicmVhaztcclxuICAgICAgICB9IGVsc2UgbWVtbyA9IHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVtbztcclxuICAgIH1cclxuICB9XHJcbiAgdmFyIGZpbmRLZXkgPSBjcmVhdGVEaWN0TWV0aG9kKDYpO1xyXG4gIGZ1bmN0aW9uIGluY2x1ZGVzKG9iamVjdCwgZWwpe1xyXG4gICAgcmV0dXJuIChlbCA9PSBlbCA/IGtleU9mKG9iamVjdCwgZWwpIDogZmluZEtleShvYmplY3QsIHNhbWVOYU4pKSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBcclxuICB2YXIgZGljdE1ldGhvZHMgPSB7XHJcbiAgICBrZXlzOiAgICBjcmVhdGVEaWN0SXRlcihLRVkpLFxyXG4gICAgdmFsdWVzOiAgY3JlYXRlRGljdEl0ZXIoVkFMVUUpLFxyXG4gICAgZW50cmllczogY3JlYXRlRGljdEl0ZXIoS0VZK1ZBTFVFKSxcclxuICAgIGZvckVhY2g6IGNyZWF0ZURpY3RNZXRob2QoMCksXHJcbiAgICBtYXA6ICAgICBjcmVhdGVEaWN0TWV0aG9kKDEpLFxyXG4gICAgZmlsdGVyOiAgY3JlYXRlRGljdE1ldGhvZCgyKSxcclxuICAgIHNvbWU6ICAgIGNyZWF0ZURpY3RNZXRob2QoMyksXHJcbiAgICBldmVyeTogICBjcmVhdGVEaWN0TWV0aG9kKDQpLFxyXG4gICAgZmluZDogICAgY3JlYXRlRGljdE1ldGhvZCg1KSxcclxuICAgIGZpbmRLZXk6IGZpbmRLZXksXHJcbiAgICBtYXBQYWlyczpjcmVhdGVEaWN0TWV0aG9kKDcpLFxyXG4gICAgcmVkdWNlOiAgY3JlYXRlRGljdFJlZHVjZShmYWxzZSksXHJcbiAgICB0dXJuOiAgICBjcmVhdGVEaWN0UmVkdWNlKHRydWUpLFxyXG4gICAga2V5T2Y6ICAga2V5T2YsXHJcbiAgICBpbmNsdWRlczppbmNsdWRlcyxcclxuICAgIC8vIEhhcyAvIGdldCAvIHNldCBvd24gcHJvcGVydHlcclxuICAgIGhhczogaGFzLFxyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBzZXQ6IGNyZWF0ZURlZmluZXIoMCksXHJcbiAgICBpc0RpY3Q6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiBnZXRQcm90b3R5cGVPZihpdCkgPT09IERpY3RbUFJPVE9UWVBFXTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIGlmKFJFRkVSRU5DRV9HRVQpZm9yKHZhciBrZXkgaW4gZGljdE1ldGhvZHMpIWZ1bmN0aW9uKGZuKXtcclxuICAgIGZ1bmN0aW9uIG1ldGhvZCgpe1xyXG4gICAgICBmb3IodmFyIGFyZ3MgPSBbdGhpc10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDspYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBmbltSRUZFUkVOQ0VfR0VUXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBtZXRob2Q7XHJcbiAgICB9XHJcbiAgfShkaWN0TWV0aG9kc1trZXldKTtcclxuICBcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge0RpY3Q6IGFzc2lnbkhpZGRlbihEaWN0LCBkaWN0TWV0aG9kcyl9KTtcclxufSgnRGljdCcpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLiRmb3IgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oRU5UUklFUywgRk4peyAgXHJcbiAgZnVuY3Rpb24gJGZvcihpdGVyYWJsZSwgZW50cmllcyl7XHJcbiAgICBpZighKHRoaXMgaW5zdGFuY2VvZiAkZm9yKSlyZXR1cm4gbmV3ICRmb3IoaXRlcmFibGUsIGVudHJpZXMpO1xyXG4gICAgdGhpc1tJVEVSXSAgICA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcclxuICAgIHRoaXNbRU5UUklFU10gPSAhIWVudHJpZXM7XHJcbiAgfVxyXG4gIFxyXG4gIGNyZWF0ZUl0ZXJhdG9yKCRmb3IsICdXcmFwcGVyJywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW0lURVJdLm5leHQoKTtcclxuICB9KTtcclxuICB2YXIgJGZvclByb3RvID0gJGZvcltQUk9UT1RZUEVdO1xyXG4gIHNldEl0ZXJhdG9yKCRmb3JQcm90bywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW0lURVJdOyAvLyB1bndyYXBcclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbkl0ZXJhdG9yKG5leHQpe1xyXG4gICAgZnVuY3Rpb24gSXRlcihJLCBmbiwgdGhhdCl7XHJcbiAgICAgIHRoaXNbSVRFUl0gICAgPSBnZXRJdGVyYXRvcihJKTtcclxuICAgICAgdGhpc1tFTlRSSUVTXSA9IElbRU5UUklFU107XHJcbiAgICAgIHRoaXNbRk5dICAgICAgPSBjdHgoZm4sIHRoYXQsIElbRU5UUklFU10gPyAyIDogMSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVJdGVyYXRvcihJdGVyLCAnQ2hhaW4nLCBuZXh0LCAkZm9yUHJvdG8pO1xyXG4gICAgc2V0SXRlcmF0b3IoSXRlcltQUk9UT1RZUEVdLCByZXR1cm5UaGlzKTsgLy8gb3ZlcnJpZGUgJGZvclByb3RvIGl0ZXJhdG9yXHJcbiAgICByZXR1cm4gSXRlcjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIE1hcEl0ZXIgPSBjcmVhdGVDaGFpbkl0ZXJhdG9yKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyUmVzdWx0KDAsIHN0ZXBDYWxsKHRoaXNbRk5dLCBzdGVwLnZhbHVlLCB0aGlzW0VOVFJJRVNdKSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgdmFyIEZpbHRlckl0ZXIgPSBjcmVhdGVDaGFpbkl0ZXJhdG9yKGZ1bmN0aW9uKCl7XHJcbiAgICBmb3IoOzspe1xyXG4gICAgICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gICAgICBpZihzdGVwLmRvbmUgfHwgc3RlcENhbGwodGhpc1tGTl0sIHN0ZXAudmFsdWUsIHRoaXNbRU5UUklFU10pKXJldHVybiBzdGVwO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIGFzc2lnbkhpZGRlbigkZm9yUHJvdG8sIHtcclxuICAgIG9mOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIGZvck9mKHRoaXMsIHRoaXNbRU5UUklFU10sIGZuLCB0aGF0KTtcclxuICAgIH0sXHJcbiAgICBhcnJheTogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgIGZvck9mKGZuICE9IHVuZGVmaW5lZCA/IHRoaXMubWFwKGZuLCB0aGF0KSA6IHRoaXMsIGZhbHNlLCBwdXNoLCByZXN1bHQpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIGZpbHRlcjogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICByZXR1cm4gbmV3IEZpbHRlckl0ZXIodGhpcywgZm4sIHRoYXQpO1xyXG4gICAgfSxcclxuICAgIG1hcDogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICByZXR1cm4gbmV3IE1hcEl0ZXIodGhpcywgZm4sIHRoYXQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRmb3IuaXNJdGVyYWJsZSAgPSBpc0l0ZXJhYmxlO1xyXG4gICRmb3IuZ2V0SXRlcmF0b3IgPSBnZXRJdGVyYXRvcjtcclxuICBcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwgeyRmb3I6ICRmb3J9KTtcclxufSgnZW50cmllcycsIHNhZmVTeW1ib2woJ2ZuJykpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmRlbGF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBodHRwczovL2VzZGlzY3Vzcy5vcmcvdG9waWMvcHJvbWlzZS1yZXR1cm5pbmctZGVsYXktZnVuY3Rpb25cclxuJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtcclxuICBkZWxheTogZnVuY3Rpb24odGltZSl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSwgdHJ1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmJpbmRpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oXywgdG9Mb2NhbGVTdHJpbmcpe1xyXG4gIC8vIFBsYWNlaG9sZGVyXHJcbiAgY29yZS5fID0gcGF0aC5fID0gcGF0aC5fIHx8IHt9O1xyXG5cclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBGVU5DVElPTiwge1xyXG4gICAgcGFydDogcGFydCxcclxuICAgIG9ubHk6IGZ1bmN0aW9uKG51bWJlckFyZ3VtZW50cywgdGhhdCAvKiA9IEAgKi8pe1xyXG4gICAgICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICAgICAsIG4gICAgICA9IHRvTGVuZ3RoKG51bWJlckFyZ3VtZW50cylcclxuICAgICAgICAsIGlzVGhhdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IG1pbihuLCBhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgLCBhcmdzICAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAgICAgICAsIGkgICAgICA9IDA7XHJcbiAgICAgICAgd2hpbGUobGVuZ3RoID4gaSlhcmdzW2ldID0gYXJndW1lbnRzW2krK107XHJcbiAgICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgaXNUaGF0ID8gdGhhdCA6IHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gdGllKGtleSl7XHJcbiAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICwgYm91bmQgPSB7fTtcclxuICAgIHJldHVybiBoaWRkZW4odGhhdCwgXywgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoa2V5ID09PSB1bmRlZmluZWQgfHwgIShrZXkgaW4gdGhhdCkpcmV0dXJuIHRvTG9jYWxlU3RyaW5nLmNhbGwodGhhdCk7XHJcbiAgICAgIHJldHVybiBoYXMoYm91bmQsIGtleSkgPyBib3VuZFtrZXldIDogKGJvdW5kW2tleV0gPSBjdHgodGhhdFtrZXldLCB0aGF0LCAtMSkpO1xyXG4gICAgfSlbX10oa2V5KTtcclxuICB9XHJcbiAgXHJcbiAgaGlkZGVuKHBhdGguXywgVE9fU1RSSU5HLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIF87XHJcbiAgfSk7XHJcbiAgXHJcbiAgaGlkZGVuKE9iamVjdFByb3RvLCBfLCB0aWUpO1xyXG4gIERFU0MgfHwgaGlkZGVuKEFycmF5UHJvdG8sIF8sIHRpZSk7XHJcbiAgLy8gSUU4LSBkaXJ0eSBoYWNrIC0gcmVkZWZpbmVkIHRvTG9jYWxlU3RyaW5nIGlzIG5vdCBlbnVtZXJhYmxlXHJcbn0oREVTQyA/IHVpZCgndGllJykgOiBUT19MT0NBTEUsIE9iamVjdFByb3RvW1RPX0xPQ0FMRV0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLm9iamVjdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICBmdW5jdGlvbiBkZWZpbmUodGFyZ2V0LCBtaXhpbil7XHJcbiAgICB2YXIga2V5cyAgID0gb3duS2V5cyh0b09iamVjdChtaXhpbikpXHJcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgLCBpID0gMCwga2V5O1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaSlkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSA9IGtleXNbaSsrXSwgZ2V0T3duRGVzY3JpcHRvcihtaXhpbiwga2V5KSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG4gIH07XHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQsIE9CSkVDVCwge1xyXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxyXG4gICAgY2xhc3NvZjogY2xhc3NvZixcclxuICAgIGRlZmluZTogZGVmaW5lLFxyXG4gICAgbWFrZTogZnVuY3Rpb24ocHJvdG8sIG1peGluKXtcclxuICAgICAgcmV0dXJuIGRlZmluZShjcmVhdGUocHJvdG8pLCBtaXhpbik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5hcnJheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJGRlZmluZShQUk9UTyArIEZPUkNFRCwgQVJSQVksIHtcclxuICB0dXJuOiBmdW5jdGlvbihmbiwgdGFyZ2V0IC8qID0gW10gKi8pe1xyXG4gICAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xyXG4gICAgdmFyIG1lbW8gICA9IHRhcmdldCA9PSB1bmRlZmluZWQgPyBbXSA6IE9iamVjdCh0YXJnZXQpXHJcbiAgICAgICwgTyAgICAgID0gRVM1T2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMDtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKGZuKG1lbW8sIE9baW5kZXhdLCBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpYnJlYWs7XHJcbiAgICByZXR1cm4gbWVtbztcclxuICB9XHJcbn0pO1xyXG5pZihmcmFtZXdvcmspQXJyYXlVbnNjb3BhYmxlcy50dXJuID0gdHJ1ZTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5udW1iZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKG51bWJlck1ldGhvZHMpeyAgXHJcbiAgZnVuY3Rpb24gTnVtYmVySXRlcmF0b3IoaXRlcmF0ZWQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtsOiB0b0xlbmd0aChpdGVyYXRlZCksIGk6IDB9KTtcclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoTnVtYmVySXRlcmF0b3IsIE5VTUJFUiwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIGkgICAgPSBpdGVyLmkrKztcclxuICAgIHJldHVybiBpIDwgaXRlci5sID8gaXRlclJlc3VsdCgwLCBpKSA6IGl0ZXJSZXN1bHQoMSk7XHJcbiAgfSk7XHJcbiAgZGVmaW5lSXRlcmF0b3IoTnVtYmVyLCBOVU1CRVIsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gbmV3IE51bWJlckl0ZXJhdG9yKHRoaXMpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG51bWJlck1ldGhvZHMucmFuZG9tID0gZnVuY3Rpb24obGltIC8qID0gMCAqLyl7XHJcbiAgICB2YXIgYSA9ICt0aGlzXHJcbiAgICAgICwgYiA9IGxpbSA9PSB1bmRlZmluZWQgPyAwIDogK2xpbVxyXG4gICAgICAsIG0gPSBtaW4oYSwgYik7XHJcbiAgICByZXR1cm4gcmFuZG9tKCkgKiAobWF4KGEsIGIpIC0gbSkgKyBtO1xyXG4gIH07XHJcblxyXG4gIGZvckVhY2guY2FsbChhcnJheShcclxuICAgICAgLy8gRVMzOlxyXG4gICAgICAncm91bmQsZmxvb3IsY2VpbCxhYnMsc2luLGFzaW4sY29zLGFjb3MsdGFuLGF0YW4sZXhwLHNxcnQsbWF4LG1pbixwb3csYXRhbjIsJyArXHJcbiAgICAgIC8vIEVTNjpcclxuICAgICAgJ2Fjb3NoLGFzaW5oLGF0YW5oLGNicnQsY2x6MzIsY29zaCxleHBtMSxoeXBvdCxpbXVsLGxvZzFwLGxvZzEwLGxvZzIsc2lnbixzaW5oLHRhbmgsdHJ1bmMnXHJcbiAgICApLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZm4gPSBNYXRoW2tleV07XHJcbiAgICAgIGlmKGZuKW51bWJlck1ldGhvZHNba2V5XSA9IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICAgIC8vIGllOS0gZG9udCBzdXBwb3J0IHN0cmljdCBtb2RlICYgY29udmVydCBgdGhpc2AgdG8gb2JqZWN0IC0+IGNvbnZlcnQgaXQgdG8gbnVtYmVyXHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbK3RoaXNdXHJcbiAgICAgICAgICAsIGkgICAgPSAwO1xyXG4gICAgICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIFxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIE5VTUJFUiwgbnVtYmVyTWV0aG9kcyk7XHJcbn0oe30pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLnN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICB2YXIgZXNjYXBlSFRNTERpY3QgPSB7XHJcbiAgICAnJic6ICcmYW1wOycsXHJcbiAgICAnPCc6ICcmbHQ7JyxcclxuICAgICc+JzogJyZndDsnLFxyXG4gICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICBcIidcIjogJyZhcG9zOydcclxuICB9LCB1bmVzY2FwZUhUTUxEaWN0ID0ge30sIGtleTtcclxuICBmb3Ioa2V5IGluIGVzY2FwZUhUTUxEaWN0KXVuZXNjYXBlSFRNTERpY3RbZXNjYXBlSFRNTERpY3Rba2V5XV0gPSBrZXk7XHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgU1RSSU5HLCB7XHJcbiAgICBlc2NhcGVIVE1MOiAgIGNyZWF0ZVJlcGxhY2VyKC9bJjw+XCInXS9nLCBlc2NhcGVIVE1MRGljdCksXHJcbiAgICB1bmVzY2FwZUhUTUw6IGNyZWF0ZVJlcGxhY2VyKC8mKD86YW1wfGx0fGd0fHF1b3R8YXBvcyk7L2csIHVuZXNjYXBlSFRNTERpY3QpXHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5kYXRlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGZvcm1hdFJlZ0V4cCwgZmxleGlvUmVnRXhwLCBsb2NhbGVzLCBjdXJyZW50LCBTRUNPTkRTLCBNSU5VVEVTLCBIT1VSUywgTU9OVEgsIFlFQVIpe1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUZvcm1hdChwcmVmaXgpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRlbXBsYXRlLCBsb2NhbGUgLyogPSBjdXJyZW50ICovKXtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICAgICAgLCBkaWN0ID0gbG9jYWxlc1toYXMobG9jYWxlcywgbG9jYWxlKSA/IGxvY2FsZSA6IGN1cnJlbnRdO1xyXG4gICAgICBmdW5jdGlvbiBnZXQodW5pdCl7XHJcbiAgICAgICAgcmV0dXJuIHRoYXRbcHJlZml4ICsgdW5pdF0oKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gU3RyaW5nKHRlbXBsYXRlKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24ocGFydCl7XHJcbiAgICAgICAgc3dpdGNoKHBhcnQpe1xyXG4gICAgICAgICAgY2FzZSAncycgIDogcmV0dXJuIGdldChTRUNPTkRTKTsgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMC01OVxyXG4gICAgICAgICAgY2FzZSAnc3MnIDogcmV0dXJuIGx6KGdldChTRUNPTkRTKSk7ICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMDAtNTlcclxuICAgICAgICAgIGNhc2UgJ20nICA6IHJldHVybiBnZXQoTUlOVVRFUyk7ICAgICAgICAgICAgICAgICAgLy8gTWludXRlcyA6IDAtNTlcclxuICAgICAgICAgIGNhc2UgJ21tJyA6IHJldHVybiBseihnZXQoTUlOVVRFUykpOyAgICAgICAgICAgICAgLy8gTWludXRlcyA6IDAwLTU5XHJcbiAgICAgICAgICBjYXNlICdoJyAgOiByZXR1cm4gZ2V0KEhPVVJTKTsgICAgICAgICAgICAgICAgICAgIC8vIEhvdXJzICAgOiAwLTIzXHJcbiAgICAgICAgICBjYXNlICdoaCcgOiByZXR1cm4gbHooZ2V0KEhPVVJTKSk7ICAgICAgICAgICAgICAgIC8vIEhvdXJzICAgOiAwMC0yM1xyXG4gICAgICAgICAgY2FzZSAnRCcgIDogcmV0dXJuIGdldChEQVRFKTsgICAgICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMS0zMVxyXG4gICAgICAgICAgY2FzZSAnREQnIDogcmV0dXJuIGx6KGdldChEQVRFKSk7ICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMDEtMzFcclxuICAgICAgICAgIGNhc2UgJ1cnICA6IHJldHVybiBkaWN0WzBdW2dldCgnRGF5JyldOyAgICAgICAgICAgLy8gRGF5ICAgICA6INCf0L7QvdC10LTQtdC70YzQvdC40LpcclxuICAgICAgICAgIGNhc2UgJ04nICA6IHJldHVybiBnZXQoTU9OVEgpICsgMTsgICAgICAgICAgICAgICAgLy8gTW9udGggICA6IDEtMTJcclxuICAgICAgICAgIGNhc2UgJ05OJyA6IHJldHVybiBseihnZXQoTU9OVEgpICsgMSk7ICAgICAgICAgICAgLy8gTW9udGggICA6IDAxLTEyXHJcbiAgICAgICAgICBjYXNlICdNJyAgOiByZXR1cm4gZGljdFsyXVtnZXQoTU9OVEgpXTsgICAgICAgICAgIC8vIE1vbnRoICAgOiDQr9C90LLQsNGA0YxcclxuICAgICAgICAgIGNhc2UgJ01NJyA6IHJldHVybiBkaWN0WzFdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRj1xyXG4gICAgICAgICAgY2FzZSAnWScgIDogcmV0dXJuIGdldChZRUFSKTsgICAgICAgICAgICAgICAgICAgICAvLyBZZWFyICAgIDogMjAxNFxyXG4gICAgICAgICAgY2FzZSAnWVknIDogcmV0dXJuIGx6KGdldChZRUFSKSAlIDEwMCk7ICAgICAgICAgICAvLyBZZWFyICAgIDogMTRcclxuICAgICAgICB9IHJldHVybiBwYXJ0O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gYWRkTG9jYWxlKGxhbmcsIGxvY2FsZSl7XHJcbiAgICBmdW5jdGlvbiBzcGxpdChpbmRleCl7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yRWFjaC5jYWxsKGFycmF5KGxvY2FsZS5tb250aHMpLCBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goaXQucmVwbGFjZShmbGV4aW9SZWdFeHAsICckJyArIGluZGV4KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgbG9jYWxlc1tsYW5nXSA9IFthcnJheShsb2NhbGUud2Vla2RheXMpLCBzcGxpdCgxKSwgc3BsaXQoMildO1xyXG4gICAgcmV0dXJuIGNvcmU7XHJcbiAgfVxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIERBVEUsIHtcclxuICAgIGZvcm1hdDogICAgY3JlYXRlRm9ybWF0KCdnZXQnKSxcclxuICAgIGZvcm1hdFVUQzogY3JlYXRlRm9ybWF0KCdnZXRVVEMnKVxyXG4gIH0pO1xyXG4gIGFkZExvY2FsZShjdXJyZW50LCB7XHJcbiAgICB3ZWVrZGF5czogJ1N1bmRheSxNb25kYXksVHVlc2RheSxXZWRuZXNkYXksVGh1cnNkYXksRnJpZGF5LFNhdHVyZGF5JyxcclxuICAgIG1vbnRoczogJ0phbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXInXHJcbiAgfSk7XHJcbiAgYWRkTG9jYWxlKCdydScsIHtcclxuICAgIHdlZWtkYXlzOiAn0JLQvtGB0LrRgNC10YHQtdC90YzQtSzQn9C+0L3QtdC00LXQu9GM0L3QuNC6LNCS0YLQvtGA0L3QuNC6LNCh0YDQtdC00LAs0KfQtdGC0LLQtdGA0LMs0J/Rj9GC0L3QuNGG0LAs0KHRg9Cx0LHQvtGC0LAnLFxyXG4gICAgbW9udGhzOiAn0K/QvdCy0LDRgDrRj3zRjCzQpNC10LLRgNCw0Ls60Y980Yws0JzQsNGA0YI60LB8LNCQ0L/RgNC10Ls60Y980Yws0JzQsDrRj3zQuSzQmNGO0L060Y980YwsJyArXHJcbiAgICAgICAgICAgICfQmNGO0Ls60Y980Yws0JDQstCz0YPRgdGCOtCwfCzQodC10L3RgtGP0LHRgDrRj3zRjCzQntC60YLRj9Cx0YA60Y980Yws0J3QvtGP0LHRgDrRj3zRjCzQlNC10LrQsNCx0YA60Y980YwnXHJcbiAgfSk7XHJcbiAgY29yZS5sb2NhbGUgPSBmdW5jdGlvbihsb2NhbGUpe1xyXG4gICAgcmV0dXJuIGhhcyhsb2NhbGVzLCBsb2NhbGUpID8gY3VycmVudCA9IGxvY2FsZSA6IGN1cnJlbnQ7XHJcbiAgfTtcclxuICBjb3JlLmFkZExvY2FsZSA9IGFkZExvY2FsZTtcclxufSgvXFxiXFx3XFx3P1xcYi9nLCAvOiguKilcXHwoLiopJC8sIHt9LCAnZW4nLCAnU2Vjb25kcycsICdNaW51dGVzJywgJ0hvdXJzJywgJ01vbnRoJywgJ0Z1bGxZZWFyJyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZ2xvYmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7Z2xvYmFsOiBnbG9iYWx9KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDoganMuYXJyYXkuc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gSmF2YVNjcmlwdCAxLjYgLyBTdHJhd21hbiBhcnJheSBzdGF0aWNzIHNoaW1cclxuIWZ1bmN0aW9uKGFycmF5U3RhdGljcyl7XHJcbiAgZnVuY3Rpb24gc2V0QXJyYXlTdGF0aWNzKGtleXMsIGxlbmd0aCl7XHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoa2V5cyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKGtleSBpbiBBcnJheVByb3RvKWFycmF5U3RhdGljc1trZXldID0gY3R4KGNhbGwsIEFycmF5UHJvdG9ba2V5XSwgbGVuZ3RoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzZXRBcnJheVN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcclxuICBzZXRBcnJheVN0YXRpY3MoJ2luZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMnLCAzKTtcclxuICBzZXRBcnJheVN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcclxuICAgICAgICAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xyXG4gICRkZWZpbmUoU1RBVElDLCBBUlJBWSwgYXJyYXlTdGF0aWNzKTtcclxufSh7fSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IHdlYi5kb20uaXRhcmFibGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihOb2RlTGlzdCl7XHJcbiAgaWYoZnJhbWV3b3JrICYmIE5vZGVMaXN0ICYmICEoU1lNQk9MX0lURVJBVE9SIGluIE5vZGVMaXN0W1BST1RPVFlQRV0pKXtcclxuICAgIGhpZGRlbihOb2RlTGlzdFtQUk9UT1RZUEVdLCBTWU1CT0xfSVRFUkFUT1IsIEl0ZXJhdG9yc1tBUlJBWV0pO1xyXG4gIH1cclxuICBJdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnNbQVJSQVldO1xyXG59KGdsb2JhbC5Ob2RlTGlzdCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUubG9nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihsb2csIGVuYWJsZWQpe1xyXG4gIC8vIE1ldGhvZHMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRGV2ZWxvcGVyVG9vbHNXRy9jb25zb2xlLW9iamVjdC9ibG9iL21hc3Rlci9hcGkubWRcclxuICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2Fzc2VydCxjbGVhcixjb3VudCxkZWJ1ZyxkaXIsZGlyeG1sLGVycm9yLGV4Y2VwdGlvbiwnICtcclxuICAgICAgJ2dyb3VwLGdyb3VwQ29sbGFwc2VkLGdyb3VwRW5kLGluZm8saXNJbmRlcGVuZGVudGx5Q29tcG9zZWQsbG9nLCcgK1xyXG4gICAgICAnbWFya1RpbWVsaW5lLHByb2ZpbGUscHJvZmlsZUVuZCx0YWJsZSx0aW1lLHRpbWVFbmQsdGltZWxpbmUsJyArXHJcbiAgICAgICd0aW1lbGluZUVuZCx0aW1lU3RhbXAsdHJhY2Usd2FybicpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgbG9nW2tleV0gPSBmdW5jdGlvbigpe1xyXG4gICAgICBpZihlbmFibGVkICYmIGtleSBpbiBjb25zb2xlKXJldHVybiBhcHBseS5jYWxsKGNvbnNvbGVba2V5XSwgY29uc29sZSwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgfSk7XHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtsb2c6IGFzc2lnbihsb2cubG9nLCBsb2csIHtcclxuICAgIGVuYWJsZTogZnVuY3Rpb24oKXtcclxuICAgICAgZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZTogZnVuY3Rpb24oKXtcclxuICAgICAgZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pfSk7XHJcbn0oe30sIHRydWUpO1xufSh0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKSwgZmFsc2UpO1xubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICB2YXIgcHJvcCA9IHByb3BzW2tleV07XG4gICAgICBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94Mykge1xuICB2YXIgX2FnYWluID0gdHJ1ZTtcblxuICBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHtcbiAgICBfYWdhaW4gPSBmYWxzZTtcbiAgICB2YXIgb2JqZWN0ID0gX3gsXG4gICAgICAgIHByb3BlcnR5ID0gX3gyLFxuICAgICAgICByZWNlaXZlciA9IF94MztcbiAgICBkZXNjID0gcGFyZW50ID0gZ2V0dGVyID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGRlc2MgPSBfY29yZS5PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHBhcmVudCA9IF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgIF94MyA9IHJlY2VpdmVyO1xuICAgICAgICBfYWdhaW4gPSB0cnVlO1xuICAgICAgICBjb250aW51ZSBfZnVuY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7XG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIi8qKlxuICogQGZpbGUgTG9hZGVyczogQXVkaW9CdWZmZXIgbG9hZGVyIGFuZCB1dGlsaXRpZXNcbiAqIEBhdXRob3IgU2FtdWVsIEdvbGRzem1pZHRcbiAqIEB2ZXJzaW9uIDAuMS4xXG4gKi9cblxuLy8gQ29tbW9uSlMgZnVuY3Rpb24gZXhwb3J0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTG9hZGVyOiByZXF1aXJlKCcuL2Rpc3QvbG9hZGVyJyksXG4gIEF1ZGlvQnVmZmVyTG9hZGVyOiByZXF1aXJlKCcuL2Rpc3QvYXVkaW8tYnVmZmVyLWxvYWRlcicpLFxuICBTdXBlckxvYWRlcjogcmVxdWlyZSgnLi9kaXN0L3N1cGVyLWxvYWRlcicpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgd2F2ZXNBdWRpbyA9IHtcbiAgLy8gY29yZVxuICBhdWRpb0NvbnRleHQ6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL2F1ZGlvLWNvbnRleHQnKSxcbiAgVGltZUVuZ2luZTogcmVxdWlyZSgnLi9kaXN0L2NvcmUvdGltZS1lbmdpbmUnKSxcbiAgLy8gZW5naW5lc1xuICBHcmFudWxhckVuZ2luZTogcmVxdWlyZSgnLi9kaXN0L2VuZ2luZXMvZ3JhbnVsYXItZW5naW5lJyksXG4gIE1ldHJvbm9tZTogcmVxdWlyZSgnLi9kaXN0L2VuZ2luZXMvbWV0cm9ub21lJyksXG4gIFBsYXllckVuZ2luZTogcmVxdWlyZSgnLi9kaXN0L2VuZ2luZXMvcGxheWVyLWVuZ2luZScpLFxuICBTZWdtZW50RW5naW5lOiByZXF1aXJlKCcuL2Rpc3QvZW5naW5lcy9zZWdtZW50LWVuZ2luZScpLFxuICAvLyBtYXN0ZXJzXG4gIFBsYXlDb250cm9sOiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy9wbGF5LWNvbnRyb2wnKSxcbiAgVHJhbnNwb3J0OiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy90cmFuc3BvcnQnKSxcbiAgLy8gZXhwb3NlIHRoZXNlID9cbiAgU2NoZWR1bGVyOiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy9zY2hlZHVsZXInKSxcbiAgU2ltcGxlU2NoZWR1bGVyOiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy9zaW1wbGUtc2NoZWR1bGVyJyksXG4gIC8vIHV0aWxzXG4gIFByaW9yaXR5UXVldWU6IHJlcXVpcmUoJy4vZGlzdC91dGlscy9wcmlvcml0eS1xdWV1ZS1oZWFwJyksXG4gIC8vIGZhY3Rvcmllc1xuICBnZXRTY2hlZHVsZXI6IHJlcXVpcmUoJy4vZGlzdC9tYXN0ZXJzL2ZhY3RvcmllcycpLmdldFNjaGVkdWxlcixcbiAgZ2V0U2ltcGxlU2NoZWR1bGVyOiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy9mYWN0b3JpZXMnKS5nZXRTaW1wbGVTY2hlZHVsZXJcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhdmVzQXVkaW87Il19
