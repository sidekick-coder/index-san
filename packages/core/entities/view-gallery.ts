import View from './view'

export interface ViewGallerySize {
    width: number | string
    height: number | string
}

export interface ViewGalleryThumbnail {
    key?: string
    position?: string
    fit?: string
}

export default class ViewGallery extends View {
    public readonly component = 'gallery'

    public thumbnail?: ViewGalleryThumbnail

    public sizes?: Record<'sm' | 'md' | 'lg', ViewGallerySize>
}
