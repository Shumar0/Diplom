import { products } from './products.js';

console.log(products);

const toggleBtn = document.getElementById('edit-toggle');
  const viewMode = document.getElementById('view-mode');
  const editMode = document.getElementById('edit-mode');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  const nameField = document.getElementById('full-name');
  const addressField = document.getElementById('address');

  const nameValue = document.getElementById('name-value');
  const addressValue = document.getElementById('address-value');

  toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    nameField.value = nameValue.textContent;
    addressField.value = addressValue.textContent;
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
  });

  saveBtn.addEventListener('click', function() {
    nameValue.textContent = nameField.value;
    addressValue.textContent = addressField.value;
    editMode.style.display = 'none';
    viewMode.style.display = 'block';
  });

  cancelBtn.addEventListener('click', function() {
    editMode.style.display = 'none';
    viewMode.style.display = 'block';
  });

  const dateButtonsContainer = document.getElementById('date-buttons');

// Функція створює 3 дати: сьогодні, завтра, післязавтра
const generateDateButtons = () => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const weekday = weekdays[date.getDay()];

    const btn = document.createElement('button');
    btn.className = 'date-button';
    btn.textContent = `${day} ${month} (${weekday})`;
    btn.dataset.date = date.toISOString().split('T')[0];

    btn.addEventListener('click', () => {
      document.querySelectorAll('.date-button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });

    if (i === 0) btn.classList.add('selected'); // За замовчуванням — сьогодні
    dateButtonsContainer.appendChild(btn);
  }
};

generateDateButtons();


function renderCart() {
    const cartContainer = document.getElementById("list-items");
    cartContainer.innerHTML = "";
  
    const categoryMap = {};
    products.forEach(item => {
      // Пропускаємо товари, яких немає в наявності
      if (!item.available) return;
  
      // Якщо немає кількості — вважаємо, що quantity = 1
      if (item.quantity === undefined) {
        item.quantity = 1;
      }
  
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = [];
      }
      categoryMap[item.category].push(item);
    });
  
    for (const category in categoryMap) {
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "category-header";
  
      const count = categoryMap[category].reduce((acc, item) => acc + item.quantity, 0);
      const total = categoryMap[category].reduce((acc, item) => acc + item.quantity * item.price, 0);
  
      categoryHeader.innerHTML = `<h3>${category}</h3><p>(${count}) ${total}₴</p>`;
      cartContainer.appendChild(categoryHeader);
  
      categoryMap[category].forEach(item => {
        const listItem = document.createElement("div");
        listItem.className = "cart-item";
  
        const oldPrice = Math.round((item.price / 0.9) / 100) * 100;
  
        listItem.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title} ${item.model || ''}</div>
            <div class="cart-item-desc">${item.desc || ''}</div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-price">
              <span class="current-price">${item.price * item.quantity}₴</span><br>
              <span class="old-price">${oldPrice * item.quantity}₴</span>
            </div>
          </div>
        `;
        cartContainer.appendChild(listItem);
      });
    }
    updateSummary();
  }

  function updateSummary() {
    const itemCountEl = document.getElementById("item-count");
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");
  
    let itemCount = 0;
    let subtotal = 0;
  
    products.forEach(item => {
      if (item.available && item.quantity > 0) {
        itemCount += item.quantity;
        subtotal += item.price * item.quantity;
      }
    });
  
    const discount = Math.round(subtotal * 0.1); // Наприклад, 10% знижка
    const total = subtotal - discount;
  
    itemCountEl.textContent = itemCount;
    subtotalEl.textContent = `${subtotal}₴`;
    discountEl.textContent = `-${discount}₴`;
    totalEl.textContent = `${total}₴`;
  }
  
  renderCart();