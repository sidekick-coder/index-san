import { ipcRenderer, contextBridge } from 'electron'
import * as filesystem from '../helpers/filesystem'

const WINDOW_API = {
  filesystem,
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
  get: (route: string) => {
    return new Promise(async (resolve, reject) => {
      const result = await ipcRenderer.invoke('request', 'get', route)

      if (!result.success) {
        return reject(result)
      }

      resolve(result)
    })
  },
  patch: (route: string, data: any) => {
    return new Promise(async (resolve, reject) => {
      const result = await ipcRenderer.invoke('request', 'patch', route, data)

      if (!result.success) {
        return reject(result)
      }

      resolve(result)
    })
  },
}

contextBridge.exposeInMainWorld('WINDOW_API', WINDOW_API)
