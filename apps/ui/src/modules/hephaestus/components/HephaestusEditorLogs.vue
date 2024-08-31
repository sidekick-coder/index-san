<script lang="ts" setup>
const drawer = ref(false)

const logs = defineProp<string[]>('logs', {
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

    return result || ''
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
                        name="heroicons-solid:document-text"
                        :class="logs.length ? 'text-blue-500' : ''"
                    />
                </is-btn>
            </template>
            <div>Logs</div>
        </is-tooltip>

        <template v-if="drawer">
            <div
                class="fixed size-full inset-0 bg-body-900/50 z-10"
                @click="drawer = false"
            />

            <div class="fixed top-0 h-full right-0 min-w-[25rem] bg-body-700 z-20 border-l border-body-500">
                <div class="h-16 flex items-center px-4">
                    <div class="text-lg font-bold">
                        Logs
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
                        v-if="!logs.length"
                        class="px-4 border-y border-body-500 py-4 flex items-center gap-x-2"
                    >
                        <div class="text-sm text-body-100">
                            No logs
                        </div>
                    </div>

                    <div
                        v-for="(log, i) in logs"
                        :key="i"
                        class="px-4 border-y border-body-500 py-4 flex items-center gap-x-2"
                    >
                        <div class="text-sm">
                            {{ i + 1 }} -
                        </div>
                        
                        <div class="text-sm text-body-100">
                            <pre>{{ show(log).trim() }}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
