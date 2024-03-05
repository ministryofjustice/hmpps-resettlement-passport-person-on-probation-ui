import { RequestHandler } from 'express'
import AppointmentService from '../../services/appointmentService'
import UserService from '../../services/userService'
import { isFuture, sortByDate } from '../../utils/utils'
import requireUser from '../requireUser'

export default class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const verificationData = await requireUser(req.user?.sub, this.userService)
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }

      const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId)
      const results = appointments?.results || []
      const nextAppointments = results.filter(x => isFuture(x.date)).sort((x, y) => sortByDate(x.date, y.date, 'asc'))
      const oldAppointments = results
        .filter(x => !isFuture(x?.date))
        .sort((x, y) => sortByDate(x?.date, y?.date, 'desc'))
      return res.render('pages/appointments', { user: req.user, appointments: nextAppointments, oldAppointments })
    } catch (err) {
      return next(err)
    }
  }

  show: RequestHandler = async (req, res) => {
    const verificationData = await requireUser(req.user?.sub, this.userService)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }
    const id = typeof req.params.id === 'string' ? req.params.id : ''
    const appointment = await this.appointmentService.getOneByIdAndNomsId(id, verificationData.nomsId)
    return res.render('pages/appointmentDetails', { user: req.user, appointment })
  }
}
