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
  it('Should give error if due date only day given', () => {
    const missingMonthYear = {
      ...validInput,
      'date-day': `${yesterday.getDate()}`,
      'date-month': '',
      'date-year': '',
    }
    const validationResult = validateSubmission(request(missingMonthYear))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-month-year',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-month-year')
  })
  it('Should give error if due date, only month given', () => {
    const missingDayYear = {
      ...validInput,
      'date-day': '',
      'date-month': '5',
      'date-year': '',
    }
    const validationResult = validateSubmission(request(missingDayYear))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-day-year',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-day-year')
  })
  it('Should give error if due date, only year given', () => {
    const missingDayMonth = {
      ...validInput,
      'date-day': '',
      'date-month': '',
      'date-year': '2026',
    }
    const validationResult = validateSubmission(request(missingDayMonth))
    expect(validationResult.errors).toEqual([
      {
        text: 'todo-error-invalid-day-month',
        href: '#due-date',
      },
    ])
    expect(validationResult.dueDate).toEqual('todo-error-invalid-day-month')
  })
  it('Should give error if due date, year invalid given', () => {
    const missingDayYear = {
      ...validInput,
      'date-day': '1',
      'date-month': '5',
      'date-year': '20245',
    }
    const validationResult = validateSubmission(request(missingDayYear))
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
