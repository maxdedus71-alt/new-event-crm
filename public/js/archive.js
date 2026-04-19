async function loadArchive() {
  const orders = await api.get('/api/orders?archived=true');
  const tbody = document.getElementById('archiveTableBody');
  tbody.innerHTML = '';

  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.orderNumber}</td>
      <td>${order.client?.companyName || ''}</td>
      <td>${order.eventDate || ''}</td>
      <td>${order.status}</td>
      <td>${order.clientTotal}</td>
    `;
    tbody.appendChild(tr);
  });
}