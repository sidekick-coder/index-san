import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MarkdownNodeComponent } from '@language-kit/markdown'
import { useBlockStub } from '../__tests__/stubs'

import BlockScript from './BlockScript.vue'
import VBtn from '@components/VBtn.vue'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
import { waitFor } from '@composables/utils'
import * as Evaluation from '@modules/evaluation/composables/use-evaluation'
import MonacoEditor from '@components/MonacoEditor.vue'

describe('BlockScript (unit)', () => {
    const component = useMountWrapper(BlockScript, {
        shallow: true,
        global: {
            stubs: {
                Block: useBlockStub(),
            },
        },
    })

    afterEach(() => {
        component.unmount()

        vi.resetAllMocks()
    })

    function createNode(data?: Partial<MarkdownNodeComponent>) {
        const node = new MarkdownNodeComponent()

        node.name = 'script'
        node.attrs = data?.attrs ?? {}
        node.body = data?.body ?? ''

        return node
    }

    function createRuntimeMock() {
        const callbacks = {
            stdout: [] as Function[],
            stderr: [] as Function[],
        }

        return {
            run: vi.fn(),
            onDone: vi.fn().mockResolvedValue(undefined),
            on: (event: keyof typeof callbacks, callback: any) => callbacks[event]?.push(callback),
            emit: (event: keyof typeof callbacks, ...args: any[]) => {
                callbacks[event].forEach((cb) => cb(...args))
            },
        }
    }

    function createEvaluationMock() {
        const spy = vi.fn()

        const runtime = createRuntimeMock()

        spy.mockReturnValue(runtime as any)

        vi.spyOn(Evaluation, 'useEvaluation').mockReturnValue({
            run: spy,
        } as any)

        return { spy, runtime }
    }

    function findRunButton() {
        return component.wrapper!.findComponent<typeof VBtn>('[data-test-id="run-button"]')
    }

    function findClearButton() {
        return component.wrapper!.findComponent('[data-test-id="clear-button"]')
    }

    function findEditor() {
        return component.wrapper!.findComponent<typeof MonacoEditor>('[data-test-id="editor"]')
    }

    function findANSIComponent() {
        return component.wrapper!.findComponent(ANSICard)
    }

    it('should render run button', () => {
        component.mount({
            props: {
                modelValue: createNode(),
            },
        })

        expect(findRunButton().exists()).toBe(true)
    })

    it('should mount runtime with node body run button', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        const running = ref(false)

        const { spy } = createEvaluationMock()

        component.mount({
            props: {
                'modelValue': node,
                'running': running.value,
                'onUpdate:running': (v: boolean) => (running.value = v),
            },
        })

        await findRunButton().trigger('click')

        await waitFor(() => !running.value)

        expect(spy).toHaveBeenCalledWith(node.body, { immediate: false, timeout: 10000 })
    })

    it('should execute script on button click', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        const running = ref(false)

        const { runtime } = createEvaluationMock()

        component.mount({
            props: {
                'modelValue': node,
                'running': running.value,
                'onUpdate:running': (v: boolean) => (running.value = v),
            },
        })

        let done = false

        const runButton = findRunButton()
        const ANSIComponent = findANSIComponent()

        runtime.onDone.mockImplementation(() => waitFor(() => done))

        await runButton.trigger('click')

        runtime.emit('stdout', 'Hello world!')

        done = true

        await waitFor(() => !running.value)

        expect(ANSIComponent.exists()).toBe(true)

        expect(ANSIComponent.props('modelValue')).toEqual([
            '🔥 Running code...',
            '',
            'Hello world!',
            '',
            '🎉 Code executed successfully!',
        ])
    })

    it('should update node when edit script', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        createEvaluationMock()

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                    node.body = n.body
                },
            },
        })

        const editor = findEditor()

        expect(editor.exists()).toBe(true)

        await editor.setValue('console.log("Update!")')

        await editor.trigger('keydown.ctrl.s')

        expect(node.body).toBe('console.log("Update!")')
    })

    it('should clear output on clean-button click', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        createEvaluationMock()

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const ANSIComponent = findANSIComponent()
        const clearButton = findClearButton()

        await ANSIComponent.setValue(['Hello world!'])

        expect(ANSIComponent.props('modelValue')).toEqual(['Hello world!'])

        await clearButton.trigger('click')

        expect(ANSIComponent.props('modelValue')).toEqual([])
    })
})
