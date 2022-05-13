import Router from '../lib/Router'

export default async (router: Router) => {
  router.register('app:info', 'AppController.index')

  router.register('workspace:index', 'WorkspaceController.index')
  router.register('workspace:store', 'WorkspaceController.store')
  router.register('workspace:destroy', 'WorkspaceController.destroy')

  router.register('item:show', 'ItemsController.show')
  router.register('item:store', 'ItemsController.store')
  router.register('item:destroy', 'ItemsController.destroy')

  router.register('file:metadata', 'FilesController.metadata')
  router.register('file:list-folder', 'FilesController.listFolder')
  router.register('file:read', 'FilesController.read')
  router.register('file:write', 'FilesController.write')
}
