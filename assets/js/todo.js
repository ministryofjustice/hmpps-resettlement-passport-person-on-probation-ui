const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const todoTable = document.getElementById('todo-list-table')
const completedTable = document.getElementById('completed-table')

function handleToggleResponse(form) {
  return async e => {
    e.preventDefault()
    const res = await fetch(form.action, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } })
    if (res.status === 200) {
      const responseText = await res.text()
      const parser = new DOMParser()
      const newDoc = parser.parseFromString(responseText, 'text/html')
      todoTable.innerHTML = newDoc.getElementById('todo-list-table').innerHTML
      completedTable.innerHTML = newDoc.getElementById('completed-table').innerHTML
      registerListeners()
    }
  }
}

function registerListeners() {
  for (const form of document.querySelectorAll('form')) {
    form.addEventListener('submit', handleToggleResponse(form))
  }
}

registerListeners()
