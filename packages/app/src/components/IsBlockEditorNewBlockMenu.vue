<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
        icon: 'heading',
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
        icon: 'paragraph',
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
        icon: 'code',
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
        icon: 'pie-chart',
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
    <v-menu offset-y close-on-content-click :width="200">
        <template #activator="props">
            <slot name="activator" v-bind="props">
                <v-icon name="plus" v-bind="props.attrs" />
            </slot>
        </template>

        <v-card color="b-secondary" class="rounded shadow" width="200">
            <button
                v-for="(item, index) in items"
                :key="index"
                :data-test-id="`item-${item.name}`"
                data-test-item
                class="flex px-4 py-3 items-center hover:bg-b-primary/50 text-left"
                @click="onSelect(item)"
            >
                <div
                    class="w-8 h-8 flex items-center justify-center shadow bg-b-03 text-t-secondary mr-4"
                >
                    <v-icon :name="item.icon" size="14" />
                </div>

                <div>
                    <div class="text-t-primary text-sm font-bold">{{ item.label }}</div>
                    <div class="text-t-secondary text-xs">{{ item.description }}</div>
                </div>
            </button>
        </v-card>
    </v-menu>
</template>
