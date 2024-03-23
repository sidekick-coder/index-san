<script setup lang="ts">
import uuid from 'uuid-random'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { onKeyStroke } from '@vueuse/core'

import { useStore } from '@modules/menu/store'
import { useToggleDrawer } from '../composables/drawer'
import { useMeta } from '@composables/metas'

const route = useRoute()
const router = useRouter()

const drawer = ref({
    show: useToggleDrawer(),
    toggle: () => {
        drawer.value.show = !drawer.value.show
    },
})

// links

const links = computed(() =>
    route.path
        .split('/')
        .filter((p) => p !== '')
        .map((label) => decodeURI(label))
        .map((label, index, array) => {
            let to: string | null = array.slice(0, index + 1).join('/')

            to = '/' + to

            const { matched } = router.resolve(to)

            if (matched[0].name === 'error') {
                to = null
            }

            if (to === route.path) {
                to = null
            }

            if (label === 'entries') {
                label = 'Root'
            }

            if (label.length > 80) {
                label = label.slice(0, 80) + '...'
            }

            return {
                label,
                to,
            }
        })
)

// navigation

const navigation = ref({
    haveBack: !!window.history.state.forward,
    haveForward: !!window.history.state.forward,
    goBack: () => router.go(-1),
    goForward: () => router.go(1),
})

watch(
    () => route.fullPath,
    () => {
        navigation.value.haveBack = !!window.history.state.back
        navigation.value.haveForward = !!window.history.state.forward
    },
    { immediate: true }
)

// add page to menu

const store = useStore()
const meta = useMeta()

const menu = ref({
    item: computed(() => store.menu.find((i) => i.to === route.path)),
    async create() {
        await store.create({
            label: meta.value.title ?? document.title,
            to: route.path,
            children: [],
            id: uuid(),
            icon: 'bookmark',
        })
    },
})
// register shortcuts

onKeyStroke(['ArrowLeft'], (e) => {
    if (!e.altKey) return

    if (!navigation.value.haveBack) return

    navigation.value.goBack()
})

onKeyStroke(['ArrowRight'], (e) => {
    if (!e.altKey) return

    if (!navigation.value.haveForward) return

    navigation.value.goForward()
})
</script>

<template>
    <v-layout-toolbar
        class="px-7 border-b border-lines text-sm"
        :height="45"
    >
        <slot
            :links="links"
            :drawer="drawer"
            :navigation="navigation"
            :menu="menu"
        >
            <v-btn
                mode="text"
                size="sm"
                @click="drawer.toggle"
            >
                <v-icon name="bars" />
            </v-btn>

            <v-btn
                :disabled="!navigation.haveBack"
                mode="text"
                size="sm"
                @click="navigation.goBack"
            >
                <v-icon name="arrow-left" />
            </v-btn>

            <v-btn
                :disabled="!navigation.haveForward"
                mode="text"
                size="sm"
                @click="navigation.goForward"
            >
                <v-icon name="arrow-right" />
            </v-btn>

            <slot name="append-navigation" />

            <template
                v-for="(link, index) in links"
                :key="index"
            >
                <v-btn
                    v-if="link.to"
                    size="sm"
                    mode="text"
                    :to="link.to"
                >
                    {{ link.label }}
                </v-btn>

                <div
                    v-else
                    class="text-xs px-3 py-1"
                >
                    {{ link.label }}
                </div>

                <div
                    v-if="links.length >= 2 && index !== links.length - 1"
                    class="px-1"
                >
                    /
                </div>
            </template>

            <slot name="append-links">
                <div class="grow" />
            </slot>

            <v-btn
                mode="text"
                size="sm"
                @click="menu.create"
            >
                <v-icon name="bookmark" />
            </v-btn>
        </slot>
    </v-layout-toolbar>
</template>
