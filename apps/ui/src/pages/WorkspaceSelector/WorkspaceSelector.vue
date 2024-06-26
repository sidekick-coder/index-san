<script setup lang="ts">
import { useWorkspaces, type Workspace } from './composables/useWorkspaces'

// general
const router = useRouter()

// list

const { load, loading, workspaces, save, verifyPermission } = useWorkspaces()

onMounted(load)

// create

function getHandle(){
    return showDirectoryPicker({ mode: 'readwrite',})
        .then(handle =>  handle)
        .catch(() => null)
}

async function addNew(){
    const handle = await getHandle()

    if (!handle) return

    await save({
        handle,
        label: handle.name,
    })
}

// select

const { setDrive } = useDrive()

async function select(workspace: Workspace){

    const permission = await verifyPermission(workspace)

    if (!permission) return

    loadDrive(workspace.handle)

    setTimeout(() => {
        router.push('/entries')
    }, 100)
}

</script>

<template>
    <div class="min-h-[inherit] w-full flex items-center justify-center">
        <div v-if="loading">
            <div class="text-2xl">
                {{ $t('loading') }}
            </div>
        </div>

        <div
            v-else
            class="w-full max-w-[20rem]"
        >            
            <div class="flex flex-col gap-y-4 w-full">
                <is-list-item
                    justify="center"
                    color="primary"
                    variant="fill"
                    class="rounded"
                    @click="addNew"
                >
                    {{ $t('addEntity',[$t('workspace')]) }}
                </is-list-item>

                <is-list-item
                    v-for="w in workspaces"
                    :key="w.id"
                    variant="fill"
                    class="rounded"
                    @click="select(w)"
                > 
                    <div>
                        /{{ w.label }}                    
                    </div>

                    <is-icon
                        name="mdi:chevron-right"
                        class="ml-auto"
                    />
                </is-list-item>
            </div>
        </div>
    </div>
</template>