<script setup lang="ts">
defineProps({
    items: {
        type: Array as () => any[],
        default: () => []
    },
    columns: {
        type: Array as () => any[],
        default: () => []
    },
})

</script>
<template>
    <div class="flex items-stretch">
        <div v-for="(item, index) in items" :key="index" class="p-2 w-full max-w-[300px]">
            <div
                class="bg-gray-800 p-2 text-sm rounded cursor-pointer"
                @click="$emit('item:show', item)"
            >
                <div v-for="column in columns" :key="column.id" class="mb-2 last:mb-0">
                    <b>{{column.label}}:</b>

                    {{ item[column.field] }}
                </div>
            </div>

        </div>

        <div class="p-2 w-full max-w-[300px] cursor-pointer ">
            <div
                class="border border-gray-800 p-2 text-sm rounded h-full flex items-center justify-center text-gray-800"
                @click="$emit('item:new')"
            >
                <fa-icon icon="plus" class="text-xl" />
            </div>
        </div>

    </div>
</template>