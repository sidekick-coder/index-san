import { ipcRenderer, contextBridge } from 'electron';

const WINDOW_API = {
    invoke: (name: string, args: any) => ipcRenderer.invoke(name, {
        ...args,
    }),
}

contextBridge.exposeInMainWorld('WINDOW_API', WINDOW_API);