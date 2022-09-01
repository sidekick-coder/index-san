import Collection from '../../entities/collection'

declare namespace CreateCollectionDTO {
    export interface Input {
        workspaceId: string
        data: Omit<Collection, 'id'>
    }

    export interface Output {
        data: Collection
    }
}

export default CreateCollectionDTO