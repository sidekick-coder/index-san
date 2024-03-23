<script setup lang="ts">
import {
    MarkdownNode,
    MarkdownNodeComponent,
    MarkdownNodeHeading,
    MarkdownNodeParagraph,
    MarkdownParser,
    Processors,
} from '@language-kit/markdown'

const emit = defineEmits(['select'])

const parser = new MarkdownParser()

const tm = useI18n()

interface Item {
    label: string
    name: string
    icon: string
    description: string
    make: () => MarkdownNode
}

const items: Item[] = [
    {
        label: tm.t('heading'),
        icon: 'fa6-solid:heading',
        name: 'heading',
        description: tm.t('headingDescription'),
        make: () => {
            const node = new MarkdownNodeHeading()

            node.level = 1

            node.body = '\n# \n'
            node.tokens = parser.toTokens(node.body, {
                includeEndOfFileToken: false,
            })

            return node
        },
    },
    {
        label: tm.t('paragraph'),
        icon: 'fa6-solid:paragraph',
        name: 'paragraph',
        description: tm.t('paragraphDescription'),
        make: () => {
            const node = new MarkdownNodeParagraph()

            node.body = '\n \n'
            node.children = parser.toNodes(node.body, {
                processors: {
                    only: [Processors.Text],
                },
            })

            node.tokens = parser.toTokens(node.body, {
                includeEndOfFileToken: false,
            })

            return node
        },
    },
    {
        label: tm.t('script'),
        icon: 'fa6-solid:code',
        name: 'script',
        description: tm.t('scriptDescription'),
        make: () => {
            const node = new MarkdownNodeComponent()

            const markdown = ':: script\n// code\n::\n'

            node.name = 'script'
            node.body = '// code'
            node.tokens = parser.toTokens(markdown, {
                includeEndOfFileToken: false,
            })

            return node
        },
    },
    {
        label: tm.t('chart'),
        icon: 'fa:pie-chart',
        name: 'chart',
        description: tm.t('chartDescription'),
        make: () => {
            const node = new MarkdownNodeComponent()

            const body = [
                'import { useChart } from "app:chart"',
                '',
                'const chart = useChart()',
                '',
                'chart.type = "bar"',
                '',
                'chart.data = {',
                '    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],',
                '    datasets: [{',
                '        label: "My chart",',
                '        data: [12, 19, 3, 5, 2, 3],',
                '        backgroundColor: [',
                '            "rgb(255, 99, 132)",',
                '            "rgb(54, 162, 235)",',
                '            "rgb(255, 206, 86)",',
                '            "rgb(75, 192, 192)",',
                '            "rgb(153, 102, 255)",',
                '            "rgb(255, 159, 64)",',
                '        ],',
                '    }],',
                '}',
            ].join('\n')

            const markdown = [`:: chart`, body, `::`].join('\n')

            node.name = 'chart'
            node.body = body
            node.tokens = parser.toTokens(markdown, {
                includeEndOfFileToken: false,
            })

            node.name = 'chart'

            return node
        },
    },
]

function onSelect(item: Item) {
    emit('select', item.make())
}
</script>
<template>
    <IsMenu
        offset-y
        close-on-content-click
        :width="200"
    >
        <template #activator="props">
            <slot
                name="activator"
                v-bind="props"
            >
                <IsIcon
                    name="mdi:plus"
                    v-bind="props.attrs"
                />
            </slot>
        </template>

        <IsCard class="w-52">
            <IsListItem
                v-for="(item, index) in items"
                :key="index"
                :data-test-id="`item-${item.name}`"
                data-test-item
                size="lg"
                @click="onSelect(item)"
            >
                <IsCard
                    class="w-8 h-8 flex items-center justify-center mr-4"
                    color="zinc"
                >
                    <IsIcon
                        :name="item.icon"
                        size="sm"
                    />
                </IsCard>

                <div>
                    <div class="text-t-primary text-sm font-bold">
                        {{ item.label }}
                    </div>
                    <div class="text-t-secondary text-xs">
                        {{ item.description }}
                    </div>
                </div>
            </IsListItem>
        </IsCard>
    </IsMenu>
</template>
