import { SanitisedError } from '../sanitisedError'

export const checkError = (error: SanitisedError) => {
  if (error.status !== 404) throw new Error(error.stack)
}
