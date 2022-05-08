const colors = {
  white: '\x1b[37m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
}

export function colorize(value: string, colorName: keyof typeof colors = 'white') {
  const color = colors[colorName || 'white']

  return `${color}${value}\x1b[0m`
}
