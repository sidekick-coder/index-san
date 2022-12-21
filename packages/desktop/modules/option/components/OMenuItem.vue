<script setup lang="ts">
import Menu from '@core/entities/menu'
import { watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

import Draggable from 'vuedraggable'

const props = defineProps({
    modelValue: {
        type: Object as () => Menu,
        required: true,
    },
    dragOptions: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue', 'update', 'destroy'])

const item = useVModel(props, 'modelValue', emit)

watch(item, () => emit('update'), { deep: true })

function removeChildren(index: number) {
    item.value.children.splice(index, 1)

    emit('update')
}
</script>
<template>
    <div class="my-2 border border-lines rounded">
        <is-list-item class="border-lines items-center">
            <v-btn class="w-[38px] h-[38px] drag-handle" text>
                <v-icon name="grip-vertical" />
            </v-btn>

            <v-icon-picker v-if="!item.isSection" v-model="item.icon">
                <template #activator="{ attrs }">
                    <v-btn class="w-[38px] h-[38px] ml-2" v-bind="attrs" text>
                        <v-icon v-if="item.icon" :name="item.icon"></v-icon>
                        <v-icon v-else name="circle"></v-icon>
                    </v-btn>
                </template>
            </v-icon-picker>

            <is-input v-model="item.label" class="ml-2 w-full max-w-[500px]" />

            <v-btn
                class="w-[38px] h-[38px] ml-2"
                text
                color="danger"
                @click="$emit('destroy', item)"
            >
                <v-icon name="trash" />
            </v-btn>
        </is-list-item>

        <div class="ml-8 mr-4">
            <Draggable v-model="item.children" v-bind="dragOptions">
                <template #item="{ index }">
                    <o-menu-item
                        v-model="item.children[index]"
                        :drag-options="dragOptions"
                        @update="$emit('update')"
                        @destroy="removeChildren(index)"
                    />
                </template>
            </Draggable>
        </div>
    </div>
</template>
