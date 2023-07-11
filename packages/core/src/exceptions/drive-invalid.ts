import BaseException from './base'

export default class DriveInvalid extends BaseException {
    constructor(driveName: string) {
        super('Drive not found')

        this.i18nKey = 'errors.driveInvalid'

        this.i18nArgs = [driveName]
    }
}
