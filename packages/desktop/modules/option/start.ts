import { useLocale } from '@/plugins/i18n'
import { watch } from 'vue'
import { useStore } from './store'

export default async () => {
    const store = useStore()
    const locale = useLocale()

    watch(
        () => store.options.locale,
        (value) => {
            locale.value = value || 'en-US'
        }
    )

    await store.setOptions()
}
