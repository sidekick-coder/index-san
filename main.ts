import { app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import { watchApp } from './bin/app-watch'

const isDev = process.env.NODE_ENV === 'development';
const distFile = resolve(__dirname, 'public', 'index.html')

export async function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: resolve(__dirname, 'config', 'preload.js'),
    }
  })
  
  
  await win.loadFile(distFile)

  return win 
}

export async function main(){

  if (!isDev) {
    return await createWindow();
  }

  let window = await createWindow();

  await watchApp(app, async () => {
    window.close();
    window = await createWindow();
  })

}

app.whenReady().then(main).catch(console.error)