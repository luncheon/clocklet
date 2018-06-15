export interface ClockletOptions {
  className:  string
  format:     string
  placement:  'top' | 'bottom'
  alignment:  'left' | 'right' | 'center'
  appendTo:   'body' | 'parent'
  zIndex:     number | string
  dispatchesInputEvents:  boolean
}

export const defaultDefaultOptions: ClockletOptions = {
  className:  '',
  format:     'HH:mm',
  placement:  'bottom',
  alignment:  'left',
  appendTo:   'body',
  zIndex:     '',
  dispatchesInputEvents: true,
}

export function parseOptions(optionsString?: string | null): Partial<ClockletOptions> | undefined {
  if (!optionsString) {
    return
  }
  const options: Record<string, string> = {}
  for (const s of optionsString.split(';')) {
    const index = s.indexOf(':')
    options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, $0 => $0[0] + $0[2].toUpperCase())] = s.slice(index + 1).trim()
  }
  return options
}
