<script setup lang="ts">
import { Icon } from '@iconify/vue'
import debounce from 'lodash/debounce'
import { useVModel } from '@vueuse/core'

// Props & emit

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

// model

const model = useVModel(props, 'modelValue', emit)

// Sets
const iconSets = ref<[string, any][]>([])
const selectedIconSet = ref<string>('mdi')
const searchIconSet = ref('')

const filteredIconsSets = computed(() => {
    if (searchIconSet.value === '') return iconSets.value

    return iconSets.value.filter((set) =>
        new RegExp(searchIconSet.value, 'i').test(JSON.stringify(set))
    )
})

async function setIconSets() {
    await fetch('https://api.iconify.design/collections')
        .then((res) => res.json())
        .then((data) => {
            iconSets.value = Object.entries(data)
        })
}

function isActive(prefix: string) {
    if (selectedIconSet.value === prefix) return true

    if (search.value.input) return false
}

function setActive(prefix: string) {
    search.value.input = ''
    search.value.icons = []

    selectedIconSet.value = prefix
}

onMounted(setIconSets)

// Icons

const icons = ref<string[]>([])
const loading = ref<boolean>(false)
const limit = ref<number>(120)
const search = ref({
    input: '',
    loading: false,
    icons: [] as string[],
})

const filteredIcons = computed(() => {
    if (search.value.input === '') return icons.value

    return search.value.icons
})

async function setIcons() {
    limit.value = 120
    icons.value = []
    loading.value = true

    await fetch(`https://api.iconify.design/collection?prefix=${selectedIconSet.value}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.uncategorized) {
                icons.value = data.uncategorized.map(
                    (icon: string) => `${selectedIconSet.value}:${icon}`
                )
                return
            }

            if (data.icons) {
                icons.value = Object.keys(data.icons).map(
                    (icon: string) => `${selectedIconSet.value}:${icon}`
                )
                return
            }

            if (data.categories) {
                icons.value = Object.values(data.categories)
                    .flat()
                    .map((icon: string) => `${selectedIconSet.value}:${icon}`)
                return
            }
        })
        .finally(() => setTimeout(() => (loading.value = false), 500))
}

const doSearch = debounce(async () => {
    search.value.loading = true

    await fetch(`https://api.iconify.design/search?query=${search.value.input}&limit=100`)
        .then((res) => res.json())
        .then((data) => {
            search.value.icons = data.icons
        })
        .finally(() => setTimeout(() => (search.value.loading = false), 500))
}, 1500)

watch(
    () => search.value.input,
    () => {
        if (search.value.input === '') {
            search.value.loading = false
            search.value.icons = []
            return
        }

        search.value.loading = true

        doSearch()
    }
)

watch(selectedIconSet, setIcons, { immediate: true })
</script>
<template>
    <v-card
        width="800"
        height="500"
        color="b-secondary"
        class="flex"
    >
        <div class="w-4/12 h-full overflow-y-auto">
            <div class="w-full px-4 py-2">
                <v-input
                    v-model="searchIconSet"
                    placeholder="Material design"
                >
                    <template #append>
                        <v-btn
                            v-if="searchIconSet"
                            size="sm"
                            color="b-primary"
                            @click="searchIconSet = ''"
                        >
                            <v-icon name="times" />
                        </v-btn>
                    </template>
                </v-input>
            </div>
            <v-btn
                v-for="[prefix, data] in filteredIconsSets"
                :key="prefix"
                size="sm"
                :color="isActive(prefix) ? 'b-primary' : 'b-secondary'"
                class="my-2 mx-4"
                @click="setActive(prefix)"
            >
                {{ data.name }}
            </v-btn>
        </div>

        <div class="w-8/12 px-4 items-start flex flex-wrap h-full overflow-y-auto">
            <div class="w-full p-2">
                <v-input
                    v-model="search.input"
                    placeholder="youtube, mdi:user, fa:folder, etc..."
                >
                    <template #append>
                        <v-btn
                            v-if="search.input"
                            size="sm"
                            color="b-primary"
                            @click="search.input = ''"
                        >
                            <v-icon name="times" />
                        </v-btn>
                    </template>
                </v-input>
            </div>

            <div
                v-if="loading || search.loading"
                class="flex justify-center items-center w-full h-[calc(100%_-_56px)]"
            >
                <v-icon
                    name="spinner"
                    class="animate-spin"
                />
            </div>

            <div
                v-else
                class="h-[calc(100%_-_56px)] flex flex-wrap w-full items-start pb-4"
            >
                <div
                    v-for="icon in filteredIcons.slice(0, limit)"
                    :key="icon"
                    class="w-2/12 p-2"
                >
                    <v-tooltip>
                        <template #activator="{ attrs }">
                            <v-btn
                                v-bind="attrs"
                                color="b-primary"
                                size="none"
                                class="w-full h-full py-2"
                                @click="model = icon"
                            >
                                <Icon
                                    :icon="icon"
                                    class="h-6 w-6"
                                />
                            </v-btn>
                        </template>

                        <div>
                            {{ icon }}
                        </div>
                    </v-tooltip>
                </div>

                <div class="w-full block py-4 self-end">
                    <v-btn
                        v-if="filteredIcons.length > limit"
                        class="w-full"
                        color="b-primary"
                        @click="limit += 120"
                    >
                        {{ $t('loadMore') }}
                    </v-btn>
                </div>
            </div>
        </div>
    </v-card>
</template>
