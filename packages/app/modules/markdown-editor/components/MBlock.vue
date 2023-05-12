<script setup lang="ts"></script>

<template>
    <div class="flex min-h-[50px] items-center group">
        <div class="w-[50px] flex justify-center">
            <v-menu offset-y offset-x close-on-content-click>
                <template #activator="{ attrs }">
                    <v-btn
                        v-bind="attrs"
                        mode="text"
                        size="none"
                        class="px-2 py-1 text-sm opacity-0 group-hover:opacity-100"
                    >
                        <v-icon name="grip-vertical" />
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <slot name="menu" />
                </v-card>
            </v-menu>
        </div>

        <div class="flex-1">
            <slot />
        </div>
    </div>
</template>
