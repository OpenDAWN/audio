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
				if (time !== Infinity && time !== -Infinity) {
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
				if (time !== Infinity && time !== -Infinity) {

					if (this.__heap.contains(object) !== -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7Ozs7Ozs7O0lBU25DLGFBQWE7QUFFUCxVQUZOLGFBQWEsR0FFSjt3QkFGVCxhQUFhOztBQUdqQixNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDNUIsTUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDdkI7O2NBTEksYUFBYTtBQVlsQixRQUFNOzs7Ozs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDcEIsUUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTs7QUFFNUMsU0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFlBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMvQjs7QUFFRCxXQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0I7O0FBS0QsTUFBSTs7Ozs7O1VBQUEsY0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ2xCLFFBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7O0FBRTVDLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDeEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ2pDLE1BQU07QUFDTixVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDakM7O0FBRUQsWUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQy9COztBQUVELFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQjs7QUFLRCxRQUFNOzs7Ozs7VUFBQSxnQkFBQyxNQUFNLEVBQUU7QUFDZCxXQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDOztBQUtELE9BQUs7Ozs7OztVQUFBLGlCQUFHO0FBQ1AsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwQixXQUFPLFFBQVEsQ0FBQztJQUNoQjs7QUFLRyxNQUFJOzs7Ozs7UUFBQSxZQUFHO0FBQ1YsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDM0IsWUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ2hDOztBQUVELFdBQU8sSUFBSSxDQUFDO0lBQ1o7O0FBS0csTUFBSTs7Ozs7O1FBQUEsWUFBRztBQUNWLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWhDLFdBQU8sUUFBUSxDQUFDO0lBQ2hCOztBQVdHLFNBQU87UUFUQSxZQUFHO0FBQ2IsV0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3RCOzs7Ozs7O1FBT1UsVUFBQyxLQUFLLEVBQUU7O0FBRWxCLFFBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDN0IsU0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQyxhQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWpCLFNBQUksS0FBSyxFQUFFO0FBQ1YsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO01BQzVCLE1BQU07QUFDTixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7TUFDNUI7O0FBRUQsU0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEMsU0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDdkI7SUFDRDs7QUFFRCxVQUFRO1VBQUEsb0JBQUc7QUFDVixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLFFBQUksTUFBTSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNqRCxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxTQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsV0FBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7S0FDckU7QUFDRCxXQUFPLE1BQU0sQ0FBQztJQUNkOzs7O1FBOUdJLGFBQWE7OztBQWlIbkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoiZXM2L3V0aWxzL3ByaW9yaXR5LXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1pbkhlYXAgPSByZXF1aXJlKCcuL2hlYXAvbWluLWhlYXAnKTtcbnZhciBNYXhIZWFwID0gcmVxdWlyZSgnLi9oZWFwL21heC1oZWFwJyk7XG4vKiB3cml0dGVuIGluIEVDTUFzY3JpcHQgNiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgYXVkaW8gcHJpb3JpdHkgcXVldWUgdXNlZCBieSBzY2hlZHVsZXIgYW5kIHRyYW5zcG9ydHNcbiAqIEBhdXRob3IgTm9yYmVydCBTY2huZWxsIDxOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnI+XG4gKlxuICogRmlyc3QgcmF0aGVyIHN0dXBpZCBpbXBsZW1lbnRhdGlvbiB0byBiZSBvcHRpbWl6ZWQuLi5cbiAqL1xuXG5jbGFzcyBQcmlvcml0eVF1ZXVlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9faGVhcCA9IG5ldyBNaW5IZWFwKCk7XG5cdFx0dGhpcy5fX3JldmVyc2UgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbnNlcnQgYW4gb2JqZWN0IHRvIHRoZSBxdWV1ZVxuXHQgKiAoZm9yIHRoaXMgcHJpbWl0aXZlIHZlcnNpb246IHByZXZlbnQgc29ydGluZyBmb3IgZWFjaCBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogd2l0aCBcImZhbHNlXCIgYXMgdGhpcmQgYXJndW1lbnQpXG5cdCAqL1xuXHRpbnNlcnQob2JqZWN0LCB0aW1lKSB7XG5cdFx0aWYgKHRpbWUgIT09IEluZmluaXR5ICYmIHRpbWUgIT09IC1JbmZpbml0eSkge1xuXHRcdFx0Ly8gYWRkIG5ldyBvYmplY3Rcblx0XHRcdHRoaXMuX19oZWFwLmluc2VydCh0aW1lLCBvYmplY3QpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpOyAvLyByZXR1cm4gdGltZSBvZiBmaXJzdCBvYmplY3Rcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5yZW1vdmUob2JqZWN0KTsgLy8gICoqKiogTWFrZSBzdXJlIGl0cyBub3QgYW5vdGhlciB0aW1lIHlvdSdkIHdhbnRcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3ZlIGFuIG9iamVjdCB0byBhbm90aGVyIHRpbWUgaW4gdGhlIHF1ZXVlXG5cdCAqL1xuXHRtb3ZlKG9iamVjdCwgdGltZSkge1xuXHRcdGlmICh0aW1lICE9PSBJbmZpbml0eSAmJiB0aW1lICE9PSAtSW5maW5pdHkpIHtcblxuXHRcdFx0aWYgKHRoaXMuX19oZWFwLmNvbnRhaW5zKG9iamVjdCkgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX19oZWFwLnVwZGF0ZShvYmplY3QsIHRpbWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fX2hlYXAuaW5zZXJ0KHRpbWUsIG9iamVjdCk7IC8vIGFkZCBuZXcgb2JqZWN0XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9faGVhcC5oZWFkVmFsdWUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5yZW1vdmUob2JqZWN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgYW4gb2JqZWN0IGZyb20gdGhlIHF1ZXVlXG5cdCAqL1xuXHRyZW1vdmUob2JqZWN0KSB7XG5cdFx0cmV0dXJuIHRoaXMuX19oZWFwLnJlbW92ZShvYmplY3QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFyIHF1ZXVlXG5cdCAqL1xuXHRjbGVhcigpIHtcblx0XHR0aGlzLl9faGVhcC5lbXB0eSgpO1xuXHRcdHJldHVybiBJbmZpbml0eTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgZmlyc3Qgb2JqZWN0IGluIHF1ZXVlXG5cdCAqL1xuXHRnZXQgaGVhZCgpIHtcblx0XHRpZiAoIXRoaXMuX19oZWFwLmlzRW1wdHkoKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRPYmplY3QoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGltZSBvZiBmaXJzdCBvYmplY3QgaW4gcXVldWVcblx0ICovXG5cdGdldCB0aW1lKCkge1xuXHRcdGlmICghdGhpcy5fX2hlYXAuaXNFbXB0eSgpKVxuXHRcdFx0cmV0dXJuIHRoaXMuX19oZWFwLmhlYWRWYWx1ZSgpO1xuXG5cdFx0cmV0dXJuIEluZmluaXR5O1xuXHR9XG5cblx0Z2V0IHJldmVyc2UoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19yZXZlcnNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHRlciBmb3IgdGhlIHJldmVyc2UgYXR0cmlidXRlLiBXaGVuIHJldmVyc2UgaXMgdHJ1ZSwgdGhlIGhlYXAgc2hvdWxkIGJlXG5cdCAqIG1heCBhbmQgd2hlbiBmYWxzZSwgbWluLiBUaGUgbmV3IGhlYXAgdHJlZSBzaG91bGQgY29udGFpbiB0aGUgc2FtZSBpdGVtc1xuXHQgKiBhcyBiZWZvcmUgYnV0IG9yZGVyZWQgaW4gdGhlIHJpZ2h0IHdheS5cblx0ICovXG5cdHNldCByZXZlcnNlKHZhbHVlKSB7XG5cdFx0Ly9FeGVjdXRlIG9ubHkgaWYgdmFsdWUgaXMgZGlmZmVyZW50XG5cdFx0aWYgKHZhbHVlICE9PSB0aGlzLl9fcmV2ZXJzZSkge1xuXHRcdFx0dmFyIGhlYXBMaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdFx0aGVhcExpc3Quc2hpZnQoKTsgLy8gcmVtb3ZlIHN3YXAgdmFsdWUgKGZpcnN0IGVsZW0gaW4gYXJyYXkpXG5cblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLl9faGVhcCA9IG5ldyBNYXhIZWFwKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9faGVhcCA9IG5ldyBNaW5IZWFwKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX19oZWFwLmJ1aWxkSGVhcChoZWFwTGlzdCk7XG5cdFx0XHR0aGlzLl9fcmV2ZXJzZSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHZhciBsaXN0ID0gdGhpcy5fX2hlYXAubGlzdCgpO1xuXHRcdHZhciBzdHJpbmcgPSBcIlNpemU6IFwiICsgdGhpcy5fX2hlYXAuc2l6ZSgpICsgXCIgXCI7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgb2JqID0gbGlzdFtpXTtcblx0XHRcdHN0cmluZyArPSBvYmoub2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBhdCBcIiArIG9iai5oZWFwVmFsdWUgKyBcIiBcIjtcblx0XHR9XG5cdFx0cmV0dXJuIHN0cmluZztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByaW9yaXR5UXVldWU7Il19