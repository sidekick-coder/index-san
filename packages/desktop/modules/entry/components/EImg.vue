<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '../store'
import mime from 'mime'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
})

const store = useStore()

const src = ref()
const loading = ref(false)

async function setSrc() {
    loading.value = true

    const buffer = await store.read({ path: props.path })

    const base64 = window.btoa(buffer.reduce((data, b) => data + String.fromCharCode(b), ''))

    const type = mime.getType(props.path)

    src.value = `data:${type};base64, ${base64}`

    loading.value = false
}

onMounted(setSrc)

// set width & height
const imageRef = ref<HTMLImageElement>()

const size = ref({
    height: undefined as undefined | number,
    width: undefined as undefined | number,
})

function onLoad() {
    if (!imageRef.value) return

    size.value.height = imageRef.value.height
    size.value.width = imageRef.value.width
}
</script>

<template>
    <img
        v-if="!loading"
        ref="imageRef"
        :src="src"
        :width="size.width"
        :height="size.height"
        @load="onLoad"
    />
</template>
