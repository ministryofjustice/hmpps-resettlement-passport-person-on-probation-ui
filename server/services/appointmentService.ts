import logger from '../../logger'
import ResettlementPassportApiClient, { AppointmentData } from '../data/resettlementPassportApiClient'

export default class AppointmentService {
  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {}

  async getAllByNomsId(nomsId: string): Promise<AppointmentData> {
    logger.info(`Get all appointments by nomsId`)
    const appointmentData = await this.resettlementPassportClient.getAppointments(nomsId)
    return Promise.resolve(appointmentData)
  }
}
