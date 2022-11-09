declare namespace ExecuteScriptDTO {
    export interface Input { workspaceId: string, name: string }

    export interface Output {
        data: string
    }
}

export default ExecuteScriptDTO