<script setup lang="ts">
import type { Workspace } from '@/composables/workspace';
import { useWorkspaces, } from './composables/useWorkspaces'

// general
const router = useRouter()

const { load, loading, workspaces, save } = useWorkspaces()
const { basename } = useDrive()

onMounted(load)

// create

function getHandle() {
	return showDirectoryPicker({ mode: 'readwrite', })
		.then(handle => handle)
		.catch(() => null)
}

async function addNew() {
	const handle = await getHandle()

	if (!handle) return

	await save({
		handle,
		label: basename(handle.name),
	})
}

// select

async function select(workspace: Workspace) {
	if (!(await verifyPermission(workspace))) return

	const success = loadWorkspace(workspace)

	if (!success) return

	setTimeout(() => {
		router.push('/entries')
	}, 100)
}

</script>

<template>
    <div class="h-screen w-screen flex flex-col">
        <div class="w-full h-20 p-4 flex gap-x-3">
            <is-logo class="size-6" />

            <h1 class="text-lg font-bold">
                Index-san
            </h1>
        </div>

        <div class="flex-1 flex items-center justify-center">
            <div v-if="loading">
                <div class="text-2xl">
                    {{ $t('loading') }}
                </div>
            </div>

            <div
                v-else
                class="w-full max-w-[20rem]"
            >
                <div class="text-center mb-4">
                    <h1 class="font-bold text-2xl">
                        Workspace
                    </h1>
                    <h2>Select a workspace folder</h2>
                </div>

                <div class="flex flex-col gap-y-4 w-full">
                    <is-btn to="/hephaestus/live">
                        Editor tests
                    </is-btn>

                    <is-btn @click="addNew">
                        {{ $t('addEntity', [$t('workspace')]) }}
                    </is-btn>

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
    </div>
</template>
