import type { AppointmentLocation } from '../data/resettlementPassportData'
import {
  convertToTitleCase,
  formatTime,
  initialiseName,
  formatDate,
  formatAppointmentLocation,
  mapsLinkFromAppointmentLocation,
  pluraliseAppointments,
  isFuture,
  formatLicenceDate,
} from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('formatTime', () => {
  it.each([
    ['14:00:00', '02:00 PM'],
    ['14:01', '02:01 PM'],
    ['12:00:00', '12:00 PM'],
    ['09:01:00', '09:01 AM'],
    ['13:50:23', '01:50 PM'],
    [null, null],
    ['', null],
  ])('formatTime(%s)', (input: string, expected: string) => {
    expect(formatTime(input)).toEqual(expected)
  })

  it.each([
    ['14:00:00', '02:50 PM'],
    ['14:01', '02:51 PM'],
    ['12:00:00', '12:50 PM'],
    ['09:01:00', '09:51 AM'],
    ['13:50:23', '02:40 PM'],
    [null, null],
    ['', null],
  ])('it should add 3000 seconds to formatTime(%s)', (input: string, expected: string) => {
    expect(formatTime(input, 3000)).toEqual(expected)
  })
})

describe('formatDate', () => {
  it.each([
    ['2023-09-02', '2 September 2023'],
    ['2023-1-1', '1 January 2023'],
    [null, null],
    ['', null],
  ])('formatDate(%s)', (input: string, expected: string) => {
    expect(formatDate(input)).toEqual(expected)
  })
})

describe('formatLicenceDate', () => {
  it.each([
    ['20/08/2023', '20 August 2023'],
    ['12/07/2023', '12 July 2023'],
    [null, null],
    ['', null],
  ])('formatLicenceDate(%s)', (input: string, expected: string) => {
    expect(formatLicenceDate(input)).toEqual(expected)
  })
})

describe('formatAppointmentLocation', () => {
  it.each([
    [
      {
        buildingName: null,
        buildingNumber: null,
        streetName: null,
        district: null,
        town: null,
        county: null,
        postcode: null,
        description: 'CRS Provider Location',
      },
      '',
    ],
    [
      {
        buildingName: 'The health centre',
        buildingNumber: '123',
        streetName: 'Main Street',
        district: 'Headingley',
        town: 'Leeds',
        county: 'West Yorkshire',
        postcode: 'LS1 2AB',
        description: null,
      },
      'The health centre, 123, Main Street, Headingley, Leeds, West Yorkshire, LS1 2AB',
    ],
    [
      {
        postcode: 'LS1 2AB',
      },
      'LS1 2AB',
    ],
    [null, null],
  ])('formatAppointmentLocation(%s)', (input: AppointmentLocation, expected: string) => {
    expect(formatAppointmentLocation(input)).toEqual(expected)
  })
})

describe('mapsLinkFromAppointmentLocation', () => {
  it.each([
    [
      {
        buildingName: null,
        buildingNumber: null,
        streetName: null,
        district: null,
        town: null,
        county: null,
        postcode: null,
        description: 'CRS Provider Location',
      },
      null,
    ],
    [
      {
        buildingName: 'The health centre',
        buildingNumber: '123',
        streetName: 'Main Street',
        district: 'Headingley',
        town: 'Leeds',
        county: 'West Yorkshire',
        postcode: 'LS1 2AB',
        description: null,
      },
      'https://www.google.com/maps/?q=123+Main Street+Leeds+LS1 2AB',
    ],
    [
      {
        postcode: 'LS1 2AB',
      },
      'https://www.google.com/maps/?q=LS1 2AB',
    ],
    [null, null],
  ])('mapsLinkFromAppointmentLocation(%s)', (input: AppointmentLocation, expected: string) => {
    expect(mapsLinkFromAppointmentLocation(input)).toEqual(expected)
  })
})

describe('isFuture', () => {
  beforeAll(() => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date(2023, 8, 2))
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  it.each([
    ['2023-09-01', false], // yesterday
    ['2023-09-02', true], // today
    ['2023-09-03', true], // tomorrow
    [null, false],
    ['', false],
  ])('isFuture(%s)', (input: string, expected: boolean) => {
    expect(isFuture(input)).toBe(expected)
  })
})

describe('pluraliseAppointments', () => {
  it('should not pluralise', () => {
    const appointment = {
      results: [
        {
          id: 'abcba1de-a6e7-49be-a836-37388ce8a0bc',
          title: 'This is a future appointment',
          contact: 'Unallocated Staff',
          time: '14:05:00',
        },
      ],
    }
    expect(pluraliseAppointments(appointment.results)).toEqual('appointment')
  })

  it('should pluralise appointments', () => {
    const appointment = {
      results: [
        {
          title: 'appointment 1',
          contact: 'Unallocated Staff',
          time: '09:00:00',
        },
        {
          title: 'appointment 2',
          contact: 'Unallocated Staff',
          time: '14:05:00',
        },
      ],
    }
    expect(pluraliseAppointments(appointment.results)).toEqual('appointments')
  })
})
