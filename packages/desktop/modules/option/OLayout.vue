<script setup lang="ts">
import LLayout from '@/modules/layout/LLayout.vue'
</script>

<template>
    <LLayout>
        <v-layout use-percentage>
            <v-layout-content>
                <v-layout use-percentage>
                    <v-layout-toolbar class="w-full py-2 flex border-b border-lines px-7">
                        <v-btn text size="sm" to="/options/general" class="mr-2">
                            {{ $t('general') }}
                        </v-btn>
                        <v-btn text size="sm" to="/options/menu" class="mr-2">
                            {{ $t('menu') }}
                        </v-btn>
                        <v-btn text size="sm" to="/options/theme">{{ $t('theme') }}</v-btn>
                    </v-layout-toolbar>

                    <v-layout-content>
                        <div class="h-full w-full overflow-auto">
                            <router-view />
                        </div>
                    </v-layout-content>
                </v-layout>
            </v-layout-content>
        </v-layout>
    </LLayout>
</template>
