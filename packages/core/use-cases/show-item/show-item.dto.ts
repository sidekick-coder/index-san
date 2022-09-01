import Item from '../../entities/item'

interface ItemWithWorkspace extends Item {
    workspaceId: string
    collectionId: string
}

declare namespace ShowItemDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
        itemId: string
    }
    
    export interface Output {
        data: ItemWithWorkspace
    }
}

export default ShowItemDTO