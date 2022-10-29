

export function useAggregation<T>(items: Array<T>) {
    function count(){
        return items.length
    }
   
    function sum(field: string){
        return items
            .map(i => i[field])
            .filter(n => !isNaN(n))
            .reduce((r, i) => r + Number(i), 0)

    }

    return { count, sum }
}