import { useLocale } from '@/plugins/i18n'
import { watch } from 'vue'
import { useTheme } from './composables/theme'
import { useStore } from './store'

export default async () => {
    const store = useStore()
    const locale = useLocale()
    const theme = useTheme()

    watch(
        () => store.options.locale,
        (value) => {
            locale.value = value || 'en-US'
        }
    )

    watch(() => store.options.theme, theme.setCSSVariables, {
        deep: true,
    })

    await store.setOptions()
}
