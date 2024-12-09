<script setup lang="ts">
const total = defineProp<number>('total', {
    type: Number,
    default: 1,
})

const page = defineModel({
    type: Number,
    default: 1,
})

const size = defineProp<string>('size', {
    type: String,
    default: 'md',
})

const color = defineProp('color', {
    type: String,
    default: null,
})

function shouldBeVisible(i: number): boolean {
    if (total.value <= 5) {
        return true
    }

    if (page.value === i) {
        return true
    }

    if (i === page.value - 1) {
        return true
    }

    if (i === page.value + 1) {
        return true
    }

    return false
}
</script>
<template>
    <div class="flex w-full justify-center gap-x-2">
        <template v-if="!shouldBeVisible(1)">
            <is-btn
                :size
                :color
                variant="tonal"
                @click="page = 1"
            >
                {{ 1 }}
            </is-btn>
            <is-btn
                :size
                :color
                variant="tonal"
                disabled
                class="hidden md:block"
                @click="page = page - 1"
            >
                ...
            </is-btn>
        </template>

        <is-btn
            v-for="i in total"
            :key="i"
            :variant="i === page ? 'fill' : 'tonal'"
            :class="shouldBeVisible(i) ? '' : 'hidden'"
            :size
            :color
            @click="page = i"
        >
            {{ i }}
        </is-btn>

        <template v-if="!shouldBeVisible(total)">
            <is-btn
                padding="none"
                :size
                :color
                variant="tonal"
                disabled
                class="hidden md:block"
                @click="page = page + 1"
            >
                ...
            </is-btn>

            <is-btn
                padding="none"
                :size
                :color
                variant="tonal"
                @click="page = total"
            >
                {{ total }}
            </is-btn>
        </template>
    </div>
</template>
