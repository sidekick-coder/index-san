export default interface UpdateWorkspaceDTO {
    workspaceId: string
    data: {
        name?: string
        config?: Record<string, string>
    }
}
