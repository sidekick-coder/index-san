<script setup>
defineProps({
    eager: {
        type: Boolean,
        default: false,
    },
})

const model = defineModel({
    type: Boolean,
    default: false,
})
</script>
<template>
    <Teleport to="body">
        <transition
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-200"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="eager"
                v-show="model"
                class="is-dialog fixed inset-0 z-40 flex size-full items-center justify-center"
            >
                <is-overlay @click="model = false" />

                <div class="relative">
                    <slot />
                </div>
            </div>

            <div
                v-else-if="model"
                class="is-dialog fixed inset-0 z-40 flex size-full items-center justify-center"
            >
                <is-overlay @click="model = false" />

                <div class="relative">
                    <slot />
                </div>
            </div>
        </transition>
    </Teleport>
</template>
