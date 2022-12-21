<script setup lang="ts">
import { useStore } from '@/modules/option/store'
import { useLocale, useLanguages } from '@/plugins/i18n'

const store = useStore()

const locale = useLocale()

const languages = useLanguages()

async function save() {
    await store.save({
        data: {
            locale: locale.value,
        },
    })
}
</script>
<template>
    <v-container class="py-5">
        <v-select
            v-model="locale"
            :label="$t('language')"
            :options="languages"
            card:width="300"
            @update:model-value="save"
        />
    </v-container>
</template>
