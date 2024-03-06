import crypto from 'crypto'
import logger from '../../logger'
import config from '../config'
import { RedisClient, createRedisClient, ensureConnected } from '../data/redisClient'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { AppointmentData, Appointment } from '../data/resettlementPassportData'
import { addHours, addMinutes, addSeconds } from 'date-fns'

const CACHE_MINUTES = 1

export default class AppointmentService {
  redisClient: RedisClient

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.redisClient = createRedisClient()
  }

  async getOneByIdAndNomsId(id: string, nomsId: string): Promise<Appointment> {
    const appointments = await this.getAllByNomsId(nomsId)
    const appointment = appointments.results.find(x => x.id === id)
    return Promise.resolve(appointment)
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

    // add a unique id
    const dataToCache = {
      results: fetchedAppointments?.results?.map(x => {
        if (config.redis.enabled) {
          // eslint-disable-next-line
          x.id = crypto.randomUUID()
        }
        if (x.contactEmail === 'null') {
          // eslint-disable-next-line
          x.contactEmail = null
        }
        // eslint-disable-next-line
        x.dateTime = new Date(x.date)
        if (x.time) {
          const [hours, minutes] = x.time.split(':').map(Number)
          addHours(x.dateTime, hours)
          addMinutes(x.dateTime, minutes)
        }
        return x
      }),
    }

    if (fetchedAppointments && config.redis.enabled) {
      // store to cache only briefly
      await this.redisClient.set(key, JSON.stringify(dataToCache), {
        EX: CACHE_MINUTES,
      })
    }
    return Promise.resolve(dataToCache)
  }
}
