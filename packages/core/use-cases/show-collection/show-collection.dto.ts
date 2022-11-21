import Collection from '../../entities/collection'

declare namespace ShowCollectionsDTO {
    export interface Input {
        workspaceId: string
        collectionId: string
    }

    export interface Output {
        data: Collection
    }
}

export default ShowCollectionsDTO
