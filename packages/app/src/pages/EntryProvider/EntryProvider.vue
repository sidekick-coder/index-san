<script lang="ts" setup>
import type { EntryMiddleware } from '@/composables/defineEntryMiddleware'
import type { RouteLocationRaw } from 'vue-router';

// general

const router = useRouter()
const { drive } = useDrive()

// middlewares
const middlewares = ref<EntryMiddleware[]>([])

const main = defineEntryMiddleware((ctx) => {
    if (ctx.entry.type !== 'directory') {
        return {
            path: '/app-pages/file',
            query: {
                path: ctx.entry.path
            }
        }
    }
    
    return {
        path: '/app-pages/directory',
        query: {
            path: ctx.entry.path
        }
    }
})

middlewares.value.push(main)

// load

const path = defineProp<string | string[]>('path', {
    type: [String, Array],
    default: '/'
})

async function load(){

    const args = Array.isArray(path.value) ? path.value : [path.value]

    const filename = `/${args.join('/')}`

    const entry = await drive.value.get(filename)

    if (!entry) {
        alert('Entry not found')
        return
    }

    let result: RouteLocationRaw | undefined

    for await (const middleware of middlewares.value) {
        const middlewareResult = await middleware({ entry })

        if (middlewareResult) {
            result = middlewareResult
        }
    }

    if (!result) {
        alert('Route not found')
        return
    }

    router.replace(result)
}

onMounted(load)


</script>

<template>
    <div />
</template>
