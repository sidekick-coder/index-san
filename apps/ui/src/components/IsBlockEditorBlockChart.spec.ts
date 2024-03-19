import { useMountWrapper } from '__tests__/fixtures/component'
import { describe, expect, it } from 'vitest'
import { MarkdownNodeComponent } from '@language-kit/markdown'
import { useBlockStub } from '../__tests__/stubs'

import BlockChart from './BlockChart.vue'
import VBtn from '@components/VBtn.vue'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
import { inspect, waitFor } from '@composables/utils'
import MonacoEditor from '@components/MonacoEditor.vue'
import VChart from '@components/VChart.vue'
import VTooltipVue from '@components/VTooltip.vue'
import VInputVue from '@components/VInput.vue'
import ToolbarAlignment from './ToolbarAlignment.vue'

describe('BlockChart (unit)', () => {
    const component = useMountWrapper(BlockChart, {
        shallow: true,
        global: {
            stubs: {
                Block: useBlockStub(),
                VTooltip: VTooltipVue,
            },
        },
    })

    function createNode(data?: Partial<MarkdownNodeComponent>) {
        const node = new MarkdownNodeComponent()

        node.name = 'chart'
        node.attrs = data?.attrs ?? {}
        node.body = data?.body ?? ''

        return node
    }

    function findChart() {
        return component.wrapper!.findComponent(VChart)
    }

    function findEditor() {
        return component.wrapper!.findComponent<typeof MonacoEditor>('[data-test-id="editor"]')
    }

    function findToolbarBtn(name: 'edit' | 'debug' | 'dataset') {
        return component.wrapper!.findComponent<typeof VBtn>(`[data-test-id="toolbar-${name}-btn"]`)
    }

    function findDatasetView() {
        return component.wrapper!.findComponent<typeof MonacoEditor>(
            '[data-test-id="dataset-view"]'
        )
    }

    function findDebugView() {
        return component.wrapper!.findComponent<typeof ANSICard>('[data-test-id="debug-view"]')
    }

    function findInput(id: 'height' | 'width') {
        return component.wrapper!.findComponent<typeof VInputVue>(
            `[data-test-id="toolbar-input-${id}"]`
        )
    }

    function findToolbarAlignment() {
        return component.wrapper!.findComponent(ToolbarAlignment)
    }

    it('should set chart options', async () => {
        const node = createNode({
            body: `
                import { useChart } from 'app:chart'
                
                const chart = useChart()

                chart.type = 'bar'

            `,
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await waitFor(() => findChart().exists())

        expect(findChart().props('options')).toEqual({ type: 'bar' })
    })

    it('should show editor on edit-btn click', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                    node.body = n.body
                },
            },
        })

        const btn = findToolbarBtn('edit')

        expect(btn.exists()).toBe(true)

        expect(findEditor().exists()).toBe(false)

        await btn.trigger('click')

        expect(findEditor().exists()).toBe(true)
    })

    it('should update node when editor is saved', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                    node.body = n.body
                },
            },
        })

        await findToolbarBtn('edit').trigger('click')

        const editor = findEditor()

        await editor.setValue('console.log("Update!")')

        await editor.trigger('keydown.ctrl.s')

        expect(node.body).toBe('console.log("Update!")')
    })

    it('should debug view show output logs', async () => {
        const node = createNode({
            body: 'console.log("foo");',
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await waitFor(() => findChart().exists())

        await findToolbarBtn('debug').trigger('click')

        const debugView = findDebugView()

        expect(debugView.exists()).toBe(true)

        expect(debugView.props('modelValue')).toEqual(['foo\n'])
    })

    it('should dataset view show chat options', async () => {
        const node = createNode({
            body: `
                import { useChart } from 'app:chart'
                
                const chart = useChart()

                chart.type = 'bar'
            `,
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await waitFor(() => findChart().exists())

        await findToolbarBtn('dataset').trigger('click')

        const datasetView = findDatasetView()

        expect(datasetView.exists()).toBe(true)

        expect(datasetView.attributes('model-value')).toEqual(
            inspect({
                type: 'bar',
            })
        )
    })

    it('should show error in debug view when evaluation fails', async () => {
        const node = createNode({
            body: 'throw new Error("Internal error")',
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await waitFor(() => findDebugView().exists())

        const debugView = findDebugView()

        expect(debugView.props('modelValue')).toEqual(['Internal error\n'])
    })

    it.each(['height', 'width'] as const)(
        'should when change chart %s update node',
        async (name) => {
            const node = createNode({
                body: 'throw new Error("Internal error")',
            })

            component.mount({
                props: {
                    'modelValue': node,
                    'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                        node.attrs = n.attrs
                    },
                },
            })

            const input = findInput(name)

            expect(input.exists()).toBe(true)

            await input.setValue('100')

            expect(node.attrs[name]).toBe('100')
        }
    )

    it('should when change alignment update node', async () => {
        const node = createNode({
            body: 'throw new Error("Internal error")',
        })

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                    node.attrs = n.attrs
                },
            },
        })

        const alignment = findToolbarAlignment()

        expect(alignment.exists()).toBe(true)

        await alignment.setValue('center')

        expect(node.attrs.align).toBe('center')
    })
})
