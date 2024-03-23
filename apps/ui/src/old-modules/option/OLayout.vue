<template>
    <div class="h-full flex flex-col">
        <v-toolbar class="w-full py-2 flex border-b border-lines px-7">
            <v-btn
                mode="text"
                size="sm"
                to="/options/general"
                class="mr-2"
            >
                {{ $t('general') }}
            </v-btn>
            <v-btn
                mode="text"
                size="sm"
                to="/options/menu"
                class="mr-2"
            >
                {{ $t('menu') }}
            </v-btn>
            <v-btn
                mode="text"
                size="sm"
                to="/options/theme"
            >
                {{ $t('theme') }}
            </v-btn>
        </v-toolbar>

        <div class="overflow-auto">
            <router-view />
        </div>
    </div>
</template>
