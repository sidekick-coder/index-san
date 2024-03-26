import HNode from "../base/HNode";

export default class HVariable extends HNode {
    public type = 'HVariable'

    public keyword: 'const' | 'let' | 'var' = 'const'
    
    public name = ''
    public value = ''
}