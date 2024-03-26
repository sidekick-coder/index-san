import { createCompiler } from 'hecate/composables/createCompiler';

const compiler = createCompiler();

export function useCompiler(){
    return compiler
}