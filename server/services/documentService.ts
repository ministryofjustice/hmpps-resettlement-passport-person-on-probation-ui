import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import { DocumentMeta } from '../data/resettlementPassportData'

export default class DocumentService {
  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    // no-op
  }

  async getLicenceConditionsDocuments(nomsId: string, sessionId: string): Promise<DocumentMeta[]> {
    return this.resettlementPassportClient.getLicenceConditionsDocuments(nomsId, sessionId)
  }

  async pipeLicenceConditionsDocument(nomsId: string, docId: number, sessionId: string, pipeTo: NodeJS.WritableStream) {
    await this.resettlementPassportClient.pipeLicenceConditionsDocument(nomsId, docId, sessionId, pipeTo)
  }
}
