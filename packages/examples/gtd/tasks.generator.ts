/**
 * Generate random tasks
 */

const projectRepository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'projects')
const taskRepository = await Facades.item.createRepositoryFromWorkspace(Workspace, 'tasks')


const projects = await projectRepository.list()
const projectIds = projects.map(p => p.id)

function randomDate() {
    const start = new Date()
    const end = new Date(start.getTime() + (1000 * 3600 * 24 * 100))

    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));


    return Moment(date).format('YYYY-MM-DD')
}

const items = Array.from({ length: 200 }).map((_, id) => ({
    id: String(id),
    name: `task-${id}`,
    project: projectIds[Math.floor(Math.random()* projectIds.length)],
    dueDate: randomDate()
}))

for await (const item of items) {
    const exists = await Drive.exists(Entry.normalize('tasks', item.id))

    if (exists) {
        await taskRepository.update(item.id, item)
    }
    
    if (!exists) {
        await taskRepository.create(item)
    }

    console.log(`created/updated: ${item.name}`)
}
