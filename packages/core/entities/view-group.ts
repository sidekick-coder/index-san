import View from './view'

export default class ViewGroup extends View {
    public readonly component = 'group'
    public selected = ''
    public viewIds: string[] = []

    constructor(props?: Partial<ViewGroup>, id?: string) {
        super(props, id)

        if (props?.selected) {
            this.selected = props?.selected
        }

        if (props?.viewIds) {
            this.viewIds = props?.viewIds
        }
    }
}
