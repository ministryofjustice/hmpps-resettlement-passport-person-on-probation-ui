import { RequestHandler } from 'express'
import { isTomorrow, isToday, differenceInMinutes } from 'date-fns'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { formatDate, formatDateTime, getFutureAppointments } from '../../utils/utils'
import LicenceConditionsService from '../../services/licenceConditionsService'
import { tokenStoreFactory } from '../../data/tokenStore/tokenStore'

export default class DashboardController {
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
      const tokenStore = tokenStoreFactory()
      const t = await tokenStore.getToken(`session-expiry-date-${urn}`)
      const expiryDate = new Date(t)
      const diff = differenceInMinutes(expiryDate, new Date())
      console.log("urn session expires in  ", diff)

      return res.render('pages/dashboard', {
        user: req.user,
        personalData,
        nextAppointment,
        tomorrowAppointments,
        todayAppointments,
        licenceExpiryDate: licence?.expiryDate,
        queryParams,
        expiryMinutes: diff
      })
    } catch (err) {
      return next(err)
    }
  }
}
