const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const completedTable = document.getElementById('completed-table')
const cellStyle = 'govuk-table__cell'

for (const form of document.querySelectorAll('form')) {
  form.querySelector('input[type="checkbox"]').addEventListener('change', async e => {
    if (e.target.checked) {
      const res = await fetch(form.action, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } })
      if(res.status === 200) {
        const row = completedTable.insertRow(0)

        const formData = new FormData(document.getElementById(form.id))
        const itemId = formData.get('itemId')
        const originRow = document.getElementById(`todo-row-${itemId}`)
        originRow.classList.add('hidden')

        const titleCell  = row.insertCell(0)
        titleCell.innerHTML = formData.get('title')
        titleCell.className = cellStyle
        const completedAtCell = row.insertCell(1)
        completedAtCell.innerHTML = new Date().toLocaleDateString(undefined,  { day: 'numeric', month: 'short', year: 'numeric' })
        completedAtCell.className = cellStyle
        const noteCell = row.insertCell(2)
        noteCell.innerHTML = formData.get('note')
        noteCell.className = cellStyle
      }
    }
  })
}
