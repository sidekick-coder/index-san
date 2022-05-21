const { ipcRenderer, contextBridge } = require('electron')

function useCase(name, args) {
  return ipcRenderer.invoke(`use-case:${name}`, {
    ...args,
  })
}

const electron = {
  showOpenDialog: (args) =>
    ipcRenderer.invoke('electron:show-dialog', {
      ...args,
    }),
}

contextBridge.exposeInMainWorld('useCase', useCase)
contextBridge.exposeInMainWorld('electron', electron)
