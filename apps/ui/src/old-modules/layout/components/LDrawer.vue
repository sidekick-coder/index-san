<script setup lang="ts">
import Menu from '@index-san/core/entities/menu'
import { useStore } from '@store/global'
import { useToggleDrawer } from '../composables/drawer'
import VDraggable from 'vuedraggable'

import LDrawerItem from './LDrawerItem.vue'

// general
const store = useStore()
const drawer = useToggleDrawer()

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
    <div class="bg-b-secondary text-t-primary border-r border-b-primary group">
        <div class="flex h-full">
            <div class="w-14 h-full bg-zinc-900 border-r border-zinc-800 shadow">
                <div class="flex flex-col h-full">
                    <v-list-item
                        size="h-12"
                        color="text-t-secondary hover:text-t-primary"
                        class="flex items-center justify-center"
                        @click="drawer = !drawer"
                    >
                        <v-logo class="w-5 h-5" />
                    </v-list-item>

                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-list-item
                                to="/entries"
                                size="h-12"
                                color="text-t-secondary hover:text-t-primary"
                                class="flex items-center justify-center"
                                v-bind="attrs"
                            >
                                <v-icon name="mdi:file-multiple" />
                            </v-list-item>
                        </template>

                        <div>
                            {{ $t('entry', 2) }}
                        </div>
                    </v-tooltip>

                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-list-item
                                to="/collections"
                                size="h-12"
                                color="text-t-secondary hover:text-t-primary"
                                class="flex items-center justify-center"
                                v-bind="attrs"
                            >
                                <v-icon name="fa:database" />
                            </v-list-item>
                        </template>

                        <div>
                            {{ $t('collection', 2) }}
                        </div>
                    </v-tooltip>

                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-list-item
                                to="/cheat-sheet"
                                size="h-12"
                                color="text-t-secondary hover:text-t-primary"
                                class="flex items-center justify-center"
                                v-bind="attrs"
                            >
                                <v-icon name="fa-brands:markdown" />
                            </v-list-item>
                        </template>

                        <div>
                            {{ $t('cheatSheet', 2) }}
                        </div>
                    </v-tooltip>

                    <div class="grow" />

                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-list-item
                                to="/workspaces"
                                size="h-12"
                                color="text-t-secondary hover:text-t-primary"
                                class="flex items-center justify-center"
                                v-bind="attrs"
                            >
                                <v-icon name="fa:cubes" />
                            </v-list-item>
                        </template>

                        <div>
                            {{ $t('workspace', 2) }}
                        </div>
                    </v-tooltip>

                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-list-item
                                to="/options"
                                size="h-12"
                                color="text-t-secondary hover:text-t-primary"
                                class="flex items-center justify-center"
                                v-bind="attrs"
                            >
                                <v-icon name="fa:cog" />
                            </v-list-item>
                        </template>

                        <div>
                            {{ $t('option', 2) }}
                        </div>
                    </v-tooltip>
                </div>
            </div>

            <div
                v-if="drawer"
                class="w-64 flex flex-col"
            >
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

                <div class="mt-auto" />

                <v-list-item
                    color="bg-b-secondary hover:bg-b-primary/40 text-t-secondary"
                    class="border-t border-lines justify-between"
                    @click="store.menu.addSection"
                >
                    {{ $t('addEntity', [$t('section')]) }}

                    <v-icon name="plus" />
                </v-list-item>
            </div>
        </div>
    </div>
</template>

<style>
.ghost {
    @apply border-t border-accent;
}
</style>
