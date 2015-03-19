var MinHeap = require('./heap/min-heap');
var MaxHeap = require('./heap/max-heap');
/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio priority queue used by scheduler and transports
 * @author Norbert Schnell <Norbert.Schnell@ircam.fr>
 *
 * First rather stupid implementation to be optimized...
 */

class PriorityQueue {

	constructor() {
		this.__heap = new MinHeap();
		this.__reverse = false;
	}

	/**
	 * Insert an object to the queue
	 * (for this primitive version: prevent sorting for each element by calling
	 * with "false" as third argument)
	 */
	insert(object, time) {
		if (time !== Infinity && time != -Infinity) {
			// add new object
			this.__heap.insert(time, object);
			return this.__heap.headValue(); // return time of first object
		}

		return this.remove(object); //  **** Make sure its not another time you'd want
	}

	/**
	 * Move an object to another time in the queue
	 */
	move(object, time) {
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

	/**
	 * Remove an object from the queue
	 */
	remove(object) {
		return this.__heap.remove(object);
	}

	/**
	 * Clear queue
	 */
	clear() {
		this.__heap.empty();
		return Infinity;
	}

	/**
	 * Get first object in queue
	 */
	get head() {
		if (!this.__heap.isEmpty()) {
			return this.__heap.headObject();
		}

		return null;
	}

	/**
	 * Get time of first object in queue
	 */
	get time() {
		if (!this.__heap.isEmpty())
			return this.__heap.headValue();

		return Infinity;
	}

	get reverse() {
		return this.__reverse;
	}

	/**
	 * Setter for the reverse attribute. When reverse is true, the heap should be
	 * max and when false, min. The new heap tree should contain the same items
	 * as before but ordered in the right way.
	 */
	set reverse(value) {
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

	toString() {
		var list = this.__heap.list();
		var string = "Size: " + this.__heap.size() + " ";
		for (var i = 0; i < list.length; i++) {
			var obj = list[i];
			string += obj.object.constructor.name + " at " + obj.heapValue + " ";
		}
		return string;
	}
}

module.exports = PriorityQueue;