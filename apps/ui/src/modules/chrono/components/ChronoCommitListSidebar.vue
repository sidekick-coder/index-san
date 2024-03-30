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

    // const commit = await chronoStore.app.catEntry("a60fbb4cd3c060155e183a0fcea8521b78950fda90ae8e7e65c8a945d88c281c")

    // console.log(commit.contents);
}

watch(() => chronoStore.hasRepository, load, { immediate: true });

</script>

<template>
    <div>
        <div class="px-4 flex bg-body-900 py-2 items-center border-b border-body-500">
            <div class="flex-1">
                <div class="text-sm">
                    Commits List
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
            <div>
                <is-list-item 
                    v-for="commit in commits"
                    :key="commit.hash"
                    size="xs"
                >
                    <div class="flex-1">
                        {{ commit.message }}
                    </div>

                    <div class="text-body-100">
                        {{ formatDistanceToNow(new Date(commit.date)) }}
                    </div>
                </is-list-item>
            </div>
        </template>
    </div>
</template>
