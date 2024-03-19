<script lang="ts" setup>

// general
const route = useRoute()

// drawer
const drawer = defineModel('drawer', {
    type: Boolean,
    default: false    
})

// links
const links = [
    {
        to: '/entries',
        icon: 'mdi:folder',
        label: 'fileExplorer'
    },
    {
        to: '/workspace-selector',
        icon: 'fa:cubes',
        label: 'workspace'
    },
    {
        to: '/cheat-sheet',
        icon: 'mdi:markdown',
        label: 'cheatSheet'
    }
]

function onItemClick(e: MouseEvent, to: string) {
    if (to === route.path) {
        drawer.value = !drawer.value
    }
}

</script>

<template>
    <div class="w-14 min-h-full bg-body-900 border-r border-body-500 shadow">
        <div class="flex flex-col h-full">
            <is-list-item
                justify="center"
                @click="drawer = !drawer"
            >
                <is-logo class="w-5 h-5" />
            </is-list-item>

            <is-tooltip
                v-for="(link, i) in links"
                :key="i"
                placement="right"
            >
                <template #activator="{ attrs }">
                    <is-list-item
                        :to="link.to"
                        v-bind="attrs"
                        justify="center"
                        @click="e => onItemClick(e, link.to)"
                    >
                        <is-icon
                            :name="link.icon"
                            size="xl"
                        />
                    </is-list-item>
                </template>

                <div>
                    {{ $t(link.label, 2) }}
                </div>
            </is-tooltip>            
            

            <!--

            

            <div class="grow" />

            <is-tooltip placement="right">
                <template #activator="{ attrs }">
                    <is-list-item
                        to="/workspaces"
                        justify="center"
                        v-bind="attrs"
                    >
                        <is-icon name="fa:cubes" size="xl" />
                    </is-list-item>
                </template>

                <div>
                    {{ $t('workspace', 2) }}
                </div>
            </is-tooltip>

            <is-tooltip placement="right">
                <template #activator="{ attrs }">
                    <is-list-item
                        to="/options"
                        justify="center"
                        v-bind="attrs"
                    >
                        <is-icon name="mdi:cog" size="xl" />
                    </is-list-item>
                </template>

                <div>
                    {{ $t('setting', 2) }}
                </div>
            </is-tooltip> -->
        </div>
    </div>
</template>