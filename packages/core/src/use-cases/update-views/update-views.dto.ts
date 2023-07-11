import type View from '../../entities/view'

export default interface UpdateViewsDTO {
    workspaceId: string
    collectionId: string
    data: View[]
}
