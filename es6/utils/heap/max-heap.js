var Heap = require('./heap');
/**
 * ES6 Implementation of a maximum binary heap based on :
 * http://interactivepython.org/courselib/static/pythonds/Trees/heap.html
 *
 * The head (or position 1 in the array) should be the object with maximal heap
 * value.
 *
 * @author: Renaud Vincent https://github.com/renaudfv
 **/
class MaxHeap extends Heap {

	constructor() {
		super();
		// Empty object with maximal value used for swaping on the first insertions
		this.heapList = [{
			'object': {},
			'heapValue': Infinity
		}];
	}

	/**
	 * Static method used to get the index of the minimal child at i. Used in
	 * percDown to compare a parent to its child.
	 *
	 * @params i, the index of the parent to observe
	 */
	__maxChildPosition(i) {
		if ((i * 2 + 1 > this.currentSize) ||
			(this.heapList[i * 2].heapValue >  this.heapList[i * 2 + 1].heapValue)) {
			return i * 2; // Left child
		} else {
			return i * 2 + 1; // Right child
		}
	}

	/**
	 * Method used to maintain the max heap property from a certain index. It is
	 * used locally from the end of the heap list upon insertion, update and
	 * removal. It percolates max values up the binary tree.
	 */
	__percUp(i) {
		var ceiledIndex, tmp;

		while (Math.floor(i / 2) > 0) {
			ceiledIndex = Math.floor(i / 2);
			// Is the item at i greater than the one at ceiled index
			if (this.heapList[i].heapValue >  this.heapList[ceiledIndex].heapValue) {
				tmp = this.heapList[ceiledIndex];
				this.heapList[ceiledIndex] = this.heapList[i];
				this.heapList[i] = tmp;
			}

			i = ceiledIndex;
		}
	}

	/**
	 * Method used to maintain the min heap property from a certain index. It is
	 * used locally from the start of the heap list upon deletion. Items are
	 * swaped down the tree if they have a smaller reference value.
	 */
	__percDown(i) {
		var refPos, tmp;

		while ((i * 2) <= this.currentSize) {
			refPos = this.__maxChildPosition(i);
			console.log(refPos);
			// Is the item at i smaller than the reference down the tree
			if (this.heapList[i].heapValue < this.heapList[refPos].heapValue) {
				tmp = this.heapList[i];
				this.heapList[i] = this.heapList[refPos];
				this.heapList[refPos] = tmp;
			}

			i = refPos;
		}
	}

	/**
	 * Find the object reference in the heap list and update its heapValue.
	 * If the updated value is smaller than the original value, the item should
	 * be percolated down the tree, otherwise up the tree.
	 */
	update(object, value) {
		var index = this.contains(object);

		if (index !== -1) {
			var ref = this.heapList[index].heapValue;
			this.heapList[index].heapValue = value;

			if (value < ref)
				this.__percDown(index);
			else
				this.__percUp(index);
		}
	}

	/**
	 * Finds the item object reference in the heap list brings it up the tree by
	 * having an infinity value. The tree is the sorted and the head is removed.
	 */
	remove(object) {
		var index = this.contains(object);

		if (index !== -1) {
			this.heapList[index].heapValue = Infinity;
			this.__percUp(index);
			this.deleteHead();
		}

		if (!this.isEmpty())
			return this.headValue();

		return Infinity;
	}

	/**
	 * Build heap from an object list and structure it with a maximal swap
	 * reference
	 */
	buildHeap(list) {
		this.currentSize = list.length;
		this.heapList = [{
			'object': {},
			'heapValue': Infinity
		}].concat(list);

		var i = list.length;
		while (i  >  0) {
			this.__percDown(i);
			i--;
		}
	}

	/**
	 * Clear the list with a maximal heapValue swap reference
	 */
	empty() {
		this.heapList = [{
			'object': {},
			'heapValue': Infinity
		}];
		this.currentSize = 0;
	}

}

module.exports = MaxHeap;