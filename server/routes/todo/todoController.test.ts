import { TodoFormBody, validateSubmission } from './todoController'
import { startOfToday, startOfYesterday } from 'date-fns'

const today = startOfToday()

describe('todo validation', () => {
  const yesterday = startOfYesterday()
  const validInput: TodoFormBody = {
    title: 'Title',
    notes: 'A note',
    'date-day': `${today.getDate()}`,
    'date-month': `${today.getMonth() + 1}`,
    'date-year': `${today.getFullYear()}`,
  }

  it('should give no errors with valid minimal input', () => {
    const validationResult = validateSubmission(request({ title: 'A title' }))
    expect(validationResult.errors).toEqual([])
    expect(validationResult.title).toBeUndefined()
    expect(validationResult.dueDate).toBeUndefined()
  })

  it('should give no errors with valid full input', () => {
    const validationResult = validateSubmission(request(validInput))
    expect(validationResult.errors).toEqual([])
    expect(validationResult.title).toBeUndefined()
    expect(validationResult.dueDate).toBeUndefined()
  })

  it('Should give error if title is missing', () => {
    const missingFirstName = { ...validInput, title: '' }
    const validationResult = validateSubmission(request(missingFirstName))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-title',
        href: '#title',
      },
    ])
    expect(validationResult.title).toEqual('todo-error-title')
  })

  it.each(['41', 'fish'])('Should give error if due date day is invalid (%s)', input => {
    const missingDay = { ...validInput, 'date-day': input }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-date',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-date')
  })

  it.each(['13', 'fish'])('Should give error if due date month is invalid ("%s")', input => {
    const missingMonth = { ...validInput, 'date-month': input }
    const validationResult = validateSubmission(request(missingMonth))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-date',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-date')
  })
  it('Should give error if due date is in the past', () => {
    //const yesterday = startOfYesterday()
    const missingYear = {
      ...validInput,
      'date-day': `${yesterday.getDate()}`,
      'date-month': `${yesterday.getMonth() + 1}`,
      'date-year': `${yesterday.getFullYear()}`,
    }

    const validationResult = validateSubmission(request(missingYear))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-past-date',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-past-date')
  })
  it('Should give error if due date is invalid', () => {
    const missingDay = {
      ...validInput,
      'date-day': '32',
      'date-month': '13',
      'date-year': 'fish',
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-date',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-date')
  })

  it('Should give error if due date day is missing', () => {
    const missingDay = {
      ...validInput,
      'date-day': '',
      'date-month': `${yesterday.getMonth() + 1}`,
      'date-year': `${yesterday.getFullYear()}`,
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-day',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-day')
  })

  it('Should give error if due date month is missing', () => {
    const missingDay = {
      ...validInput,
      'date-day': '10',
      'date-month': '',
      'date-year': `${yesterday.getFullYear()}`,
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-month',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-month')
  })
  it('Should give error if due date year is missing', () => {
    const missingDay = {
      ...validInput,
      'date-day': '10',
      'date-month': `${yesterday.getMonth() + 1}`,
      'date-year': '',
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-year',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-year')
  })
  it('Should give error if due date month and year is missing', () => {
    const missingDay = {
      ...validInput,
      'date-day': '10',
      'date-month': '',
      'date-year': '',
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-month-year',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-month-year')
  })
  it('Should give error if due date year is invalid', () => {
    const missingDay = {
      ...validInput,
      'date-day': '10',
      'date-month': `${yesterday.getMonth() + 1}`,
      'date-year': '97',
    }
    const validationResult = validateSubmission(request(missingDay))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-year',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-year')
  })
})

function request(body: TodoFormBody): Express.Request {
  const r: Partial<Express.Request> = {
    body,
    t: template => {
      return template
    },
  }
  return r as Express.Request
}
