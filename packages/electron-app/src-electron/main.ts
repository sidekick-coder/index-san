import {
    BrowserWindow,
    ipcMain,
    app,
    Menu,
    MenuItem,
    type OpenDialogOptions,
    dialog,
} from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import fs from 'fs'
import path from 'path'
import debounce from 'lodash/debounce'

import IndexSan from '@core/app'

interface Preference {
    name: string
    value: any
}

import AppConfig from '@core/config/app'
import NodeVMEvaluation from '@core/gateways/evaluation/implementations/node-vm-evaluation'

import WorkspaceRepository from './workspace-repository'

import Drive from './drive'
import FetchService from './fetch'

const config = new AppConfig({
    drives: { local: new Drive() },
    repositories: { workspace: new WorkspaceRepository() },
    services: { evaluation: new NodeVMEvaluation(), fetch: new FetchService() },
})

const indexSan = new IndexSan(config)

if (process.env.VITE_DEV_SERVER_URL) {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
}

app.whenReady().then(async () => {
    const preferences: Preference[] = await fs.promises
        .readFile(path.resolve(app.getPath('userData'), 'preferences.json'), { encoding: 'utf8' })
        .then((text) => JSON.parse(text))
        .catch(() => [])

    const boundPreference = preferences.find((p) => p.name === 'window:bounds')

    const bounds = boundPreference ? boundPreference.value : {}

    const window = new BrowserWindow({
        ...bounds,
        title: 'Index-san',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            spellcheck: true,
        },
        icon: path.resolve(__dirname, '..', 'assets', 'logo.ico'),
    })

    window.on(
        'resize',
        debounce(async () => {
            const bounds = window.getBounds()

            await fs.promises
                .writeFile(
                    path.resolve(app.getPath('userData'), 'preferences.json'),
                    JSON.stringify([
                        {
                            name: 'window:bounds',
                            value: bounds,
                        },
                    ])
                )
                .catch(Boolean)
        }, 1000)
    )

    ipcMain.handle('use-case', async (_, name, args) => {
        return indexSan.useCase(name, args)
    })

    ipcMain.handle('dialog:show-open-dialog', (_, args: OpenDialogOptions) => {
        return dialog.showOpenDialog(args)
    })

    window.webContents.on('context-menu', (event, params) => {
        const menu = new Menu()

        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {
            menu.append(
                new MenuItem({
                    label: suggestion,
                    click: () => window.webContents.replaceMisspelling(suggestion),
                })
            )
        }

        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new MenuItem({
                    label: 'Add to dictionary',
                    click: () =>
                        window.webContents.session.addWordToSpellCheckerDictionary(
                            params.misspelledWord
                        ),
                })
            )
        }

        menu.popup()
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        window.loadURL(process.env.VITE_DEV_SERVER_URL)
        installExtension(VUEJS_DEVTOOLS)
            .then((name) => console.debug(`Added Extension:  ${name}`))
            .catch((err) => console.debug('An error occurred: ', err))
    } else {
        window.loadFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
    }
})
