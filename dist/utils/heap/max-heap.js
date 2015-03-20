"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Heap = require("./heap");
/**
 * ES6 Implementation of a maximum binary heap based on :
 * http://interactivepython.org/courselib/static/pythonds/Trees/heap.html
 *
 * The head (or position 1 in the array) should be the object with maximal heap
 * value.
 *
 * @author: Renaud Vincent https://github.com/renaudfv
 **/

var MaxHeap = (function (_Heap) {
	function MaxHeap() {
		_classCallCheck(this, MaxHeap);

		_get(_core.Object.getPrototypeOf(MaxHeap.prototype), "constructor", this).call(this);
		// Empty object with maximal value used for swaping on the first insertions
		this.heapList = [{
			object: {},
			heapValue: Infinity
		}];
	}

	_inherits(MaxHeap, _Heap);

	_createClass(MaxHeap, {
		__maxChildPosition: {

			/**
    * Static method used to get the index of the minimal child at i. Used in
    * percDown to compare a parent to its child.
    *
    * @params i, the index of the parent to observe
    */

			value: function __maxChildPosition(i) {
				if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue > this.heapList[i * 2 + 1].heapValue) {
					return i * 2; // Left child
				} else {
					return i * 2 + 1; // Right child
				}
			}
		},
		__percUp: {

			/**
    * Method used to maintain the max heap property from a certain index. It is
    * used locally from the end of the heap list upon insertion, update and
    * removal. It percolates max values up the binary tree.
    */

			value: function __percUp(i) {
				var ceiledIndex, tmp;

				while (Math.floor(i / 2) > 0) {
					ceiledIndex = Math.floor(i / 2);
					// Is the item at i greater than the one at ceiled index
					if (this.heapList[i].heapValue > this.heapList[ceiledIndex].heapValue) {
						tmp = this.heapList[ceiledIndex];
						this.heapList[ceiledIndex] = this.heapList[i];
						this.heapList[i] = tmp;
					}

					i = ceiledIndex;
				}
			}
		},
		__percDown: {

			/**
    * Method used to maintain the min heap property from a certain index. It is
    * used locally from the start of the heap list upon deletion. Items are
    * swaped down the tree if they have a smaller reference value.
    */

			value: function __percDown(i) {
				var refPos, tmp;

				while (i * 2 <= this.currentSize) {
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
		},
		update: {

			/**
    * Find the object reference in the heap list and update its heapValue.
    * If the updated value is smaller than the original value, the item should
    * be percolated down the tree, otherwise up the tree.
    */

			value: function update(object, value) {
				var index = this.contains(object);

				if (index !== -1) {
					var ref = this.heapList[index].heapValue;
					this.heapList[index].heapValue = value;

					if (value < ref) this.__percDown(index);else this.__percUp(index);
				}
			}
		},
		remove: {

			/**
    * Finds the item object reference in the heap list brings it up the tree by
    * having an infinity value. The tree is the sorted and the head is removed.
    */

			value: function remove(object) {
				var index = this.contains(object);

				if (index !== -1) {
					this.heapList[index].heapValue = Infinity;
					this.__percUp(index);
					this.deleteHead();
				}

				if (!this.isEmpty()) {
					return this.headValue();
				}return Infinity;
			}
		},
		buildHeap: {

			/**
    * Build heap from an object list and structure it with a maximal swap
    * reference
    */

			value: function buildHeap(list) {
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
			}
		},
		empty: {

			/**
    * Clear the list with a maximal heapValue swap reference
    */

			value: function empty() {
				this.heapList = [{
					object: {},
					heapValue: Infinity
				}];
				this.currentSize = 0;
			}
		}
	});

	return MaxHeap;
})(Heap);

module.exports = MaxHeap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7Ozs7O0lBVXZCLE9BQU87QUFFRCxVQUZOLE9BQU8sR0FFRTt3QkFGVCxPQUFPOztBQUdYLG1DQUhJLE9BQU8sNkNBR0g7O0FBRVIsTUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLFdBQVUsRUFBRTtBQUNaLGNBQWEsUUFBUTtHQUNyQixDQUFDLENBQUM7RUFDSDs7V0FUSSxPQUFPOztjQUFQLE9BQU87QUFpQlosb0JBQWtCOzs7Ozs7Ozs7VUFBQSw0QkFBQyxDQUFDLEVBQUU7QUFDckIsUUFBSSxBQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxBQUFDLEVBQUU7QUFDeEUsWUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2IsTUFBTTtBQUNOLFlBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakI7SUFDRDs7QUFPRCxVQUFROzs7Ozs7OztVQUFBLGtCQUFDLENBQUMsRUFBRTtBQUNYLFFBQUksV0FBVyxFQUFFLEdBQUcsQ0FBQzs7QUFFckIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDN0IsZ0JBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJ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V0FBTyxDQUFDLEdBQUssQ0FBQyxFQUFFO0FBQ2YsU0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixNQUFDLEVBQUUsQ0FBQztLQUNKO0lBQ0Q7O0FBS0QsT0FBSzs7Ozs7O1VBQUEsaUJBQUc7QUFDUCxRQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsYUFBVSxFQUFFO0FBQ1osZ0JBQWEsUUFBUTtLQUNyQixDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNyQjs7OztRQXRJSSxPQUFPO0dBQVMsSUFBSTs7QUEwSTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIZWFwID0gcmVxdWlyZSgnLi9oZWFwJyk7XG4vKipcbiAqIEVTNiBJbXBsZW1lbnRhdGlvbiBvZiBhIG1heGltdW0gYmluYXJ5IGhlYXAgYmFzZWQgb24gOlxuICogaHR0cDovL2ludGVyYWN0aXZlcHl0aG9uLm9yZy9jb3Vyc2VsaWIvc3RhdGljL3B5dGhvbmRzL1RyZWVzL2hlYXAuaHRtbFxuICpcbiAqIFRoZSBoZWFkIChvciBwb3NpdGlvbiAxIGluIHRoZSBhcnJheSkgc2hvdWxkIGJlIHRoZSBvYmplY3Qgd2l0aCBtYXhpbWFsIGhlYXBcbiAqIHZhbHVlLlxuICpcbiAqIEBhdXRob3I6IFJlbmF1ZCBWaW5jZW50IGh0dHBzOi8vZ2l0aHViLmNvbS9yZW5hdWRmdlxuICoqL1xuY2xhc3MgTWF4SGVhcCBleHRlbmRzIEhlYXAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0Ly8gRW1wdHkgb2JqZWN0IHdpdGggbWF4aW1hbCB2YWx1ZSB1c2VkIGZvciBzd2FwaW5nIG9uIHRoZSBmaXJzdCBpbnNlcnRpb25zXG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHQnb2JqZWN0Jzoge30sXG5cdFx0XHQnaGVhcFZhbHVlJzogSW5maW5pdHlcblx0XHR9XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdGF0aWMgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbWluaW1hbCBjaGlsZCBhdCBpLiBVc2VkIGluXG5cdCAqIHBlcmNEb3duIHRvIGNvbXBhcmUgYSBwYXJlbnQgdG8gaXRzIGNoaWxkLlxuXHQgKlxuXHQgKiBAcGFyYW1zIGksIHRoZSBpbmRleCBvZiB0aGUgcGFyZW50IHRvIG9ic2VydmVcblx0ICovXG5cdF9fbWF4Q2hpbGRQb3NpdGlvbihpKSB7XG5cdFx0aWYgKChpICogMiArIDEgPiB0aGlzLmN1cnJlbnRTaXplKSB8fFxuXHRcdFx0KHRoaXMuaGVhcExpc3RbaSAqIDJdLmhlYXBWYWx1ZSA+IMKgdGhpcy5oZWFwTGlzdFtpICogMiArIDFdLmhlYXBWYWx1ZSkpIHtcblx0XHRcdHJldHVybiBpICogMjsgLy8gTGVmdCBjaGlsZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gaSAqIDIgKyAxOyAvLyBSaWdodCBjaGlsZFxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWF4IGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG5cdCAqIHVzZWQgbG9jYWxseSBmcm9tIHRoZSBlbmQgb2YgdGhlIGhlYXAgbGlzdCB1cG9uIGluc2VydGlvbiwgdXBkYXRlIGFuZFxuXHQgKiByZW1vdmFsLiBJdCBwZXJjb2xhdGVzIG1heCB2YWx1ZXMgdXAgdGhlIGJpbmFyeSB0cmVlLlxuXHQgKi9cblx0X19wZXJjVXAoaSkge1xuXHRcdHZhciBjZWlsZWRJbmRleCwgdG1wO1xuXG5cdFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHRcdFx0Y2VpbGVkSW5kZXggPSBNYXRoLmZsb29yKGkgLyAyKTtcblx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgZ3JlYXRlciB0aGFuIHRoZSBvbmUgYXQgY2VpbGVkIGluZGV4XG5cdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPiDCoHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XTtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF0gPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRpID0gY2VpbGVkSW5kZXg7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB1c2VkIHRvIG1haW50YWluIHRoZSBtaW4gaGVhcCBwcm9wZXJ0eSBmcm9tIGEgY2VydGFpbiBpbmRleC4gSXQgaXNcblx0ICogdXNlZCBsb2NhbGx5IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBkZWxldGlvbi4gSXRlbXMgYXJlXG5cdCAqIHN3YXBlZCBkb3duIHRoZSB0cmVlIGlmIHRoZXkgaGF2ZSBhIHNtYWxsZXIgcmVmZXJlbmNlIHZhbHVlLlxuXHQgKi9cblx0X19wZXJjRG93bihpKSB7XG5cdFx0dmFyIHJlZlBvcywgdG1wO1xuXG5cdFx0d2hpbGUgKChpICogMikgPD0gdGhpcy5jdXJyZW50U2l6ZSkge1xuXHRcdFx0cmVmUG9zID0gdGhpcy5fX21heENoaWxkUG9zaXRpb24oaSk7XG5cdFx0XHRjb25zb2xlLmxvZyhyZWZQb3MpO1xuXHRcdFx0Ly8gSXMgdGhlIGl0ZW0gYXQgaSBzbWFsbGVyIHRoYW4gdGhlIHJlZmVyZW5jZSBkb3duIHRoZSB0cmVlXG5cdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPCB0aGlzLmhlYXBMaXN0W3JlZlBvc10uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuaGVhcExpc3RbaV07XG5cdFx0XHRcdHRoaXMuaGVhcExpc3RbaV0gPSB0aGlzLmhlYXBMaXN0W3JlZlBvc107XG5cdFx0XHRcdHRoaXMuaGVhcExpc3RbcmVmUG9zXSA9IHRtcDtcblx0XHRcdH1cblxuXHRcdFx0aSA9IHJlZlBvcztcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRmluZCB0aGUgb2JqZWN0IHJlZmVyZW5jZSBpbiB0aGUgaGVhcCBsaXN0IGFuZCB1cGRhdGUgaXRzIGhlYXBWYWx1ZS5cblx0ICogSWYgdGhlIHVwZGF0ZWQgdmFsdWUgaXMgc21hbGxlciB0aGFuIHRoZSBvcmlnaW5hbCB2YWx1ZSwgdGhlIGl0ZW0gc2hvdWxkXG5cdCAqIGJlIHBlcmNvbGF0ZWQgZG93biB0aGUgdHJlZSwgb3RoZXJ3aXNlIHVwIHRoZSB0cmVlLlxuXHQgKi9cblx0dXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHR2YXIgaW5kZXggPSB0aGlzLmNvbnRhaW5zKG9iamVjdCk7XG5cblx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR2YXIgcmVmID0gdGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlO1xuXHRcdFx0dGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlID0gdmFsdWU7XG5cblx0XHRcdGlmICh2YWx1ZSA8IHJlZilcblx0XHRcdFx0dGhpcy5fX3BlcmNEb3duKGluZGV4KTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBpdGVtIG9iamVjdCByZWZlcmVuY2UgaW4gdGhlIGhlYXAgbGlzdCBicmluZ3MgaXQgdXAgdGhlIHRyZWUgYnlcblx0ICogaGF2aW5nIGFuIGluZmluaXR5IHZhbHVlLiBUaGUgdHJlZSBpcyB0aGUgc29ydGVkIGFuZCB0aGUgaGVhZCBpcyByZW1vdmVkLlxuXHQgKi9cblx0cmVtb3ZlKG9iamVjdCkge1xuXHRcdHZhciBpbmRleCA9IHRoaXMuY29udGFpbnMob2JqZWN0KTtcblxuXHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuaGVhcExpc3RbaW5kZXhdLmhlYXBWYWx1ZSA9IEluZmluaXR5O1xuXHRcdFx0dGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0XHR0aGlzLmRlbGV0ZUhlYWQoKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNFbXB0eSgpKVxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhZFZhbHVlKCk7XG5cblx0XHRyZXR1cm4gSW5maW5pdHk7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1heGltYWwgc3dhcFxuXHQgKiByZWZlcmVuY2Vcblx0ICovXG5cdGJ1aWxkSGVhcChsaXN0KSB7XG5cdFx0dGhpcy5jdXJyZW50U2l6ZSA9IGxpc3QubGVuZ3RoO1xuXHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0J29iamVjdCc6IHt9LFxuXHRcdFx0J2hlYXBWYWx1ZSc6IEluZmluaXR5XG5cdFx0fV0uY29uY2F0KGxpc3QpO1xuXG5cdFx0dmFyIGkgPSBsaXN0Lmxlbmd0aDtcblx0XHR3aGlsZSAoacKgID4gwqAwKSB7XG5cdFx0XHR0aGlzLl9fcGVyY0Rvd24oaSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFyIHRoZSBsaXN0IHdpdGggYSBtYXhpbWFsIGhlYXBWYWx1ZSBzd2FwIHJlZmVyZW5jZVxuXHQgKi9cblx0ZW1wdHkoKSB7XG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHQnb2JqZWN0Jzoge30sXG5cdFx0XHQnaGVhcFZhbHVlJzogSW5maW5pdHlcblx0XHR9XTtcblx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF4SGVhcDsiXX0=