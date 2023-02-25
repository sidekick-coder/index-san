<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import Menu from '@core/entities/menu'

import VDraggable from 'vuedraggable'

import { useState } from '@composables/state'
import { createBindings } from '@composables/binding'

import { Icon } from '@iconify/vue'
import { useNonReactive } from '@composables/utils'
const IIconPicker = defineAsyncComponent(() => import('@modules/icon/components/IIconPicker.vue'))

// Props & Emits
const props = defineProps({
    item: {
        type: Object as () => Menu,
        required: true,
    },
    deep: {
        type: Number,
        default: 0,
    },
    dragOptions: {
        type: Object,
        default: () => ({}),
    },
    disableIconPicker: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update', 'update:item'])

// Bindings
const attrs = useAttrs()

const bindings = createBindings(attrs, ['label', 'icon'])

// toggle children
const hideSections = useState<string[]>('app:menu:hide', [], {
    localStorage: true,
})

function toggle() {
    const index = hideSections.value.findIndex((i) => i === props.item.id)

    if (index !== -1) {
        hideSections.value.splice(index, 1)
        hideSections.value = hideSections.value.slice()
        return
    }

    hideSections.value.push(props.item.id)

    hideSections.value = hideSections.value.slice()
}

const show = computed(() => !hideSections.value.includes(props.item.id))

watch(
    () => props.item,
    () => emit('update'),
    { deep: true }
)
// Icon

const dialog = ref(false)

function updateIcon(name: string) {
    if (!props.item) return

    emit('update:item', { ...props.item, icon: name })

    dialog.value = false
}

// children

function onUpdateChildren(childItem: Menu) {
    if (!props.item) return

    const newChildren = useNonReactive(props.item.children).map((i) => {
        if (i.id === childItem.id) {
            return childItem
        }

        return i
    })

    emit('update:item', {
        ...props.item,
        children: newChildren,
    })
}
</script>
<template>
    <v-list-item
        :to="item.to"
        active-class="bg-t-secondary/10"
        size="none"
        color="hover:bg-t-secondary/5 "
        class="py-2 text-sm"
    >
        <v-dialog v-if="!disableIconPicker" v-model="dialog">
            <i-icon-picker @update:model-value="updateIcon" />
        </v-dialog>

        <v-btn
            mode="text"
            size="xs"
            class=""
            color="text-t-secondary"
            :class="[
                (item.children.length && !item.isSection) || (!show && item.isSection)
                    ? 'opacity-100'
                    : 'opacity-0',
            ]"
            @click.prevent.stop="toggle"
        >
            <v-icon :name="show ? 'caret-down' : 'caret-right'" />
        </v-btn>

        <template v-if="item.isSection">
            <v-btn
                mode="text"
                size="xs"
                color="hover:bg-b-primary/40"
                class="text-t-secondary font-bold -ml-2"
                @click="toggle"
            >
                {{ item.label }}
            </v-btn>
        </template>

        <template v-else>
            <v-btn
                v-bind="bindings.icon"
                class="-ml-1 mr-2"
                size="xs"
                :color="disableIconPicker ? 'none' : 'hover:bg-b-primary/40'"
                mode="text"
                @mousedown.stop="dialog = true"
            >
                <Icon v-if="item.icon?.includes(':')" :icon="item.icon" class="w-3.5 h-3.5" />
                <Icon v-else icon="fa:bookmark" class="w-3.5 h-3.5" />
            </v-btn>

            <div v-bind="bindings.label">{{ item.label }}</div>
        </template>
    </v-list-item>

    <v-draggable
        v-if="show && item.children.length"
        v-bind="dragOptions"
        :list="item.children"
        :component-data="{
            style: `margin-left: ${deep * 20}px`,
        }"
    >
        <template #item="{ index }">
            <div>
                <l-drawer-item
                    :item="item.children[index]"
                    :deep="deep + 1"
                    :drag-options="dragOptions"
                    @update:item="onUpdateChildren"
                />
            </div>
        </template>
    </v-draggable>
</template>
