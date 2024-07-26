import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import { DocumentMeta } from '../data/resettlementPassportData'

export default class DocumentService {
  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    // no-op
  }

  async getLicenceConditionsDocuments(nomsId: string, sessionId: string): Promise<DocumentMeta[]> {
    return this.resettlementPassportClient.getLicenceConditionsDocuments(nomsId, sessionId)
  }

  async getLicenceConditionsDocument(
    nomsId: string,
    docId: number,
    sessionId: string,
  ): Promise<ReadableStream<Uint8Array>> {
    return this.resettlementPassportClient.getLicenceConditionsDocument(nomsId, docId, sessionId)
  }
}
