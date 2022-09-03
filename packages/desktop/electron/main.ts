import { BrowserWindow, app } from 'electron'
app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
    })
      
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // load your file
        win.loadFile('yourOutputFile.html')
    }
})