const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

for (const form of document.querySelectorAll('form')) {
  form.querySelector('input[type="checkbox"]').addEventListener('change', async e => {
    if (e.target.checked) {
      const res = await fetch(form.action, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } })
      if(res.status === 200) {
        // TODO: move to completed section?
      }
    }
  })
}
