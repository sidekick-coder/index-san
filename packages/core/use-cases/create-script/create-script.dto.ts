import Script from '../../entities/script'

declare namespace CreateScriptDTO {
    export interface Input {
        workspaceId: string
        data: {
            name: Script['name']
            content: Script['content']
        }
    }

    export interface Output {
        data: Script
    }
}

export default CreateScriptDTO