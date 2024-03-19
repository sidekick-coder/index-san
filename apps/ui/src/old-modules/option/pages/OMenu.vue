<script setup lang="ts">
import Menu from '@index-san/core/entities/menu'
import { useMeta } from '@composables/metas'
import { useStore } from '@modules/menu/store'

import OMenuItem from '@modules/option/components/OMenuItem.vue'
import Draggable from 'vuedraggable'

// metas
useMeta({ title: 'Menu settings' })

const store = useStore()

async function onUpdate() {
    await store.save()
}

async function onItemDelete(item: Menu) {
    const index = store.menu.indexOf(item)

    if (index !== -1) {
        store.menu.splice(index, 1)

        await store.save()
    }
}

// add section

function addSection() {
    store.menu.push({
        id: String(Math.random() * 9999),
        label: 'Label',
        icon: 'code',
        isSection: true,
        children: [],
    })
}

// dragging
const drag = {
    options: {
        emptyInsertThreshold: 22,
        handle: '.drag-handle',
        itemKey: 'id',
        group: 'menu',
    },
}
</script>
<template>
    <v-container class="py-4">
        <div
            v-if="!store.menu.length"
            class="my-4 py-2 w-full text-center border border-lines"
        >
            {{ $t('noEntity', [$t('item', 2)]) }}
        </div>

        <Draggable
            :list="store.menu"
            v-bind="drag.options"
            class="w-full"
        >
            <template #item="{ index }">
                <o-menu-item
                    v-model="store.menu[index]"
                    :drag-options="drag.options"
                    @update="onUpdate"
                    @destroy="onItemDelete"
                />
            </template>

            <template #footer>
                <v-btn @click="addSection">
                    {{ $t('addEntity', [$t('section')]) }}
                </v-btn>
            </template>
        </Draggable>
    </v-container>
</template>
