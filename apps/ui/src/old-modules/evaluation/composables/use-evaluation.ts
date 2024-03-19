import { inspect, waitFor } from '@composables/utils'
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

    function addResolver(...resolver: Resolver[]) {
        resolver.forEach((r) =>
            state.resolvers.push({
                order: 99,
                ...r,
            })
        )
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

    function createInstance(source: string, context = {}) {
        let wrapCode = source

        const observers: any[] = []

        const instance = {
            stdout: '',
            stderr: '',
            done: false,
            on: (event: 'stdout' | 'stderr', cb: (args: string) => any) => {
                observers.push({
                    event,
                    cb,
                })
            },
            run: async () => {
                //
            },
        }

        const emit = (event: string, data: string) => {
            observers
                .filter((observer) => observer.event === event)
                .forEach((observer) => {
                    if (observer.event === event) {
                        observer.cb(data)
                    }
                })
        }

        const logger = {
            log: (...args: any) => {
                const value = args.map(inspect).join(' ') + '\n'

                instance.stdout += value

                emit('stdout', value)
            },
        }

        // replace all keys with this.[key]
        Object.keys(context).forEach((key) => {
            wrapCode = wrapCode.replace(new RegExp(key, 'g'), `this.${key}`)
        })

        // replace all console[key] with this.logger[key]
        Object.keys(logger).forEach((key) => {
            wrapCode = wrapCode.replace(new RegExp(`console.${key}`, 'g'), `this.logger.${key}`)
        })

        const AsyncFunction = Object.getPrototypeOf(async function () {
            /* empty */
        }).constructor

        const fn = new AsyncFunction(wrapCode)

        instance.run = async () => {
            fn.call({ ...context, logger: logger })
                .then(() => {
                    instance.done = true
                })
                .catch((err: Error) => {
                    instance.done = true

                    instance.stderr += err.message + '\n'

                    emit('stderr', err.message + '\n')
                })
        }

        return instance
    }

    function evaluate(source: string, context = {}) {
        const instance = createInstance(source, context)

        instance.run()

        return instance
    }

    async function run(source: string, options = { immediate: true, timeout: 10000 }) {
        const imports = await mountImports(source)
        const code = mount(source)
        const exported = {} as Record<string, any>

        const context = {
            [`${importIdentifier}`]: (moduleId: string) => imports[moduleId],
            [`${exportIdentifier}`]: (newExported: Record<string, any>) => {
                Object.assign(exported, newExported)
            },
        }

        const evaluation = createInstance(code, context)

        async function onDone() {
            await waitFor(() => evaluation.done, options.timeout)
        }

        if (options.immediate) {
            evaluation.run()

            await onDone()
        }

        return {
            evaluation,
            exports: exported,
            onDone,
            on: evaluation.on,
            run: evaluation.run,
        }
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
