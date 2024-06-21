"use strict";
const electron = require("electron");
process.once("loaded", () => {
  electron.contextBridge.exposeInMainWorld(
    "onNotificationSettingsChange",
    (callback) => electron.ipcRenderer.on("notificationSettingsChange", (event, args) => {
      callback(args);
    })
  );
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJlbG9hZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5wcm9jZXNzLm9uY2UoXCJsb2FkZWRcIiwgKCkgPT4ge1xuXHQvLyBleHBvc2UgbWV0aG9kcyBmcm9tIG1haW4gdG8gdGhlIHJlbmRlcmVyLiBUaGV5IGFyZSBhdmFpbGFibGUgb24gXCJ3aW5kb3dcIlxuXHRjb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwib25Ob3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLCAoY2FsbGJhY2spID0+XG5cdFx0aXBjUmVuZGVyZXIub24oXCJub3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLCAoZXZlbnQsIGFyZ3MpID0+IHtcblx0XHRcdGNhbGxiYWNrKGFyZ3MpO1xuXHRcdH0pXG5cdCk7XG59KTtcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7O0FBRUEsUUFBUSxLQUFLLFVBQVUsTUFBTTtBQUU1QkEseUJBQWM7QUFBQSxJQUFrQjtBQUFBLElBQWdDLENBQUMsYUFDaEVDLFNBQUFBLFlBQVksR0FBRyw4QkFBOEIsQ0FBQyxPQUFPLFNBQVM7QUFDN0QsZUFBUyxJQUFJO0FBQUEsSUFDaEIsQ0FBRztBQUFBLEVBQ0g7QUFDQSxDQUFDOyJ9
