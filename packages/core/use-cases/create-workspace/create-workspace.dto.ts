declare namespace CreateWorkspaceDTO {
    export interface Input {
        name: string
        path: string
        drive: string
        config: Record<string, string>
    }
    
    export interface Output {

    }
}

export default CreateWorkspaceDTO