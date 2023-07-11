import View from './view'

export default class ViewGroup extends View {
    public readonly component = 'group'
    public viewIds: string[] = []

    constructor(props?: Partial<ViewGroup>, id?: string) {
        super(props, id)

        if (props?.viewIds) {
            this.viewIds = props?.viewIds
        }
    }
}
