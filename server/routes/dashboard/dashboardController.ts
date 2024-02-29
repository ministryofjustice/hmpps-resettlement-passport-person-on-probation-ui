import { RequestHandler } from 'express'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { isFuture } from '../../utils/utils'

export default class DashboardController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res) => {
    const urn = req.user?.sub
    const verificationData = await requireUser(urn, this.userService)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    const personalData = await this.userService.getByNomsId(verificationData.nomsId, urn)

    const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId)
    const nextAppointment = appointments?.results.filter(x => isFuture(x.date))?.[0]

    return res.render('pages/dashboard', { user: req.user, personalData, nextAppointment })
  }
}
