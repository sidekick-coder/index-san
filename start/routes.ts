import { ipcMain  } from 'electron'


export default async () => {
    const AppController = (await import('../app/controllers/AppController')).default
    
    const appController = new AppController()
    
    ipcMain.removeHandler('app:info')

    ipcMain.handle('app:info', appController.index)
}

