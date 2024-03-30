<script lang="ts" setup>
const drawer = ref(false)

const errors = defineProp<Error[]>('errors', {
    type: Array,
    default: () => []
})


function show(value: Error) {
    return value.message    
}
</script>

<template>
    <div>
        <is-tooltip placement="left">
            <template #activator="{ attrs }">
                <is-btn
                    v-bind="attrs"
                    variant="text"
                    size="none"
                    class="h-8 w-8"     
                    @click="drawer = true"
                >
                    <is-icon
                        size="sm"
                        name="heroicons-solid:exclamation-triangle"
                        :class="errors.length ? 'text-red-500' : ''"
                    />
                </is-btn>
            </template>
            <div>Errors</div>
        </is-tooltip>

        <template v-if="drawer">
            <div
                class="fixed size-full inset-0 bg-body-900/50 z-10"
                @click="drawer = false"
            />

            <div class="fixed top-0 h-full right-0 w-96 bg-body-700 z-20 border-l border-body-500">
                <div class="h-16 flex items-center px-4">
                    <div class="text-lg font-bold">
                        Errors
                    </div>
                    <div class="flex-1" />
                    <is-btn
                        rounded="full"
                        size="none"
                        class="h-10 w-10"
                        @click="drawer = false"
                    >
                        <is-icon
                            name="heroicons-solid:x"
                        />
                    </is-btn>
                </div>
    
                <div class="flex flex-col">
                    <div
                        v-if="!errors.length"
                        class="px-4 border-y border-body-500 py-4 flex items-center gap-x-2"
                    >
                        <div class="text-sm text-body-100">
                            No errors
                        </div>
                    </div>

                    <div
                        v-for="(e, i) in errors"
                        :key="i"
                        class="px-4 border-y border-body-500 py-4 flex items-center gap-x-2"
                    >
                        <div class="text-sm">
                            {{ i + 1 }} -
                        </div>
                        
                        <div class="text-sm text-red-500">
                            {{ show(e) }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>