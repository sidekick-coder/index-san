<script setup lang="ts">
import LLayout from '@/modules/layout/LLayout.vue'
</script>

<template>
    <LLayout>
        <w-layout use-percentage>
            <w-content>
                <w-layout use-percentage>
                    <w-toolbar class="w-full py-2 flex border-b border-lines px-7">
                        <is-btn text size="sm" to="/settings/general" class="mr-2">
                            {{ $t('general') }}
                        </is-btn>
                        <is-btn text size="sm" to="/settings/menu" class="mr-2">
                            {{ $t('menu') }}
                        </is-btn>
                        <is-btn text size="sm" to="/settings/theme">{{ $t('theme') }}</is-btn>
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
