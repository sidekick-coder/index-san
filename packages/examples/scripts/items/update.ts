// update items of a collection

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'todos')

const items = await repository.list()

for await (const item of items) {

    await repository.update(item.id, {
        done: Math.random() < 0.5
    })

    console.log('updated: ', item.name)
}

