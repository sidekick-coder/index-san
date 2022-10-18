import { BrowserWindow, ipcMain, app, Menu, MenuItem } from 'electron'
import path from 'path'
import debounce from 'lodash/debounce'

import JSONService from './services/json-service'
import AllUseCases from './use-cases'

interface Preference {
    name: string
    value: any
}


app.whenReady().then(async () => {
    const preferences = new JSONService<Preference>(path.resolve(app.getPath('userData'), 'preferences.json'))
    
    await preferences.load()

    const boundPreference = preferences.findBy('name', 'window:bounds')

    const bounds = boundPreference ? boundPreference.value : {}

    const window = new BrowserWindow({
        title: 'Main window',
        ...bounds,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            spellcheck: true
        }
    })

    window.on(
        'resize',
        debounce(async () => {
            const bounds = window.getBounds()
            
            await preferences.load()

            preferences.updateOrCreateBy('name', {
                name: 'window:bounds',
                value: bounds
            })

            await preferences.save()
        }, 1000)
    )

    ipcMain.handle('use-case', (_, name, args) => {
        const option = AllUseCases[name]

        if (!option) {
            throw new Error(`use-case "${name}" not found`)
        }

        return option.execute(args)
    })

    window.webContents.on('context-menu', (event, params) => {
        const menu = new Menu()
      
        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {
            menu.append(new MenuItem({
                label: suggestion,
                click: () => window.webContents.replaceMisspelling(suggestion)
            }))
        }
      
        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new MenuItem({
                    label: 'Add to dictionary',
                    click: () => window.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                })
            )
        }
      
        menu.popup()
    })
      
    if (process.env.VITE_DEV_SERVER_URL) {
        window.loadURL(process.env.VITE_DEV_SERVER_URL)
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    } else {
        window.loadFile('build/index.html')
    }
})