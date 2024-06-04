import { RequestHandler } from 'express'
import { isTomorrow, isToday } from 'date-fns'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { getFutureAppointments, isDateInPast } from '../../utils/utils'
import LicenceConditionsService from '../../services/licenceConditionsService'

export default class OverviewController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly licenceConditionsService: LicenceConditionsService,
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
      const personalData = await this.userService.getByNomsId(verificationData.nomsId, urn, sessionId)

      const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId, sessionId)
      const nextAppointment = getFutureAppointments(appointments.results)?.[0]

      const tomorrowAppointments = appointments?.results?.filter(x => isTomorrow(new Date(x.date)))
      const todayAppointments = appointments?.results?.filter(x => isToday(new Date(x.date)))

      const licence = await this.licenceConditionsService.getLicenceConditionsByNomsId(
        verificationData.nomsId,
        sessionId,
      )

      return res.render('pages/overview', {
        user: req.user,
        personalData,
        nextAppointment,
        tomorrowAppointments,
        todayAppointments,
        licenceExpiryDate: licence?.expiryDate,
        isLicenceExpired: isDateInPast(licence?.expiryDate),
        isLicenceChanged: licence?.changeStatus,
        queryParams,
      })
    } catch (err) {
      return next(err)
    }
  }
}
