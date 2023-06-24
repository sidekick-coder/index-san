<script setup lang="ts">
import { useEditorOrCreate } from '../composables/editor'
import Toolbar from './Toolbar.vue'
import BlockParagraph from './BlockParagraph.vue'
import Block from './Block.vue'
import { MarkdownNode } from '@language-kit/markdown'

const editor = useEditorOrCreate()

function onNodeUpdate(node: MarkdownNode) {
    editor.update(node)
}
</script>
<template>
    <div>
        <Toolbar />

        <template v-for="n in editor.nodes" :key="n.meta.id">
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
    </div>
</template>
