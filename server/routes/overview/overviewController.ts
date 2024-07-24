import { RequestHandler } from 'express'
import { isToday, isTomorrow } from 'date-fns'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { getFutureAppointments, isDateInPast } from '../../utils/utils'
import LicenceConditionsService from '../../services/licenceConditionsService'
import FeatureFlagsService from '../../services/featureFlagsService'
import { Appointment } from '../../data/resettlementPassportData'
import { FeatureFlagKey } from '../../services/featureFlags'

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
      const flags = await this.featureFlagsService.getFeatureFlags()

      const prisoner = await this.userService.getByNomsId(verificationData.nomsId, urn, sessionId)
      let nextAppointment: Appointment = null
      let tomorrowAppointments: Appointment[] = []
      let todayAppointments: Appointment[] = []
      if (flags.isEnabled(FeatureFlagKey.VIEW_APPOINTMENTS)) {
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
        flags,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
