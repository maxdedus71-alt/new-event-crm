document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  initModal();
  bindExportButtons();

  await loadOrders();
  await loadContractors();
  await loadClients();
  await loadArchive();
});

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function initModal() {
  document.getElementById('closeModal').addEventListener('click', closeModal);
}

function openModal(html) {
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modalBody').innerHTML = '';
}

function bindExportButtons() {
  const map = [
    ['exportClientsExcel', '/api/export/clients/excel'],
    ['exportClientsCsv', '/api/export/clients/csv'],
    ['exportContractorsExcel', '/api/export/contractors/excel'],
    ['exportContractorsCsv', '/api/export/contractors/csv']
  ];

  map.forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => window.open(url, '_blank'));
  });
}