/**
 * This script update all medias
 */

const entries = await Drive.list('medias')

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'medias')

const items = await repository.list()

for await (const item of items) {

    // execute update

    await repository.update(item.id, {
        status: 'done'
    })   
    
    console.log(`updated: ${item.name}`)
}

