import { defineLanguage } from '../composable/define-language'
import monarch from './mdc.monarch'
import completion from './mdc.completion'

export default defineLanguage({
    id: 'mdc',
    monarch,
    completion,
})
