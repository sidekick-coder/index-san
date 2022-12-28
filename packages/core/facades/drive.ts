import AppConfig from '../config/app'
import Workspace from '../entities/workspace'
import DriveInvalid from '../exceptions/drive-invalid'

export default class DriveFacade {
    constructor(public readonly drives: AppConfig['drives']) {}

    public get(driveName: string) {
        const drive = this.drives[driveName]

        if (!drive) {
            throw new DriveInvalid(driveName)
        }

        return drive
    }

    public fromWorkspace(workspace: Workspace) {
        const drive = this.get(workspace.driveName)

        drive.config = workspace.config

        return drive
    }
}
