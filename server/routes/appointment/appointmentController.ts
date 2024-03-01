import { RequestHandler } from 'express'
import AppointmentService from '../../services/appointmentService'
import UserService from '../../services/userService'
import { isFuture, sortByDate } from '../../utils/utils'
import requireUser from '../requireUser'

const MAX_APPOINTMENTS_DISPLAY = 5

export default class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res) => {
    const verificationData = await requireUser(req.user?.sub, this.userService)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }

    const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId)
    const nextAppointments = appointments?.results
      .filter(x => isFuture(x.date))
      .slice(0, MAX_APPOINTMENTS_DISPLAY)
      .sort((x, y) => sortByDate(x.date, y.date, 'asc'))
    const oldAppointments = appointments?.results
      .filter(x => !isFuture(x.date))
      .sort((x, y) => sortByDate(x.date, y.date, 'desc'))
    return res.render('pages/appointments', { user: req.user, appointments: nextAppointments, oldAppointments })
  }
}
