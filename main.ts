import { app, BrowserWindow } from 'electron'
import { debounce } from 'lodash';
import { resolve } from 'path'
import Option from './app/models/Option';
import { Builder } from './bin/app-build';
import { watch } from './helpers/watch'

const isDev = process.env.NODE_ENV === 'development';
const distFile = resolve(__dirname, 'public', 'index.html')

export async function createWindow () {
  const option = await Option.find<Record<string, number>>('window:bounds');

  const bounds = {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
  }

  if (option) {
    bounds.width = option.value.width;
    bounds.height = option.value.height;
    bounds.x = option.value.x;
    bounds.y = option.value.y;
  }

  const window = new BrowserWindow({
    ...bounds,
    webPreferences: {
      preload: resolve(__dirname, 'config', 'preload.js'),
    }
  })
  
  
  await window.loadFile(distFile)

  window.on('resize', debounce( () => Option.updateOrCreate('window:bounds', JSON.stringify(window.getBounds())), 500))

  return window 
}

async function boot(){
  const files = [
    (await import('./start/routes')).default,
    (await import('./start/user-data')).default,
  ]

  await Promise.all(files.map(async file => {
    await file()
  }))
}

export async function main(){

  await boot();

  if (!isDev) {
    return await createWindow();
  }

  const builder = new Builder(app.getAppPath());
  
  let window = await createWindow();
  
  const files = [
    resolve(app.getAppPath(), 'main.ts'),
    resolve(app.getAppPath(), 'app'),
    resolve(app.getAppPath(), 'resources'),
    resolve(app.getAppPath(), 'start'),
  ]

  watch(files, async (filename) => {
    console.log('File changed: ', filename)
    console.log("\x1b[33m", 'Reloading...', '\x1b[0m')
    console.time('Reload-time')

    if (filename?.includes('.vue')) {
      builder.vue()
    }
    
    if (filename?.includes('.ts')) {
      builder.tsc()
    }

    builder.postBuild()

    if (filename?.includes('.vue')) {
      window.webContents.reload();
      console.timeEnd('Reload-time')
      return;
    }

    Object.keys(require.cache)
    .filter(key => /app|config/.test(key))
    .forEach(key => {
      console.log('Clearing cache: ', key)
      delete require.cache[key]
    })

    await boot();

    window.close();
    window = await createWindow();

    console.timeEnd('Reload-time')
  })
  
  console.log('Watching...')

}

app.whenReady().then(main).catch(console.error)