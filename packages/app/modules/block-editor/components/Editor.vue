<script setup lang="ts">
import { useEditorOrCreate } from '../composables/editor'
import Toolbar from './Toolbar.vue'
import BlockParagraph from './BlockParagraph.vue'
import Block from './Block.vue'
import { MarkdownNode } from '@language-kit/markdown'

const editor = useEditorOrCreate()

const nodesReady = computed(() => {
    return editor.nodes.filter((node) => editor.toolbars.has(node.meta.id))
})

function onNodeUpdate(node: MarkdownNode) {
    editor.update(node)
}
</script>
<template>
    <div>
        <Toolbar />

        <div class="h-[calc(100%-48px)] w-full overflow-auto pb-80">
            <transition-group
                move-class="transition duration-200"
                enter-active-class="transition duration-200"
                leave-active-class="transition duration-200 absolute"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0 translate-x-[-50%]"
            >
                <template v-for="n in nodesReady" :key="n.meta.id">
                    <BlockParagraph
                        v-if="n.is('Paragraph')"
                        :model-value="n"
                        @update:model-value="onNodeUpdate"
                    />

                    <Block v-else :model-value="n" data-test-id="invalid-block">
                        <div class="text-danger">
                            {{ $t('errors.errorRenderingBlock', [n.type]) }}
                        </div>
                    </Block>
                </template>
            </transition-group>
        </div>
    </div>
</template>
