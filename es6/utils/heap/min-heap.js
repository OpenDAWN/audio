var Heap = require('./heap');
/**
 * ES6 Implementation of a minimum binary heap based on :
 * http://interactivepython.org/courselib/static/pythonds/Trees/heap.html
 *
 * The head (or position 1 in the array) should be the object with minimal heap
 * value.
 *
 * @author: Renaud Vincent https://github.com/renaudfv
 **/
class MinHeap extends Heap {

	constructor() {
		super();
		// Empty object with minimal value used for swaping on the first insertions
		this.heapList = [{
			'object': {},
			'heapValue': 0
		}];
	}

	/**
	 * Static method used to get the index of the minimal child at i. Used in
	 * percDown to compare a parent to its child.
	 *
	 * @params i, the index of the parent to observe
	 */
	__minChildPosition(i) {
		if ((i * 2 + 1 > this.currentSize) ||
			(this.heapList[i * 2].heapValue <  this.heapList[i * 2 + 1].heapValue)) {
			return i * 2; // Left child
		} else {
			return i * 2 + 1; // Right child
		}
	}

	/**
	 * Percolates the item at i index up the tree if it is smaller
	 */
	__percUp(i) {
		var parentIndex, tmp;

		while (Math.floor(i / 2) > 0) {
			parentIndex = Math.floor(i / 2);
			// Is the item at i smaller than the one at ceiled index
			if (this.heapList[i].heapValue <  this.heapList[parentIndex].heapValue) {
				tmp = this.heapList[parentIndex];
				this.heapList[parentIndex] = this.heapList[i];
				this.heapList[i] = tmp;
			}

			i = parentIndex;
		}
	}

	/**
	 * Percolates the item at i index down the tree if smaller than its child
	 */
	__percDown(i) {
		var childIndex, tmp;

		while ((i * 2) <= this.currentSize) {
			childIndex = this.__minChildPosition(i);
			// Is the item at i greater than the reference down the tree
			if (this.heapList[i].heapValue > this.heapList[childIndex].heapValue) {
				tmp = this.heapList[i];
				this.heapList[i] = this.heapList[childIndex];
				this.heapList[childIndex] = tmp;
			}

			i = childIndex;
		}
	}

	/**
	 * Find the object reference in the heap list and update its heapValue.
	 * If the updated value is greater than the original value, the item should
	 * be percolated down the tree, otherwise up the tree.
	 */
	update(object, value) {
		var index = this.contains(object);

		if (index !== -1) {
			var ref = this.heapList[index].heapValue;
			this.heapList[index].heapValue = value;

			if (value > ref)
				this.__percDown(index);
			else
				this.__percUp(index);
		}
	}

	/**
	 * Finds the item object reference in the heap list brings it up the tree by
	 * having a 0 value. The tree is the sorted and the head is removed.
	 */
	remove(object) {
		var index = this.contains(object);

		if (index !== -1) {
			this.heapList[index].heapValue = 0;
			this.__percUp(index);
			this.deleteHead();
		}

		if (!this.isEmpty())
			return this.headValue();

		return Infinity;
	}

	/**
	 * Build heap from an object list and structure it with a minimal swap
	 * reference
	 */
	buildHeap(list) {

		this.currentSize = list.length;
		this.heapList = [{
			'object': {},
			'heapValue': 0
		}].concat(list);

		var i = list.length;
		while (i  >  0) {
			this.__percDown(i);
			i--;
		}
	}

	/**
	 * Clear the list with a minimal heapValue swap reference
	 */
	empty() {
		this.heapList = [{
			'object': {},
			'heapValue': 0
		}];
		this.currentSize = 0;
	}

}

module.exports = MinHeap;