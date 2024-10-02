export interface Feature {
  feature: string
  enabled: boolean
}

export const enum FeatureFlagKey {
  VIEW_APPOINTMENTS = 'viewAppointmentsEndUser',
  DOCUMENTS = 'viewDocuments',
  KNOWLEDGE_VERIFICATION = 'knowledgeVerification',
  TODO_LIST = 'todoList',
}

export class FeatureFlags {
  constructor(private readonly featureFlags: Feature[]) {
    // no-op
  }

  isEnabled(flag: FeatureFlagKey): boolean {
    const feature = this.featureFlags?.find(x => x.feature === flag)
    return feature ? feature.enabled === true : false
  }
}
