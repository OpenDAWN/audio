"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Heap = require("./heap");
/**
 * ES6 Implementation of a minimum binary heap based on :
 * http://interactivepython.org/courselib/static/pythonds/Trees/heap.html
 *
 * The head (or position 1 in the array) should be the object with minimal heap
 * value.
 *
 * @author: Renaud Vincent https://github.com/renaudfv
 **/

var MinHeap = (function (_Heap) {
	function MinHeap() {
		_classCallCheck(this, MinHeap);

		_get(_core.Object.getPrototypeOf(MinHeap.prototype), "constructor", this).call(this);
		// Empty object with minimal value used for swaping on the first insertions
		this.heapList = [{
			object: {},
			heapValue: 0
		}];
	}

	_inherits(MinHeap, _Heap);

	_createClass(MinHeap, {
		__minChildPosition: {

			/**
    * Static method used to get the index of the minimal child at i. Used in
    * percDown to compare a parent to its child.
    *
    * @params i, the index of the parent to observe
    */

			value: function __minChildPosition(i) {
				if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue < this.heapList[i * 2 + 1].heapValue) {
					return i * 2; // Left child
				} else {
					return i * 2 + 1; // Right child
				}
			}
		},
		__percUp: {

			/**
    * Percolates the item at i index up the tree if it is smaller
    */

			value: function __percUp(i) {
				var parentIndex, tmp;

				while (Math.floor(i / 2) > 0) {
					parentIndex = Math.floor(i / 2);
					// Is the item at i smaller than the one at ceiled index
					if (this.heapList[i].heapValue < this.heapList[parentIndex].heapValue) {
						tmp = this.heapList[parentIndex];
						this.heapList[parentIndex] = this.heapList[i];
						this.heapList[i] = tmp;
					}

					i = parentIndex;
				}
			}
		},
		__percDown: {

			/**
    * Percolates the item at i index down the tree if smaller than its child
    */

			value: function __percDown(i) {
				var childIndex, tmp;

				while (i * 2 <= this.currentSize) {
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
		},
		update: {

			/**
    * Find the object reference in the heap list and update its heapValue.
    * If the updated value is greater than the original value, the item should
    * be percolated down the tree, otherwise up the tree.
    */

			value: function update(object, value) {
				var index = this.contains(object);

				if (index !== -1) {
					var ref = this.heapList[index].heapValue;
					this.heapList[index].heapValue = value;

					if (value > ref) this.__percDown(index);else this.__percUp(index);
				}
			}
		},
		remove: {

			/**
    * Finds the item object reference in the heap list brings it up the tree by
    * having a 0 value. The tree is the sorted and the head is removed.
    */

			value: function remove(object) {
				var index = this.contains(object);

				if (index !== -1) {
					this.heapList[index].heapValue = 0;
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
    * Build heap from an object list and structure it with a minimal swap
    * reference
    */

			value: function buildHeap(list) {

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
			}
		},
		empty: {

			/**
    * Clear the list with a minimal heapValue swap reference
    */

			value: function empty() {
				this.heapList = [{
					object: {},
					heapValue: 0
				}];
				this.currentSize = 0;
			}
		}
	});

	return MinHeap;
})(Heap);

module.exports = MinHeap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7Ozs7O0lBVXZCLE9BQU87QUFFRCxVQUZOLE9BQU8sR0FFRTt3QkFGVCxPQUFPOztBQUdYLG1DQUhJLE9BQU8sNkNBR0g7O0FBRVIsTUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLFdBQVUsRUFBRTtBQUNaLGNBQWEsQ0FBQztHQUNkLENBQUMsQ0FBQztFQUNIOztXQVRJLE9BQU87O2NBQVAsT0FBTztBQWlCWixvQkFBa0I7Ozs7Ozs7OztVQUFBLDRCQUFDLENBQUMsRUFBRTtBQUNyQixRQUFJLEFBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEFBQUMsRUFBRTtBQUN4RSxZQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDYixNQUFNO0FBQ04sWUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtJQUNEOztBQUtELFVBQVE7Ozs7OztVQUFBLGtCQUFDLENBQUMsRUFBRTtBQUNYLFFBQUksV0FBVyxFQUFFLEdBQUcsQ0FBQzs7QUFFckIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDN0IsZ0JBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUN2RSxTQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDdkI7O0FBRUQsTUFBQyxHQUFHLFdBQVcsQ0FBQztLQUNoQjtJQUNEOztBQUtELFlBQVU7Ozs7OztVQUFBLG9CQUFDLENBQUMsRUFBRTtBQUNiLFFBQUksVUFBVSxFQUFFLEdBQUcsQ0FBQzs7QUFFcEIsV0FBTyxBQUFDLENBQUMsR0FBRyxDQUFDLElBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNuQyxlQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4QyxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ3JFLFNBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUNoQzs7QUFFRCxNQUFDLEdBQUcsVUFBVSxDQUFDO0tBQ2Y7SUFDRDs7QUFPRCxRQUFNOzs7Ozs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDckIsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEMsUUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDakIsU0FBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDekMsU0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QyxTQUFJLEtBQUssR0FBRyxHQUFHLEVBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUV2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RCO0lBQ0Q7O0FBTUQsUUFBTTs7Ozs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRTtBQUNkLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxDLFFBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLFNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuQyxTQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLFNBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNsQjs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNsQixZQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUFBLEFBRXpCLE9BQU8sUUFBUSxDQUFDO0lBQ2hCOztBQU1ELFdBQVM7Ozs7Ozs7VUFBQSxtQkFBQyxJQUFJLEVBQUU7O0FBRWYsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQztBQUNoQixhQUFVLEVBQUU7QUFDWixnQkFBYSxDQUFDO0tBQ2QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNwQixXQUFPLENBQUMsR0FBSyxDQUFDLEVBQUU7QUFDZixTQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLE1BQUMsRUFBRSxDQUFDO0tBQ0o7SUFDRDs7QUFLRCxPQUFLOzs7Ozs7VUFBQSxpQkFBRztBQUNQLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQztBQUNoQixhQUFVLEVBQUU7QUFDWixnQkFBYSxDQUFDO0tBQ2QsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDckI7Ozs7UUFsSUksT0FBTztHQUFTLElBQUk7O0FBc0kxQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvdXRpbHMvcHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSGVhcCA9IHJlcXVpcmUoJy4vaGVhcCcpO1xuLyoqXG4gKiBFUzYgSW1wbGVtZW50YXRpb24gb2YgYSBtaW5pbXVtIGJpbmFyeSBoZWFwIGJhc2VkIG9uIDpcbiAqIGh0dHA6Ly9pbnRlcmFjdGl2ZXB5dGhvbi5vcmcvY291cnNlbGliL3N0YXRpYy9weXRob25kcy9UcmVlcy9oZWFwLmh0bWxcbiAqXG4gKiBUaGUgaGVhZCAob3IgcG9zaXRpb24gMSBpbiB0aGUgYXJyYXkpIHNob3VsZCBiZSB0aGUgb2JqZWN0IHdpdGggbWluaW1hbCBoZWFwXG4gKiB2YWx1ZS5cbiAqXG4gKiBAYXV0aG9yOiBSZW5hdWQgVmluY2VudCBodHRwczovL2dpdGh1Yi5jb20vcmVuYXVkZnZcbiAqKi9cbmNsYXNzIE1pbkhlYXAgZXh0ZW5kcyBIZWFwIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdC8vIEVtcHR5IG9iamVjdCB3aXRoIG1pbmltYWwgdmFsdWUgdXNlZCBmb3Igc3dhcGluZyBvbiB0aGUgZmlyc3QgaW5zZXJ0aW9uc1xuXHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0J29iamVjdCc6IHt9LFxuXHRcdFx0J2hlYXBWYWx1ZSc6IDBcblx0XHR9XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdGF0aWMgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbWluaW1hbCBjaGlsZCBhdCBpLiBVc2VkIGluXG5cdCAqIHBlcmNEb3duIHRvIGNvbXBhcmUgYSBwYXJlbnQgdG8gaXRzIGNoaWxkLlxuXHQgKlxuXHQgKiBAcGFyYW1zIGksIHRoZSBpbmRleCBvZiB0aGUgcGFyZW50IHRvIG9ic2VydmVcblx0ICovXG5cdF9fbWluQ2hpbGRQb3NpdGlvbihpKSB7XG5cdFx0aWYgKChpICogMiArIDEgPiB0aGlzLmN1cnJlbnRTaXplKSB8fFxuXHRcdFx0KHRoaXMuaGVhcExpc3RbaSAqIDJdLmhlYXBWYWx1ZSA8IMKgdGhpcy5oZWFwTGlzdFtpICogMiArIDFdLmhlYXBWYWx1ZSkpIHtcblx0XHRcdHJldHVybiBpICogMjsgLy8gTGVmdCBjaGlsZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gaSAqIDIgKyAxOyAvLyBSaWdodCBjaGlsZFxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQZXJjb2xhdGVzIHRoZSBpdGVtIGF0IGkgaW5kZXggdXAgdGhlIHRyZWUgaWYgaXQgaXMgc21hbGxlclxuXHQgKi9cblx0X19wZXJjVXAoaSkge1xuXHRcdHZhciBwYXJlbnRJbmRleCwgdG1wO1xuXG5cdFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHRcdFx0cGFyZW50SW5kZXggPSBNYXRoLmZsb29yKGkgLyAyKTtcblx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgc21hbGxlciB0aGFuIHRoZSBvbmUgYXQgY2VpbGVkIGluZGV4XG5cdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPCDCoHRoaXMuaGVhcExpc3RbcGFyZW50SW5kZXhdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W3BhcmVudEluZGV4XTtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFtwYXJlbnRJbmRleF0gPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRpID0gcGFyZW50SW5kZXg7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFBlcmNvbGF0ZXMgdGhlIGl0ZW0gYXQgaSBpbmRleCBkb3duIHRoZSB0cmVlIGlmIHNtYWxsZXIgdGhhbiBpdHMgY2hpbGRcblx0ICovXG5cdF9fcGVyY0Rvd24oaSkge1xuXHRcdHZhciBjaGlsZEluZGV4LCB0bXA7XG5cblx0XHR3aGlsZSAoKGkgKiAyKSA8PSB0aGlzLmN1cnJlbnRTaXplKSB7XG5cdFx0XHRjaGlsZEluZGV4ID0gdGhpcy5fX21pbkNoaWxkUG9zaXRpb24oaSk7XG5cdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIGdyZWF0ZXIgdGhhbiB0aGUgcmVmZXJlbmNlIGRvd24gdGhlIHRyZWVcblx0XHRcdGlmICh0aGlzLmhlYXBMaXN0W2ldLmhlYXBWYWx1ZSA+IHRoaXMuaGVhcExpc3RbY2hpbGRJbmRleF0uaGVhcFZhbHVlKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuaGVhcExpc3RbaV07XG5cdFx0XHRcdHRoaXMuaGVhcExpc3RbaV0gPSB0aGlzLmhlYXBMaXN0W2NoaWxkSW5kZXhdO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2NoaWxkSW5kZXhdID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRpID0gY2hpbGRJbmRleDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRmluZCB0aGUgb2JqZWN0IHJlZmVyZW5jZSBpbiB0aGUgaGVhcCBsaXN0IGFuZCB1cGRhdGUgaXRzIGhlYXBWYWx1ZS5cblx0ICogSWYgdGhlIHVwZGF0ZWQgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBvcmlnaW5hbCB2YWx1ZSwgdGhlIGl0ZW0gc2hvdWxkXG5cdCAqIGJlIHBlcmNvbGF0ZWQgZG93biB0aGUgdHJlZSwgb3RoZXJ3aXNlIHVwIHRoZSB0cmVlLlxuXHQgKi9cblx0dXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHR2YXIgaW5kZXggPSB0aGlzLmNvbnRhaW5zKG9iamVjdCk7XG5cblx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR2YXIgcmVmID0gdGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlO1xuXHRcdFx0dGhpcy5oZWFwTGlzdFtpbmRleF0uaGVhcFZhbHVlID0gdmFsdWU7XG5cblx0XHRcdGlmICh2YWx1ZSA+IHJlZilcblx0XHRcdFx0dGhpcy5fX3BlcmNEb3duKGluZGV4KTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBpdGVtIG9iamVjdCByZWZlcmVuY2UgaW4gdGhlIGhlYXAgbGlzdCBicmluZ3MgaXQgdXAgdGhlIHRyZWUgYnlcblx0ICogaGF2aW5nIGEgMCB2YWx1ZS4gVGhlIHRyZWUgaXMgdGhlIHNvcnRlZCBhbmQgdGhlIGhlYWQgaXMgcmVtb3ZlZC5cblx0ICovXG5cdHJlbW92ZShvYmplY3QpIHtcblx0XHR2YXIgaW5kZXggPSB0aGlzLmNvbnRhaW5zKG9iamVjdCk7XG5cblx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLmhlYXBMaXN0W2luZGV4XS5oZWFwVmFsdWUgPSAwO1xuXHRcdFx0dGhpcy5fX3BlcmNVcChpbmRleCk7XG5cdFx0XHR0aGlzLmRlbGV0ZUhlYWQoKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNFbXB0eSgpKVxuXHRcdFx0cmV0dXJuIHRoaXMuaGVhZFZhbHVlKCk7XG5cblx0XHRyZXR1cm4gSW5maW5pdHk7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1pbmltYWwgc3dhcFxuXHQgKiByZWZlcmVuY2Vcblx0ICovXG5cdGJ1aWxkSGVhcChsaXN0KSB7XG5cblx0XHR0aGlzLmN1cnJlbnRTaXplID0gbGlzdC5sZW5ndGg7XG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHQnb2JqZWN0Jzoge30sXG5cdFx0XHQnaGVhcFZhbHVlJzogMFxuXHRcdH1dLmNvbmNhdChsaXN0KTtcblxuXHRcdHZhciBpID0gbGlzdC5sZW5ndGg7XG5cdFx0d2hpbGUgKGnCoCA+IMKgMCkge1xuXHRcdFx0dGhpcy5fX3BlcmNEb3duKGkpO1xuXHRcdFx0aS0tO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhciB0aGUgbGlzdCB3aXRoIGEgbWluaW1hbCBoZWFwVmFsdWUgc3dhcCByZWZlcmVuY2Vcblx0ICovXG5cdGVtcHR5KCkge1xuXHRcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHRcdFx0J29iamVjdCc6IHt9LFxuXHRcdFx0J2hlYXBWYWx1ZSc6IDBcblx0XHR9XTtcblx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWluSGVhcDsiXX0=