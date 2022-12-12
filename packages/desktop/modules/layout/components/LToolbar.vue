<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMeta } from '@/composables/metas'
import { useState } from '@/composables/state'

import { useStore } from '@/modules/menu/store'

const route = useRoute()
const router = useRouter()

const drawer = useState('app:drawer', true, { localStorage: true })

// links

const links = computed(() =>
    route.path
        .split('/')
        .filter((p) => p !== '')
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
const menuItem = computed(() => store.menu.find((i) => i.to === route.path))

async function toggle() {
    if (menuItem.value) {
        return await store.destroy(menuItem.value)
    }

    await store.create({
        label: meta.value.title,
        to: route.path,
    })
}
</script>

<template>
    <w-toolbar class="px-7 border-b border-lines text-sm" :height="40">
        <v-btn v-if="!drawer" text size="sm" @click="drawer = true">
            <is-icon name="bars" />
        </v-btn>

        <v-btn :disabled="!navigation.haveBack" text size="sm" @click="$router.go(-1)">
            <is-icon name="arrow-left" />
        </v-btn>

        <v-btn :disabled="!navigation.haveForward" text size="sm" @click="$router.go(1)">
            <is-icon name="arrow-right" />
        </v-btn>

        <template v-for="(link, index) in links" :key="index">
            <v-btn v-if="link.to" size="sm" text :to="link.to">
                {{ link.label }}
            </v-btn>

            <div v-else class="text-xs px-3 py-1">
                {{ link.label }}
            </div>

            <div v-if="links.length >= 2 && index !== links.length - 1" class="px-1">/</div>
        </template>

        <v-btn class="ml-auto" text size="sm" @click="toggle">
            <is-icon :name="menuItem ? 'star' : 'fa-regular fa-star'" />
        </v-btn>
    </w-toolbar>
</template>
