export default class BaseException extends Error {
    public i18nKey = 'errors.internal'
    public i18nArgs: string[] = []

    constructor(message = 'Internal server error') {
        super(message)
    }
}
