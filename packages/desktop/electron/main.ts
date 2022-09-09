import { BrowserWindow, app } from 'electron'
import { join } from 'path'

const preload = join(__dirname, './preload.js')

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
        webPreferences: {
            preload
        }
    })
      
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // load your file
        win.loadFile('yourOutputFile.html')
    }
})