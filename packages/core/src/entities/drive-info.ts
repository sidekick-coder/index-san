export default class DriveInfo {
    public id: string
    public label: string

    constructor(props: DriveInfo) {
        this.id = props.id
        this.label = props.label
    }
}
