declare namespace CreateWorkspaceDTO {
    export interface Input {
        id?: string
        name: string
        path: string
        driveName: string
        config: Record<string, string>
    }
    
    export interface Output {

    }
}

export default CreateWorkspaceDTO