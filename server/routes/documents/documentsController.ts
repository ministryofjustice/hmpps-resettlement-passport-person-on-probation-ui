import { RequestHandler } from 'express'
import type { DocumentMeta } from '../../data/resettlementPassportData'
import { FeatureFlagKey } from '../../services/featureFlags'
import FeatureFlagsService from '../../services/featureFlagsService'
import DocumentService from '../../services/documentService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'

export default class DocumentsController {
  constructor(
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly documentService: DocumentService,
    private readonly userService: UserService,
  ) {
    // no-op
  }

  index: RequestHandler = async (req, res, next) => {
    const sessionId = req.sessionID
    const flags = await this.featureFlagsService.getFeatureFlags()
    if (!flags.isEnabled(FeatureFlagKey.DOCUMENTS)) {
      return res.redirect('overview')
    }

    const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }

    const documents: DocumentMeta[] = await this.documentService.getLicenceConditionsDocuments(
      verificationData.nomsId,
      sessionId,
    )
    return res.render('pages/documents', {
      user: req.user,
      flags,
      documents,
      queryParams: req.query,
    })
  }

  viewDocument: RequestHandler = async (req, res, next) => {
    const flags = await this.featureFlagsService.getFeatureFlags()
    if (!flags.isEnabled(FeatureFlagKey.DOCUMENTS)) {
      return res.redirect('overview')
    }

    const sessionId = req.sessionID
    const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }

    const docId = typeof req.params.docId === 'string' ? parseInt(req.params.docId, 10) : undefined
    if (!docId) {
      return res.render('pages/notfound')
    }

    try {
      const docResponse = await this.documentService.getLicenceConditionsDocument(
        verificationData.nomsId,
        docId,
        sessionId,
      )
      res.setHeader('Content-Type', 'application/pdf')

      for await (const chunk of docResponse) {
        res.write(chunk)
      }
      return res.end()
    } catch (error) {
      return next(error)
    }
  }
}
