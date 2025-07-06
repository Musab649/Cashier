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
