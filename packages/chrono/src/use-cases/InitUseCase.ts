import { IDrive } from "../gateways/IDrive";

export interface InitUseCaseParams {
    path: string    
}

export default class InitUseCase {

    constructor(
        private readonly drive: IDrive
    ){}

    public async execute({ path } : InitUseCaseParams){

        const folders = [
            this.drive.resolve(path, '.chrono'),
            this.drive.resolve(path, '.chrono', 'objects')
        ]

        for (const folder of folders) {
            await this.drive.mkdir(folder)
        }
    }
}