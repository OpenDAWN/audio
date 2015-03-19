"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

/**
 * ES6 Implementation of a binary heap based on :
 * http://interactivepython.org/courselib/static/pythonds/Trees/heap.html
 *
 * The Heap class is an abstraction of the binary heap. It is implemented to
 * give methods related to both min and max heaps.
 *
 * @author: Renaud Vincent https://github.com/renaudfv
 **/

var Heap = (function () {
	function Heap() {
		_classCallCheck(this, Heap);

		this.currentSize = 0;
		this.heapList = [];
	}

	_createClass(Heap, {
		__percUp: {

			// Abstract method which brings elements up the tree from the i index.

			value: function __percUp(i) {}
		},
		__percDown: {

			// Abstract method which brings elements down the tree from the i index.

			value: function __percDown(i) {}
		},
		remove: {

			// Removes an object from the heap, item being refering to the nested object

			value: function remove(item) {}
		},
		buildHeap: {

			// Build the heap from an object list and structure it

			value: function buildHeap(list) {}
		},
		empty: {

			// Clear the list by replacing it with the appropriate swap object

			value: function empty() {}
		},
		__childPosition: {

			/**
    * Static method used to get a specific index down the tree
    * for swap/perc purposes in the perc down method
    */

			value: function __childPosition(i) {
				if (i * 2 + 1 > this.currentSize || this.heapList[i * 2].heapValue < this.heapList[i * 2 + 1].heapValue) {
					return i * 2;
				} else {
					return i * 2 + 1;
				}
			}
		},
		insert: {

			/**
    * Insert a value with an associated object in the heap tree. The perc up
    * method implementation should handle what to do with the heapValue (eg min
    * or max sorting).
    *
    * @params value being the heapValue used for sorting and any object
    */

			value: function insert(value, object) {
				this.heapList.push({
					object: object,
					heapValue: value
				});
				this.currentSize++;
				this.__percUp(this.currentSize);
			}
		},
		update: {

			/**
    * Find the object reference in the heap list and update its heapValue.
    * The tree should the be sorted using perc up to bring the next desired value
    * as the head.
    */

			value: function update(object, value) {
				for (var i = 1; i <= this.currentSize; i++) {
					if (object === this.heapList[i].object) {
						this.heapList[i].heapValue = value;
						this.__percUp(this.currentSize);
					}
				}
			}
		},
		deleteHead: {

			/**
    * Method used to get the head (minimal) of heap list. Puts it at the end of
    * the list and takes it out with pop. Assures that the tree is restored.
    */

			value: function deleteHead() {
				var referenceValue = this.heapList[1]; // pos 0 being used for percolating
				this.heapList[1] = this.heapList[this.currentSize]; // first item is last
				this.currentSize--;
				this.heapList.pop();
				this.__percDown(1); // from first item, restore tree
				return referenceValue;
			}
		},
		headObject: {

			/**
    * Returns object reference of head without removing it.
    */

			value: function headObject() {
				return this.heapList[1].object;
			}
		},
		headValue: {

			/**
    * Returns value reference of head without removing it.
    */

			value: function headValue() {
				return this.heapList[1].heapValue;
			}
		},
		list: {

			/**
    * List accessor
    */

			value: function list() {
				return this.heapList;
			}
		},
		size: {

			/**
    * Current size accessor
    */

			value: function size() {
				return this.currentSize;
			}
		},
		contains: {

			/**
   * Returns wheter or not the object is already in the heap
   */

			value: function contains(object) {
				for (var i = 1; i <= this.currentSize; i++) {
					if (object === this.heapList[i].object) {
						return true;
					}
				}
				return false;
			}
		},
		isEmpty: {

			/**
    * Returns whether or not the heap is empty.
    */

			value: function isEmpty() {
				return this.currentSize === 0;
			}
		}
	});

	return Heap;
})();

module.exports = Heap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9oZWFwL2hlYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQVNNLElBQUk7QUFFRSxVQUZOLElBQUksR0FFSzt3QkFGVCxJQUFJOztBQUdSLE1BQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0VBQ25COztjQUxJLElBQUk7QUFRVCxVQUFROzs7O1VBQUEsa0JBQUMsQ0FBQyxFQUFFLEVBQUU7O0FBR2QsWUFBVTs7OztVQUFBLG9CQUFDLENBQUMsRUFBRSxFQUFFOztBQUdoQixRQUFNOzs7O1VBQUEsZ0JBQUMsSUFBSSxFQUFFLEVBQUU7O0FBR2YsV0FBUzs7OztVQUFBLG1CQUFDLElBQUksRUFBRSxFQUFFOztBQUdsQixPQUFLOzs7O1VBQUEsaUJBQUcsRUFBRTs7QUFNVixpQkFBZTs7Ozs7OztVQUFBLHlCQUFDLENBQUMsRUFBRTtBQUNsQixRQUFJLEFBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEFBQUMsRUFBRTtBQUN4RSxZQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDYixNQUFNO0FBQ04sWUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtJQUNEOztBQVNELFFBQU07Ozs7Ozs7Ozs7VUFBQSxnQkFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3JCLFFBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xCLGFBQVUsTUFBTTtBQUNoQixnQkFBYSxLQUFLO0tBQ2xCLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoQzs7QUFPRCxRQUFNOzs7Ozs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDckIsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsU0FBSSxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDdkMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ25DLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BQ2hDO0tBQ0Q7SUFDRDs7QUFNRCxZQUFVOzs7Ozs7O1VBQUEsc0JBQUc7QUFDWixRQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixXQUFPLGNBQWMsQ0FBQztJQUN0Qjs7QUFLRCxZQUFVOzs7Ozs7VUFBQSxzQkFBRztBQUNaLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0I7O0FBS0QsV0FBUzs7Ozs7O1VBQUEscUJBQUc7QUFDWCxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2xDOztBQUtELE1BQUk7Ozs7OztVQUFBLGdCQUFHO0FBQ04sV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JCOztBQUtELE1BQUk7Ozs7OztVQUFBLGdCQUFHO0FBQ04sV0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3hCOztBQUtELFVBQVE7Ozs7OztVQUFBLGtCQUFDLE1BQU0sRUFBRTtBQUNoQixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxTQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUN2QyxhQUFPLElBQUksQ0FBQztNQUNaO0tBQ0Q7QUFDRCxXQUFPLEtBQUssQ0FBQztJQUNiOztBQUtELFNBQU87Ozs7OztVQUFBLG1CQUFHO0FBQ1QsV0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQztJQUM5Qjs7OztRQTNISSxJQUFJOzs7QUErSFYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZXM2L3V0aWxzL2hlYXAvaGVhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRVM2IEltcGxlbWVudGF0aW9uIG9mIGEgYmluYXJ5IGhlYXAgYmFzZWQgb24gOlxuICogaHR0cDovL2ludGVyYWN0aXZlcHl0aG9uLm9yZy9jb3Vyc2VsaWIvc3RhdGljL3B5dGhvbmRzL1RyZWVzL2hlYXAuaHRtbFxuICpcbiAqIFRoZSBIZWFwIGNsYXNzIGlzIGFuIGFic3RyYWN0aW9uIG9mIHRoZSBiaW5hcnkgaGVhcC4gSXQgaXMgaW1wbGVtZW50ZWQgdG9cbiAqIGdpdmUgbWV0aG9kcyByZWxhdGVkIHRvIGJvdGggbWluIGFuZCBtYXggaGVhcHMuXG4gKlxuICogQGF1dGhvcjogUmVuYXVkIFZpbmNlbnQgaHR0cHM6Ly9naXRodWIuY29tL3JlbmF1ZGZ2XG4gKiovXG5jbGFzcyBIZWFwIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmN1cnJlbnRTaXplID0gMDtcblx0XHR0aGlzLmhlYXBMaXN0ID0gW107XG5cdH1cblxuXHQvLyBBYnN0cmFjdCBtZXRob2Qgd2hpY2ggYnJpbmdzIGVsZW1lbnRzIHVwIHRoZSB0cmVlIGZyb20gdGhlIGkgaW5kZXguXG5cdF9fcGVyY1VwKGkpIHt9XG5cblx0Ly8gQWJzdHJhY3QgbWV0aG9kIHdoaWNoIGJyaW5ncyBlbGVtZW50cyBkb3duIHRoZSB0cmVlIGZyb20gdGhlIGkgaW5kZXguXG5cdF9fcGVyY0Rvd24oaSkge31cblxuXHQvLyBSZW1vdmVzIGFuIG9iamVjdCBmcm9tIHRoZSBoZWFwLCBpdGVtIGJlaW5nIHJlZmVyaW5nIHRvIHRoZSBuZXN0ZWQgb2JqZWN0XG5cdHJlbW92ZShpdGVtKSB7fVxuXG5cdC8vIEJ1aWxkIHRoZSBoZWFwIGZyb20gYW4gb2JqZWN0IGxpc3QgYW5kIHN0cnVjdHVyZSBpdFxuXHRidWlsZEhlYXAobGlzdCkge31cblxuXHQvLyBDbGVhciB0aGUgbGlzdCBieSByZXBsYWNpbmcgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgc3dhcCBvYmplY3Rcblx0ZW1wdHkoKSB7fVxuXG5cdC8qKlxuXHQgKiBTdGF0aWMgbWV0aG9kIHVzZWQgdG8gZ2V0IGEgc3BlY2lmaWMgaW5kZXggZG93biB0aGUgdHJlZVxuXHQgKiBmb3Igc3dhcC9wZXJjIHB1cnBvc2VzIGluIHRoZSBwZXJjIGRvd24gbWV0aG9kXG5cdCAqL1xuXHRfX2NoaWxkUG9zaXRpb24oaSkge1xuXHRcdGlmICgoaSAqIDIgKyAxID4gdGhpcy5jdXJyZW50U2l6ZSkgfHxcblx0XHRcdCh0aGlzLmhlYXBMaXN0W2kgKiAyXS5oZWFwVmFsdWUgPCDCoHRoaXMuaGVhcExpc3RbaSAqIDIgKyAxXS5oZWFwVmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gaSAqIDI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBpICogMiArIDE7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluc2VydCBhIHZhbHVlIHdpdGggYW4gYXNzb2NpYXRlZCBvYmplY3QgaW4gdGhlIGhlYXAgdHJlZS4gVGhlIHBlcmMgdXBcblx0ICogbWV0aG9kIGltcGxlbWVudGF0aW9uIHNob3VsZCBoYW5kbGUgd2hhdCB0byBkbyB3aXRoIHRoZSBoZWFwVmFsdWUgKGVnIG1pblxuXHQgKiBvciBtYXggc29ydGluZykuXG5cdCAqXG5cdCAqIEBwYXJhbXMgdmFsdWUgYmVpbmcgdGhlIGhlYXBWYWx1ZSB1c2VkIGZvciBzb3J0aW5nIGFuZCBhbnkgb2JqZWN0XG5cdCAqL1xuXHRpbnNlcnQodmFsdWUsIG9iamVjdCkge1xuXHRcdHRoaXMuaGVhcExpc3QucHVzaCh7XG5cdFx0XHQnb2JqZWN0Jzogb2JqZWN0LFxuXHRcdFx0J2hlYXBWYWx1ZSc6IHZhbHVlXG5cdFx0fSk7XG5cdFx0dGhpcy5jdXJyZW50U2l6ZSsrO1xuXHRcdHRoaXMuX19wZXJjVXAodGhpcy5jdXJyZW50U2l6ZSk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZCB0aGUgb2JqZWN0IHJlZmVyZW5jZSBpbiB0aGUgaGVhcCBsaXN0IGFuZCB1cGRhdGUgaXRzIGhlYXBWYWx1ZS5cblx0ICogVGhlIHRyZWUgc2hvdWxkIHRoZSBiZSBzb3J0ZWQgdXNpbmcgcGVyYyB1cCB0byBicmluZyB0aGUgbmV4dCBkZXNpcmVkIHZhbHVlXG5cdCAqIGFzIHRoZSBoZWFkLlxuXHQgKi9cblx0dXBkYXRlKG9iamVjdCwgdmFsdWUpIHtcblx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLmN1cnJlbnRTaXplOyBpKyspIHtcblx0XHRcdGlmIChvYmplY3QgPT09IHRoaXMuaGVhcExpc3RbaV0ub2JqZWN0KSB7XG5cdFx0XHRcdHRoaXMuaGVhcExpc3RbaV0uaGVhcFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuX19wZXJjVXAodGhpcy5jdXJyZW50U2l6ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgaGVhZCAobWluaW1hbCkgb2YgaGVhcCBsaXN0LiBQdXRzIGl0IGF0IHRoZSBlbmQgb2Zcblx0ICogdGhlIGxpc3QgYW5kIHRha2VzIGl0IG91dCB3aXRoIHBvcC4gQXNzdXJlcyB0aGF0IHRoZSB0cmVlIGlzIHJlc3RvcmVkLlxuXHQgKi9cblx0ZGVsZXRlSGVhZCgpIHtcblx0XHR2YXIgcmVmZXJlbmNlVmFsdWUgPSB0aGlzLmhlYXBMaXN0WzFdOyAvLyBwb3MgMCBiZWluZyB1c2VkIGZvciBwZXJjb2xhdGluZ1xuXHRcdHRoaXMuaGVhcExpc3RbMV0gPSB0aGlzLmhlYXBMaXN0W3RoaXMuY3VycmVudFNpemVdOyAvLyBmaXJzdCBpdGVtIGlzIGxhc3Rcblx0XHR0aGlzLmN1cnJlbnRTaXplLS07XG5cdFx0dGhpcy5oZWFwTGlzdC5wb3AoKTtcblx0XHR0aGlzLl9fcGVyY0Rvd24oMSk7IC8vIGZyb20gZmlyc3QgaXRlbSwgcmVzdG9yZSB0cmVlXG5cdFx0cmV0dXJuIHJlZmVyZW5jZVZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgb2JqZWN0IHJlZmVyZW5jZSBvZiBoZWFkIHdpdGhvdXQgcmVtb3ZpbmcgaXQuXG5cdCAqL1xuXHRoZWFkT2JqZWN0KCkge1xuXHRcdHJldHVybiB0aGlzLmhlYXBMaXN0WzFdLm9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHZhbHVlIHJlZmVyZW5jZSBvZiBoZWFkIHdpdGhvdXQgcmVtb3ZpbmcgaXQuXG5cdCAqL1xuXHRoZWFkVmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaGVhcExpc3RbMV0uaGVhcFZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIExpc3QgYWNjZXNzb3Jcblx0ICovXG5cdGxpc3QoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaGVhcExpc3Q7XG5cdH1cblxuXHQvKipcblx0ICogQ3VycmVudCBzaXplIGFjY2Vzc29yXG5cdCAqL1xuXHRzaXplKCkge1xuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRTaXplO1xuXHR9XG5cblx0LyoqXG5cdCogUmV0dXJucyB3aGV0ZXIgb3Igbm90IHRoZSBvYmplY3QgaXMgYWxyZWFkeSBpbiB0aGUgaGVhcFxuXHQqL1xuXHRjb250YWlucyhvYmplY3QpIHtcblx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLmN1cnJlbnRTaXplOyBpKyspIHtcblx0XHRcdGlmIChvYmplY3QgPT09IHRoaXMuaGVhcExpc3RbaV0ub2JqZWN0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgaGVhcCBpcyBlbXB0eS5cblx0ICovXG5cdGlzRW1wdHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFNpemUgPT09IDA7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhlYXA7Il19