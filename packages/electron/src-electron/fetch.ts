import type IFetchService from '@is/core/gateways/fetch/fetch'

import nodeFetch from 'node-fetch'

export default class FetchService implements IFetchService {
    public provide() {
        return nodeFetch as typeof fetch
    }
}