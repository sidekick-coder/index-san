import { BrowserWindow, ipcMain, app, Menu, MenuItem } from 'electron'
import path from 'path'
import debounce from 'lodash/debounce'

import IndexSan from '@core/app'

import JSONService from './services/json-service'
interface Preference {
    name: string
    value: any
}

import WorkspaceRepository from './repositories/workspace-repository'

import DriveManager from '@core/gateways/drive-manager'
import CrudManager from '@core/gateways/crud-manager'

import FSDrive from './gateways/fs-drive'
import FSCrudFolder from './gateways/fs-crud-folder'

const workspaceRepository = new WorkspaceRepository(
    path.resolve(app.getPath('userData'), 'workspaces.json')
)

const fsDrive = new FSDrive()
const fsCrudFolder = new FSCrudFolder()
const driveManager = new DriveManager({ fs: fsDrive })
const crudManger = new CrudManager({ fsFolder: fsCrudFolder })

const indexSan = new IndexSan({
    crudManger,
    driveManager,
    workspaceRepository,
})

app.whenReady().then(async () => {
    const preferences = new JSONService<Preference>(
        path.resolve(app.getPath('userData'), 'preferences.json')
    )

    await preferences.load()

    const boundPreference = preferences.findBy('name', 'window:bounds')

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

            await preferences.load()

            preferences.updateOrCreateBy('name', {
                name: 'window:bounds',
                value: bounds,
            })

            await preferences.save()
        }, 1000)
    )

    ipcMain.handle('use-case', async (_, name, args) => {
        const option = indexSan.cases[name]

        if (!option) {
            return {
                error: new Error(`use-case "${name}" not found`),
            }
        }

        let result: any = undefined
        let error: any = undefined

        await option
            .execute(args)
            .then((r: any) => (result = r))
            .catch((e: any) => (error = e))

        if (error) {
            console.error(error)
        }

        if (error && error.serialize) {
            error = error.serialize()
        }

        return { error, result }
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
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    } else {
        window.loadFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
    }
})
