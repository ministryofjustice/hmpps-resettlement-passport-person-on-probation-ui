import { RequestHandler } from 'express'
import { compareAsc, compareDesc } from 'date-fns'
import AppointmentService from '../../services/appointmentService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import type { Appointment } from '../../data/resettlementPassportData'
import { isFuture } from '../../utils/utils'

const getFutureAppointments = (results: Appointment[]) => {
  return results.filter(x => isFuture(x.date)).sort((x, y) => compareAsc(x.dateTime, y.dateTime))
}

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
      const nextAppointments = getFutureAppointments(results)
      const oldAppointments = results
        .filter(x => !isFuture(x.date))
        .sort((x, y) => compareDesc(x?.dateTime, y?.dateTime))
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
    // get one appointment
    const id = typeof req.params.id === 'string' ? req.params.id : ''
    let appointment = null
    let next = null
    let previous = null

    const appointments = await this.appointmentService.getAllByNomsId(verificationData.nomsId)
    const results = appointments?.results || []
    const nextAppointments = getFutureAppointments(results)
    nextAppointments.forEach((element, index) => {
      if (element.id === id) {
        appointment = element

        // get next and previous appointments
        const previousIndex = index > 0 ? index - 1 : -1
        const nextIndex = index < nextAppointments.length ? index + 1 : -1
        next = nextIndex > -1 ? nextAppointments[nextIndex] : null
        previous = previousIndex > -1 ? nextAppointments[previousIndex] : null
      }
    })

    return res.render('pages/appointmentDetails', { user: req.user, appointment, next, previous })
  }
}
