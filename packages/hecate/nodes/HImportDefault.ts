import HNode from "../base/HNode";

export interface HImportProperties {
    name: string
}

export default class HImportDefault extends HNode {
    public type = 'HImportDefault'
    public from = ''
    public name = ''
}
