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

const mockedAppointmentsResponse = (apptDate: Date) => {
  return {
    results: [
      {
        id: 'abcba1de-a6e7-49be-a836-37388ce8a0bc',
        title: 'This is a future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '14:05:00',
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
        id: 'rbcbf2dq-a6e7-49be-b987-37388ce8a1fg',
        title: 'This is another future appointment',
        contact: 'Unallocated Staff',
        date: apptDate,
        time: '16:00:00',
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
        id: '68ed096c-f953-42a9-a032-e3c6ffb59093',
        title: 'This is a past appointment',
        contact: 'Unallocated Staff',
        date: '2020-09-18',
        time: '14:46:00',
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
        id: '2ad42983-0185-48d4-ba09-155c8ead3944',
        title: 'This is another past appointment',
        contact: 'Dr X',
        date: '2020-01-23',
        time: '10:45:00',
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
  },
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
  stubGetAppointments: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/appointments`,
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
        url: `/rpApi/prisoner/G4161UF/appointments`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedAppointmentsResponse(getTodaysDate()),
      },
    }),
}
