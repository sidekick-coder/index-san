import HNode from "../base/HNode";

export interface HImportProperties {
    name: string
}

export default class HImportInline extends HNode {
    public type = 'HImportInline'
    public from = ''
}
