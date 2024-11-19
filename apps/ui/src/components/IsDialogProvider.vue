<script setup lang="ts">
const dialog = useQuickDialog()
</script>

<template>
    <is-dialog
        v-for="d in dialog.dialogItems"
        :key="d.id"
        :model-value="true"
        @update:model-value="d.onCancel()"
    >
        <is-card
            class="w-72 bg-body-700"
        >
            <is-card-head>
                <div>
                    <is-card-title class="mb-1">
                        {{ d.title }}
                    </is-card-title>

                    <is-card-subtitle v-if="d.message">
                        <div v-html="d.message" />
                    </is-card-subtitle>
                </div>
            </is-card-head>

            <is-card-content class="flex flex-col gap-y-4">
                <div
                    v-if="!d.hideCancel || !d.hideOk || d.buttons"
                    class="flex justify-center gap-x-4"
                >
                    <is-btn
                        v-if="!d.hideCancel"
                        color="danger"
                        class="flex-1"
                        @click="d.onCancel()"
                    >
                        {{ d.cancelText || 'Cancel' }}
                    </is-btn>

                    <is-btn
                        v-if="!d.hideOk"
                        class="flex-1"
                        @click="d.onOk()"
                    >
                        {{ d.okText || 'Ok' }}
                    </is-btn>

                    <is-btn
                        v-for="btn in d.buttons || []"
                        :key="btn.id"
                        v-bind="btn"
                        @click="d.onCancel()"
                    >
                        {{ btn.label }}
                    </is-btn>
                </div>
            </is-card-content>
        </is-card>
    </is-dialog>
</template>
