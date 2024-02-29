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

  it('should fetch the appointment details', async () => {
    const nomsId = 'A8731DY'
    resettlementPassportApiClient.getAppointments.mockResolvedValue(mockedAppointmentResponse)
    const result = await appointmentService.getAllByNomsId(nomsId)
    expect(result).toBe(mockedAppointmentResponse)
    expect(loggerSpy).toHaveBeenCalledWith(`Get all appointments by nomsId`)
    expect(redisClient.get).toHaveBeenCalledWith(`${nomsId}-appointment-data`)
  })
})
