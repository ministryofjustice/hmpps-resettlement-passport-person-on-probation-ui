export interface AppointmentLocation {
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  description?: string
}

export interface Appointment {
  id?: string
  previous?: string
  next?: string
  title?: string
  contact?: string
  contactEmail?: string
  duration?: number
  date?: string
  dateTime?: Date
  time?: string
  location?: AppointmentLocation
  note?: string
}

export interface AppointmentData {
  results: Appointment[]
}

export interface OtpDetailsResponse {
  id: number
  crn?: string
  cprId?: string
  email?: string
  verified?: boolean
  creationDate?: string
  modifiedDate?: string
  nomsId?: string
  oneLoginUrn?: string
}

export interface OtpRequest {
  urn: string
  otp: string
  email: string
}

export interface PersonalDetails {
  personalDetails: {
    prisonerNumber?: string
    prisonId?: string
    firstName: string
    middleNames?: string
    lastName: string
    releaseDate?: string
    releaseType?: string
    dateOfBirth?: string
    age?: number
    location?: string
    facialImageId?: string
    mobile?: string
    telephone?: string
    email?: string
    isHomeDetention?: boolean
    isRecall?: boolean
  }
  profile?: {
    tags?: string[]
  }
}

export interface ConditionInfo {
  id: number
  image: boolean
  text?: string
  sequence: number
}

export interface LicenceConditionData {
  licenceId?: number
  status?: string
  startDate?: string
  expiryDate?: string
  standardLicenceConditions?: ConditionInfo[]
  otherLicenseConditions?: ConditionInfo[]
  changeStatus?: boolean
  version?: number
}

export type DocumentMeta = {
  id: number
  originalDocumentFileName?: string
}

export const enum UserDocumentType {
  LICENCE_CONDITIONS = 'LICENCE_CONDITIONS',
}
