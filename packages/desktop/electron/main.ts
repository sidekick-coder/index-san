import { BrowserWindow, ipcMain, app } from 'electron'
import path from 'path'

import DriveManager from '../../core/gateways/drive-manager'
import ListWorkspaces from '../../core/use-cases/list-workspaces/list-workspaces'
import CreateWorkspace from '../../core/use-cases/create-workspace/create-workspace'
import WorkspaceRepository from './repositories/workspace-repository'

import FSDrive from './gateways/fs-drive'
import DeleteWorkspace from '../../core/use-cases/delete-workspace/delete-workspace'

interface IUseCase {
    execute(args:any): Promise<any>
}

const workspaceRepository = new WorkspaceRepository(
    path.resolve(app.getPath('userData'), 'workspaces.json')
)

const fsDrive = new FSDrive()
const driveManager = new DriveManager({ fs: fsDrive })

const options: Record<string, IUseCase> = {
    'list-workspaces': new ListWorkspaces(workspaceRepository),
    'create-workspace': new CreateWorkspace(workspaceRepository, driveManager),
    'delete-workspace': new DeleteWorkspace(workspaceRepository)
}

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
        }
    })

    ipcMain.handle('use-case', (_, name, args) => {
        const option = options[name]

        if (!option) {
            throw new Error(`use-case "${name}" not found`)
        }

        return option.execute(args)
    })
      
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    } else {
        win.loadFile('build/index.html')
    }
})