import { computed, ref } from 'vue'


const states = ref(new Map<string, any>())

export function useState<T = any>(key: string, defaultValue?: T) {
    
    if (!states.value.has(key)) {
        states.value.set(key, defaultValue)
    }

    return computed<T>({
        get(){
            return states.value.get(key) as T
        },
        set(v){
            console.debug('states:set', key, v)
            return states.value.set(key, v)
        },
    })
}