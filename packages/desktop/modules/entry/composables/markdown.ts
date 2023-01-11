import MarkdownIt from 'markdown-it'

import hljs from 'highlight.js'

import { componentPlugin } from '@mdit-vue/plugin-component'

interface Options {
    basePath?: string
}

export function parse(source: string, options?: Options) {
    const md = MarkdownIt({
        html: true,
        xhtmlOut: true,
        breaks: true,
        linkify: true,
        typographer: true,
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

    md.disable('code')

    md.renderer.rules.image = function (tokens, idx, tokenOptions, env, slf) {
        const token = tokens[idx]

        token.tag = 'e-img'

        if (options?.basePath) {
            token.attrPush(['base-path', options.basePath])
        }

        return slf.renderToken(tokens, idx, tokenOptions)
    }

    md.renderer.rules.link_open = function (tokens, idx, tokenOptions, env, slf) {
        const token = tokens[idx]

        token.tag = 'v-link'

        return slf.renderToken(tokens, idx, tokenOptions)
    }

    md.renderer.rules.link_close = function (tokens, idx, tokenOptions, env, slf) {
        const token = tokens[idx]

        token.tag = 'v-link'

        return slf.renderToken(tokens, idx, tokenOptions)
    }

    md.use(componentPlugin)

    return md.render(source)
}

export const markdown = {
    parse,
}
