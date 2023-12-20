export default class BaseException extends Error {
    constructor(message: string, data?: any) {
        super(message);

        this.message = message;
        this.name = this.constructor.name;

        if (data) {
            Object.assign(this, data);
        }
    }
}