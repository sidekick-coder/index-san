<script setup lang="ts">
import { useStore } from '@/modules/options/store'
import { useLocale } from '@/plugins/i18n'
import { watch } from 'vue'

const store = useStore()

const locale = useLocale()

const options = ['en-US', 'pt-BR']
</script>
<template>
    <is-container class="py-5">
        <is-select v-model="locale" :label="$t('language')" :options="options" card:width="300" />
    </is-container>
</template>
