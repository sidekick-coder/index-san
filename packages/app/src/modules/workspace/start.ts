import { useStore } from './store'

export default async () => {
    const store = useStore()

    await store.setWorkspaces()

    if (store.currentId) return

    if (!store.workspaces.length) return

    store.currentId = store.workspaces[0].id
}
