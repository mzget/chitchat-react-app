"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var AutoLaunch = require('auto-launch');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var url = require('url');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1280, height: 720 });
    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, '/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))
    var startUrl = process.env.ELECTRON_START_URL || "https://chitchats.ga";
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.on('did-finish-load', function () {
        // mainWindow.webContents.executeJavaScript('fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())', true)
        //   .then((result) => {
        //     console.log(result) // Will be the JSON object from the fetch call
        //   })
        mainWindow.webContents.send('ping', 'whoooooooh!');
        app.dock.setBadge("");
    });
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var chitchatAutoLauncher = new AutoLaunch({
    name: app.getName(),
    mac: {
        useLaunchAgent: true
    }
});
chitchatAutoLauncher.enable();
//minecraftAutoLauncher.disable();
chitchatAutoLauncher.isEnabled().then(function (isEnabled) {
    console.log("AutoLaunch", isEnabled);
    if (isEnabled) {
        return;
    }
    chitchatAutoLauncher.enable();
}).catch(function (err) {
    // handle error
});
