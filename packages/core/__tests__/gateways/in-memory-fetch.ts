import type IFetchService from '../../gateways/fetch/fetch'
import sinon from 'sinon'

export default class InMemoryFetchService implements IFetchService {
    public provide() {
        return sinon.stub(fetch)
    }
}
