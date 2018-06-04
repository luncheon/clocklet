import Lenientime from 'lenientime/es/core/lenientime'
import { tokenizeTemplate } from 'lenientime/es/core/token'

export function findHourToken(time: Lenientime, template: string) {
  return findToken(time, template, /[Hhk]$/)
}

export function findMinuteToken(time: Lenientime, template: string) {
  return findToken(time, template, /m$/)
}

export function findAmpmToken(time: Lenientime, template: string) {
  return findToken(time, template, /a/i)
}

function findToken(time: Lenientime, template: string, pattern: RegExp) {
  let index = 0
  for (const token of tokenizeTemplate(template)) {
    if (token.literal) {
      index += token.property.length
    } else {
      const value = time[token.property as keyof Lenientime]
      if (pattern.test(token.property)) {
        return { index, value }
      } else {
        index += value.length;
      }
    }
  }
  return
}
