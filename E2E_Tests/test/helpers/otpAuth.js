const OTPAuth = require('otpauth') ;


/**
 * @param {string} secretValue
 */
function getMyOTP(secretValue){

    // Create a new TOTP object.
  let totp = new OTPAuth.TOTP({
    issuer: "ACME",
    label: "MyPPOTP",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secretValue,
  });

  let token = totp.generate();
  return token;
}


module.exports = {getMyOTP};
