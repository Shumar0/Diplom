import { products } from './products.js';

console.log(products);

const selectedFilters = {
  brand: [],
  minPrice: 0,
  maxPrice: Infinity,
  available: false
};

const perPage = 5;

const minSlider = document.getElementById('min-price');
const maxSlider = document.getElementById('max-price');
const minLabel = document.getElementById('min-price-label');
const maxLabel = document.getElementById('max-price-label');
const track = document.querySelector('.slider-track');

const prices = products.map(p => parseInt(p.price));
const globalMin = Math.min(...prices);
const globalMax = Math.max(...prices);
const priceGap = 1000;

minSlider.min = maxSlider.min = globalMin;
minSlider.max = maxSlider.max = globalMax;
minSlider.value = globalMin;
maxSlider.value = globalMax;

minLabel.textContent = globalMin;
maxLabel.textContent = globalMax;

function updateSelectedFilters() {
  selectedFilters.brand = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
  selectedFilters.minPrice = parseInt(minSlider.value);
  selectedFilters.maxPrice = parseInt(maxSlider.value);
  selectedFilters.available = document.getElementById('availability-checkbox')?.checked || false;
}

function updateCatalogHeader(filteredProducts, selectedBrands, minPrice, maxPrice, isInStockChecked) {
  const count = filteredProducts.length;
  const uniqueCategories = [...new Set(filteredProducts.map(p => p.category))];
  document.getElementById('product-count').innerText = `Found ${count} product${count !== 1 ? 's' : ''} in ${uniqueCategories.length} categor${uniqueCategories.length !== 1 ? 'ies' : 'y'}`;

  const activeFiltersContainer = document.getElementById('active-filters');
  activeFiltersContainer.innerHTML = '';

  // Додати бренди
  selectedBrands.forEach(brand => {
    const span = document.createElement('span');
    span.className = 'active-filter';
    span.innerText = brand;
    activeFiltersContainer.appendChild(span);
  });

  // Додати фільтр доступності
  if (isInStockChecked) {
    const span = document.createElement('span');
    span.className = 'active-filter';
    span.innerText = 'In stock';
    activeFiltersContainer.appendChild(span);
  }

  // Додати ціновий діапазон
  const priceSpan = document.createElement('span');
  priceSpan.className = 'active-filter';
  priceSpan.innerText = `₴${minPrice} — ₴${maxPrice}`;
  activeFiltersContainer.appendChild(priceSpan);
}

  
function renderProducts(filtered) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  filtered.forEach(product => {
    const isAvailable = product.available;
    const productHTML = `
        <div class="product-card">
        <div class="product-card" data-id="${product.id}">
          <div class="left-product-block">
            <div class="product-image-block">
              <div class="product-image-slider">
                <img class="product-image" src="${product.image}" alt="${product.title}">
              </div>
              <div class="image-controls">
                <button class="img-btn"></button>
                <button class="img-btn"></button>
                <button class="img-btn"></button>
                <button class="img-btn"></button>
                <button class="img-btn"></button>
              </div>
            </div>
            <div class="product-info-block">
              <div class="product-controls">
                <div class="add-to-fav product-controls-btn"></div>
                <div class="add-to-comp product-controls-btn"></div>
              </div>
              <p class="product-category data-field">${product.category}</p>
              <h3 class="product-name">${product.title}</h3>
              <div class="product-data">
                <div class="chahracteristics-block">
                  <p class="chahracteristic-name data-field">Processor</p>
                  <p class="chahracteristic-name data-field">Screen Size</p>
                  <p class="chahracteristic-name data-field">Video card</p>
                  <p class="chahracteristic-name data-field">RAM</p>
                  <p class="chahracteristic-name data-field">Volume</p>
                </div>
                <div class="chahracteristics-data">
                  <p class="cpu-info data-field">${Array.isArray(product.processor) ? product.processor[0] : product.processor || '—'}</p>
                  <p class="screen-info data-field">${Array.isArray(product.screenSize) ? product.screenSize[0] : product.screenSize || '—'}</p>
                  <p class="gpu-info data-field">${Array.isArray(product.videoCard) ? product.videoCard[0] : product.videoCard || '—'}</p>
                  <p class="ram-info data-field">${Array.isArray(product.ram) ? product.ram[0] : product.ram || '—'}</p>
                  <p class="volume-info data-field">${Array.isArray(product.volume) ? product.volume[0] : product.volume || '—'}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="right-product-block">
            <div class="product-status">
              <div class="status-indicator" style="background-color: ${isAvailable ? 'green' : 'red'};"></div>
              <p class="status-text">${isAvailable ? 'In stock' : 'Out of stock'}</p>
            </div>
            <div class="delivery-block">
              <div class="delivery-icon">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                  <defs>
                  </defs>
                  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                    <path d="M 45 37.605 c -0.254 0 -0.509 -0.048 -0.749 -0.146 l -16.076 -6.494 c -1.024 -0.414 -1.519 -1.58 -1.105 -2.604 c 0.414 -1.024 1.58 -1.519 2.604 -1.105 L 45 33.448 l 36.253 -14.646 L 45 4.157 L 8.747 18.803 l 11.485 4.64 c 1.024 0.414 1.519 1.58 1.105 2.604 c -0.414 1.025 -1.58 1.52 -2.604 1.105 L 2.659 20.657 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 s 0.495 -1.549 1.251 -1.854 L 44.251 0.146 c 0.48 -0.194 1.018 -0.194 1.498 0 l 41.593 16.803 c 0.756 0.306 1.251 1.039 1.251 1.854 s -0.495 1.549 -1.251 1.854 L 45.749 37.46 C 45.509 37.557 45.254 37.605 45 37.605 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 45 90 c -0.393 0 -0.783 -0.116 -1.119 -0.342 C 43.331 89.286 43 88.665 43 88 V 35.605 c 0 -0.815 0.495 -1.549 1.251 -1.854 l 41.593 -16.803 c 0.615 -0.249 1.316 -0.176 1.867 0.196 c 0.552 0.372 0.882 0.993 0.882 1.658 v 52.395 c 0 0.815 -0.495 1.549 -1.251 1.854 L 45.749 89.854 C 45.508 89.952 45.253 90 45 90 z M 47 36.955 v 48.081 l 37.593 -15.187 V 21.768 L 47 36.955 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 45 90 c -0.253 0 -0.508 -0.048 -0.749 -0.146 L 2.659 73.052 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 V 18.803 c 0 -0.665 0.331 -1.286 0.882 -1.658 c 0.55 -0.372 1.251 -0.446 1.867 -0.196 l 16.075 6.495 c 1.024 0.414 1.519 1.58 1.105 2.604 c -0.414 1.025 -1.578 1.52 -2.604 1.105 L 5.408 21.768 v 48.081 L 43 85.035 V 36.955 l -14.825 -5.989 c -1.024 -0.414 -1.519 -1.58 -1.105 -2.604 c 0.414 -1.024 1.58 -1.519 2.604 -1.105 l 16.076 6.494 C 46.505 34.057 47 34.79 47 35.605 V 88 c 0 0.665 -0.33 1.286 -0.882 1.658 C 45.783 89.884 45.393 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 28.924 53.036 c -0.253 0 -0.507 -0.048 -0.749 -0.146 l -9.441 -3.813 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 V 25.297 c 0 -0.815 0.495 -1.549 1.251 -1.854 L 60.326 6.64 c 0.48 -0.194 1.018 -0.194 1.498 0 l 9.441 3.814 c 0.756 0.306 1.251 1.039 1.251 1.854 s -0.495 1.549 -1.251 1.854 L 30.924 30.46 v 20.576 c 0 0.665 -0.331 1.286 -0.881 1.658 C 29.708 52.92 29.317 53.036 28.924 53.036 z M 21.483 45.874 l 5.441 2.198 v -18.96 c 0 -0.815 0.495 -1.549 1.251 -1.854 l 37.002 -14.948 l -4.103 -1.657 L 21.483 26.646 V 45.874 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 52.372 78.616 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.024 0.081 -2.189 1.105 -2.604 l 9.44 -3.813 c 1.025 -0.411 2.19 0.081 2.604 1.105 c 0.414 1.024 -0.081 2.189 -1.105 2.604 l -9.44 3.813 C 52.875 78.568 52.621 78.616 52.372 78.616 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 52.372 71.526 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.023 0.081 -2.189 1.105 -2.604 l 9.44 -3.814 c 1.025 -0.411 2.19 0.081 2.604 1.105 c 0.414 1.023 -0.081 2.189 -1.105 2.604 l -9.44 3.814 C 52.875 71.479 52.621 71.526 52.372 71.526 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <path d="M 52.372 64.436 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.024 0.081 -2.189 1.105 -2.604 l 9.44 -3.813 c 1.025 -0.412 2.19 0.081 2.604 1.105 c 0.414 1.024 -0.081 2.189 -1.105 2.604 l -9.44 3.813 C 52.875 64.388 52.621 64.436 52.372 64.436 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,122,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                  </g>
                  </svg>
              </div>
              <p class="delivery-data">Delivery: ${product.delivery}</p>
            </div>
            <div class="price-block">
              <h3 class="product-price">${product.price}₴</h3>
              <div class="bonuses-block">
                <p class="bonuses-amount">+${product.bonus}</p>
                <p>bonuses</p>
              </div>
            </div>
            <button class="add-to-cart" ${!isAvailable ? 'disabled style="background-color: #ccc; cursor: not-allowed;"' : ''}>
              ${isAvailable ? 'Into a basket' : 'Not available'}
            </button>
          </div>
        </div>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', productHTML);
  });
  list.addEventListener('click', function (e) {
    const card = e.target.closest('.product-card');
    if (!card) return; // Якщо елемент не є картою продукту, не робимо нічого.
    
    // Перевірка, чи не натиснуто на кнопку
    if (e.target.closest('button')) return;
  
    // Перевірка, чи не вибрано текст
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
  
    // Отримуємо ID товару
    const id = card.dataset.id;
    window.location.href = `product_page.html?id=${id}`;
  });
  
}

function filterProducts(page) {
  updateSelectedFilters();
  const filtered = products.filter(product => {
    const price = parseInt(product.price);
    const matchesAvailability = !selectedFilters.available || product.available;
    return (
      (selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand)) &&
      price >= selectedFilters.minPrice &&
      price <= selectedFilters.maxPrice &&
      matchesAvailability
    );
  });
  updateCatalogHeader(
    filtered,
    selectedFilters.brand,
    selectedFilters.minPrice,
    selectedFilters.maxPrice,
    document.getElementById('availability-checkbox').checked
  );
  showPage(page, filtered);
}

function showPage(page, productsToRender) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageProducts = productsToRender.slice(start, end);
  renderProducts(pageProducts);

  const totalPages = Math.ceil(productsToRender.length / perPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.className = 'page-item' + (i === page ? ' active' : '');
    button.textContent = i;
    button.addEventListener('click', () => {
      showPage(i, productsToRender);
    });
    pagination.appendChild(button);
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function updateSliderTrack() {
  const min = parseInt(minSlider.value);
  const max = parseInt(maxSlider.value);
  const percentMin = ((min - globalMin) / (globalMax - globalMin)) * 100;
  const percentMax = ((max - globalMin) / (globalMax - globalMin)) * 100;
  track.style.background = `linear-gradient(to right, #ddd ${percentMin}%, #007AFF ${percentMin}%, #007AFF ${percentMax}%, #ddd ${percentMax}%)`;
}

function onSliderChange(event) {
  let minVal = parseInt(minSlider.value);
  let maxVal = parseInt(maxSlider.value);

  if (maxVal - minVal < priceGap) {
    if (event.target === minSlider) {
      minSlider.value = maxVal - priceGap;
      minVal = maxVal - priceGap;
    } else {
      maxSlider.value = minVal + priceGap;
      maxVal = minVal + priceGap;
    }
  }

  minLabel.textContent = minVal;
  maxLabel.textContent = maxVal;
  updateSliderTrack();
  filterProducts(1);
}

[minSlider, maxSlider].forEach(slider => {
  slider.addEventListener('input', onSliderChange);
});

updateSliderTrack();

// Події для чекбоксів
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    filterProducts(1);
  });
});

// Події для розкриття фільтрів
document.querySelectorAll('.filter-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.filter-group').classList.toggle('open');
  });
});

filterProducts(1);
