import { ipcMain  } from 'electron'


export default async () => {
    const AppController = (await import('../app/controllers/AppController')).default
    const WorkspaceController = (await import('../app/controllers/WorkspaceController')).default
    
    const app = new AppController()
    const workspace = new WorkspaceController()

    const routes = {
        'app:info': app.index,
        'workspace:index': workspace.index,
        'workspace:store': workspace.store,
        'workspace:destroy': workspace.destroy,

    }

    Object.entries(routes).forEach(([key, handler]) => {

        ipcMain.removeHandler(key)
        ipcMain.handle(key, (_, ...args: any) => (handler as any)(...args))
    })
    

}

