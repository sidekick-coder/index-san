<script lang="ts" setup>
const path = defineProp<string>('path', {
    type: String,
    required: true
})


// controls
const controls = ref({
    home: false,
    back: false,
    forward: false,
})

function setControls(){
    controls.value.home = path.value !== '/'
    controls.value.back = !!history.state.back && path.value !== '/'
    controls.value.forward = !!history.state.forward
}


watch(() => path.value, setControls, { immediate: true })
</script>

<template>
    <div class="w-full h-12 border-b border-body-500 flex items-center px-10 gap-x-2">
        <div class="-ml-2 flex ">
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.home ? '' : 'text-gray-500 pointer-events-none'"
                :to="{ name: 'entry', params: { path: '/' } }"
            >
                <is-icon
                    size="sm"
                    name="heroicons:home-solid"
                />
            </is-btn>
                
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.back ? '' : 'text-gray-500 pointer-events-none'"
                @click="$router.back()"
            >
                <is-icon
                    size="sm"
                    name="heroicons:arrow-left-solid"
                />
            </is-btn>
                
            <is-btn
                variant="text"
                color="primary"
                size="none"
                class="h-8 w-8"
                :class="controls.forward ? '' : 'text-gray-500 pointer-events-none'"
                @click="$router.forward()"
            >
                <is-icon
                    size="sm"
                    name="heroicons:arrow-right-solid"
                />
            </is-btn>

            <slot name="append-controls" />
        </div>

        <slot name="left" />

        <div class="flex-1 flex gap-x-4">
            <div
                class="text-xs h-8 bg-body-500 w-full px-4 outline-none rounded flex items-center gap-x-2 text-body-100"
            >
                <is-icon
                    size="sm"
                    name="heroicons-solid:computer-desktop"
                />

                {{ path === '/' ? '/' : `${path}` }}
            </div>
        </div>

        <slot name="right" />
    </div>
</template>
