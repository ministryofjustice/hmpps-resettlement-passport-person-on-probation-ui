import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { oneLoginUrn } from './govukOneLogin'
import { randomUUID } from 'node:crypto'

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

const mockedLicenceConditions = (expiryDate, changed = false, status = 'ACTIVE') => {
  return {
    licenceId: 101,
    status: status,
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
    changeStatus: changed,
    version: 1,
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
  profile: {
    tags: ['NO_FIXED_ABODE', 'HOME_ADAPTION_POST_RELEASE', 'MEET_CHILDREN'],
  },
}

const defaultTodoGetResponse = [
  {
    id: '81fce0af-845e-4753-871b-3809d04c888a',
    prisonerId: 1,
    title: 'Make tea',
    notes: '1 sugar',
    dueDate: null,
    completed: false,
    createdByUrn: oneLoginUrn,
    updatedByUrn: oneLoginUrn,
    creationDate: '2024-10-02T15:38:15.979258',
    updatedAt: '2024-10-02T15:38:15.979269',
  },
  {
    id: '848de9ca-773c-44b3-8152-333299ad79b3',
    prisonerId: 1,
    title: 'Write CV',
    notes: '',
    dueDate: '2026-10-30',
    completed: false,
    createdByUrn: oneLoginUrn,
    updatedByUrn: oneLoginUrn,
    creationDate: '2024-10-02T15:38:44.200459',
    updatedAt: '2024-10-02T15:38:44.200481',
  },
  {
    id: '634eacc9-86da-4c9c-963b-3d24359ca38b',
    prisonerId: 1,
    title: 'Make toast',
    notes: '',
    dueDate: null,
    completed: true,
    createdByUrn: oneLoginUrn,
    updatedByUrn: oneLoginUrn,
    creationDate: '2024-10-02T15:39:16.118321',
    updatedAt: '2024-10-02T15:39:20.106478',
  },
]

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
        url: `/rpApi/prisoner/G4161UF?includeProfileTags=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedUserDetailsResponse,
      },
    }),
  stubGetPopUserDetailsWithHomeDetention: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF?includeProfileTags=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personalDetails: {
            isHomeDetention: true,
            ...mockedUserDetailsResponse.personalDetails,
          },
        },
      },
    }),
  stubGetPopUserDetailsWithRecall: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF?includeProfileTags=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personalDetails: {
            isRecall: true,
            ...mockedUserDetailsResponse.personalDetails,
          },
        },
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
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/2199'),
      },
    }),
  stubGetLicenceConditionsChanged: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/2199', true),
      },
    }),
  stubGetLicenceConditionsInactive: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/2199', false, 'INACTIVE'),
      },
    }),
  stubGetLicenceConditionsChangedAndExpired: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: mockedLicenceConditions('12/07/1999', true),
      },
    }),
  stubGetLicenceConditionsExpired: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
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
        url: `/rpApi/prisoner/G4161UF/licence-condition?includeChangeNotify=true`,
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
  stubGetDocuments: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: '/rpApi/prisoner/G4161UF/documents?category=LICENCE_CONDITIONS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            id: 1,
            fileName: 'conditions.pdf',
          },
        ],
      },
    }),
  stubGetDocumentsEmpty: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: '/rpApi/prisoner/G4161UF/documents?category=LICENCE_CONDITIONS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [],
      },
    }),
  stubGetDocumentError: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: '/rpApi/prisoner/G4161UF/documents/latest/download?category=LICENCE_CONDITIONS',
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          status: 500,
          userMessage: 'Something went wrong',
        },
      },
    }),
  stubGetDocument: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: '/rpApi/prisoner/G4161UF/documents/latest/download?category=LICENCE_CONDITIONS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
        body: 'fake pdf content',
      },
    }),

  stubVerifyNotFound: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: '/rpApi/popUser/onelogin/verify-answers',
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              firstName: 'John',
              lastName: 'Smith',
              urn: oneLoginUrn,
              email: 'user1@example.com',
              dateOfBirth: '1982-10-24',
              nomsId: 'G4161UF',
            }),
            ignoreArrayOrder: true,
          },
        ],
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {},
      },
    }),

  stubVerifySuccess: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: '/rpApi/popUser/onelogin/verify-answers',
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              firstName: 'John',
              lastName: 'Smith',
              urn: oneLoginUrn,
              email: 'user1@example.com',
              dateOfBirth: '1982-10-24',
              nomsId: 'G4161UF',
            }),
            ignoreArrayOrder: true,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: mockedOtpResponse,
      },
    }),
  stubGetTodoTasksEmpty: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/person/G4161UF/todo`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [],
      },
    }),
  stubGetTodoTasks: ({ tasks = defaultTodoGetResponse }: TodoGetStubArgs = {}) =>
    stubFor({
      request: {
        method: 'GET',
        url: `/rpApi/person/G4161UF/todo`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: tasks,
      },
    }),
  stubPatchTodoTask: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PATCH',
        url: '/rpApi/person/G4161UF/todo/81fce0af-845e-4753-871b-3809d04c888a',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: '81fce0af-845e-4753-871b-3809d04c888a',
          prisonerId: 1,
          title: 'Make tea',
          notes: '1 sugar',
          dueDate: null,
          completed: true,
          createdByUrn: oneLoginUrn,
          updatedByUrn: oneLoginUrn,
          creationDate: '2024-10-02T15:38:15.979258',
          updatedAt: '2024-10-02T15:38:15.979269',
        },
      },
    }),
  stubPostNewTask: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: '/rpApi/person/G4161UF/todo',
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              urn: oneLoginUrn,
              title: 'Fish for trout',
              notes: 'Use bait',
              dueDate: null,
            }),
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: randomUUID(),
          prisonerId: 1,
          title: 'Fish for trout',
          notes: 'Use bait',
          dueDate: null,
          completed: false,
          createdByUrn: oneLoginUrn,
          updatedByUrn: oneLoginUrn,
          creationDate: '2024-10-02T15:38:15.979258',
          updatedAt: '2024-10-02T15:38:15.979269',
        },
      },
    }),
  stubGetOneTask: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        url: '/rpApi/person/G4161UF/todo/9951967c-f7e0-4f54-945a-aa0abe376536',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: '9951967c-f7e0-4f54-945a-aa0abe376536',
          prisonerId: 1,
          title: 'Fish for trout',
          notes: 'Use bait',
          dueDate: null,
          completed: false,
          createdByUrn: oneLoginUrn,
          updatedByUrn: oneLoginUrn,
          creationDate: '2024-10-02T15:38:15.979258',
          updatedAt: '2024-10-02T15:38:15.979269',
        },
      },
    }),
  stubPutTask: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        url: '/rpApi/person/G4161UF/todo/9951967c-f7e0-4f54-945a-aa0abe376536',
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              urn: oneLoginUrn,
              title: 'Fish for trout',
              notes: 'Use bait',
              dueDate: '2030-01-01',
            }),
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: randomUUID(),
          prisonerId: 1,
          title: 'Fish for trout',
          notes: 'Use bait',
          dueDate: '9951967c-f7e0-4f54-945a-aa0abe376536',
          completed: false,
          createdByUrn: oneLoginUrn,
          updatedByUrn: oneLoginUrn,
          creationDate: '2024-10-02T15:38:15.979258',
          updatedAt: '2024-10-02T15:38:15.979269',
        },
      },
    }),
  stubDeleteTask: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'DELETE',
        url: '/rpApi/person/G4161UF/todo/9951967c-f7e0-4f54-945a-aa0abe376536',
      },
      response: {
        status: 204,
      },
    }),
}

type TodoGetStubArgs = {
  tasks?: Record<string, unknown>[]
}
