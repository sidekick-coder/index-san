import _map from 'lodash/map'

interface Filter {
    type: string
    key: string
    value: string
}

interface Iterator {
    type: 'filter' | 'map'
    options: any
}


export function useArray<T extends Array<any>>(source: T){
    const iterations: Iterator[] = []

    function filterNumber(filterValue: string, itemValue: string){
        return filterValue.split('|')
            .every(pattern => {
                const number = Number(pattern.replace(/^\D+/g, ''))
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

    function iterate(type: Iterator['type'], options: Iterator['options']){
        iterations.push({ type, options })
    }

    function filter(...filters: Filter[]){
        filters.forEach(f => iterate('filter', f))
        
        return this
    }

    function map(...args: any[]) {
        args.forEach(a => iterate('map', a))
        
        return this
    }

    function _filterItems(items: any[], filter: Filter){
        return items.filter(item => {
            if (filter.type === 'number') {
                return filterNumber(filter.value, item[filter.key])
            }

            return item[filter.key] === filter.value
        })
    }
   

    function value(): [string, string][] {
        let result = source.slice()

        iterations.forEach(i => {
            if (i.type === 'filter') {
                result = _filterItems(result, i.options)
            }
            
            if (i.type === 'map') {
                result = _map(result, i.options)
            }

        })

        return result
    }

    return {
        filter,
        map,
        value
    }
}