import { ipcRenderer, contextBridge } from 'electron';

const WINDOW_API = {
    greet: () => 'Hello from the preload script',
    send: () => ipcRenderer.invoke('/'),
}

contextBridge.exposeInMainWorld('WINDOW_API', WINDOW_API);