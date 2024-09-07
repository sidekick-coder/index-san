import { MarkdownParser, Processors } from '@language-kit/markdown'
import { MarkdownProcessorComponent } from  './MarkdownProcessorComponent'
import { MarkdownProcessorLogicalComponent } from './MarkdownProcessorLogicalComponent'


export class HephaestusMarkdownParser extends MarkdownParser {
	constructor(){
		super(
			[
				...Object.values(Processors),
				MarkdownProcessorComponent,
				MarkdownProcessorLogicalComponent,
			]
		)
	}
}
