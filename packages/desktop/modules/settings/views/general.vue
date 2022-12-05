<script setup lang="ts">
import { useLocale } from '@/plugins/i18n'

const locale = useLocale()

const options = ['en-US', 'pt-BR']
</script>
<template>
    <is-container class="py-5">
        <is-select v-model="locale" :label="$t('language')" :options="options" card:width="300" />
    </is-container>
</template>
