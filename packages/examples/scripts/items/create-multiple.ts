/**
 * This scrit create multiple an item in the todos collection
 */

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'todos')

const items = []

for await (const i of Array.from(Array(10).keys())) {
    items.push(await repository.create({
        name: 'New todo ' + i
    }))
}


setResult(items)

