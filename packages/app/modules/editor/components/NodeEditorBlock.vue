<script setup lang="ts">
import { onKeyStroke, useFocusWithin, useKeyModifier } from '@vueuse/core'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import { useI18n } from 'vue-i18n'
import { useBindings } from '@composables/binding'
import upperFirst from 'lodash/upperFirst'
import lowerCase from 'lodash/lowerCase'

const props = defineProps({
    node: {
        type: Object as () => NodeWithId,
        required: true,
    },
})

const emit = defineEmits(['onSelect', 'onUnselect'])

const editor = useNodeEditor()
const rootAttrs = useAttrs()
const bindings = useBindings(rootAttrs, ['menu'])

const root = ref<HTMLElement>()
const content = ref<HTMLElement>()
const isSelected = computed(() => editor.isSelected(props.node))
const controlState = useKeyModifier('Control')

const { focused } = useFocusWithin(root)

function onMousedown(e: MouseEvent) {
    if (e.ctrlKey) {
        editor.selectNodes(...editor.currentSelection, props.node)

        return
    }

    editor.selectNodes(props.node)
}

onKeyStroke(
    'ArrowUp',
    (e) => {
        e.preventDefault()

        editor.selectPrevNode()
    },
    { target: root }
)

onKeyStroke('ArrowDown', (e) => {
    if (!isSelected.value) return

    e.preventDefault()

    setTimeout(() => editor.selectNextNode(), 100)

    // editor.move(1)
})

onKeyStroke('Enter', (e) => {
    // if (!isSelected.value) return
    // e.preventDefault()
    // if (!e.ctrlKey) return
    // const created = editor.addNodeAfter(props.node)
    // if (!created) return
    // setTimeout(() => editor.select(created.id), 100)
})

onKeyStroke(
    'Delete',
    (e) => {
        if (!e.ctrlKey) return

        e.preventDefault()

        // const index = editor.nodes.indexOf(props.node)

        // const isLast = editor.nodes.length - 1 === index

        // const direction = isLast ? -2 : 2

        // editor.move(direction)

        // setTimeout(() => editor.removeNode(props.node), 100)
    },
    { target: content }
)

watch(focused, (focused) => {
    if (focused && !controlState.value) {
        editor.selectNodes(props.node)
    }
})

watch(isSelected, (v) => {
    emit(v ? 'onSelect' : 'onUnselect')
})

// menu options

const tm = useI18n()

const options = [
    {
        icon: 'trash',
        label: tm.t('deleteEntity', [tm.t('block')]),
        handler: () => editor.removeNode(props.node),
    },
    {
        icon: 'plus',
        label: tm.t('addBlockAbove'),
        handler: () => editor.addNodeBefore(props.node),
    },
    {
        icon: 'plus',
        label: tm.t('addBlockBelow'),
        handler: () => editor.addNodeAfter(props.node),
    },
]
</script>

<template>
    <div
        ref="root"
        class="flex min-h-[48px] items-center group hover:bg-b-secondary/50"
        :data-block-id="node.id"
        :class="isSelected ? 'bg-b-secondary/50' : ''"
        @mousedown="onMousedown"
    >
        <div class="w-[40px] flex justify-center self-start">
            <v-menu offset-y close-on-content-click v-bind="bindings.menu">
                <template #activator="{ attrs }">
                    <slot name="menu-activator" :attrs="attrs">
                        <v-btn
                            v-bind="attrs"
                            mode="text"
                            size="none"
                            color="b-primary"
                            class="h-12 text-sm opacity-0 group-hover:opacity-100"
                        >
                            <v-icon name="grip-vertical" />
                        </v-btn>
                    </slot>
                </template>

                <v-card color="b-secondary" class="rounded">
                    <slot name="menu-before" />

                    <v-list-item
                        v-for="(option, index) in options"
                        :key="index"
                        size="xs"
                        @click="option.handler"
                    >
                        <v-icon :name="option.icon" class="mr-2" />

                        {{ upperFirst(lowerCase(option.label)) }}
                    </v-list-item>
                    <slot name="menu-after" />
                </v-card>
            </v-menu>
        </div>

        <div ref="content" class="flex-1" :class="controlState ? 'pointer-events-none' : ''">
            <slot />
        </div>

        <div class="w-[40px] flex justify-center">
            <slot name="after" />
        </div>
    </div>
</template>
