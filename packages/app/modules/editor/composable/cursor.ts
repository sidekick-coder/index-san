export function useCursorHelper() {
    function findTarget() {
        return document.querySelector(':focus') as HTMLElement
    }

    function isInput(el: HTMLElement): el is HTMLInputElement {
        const tags = ['INPUT', 'TEXTAREA']

        if (tags.includes(el.tagName)) return true

        if (el.isContentEditable) return true

        return false
    }

    function setCaret(target: HTMLElement, toStart = true) {
        const range = document.createRange()

        if (!range) return

        // set the position of the caret to the end of the text

        range.selectNodeContents(target)
        range.collapse(toStart) //collapse the range to the end point. false means collapse to end rather than the start

        const selection = window.getSelection() //get the selection object (allows you to change selection)

        if (!selection) return

        selection.removeAllRanges() //remove any selections already made
        selection.addRange(range) //make the range you have just created the visible selection
    }

    function setCaretOnEnd() {
        const target = findTarget()

        if (!target) return

        if (!isInput(target)) return

        setCaret(target, false)
    }

    function setCaretOnStart() {
        const target = findTarget()

        if (!target) return

        if (!isInput(target)) return

        setCaret(target, true)
    }

    function isCaretOnStart() {
        const target = findTarget()

        if (!target) return

        if (!isInput(target)) return

        const selection = window.getSelection()

        if (!selection) return

        return selection.anchorOffset === 0
    }

    function isCaretOnEnd() {
        const target = findTarget()

        if (!target) return

        if (!isInput(target)) return

        const selection = window.getSelection()

        if (!selection) return

        return selection.anchorOffset === target.textContent?.length
    }

    return {
        setCaret,
        setCaretOnEnd,
        setCaretOnStart,
        isCaretOnStart,
        isCaretOnEnd,
    }
}
