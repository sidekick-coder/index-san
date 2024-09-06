<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { orderBy } from 'lodash';

// general
const route = useRoute()
const router = useRouter()

const path = computed(() => {
	if (!route.params.path) return '/'

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

	if (path.value === entry.value?.path) return
	if (dirname(path.value) === entry.value?.path) return

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
const listRef = ref<HTMLElement>()
const itemsRef = ref<HTMLElement[]>([])

function isItemVisible(element: HTMLElement) {
	const elTop = element.offsetTop
	const elBottom = elTop

	const containerTop = listRef.value!.scrollTop
	const containerBottom = containerTop + listRef.value!.clientHeight

	if (elBottom < containerBottom && elTop > containerTop) {
		return true
	}

	return false

}

function prev(e: KeyboardEvent){
	const currentIndex = entries.value.findIndex(e => e.path === path.value)
	const index = currentIndex - 1

	const item = entries.value[index]
	const itemRef = itemsRef.value.find(e => e.id === `item-` + index)

	if (!item || item.type === 'directory') return

	if (itemRef && !isItemVisible(itemRef)) {
		itemRef?.scrollIntoView({
			behavior: 'smooth',
			block: 'end'
		})
	}

	router.push(`/entries/${item.path}`)

	e.preventDefault()
}

function next(e: KeyboardEvent){

	const currentIndex = entries.value.findIndex(e => e.path === path.value)
	const index = currentIndex + 1

	const item = entries.value[index]
	const itemRef = itemsRef.value.find(e => e.id === `item-` + index)

	if (!item || item.type === 'directory') return

	if (itemRef && !isItemVisible(itemRef)) {
		itemRef?.scrollIntoView({ behavior: 'smooth' })
	}

	router.push(`/entries/${item.path}`)

	e.preventDefault()
}


onKeyStroke('ArrowUp', prev, { target: root })
onKeyStroke('ArrowDown', next, { target: root })

watch(entries, async () => {
	await until(() => entries.value.length === itemsRef.value.length).toBeTruthy()

	const index = entries.value.findIndex(e => e.path === path.value)
	const itemRef = itemsRef.value.find(e => e.id === `item-` + index)

	if (itemRef && !isItemVisible(itemRef)) {
		itemRef?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

})

</script>

<template>
    <div
        v-if="entry"
        ref="root"
        class="flex flex-col min-h-full overflow-auto"
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

        <div
            v-else
            ref="listRef"
            class="h-[calc(100vh-48px)] overflow-y-auto"
        >
            <div
                v-for="(e, index) in entries"
                :id="`item-${index}`"
                :key="e.path"
                ref="itemsRef"
            >
                <is-list-item
                    :to="`/entries/${e.path}`"
                    class="px-4 items-center group"
                >
                    <div class="w-4">
                        <DirectoryEntryIcon
                            :entry="e"
                            size="lg"
                        />
                    </div>

                    <div class="ml-4 font-bold truncate">
                        {{ e.name }}
                    </div>
                </is-list-item>
            </div>
        </div>
    </div>
</template>
