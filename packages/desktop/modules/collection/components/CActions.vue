<script setup lang="ts">
import ViewCommon from '@/../core/entities/view-common'
import ViewGallery from '@/../core/entities/view-gallery'

import { debounce } from 'lodash'
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from '../store'

import CDrawerFilter from './CDrawerFilter.vue'
import CDrawerHideColumns from './CDrawerHideColumns.vue'

// Props & emit
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: '',
    },
})

// collection
const store = useStore()

const columns = computed(() => store.column.all(props.collectionId))

// view

const view = computed(() => store.view.get<ViewCommon>(props.collectionId, props.viewId))

// items

const register = computed(() => store.item.getStoreItem(props.collectionId))

// search
const showInput = ref(false)

const input = computed({
    get() {
        return view.value?.search || ''
    },
    set: debounce((v: string) => {
        if (!view.value) return

        view.value.search = v
    }, 1000),
})

const menu = ref(false)

// refresh

async function refresh() {
    await store.item.setItems(props.collectionId, true)

    await store.column.set(props.collectionId, true)
}
</script>
<template>
    <v-card-head :class="register?.loading ? 'border-b-accent' : ''">
        <slot name="left" />

        <div class="grow"></div>

        <template v-if="view">
            <template v-if="view instanceof ViewCommon">
                <div class="flex items-center transition-all">
                    <transition name="slide-left">
                        <v-input
                            v-if="showInput || !!input"
                            v-model="input"
                            :placeholder="$t('search')"
                            size="sm"
                            class="w-[300px] mr-2"
                        >
                            <template #append>
                                <v-btn
                                    v-if="input"
                                    text
                                    size="none"
                                    class="w-5 h-5"
                                    @click="input = ''"
                                >
                                    <v-icon name="times" />
                                </v-btn>
                            </template>
                        </v-input>
                    </transition>

                    <v-btn text size="sm" @click="showInput = !showInput">
                        <v-icon name="search" />
                    </v-btn>

                    <v-btn text size="sm" @click="refresh">
                        <v-icon name="rotate" />
                    </v-btn>

                    <c-drawer-hide-columns :collection-id="collectionId" :view-id="viewId" />

                    <c-drawer-filter v-model="view.filters" :columns="columns" />
                </div>
            </template>

            <v-menu v-model="menu" offset-y offset-x :open-on-click="false">
                <template #activator="{ attrs }">
                    <div class="h-[44px] flex items-center" v-bind="attrs">
                        <v-btn text size="sm" @click="menu = !menu">
                            <v-icon name="cog" />
                        </v-btn>
                    </div>
                </template>

                <v-card color="b-secondary">
                    <v-card-content class="flex flex-wrap gap-y-4">
                        <v-input v-model="view.label" :label="$t('label')" />

                        <template v-if="view instanceof ViewGallery">
                            <v-select
                                v-model="view.thumbnail.key"
                                :options="columns"
                                label-key="label"
                                value-key="field"
                                :label="$t('thumbnail')"
                            />

                            <v-select
                                v-model="view.thumbnail.fit"
                                :options="['cover', 'contain', 'fill', 'none', 'scale-down']"
                                :label="$t('fit')"
                            />

                            <v-select
                                v-model="view.thumbnail.position"
                                :options="[
                                    'top',
                                    'bottom',
                                    'center',
                                    'left',
                                    'right',

                                    'left-top',
                                    'left-bottom',
                                    'right-top',
                                    'right-bottom',
                                ]"
                                :label="$t('position')"
                            />

                            <div class="flex gap-x-4">
                                <v-input
                                    v-model="view.sizes.sm.width"
                                    :label="$t('widthEntity', ['sm'])"
                                    class="max-w-[80px]"
                                />

                                <v-input
                                    v-model="view.sizes.md.width"
                                    :label="$t('widthEntity', ['md'])"
                                    class="max-w-[80px]"
                                />

                                <v-input
                                    v-model="view.sizes.lg.width"
                                    :label="$t('widthEntity', ['lg'])"
                                    class="max-w-[80px]"
                                />
                            </div>

                            <div class="flex gap-x-4">
                                <v-input
                                    v-model="view.sizes.sm.height"
                                    :label="$t('heightEntity', ['sm'])"
                                    class="max-w-[80px]"
                                />

                                <v-input
                                    v-model="view.sizes.md.height"
                                    :label="$t('heightEntity', ['md'])"
                                    class="max-w-[80px]"
                                />

                                <v-input
                                    v-model="view.sizes.lg.height"
                                    :label="$t('heightEntity', ['lg'])"
                                    class="max-w-[80px]"
                                />
                            </div>
                        </template>
                    </v-card-content>
                </v-card>
            </v-menu>
        </template>
    </v-card-head>
</template>
