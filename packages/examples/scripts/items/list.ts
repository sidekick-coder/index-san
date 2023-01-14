// list items of a collection

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'todos')

const items = await repository.list()

setResult(items)

