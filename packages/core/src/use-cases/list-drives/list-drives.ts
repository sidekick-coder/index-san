import type AppConfig from '../../config/app'

import lowerCase from 'lodash/lowerCase'
import upperFirst from 'lodash/upperFirst'

export default class ListDrives {
    constructor(private readonly app: AppConfig) {}

    public async execute() {
        const data = Object.keys(this.app.drives).map((key) => ({
            id: key,
            label: upperFirst(lowerCase(key)),
        }))

        return {
            data: data,
        }
    }
}
