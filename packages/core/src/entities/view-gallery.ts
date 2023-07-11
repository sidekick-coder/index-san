import ViewCommon from './view-common'

export interface ViewGallerySize {
    width: number | string
    height: number | string
}

export interface ViewGalleryThumbnail {
    key?: string
    position?: string
    fit?: string
}

export default class ViewGallery extends ViewCommon {
    public readonly component = 'gallery'

    public thumbnail: ViewGalleryThumbnail = {
        fit: '',
        key: '',
        position: '',
    }

    public sizes: Record<'sm' | 'md' | 'lg', ViewGallerySize> = {
        sm: {
            width: 200,
            height: 'auto',
        },
        md: {
            width: 200,
            height: 'auto',
        },
        lg: {
            width: 200,
            height: 'auto',
        },
    }

    constructor(props?: Partial<ViewGallery>, id?: string) {
        super(props, id)

        if (props?.thumbnail) {
            this.thumbnail = props?.thumbnail
        }

        if (props?.sizes) {
            this.sizes = props?.sizes
        }
    }
}
