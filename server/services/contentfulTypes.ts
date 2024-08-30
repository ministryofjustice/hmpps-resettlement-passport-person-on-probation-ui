import { Entry, EntryFieldTypes } from 'contentful'

export type BreaklineSkeleton = {
  contentTypeId: 'breakline'
  fields: {
    lines?: EntryFieldTypes.Integer
    name?: EntryFieldTypes.Symbol
  }
}

export type PersonalisationTag =
  | 'alcohol-issue'
  | 'arrange-storage-for-personal'
  | 'bursaries-and-grants'
  | 'care-health-support'
  | 'community-org-support'
  | 'contact-education-training'
  | 'contact-employer'
  | 'drug-issue'
  | 'find-a-job'
  | 'find-education-training'
  | 'gambling-issue'
  | 'help-to-contact-bank'
  | 'home-adaption-post-release'
  | 'manage-debt-arrears'
  | 'manage-emotions'
  | 'meet-children'
  | 'no-fixed-abode'
  | 'registering-gp'

export type BreaklineEntry = Entry<BreaklineSkeleton>

export type FullPageSkeleton = {
  contentTypeId: 'componentDuplex'
  fields: {
    title?: EntryFieldTypes.Symbol
    slug?: EntryFieldTypes.Symbol
    bodyText?: EntryFieldTypes.RichText
    relatedContent?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<RelatedLinkSkeleton>>
    helpAndAdvice?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<RelatedLinkSkeleton>>
    personalisationTags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }
}

export type FullPageEntry = Entry<FullPageSkeleton>

export type ButtonSkeleton = {
  contentTypeId: 'componentHeroBanner'
  fields: {
    text: EntryFieldTypes.Symbol
    icon?: EntryFieldTypes.Symbol
    link?: EntryFieldTypes.Symbol
    qatag?: EntryFieldTypes.Symbol
  }
}

export type ButtonEntry = Entry<ButtonSkeleton>

export type RelatedLinkSkeleton = {
  contentTypeId: 'componentQuote'
  fields: {
    text?: EntryFieldTypes.Symbol
    link: EntryFieldTypes.Text
  }
}

export type RelatedLinkEntry = Entry<RelatedLinkSkeleton>

export type NavigationSkeleton = {
  contentTypeId: 'page'
  fields: {
    internalName: EntryFieldTypes.Symbol
    section?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FullPageSkeleton>>
  }
}

export type NavigationEntry = Entry<NavigationSkeleton>

export type WarningSkeleton = {
  contentTypeId: 'warning'
  fields: {
    text?: EntryFieldTypes.Symbol
  }
}

export type WarningEntry = Entry<WarningSkeleton>
