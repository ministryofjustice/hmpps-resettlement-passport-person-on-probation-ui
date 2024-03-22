// some cookie utils from: https://github.com/alphagov/govuk_publishing_components/ (simplified)
window.GOVUK = {}

window.GOVUK.setCookie = function (name, value, options) {
  if (typeof options === 'undefined') {
    options = {}
  }
  var cookieString = name + '=' + value + '; path=/'
  if (options.days) {
    var date = new Date()
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000)
    cookieString = cookieString + '; expires=' + date.toGMTString()
  }
  if (document.location.protocol === 'https:') {
    cookieString = cookieString + '; Secure'
  }
  document.cookie = cookieString
}

window.GOVUK.getCookie = function (name) {
  var nameEQ = name + '='
  var cookies = document.cookie.split(';')
  for (var i = 0, len = cookies.length; i < len; i++) {
    var cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  return null
}

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

// https://docs.publishing.service.gov.uk/manual/cookie-consent-on-govuk.html
window['ga-disable-UA-26179049-1'] = true

// cookie categories from: https://github.com/alphagov/govuk_publishing_components/blob/e31f3450ff6e0a44f0436926ecac92f94e5b606b/app/assets/javascripts/govuk_publishing_components/lib/cookie-functions.js#L35
const cookieNames = ['_ga', '_ga_VBLT2V3FZR', '_ga_P1DGM6TVYF', '_ga_S5RQ7FTGVR', '_gid', '_gat']

cookieNames.forEach(cookieName => {
  window.GOVUK.deleteCookie(cookieName)
  console.log('GA cookie deleted: ' + cookieName)
})
