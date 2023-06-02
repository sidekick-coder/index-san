import { Parser as MarkdownParser, Node as MarkdowNode } from '@language-kit/markdown'
import { defineCompletion } from '../composable/define-language'
import * as monaco from 'monaco-editor'
import { createParser } from '@modules/evaluation/parser/parser'
import { useNodeHelper } from '@modules/evaluation/helpers/node-helper'

const mdParser = new MarkdownParser()
const jsParser = createParser()
const nodeHelper = useNodeHelper()

async function createCompletionFromJavascriptString(
    model: monaco.editor.ITextModel,
    offset: number
) {
    const search = await monaco.languages.typescript?.getTypeScriptWorker()

    if (!search) return

    const worker = await search(model.uri)

    const result = await worker.getCompletionsAtPosition(model.uri.toString(), offset)

    console.log(result.entries)
}

function findCompletions(model: monaco.editor.ITextModel) {
    const text = model.getValue()

    const nodes = mdParser.toNodes(text)

    const result = {
        variables: [] as string[],
        functions: [] as string[],
    }

    const setupNode = nodes.find((node) => {
        if (!node.isComponent()) return

        return node.name === 'setup'
    })

    if (!setupNode || !setupNode.isComponent()) return result

    createCompletionFromJavascriptString(model, 20000)

    const jsNodes = jsParser.toNodes(setupNode.body)

    jsNodes.forEach((n) => {
        if (nodeHelper.isVariable(n)) {
            result.variables.push(n.name)
        }

        if (nodeHelper.isFunction(n)) {
            result.functions.push(n.name)
        }
    })

    return result
}

export default defineCompletion({
    provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)

        const text = model.getValue()

        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        }

        const nodes = mdParser.toNodes(text)

        const setup = findCompletions(model)

        const suggestions: monaco.languages.CompletionItem[] = []

        // setup.variables.forEach((name) => {
        //     suggestions.push({
        //         label: name,
        //         kind: monaco.languages.CompletionItemKind.Variable,
        //         insertText: name,
        //         range,
        //     })
        // })

        // setup.functions.forEach((name) => {
        //     suggestions.push({
        //         label: name,
        //         kind: monaco.languages.CompletionItemKind.Function,
        //         insertText: name,
        //         range,
        //     })
        // })

        return {
            suggestions: suggestions,
        }
    },
})
