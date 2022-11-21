declare namespace UpdateWorkspaceDTO {
    export interface Input {
        id: string
        data: {
            name?: string
            config?: Record<string, string>
        }
    }

    export interface Output {}
}

export default UpdateWorkspaceDTO
