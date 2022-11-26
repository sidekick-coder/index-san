<script setup lang="ts">
import { useLocale } from '@/plugins/i18n'

const locale = useLocale()

const options = ['en-US', 'pt-BR']
</script>
<template>
    <div class="py-5">
        <is-select v-model="locale" :label="$t('language')" :options="options" />
    </div>
</template>
