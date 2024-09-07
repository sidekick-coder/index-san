import { MarkdownParser, Processors } from '@language-kit/markdown'
import { MarkdownProcessorComponent } from  './MarkdownProcessorComponent'


export class HephaestusMarkdownParser extends MarkdownParser {
	constructor(){
		super(
			[
				...Object.values(Processors),
				MarkdownProcessorComponent
			]
		)
	}
}
