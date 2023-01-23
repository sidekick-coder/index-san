<script setup lang="ts">
import { useStore } from '@store/global'

const store = useStore()
</script>

<template>
    <v-dialog
        v-for="(dialog, index) in store.dialog.dialogs"
        :key="index"
        :model-value="true"
        @update:model-value="dialog.resolve(false)"
    >
        <v-card color="b-secondary">
            <v-card-head v-if="dialog.title" padding>
                <v-card-title>
                    {{ dialog.title }}
                </v-card-title>
            </v-card-head>

            <v-card-content class="flex-wrap">
                <div v-if="dialog.message" class="w-full mb-4">
                    {{ dialog.message }}
                </div>

                <div class="flex w-full justify-end">
                    <v-btn class="mr-4" color="danger" @click="dialog.resolve(false)">{{
                        $t('cancel')
                    }}</v-btn>
                    <v-btn @click="dialog.resolve(true)">{{ $t('ok') }}</v-btn>
                </div>
            </v-card-content>
        </v-card>
    </v-dialog>
</template>
