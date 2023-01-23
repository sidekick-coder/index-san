import type { ClientAppConfig } from '@client/config'
import { contextBridge, ipcRenderer, shell, type OpenDialogReturnValue } from 'electron'

async function useCase(name: string, args?: any) {
    return ipcRenderer.invoke('use-case', name, args)
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
