import { initAll } from '/assets/govuk/govuk-frontend.min.js'

window.GOVUK = {}

window.GOVUK.cookie = function (name, value, options) {
  if (typeof value !== 'undefined') {
    if (value === false || value === null) {
      return window.GOVUK.setCookie(name, '', { days: -1 })
    } else {
      // Default expiry date of 30 days
      if (typeof options === 'undefined') {
        options = { days: 30 }
      }
      return window.GOVUK.setCookie(name, value, options)
    }
  } else {
    return window.GOVUK.getCookie(name)
  }
}

window.GOVUK.deleteCookie = function (cookie) {
  window.GOVUK.cookie(cookie, null)

  if (window.GOVUK.cookie(cookie)) {
    // We need to handle deleting cookies on the domain and the .domain
    document.cookie = cookie + '=;expires=' + new Date() + ';'
    document.cookie = cookie + '=;expires=' + new Date() + ';domain=' + window.location.hostname + ';path=/'
  }
}

initAll()
