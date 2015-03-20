var assert = require('assert');

var MaxHeap = require('../es6/utils/heap/max-heap');
var MinHeap = require('../es6/utils/heap/min-heap');

describe("Max and Min Heap", function() {

	it("should construct properly", function() {
		var heap = new MaxHeap();
		assert.deepEqual(heap.heapList, [{
			'object': {},
			'heapValue': Infinity
		}]);
		assert.equal(heap.currentSize, 0);
		heap = new MinHeap();
		assert.deepEqual(heap.heapList, [{
			'object': {},
			'heapValue': 0
		}]);
		assert.equal(heap.currentSize, 0);
	});

	it("should return child position properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		// Already sorted arrays
		minH.heapList = [{
			'heapValue': 0
		}, {
			'heapValue': 1
		}, {
			'heapValue': 2
		}, {
			'heapValue': 3
		}, {
			'heapValue': 5
		}, {
			'heapValue': 4
		}, {
			'heapValue': 6
		}, {
			'heapValue': 8
		}];
		minH.currentSize = 7;

		maxH.heapList = [{
			'heapValue': Infinity
		}, {
			'heapValue': 8
		}, {
			'heapValue': 6
		}, {
			'heapValue': 7
		}, {
			'heapValue': 5
		}, {
			'heapValue': 4
		}, {
			'heapValue': 1
		}, {
			'heapValue': 2
		}];
		maxH.currentSize = 7;

		// Used in percDown you would start from i = 1
		for (var i = 1;
			(i * 2) <= 7; i++) {
			switch (i) {
				case 1:
					assert.equal((i * 2), minH.__minChildPosition(i));
					assert.equal((i * 2) + 1, maxH.__maxChildPosition(i));
					break;
				case 2:
					assert.equal(i * 2 + 1, minH.__minChildPosition(i));
					assert.equal(i * 2, maxH.__maxChildPosition(i));
					break;
				case 3:
					assert.equal(i * 2, minH.__minChildPosition(i));
					assert.equal(i * 2 + 1, maxH.__maxChildPosition(i));
					break;
				case 4:
					assert.equal(i * 2, minH.__minChildPosition(i));
					assert.equal(i * 2, maxH.__maxChildPosition(i));
					break;
			}
		}
	});

	it("should percUp properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		minH.heapList = [{
			'heapValue': 0
		}, {
			'heapValue': 5
		}, {
			'heapValue': 2
		}, {
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}];
		minH.currentSize = 5;

		maxH.heapList = [{
			'heapValue': Infinity
		}, {
			'heapValue': 1
		}, {
			'heapValue': 8
		}, {
			'heapValue': 9
		}, {
			'heapValue': 5
		}, {
			'heapValue': 6
		}];
		maxH.currentSize = 5;

		minH.__percUp(5);
		maxH.__percUp(5);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 2
		}, {
			'heapValue': 5
		}, {
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 8
		}, {
			'heapValue': 1
		}, {
			'heapValue': 9
		}, {
			'heapValue': 5
		}, {
			'heapValue': 6
		}]);

		minH.__percUp(4);
		maxH.__percUp(4);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 2
		}, {
			'heapValue': 3
		}, {
			'heapValue': 1
		}, {
			'heapValue': 5
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 8
		}, {
			'heapValue': 5
		}, {
			'heapValue': 9
		}, {
			'heapValue': 1
		}, {
			'heapValue': 6
		}]);

		minH.__percUp(3);
		maxH.__percUp(3);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 5
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 9
		}, {
			'heapValue': 5
		}, {
			'heapValue': 8
		}, {
			'heapValue': 1
		}, {
			'heapValue': 6
		}]);

		minH.__percUp(2);
		maxH.__percUp(2);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 5
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 9
		}, {
			'heapValue': 5
		}, {
			'heapValue': 8
		}, {
			'heapValue': 1
		}, {
			'heapValue': 6
		}]);

	});

	it("should percDown properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		minH.heapList = [{
			'heapValue': 0
		}, {
			'heapValue': 5
		}, {
			'heapValue': 2
		}, {
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}];
		minH.currentSize = 5;

		maxH.heapList = [{
			'heapValue': Infinity
		}, {
			'heapValue': 1
		}, {
			'heapValue': 8
		}, {
			'heapValue': 5
		}, {
			'heapValue': 9
		}, {
			'heapValue': 6
		}];
		maxH.currentSize = 5;

		minH.__percDown(1);
		maxH.__percDown(1);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 1
		}, {
			'heapValue': 2
		}, {
			'heapValue': 5
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 8
		}, {
			'heapValue': 9
		}, {
			'heapValue': 5
		}, {
			'heapValue': 1
		}, {
			'heapValue': 6
		}]);

		minH.__percDown(1); // Tree already sorted, short yeild same results
		maxH.__percDown(1);
		assert.deepEqual(minH.heapList, [{
			'heapValue': 0
		}, {
			'heapValue': 1
		}, {
			'heapValue': 2
		}, {
			'heapValue': 5
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity
		}, {
			'heapValue': 9
		}, {
			'heapValue': 8
		}, {
			'heapValue': 5
		}, {
			'heapValue': 1
		}, {
			'heapValue': 6
		}]);

	});

	it("should update object properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		var foo1 = {
			'foo': 'bar1'
		};
		var foo2 = {
			'foo': 'bar2'
		};

		minH.heapList = [{
			'heapValue': 0,
			'object': {}
		}, {
			'heapValue': 1,
			'object': {}
		}, {
			'heapValue': 2,
			'object': foo1
		}, {
			'heapValue': 3,
			'object': foo2
		}, {
			'heapValue': 4,
			'object': {}
		}];
		minH.currentSize = 4;

		maxH.heapList = [{
			'heapValue': Infinity,
			'object': {}
		}, {
			'heapValue': 4,
			'object': {}
		}, {
			'heapValue': 3,
			'object': foo1
		}, {
			'heapValue': 2,
			'object': foo2
		}, {
			'heapValue': 1,
			'object': {}
		}];
		maxH.currentSize = 4;

		// Should percDown object
		minH.update(foo1, 5);
		maxH.update(foo1, 0);

		assert.deepEqual(minH.heapList, [{
			'heapValue': 0,
			'object': {}
		}, {
			'heapValue': 1,
			'object': {}
		}, {
			'heapValue': 4,
			'object': {}
		}, {
			'heapValue': 3,
			'object': foo2
		}, {
			'heapValue': 5,
			'object': foo1
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity,
			'object': {}
		}, {
			'heapValue': 4,
			'object': {}
		}, {
			'heapValue': 1,
			'object': {}
		}, {
			'heapValue': 2,
			'object': foo2
		}, {
			'heapValue': 0,
			'object': foo1
		}]);

		// Should percUp object
		minH.update(foo2, 0);
		maxH.update(foo2, 5);

		assert.deepEqual(minH.heapList, [{
			'heapValue': 0,
			'object': {}
		}, {
			'heapValue': 0,
			'object': foo2
		}, {
			'heapValue': 4,
			'object': {}
		}, {
			'heapValue': 1,
			'object': {}
		}, {
			'heapValue': 5,
			'object': foo1
		}]);
		assert.deepEqual(maxH.heapList, [{
			'heapValue': Infinity,
			'object': {}
		}, {
			'heapValue': 5,
			'object': foo2
		}, {
			'heapValue': 1,
			'object': {}
		}, {
			'heapValue': 4,
			'object': {}
		}, {
			'heapValue': 0,
			'object': foo1
		}]);
	});

	it("should remove object properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		var foo1 = {
			'foo': 'bar1'
		};
		var foo2 = {
			'foo': 'bar2'
		};
		var foo3 = {
			'foo': 'bar3'
		};

		minH.heapList = [{
			'heapValue': 0,
			'object': {}
		}, {
			'heapValue': 1,
			'object': foo1
		}, {
			'heapValue': 2,
			'object': foo2
		}];
		minH.currentSize = 2;

		maxH.heapList = [{
			'heapValue': Infinity,
			'object': {}
		}, {
			'heapValue': 2,
			'object': foo1
		}, {
			'heapValue': 1,
			'object': foo2
		}];
		maxH.currentSize = 2;

		// Should have no effect as foo3 is not in the heaps, but return head
		assert.deepEqual(minH.remove(foo3), minH.headValue());
		assert.deepEqual(maxH.remove(foo3), maxH.headValue());
		console.log(minH.list(), maxH.list())
		assert.equal(minH.size, 2);
		assert.equal(maxH.size, 2);

		// Should return head after removal
		assert.equal(minH.remove(foo1), minH.headValue());
		assert.equal(maxH.remove(foo1), maxH.headValue());
		assert.equal(minH.size, 1);
		assert.equal(maxH.size, 1);

		// Should return Infinity as heapList is now empty
		assert.equal(minH.remove(foo2), Infinity);
		assert.equal(maxH.remove(foo2), Infinity);
		assert.equal(minH.size, 0);
		assert.equal(maxH.size, 0);
	});

	it("should build heapList properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		minH.buildHeap([{
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 1
		}, {
			'heapValue': 4
		}]);

		maxH.buildHeap([{
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 4
		}]);

		assert.deepEqual(minH.list(), [{
			'heapValue': 0,
			'object': {}
		}, {
			'heapValue': 1
		}, {
			'heapValue': 2
		}, {
			'heapValue': 3
		}, {
			'heapValue': 4
		}]);
		assert.equal(minH.size, 4);

		assert.deepEqual(maxH.list(), [{
			'heapValue': Infinity,
			'object': {}
		}, {
			'heapValue': 4
		}, {
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 1
		}]);
		assert.equal(maxH.size, 4);
	});

	it("should empty heap properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		minH.buildHeap([{
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 1
		}, {
			'heapValue': 4
		}]);

		maxH.buildHeap([{
			'heapValue': 1
		}, {
			'heapValue': 3
		}, {
			'heapValue': 2
		}, {
			'heapValue': 4
		}]);

		minH.empty();
		maxH.empty();

		assert.deepEqual(minH.list(), [{
			'object': {},
			'heapValue': 0
		}]);
		assert.deepEqual(maxH.list(), [{
			'object': {},
			'heapValue': Infinity
		}]);

		assert.equal(minH.size, 0);
		assert.equal(maxH.size, 0)
	});

	it("should insert properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		var foo = {
			'foo': 'bar'
		};

		// Insert a value with object ref
		minH.insert(2, foo);
		assert.deepEqual(minH.headObject(), foo);
		assert.equal(minH.size, 1);

		maxH.insert(2, foo);
		assert.deepEqual(maxH.headObject(), foo);
		assert.equal(maxH.size, 1);

		// Insert a value without object ref
		minH.insert(1);
		assert.deepEqual(minH.headObject(), {});
		assert.equal(minH.size, 2);

		maxH.insert(3);
		assert.deepEqual(maxH.headObject(), {});
		assert.equal(maxH.size, 2);
	});

	it("should tell if contains object properly", function() {
		var minH = new MinHeap();
		var maxH = new MaxHeap();

		var foo1 = {
			'foo': 'bar1'
		};
		var foo2 = {
			'foo': 'bar2'
		};

		// Insert a value with object ref
		minH.insert(1, foo1);
		assert.equal(minH.contains(foo1), 1); // Should return index 1
		assert.equal(minH.contains(foo2), -1); // Should return -1

		maxH.insert(1, foo1);
		assert.equal(maxH.contains(foo1), 1); // Should return 1
		assert.equal(maxH.contains(foo2), -1); // Should return -1

	});

});