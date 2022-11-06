import Importer from '../../entities/importer'

declare namespace CreateImporterDTO {
    export interface Input {
        workspaceId: string
        data: {
            id: Importer['id']
            content: Importer['content']
        }
    }

    export interface Output {
        data: Importer
    }
}

export default CreateImporterDTO