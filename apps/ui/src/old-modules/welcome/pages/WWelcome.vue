<script setup lang="ts">
import lowerCase from 'lodash/lowerCase'
import packageJSON from '@root/package.json'

import { useStore } from '@store/global'
import { useRouter } from 'vue-router'

import WForm from '@modules/workspace/components/WForm.vue'
import Workspace from '@index-san/core/entities/workspace'

// check if have workspaces
const store = useStore()
const router = useRouter()

onMounted(async () => {
    await store.workspace.setWorkspaces()

    if (store.workspace.workspaces.length) {
        return await router.push('/workspaces')
    }
})

async function onCreated(workspace: Workspace) {
    store.workspace.currentId = workspace.id

    await router.push('/workspaces')
}
</script>
<template>
    <div class="h-screen w-screen flex items-center justify-center">
        <v-card width="500">
            <v-logo class="h-32 mb-4" />

            <v-card-content class="flex-wrap">
                <div class="text-center w-full font-bold mb-2 text-2xl">
                    Index-san
                </div>

                <div class="text-center w-full text-sm text-t-secondary mb-4">
                    {{ `${$t('version')}: ${packageJSON.version} ` }}
                </div>

                <w-form
                    class="flex flex-wrap gap-y-4 w-full"
                    browse-btn:color="b-secondary"
                    @created="onCreated"
                >
                    <template #head>
                        <div class="text-lg text-t-secondary font-bold px-4">
                            {{ $t('createEntity', [lowerCase($t('workspace'))]) }}
                        </div>
                    </template>
                </w-form>
            </v-card-content>
        </v-card>
    </div>
</template>
