<template>
    <div class="w-14 h-full bg-body-900 border-r border-body-500 shadow">
        <div class="flex flex-col h-full">
            <is-list-item justify="center" >
                <is-logo class="w-5 h-5" />
            </is-list-item>

            <is-tooltip placement="right">
                <template #activator="{ attrs }">
                    <is-list-item
                        :to="{ name: 'FileExplorer' }"
                        justify="center"
                        v-bind="attrs"
                    >
                        <is-icon name="mdi:folder" size="xl" />
                    </is-list-item>
                </template>

                <div>
                    {{ $t('fileExplorer') }}
                </div>
            </is-tooltip>
            
            <is-tooltip placement="right">
                <template #activator="{ attrs }">
                    <is-list-item
                        :to="{ name: 'WorkspaceSelector' }"
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
                        to="/cheat-sheet"
                        justify="center"
                        v-bind="attrs"
                    >
                        <is-icon name="mdi:markdown" size="xl" />
                    </is-list-item>
                </template>

                <div>
                    {{ $t('cheatSheet', 2) }}
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