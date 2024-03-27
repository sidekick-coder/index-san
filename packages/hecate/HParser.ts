import { BaseParser } from '@language-kit/core'
import HNode from './base/HNode'

import HVariableProcessor from './processors/HVariableProcessor'
import HImportProcessor from './processors/HImportProcessor'
import HFunctionProcessor from './processors/HFunctionProcessor'
import HUnknownProcessor from './processors/HUnknownProcessor'
import HConsoleProcessor from './processors/HConsoleProcessor'

export default class HParser extends BaseParser<HNode> {
    constructor() {
        super()

        this.setProcessors([
            HImportProcessor,
            HVariableProcessor,
            HFunctionProcessor,
            HUnknownProcessor,
            HConsoleProcessor
        ])
    }

    public onUnhandledToken(token: any) {
        console.error('[hecate] unhandled token', token)
    }
}

