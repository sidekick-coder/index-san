<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { orderBy } from 'lodash';

// general
const route = useRoute()
const router = useRouter()

const path = computed(() => {
	 const args = Array.isArray(route.params.path) ? route.params.path : [route.params.path]

	return `${args.join('/')}`
})

// entries
const { drive, dirname } = useDrive()

const entry = ref<DriveEntry | null>(null)
const entries = ref<DriveEntry[]>([])

async function setEntries(){
	if (!entry.value) {
		entries.value = []
		return
	}

	const result = await drive.value.list(entry.value.path)

	entries.value = orderBy(result, ['type', 'name'])
}

async function load(){
	let result = await drive.value.get(path.value)

	if (result && result.type === 'file') {
		result = await drive.value.get(dirname(path.value))
	}

	if (!result) {
		entry.value = null	
		return
	}

	entry.value = result
}

watch(path, load, { immediate: true })
watch(entry, setEntries, { immediate: true })

// key binds
const root = ref<HTMLElement>()

function prev(){
	const currentIndex = entries.value.findIndex(e => e.path === path.value)

	const item = entries.value[currentIndex - 1]

	if (item) {
		router.push(`/entries/${item.path}`)
	}
}

function next(){
	const currentIndex = entries.value.findIndex(e => e.path === path.value)

	const item = entries.value[currentIndex + 1]

	if (item) {
		router.push(`/entries/${item.path}`)
	}
}


onKeyStroke('ArrowUp', prev, { target: root })
onKeyStroke('ArrowDown', next, { target: root })

</script>

<template>
    <div
        v-if="entry"
        ref="root"
        class="flex flex-col min-h-full"
        tabindex="-1"
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
