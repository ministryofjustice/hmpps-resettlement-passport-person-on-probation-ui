import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js'
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js'

const nomdId2 = 'A8731DY'

const authSession = new Httpx({ baseURL: 'https://sign-in-dev.hmpps.service.justice.gov.uk/' })
const session = new Httpx({
  baseURL: 'https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/',
})

// Register a new user and retrieve authentication token for subsequent API requests

// copy pasted base64 encoding because k6 does not have access to Buffer library
function base64Encode(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;

  do {
      chr1 = str.charCodeAt(i++);
      chr2 = str.charCodeAt(i++);
      chr3 = str.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
          enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
          enc4 = 64;
      }

      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
  } while (i < str.length);

  return output;
}

// hmpps auth api config
const config = {
  apis: {
     hmppsAuth: {
       apiClientId: `${__ENV.CLIENT_ID}`,
       apiClientSecret: `${__ENV.CLIENT_SECRET}`,
       url: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth',
     },
  },
 };
 
 // oauth call to get the token
 export const getHmppsAuthToken = () => {
  const { apiClientId, apiClientSecret, url } = config.apis.hmppsAuth;
  if (!apiClientId){
    throw Error('Missing apiClientId')
  }
  if (!apiClientSecret){
    throw Error('Missing apiClientSecret')
  }
  const basicAuth = base64Encode(`${apiClientId}:${apiClientSecret}`);
 
  const headers = {
     'Content-Type': 'application/json',
     'Authorization': `Basic ${basicAuth}`,
  };
 
  const payload = JSON.stringify({
     grant_type: 'client_credentials',
  });
 
  const response = session.post(`${url}/oauth/token?grant_type=client_credentials`, payload, { headers: headers });
 
  if (response.status === 200) {
     return JSON.parse(response.body);
  } else {
     console.error('Error while fetching hmpps auth token:', response.status, response.body);
     throw new Error('Failed to fetch HMPPS Auth token');
  }
 };

export function setup() {
  const authToken = getHmppsAuthToken();
  return authToken.access_token
}

export function resettlementPassportApi(authToken) {
  // set the authorization header on the session for the subsequent requests
  session.addHeader('Authorization', `Bearer ${authToken}`)

  describe('01. Test Get Prisoner Details', t => {
    const resp = session.get(`prisoner/${nomdId2}`)
    console.log(resp)
    expect(resp.status, 'Licence status').to.equal(200)
    expect(resp, 'Licence valid json response').to.have.validJsonBody()
  })

  describe('02. Test Get Licence Conditions', t => {
    const resp = session.get(`prisoner/${nomdId2}/licence-condition`)
    console.log(resp)
    expect(resp.status, 'Licence status').to.equal(200)
    expect(resp, 'Licence valid json response').to.have.validJsonBody()
  })

  describe('03. Test Get Licence Conditions Image', t => {
    const resp = session.get(`prisoner/${nomdId2}/licence-condition/id/101/condition/1008/image`)
    console.log(resp)
    expect(resp.status, 'Appointments status').to.equal(200)
  })

  describe('04. Test Get Appointments', t => {
    const resp = session.get(`prisoner/${nomdId2}/appointments?futureOnly=false&includePreRelease=false`)
    console.log(resp)
    expect(resp.status, 'Appointments status').to.equal(200)
    expect(resp, 'Appointments valid json response').to.have.validJsonBody()
  })
}
