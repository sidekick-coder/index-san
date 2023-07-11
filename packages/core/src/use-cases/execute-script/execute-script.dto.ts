export default interface ExecuteScriptDTO {
    workspaceId: string
    content: string
    scope?: Record<string, any>
}
