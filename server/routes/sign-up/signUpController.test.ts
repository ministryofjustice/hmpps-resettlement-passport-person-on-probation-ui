import { validateSubmission, VerifyFormBody } from './signUpController'

describe('sign up validation', () => {
  const validInput: VerifyFormBody = {
    firstName: 'first',
    lastName: 'last',
    'dob-day': '1',
    'dob-month': '1',
    'dob-year': '1970',
    prisonerNumber: 'A123B',
  }

  it('should give no errors with valid input', () => {
    const validationResult = validateSubmission(request(validInput))
    expect(validationResult.errors).toEqual([])
    expect(validationResult.firstName).toBeUndefined()
    expect(validationResult.lastName).toBeUndefined()
    expect(validationResult.prisonerNumber).toBeUndefined()
    expect(validationResult.dateOfBirth).toBeUndefined()
  })

  it('Should give error if firstname is missing', () => {
    const missingFirstName = { ...validInput, firstName: '' }
    const validationResult = validateSubmission(request(missingFirstName))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-first-name',
        href: '#first-name',
      },
    ])
    expect(validationResult.firstName).toEqual('verification-error-first-name')
  })

  it('Should give error if lastname is missing', () => {
    const missingLastName = { ...validInput, lastName: '' }
    const validationResult = validateSubmission(request(missingLastName))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-last-name',
        href: '#last-name',
      },
    ])
    expect(validationResult.lastName).toEqual('verification-error-last-name')
  })

  it('Should give error if birth day is missing', () => {
    const missingBirthDay = { ...validInput, 'dob-day': '' }
    const validationResult = validateSubmission(request(missingBirthDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if birth month is missing', () => {
    const missingBirthMonth = { ...validInput, 'dob-month': '' }
    const validationResult = validateSubmission(request(missingBirthMonth))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if birth year is missing', () => {
    const missingBirthYear = { ...validInput, 'dob-year': '' }
    const validationResult = validateSubmission(request(missingBirthYear))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if birth day is invalid', () => {
    const invalidBirthDay = { ...validInput, 'dob-day': 'bat' }
    const validationResult = validateSubmission(request(invalidBirthDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if birth month is invalid', () => {
    const invalidBirthMonth = { ...validInput, 'dob-month': 'bat' }
    const validationResult = validateSubmission(request(invalidBirthMonth))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if birth year is invalid', () => {
    const invalidBirthYear = { ...validInput, 'dob-year': 'bat' }
    const validationResult = validateSubmission(request(invalidBirthYear))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-1',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-1')
  })

  it('Should give error if given date of birth is in the future', () => {
    const futureDateOfBirth = { ...validInput, 'dob-year': (new Date().getFullYear() + 1).toString() }
    const validationResult = validateSubmission(request(futureDateOfBirth))
    expect(validationResult.errors).toEqual([
      {
        text: 'verification-error-date-2',
        href: '#dob',
      },
    ])
    expect(validationResult.dateOfBirth).toEqual('verification-error-date-2')
  })
})

function request(body: VerifyFormBody): Express.Request {
  const r: Partial<Express.Request> = {
    body,
    t: template => {
      return template
    },
  }
  return r as Express.Request
}
