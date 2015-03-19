// Can be runned by executing node performance-tests/benchmark-priority-queue.js

var Benchmark = require('benchmark');

var PriorityQueue = require('../dist/utils/priority-queue');
var PriorityQueueHeap = require('../dist/utils/priority-queue-heap');

var pq;
var pqh;

var obj1 = {foo: 'bar1'};
var obj2 = {foo: 'bar2'};
var obj3 = {foo: 'bar3'}; 

/**************
* INSERT METHOD
***************/ 
var insert = new Benchmark.Suite;

pq = new PriorityQueue();
pqh = new PriorityQueueHeap();

// add tests 
insert.add('PriorityQueue#Insert', function() {
  pq.insert(obj1, 20);
  pq.insert(obj2, 10);
  pq.insert(obj3, 30);
  pq.clear();
})
.add('PriorityQueue#Insert without sorting', function() {
  pq.insert(obj1, 20, false);
  pq.insert(obj2, 10, false);
  pq.insert(obj3, 30, false);
  pq.clear();
})
.add('PriorityQueueHeap#Insert', function() {
  pqh.insert(obj1, 20);
  pqh.insert(obj2, 10);
  pqh.insert(obj3, 30);
  pqh.clear();
})
.add('PriorityQueueHeap#Build', function() {
  pqh.__heap.buildHeap([{'object': obj1, 'heapValue': 10},{'object': obj2, 'heapValue': 20},{'object': obj3, 'heapValue': 30}]);
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(error) {
	console.log(error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name') + "\n");
})
.run();

/************
* MOVE METHOD
*************/
var move = new Benchmark.Suite;

// add tests 
move.add('PriorityQueue#Move', function() {
	pq.insert(obj1, 20);
	pq.insert(obj2, 10);
	pq.insert(obj3, 30);
  pq.move(obj2, 100);
  pq.move(obj3, 1);
  pq.clear();
})
.add('PriorityQueueHeap#Move', function() {
	pqh.insert(obj1, 20);
	pqh.insert(obj2, 10);
	pqh.insert(obj3, 30);		
  pqh.move(obj2, 100);
  pqh.move(obj3, 1);
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(event) {
	console.log(event.target.error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name')+ "\n");
})
.run();

/**************
* REMOVE METHOD
***************/
var remove = new Benchmark.Suite;

// add tests 
remove.add('PriorityQueue#remove', function() {
	pq.insert(obj1, 20);
	pq.insert(obj2, 10);
	pq.insert(obj3, 30);
  pq.remove(obj1);
  pq.remove(obj2);
  pq.remove(obj3);
  pq.clear();
})
.add('PriorityQueueHeap#remove', function() {
	pqh.insert(obj1, 20);
	pqh.insert(obj2, 10);
	pqh.insert(obj3, 30);		
  pqh.remove(obj1);
  pqh.remove(obj2);
  pqh.remove(obj3);
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(event) {
	console.log(event.target.error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name')+ "\n");
})
.run();

/*************
* CLEAR METHOD
**************/
var clear = new Benchmark.Suite;

// add tests 
clear.add('PriorityQueue#clear', function() {
	pq.insert(obj1, 20);
	pq.insert(obj2, 10);
	pq.insert(obj3, 30);
  pq.clear();
})
.add('PriorityQueueHeap#clear', function() {
	pqh.insert(obj1, 20);
	pqh.insert(obj2, 10);
	pqh.insert(obj3, 30);		
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(event) {
	console.log(event.target.error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name')+ "\n");
})
.run();

/****************
* GET HEAD METHOD
*****************/
var head = new Benchmark.Suite;

// add tests 
head.add('PriorityQueue#head', function() {
	pq.insert(obj1, 20);
	pq.insert(obj2, 10);
	pq.insert(obj3, 30);
  pq.head;
  pq.clear();
})
.add('PriorityQueueHeap#head', function() {
	pqh.insert(obj1, 20);
	pqh.insert(obj2, 10);
	pqh.insert(obj3, 30);	
	pqh.head;	
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(event) {
	console.log(event.target.error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name')+ "\n");
})
.run();

/****************
* GET TIME METHOD
*****************/
var time = new Benchmark.Suite;

// add tests 
time.add('PriorityQueue#time', function() {
	pq.insert(obj1, 20);
	pq.insert(obj2, 10);
	pq.insert(obj3, 30);
  pq.time;
  pq.clear();
})
.add('PriorityQueueHeap#time', function() {
	pqh.insert(obj1, 20);
	pqh.insert(obj2, 10);
	pqh.insert(obj3, 30);	
	pqh.time;	
  pqh.clear();
})
// add listeners 
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('error', function(event) {
	console.log(event.target.error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name')+ "\n");
})
.run();

