import { RequestHandler } from 'express'
import { isTomorrow, isToday } from 'date-fns'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { getFutureAppointments, isDateInPast } from '../../utils/utils'
import LicenceConditionsService from '../../services/licenceConditionsService'
import FeatureFlagsService, { FeatureFlags } from '../../services/featureFlagsService'
import { Appointment } from '../../data/resettlementPassportData'

export default class OverviewController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly licenceConditionsService: LicenceConditionsService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const urn = req.user?.sub
      const sessionId = req.sessionID
      const verificationData = await requireUser(urn, this.userService, sessionId)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
      const viewAppointmentFlag = await this.featureFlagsService.getFeatureFlag(FeatureFlags.VIEW_APPOINTMENTS)

      const prisoner = await this.userService.getByNomsId(verificationData.nomsId, urn, sessionId)
      let nextAppointment: Appointment = null
      let tomorrowAppointments: Appointment[] = []
      let todayAppointments: Appointment[] = []
      if (viewAppointmentFlag) {
        const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId, sessionId)
        nextAppointment = getFutureAppointments(appointments.results)?.[0]
        tomorrowAppointments = appointments?.results?.filter(x => isTomorrow(new Date(x.date)))
        todayAppointments = appointments?.results?.filter(x => isToday(new Date(x.date)))
      }
      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )
      const isRecall = prisoner?.personalDetails?.isRecall

      return res.render('pages/overview', {
        user: req.user,
        prisoner,
        nextAppointment,
        tomorrowAppointments,
        todayAppointments,
        licenceExpiryDate: licence?.expiryDate,
        isLicenceExpired: isDateInPast(licence?.expiryDate),
        isLicenceChanged: !isRecall && licence?.changeStatus,
        viewAppointmentFlag,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
