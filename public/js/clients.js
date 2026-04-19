async function loadClients() {
  const clients = await api.get('/api/clients');
  const tbody = document.getElementById('clientsTableBody');
  tbody.innerHTML = '';

  clients.forEach(client => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${client.category || ''}</td>
      <td>${client.subcategory1 || ''}</td>
      <td>${client.subcategory2 || ''}</td>
      <td>${client.companyName || ''}</td>
      <td>${client.phone || ''}</td>
      <td>${client.email || ''}</td>
      <td>
        <div class="actions">
          <button onclick='showClientForm(${JSON.stringify(client)})'>Редактировать</button>
          <button class="danger" onclick="deleteClient(${client.id})">Удалить</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('createClientBtn').addEventListener('click', () => showClientForm());

function showClientForm(client = null) {
  openModal(`
    <h2>${client ? 'Редактировать клиента' : 'Новый клиент'}</h2>
    <form id="clientForm">
      <div class="form-grid">
        <input name="category" placeholder="Категория" value="${client?.category || ''}" required />
        <input name="subcategory1" placeholder="Подкатегория 1" value="${client?.subcategory1 || ''}" required />
        <input name="subcategory2" placeholder="Подкатегория 2" value="${client?.subcategory2 || ''}" />
        <input name="companyName" placeholder="Название компании" value="${client?.companyName || ''}" />
        <input name="inn" placeholder="ИНН" value="${client?.inn || ''}" />
        <input name="ogrn" placeholder="ОГРН / ОГРНИП" value="${client?.ogrn || ''}" />
        <input name="bik" placeholder="БИК" value="${client?.bik || ''}" />
        <input name="kpp" placeholder="КПП" value="${client?.kpp || ''}" />
        <input name="okpo" placeholder="ОКПО" value="${client?.okpo || ''}" />
        <input name="checkingAccount" placeholder="Расчетный счет" value="${client?.checkingAccount || ''}" />
        <input name="correspondentAccount" placeholder="Корреспондентский счет" value="${client?.correspondentAccount || ''}" />
        <input name="directorName" placeholder="Имя директора" value="${client?.directorName || ''}" />
        <input name="legalAddress" placeholder="Юридический адрес" value="${client?.legalAddress || ''}" />
        <input name="officeAddress" placeholder="Адрес офиса" value="${client?.officeAddress || ''}" />
        <input name="bankName" placeholder="Полное наименование банка" value="${client?.bankName || ''}" />
        <input name="website" placeholder="Сайт" value="${client?.website || ''}" />
        <input name="phone" placeholder="Телефон" value="${client?.phone || ''}" />
        <input name="email" placeholder="Email" value="${client?.email || ''}" />
        <textarea class="full" name="comment" placeholder="Комментарий">${client?.comment || ''}</textarea>

        <div class="full actions">
          <button type="submit">${client ? 'Сохранить' : 'Создать'}</button>
        </div>
      </div>
    </form>
  `);

  document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;

    const payload = {
      category: f.category.value,
      subcategory1: f.subcategory1.value,
      subcategory2: f.subcategory2.value,
      companyName: f.companyName.value,
      inn: f.inn.value,
      ogrn: f.ogrn.value,
      bik: f.bik.value,
      kpp: f.kpp.value,
      okpo: f.okpo.value,
      checkingAccount: f.checkingAccount.value,
      correspondentAccount: f.correspondentAccount.value,
      directorName: f.directorName.value,
      legalAddress: f.legalAddress.value,
      officeAddress: f.officeAddress.value,
      bankName: f.bankName.value,
      website: f.website.value,
      phone: f.phone.value,
      email: f.email.value,
      comment: f.comment.value,
      contacts: []
    };

    if (client?.id) {
      await api.put(`/api/clients/${client.id}`, payload);
    } else {
      await api.post('/api/clients', payload);
    }

    closeModal();
    await loadClients();
  });
}

async function deleteClient(id) {
  if (!confirm('Удалить клиента?')) return;
  await api.delete(`/api/clients/${id}`);
  await loadClients();
}