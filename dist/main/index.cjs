"use strict";
const electron = require("electron");
const Store = require("electron-store");
const isDev = require("electron-is-dev");
const path = require("path");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const Store__default = /* @__PURE__ */ _interopDefaultLegacy(Store);
const isDev__default = /* @__PURE__ */ _interopDefaultLegacy(isDev);
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const version = "2.0.1";
const store = new Store__default.default();
let notificationSettings = {
  resetNotification: store.get("reset") || true,
  reminderNotification: store.get("reminder") || "hour"
};
let mainWindow = {
  show: () => {
    console.log("show");
  }
};
let willQuit = false;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    minWidth: 320,
    height: 600,
    fullscreenable: true,
    backgroundColor: "#403F4D",
    icon: path__default.default.join(electron.app.getAppPath(), "assets/png/128x128.png"),
    webPreferences: {
      preload: path__default.default.join(electron.app.getAppPath(), "dist/preload/index.cjs")
    }
  });
  mainWindow.loadURL(
    isDev__default.default ? "http://localhost:5173" : new URL("../dist/renderer/index.html", "file://" + __dirname).toString()
  );
}
function menuSetup() {
  const menuTemplate = [
    {
      label: "todometer",
      submenu: [
        {
          label: "About",
          click: () => {
            electron.dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About",
              message: "todometer is built by @cassidoo",
              detail: "You can find her on most things @cassidoo, or on her website cassidoo.co.",
              icon: path__default.default.join(electron.app.getAppPath(), "assets/png/64x64.png")
            });
          }
        },
        {
          label: "Contribute (v" + version + ")",
          click: () => {
            electron.shell.openExternal("https://github.com/cassidoo/todometer");
          }
        },
        {
          type: "separator"
        },
        {
          label: "Dev tools",
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: "Quit",
          accelerator: "CommandOrControl+Q",
          click: () => {
            electron.app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectall" }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          type: "separator"
        },
        { role: "reload" },
        { role: "togglefullscreen" },
        { role: "minimize" },
        { role: "close" }
      ]
    },
    {
      label: "Notifications",
      submenu: [
        {
          label: "Enable reset notification",
          type: "checkbox",
          checked: store.get("reset"),
          click: (e) => {
            notificationSettings.resetNotification = e.checked;
            mainWindow.webContents.send(
              "notificationSettingsChange",
              notificationSettings
            );
            store.set("reset", e.checked);
          }
        },
        {
          label: "Reminder notifications",
          submenu: [
            {
              label: "Never",
              type: "radio",
              checked: store.get("reminder") === "never",
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = "never";
                  mainWindow.webContents.send(
                    "notificationSettingsChange",
                    notificationSettings
                  );
                  store.set("reminder", "never");
                }
              }
            },
            {
              label: "Every 5 minutes",
              type: "radio",
              checked: store.get("reminder") === "fiveminutes",
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = "fiveminutes";
                  mainWindow.webContents.send(
                    "notificationSettingsChange",
                    notificationSettings
                  );
                  store.set("reminder", "fiveminutes");
                }
              }
            },
            {
              label: "Every 15 minutes",
              type: "radio",
              checked: store.get("reminder") === "quarterhour",
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = "quarterhour";
                  mainWindow.webContents.send(
                    "notificationSettingsChange",
                    notificationSettings
                  );
                  store.set("reminder", "quarterhour");
                }
              }
            },
            {
              label: "Every 30 minutes",
              type: "radio",
              checked: store.get("reminder") === "halfhour",
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = "halfhour";
                  mainWindow.webContents.send(
                    "notificationSettingsChange",
                    notificationSettings
                  );
                  store.set("reminder", "halfhour");
                }
              }
            },
            {
              label: "Every hour",
              type: "radio",
              checked: store.get("reminder") === "hour",
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = "hour";
                  mainWindow.webContents.send(
                    "notificationSettingsChange",
                    notificationSettings
                  );
                  store.set("reminder", "hour");
                }
              }
            }
          ]
        },
        {
          label: "Show example notification",
          click: (e) => {
            let exNotification = new electron.Notification({
              title: "todometer reminder!",
              body: "Here's an example todometer notification!",
              silent: false,
              sound: path__default.default.join(
                electron.app.getAppPath(),
                "assets/notification/pingyping.wav"
              )
            });
            exNotification.show();
          }
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(menuTemplate);
  electron.Menu.setApplicationMenu(menu);
}
electron.app.on("ready", () => {
  createWindow();
  menuSetup();
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send(
      "notificationSettingsChange",
      notificationSettings
    );
  });
  electron.powerMonitor.on("resume", () => {
    mainWindow.reload();
  });
  mainWindow.on("close", (e) => {
    if (willQuit || process.platform === "win32") {
      mainWindow = null;
      electron.app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
});
electron.app.on("activate", () => mainWindow.show());
electron.app.on("before-quit", () => willQuit = true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFpbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRhcHAsXG5cdEJyb3dzZXJXaW5kb3csXG5cdE1lbnUsXG5cdGRpYWxvZyxcblx0cG93ZXJNb25pdG9yLFxuXHRzaGVsbCxcblx0Tm90aWZpY2F0aW9uLFxufSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiZWxlY3Ryb24tc3RvcmVcIjtcbmltcG9ydCBpc0RldiBmcm9tIFwiZWxlY3Ryb24taXMtZGV2XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gXCIuLi8uLi9wYWNrYWdlLmpzb25cIjtcblxuY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoKTtcblxubGV0IG5vdGlmaWNhdGlvblNldHRpbmdzID0ge1xuXHRyZXNldE5vdGlmaWNhdGlvbjogc3RvcmUuZ2V0KFwicmVzZXRcIikgfHwgdHJ1ZSxcblx0cmVtaW5kZXJOb3RpZmljYXRpb246IHN0b3JlLmdldChcInJlbWluZGVyXCIpIHx8IFwiaG91clwiLFxufTtcblxubGV0IG1haW5XaW5kb3cgPSB7XG5cdHNob3c6ICgpID0+IHtcblx0XHRjb25zb2xlLmxvZyhcInNob3dcIik7XG5cdH0sXG59OyAvLyB0ZW1wIG9iamVjdCB3aGlsZSBhcHAgbG9hZHNcbmxldCB3aWxsUXVpdCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG5cdG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG5cdFx0d2lkdGg6IDgwMCxcblx0XHRtaW5XaWR0aDogMzIwLFxuXHRcdGhlaWdodDogNjAwLFxuXHRcdGZ1bGxzY3JlZW5hYmxlOiB0cnVlLFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjNDAzRjREXCIsXG5cdFx0aWNvbjogcGF0aC5qb2luKGFwcC5nZXRBcHBQYXRoKCksIFwiYXNzZXRzL3BuZy8xMjh4MTI4LnBuZ1wiKSxcblx0XHR3ZWJQcmVmZXJlbmNlczoge1xuXHRcdFx0cHJlbG9hZDogcGF0aC5qb2luKGFwcC5nZXRBcHBQYXRoKCksIFwiZGlzdC9wcmVsb2FkL2luZGV4LmNqc1wiKSxcblx0XHR9LFxuXHR9KTtcblxuXHRtYWluV2luZG93LmxvYWRVUkwoXG5cdFx0aXNEZXZcblx0XHRcdD8gXCJodHRwOi8vbG9jYWxob3N0OjUxNzNcIlxuXHRcdFx0OiBuZXcgVVJMKFwiLi4vZGlzdC9yZW5kZXJlci9pbmRleC5odG1sXCIsIFwiZmlsZTovL1wiICsgX19kaXJuYW1lKS50b1N0cmluZygpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIG1lbnVTZXR1cCgpIHtcblx0Y29uc3QgbWVudVRlbXBsYXRlID0gW1xuXHRcdHtcblx0XHRcdGxhYmVsOiBcInRvZG9tZXRlclwiLFxuXHRcdFx0c3VibWVudTogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGFiZWw6IFwiQWJvdXRcIixcblx0XHRcdFx0XHRjbGljazogKCkgPT4ge1xuXHRcdFx0XHRcdFx0ZGlhbG9nLnNob3dNZXNzYWdlQm94KG1haW5XaW5kb3csIHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJpbmZvXCIsXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBcIkFib3V0XCIsXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwidG9kb21ldGVyIGlzIGJ1aWx0IGJ5IEBjYXNzaWRvb1wiLFxuXHRcdFx0XHRcdFx0XHRkZXRhaWw6XG5cdFx0XHRcdFx0XHRcdFx0XCJZb3UgY2FuIGZpbmQgaGVyIG9uIG1vc3QgdGhpbmdzIEBjYXNzaWRvbywgb3Igb24gaGVyIHdlYnNpdGUgY2Fzc2lkb28uY28uXCIsXG5cdFx0XHRcdFx0XHRcdGljb246IHBhdGguam9pbihhcHAuZ2V0QXBwUGF0aCgpLCBcImFzc2V0cy9wbmcvNjR4NjQucG5nXCIpLFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhYmVsOiBcIkNvbnRyaWJ1dGUgKHZcIiArIHZlcnNpb24gKyBcIilcIixcblx0XHRcdFx0XHRjbGljazogKCkgPT4ge1xuXHRcdFx0XHRcdFx0c2hlbGwub3BlbkV4dGVybmFsKFwiaHR0cHM6Ly9naXRodWIuY29tL2Nhc3NpZG9vL3RvZG9tZXRlclwiKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dHlwZTogXCJzZXBhcmF0b3JcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8qIEZvciBkZWJ1Z2dpbmcgKi9cblx0XHRcdFx0XHRsYWJlbDogXCJEZXYgdG9vbHNcIixcblx0XHRcdFx0XHRjbGljazogKCkgPT4ge1xuXHRcdFx0XHRcdFx0bWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGFiZWw6IFwiUXVpdFwiLFxuXHRcdFx0XHRcdGFjY2VsZXJhdG9yOiBcIkNvbW1hbmRPckNvbnRyb2wrUVwiLFxuXHRcdFx0XHRcdGNsaWNrOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRhcHAucXVpdCgpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6IFwiRWRpdFwiLFxuXHRcdFx0c3VibWVudTogW1xuXHRcdFx0XHR7IHJvbGU6IFwidW5kb1wiIH0sXG5cdFx0XHRcdHsgcm9sZTogXCJyZWRvXCIgfSxcblx0XHRcdFx0eyByb2xlOiBcImN1dFwiIH0sXG5cdFx0XHRcdHsgcm9sZTogXCJjb3B5XCIgfSxcblx0XHRcdFx0eyByb2xlOiBcInBhc3RlXCIgfSxcblx0XHRcdFx0eyByb2xlOiBcImRlbGV0ZVwiIH0sXG5cdFx0XHRcdHsgcm9sZTogXCJzZWxlY3RhbGxcIiB9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdGxhYmVsOiBcIlZpZXdcIixcblx0XHRcdHN1Ym1lbnU6IFtcblx0XHRcdFx0Ly8ge1xuXHRcdFx0XHQvLyAgIGxhYmVsOiBcIkxpZ2h0IG1vZGVcIixcblx0XHRcdFx0Ly8gICB0eXBlOiBcImNoZWNrYm94XCIsXG5cdFx0XHRcdC8vICAgY2hlY2tlZDogZmFsc2UsXG5cdFx0XHRcdC8vICAgY2xpY2s6IGUgPT4ge1xuXHRcdFx0XHQvLyAgICAgbWFpbldpbmRvdy5pc0xpZ2h0TW9kZSA9IGUuY2hlY2tlZDtcblx0XHRcdFx0Ly8gICB9XG5cdFx0XHRcdC8vIH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiBcInNlcGFyYXRvclwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7IHJvbGU6IFwicmVsb2FkXCIgfSxcblx0XHRcdFx0eyByb2xlOiBcInRvZ2dsZWZ1bGxzY3JlZW5cIiB9LFxuXHRcdFx0XHR7IHJvbGU6IFwibWluaW1pemVcIiB9LFxuXHRcdFx0XHR7IHJvbGU6IFwiY2xvc2VcIiB9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdGxhYmVsOiBcIk5vdGlmaWNhdGlvbnNcIixcblx0XHRcdHN1Ym1lbnU6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhYmVsOiBcIkVuYWJsZSByZXNldCBub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHR0eXBlOiBcImNoZWNrYm94XCIsXG5cdFx0XHRcdFx0Y2hlY2tlZDogc3RvcmUuZ2V0KFwicmVzZXRcIiksXG5cdFx0XHRcdFx0Y2xpY2s6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRub3RpZmljYXRpb25TZXR0aW5ncy5yZXNldE5vdGlmaWNhdGlvbiA9IGUuY2hlY2tlZDtcblx0XHRcdFx0XHRcdG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChcblx0XHRcdFx0XHRcdFx0XCJub3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLFxuXHRcdFx0XHRcdFx0XHRub3RpZmljYXRpb25TZXR0aW5nc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHN0b3JlLnNldChcInJlc2V0XCIsIGUuY2hlY2tlZCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhYmVsOiBcIlJlbWluZGVyIG5vdGlmaWNhdGlvbnNcIixcblx0XHRcdFx0XHRzdWJtZW51OiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBcIk5ldmVyXCIsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwicmFkaW9cIixcblx0XHRcdFx0XHRcdFx0Y2hlY2tlZDogc3RvcmUuZ2V0KFwicmVtaW5kZXJcIikgPT09IFwibmV2ZXJcIixcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3MucmVtaW5kZXJOb3RpZmljYXRpb24gPSBcIm5ldmVyXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwibm90aWZpY2F0aW9uU2V0dGluZ3NDaGFuZ2VcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3Ncblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdG9yZS5zZXQoXCJyZW1pbmRlclwiLCBcIm5ldmVyXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBcIkV2ZXJ5IDUgbWludXRlc1wiLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInJhZGlvXCIsXG5cdFx0XHRcdFx0XHRcdGNoZWNrZWQ6IHN0b3JlLmdldChcInJlbWluZGVyXCIpID09PSBcImZpdmVtaW51dGVzXCIsXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvblNldHRpbmdzLnJlbWluZGVyTm90aWZpY2F0aW9uID0gXCJmaXZlbWludXRlc1wiO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIm5vdGlmaWNhdGlvblNldHRpbmdzQ2hhbmdlXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvblNldHRpbmdzXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RvcmUuc2V0KFwicmVtaW5kZXJcIiwgXCJmaXZlbWludXRlc1wiKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsYWJlbDogXCJFdmVyeSAxNSBtaW51dGVzXCIsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwicmFkaW9cIixcblx0XHRcdFx0XHRcdFx0Y2hlY2tlZDogc3RvcmUuZ2V0KFwicmVtaW5kZXJcIikgPT09IFwicXVhcnRlcmhvdXJcIixcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3MucmVtaW5kZXJOb3RpZmljYXRpb24gPSBcInF1YXJ0ZXJob3VyXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwibm90aWZpY2F0aW9uU2V0dGluZ3NDaGFuZ2VcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3Ncblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdG9yZS5zZXQoXCJyZW1pbmRlclwiLCBcInF1YXJ0ZXJob3VyXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBcIkV2ZXJ5IDMwIG1pbnV0ZXNcIixcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJyYWRpb1wiLFxuXHRcdFx0XHRcdFx0XHRjaGVja2VkOiBzdG9yZS5nZXQoXCJyZW1pbmRlclwiKSA9PT0gXCJoYWxmaG91clwiLFxuXHRcdFx0XHRcdFx0XHRjbGljazogKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZS5jaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRub3RpZmljYXRpb25TZXR0aW5ncy5yZW1pbmRlck5vdGlmaWNhdGlvbiA9IFwiaGFsZmhvdXJcIjtcblx0XHRcdFx0XHRcdFx0XHRcdG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJub3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub3RpZmljYXRpb25TZXR0aW5nc1xuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdHN0b3JlLnNldChcInJlbWluZGVyXCIsIFwiaGFsZmhvdXJcIik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGFiZWw6IFwiRXZlcnkgaG91clwiLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInJhZGlvXCIsXG5cdFx0XHRcdFx0XHRcdGNoZWNrZWQ6IHN0b3JlLmdldChcInJlbWluZGVyXCIpID09PSBcImhvdXJcIixcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3MucmVtaW5kZXJOb3RpZmljYXRpb24gPSBcImhvdXJcIjtcblx0XHRcdFx0XHRcdFx0XHRcdG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJub3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub3RpZmljYXRpb25TZXR0aW5nc1xuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdHN0b3JlLnNldChcInJlbWluZGVyXCIsIFwiaG91clwiKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsYWJlbDogXCJTaG93IGV4YW1wbGUgbm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0Y2xpY2s6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgZXhOb3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKHtcblx0XHRcdFx0XHRcdFx0dGl0bGU6IFwidG9kb21ldGVyIHJlbWluZGVyIVwiLFxuXHRcdFx0XHRcdFx0XHRib2R5OiBcIkhlcmUncyBhbiBleGFtcGxlIHRvZG9tZXRlciBub3RpZmljYXRpb24hXCIsXG5cdFx0XHRcdFx0XHRcdHNpbGVudDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdHNvdW5kOiBwYXRoLmpvaW4oXG5cdFx0XHRcdFx0XHRcdFx0YXBwLmdldEFwcFBhdGgoKSxcblx0XHRcdFx0XHRcdFx0XHRcImFzc2V0cy9ub3RpZmljYXRpb24vcGluZ3lwaW5nLndhdlwiXG5cdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGV4Tm90aWZpY2F0aW9uLnNob3coKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRdO1xuXHRjb25zdCBtZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZShtZW51VGVtcGxhdGUpO1xuXHRNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcbn1cblxuYXBwLm9uKFwicmVhZHlcIiwgKCkgPT4ge1xuXHRjcmVhdGVXaW5kb3coKTtcblx0bWVudVNldHVwKCk7XG5cblx0bWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRpZC1maW5pc2gtbG9hZFwiLCAoKSA9PiB7XG5cdFx0bWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKFxuXHRcdFx0XCJub3RpZmljYXRpb25TZXR0aW5nc0NoYW5nZVwiLFxuXHRcdFx0bm90aWZpY2F0aW9uU2V0dGluZ3Ncblx0XHQpO1xuXHR9KTtcblxuXHRwb3dlck1vbml0b3Iub24oXCJyZXN1bWVcIiwgKCkgPT4ge1xuXHRcdG1haW5XaW5kb3cucmVsb2FkKCk7XG5cdH0pO1xuXG5cdC8vIE9uIE1hYywgdGhpcyB3aWxsIGhpZGUgdGhlIHdpbmRvd1xuXHQvLyBPbiBXaW5kb3dzLCB0aGUgYXBwIHdpbGwgY2xvc2UgYW5kIHF1aXRcblx0bWFpbldpbmRvdy5vbihcImNsb3NlXCIsIChlKSA9PiB7XG5cdFx0aWYgKHdpbGxRdWl0IHx8IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuXHRcdFx0bWFpbldpbmRvdyA9IG51bGw7XG5cdFx0XHRhcHAucXVpdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRtYWluV2luZG93LmhpZGUoKTtcblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+IG1haW5XaW5kb3cuc2hvdygpKTtcbmFwcC5vbihcImJlZm9yZS1xdWl0XCIsICgpID0+ICh3aWxsUXVpdCA9IHRydWUpKTtcbiJdLCJuYW1lcyI6WyJTdG9yZSIsIkJyb3dzZXJXaW5kb3ciLCJwYXRoIiwiYXBwIiwiaXNEZXYiLCJkaWFsb2ciLCJzaGVsbCIsIk5vdGlmaWNhdGlvbiIsIk1lbnUiLCJwb3dlck1vbml0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFjQSxN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
