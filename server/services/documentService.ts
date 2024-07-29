import ResettlementPassportApiClient from '../data/resettlementPassportApiClient'
import { DocumentMeta, UserDocumentType } from '../data/resettlementPassportData'

export default class DocumentService {
  constructor(private readonly resettlementPassportClient: ResettlementPassportApiClient) {
    // no-op
  }

  async getLicenceConditionsDocuments(nomsId: string, sessionId: string): Promise<DocumentMeta[]> {
    return this.resettlementPassportClient.getLicenceConditionsDocuments(nomsId, sessionId)
  }

  async getDocument(nomsId: string, docId: UserDocumentType, sessionId: string): Promise<ReadableStream<Uint8Array>> {
    return this.resettlementPassportClient.getDocument(nomsId, docId, sessionId)
  }
}
