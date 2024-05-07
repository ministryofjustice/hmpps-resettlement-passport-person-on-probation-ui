const { getMyOTP } = require ('../helpers/otpAuth')

const {returnSecurityCode,returnCurrentCount} = require ('../helpers/mailClient')

async function test() {
  const secret = 'PYIS3ZBJEYSMHQQY47KQW2NAZEPGSSGI'
  const otpAuth = await getMyOTP(secret);
}

test();