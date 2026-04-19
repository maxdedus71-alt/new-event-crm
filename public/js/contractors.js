async function loadContractors() {
  const contractors = await api.get('/api/contractors');
  const tbody = document.getElementById('contractorsTableBody');
  tbody.innerHTML = '';

  contractors.forEach(contractor => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${contractor.category || ''}</td>
      <td>${contractor.subcategory1 || ''}</td>
      <td>${contractor.subcategory2 || ''}</td>
      <td>${contractor.name || ''}</td>
      <td>${contractor.phone || ''}</td>
      <td>${contractor.serviceCost || 0}</td>
      <td>${'★'.repeat(contractor.rating || 0)}</td>
      <td>
        <div class="actions">
          <button onclick='showContractorForm(${JSON.stringify(contractor)})'>Редактировать</button>
          <button class="danger" onclick="deleteContractor(${contractor.id})">Удалить</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('createContractorBtn').addEventListener('click', () => showContractorForm());

function showContractorForm(contractor = null) {
  openModal(`
    <h2>${contractor ? 'Редактировать контрагента' : 'Новый контрагент'}</h2>
    <form id="contractorForm">
      <div class="form-grid">
        <input name="category" placeholder="Категория" value="${contractor?.category || ''}" required />
        <input name="subcategory1" placeholder="Подкатегория 1" value="${contractor?.subcategory1 || ''}" required />
        <input name="subcategory2" placeholder="Подкатегория 2" value="${contractor?.subcategory2 || ''}" />
        <input name="name" placeholder="ФИО / название" value="${contractor?.name || ''}" required />
        <input name="phone" placeholder="Телефон" value="${contractor?.phone || ''}" />
        <input type="number" step="0.01" name="serviceCost" placeholder="Стоимость услуг" value="${contractor?.serviceCost || 0}" />
        <input name="socialLink" placeholder="Ссылка на соцсети" value="${contractor?.socialLink || ''}" />
        <input name="website1" placeholder="Сайт" value="${contractor?.website1 || ''}" />
        <input name="website2" placeholder="Второй сайт" value="${contractor?.website2 || ''}" />
        <input type="number" min="1" max="5" name="rating" placeholder="Рейтинг 1-5" value="${contractor?.rating || 5}" />
        <textarea class="full" name="comment" placeholder="Комментарий">${contractor?.comment || ''}</textarea>

        <div class="full actions">
          <button type="submit">${contractor ? 'Сохранить' : 'Создать'}</button>
        </div>
      </div>
    </form>
  `);

  document.getElementById('contractorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;

    const payload = {
      category: f.category.value,
      subcategory1: f.subcategory1.value,
      subcategory2: f.subcategory2.value,
      name: f.name.value,
      phone: f.phone.value,
      serviceCost: Number(f.serviceCost.value || 0),
      socialLink: f.socialLink.value,
      website1: f.website1.value,
      website2: f.website2.value,
      rating: Number(f.rating.value || 5),
      comment: f.comment.value,
      contacts: []
    };

    if (contractor?.id) {
      await api.put(`/api/contractors/${contractor.id}`, payload);
    } else {
      await api.post('/api/contractors', payload);
    }

    closeModal();
    await loadContractors();
  });
}

async function deleteContractor(id) {
  if (!confirm('Удалить контрагента?')) return;
  await api.delete(`/api/contractors/${id}`);
  await loadContractors();
}