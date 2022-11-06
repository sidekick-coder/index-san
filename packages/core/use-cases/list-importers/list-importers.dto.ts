import Importer from '../../entities/importer'

declare namespace ListImportersDTO {
    export interface Input {
        workspaceId: string
    }

    export interface Output {
        data: Importer[]
    }
}

export default ListImportersDTO