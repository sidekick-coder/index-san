<script setup lang="ts">

const plugins = ref<any[]>([])

async function setPlugins(){
	plugins.value = await listPlugins()
}

onMounted(setPlugins)

async function togglePlugin(id: string) {
	const activePlugins = $config.activePlugins.slice()

	const index = activePlugins.findIndex(p => p.id === id)

	if (index === -1) {
		activePlugins.push({ id, active: true })
	}

	if (index !== -1) {
		activePlugins.splice(index, 1)
	}

	await saveConfig({ activePlugins })

	window.location.reload()
}
</script>

<template>
    <div>
        <is-list-item
            v-for="p of plugins"
            :key="p.name"
            class="border-b border-body-500"
        >
            <div class="flex-1">
                {{ p.name }}
            </div>

            <is-btn
                v-if="p.active"
                color="danger"
                size="sm"
                @click="togglePlugin(p.id)"
            >
                Deactivate 
            </is-btn>
            <is-btn
                v-else
                color="success"
                size="sm"
                @click="togglePlugin(p.id)"
            >
                Activate 
            </is-btn>
        </is-list-item>

        <is-list-item v-if="!plugins.length">
            No plugins
        </is-list-item>
    </div>
</template>
