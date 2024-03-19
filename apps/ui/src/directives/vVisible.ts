import type { Directive } from "vue"

export const vVisible: Directive = {
    beforeMount(el, { value }, { transition }) {
        if (!value) {
            el.style.visibility = 'hidden'
        }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue) {
        return
      }
  
      if (value) {
        transition?.beforeEnter(el)
        el.style.visibility = ''
        transition?.enter(el)
      }

      if (!value) {
          transition?.leave(el, () => {
            el.style.visibility = 'hidden'
          })
      }
    }
}