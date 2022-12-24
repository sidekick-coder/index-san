import { contextBridge, ipcRenderer, shell } from 'electron'

async function useCase(name: string, args?: any) {
    return ipcRenderer.invoke('use-case', name, args)
}

async function openURL(url: string) {
    return shell.openExternal(url)
}

contextBridge.exposeInMainWorld('useCase', useCase)
contextBridge.exposeInMainWorld('openURL', openURL)
