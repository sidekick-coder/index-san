<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'

import { useTheme } from '@/src/composables/theme'

const tm = useI18n()
const theme = useTheme()

const payload = ref(theme.get().colors)

const colors = [
    {
        label: tm.t('backgroundPrimaryColor'),
        key: 'b-primary',
        default: '24 24 27',
    },
    {
        label: tm.t('backgroundSecondaryColor'),
        key: 'b-secondary',
        default: '39 39 42',
    },
    {
        label: tm.t('textPrimaryColor'),
        key: 't-primary',
        default: '255 255 255',
    },
    {
        label: tm.t('textSecondaryColor'),
        key: 't-secondary',
        default: '107 114 128',
    },
    {
        label: tm.t('linesColor'),
        key: 'lines',
        default: '55 65 81',
    },
    {
        label: tm.t('accentColor'),
        key: 'accent',
        default: '20 184 166',
    },
    {
        label: tm.t('infoColor'),
        key: 'info',
        default: '59 130 246',
    },
    {
        label: tm.t('warnColor'),
        key: 'warn',
        default: '250 204 21',
    },
    {
        label: tm.t('dangerColor'),
        key: 'danger',
        default: '239 68 68',
    },
]

// save colors

const save = debounce(() => {
    theme.set({ colors: payload.value })

    theme.load()
}, 1000)

watch(payload, save, { deep: true })
</script>

<template>
    <is-container class="gap-y-4 flex flex-wrap py-5">
        <div v-for="color in colors" :key="color.key" class="w-full flex items-end">
            <div
                class="w-24 h-24 bg-accent mr-4 text-xs flex items-end justify-center border border-lines"
                :style="`background-color: rgb(${color.default})`"
            >
                <div class="text-center bg-b-primary w-full border-t">
                    <div class="block">
                        {{ $t('default') }}
                    </div>
                    <div class="block">
                        {{ color.default }}
                    </div>
                </div>
            </div>

            <div
                class="w-24 h-24 bg-accent mr-4 text-xs flex items-end justify-center border border-lines"
                :style="`background-color: rgb(${payload[color.key]})`"
            >
                <div class="text-center bg-b-primary w-full border-t">
                    <div class="block">
                        {{ $t('current') }}
                    </div>
                </div>
            </div>

            <is-input v-model="payload[color.key]" :label="color.label" />
        </div>
    </is-container>
</template>
