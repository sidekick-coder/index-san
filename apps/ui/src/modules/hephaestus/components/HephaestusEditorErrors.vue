<script lang="ts" setup>
const drawer = ref(false)

const error = defineProp('error', {
    type: Array,
    default: () => []
})


function show(value: any) {
    let result = value

    if (typeof result === 'function') {
        result = value.toString()
    }

    if (typeof result === 'object') {
        result = JSON.stringify(
            result,
            (key, value) => {
                if (typeof value === 'function') {
                    return value.toString()
                }

                return value
            },
            4
        )
    }

    return result
}



</script>

<template>
    <div>
        <is-tooltip placement="left">
            <template #activator="{ attrs }">
                <is-btn
                    v-bind="attrs"
                    @click="drawer = true"
                >
                    <is-icon
                        name="heroicons-solid:exclamation-triangle"
                        :class="error ? 'text-red-500' : ''"
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
                        v-if="!error"
                        class="px-4 text-sm border-y border-body-500 py-2"
                    >
                        No errors
                    </div>

                    <div
                        v-else
                        class="px-4 text-red-500 text-sm border-y border-body-500 py-2"
                    >
                        {{ error }}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>