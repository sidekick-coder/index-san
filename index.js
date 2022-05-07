const { app, BrowserWindow } = require('electron')
const path = require('path')

const distFile = path.resolve(__dirname, 'public', 'index.html')

const host = process.env.HOST || 'localhost';
const port = process.env.HOST || 3333;

const isProduction = process.env.NODE_ENV === 'production';

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    if (!isProduction) {
      return win.loadURL(`http://${host}:${port}`);	
    }

    win.loadFile(distFile)
}

app.whenReady().then(createWindow)