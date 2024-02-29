import { RequestHandler } from 'express'
import AppointmentService from '../../services/appointmentService'
import UserService from '../../services/userService'
import { isFuture } from '../../utils/utils'

const MAX_APPOINTMENTS_DISPLAY = 5

export default class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res) => {
    const urn = req.user?.sub
    if (!urn) {
      return res.redirect('/')
    }
    const verificationData = await this.userService.isVerified(urn)
    if (!verificationData?.verified === true) {
      return res.redirect('/otp')
    }
    const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId)

    const nextAppointments = appointments?.results.filter(x => isFuture(x.date)).slice(0, MAX_APPOINTMENTS_DISPLAY)
    const oldAppointments = appointments?.results.filter(x => !isFuture(x.date))
    return res.render('pages/appointments', { user: req.user, appointments: nextAppointments, oldAppointments })
  }
}
