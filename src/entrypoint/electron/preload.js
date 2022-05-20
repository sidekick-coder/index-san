const { ipcRenderer, contextBridge } = require('electron')

function useCase(name, args) {
  return ipcRenderer.invoke(`use-case:${name}`, {
    ...args,
  })
}

contextBridge.exposeInMainWorld('useCase', useCase)
