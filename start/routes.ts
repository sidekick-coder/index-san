import { colorize } from 'helpers'
import { ISEventContext } from 'lib/ISEventContext'
import indexSan from '../app'

export default async (app: indexSan) => {
  const { router, electron } = app

  router.register('app:info', 'AppController.index')

  router.register('workspace:index', 'WorkspaceController.index')
  router.register('workspace:store', 'WorkspaceController.store')
  router.register('workspace:destroy', 'WorkspaceController.destroy')

  router.register('item:show', 'ItemsController.show')
  router.register('item:store', 'ItemsController.store')
  router.register('item:destroy', 'ItemsController.destroy')
  router.register('item:files', 'ItemsController.files')
  router.register('item:subitems', 'ItemsController.subitems')

  router.register('file:metadata', 'FilesController.metadata')
  router.register('file:list-folder', 'FilesController.listFolder')
  router.register('file:read', 'FilesController.read')
  router.register('file:write', 'FilesController.write')

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

      const result = await handler(context)

      return result
    })
  })
}
