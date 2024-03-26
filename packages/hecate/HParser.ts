import { BaseParser } from '@language-kit/core'
import HNode from './base/HNode'

import HVariableProcessor from './processors/HVariableProcessor'
import HImportProcessor from './processors/HImportProcessor'
import HFunctionProcessor from './processors/HFunctionProcessor'

export default class HParser extends BaseParser<HNode> {
    constructor() {
        super()

        this.setProcessors([HImportProcessor, HVariableProcessor, HFunctionProcessor])
    }

    public onUnhandledToken(token: any) {
        // console.debug('[hecate] unhandled token', token)
    }
}

