import Collection from '../../entities/collection'

export default interface CreateCollectionDTO {
    workspaceId: string
    data: Omit<Collection, 'workspaceId'>
}
