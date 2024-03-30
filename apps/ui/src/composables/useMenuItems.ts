

import type { MenuItem } from "./defineMenuItem";

const items = shallowRef<MenuItem[]>([])

export function useMenuItems(){
    return items
}