import { contextBridge, ipcRenderer } from 'electron'

async function useCase(name: string, args: any) {
    return ipcRenderer.invoke('use-case', name, args)
}

contextBridge.exposeInMainWorld('useCase', useCase)