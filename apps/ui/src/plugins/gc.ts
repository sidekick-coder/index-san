
const files = import.meta.glob('../components/**/*.vue', { eager: true })
const components: any = {}

Object.entries(files).forEach(([filename, value]: any) => {
    const name = basename(filename).replace('.vue', '')

    components[name] = value.default
})

export default definePlugin({
    setup(app) {
		Object.entries(components).forEach(([name, def]: any[]) => {
				app.component(name, def)
		})
    }
})
