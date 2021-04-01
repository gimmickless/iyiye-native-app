import { AuthUserAddress } from 'types/context'

export const convertDateToIsoString = (date: Date | undefined): string => {
  if (!date) return ''
  return date ? date.toISOString().substring(0, 10) : ''
}
