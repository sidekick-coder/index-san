<script setup lang="ts">
import ViewGroup from '@core/entities/view-group'

import { createBindings } from '@/composables/binding'
import { computed, useAttrs, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/global'

import CActions from './CActions.vue'
import CGallery from './CGallery.vue'
import CTable from './CTable.vue'
import ViewTable from '@/../core/entities/view-table'
import ViewGallery from '@/../core/entities/view-gallery'

import VDraggable from 'vuedraggable'
import { useNonReactive } from '@/composables/utils'

// Props & emit

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: null,
    },
})
// bindings
const bindings = computed(() => createBindings(useAttrs(), ['head', 'table', 'gallery']))

// collection

const store = useStore()

// view
const innerViewId = ref('')

const view = computed(() => store.view.get<ViewGroup>(props.collectionId, innerViewId.value))

async function setViews() {
    innerViewId.value = props.viewId || ''

    await store.view.setViews(props.collectionId)

    if (!view.value) {
        const view = new ViewGroup({}, props.viewId)

        innerViewId.value = view.id

        await store.view.create(props.collectionId, view, !!props.viewId)
    }
}

watch(props, setViews, {
    immediate: true,
    deep: true,
})

// selection

const all = computed(() =>
    store.view.all(props.collectionId).filter((v) => v.component !== 'group')
)

const group = computed({
    get() {
        if (!view.value) return []

        const viewIds = view.value.viewIds

        const items = useNonReactive(all.value).filter((v) => viewIds.includes(v.id))

        items.sort((a, b) => {
            const aIndex = viewIds.findIndex((id) => id === a.id)
            const bIndex = viewIds.findIndex((id) => id === b.id)

            if (aIndex === -1 || bIndex === -1) return 0

            return aIndex - bIndex
        })

        return items
    },
    set(value) {
        if (!view.value) return

        view.value.viewIds = value.map((v) => v.id)
    },
})

function seleteView(id: string) {
    if (!view.value) return

    view.value.selected = id
}

function isActive(id: string) {
    if (!view.value) return

    return view.value.selected === id && !register.value?.loading
}

// add new view

const options = {
    table: () => new ViewTable(),
    gallery: () => new ViewGallery(),
}

async function addView(type: keyof typeof options) {
    const payload = options[type]()

    payload.label = 'New'

    await store.view.create(props.collectionId, payload, !!props.viewId)

    if (view.value) {
        view.value.selected = payload.id

        view.value.viewIds.push(payload.id)
    }
}

// items

const register = computed(() => store.item.getStoreItem(props.collectionId))

// delete

async function deleteView(id: string) {
    await store.view.destroy(props.collectionId, id)

    seleteView(group.value[0].id)
}

// menu

function showMenu(id: string, handler: () => void) {
    if (isActive(id)) {
        return handler()
    }

    seleteView(id)
}
</script>
<template>
    <v-card v-if="view" v-bind="bindings.root">
        <c-actions v-bind="bindings.head" :collection-id="collectionId" :view-id="view.selected">
            <template #left>
                <div class="flex -mb-[1px]">
                    <v-draggable
                        v-model="group"
                        item-key="id"
                        handle=".drag"
                        :component-data="{ class: 'flex -mb-[1px]' }"
                    >
                        <template #item="{ element: v }">
                            <div>
                                <v-menu offset-y :open-on-click="false" close-on-content-click>
                                    <template #activator="{ attrs, toggle }">
                                        <v-btn
                                            v-bind="attrs"
                                            text
                                            size="text-sm px-4 h-[45px]"
                                            tile
                                            color="border-b border-transparent hover:bg-b-secondary/50"
                                            class="drag"
                                            :class="isActive(v.id) ? 'border-t-primary' : ''"
                                            @click="showMenu(v.id, toggle)"
                                        >
                                            {{ v.label || v.id }}
                                        </v-btn>
                                    </template>

                                    <v-card color="b-secondary">
                                        <v-list-item size="sm" @click="deleteView(v.id)">
                                            {{ $t('deleteEntity', ['view']) }}
                                        </v-list-item>
                                    </v-card>
                                </v-menu>
                            </div>
                        </template>
                    </v-draggable>

                    <v-menu offset-y close-on-content-click>
                        <template #activator="{ attrs }">
                            <v-btn
                                text
                                size="text-sm px-4 h-[45px]"
                                tile
                                color="border-b border-transparent hover:bg-b-secondary/50"
                                v-bind="attrs"
                            >
                                <template v-if="!all.length">
                                    <span class="mr-4">
                                        {{ $t('addEntity', [$t('view')]) }}
                                    </span>
                                </template>

                                <v-icon name="plus" />
                            </v-btn>
                        </template>

                        <v-card color="b-secondary">
                            <v-list-item @click="addView('table')">
                                {{ $t('addEntity', [$t('table')]) }}
                            </v-list-item>
                            <v-list-item @click="addView('gallery')">
                                {{ $t('addEntity', [$t('gallery')]) }}
                            </v-list-item>
                        </v-card>
                    </v-menu>
                </div>
            </template>
        </c-actions>

        <div class="overflow-auto w-full h-[calc(100%_-_45px)]">
            <transition-group name="c-view-group">
                <template v-for="v in all" :key="v.id">
                    <c-gallery
                        v-if="v.component === 'gallery' && v.id === view.selected"
                        :collection-id="collectionId"
                        :view-id="v.id"
                        v-bind="bindings.gallery"
                        hide-actions
                    />

                    <c-table
                        v-if="v.component === 'table' && v.id === view.selected"
                        :collection-id="collectionId"
                        :view-id="v.id"
                        v-bind="bindings.table"
                        height="100%"
                        hide-actions
                    />
                </template>
            </transition-group>

            <div v-if="!all.length" class="h-full w-full flex items-center justify-center">
                <div class="text-center mb-2 text-t-secondary">
                    <v-icon name="box-open" class="text-2xl" />

                    <div class="block">
                        {{ $t('noEntity', [$t('view', 2)]) }}
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>

<style>
.c-view-group-move,
.c-view-group-enter-active,
.c-view-group-leave-active {
    transition: all 0.3s ease;
}

.c-view-group-enter-from,
.c-view-group-leave-to {
    transform: translateX(10%);
    opacity: 0;
}
.c-view-group-leave-active {
    position: absolute;
}
</style>
