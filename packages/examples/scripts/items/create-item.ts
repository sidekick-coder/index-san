/**
 * This scrit create an item in the todos collection
 */

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'todos')


const item = await repository.create({
    name: 'New todo'
})


setResult(item)

