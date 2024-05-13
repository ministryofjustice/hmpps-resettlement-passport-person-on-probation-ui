import OTPAuth from 'otpauth'

/**
 * @param {string} secretValue
 */
export function getMyOTP(secretValue: string) {
  // Create a new TOTP object.
  let totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'MyPPOTP',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secretValue, // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
  })

  let token = totp.generate()
  console.log(token)
  return token
}

module.exports = { getMyOTP }
