import HNode from "../base/HNode";

export default class HConsole extends HNode {
    public type = 'HConsole'
    public level: 'log' | 'warn' | 'error' = 'log'
    public args: string[] = []
}