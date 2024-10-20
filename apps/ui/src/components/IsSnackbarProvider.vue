<script setup lang="ts">
import type { SnackbarItem } from '../composables/snackbar'
import uppFirst from 'lodash/upperFirst'

const snackbar = useQuickSnackbar()

const colorList: any = {
    primary: 'bg-primary-300 text-body-0',
    secondary: 'bg-secondary-300 text-body-0',
    success: 'bg-success-300 text-body-0',
    danger: 'bg-danger-300 text-body-0',

    zinc: 'bg-secondary-background text-main-text',
    accent: 'bg-accent text-white',
}

function findColor(item: SnackbarItem) {
    if (item.color) {
        return colorList[item.color]
    }

    return colorList.accent
}
</script>

<template>
    <div class="fixed bottom-0 right-0 z-50 flex flex-col gap-y-2 p-4">
        <div
            v-for="(item, index) in snackbar.items"
            v-show="index < 5"
            :key="item.id"
            class="w-64 rounded px-4 py-3 shadow"
            :class="findColor(item)"
        >
            <div class="text-sm font-bold">
                {{ uppFirst(item.title?.toLowerCase()) }}
            </div>

            <div
                v-if="item.message"
                class="text-xs"
            >
                {{ item.message }}
            </div>
        </div>
    </div>
</template>
