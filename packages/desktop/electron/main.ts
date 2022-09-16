import { BrowserWindow, ipcMain, app } from 'electron'
import path from 'path'
import AllUseCases from './use-cases'

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
        const option = AllUseCases[name]

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