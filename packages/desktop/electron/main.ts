import { BrowserWindow, ipcMain, app } from 'electron'
import path from 'path'
import ListWorkspaces from '../../core/use-cases/list-workspaces/list-workspaces'
import WorkspaceRepository from './repositories/workspace-repository'
interface IUseCase {
    execute(args:any): Promise<any>
}

const workspaceRepository = new WorkspaceRepository(
    path.resolve(app.getPath('userData'), 'workspaces.json')
)

const options: Record<string, IUseCase> = {
    'list-workspaces': new ListWorkspaces(workspaceRepository)
}


app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            // contextIsolation: true,
            // nodeIntegration: true,
        }
    })

    ipcMain.handle('use-case', (_, name, args) => {
        const option = options[name]

        if (!option) return

        return option.execute(args)
    })
      
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    } else {
        win.loadFile('build/index.html')
    }
})