import { ipcMain  } from 'electron'

export async function boot(){
    const AppController = (await import('../app/controllers/AppController')).default
    
    const appController = new AppController()
    
    ipcMain.removeHandler('app:info')

    ipcMain.handle('app:info', appController.index)
}

