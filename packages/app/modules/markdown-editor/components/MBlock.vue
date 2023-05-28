<script setup lang="ts">
import { Node } from '@language-kit/markdown'
import { useManger } from '../composable/nodes-manager'

const props = defineProps({
    node: {
        type: Object as () => Node,
        required: true,
    },
})

const manager = useManger()

function deleteBlock() {
    manager.removeNode(props.node)
}
</script>

<template>
    <div class="flex min-h-[30px] items-center group">
        <div class="w-[50px] flex justify-center">
            <v-menu offset-y close-on-content-click>
                <template #activator="{ attrs }">
                    <v-btn
                        v-bind="attrs"
                        mode="text"
                        size="none"
                        class="px-2 py-1 text-sm opacity-0 group-hover:opacity-100"
                    >
                        <v-icon name="grip-vertical" />
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <v-list-item @click="deleteBlock">
                        <v-icon name="trash" class="mr-2" />

                        {{ $t('delete') }}
                    </v-list-item>
                    <slot name="menu" />
                </v-card>
            </v-menu>
        </div>

        <div class="flex-1">
            <slot />
        </div>
    </div>
</template>
