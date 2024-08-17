<script setup lang="ts">

const plugins = ref<any[]>([])

async function setPlugins(){
	plugins.value = await listPlugins()
}

onMounted(setPlugins)

</script>

<template>
    <div>
        <is-list-item
            v-for="p of plugins"
            :key="p.name"
        >
            {{ p.name }}
        </is-list-item>

        <is-list-item v-if="!plugins.length">
            No plugins
        </is-list-item>
    </div>
</template>
