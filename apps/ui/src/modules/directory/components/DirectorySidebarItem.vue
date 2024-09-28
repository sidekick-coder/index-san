<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { useDirectoryEntries } from '@/modules/directory/composables/useDirectoryEntries';

import DirectoryEntryIcon from './DirectoryEntryIcon.vue';


// general
const route = useRoute()
const router = useRouter()

// entry
const entry = defineProp<DriveEntry>('entry', {
	type: Object,
	required: true
})

const level = defineProp<number>('level', {
	type: Number,
	default: 1
})

// folder
const show = ref(false)

const { data: children, load: loadChildren } = useDirectoryEntries(entry.value.path)

function setShow() {
	if (entry.value.type !== 'directory') return

	if (!children.value.length) {
		loadChildren()
	}

	if (show.value) return

	show.value = route.path.startsWith(`/entries/${entry.value.path}`)
}

function onDirectoryUpdate({ path, from, to }: any) {

	if (entry.value.type !== 'directory') return

	if (![path, to, from].some(p => p?.startsWith(entry.value.path))) return

	loadChildren()
}

watch(() => route.path, setShow, { immediate: true })

// events

const hooks = ['drive:write', 'drive:destroy', 'drive:mkdir', 'drive:move'] as const

onMounted(() => {
	hooks.forEach((h) => {
		onHook(h, onDirectoryUpdate)
	})
})

onUnmounted(() => {
	hooks.forEach((h) => {
		offHook(h, onDirectoryUpdate)
	})
})
// actions

const hideActions = defineProp('hideActions', {
	type: Boolean,
	default: false
})

const active = computed(() => {
	if (route.name != 'entry') return false

	return route.params.path === entry.value.path
})

function onClick() {
	if (entry.value.type === 'directory') {
		show.value = !show.value
		return
	}

	router.push({
		name: 'entry',
		params: {
			path: entry.value.path
		}
	})
}


</script>

<template>
    <is-list-item
        class="px-4 items-center group"
        :active="active"
        :style="{ paddingLeft: `${level * 1.1}rem` }"
        @click="onClick"
    >
        <div class="flex flex-col w-full">
            <div class="flex-1 flex items-center">
                <is-icon
                    v-if="entry.type === 'directory' && show"
                    name="heroicons:folder-open-solid"
                    class="text-primary-300"
                />

                <is-icon
                    v-else-if="entry.type === 'directory'"
                    name="heroicons:folder-solid"
                    class="text-primary-300"
                />

                <DirectoryEntryIcon
                    v-else
                    :entry="entry"
                    size="lg"
                />

                <div class="ml-3 truncate flex-1">
                    {{ entry.name }}
                </div>

                <div
                    v-if="entry.type === 'directory' && !hideActions"
                    class="ml-auto"
                >
                    <is-btn
                        variant="text"
                        size="none"
                        class="size-8 opacity-0 group-hover:opacity-100"
                        :to="{
                            name: 'entry',
                            params: {
                                path: entry.path

                            }
                        }"
                        @click.stop
                    >
                        <is-icon
                            name="heroicons:arrow-right-solid"
                            size="xs"
                        />
                    </is-btn>

                    <is-btn
                        v-if="children.length"
                        variant="text"
                        size="none"
                        class="size-8"
                    >
                        <is-icon
                            :name="show ? 'heroicons:chevron-up-solid' : 'heroicons:chevron-down-solid'"
                            size="xs"
                        />
                    </is-btn>
                </div>
            </div>
        </div>
    </is-list-item>

    <div v-if="show">
        <div
            v-for="child in children"
            :key="child.path"
        >
            <DirectorySidebarItem
                :entry="child"
                :level="level + 1"
            />
        </div>
    </div>
</template>
