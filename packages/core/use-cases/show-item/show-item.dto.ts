import Item from '../../entities/item'

declare namespace ShowItemDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
        itemId: string
    }
    
    export interface Output {
        data: Item
    }
}

export default ShowItemDTO