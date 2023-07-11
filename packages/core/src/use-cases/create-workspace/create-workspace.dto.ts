export default interface CreateWorkspaceDTO {
    id?: string
    name: string
    driveName: string
    config: Record<string, string>
}
