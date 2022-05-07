"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var WINDOW_API = {
    greet: function () { return 'Hello from the preload script'; },
    send: function () { return electron_1.ipcRenderer.invoke('/'); }
};
electron_1.contextBridge.exposeInMainWorld('WINDOW_API', WINDOW_API);
