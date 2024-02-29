import { AppointmentLocation } from '../data/resettlementPassportApiClient'

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

export function formatTime(inputTime: string): string {
  let suffix = 'AM'

  if (!inputTime || inputTime?.length < 1) return null
  // Split the input time string by ':' to extract hours and minutes
  const [hour, minute] = inputTime.split(':')

  // Convert hours and minutes to integers
  let hourInt = parseInt(hour, 10)
  const minuteInt = parseInt(minute, 10)
  if (hourInt > 12) {
    hourInt = hourInt -12
    suffix = 'PM'
  }
  // Ensure the minutes are formatted with leading zeros
  const hourStr = hourInt.toString()
  const minuteStr = minuteInt.toString().padStart(2, '0')

  // Create the formatted time string in 24-hour format
  return `${hourStr}:${minuteStr} ${suffix}`
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

export const isFuture = (d1: string): boolean => {
  const date1 = new Date(d1)
  const today = new Date()

  if (date1 > today || date1.getTime() === today.getTime()) {
    return true
  }
  return false
}
