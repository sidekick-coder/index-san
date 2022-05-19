import Router from 'Lib/Router'

import { colorize } from 'helpers'
import { ISEventContext } from 'lib/ISEventContext'
import indexSan from '../app'
import { container } from 'tsyringe'

const controllers = new Map()

function findController(name: string) {
  if (controllers.has(name)) {
    return controllers.get(name)
  }

  const Module = require(`../app/controllers/${name}`).default

  controllers.set(name, container.resolve(Module))

  return controllers.get(name)
}

const resolveHandler: Router['resolveHandler'] = (nameOrHandler) => {
  if (typeof nameOrHandler !== 'string') {
    return nameOrHandler
  }

  const [controllerName, method] = nameOrHandler.split('.')

  const controller = findController(controllerName)

  if (!controller || !controller[method]) {
    console.log(colorize(`routes: ${nameOrHandler} not found`, 'red'))

    return () => true
  }

  return controller[method]
}

export default async (app: indexSan) => {
  const { electron } = app

  const router = new Router(resolveHandler)

  router.register('app:info', 'AppController.index')

  router.register('workspace:index', 'WorkspaceController.index')
  router.register('workspace:store', 'WorkspaceController.store')
  router.register('workspace:destroy', 'WorkspaceController.destroy')

  router.register('item:show', 'ItemsController.show')
  router.register('item:store', 'ItemsController.store')
  router.register('item:destroy', 'ItemsController.destroy')
  router.register('item:files', 'ItemsController.showFiles')
  router.register('item:subitems', 'ItemsController.showSubitems')
  router.register('item:option', 'ItemsController.showOption')
  router.register('item:update-option', 'ItemsController.updateOption')

  router.register('file:read', 'FilesController.read')
  router.register('file:write', 'FilesController.write')
  router.register('file:copy', 'FilesController.copy')
  router.register('file:pick', 'FilesController.pick')

  router.use((path, handler) => {
    electron.ipcMain.removeHandler(path)

    electron.ipcMain.handle(path, async (_, args) => {
      if (!handler) {
        console.error(colorize(`Handler ${handler} not found`, 'red'))
        return
      }

      const context: ISEventContext = {
        data: args,
      }

      return handler(context)
        .then((data) => ({
          status: 'success',
          data,
        }))
        .catch((error) => ({
          status: 'error',
          error,
        }))
    })
  })
}
