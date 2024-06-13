async function track(name, trackId, tagName) {
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    const payload = JSON.stringify({
      eventName: 'PYF_' + name,
      type: tagName,
      identifier: trackId,
    })
    const response = await window.fetch('/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: payload,
    })
    if (response.ok) {
      console.log('Analytics sent: ', payload)
    }
  } catch (error) {
    console.error('Failed to submit analytics tracking request:', error)
  }
}

document.addEventListener('click', function (event) {
  const clickedElement = event.target
  const trackTagId = clickedElement.getAttribute('track-tag-id')
  const trackEventName = clickedElement.getAttribute('track-event-name')

  if (trackTagId && trackEventName) {
    track(trackEventName, trackTagId, clickedElement.tagName)
  }
})
