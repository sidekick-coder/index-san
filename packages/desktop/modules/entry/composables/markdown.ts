import MarkdownIt from 'markdown-it'

import hljs from 'highlight.js'

import { componentPlugin } from '@mdit-vue/plugin-component'

export function parse(source: string) {
    const md = MarkdownIt({
        html: true,
        xhtmlOut: true,
        breaks: true,
        highlight: (str: string, lang: string) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value
                } catch (__) {
                    console.error('highlight error')
                }
            }

            return ''
        },
    })

    md.use(componentPlugin)

    return md.render(source)
}

export function validate(source: string) {
    const template = parse(source)

    console.log(template)

    return false
}

export const markdown = {
    parse,
    validate,
}
