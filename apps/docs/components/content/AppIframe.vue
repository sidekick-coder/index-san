<script setup lang="ts">
const config = useRuntimeConfig()

const url = config.public.isAppUrl

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: null,
    },
})

const fullUrl = computed(() => `${url}${props.path}`)
</script>
<template>
    <div class="ronded-lg my-8 w-full rounded bg-[#0c0d0ccc] p-4">
        <div class="mb-4 flex items-center">
            <div v-if="title" class="text-lg font-bold text-zinc-400">{{ title }}</div>

            <a
                :href="fullUrl"
                class="ml-auto rounded px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-800"
                target="_blank"
            >
                Open in new tab
            </a>
        </div>

        <div class="h-[40rem] w-full overflow-hidden rounded-xl">
            <iframe
                :src="fullUrl"
                frameborder="0"
                style="overflow: hidden; height: 100%; width: 100%"
                height="100%"
                width="100%"
            />
        </div>
    </div>
</template>
