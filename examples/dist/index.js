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
    this.__gainNode = this.audioContext.createGain();
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
    update: {value: function update(object) {}},
    remove: {value: function remove(object) {}},
    buildHeap: {value: function buildHeap(list) {}},
    empty: {value: function empty() {}},
    insert: {value: function insert(value) {
        var object = arguments[1] === undefined ? {} : arguments[1];
        console.log("in");
        this.heapList.push({
          object: object,
          heapValue: value
        });
        this.currentSize++;
        this.__percUp(this.currentSize);
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
    size: {get: function() {
        return this.currentSize;
      }},
    contains: {value: function contains(object) {
        for (var i = 0; i <= this.currentSize; i++) {
          if (object === this.heapList[i].object) {
            return i;
          }
        }
        return -1;
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
    __maxChildPosition: {value: function __maxChildPosition(i) {
        if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue > this.heapList[i * 2 + 1].heapValue) {
          return i * 2;
        } else {
          return i * 2 + 1;
        }
      }},
    __percUp: {value: function __percUp(i) {
        var ceiledIndex,
            tmp;
        while (Math.floor(i / 2) > 0) {
          ceiledIndex = Math.floor(i / 2);
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
          refPos = this.__maxChildPosition(i);
          console.log(refPos);
          if (this.heapList[i].heapValue < this.heapList[refPos].heapValue) {
            tmp = this.heapList[i];
            this.heapList[i] = this.heapList[refPos];
            this.heapList[refPos] = tmp;
          }
          i = refPos;
        }
      }},
    update: {value: function update(object, value) {
        var index = this.contains(object);
        console.log(index);
        if (index !== -1) {
          var ref = this.heapList[index].heapValue;
          this.heapList[index].heapValue = value;
          if (value < ref)
            this.__percDown(index);
          else
            this.__percUp(index);
        }
      }},
    remove: {value: function remove(object) {
        var index = this.contains(object);
        if (index !== -1) {
          this.heapList[index].heapValue = 0;
          this.__percUp(index);
          this.deleteHead();
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
          this.__percDown(i);
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
    __minChildPosition: {value: function __minChildPosition(i) {
        if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue < this.heapList[i * 2 + 1].heapValue) {
          return i * 2;
        } else {
          return i * 2 + 1;
        }
      }},
    __percUp: {value: function __percUp(i) {
        var parentIndex,
            tmp;
        while (Math.floor(i / 2) > 0) {
          parentIndex = Math.floor(i / 2);
          if (this.heapList[i].heapValue < this.heapList[parentIndex].heapValue) {
            tmp = this.heapList[parentIndex];
            this.heapList[parentIndex] = this.heapList[i];
            this.heapList[i] = tmp;
          }
          i = parentIndex;
        }
      }},
    __percDown: {value: function __percDown(i) {
        var childIndex,
            tmp;
        while (i * 2 <= this.currentSize) {
          childIndex = this.__minChildPosition(i);
          if (this.heapList[i].heapValue > this.heapList[childIndex].heapValue) {
            tmp = this.heapList[i];
            this.heapList[i] = this.heapList[childIndex];
            this.heapList[childIndex] = tmp;
          }
          i = childIndex;
        }
      }},
    update: {value: function update(object, value) {
        var index = this.contains(object);
        if (index !== -1) {
          var ref = this.heapList[index].heapValue;
          this.heapList[index].heapValue = value;
          if (value > ref)
            this.__percDown(index);
          else
            this.__percUp(index);
        }
      }},
    remove: {value: function remove(object) {
        var index = this.contains(object);
        if (index !== -1) {
          this.heapList[index].heapValue = 0;
          this.__percUp(index);
          this.deleteHead();
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
        var i = list.length;
        while (i > 0) {
          this.__percDown(i);
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
        if (time !== Infinity && time !== -Infinity) {
          this.__heap.insert(time, object);
          return this.__heap.headValue();
        }
        return this.remove(object);
      }},
    move: {value: function move(object, time) {
        if (time !== Infinity && time !== -Infinity) {
          if (this.__heap.contains(object) !== -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9jb3JlL2FjLW1vbmtleXBhdGNoLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvY29yZS9hdWRpby1jb250ZXh0LmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvY29yZS90aW1lLWVuZ2luZS5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L2VuZ2luZXMvZ3JhbnVsYXItZW5naW5lLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvZW5naW5lcy9tZXRyb25vbWUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9lbmdpbmVzL3BsYXllci1lbmdpbmUuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9lbmdpbmVzL3NlZ21lbnQtZW5naW5lLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy9mYWN0b3JpZXMuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC9tYXN0ZXJzL3BsYXktY29udHJvbC5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L21hc3RlcnMvc2NoZWR1bGVyLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy9zaW1wbGUtc2NoZWR1bGVyLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvbWFzdGVycy90cmFuc3BvcnQuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC91dGlscy9oZWFwL2hlYXAuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZGlzdC91dGlscy9oZWFwL21heC1oZWFwLmpzIiwiL1VzZXJzL3J2aW5jZW50L2F1ZGlvL2Rpc3QvdXRpbHMvaGVhcC9taW4taGVhcC5qcyIsIi9Vc2Vycy9ydmluY2VudC9hdWRpby9kaXN0L3V0aWxzL3ByaW9yaXR5LXF1ZXVlLWhlYXAuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vZXhhbXBsZXMvaW5kZXguZXM2LmpzIiwiZXM2L3N1cGVyLWxvYWRlci5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMuanMiLCJub2RlX21vZHVsZXMvd2F2ZXMtbG9hZGVycy9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2suanMiLCJub2RlX21vZHVsZXMvd2F2ZXMtbG9hZGVycy9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL3dhdmVzLWxvYWRlcnMvbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sb2FkZXJzL3dhdmVzLWxvYWRlcnMuanMiLCIvVXNlcnMvcnZpbmNlbnQvYXVkaW8vd2F2ZXMtYXVkaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBLFdBQVcsQ0FBQztBQW1EWixBQUFDLFNBQVUsTUFBSyxDQUFHLENBQUEsT0FBTSxDQUFHLENBQUEsSUFBRyxDQUFHO0FBQ2hDLGFBQVcsQ0FBQztBQUVaLFNBQVMsYUFBVyxDQUFFLEtBQUksQ0FBRztBQUMzQixPQUFJLENBQUMsS0FBSSxDQUFHO0FBRVYsWUFBTTtJQUNSO0FBQUEsQUFBQyxPQUFJLENBQUMsS0FBSSxnQkFBZ0I7QUFBRyxVQUFJLGdCQUFnQixFQUFJLENBQUEsS0FBSSxxQkFBcUIsQ0FBQztBQUFBLEVBQ2pGO0FBQUEsQUFFQSxLQUFJLE1BQUssZUFBZSxBQUFDLENBQUMsb0JBQW1CLENBQUMsQ0FBQSxFQUFLLEVBQUMsTUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNweUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1pBO0FBQUEsV0FBVyxDQUFDO0FBRVosQUFBSSxFQUFBLENBQUEsVUFBUyxFQUFJO0FBRWYsYUFBVyxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsMkJBQTBCLENBQUM7QUFDakQsV0FBUyxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMseUJBQXdCLENBQUM7QUFFN0MsZUFBYSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsZ0NBQStCLENBQUM7QUFDeEQsVUFBUSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsMEJBQXlCLENBQUM7QUFDN0MsYUFBVyxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsOEJBQTZCLENBQUM7QUFDcEQsY0FBWSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsK0JBQThCLENBQUM7QUFFdEQsWUFBVSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsNkJBQTRCLENBQUM7QUFDbEQsVUFBUSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsMEJBQXlCLENBQUM7QUFFN0MsVUFBUSxDQUFHLENBQUEsT0FBTSxBQUFDLENBQUMsMEJBQXlCLENBQUM7QUFDN0MsZ0JBQWMsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLGlDQUFnQyxDQUFDO0FBRTFELGNBQVksQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLGtDQUFpQyxDQUFDO0FBRXpELGFBQVcsQ0FBRyxDQUFBLE9BQU0sQUFBQyxDQUFDLDBCQUF5QixDQUFDLGFBQWE7QUFDN0QsbUJBQWlCLENBQUcsQ0FBQSxPQUFNLEFBQUMsQ0FBQywwQkFBeUIsQ0FBQyxtQkFBbUI7QUFBQSxBQUMzRSxDQUFDO0FBSUQsS0FBSyxRQUFRLEVBQUksV0FBUyxDQUFDO0FBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIENvcHlyaWdodCAyMDEzIENocmlzIFdpbHNvblxuXG4gICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuICAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbi8qIFxuXG5UaGlzIG1vbmtleXBhdGNoIGxpYnJhcnkgaXMgaW50ZW5kZWQgdG8gYmUgaW5jbHVkZWQgaW4gcHJvamVjdHMgdGhhdCBhcmVcbndyaXR0ZW4gdG8gdGhlIHByb3BlciBBdWRpb0NvbnRleHQgc3BlYyAoaW5zdGVhZCBvZiB3ZWJraXRBdWRpb0NvbnRleHQpLCBcbmFuZCB0aGF0IHVzZSB0aGUgbmV3IG5hbWluZyBhbmQgcHJvcGVyIGJpdHMgb2YgdGhlIFdlYiBBdWRpbyBBUEkgKGUuZy4gXG51c2luZyBCdWZmZXJTb3VyY2VOb2RlLnN0YXJ0KCkgaW5zdGVhZCBvZiBCdWZmZXJTb3VyY2VOb2RlLm5vdGVPbigpKSwgYnV0IG1heVxuaGF2ZSB0byBydW4gb24gc3lzdGVtcyB0aGF0IG9ubHkgc3VwcG9ydCB0aGUgZGVwcmVjYXRlZCBiaXRzLlxuXG5UaGlzIGxpYnJhcnkgc2hvdWxkIGJlIGhhcm1sZXNzIHRvIGluY2x1ZGUgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgXG51bnByZWZpeGVkIFwiQXVkaW9Db250ZXh0XCIsIGFuZC9vciBpZiBpdCBzdXBwb3J0cyB0aGUgbmV3IG5hbWVzLiAgXG5cblRoZSBwYXRjaGVzIHRoaXMgbGlicmFyeSBoYW5kbGVzOlxuaWYgd2luZG93LkF1ZGlvQ29udGV4dCBpcyB1bnN1cHBvcnRlZCwgaXQgd2lsbCBiZSBhbGlhc2VkIHRvIHdlYmtpdEF1ZGlvQ29udGV4dCgpLlxuaWYgQXVkaW9CdWZmZXJTb3VyY2VOb2RlLnN0YXJ0KCkgaXMgdW5pbXBsZW1lbnRlZCwgaXQgd2lsbCBiZSByb3V0ZWQgdG8gbm90ZU9uKCkgb3Jcbm5vdGVHcmFpbk9uKCksIGRlcGVuZGluZyBvbiBwYXJhbWV0ZXJzLlxuXG5UaGUgZm9sbG93aW5nIGFsaWFzZXMgb25seSB0YWtlIGVmZmVjdCBpZiB0aGUgbmV3IG5hbWVzIGFyZSBub3QgYWxyZWFkeSBpbiBwbGFjZTpcblxuQXVkaW9CdWZmZXJTb3VyY2VOb2RlLnN0b3AoKSBpcyBhbGlhc2VkIHRvIG5vdGVPZmYoKVxuQXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKSBpcyBhbGlhc2VkIHRvIGNyZWF0ZUdhaW5Ob2RlKClcbkF1ZGlvQ29udGV4dC5jcmVhdGVEZWxheSgpIGlzIGFsaWFzZWQgdG8gY3JlYXRlRGVsYXlOb2RlKClcbkF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoKSBpcyBhbGlhc2VkIHRvIGNyZWF0ZUphdmFTY3JpcHROb2RlKClcbkF1ZGlvQ29udGV4dC5jcmVhdGVQZXJpb2RpY1dhdmUoKSBpcyBhbGlhc2VkIHRvIGNyZWF0ZVdhdmVUYWJsZSgpXG5Pc2NpbGxhdG9yTm9kZS5zdGFydCgpIGlzIGFsaWFzZWQgdG8gbm90ZU9uKClcbk9zY2lsbGF0b3JOb2RlLnN0b3AoKSBpcyBhbGlhc2VkIHRvIG5vdGVPZmYoKVxuT3NjaWxsYXRvck5vZGUuc2V0UGVyaW9kaWNXYXZlKCkgaXMgYWxpYXNlZCB0byBzZXRXYXZlVGFibGUoKVxuQXVkaW9QYXJhbS5zZXRUYXJnZXRBdFRpbWUoKSBpcyBhbGlhc2VkIHRvIHNldFRhcmdldFZhbHVlQXRUaW1lKClcblxuVGhpcyBsaWJyYXJ5IGRvZXMgTk9UIHBhdGNoIHRoZSBlbnVtZXJhdGVkIHR5cGUgY2hhbmdlcywgYXMgaXQgaXMgXG5yZWNvbW1lbmRlZCBpbiB0aGUgc3BlY2lmaWNhdGlvbiB0aGF0IGltcGxlbWVudGF0aW9ucyBzdXBwb3J0IGJvdGggaW50ZWdlclxuYW5kIHN0cmluZyB0eXBlcyBmb3IgQXVkaW9QYW5uZXJOb2RlLnBhbm5pbmdNb2RlbCwgQXVkaW9QYW5uZXJOb2RlLmRpc3RhbmNlTW9kZWwgXG5CaXF1YWRGaWx0ZXJOb2RlLnR5cGUgYW5kIE9zY2lsbGF0b3JOb2RlLnR5cGUuXG5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZXhwb3J0cywgcGVyZikge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBmdW5jdGlvbiBmaXhTZXRUYXJnZXQocGFyYW0pIHtcbiAgICBpZiAoIXBhcmFtKSB7XG4gICAgICAvLyBpZiBOWUksIGp1c3QgcmV0dXJuXG4gICAgICByZXR1cm47XG4gICAgfWlmICghcGFyYW0uc2V0VGFyZ2V0QXRUaW1lKSBwYXJhbS5zZXRUYXJnZXRBdFRpbWUgPSBwYXJhbS5zZXRUYXJnZXRWYWx1ZUF0VGltZTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaGFzT3duUHJvcGVydHkoXCJ3ZWJraXRBdWRpb0NvbnRleHRcIikgJiYgIXdpbmRvdy5oYXNPd25Qcm9wZXJ0eShcIkF1ZGlvQ29udGV4dFwiKSkge1xuICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgICBpZiAoIUF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoXCJjcmVhdGVHYWluXCIpKSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUdhaW4gPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUdhaW5Ob2RlO1xuICAgIGlmICghQXVkaW9Db250ZXh0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShcImNyZWF0ZURlbGF5XCIpKSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZURlbGF5ID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEZWxheU5vZGU7XG4gICAgaWYgKCFBdWRpb0NvbnRleHQucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yXCIpKSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZVNjcmlwdFByb2Nlc3NvciA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlSmF2YVNjcmlwdE5vZGU7XG4gICAgaWYgKCFBdWRpb0NvbnRleHQucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiY3JlYXRlUGVyaW9kaWNXYXZlXCIpKSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZVBlcmlvZGljV2F2ZSA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlV2F2ZVRhYmxlO1xuXG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5pbnRlcm5hbF9jcmVhdGVHYWluID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVHYWluO1xuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlR2FpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5pbnRlcm5hbF9jcmVhdGVHYWluKCk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5nYWluKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmludGVybmFsX2NyZWF0ZURlbGF5ID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVEZWxheTtcbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZURlbGF5ID0gZnVuY3Rpb24gKG1heERlbGF5VGltZSkge1xuICAgICAgdmFyIG5vZGUgPSBtYXhEZWxheVRpbWUgPyB0aGlzLmludGVybmFsX2NyZWF0ZURlbGF5KG1heERlbGF5VGltZSkgOiB0aGlzLmludGVybmFsX2NyZWF0ZURlbGF5KCk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5kZWxheVRpbWUpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcblxuICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaW50ZXJuYWxfY3JlYXRlQnVmZmVyU291cmNlID0gQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVCdWZmZXJTb3VyY2U7XG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5jcmVhdGVCdWZmZXJTb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuaW50ZXJuYWxfY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICBpZiAoIW5vZGUuc3RhcnQpIHtcbiAgICAgICAgbm9kZS5zdGFydCA9IGZ1bmN0aW9uICh3aGVuLCBvZmZzZXQsIGR1cmF0aW9uKSB7XG4gICAgICAgICAgaWYgKG9mZnNldCB8fCBkdXJhdGlvbikgdGhpcy5ub3RlR3JhaW5Pbih3aGVuLCBvZmZzZXQsIGR1cmF0aW9uKTtlbHNlIHRoaXMubm90ZU9uKHdoZW4pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFub2RlLnN0b3ApIG5vZGUuc3RvcCA9IG5vZGUubm90ZU9mZjtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLnBsYXliYWNrUmF0ZSk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5pbnRlcm5hbF9jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IgPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcjtcbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5pbnRlcm5hbF9jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLnRocmVzaG9sZCk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5rbmVlKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLnJhdGlvKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLnJlZHVjdGlvbik7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5hdHRhY2spO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUucmVsZWFzZSk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgQXVkaW9Db250ZXh0LnByb3RvdHlwZS5pbnRlcm5hbF9jcmVhdGVCaXF1YWRGaWx0ZXIgPSBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUJpcXVhZEZpbHRlcjtcbiAgICBBdWRpb0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZUJpcXVhZEZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5pbnRlcm5hbF9jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICAgIGZpeFNldFRhcmdldChub2RlLmZyZXF1ZW5jeSk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5kZXR1bmUpO1xuICAgICAgZml4U2V0VGFyZ2V0KG5vZGUuUSk7XG4gICAgICBmaXhTZXRUYXJnZXQobm9kZS5nYWluKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICBpZiAoQXVkaW9Db250ZXh0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShcImNyZWF0ZU9zY2lsbGF0b3JcIikpIHtcbiAgICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuaW50ZXJuYWxfY3JlYXRlT3NjaWxsYXRvciA9IEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlT3NjaWxsYXRvcjtcbiAgICAgIEF1ZGlvQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlT3NjaWxsYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmludGVybmFsX2NyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgICAgaWYgKCFub2RlLnN0YXJ0KSBub2RlLnN0YXJ0ID0gbm9kZS5ub3RlT247XG4gICAgICAgIGlmICghbm9kZS5zdG9wKSBub2RlLnN0b3AgPSBub2RlLm5vdGVPZmY7XG4gICAgICAgIGlmICghbm9kZS5zZXRQZXJpb2RpY1dhdmUpIG5vZGUuc2V0UGVyaW9kaWNXYXZlID0gbm9kZS5zZXRXYXZlVGFibGU7XG4gICAgICAgIGZpeFNldFRhcmdldChub2RlLmZyZXF1ZW5jeSk7XG4gICAgICAgIGZpeFNldFRhcmdldChub2RlLmRldHVuZSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0pKHdpbmRvdyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdRVUZwUkVFc1FVRkJReXhEUVVGQkxGVkJRVlVzVFVGQlRTeEZRVUZGTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRhRU1zWTBGQldTeERRVUZET3p0QlFVVmlMRmRCUVZNc1dVRkJXU3hEUVVGRExFdEJRVXNzUlVGQlJUdEJRVU16UWl4UlFVRkpMRU5CUVVNc1MwRkJTenM3UVVGRFVpeGhRVUZQTzB0QlFVRXNRVUZEVkN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUlVGRGVFSXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1IwRkJSeXhMUVVGTExFTkJRVU1zYjBKQlFXOUNMRU5CUVVNN1IwRkRkRVE3TzBGQlJVUXNUVUZCU1N4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRWxCUXpORExFTkJRVU1zVFVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4alFVRmpMRU5CUVVNc1JVRkJSVHRCUVVNeFF5eFZRVUZOTEVOQlFVTXNXVUZCV1N4SFFVRkhMR3RDUVVGclFpeERRVUZET3p0QlFVVjZReXhSUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4alFVRmpMRU5CUVVNc1dVRkJXU3hEUVVGRExFVkJRM1JFTEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hIUVVGSExGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkRPMEZCUXpWRkxGRkJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMR05CUVdNc1EwRkJReXhoUVVGaExFTkJRVU1zUlVGRGRrUXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFZEJRVWNzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4bFFVRmxMRU5CUVVNN1FVRkRPVVVzVVVGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1kwRkJZeXhEUVVGRExIVkNRVUYxUWl4RFFVRkRMRVZCUTJwRkxGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNjVUpCUVhGQ0xFZEJRVWNzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4dlFrRkJiMElzUTBGQlF6dEJRVU0zUml4UlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eGpRVUZqTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zUlVGRE9VUXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhyUWtGQmEwSXNSMEZCUnl4WlFVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExHVkJRV1VzUTBGQlF6czdRVUZIY2tZc1owSkJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNiVUpCUVcxQ0xFZEJRVWNzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4VlFVRlZMRU5CUVVNN1FVRkRMMFVzWjBKQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hIUVVGSExGbEJRVmM3UVVGRE4wTXNWVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRU5CUVVNN1FVRkRkRU1zYTBKQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGVFSXNZVUZCVHl4SlFVRkpMRU5CUVVNN1MwRkRZaXhEUVVGRE96dEJRVVZHTEdkQ1FVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExHOUNRVUZ2UWl4SFFVRkhMRmxCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlEycEdMR2RDUVVGWkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NSMEZCUnl4VlFVRlRMRmxCUVZrc1JVRkJSVHRCUVVNeFJDeFZRVUZKTEVsQlFVa3NSMEZCUnl4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRmxCUVZrc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSU3hEUVVGRE8wRkJRMmhITEd0Q1FVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF6ZENMR0ZCUVU4c1NVRkJTU3hEUVVGRE8wdEJRMklzUTBGQlF6czdRVUZGUml4blFrRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5d3lRa0ZCTWtJc1IwRkJSeXhaUVVGWkxFTkJRVU1zVTBGQlV5eERRVUZETEd0Q1FVRnJRaXhEUVVGRE8wRkJReTlHTEdkQ1FVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExHdENRVUZyUWl4SFFVRkhMRmxCUVZjN1FVRkRja1FzVlVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMREpDUVVFeVFpeEZRVUZGTEVOQlFVTTdRVUZET1VNc1ZVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEWml4WlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExGVkJRVmNzU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlN4UlFVRlJMRVZCUVVjN1FVRkRMME1zWTBGQlN5eE5RVUZOTEVsQlFVa3NVVUZCVVN4RlFVTnlRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZGTEVsQlFVa3NSVUZCUlN4TlFVRk5MRVZCUVVVc1VVRkJVU3hEUVVGRkxFTkJRVU1zUzBGRk0wTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJSU3hKUVVGSkxFTkJRVVVzUTBGQlF6dFRRVU4yUWl4RFFVRkRPMDlCUTBnN1FVRkRSQ3hWUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZEV2l4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdRVUZETTBJc2EwSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN1FVRkRhRU1zWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZEWWl4RFFVRkRPenRCUVVWR0xHZENRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMR2xEUVVGcFF5eEhRVUZITEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTTdRVUZETTBjc1owSkJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTXNkMEpCUVhkQ0xFZEJRVWNzV1VGQlZ6dEJRVU16UkN4VlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zYVVOQlFXbERMRVZCUVVVc1EwRkJRenRCUVVOd1JDeHJRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4clFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTjRRaXhyUWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVONlFpeHJRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4clFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhyUWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNelFpeGhRVUZQTEVsQlFVa3NRMEZCUXp0TFFVTmlMRU5CUVVNN08wRkJSVVlzWjBKQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc01rSkJRVEpDTEVkQlFVY3NXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhyUWtGQmEwSXNRMEZCUXp0QlFVTXZSaXhuUWtGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFpRVUZYTzBGQlEzSkVMRlZCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5d3lRa0ZCTWtJc1JVRkJSU3hEUVVGRE8wRkJRemxETEd0Q1FVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF6ZENMR3RDUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpGQ0xHdENRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pDTEd0Q1FVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzaENMR0ZCUVU4c1NVRkJTU3hEUVVGRE8wdEJRMklzUTBGQlF6czdRVUZGUml4UlFVRkpMRmxCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zWTBGQll5eERRVUZGTEd0Q1FVRnJRaXhEUVVGRkxFVkJRVVU3UVVGREwwUXNhMEpCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zZVVKQlFYbENMRWRCUVVjc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJRenRCUVVNelJpeHJRa0ZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNSMEZCUnl4WlFVRlhPMEZCUTI1RUxGbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4NVFrRkJlVUlzUlVGQlJTeERRVUZETzBGQlF6VkRMRmxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVU5pTEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU16UWl4WlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGRFdpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03UVVGRE0wSXNXVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhsUVVGbExFVkJRM1pDTEVsQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU16UXl4dlFrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTTNRaXh2UWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVNeFFpeGxRVUZQTEVsQlFVa3NRMEZCUXp0UFFVTmlMRU5CUVVNN1MwRkRTRHRIUVVOR08wTkJRMFlzUTBGQlFTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkZJaXdpWm1sc1pTSTZJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUlFTnZjSGx5YVdkb2RDQXlNREV6SUVOb2NtbHpJRmRwYkhOdmJseHVYRzRnSUNCTWFXTmxibk5sWkNCMWJtUmxjaUIwYUdVZ1FYQmhZMmhsSUV4cFkyVnVjMlVzSUZabGNuTnBiMjRnTWk0d0lDaDBhR1VnWENKTWFXTmxibk5sWENJcE8xeHVJQ0FnZVc5MUlHMWhlU0J1YjNRZ2RYTmxJSFJvYVhNZ1ptbHNaU0JsZUdObGNIUWdhVzRnWTI5dGNHeHBZVzVqWlNCM2FYUm9JSFJvWlNCTWFXTmxibk5sTGx4dUlDQWdXVzkxSUcxaGVTQnZZblJoYVc0Z1lTQmpiM0I1SUc5bUlIUm9aU0JNYVdObGJuTmxJR0YwWEc1Y2JpQWdJQ0FnSUNCb2RIUndPaTh2ZDNkM0xtRndZV05vWlM1dmNtY3ZiR2xqWlc1elpYTXZURWxEUlU1VFJTMHlMakJjYmx4dUlDQWdWVzVzWlhOeklISmxjWFZwY21Wa0lHSjVJR0Z3Y0d4cFkyRmliR1VnYkdGM0lHOXlJR0ZuY21WbFpDQjBieUJwYmlCM2NtbDBhVzVuTENCemIyWjBkMkZ5WlZ4dUlDQWdaR2x6ZEhKcFluVjBaV1FnZFc1a1pYSWdkR2hsSUV4cFkyVnVjMlVnYVhNZ1pHbHpkSEpwWW5WMFpXUWdiMjRnWVc0Z1hDSkJVeUJKVTF3aUlFSkJVMGxUTEZ4dUlDQWdWMGxVU0U5VlZDQlhRVkpTUVU1VVNVVlRJRTlTSUVOUFRrUkpWRWxQVGxNZ1QwWWdRVTVaSUV0SlRrUXNJR1ZwZEdobGNpQmxlSEJ5WlhOeklHOXlJR2x0Y0d4cFpXUXVYRzRnSUNCVFpXVWdkR2hsSUV4cFkyVnVjMlVnWm05eUlIUm9aU0J6Y0dWamFXWnBZeUJzWVc1bmRXRm5aU0JuYjNabGNtNXBibWNnY0dWeWJXbHpjMmx2Ym5NZ1lXNWtYRzRnSUNCc2FXMXBkR0YwYVc5dWN5QjFibVJsY2lCMGFHVWdUR2xqWlc1elpTNWNiaW92WEc1Y2JpOHFJRnh1WEc1VWFHbHpJRzF2Ym10bGVYQmhkR05vSUd4cFluSmhjbmtnYVhNZ2FXNTBaVzVrWldRZ2RHOGdZbVVnYVc1amJIVmtaV1FnYVc0Z2NISnZhbVZqZEhNZ2RHaGhkQ0JoY21WY2JuZHlhWFIwWlc0Z2RHOGdkR2hsSUhCeWIzQmxjaUJCZFdScGIwTnZiblJsZUhRZ2MzQmxZeUFvYVc1emRHVmhaQ0J2WmlCM1pXSnJhWFJCZFdScGIwTnZiblJsZUhRcExDQmNibUZ1WkNCMGFHRjBJSFZ6WlNCMGFHVWdibVYzSUc1aGJXbHVaeUJoYm1RZ2NISnZjR1Z5SUdKcGRITWdiMllnZEdobElGZGxZaUJCZFdScGJ5QkJVRWtnS0dVdVp5NGdYRzUxYzJsdVp5QkNkV1ptWlhKVGIzVnlZMlZPYjJSbExuTjBZWEowS0NrZ2FXNXpkR1ZoWkNCdlppQkNkV1ptWlhKVGIzVnlZMlZPYjJSbExtNXZkR1ZQYmlncEtTd2dZblYwSUcxaGVWeHVhR0YyWlNCMGJ5QnlkVzRnYjI0Z2MzbHpkR1Z0Y3lCMGFHRjBJRzl1YkhrZ2MzVndjRzl5ZENCMGFHVWdaR1Z3Y21WallYUmxaQ0JpYVhSekxseHVYRzVVYUdseklHeHBZbkpoY25rZ2MyaHZkV3hrSUdKbElHaGhjbTFzWlhOeklIUnZJR2x1WTJ4MVpHVWdhV1lnZEdobElHSnliM2R6WlhJZ2MzVndjRzl5ZEhNZ1hHNTFibkJ5WldacGVHVmtJRndpUVhWa2FXOURiMjUwWlhoMFhDSXNJR0Z1WkM5dmNpQnBaaUJwZENCemRYQndiM0owY3lCMGFHVWdibVYzSUc1aGJXVnpMaUFnWEc1Y2JsUm9aU0J3WVhSamFHVnpJSFJvYVhNZ2JHbGljbUZ5ZVNCb1lXNWtiR1Z6T2x4dWFXWWdkMmx1Wkc5M0xrRjFaR2x2UTI5dWRHVjRkQ0JwY3lCMWJuTjFjSEJ2Y25SbFpDd2dhWFFnZDJsc2JDQmlaU0JoYkdsaGMyVmtJSFJ2SUhkbFltdHBkRUYxWkdsdlEyOXVkR1Y0ZENncExseHVhV1lnUVhWa2FXOUNkV1ptWlhKVGIzVnlZMlZPYjJSbExuTjBZWEowS0NrZ2FYTWdkVzVwYlhCc1pXMWxiblJsWkN3Z2FYUWdkMmxzYkNCaVpTQnliM1YwWldRZ2RHOGdibTkwWlU5dUtDa2diM0pjYm01dmRHVkhjbUZwYms5dUtDa3NJR1JsY0dWdVpHbHVaeUJ2YmlCd1lYSmhiV1YwWlhKekxseHVYRzVVYUdVZ1ptOXNiRzkzYVc1bklHRnNhV0Z6WlhNZ2IyNXNlU0IwWVd0bElHVm1abVZqZENCcFppQjBhR1VnYm1WM0lHNWhiV1Z6SUdGeVpTQnViM1FnWVd4eVpXRmtlU0JwYmlCd2JHRmpaVHBjYmx4dVFYVmthVzlDZFdabVpYSlRiM1Z5WTJWT2IyUmxMbk4wYjNBb0tTQnBjeUJoYkdsaGMyVmtJSFJ2SUc1dmRHVlBabVlvS1Z4dVFYVmthVzlEYjI1MFpYaDBMbU55WldGMFpVZGhhVzRvS1NCcGN5QmhiR2xoYzJWa0lIUnZJR055WldGMFpVZGhhVzVPYjJSbEtDbGNia0YxWkdsdlEyOXVkR1Y0ZEM1amNtVmhkR1ZFWld4aGVTZ3BJR2x6SUdGc2FXRnpaV1FnZEc4Z1kzSmxZWFJsUkdWc1lYbE9iMlJsS0NsY2JrRjFaR2x2UTI5dWRHVjRkQzVqY21WaGRHVlRZM0pwY0hSUWNtOWpaWE56YjNJb0tTQnBjeUJoYkdsaGMyVmtJSFJ2SUdOeVpXRjBaVXBoZG1GVFkzSnBjSFJPYjJSbEtDbGNia0YxWkdsdlEyOXVkR1Y0ZEM1amNtVmhkR1ZRWlhKcGIyUnBZMWRoZG1Vb0tTQnBjeUJoYkdsaGMyVmtJSFJ2SUdOeVpXRjBaVmRoZG1WVVlXSnNaU2dwWEc1UGMyTnBiR3hoZEc5eVRtOWtaUzV6ZEdGeWRDZ3BJR2x6SUdGc2FXRnpaV1FnZEc4Z2JtOTBaVTl1S0NsY2JrOXpZMmxzYkdGMGIzSk9iMlJsTG5OMGIzQW9LU0JwY3lCaGJHbGhjMlZrSUhSdklHNXZkR1ZQWm1Zb0tWeHVUM05qYVd4c1lYUnZjazV2WkdVdWMyVjBVR1Z5YVc5a2FXTlhZWFpsS0NrZ2FYTWdZV3hwWVhObFpDQjBieUJ6WlhSWFlYWmxWR0ZpYkdVb0tWeHVRWFZrYVc5UVlYSmhiUzV6WlhSVVlYSm5aWFJCZEZScGJXVW9LU0JwY3lCaGJHbGhjMlZrSUhSdklITmxkRlJoY21kbGRGWmhiSFZsUVhSVWFXMWxLQ2xjYmx4dVZHaHBjeUJzYVdKeVlYSjVJR1J2WlhNZ1RrOVVJSEJoZEdOb0lIUm9aU0JsYm5WdFpYSmhkR1ZrSUhSNWNHVWdZMmhoYm1kbGN5d2dZWE1nYVhRZ2FYTWdYRzV5WldOdmJXMWxibVJsWkNCcGJpQjBhR1VnYzNCbFkybG1hV05oZEdsdmJpQjBhR0YwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVjeUJ6ZFhCd2IzSjBJR0p2ZEdnZ2FXNTBaV2RsY2x4dVlXNWtJSE4wY21sdVp5QjBlWEJsY3lCbWIzSWdRWFZrYVc5UVlXNXVaWEpPYjJSbExuQmhibTVwYm1kTmIyUmxiQ3dnUVhWa2FXOVFZVzV1WlhKT2IyUmxMbVJwYzNSaGJtTmxUVzlrWld3Z1hHNUNhWEYxWVdSR2FXeDBaWEpPYjJSbExuUjVjR1VnWVc1a0lFOXpZMmxzYkdGMGIzSk9iMlJsTG5SNWNHVXVYRzVjYmlvdlhHNG9ablZ1WTNScGIyNGdLR2RzYjJKaGJDd2daWGh3YjNKMGN5d2djR1Z5WmlrZ2UxeHVJQ0FuZFhObElITjBjbWxqZENjN1hHNWNiaUFnWm5WdVkzUnBiMjRnWm1sNFUyVjBWR0Z5WjJWMEtIQmhjbUZ0S1NCN1hHNGdJQ0FnYVdZZ0tDRndZWEpoYlNrZ0x5OGdhV1lnVGxsSkxDQnFkWE4wSUhKbGRIVnlibHh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUdsbUlDZ2hjR0Z5WVcwdWMyVjBWR0Z5WjJWMFFYUlVhVzFsS1Z4dUlDQWdJQ0FnY0dGeVlXMHVjMlYwVkdGeVoyVjBRWFJVYVcxbElEMGdjR0Z5WVcwdWMyVjBWR0Z5WjJWMFZtRnNkV1ZCZEZScGJXVTdJRnh1SUNCOVhHNWNiaUFnYVdZZ0tIZHBibVJ2ZHk1b1lYTlBkMjVRY205d1pYSjBlU2duZDJWaWEybDBRWFZrYVc5RGIyNTBaWGgwSnlrZ0ppWWdYRzRnSUNBZ0lDQWhkMmx1Wkc5M0xtaGhjMDkzYmxCeWIzQmxjblI1S0NkQmRXUnBiME52Ym5SbGVIUW5LU2tnZTF4dUlDQWdJSGRwYm1SdmR5NUJkV1JwYjBOdmJuUmxlSFFnUFNCM1pXSnJhWFJCZFdScGIwTnZiblJsZUhRN1hHNWNiaUFnSUNCcFppQW9JVUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdWFHRnpUM2R1VUhKdmNHVnlkSGtvSjJOeVpXRjBaVWRoYVc0bktTbGNiaUFnSUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSMkZwYmlBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSMkZwYms1dlpHVTdYRzRnSUNBZ2FXWWdLQ0ZCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1S0NkamNtVmhkR1ZFWld4aGVTY3BLVnh1SUNBZ0lDQWdRWFZrYVc5RGIyNTBaWGgwTG5CeWIzUnZkSGx3WlM1amNtVmhkR1ZFWld4aGVTQTlJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUkdWc1lYbE9iMlJsTzF4dUlDQWdJR2xtSUNnaFFYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVvWVhOUGQyNVFjbTl3WlhKMGVTZ25ZM0psWVhSbFUyTnlhWEIwVUhKdlkyVnpjMjl5SnlrcFhHNGdJQ0FnSUNCQmRXUnBiME52Ym5SbGVIUXVjSEp2ZEc5MGVYQmxMbU55WldGMFpWTmpjbWx3ZEZCeWIyTmxjM052Y2lBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxTbUYyWVZOamNtbHdkRTV2WkdVN1hHNGdJQ0FnYVdZZ0tDRkJkV1JwYjBOdmJuUmxlSFF1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVLQ2RqY21WaGRHVlFaWEpwYjJScFkxZGhkbVVuS1NsY2JpQWdJQ0FnSUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFVHVnlhVzlrYVdOWFlYWmxJRDBnUVhWa2FXOURiMjUwWlhoMExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWWFlYWmxWR0ZpYkdVN1hHNWNibHh1SUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1YVc1MFpYSnVZV3hmWTNKbFlYUmxSMkZwYmlBOUlFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxSMkZwYmp0Y2JpQWdJQ0JCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtTnlaV0YwWlVkaGFXNGdQU0JtZFc1amRHbHZiaWdwSUhzZ1hHNGdJQ0FnSUNCMllYSWdibTlrWlNBOUlIUm9hWE11YVc1MFpYSnVZV3hmWTNKbFlYUmxSMkZwYmlncE8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdVoyRnBiaWs3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdibTlrWlR0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnUVhWa2FXOURiMjUwWlhoMExuQnliM1J2ZEhsd1pTNXBiblJsY201aGJGOWpjbVZoZEdWRVpXeGhlU0E5SUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFJHVnNZWGs3WEc0Z0lDQWdRWFZrYVc5RGIyNTBaWGgwTG5CeWIzUnZkSGx3WlM1amNtVmhkR1ZFWld4aGVTQTlJR1oxYm1OMGFXOXVLRzFoZUVSbGJHRjVWR2x0WlNrZ2V5QmNiaUFnSUNBZ0lIWmhjaUJ1YjJSbElEMGdiV0Y0UkdWc1lYbFVhVzFsSUQ4Z2RHaHBjeTVwYm5SbGNtNWhiRjlqY21WaGRHVkVaV3hoZVNodFlYaEVaV3hoZVZScGJXVXBJRG9nZEdocGN5NXBiblJsY201aGJGOWpjbVZoZEdWRVpXeGhlU2dwTzF4dUlDQWdJQ0FnWm1sNFUyVjBWR0Z5WjJWMEtHNXZaR1V1WkdWc1lYbFVhVzFsS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1YjJSbE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNCQmRXUnBiME52Ym5SbGVIUXVjSEp2ZEc5MGVYQmxMbWx1ZEdWeWJtRnNYMk55WldGMFpVSjFabVpsY2xOdmRYSmpaU0E5SUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFFuVm1abVZ5VTI5MWNtTmxPMXh1SUNBZ0lFRjFaR2x2UTI5dWRHVjRkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sSUQwZ1puVnVZM1JwYjI0b0tTQjdJRnh1SUNBZ0lDQWdkbUZ5SUc1dlpHVWdQU0IwYUdsekxtbHVkR1Z5Ym1Gc1gyTnlaV0YwWlVKMVptWmxjbE52ZFhKalpTZ3BPMXh1SUNBZ0lDQWdhV1lnS0NGdWIyUmxMbk4wWVhKMEtTQjdYRzRnSUNBZ0lDQWdJRzV2WkdVdWMzUmhjblFnUFNCbWRXNWpkR2x2YmlBb0lIZG9aVzRzSUc5bVpuTmxkQ3dnWkhWeVlYUnBiMjRnS1NCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NCdlptWnpaWFFnZkh3Z1pIVnlZWFJwYjI0Z0tWeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXViM1JsUjNKaGFXNVBiaWdnZDJobGJpd2diMlptYzJWMExDQmtkWEpoZEdsdmJpQXBPMXh1SUNBZ0lDQWdJQ0FnSUdWc2MyVmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVibTkwWlU5dUtDQjNhR1Z1SUNrN1hHNGdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvSVc1dlpHVXVjM1J2Y0NsY2JpQWdJQ0FnSUNBZ2JtOWtaUzV6ZEc5d0lEMGdibTlrWlM1dWIzUmxUMlptTzF4dUlDQWdJQ0FnWm1sNFUyVjBWR0Z5WjJWMEtHNXZaR1V1Y0d4aGVXSmhZMnRTWVhSbEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWIyUmxPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQkJkV1JwYjBOdmJuUmxlSFF1Y0hKdmRHOTBlWEJsTG1sdWRHVnlibUZzWDJOeVpXRjBaVVI1Ym1GdGFXTnpRMjl0Y0hKbGMzTnZjaUE5SUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFJIbHVZVzFwWTNORGIyMXdjbVZ6YzI5eU8xeHVJQ0FnSUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFJIbHVZVzFwWTNORGIyMXdjbVZ6YzI5eUlEMGdablZ1WTNScGIyNG9LU0I3SUZ4dUlDQWdJQ0FnZG1GeUlHNXZaR1VnUFNCMGFHbHpMbWx1ZEdWeWJtRnNYMk55WldGMFpVUjVibUZ0YVdOelEyOXRjSEpsYzNOdmNpZ3BPMXh1SUNBZ0lDQWdabWw0VTJWMFZHRnlaMlYwS0c1dlpHVXVkR2h5WlhOb2IyeGtLVHRjYmlBZ0lDQWdJR1pwZUZObGRGUmhjbWRsZENodWIyUmxMbXR1WldVcE8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdWNtRjBhVzhwTzF4dUlDQWdJQ0FnWm1sNFUyVjBWR0Z5WjJWMEtHNXZaR1V1Y21Wa2RXTjBhVzl1S1R0Y2JpQWdJQ0FnSUdacGVGTmxkRlJoY21kbGRDaHViMlJsTG1GMGRHRmpheWs3WEc0Z0lDQWdJQ0JtYVhoVFpYUlVZWEpuWlhRb2JtOWtaUzV5Wld4bFlYTmxLVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnViMlJsTzF4dUlDQWdJSDA3WEc1Y2JpQWdJQ0JCZFdScGIwTnZiblJsZUhRdWNISnZkRzkwZVhCbExtbHVkR1Z5Ym1Gc1gyTnlaV0YwWlVKcGNYVmhaRVpwYkhSbGNpQTlJRUYxWkdsdlEyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVdVkzSmxZWFJsUW1seGRXRmtSbWxzZEdWeU8xeHVJQ0FnSUVGMVpHbHZRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFFtbHhkV0ZrUm1sc2RHVnlJRDBnWm5WdVkzUnBiMjRvS1NCN0lGeHVJQ0FnSUNBZ2RtRnlJRzV2WkdVZ1BTQjBhR2x6TG1sdWRHVnlibUZzWDJOeVpXRjBaVUpwY1hWaFpFWnBiSFJsY2lncE8xeHVJQ0FnSUNBZ1ptbDRVMlYwVkdGeVoyVjBLRzV2WkdVdVpuSmxjWFZsYm1ONUtUdGNiaUFnSUNBZ0lHWnBlRk5sZEZSaGNtZGxkQ2h1YjJSbExtUmxkSFZ1WlNrN1hHNGdJQ0FnSUNCbWFYaFRaWFJVWVhKblpYUW9ibTlrWlM1UktUdGNiaUFnSUNBZ0lHWnBlRk5sZEZSaGNtZGxkQ2h1YjJSbExtZGhhVzRwTzF4dUlDQWdJQ0FnY21WMGRYSnVJRzV2WkdVN1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUdsbUlDaEJkV1JwYjBOdmJuUmxlSFF1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVLQ0FuWTNKbFlYUmxUM05qYVd4c1lYUnZjaWNnS1NrZ2UxeHVJQ0FnSUNBZ1FYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVwYm5SbGNtNWhiRjlqY21WaGRHVlBjMk5wYkd4aGRHOXlJRDBnUVhWa2FXOURiMjUwWlhoMExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWUGMyTnBiR3hoZEc5eU8xeHVJQ0FnSUNBZ1FYVmthVzlEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVlBjMk5wYkd4aGRHOXlJRDBnWm5WdVkzUnBiMjRvS1NCN0lGeHVJQ0FnSUNBZ0lDQjJZWElnYm05a1pTQTlJSFJvYVhNdWFXNTBaWEp1WVd4ZlkzSmxZWFJsVDNOamFXeHNZWFJ2Y2lncE8xeHVJQ0FnSUNBZ0lDQnBaaUFvSVc1dlpHVXVjM1JoY25RcFhHNGdJQ0FnSUNBZ0lDQWdibTlrWlM1emRHRnlkQ0E5SUc1dlpHVXVibTkwWlU5dU95QmNiaUFnSUNBZ0lDQWdhV1lnS0NGdWIyUmxMbk4wYjNBcFhHNGdJQ0FnSUNBZ0lDQWdibTlrWlM1emRHOXdJRDBnYm05a1pTNXViM1JsVDJabU8xeHVJQ0FnSUNBZ0lDQnBaaUFvSVc1dlpHVXVjMlYwVUdWeWFXOWthV05YWVhabEtWeHVJQ0FnSUNBZ0lDQWdJRzV2WkdVdWMyVjBVR1Z5YVc5a2FXTlhZWFpsSUQwZ2JtOWtaUzV6WlhSWFlYWmxWR0ZpYkdVN1hHNGdJQ0FnSUNBZ0lHWnBlRk5sZEZSaGNtZGxkQ2h1YjJSbExtWnlaWEYxWlc1amVTazdYRzRnSUNBZ0lDQWdJR1pwZUZObGRGUmhjbWRsZENodWIyUmxMbVJsZEhWdVpTazdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnViMlJsTzF4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc0Z0lIMWNibjBvZDJsdVpHOTNLU2s3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBtb25rZXlwYXRjaCBvbGQgd2ViQXVkaW9BUElcbnJlcXVpcmUoXCIuL2FjLW1vbmtleXBhdGNoXCIpO1xuLy8gZXhwb3NlcyBhIHNpbmdsZSBpbnN0YW5jZVxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN1FVRkRRU3hQUVVGUExFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1EwRkJRenM3UVVGRk5VSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhKUVVGSkxGbEJRVmtzUlVGQlJTeERRVUZESWl3aVptbHNaU0k2SW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRzF2Ym10bGVYQmhkR05vSUc5c1pDQjNaV0pCZFdScGIwRlFTVnh1Y21WeGRXbHlaU2duTGk5aFl5MXRiMjVyWlhsd1lYUmphQ2NwTzF4dUx5OGdaWGh3YjNObGN5QmhJSE5wYm1kc1pTQnBibk4wWVc1alpWeHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnVaWGNnUVhWa2FXOURiMjUwWlhoMEtDazdJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZGVmYXVsdEF1ZGlvQ29udGV4dCA9IHJlcXVpcmUoXCIuL2F1ZGlvLWNvbnRleHRcIik7XG5cbi8qKlxuICogQGNsYXNzIFRpbWVFbmdpbmVcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgdGltZSBlbmdpbmVzXG4gKlxuICogVGltZSBlbmdpbmVzIGFyZSBjb21wb25lbnRzIHRoYXQgZ2VuZXJhdGUgbW9yZSBvciBsZXNzIHJlZ3VsYXIgYXVkaW8gZXZlbnRzIGFuZC9vciBwbGF5YmFjayBhIG1lZGlhIHN0cmVhbS5cbiAqIFRoZXkgaW1wbGVtZW50IG9uZSBvciBtdWx0aXBsZSBpbnRlcmZhY2VzIHRvIGJlIHN5bmNocm9uaXplZCBieSBhIG1hc3RlciBzdWNoIGFzIGEgc2NoZWR1bGVyLCBhIHRyYW5zcG9ydCBvciBhIHBsYXktY29udHJvbC5cbiAqIFRoZSBwcm92aWRlZCBpbnRlcmZhY2VzIGFyZSBcInNjaGVkdWxlZFwiLCBcInRyYW5zcG9ydGVkXCIsIGFuZCBcInBsYXktY29udHJvbGxlZFwiLlxuICpcbiAqIEluIHRoZSBcInNjaGVkdWxlZFwiIGludGVyZmFjZSB0aGUgZW5naW5lIGltcGxlbWVudHMgYSBtZXRob2QgXCJhZHZhbmNlVGltZVwiIHRoYXQgaXMgY2FsbGVkIGJ5IHRoZSBtYXN0ZXIgKHVzdWFsbHkgdGhlIHNjaGVkdWxlcilcbiAqIGFuZCByZXR1cm5zIHRoZSBkZWxheSB1bnRpbCB0aGUgbmV4dCBjYWxsIG9mIFwiYWR2YW5jZVRpbWVcIi4gVGhlIG1hc3RlciBwcm92aWRlcyB0aGUgZW5naW5lIHdpdGggYSBmdW5jdGlvbiBcInJlc2V0TmV4dFRpbWVcIlxuICogdG8gcmVzY2hlZHVsZSB0aGUgbmV4dCBjYWxsIHRvIGFub3RoZXIgdGltZS5cbiAqXG4gKiBJbiB0aGUgXCJ0cmFuc3BvcnRlZFwiIGludGVyZmFjZSB0aGUgbWFzdGVyICh1c3VhbGx5IGEgdHJhbnNwb3J0KSBmaXJzdCBjYWxscyB0aGUgbWV0aG9kIFwic3luY1Bvc2l0aW9uXCIgdGhhdCByZXR1cm5zIHRoZSBwb3NpdGlvblxuICogb2YgdGhlIGZpcnN0IGV2ZW50IGdlbmVyYXRlZCBieSB0aGUgZW5naW5lIHJlZ2FyZGluZyB0aGUgcGxheWluZyBkaXJlY3Rpb24gKHNpZ24gb2YgdGhlIHNwZWVkIGFyZ3VtZW50KS4gRXZlbnRzIGFyZSBnZW5lcmF0ZWRcbiAqIHRocm91Z2ggdGhlIG1ldGhvZCBcImFkdmFuY2VQb3NpdGlvblwiIHRoYXQgcmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIG5leHQgZXZlbnQgZ2VuZXJhdGVkIHRocm91Z2ggXCJhZHZhbmNlUG9zaXRpb25cIi5cbiAqXG4gKiBJbiB0aGUgXCJzcGVlZC1jb250cm9sbGVkXCIgaW50ZXJmYWNlIHRoZSBlbmdpbmUgaXMgY29udHJvbGxlZCBieSB0aGUgbWV0aG9kIFwic3luY1NwZWVkXCIuXG4gKlxuICogRm9yIGFsbCBpbnRlcmZhY2VzIHRoZSBlbmdpbmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYXR0cmlidXRlIGdldHRlcnMgXCJjdXJyZW50VGltZVwiIGFuZCBcImN1cnJlbnRQb3NpdGlvblwiIChmb3IgdGhlIGNhc2UgdGhhdCB0aGUgbWFzdGVyXG4gKiBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlc2UgYXR0cmlidXRlIGdldHRlcnMsIHRoZSBiYXNlIGNsYXNzIHByb3ZpZGVzIGRlZmF1bHQgaW1wbGVtZW50YXRpb25zKS5cbiAqL1xuXG52YXIgVGltZUVuZ2luZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBUaW1lRW5naW5lKCkge1xuICAgIHZhciBhdWRpb0NvbnRleHQgPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRBdWRpb0NvbnRleHQgOiBhcmd1bWVudHNbMF07XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVGltZUVuZ2luZSk7XG5cbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgbWFzdGVyXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm1hc3RlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcmZhY2UgY3VycmVudGx5IHVzZWRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXNbXCJpbnRlcmZhY2VcIl0gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3V0cHV0IGF1ZGlvIG5vZGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3V0cHV0Tm9kZSA9IG51bGw7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVGltZUVuZ2luZSwge1xuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHRoZSB0aW1lIGVuZ2luZSdzIGN1cnJlbnQgbWFzdGVyIHRpbWVcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZSBtYXN0ZXIuXG4gICAgICAgKi9cblxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRQb3NpdGlvbjoge1xuXG4gICAgICAvKipcbiAgICAgICAqIEdldCB0aGUgdGltZSBlbmdpbmUncyBjdXJyZW50IG1hc3RlciBwb3NpdGlvblxuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIG1hc3Rlci5cbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXNldE5leHRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIHNjaGVkdWxlciB0byByZXNldCB0aGUgZW5naW5lJ3MgbmV4dCB0aW1lXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBuZXcgZW5naW5lIHRpbWUgKGltbWVkaWF0ZWx5IGlmIG5vdCBzcGVjaWZpZWQpXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0TmV4dFRpbWUoKSB7XG4gICAgICAgIHZhciB0aW1lID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXROZXh0UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBGdW5jdGlvbiBwcm92aWRlZCBieSB0aGUgdHJhbnNwb3J0IHRvIHJlc2V0IHRoZSBuZXh0IHBvc2l0aW9uIG9yIHRvIHJlcXVlc3QgcmVzeW5jaHJvbml6aW5nIHRoZSBlbmdpbmUncyBwb3NpdGlvblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIG5ldyBlbmdpbmUgcG9zaXRpb24gKHdpbGwgY2FsbCBzeW5jUG9zaXRpb24gd2l0aCB0aGUgY3VycmVudCBwb3NpdGlvbiBpZiBub3Qgc3BlY2lmaWVkKVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldE5leHRQb3NpdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19zZXRHZXR0ZXJzOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19zZXRHZXR0ZXJzKGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICAgICAgaWYgKGdldEN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY3VycmVudFRpbWVcIiwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiBnZXRDdXJyZW50VGltZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdldEN1cnJlbnRQb3NpdGlvbikge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRQb3NpdGlvblwiLCB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IGdldEN1cnJlbnRQb3NpdGlvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2RlbGV0ZUdldHRlcnM6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RlbGV0ZUdldHRlcnMoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50UG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBpbXBsZW1lbnRzU2NoZWR1bGVkOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2sgd2hldGhlciB0aGUgdGltZSBlbmdpbmUgaW1wbGVtZW50cyB0aGUgc2NoZWR1bGVkIGludGVyZmFjZVxuICAgICAgICoqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaW1wbGVtZW50c1NjaGVkdWxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZVRpbWUgJiYgdGhpcy5hZHZhbmNlVGltZSBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW1wbGVtZW50c1RyYW5zcG9ydGVkOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2sgd2hldGhlciB0aGUgdGltZSBlbmdpbmUgaW1wbGVtZW50cyB0aGUgdHJhbnNwb3J0ZWQgaW50ZXJmYWNlXG4gICAgICAgKiovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbXBsZW1lbnRzVHJhbnNwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmNQb3NpdGlvbiAmJiB0aGlzLnN5bmNQb3NpdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmIHRoaXMuYWR2YW5jZVBvc2l0aW9uICYmIHRoaXMuYWR2YW5jZVBvc2l0aW9uIGluc3RhbmNlb2YgRnVuY3Rpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBpbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2sgd2hldGhlciB0aGUgdGltZSBlbmdpbmUgaW1wbGVtZW50cyB0aGUgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAgICAgICAqKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGltcGxlbWVudHNTcGVlZENvbnRyb2xsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmNTcGVlZCAmJiB0aGlzLnN5bmNTcGVlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0U2NoZWR1bGVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U2NoZWR1bGVkKG1hc3RlciwgcmVzZXROZXh0VGltZSwgZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbikge1xuICAgICAgICB0aGlzLm1hc3RlciA9IG1hc3RlcjtcbiAgICAgICAgdGhpc1tcImludGVyZmFjZVwiXSA9IFwic2NoZWR1bGVkXCI7XG5cbiAgICAgICAgdGhpcy5fX3NldEdldHRlcnMoZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc2V0TmV4dFRpbWUpIHRoaXMucmVzZXROZXh0VGltZSA9IHJlc2V0TmV4dFRpbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRUcmFuc3BvcnRlZDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFRyYW5zcG9ydGVkKG1hc3RlciwgcmVzZXROZXh0UG9zaXRpb24sIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5tYXN0ZXIgPSBtYXN0ZXI7XG4gICAgICAgIHRoaXNbXCJpbnRlcmZhY2VcIl0gPSBcInRyYW5zcG9ydGVkXCI7XG5cbiAgICAgICAgdGhpcy5fX3NldEdldHRlcnMoZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc2V0TmV4dFBvc2l0aW9uKSB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uID0gcmVzZXROZXh0UG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRTcGVlZENvbnRyb2xsZWQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTcGVlZENvbnRyb2xsZWQobWFzdGVyLCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMubWFzdGVyID0gbWFzdGVyO1xuICAgICAgICB0aGlzW1wiaW50ZXJmYWNlXCJdID0gXCJzcGVlZC1jb250cm9sbGVkXCI7XG5cbiAgICAgICAgdGhpcy5fX3NldEdldHRlcnMoZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXNldEludGVyZmFjZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0SW50ZXJmYWNlKCkge1xuICAgICAgICB0aGlzLl9fZGVsZXRlR2V0dGVycygpO1xuXG4gICAgICAgIGRlbGV0ZSB0aGlzLnJlc2V0TmV4dFRpbWU7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uO1xuXG4gICAgICAgIHRoaXMubWFzdGVyID0gbnVsbDtcbiAgICAgICAgdGhpc1tcImludGVyZmFjZVwiXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb25uZWN0OiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29ubmVjdCBhdWRpbyBub2RlXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IGF1ZGlvIG5vZGVcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdCh0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5vdXRwdXROb2RlLmNvbm5lY3QodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfSxcbiAgICBkaXNjb25uZWN0OiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRGlzY29ubmVjdCBhdWRpbyBub2RlXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gY29ubmVjdGlvbiBjb25uZWN0aW9uIHRvIGJlIGRpc2Nvbm5lY3RlZFxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KGNvbm5lY3Rpb24pIHtcbiAgICAgICAgdGhpcy5vdXRwdXROb2RlLmRpc2Nvbm5lY3QoY29ubmVjdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFRpbWVFbmdpbmU7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVFbmdpbmU7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gdGltZSBlbmdpbmUgYmFzZSBjbGFzc1xuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRlBRU3hKUVVGSkxHMUNRVUZ0UWl4SFFVRkhMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN1NVRjFRaTlETEZWQlFWVTdPenM3T3p0QlFVdElMRmRCVEZBc1ZVRkJWU3hIUVV0clF6dFJRVUZ3UXl4WlFVRlpMR2REUVVGSExHMUNRVUZ0UWpzN01FSkJUREZETEZWQlFWVTdPMEZCVFZvc1VVRkJTU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFpRVUZaTEVOQlFVTTdPenM3T3p0QlFVMXFReXhSUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXpzN096czdPMEZCVFc1Q0xGRkJRVWtzWVVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXpzN096czdPMEZCVFhSQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRPMGRCUTNoQ096dGxRWHBDUnl4VlFVRlZPMEZCYVVOV0xHVkJRVmM3T3pzN096czdPenRYUVVGQkxGbEJRVWM3UVVGRGFFSXNaVUZCVHl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGZEJRVmNzUTBGQlF6dFBRVU4wUXpzN1FVRlJSeXh0UWtGQlpUczdPenM3T3pzN08xZEJRVUVzV1VGQlJ6dEJRVU53UWl4bFFVRlBMRU5CUVVNc1EwRkJRenRQUVVOV096dEJRVTFFTEdsQ1FVRmhPenM3T3pzN08yRkJRVUVzZVVKQlFXTTdXVUZCWWl4SlFVRkpMR2REUVVGSExFbEJRVWs3VDBGQlNUczdRVUZOTjBJc2NVSkJRV2xDT3pzN096czdPMkZCUVVFc05rSkJRV3RDTzFsQlFXcENMRkZCUVZFc1owTkJRVWNzU1VGQlNUdFBRVUZKT3p0QlFVVnlReXhuUWtGQldUdGhRVUZCTEhOQ1FVRkRMR05CUVdNc1JVRkJSU3hyUWtGQmEwSXNSVUZCUlR0QlFVTXZReXhaUVVGSkxHTkJRV01zUlVGQlJUdEJRVU5zUWl4blFrRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVWQlFVVXNZVUZCWVN4RlFVRkZPMEZCUTNwRExIZENRVUZaTEVWQlFVVXNTVUZCU1R0QlFVTnNRaXhsUVVGSExFVkJRVVVzWTBGQll6dFhRVU53UWl4RFFVRkRMRU5CUVVNN1UwRkRTanM3UVVGRlJDeFpRVUZKTEd0Q1FVRnJRaXhGUVVGRk8wRkJRM1JDTEdkQ1FVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeHBRa0ZCYVVJc1JVRkJSVHRCUVVNM1F5eDNRa0ZCV1N4RlFVRkZMRWxCUVVrN1FVRkRiRUlzWlVGQlJ5eEZRVUZGTEd0Q1FVRnJRanRYUVVONFFpeERRVUZETEVOQlFVTTdVMEZEU2p0UFFVTkdPenRCUVVWRUxHMUNRVUZsTzJGQlFVRXNNa0pCUVVjN1FVRkRhRUlzWlVGQlR5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMEZCUTNoQ0xHVkJRVThzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXp0UFFVTTNRanM3UVVGTFJDeDFRa0ZCYlVJN096czdPenRoUVVGQkxDdENRVUZITzBGQlEzQkNMR1ZCUVZFc1NVRkJTU3hEUVVGRExGZEJRVmNzU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4WlFVRlpMRkZCUVZFc1EwRkJSVHRQUVVOdVJUczdRVUZMUkN4NVFrRkJjVUk3T3pzN096dGhRVUZCTEdsRFFVRkhPMEZCUTNSQ0xHVkJRMFVzU1VGQlNTeERRVUZETEZsQlFWa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1dVRkJXU3haUVVGWkxGRkJRVkVzU1VGRE1VUXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1NVRkJTU3hKUVVGSkxFTkJRVU1zWlVGQlpTeFpRVUZaTEZGQlFWRXNRMEZEYUVVN1QwRkRTRHM3UVVGTFJDdzJRa0ZCZVVJN096czdPenRoUVVGQkxIRkRRVUZITzBGQlF6RkNMR1ZCUVZFc1NVRkJTU3hEUVVGRExGTkJRVk1zU1VGQlNTeEpRVUZKTEVOQlFVTXNVMEZCVXl4WlFVRlpMRkZCUVZFc1EwRkJSVHRQUVVNdlJEczdRVUZGUkN4blFrRkJXVHRoUVVGQkxITkNRVUZETEUxQlFVMHNSVUZCUlN4aFFVRmhMRVZCUVVVc1kwRkJZeXhGUVVGRkxHdENRVUZyUWl4RlFVRkZPMEZCUTNSRkxGbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUTNKQ0xGbEJRVWtzWVVGQlZTeEhRVUZITEZkQlFWY3NRMEZCUXpzN1FVRkZOMElzV1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4alFVRmpMRVZCUVVVc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXpzN1FVRkZkRVFzV1VGQlNTeGhRVUZoTEVWQlEyWXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhoUVVGaExFTkJRVU03VDBGRGRFTTdPMEZCUlVRc2EwSkJRV003WVVGQlFTeDNRa0ZCUXl4TlFVRk5MRVZCUVVVc2FVSkJRV2xDTEVWQlFVVXNZMEZCWXl4RlFVRkZMR3RDUVVGclFpeEZRVUZGTzBGQlF6VkZMRmxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETzBGQlEzSkNMRmxCUVVrc1lVRkJWU3hIUVVGSExHRkJRV0VzUTBGQlF6czdRVUZGTDBJc1dVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eGpRVUZqTEVWQlFVVXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6czdRVUZGZEVRc1dVRkJTU3hwUWtGQmFVSXNSVUZEYmtJc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4SFFVRkhMR2xDUVVGcFFpeERRVUZETzA5QlF6bERPenRCUVVWRUxITkNRVUZyUWp0aFFVRkJMRFJDUVVGRExFMUJRVTBzUlVGQlJTeGpRVUZqTEVWQlFVVXNhMEpCUVd0Q0xFVkJRVVU3UVVGRE4wUXNXVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhOUVVGTkxFTkJRVU03UVVGRGNrSXNXVUZCU1N4aFFVRlZMRWRCUVVjc2EwSkJRV3RDTEVOQlFVTTdPMEZCUlhCRExGbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNZMEZCWXl4RlFVRkZMR3RDUVVGclFpeERRVUZETEVOQlFVTTdUMEZEZGtRN08wRkJSVVFzYTBKQlFXTTdZVUZCUVN3d1FrRkJSenRCUVVObUxGbEJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXpzN1FVRkZka0lzWlVGQlR5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRPMEZCUXpGQ0xHVkJRVThzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRE96dEJRVVU1UWl4WlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU51UWl4WlFVRkpMR0ZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU03VDBGRGRrSTdPMEZCVFVRc1YwRkJUenM3T3pzN096dGhRVUZCTEdsQ1FVRkRMRTFCUVUwc1JVRkJSVHRCUVVOa0xGbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRMmhETEdWQlFVOHNTVUZCU1N4RFFVRkRPMDlCUTJJN08wRkJUVVFzWTBGQlZUczdPenM3T3p0aFFVRkJMRzlDUVVGRExGVkJRVlVzUlVGQlJUdEJRVU55UWl4WlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTjJReXhsUVVGUExFbEJRVWtzUTBGQlF6dFBRVU5pT3pzN08xTkJOMHBITEZWQlFWVTdPenRCUVdkTGFFSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1pTENKbWFXeGxJam9pWlhNMkwzVjBhV3h6TDNCeWFXOXlhWFI1TFhGMVpYVmxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b2dkM0pwZEhSbGJpQnBiaUJGUTAxQmMyTnlhWEIwSURZZ0tpOWNiaThxS2x4dUlDb2dRR1pwYkdWdmRtVnlkbWxsZHlCWFFWWkZJR0YxWkdsdklIUnBiV1VnWlc1bmFXNWxJR0poYzJVZ1kyeGhjM05jYmlBcUlFQmhkWFJvYjNJZ1RtOXlZbVZ5ZEM1VFkyaHVaV3hzUUdseVkyRnRMbVp5TENCV2FXTjBiM0l1VTJGcGVrQnBjbU5oYlM1bWNpd2dTMkZ5YVcwdVFtRnlhMkYwYVVCcGNtTmhiUzVtY2x4dUlDb3ZYRzVjSW5WelpTQnpkSEpwWTNSY0lqdGNibHh1ZG1GeUlHUmxabUYxYkhSQmRXUnBiME52Ym5SbGVIUWdQU0J5WlhGMWFYSmxLRndpTGk5aGRXUnBieTFqYjI1MFpYaDBYQ0lwTzF4dVhHNHZLaXBjYmlBcUlFQmpiR0Z6Y3lCVWFXMWxSVzVuYVc1bFhHNGdLaUJBWTJ4aGMzTmtaWE5qSUVKaGMyVWdZMnhoYzNNZ1ptOXlJSFJwYldVZ1pXNW5hVzVsYzF4dUlDcGNiaUFxSUZScGJXVWdaVzVuYVc1bGN5QmhjbVVnWTI5dGNHOXVaVzUwY3lCMGFHRjBJR2RsYm1WeVlYUmxJRzF2Y21VZ2IzSWdiR1Z6Y3lCeVpXZDFiR0Z5SUdGMVpHbHZJR1YyWlc1MGN5QmhibVF2YjNJZ2NHeGhlV0poWTJzZ1lTQnRaV1JwWVNCemRISmxZVzB1WEc0Z0tpQlVhR1Y1SUdsdGNHeGxiV1Z1ZENCdmJtVWdiM0lnYlhWc2RHbHdiR1VnYVc1MFpYSm1ZV05sY3lCMGJ5QmlaU0J6ZVc1amFISnZibWw2WldRZ1lua2dZU0J0WVhOMFpYSWdjM1ZqYUNCaGN5QmhJSE5qYUdWa2RXeGxjaXdnWVNCMGNtRnVjM0J2Y25RZ2IzSWdZU0J3YkdGNUxXTnZiblJ5YjJ3dVhHNGdLaUJVYUdVZ2NISnZkbWxrWldRZ2FXNTBaWEptWVdObGN5QmhjbVVnWENKelkyaGxaSFZzWldSY0lpd2dYQ0owY21GdWMzQnZjblJsWkZ3aUxDQmhibVFnWENKd2JHRjVMV052Ym5SeWIyeHNaV1JjSWk1Y2JpQXFYRzRnS2lCSmJpQjBhR1VnWENKelkyaGxaSFZzWldSY0lpQnBiblJsY21aaFkyVWdkR2hsSUdWdVoybHVaU0JwYlhCc1pXMWxiblJ6SUdFZ2JXVjBhRzlrSUZ3aVlXUjJZVzVqWlZScGJXVmNJaUIwYUdGMElHbHpJR05oYkd4bFpDQmllU0IwYUdVZ2JXRnpkR1Z5SUNoMWMzVmhiR3g1SUhSb1pTQnpZMmhsWkhWc1pYSXBYRzRnS2lCaGJtUWdjbVYwZFhKdWN5QjBhR1VnWkdWc1lYa2dkVzUwYVd3Z2RHaGxJRzVsZUhRZ1kyRnNiQ0J2WmlCY0ltRmtkbUZ1WTJWVWFXMWxYQ0l1SUZSb1pTQnRZWE4wWlhJZ2NISnZkbWxrWlhNZ2RHaGxJR1Z1WjJsdVpTQjNhWFJvSUdFZ1puVnVZM1JwYjI0Z1hDSnlaWE5sZEU1bGVIUlVhVzFsWENKY2JpQXFJSFJ2SUhKbGMyTm9aV1IxYkdVZ2RHaGxJRzVsZUhRZ1kyRnNiQ0IwYnlCaGJtOTBhR1Z5SUhScGJXVXVYRzRnS2x4dUlDb2dTVzRnZEdobElGd2lkSEpoYm5Od2IzSjBaV1JjSWlCcGJuUmxjbVpoWTJVZ2RHaGxJRzFoYzNSbGNpQW9kWE4xWVd4c2VTQmhJSFJ5WVc1emNHOXlkQ2tnWm1seWMzUWdZMkZzYkhNZ2RHaGxJRzFsZEdodlpDQmNJbk41Ym1OUWIzTnBkR2x2Ymx3aUlIUm9ZWFFnY21WMGRYSnVjeUIwYUdVZ2NHOXphWFJwYjI1Y2JpQXFJRzltSUhSb1pTQm1hWEp6ZENCbGRtVnVkQ0JuWlc1bGNtRjBaV1FnWW5rZ2RHaGxJR1Z1WjJsdVpTQnlaV2RoY21ScGJtY2dkR2hsSUhCc1lYbHBibWNnWkdseVpXTjBhVzl1SUNoemFXZHVJRzltSUhSb1pTQnpjR1ZsWkNCaGNtZDFiV1Z1ZENrdUlFVjJaVzUwY3lCaGNtVWdaMlZ1WlhKaGRHVmtYRzRnS2lCMGFISnZkV2RvSUhSb1pTQnRaWFJvYjJRZ1hDSmhaSFpoYm1ObFVHOXphWFJwYjI1Y0lpQjBhR0YwSUhKbGRIVnlibk1nZEdobElIQnZjMmwwYVc5dUlHOW1JSFJvWlNCdVpYaDBJR1YyWlc1MElHZGxibVZ5WVhSbFpDQjBhSEp2ZFdkb0lGd2lZV1IyWVc1alpWQnZjMmwwYVc5dVhDSXVYRzRnS2x4dUlDb2dTVzRnZEdobElGd2ljM0JsWldRdFkyOXVkSEp2Ykd4bFpGd2lJR2x1ZEdWeVptRmpaU0IwYUdVZ1pXNW5hVzVsSUdseklHTnZiblJ5YjJ4c1pXUWdZbmtnZEdobElHMWxkR2h2WkNCY0luTjVibU5UY0dWbFpGd2lMbHh1SUNwY2JpQXFJRVp2Y2lCaGJHd2dhVzUwWlhKbVlXTmxjeUIwYUdVZ1pXNW5hVzVsSUdseklIQnliM1pwWkdWa0lIZHBkR2dnZEdobElHRjBkSEpwWW5WMFpTQm5aWFIwWlhKeklGd2lZM1Z5Y21WdWRGUnBiV1ZjSWlCaGJtUWdYQ0pqZFhKeVpXNTBVRzl6YVhScGIyNWNJaUFvWm05eUlIUm9aU0JqWVhObElIUm9ZWFFnZEdobElHMWhjM1JsY2x4dUlDb2daRzlsY3lCdWIzUWdhVzF3YkdWdFpXNTBJSFJvWlhObElHRjBkSEpwWW5WMFpTQm5aWFIwWlhKekxDQjBhR1VnWW1GelpTQmpiR0Z6Y3lCd2NtOTJhV1JsY3lCa1pXWmhkV3gwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVjeWt1WEc0Z0tpOWNibU5zWVhOeklGUnBiV1ZGYm1kcGJtVWdlMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBjblZqZEc5eUtHRjFaR2x2UTI5dWRHVjRkQ0E5SUdSbFptRjFiSFJCZFdScGIwTnZiblJsZUhRcElIdGNiaUFnSUNCMGFHbHpMbUYxWkdsdlEyOXVkR1Y0ZENBOUlHRjFaR2x2UTI5dWRHVjRkRHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVOMWNuSmxiblFnYldGemRHVnlYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwOWlhbVZqZEgxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtMWhjM1JsY2lBOUlHNTFiR3c3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCSmJuUmxjbVpoWTJVZ1kzVnljbVZ1ZEd4NUlIVnpaV1JjYmlBZ0lDQWdLaUJBZEhsd1pTQjdVM1J5YVc1bmZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVhVzUwWlhKbVlXTmxJRDBnYm5Wc2JEdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRTkxZEhCMWRDQmhkV1JwYnlCdWIyUmxYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwOWlhbVZqZEgxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtOTFkSEIxZEU1dlpHVWdQU0J1ZFd4c08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCMGFHVWdkR2x0WlNCbGJtZHBibVVuY3lCamRYSnlaVzUwSUcxaGMzUmxjaUIwYVcxbFhHNGdJQ0FxSUVCMGVYQmxJSHRHZFc1amRHbHZibjFjYmlBZ0lDcGNiaUFnSUNvZ1ZHaHBjeUJtZFc1amRHbHZiaUJ3Y205MmFXUmxaQ0JpZVNCMGFHVWdiV0Z6ZEdWeUxseHVJQ0FnS2k5Y2JpQWdaMlYwSUdOMWNuSmxiblJVYVcxbEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbUYxWkdsdlEyOXVkR1Y0ZEM1amRYSnlaVzUwVkdsdFpUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJIWlhRZ2RHaGxJSFJwYldVZ1pXNW5hVzVsSjNNZ1kzVnljbVZ1ZENCdFlYTjBaWElnY0c5emFYUnBiMjVjYmlBZ0lDb2dRSFI1Y0dVZ2UwWjFibU4wYVc5dWZWeHVJQ0FnS2x4dUlDQWdLaUJVYUdseklHWjFibU4wYVc5dUlIQnliM1pwWkdWa0lHSjVJSFJvWlNCdFlYTjBaWEl1WEc0Z0lDQXFMMXh1SUNCblpYUWdZM1Z5Y21WdWRGQnZjMmwwYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBd08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRVoxYm1OMGFXOXVJSEJ5YjNacFpHVmtJR0o1SUhSb1pTQnpZMmhsWkhWc1pYSWdkRzhnY21WelpYUWdkR2hsSUdWdVoybHVaU2R6SUc1bGVIUWdkR2x0WlZ4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdkR2x0WlNCdVpYY2daVzVuYVc1bElIUnBiV1VnS0dsdGJXVmthV0YwWld4NUlHbG1JRzV2ZENCemNHVmphV1pwWldRcFhHNGdJQ0FxTDF4dUlDQnlaWE5sZEU1bGVIUlVhVzFsS0hScGJXVWdQU0J1ZFd4c0tTQjdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkdkVzVqZEdsdmJpQndjbTkyYVdSbFpDQmllU0IwYUdVZ2RISmhibk53YjNKMElIUnZJSEpsYzJWMElIUm9aU0J1WlhoMElIQnZjMmwwYVc5dUlHOXlJSFJ2SUhKbGNYVmxjM1FnY21WemVXNWphSEp2Ym1sNmFXNW5JSFJvWlNCbGJtZHBibVVuY3lCd2IzTnBkR2x2Ymx4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdjRzl6YVhScGIyNGdibVYzSUdWdVoybHVaU0J3YjNOcGRHbHZiaUFvZDJsc2JDQmpZV3hzSUhONWJtTlFiM05wZEdsdmJpQjNhWFJvSUhSb1pTQmpkWEp5Wlc1MElIQnZjMmwwYVc5dUlHbG1JRzV2ZENCemNHVmphV1pwWldRcFhHNGdJQ0FxTDF4dUlDQnlaWE5sZEU1bGVIUlFiM05wZEdsdmJpaHdiM05wZEdsdmJpQTlJRzUxYkd3cElIdDlYRzVjYmlBZ1gxOXpaWFJIWlhSMFpYSnpLR2RsZEVOMWNuSmxiblJVYVcxbExDQm5aWFJEZFhKeVpXNTBVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnBaaUFvWjJWMFEzVnljbVZ1ZEZScGJXVXBJSHRjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoMGFHbHpMQ0FuWTNWeWNtVnVkRlJwYldVbkxDQjdYRzRnSUNBZ0lDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnWjJWME9pQm5aWFJEZFhKeVpXNTBWR2x0WlZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHZGxkRU4xY25KbGJuUlFiM05wZEdsdmJpa2dlMXh1SUNBZ0lDQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0hSb2FYTXNJQ2RqZFhKeVpXNTBVRzl6YVhScGIyNG5MQ0I3WEc0Z0lDQWdJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ1oyVjBPaUJuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjVjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUY5ZlpHVnNaWFJsUjJWMGRHVnljeWdwSUh0Y2JpQWdJQ0JrWld4bGRHVWdkR2hwY3k1amRYSnlaVzUwVkdsdFpUdGNiaUFnSUNCa1pXeGxkR1VnZEdocGN5NWpkWEp5Wlc1MFVHOXphWFJwYjI0N1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMmhsWTJzZ2QyaGxkR2hsY2lCMGFHVWdkR2x0WlNCbGJtZHBibVVnYVcxd2JHVnRaVzUwY3lCMGFHVWdjMk5vWldSMWJHVmtJR2x1ZEdWeVptRmpaVnh1SUNBZ0tpb3ZYRzRnSUdsdGNHeGxiV1Z1ZEhOVFkyaGxaSFZzWldRb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoMGFHbHpMbUZrZG1GdVkyVlVhVzFsSUNZbUlIUm9hWE11WVdSMllXNWpaVlJwYldVZ2FXNXpkR0Z1WTJWdlppQkdkVzVqZEdsdmJpazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJobFkyc2dkMmhsZEdobGNpQjBhR1VnZEdsdFpTQmxibWRwYm1VZ2FXMXdiR1Z0Wlc1MGN5QjBhR1VnZEhKaGJuTndiM0owWldRZ2FXNTBaWEptWVdObFhHNGdJQ0FxS2k5Y2JpQWdhVzF3YkdWdFpXNTBjMVJ5WVc1emNHOXlkR1ZrS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0IwYUdsekxuTjVibU5RYjNOcGRHbHZiaUFtSmlCMGFHbHpMbk41Ym1OUWIzTnBkR2x2YmlCcGJuTjBZVzVqWlc5bUlFWjFibU4wYVc5dUlDWW1YRzRnSUNBZ0lDQjBhR2x6TG1Ga2RtRnVZMlZRYjNOcGRHbHZiaUFtSmlCMGFHbHpMbUZrZG1GdVkyVlFiM05wZEdsdmJpQnBibk4wWVc1alpXOW1JRVoxYm1OMGFXOXVYRzRnSUNBZ0tUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYUdWamF5QjNhR1YwYUdWeUlIUm9aU0IwYVcxbElHVnVaMmx1WlNCcGJYQnNaVzFsYm5SeklIUm9aU0J6Y0dWbFpDMWpiMjUwY205c2JHVmtJR2x1ZEdWeVptRmpaVnh1SUNBZ0tpb3ZYRzRnSUdsdGNHeGxiV1Z1ZEhOVGNHVmxaRU52Ym5SeWIyeHNaV1FvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2gwYUdsekxuTjVibU5UY0dWbFpDQW1KaUIwYUdsekxuTjVibU5UY0dWbFpDQnBibk4wWVc1alpXOW1JRVoxYm1OMGFXOXVLVHRjYmlBZ2ZWeHVYRzRnSUhObGRGTmphR1ZrZFd4bFpDaHRZWE4wWlhJc0lISmxjMlYwVG1WNGRGUnBiV1VzSUdkbGRFTjFjbkpsYm5SVWFXMWxMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxtMWhjM1JsY2lBOUlHMWhjM1JsY2p0Y2JpQWdJQ0IwYUdsekxtbHVkR1Z5Wm1GalpTQTlJRndpYzJOb1pXUjFiR1ZrWENJN1hHNWNiaUFnSUNCMGFHbHpMbDlmYzJWMFIyVjBkR1Z5Y3loblpYUkRkWEp5Wlc1MFZHbHRaU3dnWjJWMFEzVnljbVZ1ZEZCdmMybDBhVzl1S1R0Y2JseHVJQ0FnSUdsbUlDaHlaWE5sZEU1bGVIUlVhVzFsS1Z4dUlDQWdJQ0FnZEdocGN5NXlaWE5sZEU1bGVIUlVhVzFsSUQwZ2NtVnpaWFJPWlhoMFZHbHRaVHRjYmlBZ2ZWeHVYRzRnSUhObGRGUnlZVzV6Y0c5eWRHVmtLRzFoYzNSbGNpd2djbVZ6WlhST1pYaDBVRzl6YVhScGIyNHNJR2RsZEVOMWNuSmxiblJVYVcxbExDQm5aWFJEZFhKeVpXNTBVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQjBhR2x6TG0xaGMzUmxjaUE5SUcxaGMzUmxjanRjYmlBZ0lDQjBhR2x6TG1sdWRHVnlabUZqWlNBOUlGd2lkSEpoYm5Od2IzSjBaV1JjSWp0Y2JseHVJQ0FnSUhSb2FYTXVYMTl6WlhSSFpYUjBaWEp6S0dkbGRFTjFjbkpsYm5SVWFXMWxMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwTzF4dVhHNGdJQ0FnYVdZZ0tISmxjMlYwVG1WNGRGQnZjMmwwYVc5dUtWeHVJQ0FnSUNBZ2RHaHBjeTV5WlhObGRFNWxlSFJRYjNOcGRHbHZiaUE5SUhKbGMyVjBUbVY0ZEZCdmMybDBhVzl1TzF4dUlDQjlYRzVjYmlBZ2MyVjBVM0JsWldSRGIyNTBjbTlzYkdWa0tHMWhjM1JsY2l3Z1oyVjBRM1Z5Y21WdWRGUnBiV1VzSUdkbGRFTjFjbkpsYm5SUWIzTnBkR2x2YmlrZ2UxeHVJQ0FnSUhSb2FYTXViV0Z6ZEdWeUlEMGdiV0Z6ZEdWeU8xeHVJQ0FnSUhSb2FYTXVhVzUwWlhKbVlXTmxJRDBnWENKemNHVmxaQzFqYjI1MGNtOXNiR1ZrWENJN1hHNWNiaUFnSUNCMGFHbHpMbDlmYzJWMFIyVjBkR1Z5Y3loblpYUkRkWEp5Wlc1MFZHbHRaU3dnWjJWMFEzVnljbVZ1ZEZCdmMybDBhVzl1S1R0Y2JpQWdmVnh1WEc0Z0lISmxjMlYwU1c1MFpYSm1ZV05sS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMTlrWld4bGRHVkhaWFIwWlhKektDazdYRzVjYmlBZ0lDQmtaV3hsZEdVZ2RHaHBjeTV5WlhObGRFNWxlSFJVYVcxbE8xeHVJQ0FnSUdSbGJHVjBaU0IwYUdsekxuSmxjMlYwVG1WNGRGQnZjMmwwYVc5dU8xeHVYRzRnSUNBZ2RHaHBjeTV0WVhOMFpYSWdQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVhVzUwWlhKbVlXTmxJRDBnYm5Wc2JEdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYjI1dVpXTjBJR0YxWkdsdklHNXZaR1ZjYmlBZ0lDb2dRSEJoY21GdElIdFBZbXBsWTNSOUlIUmhjbWRsZENCaGRXUnBieUJ1YjJSbFhHNGdJQ0FxTDF4dUlDQmpiMjV1WldOMEtIUmhjbWRsZENrZ2UxeHVJQ0FnSUhSb2FYTXViM1YwY0hWMFRtOWtaUzVqYjI1dVpXTjBLSFJoY21kbGRDazdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUkdselkyOXVibVZqZENCaGRXUnBieUJ1YjJSbFhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0JqYjI1dVpXTjBhVzl1SUdOdmJtNWxZM1JwYjI0Z2RHOGdZbVVnWkdselkyOXVibVZqZEdWa1hHNGdJQ0FxTDF4dUlDQmthWE5qYjI1dVpXTjBLR052Ym01bFkzUnBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxtOTFkSEIxZEU1dlpHVXVaR2x6WTI5dWJtVmpkQ2hqYjI1dVpXTjBhVzl1S1R0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JpQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGUnBiV1ZGYm1kcGJtVTdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9pbmhlcml0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2dldCA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0XCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBUaW1lRW5naW5lID0gcmVxdWlyZShcIi4uL2NvcmUvdGltZS1lbmdpbmVcIik7XG5cbi8qKlxuICogQGNsYXNzIEdyYW51bGFyRW5naW5lXG4gKi9cblxudmFyIEdyYW51bGFyRW5naW5lID0gKGZ1bmN0aW9uIChfVGltZUVuZ2luZSkge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciBpbml0aWFsIGF1ZGlvIGJ1ZmZlciBmb3IgZ3JhbnVsYXIgc3ludGhlc2lzXG4gICAqXG4gICAqIFRoZSBlbmdpbmUgaW1wbGVtZW50cyB0aGUgXCJzY2hlZHVsZWRcIiBpbnRlcmZhY2UuXG4gICAqIFRoZSBncmFpbiBwb3NpdGlvbiAoZ3JhaW4gb25zZXQgb3IgY2VudGVyIHRpbWUgaW4gdGhlIGF1ZGlvIGJ1ZmZlcikgaXMgb3B0aW9uYWxseVxuICAgKiBkZXRlcm1pbmVkIGJ5IHRoZSBlbmdpbmUncyBjdXJyZW50UG9zaXRpb24gYXR0cmlidXRlLlxuICAgKi9cblxuICBmdW5jdGlvbiBHcmFudWxhckVuZ2luZShhdWRpb0NvbnRleHQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgR3JhbnVsYXJFbmdpbmUpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoR3JhbnVsYXJFbmdpbmUucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGF1ZGlvQ29udGV4dCk7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJcbiAgICAgKiBAdHlwZSB7QXVkaW9CdWZmZXJ9XG4gICAgICovXG4gICAgdGhpcy5idWZmZXIgPSBvcHRpb25zLmJ1ZmZlciB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgZ3JhaW4gcGVyaW9kIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wZXJpb2RBYnMgPSBvcHRpb25zLnBlcmlvZEFicyB8fCAwLjAxO1xuXG4gICAgLyoqXG4gICAgICogR3JhaW4gcGVyaW9kIHJlbGF0aXZlIHRvIGFic29sdXRlIGR1cmF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZFJlbCA9IG9wdGlvbnMucGVyaW9kUmVsIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBbW91dCBvZiByYW5kb20gZ3JhaW4gcGVyaW9kIHZhcmlhdGlvbiByZWxhdGl2ZSB0byBncmFpbiBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kVmFyID0gb3B0aW9ucy5wZXJpb2RWYXIgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEdyYWluIHBvc2l0aW9uIChvbnNldCB0aW1lIGluIGF1ZGlvIGJ1ZmZlcikgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBvc2l0aW9uID0gb3B0aW9ucy5wb3NpdGlvbiB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogQW1vdXQgb2YgcmFuZG9tIGdyYWluIHBvc2l0aW9uIHZhcmlhdGlvbiBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucG9zaXRpb25WYXIgPSBvcHRpb25zLnBvc2l0aW9uVmFyIHx8IDAuMDAzO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgZ3JhaW4gZHVyYXRpb24gaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmR1cmF0aW9uQWJzID0gb3B0aW9ucy5kdXJhdGlvbkFicyB8fCAwLjE7IC8vIGFic29sdXRlIGdyYWluIGR1cmF0aW9uXG5cbiAgICAvKipcbiAgICAgKiBHcmFpbiBkdXJhdGlvbiByZWxhdGl2ZSB0byBncmFpbiBwZXJpb2QgKG92ZXJsYXApXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmR1cmF0aW9uUmVsID0gb3B0aW9ucy5kdXJhdGlvblJlbCB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgYXR0YWNrIHRpbWUgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmF0dGFja0FicyA9IG9wdGlvbnMuYXR0YWNrQWJzIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2sgdGltZSByZWxhdGl2ZSB0byBncmFpbiBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hdHRhY2tSZWwgPSBvcHRpb25zLmF0dGFja1JlbCB8fCAwLjU7XG5cbiAgICAvKipcbiAgICAgKiBTaGFwZSBvZiBhdHRhY2tcbiAgICAgKiBAdHlwZSB7U3RyaW5nfSAnbGluJyBmb3IgbGluZWFyIHJhbXAsICdleHAnIGZvciBleHBvbmVudGlhbFxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNrU2hhcGUgPSBvcHRpb25zLmF0dGFja1NoYXBlIHx8IFwibGluXCI7XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSByZWxlYXNlIHRpbWUgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnJlbGVhc2VBYnMgPSBvcHRpb25zLnJlbGVhc2VBYnMgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFJlbGVhc2UgdGltZSByZWxhdGl2ZSB0byBncmFpbiBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZWxlYXNlUmVsID0gb3B0aW9ucy5yZWxlYXNlUmVsIHx8IDAuNTtcblxuICAgIC8qKlxuICAgICAqIFNoYXBlIG9mIHJlbGVhc2VcbiAgICAgKiBAdHlwZSB7U3RyaW5nfSAnbGluJyBmb3IgbGluZWFyIHJhbXAsICdleHAnIGZvciBleHBvbmVudGlhbFxuICAgICAqL1xuICAgIHRoaXMucmVsZWFzZVNoYXBlID0gb3B0aW9ucy5yZWxlYXNlU2hhcGUgfHwgXCJsaW5cIjtcblxuICAgIC8qKlxuICAgICAqIE9mZnNldCAoc3RhcnQvZW5kIHZhbHVlKSBmb3IgZXhwb25lbnRpYWwgYXR0YWNrL3JlbGVhc2VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfSBvZmZzZXRcbiAgICAgKi9cbiAgICB0aGlzLmV4cFJhbXBPZmZzZXQgPSBvcHRpb25zLmV4cFJhbXBPZmZzZXQgfHwgMC4wMDAxO1xuXG4gICAgLyoqXG4gICAgICogR3JhaW4gcmVzYW1wbGluZyBpbiBjZW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnJlc2FtcGxpbmcgPSBvcHRpb25zLnJlc2FtcGxpbmcgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSByZXNhbXBsaW5nIHZhcmlhdGlvbiBpbiBjZW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnJlc2FtcGxpbmdWYXIgPSBvcHRpb25zLnJlc2FtcGxpbmdWYXIgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdyYWluIHBvc2l0aW9uIHJlZmVycyB0byB0aGUgY2VudGVyIG9mIHRoZSBncmFpbiAob3IgdGhlIGJlZ2lubmluZylcbiAgICAgKiBAdHlwZSB7Qm9vbH1cbiAgICAgKi9cbiAgICB0aGlzLmNlbnRlcmVkID0gb3B0aW9ucy5jZW50ZXJlZCB8fCB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGFuZCBncmFpbiBwb3NpdGlvbiBhcmUgY29uc2lkZXJlZCBhcyBjeWNsaWNcbiAgICAgKiBAdHlwZSB7Qm9vbH1cbiAgICAgKi9cbiAgICB0aGlzLmN5Y2xpYyA9IG9wdGlvbnMuY3ljbGljIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5fX2dhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluIHx8IDE7XG5cbiAgICB0aGlzLm91dHB1dE5vZGUgPSB0aGlzLl9fZ2Fpbk5vZGU7XG4gIH1cblxuICBfaW5oZXJpdHMoR3JhbnVsYXJFbmdpbmUsIF9UaW1lRW5naW5lKTtcblxuICBfY3JlYXRlQ2xhc3MoR3JhbnVsYXJFbmdpbmUsIHtcbiAgICBidWZmZXJEdXJhdGlvbjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidWZmZXJEdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uKSBidWZmZXJEdXJhdGlvbiAtPSB0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uO1xuXG4gICAgICAgIHJldHVybiBidWZmZXJEdXJhdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRQb3NpdGlvbjoge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIGF0dHJpYnV0ZVxuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBhZHZhbmNlVGltZToge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAoc2NoZWR1bGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRpbWUgKyB0aGlzLnRyaWdnZXIodGltZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwbGF5YmFja0xlbmd0aDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlckR1cmF0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2Fpbjoge1xuXG4gICAgICAvKipcbiAgICAgICAqIFNldCBnYWluXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgbGluZWFyIGdhaW4gZmFjdG9yXG4gICAgICAgKi9cblxuICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGdhaW5cbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBnYWluXG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWU7XG4gICAgICB9XG4gICAgfSxcbiAgICB0cmlnZ2VyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVHJpZ2dlciBhIGdyYWluXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBncmFpbiBzeW50aGVzaXMgYXVkaW8gdGltZVxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBwZXJpb2QgdG8gbmV4dCBncmFpblxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCBhdCBhbnkgdGltZSAod2hldGhlciB0aGUgZW5naW5lIGlzIHNjaGVkdWxlZCBvciBub3QpXG4gICAgICAgKiB0byBnZW5lcmF0ZSBhIHNpbmdsZSBncmFpbiBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZ3JhaW4gcGFyYW1ldGVycy5cbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdHJpZ2dlcih0aW1lKSB7XG4gICAgICAgIHZhciBvdXRwdXROb2RlID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB0aGlzLm91dHB1dE5vZGUgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdmFyIGF1ZGlvQ29udGV4dCA9IHRoaXMuYXVkaW9Db250ZXh0O1xuICAgICAgICB2YXIgZ3JhaW5UaW1lID0gdGltZSB8fCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgICAgIHZhciBncmFpblBlcmlvZCA9IHRoaXMucGVyaW9kQWJzO1xuICAgICAgICB2YXIgZ3JhaW5Qb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICB2YXIgZ3JhaW5EdXJhdGlvbiA9IHRoaXMuZHVyYXRpb25BYnM7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdmFyIHJlc2FtcGxpbmdSYXRlID0gMTtcblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSByZXNhbXBsaW5nXG4gICAgICAgICAgaWYgKHRoaXMucmVzYW1wbGluZyAhPT0gMCB8fCB0aGlzLnJlc2FtcGxpbmdWYXIgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcmFuZG9tUmVzYW1wbGluZyA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIgKiB0aGlzLnJlc2FtcGxpbmdWYXI7XG4gICAgICAgICAgICByZXNhbXBsaW5nUmF0ZSA9IE1hdGgucG93KDIsICh0aGlzLnJlc2FtcGxpbmcgKyByYW5kb21SZXNhbXBsaW5nKSAvIDEyMDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGdyYWluUGVyaW9kICs9IHRoaXMucGVyaW9kUmVsICogZ3JhaW5EdXJhdGlvbjtcbiAgICAgICAgICBncmFpbkR1cmF0aW9uICs9IHRoaXMuZHVyYXRpb25SZWwgKiBncmFpblBlcmlvZDtcblxuICAgICAgICAgIC8vIGdyYWluIHBlcmlvZCByYW5kb24gdmFyaWF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucGVyaW9kVmFyID4gMCkgZ3JhaW5QZXJpb2QgKz0gMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMucGVyaW9kVmFyICogZ3JhaW5QZXJpb2Q7XG5cbiAgICAgICAgICAvLyBjZW50ZXIgZ3JhaW5cbiAgICAgICAgICBpZiAodGhpcy5jZW50ZXJlZCkgZ3JhaW5Qb3NpdGlvbiAtPSAwLjUgKiBncmFpbkR1cmF0aW9uO1xuXG4gICAgICAgICAgLy8gcmFuZG9taXplIGdyYWluIHBvc2l0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucG9zaXRpb25WYXIgPiAwKSBncmFpblBvc2l0aW9uICs9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5wb3NpdGlvblZhcjtcblxuICAgICAgICAgIHZhciBidWZmZXJEdXJhdGlvbiA9IHRoaXMuYnVmZmVyRHVyYXRpb247XG5cbiAgICAgICAgICAvLyB3cmFwIG9yIGNsaXAgZ3JhaW4gcG9zaXRpb24gYW5kIGR1cmF0aW9uIGludG8gYnVmZmVyIGR1cmF0aW9uXG4gICAgICAgICAgaWYgKGdyYWluUG9zaXRpb24gPCAwIHx8IGdyYWluUG9zaXRpb24gPj0gYnVmZmVyRHVyYXRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN5Y2xpYykge1xuICAgICAgICAgICAgICB2YXIgY3ljbGVzID0gZ3JhaW5Qb3NpdGlvbiAvIGJ1ZmZlckR1cmF0aW9uO1xuICAgICAgICAgICAgICBncmFpblBvc2l0aW9uID0gKGN5Y2xlcyAtIE1hdGguZmxvb3IoY3ljbGVzKSkgKiBidWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgICAgICBpZiAoZ3JhaW5Qb3NpdGlvbiArIGdyYWluRHVyYXRpb24gPiB0aGlzLmJ1ZmZlci5kdXJhdGlvbikgZ3JhaW5EdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uIC0gZ3JhaW5Qb3NpdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChncmFpblBvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgIGdyYWluVGltZSAtPSBncmFpblBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGdyYWluRHVyYXRpb24gKz0gZ3JhaW5Qb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBncmFpblBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChncmFpblBvc2l0aW9uICsgZ3JhaW5EdXJhdGlvbiA+IGJ1ZmZlckR1cmF0aW9uKSBncmFpbkR1cmF0aW9uID0gYnVmZmVyRHVyYXRpb24gLSBncmFpblBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG1ha2UgZ3JhaW5cbiAgICAgICAgICBpZiAodGhpcy5nYWluID4gMCAmJiBncmFpbkR1cmF0aW9uID49IDAuMDAxKSB7XG4gICAgICAgICAgICAvLyBtYWtlIGdyYWluIGVudmVsb3BlXG4gICAgICAgICAgICB2YXIgZW52ZWxvcGVOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgICAgIHZhciBhdHRhY2sgPSB0aGlzLmF0dGFja0FicyArIHRoaXMuYXR0YWNrUmVsICogZ3JhaW5EdXJhdGlvbjtcbiAgICAgICAgICAgIHZhciByZWxlYXNlID0gdGhpcy5yZWxlYXNlQWJzICsgdGhpcy5yZWxlYXNlUmVsICogZ3JhaW5EdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKGF0dGFjayArIHJlbGVhc2UgPiBncmFpbkR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBmYWN0b3IgPSBncmFpbkR1cmF0aW9uIC8gKGF0dGFjayArIHJlbGVhc2UpO1xuICAgICAgICAgICAgICBhdHRhY2sgKj0gZmFjdG9yO1xuICAgICAgICAgICAgICByZWxlYXNlICo9IGZhY3RvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF0dGFja0VuZFRpbWUgPSBncmFpblRpbWUgKyBhdHRhY2s7XG4gICAgICAgICAgICB2YXIgZ3JhaW5FbmRUaW1lID0gZ3JhaW5UaW1lICsgZ3JhaW5EdXJhdGlvbjtcbiAgICAgICAgICAgIHZhciByZWxlYXNlU3RhcnRUaW1lID0gZ3JhaW5FbmRUaW1lIC0gcmVsZWFzZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYXR0YWNrU2hhcGUgPT09IFwibGluXCIpIHtcbiAgICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgZ3JhaW5UaW1lKTtcbiAgICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgYXR0YWNrRW5kVGltZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbnZlbG9wZU5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSh0aGlzLmV4cFJhbXBPZmZzZXQsIGdyYWluVGltZSk7XG4gICAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMSwgYXR0YWNrRW5kVGltZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWxlYXNlU3RhcnRUaW1lID4gYXR0YWNrRW5kVGltZSkgZW52ZWxvcGVOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMSwgcmVsZWFzZVN0YXJ0VGltZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJlbGVhc2VTaGFwZSA9PT0gXCJsaW5cIikge1xuICAgICAgICAgICAgICBlbnZlbG9wZU5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBncmFpbkVuZFRpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLmV4cFJhbXBPZmZzZXQsIGdyYWluRW5kVGltZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVudmVsb3BlTm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG4gICAgICAgICAgICAvLyBtYWtlIHNvdXJjZVxuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblxuICAgICAgICAgICAgc291cmNlLmJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgICAgICAgICAgc291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZSA9IHJlc2FtcGxpbmdSYXRlO1xuICAgICAgICAgICAgc291cmNlLmNvbm5lY3QoZW52ZWxvcGVOb2RlKTtcblxuICAgICAgICAgICAgc291cmNlLnN0YXJ0KGdyYWluVGltZSwgZ3JhaW5Qb3NpdGlvbik7XG4gICAgICAgICAgICBzb3VyY2Uuc3RvcChncmFpblRpbWUgKyBncmFpbkR1cmF0aW9uIC8gcmVzYW1wbGluZ1JhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBncmFpblBlcmlvZDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBHcmFudWxhckVuZ2luZTtcbn0pKFRpbWVFbmdpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW51bGFyRW5naW5lO1xuLyogd3JpdHRlbiBpbiBFQ01Bc2NyaXB0IDYgKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIGF1ZGlvIGdyYW51bGFyIHN5bnRoZXNpcyBlbmdpbmVcbiAqIEBhdXRob3IgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCBWaWN0b3IuU2FpekBpcmNhbS5mciwgS2FyaW0uQmFya2F0aUBpcmNhbS5mclxuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN1FVRlBRU3hKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6czdPenM3TzBsQlN6RkRMR05CUVdNN096czdPenM3T3pzN1FVRlRVQ3hYUVZSUUxHTkJRV01zUTBGVFRpeFpRVUZaTEVWQlFXVTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FWUnFReXhqUVVGak96dEJRVlZvUWl4eFEwRldSU3hqUVVGakxEWkRRVlZXTEZsQlFWa3NSVUZCUlRzN096czdPMEZCVFhCQ0xGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1NVRkJTU3hKUVVGSkxFTkJRVU03T3pzN096dEJRVTF5UXl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eFRRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRPenM3T3pzN1FVRk5NME1zVVVGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRYaERMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenRCUVUxNFF5eFJRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFbEJRVWtzUTBGQlF5eERRVUZET3pzN096czdRVUZOZEVNc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SlFVRkpMRXRCUVVzc1EwRkJRenM3T3pzN08wRkJUV2hFTEZGQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExGZEJRVmNzU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMDVReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1EwRkJReXhEUVVGRE96czdPenM3UVVGTk5VTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFhoRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1NVRkJTU3hIUVVGSExFTkJRVU03T3pzN096dEJRVTB4UXl4UlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZYTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN1FVRk5hRVFzVVVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRURkRMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNTVUZCU1N4SFFVRkhMRU5CUVVNN096czdPenRCUVUwMVF5eFJRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRTlCUVU4c1EwRkJReXhaUVVGWkxFbEJRVWtzUzBGQlN5eERRVUZET3pzN096czdRVUZOYkVRc1VVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNZVUZCWVN4SlFVRkpMRTFCUVUwc1EwRkJRenM3T3pzN08wRkJUWEpFTEZGQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzU1VGQlNTeERRVUZETEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl4aFFVRmhMRWxCUVVrc1EwRkJReXhEUVVGRE96czdPenM3UVVGTmFFUXNVVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQlVTeEpRVUZKTEVsQlFVa3NRMEZCUXpzN096czdPMEZCVFhwRExGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU03TzBGQlJYUkRMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVOcVJDeFJRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NTVUZCU1N4RFFVRkRMRU5CUVVNN08wRkJSUzlETEZGQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF6dEhRVU51UXpzN1dVRnNTVWNzWTBGQll6czdaVUZCWkN4alFVRmpPMEZCYjBsa0xHdENRVUZqTzFkQlFVRXNXVUZCUnp0QlFVTnVRaXhaUVVGSkxHTkJRV01zUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJRenM3UVVGRk1VTXNXVUZCU1N4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExHMUNRVUZ0UWl4RlFVTnFReXhqUVVGakxFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4dFFrRkJiVUlzUTBGQlF6czdRVUZGY0VRc1pVRkJUeXhqUVVGakxFTkJRVU03VDBGRGRrSTdPMEZCUjBjc2JVSkJRV1U3T3pzN1YwRkJRU3haUVVGSE8wRkJRM0JDTEdWQlFVOHNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRQUVVOMFFqczdRVUZIUkN4bFFVRlhPenM3TzJGQlFVRXNjVUpCUVVNc1NVRkJTU3hGUVVGRk8wRkJRMmhDTEdWQlFVOHNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdUMEZEYkVNN08wRkJSVWNzYTBKQlFXTTdWMEZCUVN4WlFVRkhPMEZCUTI1Q0xHVkJRVThzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXp0UFFVTTFRanM3UVVGalJ5eFJRVUZKT3pzN096czdPMWRCVWtFc1ZVRkJReXhMUVVGTExFVkJRVVU3UVVGRFpDeFpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzA5QlEzQkRPenM3T3pzN1YwRk5UeXhaUVVGSE8wRkJRMVFzWlVGQlR5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03VDBGRGJrTTdPMEZCVlVRc1YwRkJUenM3T3pzN096czdPenM3WVVGQlFTeHBRa0ZCUXl4SlFVRkpMRVZCUVdkRE8xbEJRVGxDTEZWQlFWVXNaME5CUVVjc1NVRkJTU3hEUVVGRExGVkJRVlU3TzBGQlEzaERMRmxCUVVrc1dVRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTTdRVUZEY2tNc1dVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeEpRVUZKTEZsQlFWa3NRMEZCUXl4WFFVRlhMRU5CUVVNN1FVRkRha1FzV1VGQlNTeFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOcVF5eFpRVUZKTEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hEUVVGRE8wRkJRM3BETEZsQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03TzBGQlJYSkRMRmxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5tTEdOQlFVa3NZMEZCWXl4SFFVRkhMRU5CUVVjc1EwRkJRenM3TzBGQlIzcENMR05CUVVrc1NVRkJTU3hEUVVGRExGVkJRVlVzUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRGJrUXNaMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFZEJRVWNzUjBGQlJ5eERRVUZCTEVkQlFVa3NRMEZCUnl4SFFVRkhMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU03UVVGRGVFVXNNRUpCUVdNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVY3NSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzWjBKQlFXZENMRU5CUVVFc1IwRkJTU3hKUVVGTkxFTkJRVU1zUTBGQlF6dFhRVU12UlRzN1FVRkZSQ3h4UWtGQlZ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1lVRkJZU3hEUVVGRE8wRkJRemxETEhWQ1FVRmhMRWxCUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFhRVUZYTEVOQlFVTTdPenRCUVVkb1JDeGpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1EwRkJSeXhGUVVOMFFpeFhRVUZYTEVsQlFVa3NRMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVRXNRVUZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVjBGQlZ5eERRVUZET3pzN1FVRkhOVVVzWTBGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVTm1MR0ZCUVdFc1NVRkJTU3hIUVVGSExFZEJRVWNzWVVGQllTeERRVUZET3pzN1FVRkhka01zWTBGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRU5CUVVNc1JVRkRkRUlzWVVGQllTeEpRVUZKTEVOQlFVTXNRMEZCUnl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVRXNSMEZCU1N4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRE96dEJRVVZvUlN4alFVRkpMR05CUVdNc1IwRkJSeXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZET3pzN1FVRkhla01zWTBGQlNTeGhRVUZoTEVkQlFVY3NRMEZCUXl4SlFVRkpMR0ZCUVdFc1NVRkJTU3hqUVVGakxFVkJRVVU3UVVGRGVFUXNaMEpCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5tTEd0Q1FVRkpMRTFCUVUwc1IwRkJSeXhoUVVGaExFZEJRVWNzWTBGQll5eERRVUZETzBGQlF6VkRMREpDUVVGaExFZEJRVWNzUTBGQlF5eE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlFTeEhRVUZKTEdOQlFXTXNRMEZCUXpzN1FVRkZMMFFzYTBKQlFVa3NZVUZCWVN4SFFVRkhMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNSVUZEZEVRc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4SFFVRkhMR0ZCUVdFc1EwRkJRenRoUVVONFJDeE5RVUZOTzBGQlEwd3NhMEpCUVVrc1lVRkJZU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU55UWl4NVFrRkJVeXhKUVVGSkxHRkJRV0VzUTBGQlF6dEJRVU16UWl3MlFrRkJZU3hKUVVGSkxHRkJRV0VzUTBGQlF6dEJRVU12UWl3MlFrRkJZU3hIUVVGSExFTkJRVU1zUTBGQlF6dGxRVU51UWpzN1FVRkZSQ3hyUWtGQlNTeGhRVUZoTEVkQlFVY3NZVUZCWVN4SFFVRkhMR05CUVdNc1JVRkRhRVFzWVVGQllTeEhRVUZITEdOQlFXTXNSMEZCUnl4aFFVRmhMRU5CUVVNN1lVRkRiRVE3VjBGRFJqczdPMEZCUjBRc1kwRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNTVUZCU1N4aFFVRmhMRWxCUVVrc1MwRkJTeXhGUVVGRk96dEJRVVV6UXl4blFrRkJTU3haUVVGWkxFZEJRVWNzV1VGQldTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPMEZCUXpkRExHZENRVUZKTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NZVUZCWVN4RFFVRkRPMEZCUXpkRUxHZENRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NZVUZCWVN4RFFVRkRPenRCUVVWb1JTeG5Ra0ZCU1N4TlFVRk5MRWRCUVVjc1QwRkJUeXhIUVVGSExHRkJRV0VzUlVGQlJUdEJRVU53UXl4clFrRkJTU3hOUVVGTkxFZEJRVWNzWVVGQllTeEpRVUZKTEUxQlFVMHNSMEZCUnl4UFFVRlBMRU5CUVVFc1FVRkJReXhEUVVGRE8wRkJRMmhFTEc5Q1FVRk5MRWxCUVVrc1RVRkJUU3hEUVVGRE8wRkJRMnBDTEhGQ1FVRlBMRWxCUVVrc1RVRkJUU3hEUVVGRE8yRkJRMjVDT3p0QlFVVkVMR2RDUVVGSkxHRkJRV0VzUjBGQlJ5eFRRVUZUTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUTNaRExHZENRVUZKTEZsQlFWa3NSMEZCUnl4VFFVRlRMRWRCUVVjc1lVRkJZU3hEUVVGRE8wRkJRemRETEdkQ1FVRkpMR2RDUVVGblFpeEhRVUZITEZsQlFWa3NSMEZCUnl4UFFVRlBMRU5CUVVNN08wRkJSVGxETEdkQ1FVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFdEJRVXNzUzBGQlN5eEZRVUZGTzBGQlF6bENMREJDUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkhMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGFrUXNNRUpCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJSeXhGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZETzJGQlF5OUVMRTFCUVUwN1FVRkRUQ3d3UWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTm9SU3d3UWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl3MFFrRkJORUlzUTBGQlF5eERRVUZITEVWQlFVVXNZVUZCWVN4RFFVRkRMRU5CUVVNN1lVRkRjRVU3TzBGQlJVUXNaMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NZVUZCWVN4RlFVTnNReXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkhMRVZCUVVVc1owSkJRV2RDTEVOQlFVTXNRMEZCUXpzN1FVRkZNVVFzWjBKQlFVa3NTVUZCU1N4RFFVRkRMRmxCUVZrc1MwRkJTeXhMUVVGTExFVkJRVVU3UVVGREwwSXNNRUpCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJSeXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzJGQlF6bEVMRTFCUVUwN1FVRkRUQ3d3UWtGQldTeERRVUZETEVsQlFVa3NRMEZCUXl3MFFrRkJORUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVRkZMRmxCUVZrc1EwRkJReXhEUVVGRE8yRkJRMnhHT3p0QlFVVkVMSGRDUVVGWkxFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenM3UVVGSGFrTXNaMEpCUVVrc1RVRkJUU3hIUVVGSExGbEJRVmtzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hEUVVGRE96dEJRVVV2UXl4clFrRkJUU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUXpWQ0xHdENRVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhqUVVGakxFTkJRVU03UVVGRE0wTXNhMEpCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdPMEZCUlRkQ0xHdENRVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1JVRkJSU3hoUVVGaExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4clFrRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NZVUZCWVN4SFFVRkhMR05CUVdNc1EwRkJReXhEUVVGRE8xZEJRM3BFTzFOQlEwWTdPMEZCUlVRc1pVRkJUeXhYUVVGWExFTkJRVU03VDBGRGNFSTdPenM3VTBGNlVrY3NZMEZCWXp0SFFVRlRMRlZCUVZVN08wRkJORkoyUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExHTkJRV01zUTBGQlF5SXNJbVpwYkdVaU9pSmxjell2ZFhScGJITXZjSEpwYjNKcGRIa3RjWFZsZFdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lCM2NtbDBkR1Z1SUdsdUlFVkRUVUZ6WTNKcGNIUWdOaUFxTDF4dUx5b3FYRzRnS2lCQVptbHNaVzkyWlhKMmFXVjNJRmRCVmtVZ1lYVmthVzhnWjNKaGJuVnNZWElnYzNsdWRHaGxjMmx6SUdWdVoybHVaVnh1SUNvZ1FHRjFkR2h2Y2lCT2IzSmlaWEowTGxOamFHNWxiR3hBYVhKallXMHVabklzSUZacFkzUnZjaTVUWVdsNlFHbHlZMkZ0TG1aeUxDQkxZWEpwYlM1Q1lYSnJZWFJwUUdseVkyRnRMbVp5WEc0Z0tpOWNibHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzUyWVhJZ1ZHbHRaVVZ1WjJsdVpTQTlJSEpsY1hWcGNtVW9YQ0l1TGk5amIzSmxMM1JwYldVdFpXNW5hVzVsWENJcE8xeHVYRzR2S2lwY2JpQXFJRUJqYkdGemN5QkhjbUZ1ZFd4aGNrVnVaMmx1WlZ4dUlDb3ZYRzVqYkdGemN5QkhjbUZ1ZFd4aGNrVnVaMmx1WlNCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nUUdOdmJuTjBjblZqZEc5eVhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhWa2FXOUNkV1ptWlhKOUlHSjFabVpsY2lCcGJtbDBhV0ZzSUdGMVpHbHZJR0oxWm1abGNpQm1iM0lnWjNKaGJuVnNZWElnYzNsdWRHaGxjMmx6WEc0Z0lDQXFYRzRnSUNBcUlGUm9aU0JsYm1kcGJtVWdhVzF3YkdWdFpXNTBjeUIwYUdVZ1hDSnpZMmhsWkhWc1pXUmNJaUJwYm5SbGNtWmhZMlV1WEc0Z0lDQXFJRlJvWlNCbmNtRnBiaUJ3YjNOcGRHbHZiaUFvWjNKaGFXNGdiMjV6WlhRZ2IzSWdZMlZ1ZEdWeUlIUnBiV1VnYVc0Z2RHaGxJR0YxWkdsdklHSjFabVpsY2lrZ2FYTWdiM0IwYVc5dVlXeHNlVnh1SUNBZ0tpQmtaWFJsY20xcGJtVmtJR0o1SUhSb1pTQmxibWRwYm1VbmN5QmpkWEp5Wlc1MFVHOXphWFJwYjI0Z1lYUjBjbWxpZFhSbExseHVJQ0FnS2k5Y2JpQWdZMjl1YzNSeWRXTjBiM0lvWVhWa2FXOURiMjUwWlhoMExHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRXUnBieUJpZFdabVpYSmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1FYVmthVzlDZFdabVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVpZFdabVpYSWdQU0J2Y0hScGIyNXpMbUoxWm1abGNpQjhmQ0J1ZFd4c08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdaM0poYVc0Z2NHVnlhVzlrSUdsdUlITmxZMXh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXdaWEpwYjJSQlluTWdQU0J2Y0hScGIyNXpMbkJsY21sdlpFRmljeUI4ZkNBd0xqQXhPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUjNKaGFXNGdjR1Z5YVc5a0lISmxiR0YwYVhabElIUnZJR0ZpYzI5c2RYUmxJR1IxY21GMGFXOXVYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxuQmxjbWx2WkZKbGJDQTlJRzl3ZEdsdmJuTXVjR1Z5YVc5a1VtVnNJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkJiVzkxZENCdlppQnlZVzVrYjIwZ1ozSmhhVzRnY0dWeWFXOWtJSFpoY21saGRHbHZiaUJ5Wld4aGRHbDJaU0IwYnlCbmNtRnBiaUJ3WlhKcGIyUmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNHVnlhVzlrVm1GeUlEMGdiM0IwYVc5dWN5NXdaWEpwYjJSV1lYSWdmSHdnTUR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZHlZV2x1SUhCdmMybDBhVzl1SUNodmJuTmxkQ0IwYVcxbElHbHVJR0YxWkdsdklHSjFabVpsY2lrZ2FXNGdjMlZqWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbkJ2YzJsMGFXOXVJRDBnYjNCMGFXOXVjeTV3YjNOcGRHbHZiaUI4ZkNBd08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRVzF2ZFhRZ2IyWWdjbUZ1Wkc5dElHZHlZV2x1SUhCdmMybDBhVzl1SUhaaGNtbGhkR2x2YmlCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVjRzl6YVhScGIyNVdZWElnUFNCdmNIUnBiMjV6TG5CdmMybDBhVzl1Vm1GeUlIeDhJREF1TURBek8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdaM0poYVc0Z1pIVnlZWFJwYjI0Z2FXNGdjMlZqWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbVIxY21GMGFXOXVRV0p6SUQwZ2IzQjBhVzl1Y3k1a2RYSmhkR2x2YmtGaWN5QjhmQ0F3TGpFN0lDOHZJR0ZpYzI5c2RYUmxJR2R5WVdsdUlHUjFjbUYwYVc5dVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkhjbUZwYmlCa2RYSmhkR2x2YmlCeVpXeGhkR2wyWlNCMGJ5Qm5jbUZwYmlCd1pYSnBiMlFnS0c5MlpYSnNZWEFwWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbVIxY21GMGFXOXVVbVZzSUQwZ2IzQjBhVzl1Y3k1a2RYSmhkR2x2YmxKbGJDQjhmQ0F3TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FXSnpiMngxZEdVZ1lYUjBZV05ySUhScGJXVWdhVzRnYzJWalhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTA1MWJXSmxjbjFjYmlBZ0lDQWdLaTljYmlBZ0lDQjBhR2x6TG1GMGRHRmphMEZpY3lBOUlHOXdkR2x2Ym5NdVlYUjBZV05yUVdKeklIeDhJREE3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRIUmhZMnNnZEdsdFpTQnlaV3hoZEdsMlpTQjBieUJuY21GcGJpQmtkWEpoZEdsdmJseHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1aGRIUmhZMnRTWld3Z1BTQnZjSFJwYjI1ekxtRjBkR0ZqYTFKbGJDQjhmQ0F3TGpVN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlRhR0Z3WlNCdlppQmhkSFJoWTJ0Y2JpQWdJQ0FnS2lCQWRIbHdaU0I3VTNSeWFXNW5mU0FuYkdsdUp5Qm1iM0lnYkdsdVpXRnlJSEpoYlhBc0lDZGxlSEFuSUdadmNpQmxlSEJ2Ym1WdWRHbGhiRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WVhSMFlXTnJVMmhoY0dVZ1BTQnZjSFJwYjI1ekxtRjBkR0ZqYTFOb1lYQmxJSHg4SUNkc2FXNG5PMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUVdKemIyeDFkR1VnY21Wc1pXRnpaU0IwYVcxbElHbHVJSE5sWTF4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTV5Wld4bFlYTmxRV0p6SUQwZ2IzQjBhVzl1Y3k1eVpXeGxZWE5sUVdKeklIeDhJREE3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCU1pXeGxZWE5sSUhScGJXVWdjbVZzWVhScGRtVWdkRzhnWjNKaGFXNGdaSFZ5WVhScGIyNWNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNtVnNaV0Z6WlZKbGJDQTlJRzl3ZEdsdmJuTXVjbVZzWldGelpWSmxiQ0I4ZkNBd0xqVTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJUYUdGd1pTQnZaaUJ5Wld4bFlYTmxYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UxTjBjbWx1WjMwZ0oyeHBiaWNnWm05eUlHeHBibVZoY2lCeVlXMXdMQ0FuWlhod0p5Qm1iM0lnWlhod2IyNWxiblJwWVd4Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxuSmxiR1ZoYzJWVGFHRndaU0E5SUc5d2RHbHZibk11Y21Wc1pXRnpaVk5vWVhCbElIeDhJQ2RzYVc0bk8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dUMlptYzJWMElDaHpkR0Z5ZEM5bGJtUWdkbUZzZFdVcElHWnZjaUJsZUhCdmJtVnVkR2xoYkNCaGRIUmhZMnN2Y21Wc1pXRnpaVnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOUlHOW1abk5sZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVpYaHdVbUZ0Y0U5bVpuTmxkQ0E5SUc5d2RHbHZibk11Wlhod1VtRnRjRTltWm5ObGRDQjhmQ0F3TGpBd01ERTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJIY21GcGJpQnlaWE5oYlhCc2FXNW5JR2x1SUdObGJuUmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNtVnpZVzF3YkdsdVp5QTlJRzl3ZEdsdmJuTXVjbVZ6WVcxd2JHbHVaeUI4ZkNBd08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRVzF2ZFhRZ2IyWWdjbUZ1Wkc5dElISmxjMkZ0Y0d4cGJtY2dkbUZ5YVdGMGFXOXVJR2x1SUdObGJuUmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNtVnpZVzF3YkdsdVoxWmhjaUE5SUc5d2RHbHZibk11Y21WellXMXdiR2x1WjFaaGNpQjhmQ0F3TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1YyaGxkR2hsY2lCMGFHVWdaM0poYVc0Z2NHOXphWFJwYjI0Z2NtVm1aWEp6SUhSdklIUm9aU0JqWlc1MFpYSWdiMllnZEdobElHZHlZV2x1SUNodmNpQjBhR1VnWW1WbmFXNXVhVzVuS1Z4dUlDQWdJQ0FxSUVCMGVYQmxJSHRDYjI5c2ZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVZMlZ1ZEdWeVpXUWdQU0J2Y0hScGIyNXpMbU5sYm5SbGNtVmtJSHg4SUhSeWRXVTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJYYUdWMGFHVnlJSFJvWlNCaGRXUnBieUJpZFdabVpYSWdZVzVrSUdkeVlXbHVJSEJ2YzJsMGFXOXVJR0Z5WlNCamIyNXphV1JsY21Wa0lHRnpJR041WTJ4cFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0Q2IyOXNmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WTNsamJHbGpJRDBnYjNCMGFXOXVjeTVqZVdOc2FXTWdmSHdnWm1Gc2MyVTdYRzVjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVZ1BTQjBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJR2RsZENCaWRXWm1aWEpFZFhKaGRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2k1M2NtRndRWEp2ZFc1a1JYaDBaVzUwYVc5dUtWeHVJQ0FnSUNBZ1luVm1abVZ5UkhWeVlYUnBiMjRnTFQwZ2RHaHBjeTVpZFdabVpYSXVkM0poY0VGeWIzVnVaRVY0ZEdWdWRHbHZianRjYmx4dUlDQWdJSEpsZEhWeWJpQmlkV1ptWlhKRWRYSmhkR2x2Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRlJwYldWRmJtZHBibVVnWVhSMGNtbGlkWFJsWEc0Z0lHZGxkQ0JqZFhKeVpXNTBVRzl6YVhScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Y0c5emFYUnBiMjQ3WEc0Z0lIMWNibHh1SUNBdkx5QlVhVzFsUlc1bmFXNWxJRzFsZEdodlpDQW9jMk5vWldSMWJHVmtJR2x1ZEdWeVptRmpaU2xjYmlBZ1lXUjJZVzVqWlZScGJXVW9kR2x0WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYVcxbElDc2dkR2hwY3k1MGNtbG5aMlZ5S0hScGJXVXBPMXh1SUNCOVhHNWNiaUFnWjJWMElIQnNZWGxpWVdOclRHVnVaM1JvS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGTmxkQ0JuWVdsdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0IyWVd4MVpTQnNhVzVsWVhJZ1oyRnBiaUJtWVdOMGIzSmNiaUFnSUNvdlhHNGdJSE5sZENCbllXbHVLSFpoYkhWbEtTQjdYRzRnSUNBZ2RHaHBjeTVmWDJkaGFXNU9iMlJsTG1kaGFXNHVkbUZzZFdVZ1BTQjJZV3gxWlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnWjJGcGJseHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdOMWNuSmxiblFnWjJGcGJseHVJQ0FnS2k5Y2JpQWdaMlYwSUdkaGFXNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5bllXbHVUbTlrWlM1bllXbHVMblpoYkhWbE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJ5YVdkblpYSWdZU0JuY21GcGJseHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZEdsdFpTQm5jbUZwYmlCemVXNTBhR1Z6YVhNZ1lYVmthVzhnZEdsdFpWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUhCbGNtbHZaQ0IwYnlCdVpYaDBJR2R5WVdsdVhHNGdJQ0FxWEc0Z0lDQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z1kyRnVJR0psSUdOaGJHeGxaQ0JoZENCaGJua2dkR2x0WlNBb2QyaGxkR2hsY2lCMGFHVWdaVzVuYVc1bElHbHpJSE5qYUdWa2RXeGxaQ0J2Y2lCdWIzUXBYRzRnSUNBcUlIUnZJR2RsYm1WeVlYUmxJR0VnYzJsdVoyeGxJR2R5WVdsdUlHRmpZMjl5WkdsdVp5QjBieUIwYUdVZ1kzVnljbVZ1ZENCbmNtRnBiaUJ3WVhKaGJXVjBaWEp6TGx4dUlDQWdLaTljYmlBZ2RISnBaMmRsY2loMGFXMWxMQ0J2ZFhSd2RYUk9iMlJsSUQwZ2RHaHBjeTV2ZFhSd2RYUk9iMlJsS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dUlDQWdJSFpoY2lCbmNtRnBibFJwYldVZ1BTQjBhVzFsSUh4OElHRjFaR2x2UTI5dWRHVjRkQzVqZFhKeVpXNTBWR2x0WlR0Y2JpQWdJQ0IyWVhJZ1ozSmhhVzVRWlhKcGIyUWdQU0IwYUdsekxuQmxjbWx2WkVGaWN6dGNiaUFnSUNCMllYSWdaM0poYVc1UWIzTnBkR2x2YmlBOUlIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVPMXh1SUNBZ0lIWmhjaUJuY21GcGJrUjFjbUYwYVc5dUlEMGdkR2hwY3k1a2RYSmhkR2x2YmtGaWN6dGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2lrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEpsYzJGdGNHeHBibWRTWVhSbElEMGdNUzR3TzF4dVhHNGdJQ0FnSUNBdkx5QmpZV3hqZFd4aGRHVWdjbVZ6WVcxd2JHbHVaMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVjbVZ6WVcxd2JHbHVaeUFoUFQwZ01DQjhmQ0IwYUdsekxuSmxjMkZ0Y0d4cGJtZFdZWElnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCeVlXNWtiMjFTWlhOaGJYQnNhVzVuSUQwZ0tFMWhkR2d1Y21GdVpHOXRLQ2tnTFNBd0xqVXBJQ29nTWk0d0lDb2dkR2hwY3k1eVpYTmhiWEJzYVc1blZtRnlPMXh1SUNBZ0lDQWdJQ0J5WlhOaGJYQnNhVzVuVW1GMFpTQTlJRTFoZEdndWNHOTNLREl1TUN3Z0tIUm9hWE11Y21WellXMXdiR2x1WnlBcklISmhibVJ2YlZKbGMyRnRjR3hwYm1jcElDOGdNVEl3TUM0d0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdaM0poYVc1UVpYSnBiMlFnS3owZ2RHaHBjeTV3WlhKcGIyUlNaV3dnS2lCbmNtRnBia1IxY21GMGFXOXVPMXh1SUNBZ0lDQWdaM0poYVc1RWRYSmhkR2x2YmlBclBTQjBhR2x6TG1SMWNtRjBhVzl1VW1Wc0lDb2daM0poYVc1UVpYSnBiMlE3WEc1Y2JpQWdJQ0FnSUM4dklHZHlZV2x1SUhCbGNtbHZaQ0J5WVc1a2IyNGdkbUZ5YVdGMGFXOXVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXdaWEpwYjJSV1lYSWdQaUF3TGpBcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUdWeWFXOWtJQ3M5SURJdU1DQXFJQ2hOWVhSb0xuSmhibVJ2YlNncElDMGdNQzQxS1NBcUlIUm9hWE11Y0dWeWFXOWtWbUZ5SUNvZ1ozSmhhVzVRWlhKcGIyUTdYRzVjYmlBZ0lDQWdJQzh2SUdObGJuUmxjaUJuY21GcGJseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkyVnVkR1Z5WldRcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUc5emFYUnBiMjRnTFQwZ01DNDFJQ29nWjNKaGFXNUVkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdMeThnY21GdVpHOXRhWHBsSUdkeVlXbHVJSEJ2YzJsMGFXOXVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXdiM05wZEdsdmJsWmhjaUErSURBcFhHNGdJQ0FnSUNBZ0lHZHlZV2x1VUc5emFYUnBiMjRnS3owZ0tESXVNQ0FxSUUxaGRHZ3VjbUZ1Wkc5dEtDa2dMU0F4S1NBcUlIUm9hWE11Y0c5emFYUnBiMjVXWVhJN1hHNWNiaUFnSUNBZ0lIWmhjaUJpZFdabVpYSkVkWEpoZEdsdmJpQTlJSFJvYVhNdVluVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUM4dklIZHlZWEFnYjNJZ1kyeHBjQ0JuY21GcGJpQndiM05wZEdsdmJpQmhibVFnWkhWeVlYUnBiMjRnYVc1MGJ5QmlkV1ptWlhJZ1pIVnlZWFJwYjI1Y2JpQWdJQ0FnSUdsbUlDaG5jbUZwYmxCdmMybDBhVzl1SUR3Z01DQjhmQ0JuY21GcGJsQnZjMmwwYVc5dUlENDlJR0oxWm1abGNrUjFjbUYwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU41WTJ4cFl5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhaaGNpQmplV05zWlhNZ1BTQm5jbUZwYmxCdmMybDBhVzl1SUM4Z1luVm1abVZ5UkhWeVlYUnBiMjQ3WEc0Z0lDQWdJQ0FnSUNBZ1ozSmhhVzVRYjNOcGRHbHZiaUE5SUNoamVXTnNaWE1nTFNCTllYUm9MbVpzYjI5eUtHTjVZMnhsY3lrcElDb2dZblZtWm1WeVJIVnlZWFJwYjI0N1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1ozSmhhVzVRYjNOcGRHbHZiaUFySUdkeVlXbHVSSFZ5WVhScGIyNGdQaUIwYUdsekxtSjFabVpsY2k1a2RYSmhkR2x2YmlsY2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVJIVnlZWFJwYjI0Z1BTQjBhR2x6TG1KMVptWmxjaTVrZFhKaGRHbHZiaUF0SUdkeVlXbHVVRzl6YVhScGIyNDdYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHZHlZV2x1VUc5emFYUnBiMjRnUENBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCbmNtRnBibFJwYldVZ0xUMGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVJIVnlZWFJwYjI0Z0t6MGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2R5WVdsdVVHOXphWFJwYjI0Z1BTQXdPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNobmNtRnBibEJ2YzJsMGFXOXVJQ3NnWjNKaGFXNUVkWEpoZEdsdmJpQStJR0oxWm1abGNrUjFjbUYwYVc5dUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnWjNKaGFXNUVkWEpoZEdsdmJpQTlJR0oxWm1abGNrUjFjbUYwYVc5dUlDMGdaM0poYVc1UWIzTnBkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJ0WVd0bElHZHlZV2x1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWVdsdUlENGdNQ0FtSmlCbmNtRnBia1IxY21GMGFXOXVJRDQ5SURBdU1EQXhLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHMWhhMlVnWjNKaGFXNGdaVzUyWld4dmNHVmNiaUFnSUNBZ0lDQWdkbUZ5SUdWdWRtVnNiM0JsVG05a1pTQTlJR0YxWkdsdlEyOXVkR1Y0ZEM1amNtVmhkR1ZIWVdsdUtDazdYRzRnSUNBZ0lDQWdJSFpoY2lCaGRIUmhZMnNnUFNCMGFHbHpMbUYwZEdGamEwRmljeUFySUhSb2FYTXVZWFIwWVdOclVtVnNJQ29nWjNKaGFXNUVkWEpoZEdsdmJqdGNiaUFnSUNBZ0lDQWdkbUZ5SUhKbGJHVmhjMlVnUFNCMGFHbHpMbkpsYkdWaGMyVkJZbk1nS3lCMGFHbHpMbkpsYkdWaGMyVlNaV3dnS2lCbmNtRnBia1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaGhkSFJoWTJzZ0t5QnlaV3hsWVhObElENGdaM0poYVc1RWRYSmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFpoY2lCbVlXTjBiM0lnUFNCbmNtRnBia1IxY21GMGFXOXVJQzhnS0dGMGRHRmpheUFySUhKbGJHVmhjMlVwTzF4dUlDQWdJQ0FnSUNBZ0lHRjBkR0ZqYXlBcVBTQm1ZV04wYjNJN1hHNGdJQ0FnSUNBZ0lDQWdjbVZzWldGelpTQXFQU0JtWVdOMGIzSTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMllYSWdZWFIwWVdOclJXNWtWR2x0WlNBOUlHZHlZV2x1VkdsdFpTQXJJR0YwZEdGamF6dGNiaUFnSUNBZ0lDQWdkbUZ5SUdkeVlXbHVSVzVrVkdsdFpTQTlJR2R5WVdsdVZHbHRaU0FySUdkeVlXbHVSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQWdJSFpoY2lCeVpXeGxZWE5sVTNSaGNuUlVhVzFsSUQwZ1ozSmhhVzVGYm1SVWFXMWxJQzBnY21Wc1pXRnpaVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1aGRIUmhZMnRUYUdGd1pTQTlQVDBnSjJ4cGJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2d3TGpBc0lHZHlZV2x1VkdsdFpTazdYRzRnSUNBZ0lDQWdJQ0FnWlc1MlpXeHZjR1ZPYjJSbExtZGhhVzR1YkdsdVpXRnlVbUZ0Y0ZSdlZtRnNkV1ZCZEZScGJXVW9NUzR3TENCaGRIUmhZMnRGYm1SVWFXMWxLVHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2gwYUdsekxtVjRjRkpoYlhCUFptWnpaWFFzSUdkeVlXbHVWR2x0WlNrN1hHNGdJQ0FnSUNBZ0lDQWdaVzUyWld4dmNHVk9iMlJsTG1kaGFXNHVaWGh3YjI1bGJuUnBZV3hTWVcxd1ZHOVdZV3gxWlVGMFZHbHRaU2d4TGpBc0lHRjBkR0ZqYTBWdVpGUnBiV1VwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hKbGJHVmhjMlZUZEdGeWRGUnBiV1VnUGlCaGRIUmhZMnRGYm1SVWFXMWxLVnh1SUNBZ0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNW5ZV2x1TG5ObGRGWmhiSFZsUVhSVWFXMWxLREV1TUN3Z2NtVnNaV0Z6WlZOMFlYSjBWR2x0WlNrN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVjbVZzWldGelpWTm9ZWEJsSUQwOVBTQW5iR2x1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1Z1ZG1Wc2IzQmxUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXVNQ3dnWjNKaGFXNUZibVJVYVcxbEtUdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0JsYm5abGJHOXdaVTV2WkdVdVoyRnBiaTVsZUhCdmJtVnVkR2xoYkZKaGJYQlViMVpoYkhWbFFYUlVhVzFsS0hSb2FYTXVaWGh3VW1GdGNFOW1abk5sZEN3Z1ozSmhhVzVGYm1SVWFXMWxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHVnVkbVZzYjNCbFRtOWtaUzVqYjI1dVpXTjBLRzkxZEhCMWRFNXZaR1VwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRzFoYTJVZ2MyOTFjbU5sWEc0Z0lDQWdJQ0FnSUhaaGNpQnpiM1Z5WTJVZ1BTQmhkV1JwYjBOdmJuUmxlSFF1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sS0NrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExtSjFabVpsY2lBOUlIUm9hWE11WW5WbVptVnlPMXh1SUNBZ0lDQWdJQ0J6YjNWeVkyVXVjR3hoZVdKaFkydFNZWFJsTG5aaGJIVmxJRDBnY21WellXMXdiR2x1WjFKaGRHVTdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNWpiMjV1WldOMEtHVnVkbVZzYjNCbFRtOWtaU2s3WEc1Y2JpQWdJQ0FnSUNBZ2MyOTFjbU5sTG5OMFlYSjBLR2R5WVdsdVZHbHRaU3dnWjNKaGFXNVFiM05wZEdsdmJpazdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNXpkRzl3S0dkeVlXbHVWR2x0WlNBcklHZHlZV2x1UkhWeVlYUnBiMjRnTHlCeVpYTmhiWEJzYVc1blVtRjBaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlHZHlZV2x1VUdWeWFXOWtPMXh1SUNCOVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUjNKaGJuVnNZWEpGYm1kcGJtVTdJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFRpbWVFbmdpbmUgPSByZXF1aXJlKFwiLi4vY29yZS90aW1lLWVuZ2luZVwiKTtcblxudmFyIE1ldHJvbm9tZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgZnVuY3Rpb24gTWV0cm9ub21lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNZXRyb25vbWUpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoTWV0cm9ub21lLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgLyoqXG4gICAgICogTWV0cm9ub21lIHBlcmlvZCBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gb3B0aW9ucy5wZXJpb2QgfHwgMTtcblxuICAgIC8qKlxuICAgICAqIE1ldHJvbm9tZSBjbGljayBmcmVxdWVuY3lcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2xpY2tGcmVxID0gb3B0aW9ucy5jbGlja0ZyZXEgfHwgNjAwO1xuXG4gICAgLyoqXG4gICAgICogTWV0cm9ub21lIGNsaWNrIGF0dGFjayB0aW1lXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWNrQXR0YWNrID0gb3B0aW9ucy5jbGlja0F0dGFjayB8fCAwLjAwMjtcblxuICAgIC8qKlxuICAgICAqIE1ldHJvbm9tZSBjbGljayByZWxlYXNlIHRpbWVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2xpY2tSZWxlYXNlID0gb3B0aW9ucy5jbGlja1JlbGVhc2UgfHwgMC4wOTg7XG5cbiAgICB0aGlzLl9fcGhhc2UgPSAwO1xuXG4gICAgdGhpcy5fX2dhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluIHx8IDE7XG5cbiAgICB0aGlzLm91dHB1dE5vZGUgPSB0aGlzLl9fZ2Fpbk5vZGU7XG4gIH1cblxuICBfaW5oZXJpdHMoTWV0cm9ub21lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKE1ldHJvbm9tZSwge1xuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzY2hlZHVsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVRpbWUodGltZSkge1xuICAgICAgICB0aGlzLnRyaWdnZXIodGltZSk7XG4gICAgICAgIHJldHVybiB0aW1lICsgdGhpcy5wZXJpb2Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHRyYW5zcG9ydGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IChNYXRoLmZsb29yKHBvc2l0aW9uIC8gdGhpcy5wZXJpb2QpICsgdGhpcy5fX3BoYXNlKSAqIHRoaXMucGVyaW9kO1xuXG4gICAgICAgIGlmIChzcGVlZCA+IDAgJiYgbmV4dFBvc2l0aW9uIDwgcG9zaXRpb24pIG5leHRQb3NpdGlvbiArPSB0aGlzLnBlcmlvZDtlbHNlIGlmIChzcGVlZCA8IDAgJiYgbmV4dFBvc2l0aW9uID4gcG9zaXRpb24pIG5leHRQb3NpdGlvbiAtPSB0aGlzLnBlcmlvZDtcblxuICAgICAgICByZXR1cm4gbmV4dFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWR2YW5jZVBvc2l0aW9uOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcih0aW1lKTtcblxuICAgICAgICBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHBvc2l0aW9uIC0gdGhpcy5wZXJpb2Q7XG4gICAgICAgIH1yZXR1cm4gcG9zaXRpb24gKyB0aGlzLnBlcmlvZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIG1ldHJvbm9tZSBjbGlja1xuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgbWV0cm9ub21lIGNsaWNrIHN5bnRoZXNpcyBhdWRpbyB0aW1lXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIodGltZSkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBjbGlja0F0dGFjayA9IHRoaXMuY2xpY2tBdHRhY2s7XG4gICAgICAgIHZhciBjbGlja1JlbGVhc2UgPSB0aGlzLmNsaWNrUmVsZWFzZTtcbiAgICAgICAgdmFyIHBlcmlvZCA9IHRoaXMucGVyaW9kO1xuXG4gICAgICAgIGlmIChwZXJpb2QgPCBjbGlja0F0dGFjayArIGNsaWNrUmVsZWFzZSkge1xuICAgICAgICAgIHZhciBzY2FsZSA9IHBlcmlvZCAvIChjbGlja0F0dGFjayArIGNsaWNrUmVsZWFzZSk7XG4gICAgICAgICAgY2xpY2tBdHRhY2sgKj0gc2NhbGU7XG4gICAgICAgICAgY2xpY2tSZWxlYXNlICo9IHNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX2Vudk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLl9fZW52Tm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCB0aW1lICsgY2xpY2tBdHRhY2spO1xuICAgICAgICB0aGlzLl9fZW52Tm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMWUtNywgdGltZSArIGNsaWNrQXR0YWNrICsgY2xpY2tSZWxlYXNlKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX2Vudk5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgIHRoaXMuX19vc2MgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgICB0aGlzLl9fb3NjLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuY2xpY2tGcmVxO1xuICAgICAgICB0aGlzLl9fb3NjLnN0YXJ0KDApO1xuICAgICAgICB0aGlzLl9fb3NjLnN0b3AodGltZSArIGNsaWNrQXR0YWNrICsgY2xpY2tSZWxlYXNlKTtcbiAgICAgICAgdGhpcy5fX29zYy5jb25uZWN0KHRoaXMuX19lbnZOb2RlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdhaW46IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgZ2FpblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIGxpbmVhciBnYWluIGZhY3RvclxuICAgICAgICovXG5cbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gdmFsdWU7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBnYWluXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgZ2FpblxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGhhc2U6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgcGhhc2UgcGFyYW1ldGVyXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gcGhhc2UgbWV0cm9ub21lIHBoYXNlICgwLi4uMSlcbiAgICAgICAqL1xuXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChwaGFzZSkge1xuICAgICAgICB0aGlzLl9fcGhhc2UgPSBwaGFzZSAtIE1hdGguZmxvb3IocGhhc2UpO1xuICAgICAgICB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uKCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBwaGFzZSBwYXJhbWV0ZXJcbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gdmFsdWUgb2YgcGhhc2UgcGFyYW1ldGVyXG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3BoYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIE1ldHJvbm9tZTtcbn0pKFRpbWVFbmdpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldHJvbm9tZTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBtZXRyb25vbWUgZW5naW5lXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZQUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenM3U1VGRk1VTXNVMEZCVXp0QlFVTkdMRmRCUkZBc1UwRkJVeXhEUVVORUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FVUnNReXhUUVVGVE96dEJRVVZZTEhGRFFVWkZMRk5CUVZNc05rTkJSVXdzV1VGQldTeEZRVUZGT3pzN096czdRVUZOY0VJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUV3hETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1MwRkJTeXhEUVVGRE96czdPenM3UVVGTmFFUXNVVUZCU1N4RFFVRkRMRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zV1VGQldTeEpRVUZKTEV0QlFVc3NRMEZCUXpzN1FVRkZiRVFzVVVGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSV3BDTEZGQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTnFSQ3hSUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEVOQlFVTTdPMEZCUlM5RExGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJRenRIUVVOdVF6czdXVUZzUTBjc1UwRkJVenM3WlVGQlZDeFRRVUZUTzBGQmNVTmlMR1ZCUVZjN096czdZVUZCUVN4eFFrRkJReXhKUVVGSkxFVkJRVVU3UVVGRGFFSXNXVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU51UWl4bFFVRlBMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETzA5QlF6TkNPenRCUVVkRUxHZENRVUZaT3pzN08yRkJRVUVzYzBKQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRGJFTXNXVUZCU1N4WlFVRlpMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJYSkdMRmxCUVVrc1MwRkJTeXhIUVVGSExFTkJRVU1zU1VGQlNTeFpRVUZaTEVkQlFVY3NVVUZCVVN4RlFVTjBReXhaUVVGWkxFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVTjZRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NXVUZCV1N4SFFVRkhMRkZCUVZFc1JVRkRNME1zV1VGQldTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN08wRkJSVGxDTEdWQlFVOHNXVUZCV1N4RFFVRkRPMDlCUTNKQ096dEJRVWRFTEcxQ1FVRmxPenM3TzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN1FVRkZia0lzV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXp0QlFVTllMR2xDUVVGUExGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMU5CUVVFc1FVRkZhRU1zVDBGQlR5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRQUVVNdlFqczdRVUZOUkN4WFFVRlBPenM3T3pzN08yRkJRVUVzYVVKQlFVTXNTVUZCU1N4RlFVRkZPMEZCUTFvc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTnlReXhaUVVGSkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMEZCUTI1RExGbEJRVWtzV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRja01zV1VGQlNTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenM3UVVGRmVrSXNXVUZCU1N4TlFVRk5MRWRCUVVrc1YwRkJWeXhIUVVGSExGbEJRVmtzUVVGQlF5eEZRVUZGTzBGQlEzcERMR05CUVVrc1MwRkJTeXhIUVVGSExFMUJRVTBzU1VGQlNTeFhRVUZYTEVkQlFVY3NXVUZCV1N4RFFVRkJMRUZCUVVNc1EwRkJRenRCUVVOc1JDeHhRa0ZCVnl4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVOeVFpeHpRa0ZCV1N4SlFVRkpMRXRCUVVzc1EwRkJRenRUUVVOMlFqczdRVUZGUkN4WlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExGbEJRVmtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTXpReXhaUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJSeXhEUVVGRE8wRkJRMmhETEZsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zV1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUnl4RlFVRkZMRWxCUVVrc1IwRkJSeXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU55UlN4WlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhKUVVGVExFVkJRVVVzU1VGQlNTeEhRVUZITEZkQlFWY3NSMEZCUnl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNdlJpeFpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpWRExGbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGZUVNc1dVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFpRVUZaTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzUTBGQlF6dEJRVU0zUXl4WlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNMVF5eFpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU53UWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NWMEZCVnl4SFFVRkhMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMjVFTEZsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UFFVTndRenM3UVVGalJ5eFJRVUZKT3pzN096czdPMWRCVWtFc1ZVRkJReXhMUVVGTExFVkJRVVU3UVVGRFpDeFpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzA5QlEzQkRPenM3T3pzN1YwRk5UeXhaUVVGSE8wRkJRMVFzWlVGQlR5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03VDBGRGJrTTdPMEZCWlVjc1UwRkJTenM3T3pzN096dFhRVlJCTEZWQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTJZc1dVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU42UXl4WlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVWQlFVVXNRMEZCUXp0UFFVTXhRanM3T3pzN08xZEJUVkVzV1VGQlJ6dEJRVU5XTEdWQlFVOHNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJRenRQUVVOeVFqczdPenRUUVRsSVJ5eFRRVUZUTzBkQlFWTXNWVUZCVlRzN1FVRnBTV3hETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRElpd2labWxzWlNJNkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxSUhkeWFYUjBaVzRnYVc0Z1JVTk5RWE5qY21sd2RDQTJJQ292WEc0dktpcGNiaUFxSUVCbWFXeGxiM1psY25acFpYY2dWMEZXUlNCaGRXUnBieUJ0WlhSeWIyNXZiV1VnWlc1bmFXNWxYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblF1VTJOb2JtVnNiRUJwY21OaGJTNW1jaXdnVm1samRHOXlMbE5oYVhwQWFYSmpZVzB1Wm5Jc0lFdGhjbWx0TGtKaGNtdGhkR2xBYVhKallXMHVabkpjYmlBcUwxeHVYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiblpoY2lCVWFXMWxSVzVuYVc1bElEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXZkR2x0WlMxbGJtZHBibVZjSWlrN1hHNWNibU5zWVhOeklFMWxkSEp2Ym05dFpTQmxlSFJsYm1SeklGUnBiV1ZGYm1kcGJtVWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaGhkV1JwYjBOdmJuUmxlSFFzSUc5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lITjFjR1Z5S0dGMVpHbHZRMjl1ZEdWNGRDazdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJOWlhSeWIyNXZiV1VnY0dWeWFXOWtJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d1pYSnBiMlFnUFNCdmNIUnBiMjV6TG5CbGNtbHZaQ0I4ZkNBeE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dUV1YwY205dWIyMWxJR05zYVdOcklHWnlaWEYxWlc1amVWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amJHbGphMFp5WlhFZ1BTQnZjSFJwYjI1ekxtTnNhV05yUm5KbGNTQjhmQ0EyTURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQk5aWFJ5YjI1dmJXVWdZMnhwWTJzZ1lYUjBZV05ySUhScGJXVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVkyeHBZMnRCZEhSaFkyc2dQU0J2Y0hScGIyNXpMbU5zYVdOclFYUjBZV05ySUh4OElEQXVNREF5TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1RXVjBjbTl1YjIxbElHTnNhV05ySUhKbGJHVmhjMlVnZEdsdFpWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amJHbGphMUpsYkdWaGMyVWdQU0J2Y0hScGIyNXpMbU5zYVdOclVtVnNaV0Z6WlNCOGZDQXdMakE1T0R0Y2JseHVJQ0FnSUhSb2FYTXVYMTl3YUdGelpTQTlJREE3WEc1Y2JpQWdJQ0IwYUdsekxsOWZaMkZwYms1dlpHVWdQU0IwYUdsekxtRjFaR2x2UTI5dWRHVjRkQzVqY21WaGRHVkhZV2x1S0NrN1hHNGdJQ0FnZEdocGN5NWZYMmRoYVc1T2IyUmxMbWRoYVc0dWRtRnNkV1VnUFNCdmNIUnBiMjV6TG1kaGFXNGdmSHdnTVR0Y2JseHVJQ0FnSUhSb2FYTXViM1YwY0hWMFRtOWtaU0E5SUhSb2FYTXVYMTluWVdsdVRtOWtaVHRjYmlBZ2ZWeHVYRzRnSUM4dklGUnBiV1ZGYm1kcGJtVWdiV1YwYUc5a0lDaHpZMmhsWkhWc1pXUWdhVzUwWlhKbVlXTmxLVnh1SUNCaFpIWmhibU5sVkdsdFpTaDBhVzFsS1NCN1hHNGdJQ0FnZEdocGN5NTBjbWxuWjJWeUtIUnBiV1VwTzF4dUlDQWdJSEpsZEhWeWJpQjBhVzFsSUNzZ2RHaHBjeTV3WlhKcGIyUTdYRzRnSUgxY2JseHVJQ0F2THlCVWFXMWxSVzVuYVc1bElHMWxkR2h2WkNBb2RISmhibk53YjNKMFpXUWdhVzUwWlhKbVlXTmxLVnh1SUNCemVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHNWxlSFJRYjNOcGRHbHZiaUE5SUNoTllYUm9MbVpzYjI5eUtIQnZjMmwwYVc5dUlDOGdkR2hwY3k1d1pYSnBiMlFwSUNzZ2RHaHBjeTVmWDNCb1lYTmxLU0FxSUhSb2FYTXVjR1Z5YVc5a08xeHVYRzRnSUNBZ2FXWWdLSE53WldWa0lENGdNQ0FtSmlCdVpYaDBVRzl6YVhScGIyNGdQQ0J3YjNOcGRHbHZiaWxjYmlBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBclBTQjBhR2x6TG5CbGNtbHZaRHRjYmlBZ0lDQmxiSE5sSUdsbUlDaHpjR1ZsWkNBOElEQWdKaVlnYm1WNGRGQnZjMmwwYVc5dUlENGdjRzl6YVhScGIyNHBYRzRnSUNBZ0lDQnVaWGgwVUc5emFYUnBiMjRnTFQwZ2RHaHBjeTV3WlhKcGIyUTdYRzVjYmlBZ0lDQnlaWFIxY200Z2JtVjRkRkJ2YzJsMGFXOXVPMXh1SUNCOVhHNWNiaUFnTHk4Z1ZHbHRaVVZ1WjJsdVpTQnRaWFJvYjJRZ0tIUnlZVzV6Y0c5eWRHVmtJR2x1ZEdWeVptRmpaU2xjYmlBZ1lXUjJZVzVqWlZCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lIUm9hWE11ZEhKcFoyZGxjaWgwYVcxbEtUdGNibHh1SUNBZ0lHbG1JQ2h6Y0dWbFpDQThJREFwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdjRzl6YVhScGIyNGdMU0IwYUdsekxuQmxjbWx2WkR0Y2JseHVJQ0FnSUhKbGRIVnliaUJ3YjNOcGRHbHZiaUFySUhSb2FYTXVjR1Z5YVc5a08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJ5YVdkblpYSWdiV1YwY205dWIyMWxJR05zYVdOclhHNGdJQ0FxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0IwYVcxbElHMWxkSEp2Ym05dFpTQmpiR2xqYXlCemVXNTBhR1Z6YVhNZ1lYVmthVzhnZEdsdFpWeHVJQ0FnS2k5Y2JpQWdkSEpwWjJkbGNpaDBhVzFsS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dUlDQWdJSFpoY2lCamJHbGphMEYwZEdGamF5QTlJSFJvYVhNdVkyeHBZMnRCZEhSaFkyczdYRzRnSUNBZ2RtRnlJR05zYVdOclVtVnNaV0Z6WlNBOUlIUm9hWE11WTJ4cFkydFNaV3hsWVhObE8xeHVJQ0FnSUhaaGNpQndaWEpwYjJRZ1BTQjBhR2x6TG5CbGNtbHZaRHRjYmx4dUlDQWdJR2xtSUNod1pYSnBiMlFnUENBb1kyeHBZMnRCZEhSaFkyc2dLeUJqYkdsamExSmxiR1ZoYzJVcEtTQjdYRzRnSUNBZ0lDQjJZWElnYzJOaGJHVWdQU0J3WlhKcGIyUWdMeUFvWTJ4cFkydEJkSFJoWTJzZ0t5QmpiR2xqYTFKbGJHVmhjMlVwTzF4dUlDQWdJQ0FnWTJ4cFkydEJkSFJoWTJzZ0tqMGdjMk5oYkdVN1hHNGdJQ0FnSUNCamJHbGphMUpsYkdWaGMyVWdLajBnYzJOaGJHVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVmWDJWdWRrNXZaR1VnUFNCaGRXUnBiME52Ym5SbGVIUXVZM0psWVhSbFIyRnBiaWdwTzF4dUlDQWdJSFJvYVhNdVgxOWxiblpPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0F3TGpBN1hHNGdJQ0FnZEdocGN5NWZYMlZ1ZGs1dlpHVXVaMkZwYmk1elpYUldZV3gxWlVGMFZHbHRaU2d3TENCMGFXMWxLVHRjYmlBZ0lDQjBhR2x6TGw5ZlpXNTJUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtERXVNQ3dnZEdsdFpTQXJJR05zYVdOclFYUjBZV05yS1R0Y2JpQWdJQ0IwYUdsekxsOWZaVzUyVG05a1pTNW5ZV2x1TG1WNGNHOXVaVzUwYVdGc1VtRnRjRlJ2Vm1Gc2RXVkJkRlJwYldVb01DNHdNREF3TURBeExDQjBhVzFsSUNzZ1kyeHBZMnRCZEhSaFkyc2dLeUJqYkdsamExSmxiR1ZoYzJVcE8xeHVJQ0FnSUhSb2FYTXVYMTlsYm5aT2IyUmxMbWRoYVc0dWMyVjBWbUZzZFdWQmRGUnBiV1VvTUN3Z2RHbHRaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVkyOXVibVZqZENoMGFHbHpMbDlmWjJGcGJrNXZaR1VwTzF4dVhHNGdJQ0FnZEdocGN5NWZYMjl6WXlBOUlHRjFaR2x2UTI5dWRHVjRkQzVqY21WaGRHVlBjMk5wYkd4aGRHOXlLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyOXpZeTVtY21WeGRXVnVZM2t1ZG1Gc2RXVWdQU0IwYUdsekxtTnNhV05yUm5KbGNUdGNiaUFnSUNCMGFHbHpMbDlmYjNOakxuTjBZWEowS0RBcE8xeHVJQ0FnSUhSb2FYTXVYMTl2YzJNdWMzUnZjQ2gwYVcxbElDc2dZMnhwWTJ0QmRIUmhZMnNnS3lCamJHbGphMUpsYkdWaGMyVXBPMXh1SUNBZ0lIUm9hWE11WDE5dmMyTXVZMjl1Ym1WamRDaDBhR2x6TGw5ZlpXNTJUbTlrWlNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVMlYwSUdkaGFXNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUhaaGJIVmxJR3hwYm1WaGNpQm5ZV2x1SUdaaFkzUnZjbHh1SUNBZ0tpOWNiaUFnYzJWMElHZGhhVzRvZG1Gc2RXVXBJSHRjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVdVoyRnBiaTUyWVd4MVpTQTlJSFpoYkhWbE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCbllXbHVYRzRnSUNBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ1kzVnljbVZ1ZENCbllXbHVYRzRnSUNBcUwxeHVJQ0JuWlhRZ1oyRnBiaWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElIQm9ZWE5sSUhCaGNtRnRaWFJsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdjR2hoYzJVZ2JXVjBjbTl1YjIxbElIQm9ZWE5sSUNnd0xpNHVNU2xjYmlBZ0lDb3ZYRzRnSUhObGRDQndhR0Z6WlNod2FHRnpaU2tnZTF4dUlDQWdJSFJvYVhNdVgxOXdhR0Z6WlNBOUlIQm9ZWE5sSUMwZ1RXRjBhQzVtYkc5dmNpaHdhR0Z6WlNrN1hHNGdJQ0FnZEdocGN5NXlaWE5sZEU1bGVIUlFiM05wZEdsdmJpZ3BPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRDQndhR0Z6WlNCd1lYSmhiV1YwWlhKY2JpQWdJQ29nUUhKbGRIVnliaUI3VG5WdFltVnlmU0IyWVd4MVpTQnZaaUJ3YUdGelpTQndZWEpoYldWMFpYSmNiaUFnSUNvdlhHNGdJR2RsZENCd2FHRnpaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgzQm9ZWE5sTzF4dUlDQjlYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RXVjBjbTl1YjIxbE95SmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFRpbWVFbmdpbmUgPSByZXF1aXJlKFwiLi4vY29yZS90aW1lLWVuZ2luZVwiKTtcblxudmFyIFBsYXllckVuZ2luZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgZnVuY3Rpb24gUGxheWVyRW5naW5lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbGF5ZXJFbmdpbmUpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheWVyRW5naW5lLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgdGhpcy50cmFuc3BvcnQgPSBudWxsOyAvLyBzZXQgd2hlbiBhZGRlZCB0byB0cmFuc3BvcnRlclxuXG4gICAgLyoqXG4gICAgICogQXVkaW8gYnVmZmVyXG4gICAgICogQHR5cGUge0F1ZGlvQnVmZmVyfVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVyID0gb3B0aW9ucy5idWZmZXIgfHwgbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEZhZGUgdGltZSBmb3IgY2hhaW5pbmcgc2VnbWVudHMgKGUuZy4gaW4gc3RhcnQsIHN0b3AsIGFuZCBzZWVrKVxuICAgICAqIEB0eXBlIHtBdWRpb0J1ZmZlcn1cbiAgICAgKi9cbiAgICB0aGlzLmZhZGVUaW1lID0gMC4wMDU7XG5cbiAgICB0aGlzLl9fdGltZSA9IDA7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gMDtcbiAgICB0aGlzLl9fc3BlZWQgPSAwO1xuICAgIHRoaXMuX19jeWNsaWMgPSBmYWxzZTtcblxuICAgIHRoaXMuX19idWZmZXJTb3VyY2UgPSBudWxsO1xuICAgIHRoaXMuX19lbnZOb2RlID0gbnVsbDtcblxuICAgIHRoaXMuX19wbGF5aW5nU3BlZWQgPSAxO1xuXG4gICAgdGhpcy5fX2dhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX19nYWluTm9kZS5nYWluLnZhbHVlID0gb3B0aW9ucy5nYWluIHx8IDE7XG5cbiAgICB0aGlzLm91dHB1dE5vZGUgPSB0aGlzLl9fZ2Fpbk5vZGU7XG4gIH1cblxuICBfaW5oZXJpdHMoUGxheWVyRW5naW5lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKFBsYXllckVuZ2luZSwge1xuICAgIF9fc3RhcnQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3N0YXJ0KHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXIuZHVyYXRpb247XG5cbiAgICAgICAgICBpZiAodGhpcy5idWZmZXIud3JhcEFyb3VuZEV4dGVuc2lvbikgYnVmZmVyRHVyYXRpb24gLT0gdGhpcy5idWZmZXIud3JhcEFyb3VuZEV4dGVuc2lvbjtcblxuICAgICAgICAgIGlmICh0aGlzLl9fY3ljbGljICYmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gYnVmZmVyRHVyYXRpb24pKSB7XG4gICAgICAgICAgICB2YXIgcGhhc2UgPSBwb3NpdGlvbiAvIGJ1ZmZlckR1cmF0aW9uO1xuICAgICAgICAgICAgcG9zaXRpb24gPSAocGhhc2UgLSBNYXRoLmZsb29yKHBoYXNlKSkgKiBidWZmZXJEdXJhdGlvbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocG9zaXRpb24gPj0gMCAmJiBwb3NpdGlvbiA8IGJ1ZmZlckR1cmF0aW9uICYmIHNwZWVkID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgdGltZSArIHRoaXMuZmFkZVRpbWUpO1xuICAgICAgICAgICAgdGhpcy5fX2Vudk5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlID0gc3BlZWQ7XG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlLmxvb3AgPSB0aGlzLl9fY3ljbGljO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5sb29wU3RhcnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5sb29wRW5kID0gYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICB0aGlzLl9fYnVmZmVyU291cmNlLnN0YXJ0KHRpbWUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UuY29ubmVjdCh0aGlzLl9fZW52Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2hhbHQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2hhbHQodGltZSkge1xuICAgICAgICBpZiAodGhpcy5fX2J1ZmZlclNvdXJjZSkge1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRpbWUpO1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUodGhpcy5fX2Vudk5vZGUuZ2Fpbi52YWx1ZSwgdGltZSk7XG4gICAgICAgICAgdGhpcy5fX2Vudk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0aW1lICsgdGhpcy5mYWRlVGltZSk7XG4gICAgICAgICAgdGhpcy5fX2J1ZmZlclNvdXJjZS5zdG9wKHRpbWUgKyB0aGlzLmZhZGVUaW1lKTtcblxuICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX19lbnZOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzcGVlZC1jb250cm9sbGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIHNlZWsgPSBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzNdO1xuXG4gICAgICAgIHZhciBsYXN0U3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICAgICAgaWYgKHNwZWVkICE9PSBsYXN0U3BlZWQgfHwgc2Vlaykge1xuICAgICAgICAgIGlmIChzZWVrIHx8IGxhc3RTcGVlZCAqIHNwZWVkIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5fX2hhbHQodGltZSk7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RTcGVlZCA9PT0gMCB8fCBzZWVrKSB7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9faGFsdCh0aW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX19idWZmZXJTb3VyY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX19idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLnNldFZhbHVlQXRUaW1lKHNwZWVkLCB0aW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9fc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY3ljbGljOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IHdoZXRoZXIgdGhlIGF1ZGlvIGJ1ZmZlciBpcyBjb25zaWRlcmVkIGFzIGN5Y2xpY1xuICAgICAgICogQHBhcmFtIHtCb29sfSBjeWNsaWMgd2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGlzIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICAgKi9cblxuICAgICAgc2V0OiBmdW5jdGlvbiAoY3ljbGljKSB7XG4gICAgICAgIGlmIChjeWNsaWMgIT09IHRoaXMuX19jeWNsaWMpIHtcbiAgICAgICAgICB2YXIgdGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5jdXJyZW50b3NpdGlvbjtcblxuICAgICAgICAgIHRoaXMuX19oYWx0KHRpbWUpO1xuICAgICAgICAgIHRoaXMuX19jeWNsaWMgPSBjeWNsaWM7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX3NwZWVkICE9PSAwKSB0aGlzLl9fc3RhcnQodGltZSwgcG9zaXRpb24sIHRoaXMuX19zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHdoZXRoZXIgdGhlIGF1ZGlvIGJ1ZmZlciBpcyBjb25zaWRlcmVkIGFzIGN5Y2xpY1xuICAgICAgICogQHJldHVybiB7Qm9vbH0gd2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGlzIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2N5Y2xpYztcbiAgICAgIH1cbiAgICB9LFxuICAgIGdhaW46IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgZ2FpblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIGxpbmVhciBnYWluIGZhY3RvclxuICAgICAgICovXG5cbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcblxuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRpbWUpO1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuc2V0VmFsdWVBdFRpbWUodGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUsIHRpbWUpO1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdGltZSArIHRoaXMuZmFkZVRpbWUpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgZ2FpblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IGdhaW5cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBQbGF5ZXJFbmdpbmU7XG59KShUaW1lRW5naW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJFbmdpbmU7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gcGxheWVyIGVuZ2luZVxuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGUFFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1NVRkZNVU1zV1VGQldUdEJRVU5NTEZkQlJGQXNXVUZCV1N4RFFVTktMRmxCUVZrc1JVRkJaMEk3VVVGQlpDeFBRVUZQTEdkRFFVRkhMRVZCUVVVN096QkNRVVJzUXl4WlFVRlpPenRCUVVWa0xIRkRRVVpGTEZsQlFWa3NOa05CUlZJc1dVRkJXU3hGUVVGRk96dEJRVVZ3UWl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6czdPenM3TzBGQlRYUkNMRkZCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNTVUZCU1N4SlFVRkpMRU5CUVVNN096czdPenRCUVUxeVF5eFJRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJRenM3UVVGRmRFSXNVVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFFSXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGNFSXNVVUZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU03TzBGQlJYUkNMRkZCUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6TkNMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVjBRaXhSUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZlRUlzVVVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlEycEVMRkZCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdRVUZGTDBNc1VVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRPMGRCUTI1RE96dFpRV2hEUnl4WlFVRlpPenRsUVVGYUxGbEJRVms3UVVGclEyaENMRmRCUVU4N1lVRkJRU3hwUWtGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVNM1FpeFpRVUZKTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRE96dEJRVVZ5UXl4WlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRFppeGpRVUZKTEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF6czdRVUZGTVVNc1kwRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEcxQ1FVRnRRaXhGUVVOcVF5eGpRVUZqTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXh0UWtGQmJVSXNRMEZCUXpzN1FVRkZjRVFzWTBGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4TFFVRkxMRkZCUVZFc1IwRkJSeXhEUVVGRExFbEJRVWtzVVVGQlVTeEpRVUZKTEdOQlFXTXNRMEZCUVN4QlFVRkRMRVZCUVVVN1FVRkRha1VzWjBKQlFVa3NTMEZCU3l4SFFVRkhMRkZCUVZFc1IwRkJSeXhqUVVGakxFTkJRVU03UVVGRGRFTXNiMEpCUVZFc1IwRkJSeXhEUVVGRExFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGQkxFZEJRVWtzWTBGQll5eERRVUZETzFkQlEzcEVPenRCUVVWRUxHTkJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNTVUZCU1N4UlFVRlJMRWRCUVVjc1kwRkJZeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZETTBRc1owSkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NXVUZCV1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRek5ETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRelZETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRExFVkJRVVVzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOeVJTeG5Ra0ZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenRCUVVWNFF5eG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhaUVVGWkxFTkJRVU1zYTBKQlFXdENMRVZCUVVVc1EwRkJRenRCUVVONFJDeG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjZReXhuUWtGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU12UXl4blFrRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEyeERMR2RDUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNSMEZCUnl4alFVRmpMRU5CUVVNN1FVRkROME1zWjBKQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhuUWtGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFkQlF6ZERPMU5CUTBZN1QwRkRSanM3UVVGRlJDeFZRVUZOTzJGQlFVRXNaMEpCUVVNc1NVRkJTU3hGUVVGRk8wRkJRMWdzV1VGQlNTeEpRVUZKTEVOQlFVTXNZMEZCWXl4RlFVRkZPMEZCUTNaQ0xHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJoRUxHTkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGNFVXNZMEZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRja1VzWTBGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZMME1zWTBGQlNTeERRVUZETEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRNMElzWTBGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1UwRkRka0k3VDBGRFJqczdRVUZIUkN4aFFVRlRPenM3TzJGQlFVRXNiVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFXZENPMWxCUVdRc1NVRkJTU3huUTBGQlJ5eExRVUZMT3p0QlFVTXpReXhaUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPenRCUVVVM1FpeFpRVUZKTEV0QlFVc3NTMEZCU3l4VFFVRlRMRWxCUVVrc1NVRkJTU3hGUVVGRk8wRkJReTlDTEdOQlFVa3NTVUZCU1N4SlFVRkpMRk5CUVZNc1IwRkJSeXhMUVVGTExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEycERMR2RDUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJ4Q0xHZENRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdWMEZEY2tNc1RVRkJUU3hKUVVGSkxGTkJRVk1zUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTJ4RExHZENRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdWMEZEY2tNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETEVWQlFVVTdRVUZEZEVJc1owSkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1YwRkRia0lzVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4alFVRmpMRVZCUVVVN1FVRkRPVUlzWjBKQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1dVRkJXU3hEUVVGRExHTkJRV01zUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1YwRkRPVVE3TzBGQlJVUXNZMEZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU03VTBGRGRFSTdUMEZEUmpzN1FVRjFRa2NzVlVGQlRUczdPenM3T3p0WFFXcENRU3hWUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5xUWl4WlFVRkpMRTFCUVUwc1MwRkJTeXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTzBGQlF6VkNMR05CUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTTdRVUZETlVJc1kwRkJTU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZia01zWTBGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOc1FpeGpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTFCUVUwc1EwRkJRenM3UVVGRmRrSXNZMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFTkJRVU1zUlVGRGNFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRUUVVNNVF6dFBRVU5HT3pzN096czdWMEZOVXl4WlFVRkhPMEZCUTFnc1pVRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzA5QlEzUkNPenRCUVd0Q1J5eFJRVUZKT3pzN096czdPMWRCV2tFc1ZVRkJReXhMUVVGTExFVkJRVVU3UVVGRFpDeFpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03TzBGQlJYcENMRmxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNXVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEycEZMRmxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1QwRkRiRVU3T3pzN096dFhRVTFQTEZsQlFVYzdRVUZEVkN4bFFVRlBMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0UFFVTnVRenM3T3p0VFFUZEpSeXhaUVVGWk8wZEJRVk1zVlVGQlZUczdRVUZuU25KRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NXVUZCV1N4RFFVRkRJaXdpWm1sc1pTSTZJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUlIZHlhWFIwWlc0Z2FXNGdSVU5OUVhOamNtbHdkQ0EySUNvdlhHNHZLaXBjYmlBcUlFQm1hV3hsYjNabGNuWnBaWGNnVjBGV1JTQmhkV1JwYnlCd2JHRjVaWElnWlc1bmFXNWxYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblF1VTJOb2JtVnNiRUJwY21OaGJTNW1jaXdnVm1samRHOXlMbE5oYVhwQWFYSmpZVzB1Wm5Jc0lFdGhjbWx0TGtKaGNtdGhkR2xBYVhKallXMHVabkpjYmlBcUwxeHVYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiblpoY2lCVWFXMWxSVzVuYVc1bElEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXZkR2x0WlMxbGJtZHBibVZjSWlrN1hHNWNibU5zWVhOeklGQnNZWGxsY2tWdVoybHVaU0JsZUhSbGJtUnpJRlJwYldWRmJtZHBibVVnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0IwYUdsekxuUnlZVzV6Y0c5eWRDQTlJRzUxYkd3N0lDOHZJSE5sZENCM2FHVnVJR0ZrWkdWa0lIUnZJSFJ5WVc1emNHOXlkR1Z5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRXUnBieUJpZFdabVpYSmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1FYVmthVzlDZFdabVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVpZFdabVpYSWdQU0J2Y0hScGIyNXpMbUoxWm1abGNpQjhmQ0J1ZFd4c08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dSbUZrWlNCMGFXMWxJR1p2Y2lCamFHRnBibWx1WnlCelpXZHRaVzUwY3lBb1pTNW5MaUJwYmlCemRHRnlkQ3dnYzNSdmNDd2dZVzVrSUhObFpXc3BYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwRjFaR2x2UW5WbVptVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Wm1Ga1pWUnBiV1VnUFNBd0xqQXdOVHRjYmx4dUlDQWdJSFJvYVhNdVgxOTBhVzFsSUQwZ01EdGNiaUFnSUNCMGFHbHpMbDlmY0c5emFYUnBiMjRnUFNBd08xeHVJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJREE3WEc0Z0lDQWdkR2hwY3k1ZlgyTjVZMnhwWXlBOUlHWmhiSE5sTzF4dVhHNGdJQ0FnZEdocGN5NWZYMkoxWm1abGNsTnZkWEpqWlNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnZEdocGN5NWZYM0JzWVhscGJtZFRjR1ZsWkNBOUlERTdYRzVjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVZ1BTQjBhR2x6TG1GMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJRjlmYzNSaGNuUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHRjFaR2x2UTI5dWRHVjRkQ0E5SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11WW5WbVptVnlLU0I3WEc0Z0lDQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZblZtWm1WeUxuZHlZWEJCY205MWJtUkZlSFJsYm5OcGIyNHBYRzRnSUNBZ0lDQWdJR0oxWm1abGNrUjFjbUYwYVc5dUlDMDlJSFJvYVhNdVluVm1abVZ5TG5keVlYQkJjbTkxYm1SRmVIUmxibk5wYjI0N1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOWZZM2xqYkdsaklDWW1JQ2h3YjNOcGRHbHZiaUE4SURBZ2ZId2djRzl6YVhScGIyNGdQajBnWW5WbVptVnlSSFZ5WVhScGIyNHBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQndhR0Z6WlNBOUlIQnZjMmwwYVc5dUlDOGdZblZtWm1WeVJIVnlZWFJwYjI0N1hHNGdJQ0FnSUNBZ0lIQnZjMmwwYVc5dUlEMGdLSEJvWVhObElDMGdUV0YwYUM1bWJHOXZjaWh3YUdGelpTa3BJQ29nWW5WbVptVnlSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNod2IzTnBkR2x2YmlBK1BTQXdJQ1ltSUhCdmMybDBhVzl1SUR3Z1luVm1abVZ5UkhWeVlYUnBiMjRnSmlZZ2MzQmxaV1FnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOWxiblpPYjJSbElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVWRoYVc0b0tUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVoyRnBiaTV6WlhSV1lXeDFaVUYwVkdsdFpTZ3dMQ0IwYVcxbEtUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVkazV2WkdVdVoyRnBiaTVzYVc1bFlYSlNZVzF3Vkc5V1lXeDFaVUYwVkdsdFpTZ3hMQ0IwYVcxbElDc2dkR2hwY3k1bVlXUmxWR2x0WlNrN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5bGJuWk9iMlJsTG1OdmJtNWxZM1FvZEdocGN5NWZYMmRoYVc1T2IyUmxLVHRjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVUoxWm1abGNsTnZkWEpqWlNncE8xeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxMbUoxWm1abGNpQTlJSFJvYVhNdVluVm1abVZ5TzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuQnNZWGxpWVdOclVtRjBaUzUyWVd4MVpTQTlJSE53WldWa08xeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxMbXh2YjNBZ1BTQjBhR2x6TGw5ZlkzbGpiR2xqTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExteHZiM0JUZEdGeWRDQTlJREE3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTlpZFdabVpYSlRiM1Z5WTJVdWJHOXZjRVZ1WkNBOUlHSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuTjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMkoxWm1abGNsTnZkWEpqWlM1amIyNXVaV04wS0hSb2FYTXVYMTlsYm5aT2IyUmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JmWDJoaGJIUW9kR2x0WlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TGw5ZlluVm1abVZ5VTI5MWNtTmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWZaVzUyVG05a1pTNW5ZV2x1TG1OaGJtTmxiRk5qYUdWa2RXeGxaRlpoYkhWbGN5aDBhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlsYm5aT2IyUmxMbWRoYVc0dWMyVjBWbUZzZFdWQmRGUnBiV1VvZEdocGN5NWZYMlZ1ZGs1dlpHVXVaMkZwYmk1MllXeDFaU3dnZEdsdFpTazdYRzRnSUNBZ0lDQjBhR2x6TGw5ZlpXNTJUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXNJSFJwYldVZ0t5QjBhR2x6TG1aaFpHVlVhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlpZFdabVpYSlRiM1Z5WTJVdWMzUnZjQ2gwYVcxbElDc2dkR2hwY3k1bVlXUmxWR2x0WlNrN1hHNWNiaUFnSUNBZ0lIUm9hWE11WDE5aWRXWm1aWEpUYjNWeVkyVWdQU0J1ZFd4c08xeHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdWRrNXZaR1VnUFNCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUZScGJXVkZibWRwYm1VZ2JXVjBhRzlrSUNoemNHVmxaQzFqYjI1MGNtOXNiR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdjM2x1WTFOd1pXVmtLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkN3Z2MyVmxheUE5SUdaaGJITmxLU0I3WEc0Z0lDQWdkbUZ5SUd4aGMzUlRjR1ZsWkNBOUlIUm9hWE11WDE5emNHVmxaRHRjYmx4dUlDQWdJR2xtSUNoemNHVmxaQ0FoUFQwZ2JHRnpkRk53WldWa0lIeDhJSE5sWldzcElIdGNiaUFnSUNBZ0lHbG1JQ2h6WldWcklIeDhJR3hoYzNSVGNHVmxaQ0FxSUhOd1pXVmtJRHdnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmFHRnNkQ2gwYVcxbEtUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzTjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR3hoYzNSVGNHVmxaQ0E5UFQwZ01DQjhmQ0J6WldWcktTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXpkR0Z5ZENoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h6Y0dWbFpDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmFHRnNkQ2gwYVcxbEtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9kR2hwY3k1ZlgySjFabVpsY2xOdmRYSmpaU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmWW5WbVptVnlVMjkxY21ObExuQnNZWGxpWVdOclVtRjBaUzV6WlhSV1lXeDFaVUYwVkdsdFpTaHpjR1ZsWkN3Z2RHbHRaU2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVYMTl6Y0dWbFpDQTlJSE53WldWa08xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlRaWFFnZDJobGRHaGxjaUIwYUdVZ1lYVmthVzhnWW5WbVptVnlJR2x6SUdOdmJuTnBaR1Z5WldRZ1lYTWdZM2xqYkdsalhHNGdJQ0FxSUVCd1lYSmhiU0I3UW05dmJIMGdZM2xqYkdsaklIZG9aWFJvWlhJZ2RHaGxJR0YxWkdsdklHSjFabVpsY2lCcGN5QmpiMjV6YVdSbGNtVmtJR0Z6SUdONVkyeHBZMXh1SUNBZ0tpOWNiaUFnYzJWMElHTjVZMnhwWXloamVXTnNhV01wSUh0Y2JpQWdJQ0JwWmlBb1kzbGpiR2xqSUNFOVBTQjBhR2x6TGw5ZlkzbGpiR2xqS1NCN1hHNGdJQ0FnSUNCMllYSWdkR2x0WlNBOUlIUm9hWE11WTNWeWNtVnVkRlJwYldVN1hHNGdJQ0FnSUNCMllYSWdjRzl6YVhScGIyNGdQU0IwYUdsekxtTjFjbkpsYm5SdmMybDBhVzl1TzF4dVhHNGdJQ0FnSUNCMGFHbHpMbDlmYUdGc2RDaDBhVzFsS1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlqZVdOc2FXTWdQU0JqZVdOc2FXTTdYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbDlmYzNCbFpXUWdJVDA5SURBcFhHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5emRHRnlkQ2gwYVcxbExDQndiM05wZEdsdmJpd2dkR2hwY3k1ZlgzTndaV1ZrS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IyVjBJSGRvWlhSb1pYSWdkR2hsSUdGMVpHbHZJR0oxWm1abGNpQnBjeUJqYjI1emFXUmxjbVZrSUdGeklHTjVZMnhwWTF4dUlDQWdLaUJBY21WMGRYSnVJSHRDYjI5c2ZTQjNhR1YwYUdWeUlIUm9aU0JoZFdScGJ5QmlkV1ptWlhJZ2FYTWdZMjl1YzJsa1pYSmxaQ0JoY3lCamVXTnNhV05jYmlBZ0lDb3ZYRzRnSUdkbGRDQmplV05zYVdNb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTlqZVdOc2FXTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElHZGhhVzVjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIWmhiSFZsSUd4cGJtVmhjaUJuWVdsdUlHWmhZM1J2Y2x4dUlDQWdLaTljYmlBZ2MyVjBJR2RoYVc0b2RtRnNkV1VwSUh0Y2JpQWdJQ0IyWVhJZ2RHbHRaU0E5SUhSb2FYTXVYMTl6ZVc1aktDazdYRzVjYmlBZ0lDQjBhR2x6TGw5ZloyRnBiazV2WkdVdVkyRnVZMlZzVTJOb1pXUjFiR1ZrVm1Gc2RXVnpLSFJwYldVcE8xeHVJQ0FnSUhSb2FYTXVYMTluWVdsdVRtOWtaUzV6WlhSV1lXeDFaVUYwVkdsdFpTaDBhR2x6TGw5ZloyRnBiazV2WkdVdVoyRnBiaTUyWVd4MVpTd2dkR2x0WlNrN1hHNGdJQ0FnZEdocGN5NWZYMmRoYVc1T2IyUmxMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXNJSFJwYldVZ0t5QjBhR2x6TG1aaFpHVlVhVzFsS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnWjJGcGJseHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdOMWNuSmxiblFnWjJGcGJseHVJQ0FnS2k5Y2JpQWdaMlYwSUdkaGFXNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5bllXbHVUbTlrWlM1bllXbHVMblpoYkhWbE8xeHVJQ0I5WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVR3hoZVdWeVJXNW5hVzVsT3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50T3JQcmV2aW91c0luZGV4KHNvcnRlZEFycmF5LCB2YWx1ZSkge1xuICB2YXIgaW5kZXggPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMl07XG5cbiAgdmFyIHNpemUgPSBzb3J0ZWRBcnJheS5sZW5ndGg7XG5cbiAgaWYgKHNpemUgPiAwKSB7XG4gICAgdmFyIGZpcnN0VmFsID0gc29ydGVkQXJyYXlbMF07XG4gICAgdmFyIGxhc3RWYWwgPSBzb3J0ZWRBcnJheVtzaXplIC0gMV07XG5cbiAgICBpZiAodmFsdWUgPCBmaXJzdFZhbCkgaW5kZXggPSAtMTtlbHNlIGlmICh2YWx1ZSA+PSBsYXN0VmFsKSBpbmRleCA9IHNpemUgLSAxO2Vsc2Uge1xuICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSBpbmRleCA9IE1hdGguZmxvb3IoKHNpemUgLSAxKSAqICh2YWx1ZSAtIGZpcnN0VmFsKSAvIChsYXN0VmFsIC0gZmlyc3RWYWwpKTtcblxuICAgICAgd2hpbGUgKHNvcnRlZEFycmF5W2luZGV4XSA+IHZhbHVlKSBpbmRleC0tO1xuXG4gICAgICB3aGlsZSAoc29ydGVkQXJyYXlbaW5kZXggKyAxXSA8PSB2YWx1ZSkgaW5kZXgrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRPck5leHRJbmRleChzb3J0ZWRBcnJheSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzJdO1xuXG4gIHZhciBzaXplID0gc29ydGVkQXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzaXplID4gMCkge1xuICAgIHZhciBmaXJzdFZhbCA9IHNvcnRlZEFycmF5WzBdO1xuICAgIHZhciBsYXN0VmFsID0gc29ydGVkQXJyYXlbc2l6ZSAtIDFdO1xuXG4gICAgaWYgKHZhbHVlIDw9IGZpcnN0VmFsKSBpbmRleCA9IDA7ZWxzZSBpZiAodmFsdWUgPj0gbGFzdFZhbCkgaW5kZXggPSBzaXplO2Vsc2Uge1xuICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSBpbmRleCA9IE1hdGguZmxvb3IoKHNpemUgLSAxKSAqICh2YWx1ZSAtIGZpcnN0VmFsKSAvIChsYXN0VmFsIC0gZmlyc3RWYWwpKTtcblxuICAgICAgd2hpbGUgKHNvcnRlZEFycmF5W2luZGV4XSA8IHZhbHVlKSBpbmRleCsrO1xuXG4gICAgICB3aGlsZSAoc29ydGVkQXJyYXlbaW5kZXggKyAxXSA+PSB2YWx1ZSkgaW5kZXgtLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbi8qKlxuICogQGNsYXNzIFNlZ21lbnRFbmdpbmVcbiAqL1xuXG52YXIgU2VnbWVudEVuZ2luZSA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUpIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgaW5pdGlhbCBhdWRpbyBidWZmZXIgZm9yIGdyYW51bGFyIHN5bnRoZXNpc1xuICAgKlxuICAgKiBUaGUgZW5naW5lIGltcGxlbWVudHMgdGhlIFwic2NoZWR1bGVkXCIgYW5kIFwidHJhbnNwb3J0ZWRcIiBpbnRlcmZhY2VzLlxuICAgKiBXaGVuIFwic2NoZWR1bGVkXCIsIHRoZSBlbmdpbmUgIGdlbmVyYXRlcyBzZWdtZW50cyBtb3JlIG9yIGxlc3PCoHBlcmlvZGljYWxseVxuICAgKiAoY29udHJvbGxlZCBieSB0aGUgcGVyaW9kQWJzLCBwZXJpb2RSZWwsIGFuZCBwZXJpb1ZhciBhdHRyaWJ1dGVzKS5cbiAgICogV2hlbiBcInRyYW5zcG9ydGVkXCIsIHRoZSBlbmdpbmUgZ2VuZXJhdGVzIHNlZ21lbnRzIGF0IHRoZSBwb3NpdGlvbiBvZiB0aGVpciBvbnNldCB0aW1lLlxuICAgKi9cblxuICBmdW5jdGlvbiBTZWdtZW50RW5naW5lKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZWdtZW50RW5naW5lKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFNlZ21lbnRFbmdpbmUucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGF1ZGlvQ29udGV4dCk7XG5cbiAgICAvKipcbiAgICAgKiBBdWRpbyBidWZmZXJcbiAgICAgKiBAdHlwZSB7QXVkaW9CdWZmZXJ9XG4gICAgICovXG4gICAgdGhpcy5idWZmZXIgPSBvcHRpb25zLmJ1ZmZlciB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgc2VnbWVudCBwZXJpb2QgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZEFicyA9IG9wdGlvbnMucGVyaW9kQWJzIHx8IDAuMTtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgcGVyaW9kIHJlbGF0aXZlIHRvIGludGVyLXNlZ21lbnQgZGlzdGFuY2VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kUmVsID0gb3B0aW9ucy5wZXJpb2RSZWwgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSBzZWdtZW50IHBlcmlvZCB2YXJpYXRpb24gcmVsYXRpdmUgdG8gc2VnbWVudCBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kVmFyID0gb3B0aW9ucy5wZXJpb2RWYXIgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHNlZ21lbnQgcG9zaXRpb25zIChvbnNldCB0aW1lcyBpbiBhdWRpbyBidWZmZXIpIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gb3B0aW9ucy5wb3NpdGlvbkFycmF5IHx8IFswXTtcblxuICAgIC8qKlxuICAgICAqIEFtb3V0IG9mIHJhbmRvbSBzZWdtZW50IHBvc2l0aW9uIHZhcmlhdGlvbiBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucG9zaXRpb25WYXIgPSBvcHRpb25zLnBvc2l0aW9uVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBzZWdtZW50IGR1cmF0aW9ucyBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuZHVyYXRpb25BcnJheSA9IG9wdGlvbnMuZHVyYXRpb25BcnJheSB8fCBbMF07XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSBzZWdtZW50IGR1cmF0aW9uIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kdXJhdGlvbkFicyA9IG9wdGlvbnMuZHVyYXRpb25BYnMgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgZHVyYXRpb24gcmVsYXRpdmUgdG8gZ2l2ZW4gc2VnbWVudCBkdXJhdGlvbiBvciBpbnRlci1zZWdtZW50IGRpc3RhbmNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmR1cmF0aW9uUmVsID0gb3B0aW9ucy5kdXJhdGlvblJlbCB8fCAxO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2Ygc2VnbWVudCBvZmZzZXRzIGluIHNlY1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICpcbiAgICAgKiBvZmZzZXQgPiAwOiB0aGUgc2VnbWVudCdzIHJlZmVyZW5jZSBwb3NpdGlvbiBpcyBhZnRlciB0aGUgZ2l2ZW4gc2VnbWVudCBwb3NpdGlvblxuICAgICAqIG9mZnNldCA8IDA6IHRoZSBnaXZlbiBzZWdtZW50IHBvc2l0aW9uIGlzIHRoZSBzZWdtZW50J3MgcmVmZXJlbmNlIHBvc2l0aW9uIGFuZCB0aGUgZHVyYXRpb24gaGFzIHRvIGJlIGNvcnJlY3RlZCBieSB0aGUgb2Zmc2V0XG4gICAgICovXG4gICAgdGhpcy5vZmZzZXRBcnJheSA9IG9wdGlvbnMub2Zmc2V0QXJyYXkgfHwgWzBdO1xuXG4gICAgLyoqXG4gICAgICogQWJzb2x1dGUgc2VnbWVudCBvZmZzZXQgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm9mZnNldEFicyA9IG9wdGlvbnMub2Zmc2V0QWJzIHx8IC0wLjAwNTtcblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnQgb2Zmc2V0IHJlbGF0aXZlIHRvIHNlZ21lbnQgZHVyYXRpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2V0UmVsID0gb3B0aW9ucy5vZmZzZXRSZWwgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgYnkgd2hpY2ggYWxsIHNlZ21lbnRzIGFyZSBkZWxheWVkIChlc3BlY2lhbGx5IHRvIHJlYWxpemUgc2VnbWVudCBvZmZzZXRzKVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5kZWxheSA9IG9wdGlvbnMuZGVsYXkgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSBhdHRhY2sgdGltZSBpbiBzZWNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNrQWJzID0gb3B0aW9ucy5hdHRhY2tBYnMgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2sgdGltZSByZWxhdGl2ZSB0byBzZWdtZW50IGR1cmF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmF0dGFja1JlbCA9IG9wdGlvbnMuYXR0YWNrUmVsIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBYnNvbHV0ZSByZWxlYXNlIHRpbWUgaW4gc2VjXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnJlbGVhc2VBYnMgPSBvcHRpb25zLnJlbGVhc2VBYnMgfHwgMC4wMDU7XG5cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlIHRpbWUgcmVsYXRpdmUgdG8gc2VnbWVudCBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZWxlYXNlUmVsID0gb3B0aW9ucy5yZWxlYXNlUmVsIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBTZWdtZW50IHJlc2FtcGxpbmcgaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nID0gb3B0aW9ucy5yZXNhbXBsaW5nIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBBbW91dCBvZiByYW5kb20gcmVzYW1wbGluZyB2YXJpYXRpb24gaW4gY2VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5yZXNhbXBsaW5nVmFyID0gb3B0aW9ucy5yZXNhbXBsaW5nVmFyIHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBvZlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zZWdtZW50SW5kZXggPSBvcHRpb25zLnNlZ21lbnRJbmRleCB8fCAwO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgYXVkaW8gYnVmZmVyIGFuZCBzZWdtZW50IGluZGljZXMgYXJlIGNvbnNpZGVyZWQgYXMgY3ljbGljXG4gICAgICogQHR5cGUge0Jvb2x9XG4gICAgICovXG4gICAgdGhpcy5jeWNsaWMgPSBvcHRpb25zLmN5Y2xpYyB8fCBmYWxzZTtcbiAgICB0aGlzLl9fY3ljbGljT2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuX19nYWluTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5fX2dhaW5Ob2RlLmdhaW4udmFsdWUgPSBvcHRpb25zLmdhaW4gfHwgMTtcblxuICAgIHRoaXMub3V0cHV0Tm9kZSA9IHRoaXMuX19nYWluTm9kZTtcbiAgfVxuXG4gIF9pbmhlcml0cyhTZWdtZW50RW5naW5lLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKFNlZ21lbnRFbmdpbmUsIHtcbiAgICBidWZmZXJEdXJhdGlvbjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidWZmZXJEdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uKSBidWZmZXJEdXJhdGlvbiAtPSB0aGlzLmJ1ZmZlci53cmFwQXJvdW5kRXh0ZW50aW9uO1xuXG4gICAgICAgIHJldHVybiBidWZmZXJEdXJhdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgcmV0dXJuIHRpbWUgKyB0aGlzLnRyaWdnZXIodGltZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHRyYW5zcG9ydGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zZWdtZW50SW5kZXg7XG4gICAgICAgIHZhciBjeWNsaWNPZmZzZXQgPSAwO1xuICAgICAgICB2YXIgYnVmZmVyRHVyYXRpb24gPSB0aGlzLmJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmN5Y2xpYykge1xuICAgICAgICAgIHZhciBjeWNsZXMgPSBwb3NpdGlvbiAvIGJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgICAgY3ljbGljT2Zmc2V0ID0gTWF0aC5mbG9vcihjeWNsZXMpICogYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgcG9zaXRpb24gLT0gY3ljbGljT2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgIGluZGV4ID0gZ2V0Q3VycmVudE9yTmV4dEluZGV4KHRoaXMucG9zaXRpb25BcnJheSwgcG9zaXRpb24pO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN5Y2xpY09mZnNldCArPSBidWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmN5Y2xpYykge1xuICAgICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNwZWVkIDwgMCkge1xuICAgICAgICAgIGluZGV4ID0gZ2V0Q3VycmVudE9yUHJldmlvdXNJbmRleCh0aGlzLnBvc2l0aW9uQXJyYXksIHBvc2l0aW9uKTtcblxuICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjeWNsaWNPZmZzZXQgLT0gYnVmZmVyRHVyYXRpb247XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5jeWNsaWMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIC1JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWdtZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5fX2N5Y2xpY09mZnNldCA9IGN5Y2xpY09mZnNldDtcblxuICAgICAgICByZXR1cm4gY3ljbGljT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkdmFuY2VQb3NpdGlvbjoge1xuXG4gICAgICAvLyBUaW1lRW5naW5lIG1ldGhvZCAodHJhbnNwb3J0ZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNlZ21lbnRJbmRleDtcbiAgICAgICAgdmFyIGN5Y2xpY09mZnNldCA9IHRoaXMuX19jeWNsaWNPZmZzZXQ7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKHRpbWUpO1xuXG4gICAgICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN5Y2xpY09mZnNldCArPSB0aGlzLmJ1ZmZlckR1cmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY3ljbGljKSB7XG4gICAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXgtLTtcblxuICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjeWNsaWNPZmZzZXQgLT0gdGhpcy5idWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmN5Y2xpYykge1xuICAgICAgICAgICAgICByZXR1cm4gLUluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VnbWVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuX19jeWNsaWNPZmZzZXQgPSBjeWNsaWNPZmZzZXQ7XG5cbiAgICAgICAgcmV0dXJuIGN5Y2xpY09mZnNldCArIHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG4gICAgICB9XG4gICAgfSxcbiAgICBnYWluOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IGdhaW5cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBsaW5lYXIgZ2FpbiBmYWN0b3JcbiAgICAgICAqL1xuXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgZ2FpblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IGdhaW5cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIGEgc2VnbWVudFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSBzZWdtZW50IHN5bnRoZXNpcyBhdWRpbyB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHBlcmlvZCB0byBuZXh0IHNlZ21lbnRcbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWQgYXQgYW55IHRpbWUgKHdoZXRoZXIgdGhlIGVuZ2luZSBpcyBzY2hlZHVsZWQvdHJhbnNwb3J0ZWQgb3Igbm90KVxuICAgICAgICogdG8gZ2VuZXJhdGUgYSBzaW5nbGUgc2VnbWVudCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc2VnbWVudCBwYXJhbWV0ZXJzLlxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0cmlnZ2VyKGF1ZGlvVGltZSkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBzZWdtZW50VGltZSA9IGF1ZGlvVGltZSB8fCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyB0aGlzLmRlbGF5O1xuICAgICAgICB2YXIgc2VnbWVudFBlcmlvZCA9IHRoaXMucGVyaW9kQWJzO1xuICAgICAgICB2YXIgc2VnbWVudEluZGV4ID0gdGhpcy5zZWdtZW50SW5kZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnRQb3NpdGlvbiA9IDA7XG4gICAgICAgICAgdmFyIHNlZ21lbnREdXJhdGlvbiA9IDA7XG4gICAgICAgICAgdmFyIHNlZ21lbnRPZmZzZXQgPSAwO1xuICAgICAgICAgIHZhciByZXNhbXBsaW5nUmF0ZSA9IDE7XG4gICAgICAgICAgdmFyIGJ1ZmZlckR1cmF0aW9uID0gdGhpcy5idWZmZXJEdXJhdGlvbjtcblxuICAgICAgICAgIGlmICh0aGlzLmN5Y2xpYykgc2VnbWVudEluZGV4ID0gc2VnbWVudEluZGV4ICUgdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aDtlbHNlIHNlZ21lbnRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNlZ21lbnRJbmRleCwgdGhpcy5wb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDEpKTtcblxuICAgICAgICAgIGlmICh0aGlzLnBvc2l0aW9uQXJyYXkpIHNlZ21lbnRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb25BcnJheVtzZWdtZW50SW5kZXhdIHx8IDA7XG5cbiAgICAgICAgICBpZiAodGhpcy5kdXJhdGlvbkFycmF5KSBzZWdtZW50RHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uQXJyYXlbc2VnbWVudEluZGV4XSB8fCAwO1xuXG4gICAgICAgICAgaWYgKHRoaXMub2Zmc2V0QXJyYXkpIHNlZ21lbnRPZmZzZXQgPSB0aGlzLm9mZnNldEFycmF5W3NlZ21lbnRJbmRleF0gfHwgMDtcblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSByZXNhbXBsaW5nXG4gICAgICAgICAgaWYgKHRoaXMucmVzYW1wbGluZyAhPT0gMCB8fCB0aGlzLnJlc2FtcGxpbmdWYXIgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcmFuZG9tUmVzYW1wbGluZyA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIgKiB0aGlzLnJlc2FtcGxpbmdWYXI7XG4gICAgICAgICAgICByZXNhbXBsaW5nUmF0ZSA9IE1hdGgucG93KDIsICh0aGlzLnJlc2FtcGxpbmcgKyByYW5kb21SZXNhbXBsaW5nKSAvIDEyMDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSBpbnRlci1zZWdtZW50IGRpc3RhbmNlXG4gICAgICAgICAgaWYgKHNlZ21lbnREdXJhdGlvbiA9PT0gMCB8fCB0aGlzLnBlcmlvZFJlbCA+IDApIHtcbiAgICAgICAgICAgIHZhciBuZXh0U2VnZW1lbnRJbmRleCA9IHNlZ21lbnRJbmRleCArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uLCBuZXh0T2Zmc2V0O1xuXG4gICAgICAgICAgICBpZiAobmV4dFNlZ2VtZW50SW5kZXggPT09IHRoaXMucG9zaXRpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY3ljbGljKSB7XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkFycmF5WzBdICsgYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICAgICAgbmV4dE9mZnNldCA9IHRoaXMub2Zmc2V0QXJyYXlbMF07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gYnVmZmVyRHVyYXRpb247XG4gICAgICAgICAgICAgICAgbmV4dE9mZnNldCA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb25BcnJheVtuZXh0U2VnZW1lbnRJbmRleF07XG4gICAgICAgICAgICAgIG5leHRPZmZzZXQgPSB0aGlzLm9mZnNldEFycmF5W25leHRTZWdlbWVudEluZGV4XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGludGVyU2VnbWVudERpc3RhbmNlID0gbmV4dFBvc2l0aW9uIC0gc2VnbWVudFBvc2l0aW9uO1xuXG4gICAgICAgICAgICAvLyBjb3JyZWN0IGludGVyLXNlZ21lbnQgZGlzdGFuY2UgYnkgb2Zmc2V0c1xuICAgICAgICAgICAgLy8gICBvZmZzZXQgPiAwOiB0aGUgc2VnbWVudCdzIHJlZmVyZW5jZSBwb3NpdGlvbiBpcyBhZnRlciB0aGUgZ2l2ZW4gc2VnbWVudCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHNlZ21lbnRPZmZzZXQgPiAwKSBpbnRlclNlZ21lbnREaXN0YW5jZSAtPSBzZWdtZW50T2Zmc2V0O1xuXG4gICAgICAgICAgICBpZiAobmV4dE9mZnNldCA+IDApIGludGVyU2VnbWVudERpc3RhbmNlICs9IG5leHRPZmZzZXQ7XG5cbiAgICAgICAgICAgIGlmIChpbnRlclNlZ21lbnREaXN0YW5jZSA8IDApIGludGVyU2VnbWVudERpc3RhbmNlID0gMDtcblxuICAgICAgICAgICAgLy8gdXNlIGludGVyLXNlZ21lbnQgZGlzdGFuY2UgaW5zdGVhZCBvZiBzZWdtZW50IGR1cmF0aW9uXG4gICAgICAgICAgICBpZiAoc2VnbWVudER1cmF0aW9uID09PSAwKSBzZWdtZW50RHVyYXRpb24gPSBpbnRlclNlZ21lbnREaXN0YW5jZTtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHBlcmlvZCByZWxhdGl2ZSB0byBpbnRlciBtYXJrZXIgZGlzdGFuY2VcbiAgICAgICAgICAgIHNlZ21lbnRQZXJpb2QgKz0gdGhpcy5wZXJpb2RSZWwgKiBpbnRlclNlZ21lbnREaXN0YW5jZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBhZGQgcmVsYXRpdmUgYW5kIGFic29sdXRlIHNlZ21lbnQgZHVyYXRpb25cbiAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKj0gdGhpcy5kdXJhdGlvblJlbDtcbiAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKz0gdGhpcy5kdXJhdGlvbkFicztcblxuICAgICAgICAgIC8vIGFkZCByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgc2VnbWVudCBvZmZzZXRcbiAgICAgICAgICBzZWdtZW50T2Zmc2V0ICo9IHRoaXMub2Zmc2V0UmVsO1xuICAgICAgICAgIHNlZ21lbnRPZmZzZXQgKz0gdGhpcy5vZmZzZXRBYnM7XG5cbiAgICAgICAgICAvLyBhcHBseSBzZWdtZW50IG9mZnNldFxuICAgICAgICAgIC8vICAgb2Zmc2V0ID4gMDogdGhlIHNlZ21lbnQncyByZWZlcmVuY2UgcG9zaXRpb24gaXMgYWZ0ZXIgdGhlIGdpdmVuIHNlZ21lbnQgcG9zaXRpb25cbiAgICAgICAgICAvLyAgIG9mZnNldCA8IDA6IHRoZSBnaXZlbiBzZWdtZW50IHBvc2l0aW9uIGlzIHRoZSBzZWdtZW50J3MgcmVmZXJlbmNlIHBvc2l0aW9uIGFuZCB0aGUgZHVyYXRpb24gaGFzIHRvIGJlIGNvcnJlY3RlZCBieSB0aGUgb2Zmc2V0XG4gICAgICAgICAgaWYgKHNlZ21lbnRPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICBzZWdtZW50RHVyYXRpb24gLT0gc2VnbWVudE9mZnNldDtcbiAgICAgICAgICAgIHNlZ21lbnRQb3NpdGlvbiArPSBzZWdtZW50T2Zmc2V0O1xuICAgICAgICAgICAgc2VnbWVudFRpbWUgKz0gc2VnbWVudE9mZnNldCAvIHJlc2FtcGxpbmdSYXRlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWdtZW50VGltZSAtPSBzZWdtZW50T2Zmc2V0IC8gcmVzYW1wbGluZ1JhdGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmFuZG9taXplIHNlZ21lbnQgcG9zaXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvblZhciA+IDApIHNlZ21lbnRQb3NpdGlvbiArPSAyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wb3NpdGlvblZhcjtcblxuICAgICAgICAgIC8vIHNob3J0ZW4gZHVyYXRpb24gb2Ygc2VnbWVudHMgb3ZlciB0aGUgZWRnZXMgb2YgdGhlIGJ1ZmZlclxuICAgICAgICAgIGlmIChzZWdtZW50UG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICBzZWdtZW50RHVyYXRpb24gKz0gc2VnbWVudFBvc2l0aW9uO1xuICAgICAgICAgICAgc2VnbWVudFBvc2l0aW9uID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudFBvc2l0aW9uICsgc2VnbWVudER1cmF0aW9uID4gdGhpcy5idWZmZXIuZHVyYXRpb24pIHNlZ21lbnREdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uIC0gc2VnbWVudFBvc2l0aW9uO1xuXG4gICAgICAgICAgLy8gbWFrZSBzZWdtZW50XG4gICAgICAgICAgaWYgKHRoaXMuZ2FpbiA+IDAgJiYgc2VnbWVudER1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgLy8gbWFrZSBzZWdtZW50IGVudmVsb3BlXG4gICAgICAgICAgICB2YXIgZW52ZWxvcGVOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgICAgIHZhciBhdHRhY2sgPSB0aGlzLmF0dGFja0FicyArIHRoaXMuYXR0YWNrUmVsICogc2VnbWVudER1cmF0aW9uO1xuICAgICAgICAgICAgdmFyIHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VBYnMgKyB0aGlzLnJlbGVhc2VSZWwgKiBzZWdtZW50RHVyYXRpb247XG5cbiAgICAgICAgICAgIGlmIChhdHRhY2sgKyByZWxlYXNlID4gc2VnbWVudER1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBmYWN0b3IgPSBzZWdtZW50RHVyYXRpb24gLyAoYXR0YWNrICsgcmVsZWFzZSk7XG4gICAgICAgICAgICAgIGF0dGFjayAqPSBmYWN0b3I7XG4gICAgICAgICAgICAgIHJlbGVhc2UgKj0gZmFjdG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0YWNrRW5kVGltZSA9IHNlZ21lbnRUaW1lICsgYXR0YWNrO1xuICAgICAgICAgICAgdmFyIHNlZ21lbnRFbmRUaW1lID0gc2VnbWVudFRpbWUgKyBzZWdtZW50RHVyYXRpb247XG4gICAgICAgICAgICB2YXIgcmVsZWFzZVN0YXJ0VGltZSA9IHNlZ21lbnRFbmRUaW1lIC0gcmVsZWFzZTtcblxuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4udmFsdWUgPSB0aGlzLmdhaW47XG5cbiAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHNlZ21lbnRUaW1lKTtcbiAgICAgICAgICAgIGVudmVsb3BlTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ2FpbiwgYXR0YWNrRW5kVGltZSk7XG5cbiAgICAgICAgICAgIGlmIChyZWxlYXNlU3RhcnRUaW1lID4gYXR0YWNrRW5kVGltZSkgZW52ZWxvcGVOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUodGhpcy5nYWluLCByZWxlYXNlU3RhcnRUaW1lKTtcblxuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgc2VnbWVudEVuZFRpbWUpO1xuICAgICAgICAgICAgZW52ZWxvcGVOb2RlLmNvbm5lY3QodGhpcy5fX2dhaW5Ob2RlKTtcblxuICAgICAgICAgICAgLy8gbWFrZSBzb3VyY2VcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cbiAgICAgICAgICAgIHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgICAgIHNvdXJjZS5wbGF5YmFja1JhdGUudmFsdWUgPSByZXNhbXBsaW5nUmF0ZTtcbiAgICAgICAgICAgIHNvdXJjZS5jb25uZWN0KGVudmVsb3BlTm9kZSk7XG4gICAgICAgICAgICBlbnZlbG9wZU5vZGUuY29ubmVjdCh0aGlzLl9fZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICBzb3VyY2Uuc3RhcnQoc2VnbWVudFRpbWUsIHNlZ21lbnRQb3NpdGlvbik7XG4gICAgICAgICAgICBzb3VyY2Uuc3RvcChzZWdtZW50VGltZSArIHNlZ21lbnREdXJhdGlvbiAvIHJlc2FtcGxpbmdSYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VnbWVudFBlcmlvZDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBTZWdtZW50RW5naW5lO1xufSkoVGltZUVuZ2luZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudEVuZ2luZTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBzb3VuZCBzZWdtZW50IGVuZ2luZVxuICogQGF1dGhvciBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIFZpY3Rvci5TYWl6QGlyY2FtLmZyLCBLYXJpbS5CYXJrYXRpQGlyY2FtLmZyXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGUFFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZhRVFzVTBGQlV5eDVRa0ZCZVVJc1EwRkJReXhYUVVGWExFVkJRVVVzUzBGQlN5eEZRVUZoTzAxQlFWZ3NTMEZCU3l4blEwRkJSeXhEUVVGRE96dEJRVU01UkN4TlFVRkpMRWxCUVVrc1IwRkJSeXhYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZET3p0QlFVVTVRaXhOUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZEV2l4UlFVRkpMRkZCUVZFc1IwRkJSeXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZET1VJc1VVRkJTU3hQUVVGUExFZEJRVWNzVjBGQlZ5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmNFTXNVVUZCU1N4TFFVRkxMRWRCUVVjc1VVRkJVU3hGUVVOc1FpeExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkRVaXhKUVVGSkxFdEJRVXNzU1VGQlNTeFBRVUZQTEVWQlEzWkNMRXRCUVVzc1IwRkJSeXhKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEV0QlEyUTdRVUZEU0N4VlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFbEJRVWtzUzBGQlN5eEpRVUZKTEVsQlFVa3NSVUZETlVJc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGQkxFbEJRVXNzUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUVN4QlFVRkRMRWxCUVVrc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlFTeEJRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZOMFVzWVVGQlR5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1MwRkJTeXhGUVVNdlFpeExRVUZMTEVWQlFVVXNRMEZCUXpzN1FVRkZWaXhoUVVGUExGZEJRVmNzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhGUVVOd1F5eExRVUZMTEVWQlFVVXNRMEZCUXp0TFFVTllPMGRCUTBZN08wRkJSVVFzVTBGQlR5eExRVUZMTEVOQlFVTTdRMEZEWkRzN1FVRkZSQ3hUUVVGVExIRkNRVUZ4UWl4RFFVRkRMRmRCUVZjc1JVRkJSU3hMUVVGTExFVkJRV0U3VFVGQldDeExRVUZMTEdkRFFVRkhMRU5CUVVNN08wRkJRekZFTEUxQlFVa3NTVUZCU1N4SFFVRkhMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUbENMRTFCUVVrc1NVRkJTU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU5hTEZGQlFVa3NVVUZCVVN4SFFVRkhMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU01UWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhYUVVGWExFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWd1F5eFJRVUZKTEV0QlFVc3NTVUZCU1N4UlFVRlJMRVZCUTI1Q0xFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNTMEZEVUN4SlFVRkpMRXRCUVVzc1NVRkJTU3hQUVVGUExFVkJRM1pDTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkRWanRCUVVOSUxGVkJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hGUVVNMVFpeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVRXNTVUZCU3l4TFFVRkxMRWRCUVVjc1VVRkJVU3hEUVVGQkxFRkJRVU1zU1VGQlNTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkJMRUZCUVVNc1EwRkJReXhEUVVGRE96dEJRVVUzUlN4aFFVRlBMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eExRVUZMTEVWQlF5OUNMRXRCUVVzc1JVRkJSU3hEUVVGRE96dEJRVVZXTEdGQlFVOHNWMEZCVnl4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeExRVUZMTEVWQlEzQkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wdEJRMWc3UjBGRFJqczdRVUZGUkN4VFFVRlBMRXRCUVVzc1EwRkJRenREUVVOa096czdPenM3U1VGTFN5eGhRVUZoT3pzN096czdPenM3T3p0QlFWVk9MRmRCVmxBc1lVRkJZU3hEUVZWTUxGbEJRVmtzUlVGQlowSTdVVUZCWkN4UFFVRlBMR2REUVVGSExFVkJRVVU3T3pCQ1FWWnNReXhoUVVGaE96dEJRVmRtTEhGRFFWaEZMR0ZCUVdFc05rTkJWMVFzV1VGQldTeEZRVUZGT3pzN096czdRVUZOY0VJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRWxCUVVrc1EwRkJRenM3T3pzN08wRkJUWEpETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdPenM3T3p0QlFVMHhReXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRWxCUVVrc1EwRkJReXhEUVVGRE96czdPenM3UVVGTmVFTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN096czdPMEZCVFhoRExGRkJRVWtzUTBGQlF5eGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMR0ZCUVdFc1NVRkJTU3hEUVVGRExFTkJRVWNzUTBGQlF5eERRVUZET3pzN096czdRVUZOY0VRc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUVFZETEZGQlFVa3NRMEZCUXl4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExHRkJRV0VzU1VGQlNTeERRVUZETEVOQlFVY3NRMEZCUXl4RFFVRkRPenM3T3pzN1FVRk5jRVFzVVVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRUVkRMRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWY3NTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenM3T3p0QlFWTTFReXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRWxCUVVrc1EwRkJReXhEUVVGSExFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRXaEVMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJRenM3T3pzN08wRkJUVGRETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeERRVUZETEVOQlFVTTdPenM3T3p0QlFVMTRReXhSUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1MwRkJTeXhEUVVGRE96czdPenM3UVVGTmNFTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEV0QlFVc3NRMEZCUXpzN096czdPMEZCVFRWRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1NVRkJTU3hEUVVGRExFTkJRVU03T3pzN096dEJRVTE0UXl4UlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN1FVRk5PVU1zVVVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRURkRMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNTVUZCU1N4RFFVRkRMRU5CUVVNN096czdPenRCUVUweFF5eFJRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGaExFbEJRVWtzUTBGQlF5eERRVUZET3pzN096czdRVUZOYUVRc1VVRkJTU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNXVUZCV1N4SlFVRkpMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUVGxETEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEZEVNc1VVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhoQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRelZETEZGQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1EwRkJRenM3UVVGRkwwTXNVVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETzBkQlEyNURPenRaUVc1S1J5eGhRVUZoT3p0bFFVRmlMR0ZCUVdFN1FVRnhTbUlzYTBKQlFXTTdWMEZCUVN4WlFVRkhPMEZCUTI1Q0xGbEJRVWtzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRE96dEJRVVV4UXl4WlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zYlVKQlFXMUNMRVZCUTJwRExHTkJRV01zU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeERRVUZET3p0QlFVVndSQ3hsUVVGUExHTkJRV01zUTBGQlF6dFBRVU4yUWpzN1FVRkhSQ3hsUVVGWE96czdPMkZCUVVFc2NVSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRha01zWlVGQlR5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU5zUXpzN1FVRkhSQ3huUWtGQldUczdPenRoUVVGQkxITkNRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhGUVVGRk8wRkJRMnhETEZsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU03UVVGRE9VSXNXVUZCU1N4WlFVRlpMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRM0pDTEZsQlFVa3NZMEZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU03TzBGQlJYcERMRmxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5tTEdOQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1IwRkJSeXhqUVVGakxFTkJRVU03TzBGQlJYWkRMSE5DUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhqUVVGakxFTkJRVU03UVVGRGJrUXNhMEpCUVZFc1NVRkJTU3haUVVGWkxFTkJRVU03VTBGRE1VSTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEySXNaVUZCU3l4SFFVRkhMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJUVkVMR05CUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNSRExHbENRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTFZc2QwSkJRVmtzU1VGQlNTeGpRVUZqTEVOQlFVTTdPMEZCUlM5Q0xHZENRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwN1FVRkRaQ3h4UWtGQlR5eFJRVUZSTEVOQlFVTTdZVUZCUVR0WFFVTnVRanRUUVVOR0xFMUJRVTBzU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNCQ0xHVkJRVXNzUjBGQlJ5eDVRa0ZCZVVJc1EwRkJReXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVWb1JTeGpRVUZKTEV0QlFVc3NSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRZaXhwUWtGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4M1FrRkJXU3hKUVVGSkxHTkJRV01zUTBGQlF6czdRVUZGTDBJc1owSkJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFR0QlFVTmtMSEZDUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETzJGQlFVRTdWMEZEY0VJN1UwRkRSaXhOUVVGTk8wRkJRMHdzYVVKQlFVOHNVVUZCVVN4RFFVRkRPMU5CUTJwQ096dEJRVVZFTEZsQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRekZDTEZsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1dVRkJXU3hEUVVGRE96dEJRVVZ1UXl4bFFVRlBMRmxCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMDlCUTJwRU96dEJRVWRFTEcxQ1FVRmxPenM3TzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTTVRaXhaUVVGSkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRPenRCUVVWMlF5eFpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE96dEJRVVZ1UWl4WlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRFlpeGxRVUZMTEVWQlFVVXNRMEZCUXpzN1FVRkZVaXhqUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOMFF5eHBRa0ZCU3l4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOV0xIZENRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJRenM3UVVGRmNFTXNaMEpCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRUdEJRVU5rTEhGQ1FVRlBMRkZCUVZFc1EwRkJRenRoUVVGQk8xZEJRMjVDTzFOQlEwWXNUVUZCVFR0QlFVTk1MR1ZCUVVzc1JVRkJSU3hEUVVGRE96dEJRVVZTTEdOQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOaUxHbENRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkRMSGRDUVVGWkxFbEJRVWtzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZjRU1zWjBKQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUVHRCUVVOa0xIRkNRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRPMkZCUVVFN1YwRkRjRUk3VTBGRFJqczdRVUZGUkN4WlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU14UWl4WlFVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExGbEJRVmtzUTBGQlF6czdRVUZGYmtNc1pVRkJUeXhaUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRQUVVOcVJEczdRVUZqUnl4UlFVRkpPenM3T3pzN08xZEJVa0VzVlVGQlF5eExRVUZMTEVWQlFVVTdRVUZEWkN4WlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMDlCUTNCRE96czdPenM3VjBGTlR5eFpRVUZITzBGQlExUXNaVUZCVHl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdUMEZEYmtNN08wRkJWVVFzVjBGQlR6czdPenM3T3pzN096czdZVUZCUVN4cFFrRkJReXhUUVVGVExFVkJRVVU3UVVGRGFrSXNXVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU55UXl4WlFVRkpMRmRCUVZjc1IwRkJSeXhUUVVGVExFbEJRVWtzV1VGQldTeERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRM0pGTEZsQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGJrTXNXVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6czdRVUZGY2tNc1dVRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNZMEZCU1N4bFFVRmxMRWRCUVVjc1EwRkJSeXhEUVVGRE8wRkJRekZDTEdOQlFVa3NaVUZCWlN4SFFVRkhMRU5CUVVjc1EwRkJRenRCUVVNeFFpeGpRVUZKTEdGQlFXRXNSMEZCUnl4RFFVRkhMRU5CUVVNN1FVRkRlRUlzWTBGQlNTeGpRVUZqTEVkQlFVY3NRMEZCUnl4RFFVRkRPMEZCUTNwQ0xHTkJRVWtzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNN08wRkJSWHBETEdOQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkRZaXhaUVVGWkxFZEJRVWNzV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJSWGhFTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmxCUVZrc1JVRkJSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZ3Uml4alFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRM0JDTEdWQlFXVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN1FVRkZNVVFzWTBGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVTndRaXhsUVVGbExFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03TzBGQlJURkVMR05CUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGRGJFSXNZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenM3UVVGSGRFUXNZMEZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWU3hMUVVGTExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOdVJDeG5Ra0ZCU1N4blFrRkJaMElzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhIUVVGSExFTkJRVUVzUjBGQlNTeERRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRCUVVONFJTd3dRa0ZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlJ5eEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhuUWtGQlowSXNRMEZCUVN4SFFVRkpMRWxCUVUwc1EwRkJReXhEUVVGRE8xZEJReTlGT3pzN1FVRkhSQ3hqUVVGSkxHVkJRV1VzUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGREwwTXNaMEpCUVVrc2FVSkJRV2xDTEVkQlFVY3NXVUZCV1N4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4WlFVRlpMRVZCUVVVc1ZVRkJWU3hEUVVGRE96dEJRVVUzUWl4blFrRkJTU3hwUWtGQmFVSXNTMEZCU3l4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU51UkN4clFrRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyWXNORUpCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMR05CUVdNc1EwRkJRenRCUVVOMFJDd3dRa0ZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEYkVNc1RVRkJUVHRCUVVOTUxEUkNRVUZaTEVkQlFVY3NZMEZCWXl4RFFVRkRPMEZCUXpsQ0xEQkNRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPMlZCUTJoQ08yRkJRMFlzVFVGQlRUdEJRVU5NTERCQ1FVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRM0pFTEhkQ1FVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8yRkJRMnhFT3p0QlFVVkVMR2RDUVVGSkxHOUNRVUZ2UWl4SFFVRkhMRmxCUVZrc1IwRkJSeXhsUVVGbExFTkJRVU03T3pzN1FVRkpNVVFzWjBKQlFVa3NZVUZCWVN4SFFVRkhMRU5CUVVNc1JVRkRia0lzYjBKQlFXOUNMRWxCUVVrc1lVRkJZU3hEUVVGRE96dEJRVVY0UXl4blFrRkJTU3hWUVVGVkxFZEJRVWNzUTBGQlF5eEZRVU5vUWl4dlFrRkJiMElzU1VGQlNTeFZRVUZWTEVOQlFVTTdPMEZCUlhKRExHZENRVUZKTEc5Q1FVRnZRaXhIUVVGSExFTkJRVU1zUlVGRE1VSXNiMEpCUVc5Q0xFZEJRVWNzUTBGQlF5eERRVUZET3pzN1FVRkhNMElzWjBKQlFVa3NaVUZCWlN4TFFVRkxMRU5CUVVNc1JVRkRka0lzWlVGQlpTeEhRVUZITEc5Q1FVRnZRaXhEUVVGRE96czdRVUZIZWtNc2VVSkJRV0VzU1VGQlNTeEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRzlDUVVGdlFpeERRVUZETzFkQlEzaEVPenM3UVVGSFJDeDVRa0ZCWlN4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRGNFTXNlVUpCUVdVc1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkhjRU1zZFVKQlFXRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRMmhETEhWQ1FVRmhMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF6czdPenM3UVVGTGFFTXNZMEZCU1N4aFFVRmhMRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRM0pDTERKQ1FVRmxMRWxCUVVrc1lVRkJZU3hEUVVGRE8wRkJRMnBETERKQ1FVRmxMRWxCUVVrc1lVRkJZU3hEUVVGRE8wRkJRMnBETEhWQ1FVRlhMRWxCUVVzc1lVRkJZU3hIUVVGSExHTkJRV01zUVVGQlF5eERRVUZETzFkQlEycEVMRTFCUVUwN1FVRkRUQ3gxUWtGQlZ5eEpRVUZMTEdGQlFXRXNSMEZCUnl4alFVRmpMRUZCUVVNc1EwRkJRenRYUVVOcVJEczdPMEZCUjBRc1kwRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVOQlFVTXNSVUZEZEVJc1pVRkJaU3hKUVVGSkxFTkJRVWNzU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGQkxFRkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGSGNFVXNZMEZCU1N4bFFVRmxMRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRM1pDTERKQ1FVRmxMRWxCUVVrc1pVRkJaU3hEUVVGRE8wRkJRMjVETERKQ1FVRmxMRWRCUVVjc1EwRkJReXhEUVVGRE8xZEJRM0pDT3p0QlFVVkVMR05CUVVrc1pVRkJaU3hIUVVGSExHVkJRV1VzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1JVRkRNVVFzWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hIUVVGSExHVkJRV1VzUTBGQlF6czdPMEZCUnpORUxHTkJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRWxCUVVrc1pVRkJaU3hIUVVGSExFTkJRVU1zUlVGQlJUczdRVUZGZUVNc1owSkJRVWtzV1VGQldTeEhRVUZITEZsQlFWa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVNM1F5eG5Ra0ZCU1N4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMR1ZCUVdVc1EwRkJRenRCUVVNdlJDeG5Ra0ZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMR1ZCUVdVc1EwRkJRenM3UVVGRmJFVXNaMEpCUVVrc1RVRkJUU3hIUVVGSExFOUJRVThzUjBGQlJ5eGxRVUZsTEVWQlFVVTdRVUZEZEVNc2EwSkJRVWtzVFVGQlRTeEhRVUZITEdWQlFXVXNTVUZCU1N4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGQkxFRkJRVU1zUTBGQlF6dEJRVU5zUkN4dlFrRkJUU3hKUVVGSkxFMUJRVTBzUTBGQlF6dEJRVU5xUWl4eFFrRkJUeXhKUVVGSkxFMUJRVTBzUTBGQlF6dGhRVU51UWpzN1FVRkZSQ3huUWtGQlNTeGhRVUZoTEVkQlFVY3NWMEZCVnl4SFFVRkhMRTFCUVUwc1EwRkJRenRCUVVONlF5eG5Ra0ZCU1N4alFVRmpMRWRCUVVjc1YwRkJWeXhIUVVGSExHVkJRV1VzUTBGQlF6dEJRVU51UkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4alFVRmpMRWRCUVVjc1QwRkJUeXhEUVVGRE96dEJRVVZvUkN4M1FrRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRenM3UVVGRmNFTXNkMEpCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVY3NSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVOdVJDeDNRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZET3p0QlFVVndSU3huUWtGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhoUVVGaExFVkJRMnhETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGYUVVc2QwSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNkVUpCUVhWQ0xFTkJRVU1zUTBGQlJ5eEZRVUZGTEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXk5RUxIZENRVUZaTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdPMEZCUjNSRExHZENRVUZKTEUxQlFVMHNSMEZCUnl4WlFVRlpMRU5CUVVNc2EwSkJRV3RDTEVWQlFVVXNRMEZCUXpzN1FVRkZMME1zYTBKQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU0xUWl4clFrRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVkQlFVY3NZMEZCWXl4RFFVRkRPMEZCUXpORExHdENRVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRemRDTEhkQ1FVRlpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zYTBKQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhGUVVGRkxHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6TkRMR3RDUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4bFFVRmxMRWRCUVVjc1kwRkJZeXhEUVVGRExFTkJRVU03VjBGRE4wUTdVMEZEUmpzN1FVRkZSQ3hsUVVGUExHRkJRV0VzUTBGQlF6dFBRVU4wUWpzN096dFRRVE5hUnl4aFFVRmhPMGRCUVZNc1ZVRkJWVHM3UVVFNFduUkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZESWl3aVptbHNaU0k2SW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFJSGR5YVhSMFpXNGdhVzRnUlVOTlFYTmpjbWx3ZENBMklDb3ZYRzR2S2lwY2JpQXFJRUJtYVd4bGIzWmxjblpwWlhjZ1YwRldSU0JoZFdScGJ5QnpiM1Z1WkNCelpXZHRaVzUwSUdWdVoybHVaVnh1SUNvZ1FHRjFkR2h2Y2lCT2IzSmlaWEowTGxOamFHNWxiR3hBYVhKallXMHVabklzSUZacFkzUnZjaTVUWVdsNlFHbHlZMkZ0TG1aeUxDQkxZWEpwYlM1Q1lYSnJZWFJwUUdseVkyRnRMbVp5WEc0Z0tpOWNibHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzUyWVhJZ1ZHbHRaVVZ1WjJsdVpTQTlJSEpsY1hWcGNtVW9YQ0l1TGk5amIzSmxMM1JwYldVdFpXNW5hVzVsWENJcE8xeHVYRzVtZFc1amRHbHZiaUJuWlhSRGRYSnlaVzUwVDNKUWNtVjJhVzkxYzBsdVpHVjRLSE52Y25SbFpFRnljbUY1TENCMllXeDFaU3dnYVc1a1pYZ2dQU0F3S1NCN1hHNGdJSFpoY2lCemFYcGxJRDBnYzI5eWRHVmtRWEp5WVhrdWJHVnVaM1JvTzF4dVhHNGdJR2xtSUNoemFYcGxJRDRnTUNrZ2UxeHVJQ0FnSUhaaGNpQm1hWEp6ZEZaaGJDQTlJSE52Y25SbFpFRnljbUY1V3pCZE8xeHVJQ0FnSUhaaGNpQnNZWE4wVm1Gc0lEMGdjMjl5ZEdWa1FYSnlZWGxiYzJsNlpTQXRJREZkTzF4dVhHNGdJQ0FnYVdZZ0tIWmhiSFZsSUR3Z1ptbHljM1JXWVd3cFhHNGdJQ0FnSUNCcGJtUmxlQ0E5SUMweE8xeHVJQ0FnSUdWc2MyVWdhV1lnS0haaGJIVmxJRDQ5SUd4aGMzUldZV3dwWEc0Z0lDQWdJQ0JwYm1SbGVDQTlJSE5wZW1VZ0xTQXhPMXh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnYVdZZ0tHbHVaR1Y0SUR3Z01DQjhmQ0JwYm1SbGVDQStQU0J6YVhwbEtWeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlFMWhkR2d1Wm14dmIzSW9LSE5wZW1VZ0xTQXhLU0FxSUNoMllXeDFaU0F0SUdacGNuTjBWbUZzS1NBdklDaHNZWE4wVm1Gc0lDMGdabWx5YzNSV1lXd3BLVHRjYmx4dUlDQWdJQ0FnZDJocGJHVWdLSE52Y25SbFpFRnljbUY1VzJsdVpHVjRYU0ErSUhaaGJIVmxLVnh1SUNBZ0lDQWdJQ0JwYm1SbGVDMHRPMXh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9jMjl5ZEdWa1FYSnlZWGxiYVc1a1pYZ2dLeUF4WFNBOFBTQjJZV3gxWlNsY2JpQWdJQ0FnSUNBZ2FXNWtaWGdyS3p0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYVc1a1pYZzdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHZGxkRU4xY25KbGJuUlBjazVsZUhSSmJtUmxlQ2h6YjNKMFpXUkJjbkpoZVN3Z2RtRnNkV1VzSUdsdVpHVjRJRDBnTUNrZ2UxeHVJQ0IyWVhJZ2MybDZaU0E5SUhOdmNuUmxaRUZ5Y21GNUxteGxibWQwYUR0Y2JseHVJQ0JwWmlBb2MybDZaU0ErSURBcElIdGNiaUFnSUNCMllYSWdabWx5YzNSV1lXd2dQU0J6YjNKMFpXUkJjbkpoZVZzd1hUdGNiaUFnSUNCMllYSWdiR0Z6ZEZaaGJDQTlJSE52Y25SbFpFRnljbUY1VzNOcGVtVWdMU0F4WFR0Y2JseHVJQ0FnSUdsbUlDaDJZV3gxWlNBOFBTQm1hWEp6ZEZaaGJDbGNiaUFnSUNBZ0lHbHVaR1Y0SUQwZ01EdGNiaUFnSUNCbGJITmxJR2xtSUNoMllXeDFaU0ErUFNCc1lYTjBWbUZzS1Z4dUlDQWdJQ0FnYVc1a1pYZ2dQU0J6YVhwbE8xeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRHdnTUNCOGZDQnBibVJsZUNBK1BTQnphWHBsS1Z4dUlDQWdJQ0FnSUNCcGJtUmxlQ0E5SUUxaGRHZ3VabXh2YjNJb0tITnBlbVVnTFNBeEtTQXFJQ2gyWVd4MVpTQXRJR1pwY25OMFZtRnNLU0F2SUNoc1lYTjBWbUZzSUMwZ1ptbHljM1JXWVd3cEtUdGNibHh1SUNBZ0lDQWdkMmhwYkdVZ0tITnZjblJsWkVGeWNtRjVXMmx1WkdWNFhTQThJSFpoYkhWbEtWeHVJQ0FnSUNBZ0lDQnBibVJsZUNzck8xeHVYRzRnSUNBZ0lDQjNhR2xzWlNBb2MyOXlkR1ZrUVhKeVlYbGJhVzVrWlhnZ0t5QXhYU0ErUFNCMllXeDFaU2xjYmlBZ0lDQWdJQ0FnYVc1a1pYZ3RMVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdhVzVrWlhnN1hHNTlYRzVjYmk4cUtseHVJQ29nUUdOc1lYTnpJRk5sWjIxbGJuUkZibWRwYm1WY2JpQXFMMXh1WTJ4aGMzTWdVMlZuYldWdWRFVnVaMmx1WlNCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nUUdOdmJuTjBjblZqZEc5eVhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhWa2FXOUNkV1ptWlhKOUlHSjFabVpsY2lCcGJtbDBhV0ZzSUdGMVpHbHZJR0oxWm1abGNpQm1iM0lnWjNKaGJuVnNZWElnYzNsdWRHaGxjMmx6WEc0Z0lDQXFYRzRnSUNBcUlGUm9aU0JsYm1kcGJtVWdhVzF3YkdWdFpXNTBjeUIwYUdVZ1hDSnpZMmhsWkhWc1pXUmNJaUJoYm1RZ1hDSjBjbUZ1YzNCdmNuUmxaRndpSUdsdWRHVnlabUZqWlhNdVhHNGdJQ0FxSUZkb1pXNGdYQ0p6WTJobFpIVnNaV1JjSWl3Z2RHaGxJR1Z1WjJsdVpTQWdaMlZ1WlhKaGRHVnpJSE5sWjIxbGJuUnpJRzF2Y21VZ2IzSWdiR1Z6YzhLZ2NHVnlhVzlrYVdOaGJHeDVYRzRnSUNBcUlDaGpiMjUwY205c2JHVmtJR0o1SUhSb1pTQndaWEpwYjJSQlluTXNJSEJsY21sdlpGSmxiQ3dnWVc1a0lIQmxjbWx2Vm1GeUlHRjBkSEpwWW5WMFpYTXBMbHh1SUNBZ0tpQlhhR1Z1SUZ3aWRISmhibk53YjNKMFpXUmNJaXdnZEdobElHVnVaMmx1WlNCblpXNWxjbUYwWlhNZ2MyVm5iV1Z1ZEhNZ1lYUWdkR2hsSUhCdmMybDBhVzl1SUc5bUlIUm9aV2x5SUc5dWMyVjBJSFJwYldVdVhHNGdJQ0FxTDF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSE4xY0dWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRXUnBieUJpZFdabVpYSmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1FYVmthVzlDZFdabVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVpZFdabVpYSWdQU0J2Y0hScGIyNXpMbUoxWm1abGNpQjhmQ0J1ZFd4c08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdjMlZuYldWdWRDQndaWEpwYjJRZ2FXNGdjMlZqWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMDUxYldKbGNuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbkJsY21sdlpFRmljeUE5SUc5d2RHbHZibk11Y0dWeWFXOWtRV0p6SUh4OElEQXVNVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZObFoyMWxiblFnY0dWeWFXOWtJSEpsYkdGMGFYWmxJSFJ2SUdsdWRHVnlMWE5sWjIxbGJuUWdaR2x6ZEdGdVkyVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1RuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWNHVnlhVzlrVW1Wc0lEMGdiM0IwYVc5dWN5NXdaWEpwYjJSU1pXd2dmSHdnTUR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFRnRiM1YwSUc5bUlISmhibVJ2YlNCelpXZHRaVzUwSUhCbGNtbHZaQ0IyWVhKcFlYUnBiMjRnY21Wc1lYUnBkbVVnZEc4Z2MyVm5iV1Z1ZENCd1pYSnBiMlJjYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVjR1Z5YVc5a1ZtRnlJRDBnYjNCMGFXOXVjeTV3WlhKcGIyUldZWElnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUZ5Y21GNUlHOW1JSE5sWjIxbGJuUWdjRzl6YVhScGIyNXpJQ2h2Ym5ObGRDQjBhVzFsY3lCcGJpQmhkV1JwYnlCaWRXWm1aWElwSUdsdUlITmxZMXh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXdiM05wZEdsdmJrRnljbUY1SUQwZ2IzQjBhVzl1Y3k1d2IzTnBkR2x2YmtGeWNtRjVJSHg4SUZzd0xqQmRPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUVcxdmRYUWdiMllnY21GdVpHOXRJSE5sWjIxbGJuUWdjRzl6YVhScGIyNGdkbUZ5YVdGMGFXOXVJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d2IzTnBkR2x2YmxaaGNpQTlJRzl3ZEdsdmJuTXVjRzl6YVhScGIyNVdZWElnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUZ5Y21GNUlHOW1JSE5sWjIxbGJuUWdaSFZ5WVhScGIyNXpJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1a2RYSmhkR2x2YmtGeWNtRjVJRDBnYjNCMGFXOXVjeTVrZFhKaGRHbHZia0Z5Y21GNUlIeDhJRnN3TGpCZE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRV0p6YjJ4MWRHVWdjMlZuYldWdWRDQmtkWEpoZEdsdmJpQnBiaUJ6WldOY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VG5WdFltVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WkhWeVlYUnBiMjVCWW5NZ1BTQnZjSFJwYjI1ekxtUjFjbUYwYVc5dVFXSnpJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlRaV2R0Wlc1MElHUjFjbUYwYVc5dUlISmxiR0YwYVhabElIUnZJR2RwZG1WdUlITmxaMjFsYm5RZ1pIVnlZWFJwYjI0Z2IzSWdhVzUwWlhJdGMyVm5iV1Z1ZENCa2FYTjBZVzVqWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVrZFhKaGRHbHZibEpsYkNBOUlHOXdkR2x2Ym5NdVpIVnlZWFJwYjI1U1pXd2dmSHdnTVR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFRnljbUY1SUc5bUlITmxaMjFsYm5RZ2IyWm1jMlYwY3lCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ2IyWm1jMlYwSUQ0Z01Eb2dkR2hsSUhObFoyMWxiblFuY3lCeVpXWmxjbVZ1WTJVZ2NHOXphWFJwYjI0Z2FYTWdZV1owWlhJZ2RHaGxJR2RwZG1WdUlITmxaMjFsYm5RZ2NHOXphWFJwYjI1Y2JpQWdJQ0FnS2lCdlptWnpaWFFnUENBd09pQjBhR1VnWjJsMlpXNGdjMlZuYldWdWRDQndiM05wZEdsdmJpQnBjeUIwYUdVZ2MyVm5iV1Z1ZENkeklISmxabVZ5Wlc1alpTQndiM05wZEdsdmJpQmhibVFnZEdobElHUjFjbUYwYVc5dUlHaGhjeUIwYnlCaVpTQmpiM0p5WldOMFpXUWdZbmtnZEdobElHOW1abk5sZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdWIyWm1jMlYwUVhKeVlYa2dQU0J2Y0hScGIyNXpMbTltWm5ObGRFRnljbUY1SUh4OElGc3dMakJkTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FXSnpiMngxZEdVZ2MyVm5iV1Z1ZENCdlptWnpaWFFnYVc0Z2MyVmpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtOW1abk5sZEVGaWN5QTlJRzl3ZEdsdmJuTXViMlptYzJWMFFXSnpJSHg4SUMwd0xqQXdOVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZObFoyMWxiblFnYjJabWMyVjBJSEpsYkdGMGFYWmxJSFJ2SUhObFoyMWxiblFnWkhWeVlYUnBiMjVjYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXViMlptYzJWMFVtVnNJRDBnYjNCMGFXOXVjeTV2Wm1aelpYUlNaV3dnZkh3Z01EdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlJwYldVZ1lua2dkMmhwWTJnZ1lXeHNJSE5sWjIxbGJuUnpJR0Z5WlNCa1pXeGhlV1ZrSUNobGMzQmxZMmxoYkd4NUlIUnZJSEpsWVd4cGVtVWdjMlZuYldWdWRDQnZabVp6WlhSektWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1a1pXeGhlU0E5SUc5d2RHbHZibk11WkdWc1lYa2dmSHdnTUM0d01EVTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJCWW5OdmJIVjBaU0JoZEhSaFkyc2dkR2x0WlNCcGJpQnpaV05jYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVZWFIwWVdOclFXSnpJRDBnYjNCMGFXOXVjeTVoZEhSaFkydEJZbk1nZkh3Z01DNHdNRFU3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRIUmhZMnNnZEdsdFpTQnlaV3hoZEdsMlpTQjBieUJ6WldkdFpXNTBJR1IxY21GMGFXOXVYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtRjBkR0ZqYTFKbGJDQTlJRzl3ZEdsdmJuTXVZWFIwWVdOclVtVnNJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkJZbk52YkhWMFpTQnlaV3hsWVhObElIUnBiV1VnYVc0Z2MyVmpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwNTFiV0psY24xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxuSmxiR1ZoYzJWQlluTWdQU0J2Y0hScGIyNXpMbkpsYkdWaGMyVkJZbk1nZkh3Z01DNHdNRFU3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCU1pXeGxZWE5sSUhScGJXVWdjbVZzWVhScGRtVWdkRzhnYzJWbmJXVnVkQ0JrZFhKaGRHbHZibHh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaV3hsWVhObFVtVnNJRDBnYjNCMGFXOXVjeTV5Wld4bFlYTmxVbVZzSUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJUWldkdFpXNTBJSEpsYzJGdGNHeHBibWNnYVc0Z1kyVnVkRnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaWE5oYlhCc2FXNW5JRDBnYjNCMGFXOXVjeTV5WlhOaGJYQnNhVzVuSUh4OElEQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJCYlc5MWRDQnZaaUJ5WVc1a2IyMGdjbVZ6WVcxd2JHbHVaeUIyWVhKcFlYUnBiMjRnYVc0Z1kyVnVkRnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXlaWE5oYlhCc2FXNW5WbUZ5SUQwZ2IzQjBhVzl1Y3k1eVpYTmhiWEJzYVc1blZtRnlJSHg4SURBN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkpibVJsZUNCdlpseHVJQ0FnSUNBcUlFQjBlWEJsSUh0T2RXMWlaWEo5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1elpXZHRaVzUwU1c1a1pYZ2dQU0J2Y0hScGIyNXpMbk5sWjIxbGJuUkpibVJsZUNCOGZDQXdPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVjJobGRHaGxjaUIwYUdVZ1lYVmthVzhnWW5WbVptVnlJR0Z1WkNCelpXZHRaVzUwSUdsdVpHbGpaWE1nWVhKbElHTnZibk5wWkdWeVpXUWdZWE1nWTNsamJHbGpYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UwSnZiMng5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1amVXTnNhV01nUFNCdmNIUnBiMjV6TG1ONVkyeHBZeUI4ZkNCbVlXeHpaVHRjYmlBZ0lDQjBhR2x6TGw5ZlkzbGpiR2xqVDJabWMyVjBJRDBnTUR0Y2JseHVJQ0FnSUhSb2FYTXVYMTluWVdsdVRtOWtaU0E5SUdGMVpHbHZRMjl1ZEdWNGRDNWpjbVZoZEdWSFlXbHVLQ2s3WEc0Z0lDQWdkR2hwY3k1ZlgyZGhhVzVPYjJSbExtZGhhVzR1ZG1Gc2RXVWdQU0J2Y0hScGIyNXpMbWRoYVc0Z2ZId2dNVHRjYmx4dUlDQWdJSFJvYVhNdWIzVjBjSFYwVG05a1pTQTlJSFJvYVhNdVgxOW5ZV2x1VG05a1pUdGNiaUFnZlZ4dVhHNGdJR2RsZENCaWRXWm1aWEpFZFhKaGRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1luVm1abVZ5UkhWeVlYUnBiMjRnUFNCMGFHbHpMbUoxWm1abGNpNWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtSjFabVpsY2k1M2NtRndRWEp2ZFc1a1JYaDBaVzUwYVc5dUtWeHVJQ0FnSUNBZ1luVm1abVZ5UkhWeVlYUnBiMjRnTFQwZ2RHaHBjeTVpZFdabVpYSXVkM0poY0VGeWIzVnVaRVY0ZEdWdWRHbHZianRjYmx4dUlDQWdJSEpsZEhWeWJpQmlkV1ptWlhKRWRYSmhkR2x2Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRlJwYldWRmJtZHBibVVnYldWMGFHOWtJQ2gwY21GdWMzQnZjblJsWkNCcGJuUmxjbVpoWTJVcFhHNGdJR0ZrZG1GdVkyVlVhVzFsS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFXMWxJQ3NnZEdocGN5NTBjbWxuWjJWeUtIUnBiV1VwTzF4dUlDQjlYRzVjYmlBZ0x5OGdWR2x0WlVWdVoybHVaU0J0WlhSb2IyUWdLSFJ5WVc1emNHOXlkR1ZrSUdsdWRHVnlabUZqWlNsY2JpQWdjM2x1WTFCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJSFJvYVhNdWMyVm5iV1Z1ZEVsdVpHVjRPMXh1SUNBZ0lIWmhjaUJqZVdOc2FXTlBabVp6WlhRZ1BTQXdPMXh1SUNBZ0lIWmhjaUJpZFdabVpYSkVkWEpoZEdsdmJpQTlJSFJvYVhNdVluVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVqZVdOc2FXTXBJSHRjYmlBZ0lDQWdJSFpoY2lCamVXTnNaWE1nUFNCd2IzTnBkR2x2YmlBdklHSjFabVpsY2tSMWNtRjBhVzl1TzF4dVhHNGdJQ0FnSUNCamVXTnNhV05QWm1aelpYUWdQU0JOWVhSb0xtWnNiMjl5S0dONVkyeGxjeWtnS2lCaWRXWm1aWEpFZFhKaGRHbHZianRjYmlBZ0lDQWdJSEJ2YzJsMGFXOXVJQzA5SUdONVkyeHBZMDltWm5ObGREdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JwYm1SbGVDQTlJR2RsZEVOMWNuSmxiblJQY2s1bGVIUkpibVJsZUNoMGFHbHpMbkJ2YzJsMGFXOXVRWEp5WVhrc0lIQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRDQ5SUhSb2FYTXVjRzl6YVhScGIyNUJjbkpoZVM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2FXNWtaWGdnUFNBd08xeHVJQ0FnSUNBZ0lDQmplV05zYVdOUFptWnpaWFFnS3owZ1luVm1abVZ5UkhWeVlYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtTjVZMnhwWXlsY2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1NXNW1hVzVwZEhrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNCbGJITmxJR2xtSUNoemNHVmxaQ0E4SURBcElIdGNiaUFnSUNBZ0lHbHVaR1Y0SUQwZ1oyVjBRM1Z5Y21WdWRFOXlVSEpsZG1sdmRYTkpibVJsZUNoMGFHbHpMbkJ2YzJsMGFXOXVRWEp5WVhrc0lIQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRHdnTUNrZ2UxeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVTNXNaVzVuZEdnZ0xTQXhPMXh1SUNBZ0lDQWdJQ0JqZVdOc2FXTlBabVp6WlhRZ0xUMGdZblZtWm1WeVJIVnlZWFJwYjI0N1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbU41WTJ4cFl5bGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdMVWx1Wm1sdWFYUjVPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpXZHRaVzUwU1c1a1pYZ2dQU0JwYm1SbGVEdGNiaUFnSUNCMGFHbHpMbDlmWTNsamJHbGpUMlptYzJWMElEMGdZM2xqYkdsalQyWm1jMlYwTzF4dVhHNGdJQ0FnY21WMGRYSnVJR041WTJ4cFkwOW1abk5sZENBcklIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVWdHBibVJsZUYwN1hHNGdJSDFjYmx4dUlDQXZMeUJVYVcxbFJXNW5hVzVsSUcxbGRHaHZaQ0FvZEhKaGJuTndiM0owWldRZ2FXNTBaWEptWVdObEtWeHVJQ0JoWkhaaGJtTmxVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ2RHaHBjeTV6WldkdFpXNTBTVzVrWlhnN1hHNGdJQ0FnZG1GeUlHTjVZMnhwWTA5bVpuTmxkQ0E5SUhSb2FYTXVYMTlqZVdOc2FXTlBabVp6WlhRN1hHNWNiaUFnSUNCMGFHbHpMblJ5YVdkblpYSW9kR2x0WlNrN1hHNWNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JwYm1SbGVDc3JPMXh1WEc0Z0lDQWdJQ0JwWmlBb2FXNWtaWGdnUGowZ2RHaHBjeTV3YjNOcGRHbHZia0Z5Y21GNUxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQnBibVJsZUNBOUlEQTdYRzRnSUNBZ0lDQWdJR041WTJ4cFkwOW1abk5sZENBclBTQjBhR2x6TG1KMVptWmxja1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1amVXTnNhV01wWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUVsdVptbHVhWFI1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnBibVJsZUMwdE8xeHVYRzRnSUNBZ0lDQnBaaUFvYVc1a1pYZ2dQQ0F3S1NCN1hHNGdJQ0FnSUNBZ0lHbHVaR1Y0SUQwZ2RHaHBjeTV3YjNOcGRHbHZia0Z5Y21GNUxteGxibWQwYUNBdElERTdYRzRnSUNBZ0lDQWdJR041WTJ4cFkwOW1abk5sZENBdFBTQjBhR2x6TG1KMVptWmxja1IxY21GMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1amVXTnNhV01wWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUMxSmJtWnBibWwwZVR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxuTmxaMjFsYm5SSmJtUmxlQ0E5SUdsdVpHVjRPMXh1SUNBZ0lIUm9hWE11WDE5amVXTnNhV05QWm1aelpYUWdQU0JqZVdOc2FXTlBabVp6WlhRN1hHNWNiaUFnSUNCeVpYUjFjbTRnWTNsamJHbGpUMlptYzJWMElDc2dkR2hwY3k1d2IzTnBkR2x2YmtGeWNtRjVXMmx1WkdWNFhUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJUWlhRZ1oyRnBibHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2RtRnNkV1VnYkdsdVpXRnlJR2RoYVc0Z1ptRmpkRzl5WEc0Z0lDQXFMMXh1SUNCelpYUWdaMkZwYmloMllXeDFaU2tnZTF4dUlDQWdJSFJvYVhNdVgxOW5ZV2x1VG05a1pTNW5ZV2x1TG5aaGJIVmxJRDBnZG1Gc2RXVTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUjJWMElHZGhhVzVjYmlBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQmpkWEp5Wlc1MElHZGhhVzVjYmlBZ0lDb3ZYRzRnSUdkbGRDQm5ZV2x1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZaMkZwYms1dlpHVXVaMkZwYmk1MllXeDFaVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCVWNtbG5aMlZ5SUdFZ2MyVm5iV1Z1ZEZ4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZWFZrYVc5VWFXMWxJSE5sWjIxbGJuUWdjM2x1ZEdobGMybHpJR0YxWkdsdklIUnBiV1ZjYmlBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQndaWEpwYjJRZ2RHOGdibVY0ZENCelpXZHRaVzUwWEc0Z0lDQXFYRzRnSUNBcUlGUm9hWE1nWm5WdVkzUnBiMjRnWTJGdUlHSmxJR05oYkd4bFpDQmhkQ0JoYm5rZ2RHbHRaU0FvZDJobGRHaGxjaUIwYUdVZ1pXNW5hVzVsSUdseklITmphR1ZrZFd4bFpDOTBjbUZ1YzNCdmNuUmxaQ0J2Y2lCdWIzUXBYRzRnSUNBcUlIUnZJR2RsYm1WeVlYUmxJR0VnYzJsdVoyeGxJSE5sWjIxbGJuUWdZV05qYjNKa2FXNW5JSFJ2SUhSb1pTQmpkWEp5Wlc1MElITmxaMjFsYm5RZ2NHRnlZVzFsZEdWeWN5NWNiaUFnSUNvdlhHNGdJSFJ5YVdkblpYSW9ZWFZrYVc5VWFXMWxLU0I3WEc0Z0lDQWdkbUZ5SUdGMVpHbHZRMjl1ZEdWNGRDQTlJSFJvYVhNdVlYVmthVzlEYjI1MFpYaDBPMXh1SUNBZ0lIWmhjaUJ6WldkdFpXNTBWR2x0WlNBOUlHRjFaR2x2VkdsdFpTQjhmQ0JoZFdScGIwTnZiblJsZUhRdVkzVnljbVZ1ZEZScGJXVWdLeUIwYUdsekxtUmxiR0Y1TzF4dUlDQWdJSFpoY2lCelpXZHRaVzUwVUdWeWFXOWtJRDBnZEdocGN5NXdaWEpwYjJSQlluTTdYRzRnSUNBZ2RtRnlJSE5sWjIxbGJuUkpibVJsZUNBOUlIUm9hWE11YzJWbmJXVnVkRWx1WkdWNE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVluVm1abVZ5S1NCN1hHNGdJQ0FnSUNCMllYSWdjMlZuYldWdWRGQnZjMmwwYVc5dUlEMGdNQzR3TzF4dUlDQWdJQ0FnZG1GeUlITmxaMjFsYm5SRWRYSmhkR2x2YmlBOUlEQXVNRHRjYmlBZ0lDQWdJSFpoY2lCelpXZHRaVzUwVDJabWMyVjBJRDBnTUM0d08xeHVJQ0FnSUNBZ2RtRnlJSEpsYzJGdGNHeHBibWRTWVhSbElEMGdNUzR3TzF4dUlDQWdJQ0FnZG1GeUlHSjFabVpsY2tSMWNtRjBhVzl1SUQwZ2RHaHBjeTVpZFdabVpYSkVkWEpoZEdsdmJqdGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZM2xqYkdsaktWeHVJQ0FnSUNBZ0lDQnpaV2R0Wlc1MFNXNWtaWGdnUFNCelpXZHRaVzUwU1c1a1pYZ2dKU0IwYUdsekxuQnZjMmwwYVc5dVFYSnlZWGt1YkdWdVozUm9PMXh1SUNBZ0lDQWdaV3h6WlZ4dUlDQWdJQ0FnSUNCelpXZHRaVzUwU1c1a1pYZ2dQU0JOWVhSb0xtMWhlQ2d3TENCTllYUm9MbTFwYmloelpXZHRaVzUwU1c1a1pYZ3NJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlUzVzWlc1bmRHZ2dMU0F4S1NrN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuQnZjMmwwYVc5dVFYSnlZWGtwWEc0Z0lDQWdJQ0FnSUhObFoyMWxiblJRYjNOcGRHbHZiaUE5SUhSb2FYTXVjRzl6YVhScGIyNUJjbkpoZVZ0elpXZHRaVzUwU1c1a1pYaGRJSHg4SURBN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtUjFjbUYwYVc5dVFYSnlZWGtwWEc0Z0lDQWdJQ0FnSUhObFoyMWxiblJFZFhKaGRHbHZiaUE5SUhSb2FYTXVaSFZ5WVhScGIyNUJjbkpoZVZ0elpXZHRaVzUwU1c1a1pYaGRJSHg4SURBN1hHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOW1abk5sZEVGeWNtRjVLVnh1SUNBZ0lDQWdJQ0J6WldkdFpXNTBUMlptYzJWMElEMGdkR2hwY3k1dlptWnpaWFJCY25KaGVWdHpaV2R0Wlc1MFNXNWtaWGhkSUh4OElEQTdYRzVjYmlBZ0lDQWdJQzh2SUdOaGJHTjFiR0YwWlNCeVpYTmhiWEJzYVc1blhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1eVpYTmhiWEJzYVc1bklDRTlQU0F3SUh4OElIUm9hWE11Y21WellXMXdiR2x1WjFaaGNpQStJREFwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJSEpoYm1SdmJWSmxjMkZ0Y0d4cGJtY2dQU0FvVFdGMGFDNXlZVzVrYjIwb0tTQXRJREF1TlNrZ0tpQXlMakFnS2lCMGFHbHpMbkpsYzJGdGNHeHBibWRXWVhJN1hHNGdJQ0FnSUNBZ0lISmxjMkZ0Y0d4cGJtZFNZWFJsSUQwZ1RXRjBhQzV3YjNjb01pNHdMQ0FvZEdocGN5NXlaWE5oYlhCc2FXNW5JQ3NnY21GdVpHOXRVbVZ6WVcxd2JHbHVaeWtnTHlBeE1qQXdMakFwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmpZV3hqZFd4aGRHVWdhVzUwWlhJdGMyVm5iV1Z1ZENCa2FYTjBZVzVqWlZ4dUlDQWdJQ0FnYVdZZ0tITmxaMjFsYm5SRWRYSmhkR2x2YmlBOVBUMGdNQ0I4ZkNCMGFHbHpMbkJsY21sdlpGSmxiQ0ErSURBcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUc1bGVIUlRaV2RsYldWdWRFbHVaR1Y0SUQwZ2MyVm5iV1Z1ZEVsdVpHVjRJQ3NnTVR0Y2JpQWdJQ0FnSUNBZ2RtRnlJRzVsZUhSUWIzTnBkR2x2Yml3Z2JtVjRkRTltWm5ObGREdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2JtVjRkRk5sWjJWdFpXNTBTVzVrWlhnZ1BUMDlJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlUzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1amVXTnNhV01wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlIUm9hWE11Y0c5emFYUnBiMjVCY25KaGVWc3dYU0FySUdKMVptWmxja1IxY21GMGFXOXVPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JtVjRkRTltWm5ObGRDQTlJSFJvYVhNdWIyWm1jMlYwUVhKeVlYbGJNRjA3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlHSjFabVpsY2tSMWNtRjBhVzl1TzF4dUlDQWdJQ0FnSUNBZ0lDQWdibVY0ZEU5bVpuTmxkQ0E5SURBN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdWNHOXphWFJwYjI1QmNuSmhlVnR1WlhoMFUyVm5aVzFsYm5SSmJtUmxlRjA3WEc0Z0lDQWdJQ0FnSUNBZ2JtVjRkRTltWm5ObGRDQTlJSFJvYVhNdWIyWm1jMlYwUVhKeVlYbGJibVY0ZEZObFoyVnRaVzUwU1c1a1pYaGRPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RtRnlJR2x1ZEdWeVUyVm5iV1Z1ZEVScGMzUmhibU5sSUQwZ2JtVjRkRkJ2YzJsMGFXOXVJQzBnYzJWbmJXVnVkRkJ2YzJsMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUM4dklHTnZjbkpsWTNRZ2FXNTBaWEl0YzJWbmJXVnVkQ0JrYVhOMFlXNWpaU0JpZVNCdlptWnpaWFJ6WEc0Z0lDQWdJQ0FnSUM4dklDQWdiMlptYzJWMElENGdNRG9nZEdobElITmxaMjFsYm5RbmN5QnlaV1psY21WdVkyVWdjRzl6YVhScGIyNGdhWE1nWVdaMFpYSWdkR2hsSUdkcGRtVnVJSE5sWjIxbGJuUWdjRzl6YVhScGIyNWNiaUFnSUNBZ0lDQWdhV1lnS0hObFoyMWxiblJQWm1aelpYUWdQaUF3S1Z4dUlDQWdJQ0FnSUNBZ0lHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxJQzA5SUhObFoyMWxiblJQWm1aelpYUTdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tHNWxlSFJQWm1aelpYUWdQaUF3S1Z4dUlDQWdJQ0FnSUNBZ0lHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxJQ3M5SUc1bGVIUlBabVp6WlhRN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0dsdWRHVnlVMlZuYldWdWRFUnBjM1JoYm1ObElEd2dNQ2xjYmlBZ0lDQWdJQ0FnSUNCcGJuUmxjbE5sWjIxbGJuUkVhWE4wWVc1alpTQTlJREE3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdkWE5sSUdsdWRHVnlMWE5sWjIxbGJuUWdaR2x6ZEdGdVkyVWdhVzV6ZEdWaFpDQnZaaUJ6WldkdFpXNTBJR1IxY21GMGFXOXVYRzRnSUNBZ0lDQWdJR2xtSUNoelpXZHRaVzUwUkhWeVlYUnBiMjRnUFQwOUlEQXBYRzRnSUNBZ0lDQWdJQ0FnYzJWbmJXVnVkRVIxY21GMGFXOXVJRDBnYVc1MFpYSlRaV2R0Wlc1MFJHbHpkR0Z1WTJVN1hHNWNiaUFnSUNBZ0lDQWdMeThnWTJGc1kzVnNZWFJsSUhCbGNtbHZaQ0J5Wld4aGRHbDJaU0IwYnlCcGJuUmxjaUJ0WVhKclpYSWdaR2x6ZEdGdVkyVmNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQmxjbWx2WkNBclBTQjBhR2x6TG5CbGNtbHZaRkpsYkNBcUlHbHVkR1Z5VTJWbmJXVnVkRVJwYzNSaGJtTmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCaFpHUWdjbVZzWVhScGRtVWdZVzVrSUdGaWMyOXNkWFJsSUhObFoyMWxiblFnWkhWeVlYUnBiMjVjYmlBZ0lDQWdJSE5sWjIxbGJuUkVkWEpoZEdsdmJpQXFQU0IwYUdsekxtUjFjbUYwYVc5dVVtVnNPMXh1SUNBZ0lDQWdjMlZuYldWdWRFUjFjbUYwYVc5dUlDczlJSFJvYVhNdVpIVnlZWFJwYjI1QlluTTdYRzVjYmlBZ0lDQWdJQzh2SUdGa1pDQnlaV3hoZEdsMlpTQmhibVFnWVdKemIyeDFkR1VnYzJWbmJXVnVkQ0J2Wm1aelpYUmNiaUFnSUNBZ0lITmxaMjFsYm5SUFptWnpaWFFnS2owZ2RHaHBjeTV2Wm1aelpYUlNaV3c3WEc0Z0lDQWdJQ0J6WldkdFpXNTBUMlptYzJWMElDczlJSFJvYVhNdWIyWm1jMlYwUVdKek8xeHVYRzRnSUNBZ0lDQXZMeUJoY0hCc2VTQnpaV2R0Wlc1MElHOW1abk5sZEZ4dUlDQWdJQ0FnTHk4Z0lDQnZabVp6WlhRZ1BpQXdPaUIwYUdVZ2MyVm5iV1Z1ZENkeklISmxabVZ5Wlc1alpTQndiM05wZEdsdmJpQnBjeUJoWm5SbGNpQjBhR1VnWjJsMlpXNGdjMlZuYldWdWRDQndiM05wZEdsdmJseHVJQ0FnSUNBZ0x5OGdJQ0J2Wm1aelpYUWdQQ0F3T2lCMGFHVWdaMmwyWlc0Z2MyVm5iV1Z1ZENCd2IzTnBkR2x2YmlCcGN5QjBhR1VnYzJWbmJXVnVkQ2R6SUhKbFptVnlaVzVqWlNCd2IzTnBkR2x2YmlCaGJtUWdkR2hsSUdSMWNtRjBhVzl1SUdoaGN5QjBieUJpWlNCamIzSnlaV04wWldRZ1lua2dkR2hsSUc5bVpuTmxkRnh1SUNBZ0lDQWdhV1lnS0hObFoyMWxiblJQWm1aelpYUWdQQ0F3S1NCN1hHNGdJQ0FnSUNBZ0lITmxaMjFsYm5SRWRYSmhkR2x2YmlBdFBTQnpaV2R0Wlc1MFQyWm1jMlYwTzF4dUlDQWdJQ0FnSUNCelpXZHRaVzUwVUc5emFYUnBiMjRnS3owZ2MyVm5iV1Z1ZEU5bVpuTmxkRHRjYmlBZ0lDQWdJQ0FnYzJWbmJXVnVkRlJwYldVZ0t6MGdLSE5sWjIxbGJuUlBabVp6WlhRZ0x5QnlaWE5oYlhCc2FXNW5VbUYwWlNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCelpXZHRaVzUwVkdsdFpTQXRQU0FvYzJWbmJXVnVkRTltWm5ObGRDQXZJSEpsYzJGdGNHeHBibWRTWVhSbEtUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnY21GdVpHOXRhWHBsSUhObFoyMWxiblFnY0c5emFYUnBiMjVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbkJ2YzJsMGFXOXVWbUZ5SUQ0Z01DbGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQnZjMmwwYVc5dUlDczlJREl1TUNBcUlDaE5ZWFJvTG5KaGJtUnZiU2dwSUMwZ01DNDFLU0FxSUhSb2FYTXVjRzl6YVhScGIyNVdZWEk3WEc1Y2JpQWdJQ0FnSUM4dklITm9iM0owWlc0Z1pIVnlZWFJwYjI0Z2IyWWdjMlZuYldWdWRITWdiM1psY2lCMGFHVWdaV1JuWlhNZ2IyWWdkR2hsSUdKMVptWmxjbHh1SUNBZ0lDQWdhV1lnS0hObFoyMWxiblJRYjNOcGRHbHZiaUE4SURBcElIdGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRFUjFjbUYwYVc5dUlDczlJSE5sWjIxbGJuUlFiM05wZEdsdmJqdGNiaUFnSUNBZ0lDQWdjMlZuYldWdWRGQnZjMmwwYVc5dUlEMGdNRHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tITmxaMjFsYm5SUWIzTnBkR2x2YmlBcklITmxaMjFsYm5SRWRYSmhkR2x2YmlBK0lIUm9hWE11WW5WbVptVnlMbVIxY21GMGFXOXVLVnh1SUNBZ0lDQWdJQ0J6WldkdFpXNTBSSFZ5WVhScGIyNGdQU0IwYUdsekxtSjFabVpsY2k1a2RYSmhkR2x2YmlBdElITmxaMjFsYm5SUWIzTnBkR2x2Ymp0Y2JseHVJQ0FnSUNBZ0x5OGdiV0ZyWlNCelpXZHRaVzUwWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWVdsdUlENGdNQ0FtSmlCelpXZHRaVzUwUkhWeVlYUnBiMjRnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUcxaGEyVWdjMlZuYldWdWRDQmxiblpsYkc5d1pWeHVJQ0FnSUNBZ0lDQjJZWElnWlc1MlpXeHZjR1ZPYjJSbElEMGdZWFZrYVc5RGIyNTBaWGgwTG1OeVpXRjBaVWRoYVc0b0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdGMGRHRmpheUE5SUhSb2FYTXVZWFIwWVdOclFXSnpJQ3NnZEdocGN5NWhkSFJoWTJ0U1pXd2dLaUJ6WldkdFpXNTBSSFZ5WVhScGIyNDdYRzRnSUNBZ0lDQWdJSFpoY2lCeVpXeGxZWE5sSUQwZ2RHaHBjeTV5Wld4bFlYTmxRV0p6SUNzZ2RHaHBjeTV5Wld4bFlYTmxVbVZzSUNvZ2MyVm5iV1Z1ZEVSMWNtRjBhVzl1TzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2hoZEhSaFkyc2dLeUJ5Wld4bFlYTmxJRDRnYzJWbmJXVnVkRVIxY21GMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RtRnlJR1poWTNSdmNpQTlJSE5sWjIxbGJuUkVkWEpoZEdsdmJpQXZJQ2hoZEhSaFkyc2dLeUJ5Wld4bFlYTmxLVHRjYmlBZ0lDQWdJQ0FnSUNCaGRIUmhZMnNnS2owZ1ptRmpkRzl5TzF4dUlDQWdJQ0FnSUNBZ0lISmxiR1ZoYzJVZ0tqMGdabUZqZEc5eU8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZG1GeUlHRjBkR0ZqYTBWdVpGUnBiV1VnUFNCelpXZHRaVzUwVkdsdFpTQXJJR0YwZEdGamF6dGNiaUFnSUNBZ0lDQWdkbUZ5SUhObFoyMWxiblJGYm1SVWFXMWxJRDBnYzJWbmJXVnVkRlJwYldVZ0t5QnpaV2R0Wlc1MFJIVnlZWFJwYjI0N1hHNGdJQ0FnSUNBZ0lIWmhjaUJ5Wld4bFlYTmxVM1JoY25SVWFXMWxJRDBnYzJWbmJXVnVkRVZ1WkZScGJXVWdMU0J5Wld4bFlYTmxPMXh1WEc0Z0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNW5ZV2x1TG5aaGJIVmxJRDBnZEdocGN5NW5ZV2x1TzF4dVhHNGdJQ0FnSUNBZ0lHVnVkbVZzYjNCbFRtOWtaUzVuWVdsdUxuTmxkRlpoYkhWbFFYUlVhVzFsS0RBdU1Dd2djMlZuYldWdWRGUnBiV1VwTzF4dUlDQWdJQ0FnSUNCbGJuWmxiRzl3WlU1dlpHVXVaMkZwYmk1c2FXNWxZWEpTWVcxd1ZHOVdZV3gxWlVGMFZHbHRaU2gwYUdsekxtZGhhVzRzSUdGMGRHRmphMFZ1WkZScGJXVXBPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHlaV3hsWVhObFUzUmhjblJVYVcxbElENGdZWFIwWVdOclJXNWtWR2x0WlNsY2JpQWdJQ0FnSUNBZ0lDQmxiblpsYkc5d1pVNXZaR1V1WjJGcGJpNXpaWFJXWVd4MVpVRjBWR2x0WlNoMGFHbHpMbWRoYVc0c0lISmxiR1ZoYzJWVGRHRnlkRlJwYldVcE8xeHVYRzRnSUNBZ0lDQWdJR1Z1ZG1Wc2IzQmxUbTlrWlM1bllXbHVMbXhwYm1WaGNsSmhiWEJVYjFaaGJIVmxRWFJVYVcxbEtEQXVNQ3dnYzJWbmJXVnVkRVZ1WkZScGJXVXBPMXh1SUNBZ0lDQWdJQ0JsYm5abGJHOXdaVTV2WkdVdVkyOXVibVZqZENoMGFHbHpMbDlmWjJGcGJrNXZaR1VwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRzFoYTJVZ2MyOTFjbU5sWEc0Z0lDQWdJQ0FnSUhaaGNpQnpiM1Z5WTJVZ1BTQmhkV1JwYjBOdmJuUmxlSFF1WTNKbFlYUmxRblZtWm1WeVUyOTFjbU5sS0NrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExtSjFabVpsY2lBOUlIUm9hWE11WW5WbVptVnlPMXh1SUNBZ0lDQWdJQ0J6YjNWeVkyVXVjR3hoZVdKaFkydFNZWFJsTG5aaGJIVmxJRDBnY21WellXMXdiR2x1WjFKaGRHVTdYRzRnSUNBZ0lDQWdJSE52ZFhKalpTNWpiMjV1WldOMEtHVnVkbVZzYjNCbFRtOWtaU2s3WEc0Z0lDQWdJQ0FnSUdWdWRtVnNiM0JsVG05a1pTNWpiMjV1WldOMEtIUm9hWE11WDE5bllXbHVUbTlrWlNrN1hHNWNiaUFnSUNBZ0lDQWdjMjkxY21ObExuTjBZWEowS0hObFoyMWxiblJVYVcxbExDQnpaV2R0Wlc1MFVHOXphWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQnpiM1Z5WTJVdWMzUnZjQ2h6WldkdFpXNTBWR2x0WlNBcklITmxaMjFsYm5SRWRYSmhkR2x2YmlBdklISmxjMkZ0Y0d4cGJtZFNZWFJsS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdjMlZuYldWdWRGQmxjbWx2WkR0Y2JpQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmxaMjFsYm5SRmJtZHBibVU3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBzY2hlZHVsZXJzIHNob3VsZCBiZSBzaW5nbGV0b25zXG52YXIgU2NoZWR1bGVyID0gcmVxdWlyZShcIi4vc2NoZWR1bGVyXCIpO1xudmFyIFNpbXBsZVNjaGVkdWxlciA9IHJlcXVpcmUoXCIuL3NpbXBsZS1zY2hlZHVsZXJcIik7XG52YXIgc2NoZWR1bGVyID0gbnVsbDtcbnZhciBzaW1wbGVTY2hlZHVsZXIgPSBudWxsO1xuXG4vLyBzY2hlZHVsZXIgZmFjdG9yeVxubW9kdWxlLmV4cG9ydHMuZ2V0U2NoZWR1bGVyID0gZnVuY3Rpb24gKGF1ZGlvQ29udGV4dCkge1xuICBpZiAoc2NoZWR1bGVyID09PSBudWxsKSB7XG4gICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcihhdWRpb0NvbnRleHQsIHt9KTtcbiAgfVxuXG4gIHJldHVybiBzY2hlZHVsZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5nZXRTaW1wbGVTY2hlZHVsZXIgPSBmdW5jdGlvbiAoYXVkaW9Db250ZXh0KSB7XG4gIGlmIChzaW1wbGVTY2hlZHVsZXIgPT09IG51bGwpIHtcbiAgICBzaW1wbGVTY2hlZHVsZXIgPSBuZXcgU2ltcGxlU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCwge30pO1xuICB9XG5cbiAgcmV0dXJuIHNpbXBsZVNjaGVkdWxlcjtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN1FVRkZRU3hKUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNN1FVRkRka01zU1VGQlNTeGxRVUZsTEVkQlFVY3NUMEZCVHl4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVOQlFVTTdRVUZEY0VRc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzSkNMRWxCUVVrc1pVRkJaU3hIUVVGSExFbEJRVWtzUTBGQlF6czdPMEZCUnpOQ0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNXVUZCV1N4SFFVRkhMRlZCUVZNc1dVRkJXU3hGUVVGRk8wRkJRMjVFTEUxQlFVa3NVMEZCVXl4TFFVRkxMRWxCUVVrc1JVRkJSVHRCUVVOMFFpeGhRVUZUTEVkQlFVY3NTVUZCU1N4VFFVRlRMRU5CUVVNc1dVRkJXU3hGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlF6ZERPenRCUVVWRUxGTkJRVThzVTBGQlV5eERRVUZETzBOQlEyeENMRU5CUVVNN08wRkJSVVlzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFZRVUZUTEZsQlFWa3NSVUZCUlR0QlFVTjZSQ3hOUVVGSkxHVkJRV1VzUzBGQlN5eEpRVUZKTEVWQlFVVTdRVUZETlVJc2JVSkJRV1VzUjBGQlJ5eEpRVUZKTEdWQlFXVXNRMEZCUXl4WlFVRlpMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03UjBGRGVrUTdPMEZCUlVRc1UwRkJUeXhsUVVGbExFTkJRVU03UTBGRGVFSXNRMEZCUXlJc0ltWnBiR1VpT2lKbGN6WXZkWFJwYkhNdmNISnBiM0pwZEhrdGNYVmxkV1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmNiaTh2SUhOamFHVmtkV3hsY25NZ2MyaHZkV3hrSUdKbElITnBibWRzWlhSdmJuTmNiblpoY2lCVFkyaGxaSFZzWlhJZ1BTQnlaWEYxYVhKbEtDY3VMM05qYUdWa2RXeGxjaWNwTzF4dWRtRnlJRk5wYlhCc1pWTmphR1ZrZFd4bGNpQTlJSEpsY1hWcGNtVW9KeTR2YzJsdGNHeGxMWE5qYUdWa2RXeGxjaWNwTzF4dWRtRnlJSE5qYUdWa2RXeGxjaUE5SUc1MWJHdzdYRzUyWVhJZ2MybHRjR3hsVTJOb1pXUjFiR1Z5SUQwZ2JuVnNiRHRjYmx4dUx5OGdjMk5vWldSMWJHVnlJR1poWTNSdmNubGNibTF2WkhWc1pTNWxlSEJ2Y25SekxtZGxkRk5qYUdWa2RXeGxjaUE5SUdaMWJtTjBhVzl1S0dGMVpHbHZRMjl1ZEdWNGRDa2dlMXh1SUNCcFppQW9jMk5vWldSMWJHVnlJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdjMk5vWldSMWJHVnlJRDBnYm1WM0lGTmphR1ZrZFd4bGNpaGhkV1JwYjBOdmJuUmxlSFFzSUh0OUtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnpZMmhsWkhWc1pYSTdYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3k1blpYUlRhVzF3YkdWVFkyaGxaSFZzWlhJZ1BTQm1kVzVqZEdsdmJpaGhkV1JwYjBOdmJuUmxlSFFwSUh0Y2JpQWdhV1lnS0hOcGJYQnNaVk5qYUdWa2RXeGxjaUE5UFQwZ2JuVnNiQ2tnZTF4dUlDQWdJSE5wYlhCc1pWTmphR1ZrZFd4bGNpQTlJRzVsZHlCVGFXMXdiR1ZUWTJobFpIVnNaWElvWVhWa2FXOURiMjUwWlhoMExDQjdmU2s3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYzJsdGNHeGxVMk5vWldSMWJHVnlPMXh1ZlRzaVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKFwiLi9mYWN0b3JpZXNcIik7XG5cbnZhciBnZXRTY2hlZHVsZXIgPSBfcmVxdWlyZS5nZXRTY2hlZHVsZXI7XG5cbnZhciBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2sgPSAoZnVuY3Rpb24gKF9UaW1lRW5naW5lKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sU2NoZWR1bGVySG9vayhwbGF5Q29udHJvbCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2spO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheUNvbnRyb2xTY2hlZHVsZXJIb29rLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2wgPSBwbGF5Q29udHJvbDtcbiAgfVxuXG4gIF9pbmhlcml0cyhQbGF5Q29udHJvbFNjaGVkdWxlckhvb2ssIF9UaW1lRW5naW5lKTtcblxuICBfY3JlYXRlQ2xhc3MoUGxheUNvbnRyb2xTY2hlZHVsZXJIb29rLCB7XG4gICAgYWR2YW5jZVRpbWU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgICAgIHZhciBwbGF5Q29udHJvbCA9IHRoaXMuX19wbGF5Q29udHJvbDtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gcGxheUNvbnRyb2wuX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKTtcbiAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IHBsYXlDb250cm9sLl9fZW5naW5lLmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgcGxheUNvbnRyb2wuX19zcGVlZCk7XG5cbiAgICAgICAgaWYgKG5leHRQb3NpdGlvbiAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXR1cm4gcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICB9cmV0dXJuIEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFBsYXlDb250cm9sU2NoZWR1bGVySG9vaztcbn0pKFRpbWVFbmdpbmUpO1xuXG52YXIgUGxheUNvbnRyb2xMb29wQ29udHJvbCA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUyKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sTG9vcENvbnRyb2wocGxheUNvbnRyb2wpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGxheUNvbnRyb2xMb29wQ29udHJvbCk7XG5cbiAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihQbGF5Q29udHJvbExvb3BDb250cm9sLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2wgPSBwbGF5Q29udHJvbDtcbiAgICB0aGlzLnNwZWVkID0gbnVsbDtcbiAgfVxuXG4gIF9pbmhlcml0cyhQbGF5Q29udHJvbExvb3BDb250cm9sLCBfVGltZUVuZ2luZTIpO1xuXG4gIF9jcmVhdGVDbGFzcyhQbGF5Q29udHJvbExvb3BDb250cm9sLCB7XG4gICAgYWR2YW5jZVRpbWU6IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNjaGVkdWxlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICAgIHRoaXMuX19wbGF5Q29udHJvbC5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3BsYXlDb250cm9sLl9fbG9vcFN0YXJ0LCB0aGlzLnNwZWVkLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLl9fZ2V0VGltZUF0UG9zaXRpb24odGhpcy5fX3BsYXlDb250cm9sLl9fbG9vcEVuZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zcGVlZCA8IDApIHtcbiAgICAgICAgICB0aGlzLl9fcGxheUNvbnRyb2wuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wbGF5Q29udHJvbC5fX2xvb3BFbmQsIHRoaXMuc3BlZWQsIHRydWUpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fcGxheUNvbnRyb2wuX19sb29wU3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBQbGF5Q29udHJvbExvb3BDb250cm9sO1xufSkoVGltZUVuZ2luZSk7XG5cbnZhciBQbGF5Q29udHJvbCA9IChmdW5jdGlvbiAoX1RpbWVFbmdpbmUzKSB7XG4gIGZ1bmN0aW9uIFBsYXlDb250cm9sKGVuZ2luZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGxheUNvbnRyb2wpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoUGxheUNvbnRyb2wucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGVuZ2luZS5hdWRpb0NvbnRleHQpO1xuXG4gICAgLy8gZnV0dXJlIGFzc2lnbm1lbnRcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHdhdmVzLmdldFNjaGVkdWxlcihlbmdpbmUuYXVkaW9Db250ZXh0KTtcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHJlcXVpcmUoXCJzY2hlZHVsZXJcIik7XG4gICAgLy8gdGVzdFxuICAgIHRoaXMuc2NoZWR1bGVyID0gZ2V0U2NoZWR1bGVyKGVuZ2luZS5hdWRpb0NvbnRleHQpO1xuXG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gICAgdGhpcy5fX2ludGVyZmFjZSA9IG51bGw7XG4gICAgdGhpcy5fX3NjaGVkdWxlckhvb2sgPSBudWxsO1xuXG4gICAgdGhpcy5fX2xvb3BDb250cm9sID0gbnVsbDtcbiAgICB0aGlzLl9fbG9vcFN0YXJ0ID0gMDtcbiAgICB0aGlzLl9fbG9vcEVuZCA9IEluZmluaXR5O1xuXG4gICAgLy8gc3luY2hyb25pemVkIHRpZSwgcG9zaXRpb24sIGFuZCBzcGVlZFxuICAgIHRoaXMuX190aW1lID0gMDtcbiAgICB0aGlzLl9fcG9zaXRpb24gPSAwO1xuICAgIHRoaXMuX19zcGVlZCA9IDA7XG5cbiAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAvLyBub24temVybyBcInVzZXJcIiBzcGVlZFxuICAgIHRoaXMuX19wbGF5aW5nU3BlZWQgPSAxO1xuXG4gICAgaWYgKGVuZ2luZS5tYXN0ZXIpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIGEgbWFzdGVyXCIpO1xuXG4gICAgdmFyIHNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgdmFyIGdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRUaW1lO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0Q3VycmVudFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICB9O1xuXG4gICAgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKCkpIHtcbiAgICAgIC8vIGFkZCB0aW1lIGVuZ2luZSB0aGF0IGltcGxlbWVudHMgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAgICAgIHRoaXMuX19lbmdpbmUgPSBlbmdpbmU7XG4gICAgICB0aGlzLl9faW50ZXJmYWNlID0gXCJzcGVlZC1jb250cm9sbGVkXCI7XG4gICAgICBlbmdpbmUuc2V0U3BlZWRDb250cm9sbGVkKHRoaXMsIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoZW5naW5lLmltcGxlbWVudHNUcmFuc3BvcnRlZCgpKSB7XG4gICAgICAvLyBhZGQgdGltZSBlbmdpbmUgdGhhdCBpbXBsZW1lbnRzIHRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgIHRoaXMuX19pbnRlcmZhY2UgPSBcInRyYW5zcG9ydGVkXCI7XG5cbiAgICAgIGVuZ2luZS5zZXRUcmFuc3BvcnRlZCh0aGlzLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgLy8gcmVzZXROZXh0UG9zaXRpb25cbiAgICAgICAgaWYgKG5leHRFbmdpbmVQb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHZhciB0aW1lID0gX3RoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIHZhciBwb3NpdGlvbiA9IF90aGlzLl9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSk7XG4gICAgICAgICAgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgX3RoaXMuX19zcGVlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5fX3Jlc2V0TmV4dFBvc2l0aW9uKG5leHRFbmdpbmVQb3NpdGlvbik7XG4gICAgICB9LCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU2NoZWR1bGVkKCkpIHtcbiAgICAgIC8vIGFkZCB0aW1lIGVuZ2luZSB0aGF0IGltcGxlbWVudHMgc2NoZWR1bGVkIGludGVyZmFjZVxuICAgICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgIHRoaXMuX19pbnRlcmZhY2UgPSBcInNjaGVkdWxlZFwiO1xuXG4gICAgICB0aGlzLnNjaGVkdWxlci5hZGQoZW5naW5lLCBJbmZpbml0eSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGNhbm5vdCBiZSBhZGRlZCB0byBwbGF5IGNvbnRyb2xcIik7XG4gICAgfVxuICB9XG5cbiAgX2luaGVyaXRzKFBsYXlDb250cm9sLCBfVGltZUVuZ2luZTMpO1xuXG4gIF9jcmVhdGVDbGFzcyhQbGF5Q29udHJvbCwge1xuICAgIF9fZ2V0VGltZUF0UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBFeHRyYXBvbGF0ZSB0cmFuc3BvcnQgdGltZSBmb3IgZ2l2ZW4gcG9zaXRpb25cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiBwb3NpdGlvblxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBleHRyYXBvbGF0ZWQgdGltZVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdGltZSArIChwb3NpdGlvbiAtIHRoaXMuX19wb3NpdGlvbikgLyB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2dldFBvc2l0aW9uQXRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRXh0cmFwb2xhdGUgcGxheWluZyBwb3NpdGlvbiBmb3IgZ2l2ZW4gdGltZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZVxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBleHRyYXBvbGF0ZWQgcG9zaXRpb25cbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fc3luYzoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc3luYygpIHtcbiAgICAgICAgdmFyIG5vdyA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgIHRoaXMuX19wb3NpdGlvbiArPSAobm93IC0gdGhpcy5fX3RpbWUpICogdGhpcy5fX3NwZWVkO1xuICAgICAgICB0aGlzLl9fdGltZSA9IG5vdztcbiAgICAgICAgcmV0dXJuIG5vdztcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fcmVzZXROZXh0UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgcG9zaXRpb25cbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBwbGF5aW5nIHBvc2l0aW9uXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9fc2NoZWR1bGVySG9vaykgdGhpcy5fX3NjaGVkdWxlckhvb2sucmVzZXROZXh0VGltZSh0aGlzLl9fZ2V0VGltZUF0UG9zaXRpb24obmV4dFBvc2l0aW9uKSk7XG5cbiAgICAgICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IG5leHRQb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHRpbWVcbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCB0aW1lXG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHBsYXktY29udHJvbCBpcyBhZGRlZCB0byBhIG1hc3Rlci5cbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudFBvc2l0aW9uOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgcGxheWluZyBwb3NpdGlvblxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSByZXBsYWNlZCB3aGVuIHRoZSBwbGF5LWNvbnRyb2wgaXMgYWRkZWQgdG8gYSBtYXN0ZXIuXG4gICAgICAgKi9cblxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb29wOiB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uIChlbmFibGUpIHtcbiAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9fbG9vcFN0YXJ0ID4gLUluZmluaXR5ICYmIHRoaXMuX19sb29wRW5kIDwgSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRoaXMuX19sb29wQ29udHJvbCA9IG5ldyBQbGF5Q29udHJvbExvb3BDb250cm9sKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19sb29wQ29udHJvbCwgSW5maW5pdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgICAgICB0aGlzLnNjaGVkdWxlci5yZW1vdmUodGhpcy5fX2xvb3BDb250cm9sKTtcbiAgICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX19sb29wQ29udHJvbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldExvb3BCb3VuZGFyaWVzOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnQsIGVuZCkge1xuICAgICAgICBpZiAoZW5kID49IHN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5fX2xvb3BTdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHRoaXMuX19sb29wRW5kID0gZW5kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19sb29wU3RhcnQgPSBlbmQ7XG4gICAgICAgICAgdGhpcy5fX2xvb3BFbmQgPSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9vcCA9IHRoaXMubG9vcDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvb3BTdGFydDoge1xuICAgICAgc2V0OiBmdW5jdGlvbiAoc3RhcnRUaW1lKSB7XG4gICAgICAgIHRoaXMuc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnRUaW1lLCB0aGlzLl9fbG9vcEVuZCk7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbG9vcFN0YXJ0O1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9vcEVuZDoge1xuICAgICAgc2V0OiBmdW5jdGlvbiAoZW5kVGltZSkge1xuICAgICAgICB0aGlzLnNldExvb3BCb3VuZGFyaWVzKHRoaXMuX19sb29wU3RhcnQsIGVuZFRpbWUpO1xuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BFbmQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2FwcGx5TG9vcEJvdW5kYXJpZXM6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2FwcGx5TG9vcEJvdW5kYXJpZXMocG9zaXRpb24sIHNwZWVkLCBzZWVrKSB7XG4gICAgICAgIGlmICh0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgICAgICBpZiAoc3BlZWQgPiAwICYmIHBvc2l0aW9uID49IHRoaXMuX19sb29wRW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BTdGFydCArIChwb3NpdGlvbiAtIHRoaXMuX19sb29wU3RhcnQpICUgKHRoaXMuX19sb29wRW5kIC0gdGhpcy5fX2xvb3BTdGFydCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVlZCA8IDAgJiYgcG9zaXRpb24gPCB0aGlzLl9fbG9vcFN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2xvb3BFbmQgLSAodGhpcy5fX2xvb3BFbmQgLSBwb3NpdGlvbikgJSAodGhpcy5fX2xvb3BFbmQgLSB0aGlzLl9fbG9vcFN0YXJ0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBfX3Jlc2NoZWR1bGVMb29wQ29udHJvbDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVzY2hlZHVsZUxvb3BDb250cm9sKHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAodGhpcy5fX2xvb3BDb250cm9sKSB7XG4gICAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fX2xvb3BDb250cm9sLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5yZXNldCh0aGlzLl9fbG9vcENvbnRyb2wsIHRoaXMuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fbG9vcEVuZCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVyLnJlc2V0KHRoaXMuX19sb29wQ29udHJvbCwgdGhpcy5fX2dldFRpbWVBdFBvc2l0aW9uKHRoaXMuX19sb29wU3RhcnQpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIucmVzZXQodGhpcy5fX2xvb3BDb250cm9sLCBJbmZpbml0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jU3BlZWQ6IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNwZWVkLWNvbnRyb2xsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgc2VlayA9IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbM107XG5cbiAgICAgICAgdmFyIGxhc3RTcGVlZCA9IHRoaXMuX19zcGVlZDtcblxuICAgICAgICBpZiAoc3BlZWQgIT09IGxhc3RTcGVlZCB8fCBzZWVrKSB7XG4gICAgICAgICAgaWYgKHNlZWsgfHwgbGFzdFNwZWVkID09PSAwKSBwb3NpdGlvbiA9IHRoaXMuX19hcHBseUxvb3BCb3VuZGFyaWVzKHBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICB0aGlzLl9fdGltZSA9IHRpbWU7XG4gICAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgdGhpcy5fX3NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuX19pbnRlcmZhY2UpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzcGVlZC1jb250cm9sbGVkXCI6XG4gICAgICAgICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgc2Vlayk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwidHJhbnNwb3J0ZWRcIjpcbiAgICAgICAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IHRoaXMuX19uZXh0UG9zaXRpb247XG5cbiAgICAgICAgICAgICAgaWYgKHNlZWspIHtcbiAgICAgICAgICAgICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RTcGVlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIHN0YXJ0XG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBzY2hlZHVsZXIgaG9vayB0byBzY2hlZHVsZXIgKHdpbGwgYmUgcmVzY2hlZHVsZWQgdG8gYXBwcm9wcmlhdGUgdGltZSBiZWxvdylcbiAgICAgICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG5ldyBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2sodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19zY2hlZHVsZXJIb29rLCBJbmZpbml0eSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9wXG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQpIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCAwKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzY2hlZHVsZXIgaG9vayBmcm9tIHNjaGVkdWxlclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVyLnJlbW92ZSh0aGlzLl9fc2NoZWR1bGVySG9vayk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlckhvb2sgPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWVkICogbGFzdFNwZWVkIDwgMCkge1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0cmFuc3BvcnQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLl9fcmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJzY2hlZHVsZWRcIjpcbiAgICAgICAgICAgICAgaWYgKGxhc3RTcGVlZCA9PT0gMCkgLy8gc3RhcnQgb3Igc2Vla1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRFbmdpbmUucmVzZXROZXh0VGltZSgwKTtlbHNlIGlmIChzcGVlZCA9PT0gMCkgLy8gc3RvcFxuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRFbmdpbmUucmVzZXROZXh0VGltZShJbmZpbml0eSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX19yZXNjaGVkdWxlTG9vcENvbnRyb2wocG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3RhcnQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTdGFydCBwbGF5aW5nXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB2YXIgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wb3NpdGlvbiwgdGhpcy5fX3BsYXlpbmdTcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXVzZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFBhdXNlIHBsYXlpbmdcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcbiAgICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0b3A6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wIHBsYXlpbmdcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgICAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIDApO1xuICAgICAgICB0aGlzLnNlZWsoMCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzcGVlZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIFNldCBwbGF5aW5nIHNwZWVkXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgcGxheWluZyBzcGVlZCAobm9uLXplcm8gc3BlZWQgYmV0d2VlbiAtMTYgYW5kIC0xLzE2IG9yIGJldHdlZW4gMS8xNiBhbmQgMTYpXG4gICAgICAgKi9cblxuICAgICAgc2V0OiBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuXG4gICAgICAgIGlmIChzcGVlZCA+PSAwKSB7XG4gICAgICAgICAgaWYgKHNwZWVkIDwgMC4wNjI1KSBzcGVlZCA9IDAuMDYyNTtlbHNlIGlmIChzcGVlZCA+IDE2KSBzcGVlZCA9IDE2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzcGVlZCA8IC0xNikgc3BlZWQgPSAtMTY7ZWxzZSBpZiAoc3BlZWQgPiAtMC4wNjI1KSBzcGVlZCA9IC0wLjA2MjU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fcGxheWluZ1NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zcGVlZCAhPT0gMCkgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCBwbGF5aW5nIHNwZWVkXG4gICAgICAgKiBAcmV0dXJuIGN1cnJlbnQgcGxheWluZyBzcGVlZFxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wbGF5aW5nU3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZWVrOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IChqdW1wIHRvKSBwbGF5aW5nIHBvc2l0aW9uXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGFyZ2V0IHBvc2l0aW9uXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlZWsocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSB0aGlzLl9fcG9zaXRpb24pIHtcbiAgICAgICAgICB2YXIgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHRoaXMuX19zcGVlZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIHRpbWUgZW5naW5lIGZyb20gdGhlIHRyYW5zcG9ydFxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgICAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIDApO1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gUGxheUNvbnRyb2w7XG59KShUaW1lRW5naW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Q29udHJvbDtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBwbGF5IGNvbnRyb2wgY2xhc3MgKHRpbWUtZW5naW5lIG1hc3RlciksIHByb3ZpZGVzIHBsYXkgY29udHJvbCB0byBhIHNpbmdsZSBlbmdpbmVcbiAqIEBhdXRob3IgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCBWaWN0b3IuU2FpekBpcmNhbS5mciwgS2FyaW0uQmFya2F0aUBpcmNhbS5mclxuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wek5pOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN1FVRlBRU3hKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6czdaVUZEZWtJc1QwRkJUeXhEUVVGRExHRkJRV0VzUTBGQlF6czdTVUZCZGtNc1dVRkJXU3haUVVGYUxGbEJRVms3TzBsQlJWb3NkMEpCUVhkQ08wRkJRMnBDTEZkQlJGQXNkMEpCUVhkQ0xFTkJRMmhDTEZkQlFWY3NSVUZCUlRzd1FrRkVja0lzZDBKQlFYZENPenRCUVVVeFFpeHhRMEZHUlN4M1FrRkJkMElzTmtOQlJXeENPMEZCUTFJc1VVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eFhRVUZYTEVOQlFVTTdSMEZEYkVNN08xbEJTa2NzZDBKQlFYZENPenRsUVVGNFFpeDNRa0ZCZDBJN1FVRk5OVUlzWlVGQlZ6dGhRVUZCTEhGQ1FVRkRMRWxCUVVrc1JVRkJSVHRCUVVOb1FpeFpRVUZKTEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRE8wRkJRM0pETEZsQlFVa3NVVUZCVVN4SFFVRkhMRmRCUVZjc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOeVJDeFpRVUZKTEZsQlFWa3NSMEZCUnl4WFFVRlhMRU5CUVVNc1VVRkJVU3hEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGTjBZc1dVRkJTU3haUVVGWkxFdEJRVXNzVVVGQlVUdEJRVU16UWl4cFFrRkJUeXhYUVVGWExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03VTBGQlFTeEJRVVYyUkN4UFFVRlBMRkZCUVZFc1EwRkJRenRQUVVOcVFqczdPenRUUVdaSExIZENRVUYzUWp0SFFVRlRMRlZCUVZVN08wbEJhMEl6UXl4elFrRkJjMEk3UVVGRFppeFhRVVJRTEhOQ1FVRnpRaXhEUVVOa0xGZEJRVmNzUlVGQlJUc3dRa0ZFY2tJc2MwSkJRWE5DT3p0QlFVVjRRaXh4UTBGR1JTeHpRa0ZCYzBJc05rTkJSV2hDTzBGQlExSXNVVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhYUVVGWExFTkJRVU03UVVGRGFrTXNVVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03UjBGRGJrSTdPMWxCVEVjc2MwSkJRWE5DT3p0bFFVRjBRaXh6UWtGQmMwSTdRVUZSTVVJc1pVRkJWenM3T3p0aFFVRkJMSEZDUVVGRExFbEJRVWtzUlVGQlJUdEJRVU5vUWl4WlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEyeENMR05CUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGZEJRVmNzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRM0pHTEdsQ1FVRlBMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0VFFVTTNSU3hOUVVGTkxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRla0lzWTBGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEYmtZc2FVSkJRVThzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8xTkJReTlGTzBGQlEwUXNaVUZCVHl4UlFVRlJMRU5CUVVNN1QwRkRha0k3T3pzN1UwRnFRa2NzYzBKQlFYTkNPMGRCUVZNc1ZVRkJWVHM3U1VGdlFucERMRmRCUVZjN1FVRkRTaXhYUVVSUUxGZEJRVmNzUTBGRFNDeE5RVUZOTEVWQlFVVTdPenN3UWtGRWFFSXNWMEZCVnpzN1FVRkZZaXh4UTBGR1JTeFhRVUZYTERaRFFVVlFMRTFCUVUwc1EwRkJReXhaUVVGWkxFVkJRVVU3T3pzN096dEJRVTB6UWl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExGbEJRVmtzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN08wRkJSVzVFTEZGQlFVa3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM0pDTEZGQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM2hDTEZGQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1NVRkJTU3hEUVVGRE96dEJRVVUxUWl4UlFVRkpMRU5CUVVNc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU14UWl4UlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU55UWl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExGRkJRVkVzUTBGQlF6czdPMEZCUnpGQ0xGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJoQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWcVFpeFJRVUZKTEVOQlFVTXNZMEZCWXl4SFFVRkhMRkZCUVZFc1EwRkJRenM3TzBGQlJ5OUNMRkZCUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjRRaXhSUVVGSkxFMUJRVTBzUTBGQlF5eE5RVUZOTEVWQlEyWXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXd5UTBGQk1rTXNRMEZCUXl4RFFVRkRPenRCUVVVdlJDeFJRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEJRVVY2UWl4UlFVRkpMR05CUVdNc1IwRkJSeXhaUVVGTk8wRkJRM3BDTEdGQlFVOHNUVUZCU3l4WFFVRlhMRU5CUVVNN1MwRkRla0lzUTBGQlF6czdRVUZGUml4UlFVRkpMR3RDUVVGclFpeEhRVUZITEZsQlFVMDdRVUZETjBJc1lVRkJUeXhOUVVGTExHVkJRV1VzUTBGQlF6dExRVU0zUWl4RFFVRkRPenRCUVVWR0xGRkJRVWtzVFVGQlRTeERRVUZETEhsQ1FVRjVRaXhGUVVGRkxFVkJRVVU3TzBGQlJYUkRMRlZCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETzBGQlEzWkNMRlZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzYTBKQlFXdENMRU5CUVVNN1FVRkRkRU1zV1VGQlRTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExFbEJRVWtzUlVGQlJTeGpRVUZqTEVWQlFVVXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dExRVU55UlN4TlFVRk5MRWxCUVVrc1RVRkJUU3hEUVVGRExIRkNRVUZ4UWl4RlFVRkZMRVZCUVVVN08wRkJSWHBETEZWQlFVa3NRMEZCUXl4UlFVRlJMRWRCUVVjc1RVRkJUU3hEUVVGRE8wRkJRM1pDTEZWQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1lVRkJZU3hEUVVGRE96dEJRVVZxUXl4WlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVWQlFVVXNXVUZCSzBJN1dVRkJPVUlzYTBKQlFXdENMR2REUVVGSExFbEJRVWs3T3p0QlFVVjJSQ3haUVVGSkxHdENRVUZyUWl4TFFVRkxMRWxCUVVrc1JVRkJSVHRCUVVNdlFpeGpRVUZKTEVsQlFVa3NSMEZCUnl4TlFVRkxMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRGRFTXNZMEZCU1N4UlFVRlJMRWRCUVVjc1RVRkJTeXh0UWtGQmJVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVNNVF5dzBRa0ZCYTBJc1IwRkJSeXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1RVRkJTeXhQUVVGUExFTkJRVU1zUTBGQlF6dFRRVU40UlRzN1FVRkZSQ3hqUVVGTExHMUNRVUZ0UWl4RFFVRkRMR3RDUVVGclFpeERRVUZETEVOQlFVTTdUMEZET1VNc1JVRkJSU3hqUVVGakxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenRMUVVONFF5eE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVWQlFVVTdPMEZCUlhaRExGVkJRVWtzUTBGQlF5eFJRVUZSTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUTNaQ0xGVkJRVWtzUTBGQlF5eFhRVUZYTEVkQlFVY3NWMEZCVnl4RFFVRkRPenRCUVVVdlFpeFZRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFVkJRVVVzVVVGQlVTeEZRVUZGTEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03UzBGRE1VUXNUVUZCVFR0QlFVTk1MRmxCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zZDBOQlFYZERMRU5CUVVNc1EwRkJRenRMUVVNelJEdEhRVU5HT3p0WlFYUkZSeXhYUVVGWE96dGxRVUZZTEZkQlFWYzdRVUUyUldZc2RVSkJRVzFDT3pzN096czdPenRoUVVGQkxEWkNRVUZETEZGQlFWRXNSVUZCUlR0QlFVTTFRaXhsUVVGUExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlFTeEhRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1QwRkRiRVU3TzBGQlQwUXNkVUpCUVcxQ096czdPenM3T3p0aFFVRkJMRFpDUVVGRExFbEJRVWtzUlVGQlJUdEJRVU40UWl4bFFVRlBMRWxCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRU3hIUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdUMEZET1VRN08wRkJSVVFzVlVGQlRUdGhRVUZCTEd0Q1FVRkhPMEZCUTFBc1dVRkJTU3hIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXp0QlFVTXpRaXhaUVVGSkxFTkJRVU1zVlVGQlZTeEpRVUZKTEVOQlFVTXNSMEZCUnl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVUVzUjBGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUTNSRUxGbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4RFFVRkRPMEZCUTJ4Q0xHVkJRVThzUjBGQlJ5eERRVUZETzA5QlExbzdPMEZCVFVRc2RVSkJRVzFDT3pzN096czdPMkZCUVVFc05rSkJRVU1zV1VGQldTeEZRVUZGTzBGQlEyaERMRmxCUVVrc1NVRkJTU3hEUVVGRExHVkJRV1VzUlVGRGRFSXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlRkRkxGbEJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NXVUZCV1N4RFFVRkRPMDlCUTNCRE96dEJRVkZITEdWQlFWYzdPenM3T3pzN096dFhRVUZCTEZsQlFVYzdRVUZEYUVJc1pVRkJUeXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXp0UFFVTnVRenM3UVVGUlJ5eHRRa0ZCWlRzN096czdPenM3TzFkQlFVRXNXVUZCUnp0QlFVTndRaXhsUVVGUExFbEJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkJMRWRCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dFBRVU53UmpzN1FVRmpSeXhSUVVGSk8xZEJXa0VzVlVGQlF5eE5RVUZOTEVWQlFVVTdRVUZEWml4WlFVRkpMRTFCUVUwc1JVRkJSVHRCUVVOV0xHTkJRVWtzU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4RFFVRkRMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEZGQlFWRXNSVUZCUlR0QlFVTTNSQ3huUWtGQlNTeERRVUZETEdGQlFXRXNSMEZCUnl4SlFVRkpMSE5DUVVGelFpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNSRUxHZENRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMWRCUTJ4RU8xTkJRMFlzVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkROMElzWTBGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETzBGQlF6RkRMR05CUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETzFOQlF6TkNPMDlCUTBZN1YwRkZUeXhaUVVGSE8wRkJRMVFzWlVGQlVTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJSVHRQUVVNdlFqczdRVUZGUkN4eFFrRkJhVUk3WVVGQlFTd3lRa0ZCUXl4TFFVRkxMRVZCUVVVc1IwRkJSeXhGUVVGRk8wRkJRelZDTEZsQlFVa3NSMEZCUnl4SlFVRkpMRXRCUVVzc1JVRkJSVHRCUVVOb1FpeGpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVONlFpeGpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWRCUVVjc1EwRkJRenRUUVVOMFFpeE5RVUZOTzBGQlEwd3NZMEZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhIUVVGSExFTkJRVU03UVVGRGRrSXNZMEZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU03VTBGRGVFSTdPMEZCUlVRc1dVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRPMDlCUTNaQ096dEJRVTFITEdGQlFWTTdWMEZLUVN4VlFVRkRMRk5CUVZNc1JVRkJSVHRCUVVOMlFpeFpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRQUVVOdVJEdFhRVVZaTEZsQlFVYzdRVUZEWkN4bFFVRlBMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03VDBGRGVrSTdPMEZCVFVjc1YwRkJUenRYUVVwQkxGVkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEyNUNMRmxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzA5QlEyNUVPMWRCUlZVc1dVRkJSenRCUVVOYUxHVkJRVThzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXp0UFFVTjJRanM3UVVGRlJDeDVRa0ZCY1VJN1lVRkJRU3dyUWtGQlF5eFJRVUZSTEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVNelF5eFpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkRkRUlzWTBGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV6dEJRVU42UXl4dFFrRkJUeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVOQlFVTXNVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVUVzU1VGQlN5eEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVUVzUVVGQlF5eERRVUZETzJsQ1FVTXpSaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWE8wRkJReTlETEcxQ1FVRlBMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRkZCUVZFc1EwRkJRU3hKUVVGTExFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJRU3hCUVVGRExFTkJRVU03VjBGQlFUdFRRVU0zUmpzN1FVRkZSQ3hsUVVGUExGRkJRVkVzUTBGQlF6dFBRVU5xUWpzN1FVRkZSQ3d5UWtGQmRVSTdZVUZCUVN4cFEwRkJReXhSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlEzWkRMRmxCUVVrc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJUdEJRVU4wUWl4alFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRFlpeG5Ra0ZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzBGQlEycERMR2RDUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRkxFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0WFFVTndSaXhOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNSVUZCUlR0QlFVTndRaXhuUWtGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRMnBETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVRkZMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zUTBGQlF6dFhRVU4wUml4TlFVRk5PMEZCUTB3c1owSkJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdWMEZEY0VRN1UwRkRSanRQUVVOR096dEJRVWRFTEdGQlFWTTdPenM3WVVGQlFTeHRRa0ZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlowSTdXVUZCWkN4SlFVRkpMR2REUVVGSExFdEJRVXM3TzBGQlF6TkRMRmxCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMEZCUlRkQ0xGbEJRVWtzUzBGQlN5eExRVUZMTEZOQlFWTXNTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRMMElzWTBGQlNTeEpRVUZKTEVsQlFVa3NVMEZCVXl4TFFVRkxMRU5CUVVNc1JVRkRla0lzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eFJRVUZSTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSWHBFTEdOQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRMjVDTEdOQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1VVRkJVU3hEUVVGRE8wRkJRek5DTEdOQlFVa3NRMEZCUXl4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRE96dEJRVVZ5UWl4clFrRkJVU3hKUVVGSkxFTkJRVU1zVjBGQlZ6dEJRVU4wUWl4cFFrRkJTeXhyUWtGQmEwSTdRVUZEY2tJc2EwSkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNKRUxHOUNRVUZOT3p0QlFVRkJMRUZCUlZJc2FVSkJRVXNzWVVGQllUdEJRVU5vUWl4clFrRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZka01zYTBKQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTFJc05FSkJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRmxCUVZrc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMlZCUTJ4RkxFMUJRVTBzU1VGQlNTeFRRVUZUTEV0QlFVc3NRMEZCUXl4RlFVRkZPenRCUVVVeFFpdzBRa0ZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03T3p0QlFVZHFSU3h2UWtGQlNTeERRVUZETEdWQlFXVXNSMEZCUnl4SlFVRkpMSGRDUVVGM1FpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpGRUxHOUNRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zWlVGQlpTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMlZCUTNCRUxFMUJRVTBzU1VGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXl4RlFVRkZPenRCUVVWMFFpdzBRa0ZCV1N4SFFVRkhMRkZCUVZFc1EwRkJRenM3UVVGRmVFSXNiMEpCUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFRRVUZUTEVWQlEzcENMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVYzNReXh2UWtGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6VkRMRzlDUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXp0bFFVTTNRaXhOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEZOQlFWTXNSMEZCUnl4RFFVRkRMRVZCUVVVN08wRkJRMmhETERSQ1FVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dGxRVU5zUlN4TlFVRk5MRWxCUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFRRVUZUTEVWQlFVVTdRVUZEYkVNc2IwSkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdaVUZEYUVRN08wRkJSVVFzYTBKQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTjJReXh2UWtGQlRUczdRVUZCUVN4QlFVVlNMR2xDUVVGTExGZEJRVmM3UVVGRFpDeHJRa0ZCU1N4VFFVRlRMRXRCUVVzc1EwRkJRenRCUVVOcVFpeHZRa0ZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVOeVF5eEpRVUZKTEV0QlFVc3NTMEZCU3l4RFFVRkRPMEZCUTJ4Q0xHOUNRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTJwRUxHOUNRVUZOTzBGQlFVRXNWMEZEVkRzN1FVRkZSQ3hqUVVGSkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzFOQlF5OURPMDlCUTBZN08wRkJTMFFzVTBGQlN6czdPenM3TzJGQlFVRXNhVUpCUVVjN1FVRkRUaXhaUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1FVRkRla0lzV1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1QwRkROVVE3TzBGQlMwUXNVMEZCU3pzN096czdPMkZCUVVFc2FVSkJRVWM3UVVGRFRpeFpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRGVrSXNXVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRQUVVNeFF6czdRVUZMUkN4UlFVRkpPenM3T3pzN1lVRkJRU3huUWtGQlJ6dEJRVU5NTEZsQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU42UWl4WlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM3BETEZsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VDBGRFpEczdRVUVyUWtjc1UwRkJTenM3T3pzN096dFhRWHBDUVN4VlFVRkRMRXRCUVVzc1JVRkJSVHRCUVVObUxGbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenM3UVVGRmVrSXNXVUZCU1N4TFFVRkxMRWxCUVVrc1EwRkJReXhGUVVGRk8wRkJRMlFzWTBGQlNTeExRVUZMTEVkQlFVY3NUVUZCVFN4RlFVTm9RaXhMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEV0QlExb3NTVUZCU1N4TFFVRkxMRWRCUVVjc1JVRkJSU3hGUVVOcVFpeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPMU5CUTJRc1RVRkJUVHRCUVVOTUxHTkJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNSVUZCUlN4RlFVTmlMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eExRVU5VTEVsQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1RVRkJUU3hGUVVOMFFpeExRVUZMTEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNN1UwRkRia0k3TzBGQlJVUXNXVUZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhMUVVGTExFTkJRVU03TzBGQlJUVkNMRmxCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUzBGQlN5eERRVUZETEVWQlEzQkNMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRGFFUTdPenM3T3p0WFFVMVJMRmxCUVVjN1FVRkRWaXhsUVVGUExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTTdUMEZETlVJN08wRkJUVVFzVVVGQlNUczdPenM3T3p0aFFVRkJMR05CUVVNc1VVRkJVU3hGUVVGRk8wRkJRMklzV1VGQlNTeFJRVUZSTEV0QlFVc3NTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVOb1F5eGpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRGVrSXNZMEZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhSUVVGUkxFTkJRVU03UVVGRE0wSXNZMEZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03VTBGRGNFUTdUMEZEUmpzN1FVRkxSQ3hUUVVGTE96czdPenM3WVVGQlFTeHBRa0ZCUnp0QlFVTk9MRmxCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0QlFVTjZRaXhaUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzcERMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdUMEZEYUVNN096czdVMEU1VlVjc1YwRkJWenRIUVVGVExGVkJRVlU3TzBGQmFWWndReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZkQlFWY3NRMEZCUXlJc0ltWnBiR1VpT2lKbGN6WXZkWFJwYkhNdmNISnBiM0pwZEhrdGNYVmxkV1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaUIzY21sMGRHVnVJR2x1SUVWRFRVRnpZM0pwY0hRZ05pQXFMMXh1THlvcVhHNGdLaUJBWm1sc1pXOTJaWEoyYVdWM0lGZEJWa1VnWVhWa2FXOGdjR3hoZVNCamIyNTBjbTlzSUdOc1lYTnpJQ2gwYVcxbExXVnVaMmx1WlNCdFlYTjBaWElwTENCd2NtOTJhV1JsY3lCd2JHRjVJR052Ym5SeWIyd2dkRzhnWVNCemFXNW5iR1VnWlc1bmFXNWxYRzRnS2lCQVlYVjBhRzl5SUU1dmNtSmxjblF1VTJOb2JtVnNiRUJwY21OaGJTNW1jaXdnVm1samRHOXlMbE5oYVhwQWFYSmpZVzB1Wm5Jc0lFdGhjbWx0TGtKaGNtdGhkR2xBYVhKallXMHVabkpjYmlBcUwxeHVKM1Z6WlNCemRISnBZM1FuTzF4dVhHNTJZWElnVkdsdFpVVnVaMmx1WlNBOUlISmxjWFZwY21Vb1hDSXVMaTlqYjNKbEwzUnBiV1V0Wlc1bmFXNWxYQ0lwTzF4dWRtRnlJSHNnWjJWMFUyTm9aV1IxYkdWeUlIMGdQU0J5WlhGMWFYSmxLQ2N1TDJaaFkzUnZjbWxsY3ljcE8xeHVYRzVqYkdGemN5QlFiR0Y1UTI5dWRISnZiRk5qYUdWa2RXeGxja2h2YjJzZ1pYaDBaVzVrY3lCVWFXMWxSVzVuYVc1bElIdGNiaUFnWTI5dWMzUnlkV04wYjNJb2NHeGhlVU52Ym5SeWIyd3BJSHRjYmlBZ0lDQnpkWEJsY2lncE8xeHVJQ0FnSUhSb2FYTXVYMTl3YkdGNVEyOXVkSEp2YkNBOUlIQnNZWGxEYjI1MGNtOXNPMXh1SUNCOVhHNWNiaUFnWVdSMllXNWpaVlJwYldVb2RHbHRaU2tnZTF4dUlDQWdJSFpoY2lCd2JHRjVRMjl1ZEhKdmJDQTlJSFJvYVhNdVgxOXdiR0Y1UTI5dWRISnZiRHRjYmlBZ0lDQjJZWElnY0c5emFYUnBiMjRnUFNCd2JHRjVRMjl1ZEhKdmJDNWZYMmRsZEZCdmMybDBhVzl1UVhSVWFXMWxLSFJwYldVcE8xeHVJQ0FnSUhaaGNpQnVaWGgwVUc5emFYUnBiMjRnUFNCd2JHRjVRMjl1ZEhKdmJDNWZYMlZ1WjJsdVpTNWhaSFpoYm1ObFVHOXphWFJwYjI0b2RHbHRaU3dnY0c5emFYUnBiMjRzSUhCc1lYbERiMjUwY205c0xsOWZjM0JsWldRcE8xeHVYRzRnSUNBZ2FXWWdLRzVsZUhSUWIzTnBkR2x2YmlBaFBUMGdTVzVtYVc1cGRIa3BYRzRnSUNBZ0lDQnlaWFIxY200Z2NHeGhlVU52Ym5SeWIyd3VYMTluWlhSVWFXMWxRWFJRYjNOcGRHbHZiaWh1WlhoMFVHOXphWFJwYjI0cE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUVsdVptbHVhWFI1TzF4dUlDQjlYRzU5WEc1Y2JtTnNZWE56SUZCc1lYbERiMjUwY205c1RHOXZjRU52Ym5SeWIyd2daWGgwWlc1a2N5QlVhVzFsUlc1bmFXNWxJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9jR3hoZVVOdmJuUnliMndwSUh0Y2JpQWdJQ0J6ZFhCbGNpZ3BPMXh1SUNBZ0lIUm9hWE11WDE5d2JHRjVRMjl1ZEhKdmJDQTlJSEJzWVhsRGIyNTBjbTlzTzF4dUlDQWdJSFJvYVhNdWMzQmxaV1FnUFNCdWRXeHNPMXh1SUNCOVhHNWNiaUFnTHk4Z1ZHbHRaVVZ1WjJsdVpTQnRaWFJvYjJRZ0tITmphR1ZrZFd4bFpDQnBiblJsY21aaFkyVXBYRzRnSUdGa2RtRnVZMlZVYVcxbEtIUnBiV1VwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV6Y0dWbFpDQStJREFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMTl3YkdGNVEyOXVkSEp2YkM1emVXNWpVM0JsWldRb2RHbHRaU3dnZEdocGN5NWZYM0JzWVhsRGIyNTBjbTlzTGw5ZmJHOXZjRk4wWVhKMExDQjBhR2x6TG5Od1pXVmtMQ0IwY25WbEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmY0d4aGVVTnZiblJ5YjJ3dVgxOW5aWFJVYVcxbFFYUlFiM05wZEdsdmJpaDBhR2x6TGw5ZmNHeGhlVU52Ym5SeWIyd3VYMTlzYjI5d1JXNWtLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFJvYVhNdWMzQmxaV1FnUENBd0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5ZmNHeGhlVU52Ym5SeWIyd3VjM2x1WTFOd1pXVmtLSFJwYldVc0lIUm9hWE11WDE5d2JHRjVRMjl1ZEhKdmJDNWZYMnh2YjNCRmJtUXNJSFJvYVhNdWMzQmxaV1FzSUhSeWRXVXBPMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5d2JHRjVRMjl1ZEhKdmJDNWZYMmRsZEZScGJXVkJkRkJ2YzJsMGFXOXVLSFJvYVhNdVgxOXdiR0Y1UTI5dWRISnZiQzVmWDJ4dmIzQlRkR0Z5ZENrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQkpibVpwYm1sMGVUdGNiaUFnZlZ4dWZWeHVYRzVqYkdGemN5QlFiR0Y1UTI5dWRISnZiQ0JsZUhSbGJtUnpJRlJwYldWRmJtZHBibVVnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhsYm1kcGJtVXBJSHRjYmlBZ0lDQnpkWEJsY2lobGJtZHBibVV1WVhWa2FXOURiMjUwWlhoMEtUdGNibHh1SUNBZ0lDOHZJR1oxZEhWeVpTQmhjM05wWjI1dFpXNTBYRzRnSUNBZ0x5OGdkR2hwY3k1elkyaGxaSFZzWlhJZ1BTQjNZWFpsY3k1blpYUlRZMmhsWkhWc1pYSW9aVzVuYVc1bExtRjFaR2x2UTI5dWRHVjRkQ2s3WEc0Z0lDQWdMeThnZEdocGN5NXpZMmhsWkhWc1pYSWdQU0J5WlhGMWFYSmxLRndpYzJOb1pXUjFiR1Z5WENJcE8xeHVJQ0FnSUM4dklIUmxjM1JjYmlBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2lBOUlHZGxkRk5qYUdWa2RXeGxjaWhsYm1kcGJtVXVZWFZrYVc5RGIyNTBaWGgwS1R0Y2JseHVJQ0FnSUhSb2FYTXVYMTlsYm1kcGJtVWdQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVYMTlwYm5SbGNtWmhZMlVnUFNCdWRXeHNPMXh1SUNBZ0lIUm9hWE11WDE5elkyaGxaSFZzWlhKSWIyOXJJRDBnYm5Wc2JEdGNibHh1SUNBZ0lIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZYMnh2YjNCVGRHRnlkQ0E5SURBN1hHNGdJQ0FnZEdocGN5NWZYMnh2YjNCRmJtUWdQU0JKYm1acGJtbDBlVHRjYmx4dUlDQWdJQzh2SUhONWJtTm9jbTl1YVhwbFpDQjBhV1VzSUhCdmMybDBhVzl1TENCaGJtUWdjM0JsWldSY2JpQWdJQ0IwYUdsekxsOWZkR2x0WlNBOUlEQTdYRzRnSUNBZ2RHaHBjeTVmWDNCdmMybDBhVzl1SUQwZ01EdGNiaUFnSUNCMGFHbHpMbDlmYzNCbFpXUWdQU0F3TzF4dVhHNGdJQ0FnZEdocGN5NWZYMjVsZUhSUWIzTnBkR2x2YmlBOUlFbHVabWx1YVhSNU8xeHVYRzRnSUNBZ0x5OGdibTl1TFhwbGNtOGdYQ0oxYzJWeVhDSWdjM0JsWldSY2JpQWdJQ0IwYUdsekxsOWZjR3hoZVdsdVoxTndaV1ZrSUQwZ01UdGNibHh1SUNBZ0lHbG1JQ2hsYm1kcGJtVXViV0Z6ZEdWeUtWeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWIySnFaV04wSUdoaGN5QmhiSEpsWVdSNUlHSmxaVzRnWVdSa1pXUWdkRzhnWVNCdFlYTjBaWEpjSWlrN1hHNWNiaUFnSUNCMllYSWdjM0JsWldRZ1BTQjBhR2x6TGw5ZmMzQmxaV1E3WEc1Y2JpQWdJQ0IyWVhJZ1oyVjBRM1Z5Y21WdWRGUnBiV1VnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amRYSnlaVzUwVkdsdFpUdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ2RtRnlJR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaUE5SUNncElEMCtJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1OMWNuSmxiblJRYjNOcGRHbHZianRjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdhV1lnS0dWdVoybHVaUzVwYlhCc1pXMWxiblJ6VTNCbFpXUkRiMjUwY205c2JHVmtLQ2twSUh0Y2JpQWdJQ0FnSUM4dklHRmtaQ0IwYVcxbElHVnVaMmx1WlNCMGFHRjBJR2x0Y0d4bGJXVnVkSE1nYzNCbFpXUXRZMjl1ZEhKdmJHeGxaQ0JwYm5SbGNtWmhZMlZjYmlBZ0lDQWdJSFJvYVhNdVgxOWxibWRwYm1VZ1BTQmxibWRwYm1VN1hHNGdJQ0FnSUNCMGFHbHpMbDlmYVc1MFpYSm1ZV05sSUQwZ1hDSnpjR1ZsWkMxamIyNTBjbTlzYkdWa1hDSTdYRzRnSUNBZ0lDQmxibWRwYm1VdWMyVjBVM0JsWldSRGIyNTBjbTlzYkdWa0tIUm9hWE1zSUdkbGRFTjFjbkpsYm5SVWFXMWxMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvWlc1bmFXNWxMbWx0Y0d4bGJXVnVkSE5VY21GdWMzQnZjblJsWkNncEtTQjdYRzRnSUNBZ0lDQXZMeUJoWkdRZ2RHbHRaU0JsYm1kcGJtVWdkR2hoZENCcGJYQnNaVzFsYm5SeklIUnlZVzV6Y0c5eWRHVmtJR2x1ZEdWeVptRmpaVnh1SUNBZ0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlNBOUlHVnVaMmx1WlR0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlwYm5SbGNtWmhZMlVnUFNCY0luUnlZVzV6Y0c5eWRHVmtYQ0k3WEc1Y2JpQWdJQ0FnSUdWdVoybHVaUzV6WlhSVWNtRnVjM0J2Y25SbFpDaDBhR2x6TENBd0xDQW9ibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVJRDBnYm5Wc2JDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBdkx5QnlaWE5sZEU1bGVIUlFiM05wZEdsdmJseHVJQ0FnSUNBZ0lDQnBaaUFvYm1WNGRFVnVaMmx1WlZCdmMybDBhVzl1SUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhScGJXVWdQU0IwYUdsekxuTmphR1ZrZFd4bGNpNWpkWEp5Wlc1MFZHbHRaVHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdjRzl6YVhScGIyNGdQU0IwYUdsekxsOWZaMlYwVUc5emFYUnBiMjVCZEZScGJXVW9kR2x0WlNrN1hHNGdJQ0FnSUNBZ0lDQWdibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVJRDBnWlc1bmFXNWxMbk41Ym1OUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnZEdocGN5NWZYM053WldWa0tUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTl5WlhObGRFNWxlSFJRYjNOcGRHbHZiaWh1WlhoMFJXNW5hVzVsVUc5emFYUnBiMjRwTzF4dUlDQWdJQ0FnZlN3Z1oyVjBRM1Z5Y21WdWRGUnBiV1VzSUdkbGRFTjFjbkpsYm5SUWIzTnBkR2x2YmlrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNobGJtZHBibVV1YVcxd2JHVnRaVzUwYzFOamFHVmtkV3hsWkNncEtTQjdYRzRnSUNBZ0lDQXZMeUJoWkdRZ2RHbHRaU0JsYm1kcGJtVWdkR2hoZENCcGJYQnNaVzFsYm5SeklITmphR1ZrZFd4bFpDQnBiblJsY21aaFkyVmNiaUFnSUNBZ0lIUm9hWE11WDE5bGJtZHBibVVnUFNCbGJtZHBibVU3WEc0Z0lDQWdJQ0IwYUdsekxsOWZhVzUwWlhKbVlXTmxJRDBnWENKelkyaGxaSFZzWldSY0lqdGNibHh1SUNBZ0lDQWdkR2hwY3k1elkyaGxaSFZzWlhJdVlXUmtLR1Z1WjJsdVpTd2dTVzVtYVc1cGRIa3NJR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaWs3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltOWlhbVZqZENCallXNXViM1FnWW1VZ1lXUmtaV1FnZEc4Z2NHeGhlU0JqYjI1MGNtOXNYQ0lwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRmVIUnlZWEJ2YkdGMFpTQjBjbUZ1YzNCdmNuUWdkR2x0WlNCbWIzSWdaMmwyWlc0Z2NHOXphWFJwYjI1Y2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJSEJ2YzJsMGFXOXVJSEJ2YzJsMGFXOXVYRzRnSUNBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ1pYaDBjbUZ3YjJ4aGRHVmtJSFJwYldWY2JpQWdJQ292WEc0Z0lGOWZaMlYwVkdsdFpVRjBVRzl6YVhScGIyNG9jRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNScGJXVWdLeUFvY0c5emFYUnBiMjRnTFNCMGFHbHpMbDlmY0c5emFYUnBiMjRwSUM4Z2RHaHBjeTVmWDNOd1pXVmtPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVWNGRISmhjRzlzWVhSbElIQnNZWGxwYm1jZ2NHOXphWFJwYjI0Z1ptOXlJR2RwZG1WdUlIUnBiV1ZjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIUnBiV1VnZEdsdFpWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdWNGRISmhjRzlzWVhSbFpDQndiM05wZEdsdmJseHVJQ0FnS2k5Y2JpQWdYMTluWlhSUWIzTnBkR2x2YmtGMFZHbHRaU2gwYVcxbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTl3YjNOcGRHbHZiaUFySUNoMGFXMWxJQzBnZEdocGN5NWZYM1JwYldVcElDb2dkR2hwY3k1ZlgzTndaV1ZrTzF4dUlDQjlYRzVjYmlBZ1gxOXplVzVqS0NrZ2UxeHVJQ0FnSUhaaGNpQnViM2NnUFNCMGFHbHpMbU4xY25KbGJuUlVhVzFsTzF4dUlDQWdJSFJvYVhNdVgxOXdiM05wZEdsdmJpQXJQU0FvYm05M0lDMGdkR2hwY3k1ZlgzUnBiV1VwSUNvZ2RHaHBjeTVmWDNOd1pXVmtPMXh1SUNBZ0lIUm9hWE11WDE5MGFXMWxJRDBnYm05M08xeHVJQ0FnSUhKbGRIVnliaUJ1YjNjN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwSUdOMWNuSmxiblFnYldGemRHVnlJSEJ2YzJsMGFXOXVYRzRnSUNBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ1kzVnljbVZ1ZENCd2JHRjVhVzVuSUhCdmMybDBhVzl1WEc0Z0lDQXFMMXh1SUNCZlgzSmxjMlYwVG1WNGRGQnZjMmwwYVc5dUtHNWxlSFJRYjNOcGRHbHZiaWtnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbDlmYzJOb1pXUjFiR1Z5U0c5dmF5bGNiaUFnSUNBZ0lIUm9hWE11WDE5elkyaGxaSFZzWlhKSWIyOXJMbkpsYzJWMFRtVjRkRlJwYldVb2RHaHBjeTVmWDJkbGRGUnBiV1ZCZEZCdmMybDBhVzl1S0c1bGVIUlFiM05wZEdsdmJpa3BPMXh1WEc0Z0lDQWdkR2hwY3k1ZlgyNWxlSFJRYjNOcGRHbHZiaUE5SUc1bGVIUlFiM05wZEdsdmJqdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJIWlhRZ1kzVnljbVZ1ZENCdFlYTjBaWElnZEdsdFpWeHVJQ0FnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5SUdOMWNuSmxiblFnZEdsdFpWeHVJQ0FnS2x4dUlDQWdLaUJVYUdseklHWjFibU4wYVc5dUlIZHBiR3dnWW1VZ2NtVndiR0ZqWldRZ2QyaGxiaUIwYUdVZ2NHeGhlUzFqYjI1MGNtOXNJR2x6SUdGa1pHVmtJSFJ2SUdFZ2JXRnpkR1Z5TGx4dUlDQWdLaTljYmlBZ1oyVjBJR04xY25KbGJuUlVhVzFsS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuTmphR1ZrZFd4bGNpNWpkWEp5Wlc1MFZHbHRaVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSFpYUWdZM1Z5Y21WdWRDQnRZWE4wWlhJZ2NHOXphWFJwYjI1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VG5WdFltVnlmU0JqZFhKeVpXNTBJSEJzWVhscGJtY2djRzl6YVhScGIyNWNiaUFnSUNwY2JpQWdJQ29nVkdocGN5Qm1kVzVqZEdsdmJpQjNhV3hzSUdKbElISmxjR3hoWTJWa0lIZG9aVzRnZEdobElIQnNZWGt0WTI5dWRISnZiQ0JwY3lCaFpHUmxaQ0IwYnlCaElHMWhjM1JsY2k1Y2JpQWdJQ292WEc0Z0lHZGxkQ0JqZFhKeVpXNTBVRzl6YVhScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5d2IzTnBkR2x2YmlBcklDaDBhR2x6TG5OamFHVmtkV3hsY2k1amRYSnlaVzUwVkdsdFpTQXRJSFJvYVhNdVgxOTBhVzFsS1NBcUlIUm9hWE11WDE5emNHVmxaRHRjYmlBZ2ZWeHVYRzRnSUhObGRDQnNiMjl3S0dWdVlXSnNaU2tnZTF4dUlDQWdJR2xtSUNobGJtRmliR1VwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TGw5ZmJHOXZjRk4wWVhKMElENGdMVWx1Wm1sdWFYUjVJQ1ltSUhSb2FYTXVYMTlzYjI5d1JXNWtJRHdnU1c1bWFXNXBkSGtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDJ4dmIzQkRiMjUwY205c0lEMGdibVYzSUZCc1lYbERiMjUwY205c1RHOXZjRU52Ym5SeWIyd29kR2hwY3lrN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJOb1pXUjFiR1Z5TG1Ga1pDaDBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd3NJRWx1Wm1sdWFYUjVLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFJvYVhNdVgxOXNiMjl3UTI5dWRISnZiQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpZMmhsWkhWc1pYSXVjbVZ0YjNabEtIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDazdYRzRnSUNBZ0lDQjBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd2dQU0J1ZFd4c08xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHZGxkQ0JzYjI5d0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb0lTRjBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd3BPMXh1SUNCOVhHNWNiaUFnYzJWMFRHOXZjRUp2ZFc1a1lYSnBaWE1vYzNSaGNuUXNJR1Z1WkNrZ2UxeHVJQ0FnSUdsbUlDaGxibVFnUGowZ2MzUmhjblFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMTlzYjI5d1UzUmhjblFnUFNCemRHRnlkRHRjYmlBZ0lDQWdJSFJvYVhNdVgxOXNiMjl3Ulc1a0lEMGdaVzVrTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5ZmJHOXZjRk4wWVhKMElEMGdaVzVrTzF4dUlDQWdJQ0FnZEdocGN5NWZYMnh2YjNCRmJtUWdQU0J6ZEdGeWREdGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbXh2YjNBZ1BTQjBhR2x6TG14dmIzQTdYRzRnSUgxY2JseHVJQ0J6WlhRZ2JHOXZjRk4wWVhKMEtITjBZWEowVkdsdFpTa2dlMXh1SUNBZ0lIUm9hWE11YzJWMFRHOXZjRUp2ZFc1a1lYSnBaWE1vYzNSaGNuUlVhVzFsTENCMGFHbHpMbDlmYkc5dmNFVnVaQ2s3WEc0Z0lIMWNibHh1SUNCblpYUWdiRzl2Y0ZOMFlYSjBLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmJHOXZjRk4wWVhKME8xeHVJQ0I5WEc1Y2JpQWdjMlYwSUd4dmIzQkZibVFvWlc1a1ZHbHRaU2tnZTF4dUlDQWdJSFJvYVhNdWMyVjBURzl2Y0VKdmRXNWtZWEpwWlhNb2RHaHBjeTVmWDJ4dmIzQlRkR0Z5ZEN3Z1pXNWtWR2x0WlNrN1hHNGdJSDFjYmx4dUlDQm5aWFFnYkc5dmNFVnVaQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyeHZiM0JGYm1RN1hHNGdJSDFjYmx4dUlDQmZYMkZ3Y0d4NVRHOXZjRUp2ZFc1a1lYSnBaWE1vY0c5emFYUnBiMjRzSUhOd1pXVmtMQ0J6WldWcktTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVgxOXNiMjl3UTI5dWRISnZiQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tITndaV1ZrSUQ0Z01DQW1KaUJ3YjNOcGRHbHZiaUErUFNCMGFHbHpMbDlmYkc5dmNFVnVaQ2xjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOXNiMjl3VTNSaGNuUWdLeUFvY0c5emFYUnBiMjRnTFNCMGFHbHpMbDlmYkc5dmNGTjBZWEowS1NBbElDaDBhR2x6TGw5ZmJHOXZjRVZ1WkNBdElIUm9hWE11WDE5c2IyOXdVM1JoY25RcE8xeHVJQ0FnSUNBZ1pXeHpaU0JwWmlBb2MzQmxaV1FnUENBd0lDWW1JSEJ2YzJsMGFXOXVJRHdnZEdocGN5NWZYMnh2YjNCVGRHRnlkQ2xjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOXNiMjl3Ulc1a0lDMGdLSFJvYVhNdVgxOXNiMjl3Ulc1a0lDMGdjRzl6YVhScGIyNHBJQ1VnS0hSb2FYTXVYMTlzYjI5d1JXNWtJQzBnZEdocGN5NWZYMnh2YjNCVGRHRnlkQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlIQnZjMmwwYVc5dU8xeHVJQ0I5WEc1Y2JpQWdYMTl5WlhOamFHVmtkV3hsVEc5dmNFTnZiblJ5YjJ3b2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WDE5c2IyOXdRMjl1ZEhKdmJDa2dlMXh1SUNBZ0lDQWdhV1lnS0hOd1pXVmtJRDRnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd3VjM0JsWldRZ1BTQnpjR1ZsWkR0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WTJobFpIVnNaWEl1Y21WelpYUW9kR2hwY3k1ZlgyeHZiM0JEYjI1MGNtOXNMQ0IwYUdsekxsOWZaMlYwVkdsdFpVRjBVRzl6YVhScGIyNG9kR2hwY3k1ZlgyeHZiM0JGYm1RcEtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9jM0JsWldRZ1BDQXdLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMTlzYjI5d1EyOXVkSEp2YkM1emNHVmxaQ0E5SUhOd1pXVmtPMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmphR1ZrZFd4bGNpNXlaWE5sZENoMGFHbHpMbDlmYkc5dmNFTnZiblJ5YjJ3c0lIUm9hWE11WDE5blpYUlVhVzFsUVhSUWIzTnBkR2x2YmloMGFHbHpMbDlmYkc5dmNGTjBZWEowS1NrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5qYUdWa2RXeGxjaTV5WlhObGRDaDBhR2x6TGw5ZmJHOXZjRU52Ym5SeWIyd3NJRWx1Wm1sdWFYUjVLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCVWFXMWxSVzVuYVc1bElHMWxkR2h2WkNBb2MzQmxaV1F0WTI5dWRISnZiR3hsWkNCcGJuUmxjbVpoWTJVcFhHNGdJSE41Ym1OVGNHVmxaQ2gwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRc0lITmxaV3NnUFNCbVlXeHpaU2tnZTF4dUlDQWdJSFpoY2lCc1lYTjBVM0JsWldRZ1BTQjBhR2x6TGw5ZmMzQmxaV1E3WEc1Y2JpQWdJQ0JwWmlBb2MzQmxaV1FnSVQwOUlHeGhjM1JUY0dWbFpDQjhmQ0J6WldWcktTQjdYRzRnSUNBZ0lDQnBaaUFvYzJWbGF5QjhmQ0JzWVhOMFUzQmxaV1FnUFQwOUlEQXBYRzRnSUNBZ0lDQWdJSEJ2YzJsMGFXOXVJRDBnZEdocGN5NWZYMkZ3Y0d4NVRHOXZjRUp2ZFc1a1lYSnBaWE1vY0c5emFYUnBiMjRzSUhOd1pXVmtLVHRjYmx4dUlDQWdJQ0FnZEdocGN5NWZYM1JwYldVZ1BTQjBhVzFsTzF4dUlDQWdJQ0FnZEdocGN5NWZYM0J2YzJsMGFXOXVJRDBnY0c5emFYUnBiMjQ3WEc0Z0lDQWdJQ0IwYUdsekxsOWZjM0JsWldRZ1BTQnpjR1ZsWkR0Y2JseHVJQ0FnSUNBZ2MzZHBkR05vSUNoMGFHbHpMbDlmYVc1MFpYSm1ZV05sS1NCN1hHNGdJQ0FnSUNBZ0lHTmhjMlVnWENKemNHVmxaQzFqYjI1MGNtOXNiR1ZrWENJNlhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVM0JsWldRb2RHbHRaU3dnY0c5emFYUnBiMjRzSUhOd1pXVmtMQ0J6WldWcktUdGNiaUFnSUNBZ0lDQWdJQ0JpY21WaGF6dGNibHh1SUNBZ0lDQWdJQ0JqWVhObElGd2lkSEpoYm5Od2IzSjBaV1JjSWpwY2JpQWdJQ0FnSUNBZ0lDQjJZWElnYm1WNGRGQnZjMmwwYVc5dUlEMGdkR2hwY3k1ZlgyNWxlSFJRYjNOcGRHbHZianRjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2h6WldWcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCdVpYaDBVRzl6YVhScGIyNGdQU0IwYUdsekxsOWZaVzVuYVc1bExuTjVibU5RYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvYkdGemRGTndaV1ZrSUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJ6ZEdGeWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnYm1WNGRGQnZjMmwwYVc5dUlEMGdkR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1lXUmtJSE5qYUdWa2RXeGxjaUJvYjI5cklIUnZJSE5qYUdWa2RXeGxjaUFvZDJsc2JDQmlaU0J5WlhOamFHVmtkV3hsWkNCMGJ5QmhjSEJ5YjNCeWFXRjBaU0IwYVcxbElHSmxiRzkzS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZlgzTmphR1ZrZFd4bGNraHZiMnNnUFNCdVpYY2dVR3hoZVVOdmJuUnliMnhUWTJobFpIVnNaWEpJYjI5cktIUm9hWE1wTzF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1elkyaGxaSFZzWlhJdVlXUmtLSFJvYVhNdVgxOXpZMmhsWkhWc1pYSkliMjlyTENCSmJtWnBibWwwZVNrN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h6Y0dWbFpDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MzUnZjRnh1SUNBZ0lDQWdJQ0FnSUNBZ2JtVjRkRkJ2YzJsMGFXOXVJRDBnU1c1bWFXNXBkSGs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbDlmWlc1bmFXNWxMbk41Ym1OVGNHVmxaQ2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVM0JsWldRb2RHbHRaU3dnY0c5emFYUnBiMjRzSURBcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QnlaVzF2ZG1VZ2MyTm9aV1IxYkdWeUlHaHZiMnNnWm5KdmJTQnpZMmhsWkhWc1pYSmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjMk5vWldSMWJHVnlMbkpsYlc5MlpTaDBhR2x6TGw5ZmMyTm9aV1IxYkdWeVNHOXZheWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmMyTm9aV1IxYkdWeVNHOXZheUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtSUNoemNHVmxaQ0FxSUd4aGMzUlRjR1ZsWkNBOElEQXBJSHNnTHk4Z1kyaGhibWRsSUhSeVlXNXpjRzl5ZENCa2FYSmxZM1JwYjI1Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVsZUhSUWIzTnBkR2x2YmlBOUlIUm9hWE11WDE5bGJtZHBibVV1YzNsdVkxQnZjMmwwYVc5dUtIUnBiV1VzSUhCdmMybDBhVzl1TENCemNHVmxaQ2s3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlRjR1ZsWkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpTNXplVzVqVTNCbFpXUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlmY21WelpYUk9aWGgwVUc5emFYUnBiMjRvYm1WNGRGQnZjMmwwYVc5dUtUdGNiaUFnSUNBZ0lDQWdJQ0JpY21WaGF6dGNibHh1SUNBZ0lDQWdJQ0JqWVhObElGd2ljMk5vWldSMWJHVmtYQ0k2WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR3hoYzNSVGNHVmxaQ0E5UFQwZ01Da2dMeThnYzNSaGNuUWdiM0lnYzJWbGExeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZYM05qYUdWa2RXeGxaRVZ1WjJsdVpTNXlaWE5sZEU1bGVIUlVhVzFsS0RBcE8xeHVJQ0FnSUNBZ0lDQWdJR1ZzYzJVZ2FXWWdLSE53WldWa0lEMDlQU0F3S1NBdkx5QnpkRzl3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmMyTm9aV1IxYkdWa1JXNW5hVzVsTG5KbGMyVjBUbVY0ZEZScGJXVW9TVzVtYVc1cGRIa3BPMXh1SUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxsOWZjbVZ6WTJobFpIVnNaVXh2YjNCRGIyNTBjbTlzS0hCdmMybDBhVzl1TENCemNHVmxaQ2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZOMFlYSjBJSEJzWVhscGJtZGNiaUFnSUNvdlhHNGdJSE4wWVhKMEtDa2dlMXh1SUNBZ0lIWmhjaUIwYVcxbElEMGdkR2hwY3k1ZlgzTjVibU1vS1R0Y2JpQWdJQ0IwYUdsekxuTjVibU5UY0dWbFpDaDBhVzFsTENCMGFHbHpMbDlmY0c5emFYUnBiMjRzSUhSb2FYTXVYMTl3YkdGNWFXNW5VM0JsWldRcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRkJoZFhObElIQnNZWGxwYm1kY2JpQWdJQ292WEc0Z0lIQmhkWE5sS0NrZ2UxeHVJQ0FnSUhaaGNpQjBhVzFsSUQwZ2RHaHBjeTVmWDNONWJtTW9LVHRjYmlBZ0lDQjBhR2x6TG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0IwYUdsekxsOWZjRzl6YVhScGIyNHNJREFwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGTjBiM0FnY0d4aGVXbHVaMXh1SUNBZ0tpOWNiaUFnYzNSdmNDZ3BJSHRjYmlBZ0lDQjJZWElnZEdsdFpTQTlJSFJvYVhNdVgxOXplVzVqS0NrN1hHNGdJQ0FnZEdocGN5NXplVzVqVTNCbFpXUW9kR2x0WlN3Z2RHaHBjeTVmWDNCdmMybDBhVzl1TENBd0tUdGNiaUFnSUNCMGFHbHpMbk5sWldzb01DazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElIQnNZWGxwYm1jZ2MzQmxaV1JjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlITndaV1ZrSUhCc1lYbHBibWNnYzNCbFpXUWdLRzV2YmkxNlpYSnZJSE53WldWa0lHSmxkSGRsWlc0Z0xURTJJR0Z1WkNBdE1TOHhOaUJ2Y2lCaVpYUjNaV1Z1SURFdk1UWWdZVzVrSURFMktWeHVJQ0FnS2k5Y2JpQWdjMlYwSUhOd1pXVmtLSE53WldWa0tTQjdYRzRnSUNBZ2RtRnlJSFJwYldVZ1BTQjBhR2x6TGw5ZmMzbHVZeWdwTzF4dVhHNGdJQ0FnYVdZZ0tITndaV1ZrSUQ0OUlEQXBJSHRjYmlBZ0lDQWdJR2xtSUNoemNHVmxaQ0E4SURBdU1EWXlOU2xjYmlBZ0lDQWdJQ0FnYzNCbFpXUWdQU0F3TGpBMk1qVTdYRzRnSUNBZ0lDQmxiSE5sSUdsbUlDaHpjR1ZsWkNBK0lERTJLVnh1SUNBZ0lDQWdJQ0J6Y0dWbFpDQTlJREUyTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnBaaUFvYzNCbFpXUWdQQ0F0TVRZcFhHNGdJQ0FnSUNBZ0lITndaV1ZrSUQwZ0xURTJPMXh1SUNBZ0lDQWdaV3h6WlNCcFppQW9jM0JsWldRZ1BpQXRNQzR3TmpJMUtWeHVJQ0FnSUNBZ0lDQnpjR1ZsWkNBOUlDMHdMakEyTWpVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWZYM0JzWVhscGJtZFRjR1ZsWkNBOUlITndaV1ZrTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11WDE5emNHVmxaQ0FoUFQwZ01DbGNiaUFnSUNBZ0lIUm9hWE11YzNsdVkxTndaV1ZrS0hScGJXVXNJSFJvYVhNdVgxOXdiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCd2JHRjVhVzVuSUhOd1pXVmtYRzRnSUNBcUlFQnlaWFIxY200Z1kzVnljbVZ1ZENCd2JHRjVhVzVuSUhOd1pXVmtYRzRnSUNBcUwxeHVJQ0JuWlhRZ2MzQmxaV1FvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVgxOXdiR0Y1YVc1blUzQmxaV1E3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1UyVjBJQ2hxZFcxd0lIUnZLU0J3YkdGNWFXNW5JSEJ2YzJsMGFXOXVYRzRnSUNBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCd2IzTnBkR2x2YmlCMFlYSm5aWFFnY0c5emFYUnBiMjVjYmlBZ0lDb3ZYRzRnSUhObFpXc29jRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnBaaUFvY0c5emFYUnBiMjRnSVQwOUlIUm9hWE11WDE5d2IzTnBkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2RtRnlJSFJwYldVZ1BTQjBhR2x6TGw5ZmMzbHVZeWdwTzF4dUlDQWdJQ0FnZEdocGN5NWZYM0J2YzJsMGFXOXVJRDBnY0c5emFYUnBiMjQ3WEc0Z0lDQWdJQ0IwYUdsekxuTjVibU5UY0dWbFpDaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2RHaHBjeTVmWDNOd1pXVmtMQ0IwY25WbEtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZ0YjNabElIUnBiV1VnWlc1bmFXNWxJR1p5YjIwZ2RHaGxJSFJ5WVc1emNHOXlkRnh1SUNBZ0tpOWNiaUFnWTJ4bFlYSW9LU0I3WEc0Z0lDQWdkbUZ5SUhScGJXVWdQU0IwYUdsekxsOWZjM2x1WXlncE8xeHVJQ0FnSUhSb2FYTXVjM2x1WTFOd1pXVmtLSFJwYldVc0lIUm9hWE11WDE5d2IzTnBkR2x2Yml3Z01DazdYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaUzV5WlhObGRFbHVkR1Z5Wm1GalpTZ3BPMXh1SUNCOVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVUd4aGVVTnZiblJ5YjJ3N0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZShcIi4uL3V0aWxzL3ByaW9yaXR5LXF1ZXVlLWhlYXBcIik7XG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xuXG5mdW5jdGlvbiBhcnJheVJlbW92ZShhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZih2YWx1ZSk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgU2NoZWR1bGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTY2hlZHVsZXIpO1xuXG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICB0aGlzLl9fcXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuICAgIHRoaXMuX19lbmdpbmVzID0gW107XG5cbiAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX19uZXh0VGltZSA9IEluZmluaXR5O1xuICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHNjaGVkdWxlciAoc2V0VGltZW91dCkgcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kIHx8IDAuMDI1O1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIGxvb2thaGVhZCB0aW1lICg+IHBlcmlvZClcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQgfHwgMC4xO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNjaGVkdWxlciwge1xuICAgIF9fdGljazoge1xuXG4gICAgICAvLyBzZXRUaW1lb3V0IHNjaGVkdWxpbmcgbG9vcFxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX190aWNrKCkge1xuICAgICAgICB2YXIgYXVkaW9Db250ZXh0ID0gdGhpcy5hdWRpb0NvbnRleHQ7XG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19uZXh0VGltZTtcblxuICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG5cbiAgICAgICAgd2hpbGUgKG5leHRUaW1lIDw9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIHRoaXMubG9va2FoZWFkKSB7XG4gICAgICAgICAgdGhpcy5fX2N1cnJlbnRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICAgICAgICB2YXIgZW5naW5lID0gdGhpcy5fX3F1ZXVlLmhlYWQ7XG4gICAgICAgICAgdmFyIHRpbWUgPSBlbmdpbmUuYWR2YW5jZVRpbWUodGhpcy5fX2N1cnJlbnRUaW1lKTtcblxuICAgICAgICAgIGlmICh0aW1lICYmIHRpbWUgPCBJbmZpbml0eSkge1xuICAgICAgICAgICAgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUubW92ZShlbmdpbmUsIE1hdGgubWF4KHRpbWUsIHRoaXMuX19jdXJyZW50VGltZSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5yZW1vdmUoZW5naW5lKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRpbWUgZW5naW5lIGZyb20gc2NoZWR1bGVyIGlmIGFkdmFuY2VUaW1lIHJldHVybnMgbnVsbC91bmRmaW5lZFxuICAgICAgICAgICAgaWYgKCF0aW1lICYmIGVuZ2luZS5tYXN0ZXIgPT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX2N1cnJlbnRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGUobmV4dFRpbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNjaGVkdWxlOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19yZXNjaGVkdWxlKG5leHRUaW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX190aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dFRpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgdGhpcy5fX25leHRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICAgICAgICB2YXIgdGltZU91dERlbGF5ID0gTWF0aC5tYXgobmV4dFRpbWUgLSB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMubG9va2FoZWFkLCB0aGlzLnBlcmlvZCk7XG5cbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuX190aWNrKCk7XG4gICAgICAgICAgfSwgdGltZU91dERlbGF5ICogMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHNjaGVkdWxlciB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgc2NoZWR1bGVyIHRpbWUgaW5jbHVkaW5nIGxvb2thaGVhZFxuICAgICAgICovXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRUaW1lIHx8IHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgdGhpcy5sb29rYWhlYWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGQgYSB0aW1lIGVuZ2luZSBvciBhIHNpbXBsZSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc2NoZWR1bGVyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5naW5lIHRpbWUgZW5naW5lIHRvIGJlIGFkZGVkIHRvIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIHNjaGVkdWxpbmcgdGltZVxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gZ2V0IGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAqIEByZXR1cm4gaGFuZGxlIHRvIHRoZSBzY2hlZHVsZWQgZW5naW5lICh1c2UgZm9yIGNhbGxpbmcgZnVydGhlciBtZXRob2RzKVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZW5naW5lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHRpbWUgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuY3VycmVudFRpbWUgOiBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciBnZXRDdXJyZW50UG9zaXRpb24gPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgaWYgKGVuZ2luZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgLy8gY29uc3RydWN0IG1pbmltYWwgc2NoZWR1bGVkIHRpbWUgZW5naW5lXG4gICAgICAgICAgZW5naW5lID0ge1xuICAgICAgICAgICAgYWR2YW5jZVRpbWU6IGVuZ2luZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFlbmdpbmUuaW1wbGVtZW50c1NjaGVkdWxlZCgpKSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgY2Fubm90IGJlIGFkZGVkIHRvIHNjaGVkdWxlclwiKTtcblxuICAgICAgICAgIGlmIChlbmdpbmUubWFzdGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgICAgICAgIC8vIHJlZ2lzdGVyIGVuZ2luZVxuICAgICAgICAgIHRoaXMuX19lbmdpbmVzLnB1c2goZW5naW5lKTtcblxuICAgICAgICAgIC8vIHNldCBzY2hlZHVsZWQgaW50ZXJmYWNlXG4gICAgICAgICAgZW5naW5lLnNldFNjaGVkdWxlZCh0aGlzLCBmdW5jdGlvbiAodGltZSkge1xuXG4gICAgICAgICAgICB2YXIgbmV4dFRpbWUgPSBfdGhpcy5fX3F1ZXVlLm1vdmUoZW5naW5lLCB0aW1lKTtcbiAgICAgICAgICAgIF90aGlzLl9fcmVzY2hlZHVsZShuZXh0VGltZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIH0sIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzY2hlZHVsZSBlbmdpbmUgb3IgY2FsbGJhY2tcbiAgICAgICAgdmFyIG5leHRUaW1lID0gdGhpcy5fX3F1ZXVlLmluc2VydChlbmdpbmUsIHRpbWUpO1xuICAgICAgICB0aGlzLl9fcmVzY2hlZHVsZShuZXh0VGltZSk7XG5cbiAgICAgICAgcmV0dXJuIGVuZ2luZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIHRpbWUgZW5naW5lIGZyb20gdGhlIHNjaGVkdWxlclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayB0byBiZSByZW1vdmVkIGZyb20gdGhlIHNjaGVkdWxlclxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoZW5naW5lKSB7XG4gICAgICAgIHZhciBtYXN0ZXIgPSBlbmdpbmUubWFzdGVyO1xuXG4gICAgICAgIGlmIChtYXN0ZXIpIHtcblxuICAgICAgICAgIGlmIChtYXN0ZXIgIT09IHRoaXMpIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBzY2hlZHVsZXJcIik7XG5cbiAgICAgICAgICBlbmdpbmUucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICBhcnJheVJlbW92ZSh0aGlzLl9fZW5naW5lcywgZW5naW5lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGUobmV4dFRpbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNjaGVkdWxlIGEgc2NoZWR1bGVkIHRpbWUgZW5naW5lIG9yIGNhbGxiYWNrIGF0IGEgZ2l2ZW4gdGltZVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayB0byBiZSByZXNjaGVkdWxlZFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZSB3aGVuIHRvIHJlc2NoZWR1bGVcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoZW5naW5lLCB0aW1lKSB7XG4gICAgICAgIHZhciBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5tb3ZlKGVuZ2luZSwgdGltZSk7XG4gICAgICAgIHRoaXMuX19yZXNjaGVkdWxlKG5leHRUaW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGFsbCBzY2hkZWR1bGVkIGNhbGxiYWNrcyBhbmQgZW5naW5lcyBmcm9tIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9fdGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3F1ZXVlLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX19lbmdpbmVzLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gU2NoZWR1bGVyO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZXI7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgc2NoZWR1bGVyIHNpbmdsZXRvbiBiYXNlZCBvbiBhdWRpbyB0aW1lICh0aW1lLWVuZ2luZSBtYXN0ZXIpXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3UVVGUFFTeEpRVUZKTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNRMEZCUXp0QlFVTTFSQ3hKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6czdRVUZGYUVRc1UwRkJVeXhYUVVGWExFTkJRVU1zUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTnFReXhOUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVZxUXl4TlFVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFVkJRVVU3UVVGRFpDeFRRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU4yUWl4WFFVRlBMRWxCUVVrc1EwRkJRenRIUVVOaU96dEJRVVZFTEZOQlFVOHNTMEZCU3l4RFFVRkRPME5CUTJRN08wbEJSVXNzVTBGQlV6dEJRVU5HTEZkQlJGQXNVMEZCVXl4RFFVTkVMRmxCUVZrc1JVRkJaMEk3VVVGQlpDeFBRVUZQTEdkRFFVRkhMRVZCUVVVN096QkNRVVJzUXl4VFFVRlRPenRCUVVWWUxGRkJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NXVUZCV1N4RFFVRkRPenRCUVVWcVF5eFJRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1lVRkJZU3hGUVVGRkxFTkJRVU03UVVGRGJrTXNVVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYQkNMRkZCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6RkNMRkZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVVVGQlVTeERRVUZETzBGQlF6TkNMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZET3pzN096czdRVUZOZEVJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJRenM3T3pzN08wRkJUWFJETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zU1VGQlNTeEhRVUZITEVOQlFVTTdSMEZETTBNN08yVkJkRUpITEZOQlFWTTdRVUY1UW1Jc1ZVRkJUVHM3T3p0aFFVRkJMR3RDUVVGSE8wRkJRMUFzV1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVOeVF5eFpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRE96dEJRVVV2UWl4WlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6czdRVUZGZEVJc1pVRkJUeXhSUVVGUkxFbEJRVWtzV1VGQldTeERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRelZFTEdOQlFVa3NRMEZCUXl4aFFVRmhMRWRCUVVjc1VVRkJVU3hEUVVGRE96dEJRVVU1UWl4alFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTXZRaXhqUVVGSkxFbEJRVWtzUjBGQlJ5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6czdRVUZGYkVRc1kwRkJTU3hKUVVGSkxFbEJRVWtzU1VGQlNTeEhRVUZITEZGQlFWRXNSVUZCUlR0QlFVTXpRaXh2UWtGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXp0WFFVTXhSU3hOUVVGTk8wRkJRMHdzYjBKQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXpzN08wRkJSM1pETEdkQ1FVRkpMRU5CUVVNc1NVRkJTU3hKUVVGSkxFMUJRVTBzUTBGQlF5eE5RVUZOTEV0QlFVc3NTVUZCU1N4RlFVRkZPMEZCUTI1RExHOUNRVUZOTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1lVRkRla0k3VjBGRlJqdFRRVU5HT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6RkNMRmxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdUMEZETjBJN08wRkJSVVFzWjBKQlFWazdZVUZCUVN4elFrRkJReXhSUVVGUkxFVkJRVVU3T3p0QlFVTnlRaXhaUVVGSkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVTdRVUZEYkVJc2MwSkJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROMElzWTBGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1UwRkRka0k3TzBGQlJVUXNXVUZCU1N4UlFVRlJMRXRCUVVzc1VVRkJVU3hGUVVGRk8wRkJRM3BDTEdOQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1VVRkJVU3hEUVVGRE96dEJRVVV6UWl4alFVRkpMRmxCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZGTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6czdRVUZGZEVjc1kwRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNXVUZCVFR0QlFVTm9ReXhyUWtGQlN5eE5RVUZOTEVWQlFVVXNRMEZCUXp0WFFVTm1MRVZCUVVVc1dVRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETzFOQlEzcENPMDlCUTBZN08wRkJUVWNzWlVGQlZ6czdPenM3T3p0WFFVRkJMRmxCUVVjN1FVRkRhRUlzWlVGQlR5eEpRVUZKTEVOQlFVTXNZVUZCWVN4SlFVRkpMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNN1QwRkROMFU3TzBGQlUwUXNUMEZCUnpzN096czdPenM3T3p0aFFVRkJMR0ZCUVVNc1RVRkJUU3hGUVVGelJEczdPMWxCUVhCRUxFbEJRVWtzWjBOQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjN1dVRkJSU3hyUWtGQmEwSXNaME5CUVVjc1NVRkJTVHM3UVVGRE5VUXNXVUZCU1N4TlFVRk5MRmxCUVZrc1VVRkJVU3hGUVVGRk96dEJRVVU1UWl4blFrRkJUU3hIUVVGSE8wRkJRMUFzZFVKQlFWY3NSVUZCUlN4TlFVRk5PMWRCUTNCQ0xFTkJRVU03VTBGRFNDeE5RVUZOTzBGQlEwd3NZMEZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXh0UWtGQmJVSXNSVUZCUlN4RlFVTXZRaXhOUVVGTkxFbEJRVWtzUzBGQlN5eERRVUZETEhGRFFVRnhReXhEUVVGRExFTkJRVU03TzBGQlJYcEVMR05CUVVrc1RVRkJUU3hEUVVGRExFMUJRVTBzUlVGRFppeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMREpEUVVFeVF5eERRVUZETEVOQlFVTTdPenRCUVVjdlJDeGpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6czdPMEZCUnpWQ0xHZENRVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hWUVVGRExFbEJRVWtzUlVGQlN6czdRVUZGYkVNc1owSkJRVWtzVVVGQlVTeEhRVUZITEUxQlFVc3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETDBNc2EwSkJRVXNzV1VGQldTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMWRCUXpkQ0xFVkJRVVVzV1VGQlRUdEJRVU5RTEcxQ1FVRlBMRTFCUVVzc1YwRkJWeXhEUVVGRE8xZEJRM3BDTEVWQlFVVXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dFRRVU40UWpzN08wRkJSMFFzV1VGQlNTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJwRUxGbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wRkJSVFZDTEdWQlFVOHNUVUZCVFN4RFFVRkRPMDlCUTJZN08wRkJUVVFzVlVGQlRUczdPenM3T3p0aFFVRkJMR2RDUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5pTEZsQlFVa3NUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUTkNMRmxCUVVrc1RVRkJUU3hGUVVGRk96dEJRVVZXTEdOQlFVa3NUVUZCVFN4TFFVRkxMRWxCUVVrc1JVRkRha0lzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl3MlEwRkJOa01zUTBGQlF5eERRVUZET3p0QlFVVnFSU3huUWtGQlRTeERRVUZETEdOQlFXTXNSVUZCUlN4RFFVRkRPMEZCUTNoQ0xIRkNRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU55UXpzN1FVRkZSQ3haUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU16UXl4WlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzA5QlF6ZENPenRCUVU5RUxGTkJRVXM3T3pzN096czdPMkZCUVVFc1pVRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEyeENMRmxCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU12UXl4WlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzA5QlF6ZENPenRCUVV0RUxGTkJRVXM3T3pzN096dGhRVUZCTEdsQ1FVRkhPMEZCUTA0c1dVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEyeENMSE5DUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xHTkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRPMU5CUTNaQ096dEJRVVZFTEZsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03UVVGRGNrSXNXVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzA5QlF6TkNPenM3TzFOQmFFdEhMRk5CUVZNN096dEJRVzFMWml4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbVpwYkdVaU9pSmxjell2ZFhScGJITXZjSEpwYjNKcGRIa3RjWFZsZFdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lCM2NtbDBkR1Z1SUdsdUlFVkRUVUZ6WTNKcGNIUWdOaUFxTDF4dUx5b3FYRzRnS2lCQVptbHNaVzkyWlhKMmFXVjNJRmRCVmtVZ2MyTm9aV1IxYkdWeUlITnBibWRzWlhSdmJpQmlZWE5sWkNCdmJpQmhkV1JwYnlCMGFXMWxJQ2gwYVcxbExXVnVaMmx1WlNCdFlYTjBaWElwWEc0Z0tpQkFZWFYwYUc5eUlFNXZjbUpsY25RdVUyTm9ibVZzYkVCcGNtTmhiUzVtY2l3Z1ZtbGpkRzl5TGxOaGFYcEFhWEpqWVcwdVpuSXNJRXRoY21sdExrSmhjbXRoZEdsQWFYSmpZVzB1Wm5KY2JpQXFMMXh1SjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1VISnBiM0pwZEhsUmRXVjFaU0E5SUhKbGNYVnBjbVVvWENJdUxpOTFkR2xzY3k5d2NtbHZjbWwwZVMxeGRXVjFaUzFvWldGd1hDSXBPMXh1ZG1GeUlGUnBiV1ZGYm1kcGJtVWdQU0J5WlhGMWFYSmxLRndpTGk0dlkyOXlaUzkwYVcxbExXVnVaMmx1WlZ3aUtUdGNibHh1Wm5WdVkzUnBiMjRnWVhKeVlYbFNaVzF2ZG1Vb1lYSnlZWGtzSUhaaGJIVmxLU0I3WEc0Z0lIWmhjaUJwYm1SbGVDQTlJR0Z5Y21GNUxtbHVaR1Y0VDJZb2RtRnNkV1VwTzF4dVhHNGdJR2xtSUNocGJtUmxlQ0ErUFNBd0tTQjdYRzRnSUNBZ1lYSnlZWGt1YzNCc2FXTmxLR2x1WkdWNExDQXhLVHRjYmlBZ0lDQnlaWFIxY200Z2RISjFaVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJtWVd4elpUdGNibjFjYmx4dVkyeGhjM01nVTJOb1pXUjFiR1Z5SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvWVhWa2FXOURiMjUwWlhoMExDQnZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0IwYUdsekxtRjFaR2x2UTI5dWRHVjRkQ0E5SUdGMVpHbHZRMjl1ZEdWNGREdGNibHh1SUNBZ0lIUm9hWE11WDE5eGRXVjFaU0E5SUc1bGR5QlFjbWx2Y21sMGVWRjFaWFZsS0NrN1hHNGdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpYTWdQU0JiWFR0Y2JseHVJQ0FnSUhSb2FYTXVYMTlqZFhKeVpXNTBWR2x0WlNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZlgyNWxlSFJVYVcxbElEMGdTVzVtYVc1cGRIazdYRzRnSUNBZ2RHaHBjeTVmWDNScGJXVnZkWFFnUFNCdWRXeHNPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nYzJOb1pXUjFiR1Z5SUNoelpYUlVhVzFsYjNWMEtTQndaWEpwYjJSY2JpQWdJQ0FnS2lCQWRIbHdaU0I3VG5WdFltVnlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11Y0dWeWFXOWtJRDBnYjNCMGFXOXVjeTV3WlhKcGIyUWdmSHpDb0RBdU1ESTFPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nYzJOb1pXUjFiR1Z5SUd4dmIydGhhR1ZoWkNCMGFXMWxJQ2crSUhCbGNtbHZaQ2xjYmlBZ0lDQWdLaUJBZEhsd1pTQjdUblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXViRzl2YTJGb1pXRmtJRDBnYjNCMGFXOXVjeTVzYjI5cllXaGxZV1FnZkh6Q29EQXVNVHRjYmlBZ2ZWeHVYRzRnSUM4dklITmxkRlJwYldWdmRYUWdjMk5vWldSMWJHbHVaeUJzYjI5d1hHNGdJRjlmZEdsamF5Z3BJSHRjYmlBZ0lDQjJZWElnWVhWa2FXOURiMjUwWlhoMElEMGdkR2hwY3k1aGRXUnBiME52Ym5SbGVIUTdYRzRnSUNBZ2RtRnlJRzVsZUhSVWFXMWxJRDBnZEdocGN5NWZYMjVsZUhSVWFXMWxPMXh1WEc0Z0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnZDJocGJHVWdLRzVsZUhSVWFXMWxJRHc5SUdGMVpHbHZRMjl1ZEdWNGRDNWpkWEp5Wlc1MFZHbHRaU0FySUhSb2FYTXViRzl2YTJGb1pXRmtLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWZZM1Z5Y21WdWRGUnBiV1VnUFNCdVpYaDBWR2x0WlR0Y2JseHVJQ0FnSUNBZ2RtRnlJR1Z1WjJsdVpTQTlJSFJvYVhNdVgxOXhkV1YxWlM1b1pXRmtPMXh1SUNBZ0lDQWdkbUZ5SUhScGJXVWdQU0JsYm1kcGJtVXVZV1IyWVc1alpWUnBiV1VvZEdocGN5NWZYMk4xY25KbGJuUlVhVzFsS1R0Y2JseHVJQ0FnSUNBZ2FXWWdLSFJwYldVZ0ppWWdkR2x0WlNBOElFbHVabWx1YVhSNUtTQjdYRzRnSUNBZ0lDQWdJRzVsZUhSVWFXMWxJRDBnZEdocGN5NWZYM0YxWlhWbExtMXZkbVVvWlc1bmFXNWxMQ0JOWVhSb0xtMWhlQ2gwYVcxbExDQjBhR2x6TGw5ZlkzVnljbVZ1ZEZScGJXVXBLVHRjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJRzVsZUhSVWFXMWxJRDBnZEdocGN5NWZYM0YxWlhWbExuSmxiVzkyWlNobGJtZHBibVVwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQjBhVzFsSUdWdVoybHVaU0JtY205dElITmphR1ZrZFd4bGNpQnBaaUJoWkhaaGJtTmxWR2x0WlNCeVpYUjFjbTV6SUc1MWJHd3ZkVzVrWm1sdVpXUmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFXMWxJQ1ltSUdWdVoybHVaUzV0WVhOMFpYSWdQVDA5SUhSb2FYTXBJSHRjYmlBZ0lDQWdJQ0FnSUNCbGJtZHBibVV1Y21WelpYUkpiblJsY21aaFkyVW9LVHNnSUNBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVYMTlqZFhKeVpXNTBWR2x0WlNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZlgzSmxjMk5vWldSMWJHVW9ibVY0ZEZScGJXVXBPMXh1SUNCOVhHNWNiaUFnWDE5eVpYTmphR1ZrZFd4bEtHNWxlSFJVYVcxbEtTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVgxOTBhVzFsYjNWMEtTQjdYRzRnSUNBZ0lDQmpiR1ZoY2xScGJXVnZkWFFvZEdocGN5NWZYM1JwYldWdmRYUXBPMXh1SUNBZ0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnVkV3hzTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNodVpYaDBWR2x0WlNBaFBUMGdTVzVtYVc1cGRIa3BJSHRjYmlBZ0lDQWdJSFJvYVhNdVgxOXVaWGgwVkdsdFpTQTlJRzVsZUhSVWFXMWxPMXh1WEc0Z0lDQWdJQ0IyWVhJZ2RHbHRaVTkxZEVSbGJHRjVJRDBnVFdGMGFDNXRZWGdvS0c1bGVIUlVhVzFsSUMwZ2RHaHBjeTVoZFdScGIwTnZiblJsZUhRdVkzVnljbVZ1ZEZScGJXVWdMU0IwYUdsekxteHZiMnRoYUdWaFpDa3NJSFJvYVhNdWNHVnlhVzlrS1R0Y2JseHVJQ0FnSUNBZ2RHaHBjeTVmWDNScGJXVnZkWFFnUFNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDNScFkyc29LVHRjYmlBZ0lDQWdJSDBzSUhScGJXVlBkWFJFWld4aGVTQXFJREV3TURBcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFFnYzJOb1pXUjFiR1Z5SUhScGJXVmNiaUFnSUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlNCamRYSnlaVzUwSUhOamFHVmtkV3hsY2lCMGFXMWxJR2x1WTJ4MVpHbHVaeUJzYjI5cllXaGxZV1JjYmlBZ0lDb3ZYRzRnSUdkbGRDQmpkWEp5Wlc1MFZHbHRaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlgyTjFjbkpsYm5SVWFXMWxJSHg4SUhSb2FYTXVZWFZrYVc5RGIyNTBaWGgwTG1OMWNuSmxiblJVYVcxbElDc2dkR2hwY3k1c2IyOXJZV2hsWVdRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRV1JrSUdFZ2RHbHRaU0JsYm1kcGJtVWdiM0lnWVNCemFXMXdiR1VnWTJGc2JHSmhZMnNnWm5WdVkzUnBiMjRnZEc4Z2RHaGxJSE5qYUdWa2RXeGxjbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ1pXNW5hVzVsSUhScGJXVWdaVzVuYVc1bElIUnZJR0psSUdGa1pHVmtJSFJ2SUhSb1pTQnpZMmhsWkhWc1pYSmNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUhScGJXVWdjMk5vWldSMWJHbHVaeUIwYVcxbFhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUdaMWJtTjBhVzl1SUhSdklHZGxkQ0JqZFhKeVpXNTBJSEJ2YzJsMGFXOXVYRzRnSUNBcUlFQnlaWFIxY200Z2FHRnVaR3hsSUhSdklIUm9aU0J6WTJobFpIVnNaV1FnWlc1bmFXNWxJQ2gxYzJVZ1ptOXlJR05oYkd4cGJtY2dablZ5ZEdobGNpQnRaWFJvYjJSektWeHVJQ0FnS2k5Y2JpQWdZV1JrS0dWdVoybHVaU3dnZEdsdFpTQTlJSFJvYVhNdVkzVnljbVZ1ZEZScGJXVXNJR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaUE5SUc1MWJHd3BJSHRjYmlBZ0lDQnBaaUFvWlc1bmFXNWxJR2x1YzNSaGJtTmxiMllnUm5WdVkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUM4dklHTnZibk4wY25WamRDQnRhVzVwYldGc0lITmphR1ZrZFd4bFpDQjBhVzFsSUdWdVoybHVaVnh1SUNBZ0lDQWdaVzVuYVc1bElEMGdlMXh1SUNBZ0lDQWdJQ0JoWkhaaGJtTmxWR2x0WlRvZ1pXNW5hVzVsWEc0Z0lDQWdJQ0I5TzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnBaaUFvSVdWdVoybHVaUzVwYlhCc1pXMWxiblJ6VTJOb1pXUjFiR1ZrS0NrcFhHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltOWlhbVZqZENCallXNXViM1FnWW1VZ1lXUmtaV1FnZEc4Z2MyTm9aV1IxYkdWeVhDSXBPMXh1WEc0Z0lDQWdJQ0JwWmlBb1pXNW5hVzVsTG0xaGMzUmxjaWxjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYjJKcVpXTjBJR2hoY3lCaGJISmxZV1I1SUdKbFpXNGdZV1JrWldRZ2RHOGdZU0J0WVhOMFpYSmNJaWs3WEc1Y2JpQWdJQ0FnSUM4dklISmxaMmx6ZEdWeUlHVnVaMmx1WlZ4dUlDQWdJQ0FnZEdocGN5NWZYMlZ1WjJsdVpYTXVjSFZ6YUNobGJtZHBibVVwTzF4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnYzJOb1pXUjFiR1ZrSUdsdWRHVnlabUZqWlZ4dUlDQWdJQ0FnWlc1bmFXNWxMbk5sZEZOamFHVmtkV3hsWkNoMGFHbHpMQ0FvZEdsdFpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ2RtRnlJRzVsZUhSVWFXMWxJRDBnZEdocGN5NWZYM0YxWlhWbExtMXZkbVVvWlc1bmFXNWxMQ0IwYVcxbEtUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzSmxjMk5vWldSMWJHVW9ibVY0ZEZScGJXVXBPMXh1SUNBZ0lDQWdmU3dnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amRYSnlaVzUwVkdsdFpUdGNiaUFnSUNBZ0lIMHNJR2RsZEVOMWNuSmxiblJRYjNOcGRHbHZiaWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnYzJOb1pXUjFiR1VnWlc1bmFXNWxJRzl5SUdOaGJHeGlZV05yWEc0Z0lDQWdkbUZ5SUc1bGVIUlVhVzFsSUQwZ2RHaHBjeTVmWDNGMVpYVmxMbWx1YzJWeWRDaGxibWRwYm1Vc0lIUnBiV1VwTzF4dUlDQWdJSFJvYVhNdVgxOXlaWE5qYUdWa2RXeGxLRzVsZUhSVWFXMWxLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQmxibWRwYm1VN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZ0YjNabElHRWdkR2x0WlNCbGJtZHBibVVnWm5KdmJTQjBhR1VnYzJOb1pXUjFiR1Z5WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQmxibWRwYm1VZ2RHbHRaU0JsYm1kcGJtVWdiM0lnWTJGc2JHSmhZMnNnZEc4Z1ltVWdjbVZ0YjNabFpDQm1jbTl0SUhSb1pTQnpZMmhsWkhWc1pYSmNiaUFnSUNvdlhHNGdJSEpsYlc5MlpTaGxibWRwYm1VcElIdGNiaUFnSUNCMllYSWdiV0Z6ZEdWeUlEMGdaVzVuYVc1bExtMWhjM1JsY2p0Y2JseHVJQ0FnSUdsbUlDaHRZWE4wWlhJcElIdGNiaUFnSUNBZ0lGeHVJQ0FnSUNBZ2FXWWdLRzFoYzNSbGNpQWhQVDBnZEdocGN5bGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGd2liMkpxWldOMElHaGhjeUJ1YjNRZ1ltVmxiaUJoWkdSbFpDQjBieUIwYUdseklITmphR1ZrZFd4bGNsd2lLVHRjYmx4dUlDQWdJQ0FnWlc1bmFXNWxMbkpsYzJWMFNXNTBaWEptWVdObEtDazdYRzRnSUNBZ0lDQmhjbkpoZVZKbGJXOTJaU2gwYUdsekxsOWZaVzVuYVc1bGN5d2daVzVuYVc1bEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMllYSWdibVY0ZEZScGJXVWdQU0IwYUdsekxsOWZjWFZsZFdVdWNtVnRiM1psS0dWdVoybHVaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgzSmxjMk5vWldSMWJHVW9ibVY0ZEZScGJXVXBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGMyTm9aV1IxYkdVZ1lTQnpZMmhsWkhWc1pXUWdkR2x0WlNCbGJtZHBibVVnYjNJZ1kyRnNiR0poWTJzZ1lYUWdZU0JuYVhabGJpQjBhVzFsWEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQmxibWRwYm1VZ2RHbHRaU0JsYm1kcGJtVWdiM0lnWTJGc2JHSmhZMnNnZEc4Z1ltVWdjbVZ6WTJobFpIVnNaV1JjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIUnBiV1VnZEdsdFpTQjNhR1Z1SUhSdklISmxjMk5vWldSMWJHVmNiaUFnSUNvdlhHNGdJSEpsYzJWMEtHVnVaMmx1WlN3Z2RHbHRaU2tnZTF4dUlDQWdJSFpoY2lCdVpYaDBWR2x0WlNBOUlIUm9hWE11WDE5eGRXVjFaUzV0YjNabEtHVnVaMmx1WlN3Z2RHbHRaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgzSmxjMk5vWldSMWJHVW9ibVY0ZEZScGJXVXBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGJXOTJaU0JoYkd3Z2MyTm9aR1ZrZFd4bFpDQmpZV3hzWW1GamEzTWdZVzVrSUdWdVoybHVaWE1nWm5KdmJTQjBhR1VnYzJOb1pXUjFiR1Z5WEc0Z0lDQXFMMXh1SUNCamJHVmhjaWdwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDNScGJXVnZkWFFwSUh0Y2JpQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhR2x6TGw5ZmRHbHRaVzkxZENrN1hHNGdJQ0FnSUNCMGFHbHpMbDlmZEdsdFpXOTFkQ0E5SUc1MWJHdzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVmWDNGMVpYVmxMbU5zWldGeUtDazdYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaWE11YkdWdVozUm9JRDBnTUR0Y2JpQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmphR1ZrZFd4bGNqc2lYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgc2ltcGxpZmllZCBzY2hlZHVsZXIgc2luZ2xldG9uIGJhc2VkIG9uIGF1ZGlvIHRpbWUgKHRpbWUtZW5naW5lIG1hc3RlcilcbiAqIEBhdXRob3IgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCBWaWN0b3IuU2FpekBpcmNhbS5mciwgS2FyaW0uQmFya2F0aUBpcmNhbS5mclxuICovXG5cbnZhciBUaW1lRW5naW5lID0gcmVxdWlyZShcIi4uL2NvcmUvdGltZS1lbmdpbmVcIik7XG5cbmZ1bmN0aW9uIGFycmF5UmVtb3ZlKGFycmF5LCB2YWx1ZSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKHZhbHVlKTtcblxuICBpZiAoaW5kZXggPj0gMCkge1xuICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbnZhciBTaW1wbGVTY2hlZHVsZXIgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTaW1wbGVTY2hlZHVsZXIoYXVkaW9Db250ZXh0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNpbXBsZVNjaGVkdWxlcik7XG5cbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcblxuICAgIHRoaXMuX19lbmdpbmVzID0gW107XG5cbiAgICB0aGlzLl9fc2NoZWRFbmdpbmVzID0gW107XG4gICAgdGhpcy5fX3NjaGVkVGltZXMgPSBbXTtcblxuICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIChzZXRUaW1lb3V0KSBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gb3B0aW9ucy5wZXJpb2QgfHwgMC4wMjU7XG5cbiAgICAvKipcbiAgICAgKiBzY2hlZHVsZXIgbG9va2FoZWFkIHRpbWUgKD4gcGVyaW9kKVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sb29rYWhlYWQgPSBvcHRpb25zLmxvb2thaGVhZCB8fCAwLjE7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU2ltcGxlU2NoZWR1bGVyLCB7XG4gICAgX19zY2hlZHVsZUVuZ2luZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKSB7XG4gICAgICAgIHRoaXMuX19zY2hlZEVuZ2luZXMucHVzaChlbmdpbmUpO1xuICAgICAgICB0aGlzLl9fc2NoZWRUaW1lcy5wdXNoKHRpbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNjaGVkdWxlRW5naW5lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19yZXNjaGVkdWxlRW5naW5lKGVuZ2luZSwgdGltZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9fc2NoZWRFbmdpbmVzLmluZGV4T2YoZW5naW5lKTtcblxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIGlmICh0aW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgdGhpcy5fX3NjaGVkVGltZXNbaW5kZXhdID0gdGltZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fX3NjaGVkRW5naW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5fX3NjaGVkVGltZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIF9fdW5zY2hlZHVsZUVuZ2luZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fdW5zY2hlZHVsZUVuZ2luZShlbmdpbmUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fX3NjaGVkRW5naW5lcy5pbmRleE9mKGVuZ2luZSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICB0aGlzLl9fc2NoZWRFbmdpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgdGhpcy5fX3NjaGVkVGltZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNldFRpY2s6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3Jlc2V0VGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICghdGhpcy5fX3RpbWVvdXQpIHRoaXMuX190aWNrKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fX3RpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fX3RpbWVvdXQpO1xuICAgICAgICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgX190aWNrOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX190aWNrKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBhdWRpb0NvbnRleHQgPSB0aGlzLmF1ZGlvQ29udGV4dDtcbiAgICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5fX3NjaGVkRW5naW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZW5naW5lID0gdGhpcy5fX3NjaGVkRW5naW5lc1tpXTtcbiAgICAgICAgICB2YXIgdGltZSA9IHRoaXMuX19zY2hlZFRpbWVzW2ldO1xuXG4gICAgICAgICAgd2hpbGUgKHRpbWUgJiYgdGltZSA8PSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyB0aGlzLmxvb2thaGVhZCkge1xuICAgICAgICAgICAgdGltZSA9IE1hdGgubWF4KHRpbWUsIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICB0aGlzLl9fY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgdGltZSA9IGVuZ2luZS5hZHZhbmNlVGltZSh0aW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGltZSAmJiB0aW1lIDwgSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlZFRpbWVzW2krK10gPSB0aW1lO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9fdW5zY2hlZHVsZUVuZ2luZShlbmdpbmUpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgZW5naW5lIGZyb20gc2NoZWR1bGVyXG4gICAgICAgICAgICBpZiAoIXRpbWUgJiYgYXJyYXlSZW1vdmUodGhpcy5fX2VuZ2luZXMsIGVuZ2luZSkpIGVuZ2luZS5yZXNldEludGVyZmFjZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5fX3NjaGVkRW5naW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9fdGljaygpO1xuICAgICAgICAgIH0sIHRoaXMucGVyaW9kICogMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHNjaGVkdWxlciB0aW1lXG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgc2NoZWR1bGVyIHRpbWUgaW5jbHVkaW5nIGxvb2thaGVhZFxuICAgICAgICovXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRUaW1lIHx8IHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgdGhpcy5sb29rYWhlYWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYWxsYmFjazoge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFkZCBhIGNhbGxiYWNrIHRvIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uKHRpbWUpIHRvIGJlIGNhbGxlZFxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgb2YgZmlyc3QgY2FsbGJhY2sgKGRlZmF1bHQgaXMgbm93KVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBjYWxsYmFjayBwZXJpb2QgKGRlZmF1bHQgaXMgMCBmb3Igb25lLXNob3QpXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHNjaGVkdWxlZCBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjYWxsIHJlbW92ZSBhbmQgcmVzZXRcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2FsbGJhY2soY2FsbGJhY2tGdW5jdGlvbikge1xuICAgICAgICB2YXIgdGltZSA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5jdXJyZW50VGltZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB2YXIgZW5naW5lV3JhcHBlciA9IHtcbiAgICAgICAgICBhZHZhbmNlVGltZTogY2FsbGJhY2tGdW5jdGlvblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19zY2hlZHVsZUVuZ2luZShlbmdpbmVXcmFwcGVyLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2V0VGljaygpO1xuXG4gICAgICAgIHJldHVybiBlbmdpbmVXcmFwcGVyO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkIGEgdGltZSBlbmdpbmUgdG8gdGhlIHNjaGVkdWxlclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVuZ2luZSB0aW1lIGVuZ2luZSB0byBiZSBhZGRlZCB0byB0aGUgc2NoZWR1bGVyXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBzY2hlZHVsaW5nIHRpbWVcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGVuZ2luZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciB0aW1lID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB0aGlzLmN1cnJlbnRUaW1lIDogYXJndW1lbnRzWzFdO1xuICAgICAgICB2YXIgZ2V0Q3VycmVudFBvc2l0aW9uID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzJdO1xuXG4gICAgICAgIGlmIChlbmdpbmUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIC8vIGNvbnN0cnVjdCBtaW5pbWFsIHNjaGVkdWxlZCB0aW1lIGVuZ2luZVxuICAgICAgICAgIGVuZ2luZSA9IHtcbiAgICAgICAgICAgIGFkdmFuY2VUaW1lOiBlbmdpbmVcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghZW5naW5lLmltcGxlbWVudHNTY2hlZHVsZWQoKSkgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGNhbm5vdCBiZSBhZGRlZCB0byBzY2hlZHVsZXJcIik7XG5cbiAgICAgICAgICBpZiAoZW5naW5lLm1hc3RlcikgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gYSBtYXN0ZXJcIik7XG5cbiAgICAgICAgICAvLyByZWdpc3RlciBlbmdpbmVcbiAgICAgICAgICB0aGlzLl9fZW5naW5lcy5wdXNoKGVuZ2luZSk7XG5cbiAgICAgICAgICAvLyBzZXQgc2NoZWR1bGVkIGludGVyZmFjZVxuICAgICAgICAgIGVuZ2luZS5zZXRTY2hlZHVsZWQodGhpcywgZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIF90aGlzLl9fcmVzY2hlZHVsZUVuZ2luZShlbmdpbmUsIHRpbWUpO1xuICAgICAgICAgICAgX3RoaXMuX19yZXNldFRpY2soKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuY3VycmVudFRpbWU7XG4gICAgICAgICAgfSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19zY2hlZHVsZUVuZ2luZShlbmdpbmUsIHRpbWUpO1xuICAgICAgICB0aGlzLl9fcmVzZXRUaWNrKCk7XG5cbiAgICAgICAgcmV0dXJuIGVuZ2luZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIHNjaGVkdWxlZCB0aW1lIGVuZ2luZSBvciBjYWxsYmFjayBmcm9tIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbmdpbmUgdGltZSBlbmdpbmUgb3IgY2FsbGJhY2sgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBzY2hlZHVsZXJcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKGVuZ2luZSkge1xuICAgICAgICB2YXIgbWFzdGVyID0gZW5naW5lLm1hc3RlcjtcblxuICAgICAgICBpZiAobWFzdGVyKSB7XG4gICAgICAgICAgaWYgKG1hc3RlciAhPT0gdGhpcykgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHNjaGVkdWxlclwiKTtcblxuICAgICAgICAgIGVuZ2luZS5yZXNldEludGVyZmFjZSgpO1xuICAgICAgICAgIGFycmF5UmVtb3ZlKHRoaXMuX19lbmdpbmVzLCBlbmdpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3Vuc2NoZWR1bGVFbmdpbmUoZW5naW5lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2V0VGljaygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXQ6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNjaGVkdWxlIGEgc2NoZWR1bGVkIHRpbWUgZW5naW5lIG9yIGNhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5naW5lIHRpbWUgZW5naW5lIG9yIGNhbGxiYWNrIHRvIGJlIHJlc2NoZWR1bGVkXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSB0aW1lIHdoZW4gdG8gcmVzY2hlZHVsZVxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldChlbmdpbmUsIHRpbWUpIHtcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKTtcbiAgICAgICAgdGhpcy5fX3Jlc2V0VGljaygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX190aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc2NoZWRFbmdpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX19zY2hlZFRpbWVzLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gU2ltcGxlU2NoZWR1bGVyO1xufSkoKTtcblxuLy8gZXhwb3J0IHNjaGVkdWxlciBzaW5nbGV0b25cbm1vZHVsZS5leHBvcnRzID0gU2ltcGxlU2NoZWR1bGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZOUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenM3UVVGRmFFUXNVMEZCVXl4WFFVRlhMRU5CUVVNc1MwRkJTeXhGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU5xUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVWcVF5eE5RVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRVZCUVVVN1FVRkRaQ3hUUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOMlFpeFhRVUZQTEVsQlFVa3NRMEZCUXp0SFFVTmlPenRCUVVWRUxGTkJRVThzUzBGQlN5eERRVUZETzBOQlEyUTdPMGxCUlVzc1pVRkJaVHRCUVVOU0xGZEJSRkFzWlVGQlpTeERRVU5RTEZsQlFWa3NSVUZCWjBJN1VVRkJaQ3hQUVVGUExHZERRVUZITEVWQlFVVTdPekJDUVVSc1F5eGxRVUZsT3p0QlFVVnFRaXhSUVVGSkxFTkJRVU1zV1VGQldTeEhRVUZITEZsQlFWa3NRMEZCUXpzN1FVRkZha01zVVVGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSWEJDTEZGQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM3BDTEZGQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1JVRkJSU3hEUVVGRE96dEJRVVYyUWl4UlFVRkpMRU5CUVVNc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU14UWl4UlFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6czdPenM3TzBGQlRYUkNMRkZCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNN096czdPenRCUVUxMFF5eFJRVUZKTEVOQlFVTXNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhUUVVGVExFbEJRVXNzUjBGQlJ5eERRVUZETzBkQlF6VkRPenRsUVhaQ1J5eGxRVUZsTzBGQmVVSnVRaXh2UWtGQlowSTdZVUZCUVN3d1FrRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlF6ZENMRmxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJwRExGbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wOUJRemxDT3p0QlFVVkVMSE5DUVVGclFqdGhRVUZCTERSQ1FVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFVkJRVVU3UVVGREwwSXNXVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wRkJSV2hFTEZsQlFVa3NTMEZCU3l4SlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVOa0xHTkJRVWtzU1VGQlNTeExRVUZMTEZGQlFWRXNSVUZCUlR0QlFVTnlRaXhuUWtGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU03VjBGRGFrTXNUVUZCVFR0QlFVTk1MR2RDUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNrTXNaMEpCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRYUVVOd1F6dFRRVU5HTzA5QlEwWTdPMEZCUlVRc2MwSkJRV3RDTzJGQlFVRXNORUpCUVVNc1RVRkJUU3hGUVVGRk8wRkJRM3BDTEZsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPenRCUVVWb1JDeFpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRVZCUVVVN1FVRkRaQ3hqUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNrTXNZMEZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMU5CUTNCRE8wOUJRMFk3TzBGQlJVUXNaVUZCVnp0aFFVRkJMSFZDUVVGSE8wRkJRMW9zV1VGQlNTeEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRGJFTXNZMEZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRMnBDTEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRUUVVOcVFpeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVONlFpeHpRa0ZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4alFVRkpMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6dFRRVU4yUWp0UFFVTkdPenRCUVVWRUxGVkJRVTA3WVVGQlFTeHJRa0ZCUnpzN08wRkJRMUFzV1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVOeVF5eFpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSVllzWlVGQlR5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGNrTXNZMEZCU1N4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTndReXhqUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZvUXl4cFFrRkJUeXhKUVVGSkxFbEJRVWtzU1VGQlNTeEpRVUZKTEZsQlFWa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJUdEJRVU5vUlN4blFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU5vUkN4blFrRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZETVVJc1owSkJRVWtzUjBGQlJ5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xZEJRMnBET3p0QlFVVkVMR05CUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWtzUjBGQlJ5eFJRVUZSTEVWQlFVVTdRVUZETTBJc1owSkJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU03VjBGREwwSXNUVUZCVFR0QlFVTk1MR2RDUVVGSkxFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03T3p0QlFVZG9ReXhuUWtGQlNTeERRVUZETEVsQlFVa3NTVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeE5RVUZOTEVOQlFVTXNSVUZET1VNc1RVRkJUU3hEUVVGRExHTkJRV01zUlVGQlJTeERRVUZETzFkQlF6TkNPMU5CUTBZN08wRkJSVVFzV1VGQlNTeERRVUZETEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRNVUlzV1VGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNN08wRkJSWFJDTEZsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEyeERMR05CUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlZTeERRVUZETEZsQlFVMDdRVUZEYUVNc2EwSkJRVXNzVFVGQlRTeEZRVUZGTEVOQlFVTTdWMEZEWml4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTTdVMEZEZUVJN1QwRkRSanM3UVVGTlJ5eGxRVUZYT3pzN096czdPMWRCUVVFc1dVRkJSenRCUVVOb1FpeGxRVUZQTEVsQlFVa3NRMEZCUXl4aFFVRmhMRWxCUVVrc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJRenRQUVVNM1JUczdRVUZUUkN4WlFVRlJPenM3T3pzN096czdPMkZCUVVFc2EwSkJRVU1zWjBKQlFXZENMRVZCUVRKQ08xbEJRWHBDTEVsQlFVa3NaME5CUVVjc1NVRkJTU3hEUVVGRExGZEJRVmM3TzBGQlEyaEVMRmxCUVVrc1lVRkJZU3hIUVVGSE8wRkJRMnhDTEhGQ1FVRlhMRVZCUVVVc1owSkJRV2RDTzFOQlF6bENMRU5CUVVNN08wRkJSVVlzV1VGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExHRkJRV0VzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXpReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdPMEZCUlc1Q0xHVkJRVThzWVVGQllTeERRVUZETzA5QlEzUkNPenRCUVU5RUxFOUJRVWM3T3pzN096czdPMkZCUVVFc1lVRkJReXhOUVVGTkxFVkJRWE5FT3pzN1dVRkJjRVFzU1VGQlNTeG5RMEZCUnl4SlFVRkpMRU5CUVVNc1YwRkJWenRaUVVGRkxHdENRVUZyUWl4blEwRkJSeXhKUVVGSk96dEJRVU0xUkN4WlFVRkpMRTFCUVUwc1dVRkJXU3hSUVVGUkxFVkJRVVU3TzBGQlJUbENMR2RDUVVGTkxFZEJRVWM3UVVGRFVDeDFRa0ZCVnl4RlFVRkZMRTFCUVUwN1YwRkRjRUlzUTBGQlF6dFRRVU5JTEUxQlFVMDdRVUZEVEN4alFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRVZCUXk5Q0xFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNjVU5CUVhGRExFTkJRVU1zUTBGQlF6czdRVUZGZWtRc1kwRkJTU3hOUVVGTkxFTkJRVU1zVFVGQlRTeEZRVU5tTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc01rTkJRVEpETEVOQlFVTXNRMEZCUXpzN08wRkJSeTlFTEdOQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZET3pzN1FVRkhOVUlzWjBKQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGVkJRVU1zU1VGQlNTeEZRVUZMTzBGQlEyeERMR3RDUVVGTExHdENRVUZyUWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU4wUXl4clFrRkJTeXhYUVVGWExFVkJRVVVzUTBGQlF6dFhRVU53UWl4RlFVRkZMRmxCUVUwN1FVRkRVQ3h0UWtGQlR5eE5RVUZMTEZkQlFWY3NRMEZCUXp0WFFVTjZRaXhGUVVGRkxHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1UwRkRlRUk3TzBGQlJVUXNXVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOd1F5eFpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN08wRkJSVzVDTEdWQlFVOHNUVUZCVFN4RFFVRkRPMDlCUTJZN08wRkJUVVFzVlVGQlRUczdPenM3T3p0aFFVRkJMR2RDUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5pTEZsQlFVa3NUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUTkNMRmxCUVVrc1RVRkJUU3hGUVVGRk8wRkJRMVlzWTBGQlNTeE5RVUZOTEV0QlFVc3NTVUZCU1N4RlFVTnFRaXhOUVVGTkxFbEJRVWtzUzBGQlN5eERRVUZETERaRFFVRTJReXhEUVVGRExFTkJRVU03TzBGQlJXcEZMR2RDUVVGTkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZEZUVJc2NVSkJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8xTkJRM0pET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOb1F5eFpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1QwRkRjRUk3TzBGQlQwUXNVMEZCU3pzN096czdPenM3WVVGQlFTeGxRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRiRUlzV1VGQlNTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTjBReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdUMEZEY0VJN08wRkJSVVFzVTBGQlN6dGhRVUZCTEdsQ1FVRkhPMEZCUTA0c1dVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEyeENMSE5DUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xHTkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRPMU5CUTNaQ096dEJRVVZFTEZsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU12UWl4WlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdUMEZET1VJN096czdVMEZ3VFVjc1pVRkJaVHM3T3p0QlFYZE5ja0lzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4bFFVRmxMRU5CUVVNaUxDSm1hV3hsSWpvaVpYTTJMM1YwYVd4ekwzQnlhVzl5YVhSNUxYRjFaWFZsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9nZDNKcGRIUmxiaUJwYmlCRlEwMUJjMk55YVhCMElEWWdLaTljYmk4cUtseHVJQ29nUUdacGJHVnZkbVZ5ZG1sbGR5QlhRVlpGSUhOcGJYQnNhV1pwWldRZ2MyTm9aV1IxYkdWeUlITnBibWRzWlhSdmJpQmlZWE5sWkNCdmJpQmhkV1JwYnlCMGFXMWxJQ2gwYVcxbExXVnVaMmx1WlNCdFlYTjBaWElwWEc0Z0tpQkFZWFYwYUc5eUlFNXZjbUpsY25RdVUyTm9ibVZzYkVCcGNtTmhiUzVtY2l3Z1ZtbGpkRzl5TGxOaGFYcEFhWEpqWVcwdVpuSXNJRXRoY21sdExrSmhjbXRoZEdsQWFYSmpZVzB1Wm5KY2JpQXFMMXh1WEc1MllYSWdWR2x0WlVWdVoybHVaU0E5SUhKbGNYVnBjbVVvWENJdUxpOWpiM0psTDNScGJXVXRaVzVuYVc1bFhDSXBPMXh1WEc1bWRXNWpkR2x2YmlCaGNuSmhlVkpsYlc5MlpTaGhjbkpoZVN3Z2RtRnNkV1VwSUh0Y2JpQWdkbUZ5SUdsdVpHVjRJRDBnWVhKeVlYa3VhVzVrWlhoUFppaDJZV3gxWlNrN1hHNWNiaUFnYVdZZ0tHbHVaR1Y0SUQ0OUlEQXBJSHRjYmlBZ0lDQmhjbkpoZVM1emNHeHBZMlVvYVc1a1pYZ3NJREVwTzF4dUlDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdaaGJITmxPMXh1ZlZ4dVhHNWpiR0Z6Y3lCVGFXMXdiR1ZUWTJobFpIVnNaWElnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWhoZFdScGIwTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJSFJvYVhNdVlYVmthVzlEYjI1MFpYaDBJRDBnWVhWa2FXOURiMjUwWlhoME8xeHVYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaWE1nUFNCYlhUdGNibHh1SUNBZ0lIUm9hWE11WDE5elkyaGxaRVZ1WjJsdVpYTWdQU0JiWFR0Y2JpQWdJQ0IwYUdsekxsOWZjMk5vWldSVWFXMWxjeUE5SUZ0ZE8xeHVYRzRnSUNBZ2RHaHBjeTVmWDJOMWNuSmxiblJVYVcxbElEMGdiblZzYkR0Y2JpQWdJQ0IwYUdsekxsOWZkR2x0Wlc5MWRDQTlJRzUxYkd3N1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQnpZMmhsWkhWc1pYSWdLSE5sZEZScGJXVnZkWFFwSUhCbGNtbHZaRnh1SUNBZ0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXdaWEpwYjJRZ1BTQnZjSFJwYjI1ekxuQmxjbWx2WkNCOGZDQXdMakF5TlR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlITmphR1ZrZFd4bGNpQnNiMjlyWVdobFlXUWdkR2x0WlNBb1BpQndaWEpwYjJRcFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTA1MWJXSmxjbjFjYmlBZ0lDQWdLaTljYmlBZ0lDQjBhR2x6TG14dmIydGhhR1ZoWkNBOUlHOXdkR2x2Ym5NdWJHOXZhMkZvWldGa0lIeDhJQ0F3TGpFN1hHNGdJSDFjYmx4dUlDQmZYM05qYUdWa2RXeGxSVzVuYVc1bEtHVnVaMmx1WlN3Z2RHbHRaU2tnZTF4dUlDQWdJSFJvYVhNdVgxOXpZMmhsWkVWdVoybHVaWE11Y0hWemFDaGxibWRwYm1VcE8xeHVJQ0FnSUhSb2FYTXVYMTl6WTJobFpGUnBiV1Z6TG5CMWMyZ29kR2x0WlNrN1hHNGdJSDFjYmx4dUlDQmZYM0psYzJOb1pXUjFiR1ZGYm1kcGJtVW9aVzVuYVc1bExDQjBhVzFsS1NCN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ2RHaHBjeTVmWDNOamFHVmtSVzVuYVc1bGN5NXBibVJsZUU5bUtHVnVaMmx1WlNrN1hHNWNiaUFnSUNCcFppQW9hVzVrWlhnZ1BqMGdNQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUnBiV1VnSVQwOUlFbHVabWx1YVhSNUtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXpZMmhsWkZScGJXVnpXMmx1WkdWNFhTQTlJSFJwYldVN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmYzJOb1pXUkZibWRwYm1WekxuTndiR2xqWlNocGJtUmxlQ3dnTVNrN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5elkyaGxaRlJwYldWekxuTndiR2xqWlNocGJtUmxlQ3dnTVNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1gxOTFibk5qYUdWa2RXeGxSVzVuYVc1bEtHVnVaMmx1WlNrZ2UxeHVJQ0FnSUhaaGNpQnBibVJsZUNBOUlIUm9hWE11WDE5elkyaGxaRVZ1WjJsdVpYTXVhVzVrWlhoUFppaGxibWRwYm1VcE8xeHVYRzRnSUNBZ2FXWWdLR2x1WkdWNElENDlJREFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMTl6WTJobFpFVnVaMmx1WlhNdWMzQnNhV05sS0dsdVpHVjRMQ0F4S1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMTl6WTJobFpGUnBiV1Z6TG5Od2JHbGpaU2hwYm1SbGVDd2dNU2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnWDE5eVpYTmxkRlJwWTJzb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVgxOXpZMmhsWkVWdVoybHVaWE11YkdWdVozUm9JRDRnTUNrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxsOWZkR2x0Wlc5MWRDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzUnBZMnNvS1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0hSb2FYTXVYMTkwYVcxbGIzVjBLU0I3WEc0Z0lDQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHaHBjeTVmWDNScGJXVnZkWFFwTzF4dUlDQWdJQ0FnZEdocGN5NWZYM1JwYldWdmRYUWdQU0J1ZFd4c08xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lGOWZkR2xqYXlncElIdGNiaUFnSUNCMllYSWdZWFZrYVc5RGIyNTBaWGgwSUQwZ2RHaHBjeTVoZFdScGIwTnZiblJsZUhRN1hHNGdJQ0FnZG1GeUlHa2dQU0F3TzF4dVhHNGdJQ0FnZDJocGJHVWdLR2tnUENCMGFHbHpMbDlmYzJOb1pXUkZibWRwYm1WekxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJR1Z1WjJsdVpTQTlJSFJvYVhNdVgxOXpZMmhsWkVWdVoybHVaWE5iYVYwN1hHNGdJQ0FnSUNCMllYSWdkR2x0WlNBOUlIUm9hWE11WDE5elkyaGxaRlJwYldWelcybGRPMXh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9kR2x0WlNBbUppQjBhVzFsSUR3OUlHRjFaR2x2UTI5dWRHVjRkQzVqZFhKeVpXNTBWR2x0WlNBcklIUm9hWE11Ykc5dmEyRm9aV0ZrS1NCN1hHNGdJQ0FnSUNBZ0lIUnBiV1VnUFNCTllYUm9MbTFoZUNoMGFXMWxMQ0JoZFdScGIwTnZiblJsZUhRdVkzVnljbVZ1ZEZScGJXVXBPMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOWZZM1Z5Y21WdWRGUnBiV1VnUFNCMGFXMWxPMXh1SUNBZ0lDQWdJQ0IwYVcxbElEMGdaVzVuYVc1bExtRmtkbUZ1WTJWVWFXMWxLSFJwYldVcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdsdFpTQW1KaUIwYVcxbElEd2dTVzVtYVc1cGRIa3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYM05qYUdWa1ZHbHRaWE5iYVNzclhTQTlJSFJwYldVN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmZFc1elkyaGxaSFZzWlVWdVoybHVaU2hsYm1kcGJtVXBPMXh1WEc0Z0lDQWdJQ0FnSUM4dklISmxiVzkyWlNCbGJtZHBibVVnWm5KdmJTQnpZMmhsWkhWc1pYSmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFXMWxJQ1ltSUdGeWNtRjVVbVZ0YjNabEtIUm9hWE11WDE5bGJtZHBibVZ6TENCbGJtZHBibVVwS1Z4dUlDQWdJQ0FnSUNBZ0lHVnVaMmx1WlM1eVpYTmxkRWx1ZEdWeVptRmpaU2dwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVgxOWpkWEp5Wlc1MFZHbHRaU0E5SUc1MWJHdzdYRzRnSUNBZ2RHaHBjeTVmWDNScGJXVnZkWFFnUFNCdWRXeHNPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMTl6WTJobFpFVnVaMmx1WlhNdWJHVnVaM1JvSUQ0Z01Da2dlMXh1SUNBZ0lDQWdkR2hwY3k1ZlgzUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzUnBZMnNvS1R0Y2JpQWdJQ0FnSUgwc0lIUm9hWE11Y0dWeWFXOWtJQ29nTVRBd01DazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCelkyaGxaSFZzWlhJZ2RHbHRaVnh1SUNBZ0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlHTjFjbkpsYm5RZ2MyTm9aV1IxYkdWeUlIUnBiV1VnYVc1amJIVmthVzVuSUd4dmIydGhhR1ZoWkZ4dUlDQWdLaTljYmlBZ1oyVjBJR04xY25KbGJuUlVhVzFsS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZZM1Z5Y21WdWRGUnBiV1VnZkh3Z2RHaHBjeTVoZFdScGIwTnZiblJsZUhRdVkzVnljbVZ1ZEZScGJXVWdLeUIwYUdsekxteHZiMnRoYUdWaFpEdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJCWkdRZ1lTQmpZV3hzWW1GamF5QjBieUIwYUdVZ2MyTm9aV1IxYkdWeVhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUdOaGJHeGlZV05ySUdaMWJtTjBhVzl1S0hScGJXVXBJSFJ2SUdKbElHTmhiR3hsWkZ4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdkR2x0WlNCdlppQm1hWEp6ZENCallXeHNZbUZqYXlBb1pHVm1ZWFZzZENCcGN5QnViM2NwWEc0Z0lDQXFJRUJ3WVhKaGJTQjdUblZ0WW1WeWZTQndaWEpwYjJRZ1kyRnNiR0poWTJzZ2NHVnlhVzlrSUNoa1pXWmhkV3gwSUdseklEQWdabTl5SUc5dVpTMXphRzkwS1Z4dUlDQWdLaUJBY21WMGRYSnVJSHRQWW1wbFkzUjlJSE5qYUdWa2RXeGxaQ0J2WW1wbFkzUWdkR2hoZENCallXNGdZbVVnZFhObFpDQjBieUJqWVd4c0lISmxiVzkyWlNCaGJtUWdjbVZ6WlhSY2JpQWdJQ292WEc0Z0lHTmhiR3hpWVdOcktHTmhiR3hpWVdOclJuVnVZM1JwYjI0c0lIUnBiV1VnUFNCMGFHbHpMbU4xY25KbGJuUlVhVzFsS1NCN1hHNGdJQ0FnZG1GeUlHVnVaMmx1WlZkeVlYQndaWElnUFNCN1hHNGdJQ0FnSUNCaFpIWmhibU5sVkdsdFpUb2dZMkZzYkdKaFkydEdkVzVqZEdsdmJseHVJQ0FnSUgwN1hHNWNiaUFnSUNCMGFHbHpMbDlmYzJOb1pXUjFiR1ZGYm1kcGJtVW9aVzVuYVc1bFYzSmhjSEJsY2l3Z2RHbHRaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgzSmxjMlYwVkdsamF5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlHVnVaMmx1WlZkeVlYQndaWEk3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FXUmtJR0VnZEdsdFpTQmxibWRwYm1VZ2RHOGdkR2hsSUhOamFHVmtkV3hsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdaVzVuYVc1bElIUnBiV1VnWlc1bmFXNWxJSFJ2SUdKbElHRmtaR1ZrSUhSdklIUm9aU0J6WTJobFpIVnNaWEpjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlIUnBiV1VnYzJOb1pXUjFiR2x1WnlCMGFXMWxYRzRnSUNBcUwxeHVJQ0JoWkdRb1pXNW5hVzVsTENCMGFXMWxJRDBnZEdocGN5NWpkWEp5Wlc1MFZHbHRaU3dnWjJWMFEzVnljbVZ1ZEZCdmMybDBhVzl1SUQwZ2JuVnNiQ2tnZTF4dUlDQWdJR2xtSUNobGJtZHBibVVnYVc1emRHRnVZMlZ2WmlCR2RXNWpkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0x5OGdZMjl1YzNSeWRXTjBJRzFwYm1sdFlXd2djMk5vWldSMWJHVmtJSFJwYldVZ1pXNW5hVzVsWEc0Z0lDQWdJQ0JsYm1kcGJtVWdQU0I3WEc0Z0lDQWdJQ0FnSUdGa2RtRnVZMlZVYVcxbE9pQmxibWRwYm1WY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJR2xtSUNnaFpXNW5hVzVsTG1sdGNHeGxiV1Z1ZEhOVFkyaGxaSFZzWldRb0tTbGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGd2liMkpxWldOMElHTmhibTV2ZENCaVpTQmhaR1JsWkNCMGJ5QnpZMmhsWkhWc1pYSmNJaWs3WEc1Y2JpQWdJQ0FnSUdsbUlDaGxibWRwYm1VdWJXRnpkR1Z5S1Z4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdlltcGxZM1FnYUdGeklHRnNjbVZoWkhrZ1ltVmxiaUJoWkdSbFpDQjBieUJoSUcxaGMzUmxjbHdpS1R0Y2JseHVJQ0FnSUNBZ0x5OGdjbVZuYVhOMFpYSWdaVzVuYVc1bFhHNGdJQ0FnSUNCMGFHbHpMbDlmWlc1bmFXNWxjeTV3ZFhOb0tHVnVaMmx1WlNrN1hHNWNiaUFnSUNBZ0lDOHZJSE5sZENCelkyaGxaSFZzWldRZ2FXNTBaWEptWVdObFhHNGdJQ0FnSUNCbGJtZHBibVV1YzJWMFUyTm9aV1IxYkdWa0tIUm9hWE1zSUNoMGFXMWxLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDE5eVpYTmphR1ZrZFd4bFJXNW5hVzVsS0dWdVoybHVaU3dnZEdsdFpTazdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXlaWE5sZEZScFkyc29LVHRjYmlBZ0lDQWdJSDBzSUNncElEMCtJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVkzVnljbVZ1ZEZScGJXVTdYRzRnSUNBZ0lDQjlMQ0JuWlhSRGRYSnlaVzUwVUc5emFYUnBiMjRwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVgxOXpZMmhsWkhWc1pVVnVaMmx1WlNobGJtZHBibVVzSUhScGJXVXBPMXh1SUNBZ0lIUm9hWE11WDE5eVpYTmxkRlJwWTJzb0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlCbGJtZHBibVU3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1VtVnRiM1psSUdFZ2MyTm9aV1IxYkdWa0lIUnBiV1VnWlc1bmFXNWxJRzl5SUdOaGJHeGlZV05ySUdaeWIyMGdkR2hsSUhOamFHVmtkV3hsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdaVzVuYVc1bElIUnBiV1VnWlc1bmFXNWxJRzl5SUdOaGJHeGlZV05ySUhSdklHSmxJSEpsYlc5MlpXUWdabkp2YlNCMGFHVWdjMk5vWldSMWJHVnlYRzRnSUNBcUwxeHVJQ0J5WlcxdmRtVW9aVzVuYVc1bEtTQjdYRzRnSUNBZ2RtRnlJRzFoYzNSbGNpQTlJR1Z1WjJsdVpTNXRZWE4wWlhJN1hHNWNiaUFnSUNCcFppQW9iV0Z6ZEdWeUtTQjdYRzRnSUNBZ0lDQnBaaUFvYldGemRHVnlJQ0U5UFNCMGFHbHpLVnh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9YQ0p2WW1wbFkzUWdhR0Z6SUc1dmRDQmlaV1Z1SUdGa1pHVmtJSFJ2SUhSb2FYTWdjMk5vWldSMWJHVnlYQ0lwTzF4dVhHNGdJQ0FnSUNCbGJtZHBibVV1Y21WelpYUkpiblJsY21aaFkyVW9LVHRjYmlBZ0lDQWdJR0Z5Y21GNVVtVnRiM1psS0hSb2FYTXVYMTlsYm1kcGJtVnpMQ0JsYm1kcGJtVXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11WDE5MWJuTmphR1ZrZFd4bFJXNW5hVzVsS0dWdVoybHVaU2s3WEc0Z0lDQWdkR2hwY3k1ZlgzSmxjMlYwVkdsamF5Z3BPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGMyTm9aV1IxYkdVZ1lTQnpZMmhsWkhWc1pXUWdkR2x0WlNCbGJtZHBibVVnYjNJZ1kyRnNiR0poWTJ0Y2JpQWdJQ29nUUhCaGNtRnRJSHRQWW1wbFkzUjlJR1Z1WjJsdVpTQjBhVzFsSUdWdVoybHVaU0J2Y2lCallXeHNZbUZqYXlCMGJ5QmlaU0J5WlhOamFHVmtkV3hsWkZ4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdkR2x0WlNCMGFXMWxJSGRvWlc0Z2RHOGdjbVZ6WTJobFpIVnNaVnh1SUNBZ0tpOWNiaUFnY21WelpYUW9aVzVuYVc1bExDQjBhVzFsS1NCN1hHNGdJQ0FnZEdocGN5NWZYM0psYzJOb1pXUjFiR1ZGYm1kcGJtVW9aVzVuYVc1bExDQjBhVzFsS1R0Y2JpQWdJQ0IwYUdsekxsOWZjbVZ6WlhSVWFXTnJLQ2s3WEc0Z0lIMWNibHh1SUNCamJHVmhjaWdwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDNScGJXVnZkWFFwSUh0Y2JpQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhR2x6TGw5ZmRHbHRaVzkxZENrN1hHNGdJQ0FnSUNCMGFHbHpMbDlmZEdsdFpXOTFkQ0E5SUc1MWJHdzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVmWDNOamFHVmtSVzVuYVc1bGN5NXNaVzVuZEdnZ1BTQXdPMXh1SUNBZ0lIUm9hWE11WDE5elkyaGxaRlJwYldWekxteGxibWQwYUNBOUlEQTdYRzRnSUgxY2JuMWNibHh1THk4Z1pYaHdiM0owSUhOamFHVmtkV3hsY2lCemFXNW5iR1YwYjI1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1UybHRjR3hsVTJOb1pXUjFiR1Z5TzF4dUlsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5oZXJpdHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9nZXQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xudmFyIFByaW9yaXR5UXVldWUgPSByZXF1aXJlKFwiLi4vdXRpbHMvcHJpb3JpdHktcXVldWUtaGVhcFwiKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZShcIi4vZmFjdG9yaWVzXCIpO1xuXG52YXIgZ2V0U2NoZWR1bGVyID0gX3JlcXVpcmUuZ2V0U2NoZWR1bGVyO1xuXG5mdW5jdGlvbiByZW1vdmVDb3VwbGUoZmlyc3RBcnJheSwgc2Vjb25kQXJyYXksIGZpcnN0RWxlbWVudCkge1xuICB2YXIgaW5kZXggPSBmaXJzdEFycmF5LmluZGV4T2YoZmlyc3RFbGVtZW50KTtcblxuICBpZiAoaW5kZXggPj0gMCkge1xuICAgIHZhciBzZWNvbmRFbGVtZW50ID0gc2Vjb25kQXJyYXlbaW5kZXhdO1xuXG4gICAgZmlyc3RBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHNlY29uZEFycmF5LnNwbGljZShpbmRleCwgMSk7XG5cbiAgICByZXR1cm4gc2Vjb25kRWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgVHJhbnNwb3J0ZWQgPSAoZnVuY3Rpb24gKF9UaW1lRW5naW5lKSB7XG4gIGZ1bmN0aW9uIFRyYW5zcG9ydGVkKHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0ZWQpO1xuXG4gICAgdGhpcy5fX3RyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgICB0aGlzLl9fZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMuX19zdGFydFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbjtcbiAgICB0aGlzLl9fZW5kUG9zaXRpb24gPSBlbmRQb3NpdGlvbjtcbiAgICB0aGlzLl9fb2Zmc2V0UG9zaXRpb24gPSBvZmZzZXRQb3NpdGlvbjtcbiAgICB0aGlzLl9fc2NhbGVQb3NpdGlvbiA9IDE7XG4gICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IEluZmluaXR5OyAvLyBlbmdpbmUncyBuZXh0IGhhbHQgcG9zaXRpb24gd2hlbiBub3QgcnVubmluZyAoaXMgbnVsbCB3aGVuIGVuZ2luZSBoZXMgYmVlbiBzdGFydGVkKVxuICB9XG5cbiAgX2luaGVyaXRzKFRyYW5zcG9ydGVkLCBfVGltZUVuZ2luZSk7XG5cbiAgX2NyZWF0ZUNsYXNzKFRyYW5zcG9ydGVkLCB7XG4gICAgc2V0Qm91bmRhcmllczoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldEJvdW5kYXJpZXMoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgb2Zmc2V0UG9zaXRpb24gPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHN0YXJ0UG9zaXRpb24gOiBhcmd1bWVudHNbMl07XG4gICAgICAgIHZhciBzY2FsZVBvc2l0aW9uID0gYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzNdO1xuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpcy5fX3N0YXJ0UG9zaXRpb24gPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgIF90aGlzLl9fZW5kUG9zaXRpb24gPSBlbmRQb3NpdGlvbjtcbiAgICAgICAgICBfdGhpcy5fX29mZnNldFBvc2l0aW9uID0gb2Zmc2V0UG9zaXRpb247XG4gICAgICAgICAgX3RoaXMuX19zY2FsZVBvc2l0aW9uID0gc2NhbGVQb3NpdGlvbjtcbiAgICAgICAgICBfdGhpcy5yZXNldE5leHRQb3NpdGlvbigpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3RhcnQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHt9XG4gICAgfSxcbiAgICBzdG9wOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCh0aW1lLCBwb3NpdGlvbikge31cbiAgICB9LFxuICAgIHN5bmNQb3NpdGlvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgIGlmIChwb3NpdGlvbiA8IHRoaXMuX19zdGFydFBvc2l0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9faGFsdFBvc2l0aW9uID09PSBudWxsKSB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl9faGFsdFBvc2l0aW9uID0gdGhpcy5fX2VuZFBvc2l0aW9uO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXJ0UG9zaXRpb247XG4gICAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA8PSB0aGlzLl9fZW5kUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICAgICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IG51bGw7IC8vIGVuZ2luZSBpcyBhY3RpdmVcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19lbmRQb3NpdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHBvc2l0aW9uID49IHRoaXMuX19lbmRQb3NpdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX19oYWx0UG9zaXRpb24gPT09IG51bGwpIHRoaXMuc3RvcCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMuX19oYWx0UG9zaXRpb24gPSB0aGlzLl9fc3RhcnRQb3NpdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19lbmRQb3NpdGlvbjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID4gdGhpcy5fX3N0YXJ0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICAgICAgdGhpcy5fX2hhbHRQb3NpdGlvbiA9IG51bGw7IC8vIGVuZ2luZSBpcyBhY3RpdmVcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19zdGFydFBvc2l0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9faGFsdFBvc2l0aW9uID09PSBudWxsKSB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuX19oYWx0UG9zaXRpb24gPSBJbmZpbml0eTtcblxuICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZHZhbmNlUG9zaXRpb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHZhciBoYWx0UG9zaXRpb24gPSB0aGlzLl9faGFsdFBvc2l0aW9uO1xuXG4gICAgICAgIGlmIChoYWx0UG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0KHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICB0aGlzLl9faGFsdFBvc2l0aW9uID0gbnVsbDtcblxuICAgICAgICAgIHJldHVybiBoYWx0UG9zaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9wIGVuZ2luZVxuICAgICAgICBpZiAodGhpcy5fX2hhbHRQb3NpdGlvbiA9PT0gbnVsbCkgdGhpcy5zdG9wKHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLl9faGFsdFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAoc3BlZWQgPT09IDApIHRoaXMuc3RvcCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXN0cm95OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fX3RyYW5zcG9ydCA9IG51bGw7XG4gICAgICAgIHRoaXMuX19lbmdpbmUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFRyYW5zcG9ydGVkO1xufSkoVGltZUVuZ2luZSk7XG5cbi8vIFRyYW5zcG9ydGVkU2NoZWR1bGVkIGhhcyB0byBzd2l0Y2ggb24gYW5kIG9mZiB0aGUgc2NoZWR1bGVkIGVuZ2luZXNcbi8vIHdoZW4gdGhlIHRyYW5zcG9ydCBoaXRzIHRoZSBlbmdpbmUncyBzdGFydCBhbmQgZW5kIHBvc2l0aW9uXG5cbnZhciBUcmFuc3BvcnRlZFRyYW5zcG9ydGVkID0gKGZ1bmN0aW9uIChfVHJhbnNwb3J0ZWQpIHtcbiAgZnVuY3Rpb24gVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCh0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc3BvcnRlZFRyYW5zcG9ydGVkKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuXG4gICAgZW5naW5lLnNldFRyYW5zcG9ydGVkKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgIC8vIHJlc2V0TmV4dFBvc2l0aW9uXG4gICAgICBpZiAobmV4dEVuZ2luZVBvc2l0aW9uICE9PSBudWxsKSBuZXh0RW5naW5lUG9zaXRpb24gKz0gX3RoaXMuX19vZmZzZXRQb3NpdGlvbjtcblxuICAgICAgX3RoaXMucmVzZXROZXh0UG9zaXRpb24obmV4dEVuZ2luZVBvc2l0aW9uKTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnZXRDdXJyZW50VGltZVxuICAgICAgcmV0dXJuIF90aGlzLl9fdHJhbnNwb3J0LnNjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnZXQgY3VycmVudFBvc2l0aW9uXG4gICAgICByZXR1cm4gX3RoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uIC0gX3RoaXMuX19vZmZzZXRQb3NpdGlvbjtcbiAgICB9KTtcbiAgfVxuXG4gIF9pbmhlcml0cyhUcmFuc3BvcnRlZFRyYW5zcG9ydGVkLCBfVHJhbnNwb3J0ZWQpO1xuXG4gIF9jcmVhdGVDbGFzcyhUcmFuc3BvcnRlZFRyYW5zcG9ydGVkLCB7XG4gICAgc3luY1Bvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAoc3BlZWQgPiAwICYmIHBvc2l0aW9uIDwgdGhpcy5fX2VuZFBvc2l0aW9uKSBwb3NpdGlvbiA9IE1hdGgubWF4KHBvc2l0aW9uLCB0aGlzLl9fc3RhcnRQb3NpdGlvbik7ZWxzZSBpZiAoc3BlZWQgPCAwICYmIHBvc2l0aW9uID49IHRoaXMuX19zdGFydFBvc2l0aW9uKSBwb3NpdGlvbiA9IE1hdGgubWluKHBvc2l0aW9uLCB0aGlzLl9fZW5kUG9zaXRpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fb2Zmc2V0UG9zaXRpb24gKyB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWR2YW5jZVBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX19vZmZzZXRQb3NpdGlvbiArIHRoaXMuX19lbmdpbmUuYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgaWYgKHNwZWVkID4gMCAmJiBwb3NpdGlvbiA8IHRoaXMuX19lbmRQb3NpdGlvbiB8fCBzcGVlZCA8IDAgJiYgcG9zaXRpb24gPj0gdGhpcy5fX3N0YXJ0UG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgICAgIH1yZXR1cm4gSW5maW5pdHk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jU3BlZWQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCkgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlc3Ryb3k6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQucHJvdG90eXBlKSwgXCJkZXN0cm95XCIsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZDtcbn0pKFRyYW5zcG9ydGVkKTtcblxuLy8gVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQgaGFzIHRvIHN0YXJ0IGFuZCBzdG9wIHRoZSBzcGVlZC1jb250cm9sbGVkIGVuZ2luZXNcbi8vIHdoZW4gdGhlIHRyYW5zcG9ydCBoaXRzIHRoZSBlbmdpbmUncyBzdGFydCBhbmQgZW5kIHBvc2l0aW9uXG5cbnZhciBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZCA9IChmdW5jdGlvbiAoX1RyYW5zcG9ydGVkMikge1xuICBmdW5jdGlvbiBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZCh0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZCk7XG5cbiAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgdHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbik7XG5cbiAgICBlbmdpbmUuc2V0U3BlZWRDb250cm9sbGVkKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGdldEN1cnJlbnRUaW1lXG4gICAgICByZXR1cm4gX3RoaXMuX190cmFuc3BvcnQuc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGdldCBjdXJyZW50UG9zaXRpb25cbiAgICAgIHJldHVybiBfdGhpcy5fX3RyYW5zcG9ydC5jdXJyZW50UG9zaXRpb24gLSBfdGhpcy5fX29mZnNldFBvc2l0aW9uO1xuICAgIH0pO1xuICB9XG5cbiAgX2luaGVyaXRzKFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkLCBfVHJhbnNwb3J0ZWQyKTtcblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQsIHtcbiAgICBzdGFydDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3RvcDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AodGltZSwgcG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIDApO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBpZiAodGhpcy5fX2hhbHRQb3NpdGlvbiA9PT0gbnVsbCkgLy8gZW5naW5lIGlzIGFjdGl2ZVxuICAgICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXN0cm95OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGhpcy5fX3RyYW5zcG9ydC5jdXJyZW50VGltZSwgdGhpcy5fX3RyYW5zcG9ydC5jdXJyZW50UG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIDApO1xuICAgICAgICB0aGlzLl9fZW5naW5lLnJlc2V0SW50ZXJmYWNlKCk7XG4gICAgICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkLnByb3RvdHlwZSksIFwiZGVzdHJveVwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkO1xufSkoVHJhbnNwb3J0ZWQpO1xuXG4vLyBUcmFuc3BvcnRlZFNjaGVkdWxlZCBoYXMgdG8gc3dpdGNoIG9uIGFuZCBvZmYgdGhlIHNjaGVkdWxlZCBlbmdpbmVzXG4vLyB3aGVuIHRoZSB0cmFuc3BvcnQgaGl0cyB0aGUgZW5naW5lJ3Mgc3RhcnQgYW5kIGVuZCBwb3NpdGlvblxuXG52YXIgVHJhbnNwb3J0ZWRTY2hlZHVsZWQgPSAoZnVuY3Rpb24gKF9UcmFuc3BvcnRlZDMpIHtcbiAgZnVuY3Rpb24gVHJhbnNwb3J0ZWRTY2hlZHVsZWQodHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNwb3J0ZWRTY2hlZHVsZWQpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoVHJhbnNwb3J0ZWRTY2hlZHVsZWQucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuXG4gICAgdGhpcy5fX3RyYW5zcG9ydC5zY2hlZHVsZXIuYWRkKGVuZ2luZSwgSW5maW5pdHksIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGdldCBjdXJyZW50UG9zaXRpb25cbiAgICAgIHJldHVybiAoX3RoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uIC0gX3RoaXMuX19vZmZzZXRQb3NpdGlvbikgKiBfdGhpcy5fX3NjYWxlUG9zaXRpb247XG4gICAgfSk7XG4gIH1cblxuICBfaW5oZXJpdHMoVHJhbnNwb3J0ZWRTY2hlZHVsZWQsIF9UcmFuc3BvcnRlZDMpO1xuXG4gIF9jcmVhdGVDbGFzcyhUcmFuc3BvcnRlZFNjaGVkdWxlZCwge1xuICAgIHN0YXJ0OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHRoaXMuX19lbmdpbmUucmVzZXROZXh0VGltZSh0aW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0b3A6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKHRpbWUsIHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuX19lbmdpbmUucmVzZXROZXh0VGltZShJbmZpbml0eSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXN0cm95OiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fX3RyYW5zcG9ydC5zY2hlZHVsZXIucmVtb3ZlKHRoaXMuX19lbmdpbmUpO1xuICAgICAgICBfZ2V0KF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc3BvcnRlZFNjaGVkdWxlZC5wcm90b3R5cGUpLCBcImRlc3Ryb3lcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBUcmFuc3BvcnRlZFNjaGVkdWxlZDtcbn0pKFRyYW5zcG9ydGVkKTtcblxudmFyIFRyYW5zcG9ydFNjaGVkdWxlckhvb2sgPSAoZnVuY3Rpb24gKF9UaW1lRW5naW5lMikge1xuICBmdW5jdGlvbiBUcmFuc3BvcnRTY2hlZHVsZXJIb29rKHRyYW5zcG9ydCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc3BvcnRTY2hlZHVsZXJIb29rKTtcblxuICAgIF9nZXQoX2NvcmUuT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zcG9ydFNjaGVkdWxlckhvb2sucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX190cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gIH1cblxuICBfaW5oZXJpdHMoVHJhbnNwb3J0U2NoZWR1bGVySG9vaywgX1RpbWVFbmdpbmUyKTtcblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNwb3J0U2NoZWR1bGVySG9vaywge1xuICAgIGFkdmFuY2VUaW1lOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzY2hlZHVsZWQgaW50ZXJmYWNlKVxuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWR2YW5jZVRpbWUodGltZSkge1xuICAgICAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy5fX3RyYW5zcG9ydDtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdHJhbnNwb3J0Ll9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSk7XG4gICAgICAgIHZhciBuZXh0UG9zaXRpb24gPSB0cmFuc3BvcnQuYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCB0cmFuc3BvcnQuX19zcGVlZCk7XG5cbiAgICAgICAgaWYgKG5leHRQb3NpdGlvbiAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXR1cm4gdHJhbnNwb3J0Ll9fZ2V0VGltZUF0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICAgICAgfXJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBUcmFuc3BvcnRTY2hlZHVsZXJIb29rO1xufSkoVGltZUVuZ2luZSk7XG5cbi8qKlxuICogeHh4XG4gKlxuICpcbiAqL1xuXG52YXIgVHJhbnNwb3J0ID0gKGZ1bmN0aW9uIChfVGltZUVuZ2luZTMpIHtcbiAgZnVuY3Rpb24gVHJhbnNwb3J0KGF1ZGlvQ29udGV4dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc3BvcnQpO1xuXG4gICAgX2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoVHJhbnNwb3J0LnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBhdWRpb0NvbnRleHQpO1xuXG4gICAgLy8gZnV0dXJlIGFzc2lnbm1lbnRcbiAgICAvLyB0aGlzLnNjaGVkdWxlciA9IHdhdmVzLmdldFNjaGVkdWxlcihhdWRpb0NvbnRleHQpO1xuICAgIC8vIHRoaXMuc2NoZWR1bGVyID0gcmVxdWlyZShcInNjaGVkdWxlclwiKTtcbiAgICAvLyB0ZXN0XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBnZXRTY2hlZHVsZXIodGhpcy5hdWRpb0NvbnRleHQpO1xuXG4gICAgdGhpcy5fX2VuZ2luZXMgPSBbXTtcbiAgICB0aGlzLl9fdHJhbnNwb3J0ZWQgPSBbXTtcblxuICAgIHRoaXMuX19zY2hlZHVsZXJIb29rID0gbnVsbDtcbiAgICB0aGlzLl9fdHJhbnNwb3J0UXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuXG4gICAgLy8gc3luY3Jvbml6ZWQgdGltZSwgcG9zaXRpb24sIGFuZCBzcGVlZFxuICAgIHRoaXMuX190aW1lID0gMDtcbiAgICB0aGlzLl9fcG9zaXRpb24gPSAwO1xuICAgIHRoaXMuX19zcGVlZCA9IDA7XG5cbiAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG4gIH1cblxuICBfaW5oZXJpdHMoVHJhbnNwb3J0LCBfVGltZUVuZ2luZTMpO1xuXG4gIF9jcmVhdGVDbGFzcyhUcmFuc3BvcnQsIHtcbiAgICBfX2dldFBvc2l0aW9uQXRUaW1lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fZ2V0VGltZUF0UG9zaXRpb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdGltZSArIChwb3NpdGlvbiAtIHRoaXMuX19wb3NpdGlvbikgLyB0aGlzLl9fc3BlZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX3N5bmNUcmFuc3BvcnRlZFBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIG51bVRyYW5zcG9ydGVkRW5naW5lcyA9IHRoaXMuX190cmFuc3BvcnRlZC5sZW5ndGg7XG5cbiAgICAgICAgaWYgKG51bVRyYW5zcG9ydGVkRW5naW5lcyA+IDApIHtcbiAgICAgICAgICB2YXIgZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb247XG5cbiAgICAgICAgICB0aGlzLl9fdHJhbnNwb3J0UXVldWUuY2xlYXIoKTtcbiAgICAgICAgICB0aGlzLl9fdHJhbnNwb3J0UXVldWUucmV2ZXJzZSA9IHNwZWVkIDwgMDtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVHJhbnNwb3J0ZWRFbmdpbmVzOyBpKyspIHtcbiAgICAgICAgICAgIGVuZ2luZSA9IHRoaXMuX190cmFuc3BvcnRlZFtpXTtcbiAgICAgICAgICAgIG5leHRFbmdpbmVQb3NpdGlvbiA9IGVuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICAgIHRoaXMuX190cmFuc3BvcnRRdWV1ZS5pbnNlcnQoZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9fdHJhbnNwb3J0UXVldWUudGltZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fc3luY1RyYW5zcG9ydGVkU3BlZWQ6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3N5bmNUcmFuc3BvcnRlZFNwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBfY29yZS4kZm9yLmdldEl0ZXJhdG9yKHRoaXMuX190cmFuc3BvcnRlZCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgIHZhciB0cmFuc3BvcnRlZCA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICB0cmFuc3BvcnRlZC5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgICAgICBfaXRlcmF0b3JbXCJyZXR1cm5cIl0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudFRpbWU6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgdGltZVxuICAgICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHRpbWVcbiAgICAgICAqXG4gICAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgdHJhbnNwb3J0IGlzIGFkZGVkIHRvIGEgbWFzdGVyIChpLmUuIHRyYW5zcG9ydCBvciBwbGF5LWNvbnRyb2wpLlxuICAgICAgICovXG5cbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBjdXJyZW50UG9zaXRpb246IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgcG9zaXRpb25cbiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBwbGF5aW5nIHBvc2l0aW9uXG4gICAgICAgKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHRyYW5zcG9ydCBpcyBhZGRlZCB0byBhIG1hc3RlciAoaS5lLiB0cmFuc3BvcnQgb3IgcGxheS1jb250cm9sKS5cbiAgICAgICAqL1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wb3NpdGlvbiArICh0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2V0TmV4dFBvc2l0aW9uOiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzZXQgbmV4dCB0cmFuc3BvcnQgcG9zaXRpb25cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuZXh0IHRyYW5zcG9ydCBwb3NpdGlvblxuICAgICAgICpcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSByZXBsYWNlZCB3aGVuIHRoZSB0cmFuc3BvcnQgaXMgYWRkZWQgdG8gYSBtYXN0ZXIgKGkuZS4gdHJhbnNwb3J0IG9yIHBsYXktY29udHJvbCkuXG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0TmV4dFBvc2l0aW9uKG5leHRQb3NpdGlvbikge1xuICAgICAgICBpZiAodGhpcy5fX3NjaGVkdWxlckhvb2spIHRoaXMuX19zY2hlZHVsZXJIb29rLnJlc2V0TmV4dFRpbWUodGhpcy5fX2dldFRpbWVBdFBvc2l0aW9uKG5leHRQb3NpdGlvbikpO1xuXG4gICAgICAgIHRoaXMuX19uZXh0UG9zaXRpb24gPSBuZXh0UG9zaXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICBzeW5jUG9zaXRpb246IHtcblxuICAgICAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHRyYW5zcG9ydGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdGhpcy5fX3RpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLl9fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5fX3NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWR2YW5jZVBvc2l0aW9uOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kICh0cmFuc3BvcnRlZCBpbnRlcmZhY2UpXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIHZhciBuZXh0RW5naW5lID0gdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLmhlYWQ7XG4gICAgICAgIHZhciBuZXh0RW5naW5lUG9zaXRpb24gPSBuZXh0RW5naW5lLmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgIHRoaXMuX19uZXh0UG9zaXRpb24gPSB0aGlzLl9fdHJhbnNwb3J0UXVldWUubW92ZShuZXh0RW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fbmV4dFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3luY1NwZWVkOiB7XG5cbiAgICAgIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzcGVlZC1jb250cm9sbGVkIGludGVyZmFjZSlcblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgdmFyIHNlZWsgPSBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzNdO1xuXG4gICAgICAgIHZhciBsYXN0U3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICAgICAgdGhpcy5fX3RpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLl9fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5fX3NwZWVkID0gc3BlZWQ7XG5cbiAgICAgICAgaWYgKHNwZWVkICE9PSBsYXN0U3BlZWQgfHwgc2VlayAmJiBzcGVlZCAhPT0gMCkge1xuICAgICAgICAgIHZhciBuZXh0UG9zaXRpb24gPSB0aGlzLl9fbmV4dFBvc2l0aW9uO1xuXG4gICAgICAgICAgLy8gcmVzeW5jIHRyYW5zcG9ydGVkIGVuZ2luZXNcbiAgICAgICAgICBpZiAoc2VlayB8fCBzcGVlZCAqIGxhc3RTcGVlZCA8IDApIHtcbiAgICAgICAgICAgIC8vIHNlZWsgb3IgcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICAgICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNwZWVkID09PSAwKSB7XG4gICAgICAgICAgICAvLyBzdGFydFxuICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX3N5bmNUcmFuc3BvcnRlZFBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICAgIC8vIHNjaGVkdWxlIHRyYW5zcG9ydCBpdHNlbGZcbiAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZXJIb29rID0gbmV3IFRyYW5zcG9ydFNjaGVkdWxlckhvb2sodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5hZGQodGhpcy5fX3NjaGVkdWxlckhvb2ssIEluZmluaXR5KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgICAgICAvLyBzdG9wXG4gICAgICAgICAgICBuZXh0UG9zaXRpb24gPSBJbmZpbml0eTtcblxuICAgICAgICAgICAgdGhpcy5fX3N5bmNUcmFuc3BvcnRlZFNwZWVkKHRpbWUsIHBvc2l0aW9uLCAwKTtcblxuICAgICAgICAgICAgLy8gdW5zY2hlZHVsZSB0cmFuc3BvcnQgaXRzZWxmXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5yZW1vdmUodGhpcy5fX3NjaGVkdWxlckhvb2spO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX19zY2hlZHVsZXJIb29rO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGFuZ2Ugc3BlZWQgd2l0aG91dCByZXZlcnNpbmcgZGlyZWN0aW9uXG4gICAgICAgICAgICB0aGlzLl9fc3luY1RyYW5zcG9ydGVkU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDoge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSB0cmFuc3BvcnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbmdpbmUgZW5naW5lIHRvIGJlIGFkZGVkIHRvIHRoZSB0cmFuc3BvcnRcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiBzdGFydCBwb3NpdGlvblxuICAgICAgICovXG5cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZW5naW5lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHN0YXJ0UG9zaXRpb24gPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IC1JbmZpbml0eSA6IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IGFyZ3VtZW50c1syXTtcbiAgICAgICAgdmFyIG9mZnNldFBvc2l0aW9uID0gYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyBzdGFydFBvc2l0aW9uIDogYXJndW1lbnRzWzNdO1xuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgdHJhbnNwb3J0ZWQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKG9mZnNldFBvc2l0aW9uID09PSAtSW5maW5pdHkpIG9mZnNldFBvc2l0aW9uID0gMDtcblxuICAgICAgICAgIGlmIChlbmdpbmUubWFzdGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgICAgICAgIGlmIChlbmdpbmUuaW1wbGVtZW50c1RyYW5zcG9ydGVkKCkpIHRyYW5zcG9ydGVkID0gbmV3IFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQoX3RoaXMsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKTtlbHNlIGlmIChlbmdpbmUuaW1wbGVtZW50c1NwZWVkQ29udHJvbGxlZCgpKSB0cmFuc3BvcnRlZCA9IG5ldyBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZChfdGhpcywgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO2Vsc2UgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU2NoZWR1bGVkKCkpIHRyYW5zcG9ydGVkID0gbmV3IFRyYW5zcG9ydGVkU2NoZWR1bGVkKF90aGlzLCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbik7ZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgY2Fubm90IGJlIGFkZGVkIHRvIGEgdHJhbnNwb3J0XCIpO1xuXG4gICAgICAgICAgaWYgKHRyYW5zcG9ydGVkKSB7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBfdGhpcy5fX3NwZWVkO1xuXG4gICAgICAgICAgICBfdGhpcy5fX2VuZ2luZXMucHVzaChlbmdpbmUpO1xuICAgICAgICAgICAgX3RoaXMuX190cmFuc3BvcnRlZC5wdXNoKHRyYW5zcG9ydGVkKTtcblxuICAgICAgICAgICAgdHJhbnNwb3J0ZWQuc2V0VHJhbnNwb3J0ZWQoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIG5leHRFbmdpbmVQb3NpdGlvbiA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAvLyByZXNldE5leHRQb3NpdGlvblxuICAgICAgICAgICAgICB2YXIgc3BlZWQgPSBfdGhpcy5fX3NwZWVkO1xuXG4gICAgICAgICAgICAgIGlmIChzcGVlZCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RW5naW5lUG9zaXRpb24gPT09IG51bGwpIG5leHRFbmdpbmVQb3NpdGlvbiA9IHRyYW5zcG9ydGVkLnN5bmNQb3NpdGlvbihfdGhpcy5jdXJyZW50VGltZSwgX3RoaXMuY3VycmVudFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uID0gX3RoaXMuX190cmFuc3BvcnRRdWV1ZS5tb3ZlKHRyYW5zcG9ydGVkLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJlc2V0TmV4dFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gZ2V0Q3VycmVudFRpbWVcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9fdHJhbnNwb3J0LnNjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gZ2V0IGN1cnJlbnRQb3NpdGlvblxuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uIC0gX3RoaXMuX19vZmZzZXRQb3NpdGlvbjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc3BlZWQgIT09IDApIHtcbiAgICAgICAgICAgICAgLy8gc3luYyBhbmQgc3RhcnRcbiAgICAgICAgICAgICAgdmFyIG5leHRFbmdpbmVQb3NpdGlvbiA9IHRyYW5zcG9ydGVkLnN5bmNQb3NpdGlvbihfdGhpcy5jdXJyZW50VGltZSwgX3RoaXMuY3VycmVudFBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgICAgIHZhciBuZXh0UG9zaXRpb24gPSBfdGhpcy5fX3RyYW5zcG9ydFF1ZXVlLmluc2VydCh0cmFuc3BvcnRlZCwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcblxuICAgICAgICAgICAgICBfdGhpcy5yZXNldE5leHRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0cmFuc3BvcnRlZDtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZToge1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIHRpbWUgZW5naW5lIGZyb20gdGhlIHRyYW5zcG9ydFxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVuZ2luZU9yVHJhbnNwb3J0ZWQgZW5naW5lIG9yIHRyYW5zcG9ydGVkIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgdHJhbnNwb3J0XG4gICAgICAgKi9cblxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShlbmdpbmVPclRyYW5zcG9ydGVkKSB7XG4gICAgICAgIHZhciBlbmdpbmUgPSBlbmdpbmVPclRyYW5zcG9ydGVkO1xuICAgICAgICB2YXIgdHJhbnNwb3J0ZWQgPSByZW1vdmVDb3VwbGUodGhpcy5fX2VuZ2luZXMsIHRoaXMuX190cmFuc3BvcnRlZCwgZW5naW5lT3JUcmFuc3BvcnRlZCk7XG5cbiAgICAgICAgaWYgKCF0cmFuc3BvcnRlZCkge1xuICAgICAgICAgIGVuZ2luZSA9IHJlbW92ZUNvdXBsZSh0aGlzLl9fdHJhbnNwb3J0ZWQsIHRoaXMuX19lbmdpbmVzLCBlbmdpbmVPclRyYW5zcG9ydGVkKTtcbiAgICAgICAgICB0cmFuc3BvcnRlZCA9IGVuZ2luZU9yVHJhbnNwb3J0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5naW5lICYmIHRyYW5zcG9ydGVkKSB7XG4gICAgICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IHRoaXMuX190cmFuc3BvcnRRdWV1ZS5yZW1vdmUodHJhbnNwb3J0ZWQpO1xuXG4gICAgICAgICAgdHJhbnNwb3J0ZWQucmVzZXRJbnRlcmZhY2UoKTtcbiAgICAgICAgICB0cmFuc3BvcnRlZC5kZXN0cm95KCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX3NwZWVkICE9PSAwKSB0aGlzLnJlc2V0TmV4dFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHRyYW5zcG9ydFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXI6IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgYWxsIHRpbWUgZW5naW5lcyBmcm9tIHRoZSB0cmFuc3BvcnRcbiAgICAgICAqL1xuXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3luY1NwZWVkKHRoaXMuY3VycmVudFRpbWUsIHRoaXMuY3VycmVudFBvc2l0aW9uLCAwKTtcblxuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBfY29yZS4kZm9yLmdldEl0ZXJhdG9yKHRoaXMuX190cmFuc3BvcnRlZCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgIHZhciB0cmFuc3BvcnRlZCA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICB0cmFuc3BvcnRlZC5yZXNldEludGVyZmFjZSgpO1xuICAgICAgICAgICAgdHJhbnNwb3J0ZWQuZGVzdHJveSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcltcInJldHVyblwiXSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gVHJhbnNwb3J0O1xufSkoVGltZUVuZ2luZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwb3J0O1xuLyogd3JpdHRlbiBpbiBFQ01Bc2NyaXB0IDYgKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIGF1ZGlvIHRyYW5zcG9ydCBjbGFzcyAodGltZS1lbmdpbmUgbWFzdGVyKSwgcHJvdmlkZXMgc3luY2hyb25pemVkIHNjaGVkdWxpbmcgb2YgdGltZSBlbmdpbmVzXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZQUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNRMEZCUXpzN1pVRkRja01zVDBGQlR5eERRVUZETEdGQlFXRXNRMEZCUXpzN1NVRkJka01zV1VGQldTeFpRVUZhTEZsQlFWazdPMEZCUld4Q0xGTkJRVk1zV1VGQldTeERRVUZETEZWQlFWVXNSVUZCUlN4WFFVRlhMRVZCUVVVc1dVRkJXU3hGUVVGRk8wRkJRek5FTEUxQlFVa3NTMEZCU3l4SFFVRkhMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdPMEZCUlRkRExFMUJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTmtMRkZCUVVrc1lVRkJZU3hIUVVGSExGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zWTBGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE5VSXNaVUZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xGZEJRVThzWVVGQllTeERRVUZETzBkQlEzUkNPenRCUVVWRUxGTkJRVThzU1VGQlNTeERRVUZETzBOQlEySTdPMGxCUlVzc1YwRkJWenRCUVVOS0xGZEJSRkFzVjBGQlZ5eERRVU5JTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1lVRkJZU3hGUVVGRkxGZEJRVmNzUlVGQlJTeGpRVUZqTEVWQlFVVTdNRUpCUkhaRkxGZEJRVmM3TzBGQlJXSXNVVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRE4wSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhOUVVGTkxFTkJRVU03UVVGRGRrSXNVVUZCU1N4RFFVRkRMR1ZCUVdVc1IwRkJSeXhoUVVGaExFTkJRVU03UVVGRGNrTXNVVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhYUVVGWExFTkJRVU03UVVGRGFrTXNVVUZCU1N4RFFVRkRMR2RDUVVGblFpeEhRVUZITEdOQlFXTXNRMEZCUXp0QlFVTjJReXhSUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTjZRaXhSUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEZGQlFWRXNRMEZCUXp0SFFVTm9RenM3V1VGVVJ5eFhRVUZYT3p0bFFVRllMRmRCUVZjN1FVRlhaaXhwUWtGQllUdGhRVUZCTEhWQ1FVRkRMR0ZCUVdFc1JVRkJSU3hYUVVGWE96czdXVUZCUlN4alFVRmpMR2REUVVGSExHRkJRV0U3V1VGQlJTeGhRVUZoTEdkRFFVRkhMRU5CUVVNN05FSkJRVVU3UVVGRE0wWXNaMEpCUVVzc1pVRkJaU3hIUVVGSExHRkJRV0VzUTBGQlF6dEJRVU55UXl4blFrRkJTeXhoUVVGaExFZEJRVWNzVjBGQlZ5eERRVUZETzBGQlEycERMR2RDUVVGTExHZENRVUZuUWl4SFFVRkhMR05CUVdNc1EwRkJRenRCUVVOMlF5eG5Ra0ZCU3l4bFFVRmxMRWRCUVVjc1lVRkJZU3hEUVVGRE8wRkJRM0pETEdkQ1FVRkxMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdVMEZETVVJN1QwRkJRVHM3UVVGRlJDeFRRVUZMTzJGQlFVRXNaVUZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEZRVUZGT3p0QlFVTXZRaXhSUVVGSk8yRkJRVUVzWTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRVZCUVVVN08wRkJSWFpDTEdkQ1FVRlpPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTJJc1kwRkJTU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlRzN1FVRkZia01zWjBKQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1MwRkJTeXhKUVVGSkxFVkJRemxDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1owSkJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenM3UVVGRmVrTXNiVUpCUVU4c1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF6dFhRVU0zUWl4TlFVRk5MRWxCUVVrc1VVRkJVU3hKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVTdRVUZEZWtNc1owSkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJURkVMR2RDUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZNMElzYlVKQlFVOHNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRYUVVNelFqdFRRVU5HTEUxQlFVMDdRVUZEVEN4alFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTzBGQlEyeERMR2RDUVVGSkxFbEJRVWtzUTBGQlF5eGpRVUZqTEV0QlFVc3NTVUZCU1N4RlFVTTVRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN08wRkJSWEJFTEdkQ1FVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdPMEZCUlRORExHMUNRVUZQTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNN1YwRkRNMElzVFVGQlRTeEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hGUVVGRk8wRkJRekZETEdkQ1FVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVVeFJDeG5Ra0ZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhKUVVGSkxFTkJRVU03TzBGQlJUTkNMRzFDUVVGUExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdWMEZETjBJN1UwRkRSanM3UVVGRlJDeFpRVUZKTEVsQlFVa3NRMEZCUXl4alFVRmpMRXRCUVVzc1NVRkJTU3hGUVVNNVFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGTlVJc1dVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTTdPMEZCUlM5Q0xHVkJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenRCUVVWRUxHMUNRVUZsTzJGQlFVRXNlVUpCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXpzN1FVRkZka01zV1VGQlNTeFpRVUZaTEV0QlFVc3NTVUZCU1N4RlFVRkZPMEZCUTNwQ0xHTkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJURkVMR05CUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVXpRaXhwUWtGQlR5eFpRVUZaTEVOQlFVTTdVMEZEY2tJN096dEJRVWRFTEZsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1MwRkJTeXhKUVVGSkxFVkJRemxDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1dVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTTdPMEZCUlM5Q0xHVkJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenRCUVVWRUxHRkJRVk03WVVGQlFTeHRRa0ZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU12UWl4WlFVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRMklzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wOUJRM0pFT3p0QlFVVkVMRmRCUVU4N1lVRkJRU3h0UWtGQlJ6dEJRVU5TTEZsQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM2hDTEZsQlFVa3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRM1JDT3pzN08xTkJOVVpITEZkQlFWYzdSMEZCVXl4VlFVRlZPenM3T3p0SlFXbEhPVUlzYzBKQlFYTkNPMEZCUTJZc1YwRkVVQ3h6UWtGQmMwSXNRMEZEWkN4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RlFVRkZPenM3TUVKQlJIWkZMSE5DUVVGelFqczdRVUZGZUVJc2NVTkJSa1VzYzBKQlFYTkNMRFpEUVVWc1FpeFRRVUZUTEVWQlFVVXNUVUZCVFN4RlFVRkZMR0ZCUVdFc1JVRkJSU3hYUVVGWExFVkJRVVVzWTBGQll5eEZRVUZGT3p0QlFVVnlSU3hWUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4WlFVRXJRanRWUVVFNVFpeHJRa0ZCYTBJc1owTkJRVWNzU1VGQlNUczdPMEZCUlhCRUxGVkJRVWtzYTBKQlFXdENMRXRCUVVzc1NVRkJTU3hGUVVNM1FpeHJRa0ZCYTBJc1NVRkJTU3hOUVVGTExHZENRVUZuUWl4RFFVRkRPenRCUVVVNVF5eFpRVUZMTEdsQ1FVRnBRaXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN1MwRkROVU1zUlVGQlJTeFpRVUZOT3p0QlFVVlFMR0ZCUVU4c1RVRkJTeXhYUVVGWExFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXp0TFFVTXZReXhGUVVGRkxGbEJRVTA3TzBGQlJWQXNZVUZCVHl4TlFVRkxMRmRCUVZjc1EwRkJReXhsUVVGbExFZEJRVWNzVFVGQlN5eG5Ra0ZCWjBJc1EwRkJRenRMUVVOcVJTeERRVUZETEVOQlFVTTdSMEZEU2pzN1dVRnFRa2NzYzBKQlFYTkNPenRsUVVGMFFpeHpRa0ZCYzBJN1FVRnRRakZDTEdkQ1FVRlpPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVU0xUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRExFdEJRMnBFTEVsQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1NVRkJTU3hSUVVGUkxFbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZEY0VRc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6czdRVUZGY0VRc1pVRkJUeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRE1VYzdPMEZCUlVRc2JVSkJRV1U3WVVGQlFTeDVRa0ZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU55UXl4blFrRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEdWQlFXVXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6czdRVUZGYUVnc1dVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NVVUZCVVN4SlFVRkpMRWxCUVVrc1EwRkJReXhsUVVGbE8wRkJRemRHTEdsQ1FVRlBMRkZCUVZFc1EwRkJRenRUUVVGQkxFRkJSV3hDTEU5QlFVOHNVVUZCVVN4RFFVRkRPMDlCUTJwQ096dEJRVVZFTEdGQlFWTTdZVUZCUVN4dFFrRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTXZRaXhaUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RlFVTjZRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzA5QlEyeEVPenRCUVVWRUxGZEJRVTg3WVVGQlFTeHRRa0ZCUnp0QlFVTlNMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETDBJc2VVTkJOVU5GTEhOQ1FVRnpRaXg1UTBFMFExSTdUMEZEYWtJN096czdVMEUzUTBjc2MwSkJRWE5DTzBkQlFWTXNWMEZCVnpzN096czdTVUZyUkRGRExEQkNRVUV3UWp0QlFVTnVRaXhYUVVSUUxEQkNRVUV3UWl4RFFVTnNRaXhUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEdGQlFXRXNSVUZCUlN4WFFVRlhMRVZCUVVVc1kwRkJZeXhGUVVGRk96czdNRUpCUkhaRkxEQkNRVUV3UWpzN1FVRkZOVUlzY1VOQlJrVXNNRUpCUVRCQ0xEWkRRVVYwUWl4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RlFVRkZPenRCUVVWeVJTeFZRVUZOTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFVMDdPMEZCUlhCRExHRkJRVThzVFVGQlN5eFhRVUZYTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJRenRMUVVNdlF5eEZRVUZGTEZsQlFVMDdPMEZCUlZBc1lVRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NUVUZCU3l4blFrRkJaMElzUTBGQlF6dExRVU5xUlN4RFFVRkRMRU5CUVVNN1IwRkRTanM3V1VGWVJ5d3dRa0ZCTUVJN08yVkJRVEZDTERCQ1FVRXdRanRCUVdFNVFpeFRRVUZMTzJGQlFVRXNaVUZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUdEJRVU16UWl4WlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU4wUkRzN1FVRkZSQ3hSUVVGSk8yRkJRVUVzWTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUTI1Q0xGbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdUMEZETlVNN08wRkJSVVFzWVVGQlV6dGhRVUZCTEcxQ1FVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlF5OUNMRmxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUzBGQlN5eEpRVUZKTzBGQlF6bENMR05CUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRGJFUTdPMEZCUlVRc1YwRkJUenRoUVVGQkxHMUNRVUZITzBGQlExSXNXVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1SUxGbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkRMMElzZVVOQk4wSkZMREJDUVVFd1FpeDVRMEUyUWxvN1QwRkRha0k3T3pzN1UwRTVRa2NzTUVKQlFUQkNPMGRCUVZNc1YwRkJWenM3T3pzN1NVRnRRemxETEc5Q1FVRnZRanRCUVVOaUxGZEJSRkFzYjBKQlFXOUNMRU5CUTFvc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeGhRVUZoTEVWQlFVVXNWMEZCVnl4RlFVRkZMR05CUVdNc1JVRkJSVHM3T3pCQ1FVUjJSU3h2UWtGQmIwSTdPMEZCUlhSQ0xIRkRRVVpGTEc5Q1FVRnZRaXcyUTBGRmFFSXNVMEZCVXl4RlFVRkZMRTFCUVUwc1JVRkJSU3hoUVVGaExFVkJRVVVzVjBGQlZ5eEZRVUZGTEdOQlFXTXNSVUZCUlRzN1FVRkZja1VzVVVGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUlVGQlJTeFJRVUZSTEVWQlFVVXNXVUZCVFRzN1FVRkZja1FzWVVGQlR5eERRVUZETEUxQlFVc3NWMEZCVnl4RFFVRkRMR1ZCUVdVc1IwRkJSeXhOUVVGTExHZENRVUZuUWl4RFFVRkJMRWRCUVVrc1RVRkJTeXhsUVVGbExFTkJRVU03UzBGRE1VWXNRMEZCUXl4RFFVRkRPMGRCUTBvN08xbEJVa2NzYjBKQlFXOUNPenRsUVVGd1FpeHZRa0ZCYjBJN1FVRlZlRUlzVTBGQlN6dGhRVUZCTEdWQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRE0wSXNXVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdUMEZEYmtNN08wRkJSVVFzVVVGQlNUdGhRVUZCTEdOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOdVFpeFpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dFBRVU4yUXpzN1FVRkZSQ3hYUVVGUE8yRkJRVUVzYlVKQlFVYzdRVUZEVWl4WlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRMnBFTEhsRFFYQkNSU3h2UWtGQmIwSXNlVU5CYjBKT08wOUJRMnBDT3pzN08xTkJja0pITEc5Q1FVRnZRanRIUVVGVExGZEJRVmM3TzBsQmQwSjRReXh6UWtGQmMwSTdRVUZEWml4WFFVUlFMSE5DUVVGelFpeERRVU5rTEZOQlFWTXNSVUZCUlRzd1FrRkVia0lzYzBKQlFYTkNPenRCUVVWNFFpeHhRMEZHUlN4elFrRkJjMElzTmtOQlJXaENPMEZCUTFJc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFRRVUZUTEVOQlFVTTdSMEZET1VJN08xbEJTa2NzYzBKQlFYTkNPenRsUVVGMFFpeHpRa0ZCYzBJN1FVRlBNVUlzWlVGQlZ6czdPenRoUVVGQkxIRkNRVUZETEVsQlFVa3NSVUZCUlR0QlFVTm9RaXhaUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMEZCUTJwRExGbEJRVWtzVVVGQlVTeEhRVUZITEZOQlFWTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnVSQ3haUVVGSkxGbEJRVmtzUjBGQlJ5eFRRVUZUTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRCUVVWb1JpeFpRVUZKTEZsQlFWa3NTMEZCU3l4UlFVRlJPMEZCUXpOQ0xHbENRVUZQTEZOQlFWTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0VFFVRkJMRUZCUlhKRUxFOUJRVThzVVVGQlVTeERRVUZETzA5QlEycENPenM3TzFOQmFFSkhMSE5DUVVGelFqdEhRVUZUTEZWQlFWVTdPenM3T3pzN08wbEJkMEo2UXl4VFFVRlRPMEZCUTBZc1YwRkVVQ3hUUVVGVExFTkJRMFFzV1VGQldTeEZRVUZuUWp0UlFVRmtMRTlCUVU4c1owTkJRVWNzUlVGQlJUczdNRUpCUkd4RExGTkJRVk03TzBGQlJWZ3NjVU5CUmtVc1UwRkJVeXcyUTBGRlRDeFpRVUZaTEVWQlFVVTdPenM3T3p0QlFVMXdRaXhSUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03TzBGQlJXcEVMRkZCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzQkNMRkZCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzUlVGQlJTeERRVUZET3p0QlFVVjRRaXhSUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTTFRaXhSUVVGSkxFTkJRVU1zWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hoUVVGaExFVkJRVVVzUTBGQlF6czdPMEZCUnpWRExGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJoQ0xGRkJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWcVFpeFJRVUZKTEVOQlFVTXNZMEZCWXl4SFFVRkhMRkZCUVZFc1EwRkJRenRIUVVOb1F6czdXVUYwUWtjc1UwRkJVenM3WlVGQlZDeFRRVUZUTzBGQmQwSmlMSFZDUVVGdFFqdGhRVUZCTERaQ1FVRkRMRWxCUVVrc1JVRkJSVHRCUVVONFFpeGxRVUZQTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUVN4SFFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03VDBGRE9VUTdPMEZCUlVRc2RVSkJRVzFDTzJGQlFVRXNOa0pCUVVNc1VVRkJVU3hGUVVGRk8wRkJRelZDTEdWQlFVOHNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkJMRWRCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dFBRVU5zUlRzN1FVRkZSQ3cyUWtGQmVVSTdZVUZCUVN4dFEwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTXZReXhaUVVGSkxIRkNRVUZ4UWl4SFFVRkhMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQlRTeERRVUZET3p0QlFVVjBSQ3haUVVGSkxIRkNRVUZ4UWl4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVNM1FpeGpRVUZKTEUxQlFVMHNSVUZCUlN4clFrRkJhMElzUTBGQlF6czdRVUZGTDBJc1kwRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wRkJRemxDTEdOQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eFBRVUZQTEVkQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1FVRkJReXhEUVVGRE96dEJRVVUxUXl4bFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NjVUpCUVhGQ0xFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZET1VNc2EwSkJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJReTlDTERoQ1FVRnJRaXhIUVVGSExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU5vUlN4blFrRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenRYUVVNeFJEdFRRVVZHT3p0QlFVVkVMR1ZCUVU4c1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJRenRQUVVOdVF6czdRVUZGUkN3d1FrRkJjMEk3WVVGQlFTeG5RMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlJUczdPenM3TzBGQlF6VkRMSE5FUVVGM1FpeEpRVUZKTEVOQlFVTXNZVUZCWVR0blFrRkJha01zVjBGQlZ6czdRVUZEYkVJc2RVSkJRVmNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dFhRVUZCT3pzN096czdPenM3T3pzN096czdUMEZEYUVRN08wRkJVVWNzWlVGQlZ6czdPenM3T3pzN08xZEJRVUVzV1VGQlJ6dEJRVU5vUWl4bFFVRlBMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETzA5QlEyNURPenRCUVZGSExHMUNRVUZsT3pzN096czdPenM3VjBGQlFTeFpRVUZITzBGQlEzQkNMR1ZCUVU4c1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVRXNSMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wOUJRM0JHT3p0QlFWRkVMSEZDUVVGcFFqczdPenM3T3pzN08yRkJRVUVzTWtKQlFVTXNXVUZCV1N4RlFVRkZPMEZCUXpsQ0xGbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZEZEVJc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGRGTEZsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1dVRkJXU3hEUVVGRE8wOUJRM0JET3p0QlFVZEVMR2RDUVVGWk96czdPMkZCUVVFc2MwSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRiRU1zV1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRia0lzV1VGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4UlFVRlJMRU5CUVVNN1FVRkRNMElzV1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNN08wRkJSWEpDTEdWQlFVOHNTVUZCU1N4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03VDBGRE9VUTdPMEZCUjBRc2JVSkJRV1U3T3pzN1lVRkJRU3g1UWtGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOeVF5eFpRVUZKTEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUXpWRExGbEJRVWtzYTBKQlFXdENMRWRCUVVjc1ZVRkJWU3hEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVV6UlN4WlFVRkpMRU5CUVVNc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03TzBGQlJXcEdMR1ZCUVU4c1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF6dFBRVU0xUWpzN1FVRkhSQ3hoUVVGVE96czdPMkZCUVVFc2JVSkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVdkQ08xbEJRV1FzU1VGQlNTeG5RMEZCUnl4TFFVRkxPenRCUVVNelF5eFpRVUZKTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEJRVVUzUWl4WlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU51UWl4WlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExGRkJRVkVzUTBGQlF6dEJRVU16UWl4WlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGY2tJc1dVRkJTU3hMUVVGTExFdEJRVXNzVTBGQlV5eEpRVUZMTEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhCUVVGRExFVkJRVVU3UVVGRGFFUXNZMEZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF6czdPMEZCUjNaRExHTkJRVWtzU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4VFFVRlRMRWRCUVVjc1EwRkJReXhGUVVGRk96dEJRVVZxUXl4M1FrRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMWRCUTNSRkxFMUJRVTBzU1VGQlNTeFRRVUZUTEV0QlFVc3NRMEZCUXl4RlFVRkZPenRCUVVVeFFpeDNRa0ZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZET3pzN1FVRkhja1VzWjBKQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1NVRkJTU3h6UWtGQmMwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVONFJDeG5Ra0ZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRYUVVOd1JDeE5RVUZOTEVsQlFVa3NTMEZCU3l4TFFVRkxMRU5CUVVNc1JVRkJSVHM3UVVGRmRFSXNkMEpCUVZrc1IwRkJSeXhSUVVGUkxFTkJRVU03TzBGQlJYaENMR2RDUVVGSkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXpzN08wRkJSeTlETEdkQ1FVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN1FVRkROVU1zYlVKQlFVOHNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJRenRYUVVNM1FpeE5RVUZOT3p0QlFVVk1MR2RDUVVGSkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0WFFVTndSRHM3UVVGRlJDeGpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdVMEZEZEVNN1QwRkRSanM3UVVGUFJDeFBRVUZIT3pzN096czdPenRoUVVGQkxHRkJRVU1zVFVGQlRUczdPMWxCUVVVc1lVRkJZU3huUTBGQlJ5eERRVUZETEZGQlFWRTdXVUZCUlN4WFFVRlhMR2REUVVGSExGRkJRVkU3V1VGQlJTeGpRVUZqTEdkRFFVRkhMR0ZCUVdFN05FSkJRVVU3UVVGRE4wWXNZMEZCU1N4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE96dEJRVVYyUWl4alFVRkpMR05CUVdNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGRE9VSXNZMEZCWXl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRmNrSXNZMEZCU1N4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVObUxFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNNa05CUVRKRExFTkJRVU1zUTBGQlF6czdRVUZGTDBRc1kwRkJTU3hOUVVGTkxFTkJRVU1zY1VKQlFYRkNMRVZCUVVVc1JVRkRhRU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NjMEpCUVhOQ0xGRkJRVThzVFVGQlRTeEZRVUZGTEdGQlFXRXNSVUZCUlN4WFFVRlhMRVZCUVVVc1kwRkJZeXhEUVVGRExFTkJRVU1zUzBGRGFFY3NTVUZCU1N4TlFVRk5MRU5CUVVNc2VVSkJRWGxDTEVWQlFVVXNSVUZEZWtNc1YwRkJWeXhIUVVGSExFbEJRVWtzTUVKQlFUQkNMRkZCUVU4c1RVRkJUU3hGUVVGRkxHRkJRV0VzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RFFVRkRMRU5CUVVNc1MwRkRjRWNzU1VGQlNTeE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUlVGRGJrTXNWMEZCVnl4SFFVRkhMRWxCUVVrc2IwSkJRVzlDTEZGQlFVOHNUVUZCVFN4RlFVRkZMR0ZCUVdFc1JVRkJSU3hYUVVGWExFVkJRVVVzWTBGQll5eERRVUZETEVOQlFVTXNTMEZGYWtjc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eDFRMEZCZFVNc1EwRkJReXhEUVVGRE96dEJRVVV6UkN4alFVRkpMRmRCUVZjc1JVRkJSVHRCUVVObUxHZENRVUZKTEV0QlFVc3NSMEZCUnl4TlFVRkxMRTlCUVU4c1EwRkJRenM3UVVGRmVrSXNhMEpCUVVzc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTTFRaXhyUWtGQlN5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE96dEJRVVZ5UXl4MVFrRkJWeXhEUVVGRExHTkJRV01zVVVGQlR5eFpRVUVyUWp0clFrRkJPVUlzYTBKQlFXdENMR2REUVVGSExFbEJRVWs3T3p0QlFVVjZSQ3hyUWtGQlNTeExRVUZMTEVkQlFVY3NUVUZCU3l4UFFVRlBMRU5CUVVNN08wRkJSWHBDTEd0Q1FVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRVVU3UVVGRFppeHZRa0ZCU1N4clFrRkJhMElzUzBGQlN5eEpRVUZKTEVWQlF6ZENMR3RDUVVGclFpeEhRVUZITEZkQlFWY3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJTeXhYUVVGWExFVkJRVVVzVFVGQlN5eGxRVUZsTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSUzlHTEc5Q1FVRkpMRmxCUVZrc1IwRkJSeXhOUVVGTExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenRCUVVNdlJTeHpRa0ZCU3l4cFFrRkJhVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0bFFVTjBRenRoUVVOR0xFVkJRVVVzV1VGQlRUczdRVUZGVUN4eFFrRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RFFVRkRPMkZCUXk5RExFVkJRVVVzV1VGQlRUczdRVUZGVUN4eFFrRkJUeXhOUVVGTExGZEJRVmNzUTBGQlF5eGxRVUZsTEVkQlFVY3NUVUZCU3l4blFrRkJaMElzUTBGQlF6dGhRVU5xUlN4RFFVRkRMRU5CUVVNN08wRkJSVWdzWjBKQlFVa3NTMEZCU3l4TFFVRkxMRU5CUVVNc1JVRkJSVHM3UVVGRlppeHJRa0ZCU1N4clFrRkJhMElzUjBGQlJ5eFhRVUZYTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVVzc1YwRkJWeXhGUVVGRkxFMUJRVXNzWlVGQlpTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJwSExHdENRVUZKTEZsQlFWa3NSMEZCUnl4TlFVRkxMR2RDUVVGblFpeERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRVZCUVVVc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXpzN1FVRkZha1lzYjBKQlFVc3NhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdZVUZEZEVNN1YwRkRSanM3UVVGRlJDeHBRa0ZCVHl4WFFVRlhMRU5CUVVNN1UwRkRjRUk3VDBGQlFUczdRVUZOUkN4VlFVRk5PenM3T3pzN08yRkJRVUVzWjBKQlFVTXNiVUpCUVcxQ0xFVkJRVVU3UVVGRE1VSXNXVUZCU1N4TlFVRk5MRWRCUVVjc2JVSkJRVzFDTEVOQlFVTTdRVUZEYWtNc1dVRkJTU3hYUVVGWExFZEJRVWNzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVY0Uml4WlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRk8wRkJRMmhDTEdkQ1FVRk5MRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMEZCUXk5RkxIRkNRVUZYTEVkQlFVY3NiVUpCUVcxQ0xFTkJRVU03VTBGRGJrTTdPMEZCUlVRc1dVRkJTU3hOUVVGTkxFbEJRVWtzVjBGQlZ5eEZRVUZGTzBGQlEzcENMR05CUVVrc1dVRkJXU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdPMEZCUlRkRUxIRkNRVUZYTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkROMElzY1VKQlFWY3NRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenM3UVVGRmRFSXNZMEZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFTkJRVU1zUlVGRGNFSXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMU5CUTNoRExFMUJRVTA3UVVGRFRDeG5Ra0ZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNRMEZCUXl4RFFVRkRPMU5CUTJoRk8wOUJRMFk3TzBGQlMwUXNVMEZCU3pzN096czdPMkZCUVVFc2FVSkJRVWM3UVVGRFRpeFpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenM3T3pzN096dEJRVVV4UkN4elJFRkJkMElzU1VGQlNTeERRVUZETEdGQlFXRTdaMEpCUVdwRExGZEJRVmM3TzBGQlEyeENMSFZDUVVGWExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETjBJc2RVSkJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0WFFVTjJRanM3T3pzN096czdPenM3T3pzN08wOUJRMFk3T3pzN1UwRnlVRWNzVTBGQlV6dEhRVUZUTEZWQlFWVTdPMEZCZDFCc1F5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRk5CUVZNc1EwRkJReUlzSW1acGJHVWlPaUpsY3pZdmRYUnBiSE12Y0hKcGIzSnBkSGt0Y1hWbGRXVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpQjNjbWwwZEdWdUlHbHVJRVZEVFVGelkzSnBjSFFnTmlBcUwxeHVMeW9xWEc0Z0tpQkFabWxzWlc5MlpYSjJhV1YzSUZkQlZrVWdZWFZrYVc4Z2RISmhibk53YjNKMElHTnNZWE56SUNoMGFXMWxMV1Z1WjJsdVpTQnRZWE4wWlhJcExDQndjbTkyYVdSbGN5QnplVzVqYUhKdmJtbDZaV1FnYzJOb1pXUjFiR2x1WnlCdlppQjBhVzFsSUdWdVoybHVaWE5jYmlBcUlFQmhkWFJvYjNJZ1RtOXlZbVZ5ZEM1VFkyaHVaV3hzUUdseVkyRnRMbVp5TENCV2FXTjBiM0l1VTJGcGVrQnBjbU5oYlM1bWNpd2dTMkZ5YVcwdVFtRnlhMkYwYVVCcGNtTmhiUzVtY2x4dUlDb3ZYRzRuZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCVWFXMWxSVzVuYVc1bElEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXZkR2x0WlMxbGJtZHBibVZjSWlrN1hHNTJZWElnVUhKcGIzSnBkSGxSZFdWMVpTQTlJSEpsY1hWcGNtVW9YQ0l1TGk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTMW9aV0Z3WENJcE8xeHVkbUZ5SUhzZ1oyVjBVMk5vWldSMWJHVnlJSDBnUFNCeVpYRjFhWEpsS0NjdUwyWmhZM1J2Y21sbGN5Y3BPMXh1WEc1bWRXNWpkR2x2YmlCeVpXMXZkbVZEYjNWd2JHVW9abWx5YzNSQmNuSmhlU3dnYzJWamIyNWtRWEp5WVhrc0lHWnBjbk4wUld4bGJXVnVkQ2tnZTF4dUlDQjJZWElnYVc1a1pYZ2dQU0JtYVhKemRFRnljbUY1TG1sdVpHVjRUMllvWm1seWMzUkZiR1Z0Wlc1MEtUdGNibHh1SUNCcFppQW9hVzVrWlhnZ1BqMGdNQ2tnZTF4dUlDQWdJSFpoY2lCelpXTnZibVJGYkdWdFpXNTBJRDBnYzJWamIyNWtRWEp5WVhsYmFXNWtaWGhkTzF4dVhHNGdJQ0FnWm1seWMzUkJjbkpoZVM1emNHeHBZMlVvYVc1a1pYZ3NJREVwTzF4dUlDQWdJSE5sWTI5dVpFRnljbUY1TG5Od2JHbGpaU2hwYm1SbGVDd2dNU2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdjMlZqYjI1a1JXeGxiV1Z1ZER0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdWRXeHNPMXh1ZlZ4dVhHNWpiR0Z6Y3lCVWNtRnVjM0J2Y25SbFpDQmxlSFJsYm1SeklGUnBiV1ZGYm1kcGJtVWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaDBjbUZ1YzNCdmNuUXNJR1Z1WjJsdVpTd2djM1JoY25SUWIzTnBkR2x2Yml3Z1pXNWtVRzl6YVhScGIyNHNJRzltWm5ObGRGQnZjMmwwYVc5dUtTQjdYRzRnSUNBZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZENBOUlIUnlZVzV6Y0c5eWREdGNiaUFnSUNCMGFHbHpMbDlmWlc1bmFXNWxJRDBnWlc1bmFXNWxPMXh1SUNBZ0lIUm9hWE11WDE5emRHRnlkRkJ2YzJsMGFXOXVJRDBnYzNSaGNuUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmWlc1a1VHOXphWFJwYjI0Z1BTQmxibVJRYjNOcGRHbHZianRjYmlBZ0lDQjBhR2x6TGw5ZmIyWm1jMlYwVUc5emFYUnBiMjRnUFNCdlptWnpaWFJRYjNOcGRHbHZianRjYmlBZ0lDQjBhR2x6TGw5ZmMyTmhiR1ZRYjNOcGRHbHZiaUE5SURFN1hHNGdJQ0FnZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOUlFbHVabWx1YVhSNU95QXZMeUJsYm1kcGJtVW5jeUJ1WlhoMElHaGhiSFFnY0c5emFYUnBiMjRnZDJobGJpQnViM1FnY25WdWJtbHVaeUFvYVhNZ2JuVnNiQ0IzYUdWdUlHVnVaMmx1WlNCb1pYTWdZbVZsYmlCemRHRnlkR1ZrS1Z4dUlDQjlYRzVjYmlBZ2MyVjBRbTkxYm1SaGNtbGxjeWh6ZEdGeWRGQnZjMmwwYVc5dUxDQmxibVJRYjNOcGRHbHZiaXdnYjJabWMyVjBVRzl6YVhScGIyNGdQU0J6ZEdGeWRGQnZjMmwwYVc5dUxDQnpZMkZzWlZCdmMybDBhVzl1SUQwZ01Ta2dlMXh1SUNBZ0lIUm9hWE11WDE5emRHRnlkRkJ2YzJsMGFXOXVJRDBnYzNSaGNuUlFiM05wZEdsdmJqdGNiaUFnSUNCMGFHbHpMbDlmWlc1a1VHOXphWFJwYjI0Z1BTQmxibVJRYjNOcGRHbHZianRjYmlBZ0lDQjBhR2x6TGw5ZmIyWm1jMlYwVUc5emFYUnBiMjRnUFNCdlptWnpaWFJRYjNOcGRHbHZianRjYmlBZ0lDQjBhR2x6TGw5ZmMyTmhiR1ZRYjNOcGRHbHZiaUE5SUhOallXeGxVRzl6YVhScGIyNDdYRzRnSUNBZ2RHaHBjeTV5WlhObGRFNWxlSFJRYjNOcGRHbHZiaWdwTzF4dUlDQjlYRzVjYmlBZ2MzUmhjblFvZEdsdFpTd2djRzl6YVhScGIyNHNJSE53WldWa0tTQjdmVnh1SUNCemRHOXdLSFJwYldVc0lIQnZjMmwwYVc5dUtTQjdmVnh1WEc0Z0lITjVibU5RYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCcFppQW9jM0JsWldRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JwWmlBb2NHOXphWFJwYjI0Z1BDQjBhR2x6TGw5ZmMzUmhjblJRYjNOcGRHbHZiaWtnZTF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOWZhR0ZzZEZCdmMybDBhVzl1SUQwOVBTQnVkV3hzS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YzNSdmNDaDBhVzFsTENCd2IzTnBkR2x2YmlBdElIUm9hWE11WDE5dlptWnpaWFJRYjNOcGRHbHZiaWs3WEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDJoaGJIUlFiM05wZEdsdmJpQTlJSFJvYVhNdVgxOWxibVJRYjNOcGRHbHZianRjYmx4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYM04wWVhKMFVHOXphWFJwYjI0N1hHNGdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tIQnZjMmwwYVc5dUlEdzlJSFJvYVhNdVgxOWxibVJRYjNOcGRHbHZiaWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk4wWVhKMEtIUnBiV1VzSUhCdmMybDBhVzl1SUMwZ2RHaHBjeTVmWDI5bVpuTmxkRkJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOUlHNTFiR3c3SUM4dklHVnVaMmx1WlNCcGN5QmhZM1JwZG1WY2JseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDJWdVpGQnZjMmwwYVc5dU8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JwWmlBb2NHOXphWFJwYjI0Z1BqMGdkR2hwY3k1ZlgyVnVaRkJ2YzJsMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5ZmFHRnNkRkJ2YzJsMGFXOXVJRDA5UFNCdWRXeHNLVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjM1J2Y0NoMGFXMWxMQ0J3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJpazdYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOUlIUm9hWE11WDE5emRHRnlkRkJ2YzJsMGFXOXVPMXh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZaVzVrVUc5emFYUnBiMjQ3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hCdmMybDBhVzl1SUQ0Z2RHaHBjeTVmWDNOMFlYSjBVRzl6YVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXpkR0Z5ZENoMGFXMWxMQ0J3YjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJpd2djM0JsWldRcE8xeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOW9ZV3gwVUc5emFYUnBiMjRnUFNCdWRXeHNPeUF2THlCbGJtZHBibVVnYVhNZ1lXTjBhWFpsWEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTl6ZEdGeWRGQnZjMmwwYVc5dU8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TGw5ZmFHRnNkRkJ2YzJsMGFXOXVJRDA5UFNCdWRXeHNLVnh1SUNBZ0lDQWdkR2hwY3k1emRHOXdLSFJwYldVc0lIQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lIUm9hWE11WDE5b1lXeDBVRzl6YVhScGIyNGdQU0JKYm1acGJtbDBlVHRjYmx4dUlDQWdJSEpsZEhWeWJpQkpibVpwYm1sMGVUdGNiaUFnZlZ4dVhHNGdJR0ZrZG1GdVkyVlFiM05wZEdsdmJpaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwSUh0Y2JpQWdJQ0IyWVhJZ2FHRnNkRkJ2YzJsMGFXOXVJRDBnZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2Ymp0Y2JseHVJQ0FnSUdsbUlDaG9ZV3gwVUc5emFYUnBiMjRnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjM1JoY25Rb2RHbHRaU3dnY0c5emFYUnBiMjRnTFNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNHNJSE53WldWa0tUdGNibHh1SUNBZ0lDQWdkR2hwY3k1ZlgyaGhiSFJRYjNOcGRHbHZiaUE5SUc1MWJHdzdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQm9ZV3gwVUc5emFYUnBiMjQ3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnYzNSdmNDQmxibWRwYm1WY2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDJoaGJIUlFiM05wZEdsdmJpQTlQVDBnYm5Wc2JDbGNiaUFnSUNBZ0lIUm9hWE11YzNSdmNDaDBhVzFsTENCd2IzTnBkR2x2YmlBdElIUm9hWE11WDE5dlptWnpaWFJRYjNOcGRHbHZiaWs3WEc1Y2JpQWdJQ0IwYUdsekxsOWZhR0ZzZEZCdmMybDBhVzl1SUQwZ1NXNW1hVzVwZEhrN1hHNWNiaUFnSUNCeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc0Z0lIMWNibHh1SUNCemVXNWpVM0JsWldRb2RHbHRaU3dnY0c5emFYUnBiMjRzSUhOd1pXVmtLU0I3WEc0Z0lDQWdhV1lnS0hOd1pXVmtJRDA5UFNBd0tWeHVJQ0FnSUNBZ2RHaHBjeTV6ZEc5d0tIUnBiV1VzSUhCdmMybDBhVzl1SUMwZ2RHaHBjeTVmWDI5bVpuTmxkRkJ2YzJsMGFXOXVLVHRjYmlBZ2ZWeHVYRzRnSUdSbGMzUnliM2tvS1NCN1hHNGdJQ0FnZEdocGN5NWZYM1J5WVc1emNHOXlkQ0E5SUc1MWJHdzdYRzRnSUNBZ2RHaHBjeTVmWDJWdVoybHVaU0E5SUc1MWJHdzdYRzRnSUgxY2JuMWNibHh1THk4Z1ZISmhibk53YjNKMFpXUlRZMmhsWkhWc1pXUWdhR0Z6SUhSdklITjNhWFJqYUNCdmJpQmhibVFnYjJabUlIUm9aU0J6WTJobFpIVnNaV1FnWlc1bmFXNWxjMXh1THk4Z2QyaGxiaUIwYUdVZ2RISmhibk53YjNKMElHaHBkSE1nZEdobElHVnVaMmx1WlNkeklITjBZWEowSUdGdVpDQmxibVFnY0c5emFYUnBiMjVjYm1Oc1lYTnpJRlJ5WVc1emNHOXlkR1ZrVkhKaGJuTndiM0owWldRZ1pYaDBaVzVrY3lCVWNtRnVjM0J2Y25SbFpDQjdYRzRnSUdOdmJuTjBjblZqZEc5eUtIUnlZVzV6Y0c5eWRDd2daVzVuYVc1bExDQnpkR0Z5ZEZCdmMybDBhVzl1TENCbGJtUlFiM05wZEdsdmJpd2diMlptYzJWMFVHOXphWFJwYjI0cElIdGNiaUFnSUNCemRYQmxjaWgwY21GdWMzQnZjblFzSUdWdVoybHVaU3dnYzNSaGNuUlFiM05wZEdsdmJpd2daVzVrVUc5emFYUnBiMjRzSUc5bVpuTmxkRkJ2YzJsMGFXOXVLVHRjYmx4dUlDQWdJR1Z1WjJsdVpTNXpaWFJVY21GdWMzQnZjblJsWkNoMGFHbHpMQ0FvYm1WNGRFVnVaMmx1WlZCdmMybDBhVzl1SUQwZ2JuVnNiQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0x5OGdjbVZ6WlhST1pYaDBVRzl6YVhScGIyNWNiaUFnSUNBZ0lHbG1JQ2h1WlhoMFJXNW5hVzVsVUc5emFYUnBiMjRnSVQwOUlHNTFiR3dwWEc0Z0lDQWdJQ0FnSUc1bGVIUkZibWRwYm1WUWIzTnBkR2x2YmlBclBTQjBhR2x6TGw5ZmIyWm1jMlYwVUc5emFYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjbVZ6WlhST1pYaDBVRzl6YVhScGIyNG9ibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVLVHRjYmlBZ0lDQjlMQ0FvS1NBOVBpQjdYRzRnSUNBZ0lDQXZMeUJuWlhSRGRYSnlaVzUwVkdsdFpWeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTkwY21GdWMzQnZjblF1YzJOb1pXUjFiR1Z5TG1OMWNuSmxiblJVYVcxbE8xeHVJQ0FnSUgwc0lDZ3BJRDArSUh0Y2JpQWdJQ0FnSUM4dklHZGxkQ0JqZFhKeVpXNTBVRzl6YVhScGIyNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmZEhKaGJuTndiM0owTG1OMWNuSmxiblJRYjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJqdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJSE41Ym1OUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQnBaaUFvYzNCbFpXUWdQaUF3SUNZbUlIQnZjMmwwYVc5dUlEd2dkR2hwY3k1ZlgyVnVaRkJ2YzJsMGFXOXVLVnh1SUNBZ0lDQWdjRzl6YVhScGIyNGdQU0JOWVhSb0xtMWhlQ2h3YjNOcGRHbHZiaXdnZEdocGN5NWZYM04wWVhKMFVHOXphWFJwYjI0cE8xeHVJQ0FnSUdWc2MyVWdhV1lnS0hOd1pXVmtJRHdnTUNBbUppQndiM05wZEdsdmJpQStQU0IwYUdsekxsOWZjM1JoY25SUWIzTnBkR2x2YmlsY2JpQWdJQ0FnSUhCdmMybDBhVzl1SUQwZ1RXRjBhQzV0YVc0b2NHOXphWFJwYjI0c0lIUm9hWE11WDE5bGJtUlFiM05wZEdsdmJpazdYRzVjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDI5bVpuTmxkRkJ2YzJsMGFXOXVJQ3NnZEdocGN5NWZYMlZ1WjJsdVpTNXplVzVqVUc5emFYUnBiMjRvZEdsdFpTd2djRzl6YVhScGIyNGdMU0IwYUdsekxsOWZiMlptYzJWMFVHOXphWFJwYjI0c0lITndaV1ZrS1R0Y2JpQWdmVnh1WEc0Z0lHRmtkbUZ1WTJWUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQndiM05wZEdsdmJpQTlJSFJvYVhNdVgxOXZabVp6WlhSUWIzTnBkR2x2YmlBcklIUm9hWE11WDE5bGJtZHBibVV1WVdSMllXNWpaVkJ2YzJsMGFXOXVLSFJwYldVc0lIQnZjMmwwYVc5dUlDMGdkR2hwY3k1ZlgyOW1abk5sZEZCdmMybDBhVzl1TENCemNHVmxaQ2s3WEc1Y2JpQWdJQ0JwWmlBb2MzQmxaV1FnUGlBd0lDWW1JSEJ2YzJsMGFXOXVJRHdnZEdocGN5NWZYMlZ1WkZCdmMybDBhVzl1SUh4OElITndaV1ZrSUR3Z01DQW1KaUJ3YjNOcGRHbHZiaUErUFNCMGFHbHpMbDlmYzNSaGNuUlFiM05wZEdsdmJpbGNiaUFnSUNBZ0lISmxkSFZ5YmlCd2IzTnBkR2x2Ymp0Y2JseHVJQ0FnSUhKbGRIVnliaUJKYm1acGJtbDBlVHRjYmlBZ2ZWeHVYRzRnSUhONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NWZYMlZ1WjJsdVpTNXplVzVqVTNCbFpXUXBYRzRnSUNBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5ONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBPMXh1SUNCOVhHNWNiaUFnWkdWemRISnZlU2dwSUh0Y2JpQWdJQ0IwYUdsekxsOWZaVzVuYVc1bExuSmxjMlYwU1c1MFpYSm1ZV05sS0NrN1hHNGdJQ0FnYzNWd1pYSXVaR1Z6ZEhKdmVTZ3BPMXh1SUNCOVhHNTlYRzVjYmk4dklGUnlZVzV6Y0c5eWRHVmtVM0JsWldSRGIyNTBjbTlzYkdWa0lHaGhjeUIwYnlCemRHRnlkQ0JoYm1RZ2MzUnZjQ0IwYUdVZ2MzQmxaV1F0WTI5dWRISnZiR3hsWkNCbGJtZHBibVZ6WEc0dkx5QjNhR1Z1SUhSb1pTQjBjbUZ1YzNCdmNuUWdhR2wwY3lCMGFHVWdaVzVuYVc1bEozTWdjM1JoY25RZ1lXNWtJR1Z1WkNCd2IzTnBkR2x2Ymx4dVkyeGhjM01nVkhKaGJuTndiM0owWldSVGNHVmxaRU52Ym5SeWIyeHNaV1FnWlhoMFpXNWtjeUJVY21GdWMzQnZjblJsWkNCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0hSeVlXNXpjRzl5ZEN3Z1pXNW5hVzVsTENCemRHRnlkRkJ2YzJsMGFXOXVMQ0JsYm1SUWIzTnBkR2x2Yml3Z2IyWm1jMlYwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0J6ZFhCbGNpaDBjbUZ1YzNCdmNuUXNJR1Z1WjJsdVpTd2djM1JoY25SUWIzTnBkR2x2Yml3Z1pXNWtVRzl6YVhScGIyNHNJRzltWm5ObGRGQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lHVnVaMmx1WlM1elpYUlRjR1ZsWkVOdmJuUnliMnhzWldRb2RHaHBjeXdnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdMeThnWjJWMFEzVnljbVZ1ZEZScGJXVmNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmZEhKaGJuTndiM0owTG5OamFHVmtkV3hsY2k1amRYSnlaVzUwVkdsdFpUdGNiaUFnSUNCOUxDQW9LU0E5UGlCN1hHNGdJQ0FnSUNBdkx5Qm5aWFFnWTNWeWNtVnVkRkJ2YzJsMGFXOXVYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEM1amRYSnlaVzUwVUc5emFYUnBiMjRnTFNCMGFHbHpMbDlmYjJabWMyVjBVRzl6YVhScGIyNDdYRzRnSUNBZ2ZTazdYRzRnSUgxY2JseHVJQ0J6ZEdGeWRDaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FwSUh0Y2JpQWdJQ0IwYUdsekxsOWZaVzVuYVc1bExuTjVibU5UY0dWbFpDaDBhVzFsTENCd2IzTnBkR2x2Yml3Z2MzQmxaV1FzSUhSeWRXVXBPMXh1SUNCOVhHNWNiaUFnYzNSdmNDaDBhVzFsTENCd2IzTnBkR2x2YmlrZ2UxeHVJQ0FnSUhSb2FYTXVYMTlsYm1kcGJtVXVjM2x1WTFOd1pXVmtLSFJwYldVc0lIQnZjMmwwYVc5dUxDQXdLVHRjYmlBZ2ZWeHVYRzRnSUhONWJtTlRjR1ZsWkNoMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NWZYMmhoYkhSUWIzTnBkR2x2YmlBOVBUMGdiblZzYkNrZ0x5OGdaVzVuYVc1bElHbHpJR0ZqZEdsMlpWeHVJQ0FnSUNBZ2RHaHBjeTVmWDJWdVoybHVaUzV6ZVc1alUzQmxaV1FvZEdsdFpTd2djRzl6YVhScGIyNHNJSE53WldWa0tUdGNiaUFnZlZ4dVhHNGdJR1JsYzNSeWIza29LU0I3WEc0Z0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlM1emVXNWpVM0JsWldRb2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEM1amRYSnlaVzUwVkdsdFpTd2dkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRDNWpkWEp5Wlc1MFVHOXphWFJwYjI0Z0xTQjBhR2x6TGw5ZmIyWm1jMlYwVUc5emFYUnBiMjRzSURBcE8xeHVJQ0FnSUhSb2FYTXVYMTlsYm1kcGJtVXVjbVZ6WlhSSmJuUmxjbVpoWTJVb0tUdGNiaUFnSUNCemRYQmxjaTVrWlhOMGNtOTVLQ2s3WEc0Z0lIMWNibjFjYmx4dUx5OGdWSEpoYm5Od2IzSjBaV1JUWTJobFpIVnNaV1FnYUdGeklIUnZJSE4zYVhSamFDQnZiaUJoYm1RZ2IyWm1JSFJvWlNCelkyaGxaSFZzWldRZ1pXNW5hVzVsYzF4dUx5OGdkMmhsYmlCMGFHVWdkSEpoYm5Od2IzSjBJR2hwZEhNZ2RHaGxJR1Z1WjJsdVpTZHpJSE4wWVhKMElHRnVaQ0JsYm1RZ2NHOXphWFJwYjI1Y2JtTnNZWE56SUZSeVlXNXpjRzl5ZEdWa1UyTm9aV1IxYkdWa0lHVjRkR1Z1WkhNZ1ZISmhibk53YjNKMFpXUWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaDBjbUZ1YzNCdmNuUXNJR1Z1WjJsdVpTd2djM1JoY25SUWIzTnBkR2x2Yml3Z1pXNWtVRzl6YVhScGIyNHNJRzltWm5ObGRGQnZjMmwwYVc5dUtTQjdYRzRnSUNBZ2MzVndaWElvZEhKaGJuTndiM0owTENCbGJtZHBibVVzSUhOMFlYSjBVRzl6YVhScGIyNHNJR1Z1WkZCdmMybDBhVzl1TENCdlptWnpaWFJRYjNOcGRHbHZiaWs3WEc1Y2JpQWdJQ0IwYUdsekxsOWZkSEpoYm5Od2IzSjBMbk5qYUdWa2RXeGxjaTVoWkdRb1pXNW5hVzVsTENCSmJtWnBibWwwZVN3Z0tDa2dQVDRnZTF4dUlDQWdJQ0FnTHk4Z1oyVjBJR04xY25KbGJuUlFiM05wZEdsdmJseHVJQ0FnSUNBZ2NtVjBkWEp1SUNoMGFHbHpMbDlmZEhKaGJuTndiM0owTG1OMWNuSmxiblJRYjNOcGRHbHZiaUF0SUhSb2FYTXVYMTl2Wm1aelpYUlFiM05wZEdsdmJpa2dLaUIwYUdsekxsOWZjMk5oYkdWUWIzTnBkR2x2Ymp0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lITjBZWEowS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDa2dlMXh1SUNBZ0lIUm9hWE11WDE5bGJtZHBibVV1Y21WelpYUk9aWGgwVkdsdFpTaDBhVzFsS1R0Y2JpQWdmVnh1WEc0Z0lITjBiM0FvZEdsdFpTd2djRzl6YVhScGIyNHBJSHRjYmlBZ0lDQjBhR2x6TGw5ZlpXNW5hVzVsTG5KbGMyVjBUbVY0ZEZScGJXVW9TVzVtYVc1cGRIa3BPMXh1SUNCOVhHNWNiaUFnWkdWemRISnZlU2dwSUh0Y2JpQWdJQ0IwYUdsekxsOWZkSEpoYm5Od2IzSjBMbk5qYUdWa2RXeGxjaTV5WlcxdmRtVW9kR2hwY3k1ZlgyVnVaMmx1WlNrN1hHNGdJQ0FnYzNWd1pYSXVaR1Z6ZEhKdmVTZ3BPMXh1SUNCOVhHNTlYRzVjYm1Oc1lYTnpJRlJ5WVc1emNHOXlkRk5qYUdWa2RXeGxja2h2YjJzZ1pYaDBaVzVrY3lCVWFXMWxSVzVuYVc1bElIdGNiaUFnWTI5dWMzUnlkV04wYjNJb2RISmhibk53YjNKMEtTQjdYRzRnSUNBZ2MzVndaWElvS1R0Y2JpQWdJQ0IwYUdsekxsOWZkSEpoYm5Od2IzSjBJRDBnZEhKaGJuTndiM0owTzF4dUlDQjlYRzVjYmlBZ0x5OGdWR2x0WlVWdVoybHVaU0J0WlhSb2IyUWdLSE5qYUdWa2RXeGxaQ0JwYm5SbGNtWmhZMlVwWEc0Z0lHRmtkbUZ1WTJWVWFXMWxLSFJwYldVcElIdGNiaUFnSUNCMllYSWdkSEpoYm5Od2IzSjBJRDBnZEdocGN5NWZYM1J5WVc1emNHOXlkRHRjYmlBZ0lDQjJZWElnY0c5emFYUnBiMjRnUFNCMGNtRnVjM0J2Y25RdVgxOW5aWFJRYjNOcGRHbHZia0YwVkdsdFpTaDBhVzFsS1R0Y2JpQWdJQ0IyWVhJZ2JtVjRkRkJ2YzJsMGFXOXVJRDBnZEhKaGJuTndiM0owTG1Ga2RtRnVZMlZRYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2dkSEpoYm5Od2IzSjBMbDlmYzNCbFpXUXBPMXh1WEc0Z0lDQWdhV1lnS0c1bGVIUlFiM05wZEdsdmJpQWhQVDBnU1c1bWFXNXBkSGtwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEpoYm5Od2IzSjBMbDlmWjJWMFZHbHRaVUYwVUc5emFYUnBiMjRvYm1WNGRGQnZjMmwwYVc5dUtUdGNibHh1SUNBZ0lISmxkSFZ5YmlCSmJtWnBibWwwZVR0Y2JpQWdmVnh1ZlZ4dVhHNHZLaXBjYmlBcUlIaDRlRnh1SUNwY2JpQXFYRzRnS2k5Y2JtTnNZWE56SUZSeVlXNXpjRzl5ZENCbGVIUmxibVJ6SUZScGJXVkZibWRwYm1VZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2loaGRXUnBiME52Ym5SbGVIUXNJRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUhOMWNHVnlLR0YxWkdsdlEyOXVkR1Y0ZENrN1hHNWNiaUFnSUNBdkx5Qm1kWFIxY21VZ1lYTnphV2R1YldWdWRGeHVJQ0FnSUM4dklIUm9hWE11YzJOb1pXUjFiR1Z5SUQwZ2QyRjJaWE11WjJWMFUyTm9aV1IxYkdWeUtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc0Z0lDQWdMeThnZEdocGN5NXpZMmhsWkhWc1pYSWdQU0J5WlhGMWFYSmxLRndpYzJOb1pXUjFiR1Z5WENJcE8xeHVJQ0FnSUM4dklIUmxjM1JjYmlBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2lBOUlHZGxkRk5qYUdWa2RXeGxjaWgwYUdsekxtRjFaR2x2UTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0IwYUdsekxsOWZaVzVuYVc1bGN5QTlJRnRkTzF4dUlDQWdJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUmxaQ0E5SUZ0ZE8xeHVYRzRnSUNBZ2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc2dQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVYMTkwY21GdWMzQnZjblJSZFdWMVpTQTlJRzVsZHlCUWNtbHZjbWwwZVZGMVpYVmxLQ2s3WEc1Y2JpQWdJQ0F2THlCemVXNWpjbTl1YVhwbFpDQjBhVzFsTENCd2IzTnBkR2x2Yml3Z1lXNWtJSE53WldWa1hHNGdJQ0FnZEdocGN5NWZYM1JwYldVZ1BTQXdPMXh1SUNBZ0lIUm9hWE11WDE5d2IzTnBkR2x2YmlBOUlEQTdYRzRnSUNBZ2RHaHBjeTVmWDNOd1pXVmtJRDBnTUR0Y2JseHVJQ0FnSUhSb2FYTXVYMTl1WlhoMFVHOXphWFJwYjI0Z1BTQkpibVpwYm1sMGVUdGNiaUFnZlZ4dVhHNGdJRjlmWjJWMFVHOXphWFJwYjI1QmRGUnBiV1VvZEdsdFpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmY0c5emFYUnBiMjRnS3lBb2RHbHRaU0F0SUhSb2FYTXVYMTkwYVcxbEtTQXFJSFJvYVhNdVgxOXpjR1ZsWkR0Y2JpQWdmVnh1WEc0Z0lGOWZaMlYwVkdsdFpVRjBVRzl6YVhScGIyNG9jRzl6YVhScGIyNHBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNScGJXVWdLeUFvY0c5emFYUnBiMjRnTFNCMGFHbHpMbDlmY0c5emFYUnBiMjRwSUM4Z2RHaHBjeTVmWDNOd1pXVmtPMXh1SUNCOVhHNWNiaUFnWDE5emVXNWpWSEpoYm5Od2IzSjBaV1JRYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcElIdGNiaUFnSUNCMllYSWdiblZ0VkhKaGJuTndiM0owWldSRmJtZHBibVZ6SUQwZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEdWa0xteGxibWQwYUR0Y2JseHVJQ0FnSUdsbUlDaHVkVzFVY21GdWMzQnZjblJsWkVWdVoybHVaWE1nUGlBd0tTQjdYRzRnSUNBZ0lDQjJZWElnWlc1bmFXNWxMQ0J1WlhoMFJXNW5hVzVsVUc5emFYUnBiMjQ3WEc1Y2JpQWdJQ0FnSUhSb2FYTXVYMTkwY21GdWMzQnZjblJSZFdWMVpTNWpiR1ZoY2lncE8xeHVJQ0FnSUNBZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEZGMVpYVmxMbkpsZG1WeWMyVWdQU0FvYzNCbFpXUWdQQ0F3S1R0Y2JseHVJQ0FnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQnVkVzFVY21GdWMzQnZjblJsWkVWdVoybHVaWE03SUdrckt5a2dlMXh1SUNBZ0lDQWdJQ0JsYm1kcGJtVWdQU0IwYUdsekxsOWZkSEpoYm5Od2IzSjBaV1JiYVYwN1hHNGdJQ0FnSUNBZ0lHNWxlSFJGYm1kcGJtVlFiM05wZEdsdmJpQTlJR1Z1WjJsdVpTNXplVzVqVUc5emFYUnBiMjRvZEdsdFpTd2djRzl6YVhScGIyNHNJSE53WldWa0tUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRGRjFaWFZsTG1sdWMyVnlkQ2hsYm1kcGJtVXNJRzVsZUhSRmJtZHBibVZRYjNOcGRHbHZiaWs3SUNCY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZkSEpoYm5Od2IzSjBVWFZsZFdVdWRHbHRaVHRjYmlBZ2ZWeHVYRzRnSUY5ZmMzbHVZMVJ5WVc1emNHOXlkR1ZrVTNCbFpXUW9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnWm05eUlDaDJZWElnZEhKaGJuTndiM0owWldRZ2IyWWdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRHVmtLVnh1SUNBZ0lDQWdkSEpoYm5Od2IzSjBaV1F1YzNsdVkxTndaV1ZrS0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUjJWMElHTjFjbkpsYm5RZ2JXRnpkR1Z5SUhScGJXVmNiaUFnSUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlNCamRYSnlaVzUwSUhScGJXVmNiaUFnSUNwY2JpQWdJQ29nVkdocGN5Qm1kVzVqZEdsdmJpQjNhV3hzSUdKbElISmxjR3hoWTJWa0lIZG9aVzRnZEdobElIUnlZVzV6Y0c5eWRDQnBjeUJoWkdSbFpDQjBieUJoSUcxaGMzUmxjaUFvYVM1bExpQjBjbUZ1YzNCdmNuUWdiM0lnY0d4aGVTMWpiMjUwY205c0tTNWNiaUFnSUNvdlhHNGdJR2RsZENCamRYSnlaVzUwVkdsdFpTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV6WTJobFpIVnNaWEl1WTNWeWNtVnVkRlJwYldVN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwSUdOMWNuSmxiblFnYldGemRHVnlJSEJ2YzJsMGFXOXVYRzRnSUNBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ1kzVnljbVZ1ZENCd2JHRjVhVzVuSUhCdmMybDBhVzl1WEc0Z0lDQXFYRzRnSUNBcUlGUm9hWE1nWm5WdVkzUnBiMjRnZDJsc2JDQmlaU0J5WlhCc1lXTmxaQ0IzYUdWdUlIUm9aU0IwY21GdWMzQnZjblFnYVhNZ1lXUmtaV1FnZEc4Z1lTQnRZWE4wWlhJZ0tHa3VaUzRnZEhKaGJuTndiM0owSUc5eUlIQnNZWGt0WTI5dWRISnZiQ2t1WEc0Z0lDQXFMMXh1SUNCblpYUWdZM1Z5Y21WdWRGQnZjMmwwYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmY0c5emFYUnBiMjRnS3lBb2RHaHBjeTV6WTJobFpIVnNaWEl1WTNWeWNtVnVkRlJwYldVZ0xTQjBhR2x6TGw5ZmRHbHRaU2tnS2lCMGFHbHpMbDlmYzNCbFpXUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WelpYUWdibVY0ZENCMGNtRnVjM0J2Y25RZ2NHOXphWFJwYjI1Y2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRzVsZUhRZ2RISmhibk53YjNKMElIQnZjMmwwYVc5dVhHNGdJQ0FxWEc0Z0lDQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z2QybHNiQ0JpWlNCeVpYQnNZV05sWkNCM2FHVnVJSFJvWlNCMGNtRnVjM0J2Y25RZ2FYTWdZV1JrWldRZ2RHOGdZU0J0WVhOMFpYSWdLR2t1WlM0Z2RISmhibk53YjNKMElHOXlJSEJzWVhrdFkyOXVkSEp2YkNrdVhHNGdJQ0FxTDF4dUlDQnlaWE5sZEU1bGVIUlFiM05wZEdsdmJpaHVaWGgwVUc5emFYUnBiMjRwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc3BYRzRnSUNBZ0lDQjBhR2x6TGw5ZmMyTm9aV1IxYkdWeVNHOXZheTV5WlhObGRFNWxlSFJVYVcxbEtIUm9hWE11WDE5blpYUlVhVzFsUVhSUWIzTnBkR2x2YmlodVpYaDBVRzl6YVhScGIyNHBLVHRjYmx4dUlDQWdJSFJvYVhNdVgxOXVaWGgwVUc5emFYUnBiMjRnUFNCdVpYaDBVRzl6YVhScGIyNDdYRzRnSUgxY2JseHVJQ0F2THlCVWFXMWxSVzVuYVc1bElHMWxkR2h2WkNBb2RISmhibk53YjNKMFpXUWdhVzUwWlhKbVlXTmxLVnh1SUNCemVXNWpVRzl6YVhScGIyNG9kR2x0WlN3Z2NHOXphWFJwYjI0c0lITndaV1ZrS1NCN1hHNGdJQ0FnZEdocGN5NWZYM1JwYldVZ1BTQjBhVzFsTzF4dUlDQWdJSFJvYVhNdVgxOXdiM05wZEdsdmJpQTlJSEJ2YzJsMGFXOXVPMXh1SUNBZ0lIUm9hWE11WDE5emNHVmxaQ0E5SUhOd1pXVmtPMXh1WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5emVXNWpWSEpoYm5Od2IzSjBaV1JRYjNOcGRHbHZiaWgwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0I5WEc1Y2JpQWdMeThnVkdsdFpVVnVaMmx1WlNCdFpYUm9iMlFnS0hSeVlXNXpjRzl5ZEdWa0lHbHVkR1Z5Wm1GalpTbGNiaUFnWVdSMllXNWpaVkJ2YzJsMGFXOXVLSFJwYldVc0lIQnZjMmwwYVc5dUxDQnpjR1ZsWkNrZ2UxeHVJQ0FnSUhaaGNpQnVaWGgwUlc1bmFXNWxJRDBnZEdocGN5NWZYM1J5WVc1emNHOXlkRkYxWlhWbExtaGxZV1E3WEc0Z0lDQWdkbUZ5SUc1bGVIUkZibWRwYm1WUWIzTnBkR2x2YmlBOUlHNWxlSFJGYm1kcGJtVXVZV1IyWVc1alpWQnZjMmwwYVc5dUtIUnBiV1VzSUhCdmMybDBhVzl1TENCemNHVmxaQ2s3WEc1Y2JpQWdJQ0IwYUdsekxsOWZibVY0ZEZCdmMybDBhVzl1SUQwZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEZGMVpYVmxMbTF2ZG1Vb2JtVjRkRVZ1WjJsdVpTd2dibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmJtVjRkRkJ2YzJsMGFXOXVPMXh1SUNCOVhHNWNiaUFnTHk4Z1ZHbHRaVVZ1WjJsdVpTQnRaWFJvYjJRZ0tITndaV1ZrTFdOdmJuUnliMnhzWldRZ2FXNTBaWEptWVdObEtWeHVJQ0J6ZVc1alUzQmxaV1FvZEdsdFpTd2djRzl6YVhScGIyNHNJSE53WldWa0xDQnpaV1ZySUQwZ1ptRnNjMlVwSUh0Y2JpQWdJQ0IyWVhJZ2JHRnpkRk53WldWa0lEMGdkR2hwY3k1ZlgzTndaV1ZrTzF4dVhHNGdJQ0FnZEdocGN5NWZYM1JwYldVZ1BTQjBhVzFsTzF4dUlDQWdJSFJvYVhNdVgxOXdiM05wZEdsdmJpQTlJSEJ2YzJsMGFXOXVPMXh1SUNBZ0lIUm9hWE11WDE5emNHVmxaQ0E5SUhOd1pXVmtPMXh1WEc0Z0lDQWdhV1lnS0hOd1pXVmtJQ0U5UFNCc1lYTjBVM0JsWldRZ2ZId2dLSE5sWldzZ0ppWWdjM0JsWldRZ0lUMDlJREFwS1NCN1hHNGdJQ0FnSUNCMllYSWdibVY0ZEZCdmMybDBhVzl1SUQwZ2RHaHBjeTVmWDI1bGVIUlFiM05wZEdsdmJqdGNibHh1SUNBZ0lDQWdMeThnY21WemVXNWpJSFJ5WVc1emNHOXlkR1ZrSUdWdVoybHVaWE5jYmlBZ0lDQWdJR2xtSUNoelpXVnJJSHg4SUhOd1pXVmtJQ29nYkdGemRGTndaV1ZrSUR3Z01Da2dlMXh1SUNBZ0lDQWdJQ0F2THlCelpXVnJJRzl5SUhKbGRtVnljMlVnWkdseVpXTjBhVzl1WEc0Z0lDQWdJQ0FnSUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdVgxOXplVzVqVkhKaGJuTndiM0owWldSUWIzTnBkR2x2YmloMGFXMWxMQ0J3YjNOcGRHbHZiaXdnYzNCbFpXUXBPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hzWVhOMFUzQmxaV1FnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2MzUmhjblJjYmlBZ0lDQWdJQ0FnYm1WNGRGQnZjMmwwYVc5dUlEMGdkR2hwY3k1ZlgzTjVibU5VY21GdWMzQnZjblJsWkZCdmMybDBhVzl1S0hScGJXVXNJSEJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z2MyTm9aV1IxYkdVZ2RISmhibk53YjNKMElHbDBjMlZzWmx4dUlDQWdJQ0FnSUNCMGFHbHpMbDlmYzJOb1pXUjFiR1Z5U0c5dmF5QTlJRzVsZHlCVWNtRnVjM0J2Y25SVFkyaGxaSFZzWlhKSWIyOXJLSFJvYVhNcE8xeHVJQ0FnSUNBZ0lDQjBhR2x6TG5OamFHVmtkV3hsY2k1aFpHUW9kR2hwY3k1ZlgzTmphR1ZrZFd4bGNraHZiMnNzSUVsdVptbHVhWFI1S1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2MzQmxaV1FnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2MzUnZjRnh1SUNBZ0lDQWdJQ0J1WlhoMFVHOXphWFJwYjI0Z1BTQkpibVpwYm1sMGVUdGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxsOWZjM2x1WTFSeVlXNXpjRzl5ZEdWa1UzQmxaV1FvZEdsdFpTd2djRzl6YVhScGIyNHNJREFwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJSFZ1YzJOb1pXUjFiR1VnZEhKaGJuTndiM0owSUdsMGMyVnNabHh1SUNBZ0lDQWdJQ0IwYUdsekxuTmphR1ZrZFd4bGNpNXlaVzF2ZG1Vb2RHaHBjeTVmWDNOamFHVmtkV3hsY2todmIyc3BPMXh1SUNBZ0lDQWdJQ0JrWld4bGRHVWdkR2hwY3k1ZlgzTmphR1ZrZFd4bGNraHZiMnM3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0F2THlCamFHRnVaMlVnYzNCbFpXUWdkMmwwYUc5MWRDQnlaWFpsY25OcGJtY2daR2x5WldOMGFXOXVYRzRnSUNBZ0lDQWdJSFJvYVhNdVgxOXplVzVqVkhKaGJuTndiM0owWldSVGNHVmxaQ2gwYVcxbExDQndiM05wZEdsdmJpd2djM0JsWldRcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5KbGMyVjBUbVY0ZEZCdmMybDBhVzl1S0c1bGVIUlFiM05wZEdsdmJpazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUZrWkNCaElIUnBiV1VnWlc1bmFXNWxJSFJ2SUhSb1pTQjBjbUZ1YzNCdmNuUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUdWdVoybHVaU0JsYm1kcGJtVWdkRzhnWW1VZ1lXUmtaV1FnZEc4Z2RHaGxJSFJ5WVc1emNHOXlkRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2NHOXphWFJwYjI0Z2MzUmhjblFnY0c5emFYUnBiMjVjYmlBZ0lDb3ZYRzRnSUdGa1pDaGxibWRwYm1Vc0lITjBZWEowVUc5emFYUnBiMjRnUFNBdFNXNW1hVzVwZEhrc0lHVnVaRkJ2YzJsMGFXOXVJRDBnU1c1bWFXNXBkSGtzSUc5bVpuTmxkRkJ2YzJsMGFXOXVJRDBnYzNSaGNuUlFiM05wZEdsdmJpa2dlMXh1SUNBZ0lIWmhjaUIwY21GdWMzQnZjblJsWkNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0JwWmlBb2IyWm1jMlYwVUc5emFYUnBiMjRnUFQwOUlDMUpibVpwYm1sMGVTbGNiaUFnSUNBZ0lHOW1abk5sZEZCdmMybDBhVzl1SUQwZ01EdGNibHh1SUNBZ0lHbG1JQ2hsYm1kcGJtVXViV0Z6ZEdWeUtWeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWIySnFaV04wSUdoaGN5QmhiSEpsWVdSNUlHSmxaVzRnWVdSa1pXUWdkRzhnWVNCdFlYTjBaWEpjSWlrN1hHNWNiaUFnSUNCcFppQW9aVzVuYVc1bExtbHRjR3hsYldWdWRITlVjbUZ1YzNCdmNuUmxaQ2dwS1Z4dUlDQWdJQ0FnZEhKaGJuTndiM0owWldRZ1BTQnVaWGNnVkhKaGJuTndiM0owWldSVWNtRnVjM0J2Y25SbFpDaDBhR2x6TENCbGJtZHBibVVzSUhOMFlYSjBVRzl6YVhScGIyNHNJR1Z1WkZCdmMybDBhVzl1TENCdlptWnpaWFJRYjNOcGRHbHZiaWs3WEc0Z0lDQWdaV3h6WlNCcFppQW9aVzVuYVc1bExtbHRjR3hsYldWdWRITlRjR1ZsWkVOdmJuUnliMnhzWldRb0tTbGNiaUFnSUNBZ0lIUnlZVzV6Y0c5eWRHVmtJRDBnYm1WM0lGUnlZVzV6Y0c5eWRHVmtVM0JsWldSRGIyNTBjbTlzYkdWa0tIUm9hWE1zSUdWdVoybHVaU3dnYzNSaGNuUlFiM05wZEdsdmJpd2daVzVrVUc5emFYUnBiMjRzSUc5bVpuTmxkRkJ2YzJsMGFXOXVLVHRjYmlBZ0lDQmxiSE5sSUdsbUlDaGxibWRwYm1VdWFXMXdiR1Z0Wlc1MGMxTmphR1ZrZFd4bFpDZ3BLVnh1SUNBZ0lDQWdkSEpoYm5Od2IzSjBaV1FnUFNCdVpYY2dWSEpoYm5Od2IzSjBaV1JUWTJobFpIVnNaV1FvZEdocGN5d2daVzVuYVc1bExDQnpkR0Z5ZEZCdmMybDBhVzl1TENCbGJtUlFiM05wZEdsdmJpd2diMlptYzJWMFVHOXphWFJwYjI0cE8xeHVJQ0FnSUdWc2MyVmNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltOWlhbVZqZENCallXNXViM1FnWW1VZ1lXUmtaV1FnZEc4Z1lTQjBjbUZ1YzNCdmNuUmNJaWs3WEc1Y2JpQWdJQ0JwWmlBb2RISmhibk53YjNKMFpXUXBJSHRjYmlBZ0lDQWdJSFpoY2lCemNHVmxaQ0E5SUhSb2FYTXVYMTl6Y0dWbFpEdGNibHh1SUNBZ0lDQWdkR2hwY3k1ZlgyVnVaMmx1WlhNdWNIVnphQ2hsYm1kcGJtVXBPMXh1SUNBZ0lDQWdkR2hwY3k1ZlgzUnlZVzV6Y0c5eWRHVmtMbkIxYzJnb2RISmhibk53YjNKMFpXUXBPMXh1WEc0Z0lDQWdJQ0IwY21GdWMzQnZjblJsWkM1elpYUlVjbUZ1YzNCdmNuUmxaQ2gwYUdsekxDQW9ibVY0ZEVWdVoybHVaVkJ2YzJsMGFXOXVJRDBnYm5Wc2JDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBdkx5QnlaWE5sZEU1bGVIUlFiM05wZEdsdmJseHVJQ0FnSUNBZ0lDQjJZWElnYzNCbFpXUWdQU0IwYUdsekxsOWZjM0JsWldRN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0hOd1pXVmtJQ0U5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHNWxlSFJGYm1kcGJtVlFiM05wZEdsdmJpQTlQVDBnYm5Wc2JDbGNiaUFnSUNBZ0lDQWdJQ0FnSUc1bGVIUkZibWRwYm1WUWIzTnBkR2x2YmlBOUlIUnlZVzV6Y0c5eWRHVmtMbk41Ym1OUWIzTnBkR2x2YmloMGFHbHpMbU4xY25KbGJuUlVhVzFsTENCMGFHbHpMbU4xY25KbGJuUlFiM05wZEdsdmJpd2djM0JsWldRcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnZG1GeUlHNWxlSFJRYjNOcGRHbHZiaUE5SUhSb2FYTXVYMTkwY21GdWMzQnZjblJSZFdWMVpTNXRiM1psS0hSeVlXNXpjRzl5ZEdWa0xDQnVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNHBPMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjbVZ6WlhST1pYaDBVRzl6YVhScGIyNG9ibVY0ZEZCdmMybDBhVzl1S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTd2dLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQXZMeUJuWlhSRGRYSnlaVzUwVkdsdFpWeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEM1elkyaGxaSFZzWlhJdVkzVnljbVZ1ZEZScGJXVTdYRzRnSUNBZ0lDQjlMQ0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQzh2SUdkbGRDQmpkWEp5Wlc1MFVHOXphWFJwYjI1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMTkwY21GdWMzQnZjblF1WTNWeWNtVnVkRkJ2YzJsMGFXOXVJQzBnZEdocGN5NWZYMjltWm5ObGRGQnZjMmwwYVc5dU8xeHVJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJR2xtSUNoemNHVmxaQ0FoUFQwZ01Da2dlMXh1SUNBZ0lDQWdJQ0F2THlCemVXNWpJR0Z1WkNCemRHRnlkRnh1SUNBZ0lDQWdJQ0IyWVhJZ2JtVjRkRVZ1WjJsdVpWQnZjMmwwYVc5dUlEMGdkSEpoYm5Od2IzSjBaV1F1YzNsdVkxQnZjMmwwYVc5dUtIUm9hWE11WTNWeWNtVnVkRlJwYldVc0lIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVMQ0J6Y0dWbFpDazdYRzRnSUNBZ0lDQWdJSFpoY2lCdVpYaDBVRzl6YVhScGIyNGdQU0IwYUdsekxsOWZkSEpoYm5Od2IzSjBVWFZsZFdVdWFXNXpaWEowS0hSeVlXNXpjRzl5ZEdWa0xDQnVaWGgwUlc1bmFXNWxVRzl6YVhScGIyNHBPMXh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZ6WlhST1pYaDBVRzl6YVhScGIyNG9ibVY0ZEZCdmMybDBhVzl1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdkSEpoYm5Od2IzSjBaV1E3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1VtVnRiM1psSUdFZ2RHbHRaU0JsYm1kcGJtVWdabkp2YlNCMGFHVWdkSEpoYm5Od2IzSjBYRzRnSUNBcUlFQndZWEpoYlNCN2IySnFaV04wZlNCbGJtZHBibVZQY2xSeVlXNXpjRzl5ZEdWa0lHVnVaMmx1WlNCdmNpQjBjbUZ1YzNCdmNuUmxaQ0IwYnlCaVpTQnlaVzF2ZG1Wa0lHWnliMjBnZEdobElIUnlZVzV6Y0c5eWRGeHVJQ0FnS2k5Y2JpQWdjbVZ0YjNabEtHVnVaMmx1WlU5eVZISmhibk53YjNKMFpXUXBJSHRjYmlBZ0lDQjJZWElnWlc1bmFXNWxJRDBnWlc1bmFXNWxUM0pVY21GdWMzQnZjblJsWkR0Y2JpQWdJQ0IyWVhJZ2RISmhibk53YjNKMFpXUWdQU0J5WlcxdmRtVkRiM1Z3YkdVb2RHaHBjeTVmWDJWdVoybHVaWE1zSUhSb2FYTXVYMTkwY21GdWMzQnZjblJsWkN3Z1pXNW5hVzVsVDNKVWNtRnVjM0J2Y25SbFpDazdYRzVjYmlBZ0lDQnBaaUFvSVhSeVlXNXpjRzl5ZEdWa0tTQjdYRzRnSUNBZ0lDQmxibWRwYm1VZ1BTQnlaVzF2ZG1WRGIzVndiR1VvZEdocGN5NWZYM1J5WVc1emNHOXlkR1ZrTENCMGFHbHpMbDlmWlc1bmFXNWxjeXdnWlc1bmFXNWxUM0pVY21GdWMzQnZjblJsWkNrN1hHNGdJQ0FnSUNCMGNtRnVjM0J2Y25SbFpDQTlJR1Z1WjJsdVpVOXlWSEpoYm5Od2IzSjBaV1E3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dWdVoybHVaU0FtSmlCMGNtRnVjM0J2Y25SbFpDa2dlMXh1SUNBZ0lDQWdkbUZ5SUc1bGVIUlFiM05wZEdsdmJpQTlJSFJvYVhNdVgxOTBjbUZ1YzNCdmNuUlJkV1YxWlM1eVpXMXZkbVVvZEhKaGJuTndiM0owWldRcE8xeHVYRzRnSUNBZ0lDQjBjbUZ1YzNCdmNuUmxaQzV5WlhObGRFbHVkR1Z5Wm1GalpTZ3BPMXh1SUNBZ0lDQWdkSEpoYm5Od2IzSjBaV1F1WkdWemRISnZlU2dwTzF4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1ZlgzTndaV1ZrSUNFOVBTQXdLVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxjMlYwVG1WNGRGQnZjMmwwYVc5dUtHNWxlSFJRYjNOcGRHbHZiaWs3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltOWlhbVZqZENCb1lYTWdibTkwSUdKbFpXNGdZV1JrWldRZ2RHOGdkR2hwY3lCMGNtRnVjM0J2Y25SY0lpazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRkpsYlc5MlpTQmhiR3dnZEdsdFpTQmxibWRwYm1WeklHWnliMjBnZEdobElIUnlZVzV6Y0c5eWRGeHVJQ0FnS2k5Y2JpQWdZMnhsWVhJb0tTQjdYRzRnSUNBZ2RHaHBjeTV6ZVc1alUzQmxaV1FvZEdocGN5NWpkWEp5Wlc1MFZHbHRaU3dnZEdocGN5NWpkWEp5Wlc1MFVHOXphWFJwYjI0c0lEQXBPMXh1WEc0Z0lDQWdabTl5SUNoMllYSWdkSEpoYm5Od2IzSjBaV1FnYjJZZ2RHaHBjeTVmWDNSeVlXNXpjRzl5ZEdWa0tTQjdYRzRnSUNBZ0lDQjBjbUZ1YzNCdmNuUmxaQzV5WlhObGRFbHVkR1Z5Wm1GalpTZ3BPMXh1SUNBZ0lDQWdkSEpoYm5Od2IzSjBaV1F1WkdWemRISnZlU2dwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSeVlXNXpjRzl5ZERzaVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbi8qKlxuICogRVM2IEltcGxlbWVudGF0aW9uIG9mIGEgYmluYXJ5IGhlYXAgYmFzZWQgb24gOlxuICogaHR0cDovL2ludGVyYWN0aXZlcHl0aG9uLm9yZy9jb3Vyc2VsaWIvc3RhdGljL3B5dGhvbmRzL1RyZWVzL2hlYXAuaHRtbFxuICpcbiAqIFRoZSBIZWFwIGNsYXNzIGlzIGFuIGFic3RyYWN0aW9uIG9mIHRoZSBiaW5hcnkgaGVhcC4gSXQgaXMgaW1wbGVtZW50ZWQgdG9cbiAqIGdpdmUgbWV0aG9kcyByZWxhdGVkIHRvIGJvdGggbWluIGFuZCBtYXggaGVhcHMuXG4gKlxuICogQGF1dGhvcjogUmVuYXVkIFZpbmNlbnQgaHR0cHM6Ly9naXRodWIuY29tL3JlbmF1ZGZ2XG4gKiovXG5cbnZhciBIZWFwID0gKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gSGVhcCgpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgSGVhcCk7XG5cblx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0XHR0aGlzLmhlYXBMaXN0ID0gW107XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoSGVhcCwge1xuXHRcdF9fcGVyY1VwOiB7XG5cblx0XHRcdC8vIEFic3RyYWN0IG1ldGhvZCB3aGljaCBicmluZ3MgZWxlbWVudHMgdXAgdGhlIHRyZWUgZnJvbSB0aGUgaSBpbmRleC5cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY1VwKGkpIHt9XG5cdFx0fSxcblx0XHRfX3BlcmNEb3duOiB7XG5cblx0XHRcdC8vIEFic3RyYWN0IG1ldGhvZCB3aGljaCBicmluZ3MgZWxlbWVudHMgZG93biB0aGUgdHJlZSBmcm9tIHRoZSBpIGluZGV4LlxuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gX19wZXJjRG93bihpKSB7fVxuXHRcdH0sXG5cdFx0dXBkYXRlOiB7XG5cblx0XHRcdC8vIFVwZGF0ZXNcblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShvYmplY3QpIHt9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0Ly8gUmVtb3ZlcyBhbiBvYmplY3QgZnJvbSB0aGUgaGVhcCwgaXRlbSBiZWluZyByZWZlcmluZyB0byB0aGUgbmVzdGVkIG9iamVjdFxuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKG9iamVjdCkge31cblx0XHR9LFxuXHRcdGJ1aWxkSGVhcDoge1xuXG5cdFx0XHQvLyBCdWlsZCB0aGUgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXRcblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJ1aWxkSGVhcChsaXN0KSB7fVxuXHRcdH0sXG5cdFx0ZW1wdHk6IHtcblxuXHRcdFx0Ly8gQ2xlYXIgdGhlIGxpc3QgYnkgcmVwbGFjaW5nIGl0IHdpdGggdGhlIGFwcHJvcHJpYXRlIHN3YXAgb2JqZWN0XG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBlbXB0eSgpIHt9XG5cdFx0fSxcblx0XHRpbnNlcnQ6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBJbnNlcnQgYSB2YWx1ZSB3aXRoIGFuIGFzc29jaWF0ZWQgb2JqZWN0IGluIHRoZSBoZWFwIHRyZWUuIFRoZSBwZXJjIHVwXG4gICAgKiBtZXRob2QgaW1wbGVtZW50YXRpb24gc2hvdWxkIGhhbmRsZSB3aGF0IHRvIGRvIHdpdGggdGhlIGhlYXBWYWx1ZSAoZWcgbWluXG4gICAgKiBvciBtYXggc29ydGluZykuXG4gICAgKlxuICAgICogQHBhcmFtcyB2YWx1ZSBiZWluZyB0aGUgaGVhcFZhbHVlIHVzZWQgZm9yIHNvcnRpbmcgYW5kIGFueSBvYmplY3RcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5zZXJ0KHZhbHVlKSB7XG5cdFx0XHRcdHZhciBvYmplY3QgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5cIik7XG5cdFx0XHRcdHRoaXMuaGVhcExpc3QucHVzaCh7XG5cdFx0XHRcdFx0b2JqZWN0OiBvYmplY3QsXG5cdFx0XHRcdFx0aGVhcFZhbHVlOiB2YWx1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5jdXJyZW50U2l6ZSsrO1xuXHRcdFx0XHR0aGlzLl9fcGVyY1VwKHRoaXMuY3VycmVudFNpemUpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGVsZXRlSGVhZDoge1xuXG5cdFx0XHQvKipcbiAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgaGVhZCBvZiB0aGUgaGVhcCBsaXN0LiBQdXRzIGl0IGF0IHRoZSBlbmQgb2ZcbiAgICAqIHRoZSBsaXN0IGFuZCB0YWtlcyBpdCBvdXQgd2l0aCBwb3AuIEFzc3VyZXMgdGhhdCB0aGUgdHJlZSBpcyByZXN0b3JlZC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZGVsZXRlSGVhZCgpIHtcblx0XHRcdFx0dmFyIHJlZmVyZW5jZVZhbHVlID0gdGhpcy5oZWFwTGlzdFsxXTsgLy8gcG9zIDAgYmVpbmcgdXNlZCBmb3IgcGVyY29sYXRpbmdcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFsxXSA9IHRoaXMuaGVhcExpc3RbdGhpcy5jdXJyZW50U2l6ZV07IC8vIGZpcnN0IGl0ZW0gaXMgbGFzdFxuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplLS07XG5cdFx0XHRcdHRoaXMuaGVhcExpc3QucG9wKCk7XG5cdFx0XHRcdHRoaXMuX19wZXJjRG93bigxKTsgLy8gZnJvbSBmaXJzdCBpdGVtLCByZXN0b3JlIHRyZWVcblx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZVZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhZE9iamVjdDoge1xuXG5cdFx0XHQvKipcbiAgICAqIFJldHVybnMgb2JqZWN0IHJlZmVyZW5jZSBvZiBoZWFkIHdpdGhvdXQgcmVtb3ZpbmcgaXQuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGhlYWRPYmplY3QoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmhlYXBMaXN0WzFdLm9iamVjdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhlYWRWYWx1ZToge1xuXG5cdFx0XHQvKipcbiAgICAqIFJldHVybnMgdmFsdWUgcmVmZXJlbmNlIG9mIGhlYWQgd2l0aG91dCByZW1vdmluZyBpdC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaGVhZFZhbHVlKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFwTGlzdFsxXS5oZWFwVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsaXN0OiB7XG5cblx0XHRcdC8qKlxuICAgICogTGlzdCBhY2Nlc3NvclxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBsaXN0KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFwTGlzdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNpemU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBDdXJyZW50IHNpemUgYWNjZXNzb3JcbiAgICAqL1xuXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY3VycmVudFNpemU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb250YWluczoge1xuXG5cdFx0XHQvKipcbiAgICAqIElmIHRoZSBoZWFwIGNvbnRhaW5zIHRoZSBvYmplY3QsIGl0IHdpbGwgcmV0dXJuIGl0cyBpbmRleCwgb3RoZXJ3aXNlIGl0XG4gICAgKiByZXR1cm5zIC0xLlxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBjb250YWlucyhvYmplY3QpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gdGhpcy5jdXJyZW50U2l6ZTsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0VtcHR5OiB7XG5cblx0XHRcdC8qKlxuICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgaGVhcCBpcyBlbXB0eS5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY3VycmVudFNpemUgPT09IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gSGVhcDtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wbEJVMDBzU1VGQlNUdEJRVVZGTEZWQlJrNHNTVUZCU1N4SFFVVkxPM2RDUVVaVUxFbEJRVWs3TzBGQlIxSXNUVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGNrSXNUVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU03UlVGRGJrSTdPMk5CVEVrc1NVRkJTVHRCUVZGVUxGVkJRVkU3T3pzN1ZVRkJRU3hyUWtGQlF5eERRVUZETEVWQlFVVXNSVUZCUlRzN1FVRkhaQ3haUVVGVk96czdPMVZCUVVFc2IwSkJRVU1zUTBGQlF5eEZRVUZGTEVWQlFVVTdPMEZCUjJoQ0xGRkJRVTA3T3pzN1ZVRkJRU3huUWtGQlF5eE5RVUZOTEVWQlFVVXNSVUZCUlRzN1FVRkhha0lzVVVGQlRUczdPenRWUVVGQkxHZENRVUZETEUxQlFVMHNSVUZCUlN4RlFVRkZPenRCUVVkcVFpeFhRVUZUT3pzN08xVkJRVUVzYlVKQlFVTXNTVUZCU1N4RlFVRkZMRVZCUVVVN08wRkJSMnhDTEU5QlFVczdPenM3VlVGQlFTeHBRa0ZCUnl4RlFVRkZPenRCUVZOV0xGRkJRVTA3T3pzN096czdPenM3VlVGQlFTeG5Ra0ZCUXl4TFFVRkxMRVZCUVdVN1VVRkJZaXhOUVVGTkxHZERRVUZITEVWQlFVVTdPMEZCUTNoQ0xGZEJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVFN1FVRkRha0lzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRiRUlzWVVGQlZTeE5RVUZOTzBGQlEyaENMR2RDUVVGaExFdEJRVXM3UzBGRGJFSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1VVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlEyNUNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMGxCUTJoRE96dEJRVTFFTEZsQlFWVTdPenM3T3pzN1ZVRkJRU3h6UWtGQlJ6dEJRVU5hTEZGQlFVa3NZMEZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZEVNc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTnVSQ3hSUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdRVUZEYmtJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTndRaXhSUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1Q0xGZEJRVThzWTBGQll5eERRVUZETzBsQlEzUkNPenRCUVV0RUxGbEJRVlU3T3pzN096dFZRVUZCTEhOQ1FVRkhPMEZCUTFvc1YwRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJRenRKUVVNdlFqczdRVUZMUkN4WFFVRlRPenM3T3pzN1ZVRkJRU3h4UWtGQlJ6dEJRVU5ZTEZkQlFVOHNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTTdTVUZEYkVNN08wRkJTMFFzVFVGQlNUczdPenM3TzFWQlFVRXNaMEpCUVVjN1FVRkRUaXhYUVVGUExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdTVUZEY2tJN08wRkJTMGNzVFVGQlNUczdPenM3TzFGQlFVRXNXVUZCUnp0QlFVTldMRmRCUVU4c1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF6dEpRVU40UWpzN1FVRk5SQ3hWUVVGUk96czdPenM3TzFWQlFVRXNhMEpCUVVNc1RVRkJUU3hGUVVGRk8wRkJRMmhDTEZOQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRek5ETEZOQlFVa3NUVUZCVFN4TFFVRkxMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNaRExHRkJRVThzUTBGQlF5eERRVUZETzAxQlExUTdTMEZEUkR0QlFVTkVMRmRCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03U1VGRFZqczdRVUZMUkN4VFFVRlBPenM3T3pzN1ZVRkJRU3h0UWtGQlJ6dEJRVU5VTEZkQlFVOHNTVUZCU1N4RFFVRkRMRmRCUVZjc1MwRkJTeXhEUVVGRExFTkJRVU03U1VGRE9VSTdPenM3VVVGeVIwa3NTVUZCU1RzN08wRkJlVWRXTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRElpd2labWxzWlNJNkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dSVk0ySUVsdGNHeGxiV1Z1ZEdGMGFXOXVJRzltSUdFZ1ltbHVZWEo1SUdobFlYQWdZbUZ6WldRZ2IyNGdPbHh1SUNvZ2FIUjBjRG92TDJsdWRHVnlZV04wYVhabGNIbDBhRzl1TG05eVp5OWpiM1Z5YzJWc2FXSXZjM1JoZEdsakwzQjVkR2h2Ym1SekwxUnlaV1Z6TDJobFlYQXVhSFJ0YkZ4dUlDcGNiaUFxSUZSb1pTQklaV0Z3SUdOc1lYTnpJR2x6SUdGdUlHRmljM1J5WVdOMGFXOXVJRzltSUhSb1pTQmlhVzVoY25rZ2FHVmhjQzRnU1hRZ2FYTWdhVzF3YkdWdFpXNTBaV1FnZEc5Y2JpQXFJR2RwZG1VZ2JXVjBhRzlrY3lCeVpXeGhkR1ZrSUhSdklHSnZkR2dnYldsdUlHRnVaQ0J0WVhnZ2FHVmhjSE11WEc0Z0tseHVJQ29nUUdGMWRHaHZjam9nVW1WdVlYVmtJRlpwYm1ObGJuUWdhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0psYm1GMVpHWjJYRzRnS2lvdlhHNWpiR0Z6Y3lCSVpXRndJSHRjYmx4dVhIUmpiMjV6ZEhKMVkzUnZjaWdwSUh0Y2JseDBYSFIwYUdsekxtTjFjbkpsYm5SVGFYcGxJRDBnTUR0Y2JseDBYSFIwYUdsekxtaGxZWEJNYVhOMElEMGdXMTA3WEc1Y2RIMWNibHh1WEhRdkx5QkJZbk4wY21GamRDQnRaWFJvYjJRZ2QyaHBZMmdnWW5KcGJtZHpJR1ZzWlcxbGJuUnpJSFZ3SUhSb1pTQjBjbVZsSUdaeWIyMGdkR2hsSUdrZ2FXNWtaWGd1WEc1Y2RGOWZjR1Z5WTFWd0tHa3BJSHQ5WEc1Y2JseDBMeThnUVdKemRISmhZM1FnYldWMGFHOWtJSGRvYVdOb0lHSnlhVzVuY3lCbGJHVnRaVzUwY3lCa2IzZHVJSFJvWlNCMGNtVmxJR1p5YjIwZ2RHaGxJR2tnYVc1a1pYZ3VYRzVjZEY5ZmNHVnlZMFJ2ZDI0b2FTa2dlMzFjYmx4dVhIUXZMeUJWY0dSaGRHVnpJRnh1WEhSMWNHUmhkR1VvYjJKcVpXTjBLU0I3ZlZ4dVhHNWNkQzh2SUZKbGJXOTJaWE1nWVc0Z2IySnFaV04wSUdaeWIyMGdkR2hsSUdobFlYQXNJR2wwWlcwZ1ltVnBibWNnY21WbVpYSnBibWNnZEc4Z2RHaGxJRzVsYzNSbFpDQnZZbXBsWTNSY2JseDBjbVZ0YjNabEtHOWlhbVZqZENrZ2UzMWNibHh1WEhRdkx5QkNkV2xzWkNCMGFHVWdhR1ZoY0NCbWNtOXRJR0Z1SUc5aWFtVmpkQ0JzYVhOMElHRnVaQ0J6ZEhKMVkzUjFjbVVnYVhSY2JseDBZblZwYkdSSVpXRndLR3hwYzNRcElIdDlYRzVjYmx4MEx5OGdRMnhsWVhJZ2RHaGxJR3hwYzNRZ1lua2djbVZ3YkdGamFXNW5JR2wwSUhkcGRHZ2dkR2hsSUdGd2NISnZjSEpwWVhSbElITjNZWEFnYjJKcVpXTjBYRzVjZEdWdGNIUjVLQ2tnZTMxY2JseHVYSFF2S2lwY2JseDBJQ29nU1c1elpYSjBJR0VnZG1Gc2RXVWdkMmwwYUNCaGJpQmhjM052WTJsaGRHVmtJRzlpYW1WamRDQnBiaUIwYUdVZ2FHVmhjQ0IwY21WbExpQlVhR1VnY0dWeVl5QjFjRnh1WEhRZ0tpQnRaWFJvYjJRZ2FXMXdiR1Z0Wlc1MFlYUnBiMjRnYzJodmRXeGtJR2hoYm1Sc1pTQjNhR0YwSUhSdklHUnZJSGRwZEdnZ2RHaGxJR2hsWVhCV1lXeDFaU0FvWldjZ2JXbHVYRzVjZENBcUlHOXlJRzFoZUNCemIzSjBhVzVuS1M1Y2JseDBJQ3BjYmx4MElDb2dRSEJoY21GdGN5QjJZV3gxWlNCaVpXbHVaeUIwYUdVZ2FHVmhjRlpoYkhWbElIVnpaV1FnWm05eUlITnZjblJwYm1jZ1lXNWtJR0Z1ZVNCdlltcGxZM1JjYmx4MElDb3ZYRzVjZEdsdWMyVnlkQ2gyWVd4MVpTd2diMkpxWldOMElEMGdlMzBwSUh0Y2JseDBYSFJqYjI1emIyeGxMbXh2WnlnbmFXNG5LVnh1WEhSY2RIUm9hWE11YUdWaGNFeHBjM1F1Y0hWemFDaDdYRzVjZEZ4MFhIUW5iMkpxWldOMEp6b2diMkpxWldOMExGeHVYSFJjZEZ4MEoyaGxZWEJXWVd4MVpTYzZJSFpoYkhWbFhHNWNkRngwZlNrN1hHNWNkRngwZEdocGN5NWpkWEp5Wlc1MFUybDZaU3NyTzF4dVhIUmNkSFJvYVhNdVgxOXdaWEpqVlhBb2RHaHBjeTVqZFhKeVpXNTBVMmw2WlNrN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dUV1YwYUc5a0lIVnpaV1FnZEc4Z1oyVjBJSFJvWlNCb1pXRmtJRzltSUhSb1pTQm9aV0Z3SUd4cGMzUXVJRkIxZEhNZ2FYUWdZWFFnZEdobElHVnVaQ0J2Wmx4dVhIUWdLaUIwYUdVZ2JHbHpkQ0JoYm1RZ2RHRnJaWE1nYVhRZ2IzVjBJSGRwZEdnZ2NHOXdMaUJCYzNOMWNtVnpJSFJvWVhRZ2RHaGxJSFJ5WldVZ2FYTWdjbVZ6ZEc5eVpXUXVYRzVjZENBcUwxeHVYSFJrWld4bGRHVklaV0ZrS0NrZ2UxeHVYSFJjZEhaaGNpQnlaV1psY21WdVkyVldZV3gxWlNBOUlIUm9hWE11YUdWaGNFeHBjM1JiTVYwN0lDOHZJSEJ2Y3lBd0lHSmxhVzVuSUhWelpXUWdabTl5SUhCbGNtTnZiR0YwYVc1blhHNWNkRngwZEdocGN5NW9aV0Z3VEdsemRGc3hYU0E5SUhSb2FYTXVhR1ZoY0V4cGMzUmJkR2hwY3k1amRYSnlaVzUwVTJsNlpWMDdJQzh2SUdacGNuTjBJR2wwWlcwZ2FYTWdiR0Z6ZEZ4dVhIUmNkSFJvYVhNdVkzVnljbVZ1ZEZOcGVtVXRMVHRjYmx4MFhIUjBhR2x6TG1obFlYQk1hWE4wTG5CdmNDZ3BPMXh1WEhSY2RIUm9hWE11WDE5d1pYSmpSRzkzYmlneEtUc2dMeThnWm5KdmJTQm1hWEp6ZENCcGRHVnRMQ0J5WlhOMGIzSmxJSFJ5WldWY2JseDBYSFJ5WlhSMWNtNGdjbVZtWlhKbGJtTmxWbUZzZFdVN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dVbVYwZFhKdWN5QnZZbXBsWTNRZ2NtVm1aWEpsYm1ObElHOW1JR2hsWVdRZ2QybDBhRzkxZENCeVpXMXZkbWx1WnlCcGRDNWNibHgwSUNvdlhHNWNkR2hsWVdSUFltcGxZM1FvS1NCN1hHNWNkRngwY21WMGRYSnVJSFJvYVhNdWFHVmhjRXhwYzNSYk1WMHViMkpxWldOME8xeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRkpsZEhWeWJuTWdkbUZzZFdVZ2NtVm1aWEpsYm1ObElHOW1JR2hsWVdRZ2QybDBhRzkxZENCeVpXMXZkbWx1WnlCcGRDNWNibHgwSUNvdlhHNWNkR2hsWVdSV1lXeDFaU2dwSUh0Y2JseDBYSFJ5WlhSMWNtNGdkR2hwY3k1b1pXRndUR2x6ZEZzeFhTNW9aV0Z3Vm1Gc2RXVTdYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nVEdsemRDQmhZMk5sYzNOdmNseHVYSFFnS2k5Y2JseDBiR2x6ZENncElIdGNibHgwWEhSeVpYUjFjbTRnZEdocGN5NW9aV0Z3VEdsemREdGNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJEZFhKeVpXNTBJSE5wZW1VZ1lXTmpaWE56YjNKY2JseDBJQ292WEc1Y2RHZGxkQ0J6YVhwbEtDa2dlMXh1WEhSY2RISmxkSFZ5YmlCMGFHbHpMbU4xY25KbGJuUlRhWHBsTzF4dVhIUjlYRzVjYmx4MEx5b3FYRzVjZENBcUlFbG1JSFJvWlNCb1pXRndJR052Ym5SaGFXNXpJSFJvWlNCdlltcGxZM1FzSUdsMElIZHBiR3dnY21WMGRYSnVJR2wwY3lCcGJtUmxlQ3dnYjNSb1pYSjNhWE5sSUdsMFhHNWNkQ0FxSUhKbGRIVnlibk1nTFRFdVhHNWNkQ0FxTDF4dVhIUmpiMjUwWVdsdWN5aHZZbXBsWTNRcElIdGNibHgwWEhSbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOFBTQjBhR2x6TG1OMWNuSmxiblJUYVhwbE95QnBLeXNwSUh0Y2JseDBYSFJjZEdsbUlDaHZZbXBsWTNRZ1BUMDlJSFJvYVhNdWFHVmhjRXhwYzNSYmFWMHViMkpxWldOMEtTQjdYRzVjZEZ4MFhIUmNkSEpsZEhWeWJpQnBPMXh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHgwWEhSeVpYUjFjbTRnTFRFN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dVbVYwZFhKdWN5QjNhR1YwYUdWeUlHOXlJRzV2ZENCMGFHVWdhR1ZoY0NCcGN5QmxiWEIwZVM1Y2JseDBJQ292WEc1Y2RHbHpSVzF3ZEhrb0tTQjdYRzVjZEZ4MGNtVjBkWEp1SUhSb2FYTXVZM1Z5Y21WdWRGTnBlbVVnUFQwOUlEQTdYRzVjZEgxY2JseHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVobFlYQTdJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIEhlYXAgPSByZXF1aXJlKFwiLi9oZWFwXCIpO1xuLyoqXG4gKiBFUzYgSW1wbGVtZW50YXRpb24gb2YgYSBtYXhpbXVtIGJpbmFyeSBoZWFwIGJhc2VkIG9uIDpcbiAqIGh0dHA6Ly9pbnRlcmFjdGl2ZXB5dGhvbi5vcmcvY291cnNlbGliL3N0YXRpYy9weXRob25kcy9UcmVlcy9oZWFwLmh0bWxcbiAqXG4gKiBUaGUgaGVhZCAob3IgcG9zaXRpb24gMSBpbiB0aGUgYXJyYXkpIHNob3VsZCBiZSB0aGUgb2JqZWN0IHdpdGggbWF4aW1hbCBoZWFwXG4gKiB2YWx1ZS5cbiAqXG4gKiBAYXV0aG9yOiBSZW5hdWQgVmluY2VudCBodHRwczovL2dpdGh1Yi5jb20vcmVuYXVkZnZcbiAqKi9cblxudmFyIE1heEhlYXAgPSAoZnVuY3Rpb24gKF9IZWFwKSB7XG5cdGZ1bmN0aW9uIE1heEhlYXAoKSB7XG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1heEhlYXApO1xuXG5cdFx0X2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoTWF4SGVhcC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcyk7XG5cdFx0Ly8gRW1wdHkgb2JqZWN0IHdpdGggbWF4aW1hbCB2YWx1ZSB1c2VkIGZvciBzd2FwaW5nIG9uIHRoZSBmaXJzdCBpbnNlcnRpb25zXG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRvYmplY3Q6IHt9LFxuXHRcdFx0aGVhcFZhbHVlOiBJbmZpbml0eVxuXHRcdH1dO1xuXHR9XG5cblx0X2luaGVyaXRzKE1heEhlYXAsIF9IZWFwKTtcblxuXHRfY3JlYXRlQ2xhc3MoTWF4SGVhcCwge1xuXHRcdF9fbWF4Q2hpbGRQb3NpdGlvbjoge1xuXG5cdFx0XHQvKipcbiAgICAqIFN0YXRpYyBtZXRob2QgdXNlZCB0byBnZXQgdGhlIGluZGV4IG9mIHRoZSBtaW5pbWFsIGNoaWxkIGF0IGkuIFVzZWQgaW5cbiAgICAqIHBlcmNEb3duIHRvIGNvbXBhcmUgYSBwYXJlbnQgdG8gaXRzIGNoaWxkLlxuICAgICpcbiAgICAqIEBwYXJhbXMgaSwgdGhlIGluZGV4IG9mIHRoZSBwYXJlbnQgdG8gb2JzZXJ2ZVxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBfX21heENoaWxkUG9zaXRpb24oaSkge1xuXHRcdFx0XHRpZiAoaSAqIDIgKyAxID4gdGhpcy5jdXJyZW50U2l6ZSB8fCB0aGlzLmhlYXBMaXN0W2kgKiAyXS5oZWFwVmFsdWUgPiB0aGlzLmhlYXBMaXN0W2kgKiAyICsgMV0uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGkgKiAyOyAvLyBMZWZ0IGNoaWxkXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGkgKiAyICsgMTsgLy8gUmlnaHQgY2hpbGRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0X19wZXJjVXA6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWF4IGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG4gICAgKiB1c2VkIGxvY2FsbHkgZnJvbSB0aGUgZW5kIG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBpbnNlcnRpb24sIHVwZGF0ZSBhbmRcbiAgICAqIHJlbW92YWwuIEl0IHBlcmNvbGF0ZXMgbWF4IHZhbHVlcyB1cCB0aGUgYmluYXJ5IHRyZWUuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY1VwKGkpIHtcblx0XHRcdFx0dmFyIGNlaWxlZEluZGV4LCB0bXA7XG5cblx0XHRcdFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHRcdFx0XHRcdGNlaWxlZEluZGV4ID0gTWF0aC5mbG9vcihpIC8gMik7XG5cdFx0XHRcdFx0Ly8gSXMgdGhlIGl0ZW0gYXQgaSBncmVhdGVyIHRoYW4gdGhlIG9uZSBhdCBjZWlsZWQgaW5kZXhcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPiB0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XS5oZWFwVmFsdWUpIHtcblx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF0gPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpID0gY2VpbGVkSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdF9fcGVyY0Rvd246IHtcblxuXHRcdFx0LyoqXG4gICAgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWluIGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG4gICAgKiB1c2VkIGxvY2FsbHkgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGhlYXAgbGlzdCB1cG9uIGRlbGV0aW9uLiBJdGVtcyBhcmVcbiAgICAqIHN3YXBlZCBkb3duIHRoZSB0cmVlIGlmIHRoZXkgaGF2ZSBhIHNtYWxsZXIgcmVmZXJlbmNlIHZhbHVlLlxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBfX3BlcmNEb3duKGkpIHtcblx0XHRcdFx0dmFyIHJlZlBvcywgdG1wO1xuXG5cdFx0XHRcdHdoaWxlIChpICogMiA8PSB0aGlzLmN1cnJlbnRTaXplKSB7XG5cdFx0XHRcdFx0cmVmUG9zID0gdGhpcy5fX21heENoaWxkUG9zaXRpb24oaSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmUG9zKTtcblx0XHRcdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIHNtYWxsZXIgdGhhbiB0aGUgcmVmZXJlbmNlIGRvd24gdGhlIHRyZWVcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPCB0aGlzLmhlYXBMaXN0W3JlZlBvc10uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRoaXMuaGVhcExpc3RbcmVmUG9zXTtcblx0XHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbcmVmUG9zXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpID0gcmVmUG9zO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1cGRhdGU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kIHRoZSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYW5kIHVwZGF0ZSBpdHMgaGVhcFZhbHVlLlxuICAgICogVGhlIHRyZWUgc2hvdWxkIHRoZSBiZSBzb3J0ZWQgdXNpbmcgcGVyYyB1cCB0byBicmluZyB0aGUgbmV4dCBkZXNpcmVkIHZhbHVlXG4gICAgKiBhcyB0aGUgaGVhZC5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5jb250YWlucyhvYmplY3QpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleCk7XG5cdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YXIgcmVmID0gdGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlO1xuXHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbaW5kZXhdLmhlYXBWYWx1ZSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKHZhbHVlIDwgcmVmKSB0aGlzLl9fcGVyY0Rvd24oaW5kZXgpO2Vsc2UgdGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5jdXJyZW50U2l6ZTsgaSsrKSB7XG5cdFx0XHRcdC8vIFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0Ly8gXHRcdHZhciByZWYgPSB0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZTtcblx0XHRcdFx0Ly8gXHRcdHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID0gdmFsdWU7XG5cblx0XHRcdFx0Ly8gXHRcdGlmKHZhbHVlIDwgcmVmKVxuXHRcdFx0XHQvLyBcdFx0XHR0aGlzLl9fcGVyY0Rvd24oaSk7XG5cdFx0XHRcdC8vIFx0XHRlbHNlXG5cdFx0XHRcdC8vIFx0XHRcdHRoaXMuX19wZXJjVXAoaSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kcyB0aGUgaXRlbSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYnJpbmdzIGl0IHVwIHRoZSB0cmVlIGJ5XG4gICAgKiBoYXZpbmcgYW4gaW5maW5pdHkgdmFsdWUuIFRoZSB0cmVlIGlzIHRoZSBzb3J0ZWQgYW5kIHRoZSBoZWFkIGlzIHJlbW92ZWQuXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShvYmplY3QpIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5jb250YWlucyhvYmplY3QpO1xuXG5cdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHR0aGlzLmhlYXBMaXN0W2luZGV4XS5oZWFwVmFsdWUgPSAwO1xuXHRcdFx0XHRcdHRoaXMuX19wZXJjVXAoaW5kZXgpO1xuXHRcdFx0XHRcdHRoaXMuZGVsZXRlSGVhZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZm9yICh2YXIgaSA9IDA7IGkgPD0gdGhpcy5jdXJyZW50U2l6ZTsgaSsrKSB7XG5cdFx0XHRcdC8vIFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0Ly8gXHRcdHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID0gSW5maW5pdHk7XG5cdFx0XHRcdC8vIFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHRcdFx0XHQvLyBcdFx0dGhpcy5kZWxldGVIZWFkKCk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9XG5cblx0XHRcdFx0aWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmhlYWRWYWx1ZSgpO1xuXHRcdFx0XHR9cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnVpbGRIZWFwOiB7XG5cblx0XHRcdC8qKlxuICAgICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1heGltYWwgc3dhcFxuICAgICogcmVmZXJlbmNlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJ1aWxkSGVhcChsaXN0KSB7XG5cdFx0XHRcdHRoaXMuY3VycmVudFNpemUgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRcdFx0b2JqZWN0OiB7fSxcblx0XHRcdFx0XHRoZWFwVmFsdWU6IEluZmluaXR5XG5cdFx0XHRcdH1dLmNvbmNhdChsaXN0KTtcblxuXHRcdFx0XHR2YXIgaSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoaSA+IDApIHtcblx0XHRcdFx0XHR0aGlzLl9fcGVyY0Rvd24oaSk7XG5cdFx0XHRcdFx0aS0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlbXB0eToge1xuXG5cdFx0XHQvKipcbiAgICAqIENsZWFyIHRoZSBsaXN0IHdpdGggYSBtYXhpbWFsIGhlYXBWYWx1ZSBzd2FwIHJlZmVyZW5jZVxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBlbXB0eSgpIHtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRcdFx0b2JqZWN0OiB7fSxcblx0XHRcdFx0XHRoZWFwVmFsdWU6IEluZmluaXR5XG5cdFx0XHRcdH1dO1xuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBNYXhIZWFwO1xufSkoSGVhcCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWF4SGVhcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGQlFTeEpRVUZKTEVsQlFVa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03T3pzN096czdPenM3TzBsQlZYWkNMRTlCUVU4N1FVRkZSQ3hWUVVaT0xFOUJRVThzUjBGRlJUdDNRa0ZHVkN4UFFVRlBPenRCUVVkWUxHMURRVWhKTEU5QlFVOHNOa05CUjBnN08wRkJSVklzVFVGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4RFFVRkRPMEZCUTJoQ0xGZEJRVlVzUlVGQlJUdEJRVU5hTEdOQlFXRXNVVUZCVVR0SFFVTnlRaXhEUVVGRExFTkJRVU03UlVGRFNEczdWMEZVU1N4UFFVRlBPenRqUVVGUUxFOUJRVTg3UVVGcFFsb3NiMEpCUVd0Q096czdPenM3T3pzN1ZVRkJRU3cwUWtGQlF5eERRVUZETEVWQlFVVTdRVUZEY2tJc1VVRkJTU3hCUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFbEJReTlDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1UwRkJVeXhCUVVGRExFVkJRVVU3UVVGRGRrVXNXVUZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wdEJRMklzVFVGQlRUdEJRVU5PTEZsQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UzBGRGFrSTdTVUZEUkRzN1FVRlBSQ3hWUVVGUk96czdPenM3T3p0VlFVRkJMR3RDUVVGRExFTkJRVU1zUlVGQlJUdEJRVU5ZTEZGQlFVa3NWMEZCVnl4RlFVRkZMRWRCUVVjc1EwRkJRenM3UVVGRmNrSXNWMEZCVHl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkROMElzWjBKQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZhRU1zVTBGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExGTkJRVk1zUjBGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExGTkJRVk1zUlVGQlJUdEJRVU4yUlN4VFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZkQlFWY3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZET1VNc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SFFVRkhMRU5CUVVNN1RVRkRka0k3TzBGQlJVUXNUVUZCUXl4SFFVRkhMRmRCUVZjc1EwRkJRenRMUVVOb1FqdEpRVU5FT3p0QlFVOUVMRmxCUVZVN096czdPenM3TzFWQlFVRXNiMEpCUVVNc1EwRkJReXhGUVVGRk8wRkJRMklzVVVGQlNTeE5RVUZOTEVWQlFVVXNSMEZCUnl4RFFVRkRPenRCUVVWb1FpeFhRVUZQTEVGQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTzBGQlEyNURMRmRCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNFTXNXVUZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6czdRVUZGY0VJc1UwRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVOcVJTeFRRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU4yUWl4VlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGVrTXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVOQlFVTTdUVUZETlVJN08wRkJSVVFzVFVGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXp0TFFVTllPMGxCUTBRN08wRkJUMFFzVVVGQlRUczdPenM3T3pzN1ZVRkJRU3huUWtGQlF5eE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkZPMEZCUTNKQ0xGRkJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGJFTXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU51UWl4UlFVRkhMRXRCUVVzc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU5vUWl4VFFVRkpMRWRCUVVjc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVONlF5eFRRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTTdPMEZCUlhSRExGTkJRVWtzUzBGQlN5eEhRVUZITEVkQlFVY3NSVUZEWkN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEV0QlJYWkNMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTMEZEZGtJN096czdPenM3T3pzN096dEJRVUZCTEVsQldVUTdPMEZCVFVRc1VVRkJUVHM3T3pzN096dFZRVUZCTEdkQ1FVRkRMRTFCUVUwc1JVRkJSVHRCUVVOa0xGRkJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03TzBGQlJXeERMRkZCUVVjc1MwRkJTeXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlEyaENMRk5CUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNVMEZCVXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVF5eFRRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRM0pDTEZOQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRMUVVOc1FqczdPenM3T3pzN096dEJRVlZFTEZGQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRMnhDTEZsQlFVOHNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wdEJRVUVzUVVGRmVrSXNUMEZCVHl4UlFVRlJMRU5CUVVNN1NVRkRhRUk3TzBGQlRVUXNWMEZCVXpzN096czdPenRWUVVGQkxHMUNRVUZETEVsQlFVa3NSVUZCUlR0QlFVTm1MRkZCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTXZRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTTdRVUZEYUVJc1lVRkJWU3hGUVVGRk8wRkJRMW9zWjBKQlFXRXNVVUZCVVR0TFFVTnlRaXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVWb1FpeFJRVUZKTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRM0JDTEZkQlFVOHNRMEZCUXl4SFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVObUxGTkJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRia0lzVFVGQlF5eEZRVUZGTEVOQlFVTTdTMEZEU2p0SlFVTkVPenRCUVV0RUxFOUJRVXM3T3pzN096dFZRVUZCTEdsQ1FVRkhPMEZCUTFBc1VVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETzBGQlEyaENMR0ZCUVZVc1JVRkJSVHRCUVVOYUxHZENRVUZoTEZGQlFWRTdTMEZEY2tJc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRja0k3T3pzN1VVRjZTa2tzVDBGQlR6dEhRVUZUTEVsQlFVazdPMEZCTmtveFFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReUlzSW1acGJHVWlPaUpsY3pZdmRYUnBiSE12Y0hKcGIzSnBkSGt0Y1hWbGRXVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdTR1ZoY0NBOUlISmxjWFZwY21Vb0p5NHZhR1ZoY0NjcE8xeHVMeW9xWEc0Z0tpQkZVellnU1cxd2JHVnRaVzUwWVhScGIyNGdiMllnWVNCdFlYaHBiWFZ0SUdKcGJtRnllU0JvWldGd0lHSmhjMlZrSUc5dUlEcGNiaUFxSUdoMGRIQTZMeTlwYm5SbGNtRmpkR2wyWlhCNWRHaHZiaTV2Y21jdlkyOTFjbk5sYkdsaUwzTjBZWFJwWXk5d2VYUm9iMjVrY3k5VWNtVmxjeTlvWldGd0xtaDBiV3hjYmlBcVhHNGdLaUJVYUdVZ2FHVmhaQ0FvYjNJZ2NHOXphWFJwYjI0Z01TQnBiaUIwYUdVZ1lYSnlZWGtwSUhOb2IzVnNaQ0JpWlNCMGFHVWdiMkpxWldOMElIZHBkR2dnYldGNGFXMWhiQ0JvWldGd1hHNGdLaUIyWVd4MVpTNWNiaUFxWEc0Z0tpQkFZWFYwYUc5eU9pQlNaVzVoZFdRZ1ZtbHVZMlZ1ZENCb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNtVnVZWFZrWm5aY2JpQXFLaTljYm1Oc1lYTnpJRTFoZUVobFlYQWdaWGgwWlc1a2N5QklaV0Z3SUh0Y2JseHVYSFJqYjI1emRISjFZM1J2Y2lncElIdGNibHgwWEhSemRYQmxjaWdwTzF4dVhIUmNkQzh2SUVWdGNIUjVJRzlpYW1WamRDQjNhWFJvSUcxaGVHbHRZV3dnZG1Gc2RXVWdkWE5sWkNCbWIzSWdjM2RoY0dsdVp5QnZiaUIwYUdVZ1ptbHljM1FnYVc1elpYSjBhVzl1YzF4dVhIUmNkSFJvYVhNdWFHVmhjRXhwYzNRZ1BTQmJlMXh1WEhSY2RGeDBKMjlpYW1WamRDYzZJSHQ5TEZ4dVhIUmNkRngwSjJobFlYQldZV3gxWlNjNklFbHVabWx1YVhSNVhHNWNkRngwZlYwN1hHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dVM1JoZEdsaklHMWxkR2h2WkNCMWMyVmtJSFJ2SUdkbGRDQjBhR1VnYVc1a1pYZ2diMllnZEdobElHMXBibWx0WVd3Z1kyaHBiR1FnWVhRZ2FTNGdWWE5sWkNCcGJseHVYSFFnS2lCd1pYSmpSRzkzYmlCMGJ5QmpiMjF3WVhKbElHRWdjR0Z5Wlc1MElIUnZJR2wwY3lCamFHbHNaQzVjYmx4MElDcGNibHgwSUNvZ1FIQmhjbUZ0Y3lCcExDQjBhR1VnYVc1a1pYZ2diMllnZEdobElIQmhjbVZ1ZENCMGJ5QnZZbk5sY25abFhHNWNkQ0FxTDF4dVhIUmZYMjFoZUVOb2FXeGtVRzl6YVhScGIyNG9hU2tnZTF4dVhIUmNkR2xtSUNnb2FTQXFJRElnS3lBeElENGdkR2hwY3k1amRYSnlaVzUwVTJsNlpTa2dmSHhjYmx4MFhIUmNkQ2gwYUdsekxtaGxZWEJNYVhOMFcya2dLaUF5WFM1b1pXRndWbUZzZFdVZ1BzS2dkR2hwY3k1b1pXRndUR2x6ZEZ0cElDb2dNaUFySURGZExtaGxZWEJXWVd4MVpTa3BJSHRjYmx4MFhIUmNkSEpsZEhWeWJpQnBJQ29nTWpzZ0x5OGdUR1ZtZENCamFHbHNaRnh1WEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSeVpYUjFjbTRnYVNBcUlESWdLeUF4T3lBdkx5QlNhV2RvZENCamFHbHNaRnh1WEhSY2RIMWNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJOWlhSb2IyUWdkWE5sWkNCMGJ5QnRZV2x1ZEdGcGJpQjBhR1VnYldGNElHaGxZWEFnY0hKdmNHVnlkSGtnWm5KdmJTQmhJR05sY25SaGFXNGdhVzVrWlhndUlFbDBJR2x6WEc1Y2RDQXFJSFZ6WldRZ2JHOWpZV3hzZVNCbWNtOXRJSFJvWlNCbGJtUWdiMllnZEdobElHaGxZWEFnYkdsemRDQjFjRzl1SUdsdWMyVnlkR2x2Yml3Z2RYQmtZWFJsSUdGdVpGeHVYSFFnS2lCeVpXMXZkbUZzTGlCSmRDQndaWEpqYjJ4aGRHVnpJRzFoZUNCMllXeDFaWE1nZFhBZ2RHaGxJR0pwYm1GeWVTQjBjbVZsTGx4dVhIUWdLaTljYmx4MFgxOXdaWEpqVlhBb2FTa2dlMXh1WEhSY2RIWmhjaUJqWldsc1pXUkpibVJsZUN3Z2RHMXdPMXh1WEc1Y2RGeDBkMmhwYkdVZ0tFMWhkR2d1Wm14dmIzSW9hU0F2SURJcElENGdNQ2tnZTF4dVhIUmNkRngwWTJWcGJHVmtTVzVrWlhnZ1BTQk5ZWFJvTG1ac2IyOXlLR2tnTHlBeUtUdGNibHgwWEhSY2RDOHZJRWx6SUhSb1pTQnBkR1Z0SUdGMElHa2daM0psWVhSbGNpQjBhR0Z1SUhSb1pTQnZibVVnWVhRZ1kyVnBiR1ZrSUdsdVpHVjRYRzVjZEZ4MFhIUnBaaUFvZEdocGN5NW9aV0Z3VEdsemRGdHBYUzVvWldGd1ZtRnNkV1VnUGlEQ29IUm9hWE11YUdWaGNFeHBjM1JiWTJWcGJHVmtTVzVrWlhoZExtaGxZWEJXWVd4MVpTa2dlMXh1WEhSY2RGeDBYSFIwYlhBZ1BTQjBhR2x6TG1obFlYQk1hWE4wVzJObGFXeGxaRWx1WkdWNFhUdGNibHgwWEhSY2RGeDBkR2hwY3k1b1pXRndUR2x6ZEZ0alpXbHNaV1JKYm1SbGVGMGdQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRPMXh1WEhSY2RGeDBYSFIwYUdsekxtaGxZWEJNYVhOMFcybGRJRDBnZEcxd08xeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUnBJRDBnWTJWcGJHVmtTVzVrWlhnN1hHNWNkRngwZlZ4dVhIUjlYRzVjYmx4MEx5b3FYRzVjZENBcUlFMWxkR2h2WkNCMWMyVmtJSFJ2SUcxaGFXNTBZV2x1SUhSb1pTQnRhVzRnYUdWaGNDQndjbTl3WlhKMGVTQm1jbTl0SUdFZ1kyVnlkR0ZwYmlCcGJtUmxlQzRnU1hRZ2FYTmNibHgwSUNvZ2RYTmxaQ0JzYjJOaGJHeDVJR1p5YjIwZ2RHaGxJSE4wWVhKMElHOW1JSFJvWlNCb1pXRndJR3hwYzNRZ2RYQnZiaUJrWld4bGRHbHZiaTRnU1hSbGJYTWdZWEpsWEc1Y2RDQXFJSE4zWVhCbFpDQmtiM2R1SUhSb1pTQjBjbVZsSUdsbUlIUm9aWGtnYUdGMlpTQmhJSE50WVd4c1pYSWdjbVZtWlhKbGJtTmxJSFpoYkhWbExseHVYSFFnS2k5Y2JseDBYMTl3WlhKalJHOTNiaWhwS1NCN1hHNWNkRngwZG1GeUlISmxabEJ2Y3l3Z2RHMXdPMXh1WEc1Y2RGeDBkMmhwYkdVZ0tDaHBJQ29nTWlrZ1BEMGdkR2hwY3k1amRYSnlaVzUwVTJsNlpTa2dlMXh1WEhSY2RGeDBjbVZtVUc5eklEMGdkR2hwY3k1ZlgyMWhlRU5vYVd4a1VHOXphWFJwYjI0b2FTazdYRzVjZEZ4MFhIUmpiMjV6YjJ4bExteHZaeWh5WldaUWIzTXBPMXh1WEhSY2RGeDBMeThnU1hNZ2RHaGxJR2wwWlcwZ1lYUWdhU0J6YldGc2JHVnlJSFJvWVc0Z2RHaGxJSEpsWm1WeVpXNWpaU0JrYjNkdUlIUm9aU0IwY21WbFhHNWNkRngwWEhScFppQW9kR2hwY3k1b1pXRndUR2x6ZEZ0cFhTNW9aV0Z3Vm1Gc2RXVWdQQ0IwYUdsekxtaGxZWEJNYVhOMFczSmxabEJ2YzEwdWFHVmhjRlpoYkhWbEtTQjdYRzVjZEZ4MFhIUmNkSFJ0Y0NBOUlIUm9hWE11YUdWaGNFeHBjM1JiYVYwN1hHNWNkRngwWEhSY2RIUm9hWE11YUdWaGNFeHBjM1JiYVYwZ1BTQjBhR2x6TG1obFlYQk1hWE4wVzNKbFpsQnZjMTA3WEc1Y2RGeDBYSFJjZEhSb2FYTXVhR1ZoY0V4cGMzUmJjbVZtVUc5elhTQTlJSFJ0Y0R0Y2JseDBYSFJjZEgxY2JseHVYSFJjZEZ4MGFTQTlJSEpsWmxCdmN6dGNibHgwWEhSOVhHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dSbWx1WkNCMGFHVWdiMkpxWldOMElISmxabVZ5Wlc1alpTQnBiaUIwYUdVZ2FHVmhjQ0JzYVhOMElHRnVaQ0IxY0dSaGRHVWdhWFJ6SUdobFlYQldZV3gxWlM1Y2JseDBJQ29nVkdobElIUnlaV1VnYzJodmRXeGtJSFJvWlNCaVpTQnpiM0owWldRZ2RYTnBibWNnY0dWeVl5QjFjQ0IwYnlCaWNtbHVaeUIwYUdVZ2JtVjRkQ0JrWlhOcGNtVmtJSFpoYkhWbFhHNWNkQ0FxSUdGeklIUm9aU0JvWldGa0xseHVYSFFnS2k5Y2JseDBkWEJrWVhSbEtHOWlhbVZqZEN3Z2RtRnNkV1VwSUh0Y2JseDBYSFIyWVhJZ2FXNWtaWGdnUFNCMGFHbHpMbU52Ym5SaGFXNXpLRzlpYW1WamRDazdYRzVjZEZ4MFkyOXVjMjlzWlM1c2IyY29hVzVrWlhncE8xeHVYSFJjZEdsbUtHbHVaR1Y0SUNFOVBTQXRNU2tnZTF4dVhIUmNkRngwZG1GeUlISmxaaUE5SUhSb2FYTXVhR1ZoY0V4cGMzUmJhVzVrWlhoZExtaGxZWEJXWVd4MVpUdGNibHgwWEhSY2RIUm9hWE11YUdWaGNFeHBjM1JiYVc1a1pYaGRMbWhsWVhCV1lXeDFaU0E5SUhaaGJIVmxPMXh1WEc1Y2RGeDBYSFJjZEdsbUlDaDJZV3gxWlNBOElISmxaaWxjYmx4MFhIUmNkRngwWEhSMGFHbHpMbDlmY0dWeVkwUnZkMjRvYVc1a1pYZ3BPMXh1WEhSY2RGeDBYSFJsYkhObFhHNWNkRngwWEhSY2RGeDBkR2hwY3k1ZlgzQmxjbU5WY0NocGJtUmxlQ2s3WEc1Y2RGeDBmVnh1WEhSY2RDOHZJR1p2Y2lBb2RtRnlJR2tnUFNBeE95QnBJRHc5SUhSb2FYTXVZM1Z5Y21WdWRGTnBlbVU3SUdrckt5a2dlMXh1WEhSY2RDOHZJRngwYVdZZ0tHOWlhbVZqZENBOVBUMGdkR2hwY3k1b1pXRndUR2x6ZEZ0cFhTNXZZbXBsWTNRcElIdGNibHgwWEhRdkx5QmNkRngwZG1GeUlISmxaaUE5SUhSb2FYTXVhR1ZoY0V4cGMzUmJhVjB1YUdWaGNGWmhiSFZsTzF4dVhIUmNkQzh2SUZ4MFhIUjBhR2x6TG1obFlYQk1hWE4wVzJsZExtaGxZWEJXWVd4MVpTQTlJSFpoYkhWbE8xeHVYRzVjZEZ4MEx5OGdYSFJjZEdsbUtIWmhiSFZsSUR3Z2NtVm1LVnh1WEhSY2RDOHZJRngwWEhSY2RIUm9hWE11WDE5d1pYSmpSRzkzYmlocEtUdGNibHgwWEhRdkx5QmNkRngwWld4elpWeHVYSFJjZEM4dklGeDBYSFJjZEhSb2FYTXVYMTl3WlhKalZYQW9hU2s3WEc1Y2RGeDBMeThnWEhSOVhHNWNkRngwTHk4Z2ZWeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRVpwYm1SeklIUm9aU0JwZEdWdElHOWlhbVZqZENCeVpXWmxjbVZ1WTJVZ2FXNGdkR2hsSUdobFlYQWdiR2x6ZENCaWNtbHVaM01nYVhRZ2RYQWdkR2hsSUhSeVpXVWdZbmxjYmx4MElDb2dhR0YyYVc1bklHRnVJR2x1Wm1sdWFYUjVJSFpoYkhWbExpQlVhR1VnZEhKbFpTQnBjeUIwYUdVZ2MyOXlkR1ZrSUdGdVpDQjBhR1VnYUdWaFpDQnBjeUJ5WlcxdmRtVmtMbHh1WEhRZ0tpOWNibHgwY21WdGIzWmxLRzlpYW1WamRDa2dlMXh1WEhSY2RIWmhjaUJwYm1SbGVDQTlJSFJvYVhNdVkyOXVkR0ZwYm5Nb2IySnFaV04wS1R0Y2JseHVYSFJjZEdsbUtHbHVaR1Y0SUNFOVBTQXRNU2tnZTF4dVhIUmNkRngwZEdocGN5NW9aV0Z3VEdsemRGdHBibVJsZUYwdWFHVmhjRlpoYkhWbElEMGdNRHRjYmx4MFhIUmNkSFJvYVhNdVgxOXdaWEpqVlhBb2FXNWtaWGdwTzF4dVhIUmNkRngwZEdocGN5NWtaV3hsZEdWSVpXRmtLQ2s3WEc1Y2RGeDBmVnh1WEc1Y2RGeDBMeThnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUEQwZ2RHaHBjeTVqZFhKeVpXNTBVMmw2WlRzZ2FTc3JLU0I3WEc1Y2RGeDBMeThnWEhScFppQW9iMkpxWldOMElEMDlQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRMbTlpYW1WamRDa2dlMXh1WEhSY2RDOHZJRngwWEhSMGFHbHpMbWhsWVhCTWFYTjBXMmxkTG1obFlYQldZV3gxWlNBOUlFbHVabWx1YVhSNU8xeHVYSFJjZEM4dklGeDBYSFIwYUdsekxsOWZjR1Z5WTFWd0tHa3BPMXh1WEhSY2RDOHZJRngwWEhSMGFHbHpMbVJsYkdWMFpVaGxZV1FvS1R0Y2JseDBYSFF2THlCY2RIMWNibHgwWEhRdkx5QjlYRzVjYmx4MFhIUnBaaUFvSVhSb2FYTXVhWE5GYlhCMGVTZ3BLVnh1WEhSY2RGeDBjbVYwZFhKdUlIUm9hWE11YUdWaFpGWmhiSFZsS0NrN1hHNWNibHgwWEhSeVpYUjFjbTRnU1c1bWFXNXBkSGs3WEc1Y2RIMWNibHh1WEhRdktpcGNibHgwSUNvZ1FuVnBiR1FnYUdWaGNDQm1jbTl0SUdGdUlHOWlhbVZqZENCc2FYTjBJR0Z1WkNCemRISjFZM1IxY21VZ2FYUWdkMmwwYUNCaElHMWhlR2x0WVd3Z2MzZGhjRnh1WEhRZ0tpQnlaV1psY21WdVkyVmNibHgwSUNvdlhHNWNkR0oxYVd4a1NHVmhjQ2hzYVhOMEtTQjdYRzVjZEZ4MGRHaHBjeTVqZFhKeVpXNTBVMmw2WlNBOUlHeHBjM1F1YkdWdVozUm9PMXh1WEhSY2RIUm9hWE11YUdWaGNFeHBjM1FnUFNCYmUxeHVYSFJjZEZ4MEoyOWlhbVZqZENjNklIdDlMRnh1WEhSY2RGeDBKMmhsWVhCV1lXeDFaU2M2SUVsdVptbHVhWFI1WEc1Y2RGeDBmVjB1WTI5dVkyRjBLR3hwYzNRcE8xeHVYRzVjZEZ4MGRtRnlJR2tnUFNCc2FYTjBMbXhsYm1kMGFEdGNibHgwWEhSM2FHbHNaU0FvYWNLZ0lENGd3cUF3S1NCN1hHNWNkRngwWEhSMGFHbHpMbDlmY0dWeVkwUnZkMjRvYVNrN1hHNWNkRngwWEhScExTMDdYRzVjZEZ4MGZWeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRU5zWldGeUlIUm9aU0JzYVhOMElIZHBkR2dnWVNCdFlYaHBiV0ZzSUdobFlYQldZV3gxWlNCemQyRndJSEpsWm1WeVpXNWpaVnh1WEhRZ0tpOWNibHgwWlcxd2RIa29LU0I3WEc1Y2RGeDBkR2hwY3k1b1pXRndUR2x6ZENBOUlGdDdYRzVjZEZ4MFhIUW5iMkpxWldOMEp6b2dlMzBzWEc1Y2RGeDBYSFFuYUdWaGNGWmhiSFZsSnpvZ1NXNW1hVzVwZEhsY2JseDBYSFI5WFR0Y2JseDBYSFIwYUdsekxtTjFjbkpsYm5SVGFYcGxJRDBnTUR0Y2JseDBmVnh1WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUV0Y0U0dWaGNEc2lYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2tcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2luaGVyaXRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfZ2V0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXRcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3NcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIEhlYXAgPSByZXF1aXJlKFwiLi9oZWFwXCIpO1xuLyoqXG4gKiBFUzYgSW1wbGVtZW50YXRpb24gb2YgYSBtaW5pbXVtIGJpbmFyeSBoZWFwIGJhc2VkIG9uIDpcbiAqIGh0dHA6Ly9pbnRlcmFjdGl2ZXB5dGhvbi5vcmcvY291cnNlbGliL3N0YXRpYy9weXRob25kcy9UcmVlcy9oZWFwLmh0bWxcbiAqXG4gKiBUaGUgaGVhZCAob3IgcG9zaXRpb24gMSBpbiB0aGUgYXJyYXkpIHNob3VsZCBiZSB0aGUgb2JqZWN0IHdpdGggbWluaW1hbCBoZWFwXG4gKiB2YWx1ZS5cbiAqXG4gKiBAYXV0aG9yOiBSZW5hdWQgVmluY2VudCBodHRwczovL2dpdGh1Yi5jb20vcmVuYXVkZnZcbiAqKi9cblxudmFyIE1pbkhlYXAgPSAoZnVuY3Rpb24gKF9IZWFwKSB7XG5cdGZ1bmN0aW9uIE1pbkhlYXAoKSB7XG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pbkhlYXApO1xuXG5cdFx0X2dldChfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2YoTWluSGVhcC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcyk7XG5cdFx0Ly8gRW1wdHkgb2JqZWN0IHdpdGggbWluaW1hbCB2YWx1ZSB1c2VkIGZvciBzd2FwaW5nIG9uIHRoZSBmaXJzdCBpbnNlcnRpb25zXG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHRvYmplY3Q6IHt9LFxuXHRcdFx0aGVhcFZhbHVlOiAwXG5cdFx0fV07XG5cdH1cblxuXHRfaW5oZXJpdHMoTWluSGVhcCwgX0hlYXApO1xuXG5cdF9jcmVhdGVDbGFzcyhNaW5IZWFwLCB7XG5cdFx0X19taW5DaGlsZFBvc2l0aW9uOiB7XG5cblx0XHRcdC8qKlxuICAgICogU3RhdGljIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgaW5kZXggb2YgdGhlIG1pbmltYWwgY2hpbGQgYXQgaS4gVXNlZCBpblxuICAgICogcGVyY0Rvd24gdG8gY29tcGFyZSBhIHBhcmVudCB0byBpdHMgY2hpbGQuXG4gICAgKlxuICAgICogQHBhcmFtcyBpLCB0aGUgaW5kZXggb2YgdGhlIHBhcmVudCB0byBvYnNlcnZlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fbWluQ2hpbGRQb3NpdGlvbihpKSB7XG5cdFx0XHRcdGlmIChpICogMiArIDEgPiB0aGlzLmN1cnJlbnRTaXplIHx8IHRoaXMuaGVhcExpc3RbaSAqIDJdLmhlYXBWYWx1ZSA8IHRoaXMuaGVhcExpc3RbaSAqIDIgKyAxXS5oZWFwVmFsdWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gaSAqIDI7IC8vIExlZnQgY2hpbGRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gaSAqIDIgKyAxOyAvLyBSaWdodCBjaGlsZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRfX3BlcmNVcDoge1xuXG5cdFx0XHQvKipcbiAgICAqIFBlcmNvbGF0ZXMgdGhlIGl0ZW0gYXQgaSBpbmRleCB1cCB0aGUgdHJlZSBpZiBpdCBpcyBzbWFsbGVyXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY1VwKGkpIHtcblx0XHRcdFx0dmFyIHBhcmVudEluZGV4LCB0bXA7XG5cblx0XHRcdFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHRcdFx0XHRcdHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcihpIC8gMik7XG5cdFx0XHRcdFx0Ly8gSXMgdGhlIGl0ZW0gYXQgaSBzbWFsbGVyIHRoYW4gdGhlIG9uZSBhdCBjZWlsZWQgaW5kZXhcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPCB0aGlzLmhlYXBMaXN0W3BhcmVudEluZGV4XS5oZWFwVmFsdWUpIHtcblx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuaGVhcExpc3RbcGFyZW50SW5kZXhdO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtwYXJlbnRJbmRleF0gPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpID0gcGFyZW50SW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdF9fcGVyY0Rvd246IHtcblxuXHRcdFx0LyoqXG4gICAgKiBQZXJjb2xhdGVzIHRoZSBpdGVtIGF0IGkgaW5kZXggZG93biB0aGUgdHJlZSBpZiBzbWFsbGVyIHRoYW4gaXRzIGNoaWxkXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIF9fcGVyY0Rvd24oaSkge1xuXHRcdFx0XHR2YXIgY2hpbGRJbmRleCwgdG1wO1xuXG5cdFx0XHRcdHdoaWxlIChpICogMiA8PSB0aGlzLmN1cnJlbnRTaXplKSB7XG5cdFx0XHRcdFx0Y2hpbGRJbmRleCA9IHRoaXMuX19taW5DaGlsZFBvc2l0aW9uKGkpO1xuXHRcdFx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgZ3JlYXRlciB0aGFuIHRoZSByZWZlcmVuY2UgZG93biB0aGUgdHJlZVxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZSA+IHRoaXMuaGVhcExpc3RbY2hpbGRJbmRleF0uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRoaXMuaGVhcExpc3RbY2hpbGRJbmRleF07XG5cdFx0XHRcdFx0XHR0aGlzLmhlYXBMaXN0W2NoaWxkSW5kZXhdID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGkgPSBjaGlsZEluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1cGRhdGU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBGaW5kIHRoZSBvYmplY3QgcmVmZXJlbmNlIGluIHRoZSBoZWFwIGxpc3QgYW5kIHVwZGF0ZSBpdHMgaGVhcFZhbHVlLlxuICAgICogSWYgdGhlIHVwZGF0ZWQgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBvcmlnaW5hbCB2YWx1ZSwgdGhlIGl0ZW0gc2hvdWxkXG4gICAgKiBiZSBwZXJjb2xhdGVkIGRvd24gdGhlIHRyZWUsIG90aGVyd2lzZSB1cCB0aGUgdHJlZS5cbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5jb250YWlucyhvYmplY3QpO1xuXG5cdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YXIgcmVmID0gdGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlO1xuXHRcdFx0XHRcdHRoaXMuaGVhcExpc3RbaW5kZXhdLmhlYXBWYWx1ZSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKHZhbHVlID4gcmVmKSB0aGlzLl9fcGVyY0Rvd24oaW5kZXgpO2Vsc2UgdGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5jdXJyZW50U2l6ZTsgaSsrKSB7XG5cdFx0XHRcdC8vIFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0Ly8gXHRcdHZhciByZWYgPSB0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZTtcblx0XHRcdFx0Ly8gXHRcdHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID0gdmFsdWU7XG5cblx0XHRcdFx0Ly8gXHRcdGlmICh2YWx1ZSA+IHJlZilcblx0XHRcdFx0Ly8gXHRcdFx0dGhpcy5fX3BlcmNEb3duKGkpO1xuXHRcdFx0XHQvLyBcdFx0ZWxzZVxuXHRcdFx0XHQvLyBcdFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVtb3ZlOiB7XG5cblx0XHRcdC8qKlxuICAgICogRmluZHMgdGhlIGl0ZW0gb2JqZWN0IHJlZmVyZW5jZSBpbiB0aGUgaGVhcCBsaXN0IGJyaW5ncyBpdCB1cCB0aGUgdHJlZSBieVxuICAgICogaGF2aW5nIGEgLWluZmluaXR5IHZhbHVlLiBUaGUgdHJlZSBpcyB0aGUgc29ydGVkIGFuZCB0aGUgaGVhZCBpcyByZW1vdmVkLlxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZW1vdmUob2JqZWN0KSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHRoaXMuY29udGFpbnMob2JqZWN0KTtcblxuXHRcdFx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlID0gMDtcblx0XHRcdFx0XHR0aGlzLl9fcGVyY1VwKGluZGV4KTtcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZUhlYWQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHRcdFx0XHQvLyBcdGlmIChvYmplY3QgPT09IHRoaXMuaGVhcExpc3RbaV0ub2JqZWN0KSB7XG5cdFx0XHRcdC8vIFx0XHR0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZSA9IDA7XG5cdFx0XHRcdC8vIFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHRcdFx0XHQvLyBcdFx0dGhpcy5kZWxldGVIZWFkKCk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9XG5cblx0XHRcdFx0aWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmhlYWRWYWx1ZSgpO1xuXHRcdFx0XHR9cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnVpbGRIZWFwOiB7XG5cblx0XHRcdC8qKlxuICAgICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1pbmltYWwgc3dhcFxuICAgICogcmVmZXJlbmNlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJ1aWxkSGVhcChsaXN0KSB7XG5cblx0XHRcdFx0dGhpcy5jdXJyZW50U2l6ZSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0XHRcdFx0XHRvYmplY3Q6IHt9LFxuXHRcdFx0XHRcdGhlYXBWYWx1ZTogMFxuXHRcdFx0XHR9XS5jb25jYXQobGlzdCk7XG5cblx0XHRcdFx0dmFyIGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKGkgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fX3BlcmNEb3duKGkpO1xuXHRcdFx0XHRcdGktLTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZW1wdHk6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBDbGVhciB0aGUgbGlzdCB3aXRoIGEgbWluaW1hbCBoZWFwVmFsdWUgc3dhcCByZWZlcmVuY2VcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZW1wdHkoKSB7XG5cdFx0XHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0XHRcdG9iamVjdDoge30sXG5cdFx0XHRcdFx0aGVhcFZhbHVlOiAwXG5cdFx0XHRcdH1dO1xuXHRcdFx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBNaW5IZWFwO1xufSkoSGVhcCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWluSGVhcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZ6Tmk5MWRHbHNjeTl3Y21sdmNtbDBlUzF4ZFdWMVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGQlFTeEpRVUZKTEVsQlFVa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03T3pzN096czdPenM3TzBsQlZYWkNMRTlCUVU4N1FVRkZSQ3hWUVVaT0xFOUJRVThzUjBGRlJUdDNRa0ZHVkN4UFFVRlBPenRCUVVkWUxHMURRVWhKTEU5QlFVOHNOa05CUjBnN08wRkJSVklzVFVGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4RFFVRkRPMEZCUTJoQ0xGZEJRVlVzUlVGQlJUdEJRVU5hTEdOQlFXRXNRMEZCUXp0SFFVTmtMRU5CUVVNc1EwRkJRenRGUVVOSU96dFhRVlJKTEU5QlFVODdPMk5CUVZBc1QwRkJUenRCUVdsQ1dpeHZRa0ZCYTBJN096czdPenM3T3p0VlFVRkJMRFJDUVVGRExFTkJRVU1zUlVGQlJUdEJRVU55UWl4UlFVRkpMRUZCUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjc1NVRkRMMElzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eEhRVUZKTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRUZCUVVNc1JVRkJSVHRCUVVONFJTeFpRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkRZaXhOUVVGTk8wRkJRMDRzV1VGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOcVFqdEpRVU5FT3p0QlFVdEVMRlZCUVZFN096czdPenRWUVVGQkxHdENRVUZETEVOQlFVTXNSVUZCUlR0QlFVTllMRkZCUVVrc1YwRkJWeXhGUVVGRkxFZEJRVWNzUTBGQlF6czdRVUZGY2tJc1YwRkJUeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRE4wSXNaMEpCUVZjc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmFFTXNVMEZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNSMEZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETEZOQlFWTXNSVUZCUlR0QlFVTjJSU3hUUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVOcVF5eFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRmRCUVZjc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRPVU1zVlVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU03VFVGRGRrSTdPMEZCUlVRc1RVRkJReXhIUVVGSExGZEJRVmNzUTBGQlF6dExRVU5vUWp0SlFVTkVPenRCUVV0RUxGbEJRVlU3T3pzN096dFZRVUZCTEc5Q1FVRkRMRU5CUVVNc1JVRkJSVHRCUVVOaUxGRkJRVWtzVlVGQlZTeEZRVUZGTEVkQlFVY3NRMEZCUXpzN1FVRkZjRUlzVjBGQlR5eEJRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVzc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJUdEJRVU51UXl4bFFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVY0UXl4VFFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNVMEZCVXl4RlFVRkZPMEZCUTNKRkxGTkJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM1pDTEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVNM1F5eFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhIUVVGSExFZEJRVWNzUTBGQlF6dE5RVU5vUXpzN1FVRkZSQ3hOUVVGRExFZEJRVWNzVlVGQlZTeERRVUZETzB0QlEyWTdTVUZEUkRzN1FVRlBSQ3hSUVVGTk96czdPenM3T3p0VlFVRkJMR2RDUVVGRExFMUJRVTBzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY2tJc1VVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNVVUZCUnl4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVU3UVVGRGFFSXNVMEZCU1N4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRla01zVTBGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhUUVVGVExFZEJRVWNzUzBGQlN5eERRVUZET3p0QlFVVjBReXhUUVVGSkxFdEJRVXNzUjBGQlJ5eEhRVUZITEVWQlEyUXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eExRVVYyUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzB0QlEzWkNPenM3T3pzN096czdPenM3UVVGQlFTeEpRVmxFT3p0QlFVMUVMRkZCUVUwN096czdPenM3VlVGQlFTeG5Ra0ZCUXl4TlFVRk5MRVZCUVVVN1FVRkRaQ3hSUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE96dEJRVVZzUXl4UlFVRkhMRXRCUVVzc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU5vUWl4VFFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEZOQlFWTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRia01zVTBGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOeVFpeFRRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1MwRkRiRUk3T3pzN096czdPenM3UVVGVlJDeFJRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVOc1FpeFpRVUZQTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRMUVVGQkxFRkJSWHBDTEU5QlFVOHNVVUZCVVN4RFFVRkRPMGxCUTJoQ096dEJRVTFFTEZkQlFWTTdPenM3T3pzN1ZVRkJRU3h0UWtGQlF5eEpRVUZKTEVWQlFVVTdPMEZCUldZc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUXk5Q0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVkQlFVY3NRMEZCUXp0QlFVTm9RaXhoUVVGVkxFVkJRVVU3UVVGRFdpeG5Ra0ZCWVN4RFFVRkRPMHRCUTJRc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN1FVRkZhRUlzVVVGQlNTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVOd1FpeFhRVUZQTEVOQlFVTXNSMEZCU3l4RFFVRkRMRVZCUVVVN1FVRkRaaXhUUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1Q0xFMUJRVU1zUlVGQlJTeERRVUZETzB0QlEwbzdTVUZEUkRzN1FVRkxSQ3hQUVVGTE96czdPenM3VlVGQlFTeHBRa0ZCUnp0QlFVTlFMRkZCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUTBGQlF6dEJRVU5vUWl4aFFVRlZMRVZCUVVVN1FVRkRXaXhuUWtGQllTeERRVUZETzB0QlEyUXNRMEZCUXl4RFFVRkRPMEZCUTBnc1VVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEY2tJN096czdVVUZ5U2trc1QwRkJUenRIUVVGVExFbEJRVWs3TzBGQmVVb3hRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXlJc0ltWnBiR1VpT2lKbGN6WXZkWFJwYkhNdmNISnBiM0pwZEhrdGNYVmxkV1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnU0dWaGNDQTlJSEpsY1hWcGNtVW9KeTR2YUdWaGNDY3BPMXh1THlvcVhHNGdLaUJGVXpZZ1NXMXdiR1Z0Wlc1MFlYUnBiMjRnYjJZZ1lTQnRhVzVwYlhWdElHSnBibUZ5ZVNCb1pXRndJR0poYzJWa0lHOXVJRHBjYmlBcUlHaDBkSEE2THk5cGJuUmxjbUZqZEdsMlpYQjVkR2h2Ymk1dmNtY3ZZMjkxY25ObGJHbGlMM04wWVhScFl5OXdlWFJvYjI1a2N5OVVjbVZsY3k5b1pXRndMbWgwYld4Y2JpQXFYRzRnS2lCVWFHVWdhR1ZoWkNBb2IzSWdjRzl6YVhScGIyNGdNU0JwYmlCMGFHVWdZWEp5WVhrcElITm9iM1ZzWkNCaVpTQjBhR1VnYjJKcVpXTjBJSGRwZEdnZ2JXbHVhVzFoYkNCb1pXRndYRzRnS2lCMllXeDFaUzVjYmlBcVhHNGdLaUJBWVhWMGFHOXlPaUJTWlc1aGRXUWdWbWx1WTJWdWRDQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjbVZ1WVhWa1puWmNiaUFxS2k5Y2JtTnNZWE56SUUxcGJraGxZWEFnWlhoMFpXNWtjeUJJWldGd0lIdGNibHh1WEhSamIyNXpkSEoxWTNSdmNpZ3BJSHRjYmx4MFhIUnpkWEJsY2lncE8xeHVYSFJjZEM4dklFVnRjSFI1SUc5aWFtVmpkQ0IzYVhSb0lHMXBibWx0WVd3Z2RtRnNkV1VnZFhObFpDQm1iM0lnYzNkaGNHbHVaeUJ2YmlCMGFHVWdabWx5YzNRZ2FXNXpaWEowYVc5dWMxeHVYSFJjZEhSb2FYTXVhR1ZoY0V4cGMzUWdQU0JiZTF4dVhIUmNkRngwSjI5aWFtVmpkQ2M2SUh0OUxGeHVYSFJjZEZ4MEoyaGxZWEJXWVd4MVpTYzZJREJjYmx4MFhIUjlYVHRjYmx4MGZWeHVYRzVjZEM4cUtseHVYSFFnS2lCVGRHRjBhV01nYldWMGFHOWtJSFZ6WldRZ2RHOGdaMlYwSUhSb1pTQnBibVJsZUNCdlppQjBhR1VnYldsdWFXMWhiQ0JqYUdsc1pDQmhkQ0JwTGlCVmMyVmtJR2x1WEc1Y2RDQXFJSEJsY21ORWIzZHVJSFJ2SUdOdmJYQmhjbVVnWVNCd1lYSmxiblFnZEc4Z2FYUnpJR05vYVd4a0xseHVYSFFnS2x4dVhIUWdLaUJBY0dGeVlXMXpJR2tzSUhSb1pTQnBibVJsZUNCdlppQjBhR1VnY0dGeVpXNTBJSFJ2SUc5aWMyVnlkbVZjYmx4MElDb3ZYRzVjZEY5ZmJXbHVRMmhwYkdSUWIzTnBkR2x2YmlocEtTQjdYRzVjZEZ4MGFXWWdLQ2hwSUNvZ01pQXJJREVnUGlCMGFHbHpMbU4xY25KbGJuUlRhWHBsS1NCOGZGeHVYSFJjZEZ4MEtIUm9hWE11YUdWaGNFeHBjM1JiYVNBcUlESmRMbWhsWVhCV1lXeDFaU0E4SU1LZ2RHaHBjeTVvWldGd1RHbHpkRnRwSUNvZ01pQXJJREZkTG1obFlYQldZV3gxWlNrcElIdGNibHgwWEhSY2RISmxkSFZ5YmlCcElDb2dNanNnTHk4Z1RHVm1kQ0JqYUdsc1pGeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJ5WlhSMWNtNGdhU0FxSURJZ0t5QXhPeUF2THlCU2FXZG9kQ0JqYUdsc1pGeHVYSFJjZEgxY2JseDBmVnh1WEc1Y2RDOHFLbHh1WEhRZ0tpQlFaWEpqYjJ4aGRHVnpJSFJvWlNCcGRHVnRJR0YwSUdrZ2FXNWtaWGdnZFhBZ2RHaGxJSFJ5WldVZ2FXWWdhWFFnYVhNZ2MyMWhiR3hsY2x4dVhIUWdLaTljYmx4MFgxOXdaWEpqVlhBb2FTa2dlMXh1WEhSY2RIWmhjaUJ3WVhKbGJuUkpibVJsZUN3Z2RHMXdPMXh1WEc1Y2RGeDBkMmhwYkdVZ0tFMWhkR2d1Wm14dmIzSW9hU0F2SURJcElENGdNQ2tnZTF4dVhIUmNkRngwY0dGeVpXNTBTVzVrWlhnZ1BTQk5ZWFJvTG1ac2IyOXlLR2tnTHlBeUtUdGNibHgwWEhSY2RDOHZJRWx6SUhSb1pTQnBkR1Z0SUdGMElHa2djMjFoYkd4bGNpQjBhR0Z1SUhSb1pTQnZibVVnWVhRZ1kyVnBiR1ZrSUdsdVpHVjRYRzVjZEZ4MFhIUnBaaUFvZEdocGN5NW9aV0Z3VEdsemRGdHBYUzVvWldGd1ZtRnNkV1VnUENEQ29IUm9hWE11YUdWaGNFeHBjM1JiY0dGeVpXNTBTVzVrWlhoZExtaGxZWEJXWVd4MVpTa2dlMXh1WEhSY2RGeDBYSFIwYlhBZ1BTQjBhR2x6TG1obFlYQk1hWE4wVzNCaGNtVnVkRWx1WkdWNFhUdGNibHgwWEhSY2RGeDBkR2hwY3k1b1pXRndUR2x6ZEZ0d1lYSmxiblJKYm1SbGVGMGdQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRPMXh1WEhSY2RGeDBYSFIwYUdsekxtaGxZWEJNYVhOMFcybGRJRDBnZEcxd08xeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUnBJRDBnY0dGeVpXNTBTVzVrWlhnN1hHNWNkRngwZlZ4dVhIUjlYRzVjYmx4MEx5b3FYRzVjZENBcUlGQmxjbU52YkdGMFpYTWdkR2hsSUdsMFpXMGdZWFFnYVNCcGJtUmxlQ0JrYjNkdUlIUm9aU0IwY21WbElHbG1JSE50WVd4c1pYSWdkR2hoYmlCcGRITWdZMmhwYkdSY2JseDBJQ292WEc1Y2RGOWZjR1Z5WTBSdmQyNG9hU2tnZTF4dVhIUmNkSFpoY2lCamFHbHNaRWx1WkdWNExDQjBiWEE3WEc1Y2JseDBYSFIzYUdsc1pTQW9LR2tnS2lBeUtTQThQU0IwYUdsekxtTjFjbkpsYm5SVGFYcGxLU0I3WEc1Y2RGeDBYSFJqYUdsc1pFbHVaR1Y0SUQwZ2RHaHBjeTVmWDIxcGJrTm9hV3hrVUc5emFYUnBiMjRvYVNrN1hHNWNkRngwWEhRdkx5QkpjeUIwYUdVZ2FYUmxiU0JoZENCcElHZHlaV0YwWlhJZ2RHaGhiaUIwYUdVZ2NtVm1aWEpsYm1ObElHUnZkMjRnZEdobElIUnlaV1ZjYmx4MFhIUmNkR2xtSUNoMGFHbHpMbWhsWVhCTWFYTjBXMmxkTG1obFlYQldZV3gxWlNBK0lIUm9hWE11YUdWaGNFeHBjM1JiWTJocGJHUkpibVJsZUYwdWFHVmhjRlpoYkhWbEtTQjdYRzVjZEZ4MFhIUmNkSFJ0Y0NBOUlIUm9hWE11YUdWaGNFeHBjM1JiYVYwN1hHNWNkRngwWEhSY2RIUm9hWE11YUdWaGNFeHBjM1JiYVYwZ1BTQjBhR2x6TG1obFlYQk1hWE4wVzJOb2FXeGtTVzVrWlhoZE8xeHVYSFJjZEZ4MFhIUjBhR2x6TG1obFlYQk1hWE4wVzJOb2FXeGtTVzVrWlhoZElEMGdkRzF3TzF4dVhIUmNkRngwZlZ4dVhHNWNkRngwWEhScElEMGdZMmhwYkdSSmJtUmxlRHRjYmx4MFhIUjlYRzVjZEgxY2JseHVYSFF2S2lwY2JseDBJQ29nUm1sdVpDQjBhR1VnYjJKcVpXTjBJSEpsWm1WeVpXNWpaU0JwYmlCMGFHVWdhR1ZoY0NCc2FYTjBJR0Z1WkNCMWNHUmhkR1VnYVhSeklHaGxZWEJXWVd4MVpTNWNibHgwSUNvZ1NXWWdkR2hsSUhWd1pHRjBaV1FnZG1Gc2RXVWdhWE1nWjNKbFlYUmxjaUIwYUdGdUlIUm9aU0J2Y21sbmFXNWhiQ0IyWVd4MVpTd2dkR2hsSUdsMFpXMGdjMmh2ZFd4a1hHNWNkQ0FxSUdKbElIQmxjbU52YkdGMFpXUWdaRzkzYmlCMGFHVWdkSEpsWlN3Z2IzUm9aWEozYVhObElIVndJSFJvWlNCMGNtVmxMbHh1WEhRZ0tpOWNibHgwZFhCa1lYUmxLRzlpYW1WamRDd2dkbUZzZFdVcElIdGNibHgwWEhSMllYSWdhVzVrWlhnZ1BTQjBhR2x6TG1OdmJuUmhhVzV6S0c5aWFtVmpkQ2s3WEc1Y2JseDBYSFJwWmlocGJtUmxlQ0FoUFQwZ0xURXBJSHRjYmx4MFhIUmNkSFpoY2lCeVpXWWdQU0IwYUdsekxtaGxZWEJNYVhOMFcybHVaR1Y0WFM1b1pXRndWbUZzZFdVN1hHNWNkRngwWEhSMGFHbHpMbWhsWVhCTWFYTjBXMmx1WkdWNFhTNW9aV0Z3Vm1Gc2RXVWdQU0IyWVd4MVpUdGNibHh1WEhSY2RGeDBYSFJwWmlBb2RtRnNkV1VnUGlCeVpXWXBYRzVjZEZ4MFhIUmNkRngwZEdocGN5NWZYM0JsY21ORWIzZHVLR2x1WkdWNEtUdGNibHgwWEhSY2RGeDBaV3h6WlZ4dVhIUmNkRngwWEhSY2RIUm9hWE11WDE5d1pYSmpWWEFvYVc1a1pYZ3BPMXh1WEhSY2RIMWNibHgwWEhRdkx5Qm1iM0lnS0haaGNpQnBJRDBnTVRzZ2FTQThQU0IwYUdsekxtTjFjbkpsYm5SVGFYcGxPeUJwS3lzcElIdGNibHgwWEhRdkx5QmNkR2xtSUNodlltcGxZM1FnUFQwOUlIUm9hWE11YUdWaGNFeHBjM1JiYVYwdWIySnFaV04wS1NCN1hHNWNkRngwTHk4Z1hIUmNkSFpoY2lCeVpXWWdQU0IwYUdsekxtaGxZWEJNYVhOMFcybGRMbWhsWVhCV1lXeDFaVHRjYmx4MFhIUXZMeUJjZEZ4MGRHaHBjeTVvWldGd1RHbHpkRnRwWFM1b1pXRndWbUZzZFdVZ1BTQjJZV3gxWlR0Y2JseHVYSFJjZEM4dklGeDBYSFJwWmlBb2RtRnNkV1VnUGlCeVpXWXBYRzVjZEZ4MEx5OGdYSFJjZEZ4MGRHaHBjeTVmWDNCbGNtTkViM2R1S0drcE8xeHVYSFJjZEM4dklGeDBYSFJsYkhObFhHNWNkRngwTHk4Z1hIUmNkRngwZEdocGN5NWZYM0JsY21OVmNDaHBLVHRjYmx4MFhIUXZMeUJjZEgxY2JseDBYSFF2THlCOVhHNWNkSDFjYmx4dVhIUXZLaXBjYmx4MElDb2dSbWx1WkhNZ2RHaGxJR2wwWlcwZ2IySnFaV04wSUhKbFptVnlaVzVqWlNCcGJpQjBhR1VnYUdWaGNDQnNhWE4wSUdKeWFXNW5jeUJwZENCMWNDQjBhR1VnZEhKbFpTQmllVnh1WEhRZ0tpQm9ZWFpwYm1jZ1lTQXRhVzVtYVc1cGRIa2dkbUZzZFdVdUlGUm9aU0IwY21WbElHbHpJSFJvWlNCemIzSjBaV1FnWVc1a0lIUm9aU0JvWldGa0lHbHpJSEpsYlc5MlpXUXVYRzVjZENBcUwxeHVYSFJ5WlcxdmRtVW9iMkpxWldOMEtTQjdYRzVjZEZ4MGRtRnlJR2x1WkdWNElEMGdkR2hwY3k1amIyNTBZV2x1Y3lodlltcGxZM1FwTzF4dVhHNWNkRngwYVdZb2FXNWtaWGdnSVQwOUlDMHhLU0I3WEc1Y2RGeDBYSFIwYUdsekxtaGxZWEJNYVhOMFcybHVaR1Y0WFM1b1pXRndWbUZzZFdVZ1BTQXdPMXh1WEhSY2RGeDBkR2hwY3k1ZlgzQmxjbU5WY0NocGJtUmxlQ2s3WEc1Y2RGeDBYSFIwYUdsekxtUmxiR1YwWlVobFlXUW9LVHRjYmx4MFhIUjlYRzVjYmx4MFhIUXZMeUJtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4UFNCMGFHbHpMbU4xY25KbGJuUlRhWHBsT3lCcEt5c3BJSHRjYmx4MFhIUXZMeUJjZEdsbUlDaHZZbXBsWTNRZ1BUMDlJSFJvYVhNdWFHVmhjRXhwYzNSYmFWMHViMkpxWldOMEtTQjdYRzVjZEZ4MEx5OGdYSFJjZEhSb2FYTXVhR1ZoY0V4cGMzUmJhVjB1YUdWaGNGWmhiSFZsSUQwZ01EdGNibHgwWEhRdkx5QmNkRngwZEdocGN5NWZYM0JsY21OVmNDaHBLVHRjYmx4MFhIUXZMeUJjZEZ4MGRHaHBjeTVrWld4bGRHVklaV0ZrS0NrN1hHNWNkRngwTHk4Z1hIUjlYRzVjZEZ4MEx5OGdmVnh1WEc1Y2RGeDBhV1lnS0NGMGFHbHpMbWx6Ulcxd2RIa29LU2xjYmx4MFhIUmNkSEpsZEhWeWJpQjBhR2x6TG1obFlXUldZV3gxWlNncE8xeHVYRzVjZEZ4MGNtVjBkWEp1SUVsdVptbHVhWFI1TzF4dVhIUjlYRzVjYmx4MEx5b3FYRzVjZENBcUlFSjFhV3hrSUdobFlYQWdabkp2YlNCaGJpQnZZbXBsWTNRZ2JHbHpkQ0JoYm1RZ2MzUnlkV04wZFhKbElHbDBJSGRwZEdnZ1lTQnRhVzVwYldGc0lITjNZWEJjYmx4MElDb2djbVZtWlhKbGJtTmxYRzVjZENBcUwxeHVYSFJpZFdsc1pFaGxZWEFvYkdsemRDa2dlMXh1WEc1Y2RGeDBkR2hwY3k1amRYSnlaVzUwVTJsNlpTQTlJR3hwYzNRdWJHVnVaM1JvTzF4dVhIUmNkSFJvYVhNdWFHVmhjRXhwYzNRZ1BTQmJlMXh1WEhSY2RGeDBKMjlpYW1WamRDYzZJSHQ5TEZ4dVhIUmNkRngwSjJobFlYQldZV3gxWlNjNklEQmNibHgwWEhSOVhTNWpiMjVqWVhRb2JHbHpkQ2s3WEc1Y2JseDBYSFIyWVhJZ2FTQTlJR3hwYzNRdWJHVnVaM1JvTzF4dVhIUmNkSGRvYVd4bElDaHB3cUFnUGlEQ29EQXBJSHRjYmx4MFhIUmNkSFJvYVhNdVgxOXdaWEpqUkc5M2JpaHBLVHRjYmx4MFhIUmNkR2t0TFR0Y2JseDBYSFI5WEc1Y2RIMWNibHh1WEhRdktpcGNibHgwSUNvZ1EyeGxZWElnZEdobElHeHBjM1FnZDJsMGFDQmhJRzFwYm1sdFlXd2dhR1ZoY0ZaaGJIVmxJSE4zWVhBZ2NtVm1aWEpsYm1ObFhHNWNkQ0FxTDF4dVhIUmxiWEIwZVNncElIdGNibHgwWEhSMGFHbHpMbWhsWVhCTWFYTjBJRDBnVzN0Y2JseDBYSFJjZENkdlltcGxZM1FuT2lCN2ZTeGNibHgwWEhSY2RDZG9aV0Z3Vm1Gc2RXVW5PaUF3WEc1Y2RGeDBmVjA3WEc1Y2RGeDBkR2hwY3k1amRYSnlaVzUwVTJsNlpTQTlJREE3WEc1Y2RIMWNibHh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFMXBia2hsWVhBN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVja1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBNaW5IZWFwID0gcmVxdWlyZShcIi4vaGVhcC9taW4taGVhcFwiKTtcbnZhciBNYXhIZWFwID0gcmVxdWlyZShcIi4vaGVhcC9tYXgtaGVhcFwiKTtcbi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyBwcmlvcml0eSBxdWV1ZSB1c2VkIGJ5IHNjaGVkdWxlciBhbmQgdHJhbnNwb3J0c1xuICogQGF1dGhvciBOb3JiZXJ0IFNjaG5lbGwgPE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mcj5cbiAqXG4gKiBGaXJzdCByYXRoZXIgc3R1cGlkIGltcGxlbWVudGF0aW9uIHRvIGJlIG9wdGltaXplZC4uLlxuICovXG5cbnZhciBQcmlvcml0eVF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gUHJpb3JpdHlRdWV1ZSgpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJpb3JpdHlRdWV1ZSk7XG5cblx0XHR0aGlzLl9faGVhcCA9IG5ldyBNaW5IZWFwKCk7XG5cdFx0dGhpcy5fX3JldmVyc2UgPSBmYWxzZTtcblx0fVxuXG5cdF9jcmVhdGVDbGFzcyhQcmlvcml0eVF1ZXVlLCB7XG5cdFx0aW5zZXJ0OiB7XG5cblx0XHRcdC8qKlxuICAgICogSW5zZXJ0IGFuIG9iamVjdCB0byB0aGUgcXVldWVcbiAgICAqIChmb3IgdGhpcyBwcmltaXRpdmUgdmVyc2lvbjogcHJldmVudCBzb3J0aW5nIGZvciBlYWNoIGVsZW1lbnQgYnkgY2FsbGluZ1xuICAgICogd2l0aCBcImZhbHNlXCIgYXMgdGhpcmQgYXJndW1lbnQpXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluc2VydChvYmplY3QsIHRpbWUpIHtcblx0XHRcdFx0aWYgKHRpbWUgIT09IEluZmluaXR5ICYmIHRpbWUgIT09IC1JbmZpbml0eSkge1xuXHRcdFx0XHRcdC8vIGFkZCBuZXcgb2JqZWN0XG5cdFx0XHRcdFx0dGhpcy5fX2hlYXAuaW5zZXJ0KHRpbWUsIG9iamVjdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpOyAvLyByZXR1cm4gdGltZSBvZiBmaXJzdCBvYmplY3Rcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbW92ZShvYmplY3QpOyAvLyAgKioqKiBNYWtlIHN1cmUgaXRzIG5vdCBhbm90aGVyIHRpbWUgeW91J2Qgd2FudFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bW92ZToge1xuXG5cdFx0XHQvKipcbiAgICAqIE1vdmUgYW4gb2JqZWN0IHRvIGFub3RoZXIgdGltZSBpbiB0aGUgcXVldWVcbiAgICAqL1xuXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gbW92ZShvYmplY3QsIHRpbWUpIHtcblx0XHRcdFx0aWYgKHRpbWUgIT09IEluZmluaXR5ICYmIHRpbWUgIT09IC1JbmZpbml0eSkge1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX19oZWFwLmNvbnRhaW5zKG9iamVjdCkgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9faGVhcC51cGRhdGUob2JqZWN0LCB0aW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fX2hlYXAuaW5zZXJ0KHRpbWUsIG9iamVjdCk7IC8vIGFkZCBuZXcgb2JqZWN0XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlKG9iamVjdCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmU6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBSZW1vdmUgYW4gb2JqZWN0IGZyb20gdGhlIHF1ZXVlXG4gICAgKi9cblxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShvYmplY3QpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLnJlbW92ZShvYmplY3QpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2xlYXI6IHtcblxuXHRcdFx0LyoqXG4gICAgKiBDbGVhciBxdWV1ZVxuICAgICovXG5cblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRcdFx0dGhpcy5fX2hlYXAuZW1wdHkoKTtcblx0XHRcdFx0cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhZDoge1xuXG5cdFx0XHQvKipcbiAgICAqIEdldCBmaXJzdCBvYmplY3QgaW4gcXVldWVcbiAgICAqL1xuXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCF0aGlzLl9faGVhcC5pc0VtcHR5KCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fX2hlYXAuaGVhZE9iamVjdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0aW1lOiB7XG5cblx0XHRcdC8qKlxuICAgICogR2V0IHRpbWUgb2YgZmlyc3Qgb2JqZWN0IGluIHF1ZXVlXG4gICAgKi9cblxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5fX2hlYXAuaXNFbXB0eSgpKSByZXR1cm4gdGhpcy5fX2hlYXAuaGVhZFZhbHVlKCk7XG5cblx0XHRcdFx0cmV0dXJuIEluZmluaXR5O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmV2ZXJzZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9fcmV2ZXJzZTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuICAgICogU2V0dGVyIGZvciB0aGUgcmV2ZXJzZSBhdHRyaWJ1dGUuIFdoZW4gcmV2ZXJzZSBpcyB0cnVlLCB0aGUgaGVhcCBzaG91bGQgYmVcbiAgICAqIG1heCBhbmQgd2hlbiBmYWxzZSwgbWluLiBUaGUgbmV3IGhlYXAgdHJlZSBzaG91bGQgY29udGFpbiB0aGUgc2FtZSBpdGVtc1xuICAgICogYXMgYmVmb3JlIGJ1dCBvcmRlcmVkIGluIHRoZSByaWdodCB3YXkuXG4gICAgKi9cblx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdC8vRXhlY3V0ZSBvbmx5IGlmIHZhbHVlIGlzIGRpZmZlcmVudFxuXHRcdFx0XHRpZiAodmFsdWUgIT09IHRoaXMuX19yZXZlcnNlKSB7XG5cdFx0XHRcdFx0dmFyIGhlYXBMaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdFx0XHRcdGhlYXBMaXN0LnNoaWZ0KCk7IC8vIHJlbW92ZSBzd2FwIHZhbHVlIChmaXJzdCBlbGVtIGluIGFycmF5KVxuXG5cdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9faGVhcCA9IG5ldyBNYXhIZWFwKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX19oZWFwID0gbmV3IE1pbkhlYXAoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLl9faGVhcC5idWlsZEhlYXAoaGVhcExpc3QpO1xuXHRcdFx0XHRcdHRoaXMuX19yZXZlcnNlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHRvU3RyaW5nOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0XHRcdHZhciBsaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdFx0XHR2YXIgc3RyaW5nID0gXCJTaXplOiBcIiArIHRoaXMuX19oZWFwLnNpemUoKSArIFwiIFwiO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgb2JqID0gbGlzdFtpXTtcblx0XHRcdFx0XHRzdHJpbmcgKz0gb2JqLm9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgYXQgXCIgKyBvYmouaGVhcFZhbHVlICsgXCIgXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHN0cmluZztcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBQcmlvcml0eVF1ZXVlO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVnpOaTkxZEdsc2N5OXdjbWx2Y21sMGVTMXhkV1YxWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3UVVGQlFTeEpRVUZKTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTjZReXhKUVVGSkxFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6czdPenM3T3pzN08wbEJVMjVETEdGQlFXRTdRVUZGVUN4VlFVWk9MR0ZCUVdFc1IwRkZTanQzUWtGR1ZDeGhRVUZoT3p0QlFVZHFRaXhOUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkROVUlzVFVGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1JVRkRka0k3TzJOQlRFa3NZVUZCWVR0QlFWbHNRaXhSUVVGTk96czdPenM3T3p0VlFVRkJMR2RDUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVWQlFVVTdRVUZEY0VJc1VVRkJTU3hKUVVGSkxFdEJRVXNzVVVGQlVTeEpRVUZKTEVsQlFVa3NTMEZCU3l4RFFVRkRMRkZCUVZFc1JVRkJSVHM3UVVGRk5VTXNVMEZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJwRExGbEJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRMUVVNdlFqczdRVUZGUkN4WFFVRlBMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTVUZETTBJN08wRkJTMFFzVFVGQlNUczdPenM3TzFWQlFVRXNZMEZCUXl4TlFVRk5MRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRMnhDTEZGQlFVa3NTVUZCU1N4TFFVRkxMRkZCUVZFc1NVRkJTU3hKUVVGSkxFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVVTdPMEZCUlRWRExGTkJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVTdRVUZEZUVNc1ZVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wMUJRMnBETEUxQlFVMDdRVUZEVGl4VlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1RVRkRha003TzBGQlJVUXNXVUZCVHl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETzB0QlF5OUNPenRCUVVWRUxGZEJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRKUVVNelFqczdRVUZMUkN4UlFVRk5PenM3T3pzN1ZVRkJRU3huUWtGQlF5eE5RVUZOTEVWQlFVVTdRVUZEWkN4WFFVRlBMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUTJ4RE96dEJRVXRFTEU5QlFVczdPenM3T3p0VlFVRkJMR2xDUVVGSE8wRkJRMUFzVVVGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJRenRCUVVOd1FpeFhRVUZQTEZGQlFWRXNRMEZCUXp0SlFVTm9RanM3UVVGTFJ5eE5RVUZKT3pzN096czdVVUZCUVN4WlFVRkhPMEZCUTFZc1VVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RlFVRkZMRVZCUVVVN1FVRkRNMElzV1VGQlR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wdEJRMmhET3p0QlFVVkVMRmRCUVU4c1NVRkJTU3hEUVVGRE8wbEJRMW83TzBGQlMwY3NUVUZCU1RzN096czdPMUZCUVVFc1dVRkJSenRCUVVOV0xGRkJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1JVRkJSU3hGUVVONlFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU03TzBGQlJXaERMRmRCUVU4c1VVRkJVU3hEUVVGRE8wbEJRMmhDT3p0QlFWZEhMRk5CUVU4N1VVRlVRU3haUVVGSE8wRkJRMklzVjBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRPMGxCUTNSQ096czdPenM3TzFGQlQxVXNWVUZCUXl4TFFVRkxMRVZCUVVVN08wRkJSV3hDTEZGQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVU3UVVGRE4wSXNVMEZCU1N4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTnNReXhoUVVGUkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdPMEZCUldwQ0xGTkJRVWtzUzBGQlN5eEZRVUZGTzBGQlExWXNWVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhKUVVGSkxFOUJRVThzUlVGQlJTeERRVUZETzAxQlF6VkNMRTFCUVUwN1FVRkRUaXhWUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NUMEZCVHl4RlFVRkZMRU5CUVVNN1RVRkROVUk3TzBGQlJVUXNVMEZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEYUVNc1UwRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTTdTMEZEZGtJN1NVRkRSRHM3UVVGRlJDeFZRVUZSTzFWQlFVRXNiMEpCUVVjN1FVRkRWaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRE8wRkJRemxDTEZGQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NSVUZCUlN4SFFVRkhMRWRCUVVjc1EwRkJRenRCUVVOcVJDeFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVOeVF5eFRRVUZKTEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGJFSXNWMEZCVFN4SlFVRkpMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NSMEZCUnl4TlFVRk5MRWRCUVVjc1IwRkJSeXhEUVVGRExGTkJRVk1zUjBGQlJ5eEhRVUZITEVOQlFVTTdTMEZEY2tVN1FVRkRSQ3hYUVVGUExFMUJRVTBzUTBGQlF6dEpRVU5rT3pzN08xRkJPVWRKTEdGQlFXRTdPenRCUVdsSWJrSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1pTENKbWFXeGxJam9pWlhNMkwzVjBhV3h6TDNCeWFXOXlhWFI1TFhGMVpYVmxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRTFwYmtobFlYQWdQU0J5WlhGMWFYSmxLQ2N1TDJobFlYQXZiV2x1TFdobFlYQW5LVHRjYm5aaGNpQk5ZWGhJWldGd0lEMGdjbVZ4ZFdseVpTZ25MaTlvWldGd0wyMWhlQzFvWldGd0p5azdYRzR2S2lCM2NtbDBkR1Z1SUdsdUlFVkRUVUZ6WTNKcGNIUWdOaUFxTDF4dUx5b3FYRzRnS2lCQVptbHNaVzkyWlhKMmFXVjNJRmRCVmtVZ1lYVmthVzhnY0hKcGIzSnBkSGtnY1hWbGRXVWdkWE5sWkNCaWVTQnpZMmhsWkhWc1pYSWdZVzVrSUhSeVlXNXpjRzl5ZEhOY2JpQXFJRUJoZFhSb2IzSWdUbTl5WW1WeWRDQlRZMmh1Wld4c0lEeE9iM0ppWlhKMExsTmphRzVsYkd4QWFYSmpZVzB1Wm5JK1hHNGdLbHh1SUNvZ1JtbHljM1FnY21GMGFHVnlJSE4wZFhCcFpDQnBiWEJzWlcxbGJuUmhkR2x2YmlCMGJ5QmlaU0J2Y0hScGJXbDZaV1F1TGk1Y2JpQXFMMXh1WEc1amJHRnpjeUJRY21sdmNtbDBlVkYxWlhWbElIdGNibHh1WEhSamIyNXpkSEoxWTNSdmNpZ3BJSHRjYmx4MFhIUjBhR2x6TGw5ZmFHVmhjQ0E5SUc1bGR5Qk5hVzVJWldGd0tDazdYRzVjZEZ4MGRHaHBjeTVmWDNKbGRtVnljMlVnUFNCbVlXeHpaVHRjYmx4MGZWeHVYRzVjZEM4cUtseHVYSFFnS2lCSmJuTmxjblFnWVc0Z2IySnFaV04wSUhSdklIUm9aU0J4ZFdWMVpWeHVYSFFnS2lBb1ptOXlJSFJvYVhNZ2NISnBiV2wwYVhabElIWmxjbk5wYjI0NklIQnlaWFpsYm5RZ2MyOXlkR2x1WnlCbWIzSWdaV0ZqYUNCbGJHVnRaVzUwSUdKNUlHTmhiR3hwYm1kY2JseDBJQ29nZDJsMGFDQmNJbVpoYkhObFhDSWdZWE1nZEdocGNtUWdZWEpuZFcxbGJuUXBYRzVjZENBcUwxeHVYSFJwYm5ObGNuUW9iMkpxWldOMExDQjBhVzFsS1NCN1hHNWNkRngwYVdZZ0tIUnBiV1VnSVQwOUlFbHVabWx1YVhSNUlDWW1JSFJwYldVZ0lUMDlJQzFKYm1acGJtbDBlU2tnZTF4dVhIUmNkRngwTHk4Z1lXUmtJRzVsZHlCdlltcGxZM1JjYmx4MFhIUmNkSFJvYVhNdVgxOW9aV0Z3TG1sdWMyVnlkQ2gwYVcxbExDQnZZbXBsWTNRcE8xeHVYSFJjZEZ4MGNtVjBkWEp1SUhSb2FYTXVYMTlvWldGd0xtaGxZV1JXWVd4MVpTZ3BPeUF2THlCeVpYUjFjbTRnZEdsdFpTQnZaaUJtYVhKemRDQnZZbXBsWTNSY2JseDBYSFI5WEc1Y2JseDBYSFJ5WlhSMWNtNGdkR2hwY3k1eVpXMXZkbVVvYjJKcVpXTjBLVHNnTHk4Z0lDb3FLaW9nVFdGclpTQnpkWEpsSUdsMGN5QnViM1FnWVc1dmRHaGxjaUIwYVcxbElIbHZkU2RrSUhkaGJuUmNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJOYjNabElHRnVJRzlpYW1WamRDQjBieUJoYm05MGFHVnlJSFJwYldVZ2FXNGdkR2hsSUhGMVpYVmxYRzVjZENBcUwxeHVYSFJ0YjNabEtHOWlhbVZqZEN3Z2RHbHRaU2tnZTF4dVhIUmNkR2xtSUNoMGFXMWxJQ0U5UFNCSmJtWnBibWwwZVNBbUppQjBhVzFsSUNFOVBTQXRTVzVtYVc1cGRIa3BJSHRjYmx4dVhIUmNkRngwYVdZZ0tIUm9hWE11WDE5b1pXRndMbU52Ym5SaGFXNXpLRzlpYW1WamRDa2dJVDA5SUMweEtTQjdYRzVjZEZ4MFhIUmNkSFJvYVhNdVgxOW9aV0Z3TG5Wd1pHRjBaU2h2WW1wbFkzUXNJSFJwYldVcE8xeHVYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MGRHaHBjeTVmWDJobFlYQXVhVzV6WlhKMEtIUnBiV1VzSUc5aWFtVmpkQ2s3SUM4dklHRmtaQ0J1WlhjZ2IySnFaV04wWEc1Y2RGeDBYSFI5WEc1Y2JseDBYSFJjZEhKbGRIVnliaUIwYUdsekxsOWZhR1ZoY0M1b1pXRmtWbUZzZFdVb0tUdGNibHgwWEhSOVhHNWNibHgwWEhSeVpYUjFjbTRnZEdocGN5NXlaVzF2ZG1Vb2IySnFaV04wS1R0Y2JseDBmVnh1WEc1Y2RDOHFLbHh1WEhRZ0tpQlNaVzF2ZG1VZ1lXNGdiMkpxWldOMElHWnliMjBnZEdobElIRjFaWFZsWEc1Y2RDQXFMMXh1WEhSeVpXMXZkbVVvYjJKcVpXTjBLU0I3WEc1Y2RGeDBjbVYwZFhKdUlIUm9hWE11WDE5b1pXRndMbkpsYlc5MlpTaHZZbXBsWTNRcE8xeHVYSFI5WEc1Y2JseDBMeW9xWEc1Y2RDQXFJRU5zWldGeUlIRjFaWFZsWEc1Y2RDQXFMMXh1WEhSamJHVmhjaWdwSUh0Y2JseDBYSFIwYUdsekxsOWZhR1ZoY0M1bGJYQjBlU2dwTzF4dVhIUmNkSEpsZEhWeWJpQkpibVpwYm1sMGVUdGNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJIWlhRZ1ptbHljM1FnYjJKcVpXTjBJR2x1SUhGMVpYVmxYRzVjZENBcUwxeHVYSFJuWlhRZ2FHVmhaQ2dwSUh0Y2JseDBYSFJwWmlBb0lYUm9hWE11WDE5b1pXRndMbWx6Ulcxd2RIa29LU2tnZTF4dVhIUmNkRngwY21WMGRYSnVJSFJvYVhNdVgxOW9aV0Z3TG1obFlXUlBZbXBsWTNRb0tUdGNibHgwWEhSOVhHNWNibHgwWEhSeVpYUjFjbTRnYm5Wc2JEdGNibHgwZlZ4dVhHNWNkQzhxS2x4dVhIUWdLaUJIWlhRZ2RHbHRaU0J2WmlCbWFYSnpkQ0J2WW1wbFkzUWdhVzRnY1hWbGRXVmNibHgwSUNvdlhHNWNkR2RsZENCMGFXMWxLQ2tnZTF4dVhIUmNkR2xtSUNnaGRHaHBjeTVmWDJobFlYQXVhWE5GYlhCMGVTZ3BLVnh1WEhSY2RGeDBjbVYwZFhKdUlIUm9hWE11WDE5b1pXRndMbWhsWVdSV1lXeDFaU2dwTzF4dVhHNWNkRngwY21WMGRYSnVJRWx1Wm1sdWFYUjVPMXh1WEhSOVhHNWNibHgwWjJWMElISmxkbVZ5YzJVb0tTQjdYRzVjZEZ4MGNtVjBkWEp1SUhSb2FYTXVYMTl5WlhabGNuTmxPMXh1WEhSOVhHNWNibHgwTHlvcVhHNWNkQ0FxSUZObGRIUmxjaUJtYjNJZ2RHaGxJSEpsZG1WeWMyVWdZWFIwY21saWRYUmxMaUJYYUdWdUlISmxkbVZ5YzJVZ2FYTWdkSEoxWlN3Z2RHaGxJR2hsWVhBZ2MyaHZkV3hrSUdKbFhHNWNkQ0FxSUcxaGVDQmhibVFnZDJobGJpQm1ZV3h6WlN3Z2JXbHVMaUJVYUdVZ2JtVjNJR2hsWVhBZ2RISmxaU0J6YUc5MWJHUWdZMjl1ZEdGcGJpQjBhR1VnYzJGdFpTQnBkR1Z0YzF4dVhIUWdLaUJoY3lCaVpXWnZjbVVnWW5WMElHOXlaR1Z5WldRZ2FXNGdkR2hsSUhKcFoyaDBJSGRoZVM1Y2JseDBJQ292WEc1Y2RITmxkQ0J5WlhabGNuTmxLSFpoYkhWbEtTQjdYRzVjZEZ4MEx5OUZlR1ZqZFhSbElHOXViSGtnYVdZZ2RtRnNkV1VnYVhNZ1pHbG1abVZ5Wlc1MFhHNWNkRngwYVdZZ0tIWmhiSFZsSUNFOVBTQjBhR2x6TGw5ZmNtVjJaWEp6WlNrZ2UxeHVYSFJjZEZ4MGRtRnlJR2hsWVhCTWFYTjBJRDBnZEdocGN5NWZYMmhsWVhBdWJHbHpkQ2dwTzF4dVhIUmNkRngwYUdWaGNFeHBjM1F1YzJocFpuUW9LVHNnTHk4Z2NtVnRiM1psSUhOM1lYQWdkbUZzZFdVZ0tHWnBjbk4wSUdWc1pXMGdhVzRnWVhKeVlYa3BYRzVjYmx4MFhIUmNkR2xtSUNoMllXeDFaU2tnZTF4dVhIUmNkRngwWEhSMGFHbHpMbDlmYUdWaGNDQTlJRzVsZHlCTllYaElaV0Z3S0NrN1hHNWNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhSMGFHbHpMbDlmYUdWaGNDQTlJRzVsZHlCTmFXNUlaV0Z3S0NrN1hHNWNkRngwWEhSOVhHNWNibHgwWEhSY2RIUm9hWE11WDE5b1pXRndMbUoxYVd4a1NHVmhjQ2hvWldGd1RHbHpkQ2s3WEc1Y2RGeDBYSFIwYUdsekxsOWZjbVYyWlhKelpTQTlJSFpoYkhWbE8xeHVYSFJjZEgxY2JseDBmVnh1WEc1Y2RIUnZVM1J5YVc1bktDa2dlMXh1WEhSY2RIWmhjaUJzYVhOMElEMGdkR2hwY3k1ZlgyaGxZWEF1YkdsemRDZ3BPMXh1WEhSY2RIWmhjaUJ6ZEhKcGJtY2dQU0JjSWxOcGVtVTZJRndpSUNzZ2RHaHBjeTVmWDJobFlYQXVjMmw2WlNncElDc2dYQ0lnWENJN1hHNWNkRngwWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCc2FYTjBMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNWNkRngwWEhSMllYSWdiMkpxSUQwZ2JHbHpkRnRwWFR0Y2JseDBYSFJjZEhOMGNtbHVaeUFyUFNCdlltb3ViMkpxWldOMExtTnZibk4wY25WamRHOXlMbTVoYldVZ0t5QmNJaUJoZENCY0lpQXJJRzlpYWk1b1pXRndWbUZzZFdVZ0t5QmNJaUJjSWp0Y2JseDBYSFI5WEc1Y2RGeDBjbVYwZFhKdUlITjBjbWx1Wnp0Y2JseDBmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGQnlhVzl5YVhSNVVYVmxkV1U3SWwxOSIsInZhciB3YXZlcyA9IHJlcXVpcmUoJy4uL3dhdmVzLWF1ZGlvJyk7XG52YXIgYXVkaW9Db250ZXh0ID0gd2F2ZXMuYXVkaW9Db250ZXh0O1xudmFyIEF1ZGlvQnVmZmVyTG9hZGVyID0gcmVxdWlyZSgnd2F2ZXMtbG9hZGVycycpLkF1ZGlvQnVmZmVyTG9hZGVyO1xudmFyIEdyYW51bGFyRW5naW5lID0gd2F2ZXMuR3JhbnVsYXJFbmdpbmU7XG52YXIgUGxheWVyRW5naW5lID0gd2F2ZXMuUGxheWVyRW5naW5lO1xudmFyIFBsYXlDb250cm9sID0gd2F2ZXMuUGxheUNvbnRyb2w7XG52YXIgU2VnbWVudEVuZ2luZSA9IHdhdmVzLlNlZ21lbnRFbmdpbmU7XG52YXIgVHJhbnNwb3J0ID0gd2F2ZXMuVHJhbnNwb3J0O1xuXG52YXIgYXVkaW9CdWZmZXJMb2FkZXIgPSBuZXcgQXVkaW9CdWZmZXJMb2FkZXIoKTtcbnZhciB0cmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KGF1ZGlvQ29udGV4dCk7XG52YXIgcGxheUNvbnRyb2wgPSBuZXcgUGxheUNvbnRyb2wodHJhbnNwb3J0KTtcblxudmFyIGVuZ2luZTtcbnZhciBwbGF5aW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGxvYWRBcHAoKSB7XG5cdGF1ZGlvQnVmZmVyTG9hZGVyLmxvYWQoJ2h0dHBzOi8vY2RuLnJhd2dpdC5jb20vSXJjYW0tUm5EL2F1ZGlvLWZpbGVzL21hc3Rlci9kcnVtTG9vcC53YXYnKS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdGVuZ2luZSA9IG5ldyBHcmFudWxhckVuZ2luZShhdWRpb0NvbnRleHQpO1xuXHRcdGVuZ2luZS5idWZmZXIgPSBidWZmZXI7XG5cdFx0ZW5naW5lLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0XHR0cmFuc3BvcnQuYWRkKGVuZ2luZSwgMCwgYnVmZmVyLmR1cmF0aW9uKTtcblx0XHRwbGF5Q29udHJvbC5zZXRMb29wQm91bmRhcmllcygwLCBidWZmZXIuZHVyYXRpb24pO1xuXHRcdHBsYXlDb250cm9sLmxvb3AgPSB0cnVlO1xuXHR9KTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheS1idXR0b24nKS5vbmNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcdFxuXHRcdGlmICghcGxheWluZykge1xuXHRcdFx0cGxheUNvbnRyb2wuc3RhcnQoKTtcblx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9IFwiUGF1c2VcIjtcblx0XHRcdHBsYXlpbmcgPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwbGF5Q29udHJvbC5wYXVzZSgpO1xuXHRcdFx0dGhpcy50ZXh0Q29udGVudCA9IFwiUGxheVwiO1xuXHRcdFx0cGxheWluZyA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGVlZC1yYW5nZScpXG5cdFx0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdHBsYXlDb250cm9sLnNwZWVkID0gKCt0aGlzLnZhbHVlKTtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGVlZCcpLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZTtcblx0XHR9KTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblx0bG9hZEFwcCgpO1xufSk7IiwidmFyIExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyJyk7XG52YXIgQXVkaW9CdWZmZXJMb2FkZXIgPSByZXF1aXJlKCcuL2F1ZGlvLWJ1ZmZlci1sb2FkZXInKTtcblxuLyoqXG4gKiBHZXRzIGNhbGxlZCBpZiBhIHBhcmFtZXRlciBpcyBtaXNzaW5nIGFuZCB0aGUgZXhwcmVzc2lvblxuICogc3BlY2lmeWluZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBldmFsdWF0ZWQuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZk1pc3NpbmcoKSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBwYXJhbWV0ZXInKTtcbn1cblxuLyoqXG4gKiBTdXBlckxvYWRlclxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEhlbHBlciB0byBsb2FkIG11bHRpcGxlIHR5cGUgb2YgZmlsZXMsIGFuZCBnZXQgdGhlbSBpbiB0aGVpciB1c2VmdWwgdHlwZSwganNvbiBmb3IganNvbiBmaWxlcywgQXVkaW9CdWZmZXIgZm9yIGF1ZGlvIGZpbGVzLlxuICovXG5jbGFzcyBTdXBlckxvYWRlciB7XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIFVzZSBjb21wb3NpdGlvbiB0byBzZXR1cCBhcHByb3ByaWF0ZSBmaWxlIGxvYWRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYnVmZmVyTG9hZGVyID0gbmV3IEF1ZGlvQnVmZmVyTG9hZGVyKCk7XG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgTG9hZGVyKFwianNvblwiKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiAtIE1ldGhvZCBmb3IgcHJvbWlzZSBhdWRpbyBhbmQganNvbiBmaWxlIGxvYWRpbmcgKGFuZCBkZWNvZGluZyBmb3IgYXVkaW8pLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSBmaWxlVVJMcyAtIFRoZSBVUkwocykgb2YgdGhlIGZpbGVzIHRvIGxvYWQuIEFjY2VwdHMgYSBVUkwgcG9pbnRpbmcgdG8gdGhlIGZpbGUgbG9jYXRpb24gb3IgYW4gYXJyYXkgb2YgVVJMcy5cbiAgICogQHBhcmFtIHt7d3JhcEFyb3VuZEV4dGVuc2lvbjogbnVtYmVyfX0gW29wdGlvbnNdIC0gT2JqZWN0IHdpdGggYSB3cmFwQXJvdW5kRXh0ZW5zaW9uIGtleSB3aGljaCBzZXQgdGhlIGxlbmd0aCwgaW4gc2Vjb25kcyB0byBiZSBjb3BpZWQgZnJvbSB0aGUgYmVnaW5pbmdcbiAgICogYXQgdGhlIGVuZCBvZiB0aGUgcmV0dXJuZWQgQXVkaW9CdWZmZXJcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBsb2FkKGZpbGVVUkxzID0gdGhyb3dJZk1pc3NpbmcoKSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZEV4dGVuc2lvbiA9IHRoaXMub3B0aW9ucy53cmFwQXJvdW5kRXh0ZW5zaW9uIHx8IDA7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsZVVSTHMpKSB7XG4gICAgICB2YXIgaSA9IC0xO1xuICAgICAgdmFyIHBvcyA9IFtcbiAgICAgICAgW10sXG4gICAgICAgIFtdXG4gICAgICBdOyAvLyBwb3MgaXMgdXNlZCB0byB0cmFjayB0aGUgcG9zaXRpb25zIG9mIGVhY2ggZmlsZVVSTFxuICAgICAgdmFyIG90aGVyVVJMcyA9IGZpbGVVUkxzLmZpbHRlcihmdW5jdGlvbih1cmwsIGluZGV4KSB7XG4gICAgICAgIC8vIHZhciBleHRuYW1lID0gcGF0aC5leHRuYW1lKHVybCk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHVybC5zcGxpdCgnLicpO1xuICAgICAgICB2YXIgZXh0bmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChleHRuYW1lID09ICdqc29uJykge1xuICAgICAgICAgIHBvc1swXS5wdXNoKGkpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvc1sxXS5wdXNoKGkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHZhciBhdWRpb1VSTHMgPSBfLmRpZmZlcmVuY2UoZmlsZVVSTHMsIG90aGVyVVJMcyk7XG4gICAgICB2YXIgYXVkaW9VUkxzID0gZmlsZVVSTHMuZmlsdGVyKGZ1bmN0aW9uKHVybCkge1xuICAgICAgICBpZiAob3RoZXJVUkxzLmluZGV4T2YodXJsKSA9PT0gLTEpIHsgcmV0dXJuIHVybDsgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuXG4gICAgICBpZiAob3RoZXJVUkxzLmxlbmd0aCA+IDApIHByb21pc2VzLnB1c2godGhpcy5sb2FkZXIubG9hZChvdGhlclVSTHMpKTtcbiAgICAgIGlmIChhdWRpb1VSTHMubGVuZ3RoID4gMCkgcHJvbWlzZXMucHVzaCh0aGlzLmJ1ZmZlckxvYWRlci5sb2FkKGF1ZGlvVVJMcywgdGhpcy5vcHRpb25zKSk7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKFxuICAgICAgICAgIChkYXRhcykgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byByZW9yZGVyIGFuZCBmbGF0dGVuIGFsbCBvZiB0aGVzZSBmdWxmaWxsZWQgcHJvbWlzZXNcbiAgICAgICAgICAgIC8vIEB0b2RvIHRoaXMgaXMgdWdseVxuICAgICAgICAgICAgaWYgKGRhdGFzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICByZXNvbHZlKGRhdGFzWzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBvdXREYXRhID0gW107XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcG9zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBwb3Nbal0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgIG91dERhdGFbcG9zW2pdW2tdXSA9IGRhdGFzW2pdW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXNvbHZlKG91dERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1cGVyTG9hZGVyOyIsIi8qKlxuICogQ29yZS5qcyAwLjYuMVxuICogaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanNcbiAqIExpY2Vuc2U6IGh0dHA6Ly9yb2NrLm1pdC1saWNlbnNlLm9yZ1xuICogwqkgMjAxNSBEZW5pcyBQdXNoa2FyZXZcbiAqL1xuIWZ1bmN0aW9uKGdsb2JhbCwgZnJhbWV3b3JrLCB1bmRlZmluZWQpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb21tb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIC8vIFNob3J0Y3V0cyBmb3IgW1tDbGFzc11dICYgcHJvcGVydHkgbmFtZXNcclxudmFyIE9CSkVDVCAgICAgICAgICA9ICdPYmplY3QnXHJcbiAgLCBGVU5DVElPTiAgICAgICAgPSAnRnVuY3Rpb24nXHJcbiAgLCBBUlJBWSAgICAgICAgICAgPSAnQXJyYXknXHJcbiAgLCBTVFJJTkcgICAgICAgICAgPSAnU3RyaW5nJ1xyXG4gICwgTlVNQkVSICAgICAgICAgID0gJ051bWJlcidcclxuICAsIFJFR0VYUCAgICAgICAgICA9ICdSZWdFeHAnXHJcbiAgLCBEQVRFICAgICAgICAgICAgPSAnRGF0ZSdcclxuICAsIE1BUCAgICAgICAgICAgICA9ICdNYXAnXHJcbiAgLCBTRVQgICAgICAgICAgICAgPSAnU2V0J1xyXG4gICwgV0VBS01BUCAgICAgICAgID0gJ1dlYWtNYXAnXHJcbiAgLCBXRUFLU0VUICAgICAgICAgPSAnV2Vha1NldCdcclxuICAsIFNZTUJPTCAgICAgICAgICA9ICdTeW1ib2wnXHJcbiAgLCBQUk9NSVNFICAgICAgICAgPSAnUHJvbWlzZSdcclxuICAsIE1BVEggICAgICAgICAgICA9ICdNYXRoJ1xyXG4gICwgQVJHVU1FTlRTICAgICAgID0gJ0FyZ3VtZW50cydcclxuICAsIFBST1RPVFlQRSAgICAgICA9ICdwcm90b3R5cGUnXHJcbiAgLCBDT05TVFJVQ1RPUiAgICAgPSAnY29uc3RydWN0b3InXHJcbiAgLCBUT19TVFJJTkcgICAgICAgPSAndG9TdHJpbmcnXHJcbiAgLCBUT19TVFJJTkdfVEFHICAgPSBUT19TVFJJTkcgKyAnVGFnJ1xyXG4gICwgVE9fTE9DQUxFICAgICAgID0gJ3RvTG9jYWxlU3RyaW5nJ1xyXG4gICwgSEFTX09XTiAgICAgICAgID0gJ2hhc093blByb3BlcnR5J1xyXG4gICwgRk9SX0VBQ0ggICAgICAgID0gJ2ZvckVhY2gnXHJcbiAgLCBJVEVSQVRPUiAgICAgICAgPSAnaXRlcmF0b3InXHJcbiAgLCBGRl9JVEVSQVRPUiAgICAgPSAnQEAnICsgSVRFUkFUT1JcclxuICAsIFBST0NFU1MgICAgICAgICA9ICdwcm9jZXNzJ1xyXG4gICwgQ1JFQVRFX0VMRU1FTlQgID0gJ2NyZWF0ZUVsZW1lbnQnXHJcbiAgLy8gQWxpYXNlcyBnbG9iYWwgb2JqZWN0cyBhbmQgcHJvdG90eXBlc1xyXG4gICwgRnVuY3Rpb24gICAgICAgID0gZ2xvYmFsW0ZVTkNUSU9OXVxyXG4gICwgT2JqZWN0ICAgICAgICAgID0gZ2xvYmFsW09CSkVDVF1cclxuICAsIEFycmF5ICAgICAgICAgICA9IGdsb2JhbFtBUlJBWV1cclxuICAsIFN0cmluZyAgICAgICAgICA9IGdsb2JhbFtTVFJJTkddXHJcbiAgLCBOdW1iZXIgICAgICAgICAgPSBnbG9iYWxbTlVNQkVSXVxyXG4gICwgUmVnRXhwICAgICAgICAgID0gZ2xvYmFsW1JFR0VYUF1cclxuICAsIERhdGUgICAgICAgICAgICA9IGdsb2JhbFtEQVRFXVxyXG4gICwgTWFwICAgICAgICAgICAgID0gZ2xvYmFsW01BUF1cclxuICAsIFNldCAgICAgICAgICAgICA9IGdsb2JhbFtTRVRdXHJcbiAgLCBXZWFrTWFwICAgICAgICAgPSBnbG9iYWxbV0VBS01BUF1cclxuICAsIFdlYWtTZXQgICAgICAgICA9IGdsb2JhbFtXRUFLU0VUXVxyXG4gICwgU3ltYm9sICAgICAgICAgID0gZ2xvYmFsW1NZTUJPTF1cclxuICAsIE1hdGggICAgICAgICAgICA9IGdsb2JhbFtNQVRIXVxyXG4gICwgVHlwZUVycm9yICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxyXG4gICwgUmFuZ2VFcnJvciAgICAgID0gZ2xvYmFsLlJhbmdlRXJyb3JcclxuICAsIHNldFRpbWVvdXQgICAgICA9IGdsb2JhbC5zZXRUaW1lb3V0XHJcbiAgLCBzZXRJbW1lZGlhdGUgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXHJcbiAgLCBjbGVhckltbWVkaWF0ZSAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcclxuICAsIHBhcnNlSW50ICAgICAgICA9IGdsb2JhbC5wYXJzZUludFxyXG4gICwgaXNGaW5pdGUgICAgICAgID0gZ2xvYmFsLmlzRmluaXRlXHJcbiAgLCBwcm9jZXNzICAgICAgICAgPSBnbG9iYWxbUFJPQ0VTU11cclxuICAsIG5leHRUaWNrICAgICAgICA9IHByb2Nlc3MgJiYgcHJvY2Vzcy5uZXh0VGlja1xyXG4gICwgZG9jdW1lbnQgICAgICAgID0gZ2xvYmFsLmRvY3VtZW50XHJcbiAgLCBodG1sICAgICAgICAgICAgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcclxuICAsIG5hdmlnYXRvciAgICAgICA9IGdsb2JhbC5uYXZpZ2F0b3JcclxuICAsIGRlZmluZSAgICAgICAgICA9IGdsb2JhbC5kZWZpbmVcclxuICAsIGNvbnNvbGUgICAgICAgICA9IGdsb2JhbC5jb25zb2xlIHx8IHt9XHJcbiAgLCBBcnJheVByb3RvICAgICAgPSBBcnJheVtQUk9UT1RZUEVdXHJcbiAgLCBPYmplY3RQcm90byAgICAgPSBPYmplY3RbUFJPVE9UWVBFXVxyXG4gICwgRnVuY3Rpb25Qcm90byAgID0gRnVuY3Rpb25bUFJPVE9UWVBFXVxyXG4gICwgSW5maW5pdHkgICAgICAgID0gMSAvIDBcclxuICAsIERPVCAgICAgICAgICAgICA9ICcuJztcclxuXHJcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcmUtanMtaXNvYmplY3RcclxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xyXG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcclxufVxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XHJcbn1cclxuLy8gTmF0aXZlIGZ1bmN0aW9uP1xyXG52YXIgaXNOYXRpdmUgPSBjdHgoLy4vLnRlc3QsIC9cXFtuYXRpdmUgY29kZVxcXVxccypcXH1cXHMqJC8sIDEpO1xyXG5cclxuLy8gT2JqZWN0IGludGVybmFsIFtbQ2xhc3NdXSBvciB0b1N0cmluZ1RhZ1xyXG4vLyBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nXHJcbnZhciB0b1N0cmluZyA9IE9iamVjdFByb3RvW1RPX1NUUklOR107XHJcbmZ1bmN0aW9uIHNldFRvU3RyaW5nVGFnKGl0LCB0YWcsIHN0YXQpe1xyXG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdFtQUk9UT1RZUEVdLCBTWU1CT0xfVEFHKSloaWRkZW4oaXQsIFNZTUJPTF9UQUcsIHRhZyk7XHJcbn1cclxuZnVuY3Rpb24gY29mKGl0KXtcclxuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xyXG59XHJcbmZ1bmN0aW9uIGNsYXNzb2YoaXQpe1xyXG4gIHZhciBPLCBUO1xyXG4gIHJldHVybiBpdCA9PSB1bmRlZmluZWQgPyBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiAnTnVsbCdcclxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtTWU1CT0xfVEFHXSkgPT0gJ3N0cmluZycgPyBUIDogY29mKE8pO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvblxyXG52YXIgY2FsbCAgPSBGdW5jdGlvblByb3RvLmNhbGxcclxuICAsIGFwcGx5ID0gRnVuY3Rpb25Qcm90by5hcHBseVxyXG4gICwgUkVGRVJFTkNFX0dFVDtcclxuLy8gUGFydGlhbCBhcHBseVxyXG5mdW5jdGlvbiBwYXJ0KC8qIC4uLmFyZ3MgKi8pe1xyXG4gIHZhciBmbiAgICAgPSBhc3NlcnRGdW5jdGlvbih0aGlzKVxyXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGFyZ3MgICA9IEFycmF5KGxlbmd0aClcclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCBfICAgICAgPSBwYXRoLl9cclxuICAgICwgaG9sZGVyID0gZmFsc2U7XHJcbiAgd2hpbGUobGVuZ3RoID4gaSlpZigoYXJnc1tpXSA9IGFyZ3VtZW50c1tpKytdKSA9PT0gXylob2xkZXIgPSB0cnVlO1xyXG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgIHZhciB0aGF0ICAgID0gdGhpc1xyXG4gICAgICAsIF9sZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgaSA9IDAsIGogPSAwLCBfYXJncztcclxuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhhdCk7XHJcbiAgICBfYXJncyA9IGFyZ3Muc2xpY2UoKTtcclxuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGk7IGkrKylpZihfYXJnc1tpXSA9PT0gXylfYXJnc1tpXSA9IGFyZ3VtZW50c1tqKytdO1xyXG4gICAgd2hpbGUoX2xlbmd0aCA+IGopX2FyZ3MucHVzaChhcmd1bWVudHNbaisrXSk7XHJcbiAgICByZXR1cm4gaW52b2tlKGZuLCBfYXJncywgdGhhdCk7XHJcbiAgfVxyXG59XHJcbi8vIE9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xyXG5mdW5jdGlvbiBjdHgoZm4sIHRoYXQsIGxlbmd0aCl7XHJcbiAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xyXG4gIGlmKH5sZW5ndGggJiYgdGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcclxuICBzd2l0Y2gobGVuZ3RoKXtcclxuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcclxuICAgIH1cclxuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcclxuICAgIH1cclxuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcclxuICAgIH1cclxuICB9IHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG59XHJcbi8vIEZhc3QgYXBwbHlcclxuLy8gaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XHJcbmZ1bmN0aW9uIGludm9rZShmbiwgYXJncywgdGhhdCl7XHJcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xyXG4gIHN3aXRjaChhcmdzLmxlbmd0aCB8IDApe1xyXG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XHJcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XHJcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XHJcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XHJcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XHJcbiAgICBjYXNlIDU6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSk7XHJcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xyXG59XHJcblxyXG4vLyBPYmplY3Q6XHJcbnZhciBjcmVhdGUgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZVxyXG4gICwgZ2V0UHJvdG90eXBlT2YgICA9IE9iamVjdC5nZXRQcm90b3R5cGVPZlxyXG4gICwgc2V0UHJvdG90eXBlT2YgICA9IE9iamVjdC5zZXRQcm90b3R5cGVPZlxyXG4gICwgZGVmaW5lUHJvcGVydHkgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxyXG4gICwgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXHJcbiAgLCBnZXRPd25EZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvclxyXG4gICwgZ2V0S2V5cyAgICAgICAgICA9IE9iamVjdC5rZXlzXHJcbiAgLCBnZXROYW1lcyAgICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcclxuICAsIGdldFN5bWJvbHMgICAgICAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXHJcbiAgLCBpc0Zyb3plbiAgICAgICAgID0gT2JqZWN0LmlzRnJvemVuXHJcbiAgLCBoYXMgICAgICAgICAgICAgID0gY3R4KGNhbGwsIE9iamVjdFByb3RvW0hBU19PV05dLCAyKVxyXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxyXG4gICwgRVM1T2JqZWN0ICAgICAgICA9IE9iamVjdFxyXG4gICwgRGljdDtcclxuZnVuY3Rpb24gdG9PYmplY3QoaXQpe1xyXG4gIHJldHVybiBFUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xyXG59XHJcbmZ1bmN0aW9uIHJldHVybkl0KGl0KXtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gcmV0dXJuVGhpcygpe1xyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcbmZ1bmN0aW9uIGdldChvYmplY3QsIGtleSl7XHJcbiAgaWYoaGFzKG9iamVjdCwga2V5KSlyZXR1cm4gb2JqZWN0W2tleV07XHJcbn1cclxuZnVuY3Rpb24gb3duS2V5cyhpdCl7XHJcbiAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICByZXR1cm4gZ2V0U3ltYm9scyA/IGdldE5hbWVzKGl0KS5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDogZ2V0TmFtZXMoaXQpO1xyXG59XHJcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcclxudmFyIGFzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2Upe1xyXG4gIHZhciBUID0gT2JqZWN0KGFzc2VydERlZmluZWQodGFyZ2V0KSlcclxuICAgICwgbCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgaSA9IDE7XHJcbiAgd2hpbGUobCA+IGkpe1xyXG4gICAgdmFyIFMgICAgICA9IEVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcclxuICAgICAgLCBrZXlzICAgPSBnZXRLZXlzKFMpXHJcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgLCBqICAgICAgPSAwXHJcbiAgICAgICwga2V5O1xyXG4gICAgd2hpbGUobGVuZ3RoID4gailUW2tleSA9IGtleXNbaisrXV0gPSBTW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiBUO1xyXG59XHJcbmZ1bmN0aW9uIGtleU9mKG9iamVjdCwgZWwpe1xyXG4gIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcclxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICwgaW5kZXggID0gMFxyXG4gICAgLCBrZXk7XHJcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcclxufVxyXG5cclxuLy8gQXJyYXlcclxuLy8gYXJyYXkoJ3N0cjEsc3RyMixzdHIzJykgPT4gWydzdHIxJywgJ3N0cjInLCAnc3RyMyddXHJcbmZ1bmN0aW9uIGFycmF5KGl0KXtcclxuICByZXR1cm4gU3RyaW5nKGl0KS5zcGxpdCgnLCcpO1xyXG59XHJcbnZhciBwdXNoICAgID0gQXJyYXlQcm90by5wdXNoXHJcbiAgLCB1bnNoaWZ0ID0gQXJyYXlQcm90by51bnNoaWZ0XHJcbiAgLCBzbGljZSAgID0gQXJyYXlQcm90by5zbGljZVxyXG4gICwgc3BsaWNlICA9IEFycmF5UHJvdG8uc3BsaWNlXHJcbiAgLCBpbmRleE9mID0gQXJyYXlQcm90by5pbmRleE9mXHJcbiAgLCBmb3JFYWNoID0gQXJyYXlQcm90b1tGT1JfRUFDSF07XHJcbi8qXHJcbiAqIDAgLT4gZm9yRWFjaFxyXG4gKiAxIC0+IG1hcFxyXG4gKiAyIC0+IGZpbHRlclxyXG4gKiAzIC0+IHNvbWVcclxuICogNCAtPiBldmVyeVxyXG4gKiA1IC0+IGZpbmRcclxuICogNiAtPiBmaW5kSW5kZXhcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5TWV0aG9kKHR5cGUpe1xyXG4gIHZhciBpc01hcCAgICAgICA9IHR5cGUgPT0gMVxyXG4gICAgLCBpc0ZpbHRlciAgICA9IHR5cGUgPT0gMlxyXG4gICAgLCBpc1NvbWUgICAgICA9IHR5cGUgPT0gM1xyXG4gICAgLCBpc0V2ZXJ5ICAgICA9IHR5cGUgPT0gNFxyXG4gICAgLCBpc0ZpbmRJbmRleCA9IHR5cGUgPT0gNlxyXG4gICAgLCBub2hvbGVzICAgICA9IHR5cGUgPT0gNSB8fCBpc0ZpbmRJbmRleDtcclxuICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCB0aGF0ICAgPSBhcmd1bWVudHNbMV1cclxuICAgICAgLCBzZWxmICAgPSBFUzVPYmplY3QoTylcclxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcclxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gaXNNYXAgPyBBcnJheShsZW5ndGgpIDogaXNGaWx0ZXIgPyBbXSA6IHVuZGVmaW5lZFxyXG4gICAgICAsIHZhbCwgcmVzO1xyXG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihub2hvbGVzIHx8IGluZGV4IGluIHNlbGYpe1xyXG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcclxuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcclxuICAgICAgaWYodHlwZSl7XHJcbiAgICAgICAgaWYoaXNNYXApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcclxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXHJcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XHJcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXHJcbiAgICAgICAgfSBlbHNlIGlmKGlzRXZlcnkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAgLy8gZXZlcnlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzRmluZEluZGV4ID8gLTEgOiBpc1NvbWUgfHwgaXNFdmVyeSA/IGlzRXZlcnkgOiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5Q29udGFpbnMoaXNDb250YWlucyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcclxuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpO1xyXG4gICAgaWYoaXNDb250YWlucyAmJiBlbCAhPSBlbCl7XHJcbiAgICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoc2FtZU5hTihPW2luZGV4XSkpcmV0dXJuIGlzQ29udGFpbnMgfHwgaW5kZXg7XHJcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihpc0NvbnRhaW5zIHx8IGluZGV4IGluIE8pe1xyXG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIGlzQ29udGFpbnMgfHwgaW5kZXg7XHJcbiAgICB9IHJldHVybiAhaXNDb250YWlucyAmJiAtMTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJpYyhBLCBCKXtcclxuICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIHZzIGlzRnVuY3Rpb25cclxuICByZXR1cm4gdHlwZW9mIEEgPT0gJ2Z1bmN0aW9uJyA/IEEgOiBCO1xyXG59XHJcblxyXG4vLyBNYXRoXHJcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZiAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXHJcbiAgLCBwb3cgICAgPSBNYXRoLnBvd1xyXG4gICwgYWJzICAgID0gTWF0aC5hYnNcclxuICAsIGNlaWwgICA9IE1hdGguY2VpbFxyXG4gICwgZmxvb3IgID0gTWF0aC5mbG9vclxyXG4gICwgbWF4ICAgID0gTWF0aC5tYXhcclxuICAsIG1pbiAgICA9IE1hdGgubWluXHJcbiAgLCByYW5kb20gPSBNYXRoLnJhbmRvbVxyXG4gICwgdHJ1bmMgID0gTWF0aC50cnVuYyB8fCBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XHJcbiAgICB9XHJcbi8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXHJcbmZ1bmN0aW9uIHNhbWVOYU4obnVtYmVyKXtcclxuICByZXR1cm4gbnVtYmVyICE9IG51bWJlcjtcclxufVxyXG4vLyA3LjEuNCBUb0ludGVnZXJcclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcclxuICByZXR1cm4gaXNOYU4oaXQpID8gMCA6IHRydW5jKGl0KTtcclxufVxyXG4vLyA3LjEuMTUgVG9MZW5ndGhcclxuZnVuY3Rpb24gdG9MZW5ndGgoaXQpe1xyXG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgTUFYX1NBRkVfSU5URUdFUikgOiAwO1xyXG59XHJcbmZ1bmN0aW9uIHRvSW5kZXgoaW5kZXgsIGxlbmd0aCl7XHJcbiAgdmFyIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcclxuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcclxufVxyXG5mdW5jdGlvbiBseihudW0pe1xyXG4gIHJldHVybiBudW0gPiA5ID8gbnVtIDogJzAnICsgbnVtO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVSZXBsYWNlcihyZWdFeHAsIHJlcGxhY2UsIGlzU3RhdGljKXtcclxuICB2YXIgcmVwbGFjZXIgPSBpc09iamVjdChyZXBsYWNlKSA/IGZ1bmN0aW9uKHBhcnQpe1xyXG4gICAgcmV0dXJuIHJlcGxhY2VbcGFydF07XHJcbiAgfSA6IHJlcGxhY2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBTdHJpbmcoaXNTdGF0aWMgPyBpdCA6IHRoaXMpLnJlcGxhY2UocmVnRXhwLCByZXBsYWNlcik7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZVBvaW50QXQodG9TdHJpbmcpe1xyXG4gIHJldHVybiBmdW5jdGlvbihwb3Mpe1xyXG4gICAgdmFyIHMgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcclxuICAgICAgLCBsID0gcy5sZW5ndGhcclxuICAgICAgLCBhLCBiO1xyXG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiB0b1N0cmluZyA/ICcnIDogdW5kZWZpbmVkO1xyXG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcclxuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXHJcbiAgICAgID8gdG9TdHJpbmcgPyBzLmNoYXJBdChpKSA6IGFcclxuICAgICAgOiB0b1N0cmluZyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcclxuICB9XHJcbn1cclxuXHJcbi8vIEFzc2VydGlvbiAmIGVycm9yc1xyXG52YXIgUkVEVUNFX0VSUk9SID0gJ1JlZHVjZSBvZiBlbXB0eSBvYmplY3Qgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcclxuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnMSwgbXNnMil7XHJcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XHJcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignRnVuY3Rpb24gY2FsbGVkIG9uIG51bGwgb3IgdW5kZWZpbmVkJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydEZ1bmN0aW9uKGl0KXtcclxuICBhc3NlcnQoaXNGdW5jdGlvbihpdCksIGl0LCAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnRPYmplY3QoaXQpe1xyXG4gIGFzc2VydChpc09iamVjdChpdCksIGl0LCAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydEluc3RhbmNlKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XHJcbiAgYXNzZXJ0KGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IsIG5hbWUsIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcclxufVxyXG5cclxuLy8gUHJvcGVydHkgZGVzY3JpcHRvcnMgJiBTeW1ib2xcclxuZnVuY3Rpb24gZGVzY3JpcHRvcihiaXRtYXAsIHZhbHVlKXtcclxuICByZXR1cm4ge1xyXG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxyXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxyXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxyXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBzaW1wbGVTZXQob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xyXG4gIHJldHVybiBvYmplY3Q7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xyXG4gIHJldHVybiBERVNDID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwgZGVzY3JpcHRvcihiaXRtYXAsIHZhbHVlKSk7XHJcbiAgfSA6IHNpbXBsZVNldDtcclxufVxyXG5mdW5jdGlvbiB1aWQoa2V5KXtcclxuICByZXR1cm4gU1lNQk9MICsgJygnICsga2V5ICsgJylfJyArICgrK3NpZCArIHJhbmRvbSgpKVtUT19TVFJJTkddKDM2KTtcclxufVxyXG5mdW5jdGlvbiBnZXRXZWxsS25vd25TeW1ib2wobmFtZSwgc2V0dGVyKXtcclxuICByZXR1cm4gKFN5bWJvbCAmJiBTeW1ib2xbbmFtZV0pIHx8IChzZXR0ZXIgPyBTeW1ib2wgOiBzYWZlU3ltYm9sKShTWU1CT0wgKyBET1QgKyBuYW1lKTtcclxufVxyXG4vLyBUaGUgZW5naW5lIHdvcmtzIGZpbmUgd2l0aCBkZXNjcmlwdG9ycz8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eS5cclxudmFyIERFU0MgPSAhIWZ1bmN0aW9uKCl7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiAyIH19KS5hID09IDI7XHJcbiAgICAgIH0gY2F0Y2goZSl7fVxyXG4gICAgfSgpXHJcbiAgLCBzaWQgICAgPSAwXHJcbiAgLCBoaWRkZW4gPSBjcmVhdGVEZWZpbmVyKDEpXHJcbiAgLCBzZXQgICAgPSBTeW1ib2wgPyBzaW1wbGVTZXQgOiBoaWRkZW5cclxuICAsIHNhZmVTeW1ib2wgPSBTeW1ib2wgfHwgdWlkO1xyXG5mdW5jdGlvbiBhc3NpZ25IaWRkZW4odGFyZ2V0LCBzcmMpe1xyXG4gIGZvcih2YXIga2V5IGluIHNyYyloaWRkZW4odGFyZ2V0LCBrZXksIHNyY1trZXldKTtcclxuICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcblxyXG52YXIgU1lNQk9MX1VOU0NPUEFCTEVTID0gZ2V0V2VsbEtub3duU3ltYm9sKCd1bnNjb3BhYmxlcycpXHJcbiAgLCBBcnJheVVuc2NvcGFibGVzICAgPSBBcnJheVByb3RvW1NZTUJPTF9VTlNDT1BBQkxFU10gfHwge31cclxuICAsIFNZTUJPTF9UQUcgICAgICAgICA9IGdldFdlbGxLbm93blN5bWJvbChUT19TVFJJTkdfVEFHKVxyXG4gICwgU1lNQk9MX1NQRUNJRVMgICAgID0gZ2V0V2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJylcclxuICAsIFNZTUJPTF9JVEVSQVRPUjtcclxuZnVuY3Rpb24gc2V0U3BlY2llcyhDKXtcclxuICBpZihERVNDICYmIChmcmFtZXdvcmsgfHwgIWlzTmF0aXZlKEMpKSlkZWZpbmVQcm9wZXJ0eShDLCBTWU1CT0xfU1BFQ0lFUywge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiByZXR1cm5UaGlzXHJcbiAgfSk7XHJcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29tbW9uLmV4cG9ydCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIE5PREUgPSBjb2YocHJvY2VzcykgPT0gUFJPQ0VTU1xyXG4gICwgY29yZSA9IHt9XHJcbiAgLCBwYXRoID0gZnJhbWV3b3JrID8gZ2xvYmFsIDogY29yZVxyXG4gICwgb2xkICA9IGdsb2JhbC5jb3JlXHJcbiAgLCBleHBvcnRHbG9iYWxcclxuICAvLyB0eXBlIGJpdG1hcFxyXG4gICwgRk9SQ0VEID0gMVxyXG4gICwgR0xPQkFMID0gMlxyXG4gICwgU1RBVElDID0gNFxyXG4gICwgUFJPVE8gID0gOFxyXG4gICwgQklORCAgID0gMTZcclxuICAsIFdSQVAgICA9IDMyO1xyXG5mdW5jdGlvbiAkZGVmaW5lKHR5cGUsIG5hbWUsIHNvdXJjZSl7XHJcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxyXG4gICAgLCBpc0dsb2JhbCA9IHR5cGUgJiBHTE9CQUxcclxuICAgICwgdGFyZ2V0ICAgPSBpc0dsb2JhbCA/IGdsb2JhbCA6ICh0eXBlICYgU1RBVElDKVxyXG4gICAgICAgID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCBPYmplY3RQcm90bylbUFJPVE9UWVBFXVxyXG4gICAgLCBleHBvcnRzICA9IGlzR2xvYmFsID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XHJcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcclxuICBmb3Ioa2V5IGluIHNvdXJjZSl7XHJcbiAgICAvLyB0aGVyZSBpcyBhIHNpbWlsYXIgbmF0aXZlXHJcbiAgICBvd24gPSAhKHR5cGUgJiBGT1JDRUQpICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0XHJcbiAgICAgICYmICghaXNGdW5jdGlvbih0YXJnZXRba2V5XSkgfHwgaXNOYXRpdmUodGFyZ2V0W2tleV0pKTtcclxuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXHJcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xyXG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXHJcbiAgICBpZighZnJhbWV3b3JrICYmIGlzR2xvYmFsICYmICFpc0Z1bmN0aW9uKHRhcmdldFtrZXldKSlleHAgPSBzb3VyY2Vba2V5XTtcclxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XHJcbiAgICBlbHNlIGlmKHR5cGUgJiBCSU5EICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xyXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcclxuICAgIGVsc2UgaWYodHlwZSAmIFdSQVAgJiYgIWZyYW1ld29yayAmJiB0YXJnZXRba2V5XSA9PSBvdXQpe1xyXG4gICAgICBleHAgPSBmdW5jdGlvbihwYXJhbSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBvdXQgPyBuZXcgb3V0KHBhcmFtKSA6IG91dChwYXJhbSk7XHJcbiAgICAgIH1cclxuICAgICAgZXhwW1BST1RPVFlQRV0gPSBvdXRbUFJPVE9UWVBFXTtcclxuICAgIH0gZWxzZSBleHAgPSB0eXBlICYgUFJPVE8gJiYgaXNGdW5jdGlvbihvdXQpID8gY3R4KGNhbGwsIG91dCkgOiBvdXQ7XHJcbiAgICAvLyBleHRlbmQgZ2xvYmFsXHJcbiAgICBpZihmcmFtZXdvcmsgJiYgdGFyZ2V0ICYmICFvd24pe1xyXG4gICAgICBpZihpc0dsb2JhbCl0YXJnZXRba2V5XSA9IG91dDtcclxuICAgICAgZWxzZSBkZWxldGUgdGFyZ2V0W2tleV0gJiYgaGlkZGVuKHRhcmdldCwga2V5LCBvdXQpO1xyXG4gICAgfVxyXG4gICAgLy8gZXhwb3J0XHJcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KWhpZGRlbihleHBvcnRzLCBrZXksIGV4cCk7XHJcbiAgfVxyXG59XHJcbi8vIENvbW1vbkpTIGV4cG9ydFxyXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKW1vZHVsZS5leHBvcnRzID0gY29yZTtcclxuLy8gUmVxdWlyZUpTIGV4cG9ydFxyXG5lbHNlIGlmKGlzRnVuY3Rpb24oZGVmaW5lKSAmJiBkZWZpbmUuYW1kKWRlZmluZShmdW5jdGlvbigpe3JldHVybiBjb3JlfSk7XHJcbi8vIEV4cG9ydCB0byBnbG9iYWwgb2JqZWN0XHJcbmVsc2UgZXhwb3J0R2xvYmFsID0gdHJ1ZTtcclxuaWYoZXhwb3J0R2xvYmFsIHx8IGZyYW1ld29yayl7XHJcbiAgY29yZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKXtcclxuICAgIGdsb2JhbC5jb3JlID0gb2xkO1xyXG4gICAgcmV0dXJuIGNvcmU7XHJcbiAgfVxyXG4gIGdsb2JhbC5jb3JlID0gY29yZTtcclxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb21tb24uaXRlcmF0b3JzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5TWU1CT0xfSVRFUkFUT1IgPSBnZXRXZWxsS25vd25TeW1ib2woSVRFUkFUT1IpO1xyXG52YXIgSVRFUiAgPSBzYWZlU3ltYm9sKCdpdGVyJylcclxuICAsIEtFWSAgID0gMVxyXG4gICwgVkFMVUUgPSAyXHJcbiAgLCBJdGVyYXRvcnMgPSB7fVxyXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fVxyXG4gICAgLy8gU2FmYXJpIGhhcyBieWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxyXG4gICwgQlVHR1lfSVRFUkFUT1JTID0gJ2tleXMnIGluIEFycmF5UHJvdG8gJiYgISgnbmV4dCcgaW4gW10ua2V5cygpKTtcclxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcclxuc2V0SXRlcmF0b3IoSXRlcmF0b3JQcm90b3R5cGUsIHJldHVyblRoaXMpO1xyXG5mdW5jdGlvbiBzZXRJdGVyYXRvcihPLCB2YWx1ZSl7XHJcbiAgaGlkZGVuKE8sIFNZTUJPTF9JVEVSQVRPUiwgdmFsdWUpO1xyXG4gIC8vIEFkZCBpdGVyYXRvciBmb3IgRkYgaXRlcmF0b3IgcHJvdG9jb2xcclxuICBGRl9JVEVSQVRPUiBpbiBBcnJheVByb3RvICYmIGhpZGRlbihPLCBGRl9JVEVSQVRPUiwgdmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0LCBwcm90byl7XHJcbiAgQ29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IGNyZWF0ZShwcm90byB8fCBJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcclxuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgdmFsdWUsIERFRkFVTFQpe1xyXG4gIHZhciBwcm90byA9IENvbnN0cnVjdG9yW1BST1RPVFlQRV1cclxuICAgICwgaXRlciAgPSBnZXQocHJvdG8sIFNZTUJPTF9JVEVSQVRPUikgfHwgZ2V0KHByb3RvLCBGRl9JVEVSQVRPUikgfHwgKERFRkFVTFQgJiYgZ2V0KHByb3RvLCBERUZBVUxUKSkgfHwgdmFsdWU7XHJcbiAgaWYoZnJhbWV3b3JrKXtcclxuICAgIC8vIERlZmluZSBpdGVyYXRvclxyXG4gICAgc2V0SXRlcmF0b3IocHJvdG8sIGl0ZXIpO1xyXG4gICAgaWYoaXRlciAhPT0gdmFsdWUpe1xyXG4gICAgICB2YXIgaXRlclByb3RvID0gZ2V0UHJvdG90eXBlT2YoaXRlci5jYWxsKG5ldyBDb25zdHJ1Y3RvcikpO1xyXG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXHJcbiAgICAgIHNldFRvU3RyaW5nVGFnKGl0ZXJQcm90bywgTkFNRSArICcgSXRlcmF0b3InLCB0cnVlKTtcclxuICAgICAgLy8gRkYgZml4XHJcbiAgICAgIGhhcyhwcm90bywgRkZfSVRFUkFUT1IpICYmIHNldEl0ZXJhdG9yKGl0ZXJQcm90bywgcmV0dXJuVGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcclxuICBJdGVyYXRvcnNbTkFNRV0gPSBpdGVyO1xyXG4gIC8vIEZGICYgdjggZml4XHJcbiAgSXRlcmF0b3JzW05BTUUgKyAnIEl0ZXJhdG9yJ10gPSByZXR1cm5UaGlzO1xyXG4gIHJldHVybiBpdGVyO1xyXG59XHJcbmZ1bmN0aW9uIGRlZmluZVN0ZEl0ZXJhdG9ycyhCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VUKXtcclxuICBmdW5jdGlvbiBjcmVhdGVJdGVyKGtpbmQpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcclxuICB2YXIgZW50cmllcyA9IGNyZWF0ZUl0ZXIoS0VZK1ZBTFVFKVxyXG4gICAgLCB2YWx1ZXMgID0gY3JlYXRlSXRlcihWQUxVRSk7XHJcbiAgaWYoREVGQVVMVCA9PSBWQUxVRSl2YWx1ZXMgPSBkZWZpbmVJdGVyYXRvcihCYXNlLCBOQU1FLCB2YWx1ZXMsICd2YWx1ZXMnKTtcclxuICBlbHNlIGVudHJpZXMgPSBkZWZpbmVJdGVyYXRvcihCYXNlLCBOQU1FLCBlbnRyaWVzLCAnZW50cmllcycpO1xyXG4gIGlmKERFRkFVTFQpe1xyXG4gICAgJGRlZmluZShQUk9UTyArIEZPUkNFRCAqIEJVR0dZX0lURVJBVE9SUywgTkFNRSwge1xyXG4gICAgICBlbnRyaWVzOiBlbnRyaWVzLFxyXG4gICAgICBrZXlzOiBJU19TRVQgPyB2YWx1ZXMgOiBjcmVhdGVJdGVyKEtFWSksXHJcbiAgICAgIHZhbHVlczogdmFsdWVzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gaXRlclJlc3VsdChkb25lLCB2YWx1ZSl7XHJcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XHJcbn1cclxuZnVuY3Rpb24gaXNJdGVyYWJsZShpdCl7XHJcbiAgdmFyIE8gICAgICA9IE9iamVjdChpdClcclxuICAgICwgU3ltYm9sID0gZ2xvYmFsW1NZTUJPTF1cclxuICAgICwgaGFzRXh0ID0gKFN5bWJvbCAmJiBTeW1ib2xbSVRFUkFUT1JdIHx8IEZGX0lURVJBVE9SKSBpbiBPO1xyXG4gIHJldHVybiBoYXNFeHQgfHwgU1lNQk9MX0lURVJBVE9SIGluIE8gfHwgaGFzKEl0ZXJhdG9ycywgY2xhc3NvZihPKSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXQpe1xyXG4gIHZhciBTeW1ib2wgID0gZ2xvYmFsW1NZTUJPTF1cclxuICAgICwgZXh0ICAgICA9IGl0W1N5bWJvbCAmJiBTeW1ib2xbSVRFUkFUT1JdIHx8IEZGX0lURVJBVE9SXVxyXG4gICAgLCBnZXRJdGVyID0gZXh0IHx8IGl0W1NZTUJPTF9JVEVSQVRPUl0gfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcclxuICByZXR1cm4gYXNzZXJ0T2JqZWN0KGdldEl0ZXIuY2FsbChpdCkpO1xyXG59XHJcbmZ1bmN0aW9uIHN0ZXBDYWxsKGZuLCB2YWx1ZSwgZW50cmllcyl7XHJcbiAgcmV0dXJuIGVudHJpZXMgPyBpbnZva2UoZm4sIHZhbHVlKSA6IGZuKHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBjaGVja0Rhbmdlckl0ZXJDbG9zaW5nKGZuKXtcclxuICB2YXIgZGFuZ2VyID0gdHJ1ZTtcclxuICB2YXIgTyA9IHtcclxuICAgIG5leHQ6IGZ1bmN0aW9uKCl7IHRocm93IDEgfSxcclxuICAgICdyZXR1cm4nOiBmdW5jdGlvbigpeyBkYW5nZXIgPSBmYWxzZSB9XHJcbiAgfTtcclxuICBPW1NZTUJPTF9JVEVSQVRPUl0gPSByZXR1cm5UaGlzO1xyXG4gIHRyeSB7XHJcbiAgICBmbihPKTtcclxuICB9IGNhdGNoKGUpe31cclxuICByZXR1cm4gZGFuZ2VyO1xyXG59XHJcbmZ1bmN0aW9uIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3Ipe1xyXG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XHJcbiAgaWYocmV0ICE9PSB1bmRlZmluZWQpcmV0LmNhbGwoaXRlcmF0b3IpO1xyXG59XHJcbmZ1bmN0aW9uIHNhZmVJdGVyQ2xvc2UoZXhlYywgaXRlcmF0b3Ipe1xyXG4gIHRyeSB7XHJcbiAgICBleGVjKGl0ZXJhdG9yKTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICB0aHJvdyBlO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBmb3JPZihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xyXG4gIHNhZmVJdGVyQ2xvc2UoZnVuY3Rpb24oaXRlcmF0b3Ipe1xyXG4gICAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcclxuICAgICAgLCBzdGVwO1xyXG4gICAgd2hpbGUoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKWlmKHN0ZXBDYWxsKGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpID09PSBmYWxzZSl7XHJcbiAgICAgIHJldHVybiBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKTtcclxuICAgIH1cclxuICB9LCBnZXRJdGVyYXRvcihpdGVyYWJsZSkpO1xyXG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5zeW1ib2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cclxuIWZ1bmN0aW9uKFRBRywgU3ltYm9sUmVnaXN0cnksIEFsbFN5bWJvbHMsIHNldHRlcil7XHJcbiAgLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXHJcbiAgaWYoIWlzTmF0aXZlKFN5bWJvbCkpe1xyXG4gICAgU3ltYm9sID0gZnVuY3Rpb24oZGVzY3JpcHRpb24pe1xyXG4gICAgICBhc3NlcnQoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSwgU1lNQk9MICsgJyBpcyBub3QgYSAnICsgQ09OU1RSVUNUT1IpO1xyXG4gICAgICB2YXIgdGFnID0gdWlkKGRlc2NyaXB0aW9uKVxyXG4gICAgICAgICwgc3ltID0gc2V0KGNyZWF0ZShTeW1ib2xbUFJPVE9UWVBFXSksIFRBRywgdGFnKTtcclxuICAgICAgQWxsU3ltYm9sc1t0YWddID0gc3ltO1xyXG4gICAgICBERVNDICYmIHNldHRlciAmJiBkZWZpbmVQcm9wZXJ0eShPYmplY3RQcm90bywgdGFnLCB7XHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgaGlkZGVuKHRoaXMsIHRhZywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBzeW07XHJcbiAgICB9XHJcbiAgICBoaWRkZW4oU3ltYm9sW1BST1RPVFlQRV0sIFRPX1NUUklORywgZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXNbVEFHXTtcclxuICAgIH0pO1xyXG4gIH1cclxuICAkZGVmaW5lKEdMT0JBTCArIFdSQVAsIHtTeW1ib2w6IFN5bWJvbH0pO1xyXG4gIFxyXG4gIHZhciBzeW1ib2xTdGF0aWNzID0ge1xyXG4gICAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXHJcbiAgICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxyXG4gICAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxyXG4gICAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9IFN5bWJvbChrZXkpO1xyXG4gICAgfSxcclxuICAgIC8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxyXG4gICAgaXRlcmF0b3I6IFNZTUJPTF9JVEVSQVRPUiB8fCBnZXRXZWxsS25vd25TeW1ib2woSVRFUkFUT1IpLFxyXG4gICAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXHJcbiAgICBrZXlGb3I6IHBhcnQuY2FsbChrZXlPZiwgU3ltYm9sUmVnaXN0cnkpLFxyXG4gICAgLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXHJcbiAgICBzcGVjaWVzOiBTWU1CT0xfU1BFQ0lFUyxcclxuICAgIC8vIDE5LjQuMi4xMyBTeW1ib2wudG9TdHJpbmdUYWdcclxuICAgIHRvU3RyaW5nVGFnOiBTWU1CT0xfVEFHID0gZ2V0V2VsbEtub3duU3ltYm9sKFRPX1NUUklOR19UQUcsIHRydWUpLFxyXG4gICAgLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xyXG4gICAgdW5zY29wYWJsZXM6IFNZTUJPTF9VTlNDT1BBQkxFUyxcclxuICAgIHB1cmU6IHNhZmVTeW1ib2wsXHJcbiAgICBzZXQ6IHNldCxcclxuICAgIHVzZVNldHRlcjogZnVuY3Rpb24oKXtzZXR0ZXIgPSB0cnVlfSxcclxuICAgIHVzZVNpbXBsZTogZnVuY3Rpb24oKXtzZXR0ZXIgPSBmYWxzZX1cclxuICB9O1xyXG4gIC8vIDE5LjQuMi4yIFN5bWJvbC5oYXNJbnN0YW5jZVxyXG4gIC8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcclxuICAvLyAxOS40LjIuNiBTeW1ib2wubWF0Y2hcclxuICAvLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxyXG4gIC8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcclxuICAvLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XHJcbiAgLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxyXG4gIGZvckVhY2guY2FsbChhcnJheSgnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwbGl0LHRvUHJpbWl0aXZlJyksXHJcbiAgICBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHN5bWJvbFN0YXRpY3NbaXRdID0gZ2V0V2VsbEtub3duU3ltYm9sKGl0KTtcclxuICAgIH1cclxuICApO1xyXG4gICRkZWZpbmUoU1RBVElDLCBTWU1CT0wsIHN5bWJvbFN0YXRpY3MpO1xyXG4gIFxyXG4gIHNldFRvU3RyaW5nVGFnKFN5bWJvbCwgU1lNQk9MKTtcclxuICBcclxuICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCAqICFpc05hdGl2ZShTeW1ib2wpLCBPQkpFQ1QsIHtcclxuICAgIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXHJcbiAgICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHZhciBuYW1lcyA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSksIHJlc3VsdCA9IFtdLCBrZXksIGkgPSAwO1xyXG4gICAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcclxuICAgIGdldE93blByb3BlcnR5U3ltYm9sczogZnVuY3Rpb24oaXQpe1xyXG4gICAgICB2YXIgbmFtZXMgPSBnZXROYW1lcyh0b09iamVjdChpdCkpLCByZXN1bHQgPSBbXSwga2V5LCBpID0gMDtcclxuICAgICAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSloYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAvLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXHJcbiAgc2V0VG9TdHJpbmdUYWcoTWF0aCwgTUFUSCwgdHJ1ZSk7XHJcbiAgLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cclxuICBzZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTtcclxufShzYWZlU3ltYm9sKCd0YWcnKSwge30sIHt9LCB0cnVlKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm9iamVjdC5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgdmFyIG9iamVjdFN0YXRpYyA9IHtcclxuICAgIC8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXHJcbiAgICBhc3NpZ246IGFzc2lnbixcclxuICAgIC8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXHJcbiAgICBpczogZnVuY3Rpb24oeCwgeSl7XHJcbiAgICAgIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xyXG4gICAgfVxyXG4gIH07XHJcbiAgLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcclxuICAvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29ya3Mgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXHJcbiAgJ19fcHJvdG9fXycgaW4gT2JqZWN0UHJvdG8gJiYgZnVuY3Rpb24oYnVnZ3ksIHNldCl7XHJcbiAgICB0cnkge1xyXG4gICAgICBzZXQgPSBjdHgoY2FsbCwgZ2V0T3duRGVzY3JpcHRvcihPYmplY3RQcm90bywgJ19fcHJvdG9fXycpLnNldCwgMik7XHJcbiAgICAgIHNldCh7fSwgQXJyYXlQcm90byk7XHJcbiAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWUgfVxyXG4gICAgb2JqZWN0U3RhdGljLnNldFByb3RvdHlwZU9mID0gc2V0UHJvdG90eXBlT2YgPSBzZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPLCBwcm90byl7XHJcbiAgICAgIGFzc2VydE9iamVjdChPKTtcclxuICAgICAgYXNzZXJ0KHByb3RvID09PSBudWxsIHx8IGlzT2JqZWN0KHByb3RvKSwgcHJvdG8sIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcclxuICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcclxuICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xyXG4gICAgICByZXR1cm4gTztcclxuICAgIH1cclxuICB9KCk7XHJcbiAgJGRlZmluZShTVEFUSUMsIE9CSkVDVCwgb2JqZWN0U3RhdGljKTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAvLyBPYmplY3Qgc3RhdGljIG1ldGhvZHMgYWNjZXB0IHByaW1pdGl2ZXNcclxuICBmdW5jdGlvbiB3cmFwT2JqZWN0TWV0aG9kKGtleSwgTU9ERSl7XHJcbiAgICB2YXIgZm4gID0gT2JqZWN0W2tleV1cclxuICAgICAgLCBleHAgPSBjb3JlW09CSkVDVF1ba2V5XVxyXG4gICAgICAsIGYgICA9IDBcclxuICAgICAgLCBvICAgPSB7fTtcclxuICAgIGlmKCFleHAgfHwgaXNOYXRpdmUoZXhwKSl7XHJcbiAgICAgIG9ba2V5XSA9IE1PREUgPT0gMSA/IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XHJcbiAgICAgIH0gOiBNT0RFID09IDIgPyBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IHRydWU7XHJcbiAgICAgIH0gOiBNT0RFID09IDMgPyBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGZhbHNlO1xyXG4gICAgICB9IDogTU9ERSA9PSA0ID8gZnVuY3Rpb24oaXQsIGtleSl7XHJcbiAgICAgICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSwga2V5KTtcclxuICAgICAgfSA6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpKTtcclxuICAgICAgfTtcclxuICAgICAgdHJ5IHsgZm4oRE9UKSB9XHJcbiAgICAgIGNhdGNoKGUpeyBmID0gMSB9XHJcbiAgICAgICRkZWZpbmUoU1RBVElDICsgRk9SQ0VEICogZiwgT0JKRUNULCBvKTtcclxuICAgIH1cclxuICB9XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZnJlZXplJywgMSk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnc2VhbCcsIDEpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ3ByZXZlbnRFeHRlbnNpb25zJywgMSk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnaXNGcm96ZW4nLCAyKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdpc1NlYWxlZCcsIDIpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2lzRXh0ZW5zaWJsZScsIDMpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIDQpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2dldFByb3RvdHlwZU9mJyk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgna2V5cycpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5TmFtZXMnKTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYubnVtYmVyLnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oaXNJbnRlZ2VyKXtcclxuICAkZGVmaW5lKFNUQVRJQywgTlVNQkVSLCB7XHJcbiAgICAvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxyXG4gICAgRVBTSUxPTjogcG93KDIsIC01MiksXHJcbiAgICAvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxyXG4gICAgaXNGaW5pdGU6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShpdCk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbiAgICBpc0ludGVnZXI6IGlzSW50ZWdlcixcclxuICAgIC8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXHJcbiAgICBpc05hTjogc2FtZU5hTixcclxuICAgIC8vIDIwLjEuMi41IE51bWJlci5pc1NhZmVJbnRlZ2VyKG51bWJlcilcclxuICAgIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uKG51bWJlcil7XHJcbiAgICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjEuMi42IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxyXG4gICAgLy8gMjAuMS4yLjEwIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXHJcbiAgICBNSU5fU0FGRV9JTlRFR0VSOiAtTUFYX1NBRkVfSU5URUdFUixcclxuICAgIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXHJcbiAgICBwYXJzZUZsb2F0OiBwYXJzZUZsb2F0LFxyXG4gICAgLy8gMjAuMS4yLjEzIE51bWJlci5wYXJzZUludChzdHJpbmcsIHJhZGl4KVxyXG4gICAgcGFyc2VJbnQ6IHBhcnNlSW50XHJcbiAgfSk7XHJcbi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxyXG59KE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiAhaXNPYmplY3QoaXQpICYmIGlzRmluaXRlKGl0KSAmJiBmbG9vcihpdCkgPT09IGl0O1xyXG59KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm1hdGggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRUNNQVNjcmlwdCA2IHNoaW1cclxuIWZ1bmN0aW9uKCl7XHJcbiAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxyXG4gIHZhciBFICAgID0gTWF0aC5FXHJcbiAgICAsIGV4cCAgPSBNYXRoLmV4cFxyXG4gICAgLCBsb2cgID0gTWF0aC5sb2dcclxuICAgICwgc3FydCA9IE1hdGguc3FydFxyXG4gICAgLCBzaWduID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJldHVybiAoeCA9ICt4KSA9PSAwIHx8IHggIT0geCA/IHggOiB4IDwgMCA/IC0xIDogMTtcclxuICAgICAgfTtcclxuICBcclxuICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXHJcbiAgZnVuY3Rpb24gYXNpbmgoeCl7XHJcbiAgICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IGxvZyh4ICsgc3FydCh4ICogeCArIDEpKTtcclxuICB9XHJcbiAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuICBmdW5jdGlvbiBleHBtMSh4KXtcclxuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IHggPiAtMWUtNiAmJiB4IDwgMWUtNiA/IHggKyB4ICogeCAvIDIgOiBleHAoeCkgLSAxO1xyXG4gIH1cclxuICAgIFxyXG4gICRkZWZpbmUoU1RBVElDLCBNQVRILCB7XHJcbiAgICAvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXHJcbiAgICBhY29zaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA9ICt4KSA8IDEgPyBOYU4gOiBpc0Zpbml0ZSh4KSA/IGxvZyh4IC8gRSArIHNxcnQoeCArIDEpICogc3FydCh4IC0gMSkgLyBFKSArIDEgOiB4O1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuICAgIGFzaW5oOiBhc2luaCxcclxuICAgIC8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcclxuICAgIGF0YW5oOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogbG9nKCgxICsgeCkgLyAoMSAtIHgpKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXHJcbiAgICBjYnJ0OiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIHNpZ24oeCA9ICt4KSAqIHBvdyhhYnMoeCksIDEgLyAzKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxyXG4gICAgY2x6MzI6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMyIC0geFtUT19TVFJJTkddKDIpLmxlbmd0aCA6IDMyO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcclxuICAgIGNvc2g6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXHJcbiAgICBleHBtMTogZXhwbTEsXHJcbiAgICAvLyAyMC4yLjIuMTYgTWF0aC5mcm91bmQoeClcclxuICAgIC8vIFRPRE86IGZhbGxiYWNrIGZvciBJRTktXHJcbiAgICBmcm91bmQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbeF0pWzBdO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxyXG4gICAgaHlwb3Q6IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKXtcclxuICAgICAgdmFyIHN1bSAgPSAwXHJcbiAgICAgICAgLCBsZW4xID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICwgbGVuMiA9IGxlbjFcclxuICAgICAgICAsIGFyZ3MgPSBBcnJheShsZW4xKVxyXG4gICAgICAgICwgbGFyZyA9IC1JbmZpbml0eVxyXG4gICAgICAgICwgYXJnO1xyXG4gICAgICB3aGlsZShsZW4xLS0pe1xyXG4gICAgICAgIGFyZyA9IGFyZ3NbbGVuMV0gPSArYXJndW1lbnRzW2xlbjFdO1xyXG4gICAgICAgIGlmKGFyZyA9PSBJbmZpbml0eSB8fCBhcmcgPT0gLUluZmluaXR5KXJldHVybiBJbmZpbml0eTtcclxuICAgICAgICBpZihhcmcgPiBsYXJnKWxhcmcgPSBhcmc7XHJcbiAgICAgIH1cclxuICAgICAgbGFyZyA9IGFyZyB8fCAxO1xyXG4gICAgICB3aGlsZShsZW4yLS0pc3VtICs9IHBvdyhhcmdzW2xlbjJdIC8gbGFyZywgMik7XHJcbiAgICAgIHJldHVybiBsYXJnICogc3FydChzdW0pO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xOCBNYXRoLmltdWwoeCwgeSlcclxuICAgIGltdWw6IGZ1bmN0aW9uKHgsIHkpe1xyXG4gICAgICB2YXIgVUludDE2ID0gMHhmZmZmXHJcbiAgICAgICAgLCB4biA9ICt4XHJcbiAgICAgICAgLCB5biA9ICt5XHJcbiAgICAgICAgLCB4bCA9IFVJbnQxNiAmIHhuXHJcbiAgICAgICAgLCB5bCA9IFVJbnQxNiAmIHluO1xyXG4gICAgICByZXR1cm4gMCB8IHhsICogeWwgKyAoKFVJbnQxNiAmIHhuID4+PiAxNikgKiB5bCArIHhsICogKFVJbnQxNiAmIHluID4+PiAxNikgPDwgMTYgPj4+IDApO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXHJcbiAgICBsb2cxcDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IGxvZygxICsgeCk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjIxIE1hdGgubG9nMTAoeClcclxuICAgIGxvZzEwOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4xMDtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXHJcbiAgICBsb2cyOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4yO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuICAgIHNpZ246IHNpZ24sXHJcbiAgICAvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXHJcbiAgICBzaW5oOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIChhYnMoeCA9ICt4KSA8IDEpID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDIgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChFIC8gMik7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxyXG4gICAgdGFuaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxyXG4gICAgICAgICwgYiA9IGV4cG0xKC14KTtcclxuICAgICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMzQgTWF0aC50cnVuYyh4KVxyXG4gICAgdHJ1bmM6IHRydW5jXHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGZyb21DaGFyQ29kZSl7XHJcbiAgZnVuY3Rpb24gYXNzZXJ0Tm90UmVnRXhwKGl0KXtcclxuICAgIGlmKGNvZihpdCkgPT0gUkVHRVhQKXRocm93IFR5cGVFcnJvcigpO1xyXG4gIH1cclxuICBcclxuICAkZGVmaW5lKFNUQVRJQywgU1RSSU5HLCB7XHJcbiAgICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxyXG4gICAgZnJvbUNvZGVQb2ludDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHZhciByZXMgPSBbXVxyXG4gICAgICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICwgaSAgID0gMFxyXG4gICAgICAgICwgY29kZVxyXG4gICAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgICBjb2RlID0gK2FyZ3VtZW50c1tpKytdO1xyXG4gICAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xyXG4gICAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXHJcbiAgICAgICAgICA/IGZyb21DaGFyQ29kZShjb2RlKVxyXG4gICAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxyXG4gICAgcmF3OiBmdW5jdGlvbihjYWxsU2l0ZSl7XHJcbiAgICAgIHZhciByYXcgPSB0b09iamVjdChjYWxsU2l0ZS5yYXcpXHJcbiAgICAgICAgLCBsZW4gPSB0b0xlbmd0aChyYXcubGVuZ3RoKVxyXG4gICAgICAgICwgc2xuID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICwgcmVzID0gW11cclxuICAgICAgICAsIGkgICA9IDA7XHJcbiAgICAgIHdoaWxlKGxlbiA+IGkpe1xyXG4gICAgICAgIHJlcy5wdXNoKFN0cmluZyhyYXdbaSsrXSkpO1xyXG4gICAgICAgIGlmKGkgPCBzbG4pcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJGRlZmluZShQUk9UTywgU1RSSU5HLCB7XHJcbiAgICAvLyAyMS4xLjMuMyBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KHBvcylcclxuICAgIGNvZGVQb2ludEF0OiBjcmVhdGVQb2ludEF0KGZhbHNlKSxcclxuICAgIC8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcclxuICAgIGVuZHNXaXRoOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLyl7XHJcbiAgICAgIGFzc2VydE5vdFJlZ0V4cChzZWFyY2hTdHJpbmcpO1xyXG4gICAgICB2YXIgdGhhdCA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgZW5kUG9zaXRpb24gPSBhcmd1bWVudHNbMV1cclxuICAgICAgICAsIGxlbiA9IHRvTGVuZ3RoKHRoYXQubGVuZ3RoKVxyXG4gICAgICAgICwgZW5kID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IG1pbih0b0xlbmd0aChlbmRQb3NpdGlvbiksIGxlbik7XHJcbiAgICAgIHNlYXJjaFN0cmluZyArPSAnJztcclxuICAgICAgcmV0dXJuIHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoU3RyaW5nLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoU3RyaW5nO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMy43IFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbiA9IDApXHJcbiAgICBpbmNsdWRlczogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xyXG4gICAgICBhc3NlcnROb3RSZWdFeHAoc2VhcmNoU3RyaW5nKTtcclxuICAgICAgcmV0dXJuICEhflN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKS5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXHJcbiAgICByZXBlYXQ6IGZ1bmN0aW9uKGNvdW50KXtcclxuICAgICAgdmFyIHN0ciA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgcmVzID0gJydcclxuICAgICAgICAsIG4gICA9IHRvSW50ZWdlcihjb3VudCk7XHJcbiAgICAgIGlmKDAgPiBuIHx8IG4gPT0gSW5maW5pdHkpdGhyb3cgUmFuZ2VFcnJvcihcIkNvdW50IGNhbid0IGJlIG5lZ2F0aXZlXCIpO1xyXG4gICAgICBmb3IoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSlpZihuICYgMSlyZXMgKz0gc3RyO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXHJcbiAgICBzdGFydHNXaXRoOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICAgIGFzc2VydE5vdFJlZ0V4cChzZWFyY2hTdHJpbmcpO1xyXG4gICAgICB2YXIgdGhhdCAgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGluZGV4ID0gdG9MZW5ndGgobWluKGFyZ3VtZW50c1sxXSwgdGhhdC5sZW5ndGgpKTtcclxuICAgICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgICByZXR1cm4gdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJpbmcubGVuZ3RoKSA9PT0gc2VhcmNoU3RyaW5nO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KFN0cmluZy5mcm9tQ2hhckNvZGUpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuYXJyYXkuc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCAqIGNoZWNrRGFuZ2VySXRlckNsb3NpbmcoQXJyYXkuZnJvbSksIEFSUkFZLCB7XHJcbiAgICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmcm9tOiBmdW5jdGlvbihhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XHJcbiAgICAgIHZhciBPICAgICAgID0gT2JqZWN0KGFzc2VydERlZmluZWQoYXJyYXlMaWtlKSlcclxuICAgICAgICAsIG1hcGZuICAgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgLCBmICAgICAgID0gbWFwcGluZyA/IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKSA6IHVuZGVmaW5lZFxyXG4gICAgICAgICwgaW5kZXggICA9IDBcclxuICAgICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwO1xyXG4gICAgICBpZihpc0l0ZXJhYmxlKE8pKXtcclxuICAgICAgICByZXN1bHQgPSBuZXcgKGdlbmVyaWModGhpcywgQXJyYXkpKTtcclxuICAgICAgICBzYWZlSXRlckNsb3NlKGZ1bmN0aW9uKGl0ZXJhdG9yKXtcclxuICAgICAgICAgIGZvcig7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gZihzdGVwLnZhbHVlLCBpbmRleCkgOiBzdGVwLnZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIGdldEl0ZXJhdG9yKE8pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBuZXcgKGdlbmVyaWModGhpcywgQXJyYXkpKShsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCkpO1xyXG4gICAgICAgIGZvcig7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcclxuICAgICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gZihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAkZGVmaW5lKFNUQVRJQywgQVJSQVksIHtcclxuICAgIC8vIDIyLjEuMi4zIEFycmF5Lm9mKCAuLi5pdGVtcylcclxuICAgIG9mOiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgdmFyIGluZGV4ICA9IDBcclxuICAgICAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIHJlc3VsdCA9IG5ldyAoZ2VuZXJpYyh0aGlzLCBBcnJheSkpKGxlbmd0aCk7XHJcbiAgICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KXJlc3VsdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXgrK107XHJcbiAgICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgc2V0U3BlY2llcyhBcnJheSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LmFycmF5LnByb3RvdHlwZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgJGRlZmluZShQUk9UTywgQVJSQVksIHtcclxuICAgIC8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxyXG4gICAgY29weVdpdGhpbjogZnVuY3Rpb24odGFyZ2V0IC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgICAgdmFyIE8gICAgID0gT2JqZWN0KGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBsZW4gICA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAgICwgdG8gICAgPSB0b0luZGV4KHRhcmdldCwgbGVuKVxyXG4gICAgICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXHJcbiAgICAgICAgLCBlbmQgICA9IGFyZ3VtZW50c1syXVxyXG4gICAgICAgICwgZmluICAgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IHRvSW5kZXgoZW5kLCBsZW4pXHJcbiAgICAgICAgLCBjb3VudCA9IG1pbihmaW4gLSBmcm9tLCBsZW4gLSB0bylcclxuICAgICAgICAsIGluYyAgID0gMTtcclxuICAgICAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcclxuICAgICAgICBpbmMgID0gLTE7XHJcbiAgICAgICAgZnJvbSA9IGZyb20gKyBjb3VudCAtIDE7XHJcbiAgICAgICAgdG8gICA9IHRvICsgY291bnQgLSAxO1xyXG4gICAgICB9XHJcbiAgICAgIHdoaWxlKGNvdW50LS0gPiAwKXtcclxuICAgICAgICBpZihmcm9tIGluIE8pT1t0b10gPSBPW2Zyb21dO1xyXG4gICAgICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xyXG4gICAgICAgIHRvICs9IGluYztcclxuICAgICAgICBmcm9tICs9IGluYztcclxuICAgICAgfSByZXR1cm4gTztcclxuICAgIH0sXHJcbiAgICAvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcclxuICAgIGZpbGw6IGZ1bmN0aW9uKHZhbHVlIC8qLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xyXG4gICAgICB2YXIgTyAgICAgID0gT2JqZWN0KGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXHJcbiAgICAgICAgLCBlbmQgICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgICAsIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbmRleChlbmQsIGxlbmd0aCk7XHJcbiAgICAgIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIE87XHJcbiAgICB9LFxyXG4gICAgLy8gMjIuMS4zLjggQXJyYXkucHJvdG90eXBlLmZpbmQocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZmluZDogY3JlYXRlQXJyYXlNZXRob2QoNSksXHJcbiAgICAvLyAyMi4xLjMuOSBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZpbmRJbmRleDogY3JlYXRlQXJyYXlNZXRob2QoNilcclxuICB9KTtcclxuICBcclxuICBpZihmcmFtZXdvcmspe1xyXG4gICAgLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxyXG4gICAgZm9yRWFjaC5jYWxsKGFycmF5KCdmaW5kLGZpbmRJbmRleCxmaWxsLGNvcHlXaXRoaW4sZW50cmllcyxrZXlzLHZhbHVlcycpLCBmdW5jdGlvbihpdCl7XHJcbiAgICAgIEFycmF5VW5zY29wYWJsZXNbaXRdID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgU1lNQk9MX1VOU0NPUEFCTEVTIGluIEFycmF5UHJvdG8gfHwgaGlkZGVuKEFycmF5UHJvdG8sIFNZTUJPTF9VTlNDT1BBQkxFUywgQXJyYXlVbnNjb3BhYmxlcyk7XHJcbiAgfVxyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5pdGVyYXRvcnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihhdCl7XHJcbiAgLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxyXG4gIC8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXHJcbiAgLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxyXG4gIC8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG4gIGRlZmluZVN0ZEl0ZXJhdG9ycyhBcnJheSwgQVJSQVksIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogdG9PYmplY3QoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XHJcbiAgLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXHJcbiAgfSwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBPICAgICA9IGl0ZXIub1xyXG4gICAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAgICwgaW5kZXggPSBpdGVyLmkrKztcclxuICAgIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcclxuICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICByZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgIH1cclxuICAgIGlmKGtpbmQgPT0gS0VZKSAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgaW5kZXgpO1xyXG4gICAgaWYoa2luZCA9PSBWQUxVRSlyZXR1cm4gaXRlclJlc3VsdCgwLCBPW2luZGV4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIFtpbmRleCwgT1tpbmRleF1dKTtcclxuICB9LCBWQUxVRSk7XHJcbiAgXHJcbiAgLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxyXG4gIEl0ZXJhdG9yc1tBUkdVTUVOVFNdID0gSXRlcmF0b3JzW0FSUkFZXTtcclxuICBcclxuICAvLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiAgZGVmaW5lU3RkSXRlcmF0b3JzKFN0cmluZywgU1RSSU5HLCBmdW5jdGlvbihpdGVyYXRlZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IFN0cmluZyhpdGVyYXRlZCksIGk6IDB9KTtcclxuICAvLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXHJcbiAgfSwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBPICAgICA9IGl0ZXIub1xyXG4gICAgICAsIGluZGV4ID0gaXRlci5pXHJcbiAgICAgICwgcG9pbnQ7XHJcbiAgICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgIHBvaW50ID0gYXQuY2FsbChPLCBpbmRleCk7XHJcbiAgICBpdGVyLmkgKz0gcG9pbnQubGVuZ3RoO1xyXG4gICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgcG9pbnQpO1xyXG4gIH0pO1xyXG59KGNyZWF0ZVBvaW50QXQodHJ1ZSkpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiB3ZWIuaW1tZWRpYXRlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBzZXRJbW1lZGlhdGUgc2hpbVxyXG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBlbHNlOlxyXG5pc0Z1bmN0aW9uKHNldEltbWVkaWF0ZSkgJiYgaXNGdW5jdGlvbihjbGVhckltbWVkaWF0ZSkgfHwgZnVuY3Rpb24oT05SRUFEWVNUQVRFQ0hBTkdFKXtcclxuICB2YXIgcG9zdE1lc3NhZ2UgICAgICA9IGdsb2JhbC5wb3N0TWVzc2FnZVxyXG4gICAgLCBhZGRFdmVudExpc3RlbmVyID0gZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcclxuICAgICwgTWVzc2FnZUNoYW5uZWwgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxyXG4gICAgLCBjb3VudGVyICAgICAgICAgID0gMFxyXG4gICAgLCBxdWV1ZSAgICAgICAgICAgID0ge31cclxuICAgICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XHJcbiAgc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24oZm4pe1xyXG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XHJcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGludm9rZShpc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGRlZmVyKGNvdW50ZXIpO1xyXG4gICAgcmV0dXJuIGNvdW50ZXI7XHJcbiAgfVxyXG4gIGNsZWFySW1tZWRpYXRlID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gcnVuKGlkKXtcclxuICAgIGlmKGhhcyhxdWV1ZSwgaWQpKXtcclxuICAgICAgdmFyIGZuID0gcXVldWVbaWRdO1xyXG4gICAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gICAgICBmbigpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBsaXN0bmVyKGV2ZW50KXtcclxuICAgIHJ1bihldmVudC5kYXRhKTtcclxuICB9XHJcbiAgLy8gTm9kZS5qcyAwLjgtXHJcbiAgaWYoTk9ERSl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgbmV4dFRpY2socGFydC5jYWxsKHJ1biwgaWQpKTtcclxuICAgIH1cclxuICAvLyBNb2Rlcm4gYnJvd3NlcnMsIHNraXAgaW1wbGVtZW50YXRpb24gZm9yIFdlYldvcmtlcnNcclxuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyBvYmplY3RcclxuICB9IGVsc2UgaWYoYWRkRXZlbnRMaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKHBvc3RNZXNzYWdlKSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHBvc3RNZXNzYWdlKGlkLCAnKicpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcclxuICAvLyBXZWJXb3JrZXJzXHJcbiAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oTWVzc2FnZUNoYW5uZWwpKXtcclxuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XHJcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcclxuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcclxuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xyXG4gIC8vIElFOC1cclxuICB9IGVsc2UgaWYoZG9jdW1lbnQgJiYgT05SRUFEWVNUQVRFQ0hBTkdFIGluIGRvY3VtZW50W0NSRUFURV9FTEVNRU5UXSgnc2NyaXB0Jykpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnRbQ1JFQVRFX0VMRU1FTlRdKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICBydW4oaWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcclxuICB9IGVsc2Uge1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHNldFRpbWVvdXQocnVuLCAwLCBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG59KCdvbnJlYWR5c3RhdGVjaGFuZ2UnKTtcclxuJGRlZmluZShHTE9CQUwgKyBCSU5ELCB7XHJcbiAgc2V0SW1tZWRpYXRlOiAgIHNldEltbWVkaWF0ZSxcclxuICBjbGVhckltbWVkaWF0ZTogY2xlYXJJbW1lZGlhdGVcclxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5wcm9taXNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVTNiBwcm9taXNlcyBzaGltXHJcbi8vIEJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9nZXRpZnkvbmF0aXZlLXByb21pc2Utb25seS9cclxuIWZ1bmN0aW9uKFByb21pc2UsIHRlc3Qpe1xyXG4gIGlzRnVuY3Rpb24oUHJvbWlzZSkgJiYgaXNGdW5jdGlvbihQcm9taXNlLnJlc29sdmUpXHJcbiAgJiYgUHJvbWlzZS5yZXNvbHZlKHRlc3QgPSBuZXcgUHJvbWlzZShmdW5jdGlvbigpe30pKSA9PSB0ZXN0XHJcbiAgfHwgZnVuY3Rpb24oYXNhcCwgUkVDT1JEKXtcclxuICAgIGZ1bmN0aW9uIGlzVGhlbmFibGUoaXQpe1xyXG4gICAgICB2YXIgdGhlbjtcclxuICAgICAgaWYoaXNPYmplY3QoaXQpKXRoZW4gPSBpdC50aGVuO1xyXG4gICAgICByZXR1cm4gaXNGdW5jdGlvbih0aGVuKSA/IHRoZW4gOiBmYWxzZTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSl7XHJcbiAgICAgIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cclxuICAgICAgICAsIGNoYWluICA9IHJlY29yZC5jXHJcbiAgICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICAgLCByZWFjdDtcclxuICAgICAgaWYocmVjb3JkLmgpcmV0dXJuIHRydWU7XHJcbiAgICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xyXG4gICAgICAgIHJlYWN0ID0gY2hhaW5baSsrXTtcclxuICAgICAgICBpZihyZWFjdC5mYWlsIHx8IGhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocmVhY3QuUCkpcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG5vdGlmeShyZWNvcmQsIHJlamVjdCl7XHJcbiAgICAgIHZhciBjaGFpbiA9IHJlY29yZC5jO1xyXG4gICAgICBpZihyZWplY3QgfHwgY2hhaW4ubGVuZ3RoKWFzYXAoZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcHJvbWlzZSA9IHJlY29yZC5wXHJcbiAgICAgICAgICAsIHZhbHVlICAgPSByZWNvcmQudlxyXG4gICAgICAgICAgLCBvayAgICAgID0gcmVjb3JkLnMgPT0gMVxyXG4gICAgICAgICAgLCBpICAgICAgID0gMDtcclxuICAgICAgICBpZihyZWplY3QgJiYgIWhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSkpe1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZighaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKSl7XHJcbiAgICAgICAgICAgICAgaWYoTk9ERSl7XHJcbiAgICAgICAgICAgICAgICBpZighcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSkpe1xyXG4gICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IG5vZGUuanMgYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNGdW5jdGlvbihjb25zb2xlLmVycm9yKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCAxZTMpO1xyXG4gICAgICAgIH0gZWxzZSB3aGlsZShjaGFpbi5sZW5ndGggPiBpKSFmdW5jdGlvbihyZWFjdCl7XHJcbiAgICAgICAgICB2YXIgY2IgPSBvayA/IHJlYWN0Lm9rIDogcmVhY3QuZmFpbFxyXG4gICAgICAgICAgICAsIHJldCwgdGhlbjtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmKGNiKXtcclxuICAgICAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHJldCA9IGNiID09PSB0cnVlID8gdmFsdWUgOiBjYih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgaWYocmV0ID09PSByZWFjdC5QKXtcclxuICAgICAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoUFJPTUlTRSArICctY2hhaW4gY3ljbGUnKSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJldCkpe1xyXG4gICAgICAgICAgICAgICAgdGhlbi5jYWxsKHJldCwgcmVhY3QucmVzLCByZWFjdC5yZWopO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHJlYWN0LnJlaih2YWx1ZSk7XHJcbiAgICAgICAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgICAgICAgIHJlYWN0LnJlaihlcnIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0oY2hhaW5baSsrXSk7XHJcbiAgICAgICAgY2hhaW4ubGVuZ3RoID0gMDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNvbHZlKHZhbHVlKXtcclxuICAgICAgdmFyIHJlY29yZCA9IHRoaXNcclxuICAgICAgICAsIHRoZW4sIHdyYXBwZXI7XHJcbiAgICAgIGlmKHJlY29yZC5kKXJldHVybjtcclxuICAgICAgcmVjb3JkLmQgPSB0cnVlO1xyXG4gICAgICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XHJcbiAgICAgICAgICB3cmFwcGVyID0ge3I6IHJlY29yZCwgZDogZmFsc2V9OyAvLyB3cmFwXHJcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eChyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KHJlamVjdCwgd3JhcHBlciwgMSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZWNvcmQudiA9IHZhbHVlO1xyXG4gICAgICAgICAgcmVjb3JkLnMgPSAxO1xyXG4gICAgICAgICAgbm90aWZ5KHJlY29yZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgICAgcmVqZWN0LmNhbGwod3JhcHBlciB8fCB7cjogcmVjb3JkLCBkOiBmYWxzZX0sIGVycik7IC8vIHdyYXBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKXtcclxuICAgICAgdmFyIHJlY29yZCA9IHRoaXM7XHJcbiAgICAgIGlmKHJlY29yZC5kKXJldHVybjtcclxuICAgICAgcmVjb3JkLmQgPSB0cnVlO1xyXG4gICAgICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxyXG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xyXG4gICAgICByZWNvcmQucyA9IDI7XHJcbiAgICAgIG5vdGlmeShyZWNvcmQsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3IoQyl7XHJcbiAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KEMpW1NZTUJPTF9TUEVDSUVTXTtcclxuICAgICAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XHJcbiAgICB9XHJcbiAgICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxyXG4gICAgUHJvbWlzZSA9IGZ1bmN0aW9uKGV4ZWN1dG9yKXtcclxuICAgICAgYXNzZXJ0RnVuY3Rpb24oZXhlY3V0b3IpO1xyXG4gICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBQcm9taXNlLCBQUk9NSVNFKTtcclxuICAgICAgdmFyIHJlY29yZCA9IHtcclxuICAgICAgICBwOiB0aGlzLCAgICAgIC8vIHByb21pc2VcclxuICAgICAgICBjOiBbXSwgICAgICAgIC8vIGNoYWluXHJcbiAgICAgICAgczogMCwgICAgICAgICAvLyBzdGF0ZVxyXG4gICAgICAgIGQ6IGZhbHNlLCAgICAgLy8gZG9uZVxyXG4gICAgICAgIHY6IHVuZGVmaW5lZCwgLy8gdmFsdWVcclxuICAgICAgICBoOiBmYWxzZSAgICAgIC8vIGhhbmRsZWQgcmVqZWN0aW9uXHJcbiAgICAgIH07XHJcbiAgICAgIGhpZGRlbih0aGlzLCBSRUNPUkQsIHJlY29yZCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZXhlY3V0b3IoY3R4KHJlc29sdmUsIHJlY29yZCwgMSksIGN0eChyZWplY3QsIHJlY29yZCwgMSkpO1xyXG4gICAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgICAgcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3NpZ25IaWRkZW4oUHJvbWlzZVtQUk9UT1RZUEVdLCB7XHJcbiAgICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXHJcbiAgICAgIHRoZW46IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcclxuICAgICAgICB2YXIgUyA9IGFzc2VydE9iamVjdChhc3NlcnRPYmplY3QodGhpcylbQ09OU1RSVUNUT1JdKVtTWU1CT0xfU1BFQ0lFU107XHJcbiAgICAgICAgdmFyIHJlYWN0ID0ge1xyXG4gICAgICAgICAgb2s6ICAgaXNGdW5jdGlvbihvbkZ1bGZpbGxlZCkgPyBvbkZ1bGZpbGxlZCA6IHRydWUsXHJcbiAgICAgICAgICBmYWlsOiBpc0Z1bmN0aW9uKG9uUmVqZWN0ZWQpICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcclxuICAgICAgICB9ICwgUCA9IHJlYWN0LlAgPSBuZXcgKFMgIT0gdW5kZWZpbmVkID8gUyA6IFByb21pc2UpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICByZWFjdC5yZXMgPSBhc3NlcnRGdW5jdGlvbihyZXNvbHZlKTtcclxuICAgICAgICAgIHJlYWN0LnJlaiA9IGFzc2VydEZ1bmN0aW9uKHJlamVjdCk7XHJcbiAgICAgICAgfSksIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcclxuICAgICAgICByZWNvcmQuYy5wdXNoKHJlYWN0KTtcclxuICAgICAgICByZWNvcmQucyAmJiBub3RpZnkocmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gUDtcclxuICAgICAgfSxcclxuICAgICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcclxuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFzc2lnbkhpZGRlbihQcm9taXNlLCB7XHJcbiAgICAgIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxyXG4gICAgICBhbGw6IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICB2YXIgUHJvbWlzZSA9IGdldENvbnN0cnVjdG9yKHRoaXMpXHJcbiAgICAgICAgICAsIHZhbHVlcyAgPSBbXTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgcHVzaCwgdmFsdWVzKTtcclxuICAgICAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICwgcmVzdWx0cyAgID0gQXJyYXkocmVtYWluaW5nKTtcclxuICAgICAgICAgIGlmKHJlbWFpbmluZylmb3JFYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XHJcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0sIHJlamVjdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxyXG4gICAgICByYWNlOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgdmFyIFByb21pc2UgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XHJcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShwcm9taXNlKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcclxuICAgICAgcmVqZWN0OiBmdW5jdGlvbihyKXtcclxuICAgICAgICByZXR1cm4gbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIHJlamVjdChyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXHJcbiAgICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdCh4KSAmJiBSRUNPUkQgaW4geCAmJiBnZXRQcm90b3R5cGVPZih4KSA9PT0gdGhpc1tQUk9UT1RZUEVdXHJcbiAgICAgICAgICA/IHggOiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgICByZXNvbHZlKHgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0obmV4dFRpY2sgfHwgc2V0SW1tZWRpYXRlLCBzYWZlU3ltYm9sKCdyZWNvcmQnKSk7XHJcbiAgc2V0VG9TdHJpbmdUYWcoUHJvbWlzZSwgUFJPTUlTRSk7XHJcbiAgc2V0U3BlY2llcyhQcm9taXNlKTtcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCAqICFpc05hdGl2ZShQcm9taXNlKSwge1Byb21pc2U6IFByb21pc2V9KTtcclxufShnbG9iYWxbUFJPTUlTRV0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuY29sbGVjdGlvbnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFQ01BU2NyaXB0IDYgY29sbGVjdGlvbnMgc2hpbVxyXG4hZnVuY3Rpb24oKXtcclxuICB2YXIgVUlEICAgPSBzYWZlU3ltYm9sKCd1aWQnKVxyXG4gICAgLCBPMSAgICA9IHNhZmVTeW1ib2woJ08xJylcclxuICAgICwgV0VBSyAgPSBzYWZlU3ltYm9sKCd3ZWFrJylcclxuICAgICwgTEVBSyAgPSBzYWZlU3ltYm9sKCdsZWFrJylcclxuICAgICwgTEFTVCAgPSBzYWZlU3ltYm9sKCdsYXN0JylcclxuICAgICwgRklSU1QgPSBzYWZlU3ltYm9sKCdmaXJzdCcpXHJcbiAgICAsIFNJWkUgID0gREVTQyA/IHNhZmVTeW1ib2woJ3NpemUnKSA6ICdzaXplJ1xyXG4gICAgLCB1aWQgICA9IDBcclxuICAgICwgdG1wICAgPSB7fTtcclxuICBcclxuICBmdW5jdGlvbiBnZXRDb2xsZWN0aW9uKEMsIE5BTUUsIG1ldGhvZHMsIGNvbW1vbk1ldGhvZHMsIGlzTWFwLCBpc1dlYWspe1xyXG4gICAgdmFyIEFEREVSID0gaXNNYXAgPyAnc2V0JyA6ICdhZGQnXHJcbiAgICAgICwgcHJvdG8gPSBDICYmIENbUFJPVE9UWVBFXVxyXG4gICAgICAsIE8gICAgID0ge307XHJcbiAgICBmdW5jdGlvbiBpbml0RnJvbUl0ZXJhYmxlKHRoYXQsIGl0ZXJhYmxlKXtcclxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBpc01hcCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgICByZXR1cm4gdGhhdDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGZpeFNWWihrZXksIGNoYWluKXtcclxuICAgICAgdmFyIG1ldGhvZCA9IHByb3RvW2tleV07XHJcbiAgICAgIGlmKGZyYW1ld29yaylwcm90b1trZXldID0gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG1ldGhvZC5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluID8gdGhpcyA6IHJlc3VsdDtcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmKCFpc05hdGl2ZShDKSB8fCAhKGlzV2VhayB8fCAoIUJVR0dZX0lURVJBVE9SUyAmJiBoYXMocHJvdG8sIEZPUl9FQUNIKSAmJiBoYXMocHJvdG8sICdlbnRyaWVzJykpKSl7XHJcbiAgICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXHJcbiAgICAgIEMgPSBpc1dlYWtcclxuICAgICAgICA/IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgQywgTkFNRSk7XHJcbiAgICAgICAgICAgIHNldCh0aGlzLCBVSUQsIHVpZCsrKTtcclxuICAgICAgICAgICAgaW5pdEZyb21JdGVyYWJsZSh0aGlzLCBpdGVyYWJsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhhdCwgQywgTkFNRSk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBPMSwgY3JlYXRlKG51bGwpKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIEZJUlNULCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBpbml0RnJvbUl0ZXJhYmxlKHRoYXQsIGl0ZXJhYmxlKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgIGFzc2lnbkhpZGRlbihhc3NpZ25IaWRkZW4oQ1tQUk9UT1RZUEVdLCBtZXRob2RzKSwgY29tbW9uTWV0aG9kcyk7XHJcbiAgICAgIGlzV2VhayB8fCAhREVTQyB8fCBkZWZpbmVQcm9wZXJ0eShDW1BST1RPVFlQRV0sICdzaXplJywge2dldDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gYXNzZXJ0RGVmaW5lZCh0aGlzW1NJWkVdKTtcclxuICAgICAgfX0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIE5hdGl2ZSA9IENcclxuICAgICAgICAsIGluc3QgICA9IG5ldyBDXHJcbiAgICAgICAgLCBjaGFpbiAgPSBpbnN0W0FEREVSXShpc1dlYWsgPyB7fSA6IC0wLCAxKVxyXG4gICAgICAgICwgYnVnZ3laZXJvO1xyXG4gICAgICAvLyB3cmFwIHRvIGluaXQgY29sbGVjdGlvbnMgZnJvbSBpdGVyYWJsZVxyXG4gICAgICBpZihjaGVja0Rhbmdlckl0ZXJDbG9zaW5nKGZ1bmN0aW9uKE8peyBuZXcgQyhPKSB9KSl7XHJcbiAgICAgICAgQyA9IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICAgICAgcmV0dXJuIGluaXRGcm9tSXRlcmFibGUobmV3IE5hdGl2ZSwgaXRlcmFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBDW1BST1RPVFlQRV0gPSBwcm90bztcclxuICAgICAgICBpZihmcmFtZXdvcmspcHJvdG9bQ09OU1RSVUNUT1JdID0gQztcclxuICAgICAgfVxyXG4gICAgICBpc1dlYWsgfHwgaW5zdFtGT1JfRUFDSF0oZnVuY3Rpb24odmFsLCBrZXkpe1xyXG4gICAgICAgIGJ1Z2d5WmVybyA9IDEgLyBrZXkgPT09IC1JbmZpbml0eTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIGZpeCBjb252ZXJ0aW5nIC0wIGtleSB0byArMFxyXG4gICAgICBpZihidWdneVplcm8pe1xyXG4gICAgICAgIGZpeFNWWignZGVsZXRlJyk7XHJcbiAgICAgICAgZml4U1ZaKCdoYXMnKTtcclxuICAgICAgICBpc01hcCAmJiBmaXhTVlooJ2dldCcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vICsgZml4IC5hZGQgJiAuc2V0IGZvciBjaGFpbmluZ1xyXG4gICAgICBpZihidWdneVplcm8gfHwgY2hhaW4gIT09IGluc3QpZml4U1ZaKEFEREVSLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xyXG4gICAgc2V0U3BlY2llcyhDKTtcclxuICAgIFxyXG4gICAgT1tOQU1FXSA9IEM7XHJcbiAgICAkZGVmaW5lKEdMT0JBTCArIFdSQVAgKyBGT1JDRUQgKiAhaXNOYXRpdmUoQyksIE8pO1xyXG4gICAgXHJcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cclxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcclxuICAgIGlzV2VhayB8fCBkZWZpbmVTdGRJdGVyYXRvcnMoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XHJcbiAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAgICwgZW50cnkgPSBpdGVyLmw7XHJcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxyXG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcclxuICAgICAgaWYoIWl0ZXIubyB8fCAhKGl0ZXIubCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogaXRlci5vW0ZJUlNUXSkpe1xyXG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXHJcbiAgICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcclxuICAgICAgaWYoa2luZCA9PSBLRVkpICByZXR1cm4gaXRlclJlc3VsdCgwLCBlbnRyeS5rKTtcclxuICAgICAgaWYoa2luZCA9PSBWQUxVRSlyZXR1cm4gaXRlclJlc3VsdCgwLCBlbnRyeS52KTtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBbZW50cnkuaywgZW50cnkudl0pOyAgIFxyXG4gICAgfSwgaXNNYXAgPyBLRVkrVkFMVUUgOiBWQUxVRSwgIWlzTWFwKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIEM7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGZhc3RLZXkoaXQsIGNyZWF0ZSl7XHJcbiAgICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XHJcbiAgICBpZighaXNPYmplY3QoaXQpKXJldHVybiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xyXG4gICAgLy8gY2FuJ3Qgc2V0IGlkIHRvIGZyb3plbiBvYmplY3RcclxuICAgIGlmKGlzRnJvemVuKGl0KSlyZXR1cm4gJ0YnO1xyXG4gICAgaWYoIWhhcyhpdCwgVUlEKSl7XHJcbiAgICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXHJcbiAgICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcclxuICAgICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXHJcbiAgICAgIGhpZGRlbihpdCwgVUlELCArK3VpZCk7XHJcbiAgICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XHJcbiAgICB9IHJldHVybiAnTycgKyBpdFtVSURdO1xyXG4gIH1cclxuICBmdW5jdGlvbiBnZXRFbnRyeSh0aGF0LCBrZXkpe1xyXG4gICAgLy8gZmFzdCBjYXNlXHJcbiAgICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xyXG4gICAgaWYoaW5kZXggIT0gJ0YnKXJldHVybiB0aGF0W08xXVtpbmRleF07XHJcbiAgICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcclxuICAgIGZvcihlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBkZWYodGhhdCwga2V5LCB2YWx1ZSl7XHJcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXHJcbiAgICAgICwgcHJldiwgaW5kZXg7XHJcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcclxuICAgIGlmKGVudHJ5KWVudHJ5LnYgPSB2YWx1ZTtcclxuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGF0W0xBU1RdID0gZW50cnkgPSB7XHJcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XHJcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxyXG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxyXG4gICAgICAgIHA6IHByZXYgPSB0aGF0W0xBU1RdLCAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxyXG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XHJcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcclxuICAgICAgfTtcclxuICAgICAgaWYoIXRoYXRbRklSU1RdKXRoYXRbRklSU1RdID0gZW50cnk7XHJcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XHJcbiAgICAgIHRoYXRbU0laRV0rKztcclxuICAgICAgLy8gYWRkIHRvIGluZGV4XHJcbiAgICAgIGlmKGluZGV4ICE9ICdGJyl0aGF0W08xXVtpbmRleF0gPSBlbnRyeTtcclxuICAgIH0gcmV0dXJuIHRoYXQ7XHJcbiAgfVxyXG5cclxuICB2YXIgY29sbGVjdGlvbk1ldGhvZHMgPSB7XHJcbiAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcclxuICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0W08xXSwgZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XHJcbiAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xyXG4gICAgICB9XHJcbiAgICAgIHRoYXRbRklSU1RdID0gdGhhdFtMQVNUXSA9IHVuZGVmaW5lZDtcclxuICAgICAgdGhhdFtTSVpFXSA9IDA7XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxyXG4gICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIHRoYXQgID0gdGhpc1xyXG4gICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xyXG4gICAgICBpZihlbnRyeSl7XHJcbiAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXHJcbiAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xyXG4gICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcclxuICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcclxuICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XHJcbiAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xyXG4gICAgICAgIGlmKHRoYXRbRklSU1RdID09IGVudHJ5KXRoYXRbRklSU1RdID0gbmV4dDtcclxuICAgICAgICBpZih0aGF0W0xBU1RdID09IGVudHJ5KXRoYXRbTEFTVF0gPSBwcmV2O1xyXG4gICAgICAgIHRoYXRbU0laRV0tLTtcclxuICAgICAgfSByZXR1cm4gISFlbnRyeTtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcclxuICAgICAgICAsIGVudHJ5O1xyXG4gICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcclxuICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xyXG4gICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxyXG4gICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIDIzLjEgTWFwIE9iamVjdHNcclxuICBNYXAgPSBnZXRDb2xsZWN0aW9uKE1hcCwgTUFQLCB7XHJcbiAgICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICB9LCBjb2xsZWN0aW9uTWV0aG9kcywgdHJ1ZSk7XHJcbiAgXHJcbiAgLy8gMjMuMiBTZXQgT2JqZWN0c1xyXG4gIFNldCA9IGdldENvbGxlY3Rpb24oU2V0LCBTRVQsIHtcclxuICAgIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxyXG4gICAgYWRkOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0sIGNvbGxlY3Rpb25NZXRob2RzKTtcclxuICBcclxuICBmdW5jdGlvbiBkZWZXZWFrKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgaWYoaXNGcm96ZW4oYXNzZXJ0T2JqZWN0KGtleSkpKWxlYWtTdG9yZSh0aGF0KS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICBlbHNlIHtcclxuICAgICAgaGFzKGtleSwgV0VBSykgfHwgaGlkZGVuKGtleSwgV0VBSywge30pO1xyXG4gICAgICBrZXlbV0VBS11bdGhhdFtVSURdXSA9IHZhbHVlO1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9XHJcbiAgZnVuY3Rpb24gbGVha1N0b3JlKHRoYXQpe1xyXG4gICAgcmV0dXJuIHRoYXRbTEVBS10gfHwgaGlkZGVuKHRoYXQsIExFQUssIG5ldyBNYXApW0xFQUtdO1xyXG4gIH1cclxuICBcclxuICB2YXIgd2Vha01ldGhvZHMgPSB7XHJcbiAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxyXG4gICAgLy8gMjMuNC4zLjMgV2Vha1NldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpWydkZWxldGUnXShrZXkpO1xyXG4gICAgICByZXR1cm4gaGFzKGtleSwgV0VBSykgJiYgaGFzKGtleVtXRUFLXSwgdGhpc1tVSURdKSAmJiBkZWxldGUga2V5W1dFQUtdW3RoaXNbVUlEXV07XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcclxuICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuaGFzKGtleSk7XHJcbiAgICAgIHJldHVybiBoYXMoa2V5LCBXRUFLKSAmJiBoYXMoa2V5W1dFQUtdLCB0aGlzW1VJRF0pO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcclxuICBXZWFrTWFwID0gZ2V0Q29sbGVjdGlvbihXZWFrTWFwLCBXRUFLTUFQLCB7XHJcbiAgICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZihpc09iamVjdChrZXkpKXtcclxuICAgICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYoaGFzKGtleSwgV0VBSykpcmV0dXJuIGtleVtXRUFLXVt0aGlzW1VJRF1dO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmV2Vhayh0aGlzLCBrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICB9LCB3ZWFrTWV0aG9kcywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgXHJcbiAgLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxyXG4gIGlmKGZyYW1ld29yayAmJiBuZXcgV2Vha01hcCgpLnNldChPYmplY3QuZnJlZXplKHRtcCksIDcpLmdldCh0bXApICE9IDcpe1xyXG4gICAgZm9yRWFjaC5jYWxsKGFycmF5KCdkZWxldGUsaGFzLGdldCxzZXQnKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIG1ldGhvZCA9IFdlYWtNYXBbUFJPVE9UWVBFXVtrZXldO1xyXG4gICAgICBXZWFrTWFwW1BST1RPVFlQRV1ba2V5XSA9IGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGxlYWt5IG1hcFxyXG4gICAgICAgIGlmKGlzT2JqZWN0KGEpICYmIGlzRnJvemVuKGEpKXtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBsZWFrU3RvcmUodGhpcylba2V5XShhLCBiKTtcclxuICAgICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xyXG4gICAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxyXG4gICAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIDIzLjQgV2Vha1NldCBPYmplY3RzXHJcbiAgV2Vha1NldCA9IGdldENvbGxlY3Rpb24oV2Vha1NldCwgV0VBS1NFVCwge1xyXG4gICAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxyXG4gICAgYWRkOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWZXZWFrKHRoaXMsIHZhbHVlLCB0cnVlKTtcclxuICAgIH1cclxuICB9LCB3ZWFrTWV0aG9kcywgZmFsc2UsIHRydWUpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5yZWZsZWN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIGZ1bmN0aW9uIEVudW1lcmF0ZShpdGVyYXRlZCl7XHJcbiAgICB2YXIga2V5cyA9IFtdLCBrZXk7XHJcbiAgICBmb3Ioa2V5IGluIGl0ZXJhdGVkKWtleXMucHVzaChrZXkpO1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgYToga2V5cywgaTogMH0pO1xyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihFbnVtZXJhdGUsIE9CSkVDVCwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIGtleXMgPSBpdGVyLmFcclxuICAgICAgLCBrZXk7XHJcbiAgICBkbyB7XHJcbiAgICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aClyZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgIH0gd2hpbGUoISgoa2V5ID0ga2V5c1tpdGVyLmkrK10pIGluIGl0ZXIubykpO1xyXG4gICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwga2V5KTtcclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiB3cmFwKGZuKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIGFzc2VydE9iamVjdChpdCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKSwgdHJ1ZTtcclxuICAgICAgfSBjYXRjaChlKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gcmVmbGVjdEdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xyXG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cclxuICAgICAgLCBkZXNjID0gZ2V0T3duRGVzY3JpcHRvcihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpLCBwcm90bztcclxuICAgIGlmKGRlc2MpcmV0dXJuIGhhcyhkZXNjLCAndmFsdWUnKVxyXG4gICAgICA/IGRlc2MudmFsdWVcclxuICAgICAgOiBkZXNjLmdldCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyB1bmRlZmluZWRcclxuICAgICAgICA6IGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSlcclxuICAgICAgPyByZWZsZWN0R2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpXHJcbiAgICAgIDogdW5kZWZpbmVkO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZWZsZWN0U2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxyXG4gICAgICAsIG93bkRlc2MgID0gZ2V0T3duRGVzY3JpcHRvcihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpXHJcbiAgICAgICwgZXhpc3RpbmdEZXNjcmlwdG9yLCBwcm90bztcclxuICAgIGlmKCFvd25EZXNjKXtcclxuICAgICAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90b3R5cGVPZih0YXJnZXQpKSl7XHJcbiAgICAgICAgcmV0dXJuIHJlZmxlY3RTZXQocHJvdG8sIHByb3BlcnR5S2V5LCBWLCByZWNlaXZlcik7XHJcbiAgICAgIH1cclxuICAgICAgb3duRGVzYyA9IGRlc2NyaXB0b3IoMCk7XHJcbiAgICB9XHJcbiAgICBpZihoYXMob3duRGVzYywgJ3ZhbHVlJykpe1xyXG4gICAgICBpZihvd25EZXNjLndyaXRhYmxlID09PSBmYWxzZSB8fCAhaXNPYmplY3QocmVjZWl2ZXIpKXJldHVybiBmYWxzZTtcclxuICAgICAgZXhpc3RpbmdEZXNjcmlwdG9yID0gZ2V0T3duRGVzY3JpcHRvcihyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8IGRlc2NyaXB0b3IoMCk7XHJcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XHJcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShyZWNlaXZlciwgcHJvcGVydHlLZXksIGV4aXN0aW5nRGVzY3JpcHRvciksIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZFxyXG4gICAgICA/IGZhbHNlXHJcbiAgICAgIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcclxuICB9XHJcbiAgdmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgcmV0dXJuSXQ7XHJcbiAgXHJcbiAgdmFyIHJlZmxlY3QgPSB7XHJcbiAgICAvLyAyNi4xLjEgUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdClcclxuICAgIGFwcGx5OiBjdHgoY2FsbCwgYXBwbHksIDMpLFxyXG4gICAgLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxyXG4gICAgY29uc3RydWN0OiBmdW5jdGlvbih0YXJnZXQsIGFyZ3VtZW50c0xpc3QgLyosIG5ld1RhcmdldCovKXtcclxuICAgICAgdmFyIHByb3RvICAgID0gYXNzZXJ0RnVuY3Rpb24oYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl0pW1BST1RPVFlQRV1cclxuICAgICAgICAsIGluc3RhbmNlID0gY3JlYXRlKGlzT2JqZWN0KHByb3RvKSA/IHByb3RvIDogT2JqZWN0UHJvdG8pXHJcbiAgICAgICAgLCByZXN1bHQgICA9IGFwcGx5LmNhbGwodGFyZ2V0LCBpbnN0YW5jZSwgYXJndW1lbnRzTGlzdCk7XHJcbiAgICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcclxuICAgIGRlZmluZVByb3BlcnR5OiB3cmFwKGRlZmluZVByb3BlcnR5KSxcclxuICAgIC8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICAgIHZhciBkZXNjID0gZ2V0T3duRGVzY3JpcHRvcihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xyXG4gICAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuNSBSZWZsZWN0LmVudW1lcmF0ZSh0YXJnZXQpXHJcbiAgICBlbnVtZXJhdGU6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICAgIHJldHVybiBuZXcgRW51bWVyYXRlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjYgUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSBbLCByZWNlaXZlcl0pXHJcbiAgICBnZXQ6IHJlZmxlY3RHZXQsXHJcbiAgICAvLyAyNi4xLjcgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICAgIHJldHVybiBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS44IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVxyXG4gICAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICAgIHJldHVybiBnZXRQcm90b3R5cGVPZihhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgICBoYXM6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuMTAgUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KVxyXG4gICAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICByZXR1cm4gISFpc0V4dGVuc2libGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcclxuICAgIG93bktleXM6IG93bktleXMsXHJcbiAgICAvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxyXG4gICAgcHJldmVudEV4dGVuc2lvbnM6IHdyYXAoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zIHx8IHJldHVybkl0KSxcclxuICAgIC8vIDI2LjEuMTMgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgViBbLCByZWNlaXZlcl0pXHJcbiAgICBzZXQ6IHJlZmxlY3RTZXRcclxuICB9XHJcbiAgLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXHJcbiAgaWYoc2V0UHJvdG90eXBlT2YpcmVmbGVjdC5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvdG8pe1xyXG4gICAgcmV0dXJuIHNldFByb3RvdHlwZU9mKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm90byksIHRydWU7XHJcbiAgfTtcclxuICBcclxuICAkZGVmaW5lKEdMT0JBTCwge1JlZmxlY3Q6IHt9fSk7XHJcbiAgJGRlZmluZShTVEFUSUMsICdSZWZsZWN0JywgcmVmbGVjdCk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM3LnByb3Bvc2FscyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgJGRlZmluZShQUk9UTywgQVJSQVksIHtcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb21lbmljL0FycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xyXG4gICAgaW5jbHVkZXM6IGNyZWF0ZUFycmF5Q29udGFpbnModHJ1ZSlcclxuICB9KTtcclxuICAkZGVmaW5lKFBST1RPLCBTVFJJTkcsIHtcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuYXRcclxuICAgIGF0OiBjcmVhdGVQb2ludEF0KHRydWUpXHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCBrZXlzICAgPSBnZXRLZXlzKG9iamVjdClcclxuICAgICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICAgLCByZXN1bHQgPSBBcnJheShsZW5ndGgpXHJcbiAgICAgICAgLCBrZXk7XHJcbiAgICAgIGlmKGlzRW50cmllcyl3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IFtrZXkgPSBrZXlzW2krK10sIE9ba2V5XV07XHJcbiAgICAgIGVsc2Ugd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBPW2tleXNbaSsrXV07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gICRkZWZpbmUoU1RBVElDLCBPQkpFQ1QsIHtcclxuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vOTM1Mzc4MVxyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIHJlc3VsdCA9IHt9O1xyXG4gICAgICBmb3JFYWNoLmNhbGwob3duS2V5cyhPKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzY3JpcHRvcigwLCBnZXRPd25EZXNjcmlwdG9yKE8sIGtleSkpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3J3YWxkcm9uL3RjMzktbm90ZXMvYmxvYi9tYXN0ZXIvZXM2LzIwMTQtMDQvYXByLTkubWQjNTEtb2JqZWN0ZW50cmllcy1vYmplY3R2YWx1ZXNcclxuICAgIHZhbHVlczogIGNyZWF0ZU9iamVjdFRvQXJyYXkoZmFsc2UpLFxyXG4gICAgZW50cmllczogY3JlYXRlT2JqZWN0VG9BcnJheSh0cnVlKVxyXG4gIH0pO1xyXG4gICRkZWZpbmUoU1RBVElDLCBSRUdFWFAsIHtcclxuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2thbmdheC85Njk4MTAwXHJcbiAgICBlc2NhcGU6IGNyZWF0ZVJlcGxhY2VyKC8oW1xcXFxcXC1bXFxde30oKSorPy4sXiR8XSkvZywgJ1xcXFwkMScsIHRydWUpXHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM3LmFic3RyYWN0LXJlZnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3plbnBhcnNpbmcvZXMtYWJzdHJhY3QtcmVmc1xyXG4hZnVuY3Rpb24oUkVGRVJFTkNFKXtcclxuICBSRUZFUkVOQ0VfR0VUID0gZ2V0V2VsbEtub3duU3ltYm9sKFJFRkVSRU5DRSsnR2V0JywgdHJ1ZSk7XHJcbiAgdmFyIFJFRkVSRU5DRV9TRVQgPSBnZXRXZWxsS25vd25TeW1ib2woUkVGRVJFTkNFK1NFVCwgdHJ1ZSlcclxuICAgICwgUkVGRVJFTkNFX0RFTEVURSA9IGdldFdlbGxLbm93blN5bWJvbChSRUZFUkVOQ0UrJ0RlbGV0ZScsIHRydWUpO1xyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDLCBTWU1CT0wsIHtcclxuICAgIHJlZmVyZW5jZUdldDogUkVGRVJFTkNFX0dFVCxcclxuICAgIHJlZmVyZW5jZVNldDogUkVGRVJFTkNFX1NFVCxcclxuICAgIHJlZmVyZW5jZURlbGV0ZTogUkVGRVJFTkNFX0RFTEVURVxyXG4gIH0pO1xyXG4gIFxyXG4gIGhpZGRlbihGdW5jdGlvblByb3RvLCBSRUZFUkVOQ0VfR0VULCByZXR1cm5UaGlzKTtcclxuICBcclxuICBmdW5jdGlvbiBzZXRNYXBNZXRob2RzKENvbnN0cnVjdG9yKXtcclxuICAgIGlmKENvbnN0cnVjdG9yKXtcclxuICAgICAgdmFyIE1hcFByb3RvID0gQ29uc3RydWN0b3JbUFJPVE9UWVBFXTtcclxuICAgICAgaGlkZGVuKE1hcFByb3RvLCBSRUZFUkVOQ0VfR0VULCBNYXBQcm90by5nZXQpO1xyXG4gICAgICBoaWRkZW4oTWFwUHJvdG8sIFJFRkVSRU5DRV9TRVQsIE1hcFByb3RvLnNldCk7XHJcbiAgICAgIGhpZGRlbihNYXBQcm90bywgUkVGRVJFTkNFX0RFTEVURSwgTWFwUHJvdG9bJ2RlbGV0ZSddKTtcclxuICAgIH1cclxuICB9XHJcbiAgc2V0TWFwTWV0aG9kcyhNYXApO1xyXG4gIHNldE1hcE1ldGhvZHMoV2Vha01hcCk7XHJcbn0oJ3JlZmVyZW5jZScpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmRpY3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oRElDVCl7XHJcbiAgRGljdCA9IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgIHZhciBkaWN0ID0gY3JlYXRlKG51bGwpO1xyXG4gICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKXtcclxuICAgICAgaWYoaXNJdGVyYWJsZShpdGVyYWJsZSkpe1xyXG4gICAgICAgIGZvck9mKGl0ZXJhYmxlLCB0cnVlLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgYXNzaWduKGRpY3QsIGl0ZXJhYmxlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaWN0O1xyXG4gIH1cclxuICBEaWN0W1BST1RPVFlQRV0gPSBudWxsO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIERpY3RJdGVyYXRvcihpdGVyYXRlZCwga2luZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IHRvT2JqZWN0KGl0ZXJhdGVkKSwgYTogZ2V0S2V5cyhpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoRGljdEl0ZXJhdG9yLCBESUNULCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgTyAgICA9IGl0ZXIub1xyXG4gICAgICAsIGtleXMgPSBpdGVyLmFcclxuICAgICAgLCBraW5kID0gaXRlci5rXHJcbiAgICAgICwga2V5O1xyXG4gICAgZG8ge1xyXG4gICAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpe1xyXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgICAgfVxyXG4gICAgfSB3aGlsZSghaGFzKE8sIGtleSA9IGtleXNbaXRlci5pKytdKSk7XHJcbiAgICBpZihraW5kID09IEtFWSkgIHJldHVybiBpdGVyUmVzdWx0KDAsIGtleSk7XHJcbiAgICBpZihraW5kID09IFZBTFVFKXJldHVybiBpdGVyUmVzdWx0KDAsIE9ba2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIFtrZXksIE9ba2V5XV0pO1xyXG4gIH0pO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZURpY3RJdGVyKGtpbmQpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIG5ldyBEaWN0SXRlcmF0b3IoaXQsIGtpbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvKlxyXG4gICAqIDAgLT4gZm9yRWFjaFxyXG4gICAqIDEgLT4gbWFwXHJcbiAgICogMiAtPiBmaWx0ZXJcclxuICAgKiAzIC0+IHNvbWVcclxuICAgKiA0IC0+IGV2ZXJ5XHJcbiAgICogNSAtPiBmaW5kXHJcbiAgICogNiAtPiBmaW5kS2V5XHJcbiAgICogNyAtPiBtYXBQYWlyc1xyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZURpY3RNZXRob2QodHlwZSl7XHJcbiAgICB2YXIgaXNNYXAgICAgPSB0eXBlID09IDFcclxuICAgICAgLCBpc0V2ZXJ5ICA9IHR5cGUgPT0gNDtcclxuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGNhbGxiYWNrZm4sIHRoYXQgLyogPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgICB2YXIgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXHJcbiAgICAgICAgLCBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCByZXN1bHQgPSBpc01hcCB8fCB0eXBlID09IDcgfHwgdHlwZSA9PSAyID8gbmV3IChnZW5lcmljKHRoaXMsIERpY3QpKSA6IHVuZGVmaW5lZFxyXG4gICAgICAgICwga2V5LCB2YWwsIHJlcztcclxuICAgICAgZm9yKGtleSBpbiBPKWlmKGhhcyhPLCBrZXkpKXtcclxuICAgICAgICB2YWwgPSBPW2tleV07XHJcbiAgICAgICAgcmVzID0gZih2YWwsIGtleSwgb2JqZWN0KTtcclxuICAgICAgICBpZih0eXBlKXtcclxuICAgICAgICAgIGlmKGlzTWFwKXJlc3VsdFtrZXldID0gcmVzOyAgICAgICAgICAgICAvLyBtYXBcclxuICAgICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXN1bHRba2V5XSA9IHZhbDsgYnJlYWsgICAgICAvLyBmaWx0ZXJcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAvLyBzb21lXHJcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgLy8gZmluZFxyXG4gICAgICAgICAgICBjYXNlIDY6IHJldHVybiBrZXk7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRLZXlcclxuICAgICAgICAgICAgY2FzZSA3OiByZXN1bHRbcmVzWzBdXSA9IHJlc1sxXTsgICAgICAvLyBtYXBQYWlyc1xyXG4gICAgICAgICAgfSBlbHNlIGlmKGlzRXZlcnkpcmV0dXJuIGZhbHNlOyAgICAgICAgIC8vIGV2ZXJ5XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0eXBlID09IDMgfHwgaXNFdmVyeSA/IGlzRXZlcnkgOiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNyZWF0ZURpY3RSZWR1Y2UoaXNUdXJuKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QsIG1hcGZuLCBpbml0KXtcclxuICAgICAgYXNzZXJ0RnVuY3Rpb24obWFwZm4pO1xyXG4gICAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxyXG4gICAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgICAsIGkgICAgICA9IDBcclxuICAgICAgICAsIG1lbW8sIGtleSwgcmVzdWx0O1xyXG4gICAgICBpZihpc1R1cm4pbWVtbyA9IGluaXQgPT0gdW5kZWZpbmVkID8gbmV3IChnZW5lcmljKHRoaXMsIERpY3QpKSA6IE9iamVjdChpbml0KTtcclxuICAgICAgZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoIDwgMyl7XHJcbiAgICAgICAgYXNzZXJ0KGxlbmd0aCwgUkVEVUNFX0VSUk9SKTtcclxuICAgICAgICBtZW1vID0gT1trZXlzW2krK11dO1xyXG4gICAgICB9IGVsc2UgbWVtbyA9IE9iamVjdChpbml0KTtcclxuICAgICAgd2hpbGUobGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0ga2V5c1tpKytdKSl7XHJcbiAgICAgICAgcmVzdWx0ID0gbWFwZm4obWVtbywgT1trZXldLCBrZXksIG9iamVjdCk7XHJcbiAgICAgICAgaWYoaXNUdXJuKXtcclxuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gZmFsc2UpYnJlYWs7XHJcbiAgICAgICAgfSBlbHNlIG1lbW8gPSByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG1lbW87XHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciBmaW5kS2V5ID0gY3JlYXRlRGljdE1ldGhvZCg2KTtcclxuICBmdW5jdGlvbiBpbmNsdWRlcyhvYmplY3QsIGVsKXtcclxuICAgIHJldHVybiAoZWwgPT0gZWwgPyBrZXlPZihvYmplY3QsIGVsKSA6IGZpbmRLZXkob2JqZWN0LCBzYW1lTmFOKSkgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGRpY3RNZXRob2RzID0ge1xyXG4gICAga2V5czogICAgY3JlYXRlRGljdEl0ZXIoS0VZKSxcclxuICAgIHZhbHVlczogIGNyZWF0ZURpY3RJdGVyKFZBTFVFKSxcclxuICAgIGVudHJpZXM6IGNyZWF0ZURpY3RJdGVyKEtFWStWQUxVRSksXHJcbiAgICBmb3JFYWNoOiBjcmVhdGVEaWN0TWV0aG9kKDApLFxyXG4gICAgbWFwOiAgICAgY3JlYXRlRGljdE1ldGhvZCgxKSxcclxuICAgIGZpbHRlcjogIGNyZWF0ZURpY3RNZXRob2QoMiksXHJcbiAgICBzb21lOiAgICBjcmVhdGVEaWN0TWV0aG9kKDMpLFxyXG4gICAgZXZlcnk6ICAgY3JlYXRlRGljdE1ldGhvZCg0KSxcclxuICAgIGZpbmQ6ICAgIGNyZWF0ZURpY3RNZXRob2QoNSksXHJcbiAgICBmaW5kS2V5OiBmaW5kS2V5LFxyXG4gICAgbWFwUGFpcnM6Y3JlYXRlRGljdE1ldGhvZCg3KSxcclxuICAgIHJlZHVjZTogIGNyZWF0ZURpY3RSZWR1Y2UoZmFsc2UpLFxyXG4gICAgdHVybjogICAgY3JlYXRlRGljdFJlZHVjZSh0cnVlKSxcclxuICAgIGtleU9mOiAgIGtleU9mLFxyXG4gICAgaW5jbHVkZXM6aW5jbHVkZXMsXHJcbiAgICAvLyBIYXMgLyBnZXQgLyBzZXQgb3duIHByb3BlcnR5XHJcbiAgICBoYXM6IGhhcyxcclxuICAgIGdldDogZ2V0LFxyXG4gICAgc2V0OiBjcmVhdGVEZWZpbmVyKDApLFxyXG4gICAgaXNEaWN0OiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiBpc09iamVjdChpdCkgJiYgZ2V0UHJvdG90eXBlT2YoaXQpID09PSBEaWN0W1BST1RPVFlQRV07XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICBpZihSRUZFUkVOQ0VfR0VUKWZvcih2YXIga2V5IGluIGRpY3RNZXRob2RzKSFmdW5jdGlvbihmbil7XHJcbiAgICBmdW5jdGlvbiBtZXRob2QoKXtcclxuICAgICAgZm9yKHZhciBhcmdzID0gW3RoaXNdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZm5bUkVGRVJFTkNFX0dFVF0gPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gbWV0aG9kO1xyXG4gICAgfVxyXG4gIH0oZGljdE1ldGhvZHNba2V5XSk7XHJcbiAgXHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtEaWN0OiBhc3NpZ25IaWRkZW4oRGljdCwgZGljdE1ldGhvZHMpfSk7XHJcbn0oJ0RpY3QnKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS4kZm9yICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKEVOVFJJRVMsIEZOKXsgIFxyXG4gIGZ1bmN0aW9uICRmb3IoaXRlcmFibGUsIGVudHJpZXMpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgJGZvcikpcmV0dXJuIG5ldyAkZm9yKGl0ZXJhYmxlLCBlbnRyaWVzKTtcclxuICAgIHRoaXNbSVRFUl0gICAgPSBnZXRJdGVyYXRvcihpdGVyYWJsZSk7XHJcbiAgICB0aGlzW0VOVFJJRVNdID0gISFlbnRyaWVzO1xyXG4gIH1cclxuICBcclxuICBjcmVhdGVJdGVyYXRvcigkZm9yLCAnV3JhcHBlcicsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpc1tJVEVSXS5uZXh0KCk7XHJcbiAgfSk7XHJcbiAgdmFyICRmb3JQcm90byA9ICRmb3JbUFJPVE9UWVBFXTtcclxuICBzZXRJdGVyYXRvcigkZm9yUHJvdG8sIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpc1tJVEVSXTsgLy8gdW53cmFwXHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5JdGVyYXRvcihuZXh0KXtcclxuICAgIGZ1bmN0aW9uIEl0ZXIoSSwgZm4sIHRoYXQpe1xyXG4gICAgICB0aGlzW0lURVJdICAgID0gZ2V0SXRlcmF0b3IoSSk7XHJcbiAgICAgIHRoaXNbRU5UUklFU10gPSBJW0VOVFJJRVNdO1xyXG4gICAgICB0aGlzW0ZOXSAgICAgID0gY3R4KGZuLCB0aGF0LCBJW0VOVFJJRVNdID8gMiA6IDEpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlSXRlcmF0b3IoSXRlciwgJ0NoYWluJywgbmV4dCwgJGZvclByb3RvKTtcclxuICAgIHNldEl0ZXJhdG9yKEl0ZXJbUFJPVE9UWVBFXSwgcmV0dXJuVGhpcyk7IC8vIG92ZXJyaWRlICRmb3JQcm90byBpdGVyYXRvclxyXG4gICAgcmV0dXJuIEl0ZXI7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBNYXBJdGVyID0gY3JlYXRlQ2hhaW5JdGVyYXRvcihmdW5jdGlvbigpe1xyXG4gICAgdmFyIHN0ZXAgPSB0aGlzW0lURVJdLm5leHQoKTtcclxuICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDogaXRlclJlc3VsdCgwLCBzdGVwQ2FsbCh0aGlzW0ZOXSwgc3RlcC52YWx1ZSwgdGhpc1tFTlRSSUVTXSkpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIHZhciBGaWx0ZXJJdGVyID0gY3JlYXRlQ2hhaW5JdGVyYXRvcihmdW5jdGlvbigpe1xyXG4gICAgZm9yKDs7KXtcclxuICAgICAgdmFyIHN0ZXAgPSB0aGlzW0lURVJdLm5leHQoKTtcclxuICAgICAgaWYoc3RlcC5kb25lIHx8IHN0ZXBDYWxsKHRoaXNbRk5dLCBzdGVwLnZhbHVlLCB0aGlzW0VOVFJJRVNdKSlyZXR1cm4gc3RlcDtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBhc3NpZ25IaWRkZW4oJGZvclByb3RvLCB7XHJcbiAgICBvZjogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICBmb3JPZih0aGlzLCB0aGlzW0VOVFJJRVNdLCBmbiwgdGhhdCk7XHJcbiAgICB9LFxyXG4gICAgYXJyYXk6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcclxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICBmb3JPZihmbiAhPSB1bmRlZmluZWQgPyB0aGlzLm1hcChmbiwgdGhhdCkgOiB0aGlzLCBmYWxzZSwgcHVzaCwgcmVzdWx0KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcclxuICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJJdGVyKHRoaXMsIGZuLCB0aGF0KTtcclxuICAgIH0sXHJcbiAgICBtYXA6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcclxuICAgICAgcmV0dXJuIG5ldyBNYXBJdGVyKHRoaXMsIGZuLCB0aGF0KTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAkZm9yLmlzSXRlcmFibGUgID0gaXNJdGVyYWJsZTtcclxuICAkZm9yLmdldEl0ZXJhdG9yID0gZ2V0SXRlcmF0b3I7XHJcbiAgXHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHskZm9yOiAkZm9yfSk7XHJcbn0oJ2VudHJpZXMnLCBzYWZlU3ltYm9sKCdmbicpKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5kZWxheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gaHR0cHM6Ly9lc2Rpc2N1c3Mub3JnL3RvcGljL3Byb21pc2UtcmV0dXJuaW5nLWRlbGF5LWZ1bmN0aW9uXHJcbiRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7XHJcbiAgZGVsYXk6IGZ1bmN0aW9uKHRpbWUpe1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xyXG4gICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUsIHRydWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5iaW5kaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKF8sIHRvTG9jYWxlU3RyaW5nKXtcclxuICAvLyBQbGFjZWhvbGRlclxyXG4gIGNvcmUuXyA9IHBhdGguXyA9IHBhdGguXyB8fCB7fTtcclxuXHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgRlVOQ1RJT04sIHtcclxuICAgIHBhcnQ6IHBhcnQsXHJcbiAgICBvbmx5OiBmdW5jdGlvbihudW1iZXJBcmd1bWVudHMsIHRoYXQgLyogPSBAICovKXtcclxuICAgICAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXHJcbiAgICAgICAgLCBuICAgICAgPSB0b0xlbmd0aChudW1iZXJBcmd1bWVudHMpXHJcbiAgICAgICAgLCBpc1RoYXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICAgIHZhciBsZW5ndGggPSBtaW4obiwgYXJndW1lbnRzLmxlbmd0aClcclxuICAgICAgICAgICwgYXJncyAgID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgICAgICAgLCBpICAgICAgPSAwO1xyXG4gICAgICAgIHdoaWxlKGxlbmd0aCA+IGkpYXJnc1tpXSA9IGFyZ3VtZW50c1tpKytdO1xyXG4gICAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIGlzVGhhdCA/IHRoYXQgOiB0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHRpZShrZXkpe1xyXG4gICAgdmFyIHRoYXQgID0gdGhpc1xyXG4gICAgICAsIGJvdW5kID0ge307XHJcbiAgICByZXR1cm4gaGlkZGVuKHRoYXQsIF8sIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKGtleSA9PT0gdW5kZWZpbmVkIHx8ICEoa2V5IGluIHRoYXQpKXJldHVybiB0b0xvY2FsZVN0cmluZy5jYWxsKHRoYXQpO1xyXG4gICAgICByZXR1cm4gaGFzKGJvdW5kLCBrZXkpID8gYm91bmRba2V5XSA6IChib3VuZFtrZXldID0gY3R4KHRoYXRba2V5XSwgdGhhdCwgLTEpKTtcclxuICAgIH0pW19dKGtleSk7XHJcbiAgfVxyXG4gIFxyXG4gIGhpZGRlbihwYXRoLl8sIFRPX1NUUklORywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBfO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGhpZGRlbihPYmplY3RQcm90bywgXywgdGllKTtcclxuICBERVNDIHx8IGhpZGRlbihBcnJheVByb3RvLCBfLCB0aWUpO1xyXG4gIC8vIElFOC0gZGlydHkgaGFjayAtIHJlZGVmaW5lZCB0b0xvY2FsZVN0cmluZyBpcyBub3QgZW51bWVyYWJsZVxyXG59KERFU0MgPyB1aWQoJ3RpZScpIDogVE9fTE9DQUxFLCBPYmplY3RQcm90b1tUT19MT0NBTEVdKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5vYmplY3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgZnVuY3Rpb24gZGVmaW5lKHRhcmdldCwgbWl4aW4pe1xyXG4gICAgdmFyIGtleXMgICA9IG93bktleXModG9PYmplY3QobWl4aW4pKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaSA9IDAsIGtleTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGkpZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXkgPSBrZXlzW2krK10sIGdldE93bkRlc2NyaXB0b3IobWl4aW4sIGtleSkpO1xyXG4gICAgcmV0dXJuIHRhcmdldDtcclxuICB9O1xyXG4gICRkZWZpbmUoU1RBVElDICsgRk9SQ0VELCBPQkpFQ1QsIHtcclxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcclxuICAgIGNsYXNzb2Y6IGNsYXNzb2YsXHJcbiAgICBkZWZpbmU6IGRlZmluZSxcclxuICAgIG1ha2U6IGZ1bmN0aW9uKHByb3RvLCBtaXhpbil7XHJcbiAgICAgIHJldHVybiBkZWZpbmUoY3JlYXRlKHByb3RvKSwgbWl4aW4pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuYXJyYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIEFSUkFZLCB7XHJcbiAgdHVybjogZnVuY3Rpb24oZm4sIHRhcmdldCAvKiA9IFtdICovKXtcclxuICAgIGFzc2VydEZ1bmN0aW9uKGZuKTtcclxuICAgIHZhciBtZW1vICAgPSB0YXJnZXQgPT0gdW5kZWZpbmVkID8gW10gOiBPYmplY3QodGFyZ2V0KVxyXG4gICAgICAsIE8gICAgICA9IEVTNU9iamVjdCh0aGlzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IDA7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClpZihmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgrKywgdGhpcykgPT09IGZhbHNlKWJyZWFrO1xyXG4gICAgcmV0dXJuIG1lbW87XHJcbiAgfVxyXG59KTtcclxuaWYoZnJhbWV3b3JrKUFycmF5VW5zY29wYWJsZXMudHVybiA9IHRydWU7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUubnVtYmVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihudW1iZXJNZXRob2RzKXsgIFxyXG4gIGZ1bmN0aW9uIE51bWJlckl0ZXJhdG9yKGl0ZXJhdGVkKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bDogdG9MZW5ndGgoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKE51bWJlckl0ZXJhdG9yLCBOVU1CRVIsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBpICAgID0gaXRlci5pKys7XHJcbiAgICByZXR1cm4gaSA8IGl0ZXIubCA/IGl0ZXJSZXN1bHQoMCwgaSkgOiBpdGVyUmVzdWx0KDEpO1xyXG4gIH0pO1xyXG4gIGRlZmluZUl0ZXJhdG9yKE51bWJlciwgTlVNQkVSLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIG5ldyBOdW1iZXJJdGVyYXRvcih0aGlzKTtcclxuICB9KTtcclxuICBcclxuICBudW1iZXJNZXRob2RzLnJhbmRvbSA9IGZ1bmN0aW9uKGxpbSAvKiA9IDAgKi8pe1xyXG4gICAgdmFyIGEgPSArdGhpc1xyXG4gICAgICAsIGIgPSBsaW0gPT0gdW5kZWZpbmVkID8gMCA6ICtsaW1cclxuICAgICAgLCBtID0gbWluKGEsIGIpO1xyXG4gICAgcmV0dXJuIHJhbmRvbSgpICogKG1heChhLCBiKSAtIG0pICsgbTtcclxuICB9O1xyXG5cclxuICBmb3JFYWNoLmNhbGwoYXJyYXkoXHJcbiAgICAgIC8vIEVTMzpcclxuICAgICAgJ3JvdW5kLGZsb29yLGNlaWwsYWJzLHNpbixhc2luLGNvcyxhY29zLHRhbixhdGFuLGV4cCxzcXJ0LG1heCxtaW4scG93LGF0YW4yLCcgK1xyXG4gICAgICAvLyBFUzY6XHJcbiAgICAgICdhY29zaCxhc2luaCxhdGFuaCxjYnJ0LGNsejMyLGNvc2gsZXhwbTEsaHlwb3QsaW11bCxsb2cxcCxsb2cxMCxsb2cyLHNpZ24sc2luaCx0YW5oLHRydW5jJ1xyXG4gICAgKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIGZuID0gTWF0aFtrZXldO1xyXG4gICAgICBpZihmbiludW1iZXJNZXRob2RzW2tleV0gPSBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgICAvLyBpZTktIGRvbnQgc3VwcG9ydCBzdHJpY3QgbW9kZSAmIGNvbnZlcnQgYHRoaXNgIHRvIG9iamVjdCAtPiBjb252ZXJ0IGl0IHRvIG51bWJlclxyXG4gICAgICAgIHZhciBhcmdzID0gWyt0aGlzXVxyXG4gICAgICAgICAgLCBpICAgID0gMDtcclxuICAgICAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKTtcclxuICBcclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBOVU1CRVIsIG51bWJlck1ldGhvZHMpO1xyXG59KHt9KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5zdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgdmFyIGVzY2FwZUhUTUxEaWN0ID0ge1xyXG4gICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgJzwnOiAnJmx0OycsXHJcbiAgICAnPic6ICcmZ3Q7JyxcclxuICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgXCInXCI6ICcmYXBvczsnXHJcbiAgfSwgdW5lc2NhcGVIVE1MRGljdCA9IHt9LCBrZXk7XHJcbiAgZm9yKGtleSBpbiBlc2NhcGVIVE1MRGljdCl1bmVzY2FwZUhUTUxEaWN0W2VzY2FwZUhUTUxEaWN0W2tleV1dID0ga2V5O1xyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIFNUUklORywge1xyXG4gICAgZXNjYXBlSFRNTDogICBjcmVhdGVSZXBsYWNlcigvWyY8PlwiJ10vZywgZXNjYXBlSFRNTERpY3QpLFxyXG4gICAgdW5lc2NhcGVIVE1MOiBjcmVhdGVSZXBsYWNlcigvJig/OmFtcHxsdHxndHxxdW90fGFwb3MpOy9nLCB1bmVzY2FwZUhUTUxEaWN0KVxyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihmb3JtYXRSZWdFeHAsIGZsZXhpb1JlZ0V4cCwgbG9jYWxlcywgY3VycmVudCwgU0VDT05EUywgTUlOVVRFUywgSE9VUlMsIE1PTlRILCBZRUFSKXtcclxuICBmdW5jdGlvbiBjcmVhdGVGb3JtYXQocHJlZml4KXtcclxuICAgIHJldHVybiBmdW5jdGlvbih0ZW1wbGF0ZSwgbG9jYWxlIC8qID0gY3VycmVudCAqLyl7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgICAgICwgZGljdCA9IGxvY2FsZXNbaGFzKGxvY2FsZXMsIGxvY2FsZSkgPyBsb2NhbGUgOiBjdXJyZW50XTtcclxuICAgICAgZnVuY3Rpb24gZ2V0KHVuaXQpe1xyXG4gICAgICAgIHJldHVybiB0aGF0W3ByZWZpeCArIHVuaXRdKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFN0cmluZyh0ZW1wbGF0ZSkucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHBhcnQpe1xyXG4gICAgICAgIHN3aXRjaChwYXJ0KXtcclxuICAgICAgICAgIGNhc2UgJ3MnICA6IHJldHVybiBnZXQoU0VDT05EUyk7ICAgICAgICAgICAgICAgICAgLy8gU2Vjb25kcyA6IDAtNTlcclxuICAgICAgICAgIGNhc2UgJ3NzJyA6IHJldHVybiBseihnZXQoU0VDT05EUykpOyAgICAgICAgICAgICAgLy8gU2Vjb25kcyA6IDAwLTU5XHJcbiAgICAgICAgICBjYXNlICdtJyAgOiByZXR1cm4gZ2V0KE1JTlVURVMpOyAgICAgICAgICAgICAgICAgIC8vIE1pbnV0ZXMgOiAwLTU5XHJcbiAgICAgICAgICBjYXNlICdtbScgOiByZXR1cm4gbHooZ2V0KE1JTlVURVMpKTsgICAgICAgICAgICAgIC8vIE1pbnV0ZXMgOiAwMC01OVxyXG4gICAgICAgICAgY2FzZSAnaCcgIDogcmV0dXJuIGdldChIT1VSUyk7ICAgICAgICAgICAgICAgICAgICAvLyBIb3VycyAgIDogMC0yM1xyXG4gICAgICAgICAgY2FzZSAnaGgnIDogcmV0dXJuIGx6KGdldChIT1VSUykpOyAgICAgICAgICAgICAgICAvLyBIb3VycyAgIDogMDAtMjNcclxuICAgICAgICAgIGNhc2UgJ0QnICA6IHJldHVybiBnZXQoREFURSk7ICAgICAgICAgICAgICAgICAgICAgLy8gRGF0ZSAgICA6IDEtMzFcclxuICAgICAgICAgIGNhc2UgJ0REJyA6IHJldHVybiBseihnZXQoREFURSkpOyAgICAgICAgICAgICAgICAgLy8gRGF0ZSAgICA6IDAxLTMxXHJcbiAgICAgICAgICBjYXNlICdXJyAgOiByZXR1cm4gZGljdFswXVtnZXQoJ0RheScpXTsgICAgICAgICAgIC8vIERheSAgICAgOiDQn9C+0L3QtdC00LXQu9GM0L3QuNC6XHJcbiAgICAgICAgICBjYXNlICdOJyAgOiByZXR1cm4gZ2V0KE1PTlRIKSArIDE7ICAgICAgICAgICAgICAgIC8vIE1vbnRoICAgOiAxLTEyXHJcbiAgICAgICAgICBjYXNlICdOTicgOiByZXR1cm4gbHooZ2V0KE1PTlRIKSArIDEpOyAgICAgICAgICAgIC8vIE1vbnRoICAgOiAwMS0xMlxyXG4gICAgICAgICAgY2FzZSAnTScgIDogcmV0dXJuIGRpY3RbMl1bZ2V0KE1PTlRIKV07ICAgICAgICAgICAvLyBNb250aCAgIDog0K/QvdCy0LDRgNGMXHJcbiAgICAgICAgICBjYXNlICdNTScgOiByZXR1cm4gZGljdFsxXVtnZXQoTU9OVEgpXTsgICAgICAgICAgIC8vIE1vbnRoICAgOiDQr9C90LLQsNGA0Y9cclxuICAgICAgICAgIGNhc2UgJ1knICA6IHJldHVybiBnZXQoWUVBUik7ICAgICAgICAgICAgICAgICAgICAgLy8gWWVhciAgICA6IDIwMTRcclxuICAgICAgICAgIGNhc2UgJ1lZJyA6IHJldHVybiBseihnZXQoWUVBUikgJSAxMDApOyAgICAgICAgICAgLy8gWWVhciAgICA6IDE0XHJcbiAgICAgICAgfSByZXR1cm4gcGFydDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGFkZExvY2FsZShsYW5nLCBsb2NhbGUpe1xyXG4gICAgZnVuY3Rpb24gc3BsaXQoaW5kZXgpe1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgIGZvckVhY2guY2FsbChhcnJheShsb2NhbGUubW9udGhzKSwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGl0LnJlcGxhY2UoZmxleGlvUmVnRXhwLCAnJCcgKyBpbmRleCkpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGxvY2FsZXNbbGFuZ10gPSBbYXJyYXkobG9jYWxlLndlZWtkYXlzKSwgc3BsaXQoMSksIHNwbGl0KDIpXTtcclxuICAgIHJldHVybiBjb3JlO1xyXG4gIH1cclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBEQVRFLCB7XHJcbiAgICBmb3JtYXQ6ICAgIGNyZWF0ZUZvcm1hdCgnZ2V0JyksXHJcbiAgICBmb3JtYXRVVEM6IGNyZWF0ZUZvcm1hdCgnZ2V0VVRDJylcclxuICB9KTtcclxuICBhZGRMb2NhbGUoY3VycmVudCwge1xyXG4gICAgd2Vla2RheXM6ICdTdW5kYXksTW9uZGF5LFR1ZXNkYXksV2VkbmVzZGF5LFRodXJzZGF5LEZyaWRheSxTYXR1cmRheScsXHJcbiAgICBtb250aHM6ICdKYW51YXJ5LEZlYnJ1YXJ5LE1hcmNoLEFwcmlsLE1heSxKdW5lLEp1bHksQXVndXN0LFNlcHRlbWJlcixPY3RvYmVyLE5vdmVtYmVyLERlY2VtYmVyJ1xyXG4gIH0pO1xyXG4gIGFkZExvY2FsZSgncnUnLCB7XHJcbiAgICB3ZWVrZGF5czogJ9CS0L7RgdC60YDQtdGB0LXQvdGM0LUs0J/QvtC90LXQtNC10LvRjNC90LjQuizQktGC0L7RgNC90LjQuizQodGA0LXQtNCwLNCn0LXRgtCy0LXRgNCzLNCf0Y/RgtC90LjRhtCwLNCh0YPQsdCx0L7RgtCwJyxcclxuICAgIG1vbnRoczogJ9Cv0L3QstCw0YA60Y980Yws0KTQtdCy0YDQsNC7OtGPfNGMLNCc0LDRgNGCOtCwfCzQkNC/0YDQtdC7OtGPfNGMLNCc0LA60Y980Lks0JjRjtC9OtGPfNGMLCcgK1xyXG4gICAgICAgICAgICAn0JjRjtC7OtGPfNGMLNCQ0LLQs9GD0YHRgjrQsHws0KHQtdC90YLRj9Cx0YA60Y980Yws0J7QutGC0Y/QsdGAOtGPfNGMLNCd0L7Rj9Cx0YA60Y980Yws0JTQtdC60LDQsdGAOtGPfNGMJ1xyXG4gIH0pO1xyXG4gIGNvcmUubG9jYWxlID0gZnVuY3Rpb24obG9jYWxlKXtcclxuICAgIHJldHVybiBoYXMobG9jYWxlcywgbG9jYWxlKSA/IGN1cnJlbnQgPSBsb2NhbGUgOiBjdXJyZW50O1xyXG4gIH07XHJcbiAgY29yZS5hZGRMb2NhbGUgPSBhZGRMb2NhbGU7XHJcbn0oL1xcYlxcd1xcdz9cXGIvZywgLzooLiopXFx8KC4qKSQvLCB7fSwgJ2VuJywgJ1NlY29uZHMnLCAnTWludXRlcycsICdIb3VycycsICdNb250aCcsICdGdWxsWWVhcicpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmdsb2JhbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4kZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge2dsb2JhbDogZ2xvYmFsfSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGpzLmFycmF5LnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEphdmFTY3JpcHQgMS42IC8gU3RyYXdtYW4gYXJyYXkgc3RhdGljcyBzaGltXHJcbiFmdW5jdGlvbihhcnJheVN0YXRpY3Mpe1xyXG4gIGZ1bmN0aW9uIHNldEFycmF5U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xyXG4gICAgZm9yRWFjaC5jYWxsKGFycmF5KGtleXMpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZihrZXkgaW4gQXJyYXlQcm90bylhcnJheVN0YXRpY3Nba2V5XSA9IGN0eChjYWxsLCBBcnJheVByb3RvW2tleV0sIGxlbmd0aCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgc2V0QXJyYXlTdGF0aWNzKCdwb3AscmV2ZXJzZSxzaGlmdCxrZXlzLHZhbHVlcyxlbnRyaWVzJywgMSk7XHJcbiAgc2V0QXJyYXlTdGF0aWNzKCdpbmRleE9mLGV2ZXJ5LHNvbWUsZm9yRWFjaCxtYXAsZmlsdGVyLGZpbmQsZmluZEluZGV4LGluY2x1ZGVzJywgMyk7XHJcbiAgc2V0QXJyYXlTdGF0aWNzKCdqb2luLHNsaWNlLGNvbmNhdCxwdXNoLHNwbGljZSx1bnNoaWZ0LHNvcnQsbGFzdEluZGV4T2YsJyArXHJcbiAgICAgICAgICAgICAgICAgICdyZWR1Y2UscmVkdWNlUmlnaHQsY29weVdpdGhpbixmaWxsLHR1cm4nKTtcclxuICAkZGVmaW5lKFNUQVRJQywgQVJSQVksIGFycmF5U3RhdGljcyk7XHJcbn0oe30pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiB3ZWIuZG9tLml0YXJhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oTm9kZUxpc3Qpe1xyXG4gIGlmKGZyYW1ld29yayAmJiBOb2RlTGlzdCAmJiAhKFNZTUJPTF9JVEVSQVRPUiBpbiBOb2RlTGlzdFtQUk9UT1RZUEVdKSl7XHJcbiAgICBoaWRkZW4oTm9kZUxpc3RbUFJPVE9UWVBFXSwgU1lNQk9MX0lURVJBVE9SLCBJdGVyYXRvcnNbQVJSQVldKTtcclxuICB9XHJcbiAgSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzW0FSUkFZXTtcclxufShnbG9iYWwuTm9kZUxpc3QpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmxvZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24obG9nLCBlbmFibGVkKXtcclxuICAvLyBNZXRob2RzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0RldmVsb3BlclRvb2xzV0cvY29uc29sZS1vYmplY3QvYmxvYi9tYXN0ZXIvYXBpLm1kXHJcbiAgZm9yRWFjaC5jYWxsKGFycmF5KCdhc3NlcnQsY2xlYXIsY291bnQsZGVidWcsZGlyLGRpcnhtbCxlcnJvcixleGNlcHRpb24sJyArXHJcbiAgICAgICdncm91cCxncm91cENvbGxhcHNlZCxncm91cEVuZCxpbmZvLGlzSW5kZXBlbmRlbnRseUNvbXBvc2VkLGxvZywnICtcclxuICAgICAgJ21hcmtUaW1lbGluZSxwcm9maWxlLHByb2ZpbGVFbmQsdGFibGUsdGltZSx0aW1lRW5kLHRpbWVsaW5lLCcgK1xyXG4gICAgICAndGltZWxpbmVFbmQsdGltZVN0YW1wLHRyYWNlLHdhcm4nKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgIGxvZ1trZXldID0gZnVuY3Rpb24oKXtcclxuICAgICAgaWYoZW5hYmxlZCAmJiBrZXkgaW4gY29uc29sZSlyZXR1cm4gYXBwbHkuY2FsbChjb25zb2xlW2tleV0sIGNvbnNvbGUsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7bG9nOiBhc3NpZ24obG9nLmxvZywgbG9nLCB7XHJcbiAgICBlbmFibGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGRpc2FibGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9KX0pO1xyXG59KHt9LCB0cnVlKTtcbn0odHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCksIGZhbHNlKTtcbm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogbW9kdWxlLmV4cG9ydHMsIF9fZXNNb2R1bGU6IHRydWUgfTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgdmFyIHByb3AgPSBwcm9wc1trZXldO1xuICAgICAgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDtcblxuICAgIHZhciBkZXNjID0gX2NvcmUuT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCIvKipcbiAqIEBmaWxlIExvYWRlcnM6IEF1ZGlvQnVmZmVyIGxvYWRlciBhbmQgdXRpbGl0aWVzXG4gKiBAYXV0aG9yIFNhbXVlbCBHb2xkc3ptaWR0XG4gKiBAdmVyc2lvbiAwLjEuMVxuICovXG5cbi8vIENvbW1vbkpTIGZ1bmN0aW9uIGV4cG9ydFxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIExvYWRlcjogcmVxdWlyZSgnLi9kaXN0L2xvYWRlcicpLFxuICBBdWRpb0J1ZmZlckxvYWRlcjogcmVxdWlyZSgnLi9kaXN0L2F1ZGlvLWJ1ZmZlci1sb2FkZXInKSxcbiAgU3VwZXJMb2FkZXI6IHJlcXVpcmUoJy4vZGlzdC9zdXBlci1sb2FkZXInKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHdhdmVzQXVkaW8gPSB7XG4gIC8vIGNvcmVcbiAgYXVkaW9Db250ZXh0OiByZXF1aXJlKCcuL2Rpc3QvY29yZS9hdWRpby1jb250ZXh0JyksXG4gIFRpbWVFbmdpbmU6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RpbWUtZW5naW5lJyksXG4gIC8vIGVuZ2luZXNcbiAgR3JhbnVsYXJFbmdpbmU6IHJlcXVpcmUoJy4vZGlzdC9lbmdpbmVzL2dyYW51bGFyLWVuZ2luZScpLFxuICBNZXRyb25vbWU6IHJlcXVpcmUoJy4vZGlzdC9lbmdpbmVzL21ldHJvbm9tZScpLFxuICBQbGF5ZXJFbmdpbmU6IHJlcXVpcmUoJy4vZGlzdC9lbmdpbmVzL3BsYXllci1lbmdpbmUnKSxcbiAgU2VnbWVudEVuZ2luZTogcmVxdWlyZSgnLi9kaXN0L2VuZ2luZXMvc2VnbWVudC1lbmdpbmUnKSxcbiAgLy8gbWFzdGVyc1xuICBQbGF5Q29udHJvbDogcmVxdWlyZSgnLi9kaXN0L21hc3RlcnMvcGxheS1jb250cm9sJyksXG4gIFRyYW5zcG9ydDogcmVxdWlyZSgnLi9kaXN0L21hc3RlcnMvdHJhbnNwb3J0JyksXG4gIC8vIGV4cG9zZSB0aGVzZSA/XG4gIFNjaGVkdWxlcjogcmVxdWlyZSgnLi9kaXN0L21hc3RlcnMvc2NoZWR1bGVyJyksXG4gIFNpbXBsZVNjaGVkdWxlcjogcmVxdWlyZSgnLi9kaXN0L21hc3RlcnMvc2ltcGxlLXNjaGVkdWxlcicpLFxuICAvLyB1dGlsc1xuICBQcmlvcml0eVF1ZXVlOiByZXF1aXJlKCcuL2Rpc3QvdXRpbHMvcHJpb3JpdHktcXVldWUtaGVhcCcpLFxuICAvLyBmYWN0b3JpZXNcbiAgZ2V0U2NoZWR1bGVyOiByZXF1aXJlKCcuL2Rpc3QvbWFzdGVycy9mYWN0b3JpZXMnKS5nZXRTY2hlZHVsZXIsXG4gIGdldFNpbXBsZVNjaGVkdWxlcjogcmVxdWlyZSgnLi9kaXN0L21hc3RlcnMvZmFjdG9yaWVzJykuZ2V0U2ltcGxlU2NoZWR1bGVyXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB3YXZlc0F1ZGlvOyJdfQ==
