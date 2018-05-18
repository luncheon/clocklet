const defaultOptions = {
  placement: 'bottom left' as 'top left' | 'top right' | 'bottom left' | 'bottom right',
}

export type ClockletOptions = Readonly<typeof defaultOptions>

export function mergeDefaultOptions(options?: Partial<ClockletOptions>): ClockletOptions {
  if (options) {
    return (Object.keys(defaultOptions) as (keyof ClockletOptions)[]).reduce((merged, prop) => (merged[prop] = options[prop] || defaultOptions[prop], merged), {} as typeof defaultOptions)
  } else {
    return defaultOptions
  }
}

export function parseOptions(optionsString?: string): Partial<ClockletOptions> | undefined {
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
