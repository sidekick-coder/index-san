import debounce from 'lodash/debounce'

export function useFocusList(selector: string) {
    function findItems() {
        return document.querySelectorAll(selector)
    }

    function findCurrent() {
        return document.querySelector(`${selector}:focus`) as HTMLElement
    }

    function findTarget(direction = 1) {
        const current = findCurrent()
        const elements = findItems()

        if (!elements.length) return

        const index = Array.from(elements).indexOf(current)

        return elements[index + direction] as HTMLElement | undefined
    }

    function focus(direction = 1) {
        const next = findTarget(direction)

        if (!next) return

        next.focus()
    }

    return {
        focus,
        findCurrent,
        findItems,
        findTarget,
    }
}
