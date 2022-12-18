import uuid from 'uuid-random'

export default class View {
    public id: string
    public filters: any[] = []

    constructor(props?: Omit<View, 'id'>, id?: string) {
        this.id = id || uuid()

        this.filters = props?.filters || []
    }
}

export interface ViewTableColumn {
    id: string // link with column
    width: number
}

export class ViewTable extends View {
    public readonly component = 'table'
    public columns: ViewTableColumn[] = []

    constructor(props: Omit<ViewTable, 'id'>, id?: string) {
        super(props, id)

        this.columns = props.columns
    }
}

export interface ViewGalleryColumn {
    id: string // link with column
    hide: boolean
}

export interface ViewGallerySize {
    width: number
    height: number
}

export interface ViewGallerySizes {
    sm: ViewGallerySize
    md: ViewGallerySize
    lg: ViewGallerySize
}

export interface ViewGalleryThumbnail {
    key?: string
    position?: string
    fit?: string
}

export class ViewGallery extends View {
    public readonly component = 'gallery'

    public columns: ViewGalleryColumn[] = []
    public thumbnail?: ViewGalleryThumbnail
    public sizes?: ViewGallerySizes

    constructor(props: Omit<ViewGallery, 'id'>, id?: string) {
        super(props, id)

        this.columns = props.columns
        this.thumbnail = props.thumbnail
        this.sizes = props.sizes
    }
}
