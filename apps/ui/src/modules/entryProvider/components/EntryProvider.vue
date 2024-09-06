<script lang="ts" setup>
import type { EntryMiddlewareResult } from '@/composables/defineEntryMiddleware'
import AppPageRender from '@/modules/appPage/components/AppPageRender.vue'

import orderBy from 'lodash/orderBy'

// general
const { drive: _drive, resolve } = useDrive()
const drive = unref(_drive)

// load
const middlewares = useEntryMiddlewares()

const path = defineProp<string | string[]>('path', {
    type: [String, Array],
    default: '/'
})

const loading = ref(true)
const error = ref<string>()
const result = ref<EntryMiddlewareResult>()

async function setResult(){
    const args = Array.isArray(path.value) ? path.value : [path.value]

    const filename = `${args.join('/')}`

    const entry = await drive.get(filename === '' ? '/' : filename)

    if (!entry) {
        throw `Can not find entry: ${filename}`
    }

    let middlewareResult: EntryMiddlewareResult | undefined

    for await (const middleware of orderBy(middlewares.value, ['order'], ['asc'])) {
        middlewareResult = await middleware.handle({ entry }) || middlewareResult
    }
    
    result.value = middlewareResult    
}

function load(){
    loading.value = true

    setResult()
        .then(() => {
            error.value = undefined
        })
        .catch(e => {
            error.value = e
        })
        .finally(() => {
            setTimeout(() => (loading.value = false), 500)
        })
    
}

watch(path, load, { immediate: true })


</script>

<template>
    <div class="w-full h-full">
        <AppPageRender
            v-if="result"
            :name="result.page"
            :page-props="result.props"
        />
            
        <div
            v-else
            class="w-full min-h-full flex flex-col items-center justify-center "
        >
            <div>Can not open entry</div>
    
            <div>
                {{ error }}
            </div>
        
            <div>Path {{ resolve(...path) }}</div>
        </div>
    </div>
</template>
