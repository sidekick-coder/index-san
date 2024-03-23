import { useStore } from './store'

export default async () => {
    const store = useStore()

    await store.setCollections()
}
