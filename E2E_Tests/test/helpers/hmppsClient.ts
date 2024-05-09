// @ts-nocheck
const getHmppsAuthToken = async (request, apiClientId: string, apiClientSecret: string) => {
    const basicAuth = Buffer.from(`${apiClientId}:${apiClientSecret}`).toString('base64');
    try {
        const url = 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth/oauth/token';
        const response = await request.post(`${url}/oauth/token?grant_type=client_credentials`)
            .setHeader('Content-Type', 'application/json')
            .setHeader('Authorization', `Basic ${basicAuth}`);
            const responseBody = JSON.parse(await response.text())

        return responseBody;
    } catch (error) {
        console.error('Error while fetching hmpps auth token:', error);
        throw error;
    }
}

const getOtpForNomisId = async (request, nomisId: string, token: string) => {
    try {
        const url = `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/popUser/${nomisId}/otp`;
        const response = await request.get(url)
            .setHeader('Content-Type', 'application/json')
            .setHeader('Authorization', `Bearer ${token}`);
            const responseBody = JSON.parse(await response.text())

        return responseBody;
    } catch (error) {
        console.error('Error while fetching otp from PSFR API:', error);
        throw error;
    }
}

export const getFirstTimeIdCode = async (request, nomisId: string) => {
    const apiClientId = process.env.CLIENT_ID;
    const apiClientSecret = process.env.CLIENT_SECRET;
    const authToken = await getHmppsAuthToken(request, apiClientId, apiClientSecret);
    console.log("authToken is:", authToken.access_token);
    const otpResponse = await getOtpForNomisId(request, nomisId, authToken.access_token);
    return otpResponse.otp;
}
