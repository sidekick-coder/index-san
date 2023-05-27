import { useNodeHelper } from '../helpers/node-helper'
import { createParser } from '../parser/parser'
import { NodeExport, NodeImport, NodeType } from '../types/node'
import { Processor } from '../types/processor'

import { Resolver } from '../types/resolver'

export function useEvaluation() {
    const parser = createParser()
    const helper = useNodeHelper()

    const identifierPrefix = '___INTERNAL_EVALUATION_'
    const importIdentifier = `${identifierPrefix}_IMPORT`
    const exportIdentifier = `${identifierPrefix}_EXPORT`

    const state = {
        resolvers: [] as Resolver[],
        processors: [] as Processor[],
    }

    function addResolver(resolver: Resolver) {
        state.resolvers.push({
            order: 99,
            ...resolver,
        })
    }

    function addProcessor(Processor: Processor) {
        state.processors.push({
            order: 99,
            ...Processor,
        })
    }

    function setResolvers(resolvers: Resolver[]) {
        state.resolvers = resolvers
    }

    async function mountImports(source: string) {
        const nodes = parser
            .toNodes(source)
            .filter((n) => n.type === NodeType.Import) as NodeImport[]

        const names = nodes.map((n) => n.moduleId)

        const result = {} as Record<string, any>

        for await (const moduleId of names) {
            const resolver = state.resolvers.find((r) => r.test(moduleId))

            if (!resolver) {
                throw new Error(`Resolver not found for ${moduleId}`)
            }

            const moduleResolved = await resolver.resolve(moduleId)

            if (!moduleResolved) {
                throw new Error(`Module not resolved for ${moduleId}`)
            }

            result[moduleId] = moduleResolved
        }

        return result
    }

    function mount(source: string) {
        const nodes = parser.toNodes(source)

        nodes
            .filter((n) => n.type === NodeType.Import)
            .forEach((node: NodeImport) => {
                let newCode = `const ${node.statements} = ${importIdentifier}("${node.moduleId}");`

                if (!node.statements.includes('{')) {
                    newCode = `const ${node.statements} = ${importIdentifier}("${node.moduleId}").default;`
                }

                helper.replaceNodeByCode(nodes, node, newCode)
            })

        nodes
            .filter((n) => n.type === NodeType.Export)
            .forEach((node: NodeExport) => {
                const newCode = `${exportIdentifier}({ ${node.key}: ${node.statements} });`

                helper.replaceNodeByCode(nodes, node, newCode)
            })

        return helper.toString(nodes)
    }

    function evaluate(source: string, context = {}) {
        let wrapCode = source

        // replace all keys with this.[key]
        Object.keys(context).forEach((key) => {
            wrapCode = wrapCode.replace(new RegExp(key, 'g'), `this.${key}`)
        })

        const fn = new Function(wrapCode)

        // update name
        Object.defineProperty(fn, 'name', { value: 'useEvaluate' })

        fn.call(context)
    }

    async function run(source: string) {
        const imports = await mountImports(source)
        const code = mount(source)
        const exported = {} as Record<string, any>

        const context = {
            [`${importIdentifier}`]: (moduleId: string) => imports[moduleId],
            [`${exportIdentifier}`]: (newExported: Record<string, any>) => {
                Object.assign(exported, newExported)
            },
        }

        evaluate(code, context)

        return exported
    }

    return {
        importIdentifier,
        exportIdentifier,
        mount,
        mountImports,
        evaluate,
        run,
        addResolver,
        addProcessor,
        setResolvers,
    }
}
