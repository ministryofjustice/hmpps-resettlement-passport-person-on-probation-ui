let activityTimeout
let inactivityPeriod = 30000

function redirect() {
  window.location.href = `${window.location.origin}/sign-out-timed`
}

async function resetTimer() {
  console.log('user is active, resetting counter')
  clearTimeout(activityTimeout)
  activityTimeout = setTimeout(async () => {
    console.log('user inactive')
    const response = await window.fetch('/timeout-status')
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      if (!data.isActive) {
        redirect()
      }
    } else {
      console.error('Failed to fetch timeout-status value')
      redirect()
    }
  }, inactivityPeriod)
  
}

function setupActivityListeners() {
  document.addEventListener('scroll', resetTimer, { passive: true })
  document.addEventListener('click', resetTimer)
}

async function fetchTimeoutValue() {
  try {
    const response = await window.fetch('/timeout-config')
    if (response.ok) {
      const data = await response.json()
      inactivityPeriod = data.timeout
    } else {
      console.error('Failed to fetch timeout value, using default:', inactivityPeriod)
    }
  } catch (error) {
    console.error('Error fetching timeout value:', error, 'Using default:', inactivityPeriod)
  }
}

window.onload = async () => {
  await fetchTimeoutValue()
  console.log('Fetched timeout: ', inactivityPeriod)
  setupActivityListeners()
  await resetTimer()
}
