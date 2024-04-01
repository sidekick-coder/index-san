<script lang="ts" setup>
import { useChronoStore } from '@/modules/chrono/store';
import type ChronoObjectCommit from 'chrono/src/entities/ChronoObjectCommit';
import { formatDistanceToNow } from 'date-fns'

const path = defineProp('path', {
    type: String,
    required: true
})

// controls
const controls = ref({
    home: false,
    back: false,
    forward: false,
})

function setControls(){
    controls.value.home = path.value !== '/'
    controls.value.back = !!history.state.back && path.value !== '/'
    controls.value.forward = !!history.state.forward
}


watch(() => path.value, setControls, { immediate: true })

// change history
const chronoStore = useChronoStore()

const changes = ref<ChronoObjectCommit[]>([])
const showChanges = ref(false)

async function setChanges(){
    if (!chronoStore.hasRepository) return

    changes.value = await chronoStore.app.log()
}

onMounted(setChanges)

</script>

<template>
    <div class="w-full h-12 border-b border-body-500 flex items-center px-10 gap-x-2">
        <div class="-ml-2 flex ">
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.home ? '' : 'text-gray-500 pointer-events-none'"
                to="/entries"
            >
                <is-icon
                    size="sm"
                    name="heroicons:home-solid"
                />
            </is-btn>
                
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.back ? '' : 'text-gray-500 pointer-events-none'"
                @click="$router.back()"
            >
                <is-icon
                    size="sm"
                    name="heroicons:arrow-left-solid"
                />
            </is-btn>
                
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.forward ? '' : 'text-gray-500 pointer-events-none'"
                @click="$router.forward()"
            >
                <is-icon
                    size="sm"
                    name="heroicons:arrow-right-solid"
                />
            </is-btn>

            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                @click="showChanges = true"
            >
                <is-icon
                    size="sm"
                    name="heroicons:clock"
                />
            </is-btn>

            <slot name="append-controls" />
        </div>

        <slot name="left" />

        <div class="flex-1 flex gap-x-4">
            <div
                class="text-xs h-8 bg-body-500 w-full px-4 outline-none rounded flex items-center gap-x-2 text-body-100"
            >
                <is-icon
                    size="sm"
                    name="heroicons-solid:computer-desktop"
                />

                {{ path === '/' ? '/' : `/${path}` }}
            </div>
        </div>

        <slot name="right" />

        <is-drawer
            v-model="showChanges"
            position="right"
            title="Change History"
        >
            <div class="flex flex-col">
                <div
                    v-if="!changes.length"
                    class="text-sm text-body-100"
                >
                    No changes
                </div>

                <is-list-item
                    v-for="(change, i) in changes"
                    :key="change.hash"
                    size="none"
                    class="px-4 py-4"
                    :active="i === 0"
                    @click="() => {}"
                >
                    <div class="w-10">
                        <is-icon
                            name="heroicons:user-circle-solid"
                            size="none"
                            class="text-2xl"
                        />
                    </div>

                    <div class="flex flex-col flex-1">
                        <div>
                            Edited by {author}
                        </div>

                        <div class="text-sm text-body-100">
                            {{ formatDistanceToNow(change.date) }}
                        </div>
                    </div>

                    <div class="w-10 -mr-2">
                        <is-tooltip placement="left">
                            <template #activator="{ attrs }">
                                <is-btn
                                    variant="text"
                                    color="primary"
                                    size="none"
                                    class="h-8 w-8"
                                    v-bind="attrs"
                                    @click="() => {}"
                                >
                                    <is-icon
                                        name="heroicons:arrow-right-solid"
                                        size="none"
                                        class="sm"
                                    />
                                </is-btn>
                            </template>

                            <div>
                                View change
                            </div>
                        </is-tooltip>
                    </div>
                </is-list-item>
            </div>
        </is-drawer>
    </div>
</template>
