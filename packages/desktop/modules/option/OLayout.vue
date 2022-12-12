<script setup lang="ts">
import LLayout from '@/modules/layout/LLayout.vue'
</script>

<template>
    <LLayout>
        <w-layout use-percentage>
            <w-content>
                <w-layout use-percentage>
                    <w-toolbar class="w-full py-2 flex border-b border-lines px-7">
                        <v-btn text size="sm" to="/options/general" class="mr-2">
                            {{ $t('general') }}
                        </v-btn>
                        <v-btn text size="sm" to="/options/menu" class="mr-2">
                            {{ $t('menu') }}
                        </v-btn>
                        <v-btn text size="sm" to="/options/theme">{{ $t('theme') }}</v-btn>
                    </w-toolbar>

                    <w-content>
                        <div class="h-full w-full overflow-auto">
                            <router-view />
                        </div>
                    </w-content>
                </w-layout>
            </w-content>
        </w-layout>
    </LLayout>
</template>
