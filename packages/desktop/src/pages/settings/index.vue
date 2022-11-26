<template>
    <w-layout use-percentage>
        <w-toolbar class="w-full py-2 flex border-b border-lines px-7">
            <is-btn text size="sm" to="/settings/general" class="mr-2">{{ $t('general') }}</is-btn>
            <is-btn text size="sm" to="/settings/menu" class="mr-2">{{ $t('menu') }}</is-btn>
            <is-btn text size="sm" to="/settings/theme">{{ $t('theme') }}</is-btn>
        </w-toolbar>

        <w-content>
            <is-container class="h-full w-full overflow-auto">
                <router-view />
            </is-container>
        </w-content>
    </w-layout>
</template>
