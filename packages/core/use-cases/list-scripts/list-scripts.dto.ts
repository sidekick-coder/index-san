import Script from '../../entities/script'

declare namespace ListScriptsDTO {
    export interface Input {
        workspaceId: string
    }

    export interface Output {
        data: Script[]
    }
}

export default ListScriptsDTO