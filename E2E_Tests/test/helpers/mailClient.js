// @ts-nocheck
const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const clientId = process.env.GMAIL_CLIENT_ID
const clientSecret = process.env.GMAIL_CLIENT_SECRET
const projectId = process.env.GMAIL_PROJECT_ID
const gmailToken = process.env.GMAIL_TOKEN

const apiCredentials = JSON.stringify({
  installed: {
    client_id: clientId,
    project_id: projectId,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: clientSecret,
    redirect_uris: ['http://localhost'],
  },
})

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
var count = 0
var startCount = 0
var currentCount = 0
var errorCount = 0

async function getMessageNumber() {
  const messageNumberReturned = await authorize().then(getMessage).catch(console.error)
  console.log('Returned Message Numer is ' + messageNumberReturned)
  return messageNumberReturned
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  console.log('waiting')
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function returnSecurityCode(number) {
  console.log('currentCountNumber passed is ' + number)

  startCount = number

  while (currentCount <= startCount) {
    await sleep(2000)
    currentCount = await authorize().then(countMessages).catch(console.error)
    console.log('in while loop current count ' + currentCount)
    console.log('in while loop start count ' + startCount)
    errorCount++
    // ensures no infinite loop and returns if no email is recieved
    // allows 20 seconds for email to be received
    if (errorCount > 9) {
      throw new Error('No email has been recieved!')
    }
  }
  const securityCode = await getMessageNumber()
  console.log('securityCode is ...' + securityCode.slice(-3))
  return securityCode
}

async function returnCurrentCount() {
  const thisCount = await authorize().then(countMessages).catch(console.error)
  return thisCount
}

async function deleteMessageHousekeeping() {
  currentCount = await authorize().then(countMessages).catch(console.error)
  while (currentCount > 1){
    await authorize().then(deleteLatestMessage).catch(console.error)
    currentCount = await authorize().then(countMessages).catch(console.error)
  }
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const savedCredentials = JSON.stringify({
      type: 'authorized_user',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: gmailToken,
    })
    const credentialData = JSON.parse(savedCredentials)
    return google.auth.fromJSON(credentialData)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = apiCredentials
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    refresh_token: gmailToken,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  await fs.writeFile(CREDENTIALS_PATH, apiCredentials)
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  await fs.unlink(CREDENTIALS_PATH)
  return client
}

async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({
    userId: 'me',
  })
  console.log('completed call')
  const messages = res.data.messages
  if (!messages || messages.length === 0) {
    console.log('No messages found.')
    return
  }
  console.log('get latest message ' + res.data.messages[0].id)
  return res.data.messages[0].id
}

async function countMessages(auth) {
  count = 0
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({
    userId: 'me',
  })
  console.log('completed call')
  const messages = res.data.messages
  if (!messages || messages.length === 0) {
    console.log('No messages found.')
    return
  }
  messages.forEach(message => {
    count++
  })
  return count
}

async function getMessage(auth) {
  const id = await authorize().then(listMessages).catch(console.error)
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  })
  console.log('completed call')
  const messages = res.data.snippet
  const messageNumber = await extractSixDigitNumber(messages)
  console.log('email message number ' + messageNumber)
  if (!messages || messages.length === 0) {
    console.log('No messages found.')
    return
  }
  return messageNumber
}

async function deleteLatestMessage(auth) {
  const id = await authorize().then(listMessages).catch(console.error)
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.delete({
    userId: 'me',
    id: id,
  })
  console.log('completed call')
  console.log('email deleted ' + id)
}

async function extractSixDigitNumber(input) {
  const regex = /\b\d{6}\b/
  const match = input.match(regex)
  console.log('this was the input ' + input)
  console.log('this was the match ' + match)
  return match ? match[0] : null
}

module.exports = { returnSecurityCode, returnCurrentCount, deleteMessageHousekeeping }
