import type { DriveEntry } from "@/composables/useDrive";
import orderBy from 'lodash/orderBy'
import type { MaybeRef } from "vue";

interface Options {
    exclude: string[]
}

export function useDirectoryEntries(path: MaybeRef<string>, options?: Options){

    const _options = ref({
        exclude: ['/.is', '/.chrono'],
        ...options
    })

    const _path = isRef(path) ? path : ref(path)

    const { drive } = useDrive()

    const data = ref<DriveEntry[]>([])
    const loading = ref(false)
    

    const filteredData = computed(() => {
        return data.value.filter(e => {
            if (_options.value.exclude.some(ex => e.path.startsWith(ex))) {
                return false
            }

            return true
        })
    })

    async function load(){
        loading.value = true

        return drive.value.list(_path.value)
            .then(entries => {
                data.value = orderBy(entries, ['type', 'name'], ['asc', 'asc'])
            })
            .catch(err => {
                throw err
            })
            .finally(() => {
                setTimeout(() => loading.value = false)
            })
    }

    return {
        data: filteredData,
        loading,
        load
    }
}