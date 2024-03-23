<script lang="ts" setup>
import { MarkdownNodeHeading } from '@language-kit/markdown';
import BlockBase from './BlockBase.vue'
import { computed, ref, watch } from 'vue';


// general
const classMap = ref(new Map<string, string>())
const classes = computed(() => Array.from(classMap.value.values()).join(' '))

// node
const node = defineModel<MarkdownNodeHeading>({
    type: Object,
    required: true,
})


const icon = computed(() => {
    return `lucide:heading-${level.value}`;
})


// level
const level = computed(() => node.value.level)

function setLevelClasses(){

    const options: Record<number, string> = {
        1: 'text-xl font-bold',
        2: 'text-lg font-bold',
        3: 'text-base font-bold',
        4: 'text-sm font-bold',
        5: 'text-xs font-bold',
        6: 'text-xs font-bold',
    }

    classMap.value.set('level', options[level.value] ?? options[6])

}

watch(level, setLevelClasses, { immediate: true })

</script>

<template>    
    <BlockBase :icon :class="classes">
        <component :is="'h' + level" v-html="node.toHtml()"></component>
    </BlockBase>
</template>

<style scoped>

</style>