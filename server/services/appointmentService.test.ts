import AppointmentService from './appointmentService'
import logger from '../../logger'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import { createRedisClient } from '../data/redisClient'
import config from '../config'
import mockRedisClient from '../testutils/mockRedisClient'

jest.mock('../../logger')
jest.mock('../data/resettlementPassportApiClient')
jest.mock('../data/redisClient')

const redisClient = mockRedisClient()

const mockedAppointmentResponse = {
  results: [
    {
      title: 'Appointment with CRS Staff (NS)',
      contact: 'Unallocated Staff',
      date: '2023-09-14',
      time: '14:05:00',
      location: {
        buildingName: '',
        buildingNumber: '',
        streetName: '',
        district: '',
        town: '',
        county: '',
        postcode: '',
        description: 'CRS Provider Location',
      },
      note: '',
    },
  ],
}

describe('AppointmentService', () => {
  let resettlementPassportApiClient: jest.Mocked<ResettlementPassportApiClient>
  let appointmentService: AppointmentService
  const loggerSpy = jest.spyOn(logger, 'info')

  beforeEach(() => {
    config.redis.enabled = true
    jest.mocked(createRedisClient).mockReturnValue(redisClient)
    resettlementPassportApiClient = new ResettlementPassportApiClient() as jest.Mocked<ResettlementPassportApiClient>
    appointmentService = new AppointmentService(resettlementPassportApiClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    config.redis.enabled = false
  })

  it('should fetch the appointment details with a new identifier', async () => {
    const nomsId = 'A1234BC'
    resettlementPassportApiClient.getAppointments.mockResolvedValue(mockedAppointmentResponse)
    const appointments = await appointmentService.getAllByNomsId(nomsId, 'session')
    expect(appointments.results.length).toBe(1)
    expect(appointments.results[0].id).toBeTruthy()
    expect(loggerSpy).toHaveBeenCalledWith(`Get all appointments by nomsId`)
    expect(redisClient.get).toHaveBeenCalledWith(`${nomsId}-appointment-data`)
  })
})
