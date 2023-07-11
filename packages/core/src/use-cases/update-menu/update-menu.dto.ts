import type Menu from '../../entities/menu'
export default interface UpdateMenuDTO {
    workspaceId: string
    data: Menu[]
}
