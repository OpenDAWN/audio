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
		__percUp: {

			/**
    * Method used to maintain the min heap property from a certain index. It is
    * used locally from the end of the heap list upon insertion, update and
    * removal. It percolates min values up the binary tree.
    */

			value: function __percUp(i) {
				var ceiledIndex, tmp;

				while (Math.floor(i / 2) > 0) {
					ceiledIndex = Math.ceil(i / 2);
					// Is the item at i smaller than the one at ceiled index
					if (this.heapList[i].heapValue < this.heapList[ceiledIndex].heapValue) {
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
    * swaped down the tree if they have a bigger reference value.
    */

			value: function __percDown(i) {
				var refPos, tmp;

				while (i * 2 <= this.currentSize) {
					refPos = this.__childPosition(i);
					// Is the item at i greater than the reference down the tree
					if (this.heapList[i].heapValue > this.heapList[refPos].heapValue) {
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
    * having a -infinity value. The tree is the sorted and the head is removed.
    */

			value: function remove(item) {
				for (var i = 0; i <= this.currentSize; i++) {
					if (item === this.heapList[i].object) {
						this.heapList[i].heapValue = 0;
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
    * Build heap from an object list and structure it with a minimal swap 
    * reference
    */

			value: function buildHeap(list) {

				this.currentSize = list.length;
				this.heapList = [{
					object: {},
					heapValue: 0
				}].concat(list);

				var i = list.length - 1;
				while (i > 0) {
					this.__percUp(i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9oZWFwL21pbi1oZWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7SUFVdEIsT0FBTztBQUVELFVBRk4sT0FBTyxHQUVFO3dCQUZULE9BQU87O0FBR1gsbUNBSEksT0FBTyw2Q0FHSDs7QUFFVCxNQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsV0FBVSxFQUFFO0FBQ1osY0FBYSxDQUFDO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7O1dBVEssT0FBTzs7Y0FBUCxPQUFPO0FBZ0JaLFVBQVE7Ozs7Ozs7O1VBQUEsa0JBQUMsQ0FBQyxFQUFFO0FBQ1gsUUFBSSxXQUFXLEVBQUUsR0FBRyxDQUFDOztBQUVyQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM3QixnQkFBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVoQyxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ3ZFLFNBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUN2Qjs7QUFFRCxNQUFDLEdBQUcsV0FBVyxDQUFDO0tBQ2hCO0lBQ0Q7O0FBT0EsWUFBVTs7Ozs7Ozs7VUFBQSxvQkFBQyxDQUFDLEVBQUU7QUFDYixRQUFJLE1BQU0sRUFBRSxHQUFHLENBQUM7O0FBRWhCLFdBQU8sQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDbkMsV0FBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWxDLFNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDakUsU0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO01BQzVCOztBQUVELE1BQUMsR0FBRyxNQUFNLENBQUM7S0FDWDtJQUNEOztBQU1BLFFBQU07Ozs7Ozs7VUFBQSxnQkFBQyxJQUFJLEVBQUU7QUFDWixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxTQUFJLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNyQyxVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO01BQ2xCO0tBQ0Q7O0FBRUQsUUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakIsWUFBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FBQSxBQUV6QixPQUFPLFFBQVEsQ0FBQztJQUNoQjs7QUFNRCxXQUFTOzs7Ozs7O1VBQUEsbUJBQUMsSUFBSSxFQUFFOztBQUVmLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMvQixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsYUFBVSxFQUFFO0FBQ1osZ0JBQWEsQ0FBQztLQUNkLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFdBQU8sQ0FBQyxHQUFLLENBQUMsRUFBRTtBQUNmLFNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsTUFBQyxFQUFFLENBQUM7S0FDSjtJQUNEOztBQUtGLE9BQUs7Ozs7OztVQUFBLGlCQUFHO0FBQ1AsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLGFBQVUsRUFBRTtBQUNaLGdCQUFhLENBQUM7S0FDZCxDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNyQjs7OztRQXBHSyxPQUFPO0dBQVMsSUFBSTs7QUF3RzNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi91dGlscy9oZWFwL21pbi1oZWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEhlYXAgPSByZXF1aXJlKCcuL2hlYXAnKTtcbi8qKlxuICogRVM2IEltcGxlbWVudGF0aW9uIG9mIGEgbWluaW11bSBiaW5hcnkgaGVhcCBiYXNlZCBvbiA6XG4gKiBodHRwOi8vaW50ZXJhY3RpdmVweXRob24ub3JnL2NvdXJzZWxpYi9zdGF0aWMvcHl0aG9uZHMvVHJlZXMvaGVhcC5odG1sXG4gKlxuICogVGhlIGhlYWQgKG9yIHBvc2l0aW9uIDEgaW4gdGhlIGFycmF5KSBzaG91bGQgYmUgdGhlIG9iamVjdCB3aXRoIG1pbmltYWwgaGVhcFxuICogdmFsdWUuXG4gKlxuICogQGF1dGhvcjogUmVuYXVkIFZpbmNlbnQgaHR0cHM6Ly9naXRodWIuY29tL3JlbmF1ZGZ2XG4gKiovXG4gY2xhc3MgTWluSGVhcCBleHRlbmRzIEhlYXAge1xuXG4gXHRjb25zdHJ1Y3RvcigpIHtcbiBcdFx0c3VwZXIoKTtcblx0XHQvLyBFbXB0eSBvYmplY3Qgd2l0aCBtaW5pbWFsIHZhbHVlIHVzZWQgZm9yIHN3YXBpbmcgb24gdGhlIGZpcnN0IGluc2VydGlvbnNcblx0XHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0XHRcdCdvYmplY3QnOiB7fSxcblx0XHRcdCdoZWFwVmFsdWUnOiAwXG5cdFx0fV07XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHVzZWQgdG8gbWFpbnRhaW4gdGhlIG1pbiBoZWFwIHByb3BlcnR5IGZyb20gYSBjZXJ0YWluIGluZGV4LiBJdCBpc1xuXHQgKiB1c2VkIGxvY2FsbHkgZnJvbSB0aGUgZW5kIG9mIHRoZSBoZWFwIGxpc3QgdXBvbiBpbnNlcnRpb24sIHVwZGF0ZSBhbmRcblx0ICogcmVtb3ZhbC4gSXQgcGVyY29sYXRlcyBtaW4gdmFsdWVzIHVwIHRoZSBiaW5hcnkgdHJlZS5cblx0ICovXG5cdCBfX3BlcmNVcChpKSB7XG5cdCBcdHZhciBjZWlsZWRJbmRleCwgdG1wO1xuXG5cdCBcdHdoaWxlIChNYXRoLmZsb29yKGkgLyAyKSA+IDApIHtcblx0IFx0XHRjZWlsZWRJbmRleCA9IE1hdGguY2VpbChpIC8gMik7XG5cdFx0XHQvLyBJcyB0aGUgaXRlbSBhdCBpIHNtYWxsZXIgdGhhbiB0aGUgb25lIGF0IGNlaWxlZCBpbmRleFxuXHRcdFx0aWYgKHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlIDwgwqB0aGlzLmhlYXBMaXN0W2NlaWxlZEluZGV4XS5oZWFwVmFsdWUpIHtcblx0XHRcdFx0dG1wID0gdGhpcy5oZWFwTGlzdFtjZWlsZWRJbmRleF07XG5cdFx0XHRcdHRoaXMuaGVhcExpc3RbY2VpbGVkSW5kZXhdID0gdGhpcy5oZWFwTGlzdFtpXTtcblx0XHRcdFx0dGhpcy5oZWFwTGlzdFtpXSA9IHRtcDtcblx0XHRcdH1cblxuXHRcdFx0aSA9IGNlaWxlZEluZGV4O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdXNlZCB0byBtYWludGFpbiB0aGUgbWluIGhlYXAgcHJvcGVydHkgZnJvbSBhIGNlcnRhaW4gaW5kZXguIEl0IGlzXG5cdCAqIHVzZWQgbG9jYWxseSBmcm9tIHRoZSBzdGFydCBvZiB0aGUgaGVhcCBsaXN0IHVwb24gZGVsZXRpb24uIEl0ZW1zIGFyZSBcblx0ICogc3dhcGVkIGRvd24gdGhlIHRyZWUgaWYgdGhleSBoYXZlIGEgYmlnZ2VyIHJlZmVyZW5jZSB2YWx1ZS5cblx0ICovXG5cdCBfX3BlcmNEb3duKGkpIHtcblx0IFx0dmFyIHJlZlBvcywgdG1wO1xuXG5cdCBcdHdoaWxlICgoaSAqIDIpIDw9IHRoaXMuY3VycmVudFNpemUpIHtcblx0IFx0XHRyZWZQb3MgPSB0aGlzLl9fY2hpbGRQb3NpdGlvbihpKTtcblx0XHRcdC8vIElzIHRoZSBpdGVtIGF0IGkgZ3JlYXRlciB0aGFuIHRoZSByZWZlcmVuY2UgZG93biB0aGUgdHJlZVxuXHRcdFx0aWYgKHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID4gdGhpcy5oZWFwTGlzdFtyZWZQb3NdLmhlYXBWYWx1ZSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmhlYXBMaXN0W2ldO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W2ldID0gdGhpcy5oZWFwTGlzdFtyZWZQb3NdO1xuXHRcdFx0XHR0aGlzLmhlYXBMaXN0W3JlZlBvc10gPSB0bXA7XG5cdFx0XHR9XG5cblx0XHRcdGkgPSByZWZQb3M7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBpdGVtIG9iamVjdCByZWZlcmVuY2UgaW4gdGhlIGhlYXAgbGlzdCBicmluZ3MgaXQgdXAgdGhlIHRyZWUgYnlcblx0ICogaGF2aW5nIGEgLWluZmluaXR5IHZhbHVlLiBUaGUgdHJlZSBpcyB0aGUgc29ydGVkIGFuZCB0aGUgaGVhZCBpcyByZW1vdmVkLlxuXHQgKi9cblx0IHJlbW92ZShpdGVtKSB7XG5cdCBcdGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHQgXHRcdGlmIChpdGVtID09PSB0aGlzLmhlYXBMaXN0W2ldLm9iamVjdCkge1xuXHQgXHRcdFx0dGhpcy5oZWFwTGlzdFtpXS5oZWFwVmFsdWUgPSAwO1xuXHQgXHRcdFx0dGhpcy5fX3BlcmNVcCh0aGlzLmN1cnJlbnRTaXplKTtcblx0IFx0XHRcdHRoaXMuZGVsZXRlSGVhZCgpOyBcblx0IFx0XHR9XG5cdCBcdH1cblxuXHQgXHRpZighdGhpcy5pc0VtcHR5KCkpIFxuXHQgXHRcdHJldHVybiB0aGlzLmhlYWRWYWx1ZSgpO1xuXG5cdCBcdHJldHVybiBJbmZpbml0eTtcblx0IH1cblxuXHQvKipcblx0ICogQnVpbGQgaGVhcCBmcm9tIGFuIG9iamVjdCBsaXN0IGFuZCBzdHJ1Y3R1cmUgaXQgd2l0aCBhIG1pbmltYWwgc3dhcCBcblx0ICogcmVmZXJlbmNlXG5cdCAqL1xuXHQgYnVpbGRIZWFwKGxpc3QpIHtcblxuXHQgXHR0aGlzLmN1cnJlbnRTaXplID0gbGlzdC5sZW5ndGg7XG5cdCBcdHRoaXMuaGVhcExpc3QgPSBbe1xuXHQgXHRcdCdvYmplY3QnOiB7fSxcblx0IFx0XHQnaGVhcFZhbHVlJzogMFxuXHQgXHR9XS5jb25jYXQobGlzdCk7XG5cblx0IFx0dmFyIGkgPSBsaXN0Lmxlbmd0aCAtIDE7XG5cdCBcdHdoaWxlIChpwqAgPiDCoDApIHtcblx0IFx0XHR0aGlzLl9fcGVyY1VwKGkpO1xuXHQgXHRcdGktLTtcblx0IFx0fVxuXHQgfVxuXG5cdC8qKlxuXHQqIENsZWFyIHRoZSBsaXN0IHdpdGggYSBtaW5pbWFsIGhlYXBWYWx1ZSBzd2FwIHJlZmVyZW5jZVxuXHQqL1xuXHRlbXB0eSgpIHtcblx0XHR0aGlzLmhlYXBMaXN0ID0gW3tcblx0XHRcdCdvYmplY3QnOiB7fSxcblx0XHRcdCdoZWFwVmFsdWUnOiAwXG5cdFx0fV07XG5cdFx0dGhpcy5jdXJyZW50U2l6ZSA9IDA7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1pbkhlYXA7Il19