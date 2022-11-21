import BaseException from './base'

export default class WorkspaceNotFound extends BaseException {
    constructor(workspaceId: string) {
        super('Workspace not found')

        this.i18nKey = 'errors.workspaceNotFound'

        this.i18nArgs = [workspaceId]
    }
}
