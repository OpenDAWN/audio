"use strict";

// monkeypatch old webAudioAPI
require("./ac-monkeypatch");

// exposes a single instance
var audioContext;

if (window.AudioContext) audioContext = new window.AudioContext();

module.exports = audioContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2F1ZGlvLWNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7OztBQUc1QixJQUFJLFlBQVksQ0FBQzs7QUFFakIsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUNyQixZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7O0FBRTNDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2F1ZGlvLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb25rZXlwYXRjaCBvbGQgd2ViQXVkaW9BUElcbnJlcXVpcmUoJy4vYWMtbW9ua2V5cGF0Y2gnKTtcblxuLy8gZXhwb3NlcyBhIHNpbmdsZSBpbnN0YW5jZVxudmFyIGF1ZGlvQ29udGV4dDtcblxuaWYgKHdpbmRvdy5BdWRpb0NvbnRleHQpXG4gIGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXVkaW9Db250ZXh0OyJdfQ==