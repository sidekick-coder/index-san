import Item from '../../entities/item'

interface ItemWithWorkspace extends Item {
    workspaceId: string
    collectionId: string
}

declare namespace ListItemsDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
    }
    
    export interface Output {
        data: ItemWithWorkspace[]
    }
}

export default ListItemsDTO