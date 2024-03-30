import { defineStore } from "pinia";
import { useChrono } from "./composables/useChrono";

export const useChronoStore = defineStore('chrono', () => {
    // general
    const { app } = useChrono()

    // status
    const loadingStatus = ref(false)
    const status = ref<Awaited<ReturnType<typeof app.status>>>({
        untracked: [],
        added: [],
        changed: [],
    })

    async function setStatus(){
        loadingStatus.value = true

        status.value = await app.status()

        loadingStatus.value = false
    }

    async function add(path: string){
        await app.addEntry(path)

        setStatus()
    }

    async function remove(path: string){
        await app.removeEntry(path)

        setStatus()
    }

    async function commit(message: string, body?: string){
        await app.commit(message, body)

        setStatus()
    }

    setStatus()

    return {
        app,

        loadingStatus,
        status,

        setStatus,
        add,
        remove,
        commit,
    }
})