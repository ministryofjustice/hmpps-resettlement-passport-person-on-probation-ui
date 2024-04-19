/* eslint-disable no-param-reassign */
import crypto from 'crypto'
import { addHours, addMinutes } from 'date-fns'
import logger from '../../logger'
import config from '../config'
import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import type { AppointmentData, Appointment } from '../data/resettlementPassportData'
import { TokenStore, tokenStoreFactory } from '../data/tokenStore/tokenStore'

export default class AppointmentService {
  tokenStore: TokenStore

  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    this.tokenStore = tokenStoreFactory()
  }

  /**
   * Appointments don't have an identifier, we are creating one so that we can navigate to appointment details.
   * We are hashing the fields to create a unique index effectively.
   * @returns
   */
  private createAppointmentId(x: Appointment): string {
    return crypto
      .createHash('sha256')
      .update(x.title + x.date + x.time + x.contact)
      .digest('hex')
  }

  private ensureDateTime(x: Appointment): Appointment {
    x.dateTime = new Date(x.date)
    if (x.time) {
      const [hours, minutes] = x.time.split(':').map(Number)
      x.dateTime = addHours(x.dateTime, hours)
      x.dateTime = addMinutes(x.dateTime, minutes)
    }
    return x
  }

  async getOneByIdAndNomsId(id: string, nomsId: string): Promise<Appointment> {
    const appointments = await this.getAllByNomsId(nomsId)
    const appointment = appointments.results.find(x => x.id === id)
    return Promise.resolve(appointment)
  }

  async getAllByNomsId(nomsId: string): Promise<AppointmentData> {
    logger.info(`Get all appointments by nomsId`)
    const key = `${nomsId}-appointment-data`

    // read from cache
    const appointmentsString = await this.tokenStore.getToken(key)
    if (appointmentsString) {
      logger.info('Appointments found in cache')
      const appointments = JSON.parse(appointmentsString) as AppointmentData
      appointments.results.map(x => this.ensureDateTime(x))
      return Promise.resolve(appointments)
    }

    logger.info('Fetching appointments from Api')
    const fetchedAppointments = await this.resettlementPassportClient.getAppointments(nomsId)

    // add a unique id
    const dataToCache = {
      results: fetchedAppointments?.results?.map(x => {
        x.id = this.createAppointmentId(x)
        x = this.ensureDateTime(x)
        if (x.contactEmail === 'null') {
          x.contactEmail = null
        }
        return x
      }),
    }

    if (fetchedAppointments) {
      // store to cache only briefly
      await this.tokenStore.setToken(key, JSON.stringify(dataToCache), config.session.appointmentsCacheMinutes)
    }
    return Promise.resolve(dataToCache)
  }
}
