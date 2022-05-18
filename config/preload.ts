import { ipcRenderer, contextBridge } from 'electron'

const WINDOW_API = {
  invoke: (name: string, args: any) => {
    return new Promise(async (resolve, reject) => {
      const result = await ipcRenderer.invoke(name, {
        ...args,
      })

      if (result.error) {
        reject(result.error)
      }

      resolve(result.data)
    })
  },
}

contextBridge.exposeInMainWorld('WINDOW_API', WINDOW_API)
