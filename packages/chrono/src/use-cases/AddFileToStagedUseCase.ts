import IDrive from '../gateways/IDrive'

interface Params {
    path: string
}

export default class AddFileToStagedUseCase {
    constructor(private readonly drive: IDrive) {}

    async execute({ path }: Params) {
        return path
        // create a staged object
        // use repository to save it
    }
}
