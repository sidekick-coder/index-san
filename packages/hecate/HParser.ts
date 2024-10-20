import { BaseParser } from '@language-kit/core'
import HNode from './base/HNode'

import HVariableProcessor from './processors/HVariableProcessor'
import HImportProcessor from './processors/HImportProcessor'
import HFunctionProcessor from './processors/HFunctionProcessor'
import HUnknownProcessor from './processors/HUnknownProcessor'
import HConsoleProcessor from './processors/HConsoleProcessor'
import HHecateObjectProcessor from './processors/HHecateObjectProcessor'
import HExportDefaultObjectProcessor from './processors/HExportDefaultObjectProcessor'
import HImportDefaultProcessor from './processors/HImportDefaultProcessor'
import HAsyncFunctionProcessor from './processors/HAsyncFunctionProcessor'

export default class HParser extends BaseParser<HNode> {
    constructor() {
        super()

        this.setProcessors([
			HExportDefaultObjectProcessor,
            HImportProcessor,
            HImportDefaultProcessor,
            HVariableProcessor,
            HAsyncFunctionProcessor,
            HFunctionProcessor,
            HUnknownProcessor,
            HHecateObjectProcessor,
            HConsoleProcessor
        ])
    }

    public onUnhandledToken(token: any) {
        console.error('[hecate] unhandled token', token)
    }
}

