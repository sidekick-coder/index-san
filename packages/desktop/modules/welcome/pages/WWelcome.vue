<script setup lang="ts">
import lowerCase from 'lodash/lowerCase'
import packageJSON from '@root/package.json'

import Workspace from '@core/entities/workspace'

import { useConfig } from '@composables/use-config'
import { useStore } from '@modules/workspace/store'
import { useRouter } from 'vue-router'

// check if have workspaces
const store = useStore()
const router = useRouter()

onMounted(async () => {
    await store.setWorkspaces()

    if (store.workspaces.length) {
        return await router.push('/workspaces')
    }
})

// submit

const payload = ref<Omit<Workspace, 'id'>>({
    name: '',
    driveName: 'local',
    config: {
        path: '',
    },
})

async function submit() {
    const { id } = await store.create(payload.value)

    store.currentId = id

    await router.push('/workspaces')
}

// pick file

const config = useConfig()

async function pickFolder() {
    const path = await config.open.directory()

    payload.value.config.path = path
}
</script>
<template>
    <div class="h-screen w-screen flex items-center justify-center">
        <v-card width="500">
            <v-logo class="h-32 mb-4" />

            <v-card-content class="flex-wrap">
                <div class="text-center w-full font-bold mb-2 text-2xl">Index-san</div>

                <div class="text-center w-full text-sm text-t-secondary mb-4">
                    {{ `${$t('version')}: ${packageJSON.version} ` }}
                </div>

                <div class="mb-4 text-lg text-t-secondary font-bold">
                    {{ $t('createEntity', [lowerCase($t('workspace'))]) }}
                </div>

                <form class="flex flex-wrap gap-y-4 w-full" @submit.prevent="submit">
                    <v-input v-model="payload.name" :label="$t('name')" />

                    <v-select v-model="payload.driveName" :label="$t('drive')" disabled />

                    <v-input v-model="payload.config.path" :label="$t('path')">
                        <template #append>
                            <v-btn size="sm" color="b-secondary" @click="pickFolder">
                                {{ $t('browse') }}
                            </v-btn>
                        </template>
                    </v-input>

                    <v-btn
                        type="submit"
                        class="w-full"
                        :disabled="!payload.name || !payload.config.path"
                    >
                        {{ $t('create') }}
                    </v-btn>
                </form>
            </v-card-content>
        </v-card>
    </div>
</template>
