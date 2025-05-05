document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productCatalog');
  const products = Array.from(document.querySelectorAll('.product-card'));
  const sortButtons = document.querySelectorAll('.sort-button');
  const priceButton = document.querySelector('.price-button');

  let priceAscending = true;
  let activeButton = null; // Запам'ятовуємо активну кнопку

  // Встановити статус наявності
  products.forEach(product => {
    const isInStock = product.getAttribute('data-stock') === "true";
    const statusCircle = product.querySelector('.status-circle');
    const stockText = product.querySelector('.stock-text');

    if (isInStock) {
      statusCircle.style.backgroundColor = 'green';
      stockText.textContent = 'In stock';
    } else {
      statusCircle.style.backgroundColor = 'red';
      stockText.textContent = 'Out of stock';
    }
  });

  // Фільтрація
  function filterInStock() {
    products.forEach(product => {
      const isInStock = product.getAttribute('data-stock') === "true";
      product.style.display = isInStock ? 'flex' : 'none';
    });
  }

  function filterSpecialOffer() {
    products.forEach(product => {
      const isSpecial = product.getAttribute('data-special') === "true";
      product.style.display = isSpecial ? 'flex' : 'none';
    });
  }

  function filterMostNew() {
    products.forEach(product => {
      const isNew = product.getAttribute('data-new') === "true";
      product.style.display = isNew ? 'flex' : 'none';
    });
  }

  function showAllProducts() {
    products.forEach(product => {
      product.style.display = 'flex';
    });
  }

  // Сортування
  function sortProducts(ascending = true) {
    const visibleProducts = [...products].filter(product => product.style.display !== 'none');
    const sorted = visibleProducts.sort((a, b) => {
      const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/[^\d]/g, ''));
      const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/[^\d]/g, ''));
      return ascending ? priceA - priceB : priceB - priceA;
    });

    productsContainer.innerHTML = '';
    sorted.forEach(product => productsContainer.appendChild(product));
  }

  // Обробка натискання кнопок
  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Якщо це кнопка ціни (її обробляємо окремо)
      if (button.classList.contains('price-button')) {
        showAllProducts(); // Завжди показуємо всі продукти перед сортуванням
        sortProducts(priceAscending);
        priceButton.textContent = priceAscending ? 'Price ▲' : 'Price ▼';
        priceAscending = !priceAscending;
        sortButtons.forEach(btn => {
          if (!btn.classList.contains('price-button')) {
            btn.classList.remove('active');
          }
        });
        priceButton.classList.add('active');
        return;
      }

      // Якщо повторно натиснули ту саму кнопку (НЕ Price)
      if (activeButton === button) {
        showAllProducts();
        sortButtons.forEach(btn => btn.classList.remove('active'));
        activeButton = null;
        return;
      }

      // Якщо натиснули іншу кнопку
      sortButtons.forEach(btn => {
        if (!btn.classList.contains('price-button')) {
          btn.classList.remove('active');
        }
      });
      button.classList.add('active');
      activeButton = button;

      // Фільтрація
      if (button.textContent.includes('In stock')) {
        filterInStock();
      } else if (button.textContent.includes('Special offer')) {
        filterSpecialOffer();
      } else if (button.textContent.includes('Most New')) {
        filterMostNew();
      }
    });
  });
});
