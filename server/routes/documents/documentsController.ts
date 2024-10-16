import { RequestHandler } from 'express'
import { DocumentMeta, UserDocumentType } from '../../data/resettlementPassportData'
import { FeatureFlagKey } from '../../services/featureFlags'
import FeatureFlagsService from '../../services/featureFlagsService'
import DocumentService from '../../services/documentService'
import UserService from '../../services/userService'
import requireUser from '../requireUser'

const docTypes: Record<string, UserDocumentType> = {
  'licence-conditions.pdf': UserDocumentType.LICENCE_CONDITIONS,
}

export default class DocumentsController {
  constructor(
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly documentService: DocumentService,
    private readonly userService: UserService,
  ) {}

  index: RequestHandler = async (req, res, _) => {
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

  viewDocument: RequestHandler = async (req, res, _): Promise<void> => {
    const flags = await this.featureFlagsService.getFeatureFlags()
    if (!flags.isEnabled(FeatureFlagKey.DOCUMENTS)) {
      return res.redirect('overview')
    }

    const sessionId = req.sessionID
    const verificationData = await requireUser(req.user?.sub, this.userService, sessionId)
    if (typeof verificationData === 'string') {
      return res.redirect(verificationData)
    }

    const requestedDocType = docTypes[req.params.docType]
    if (!requestedDocType) {
      return res.render('pages/notfound')
    }

    const docResponse = await this.documentService.getDocument(verificationData.nomsId, requestedDocType, sessionId)
    res.setHeader('Content-Type', 'application/pdf')

    for await (const chunk of docResponse) {
      res.write(chunk)
    }
    res.end()
  }
}
