<script setup lang="ts">
import { useStore } from '../store'

const store = useStore()
</script>

<template>
    <teleport to="body">
        <div class="fixed px-4 py-2 bottom-0 right-0">
            <transition-group name="notify">
                <div
                    v-for="message in store.messages"
                    :key="message.id"
                    :class="`bg-${message.color} flex items-center px-4 py-2 rounded text-white mb-4 last:mb-0 min-h-[50px] min-w-[150px]`"
                >
                    {{ message.content }}
                </div>
            </transition-group>
        </div>
    </teleport>
</template>

<style>
.notify-move,
.notify-enter-active,
.notify-leave-active {
    transition: all 0.3s ease;
}

.notify-enter-from,
.notify-leave-to {
    transform: translateX(10%);
    opacity: 0;
}
</style>
