import { watch } from 'fs'
import { resolve } from 'path'
import { debounce } from 'lodash'
import { App } from 'electron'

import execa from 'execa';
import { Builder } from './app-build'


const root = resolve(__dirname, '..')
const electronBin = resolve(__dirname, '..', 'node_modules', '.bin', 'electron')

export async function watchApp(app: App, callback: () => void) {
    const files = [
        resolve(app.getAppPath(), 'main.ts'),
        resolve(app.getAppPath(), 'resources'),
    ]

    const builder = new Builder(app.getAppPath());

    console.log('Watching...')
    // execa(electronBin, [root]);

    const reload = debounce((_:string, filename: string | null) => {
        if (!filename) return;

        console.log('File changed: ', filename)
        console.log('Reloading...')

        // await execa("taskkill", ["/F", "/IM", "electron.exe"]);

        console.time('Reload-time')

        if (filename?.includes('.vue')) {
            builder.vue()
        }
        
        if (filename?.includes('.ts')) {
            builder.tsc()
        }

        builder.postBuild()
        

        // execa(electronBin, [root]);

        // app.relaunch()
        // app.quit()

        callback();

        console.timeEnd('Reload-time')

    }, 500)
    
    files.forEach(file => watch(file, { recursive: true }, reload))
}
