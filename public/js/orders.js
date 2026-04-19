async function loadOrders() {
  const orders = await api.get('/api/orders?archived=false');
  renderOrders(orders);
}

function getOrderRowClass(status) {
  if (status === 'Заказ') return 'status-order';
  if (status === 'Жду подтверждения') return 'status-pending';
  if (status === 'В работе') return 'status-progress';
  if (status === 'Выполнен') return 'status-done';
  if (status === 'Отменен') return 'status-cancelled';
  return '';
}

function renderOrders(orders) {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';

  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.className = getOrderRowClass(order.status);

    tr.innerHTML = `
      <td>${order.orderNumber}</td>
      <td>${new Date(order.createdAtManual).toLocaleDateString('ru-RU')}</td>
      <td>${order.managerName || ''}</td>
      <td>${order.client?.companyName || ''}</td>
      <td>${order.eventDate || ''}</td>
      <td>${order.status}</td>
      <td>
        <span class="badge ${order.paymentConfirmed === 'да' ? 'badge-yes' : 'badge-no'}">
          ${order.paymentConfirmed}
        </span>
      </td>
      <td>${order.clientTotal}</td>
      <td>${order.netProfit}</td>
      <td>
        <div class="actions">
          <button onclick="showOrderForm(${encodeURIComponent(JSON.stringify(order))})">Редактировать</button>
          <button class="danger" onclick="deleteOrder(${order.id})">Удалить</button>
          <button class="secondary" onclick="archiveOrder(${order.id})">Архив</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

document.getElementById('createOrderBtn').addEventListener('click', () => showOrderForm());

async function showOrderForm(order = null) {
  const clients = await api.get('/api/clients');
  const contractors = await api.get('/api/contractors');

  const contractorRows = order?.contractors?.length
    ? order.contractors.map(c => contractorFormRow(c)).join('')
    : contractorFormRow();

  openModal(`
    <h2>${order ? 'Редактировать заказ' : 'Новый заказ'}</h2>
    <form id="orderForm">
      <div class="form-grid">
        <input name="managerName" placeholder="Менеджер" value="${order?.managerName || ''}" />
        
        <select name="clientId" required>
          <option value="">Выберите клиента</option>
          ${clients.map(c => `<option value="${c.id}" ${order?.clientId === c.id ? 'selected' : ''}>${c.companyName || c.subcategory1}</option>`).join('')}
        </select>

        <input type="date" name="eventDate" value="${order?.eventDate || ''}" required />
        <input name="eventStartTime" placeholder="Время начала" value="${order?.eventStartTime || ''}" required />
        <input name="eventEndTime" placeholder="Время конца" value="${order?.eventEndTime || ''}" required />
        <input type="number" step="0.01" name="extraCharge" placeholder="Добавочная стоимость" value="${order?.extraCharge || 0}" />

        <select name="status">
          ${['Выполнен', 'В работе', 'Жду подтверждения', 'Заказ', 'Отменен'].map(s => `<option value="${s}" ${order?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>

        <select name="paymentConfirmed">
          <option value="да" ${order?.paymentConfirmed === 'да' ? 'selected' : ''}>да</option>
          <option value="нет" ${!order || order?.paymentConfirmed === 'нет' ? 'selected' : ''}>нет</option>
        </select>

        <textarea class="full" name="comment" placeholder="Комментарий">${order?.comment || ''}</textarea>

        <div class="full">
          <h3>Контрагенты</h3>
          <div id="contractorsContainer">${contractorRows}</div>
          <button type="button" class="secondary" onclick='addContractorRow(${JSON.stringify(contractors)})'>Добавить контрагента</button>
        </div>

        <div class="full actions">
          <button type="submit">${order ? 'Сохранить' : 'Создать'}</button>
        </div>
      </div>
    </form>
  `);

  window.currentContractorsList = contractors;

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const rows = [...document.querySelectorAll('.contractor-block')];
    const payloadContractors = rows.map(row => ({
      contractorId: row.querySelector('[name="contractorId"]').value || null,
      contractorName: row.querySelector('[name="contractorName"]').value,
      serviceCost: Number(row.querySelector('[name="serviceCost"]').value || 0),
      commissionPercent: Number(row.querySelector('[name="commissionPercent"]').value || 0),
      paymentStatus: row.querySelector('[name="paymentStatus"]').value
    }));

    const payload = {
      managerName: form.managerName.value,
      clientId: form.clientId.value,
      eventDate: form.eventDate.value,
      eventStartTime: form.eventStartTime.value,
      eventEndTime: form.eventEndTime.value,
      extraCharge: Number(form.extraCharge.value || 0),
      status: form.status.value,
      paymentConfirmed: form.paymentConfirmed.value,
      comment: form.comment.value,
      contractors: payloadContractors
    };

    if (order && order.id) {
      await api.put(`/api/orders/${order.id}`, payload);
    } else {
      await api.post('/api/orders', payload);
    }

    closeModal();
    await loadOrders();
    await loadArchive();
  });
}

function contractorFormRow(data = {}) {
  const contractors = window.currentContractorsList || [];
  return `
    <div class="contractor-block">
      <div class="form-grid">
        <select name="contractorId" onchange="fillContractorData(this)">
          <option value="">Выберите из базы</option>
          ${contractors.map(c => `<option value="${c.id}" ${data.contractorId === c.id ? 'selected' : ''} data-name="${c.name}" data-cost="${c.serviceCost}">${c.name}</option>`).join('')}
        </select>
        <input name="contractorName" placeholder="Имя / название" value="${data.contractorName || ''}" />
        <input type="number" step="0.01" name="serviceCost" placeholder="Стоимость услуги" value="${data.serviceCost || 0}" />
        <input type="number" step="0.01" name="commissionPercent" placeholder="Комиссия %" value="${data.commissionPercent || 0}" />
        <select name="paymentStatus">
          ${['Оплатить', 'Долг', 'В процессе', 'Оплачено'].map(s => `<option value="${s}" ${data.paymentStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <button type="button" class="danger" onclick="this.closest('.contractor-block').remove()">Удалить</button>
      </div>
    </div>
  `;
}

function addContractorRow() {
  document.getElementById('contractorsContainer').insertAdjacentHTML('beforeend', contractorFormRow());
}

function fillContractorData(select) {
  const option = select.options[select.selectedIndex];
  const block = select.closest('.contractor-block');
  block.querySelector('[name="contractorName"]').value = option.dataset.name || '';
  block.querySelector('[name="serviceCost"]').value = option.dataset.cost || 0;
}

async function deleteOrder(id) {
  if (!confirm('Удалить заказ?')) return;
  await api.delete(`/api/orders/${id}`);
  await loadOrders();
}

async function archiveOrder(id) {
  await api.patch(`/api/orders/${id}/archive`);
  await loadOrders();
  await loadArchive();
}