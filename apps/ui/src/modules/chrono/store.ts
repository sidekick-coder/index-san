import { defineStore } from "pinia";
import { useChrono } from "./composables/useChrono";

export const useChronoStore = defineStore('chrono', () => {
    // general
    const { app } = useChrono()
    const hasRepository = ref(false)

    // status
    const loadingStatus = ref(false)
    const status = ref<Awaited<ReturnType<typeof app.status>>>({
        untracked: [],
        added: [],
        changed: [],
    })

    async function setHasRepository(){
        hasRepository.value = await app.hasRepository()

        return hasRepository.value
    }

    async function setStatus(){
        if (!await setHasRepository()) return

        loadingStatus.value = true


        status.value = await app.status()

        loadingStatus.value = false
    }

    async function init(){
        await app.init()

        await setStatus()
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

    // setStatus()

    return {
        app,
        hasRepository,

        loadingStatus,
        status,

        setStatus,
        init,
        add,
        remove,
        commit,
    }
})