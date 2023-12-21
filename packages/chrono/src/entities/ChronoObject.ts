const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();
import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";
import HelperService from "../services/HelperService";

export default class ChronoObject {
    public type: string;
    [key: string]: any;

    constructor(data?: Partial<ChronoObject>) {
        Object.assign(this, data)

        if (!this.type) {
            throw new Error('Missing type')
        }
    }

    public toString(){
        const result = Object.entries(this)
            .map(([key, value]) => `${snakeCase(key)}: ${value}`)
            .join('\n')        

        return result + '\n'
    }

    public toBytes(){
        return HelperService.encode(this.toString())
    }

    public static parseContentString(content: string) {
        const lines = content.split('\n').filter(line => line.length)

        const entries = lines
            .map(line => line.split(':'))
            .map(([key, value]) => [camelCase(key), value.trim()])

        return Object.fromEntries(entries)
    }

    
    public static fromString(content: string) {
        const data = ChronoObject.parseContentString(content)
        
        return new ChronoObject(data)
    }
    
    public static fromBytes(bytes: Uint8Array) {
        const content =  decoder.decode(bytes);

        return ChronoObject.fromString(content)
    }
}