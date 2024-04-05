<script lang="ts" setup>
import type ChronoObjectCommit from 'chrono/src/entities/ChronoObjectCommit';
import { useChronoStore } from '../store';

import { formatDistanceToNow } from 'date-fns'

const chronoStore = useChronoStore();


const commits = ref<ChronoObjectCommit[]>([])

async function load(){
    if (!chronoStore.hasRepository) {
        return;
    }

    commits.value = await chronoStore.app.log();
}

watch(() => chronoStore.hasRepository, load, { immediate: true });

</script>

<template>
    <div>
        <div class="px-4 flex bg-body-900 py-2 items-center border-b border-body-500">
            <div class="flex-1">
                <div class="text-sm">
                    Change history
                </div>
            </div>

            <is-btn
                variant="text"
                size="none"
                class="h-6 w-6"
                @click="load"
            >
                <is-icon
                    name="heroicons:arrow-path-solid"
                    size="xs"
                    :class="chronoStore.loadingStatus ? 'animate-spin' : ''"
                />
            </is-btn>
        </div>

        <div v-if="!chronoStore.hasRepository">
            <div class="px-4 py-4 text-body-100 text-xs">
                No repository found
            </div>
        </div>

        <template v-else>
            <div class="relative">
                <div class="h-full left-0 top-0 py-6 absolute w-8 flex justify-center">
                    <div class="h-full w-1 bg-body-500/25" />
                </div>

                <is-list-item 
                    v-for="(commit, index) in commits"
                    :key="commit.hash"
                    size="none"
                    class="py-2 pr-4"
                >
                    <div class="w-8 flex justify-center">
                        <div
                            class="w-2 h-2 rounded-full"
                            :class="index === 0 ? 'bg-primary-500' : 'bg-body-500'"
                        />
                    </div>

                    <div class="flex-1  flex flex-col">
                        <div class="text-sm truncate text-body-50">
                            {{ commit.message }}
                        </div>
                        <div class="text-body-100 text-xs">
                            {{ formatDistanceToNow(new Date(commit.date)) }}
                        </div>
                    </div>
                </is-list-item>
            </div>
        </template>
    </div>
</template>
