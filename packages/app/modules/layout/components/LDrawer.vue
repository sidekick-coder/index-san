<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import Menu from '@core/entities/menu'
import packageJSON from '@root/package.json'

import { useStore } from '@store/global'

import { useToggleDrawer } from '../composables/drawer'

import VDraggable from 'vuedraggable'

const LDrawerItem = defineAsyncComponent(() => import('./LDrawerItem.vue'))

const drawer = useToggleDrawer()

// menu
const tm = useI18n()
const store = useStore()

const defaultItems: Menu[] = [
    {
        label: tm.t('workspace', 2),
        to: '/workspaces',
        children: [],
        id: 'workspaces',
        icon: 'fa:cubes',
    },
    {
        label: tm.t('collection', 2),
        to: '/collections',
        children: [],
        id: 'collections',
        icon: 'fa:database',
    },
    {
        label: tm.t('entry', 2),
        to: '/entries',
        children: [],
        id: 'entries',
        icon: 'fa:folder',
    },
    {
        label: tm.t('option', 2),
        to: '/options',
        children: [],
        id: 'options',
        icon: 'fa:cog',
    },
]

// title

const title = computed(() => {
    if (store.workspace.current) {
        return store.workspace.current.name
    }

    return 'Index-san'
})

async function onUpdate() {
    await store.menu.save()
}

async function updateItem(item: Menu) {
    store.menu.menu.forEach((i) => {
        if (i.id === item.id) {
            Object.assign(i, item)
        }
    })

    await onUpdate()
}

// Drag
const dragOptions = {
    emptyInsertThreshold: 22,
    itemKey: 'id',
    group: 'menu',
    ghostClass: 'ghost',
}

const isDragging = ref(false)
</script>

<template>
    <v-layout-drawer
        v-model="drawer"
        class="bg-b-secondary text-t-primary border-r border-b-primary group"
    >
        <v-menu offset-y>
            <template #activator="{ attrs }">
                <v-list-item
                    class="pl-7 border-b border-lines"
                    v-bind="attrs"
                    color="hover:bg-b-primary/40"
                >
                    <v-logo class="h-[20px] w-[20px] mr-3" />

                    <h1 class="font-bold">
                        {{ title }}
                    </h1>

                    <v-btn
                        mode="text"
                        class="opacity-0 group-hover:opacity-100 ml-auto"
                        size="xs"
                        @click.prevent.stop="drawer = false"
                    >
                        <v-icon name="chevron-left" />
                    </v-btn>
                </v-list-item>
            </template>

            <v-card color="b-primary">
                <v-list-item
                    v-for="workspace in store.workspace.workspaces.filter(
                        (w) => w.id !== store.workspace.currentId
                    )"
                    :key="workspace.id"
                    class="pl-7"
                    color="hover:bg-b-secondary/40"
                    @click="store.workspace.currentId = workspace.id"
                >
                    {{ workspace.name }}
                </v-list-item>

                <v-list-item class="border-t border-lines">
                    <div class="w-full text-xs text-center">
                        {{ `Index-san v${packageJSON.version}` }}
                    </div>
                </v-list-item>
            </v-card>
        </v-menu>

        <l-drawer-item
            v-for="item in defaultItems"
            :key="item.id"
            :item="item"
            icon:class="text-t-secondary"
            disable-icon-picker
        />

        <v-draggable
            v-model="store.menu.menu"
            v-bind="dragOptions"
            @update="onUpdate"
            @start="isDragging = true"
            @end="isDragging = false"
        >
            <template #item="{ index }">
                <div>
                    <l-drawer-item
                        :item="store.menu.menu[index]"
                        :drag-options="dragOptions"
                        :is-dragging="isDragging"
                        @drag="(v) => (isDragging = v)"
                        @update="onUpdate"
                        @update:item="updateItem"
                        @destroy="store.menu.menu.splice(index, 1)"
                    />
                </div>
            </template>
        </v-draggable>

        <template #footer>
            <v-list-item
                color="bg-b-secondary hover:bg-b-primary/40 text-t-secondary"
                size="h-full py-3 px-10 text-xs"
                class="border-t border-lines justify-between"
                @click="store.menu.addSection"
            >
                {{ $t('addEntity', [$t('section')]) }}

                <v-icon name="plus" />
            </v-list-item>
        </template>
    </v-layout-drawer>
</template>

<style>
.ghost {
    @apply border-t border-accent;
}
</style>
