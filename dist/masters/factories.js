"use strict";

// schedulers should be singletons
var Scheduler = require("./scheduler");
var SimpleScheduler = require("./simple-scheduler");
var scheduler = null;
var simpleScheduler = null;

// scheduler factory
module.exports.getScheduler = function (audioContext) {
  if (scheduler === null) {
    scheduler = new Scheduler(audioContext, {});
  }

  return scheduler;
};

module.exports.getSimpleScheduler = function (audioContext) {
  if (simpleScheduler === null) {
    simpleScheduler = new SimpleScheduler(audioContext, {});
  }

  return simpleScheduler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9wcmlvcml0eS1xdWV1ZS5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7OztBQUczQixNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxVQUFTLFlBQVksRUFBRTtBQUNuRCxNQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7QUFDdEIsYUFBUyxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUM3Qzs7QUFFRCxTQUFPLFNBQVMsQ0FBQztDQUNsQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxZQUFZLEVBQUU7QUFDekQsTUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO0FBQzVCLG1CQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3pEOztBQUVELFNBQU8sZUFBZSxDQUFDO0NBQ3hCLENBQUMiLCJmaWxlIjoic3JjL3V0aWxzL3ByaW9yaXR5LXF1ZXVlLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gc2NoZWR1bGVycyBzaG91bGQgYmUgc2luZ2xldG9uc1xudmFyIFNjaGVkdWxlciA9IHJlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG52YXIgU2ltcGxlU2NoZWR1bGVyID0gcmVxdWlyZSgnLi9zaW1wbGUtc2NoZWR1bGVyJyk7XG52YXIgc2NoZWR1bGVyID0gbnVsbDtcbnZhciBzaW1wbGVTY2hlZHVsZXIgPSBudWxsO1xuXG4vLyBzY2hlZHVsZXIgZmFjdG9yeVxubW9kdWxlLmV4cG9ydHMuZ2V0U2NoZWR1bGVyID0gZnVuY3Rpb24oYXVkaW9Db250ZXh0KSB7XG4gIGlmIChzY2hlZHVsZXIgPT09IG51bGwpIHtcbiAgICBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKGF1ZGlvQ29udGV4dCwge30pO1xuICB9XG5cbiAgcmV0dXJuIHNjaGVkdWxlcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldFNpbXBsZVNjaGVkdWxlciA9IGZ1bmN0aW9uKGF1ZGlvQ29udGV4dCkge1xuICBpZiAoc2ltcGxlU2NoZWR1bGVyID09PSBudWxsKSB7XG4gICAgc2ltcGxlU2NoZWR1bGVyID0gbmV3IFNpbXBsZVNjaGVkdWxlcihhdWRpb0NvbnRleHQsIHt9KTtcbiAgfVxuXG4gIHJldHVybiBzaW1wbGVTY2hlZHVsZXI7XG59OyJdfQ==