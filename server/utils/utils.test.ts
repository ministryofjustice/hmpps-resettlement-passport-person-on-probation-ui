import { format } from 'date-fns'
import type { AppointmentLocation } from '../data/resettlementPassportData'
import {
  convertToTitleCase,
  formatTime,
  initialiseName,
  formatLongDate,
  formatAppointmentLocation,
  mapsLinkFromAppointmentLocation,
  pluraliseAppointments,
  isFutureDate,
  formatLicenceDate,
  getDobDate,
  getDobDateString,
  isValidOtp,
  isValidEmail,
  appendLang,
  appendLanguage,
  isDateInPast,
  toProperCase,
  formatShortDate,
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
    ['14:00:00', '2:00pm'],
    ['14:01', '2:01pm'],
    ['12:00:00', '12:00pm'],
    ['09:01:00', '9:01am'],
    ['13:50:23', '1:50pm'],
    [null, null],
    ['', null],
  ])('formatTime(%s)', (input: string, expected: string) => {
    expect(formatTime(input, 0)).toEqual(expected)
  })

  it.each([
    ['14:00:00', null, '2:50pm'],
    ['14:01', null, '2:51pm'],
    ['12:00:00', null, '12:50pm'],
    ['09:01:00', null, '9:51am'],
    ['13:50:23', null, '2:40pm'],
    ['09:01:00', 'en', '9:51am'],
    ['13:50:23', 'en', '2:40pm'],
    ['09:01:00', 'cy', '9:51yb'],
    ['13:50:23', 'cy', '2:40yh'],
    [null, null, null],
    ['', null, null],
  ])('it should add 50 minutes to formatTime(%s, %s)', (input: string, lang: string, expected: string) => {
    expect(formatTime(input, 50, lang)).toEqual(expected)
  })
})

describe('formatLongDate', () => {
  it.each([
    ['2023-09-02', null, 'Saturday 2 September 2023'],
    ['2023-1-1', null, 'Sunday 1 January 2023'],
    ['2023-09-02', 'en', 'Saturday 2 September 2023'],
    ['2023-1-1', 'en', 'Sunday 1 January 2023'],
    ['2023-09-02', 'cy', 'Dydd Sadwrn 2 Medi 2023'],
    ['2023-1-1', 'cy', 'Dydd Sul 1 Ionawr 2023'],
    [null, null, null],
    ['', null, null],
  ])('formatLongDate(%s, %s)', (input: string, lang: string, expected: string) => {
    expect(formatLongDate(input, lang)).toEqual(expected)
  })
})

describe('formatShortDate', () => {
  it.each([
    ['2023-09-02', null, '2 Sept 2023'],
    ['2023-1-1', null, '1 Jan 2023'],
    ['2023-09-02', 'en', '2 Sept 2023'],
    ['2023-1-1', 'en', '1 Jan 2023'],
    ['2023-09-02', 'cy', '2 Medi 2023'],
    ['2023-1-1', 'cy', '1 Ion 2023'],
    [null, null, null],
    ['', null, null],
  ])('formatShortDate(%s, %s)', (input: string, lang: string, expected: string) => {
    expect(formatShortDate(input, lang)).toEqual(expected)
  })
})

describe('formatLicenceDate', () => {
  it.each([
    ['20/08/2023', null, '20 August 2023'],
    ['12/07/2023', null, '12 July 2023'],
    ['20/08/2023', 'en', '20 August 2023'],
    ['12/07/2023', 'en', '12 July 2023'],
    ['20/08/2023', 'cy', '20 Awst 2023'],
    ['12/07/2023', 'cy', '12 Gorffennaf 2023'],
    [null, null, null],
    ['', null, null],
  ])('formatLicenceDate(%s, %s)', (input: string, lang: string, expected: string) => {
    expect(formatLicenceDate(input, lang)).toEqual(expected)
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

describe('isFutureDate', () => {
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
    ['2023-07-11', false], // last year
    [null, false],
    ['', false],
  ])('isFutureDate(%s)', (input: string, expected: boolean) => {
    expect(isFutureDate(input)).toBe(expected)
  })
})

describe('pluraliseAppointments', () => {
  it('should not pluralise', () => {
    const appointment = {
      results: [
        {
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

describe('getDobDate', () => {
  it.each([
    ['02', '09', '2023', '2023-09-02'],
    ['2', '9', '2023', '2023-09-02'],
  ])('getDobDate(%s)', (day: string, month: string, year: string, expected: string) => {
    const result = getDobDate(day, month, year)
    expect(format(result, 'yyyy-MM-dd')).toBe(expected)
  })
})

describe('getDobDateString', () => {
  it.each([
    ['02', '09', '2023', '2023-09-02'],
    ['2', '9', '2023', '2023-09-02'],
    [null, '9', '2023', null],
    [null, null, '2023', null],
    [null, null, null, null],
    ['1', '1', 'abc', null],
  ])('getDobDateString(%s)', (day: string, month: string, year: string, expected: string) => {
    expect(getDobDateString(day, month, year)).toBe(expected)
  })
})

describe('isValidOtp', () => {
  it.each([
    [null, false],
    ['null', false],
    ['', false],
    ['      ', false],
    ['123456', true],
    ['1234567', false],
    ['QWcomJ', true],
    ['QWcomJA', false],
  ])('%s isValidOtp(%s, %s)', (input: string, expected: boolean) => {
    expect(isValidOtp(input)).toBe(expected)
  })
})

describe('isValidEmail', () => {
  it.each([
    [null, false],
    ['null', false],
    ['', false],
    ['      ', false],
    ['123456@', false],
    ['1234567@test', false],
    ['QWcomJ@test.com', true],
    ['QWcomJA@test.', false],
    ['TEST@TES.COM', true],
    ['Name.DOUBLE-BARREL@SOMETHING.GOV.UK', true],
  ])('%s isValidEmail(%s, %s)', (input: string, expected: boolean) => {
    expect(isValidEmail(input)).toBe(expected)
  })
})

describe('appendLang', () => {
  it.each([
    [null, ''],
    [undefined, ''],
    ['', ''],
    ['a', '?lang=a'],
  ])('%s appendLang(%s, %s)', (lang: string, expected: string) => {
    expect(appendLang(lang)).toBe(expected)
  })
})

describe('appendLanguage', () => {
  it.each([
    [{ lang: null }, ''],
    [{ lang: undefined }, ''],
    [{ lang: '' }, ''],
    [{ lang: 'a' }, '?lang=a'],
  ])('%s appendLanguage(%s, %s)', (queryParams: object, expected: string) => {
    expect(appendLanguage(queryParams)).toBe(expected)
  })
})

describe('isDateInPast', () => {
  it.each([
    ['01/08/1970', true],
    ['', false],
    [null, false],
    ['01/08/2999', false],
  ])('isDateInPast(%s)', (input: string, expected: boolean) => {
    expect(isDateInPast(input)).toBe(expected)
  })
})

describe('toProperCase', () => {
  it.each([
    ['name', 'Name'],
    ['name surname', 'Name Surname'],
    ['name middlename surname', 'Name Middlename Surname'],
  ])('toProperCase(%s)', (input: string, expected: string) => {
    expect(toProperCase(input)).toBe(expected)
  })
})
