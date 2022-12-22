<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import mime from 'mime'
import { ref, computed, watch, useAttrs } from 'vue'

import { useStore } from '../store'
import { toCssMeasurement } from '@/composables/utils'
import DirectoryEntry from '@/../core/entities/directory-entry'
import { createBindings } from '@/composables/binding'

const props = defineProps({
    basePath: {
        type: String,
        default: '/',
    },
    src: {
        type: String,
        default: null,
    },
    width: {
        type: [String, Number],
        default: null,
    },
    height: {
        type: [String, Number],
        default: null,
    },
    fit: {
        type: String,
        default: null,
    },
    position: {
        type: String,
        default: null,
    },
})

const store = useStore()

const innerSrc = ref<string>()
const loading = ref(false)

async function setSrc() {
    innerSrc.value = undefined

    if (!props.src) return

    let path = props.src

    if (props.src.startsWith('./')) {
        path = props.src.replace('./', '')
    }

    if (props.src.startsWith('/')) {
        path = props.src.replace('/', '')
    }

    if (props.src.startsWith('./')) {
        path = DirectoryEntry.normalize(props.basePath, path)
    }

    loading.value = true

    await store
        .read({ path }, true)
        .then((buffer) => {
            if (!buffer) return

            const base64 = window.btoa(
                buffer.reduce((data, b) => data + String.fromCharCode(b), '')
            )

            const type = mime.getType(props.src)

            innerSrc.value = `data:${type};base64, ${base64}`
        })
        .catch(Boolean)
        .finally(() => (loading.value = false))
}

watch(() => props.src, setSrc, { immediate: true })

// style

const style = computed(() => {
    const result: any = {}

    if (props.width) {
        result['width'] = toCssMeasurement(props.width)
    }

    if (props.height) {
        result['height'] = toCssMeasurement(props.height)
    }

    return result
})

// classes

const fitOptions = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down',
}

const positionOptions = {
    'top': 'object-top',
    'bottom': 'object-bottom',
    'center': 'object-center',
    'left': 'object-left',
    'right': 'object-right',

    'left-top': 'object-left-top',
    'left-bottom': 'object-left-bottom',
    'right-top': 'object-right-top',
    'right-bottom': 'object-right-bottom',
}

const classes = computed(() => {
    const result: string[] = []

    if (props.fit) {
        result.push(fitOptions[props.fit])
    }

    if (props.position) {
        result.push(positionOptions[props.position])
    }

    return result
})

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['card', 'img']))

// expose

defineExpose({ setSrc })
</script>

<template>
    <img
        v-if="!loading && innerSrc"
        ref="imageRef"
        :src="innerSrc"
        :class="classes"
        :style="style"
        v-bind="bindings.multiple(['img', 'root'])"
    />

    <v-card
        v-else
        :height="height || 100"
        :width="width"
        v-bind="bindings.multiple(['card', 'root'])"
    >
        <v-card-content class="items-center justify-center h-full">
            <v-icon name="image" class="text-2xl" />
        </v-card-content>
    </v-card>
</template>
