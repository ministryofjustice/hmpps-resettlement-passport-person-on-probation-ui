import logger from '../../logger'
import config from '../config'
import { RedisClient, createRedisClient, ensureConnected } from '../data/redisClient'
import ResettlementPassportApiClient, { AppointmentData } from '../data/resettlementPassportApiClient'

const ONE_MINUTE = 60

export default class AppointmentService {
  redisClient: RedisClient

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.redisClient = createRedisClient()
  }

  async getAllByNomsId(nomsId: string): Promise<AppointmentData> {
    logger.info(`Get all appointments by nomsId`)
    const key = `${nomsId}-appointment-data`
    if (config.redis.enabled) {
      // read from cache
      await ensureConnected(this.redisClient)
      const appointmentsString = await this.redisClient.get(key)
      if (appointmentsString) {
        logger.info('Appointments found in cache')
        const appointments = JSON.parse(appointmentsString) as AppointmentData
        return Promise.resolve(appointments)
      }
    }

    logger.info('Fetching appointments from Api')
    const fetchedAppointments = await this.resettlementPassportClient.getAppointments(nomsId)
    if (fetchedAppointments && config.redis.enabled) {
      // store to cache only briefly
      await this.redisClient.set(key, JSON.stringify(fetchedAppointments), {
        EX: ONE_MINUTE,
      })
    }
    return Promise.resolve(fetchedAppointments)
  }
}
