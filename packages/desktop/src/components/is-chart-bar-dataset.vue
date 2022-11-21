<script lang="ts">
export default {
    name: 'IsChartBarDataset',
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { useArray } from '@/composables/array'
import { useTheme } from '@/composables/theme'

const props = defineProps({
    label: {
        type: String,
        default: 'dataset',
    },
    items: {
        type: Array as () => Record<string, string>[],
        default: () => [],
    },
    yKey: {
        type: [String, Function],
        default: () => (item: any) => Object.keys(item)[0],
    },
    xKey: {
        type: [String, Function],
        default: () => (item: any) => Object.values(item)[0],
    },
    color: {
        type: [String, Array],
        default: null,
    },
})

const emit = defineEmits(['load'])

const theme = useTheme()

const xKeys = useArray(props.items).map(props.xKey).value()
const yKeys = useArray(props.items).map(props.yKey).value()

const map = new Map<string, number>()

for (let i = 0; i < xKeys.length; i++) {
    const xValue = xKeys[i]
    const yValue = yKeys[i]

    let y = map.get(xValue)

    if (!y) y = 0

    if (!isNaN(yValue)) {
        y += Number(yValue)
    }

    map.set(xValue, y)
}

const data = Array.from(map.entries()).map(([x, y]) => ({ x, y }))

function getColor() {
    if (Array.isArray(props.color)) return props.color

    if (props.color) return [props.color]

    return theme.chartColors()
}

emit('load', {
    label: props.label,
    data,
    backgroundColor: getColor(),
    borderColor: '#18181b',
})
</script>

<template>
    <div class="hidden"></div>
</template>
