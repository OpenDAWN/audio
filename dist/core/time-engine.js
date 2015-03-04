"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var defaultAudioContext = require("./audio-context");

/**
 * @class TimeEngine
 * @classdesc Base class for time engines
 *
 * Time engines are components that generate more or less regular audio events and/or playback a media stream.
 * They implement one or multiple interfaces to be synchronized by a master such as a scheduler, a transport or a play-control.
 * The provided interfaces are "scheduled", "transported", and "play-controlled".
 *
 * In the "scheduled" interface the engine implements a method "advanceTime" that is called by the master (usually the scheduler)
 * and returns the delay until the next call of "advanceTime". The master provides the engine with a function "resetNextTime"
 * to reschedule the next call to another time.
 *
 * In the "transported" interface the master (usually a transport) first calls the method "syncPosition" that returns the position
 * of the first event generated by the engine regarding the playing direction (sign of the speed argument). Events are generated
 * through the method "advancePosition" that returns the position of the next event generated through "advancePosition".
 *
 * In the "speed-controlled" interface the engine is controlled by the method "syncSpeed".
 *
 * For all interfaces the engine is provided with the attribute getters "currentTime" and "currentPosition" (for the case that the master
 * does not implement these attribute getters, the base class provides default implementations).
 */

var TimeEngine = (function () {

  /**
   * @constructor
   */

  function TimeEngine() {
    var audioContext = arguments[0] === undefined ? defaultAudioContext : arguments[0];

    _babelHelpers.classCallCheck(this, TimeEngine);

    this.audioContext = audioContext;

    /**
     * Current master
     * @type {Object}
     */
    this.master = null;

    /**
     * Interface currently used
     * @type {String}
     */
    this["interface"] = null;

    /**
     * Output audio node
     * @type {Object}
     */
    this.outputNode = null;
  }

  _babelHelpers.prototypeProperties(TimeEngine, null, {
    currentTime: {

      /**
       * Get the time engine's current master time
       * @type {Function}
       *
       * This function provided by the master.
       */

      get: function () {
        return this.audioContext.currentTime;
      },
      configurable: true
    },
    currentPosition: {

      /**
       * Get the time engine's current master position
       * @type {Function}
       *
       * This function provided by the master.
       */

      get: function () {
        return 0;
      },
      configurable: true
    },
    resetNextTime: {

      /**
       * Function provided by the scheduler to reset the engine's next time
       * @param {Number} time new engine time (immediately if not specified)
       */

      value: function resetNextTime() {
        var time = arguments[0] === undefined ? null : arguments[0];
      },
      writable: true,
      configurable: true
    },
    resetNextPosition: {

      /**
       * Function provided by the transport to reset the next position or to request resynchronizing the engine's position
       * @param {Number} position new engine position (will call syncPosition with the current position if not specified)
       */

      value: function resetNextPosition() {
        var position = arguments[0] === undefined ? null : arguments[0];
      },
      writable: true,
      configurable: true
    },
    __setGetters: {
      value: function __setGetters(getCurrentTime, getCurrentPosition) {
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
      },
      writable: true,
      configurable: true
    },
    __deleteGetters: {
      value: function __deleteGetters() {
        delete this.currentTime;
        delete this.currentPosition;
      },
      writable: true,
      configurable: true
    },
    implementsScheduled: {

      /**
       * Check whether the time engine implements the scheduled interface
       **/

      value: function implementsScheduled() {
        return this.advanceTime && this.advanceTime instanceof Function;
      },
      writable: true,
      configurable: true
    },
    implementsTransported: {

      /**
       * Check whether the time engine implements the transported interface
       **/

      value: function implementsTransported() {
        return this.syncPosition && this.syncPosition instanceof Function && this.advancePosition && this.advancePosition instanceof Function;
      },
      writable: true,
      configurable: true
    },
    implementsSpeedControlled: {

      /**
       * Check whether the time engine implements the speed-controlled interface
       **/

      value: function implementsSpeedControlled() {
        return this.syncSpeed && this.syncSpeed instanceof Function;
      },
      writable: true,
      configurable: true
    },
    setScheduled: {
      value: function setScheduled(master, resetNextTime, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "scheduled";

        this.__setGetters(getCurrentTime, getCurrentPosition);

        if (resetNextTime) this.resetNextTime = resetNextTime;
      },
      writable: true,
      configurable: true
    },
    setTransported: {
      value: function setTransported(master, resetNextPosition, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "transported";

        this.__setGetters(getCurrentTime, getCurrentPosition);

        if (resetNextPosition) this.resetNextPosition = resetNextPosition;
      },
      writable: true,
      configurable: true
    },
    setSpeedControlled: {
      value: function setSpeedControlled(master, getCurrentTime, getCurrentPosition) {
        this.master = master;
        this["interface"] = "speed-controlled";

        this.__setGetters(getCurrentTime, getCurrentPosition);
      },
      writable: true,
      configurable: true
    },
    resetInterface: {
      value: function resetInterface() {
        this.__deleteGetters();

        delete this.resetNextTime;
        delete this.resetNextPosition;

        this.master = null;
        this["interface"] = null;
      },
      writable: true,
      configurable: true
    },
    connect: {

      /**
       * Connect audio node
       * @param {Object} target audio node
       */

      value: function connect(target) {
        this.outputNode.connect(target);
        return this;
      },
      writable: true,
      configurable: true
    },
    disconnect: {

      /**
       * Disconnect audio node
       * @param {Number} connection connection to be disconnected
       */

      value: function disconnect(connection) {
        this.outputNode.disconnect(connection);
        return this;
      },
      writable: true,
      configurable: true
    }
  });

  return TimeEngine;
})();

module.exports = TimeEngine;
/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio time engine base class
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9wcmlvcml0eS1xdWV1ZS5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQU9BLElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCL0MsVUFBVTs7Ozs7O0FBS0gsV0FMUCxVQUFVO1FBS0YsWUFBWSxnQ0FBRyxtQkFBbUI7O3VDQUwxQyxVQUFVOztBQU1aLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7QUFNakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1uQixRQUFJLGFBQVUsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztHQUN4Qjs7b0NBekJHLFVBQVU7QUFpQ1YsZUFBVzs7Ozs7Ozs7O1dBQUEsWUFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO09BQ3RDOzs7QUFRRyxtQkFBZTs7Ozs7Ozs7O1dBQUEsWUFBRztBQUNwQixlQUFPLENBQUMsQ0FBQztPQUNWOzs7QUFNRCxpQkFBYTs7Ozs7OzthQUFBLHlCQUFjO1lBQWIsSUFBSSxnQ0FBRyxJQUFJO09BQUk7Ozs7QUFNN0IscUJBQWlCOzs7Ozs7O2FBQUEsNkJBQWtCO1lBQWpCLFFBQVEsZ0NBQUcsSUFBSTtPQUFJOzs7O0FBRXJDLGdCQUFZO2FBQUEsc0JBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQy9DLFlBQUksY0FBYyxFQUFFO0FBQ2xCLGdCQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7QUFDekMsd0JBQVksRUFBRSxJQUFJO0FBQ2xCLGVBQUcsRUFBRSxjQUFjO1dBQ3BCLENBQUMsQ0FBQztTQUNKOztBQUVELFlBQUksa0JBQWtCLEVBQUU7QUFDdEIsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO0FBQzdDLHdCQUFZLEVBQUUsSUFBSTtBQUNsQixlQUFHLEVBQUUsa0JBQWtCO1dBQ3hCLENBQUMsQ0FBQztTQUNKO09BQ0Y7Ozs7QUFFRCxtQkFBZTthQUFBLDJCQUFHO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUN4QixlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7Ozs7QUFLRCx1QkFBbUI7Ozs7OzthQUFBLCtCQUFHO0FBQ3BCLGVBQVEsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxZQUFZLFFBQVEsQ0FBRTtPQUNuRTs7OztBQUtELHlCQUFxQjs7Ozs7O2FBQUEsaUNBQUc7QUFDdEIsZUFDRSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLFlBQVksUUFBUSxJQUMxRCxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLFlBQVksUUFBUSxDQUNoRTtPQUNIOzs7O0FBS0QsNkJBQXlCOzs7Ozs7YUFBQSxxQ0FBRztBQUMxQixlQUFRLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsWUFBWSxRQUFRLENBQUU7T0FDL0Q7Ozs7QUFFRCxnQkFBWTthQUFBLHNCQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQ3RFLFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFlBQUksYUFBVSxHQUFHLFdBQVcsQ0FBQzs7QUFFN0IsWUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7QUFFdEQsWUFBSSxhQUFhLEVBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7T0FDdEM7Ozs7QUFFRCxrQkFBYzthQUFBLHdCQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7QUFDNUUsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxhQUFVLEdBQUcsYUFBYSxDQUFDOztBQUUvQixZQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOztBQUV0RCxZQUFJLGlCQUFpQixFQUNuQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7T0FDOUM7Ozs7QUFFRCxzQkFBa0I7YUFBQSw0QkFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQzdELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFlBQUksYUFBVSxHQUFHLGtCQUFrQixDQUFDOztBQUVwQyxZQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO09BQ3ZEOzs7O0FBRUQsa0JBQWM7YUFBQSwwQkFBRztBQUNmLFlBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFdkIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQzFCLGVBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDOztBQUU5QixZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixZQUFJLGFBQVUsR0FBRyxJQUFJLENBQUM7T0FDdkI7Ozs7QUFNRCxXQUFPOzs7Ozs7O2FBQUEsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsZUFBTyxJQUFJLENBQUM7T0FDYjs7OztBQU1ELGNBQVU7Ozs7Ozs7YUFBQSxvQkFBQyxVQUFVLEVBQUU7QUFDckIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkMsZUFBTyxJQUFJLENBQUM7T0FDYjs7Ozs7O1NBN0pHLFVBQVU7OztBQWdLaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMiLCJmaWxlIjoic3JjL3V0aWxzL3ByaW9yaXR5LXF1ZXVlLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHdyaXR0ZW4gaW4gRUNNQXNjcmlwdCA2ICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgV0FWRSBhdWRpbyB0aW1lIGVuZ2luZSBiYXNlIGNsYXNzXG4gKiBAYXV0aG9yIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mciwgVmljdG9yLlNhaXpAaXJjYW0uZnIsIEthcmltLkJhcmthdGlAaXJjYW0uZnJcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkZWZhdWx0QXVkaW9Db250ZXh0ID0gcmVxdWlyZShcIi4vYXVkaW8tY29udGV4dFwiKTtcblxuLyoqXG4gKiBAY2xhc3MgVGltZUVuZ2luZVxuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciB0aW1lIGVuZ2luZXNcbiAqXG4gKiBUaW1lIGVuZ2luZXMgYXJlIGNvbXBvbmVudHMgdGhhdCBnZW5lcmF0ZSBtb3JlIG9yIGxlc3MgcmVndWxhciBhdWRpbyBldmVudHMgYW5kL29yIHBsYXliYWNrIGEgbWVkaWEgc3RyZWFtLlxuICogVGhleSBpbXBsZW1lbnQgb25lIG9yIG11bHRpcGxlIGludGVyZmFjZXMgdG8gYmUgc3luY2hyb25pemVkIGJ5IGEgbWFzdGVyIHN1Y2ggYXMgYSBzY2hlZHVsZXIsIGEgdHJhbnNwb3J0IG9yIGEgcGxheS1jb250cm9sLlxuICogVGhlIHByb3ZpZGVkIGludGVyZmFjZXMgYXJlIFwic2NoZWR1bGVkXCIsIFwidHJhbnNwb3J0ZWRcIiwgYW5kIFwicGxheS1jb250cm9sbGVkXCIuXG4gKlxuICogSW4gdGhlIFwic2NoZWR1bGVkXCIgaW50ZXJmYWNlIHRoZSBlbmdpbmUgaW1wbGVtZW50cyBhIG1ldGhvZCBcImFkdmFuY2VUaW1lXCIgdGhhdCBpcyBjYWxsZWQgYnkgdGhlIG1hc3RlciAodXN1YWxseSB0aGUgc2NoZWR1bGVyKVxuICogYW5kIHJldHVybnMgdGhlIGRlbGF5IHVudGlsIHRoZSBuZXh0IGNhbGwgb2YgXCJhZHZhbmNlVGltZVwiLiBUaGUgbWFzdGVyIHByb3ZpZGVzIHRoZSBlbmdpbmUgd2l0aCBhIGZ1bmN0aW9uIFwicmVzZXROZXh0VGltZVwiXG4gKiB0byByZXNjaGVkdWxlIHRoZSBuZXh0IGNhbGwgdG8gYW5vdGhlciB0aW1lLlxuICpcbiAqIEluIHRoZSBcInRyYW5zcG9ydGVkXCIgaW50ZXJmYWNlIHRoZSBtYXN0ZXIgKHVzdWFsbHkgYSB0cmFuc3BvcnQpIGZpcnN0IGNhbGxzIHRoZSBtZXRob2QgXCJzeW5jUG9zaXRpb25cIiB0aGF0IHJldHVybnMgdGhlIHBvc2l0aW9uXG4gKiBvZiB0aGUgZmlyc3QgZXZlbnQgZ2VuZXJhdGVkIGJ5IHRoZSBlbmdpbmUgcmVnYXJkaW5nIHRoZSBwbGF5aW5nIGRpcmVjdGlvbiAoc2lnbiBvZiB0aGUgc3BlZWQgYXJndW1lbnQpLiBFdmVudHMgYXJlIGdlbmVyYXRlZFxuICogdGhyb3VnaCB0aGUgbWV0aG9kIFwiYWR2YW5jZVBvc2l0aW9uXCIgdGhhdCByZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCBldmVudCBnZW5lcmF0ZWQgdGhyb3VnaCBcImFkdmFuY2VQb3NpdGlvblwiLlxuICpcbiAqIEluIHRoZSBcInNwZWVkLWNvbnRyb2xsZWRcIiBpbnRlcmZhY2UgdGhlIGVuZ2luZSBpcyBjb250cm9sbGVkIGJ5IHRoZSBtZXRob2QgXCJzeW5jU3BlZWRcIi5cbiAqXG4gKiBGb3IgYWxsIGludGVyZmFjZXMgdGhlIGVuZ2luZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBhdHRyaWJ1dGUgZ2V0dGVycyBcImN1cnJlbnRUaW1lXCIgYW5kIFwiY3VycmVudFBvc2l0aW9uXCIgKGZvciB0aGUgY2FzZSB0aGF0IHRoZSBtYXN0ZXJcbiAqIGRvZXMgbm90IGltcGxlbWVudCB0aGVzZSBhdHRyaWJ1dGUgZ2V0dGVycywgdGhlIGJhc2UgY2xhc3MgcHJvdmlkZXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbnMpLlxuICovXG5jbGFzcyBUaW1lRW5naW5lIHtcblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQgPSBkZWZhdWx0QXVkaW9Db250ZXh0KSB7XG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IG1hc3RlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5tYXN0ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW50ZXJmYWNlIGN1cnJlbnRseSB1c2VkXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmludGVyZmFjZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPdXRwdXQgYXVkaW8gbm9kZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vdXRwdXROb2RlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRpbWUgZW5naW5lJ3MgY3VycmVudCBtYXN0ZXIgdGltZVxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIG1hc3Rlci5cbiAgICovXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB0aW1lIGVuZ2luZSdzIGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBwcm92aWRlZCBieSB0aGUgbWFzdGVyLlxuICAgKi9cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiBwcm92aWRlZCBieSB0aGUgc2NoZWR1bGVyIHRvIHJlc2V0IHRoZSBlbmdpbmUncyBuZXh0IHRpbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgbmV3IGVuZ2luZSB0aW1lIChpbW1lZGlhdGVseSBpZiBub3Qgc3BlY2lmaWVkKVxuICAgKi9cbiAgcmVzZXROZXh0VGltZSh0aW1lID0gbnVsbCkge31cblxuICAvKipcbiAgICogRnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIHRyYW5zcG9ydCB0byByZXNldCB0aGUgbmV4dCBwb3NpdGlvbiBvciB0byByZXF1ZXN0IHJlc3luY2hyb25pemluZyB0aGUgZW5naW5lJ3MgcG9zaXRpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIG5ldyBlbmdpbmUgcG9zaXRpb24gKHdpbGwgY2FsbCBzeW5jUG9zaXRpb24gd2l0aCB0aGUgY3VycmVudCBwb3NpdGlvbiBpZiBub3Qgc3BlY2lmaWVkKVxuICAgKi9cbiAgcmVzZXROZXh0UG9zaXRpb24ocG9zaXRpb24gPSBudWxsKSB7fVxuXG4gIF9fc2V0R2V0dGVycyhnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgaWYgKGdldEN1cnJlbnRUaW1lKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2N1cnJlbnRUaW1lJywge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZ2V0Q3VycmVudFRpbWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY3VycmVudFBvc2l0aW9uJywge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZ2V0Q3VycmVudFBvc2l0aW9uXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfX2RlbGV0ZUdldHRlcnMoKSB7XG4gICAgZGVsZXRlIHRoaXMuY3VycmVudFRpbWU7XG4gICAgZGVsZXRlIHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHRpbWUgZW5naW5lIGltcGxlbWVudHMgdGhlIHNjaGVkdWxlZCBpbnRlcmZhY2VcbiAgICoqL1xuICBpbXBsZW1lbnRzU2NoZWR1bGVkKCkge1xuICAgIHJldHVybiAodGhpcy5hZHZhbmNlVGltZSAmJiB0aGlzLmFkdmFuY2VUaW1lIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHRpbWUgZW5naW5lIGltcGxlbWVudHMgdGhlIHRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgKiovXG4gIGltcGxlbWVudHNUcmFuc3BvcnRlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5zeW5jUG9zaXRpb24gJiYgdGhpcy5zeW5jUG9zaXRpb24gaW5zdGFuY2VvZiBGdW5jdGlvbiAmJlxuICAgICAgdGhpcy5hZHZhbmNlUG9zaXRpb24gJiYgdGhpcy5hZHZhbmNlUG9zaXRpb24gaW5zdGFuY2VvZiBGdW5jdGlvblxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgdGltZSBlbmdpbmUgaW1wbGVtZW50cyB0aGUgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAgICoqL1xuICBpbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKCkge1xuICAgIHJldHVybiAodGhpcy5zeW5jU3BlZWQgJiYgdGhpcy5zeW5jU3BlZWQgaW5zdGFuY2VvZiBGdW5jdGlvbik7XG4gIH1cblxuICBzZXRTY2hlZHVsZWQobWFzdGVyLCByZXNldE5leHRUaW1lLCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgdGhpcy5tYXN0ZXIgPSBtYXN0ZXI7XG4gICAgdGhpcy5pbnRlcmZhY2UgPSBcInNjaGVkdWxlZFwiO1xuXG4gICAgdGhpcy5fX3NldEdldHRlcnMoZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG5cbiAgICBpZiAocmVzZXROZXh0VGltZSlcbiAgICAgIHRoaXMucmVzZXROZXh0VGltZSA9IHJlc2V0TmV4dFRpbWU7XG4gIH1cblxuICBzZXRUcmFuc3BvcnRlZChtYXN0ZXIsIHJlc2V0TmV4dFBvc2l0aW9uLCBnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKSB7XG4gICAgdGhpcy5tYXN0ZXIgPSBtYXN0ZXI7XG4gICAgdGhpcy5pbnRlcmZhY2UgPSBcInRyYW5zcG9ydGVkXCI7XG5cbiAgICB0aGlzLl9fc2V0R2V0dGVycyhnZXRDdXJyZW50VGltZSwgZ2V0Q3VycmVudFBvc2l0aW9uKTtcblxuICAgIGlmIChyZXNldE5leHRQb3NpdGlvbilcbiAgICAgIHRoaXMucmVzZXROZXh0UG9zaXRpb24gPSByZXNldE5leHRQb3NpdGlvbjtcbiAgfVxuXG4gIHNldFNwZWVkQ29udHJvbGxlZChtYXN0ZXIsIGdldEN1cnJlbnRUaW1lLCBnZXRDdXJyZW50UG9zaXRpb24pIHtcbiAgICB0aGlzLm1hc3RlciA9IG1hc3RlcjtcbiAgICB0aGlzLmludGVyZmFjZSA9IFwic3BlZWQtY29udHJvbGxlZFwiO1xuXG4gICAgdGhpcy5fX3NldEdldHRlcnMoZ2V0Q3VycmVudFRpbWUsIGdldEN1cnJlbnRQb3NpdGlvbik7XG4gIH1cblxuICByZXNldEludGVyZmFjZSgpIHtcbiAgICB0aGlzLl9fZGVsZXRlR2V0dGVycygpO1xuXG4gICAgZGVsZXRlIHRoaXMucmVzZXROZXh0VGltZTtcbiAgICBkZWxldGUgdGhpcy5yZXNldE5leHRQb3NpdGlvbjtcblxuICAgIHRoaXMubWFzdGVyID0gbnVsbDtcbiAgICB0aGlzLmludGVyZmFjZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCBhdWRpbyBub2RlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgYXVkaW8gbm9kZVxuICAgKi9cbiAgY29ubmVjdCh0YXJnZXQpIHtcbiAgICB0aGlzLm91dHB1dE5vZGUuY29ubmVjdCh0YXJnZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgYXVkaW8gbm9kZVxuICAgKiBAcGFyYW0ge051bWJlcn0gY29ubmVjdGlvbiBjb25uZWN0aW9uIHRvIGJlIGRpc2Nvbm5lY3RlZFxuICAgKi9cbiAgZGlzY29ubmVjdChjb25uZWN0aW9uKSB7XG4gICAgdGhpcy5vdXRwdXROb2RlLmRpc2Nvbm5lY3QoY29ubmVjdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lRW5naW5lO1xuIl19