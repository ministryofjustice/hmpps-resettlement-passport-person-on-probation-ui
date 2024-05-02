const OTPAuth = require('otpauth') ;


function getMyOTP(){

    // Create a new TOTP object.
  let totp = new OTPAuth.TOTP({
    issuer: "ACME",
    label: "MyPPOTP",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: "5BY4PQ6AO7TUB7TZ3XW5HUKTG2LTZT7O", // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
  });

  let token = totp.generate();
  console.log(token)
  return token;
}

getMyOTP();
