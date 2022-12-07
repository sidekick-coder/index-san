declare namespace ExecuteScriptDTO {
    export interface Input {
        workspaceId: string
        content: string
    }

    export interface Output {
        logs: string[]
        error: any
        result: any
    }
}

export default ExecuteScriptDTO
