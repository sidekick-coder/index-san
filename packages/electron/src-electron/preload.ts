import type { ClientAppConfig } from '@index-san/app/config'
import { contextBridge, ipcRenderer, shell, type OpenDialogReturnValue } from 'electron'

async function useCase(name: string, args?: any) {
    const response = await ipcRenderer.invoke('use-case', name, args)

    if (response.error) return Promise.reject(response.error)

    return Promise.resolve(response.result)
}

const electronConfig: ClientAppConfig = {
    useCase,
    open: {
        url: shell.openExternal,
        directory: async () => {
            const result: OpenDialogReturnValue = await ipcRenderer.invoke(
                'dialog:show-open-dialog',
                {
                    properties: ['openDirectory'],
                }
            )

            if (!result.filePaths.length) throw new Error('Nothing selected')

            return result.filePaths[0]
        },
    },
}

contextBridge.exposeInMainWorld('electronConfig', electronConfig)
