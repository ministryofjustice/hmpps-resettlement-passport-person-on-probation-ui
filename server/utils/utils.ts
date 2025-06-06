import { addMinutes, compareAsc, format, isBefore, isFuture, isSameDay, isValid, parse, parseISO } from 'date-fns'
import { cy, enGB } from 'date-fns/locale'
import type { Appointment, AppointmentLocation } from '../data/resettlementPassportData'
import { FeatureFlagKey, FeatureFlags } from '../services/featureFlags'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError pageF
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const getLocaleForLang = (lang: string): Locale => {
  if (lang === 'cy') {
    return cy
  }
  return enGB
}

export const appendLang = (lang?: string): string => {
  if (lang) {
    return encodeURI(`?lang=${lang}`)
  }
  return ''
}

export const appendLanguage = (
  queryParams: Partial<{
    lang?: string
  }>,
): string => appendLang(queryParams?.lang)

export const hiddenClassOnFlag = (flag: FeatureFlagKey, featureFlags: FeatureFlags): string => {
  if (featureFlags.isEnabled(flag)) {
    return ''
  }
  return 'hidden'
}
export const formatLicenceDate = (dateString: string, lang?: string): string => {
  if (!dateString || dateString?.length < 1) return null
  const date = parse(dateString, 'dd/MM/yyyy', new Date())
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString(getLocaleForLang(lang).code, options)
}

export const formatDate = (dateString: string, lang: string, options: Intl.DateTimeFormatOptions): string => {
  if (!dateString || dateString?.length < 1) return null
  const date = new Date(dateString)
  return date.toLocaleDateString(getLocaleForLang(lang).code, options)?.replace(',', '')
}

export const formatLongDate = (dateString: string, lang?: string): string => {
  return formatDate(dateString, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatShortDate = (dateString: string, lang?: string): string => {
  return formatDate(dateString, lang, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getDateFromDayMonthYear(day?: string, month?: string, year?: string): Date {
  if (!day || !month || !year) return null
  if (Number.isNaN(Number(day)) || Number.isNaN(Number(month)) || Number.isNaN(Number(year))) return null
  const parsedDate = parse(`${day}/${month}/${year}`, 'dd/MM/yyyy', new Date())
  const isValidDate = isValid(parsedDate)
  if (!isValidDate) {
    return null
  }
  return parsedDate
}

export function dayOfMonth(dateString: string): number {
  return parseIsoDate(dateString)?.getDate()
}

export function monthOfYear(dateString: string): number {
  const date = parseIsoDate(dateString)
  return date ? date.getMonth() + 1 : undefined
}

export function yearOf(dateString: string): number {
  return parseIsoDate(dateString)?.getFullYear()
}

function parseIsoDate(dateString: string): Date | undefined {
  const date = parseISO(dateString)
  if (!isValid(date)) {
    return undefined
  }
  return date
}

export function dateFromStrings(day?: string, month?: string, year?: string): string {
  if (!day || !month || !year) return null
  const dobDate = getDateFromDayMonthYear(day, month, year)
  if (!dobDate) return null
  return format(dobDate, 'yyyy-MM-dd')
}

export function isValidOtp(otp?: string): boolean {
  if (!otp) return false
  const regex = /^[a-zA-Z0-9]{6}$/
  return regex.test(otp)
}

export function isValidEmail(email?: string): boolean {
  if (!email) return false
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  return regex.test(email)
}

export function formatTime(inputTime: string, duration: number, lang?: string): string {
  if (!inputTime || inputTime?.length < 1) return null
  const [hours, minutes, seconds] = inputTime.split(':').map(Number)

  const dateObj = new Date()
  dateObj.setHours(hours || 0)
  dateObj.setMinutes(minutes || 0)
  dateObj.setSeconds(seconds || 0)
  const updatedDate = addMinutes(dateObj, duration)

  return format(updatedDate, 'h:mma', {
    locale: getLocaleForLang(lang),
  })?.toLowerCase()
}

export function formatAppointmentLocation(input: AppointmentLocation): string {
  if (!input) return null
  return [
    input?.buildingName,
    input?.buildingNumber,
    input?.streetName,
    input?.district,
    input?.town,
    input?.county,
    input?.postcode,
  ]
    .filter(x => x?.length > 0)
    .join(', ')
}

export function mapsLinkFromAppointmentLocation(input: AppointmentLocation): string {
  if (!input) return null
  const validAddressInfo = [input?.buildingNumber, input?.streetName, input?.town, input?.postcode].filter(
    x => x?.length > 0,
  )
  const queryParams = validAddressInfo.join('+')

  if (validAddressInfo?.length < 1) return null
  return `https://www.google.com/maps/?q=${queryParams}`
}

export const isFutureDate = (d1: string): boolean => {
  const date1 = new Date(d1)
  const today = new Date()
  return isSameDay(date1, today) || isFuture(date1)
}

export const getFutureAppointments = (results: Appointment[]) => {
  return results?.filter(x => isFutureDate(x.date)).sort((x, y) => compareAsc(x.dateTime, y.dateTime))
}

// TODO: take Locale into account for i18n in the future
export function pluraliseAppointments(input: Appointment[]): string {
  return input.length === 1 ? 'appointment' : 'appointments'
}

export const formatAppointmentNote = (inputNote?: string): string => {
  if (inputNote) {
    const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const sanitisedNotes = inputNote.replace(htmlRegex, '')
    return sanitisedNotes
  }
  return inputNote
}

export const orElse = (input: string, alternative: string): string => {
  return input || alternative
}

export const isDateInPast = (input: string): boolean => {
  if (!input || input?.length < 1) return false
  const inputDate = new Date(input)
  return isBefore(inputDate, new Date())
}

export const toProperCase = (input: string): string =>
  input.replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase()}${txt.slice(1).toLowerCase()}`)

export function isNotEmpty(value?: string): boolean {
  return value && value.length > 0
}
export function isValidYear(value?: string): boolean {
  return value && value.length == 4
}
