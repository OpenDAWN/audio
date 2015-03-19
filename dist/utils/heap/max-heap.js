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
		__percUp: {

			/**
    * Method used to maintain the max heap property from a certain index. It is
    * used locally from the end of the heap list upon insertion, update and
    * removal. It percolates max values up the binary tree.
    */

			value: function __percUp(i) {
				var ceiledIndex, tmp;

				while (Math.floor(i / 2) > 0) {
					ceiledIndex = Math.ceil(i / 2);
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
					refPos = this.__childPosition(i);
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
		remove: {

			/**
    * Finds the item object reference in the heap list brings it up the tree by
    * having an infinity value. The tree is the sorted and the head is removed.
    */

			value: function remove(item) {
				for (var i = 0; i <= this.currentSize; i++) {
					if (item === this.heapList[i].object) {
						this.heapList[i].heapValue = Infinity;
						this.__percUp(this.currentSize);
						this.deleteHead();
					}
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
					this.__percUp(i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9oZWFwL21heC1oZWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7SUFVdEIsT0FBTztBQUVELFVBRk4sT0FBTyxHQUVFO3dCQUZULE9BQU87O0FBR1gsbUNBSEksT0FBTyw2Q0FHSDs7QUFFVCxNQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsV0FBVSxFQUFFO0FBQ1osY0FBYSxRQUFRO0dBQ3JCLENBQUMsQ0FBQztFQUNIOztXQVRLLE9BQU87O2NBQVAsT0FBTztBQWdCWixVQUFROzs7Ozs7OztVQUFBLGtCQUFDLENBQUMsRUFBRTtBQUNYLFFBQUksV0FBVyxFQUFFLEdBQUcsQ0FBQzs7QUFFckIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDN0IsZ0JBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUN2RSxTQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDdkI7O0FBRUQsTUFBQyxHQUFHLFdBQVcsQ0FBQztLQUNoQjtJQUNEOztBQU9BLFlBQVU7Ozs7Ozs7O1VBQUEsb0JBQUMsQ0FBQyxFQUFFO0FBQ2IsUUFBSSxNQUFNLEVBQUUsR0FBRyxDQUFDOztBQUVoQixXQUFPLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ25DLFdBQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVsQyxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ2pFLFNBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUM1Qjs7QUFFRCxNQUFDLEdBQUcsTUFBTSxDQUFDO0tBQ1g7SUFDRDs7QUFNQSxRQUFNOzs7Ozs7O1VBQUEsZ0JBQUMsSUFBSSxFQUFFO0FBQ1osU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsU0FBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDckMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztNQUNsQjtLQUNEOztBQUVELFFBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLFlBQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQUEsQUFFekIsT0FBTyxRQUFRLENBQUM7SUFDaEI7O0FBTUQsV0FBUzs7Ozs7OztVQUFBLG1CQUFDLElBQUksRUFBRTtBQUNmLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMvQixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsYUFBVSxFQUFFO0FBQ1osZ0JBQWEsUUFBUTtLQUNyQixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3BCLFdBQU8sQ0FBQyxHQUFLLENBQUMsRUFBRTtBQUNmLFNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsTUFBQyxFQUFFLENBQUM7S0FDSjtJQUNEOztBQUtGLE9BQUs7Ozs7OztVQUFBLGlCQUFHO0FBQ1AsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLGFBQVUsRUFBRTtBQUNaLGdCQUFhLFFBQVE7S0FDckIsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDckI7Ozs7UUFuR0ssT0FBTztHQUFTLElBQUk7O0FBdUczQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvdXRpbHMvaGVhcC9tYXgtaGVhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIZWFwID0gcmVxdWlyZSgnLi9oZWFwJyk7XG4vKipcbiAqIEVTNiBJbXBsZW1lbnRhdGlvbiBvZiBhIG1heGltdW0gYmluYXJ5IGhlYXAgYmFzZWQgb24gOlxuICogaHR0cDovL2ludGVyYWN0aXZlcHl0aG9uLm9yZy9jb3Vyc2VsaWIvc3RhdGljL3B5dGhvbmRzL1RyZWVzL2hlYXAuaHRtbFxuICpcbiAqIFRoZSBoZWFkIChvciBwb3NpdGlvbiAxIGluIHRoZSBhcnJheSkgc2hvdWxkIGJlIHRoZSBvYmplY3Qgd2l0aCBtYXhpbWFsIGhlYXBcbiAqIHZhbHVlLlxuICpcbiAqIEBhdXRob3I6IFJlbmF1ZCBWaW5jZW50IGh0dHBzOi8vZ2l0aHViLmNvbS9yZW5hdWRmdlxuICoqL1xuIGNsYXNzIE1heEhlYXAgZXh0ZW5kcyBIZWFwIHtcblxuIFx0Y29uc3RydWN0b3IoKSB7XG4gXHRcdHN1cGVyKCk7XG5cdFx0Ly8gRW1wdHkgb2JqZWN0IHdpdGggbWF4aW1hbCB2YWx1ZSB1c2VkIGZvciBzd2FwaW5nIG9uIHRoZSBmaXJzdCBpbnNlcnRpb25zXG5cdFx0dGhpcy5oZWFwTGlzdCA9IFt7XG5cdFx0XHQnb2JqZWN0Jzoge30sXG5cdFx0XHQnaGVhcFZhbHVlJzogSW5maW5pdHlcblx0XHR9XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWF4IGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG5cdCAqIHVzZWQgbG9jYWxseSBmcm9tIHRoZSBlbmQgb2YgdGhlIGhlYXAgbGlzdCB1cG9uIGluc2VydGlvbiwgdXBkYXRlIGFuZFxuXHQgKiByZW1vdmFsLiBJdCBwZXJjb2xhdGVzIG1heCB2YWx1ZXMgdXAgdGhlIGJpbmFyeSB0cmVlLlxuXHQgKi9cblx0IF9fcGVyY1VwKGkpIHtcblx0IFx0dmFyIGNlaWxlZEluZGV4LCB0bXA7XG5cblx0IFx0d2hpbGUgKE1hdGguZmxvb3IoaSAvIDIpID4gMCkge1xuXHQgXHRcdGNlaWxlZEluZGV4ID0gTWF0aC5jZWlsKGkgLyAyKTtcblx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgZ3JlYXRlciB0aGFuIHRoZSBvbmUgYXQgY2VpbGVkIGluZGV4XG5cdFx0XHRpZiAodGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPiDCoHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XTtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF0gPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRpID0gY2VpbGVkSW5kZXg7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB1c2VkIHRvIG1haW50YWluIHRoZSBtaW4gaGVhcCBwcm9wZXJ0eSBmcm9tIGEgY2VydGFpbiBpbmRleC4gSXQgaXNcblx0ICogdXNlZCBsb2NhbGx5IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBkZWxldGlvbi4gSXRlbXMgYXJlIFxuXHQgKiBzd2FwZWQgZG93biB0aGUgdHJlZSBpZiB0aGV5IGhhdmUgYSBzbWFsbGVyIHJlZmVyZW5jZSB2YWx1ZS5cblx0ICovXG5cdCBfX3BlcmNEb3duKGkpIHtcblx0IFx0dmFyIHJlZlBvcywgdG1wO1xuXG5cdCBcdHdoaWxlICgoaSAqIDIpIDw9IHRoaXMuY3VycmVudFNpemUpIHtcblx0IFx0XHRyZWZQb3MgPSB0aGlzLl9fY2hpbGRQb3NpdGlvbihpKTtcblx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgc21hbGxlciB0aGFuIHRoZSByZWZlcmVuY2UgZG93biB0aGUgdHJlZVxuXHRcdFx0aWYgKHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlIDwgdGhpcy5oZWFwTGlzdFtyZWZQb3NdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdGhpcy5oZWFwTGlzdFtyZWZQb3NdO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W3JlZlBvc10gPSB0bXA7XG5cdFx0XHR9XG5cblx0XHRcdGkgPSByZWZQb3M7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBpdGVtIG9iamVjdCByZWZlcmVuY2UgaW4gdGhlIGhlYXAgbGlzdCBicmluZ3MgaXQgdXAgdGhlIHRyZWUgYnlcblx0ICogaGF2aW5nIGFuIGluZmluaXR5IHZhbHVlLiBUaGUgdHJlZSBpcyB0aGUgc29ydGVkIGFuZCB0aGUgaGVhZCBpcyByZW1vdmVkLlxuXHQgKi9cblx0IHJlbW92ZShpdGVtKSB7XG5cdCBcdGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHQgXHRcdGlmIChpdGVtID09PSB0aGlzLmhlYXBMaXN0W2ldLm9iamVjdCkge1xuXHQgXHRcdFx0dGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPSBJbmZpbml0eTtcblx0IFx0XHRcdHRoaXMuX19wZXJjVXAodGhpcy5jdXJyZW50U2l6ZSk7XG5cdCBcdFx0XHR0aGlzLmRlbGV0ZUhlYWQoKTtcblx0IFx0XHR9XG5cdCBcdH1cblxuXHQgXHRpZighdGhpcy5pc0VtcHR5KCkpIFxuXHQgXHRcdHJldHVybiB0aGlzLmhlYWRWYWx1ZSgpO1xuXG5cdCBcdHJldHVybiBJbmZpbml0eTtcblx0IH1cblxuXHQvKipcblx0ICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1heGltYWwgc3dhcCBcblx0ICogcmVmZXJlbmNlXG5cdCAqL1xuXHQgYnVpbGRIZWFwKGxpc3QpIHtcblx0IFx0dGhpcy5jdXJyZW50U2l6ZSA9IGxpc3QubGVuZ3RoO1xuXHQgXHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0IFx0XHQnb2JqZWN0Jzoge30sXG5cdCBcdFx0J2hlYXBWYWx1ZSc6IEluZmluaXR5XG5cdCBcdH1dLmNvbmNhdChsaXN0KTtcblx0IFx0XG5cdCBcdHZhciBpID0gbGlzdC5sZW5ndGg7XG5cdCBcdHdoaWxlIChpwqAgPiDCoDApIHtcblx0IFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHQgXHRcdGktLTtcblx0IFx0fVxuXHQgfVxuXG5cdC8qKlxuXHQqIENsZWFyIHRoZSBsaXN0IHdpdGggYSBtYXhpbWFsIGhlYXBWYWx1ZSBzd2FwIHJlZmVyZW5jZVxuXHQqL1xuXHRlbXB0eSgpIHtcblx0XHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0XHRcdCdvYmplY3QnOiB7fSxcblx0XHRcdCdoZWFwVmFsdWUnOiBJbmZpbml0eSBcblx0XHR9XTtcblx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF4SGVhcDsiXX0=