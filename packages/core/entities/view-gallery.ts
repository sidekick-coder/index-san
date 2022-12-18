import View, { ViewColumn } from './view'

export interface ViewGalleryColumn extends ViewColumn {
    hide: boolean
}

export interface ViewGallerySize {
    width: number | string
    height: number | string
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

export default class ViewGallery extends View {
    public readonly component = 'gallery'

    public columns: ViewGalleryColumn[] = []

    public thumbnail: ViewGalleryThumbnail = {
        key: '',
        position: '',
        fit: '',
    }

    public sizes: Record<string, ViewGallerySize> = {
        sm: {
            width: 200,
            height: 'auto',
        },
        md: {
            width: 282,
            height: 'auto',
        },
        lg: {
            width: 200,
            height: 'auto',
        },
    }
}
