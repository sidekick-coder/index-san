import { app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import { Builder } from './bin/app-build';
import { watchApp } from './bin/app-watch'
import { watch } from './helpers/watch'

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

  const builder = new Builder(app.getAppPath());
  let window = await createWindow();
  const files = [
    resolve(app.getAppPath(), 'main.ts'),
    resolve(app.getAppPath(), 'resources'),
  ]

  watch(files, async (filename) => {
    console.log('File changed: ', filename)
    console.log("\x1b[33m", 'Reloading...', '\x1b[0m')
    console.time('Reload-time')

    if (filename?.includes('.vue')) {
      builder.vue()
    }
    
    if (filename?.includes('.tsc')) {
      builder.tsc()
    }

    builder.postBuild()

    if (filename?.includes('.vue')) {
      window.webContents.reload();
      console.timeEnd('Reload-time')
      return;
    }

    window.close();
    window = await createWindow();

    console.timeEnd('Reload-time')
  })
  
  console.log('Watching...')

}

app.whenReady().then(main).catch(console.error)