import { RequestHandler } from 'express'
import { isToday, isTomorrow } from 'date-fns'
import UserService from '../../services/userService'
import requireUser from '../requireUser'
import AppointmentService from '../../services/appointmentService'
import { getFutureAppointments, isDateInPast } from '../../utils/utils'
import LicenceConditionsService from '../../services/licenceConditionsService'
import FeatureFlagsService from '../../services/featureFlagsService'
import { Appointment } from '../../data/resettlementPassportData'
import { FeatureFlagKey, FeatureFlags } from '../../services/featureFlags'
import { findPersonalisedContent } from '../../services/personalisationService'
import TodoService from '../../services/todoService'
import { UserDetailsResponse } from '../../data/personOnProbationApiClient'
import logger from '../../../logger'

export default class OverviewController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly licenceConditionsService: LicenceConditionsService,
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly todoService: TodoService,
  ) {}

  index: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query
      const urn = req.user?.sub
      const sessionId = req.sessionID
      const verificationData = await requireUser(urn, this.userService, sessionId)
      const lang = req.query.lang || 'en'
      if (typeof verificationData === 'string') {
        return res.redirect(verificationData)
      }
      const flags = await this.featureFlagsService.getFeatureFlags(res)

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
      const todoCounts = await this.getTodoCount(flags, verificationData, req.sessionID)

      const { personalLinks, otherLinks } = await findPersonalisedContent(
        prisoner.profile?.tags ?? [],
        lang?.toString(),
      )

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
        personalLinks,
        otherLinks,
        todoCounts,
      })
    } catch (err) {
      return next(err)
    }
  }

  private async getTodoCount(
    flags: FeatureFlags,
    userDetails: UserDetailsResponse,
    sessionId: string,
  ): Promise<TodoCounts> {
    if (!flags.isEnabled(FeatureFlagKey.TODO_LIST)) {
      return null
    }
    try {
      const todoItems = await this.todoService.getList(userDetails.nomsId, sessionId)
      let pending = 0

      for (const item of todoItems) {
        if (!item.completed) {
          pending++
        }
      }
      return {
        pending,
      }
    } catch (error) {
      logger.warn({ error }, 'Error counting todo list, will not show count')
      return null
    }
  }
}

type TodoCounts = {
  pending: number
}
