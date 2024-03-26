import HNode from "../base/HNode";

export default class HFunction extends HNode {
    public type = 'HFunction'    
    public name = ''
    public body = ''
    public export = false
    public children = [] as HNode[]
}