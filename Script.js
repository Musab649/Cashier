let users = [
  { id: "100", name: "المدير", role: "admin", site: "" },
  { id: "200", name: "موظف ألف", role: "user", site: "مسلخ ألف" }
];

let sites = ["مسلخ ألف"];
let animals = [];
let cuttings = [];
let prices = {};
let report = [];
let invoiceCounter = 1;
let currentUser = {};

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

setTimeout(() => showSection('login'), 3000);

function login() {
  let id = document.getElementById('employeeId').value.trim();
  let u = users.find(x => x.id === id);
  if (!u) { alert("رقم وظيفي خاطئ"); return; }
  currentUser = u;
  document.getElementById('username').innerText = u.name;
  showSection('dashboard');
}

function exitProgram() {
  alert('👋 شكرًا لاستخدامك النظام');
}

function addUser() {
  let id = document.getElementById('newUserId').value.trim();
  let name = document.getElementById('newUserName').value.trim();
  let role = document.getElementById('newUserRole').value;
  let site = document.getElementById('newUserSite').value.trim();
  users.push({ id, name, role, site });
  renderUsers();
}

function renderUsers() {
  let html = "";
  users.forEach(u => {
    html += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>${u.site}</td></tr>`;
  });
  document.getElementById('usersTable').innerHTML = html;
}

function addSite() {
  let s = document.getElementById('newSite').value;
  sites.push(s);
}

function addAnimal() {
  let a = document.getElementById('newAnimal').value;
  animals.push(a);
  renderAnimals();
}

function addCutting() {
  let c = document.getElementById('newCutting').value;
  cuttings.push(c);
  renderCuttings();
}

function renderAnimals() {
  let html = animals.map(a => `<option>${a}</option>`).join('');
  document.getElementById('animalType').innerHTML = html;
  document.getElementById('priceAnimal').innerHTML = html;
}

function renderCuttings() {
  let html = cuttings.map(c => `<option>${c}</option>`).join('');
  document.getElementById('cuttingType').innerHTML = html;
  document.getElementById('priceCutting').innerHTML = html;
}

function setPrice() {
  let a = document.getElementById('priceAnimal').value;
  let c = document.getElementById('priceCutting').value;
  let p = document.getElementById('priceValue').value;
  prices[`${a}_${c}`] = parseFloat(p);
}

function openDataEntry() {
  document.getElementById('entrySite').innerText = currentUser.site || "مدير";
  document.getElementById('invoiceNumber').value = `INV-${invoiceCounter}`;
  renderAnimals();
  renderCuttings();
  showSection('dataEntry');
}

function updatePrice() {
  let a = document.getElementById('animalType').value;
  let c = document.getElementById('cuttingType').value;
  let qty = parseInt(document.getElementById('quantity').value) || 1;
  let unit = prices[`${a}_${c}`] || 0;
  document.getElementById('unitPrice').value = unit;
  document.getElementById('totalPrice').value = qty * unit;
}

function saveData() {
  report.push({
    site: currentUser.site,
    name: document.getElementById('clientName').value,
    phone: document.getElementById('phone').value,
    invoice: document.getElementById('invoiceNumber').value,
    qty: document.getElementById('quantity').value,
    total: document.getElementById('totalPrice').value
  });
  invoiceCounter++;
  renderReport();
  alert('✅ محفوظ');
}

function renderReport() {
  let html = "";
  report.forEach(r => {
    html += `<tr><td>${r.site}</td><td>${r.name}</td><td>${r.phone}</td><td>${r.invoice}</td><td>${r.qty}</td><td>${r.total}</td></tr>`;
  });
  document.getElementById('reportTable').innerHTML = html;
}

function logout() {
  currentUser = {};
  document.getElementById('employeeId').value = '';
  showSection('login');
}
