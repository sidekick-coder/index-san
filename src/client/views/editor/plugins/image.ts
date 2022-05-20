import EditorJS from '@editorjs/editorjs'
import { useWindowApi } from '@/composables/api'
import { defineEditorPlugin } from '../composables/define-editor-plugin'
import { v4 } from 'uuid'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'

const api = useWindowApi()
const { html: toolIcon } = icon(faImage)

export class ImageTool {
  public wrapper: HTMLElement
  public picker: HTMLElement
  public systemPath: string
  public data: any
  public block: EditorJS.BlockToolConstructorOptions['block']

  constructor(options: any) {
    const { data, config, block } = options as EditorJS.BlockToolConstructorOptions

    this.data = data
    this.block = block

    this.systemPath = config.systemPath

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'w-full h-full'

    this.picker = document.createElement('div')

    this.picker.classList.add(
      'w-full',
      'h-full',
      'flex',
      'items-center',
      'justify-start',
      'p-4',
      'cursor-pointer',
      'rounded',
      'border',
      'border-gray-500',
      'border-dashed'
    )

    this.picker.innerHTML = `<i class='mr-4 leading-none' >${toolIcon}</i> Select Image`

    this.picker.addEventListener('click', async () => {
      await this.upload().catch(console.error)
    })

    this.wrapper.appendChild(this.picker)

    if (data.src) {
      this._createImage(data.src)
    }
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: toolIcon,
    }
  }

  private _createImage(src: string) {
    const image = document.createElement('img')

    image.src = src

    this.wrapper.innerHTML = ''

    this.wrapper.appendChild(image)
  }

  public async upload() {
    const files = await api.invoke('file:pick', {
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    })

    if (files.length === 0) return

    const source = files[0]

    const extname = api.filesystem.extname(source)

    const target = api.filesystem.systemResolve(this.systemPath, `${v4()}${extname}`)

    await api.invoke('file:copy', {
      source,
      target,
    })

    this._createImage(`asset:${target}`)

    this.block?.dispatchChange()
  }

  public render() {
    if (!this.data.src) {
      this.picker.click()
    }
    return this.wrapper
  }

  public save(blockContent: HTMLElement) {
    const image = blockContent.querySelector('img')

    return {
      src: image?.src,
    }
  }
}

export default defineEditorPlugin(({ tools, systemPath }) => {
  tools.set('image', {
    class: ImageTool,
    config: {
      systemPath,
    },
  })
})
