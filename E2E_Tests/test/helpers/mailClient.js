// @ts-nocheck
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
var count = 0;
var startCount = 0;
var currentCount = 0;

console.log('Test Start');

async function getMessageNumber(){
  const messageNumberReturned = await authorize().then(getMessage).catch(console.error);
  console.log('Returned Message Numer is ' + messageNumberReturned);
  console.log('Test End')
  return messageNumberReturned
}


/**
 * @param {number} ms
 */
function sleep(ms) {
  console.log('waiting')
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main (){

  startCount = await authorize().then(countMessages).catch(console.error);

  while (currentCount <= startCount){   
    await sleep(5000);
    currentCount = await authorize().then(countMessages).catch(console.error); 
    console.log('in while loop current count '+ currentCount);
    console.log('in while loop start count '+ startCount);
  
    startCount--
  }
  const test =  await getMessageNumber();
  console.log('messageNumber is '+ test);
}
main();



/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

async function listMessages(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.messages.list({
    userId: 'me',
  });
  console.log('completed call')
  const messages = res.data.messages;
  console.log(messages);
  if (!messages || messages.length === 0) {
    console.log('No messages found.');
    return;
  }
  console.log('get 1st' + res.data.messages[0].id)
  console.log('Messages:');
  messages.forEach((message) => {
    console.log(`- ${message.id}`);
  });
  return res.data.messages[0].id
}

async function countMessages(auth) {
  count = 0;
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.messages.list({
    userId: 'me',
  });
  console.log('completed call')
  const messages = res.data.messages;
  console.log(messages);
  if (!messages || messages.length === 0) {
    console.log('No messages found.');
    return;
  }
  messages.forEach((message) => {
    
    count ++ 
    console.log('Current Message count is ' +count);
  });
  return count
}

async function getMessage(auth) {
  const id = await authorize().then(listMessages).catch(console.error);
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  });
  console.log('completed call')
  const messages = res.data.snippet;
  const messageNumber = await extractSixDigitNumber(messages);
  console.log('test messages '+ messages);
  console.log('test message number ' + messageNumber);
  if (!messages || messages.length === 0) {
    console.log('No messages found.');
    return;
  }
  return messageNumber;
}

async function extractSixDigitNumber (input) {
  const regex = /\b\d{6}\b/;
  const match = input.match(regex);
  console.log('this was the input ' + input)
  console.log('this was the match ' +match);
  return match? match[0] : null;
};

