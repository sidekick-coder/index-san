import View from './view'

export default class ViewGroup extends View {
    public readonly component = 'group'
    public selected = ''
    public viewIds: string[] = []
}
