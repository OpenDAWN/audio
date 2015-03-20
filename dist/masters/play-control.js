"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var TimeEngine = require("../core/time-engine");

var _require = require("./factories");

var getScheduler = _require.getScheduler;

var PlayControlSchedulerHook = (function (_TimeEngine) {
  function PlayControlSchedulerHook(playControl) {
    _classCallCheck(this, PlayControlSchedulerHook);

    _get(_core.Object.getPrototypeOf(PlayControlSchedulerHook.prototype), "constructor", this).call(this);
    this.__playControl = playControl;
  }

  _inherits(PlayControlSchedulerHook, _TimeEngine);

  _createClass(PlayControlSchedulerHook, {
    advanceTime: {
      value: function advanceTime(time) {
        var playControl = this.__playControl;
        var position = playControl.__getPositionAtTime(time);
        var nextPosition = playControl.__engine.advancePosition(time, position, playControl.__speed);

        if (nextPosition !== Infinity) {
          return playControl.__getTimeAtPosition(nextPosition);
        }return Infinity;
      }
    }
  });

  return PlayControlSchedulerHook;
})(TimeEngine);

var PlayControlLoopControl = (function (_TimeEngine2) {
  function PlayControlLoopControl(playControl) {
    _classCallCheck(this, PlayControlLoopControl);

    _get(_core.Object.getPrototypeOf(PlayControlLoopControl.prototype), "constructor", this).call(this);
    this.__playControl = playControl;
    this.speed = null;
  }

  _inherits(PlayControlLoopControl, _TimeEngine2);

  _createClass(PlayControlLoopControl, {
    advanceTime: {

      // TimeEngine method (scheduled interface)

      value: function advanceTime(time) {
        if (this.speed > 0) {
          this.__playControl.syncSpeed(time, this.__playControl.__loopStart, this.speed, true);
          return this.__playControl.__getTimeAtPosition(this.__playControl.__loopEnd);
        } else if (this.speed < 0) {
          this.__playControl.syncSpeed(time, this.__playControl.__loopEnd, this.speed, true);
          return this.__playControl.__getTimeAtPosition(this.__playControl.__loopStart);
        }
        return Infinity;
      }
    }
  });

  return PlayControlLoopControl;
})(TimeEngine);

var PlayControl = (function (_TimeEngine3) {
  function PlayControl(engine) {
    var _this = this;

    _classCallCheck(this, PlayControl);

    _get(_core.Object.getPrototypeOf(PlayControl.prototype), "constructor", this).call(this, engine.audioContext);

    // future assignment
    // this.scheduler = waves.getScheduler(engine.audioContext);
    // this.scheduler = require("scheduler");
    // test
    this.scheduler = getScheduler(engine.audioContext);

    this.__engine = null;
    this.__interface = null;
    this.__schedulerHook = null;

    this.__loopControl = null;
    this.__loopStart = 0;
    this.__loopEnd = Infinity;

    // synchronized tie, position, and speed
    this.__time = 0;
    this.__position = 0;
    this.__speed = 0;

    this.__nextPosition = Infinity;

    // non-zero "user" speed
    this.__playingSpeed = 1;

    if (engine.master) throw new Error("object has already been added to a master");

    var speed = this.__speed;

    var getCurrentTime = function () {
      return _this.currentTime;
    };

    var getCurrentPosition = function () {
      return _this.currentPosition;
    };

    if (engine.implementsSpeedControlled()) {
      // add time engine that implements speed-controlled interface
      this.__engine = engine;
      this.__interface = "speed-controlled";
      engine.setSpeedControlled(this, getCurrentTime, getCurrentPosition);
    } else if (engine.implementsTransported()) {
      // add time engine that implements transported interface
      this.__engine = engine;
      this.__interface = "transported";

      engine.setTransported(this, 0, function () {
        var nextEnginePosition = arguments[0] === undefined ? null : arguments[0];

        // resetNextPosition
        if (nextEnginePosition === null) {
          var time = _this.scheduler.currentTime;
          var position = _this.__getPositionAtTime(time);
          nextEnginePosition = engine.syncPosition(time, position, _this.__speed);
        }

        _this.__resetNextPosition(nextEnginePosition);
      }, getCurrentTime, getCurrentPosition);
    } else if (engine.implementsScheduled()) {
      // add time engine that implements scheduled interface
      this.__engine = engine;
      this.__interface = "scheduled";

      this.scheduler.add(engine, Infinity, getCurrentPosition);
    } else {
      throw new Error("object cannot be added to play control");
    }
  }

  _inherits(PlayControl, _TimeEngine3);

  _createClass(PlayControl, {
    __getTimeAtPosition: {

      /**
       * Extrapolate transport time for given position
       * @param {Number} position position
       * @return {Number} extrapolated time
       */

      value: function __getTimeAtPosition(position) {
        return this.__time + (position - this.__position) / this.__speed;
      }
    },
    __getPositionAtTime: {

      /**
       * Extrapolate playing position for given time
       * @param {Number} time time
       * @return {Number} extrapolated position
       */

      value: function __getPositionAtTime(time) {
        return this.__position + (time - this.__time) * this.__speed;
      }
    },
    __sync: {
      value: function __sync() {
        var now = this.currentTime;
        this.__position += (now - this.__time) * this.__speed;
        this.__time = now;
        return now;
      }
    },
    __resetNextPosition: {

      /**
       * Get current master position
       * @return {Number} current playing position
       */

      value: function __resetNextPosition(nextPosition) {
        if (this.__schedulerHook) this.__schedulerHook.resetNextTime(this.__getTimeAtPosition(nextPosition));

        this.__nextPosition = nextPosition;
      }
    },
    currentTime: {

      /**
       * Get current master time
       * @return {Number} current time
       *
       * This function will be replaced when the play-control is added to a master.
       */

      get: function () {
        return this.scheduler.currentTime;
      }
    },
    currentPosition: {

      /**
       * Get current master position
       * @return {Number} current playing position
       *
       * This function will be replaced when the play-control is added to a master.
       */

      get: function () {
        return this.__position + (this.scheduler.currentTime - this.__time) * this.__speed;
      }
    },
    loop: {
      set: function (enable) {
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
      get: function () {
        return !!this.__loopControl;
      }
    },
    setLoopBoundaries: {
      value: function setLoopBoundaries(start, end) {
        if (end >= start) {
          this.__loopStart = start;
          this.__loopEnd = end;
        } else {
          this.__loopStart = end;
          this.__loopEnd = start;
        }

        this.loop = this.loop;
      }
    },
    loopStart: {
      set: function (startTime) {
        this.setLoopBoundaries(startTime, this.__loopEnd);
      },
      get: function () {
        return this.__loopStart;
      }
    },
    loopEnd: {
      set: function (endTime) {
        this.setLoopBoundaries(this.__loopStart, endTime);
      },
      get: function () {
        return this.__loopEnd;
      }
    },
    __applyLoopBoundaries: {
      value: function __applyLoopBoundaries(position, speed, seek) {
        if (this.__loopControl) {
          if (speed > 0 && position >= this.__loopEnd) {
            return this.__loopStart + (position - this.__loopStart) % (this.__loopEnd - this.__loopStart);
          } else if (speed < 0 && position < this.__loopStart) {
            return this.__loopEnd - (this.__loopEnd - position) % (this.__loopEnd - this.__loopStart);
          }
        }

        return position;
      }
    },
    __rescheduleLoopControl: {
      value: function __rescheduleLoopControl(position, speed) {
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
      }
    },
    syncSpeed: {

      // TimeEngine method (speed-controlled interface)

      value: function syncSpeed(time, position, speed) {
        var seek = arguments[3] === undefined ? false : arguments[3];

        var lastSpeed = this.__speed;

        if (speed !== lastSpeed || seek) {
          if (seek || lastSpeed === 0) position = this.__applyLoopBoundaries(position, speed);

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
                // start
                nextPosition = this.__engine.syncPosition(time, position, speed);

                // add scheduler hook to scheduler (will be rescheduled to appropriate time below)
                this.__schedulerHook = new PlayControlSchedulerHook(this);
                this.scheduler.add(this.__schedulerHook, Infinity);
              } else if (speed === 0) {
                // stop
                nextPosition = Infinity;

                if (this.__engine.syncSpeed) this.__engine.syncSpeed(time, position, 0);

                // remove scheduler hook from scheduler
                this.scheduler.remove(this.__schedulerHook);
                this.__schedulerHook = null;
              } else if (speed * lastSpeed < 0) {
                // change transport direction
                nextPosition = this.__engine.syncPosition(time, position, speed);
              } else if (this.__engine.syncSpeed) {
                this.__engine.syncSpeed(time, position, speed);
              }

              this.__resetNextPosition(nextPosition);
              break;

            case "scheduled":
              if (lastSpeed === 0) // start or seek
                this.__scheduledEngine.resetNextTime(0);else if (speed === 0) // stop
                this.__scheduledEngine.resetNextTime(Infinity);
              break;
          }

          this.__rescheduleLoopControl(position, speed);
        }
      }
    },
    start: {

      /**
       * Start playing
       */

      value: function start() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, this.__playingSpeed);
      }
    },
    pause: {

      /**
       * Pause playing
       */

      value: function pause() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
      }
    },
    stop: {

      /**
       * Stop playing
       */

      value: function stop() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
        this.seek(0);
      }
    },
    speed: {

      /**
       * Set playing speed
       * @param {Number} speed playing speed (non-zero speed between -16 and -1/16 or between 1/16 and 16)
       */

      set: function (speed) {
        var time = this.__sync();

        if (speed >= 0) {
          if (speed < 0.0625) speed = 0.0625;else if (speed > 16) speed = 16;
        } else {
          if (speed < -16) speed = -16;else if (speed > -0.0625) speed = -0.0625;
        }

        this.__playingSpeed = speed;

        if (this.__speed !== 0) this.syncSpeed(time, this.__position, speed);
      },

      /**
       * Get playing speed
       * @return current playing speed
       */
      get: function () {
        return this.__playingSpeed;
      }
    },
    seek: {

      /**
       * Set (jump to) playing position
       * @param {Number} position target position
       */

      value: function seek(position) {
        if (position !== this.__position) {
          var time = this.__sync();
          this.__position = position;
          this.syncSpeed(time, position, this.__speed, true);
        }
      }
    },
    clear: {

      /**
       * Remove time engine from the transport
       */

      value: function clear() {
        var time = this.__sync();
        this.syncSpeed(time, this.__position, 0);
        this.__engine.resetInterface();
      }
    }
  });

  return PlayControl;
})(TimeEngine);

module.exports = PlayControl;
/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio play control class (time-engine master), provides play control to a single engine
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFPQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7ZUFDekIsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7SUFBdkMsWUFBWSxZQUFaLFlBQVk7O0lBRVosd0JBQXdCO0FBQ2pCLFdBRFAsd0JBQXdCLENBQ2hCLFdBQVcsRUFBRTswQkFEckIsd0JBQXdCOztBQUUxQixxQ0FGRSx3QkFBd0IsNkNBRWxCO0FBQ1IsUUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7R0FDbEM7O1lBSkcsd0JBQXdCOztlQUF4Qix3QkFBd0I7QUFNNUIsZUFBVzthQUFBLHFCQUFDLElBQUksRUFBRTtBQUNoQixZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3JDLFlBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxZQUFJLFlBQVksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0YsWUFBSSxZQUFZLEtBQUssUUFBUTtBQUMzQixpQkFBTyxXQUFXLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7U0FBQSxBQUV2RCxPQUFPLFFBQVEsQ0FBQztPQUNqQjs7OztTQWZHLHdCQUF3QjtHQUFTLFVBQVU7O0lBa0IzQyxzQkFBc0I7QUFDZixXQURQLHNCQUFzQixDQUNkLFdBQVcsRUFBRTswQkFEckIsc0JBQXNCOztBQUV4QixxQ0FGRSxzQkFBc0IsNkNBRWhCO0FBQ1IsUUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7QUFDakMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDbkI7O1lBTEcsc0JBQXNCOztlQUF0QixzQkFBc0I7QUFRMUIs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QUM7T0FDNUI7O0FBTUQsUUFBSTs7Ozs7OzthQUFBLGNBQUMsUUFBUSxFQUFFO0FBQ2IsWUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNoQyxjQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDekIsY0FBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDM0IsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEQ7T0FDRjs7QUFLRCxTQUFLOzs7Ozs7YUFBQSxpQkFBRztBQUNOLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDaEM7Ozs7U0E5VUcsV0FBVztHQUFTLFVBQVU7O0FBaVZwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvdXRpbHMvcHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gcGxheSBjb250cm9sIGNsYXNzICh0aW1lLWVuZ2luZSBtYXN0ZXIpLCBwcm92aWRlcyBwbGF5IGNvbnRyb2wgdG8gYSBzaW5nbGUgZW5naW5lXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgVGltZUVuZ2luZSA9IHJlcXVpcmUoXCIuLi9jb3JlL3RpbWUtZW5naW5lXCIpO1xudmFyIHsgZ2V0U2NoZWR1bGVyIH0gPSByZXF1aXJlKCcuL2ZhY3RvcmllcycpO1xuXG5jbGFzcyBQbGF5Q29udHJvbFNjaGVkdWxlckhvb2sgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IocGxheUNvbnRyb2wpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IHBsYXlDb250cm9sO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUodGltZSkge1xuICAgIHZhciBwbGF5Q29udHJvbCA9IHRoaXMuX19wbGF5Q29udHJvbDtcbiAgICB2YXIgcG9zaXRpb24gPSBwbGF5Q29udHJvbC5fX2dldFBvc2l0aW9uQXRUaW1lKHRpbWUpO1xuICAgIHZhciBuZXh0UG9zaXRpb24gPSBwbGF5Q29udHJvbC5fX2VuZ2luZS5hZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHBsYXlDb250cm9sLl9fc3BlZWQpO1xuXG4gICAgaWYgKG5leHRQb3NpdGlvbiAhPT0gSW5maW5pdHkpXG4gICAgICByZXR1cm4gcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuXG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG59XG5cbmNsYXNzIFBsYXlDb250cm9sTG9vcENvbnRyb2wgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IocGxheUNvbnRyb2wpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IHBsYXlDb250cm9sO1xuICAgIHRoaXMuc3BlZWQgPSBudWxsO1xuICB9XG5cbiAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNjaGVkdWxlZCBpbnRlcmZhY2UpXG4gIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcbiAgICAgIHRoaXMuX19wbGF5Q29udHJvbC5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3BsYXlDb250cm9sLl9fbG9vcFN0YXJ0LCB0aGlzLnNwZWVkLCB0cnVlKTtcbiAgICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fcGxheUNvbnRyb2wuX19sb29wRW5kKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3BlZWQgPCAwKSB7XG4gICAgICB0aGlzLl9fcGxheUNvbnRyb2wuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wbGF5Q29udHJvbC5fX2xvb3BFbmQsIHRoaXMuc3BlZWQsIHRydWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX19wbGF5Q29udHJvbC5fX2dldFRpbWVBdFBvc2l0aW9uKHRoaXMuX19wbGF5Q29udHJvbC5fX2xvb3BTdGFydCk7XG4gICAgfVxuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxufVxuXG5jbGFzcyBQbGF5Q29udHJvbCBleHRlbmRzIFRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICBzdXBlcihlbmdpbmUuYXVkaW9Db250ZXh0KTtcblxuICAgIC8vIGZ1dHVyZSBhc3NpZ25tZW50XG4gICAgLy8gdGhpcy5zY2hlZHVsZXIgPSB3YXZlcy5nZXRTY2hlZHVsZXIoZW5naW5lLmF1ZGlvQ29udGV4dCk7XG4gICAgLy8gdGhpcy5zY2hlZHVsZXIgPSByZXF1aXJlKFwic2NoZWR1bGVyXCIpO1xuICAgIC8vIHRlc3RcbiAgICB0aGlzLnNjaGVkdWxlciA9IGdldFNjaGVkdWxlcihlbmdpbmUuYXVkaW9Db250ZXh0KTtcblxuICAgIHRoaXMuX19lbmdpbmUgPSBudWxsO1xuICAgIHRoaXMuX19pbnRlcmZhY2UgPSBudWxsO1xuICAgIHRoaXMuX19zY2hlZHVsZXJIb29rID0gbnVsbDtcblxuICAgIHRoaXMuX19sb29wQ29udHJvbCA9IG51bGw7XG4gICAgdGhpcy5fX2xvb3BTdGFydCA9IDA7XG4gICAgdGhpcy5fX2xvb3BFbmQgPSBJbmZpbml0eTtcblxuICAgIC8vIHN5bmNocm9uaXplZCB0aWUsIHBvc2l0aW9uLCBhbmQgc3BlZWRcbiAgICB0aGlzLl9fdGltZSA9IDA7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gMDtcbiAgICB0aGlzLl9fc3BlZWQgPSAwO1xuXG4gICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IEluZmluaXR5O1xuXG4gICAgLy8gbm9uLXplcm8gXCJ1c2VyXCIgc3BlZWRcbiAgICB0aGlzLl9fcGxheWluZ1NwZWVkID0gMTtcblxuICAgIGlmIChlbmdpbmUubWFzdGVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gYSBtYXN0ZXJcIik7XG5cbiAgICB2YXIgc3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICB2YXIgZ2V0Q3VycmVudFRpbWUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZTtcbiAgICB9O1xuXG4gICAgdmFyIGdldEN1cnJlbnRQb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICB9O1xuXG4gICAgaWYgKGVuZ2luZS5pbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKCkpIHtcbiAgICAgIC8vIGFkZCB0aW1lIGVuZ2luZSB0aGF0IGltcGxlbWVudHMgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAgICAgIHRoaXMuX19lbmdpbmUgPSBlbmdpbmU7XG4gICAgICB0aGlzLl9faW50ZXJmYWNlID0gXCJzcGVlZC1jb250cm9sbGVkXCI7XG4gICAgICBlbmdpbmUuc2V0U3BlZWRDb250cm9sbGVkKHRoaXMsIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoZW5naW5lLmltcGxlbWVudHNUcmFuc3BvcnRlZCgpKSB7XG4gICAgICAvLyBhZGQgdGltZSBlbmdpbmUgdGhhdCBpbXBsZW1lbnRzIHRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgIHRoaXMuX19pbnRlcmZhY2UgPSBcInRyYW5zcG9ydGVkXCI7XG5cbiAgICAgIGVuZ2luZS5zZXRUcmFuc3BvcnRlZCh0aGlzLCAwLCAobmV4dEVuZ2luZVBvc2l0aW9uID0gbnVsbCkgPT4ge1xuICAgICAgICAvLyByZXNldE5leHRQb3NpdGlvblxuICAgICAgICBpZiAobmV4dEVuZ2luZVBvc2l0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgdmFyIHRpbWUgPSB0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLl9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSk7XG4gICAgICAgICAgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgdGhpcy5fX3NwZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19yZXNldE5leHRQb3NpdGlvbihuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgfSwgZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgfSBlbHNlIGlmIChlbmdpbmUuaW1wbGVtZW50c1NjaGVkdWxlZCgpKSB7XG4gICAgICAvLyBhZGQgdGltZSBlbmdpbmUgdGhhdCBpbXBsZW1lbnRzIHNjaGVkdWxlZCBpbnRlcmZhY2VcbiAgICAgIHRoaXMuX19lbmdpbmUgPSBlbmdpbmU7XG4gICAgICB0aGlzLl9faW50ZXJmYWNlID0gXCJzY2hlZHVsZWRcIjtcblxuICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKGVuZ2luZSwgSW5maW5pdHksIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gcGxheSBjb250cm9sXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYXBvbGF0ZSB0cmFuc3BvcnQgdGltZSBmb3IgZ2l2ZW4gcG9zaXRpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIHBvc2l0aW9uXG4gICAqIEByZXR1cm4ge051bWJlcn0gZXh0cmFwb2xhdGVkIHRpbWVcbiAgICovXG4gIF9fZ2V0VGltZUF0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5fX3RpbWUgKyAocG9zaXRpb24gLSB0aGlzLl9fcG9zaXRpb24pIC8gdGhpcy5fX3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhcG9sYXRlIHBsYXlpbmcgcG9zaXRpb24gZm9yIGdpdmVuIHRpbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGV4dHJhcG9sYXRlZCBwb3NpdGlvblxuICAgKi9cbiAgX19nZXRQb3NpdGlvbkF0VGltZSh0aW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wb3NpdGlvbiArICh0aW1lIC0gdGhpcy5fX3RpbWUpICogdGhpcy5fX3NwZWVkO1xuICB9XG5cbiAgX19zeW5jKCkge1xuICAgIHZhciBub3cgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgIHRoaXMuX19wb3NpdGlvbiArPSAobm93IC0gdGhpcy5fX3RpbWUpICogdGhpcy5fX3NwZWVkO1xuICAgIHRoaXMuX190aW1lID0gbm93O1xuICAgIHJldHVybiBub3c7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uXG4gICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBwbGF5aW5nIHBvc2l0aW9uXG4gICAqL1xuICBfX3Jlc2V0TmV4dFBvc2l0aW9uKG5leHRQb3NpdGlvbikge1xuICAgIGlmICh0aGlzLl9fc2NoZWR1bGVySG9vaylcbiAgICAgIHRoaXMuX19zY2hlZHVsZXJIb29rLnJlc2V0TmV4dFRpbWUodGhpcy5fX2dldFRpbWVBdFBvc2l0aW9uKG5leHRQb3NpdGlvbikpO1xuXG4gICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IG5leHRQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGN1cnJlbnQgdGltZVxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgcGxheS1jb250cm9sIGlzIGFkZGVkIHRvIGEgbWFzdGVyLlxuICAgKi9cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBtYXN0ZXIgcG9zaXRpb25cbiAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHBsYXlpbmcgcG9zaXRpb25cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHBsYXktY29udHJvbCBpcyBhZGRlZCB0byBhIG1hc3Rlci5cbiAgICovXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wb3NpdGlvbiArICh0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgfVxuXG4gIHNldCBsb29wKGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGlmICh0aGlzLl9fbG9vcFN0YXJ0ID4gLUluZmluaXR5ICYmIHRoaXMuX19sb29wRW5kIDwgSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5fX2xvb3BDb250cm9sID0gbmV3IFBsYXlDb250cm9sTG9vcENvbnRyb2wodGhpcyk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLl9fbG9vcENvbnRyb2wsIEluZmluaXR5KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX19sb29wQ29udHJvbCkge1xuICAgICAgdGhpcy5zY2hlZHVsZXIucmVtb3ZlKHRoaXMuX19sb29wQ29udHJvbCk7XG4gICAgICB0aGlzLl9fbG9vcENvbnRyb2wgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsb29wKCkge1xuICAgIHJldHVybiAoISF0aGlzLl9fbG9vcENvbnRyb2wpO1xuICB9XG5cbiAgc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnQsIGVuZCkge1xuICAgIGlmIChlbmQgPj0gc3RhcnQpIHtcbiAgICAgIHRoaXMuX19sb29wU3RhcnQgPSBzdGFydDtcbiAgICAgIHRoaXMuX19sb29wRW5kID0gZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fbG9vcFN0YXJ0ID0gZW5kO1xuICAgICAgdGhpcy5fX2xvb3BFbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICB0aGlzLmxvb3AgPSB0aGlzLmxvb3A7XG4gIH1cblxuICBzZXQgbG9vcFN0YXJ0KHN0YXJ0VGltZSkge1xuICAgIHRoaXMuc2V0TG9vcEJvdW5kYXJpZXMoc3RhcnRUaW1lLCB0aGlzLl9fbG9vcEVuZCk7XG4gIH1cblxuICBnZXQgbG9vcFN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9fbG9vcFN0YXJ0O1xuICB9XG5cbiAgc2V0IGxvb3BFbmQoZW5kVGltZSkge1xuICAgIHRoaXMuc2V0TG9vcEJvdW5kYXJpZXModGhpcy5fX2xvb3BTdGFydCwgZW5kVGltZSk7XG4gIH1cblxuICBnZXQgbG9vcEVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fX2xvb3BFbmQ7XG4gIH1cblxuICBfX2FwcGx5TG9vcEJvdW5kYXJpZXMocG9zaXRpb24sIHNwZWVkLCBzZWVrKSB7XG4gICAgaWYgKHRoaXMuX19sb29wQ29udHJvbCkge1xuICAgICAgaWYgKHNwZWVkID4gMCAmJiBwb3NpdGlvbiA+PSB0aGlzLl9fbG9vcEVuZClcbiAgICAgICAgcmV0dXJuIHRoaXMuX19sb29wU3RhcnQgKyAocG9zaXRpb24gLSB0aGlzLl9fbG9vcFN0YXJ0KSAlICh0aGlzLl9fbG9vcEVuZCAtIHRoaXMuX19sb29wU3RhcnQpO1xuICAgICAgZWxzZSBpZiAoc3BlZWQgPCAwICYmIHBvc2l0aW9uIDwgdGhpcy5fX2xvb3BTdGFydClcbiAgICAgICAgcmV0dXJuIHRoaXMuX19sb29wRW5kIC0gKHRoaXMuX19sb29wRW5kIC0gcG9zaXRpb24pICUgKHRoaXMuX19sb29wRW5kIC0gdGhpcy5fX2xvb3BTdGFydCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgX19yZXNjaGVkdWxlTG9vcENvbnRyb2wocG9zaXRpb24sIHNwZWVkKSB7XG4gICAgaWYgKHRoaXMuX19sb29wQ29udHJvbCkge1xuICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIucmVzZXQodGhpcy5fX2xvb3BDb250cm9sLCB0aGlzLl9fZ2V0VGltZUF0UG9zaXRpb24odGhpcy5fX2xvb3BFbmQpKTtcbiAgICAgIH0gZWxzZSBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICAgIHRoaXMuX19sb29wQ29udHJvbC5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLnNjaGVkdWxlci5yZXNldCh0aGlzLl9fbG9vcENvbnRyb2wsIHRoaXMuX19nZXRUaW1lQXRQb3NpdGlvbih0aGlzLl9fbG9vcFN0YXJ0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNjaGVkdWxlci5yZXNldCh0aGlzLl9fbG9vcENvbnRyb2wsIEluZmluaXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBUaW1lRW5naW5lIG1ldGhvZCAoc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2UpXG4gIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQsIHNlZWsgPSBmYWxzZSkge1xuICAgIHZhciBsYXN0U3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICBpZiAoc3BlZWQgIT09IGxhc3RTcGVlZCB8fCBzZWVrKSB7XG4gICAgICBpZiAoc2VlayB8fCBsYXN0U3BlZWQgPT09IDApXG4gICAgICAgIHBvc2l0aW9uID0gdGhpcy5fX2FwcGx5TG9vcEJvdW5kYXJpZXMocG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgdGhpcy5fX3RpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICB0aGlzLl9fc3BlZWQgPSBzcGVlZDtcblxuICAgICAgc3dpdGNoICh0aGlzLl9faW50ZXJmYWNlKSB7XG4gICAgICAgIGNhc2UgXCJzcGVlZC1jb250cm9sbGVkXCI6XG4gICAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkLCBzZWVrKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwidHJhbnNwb3J0ZWRcIjpcbiAgICAgICAgICB2YXIgbmV4dFBvc2l0aW9uID0gdGhpcy5fX25leHRQb3NpdGlvbjtcblxuICAgICAgICAgIGlmIChzZWVrKSB7XG4gICAgICAgICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNwZWVkID09PSAwKSB7XG4gICAgICAgICAgICAvLyBzdGFydFxuICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcblxuICAgICAgICAgICAgLy8gYWRkIHNjaGVkdWxlciBob29rIHRvIHNjaGVkdWxlciAod2lsbCBiZSByZXNjaGVkdWxlZCB0byBhcHByb3ByaWF0ZSB0aW1lIGJlbG93KVxuICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlckhvb2sgPSBuZXcgUGxheUNvbnRyb2xTY2hlZHVsZXJIb29rKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMuX19zY2hlZHVsZXJIb29rLCBJbmZpbml0eSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVlZCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gc3RvcFxuICAgICAgICAgICAgbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZClcbiAgICAgICAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIDApO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgc2NoZWR1bGVyIGhvb2sgZnJvbSBzY2hlZHVsZXJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVyLnJlbW92ZSh0aGlzLl9fc2NoZWR1bGVySG9vayk7XG4gICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVlZCAqIGxhc3RTcGVlZCA8IDApIHsgLy8gY2hhbmdlIHRyYW5zcG9ydCBkaXJlY3Rpb25cbiAgICAgICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX19lbmdpbmUuc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCkge1xuICAgICAgICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9fcmVzZXROZXh0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwic2NoZWR1bGVkXCI6XG4gICAgICAgICAgaWYgKGxhc3RTcGVlZCA9PT0gMCkgLy8gc3RhcnQgb3Igc2Vla1xuICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZEVuZ2luZS5yZXNldE5leHRUaW1lKDApO1xuICAgICAgICAgIGVsc2UgaWYgKHNwZWVkID09PSAwKSAvLyBzdG9wXG4gICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVkRW5naW5lLnJlc2V0TmV4dFRpbWUoSW5maW5pdHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fcmVzY2hlZHVsZUxvb3BDb250cm9sKHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHBsYXlpbmdcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcbiAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIHRoaXMuX19wbGF5aW5nU3BlZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHBsYXlpbmdcbiAgICovXG4gIHBhdXNlKCkge1xuICAgIHZhciB0aW1lID0gdGhpcy5fX3N5bmMoKTtcbiAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCB0aGlzLl9fcG9zaXRpb24sIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgcGxheWluZ1xuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB2YXIgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCAwKTtcbiAgICB0aGlzLnNlZWsoMCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHBsYXlpbmcgc3BlZWRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIHBsYXlpbmcgc3BlZWQgKG5vbi16ZXJvIHNwZWVkIGJldHdlZW4gLTE2IGFuZCAtMS8xNiBvciBiZXR3ZWVuIDEvMTYgYW5kIDE2KVxuICAgKi9cbiAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuXG4gICAgaWYgKHNwZWVkID49IDApIHtcbiAgICAgIGlmIChzcGVlZCA8IDAuMDYyNSlcbiAgICAgICAgc3BlZWQgPSAwLjA2MjU7XG4gICAgICBlbHNlIGlmIChzcGVlZCA+IDE2KVxuICAgICAgICBzcGVlZCA9IDE2O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3BlZWQgPCAtMTYpXG4gICAgICAgIHNwZWVkID0gLTE2O1xuICAgICAgZWxzZSBpZiAoc3BlZWQgPiAtMC4wNjI1KVxuICAgICAgICBzcGVlZCA9IC0wLjA2MjU7XG4gICAgfVxuXG4gICAgdGhpcy5fX3BsYXlpbmdTcGVlZCA9IHNwZWVkO1xuXG4gICAgaWYgKHRoaXMuX19zcGVlZCAhPT0gMClcbiAgICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wb3NpdGlvbiwgc3BlZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBwbGF5aW5nIHNwZWVkXG4gICAqIEByZXR1cm4gY3VycmVudCBwbGF5aW5nIHNwZWVkXG4gICAqL1xuICBnZXQgc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wbGF5aW5nU3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IChqdW1wIHRvKSBwbGF5aW5nIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiB0YXJnZXQgcG9zaXRpb25cbiAgICovXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBpZiAocG9zaXRpb24gIT09IHRoaXMuX19wb3NpdGlvbikge1xuICAgICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICB0aGlzLnN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgdGhpcy5fX3NwZWVkLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRpbWUgZW5naW5lIGZyb20gdGhlIHRyYW5zcG9ydFxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdmFyIHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wb3NpdGlvbiwgMCk7XG4gICAgdGhpcy5fX2VuZ2luZS5yZXNldEludGVyZmFjZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheUNvbnRyb2w7Il19