<script setup lang="ts">
import { useEditorOrCreate } from '../composables/editor'
import { MarkdownNode } from '@language-kit/markdown'

import Toolbar from './Toolbar.vue'
import Block from './Block.vue'
import BlockParagraph from './BlockParagraph.vue'
import BlockHeading from './BlockHeading.vue'
import BlockScript from './BlockScript.vue'
import BlockChart from './BlockChart.vue'

const root = ref<HTMLElement | null>(null)
const editor = useEditorOrCreate()

const nodesReady = computed(() => {
    return editor.nodes.filter((node) => editor.toolbars.has(node.meta.id))
})

function onNodeUpdate(node: MarkdownNode) {
    editor.update(node)
}

// error
const error = ref()

onErrorCaptured((err) => {
    error.value = err

    return false
})
</script>
<template>
    <div ref="root" class="h-full">
        <Toolbar />

        <div
            class="max-h-[calc(100%-48px)] w-full overflow-auto flex flex-wrap items-start overflow-auto pb-80"
        >
            <div v-if="error" class="h-full w-full flex items-center justify-center">
                <div class="text-center">
                    <div class="text-6xl text-danger mb-4">
                        <v-icon name="mdi:alert-circle-outline" class="mx-auto" />
                    </div>
                    <div class="text-2xl font-bold">
                        {{ $t('errors.errorRenderingBlocks') }}
                    </div>
                    <div class="text-1xl text-danger">
                        {{ error.message }}
                    </div>
                </div>
            </div>

            <transition-group
                v-else
                move-class="transition duration-200"
                enter-active-class="transition duration-200"
                leave-active-class="transition duration-200"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <template v-for="n in nodesReady" :key="n.meta.id">
                    <BlockParagraph
                        v-if="n.is('Paragraph')"
                        :model-value="n"
                        @update:model-value="onNodeUpdate"
                    />

                    <BlockHeading
                        v-else-if="n.is('Heading')"
                        :model-value="n"
                        @update:model-value="onNodeUpdate"
                    />

                    <BlockScript
                        v-else-if="n.is('Component') && n.name === 'script'"
                        :model-value="n"
                        @update:model-value="onNodeUpdate"
                    />

                    <BlockChart
                        v-else-if="n.is('Component') && n.name === 'chart'"
                        :model-value="n"
                        @update:model-value="onNodeUpdate"
                    />

                    <Block
                        v-else
                        :model-value="n"
                        data-test-id="invalid-block"
                        class="border-l-4 border-danger"
                    >
                        <div class="text-danger">
                            {{ $t('errors.errorRenderingBlock', [n.type]) }}
                        </div>
                    </Block>
                </template>
            </transition-group>

            <!-- Element to prevent focus when clicking on empty space -->
            <div class="flex-1" @click="editor.unselectAll"></div>
        </div>
    </div>
</template>
