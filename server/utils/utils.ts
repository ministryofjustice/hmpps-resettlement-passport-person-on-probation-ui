import { addSeconds, format } from 'date-fns'
import type { Appointment, AppointmentLocation } from '../data/resettlementPassportData'

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
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const formatDate = (dateString: string, monthStyle: 'short' | 'long' = 'long'): string => {
  if (!dateString || dateString?.length < 1) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: monthStyle, year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export function formatTime(inputTime: string, duration: number = 0): string {
  if (!inputTime || inputTime?.length < 1) return null
  const [hours, minutes, seconds] = inputTime.split(':').map(Number)

  const dateObj = new Date()
  dateObj.setHours(hours || 0)
  dateObj.setMinutes(minutes || 0)
  dateObj.setSeconds(seconds || 0)
  const updatedDate = addSeconds(dateObj, duration)

  return format(updatedDate, 'h:mm a')
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

export const isFuture = (d1: string): boolean => {
  const date1 = new Date(d1)
  const today = new Date()

  if (date1 > today || date1.getTime() === today.getTime()) {
    return true
  }
  return false
}

// TODO: take Locale into account for i18n in the future
export function pluraliseAppointments(input: Appointment[]): string {
  return input.length === 1 ? 'appointment' : 'appointments'
}

export const sortByDate = (a: string, b: string, order: 'asc' | 'desc'): number => {
  const date1 = new Date(order === 'asc' ? a : b)
  const date2 = new Date(order === 'asc' ? b : a)
  return date1.getTime() - date2.getTime()
}

export const formatAppointmentNote = (inputNote?: string): string => {
  if (inputNote) {
    const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const sanitisedNotes = inputNote.replace(htmlRegex, '')
    return sanitisedNotes
  }
  return inputNote
}
