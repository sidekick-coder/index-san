declare namespace CreateWorkspaceDTO {
    export interface Input {
        id?: string
        name: string
        driveName: string
        config: Record<string, string>
    }

    export interface Output {}
}

export default CreateWorkspaceDTO
