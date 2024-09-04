<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { orderBy } from 'lodash';

// general
const route = useRoute()

const path = computed(() => route.params.path)

// entries
const { drive, dirname } = useDrive()

const entry = ref<DriveEntry | null>(null)
const entries = ref<DriveEntry[]>([])
const loading = ref(false)

const title = computed(() => entry.value?.name || path.value)

async function load(){
    const args = Array.isArray(path.value) ? path.value : [path.value]

    const filename = `${args.join('/')}`

	loading.value = true

	let result = await drive.value.get(filename)

	console.log(result, path.value)

	if (result && result.type === 'file') {
		result = await drive.value.get(dirname(filename))
	}

	if (!result) {
		entries.value = []
		loading.value = false
		return
	}

	entry.value = result
	
	entries.value = await drive.value.list(result.path)

	setTimeout(() => {
		loading.value = false
	}, 800);
	
}

watch(path, load, { immediate: true })

</script>

<template>
    <div
        v-if="entry"
        class="flex flex-col min-h-full"
    >
        <is-list-item
            class="px-4 items-center group border-b border-body-500"
        >
            <is-icon
                name="heroicons:folder-open-solid"
                class="text-primary-300"
                :entry="entry"
            />

            <div class="ml-4 font-bold">
                {{ entry.path === '/' ? 'Root' : entry.name }}
            </div>
        </is-list-item>


        <div 
            v-if="!entries.length"
            class="flex-1 h-full w-full flex items-center justify-center"
        >
            <is-icon
                name="heroicons:folder-solid"
                class="text-body-500 text-[3rem]"
            />
        </div>
       
        <div v-else>
            <div
                v-for="e in orderBy(entries, ['type', 'name'])"
                :key="e.path"
            >
                <is-list-item
                    :to="`/entries/${e.path}`"
                    class="px-4 items-center group"
                >
                    <DirectoryEntryIcon
                        :entry="e"
                        size="lg"
                    />

                    <div class="ml-4 font-bold">
                        {{ e.name }}
                    </div>
                </is-list-item>
            </div>
        </div>
    </div>
</template>
