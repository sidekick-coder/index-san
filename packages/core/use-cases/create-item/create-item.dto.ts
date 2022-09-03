import Item from '../../entities/item'

interface ItemWithWorkspace extends Item {
    workspaceId: string
    collectionId: string
}

declare namespace CreateItemDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
        data: any
    }
    
    export interface Output {
        data: ItemWithWorkspace
    }
}

export default CreateItemDTO