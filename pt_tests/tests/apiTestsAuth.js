import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';


let basicAuth
__ENV.PROCESS === 'dev'
    ?(basicAuth = __ENV.DEV_AUTH)
    :(basicAuth = __ENV.PRE_PROD_AUTH)

const nomdId2 = 'A8731DY'

const authSession = new Httpx({ baseURL: 'https://sign-in-dev.hmpps.service.justice.gov.uk/' });
const session = new Httpx({ baseURL: 'https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/' });

// Register a new user and retrieve authentication token for subsequent API requests
export function setup() {


    let authToken = null;
    authSession.addHeader('Authorization', `Basic ${basicAuth}`);

    describe(`setup - Authenticate the user`, () => {
        const resp = authSession.post(`auth/oauth/token?grant_type=client_credentials`);

        expect(resp.status, 'Authenticate status').to.equal(200);
        expect(resp, 'Authenticate valid json response').to.have.validJsonBody();
        authToken = resp.json('access_token');
        expect(authToken, 'Authentication token').to.be.a('string');
    });
    

    return authToken;
}

export function resettlementPassportApi (authToken) {

    // set the authorization header on the session for the subsequent requests
    session.addHeader('Authorization', `Bearer ${authToken}`);

    describe('01. Test Get Prisoner Details', (t) => {

        const resp = session.get(`prisoner/`+nomdId2);
        console.log(resp)
        expect(resp.status, 'Licence status').to.equal(200);
        expect(resp, 'Licence valid json response').to.have.validJsonBody();

    });

    describe('02. Test Get Licence Conditions', (t) => {

        const resp = session.get(`prisoner/`+nomdId2+`/licence-condition`);
        console.log(resp)
        expect(resp.status, 'Licence status').to.equal(200);
        expect(resp, 'Licence valid json response').to.have.validJsonBody();

    });

    describe('03. Test Get Licence Conditions Image', (t) => {
        
        
        const resp = session.get(`prisoner/`+nomdId2+`/licence-condition/id/101/condition/1008/image`);
        console.log(resp)
        expect(resp.status, 'Appointments status').to.equal(200);
    });

    describe('04. Test Get Appointments', (t) => {
        
        
        const resp = session.get(`prisoner/`+nomdId2+`/appointments?futureOnly=false`);
        console.log(resp)
        expect(resp.status, 'Appointments status').to.equal(200);
        expect(resp, 'Appointments valid json response').to.have.validJsonBody();

    });


}
