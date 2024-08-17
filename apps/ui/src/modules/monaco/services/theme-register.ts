import * as monaco from 'monaco-editor'

function rgbToHex(r: number, g: number, b: number) {
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const root = getComputedStyle(document.body)

function cssVarValue(name: string, defaultValue: string, withHash = false) {
	const cssVar = root.getPropertyValue(name)

	if (!cssVar) {
		return withHash ? `#${defaultValue}` : defaultValue
	}

	const [r, g, b] = cssVar.split(' ').map(Number)

	const hexValue = rgbToHex(r, g, b)

	return withHash ? `#${hexValue}` : hexValue

}


// define theme
monaco.editor.defineTheme('default', {
	base: 'vs-dark',
	inherit: true,
	rules: [
		{
			background: '18181B',
			token: '',
		},

		{
			foreground: cssVarValue('--color-success-900', '0c562b'),
			token: 'comment',
		},
		{
			foreground: cssVarValue('--color-success-100', '0c562b'),
			token: 'number',
		},
		{
			foreground: cssVarValue('--color-warning-300', cssVarValue('--color-primary-200', 'feeca0')),
			token: 'string',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'constant.numeric',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'constant.language',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'constant.character',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'constant.other',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'ffb86c'),
			token: 'variable.other.readwrite.instance',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'constant.character.escaped',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'constant.character.escape',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'string source',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'string source.ruby',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'keyword',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'storage',
		},
		{
			foreground: cssVarValue('--color-danger-300', '8be9fd'),
			fontStyle: 'italic',
			token: 'storage.type',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			fontStyle: 'underline',
			token: 'entity.name.class',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			fontStyle: 'italic underline',
			token: 'entity.other.inherited-class',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			token: 'entity.name.function',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'ffb86c'),
			fontStyle: 'italic',
			token: 'variable.parameter',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'entity.name.tag',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			token: 'entity.other.attribute-name',
		},
		{
			foreground: cssVarValue('--color-info-300', '8be9fd'),
			token: 'support.function',
		},
		{
			foreground: cssVarValue('--color-danger-300', '6be5fd'),
			token: 'support.constant',
		},
		{
			foreground: cssVarValue('--color-danger-300', '66d9ef'),
			fontStyle: ' italic',
			token: 'support.type',
		},
		{
			foreground: cssVarValue('--color-danger-300', '66d9ef'),
			fontStyle: ' italic',
			token: 'support.class',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'f8f8f0'),
			background: cssVarValue('--color-success-100', 'be74fd'),
			token: 'invalid',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'f8f8f0'),
			background: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'invalid.deprecated',
		},
		{
			foreground:  cssVarValue('--color-primary-300', 'bd93f9'),
			token: 'variable.source',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'cfcfc2'),
			token: 'meta.structure.dictionary.json string.quoted.double.json',
		},
		{
			foreground: cssVarValue('--color-danger-500', '6272a4'),
			token: 'meta.diff',
		},
		{
			foreground: cssVarValue('--color-danger-500', '6272a4'),
			token: 'meta.diff.header',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'markup.deleted',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			token: 'markup.inserted',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'e6db74'),
			token: 'markup.changed',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'constant.numeric.line-number.find-in-files - match',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'e6db74'),
			token: 'entity.name.filename',
		},
		{
			foreground: cssVarValue('--color-danger-500', 'f83333'),
			token: 'message.error',
		},
		{
			foreground: cssVarValue('--color-body-50', 'eeeeee'),
			token: 'punctuation.definition.string.begin.json - meta.structure.dictionary.value.json',
		},
		{
			foreground: cssVarValue('--color-body-50', 'eeeeee'),
			token: 'punctuation.definition.string.end.json - meta.structure.dictionary.value.json',
		},
		{
			foreground: cssVarValue('--color-danger-300', '8be9fd'),
			token: 'meta.structure.dictionary.json string.quoted.double.json',
		},
		{
			foreground: cssVarValue('--color-primary-200', 'feeca0'),
			token: 'meta.structure.dictionary.value.json string.quoted.double.json',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			token: 'meta meta meta meta meta meta meta.structure.dictionary.value string',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'ffb86c'),
			token: 'meta meta meta meta meta meta.structure.dictionary.value string',
		},
		{
			foreground: cssVarValue('--color-success-100', 'be74fd'),
			token: 'meta meta meta meta meta.structure.dictionary.value string',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'bd93f9'),
			token: 'meta meta meta meta.structure.dictionary.value string',
		},
		{
			foreground: cssVarValue('--color-success-300', '50fa7b'),
			token: 'meta meta meta.structure.dictionary.value string',
		},
		{
			foreground: cssVarValue('--color-danger-300', 'ffb86c'),
			token: 'meta meta.structure.dictionary.value string',
		},
	],
	colors: {
		'editor.foreground': cssVarValue('--color-body-10', 'fafafa', true),
		'editor.background': cssVarValue('--color-body-800', '2c291c', true),
		'editor.selectionBackground': cssVarValue('--color-primary-300', '3d3a2e', true),
		'editor.lineHighlightBackground': cssVarValue('--color-body-700', '3d3a2e', true),
		'editorCursor.foreground': cssVarValue('--color-primary-50', 'fafafa', true),
		'editorWhitespace.foreground': cssVarValue('--color-primary-50', '7f7d75', true),
		'editorIndentGuide.activeBackground': cssVarValue('--color-primary-300', 'c4c3bf', true),
		'editor.selectionHighlightBorder': cssVarValue('--color-primary-50', '7f7d75', true),
		'scrollbarSlider.background': cssVarValue('--color-body-500', '49463b', true),
		'scrollbarSlider.activeBackground': cssVarValue('--color-primary-500', '49463b', true),
		'scrollbarSlider.hoverBackground': cssVarValue('--color-primary-500', '49463b', true),
	},
})
