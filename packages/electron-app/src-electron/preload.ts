import { contextBridge, ipcRenderer, shell } from 'electron'

async function useCase(name: string, args?: any) {
    return ipcRenderer.invoke('use-case', name, args)
}

const electronConfig = {
    useCase,
    open: {
        url: shell.openExternal,
    },
}

contextBridge.exposeInMainWorld('electronConfig', electronConfig)
