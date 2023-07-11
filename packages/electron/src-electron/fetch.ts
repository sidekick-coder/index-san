import type IFetchService from '@index-san/core/gateways/fetch/fetch'

import * as nodeFetch from 'node-fetch'

export default class FetchService implements IFetchService {
    public provide() {
        return nodeFetch as any
    }
}
