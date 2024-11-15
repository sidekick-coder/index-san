import HNode from "../base/HNode";

export interface HImportProperties {
    name: string
}

export default class HImportAllAs extends HNode {
    public type = 'HImportAllAs'
    public from = ''
    public name = ''
}
