import HNode from "../base/HNode";

export interface HImportProperties {
    name: string
}

export default class HImport extends HNode {
    public type = 'HImport'
    public from = ''
    public properties: HImportProperties[] = []
}