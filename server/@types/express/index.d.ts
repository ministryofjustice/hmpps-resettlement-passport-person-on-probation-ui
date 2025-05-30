export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    feedback: {
      score: string
      details?: string
      name?: string
      email?: string
    }
  }
}

export declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
      email_verified?: boolean
      phone_number?: string
      phone_number_verified?: boolean
      token?: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      t: (s: string) => string
      body: unknown
    }

    interface Locals {
      user: Express.User
    }

    interface ValidationError {
      href: string
      text: string
    }
  }
}
