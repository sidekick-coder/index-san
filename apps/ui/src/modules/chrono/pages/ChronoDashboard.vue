<script lang="ts" setup>
import { useChrono } from '@/modules/chrono/composables/useChrono'
import type ChronoObjectCommit from 'chrono/src/entities/ChronoObjectCommit';

// general
const { app } = useChrono()

const hasRepository = ref(false)

async function load() {
    hasRepository.value = await app.hasRepository()

    if (hasRepository.value) {
        await setStatus()
    }
}

// create repository

const creating = ref(false)

async function createRepository() {
    creating.value = true

    await app.init()

    creating.value = false

    await load()    
}

onMounted(load)

// actions
const status = ref<Awaited<ReturnType<typeof app.status>>>({
    untracked: [],
    added: [],
    changed: [],
})

const loading = ref(false)

async function setStatus() {
    status.value = await app.status()
}

async function addItem(item: string) {
    loading.value = true

    await app.addEntry(item)

    await setStatus()

    loading.value = false
}

async function removeItem(item: string) {
    loading.value = true

    await app.removeEntry(item)

    await setStatus()

    loading.value = false
}

async function createCommit() {
    loading.value = true

    const date = new Date().toISOString()

    await app.commit(date)

    await setStatus()
    await setCommits()

    loading.value = false
}

// commits

const commits = ref<ChronoObjectCommit[]>([])

async function setCommits() {
    commits.value = await app.log()
}

watch(hasRepository, (value) => {
    if (value) {
        setCommits()
    }
})

</script>

<template>
    <div class="h-full flex flex-col">
        <div class="px-4 py-4 border-b border-body-500">
            <h1 class="text-2xl font-bold ">
                Chrono Dashboard
            </h1>
        </div>

        <div class="px-4 py-4 flex-1 overflow-auto">
            <div v-if="hasRepository">
                <div class="flex flex-col gap-y-4">
                    <div class="flex gap-x-4">
                        <is-btn
                            @click="setStatus"
                        >
                            Check status
                        </is-btn>
                        
                        <is-btn @click="createCommit">
                            Create commit
                        </is-btn>
                    </div>


                    <div
                        v-if="status"
                        class="flex gap-x-4"
                    >
                        <is-card
                            v-for="item in Object.entries(status)"
                            :key="item[0]"
                            class="flex-1 h-96 overflow-y-auto"
                            :class="loading ? 'opacity-50 pointer-events-none' : ''"
                        >
                            <div class="px-4 py-2 border-b border-body-500">
                                <h2>{{ item[0] }}</h2>
                            </div>
                            
                            <is-list-item
                                v-for="file in item[1]"
                                :key="file"
                            >
                                <div class="flex-1">
                                    {{ file }}
                                </div>

                                <div v-if="item[0] === 'untracked' ">
                                    <is-btn
                                        size="sm"
                                        @click="addItem(file)"
                                    >
                                        <is-icon
                                            name="heroicons:plus-solid"
                                        />
                                    </is-btn>
                                </div>
                                
                                <div v-if="item[0] === 'added' ">
                                    <is-btn
                                        size="sm"
                                        @click="removeItem(file)"
                                    >
                                        <is-icon
                                            name="heroicons:minus-solid"
                                        />
                                    </is-btn>
                                </div>
                            </is-list-item>
                        </is-card>
                    </div>

                    <div class="text-xl font-bold">
                        Commits
                    </div>

                    <is-card>
                        <is-list-item class="flex gap-x-4 border-b border-body-500">
                            <div class="flex-1">
                                HASH
                            </div>

                            <div class="flex-1">
                                DATE
                            </div>

                            <div class="flex-1">
                                MESSAGE
                            </div>
                        </is-list-item>      

                        <is-list-item
                            v-for="commit in commits"
                            :key="commit.hash"
                            class="flex gap-x-4"
                        >
                            <div class="flex-1">
                                {{ commit.hash }}
                            </div>

                            <div class="flex-1">
                                {{ commit.date }}
                            </div>

                            <div class="flex-1">
                                {{ commit.message }}
                            </div>
                        </is-list-item>                        
                    </is-card>
                </div>
            </div>

            <div
                v-else
                class="flex flex-col gap-y-4 size-full items-center justify-center"
            >
                <div class="text-xl">
                    No repository detected
                </div>

                <is-btn
                    :loading="creating"
                    @click="createRepository"
                >
                    Create repository
                </is-btn>
            </div>
        </div>
    </div>
</template>
