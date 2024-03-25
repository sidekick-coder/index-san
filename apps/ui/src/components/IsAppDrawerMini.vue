<script lang="ts" setup>

// general
const route = useRoute()
const router = useRouter()

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

function onItemClick(to: string) {
    if (to === route.path || route.path.startsWith(to)) {
        drawer.value = !drawer.value
        return
    }

    router.push(to)
}

</script>

<template>
    <div class="w-14 min-h-full bg-body-900 border-r border-body-500 shadow">
        <div class="flex flex-col h-full">
            <is-list-item
                justify="center"
                to="/entries"
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
                        v-bind="attrs"
                        justify="center"
                        :class="($route.path.startsWith(link.to) || $route.path === link.to) ? '!text-primary-500 bg-primary-900/25' : ''"
                        @click="onItemClick(link.to)"
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