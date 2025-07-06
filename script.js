// بيانات وهمية للمستخدمين (يمكن تطويرها لاحقاً بالتخزين المحلي)
let users = [
  { id: "100", name: "مسؤول", role: "admin", site: "مسلخ غياثي" },
  { id: "200", name: "مستخدم1", role: "user", site: "مسلخ مدينة" }
];

// بيانات المواقع والذبائح والتقطيع والأسعار
let sites = ["مسلخ غياثي", "مسلخ مدينة"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["عزيمة", "ثلاجة"];
let prices = {}; // الأسعار مخزنة بشكل: prices[animal][cutting] = price

// بيانات الفواتير والمتعاملين
let invoices = [];

// المستخدم الحالي
let currentUser = null;

// رقم الفاتورة التلقائي
let invoiceCounter = 1;

// عند تحميل الصفحة
window.onload = () => {
  showSection("splash");
  setTimeout(() => {
    showSection("login");
  }, 3000);
  updateClock();
  setInterval(updateClock, 1000);
  populateInitialData();
};

// تحديث الساعة
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ar-EG", { hour12: false });
  const dateStr = now.toLocaleDateString("ar-EG");
  clock.textContent = `${dateStr} ${timeStr}`;
}

// عرض القسم المناسب وإخفاء الباقي
function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((sec) => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// تهيئة البيانات الابتدائية في القوائم
function populateInitialData() {
  fillSelect("priceAnimal", animals);
  fillSelect("priceCutting", cuttings);

  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect("stickerNumber", Array.from({ length: 100 }, (_, i) => i + 1));
  fillSelect("quantity", Array.from({ length: 50 }, (_, i) => i + 1));

  refreshUsersTable();
  refreshSitesList();
  refreshAnimalsList();
  refreshCuttingsList();

  updateInvoiceNumber();
}

// ملء قوائم الاختيار
function fillSelect(id, items) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// تحديث رقم الفاتورة تلقائيًا
function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
}

// تسجيل الدخول
function login() {
  const empId = document.getElementById("employeeId").value.trim();
  if (!empId) {
    alert("الرجاء إدخال الرقم الوظيفي");
    return;
  }
  const user = users.find((u) => u.id === empId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }
  currentUser = user;
  document.getElementById("username").textContent = currentUser.name;
  setupDataEntrySite();
  showSection("dashboard");
  clearDataEntryForm();
}

// ضبط موقع شاشة إدخال البيانات بناء على المستخدم
function setupDataEntrySite() {
  const title = document.getElementById("dataEntrySiteTitle");
  if (currentUser.role === "admin") {
    title.textContent = "كل المواقع متاحة للمسؤول";
  } else {
    title.textContent = `الموقع: ${currentUser.site}`;
  }
}

// تسجيل الخروج
function logout() {
  currentUser = null;
  document.getElementById("employeeId").value = "";
  showSection("login");
}

// إغلاق البرنامج (زر إلغاء)
function closeProgram() {
  alert("شكراً لاستخدامك نظام الفواتير");
  window.close();
}

// تحديث السعر بناء على اختيار الذبيحة والتقطيع والكمية
function updatePrice() {
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const quantity = parseInt(document.getElementById("quantity").value, 10);
  if (prices[animal] && prices[animal][cutting]) {
    const unitPrice = prices[animal][cutting];
    const total = unitPrice * quantity;
    document.getElementById("unitPrice").value = unitPrice;
    document.getElementById("totalPrice").value = total;
  } else {
    document.getElementById("unitPrice").value = 0;
    document.getElementById("totalPrice").value = 0;
  }
}

// إضافة مستخدم جديد
function addUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const role = document.getElementById("newUserRole").value;
  const site = document.getElementById("newUserSite").value;

  if (!id || !name || !site) {
    alert("يرجى ملء جميع حقول المستخدم");
    return;
  }
  if (users.find(u => u.id === id)) {
    alert("هذا الرقم الوظيفي موجود مسبقاً");
    return;
  }
  users.push({ id, name, role, site });
  refreshUsersTable();
  clearUserForm();
}

// حذف مستخدم
function deleteUser(id) {
  if (confirm("هل أنت متأكد من حذف المستخدم؟")) {
    users = users.filter(u => u.id !== id);
    refreshUsersTable();
  }
}

// تحديث جدول المستخدمين
function refreshUsersTable() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.role}</td>
      <td>${u.site}</td>
      <td>
        <button class="action-btn delete" onclick="deleteUser('${u.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // تحديث خيارات إضافة المستخدم
  fillSelect("newUserSite", sites);
}

// تفريغ نموذج إضافة مستخدم
function clearUserForm() {
  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
  document.getElementById("newUserRole").value = "user";
  document.getElementById("newUserSite").value = "";
}

// إضافة موقع جديد
function addSite() {
  const site = document.getElementById("newSite").value.trim();
  if (!site) {
    alert("يرجى إدخال اسم الموقع");
    return;
  }
  if (sites.includes(site)) {
    alert("الموقع موجود مسبقاً");
    return;
  }
  sites.push(site);
  refreshSitesList();
  document.getElementById("newSite").value = "";
}

// تحديث قائمة المواقع
function refreshSitesList() {
  const list = document.getElementById("sitesList");
  list.innerHTML = "";
  sites.forEach(site => {
    const li = document.createElement("li");
    li.textContent = site;
    list.appendChild(li);
  });
}

// إضافة نوع ذبيحة جديد
function addAnimal() {
  const animal = document.getElementById("newAnimal").value.trim();
  if (!animal) {
    alert("يرجى إدخال نوع ذبيحة");
    return;
  }
  if (animals.includes(animal)) {
    alert("نوع الذبيحة موجود مسبقاً");
    return;
  }
  animals.push(animal);
  refreshAnimalsList();
  document.getElementById("newAnimal").value = "";
}

// تحديث قائمة أنواع الذبائح
function refreshAnimalsList() {
  const list = document.getElementById("animalsList");
  list.innerHTML = "";
  animals.forEach(animal => {
    const li = document.createElement("li");
    li.textContent = animal;
    list.appendChild(li);
  });
  fillSelect("priceAnimal", animals);
  fillSelect("animalType", animals);
}

// إضافة نوع تقطيع جديد
function addCutting() {
  const cutting = document.getElementById("newCutting").value.trim();
  if (!cutting) {
    alert("يرجى إدخال نوع تقطيع");
    return;
  }
  if (cuttings.includes(cutting)) {
    alert("نوع التقطيع موجود مسبقاً");
    return;
  }
  cuttings.push(cutting);
  refreshCuttingsList();
  document.getElementById("newCutting").value = "";
}

// تحديث قائمة أنواع التقطيع
function refreshCuttingsList() {
  const list = document.getElementById("cuttingsList");
  list.innerHTML = "";
  cuttings.forEach(cutting => {
    const li = document.createElement("li");
    li.textContent = cutting;
    list.appendChild(li);
  });
  fillSelect("priceCutting", cuttings);
  fillSelect("cuttingType", cuttings);
}

// تعيين سعر جديد
function setPrice() {
  const animal = document.getElementById("priceAnimal").value;
  const cutting = document.getElementById("priceCutting").value;
  const priceVal = parseFloat(document.getElementById("priceValue").value);

  if (!animal || !cutting || isNaN(priceVal) || priceVal <= 0) {
    alert("يرجى إدخال بيانات صحيحة للسعر");
    return;
  }

  if (!prices[animal]) {
    prices[animal] = {};
  }
  prices[animal][cutting] = priceVal;

  alert(`تم تعيين سعر ${priceVal} لـ ${animal} - ${cutting}`);

  document.getElementById("priceValue").value = "";
}

// البحث عن بيانات المتعامل بناءً على رقم التليفون
function lookupClient() {
  const phone = document.getElementById("phone").value.trim();
  if (!phone) {
    return;
  }
  const found = invoices.find(inv => inv.phone === phone);
  if (found) {
    document.getElementById("clientName").value = found.clientName;
  } else {
    document.getElementById("clientName").value = "";
  }
}

// تفريغ بيانات إدخال البيانات
function clearDataEntryForm() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
  document.getElementById("phone").value = "";
  document.getElementById("clientName").value = "";
  document.getElementById("animalType").selectedIndex = 0;
  document.getElementById("cuttingType").selectedIndex = 0;
  document.getElementById("animalNumber").selectedIndex = 0;
  document.getElementById("stickerNumber").selectedIndex = 0;
  document.getElementById("quantity").selectedIndex = 0;
  document.getElementById("unitPrice").value = "";
  document.getElementById("totalPrice").value = "";
  document.querySelector('input[name="paymentType"][value="كاش"]').checked = true;
}

// حفظ بيانات الفاتورة
function saveData() {
  if (!currentUser) {
    alert("يرجى تسجيل الدخول أولاً");
    return;
  }

  // لو المستخدم مش أدمن، الموقع يثبت على موقعه
