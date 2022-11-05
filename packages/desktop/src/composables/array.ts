import { ref } from 'vue'

interface Filter {
    type: string
    key: string
    value: string
}

export function useArray<T extends Record<string, any>>(){
    const items = ref([] as T[])

    function filterNumber(filterValue: string, itemValue: string){

        return filterValue.split('|')
            .every(pattern => {
                const number = Number(pattern.replace( /^\D+/g, ''))
                const operator = pattern.replace(String(number),'')
    
                let valid = true
    
                if (operator.includes('>')) {
                    valid = valid && Number(itemValue) > number
                }
            
                if (operator.includes('>=')) {
                    valid = valid && Number(itemValue) >= number
                }
            
                if (operator.includes('<')) {
                    valid = valid && Number(itemValue) < number
                }
            
                if (operator.includes('<=')) {
                    valid = valid && Number(itemValue) <= number
                }
    
                return valid
            })

    }

    function filterArray(...filters: Filter[]){
        items.value = items.value.filter(item => {
            const valid = filters.every(f => {
                if (f.type === 'number') {
                    return filterNumber(f.value, item[f.key])
                }

                return item[f.key] === f.value
            })

            return valid
        })
    }

    return {
        items,
        filterArray
    }
}