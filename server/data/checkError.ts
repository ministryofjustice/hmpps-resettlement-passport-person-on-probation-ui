/* eslint-disable import/prefer-default-export */
import { SanitisedError } from '../sanitisedError'

export const checkError = (error: SanitisedError) => {
  // some response statuses are 500 but their content states 404 so we need to treat them as 404 until they are fixed
  const has404Message = JSON.stringify(error.data).indexOf('404') > -1
  if (error.status !== 404 && !has404Message) throw new Error(error.stack)
}
