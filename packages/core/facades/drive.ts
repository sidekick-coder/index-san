import AppConfig from '../config/app'
import Workspace from '../entities/workspace'
import DriveInvalid from '../exceptions/drive-invalid'

export default class DriveFacade {
    constructor(public readonly drives: AppConfig['drives']) {}

    public validate(driveName: string) {
        const drive = this.drives[driveName]

        if (!drive) {
            throw new DriveInvalid(driveName)
        }
    }

    public get(driveName: string) {
        this.validate(driveName)

        return this.drives[driveName]
    }

    public fromWorkspace(workspace: Workspace) {
        const drive = this.get(workspace.driveName)

        drive.config = workspace.config

        return drive
    }
}
