"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var MinHeap = require("./heap/min-heap");
var MaxHeap = require("./heap/max-heap");
/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio priority queue used by scheduler and transports
 * @author Norbert Schnell <Norbert.Schnell@ircam.fr>
 *
 * First rather stupid implementation to be optimized...
 */

var PriorityQueue = (function () {
	function PriorityQueue() {
		_classCallCheck(this, PriorityQueue);

		this.__heap = new MinHeap();
		this.__reverse = false;
	}

	_createClass(PriorityQueue, {
		insert: {

			/**
    * Insert an object to the queue
    * (for this primitive version: prevent sorting for each element by calling
    * with "false" as third argument)
    */

			value: function insert(object, time) {
				if (time !== Infinity && time != -Infinity) {
					// add new object
					this.__heap.insert(time, object);
					return this.__heap.headValue(); // return time of first object
				}

				return this.remove(object); //  **** Make sure its not another time you'd want
			}
		},
		move: {

			/**
    * Move an object to another time in the queue
    */

			value: function move(object, time) {
				if (time !== Infinity && time != -Infinity) {

					if (this.__heap.contains(object)) {
						this.__heap.update(object, time);
					} else {
						this.__heap.insert(time, object); // add new object
					}

					return this.__heap.headValue();
				}

				return this.remove(object);
			}
		},
		remove: {

			/**
    * Remove an object from the queue
    */

			value: function remove(object) {
				return this.__heap.remove(object);
			}
		},
		clear: {

			/**
    * Clear queue
    */

			value: function clear() {
				this.__heap.empty();
				return Infinity;
			}
		},
		head: {

			/**
    * Get first object in queue
    */

			get: function () {
				if (!this.__heap.isEmpty()) {
					return this.__heap.headObject();
				}

				return null;
			}
		},
		time: {

			/**
    * Get time of first object in queue
    */

			get: function () {
				if (!this.__heap.isEmpty()) return this.__heap.headValue();

				return Infinity;
			}
		},
		reverse: {
			get: function () {
				return this.__reverse;
			},

			/**
    * Setter for the reverse attribute. When reverse is true, the heap should be
    * max and when false, min. The new heap tree should contain the same items
    * as before but ordered in the right way.
    */
			set: function (value) {
				//Execute only if value is different
				if (value !== this.__reverse) {
					var heapList = this.__heap.list();
					heapList.shift(); // remove swap value (first elem in array)

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
		toString: {
			value: function toString() {
				var list = this.__heap.list();
				var string = "Size: " + this.__heap.size() + " ";
				for (var i = 0; i < list.length; i++) {
					var obj = list[i];
					string += obj.object.constructor.name + " at " + obj.heapValue + " ";
				}
				return string;
			}
		}
	});

	return PriorityQueue;
})();

module.exports = PriorityQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS1oZWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7SUFTbkMsYUFBYTtBQUVQLFVBRk4sYUFBYSxHQUVKO3dCQUZULGFBQWE7O0FBR2pCLE1BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUM1QixNQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztFQUN2Qjs7Y0FMSSxhQUFhO0FBWWxCLFFBQU07Ozs7Ozs7O1VBQUEsZ0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNwQixRQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFOztBQUUzQyxTQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakMsWUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQy9COztBQUVELFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQjs7QUFLRCxNQUFJOzs7Ozs7VUFBQSxjQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbEIsUUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFFM0MsU0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNqQyxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDakMsTUFBTTtBQUNOLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNqQzs7QUFFRCxZQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDL0I7O0FBRUQsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCOztBQUtELFFBQU07Ozs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRTtBQUNkLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEM7O0FBS0QsT0FBSzs7Ozs7O1VBQUEsaUJBQUc7QUFDUCxRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BCLFdBQU8sUUFBUSxDQUFDO0lBQ2hCOztBQUtHLE1BQUk7Ozs7OztRQUFBLFlBQUc7QUFDVixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUMzQixZQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDaEM7O0FBRUQsV0FBTyxJQUFJLENBQUM7SUFDWjs7QUFLRyxNQUFJOzs7Ozs7UUFBQSxZQUFHO0FBQ1YsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFaEMsV0FBTyxRQUFRLENBQUM7SUFDaEI7O0FBV0csU0FBTztRQVRBLFlBQUc7QUFDYixXQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdEI7Ozs7Ozs7UUFPVSxVQUFDLEtBQUssRUFBRTs7QUFFbEIsUUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUM3QixTQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xDLGFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFakIsU0FBSSxLQUFLLEVBQUU7QUFDVixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7TUFDNUIsTUFBTTtBQUNOLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztNQUM1Qjs7QUFFRCxTQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoQyxTQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUN2QjtJQUNEOztBQUVELFVBQVE7VUFBQSxvQkFBRztBQUNWLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsUUFBSSxNQUFNLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2pELFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFNBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixXQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztLQUNyRTtBQUNELFdBQU8sTUFBTSxDQUFDO0lBQ2Q7Ozs7UUE5R0ksYUFBYTs7O0FBaUhuQixNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJlczYvdXRpbHMvcHJpb3JpdHktcXVldWUtaGVhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNaW5IZWFwID0gcmVxdWlyZSgnLi9oZWFwL21pbi1oZWFwJyk7XG52YXIgTWF4SGVhcCA9IHJlcXVpcmUoJy4vaGVhcC9tYXgtaGVhcCcpO1xuLyogd3JpdHRlbiBpbiBFQ01Bc2NyaXB0IDYgKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIGF1ZGlvIHByaW9yaXR5IHF1ZXVlIHVzZWQgYnkgc2NoZWR1bGVyIGFuZCB0cmFuc3BvcnRzXG4gKiBAYXV0aG9yIE5vcmJlcnQgU2NobmVsbCA8Tm9yYmVydC5TY2huZWxsQGlyY2FtLmZyPlxuICpcbiAqIEZpcnN0IHJhdGhlciBzdHVwaWQgaW1wbGVtZW50YXRpb24gdG8gYmUgb3B0aW1pemVkLi4uXG4gKi9cblxuY2xhc3MgUHJpb3JpdHlRdWV1ZSB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fX2hlYXAgPSBuZXcgTWluSGVhcCgpO1xuXHRcdHRoaXMuX19yZXZlcnNlID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5zZXJ0IGFuIG9iamVjdCB0byB0aGUgcXVldWVcblx0ICogKGZvciB0aGlzIHByaW1pdGl2ZSB2ZXJzaW9uOiBwcmV2ZW50IHNvcnRpbmcgZm9yIGVhY2ggZWxlbWVudCBieSBjYWxsaW5nXG5cdCAqIHdpdGggXCJmYWxzZVwiIGFzIHRoaXJkIGFyZ3VtZW50KVxuXHQgKi9cblx0aW5zZXJ0KG9iamVjdCwgdGltZSkge1xuXHRcdGlmICh0aW1lICE9PSBJbmZpbml0eSAmJiB0aW1lICE9IC1JbmZpbml0eSkge1xuXHRcdFx0Ly8gYWRkIG5ldyBvYmplY3Rcblx0XHRcdHRoaXMuX19oZWFwLmluc2VydCh0aW1lLCBvYmplY3QpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpOyAvLyByZXR1cm4gdGltZSBvZiBmaXJzdCBvYmplY3Rcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5yZW1vdmUob2JqZWN0KTsgLy8gICoqKiogTWFrZSBzdXJlIGl0cyBub3QgYW5vdGhlciB0aW1lIHlvdSdkIHdhbnRcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3ZlIGFuIG9iamVjdCB0byBhbm90aGVyIHRpbWUgaW4gdGhlIHF1ZXVlXG5cdCAqL1xuXHRtb3ZlKG9iamVjdCwgdGltZSkge1xuXHRcdGlmICh0aW1lICE9PSBJbmZpbml0eSAmJiB0aW1lICE9IC1JbmZpbml0eSkge1xuXG5cdFx0XHRpZiAodGhpcy5fX2hlYXAuY29udGFpbnMob2JqZWN0KSkge1xuXHRcdFx0XHR0aGlzLl9faGVhcC51cGRhdGUob2JqZWN0LCB0aW1lKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX19oZWFwLmluc2VydCh0aW1lLCBvYmplY3QpOyAvLyBhZGQgbmV3IG9iamVjdFxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fX2hlYXAuaGVhZFZhbHVlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlKG9iamVjdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlIGFuIG9iamVjdCBmcm9tIHRoZSBxdWV1ZVxuXHQgKi9cblx0cmVtb3ZlKG9iamVjdCkge1xuXHRcdHJldHVybiB0aGlzLl9faGVhcC5yZW1vdmUob2JqZWN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhciBxdWV1ZVxuXHQgKi9cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5fX2hlYXAuZW1wdHkoKTtcblx0XHRyZXR1cm4gSW5maW5pdHk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGZpcnN0IG9iamVjdCBpbiBxdWV1ZVxuXHQgKi9cblx0Z2V0IGhlYWQoKSB7XG5cdFx0aWYgKCF0aGlzLl9faGVhcC5pc0VtcHR5KCkpIHtcblx0XHRcdHJldHVybiB0aGlzLl9faGVhcC5oZWFkT2JqZWN0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRpbWUgb2YgZmlyc3Qgb2JqZWN0IGluIHF1ZXVlXG5cdCAqL1xuXHRnZXQgdGltZSgpIHtcblx0XHRpZiAoIXRoaXMuX19oZWFwLmlzRW1wdHkoKSlcblx0XHRcdHJldHVybiB0aGlzLl9faGVhcC5oZWFkVmFsdWUoKTtcblxuXHRcdHJldHVybiBJbmZpbml0eTtcblx0fVxuXG5cdGdldCByZXZlcnNlKCkge1xuXHRcdHJldHVybiB0aGlzLl9fcmV2ZXJzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXR0ZXIgZm9yIHRoZSByZXZlcnNlIGF0dHJpYnV0ZS4gV2hlbiByZXZlcnNlIGlzIHRydWUsIHRoZSBoZWFwIHNob3VsZCBiZVxuXHQgKiBtYXggYW5kIHdoZW4gZmFsc2UsIG1pbi4gVGhlIG5ldyBoZWFwIHRyZWUgc2hvdWxkIGNvbnRhaW4gdGhlIHNhbWUgaXRlbXNcblx0ICogYXMgYmVmb3JlIGJ1dCBvcmRlcmVkIGluIHRoZSByaWdodCB3YXkuXG5cdCAqL1xuXHRzZXQgcmV2ZXJzZSh2YWx1ZSkge1xuXHRcdC8vRXhlY3V0ZSBvbmx5IGlmIHZhbHVlIGlzIGRpZmZlcmVudFxuXHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5fX3JldmVyc2UpIHtcblx0XHRcdHZhciBoZWFwTGlzdCA9IHRoaXMuX19oZWFwLmxpc3QoKTtcblx0XHRcdGhlYXBMaXN0LnNoaWZ0KCk7IC8vIHJlbW92ZSBzd2FwIHZhbHVlIChmaXJzdCBlbGVtIGluIGFycmF5KVxuXG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0dGhpcy5fX2hlYXAgPSBuZXcgTWF4SGVhcCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fX2hlYXAgPSBuZXcgTWluSGVhcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9faGVhcC5idWlsZEhlYXAoaGVhcExpc3QpO1xuXHRcdFx0dGhpcy5fX3JldmVyc2UgPSB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHR2YXIgbGlzdCA9IHRoaXMuX19oZWFwLmxpc3QoKTtcblx0XHR2YXIgc3RyaW5nID0gXCJTaXplOiBcIiArIHRoaXMuX19oZWFwLnNpemUoKSArIFwiIFwiO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIG9iaiA9IGxpc3RbaV07XG5cdFx0XHRzdHJpbmcgKz0gb2JqLm9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgYXQgXCIgKyBvYmouaGVhcFZhbHVlICsgXCIgXCI7XG5cdFx0fVxuXHRcdHJldHVybiBzdHJpbmc7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlOyJdfQ==