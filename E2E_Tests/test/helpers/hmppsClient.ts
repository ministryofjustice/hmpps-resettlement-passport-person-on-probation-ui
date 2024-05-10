// @ts-nocheck
import axios from 'axios';


 const getOtpForNomisId = async (nomisId: string, token: string) => {
   const url = `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/popUser/${nomisId}/otp`;
   const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    } 
   try {
      const response = await axios.post(url,{}, {
         headers: headers
       });
      const otpResponseData = response.data;
      console.log(otpResponseData);
      return otpResponseData.otp;
   } catch (error) {
      console.error('Error while fetching otp from PSFR API:', error.message);
   }
}

async function getHmppsAuthToken(){
    const apiClientId = process.env.CLIENT_ID;
    const apiClientSecret = process.env.CLIENT_SECRET;
    const url = 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth';
    const basicAuth = Buffer.from(`${apiClientId}:${apiClientSecret}`).toString('base64');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
   const payload = JSON.stringify({
         grant_type: 'client_credentials',
      });
      
      const accessToken =  await axios.post(`${url}/oauth/token?grant_type=client_credentials`, payload, {
          headers: headers
        })
        .then((response) => {
          const data = response.data;
          return data.access_token;
          })
        .catch((error) => {
            console.log('Error while fetching auth from HMPPS API:', error.message);
          });
    return accessToken; 
}


export const getFirstTimeIdCode = async (nomisId: string) => {
   const authToken = await getHmppsAuthToken();
   const otpResponse = await getOtpForNomisId(nomisId, authToken);
   console.log('this is the otp '+ otpResponse);
   return otpResponse;
}