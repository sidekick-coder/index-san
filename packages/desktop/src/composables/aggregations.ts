

export function useAggregation<T>(items: Array<T>) {
    function count(){
        return items.length
    }

    return { count }
}