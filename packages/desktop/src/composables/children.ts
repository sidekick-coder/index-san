import { ComponentInternalInstance, Slot, VNode } from 'vue'

export function findAllChildren(children: VNode[]){
    const result: VNode[] = []
    const toCheck = children

    while(toCheck.length) {
        const current = toCheck[0]

        if (Array.isArray(current.children)) {
            toCheck.push(...current.children as VNode[])
        }

        result.push(current)

        toCheck.splice(0, 1)
    }

    return result

}

export function useChildren(slots: ComponentInternalInstance['slots']) {
    let children: VNode[] = []

    function load(){
        children = []

        Object.keys(slots)
            .map(key => slots[key])
            .filter(slot => !!slot)
            .map((slot: Slot) => slot())
            .forEach((c) => {
                children.push(...findAllChildren(c))
            })
    }

    function findComponent(...names: string[]) {
        return children
            .filter(c => typeof c.type === 'object')
            .filter(c => names.includes((c.type as any).name))
    }   

    return {
        load,
        findComponent
    }


}