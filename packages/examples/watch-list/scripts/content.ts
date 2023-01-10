/**
 * This script update all content.md of items to have same template
 * 
 */

const entries = await Drive.list('medias')

const repository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'medias')

const items = await repository.list()

const template = `
# {{ item.name }}

<e-img :src="item.image" />
`

for await (const item of items) {
    
    const path = Entry.normalize(item._path, 'content.md')

    await Drive.write(path, Entry.encode(template))

    console.log(`updated: ${item.name}`)
}

