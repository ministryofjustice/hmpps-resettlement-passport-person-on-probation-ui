import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const getTomorrowsDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(new Date().getDate() + 1)
  return tomorrow
}
const getTodaysDate = () => {
  return new Date()
}
const getYesterdaysDate = () => {
  const yesterday = new Date()
  yesterday.setDate(new Date().getDate() - 1)
  return yesterday
}

const mockedLicenceConditions = expiryDate => {
  return {
    licenceId: 101,
    status: 'ACTIVE',
    startDate: '20/08/2023',
    expiryDate,
    standardLicenceConditions: [
      {
        id: 1001,
        image: false,
        text: 'Be of good behaviour and not behave in a way which undermines the purpose of the licence period.',
        sequence: 0,
      },
    ],
    otherLicenseConditions: [
      {
        id: 1008,
        image: true,
        text: 'Not to enter the area of Leeds City Centre, as defined by the attached map, without the prior approval of your supervising officer.',
        sequence: 7,
      },
    ],
  }
}

const mockedAppointmentsErrorResponse = () => {
  return {
    results: [
      {
        title: null,
        contact: null,
        date: null,
        time: null,
        dateTime: null,
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: null,
        },
        note: null,
      },
    ],
  }
}

const mockedAppointmentsResponse = (apptDate: Date) => {
  return {
    results: [
      {
        title: 'This is another future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '16:00:00',
        dateTime: new Date(apptDate),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is a future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '14:05:00',
        dateTime: new Date(apptDate),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is a past appointment',
        contact: 'Unallocated Staff',
        date: '2020-09-18',
        time: '14:46:00',
        dateTime: new Date('2020-09-18'),
        location: {
          buildingName: null,
          buildingNumber: null,
          streetName: null,
          district: null,
          town: null,
          county: null,
          postcode: null,
          description: 'CRS Provider Location',
        },
        note: null,
      },
      {
        title: 'This is another past appointment',
        contact: 'Dr X',
        date: '2020-01-23',
        time: '10:45:00',
        dateTime: new Date('2020-01-23'),
        location: {
          buildingName: 'Dave Smith Wing',
          buildingNumber: null,
          streetName: 'Big Street',
          district: null,
          town: 'Sheffield',
          county: 'South Yorks',
          postcode: 'S2 44e',
          description: null,
        },
        note: '',
      },
    ],
  }
}

const mockedOtpResponse = {
  id: 9,
  crn: 'U416100',
  cprId: 'NA',
  email: 'test@example.com',
  verified: true,
  creationDate: '2024-02-26T11:58:17.812884699',
  modifiedDate: '2024-02-26T11:58:17.812884699',
  nomsId: 'G4161UF',
  oneLoginUrn: 'urn:fdc:gov.asdasdasd',
}

const mockedUserDetailsResponse = {
  personalDetails: {
    prisonerNumber: '123123',
    prisonId: '33',
    firstName: 'John',
    middleNames: 'Paul',
    lastName: 'Smith',
    age: 44,
    mobile: '0798654321',
    telephone: '0198765432',
    email: 'john@test.com',
  },
}

const getBinaryResponse = (base64Image: string) => {
  return Buffer.from(base64Image, 'base64')
}

export default {
  stubGetPopUserOtp: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: `/rpApi/popUser/onelogin/verify`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedOtpResponse,
      },
    }),
  stubGetPopUserDetails: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedUserDetailsResponse,
      },
    }),
  stubGetAppointmentsMissing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments?futureOnly=false&includePreRelease=false`,
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    }),
  stubGetAppointmentsPast: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments?futureOnly=false&includePreRelease=false`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedAppointmentsResponse(getYesterdaysDate()),
      },
    }),
  stubGetAppointmentsError: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments?futureOnly=false&includePreRelease=false`,
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedAppointmentsErrorResponse(),
      },
    }),
  stubGetAppointments: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments?futureOnly=false&includePreRelease=false`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedAppointmentsResponse(getTomorrowsDate()),
      },
    }),
  stubGetAppointmentsToday: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments?futureOnly=false&includePreRelease=false`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedAppointmentsResponse(getTodaysDate()),
      },
    }),
  stubGetLicenceConditions: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/2199'),
      },
    }),
  stubGetLicenceConditionsExpired: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/1999'),
      },
    }),
  stubGetLicenceConditionsMissing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition`,
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    }),
  stubGetLicenceConditionImage: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition/id/101/condition/1008/image`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: getBinaryResponse('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='), // this is the base64 for a white image
      },
    }),
}
