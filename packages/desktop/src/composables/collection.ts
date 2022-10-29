import uuid from 'uuid-random'
import Collection, { CollectionColumn } from '@core/entities/collection'
import { DataResponse, useCase } from './use-case'
import { useHooks } from '../plugins/hooks'


export function useCollectionRepository(workspaceId: string) {
    function show(collectionId: string){
        return useCase<DataResponse<Collection>>('show-collection', { workspaceId, collectionId })
    }

    function list(){
        return useCase<DataResponse<Collection[]>>('list-collections', { workspaceId })
    }
    
    function create(data?: Partial<Collection>){
        return useCase('create-collection', { workspaceId, data })
    }
    
    function update(collectionId: string, data?: Partial<Collection>){
        return useCase('update-collection', { workspaceId, collectionId, data })
    }
    
    function destroy(collectionId: string) {
        return useCase('delete-collection', { workspaceId, collectionId })
    }

    return { list, show, create, update, destroy }
}

export function useCollection(workspaceId: string, collectionId: string) {
    const hooks = useHooks()
    const repository = useCollectionRepository(workspaceId)

    async function show(){
        const { data } = await repository.show(collectionId)

        return data
    }

    async function update(payload: Partial<Collection>){
        await repository.update(collectionId, payload)

        hooks.emit(`collection:${collectionId}:update`)
    }

    async function addColumn() {
        const id = uuid()

        const data = {
            id: uuid(),
            label: 'New',
            field: id,
            type: 'text'
        }
    
        const collection = await show()
    
        const columns = collection.columns.slice() || []
    
        columns.push(data)

        await update({ columns })    
    }

    async function updateColumn(id: string, payload: Omit<CollectionColumn, 'id' | 'field'>) {
        const collection = await show()

        const columns = collection.columns?.slice() || []

        const column = columns.find(c => c.id === id)

        if (!column) return

        Object.keys(payload)
            .filter(k => !['id'].includes(k))
            .forEach(key => {
                column[key] = payload[key]
            })        

        await update({ columns })
    }

    async function deleteColumn(id: string) {
        const collection = await show()

        const columns = collection.columns?.slice() || []

        const index = columns.findIndex(c => c.id === id)

        if (index === -1) return

        columns.splice(index, 1)

        await update({ columns })
    }

    function on(event: 'update', handler: () => any) {
        hooks.on({
            name: `collection:${collectionId}:update`,
            handler,
        })
    }

    return { show, addColumn, updateColumn, deleteColumn, on }
}