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
		update: {

			// Updates

			value: function update(object) {}
		},
		remove: {

			// Removes an object from the heap, item being refering to the nested object

			value: function remove(object) {}
		},
		buildHeap: {

			// Build the heap from an object list and structure it

			value: function buildHeap(list) {}
		},
		empty: {

			// Clear the list by replacing it with the appropriate swap object

			value: function empty() {}
		},
		insert: {

			/**
    * Insert a value with an associated object in the heap tree. The perc up
    * method implementation should handle what to do with the heapValue (eg min
    * or max sorting).
    *
    * @params value being the heapValue used for sorting and any object
    */

			value: function insert(value) {
				var object = arguments[1] === undefined ? {} : arguments[1];

				this.heapList.push({
					object: object,
					heapValue: value
				});
				this.currentSize++;
				this.__percUp(this.currentSize);
			}
		},
		deleteHead: {

			/**
    * Method used to get the head of the heap list. Puts it at the end of
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

			get: function () {
				return this.currentSize;
			}
		},
		contains: {

			/**
    * If the heap contains the object, it will return its index, otherwise it
    * returns -1.
    */

			value: function contains(object) {
				for (var i = 0; i <= this.currentSize; i++) {
					if (object === this.heapList[i].object) {
						return i;
					}
				}
				return -1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9wcmlvcml0eS1xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBU00sSUFBSTtBQUVFLFVBRk4sSUFBSSxHQUVLO3dCQUZULElBQUk7O0FBR1IsTUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDckIsTUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7RUFDbkI7O2NBTEksSUFBSTtBQVFULFVBQVE7Ozs7VUFBQSxrQkFBQyxDQUFDLEVBQUUsRUFBRTs7QUFHZCxZQUFVOzs7O1VBQUEsb0JBQUMsQ0FBQyxFQUFFLEVBQUU7O0FBR2hCLFFBQU07Ozs7VUFBQSxnQkFBQyxNQUFNLEVBQUUsRUFBRTs7QUFHakIsUUFBTTs7OztVQUFBLGdCQUFDLE1BQU0sRUFBRSxFQUFFOztBQUdqQixXQUFTOzs7O1VBQUEsbUJBQUMsSUFBSSxFQUFFLEVBQUU7O0FBR2xCLE9BQUs7Ozs7VUFBQSxpQkFBRyxFQUFFOztBQVNWLFFBQU07Ozs7Ozs7Ozs7VUFBQSxnQkFBQyxLQUFLLEVBQWU7UUFBYixNQUFNLGdDQUFHLEVBQUU7O0FBQ3hCLFFBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xCLGFBQVUsTUFBTTtBQUNoQixnQkFBYSxLQUFLO0tBQ2xCLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoQzs7QUFNRCxZQUFVOzs7Ozs7O1VBQUEsc0JBQUc7QUFDWixRQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixXQUFPLGNBQWMsQ0FBQztJQUN0Qjs7QUFLRCxZQUFVOzs7Ozs7VUFBQSxzQkFBRztBQUNaLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0I7O0FBS0QsV0FBUzs7Ozs7O1VBQUEscUJBQUc7QUFDWCxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2xDOztBQUtELE1BQUk7Ozs7OztVQUFBLGdCQUFHO0FBQ04sV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JCOztBQUtHLE1BQUk7Ozs7OztRQUFBLFlBQUc7QUFDVixXQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDeEI7O0FBTUQsVUFBUTs7Ozs7OztVQUFBLGtCQUFDLE1BQU0sRUFBRTtBQUNoQixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxTQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUN2QyxhQUFPLENBQUMsQ0FBQztNQUNUO0tBQ0Q7QUFDRCxXQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1Y7O0FBS0QsU0FBTzs7Ozs7O1VBQUEsbUJBQUc7QUFDVCxXQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssQ0FBQyxDQUFDO0lBQzlCOzs7O1FBcEdJLElBQUk7OztBQXdHVixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJlczYvdXRpbHMvcHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEVTNiBJbXBsZW1lbnRhdGlvbiBvZiBhIGJpbmFyeSBoZWFwIGJhc2VkIG9uIDpcbiAqIGh0dHA6Ly9pbnRlcmFjdGl2ZXB5dGhvbi5vcmcvY291cnNlbGliL3N0YXRpYy9weXRob25kcy9UcmVlcy9oZWFwLmh0bWxcbiAqXG4gKiBUaGUgSGVhcCBjbGFzcyBpcyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgYmluYXJ5IGhlYXAuIEl0IGlzIGltcGxlbWVudGVkIHRvXG4gKiBnaXZlIG1ldGhvZHMgcmVsYXRlZCB0byBib3RoIG1pbiBhbmQgbWF4IGhlYXBzLlxuICpcbiAqIEBhdXRob3I6IFJlbmF1ZCBWaW5jZW50IGh0dHBzOi8vZ2l0aHViLmNvbS9yZW5hdWRmdlxuICoqL1xuY2xhc3MgSGVhcCB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5jdXJyZW50U2l6ZSA9IDA7XG5cdFx0dGhpcy5oZWFwTGlzdCA9IFtdO1xuXHR9XG5cblx0Ly8gQWJzdHJhY3QgbWV0aG9kIHdoaWNoIGJyaW5ncyBlbGVtZW50cyB1cCB0aGUgdHJlZSBmcm9tIHRoZSBpIGluZGV4LlxuXHRfX3BlcmNVcChpKSB7fVxuXG5cdC8vIEFic3RyYWN0IG1ldGhvZCB3aGljaCBicmluZ3MgZWxlbWVudHMgZG93biB0aGUgdHJlZSBmcm9tIHRoZSBpIGluZGV4LlxuXHRfX3BlcmNEb3duKGkpIHt9XG5cblx0Ly8gVXBkYXRlcyBcblx0dXBkYXRlKG9iamVjdCkge31cblxuXHQvLyBSZW1vdmVzIGFuIG9iamVjdCBmcm9tIHRoZSBoZWFwLCBpdGVtIGJlaW5nIHJlZmVyaW5nIHRvIHRoZSBuZXN0ZWQgb2JqZWN0XG5cdHJlbW92ZShvYmplY3QpIHt9XG5cblx0Ly8gQnVpbGQgdGhlIGhlYXAgZnJvbSBhbiBvYmplY3QgbGlzdCBhbmQgc3RydWN0dXJlIGl0XG5cdGJ1aWxkSGVhcChsaXN0KSB7fVxuXG5cdC8vIENsZWFyIHRoZSBsaXN0IGJ5IHJlcGxhY2luZyBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBzd2FwIG9iamVjdFxuXHRlbXB0eSgpIHt9XG5cblx0LyoqXG5cdCAqIEluc2VydCBhIHZhbHVlIHdpdGggYW4gYXNzb2NpYXRlZCBvYmplY3QgaW4gdGhlIGhlYXAgdHJlZS4gVGhlIHBlcmMgdXBcblx0ICogbWV0aG9kIGltcGxlbWVudGF0aW9uIHNob3VsZCBoYW5kbGUgd2hhdCB0byBkbyB3aXRoIHRoZSBoZWFwVmFsdWUgKGVnIG1pblxuXHQgKiBvciBtYXggc29ydGluZykuXG5cdCAqXG5cdCAqIEBwYXJhbXMgdmFsdWUgYmVpbmcgdGhlIGhlYXBWYWx1ZSB1c2VkIGZvciBzb3J0aW5nIGFuZCBhbnkgb2JqZWN0XG5cdCAqL1xuXHRpbnNlcnQodmFsdWUsIG9iamVjdCA9IHt9KSB7XG5cdFx0dGhpcy5oZWFwTGlzdC5wdXNoKHtcblx0XHRcdCdvYmplY3QnOiBvYmplY3QsXG5cdFx0XHQnaGVhcFZhbHVlJzogdmFsdWVcblx0XHR9KTtcblx0XHR0aGlzLmN1cnJlbnRTaXplKys7XG5cdFx0dGhpcy5fX3BlcmNVcCh0aGlzLmN1cnJlbnRTaXplKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdXNlZCB0byBnZXQgdGhlIGhlYWQgb2YgdGhlIGhlYXAgbGlzdC4gUHV0cyBpdCBhdCB0aGUgZW5kIG9mXG5cdCAqIHRoZSBsaXN0IGFuZCB0YWtlcyBpdCBvdXQgd2l0aCBwb3AuIEFzc3VyZXMgdGhhdCB0aGUgdHJlZSBpcyByZXN0b3JlZC5cblx0ICovXG5cdGRlbGV0ZUhlYWQoKSB7XG5cdFx0dmFyIHJlZmVyZW5jZVZhbHVlID0gdGhpcy5oZWFwTGlzdFsxXTsgLy8gcG9zIDAgYmVpbmcgdXNlZCBmb3IgcGVyY29sYXRpbmdcblx0XHR0aGlzLmhlYXBMaXN0WzFdID0gdGhpcy5oZWFwTGlzdFt0aGlzLmN1cnJlbnRTaXplXTsgLy8gZmlyc3QgaXRlbSBpcyBsYXN0XG5cdFx0dGhpcy5jdXJyZW50U2l6ZS0tO1xuXHRcdHRoaXMuaGVhcExpc3QucG9wKCk7XG5cdFx0dGhpcy5fX3BlcmNEb3duKDEpOyAvLyBmcm9tIGZpcnN0IGl0ZW0sIHJlc3RvcmUgdHJlZVxuXHRcdHJldHVybiByZWZlcmVuY2VWYWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIG9iamVjdCByZWZlcmVuY2Ugb2YgaGVhZCB3aXRob3V0IHJlbW92aW5nIGl0LlxuXHQgKi9cblx0aGVhZE9iamVjdCgpIHtcblx0XHRyZXR1cm4gdGhpcy5oZWFwTGlzdFsxXS5vYmplY3Q7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB2YWx1ZSByZWZlcmVuY2Ugb2YgaGVhZCB3aXRob3V0IHJlbW92aW5nIGl0LlxuXHQgKi9cblx0aGVhZFZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLmhlYXBMaXN0WzFdLmhlYXBWYWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMaXN0IGFjY2Vzc29yXG5cdCAqL1xuXHRsaXN0KCkge1xuXHRcdHJldHVybiB0aGlzLmhlYXBMaXN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgc2l6ZSBhY2Nlc3NvclxuXHQgKi9cblx0Z2V0IHNpemUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFNpemU7XG5cdH1cblxuXHQvKipcblx0ICogSWYgdGhlIGhlYXAgY29udGFpbnMgdGhlIG9iamVjdCwgaXQgd2lsbCByZXR1cm4gaXRzIGluZGV4LCBvdGhlcndpc2UgaXRcblx0ICogcmV0dXJucyAtMS5cblx0ICovXG5cdGNvbnRhaW5zKG9iamVjdCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMuY3VycmVudFNpemU7IGkrKykge1xuXHRcdFx0aWYgKG9iamVjdCA9PT0gdGhpcy5oZWFwTGlzdFtpXS5vYmplY3QpIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBoZWFwIGlzIGVtcHR5LlxuXHQgKi9cblx0aXNFbXB0eSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50U2l6ZSA9PT0gMDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhcDsiXX0=