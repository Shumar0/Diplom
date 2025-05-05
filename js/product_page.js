import { products } from './products.js';


document.addEventListener("DOMContentLoaded", () => {
  const headingEl = document.getElementById('product-title-heading');
  const priceEl = document.getElementById('product-price');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'), 10);
  const product = products.find(p => p.id === productId);

  if (!product) {
    headingEl.textContent = "Product not found";
    document.title = "Product not found";
    return;
  }

  loadReviews(product.id);

  document.getElementById('productName').textContent = product.name;
  document.getElementById('productPrice').textContent = `${product.price.toLocaleString()}₴`;
  document.getElementById('productBonus').textContent = `${product.bonus}`;
  document.getElementById('productDelivery').textContent = product.delivery;
  document.getElementById('productAvailability').textContent = product.available ? 'In stock' : 'Out of stock';

  const orderButton = document.querySelector('.order-button');
  
  if (!product.available) {
  orderButton.disabled = true;
  orderButton.textContent = 'Not available';
  orderButton.classList.add('disabled');
    }

  headingEl.textContent = `Buy ${product.title}`;
  document.title = `Buy ${product.title}`;
  priceEl.textContent = `From ${product.price} ₴`;

  window.productTitle = product.title;
  displayBreadcrumb();

  // Рендер зображення
  const imgEl = document.getElementById('product-image');
  if (imgEl && product.image) {
    imgEl.src = product.image;
  }

    // Знаходимо контейнер
    const container = document.querySelector('.inner-container');

    // Створюємо елемент зображення
    const img = document.createElement('img');
    img.src = product.imageBaner;
    img.alt = product.name; // на випадок, якщо зображення не завантажиться
    img.classList.add('product-banner'); // для стилізації, за потреби

    // Додаємо зображення в контейнер
    container.appendChild(img);

  // Контейнер для конфігуратора
  const configuratorEl = document.querySelector('.configurator');

  function createConfigBlock(title, subtitle, id, volume, isColor = false) {
    if (!volume || volume.length === 0) return;

    const section = document.createElement('div');
    section.classList.add('config-section');

    const heading = document.createElement('h3');
    heading.innerHTML = `${title} <span>${subtitle}</span>`;
    section.appendChild(heading);

    const options = document.createElement('div');
    options.classList.add('options');
    options.id = id;
    section.appendChild(options);

    renderButtons(options, volume, isColor);

    configuratorEl.appendChild(section);
  }

  // Створюємо лише ті блоки, які є у продукті
  if (Array.isArray(product.models) && product.models.length > 0) {
    createConfigBlock('Model.', 'Which is best for you?', 'model-options', product.models);
  }
  
  if (product.colors && product.colors.length > 0) {
    createConfigBlock('Finish.', 'Pick your favorite', 'color-options', product.colors, true);
  }
  
  if (Array.isArray(product.volume) && product.volume.length > 0) {
    createConfigBlock('Storage.', 'How much space do you need', 'storage-options', product.volume);
  }
  
  if (Array.isArray(product.videoCard) && product.videoCard.length > 0) {
    createConfigBlock('Graphics.', 'Choose your GPU', 'gpu-options', product.videoCard);
  }

  if (Array.isArray(product.screenSize) && product.screenSize.length > 0) {
    createConfigBlock('Screen.', 'Choose your screen size', 'screen-options', product.screenSize);
  }
  

});

function renderButtons(container, values, isColor = false) {
  container.innerHTML = '';
  values.forEach(value => {
    const btn = document.createElement('button');

    if (isColor) {
      btn.style.backgroundColor = value;
      btn.title = value;
    } else {
      btn.textContent = value;
    }

    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    container.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      const target = item.getAttribute("data-target");
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === target) {
          section.classList.add("active");
        }
      });
    });
  });
});

function loadReviews(productId) {
  fetch('./js/reviews.js') // якщо твій файл reviews.json, не .js
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('reviewsContainer');
      container.innerHTML = "";

      const filteredReviews = data.filter(review => review.productId === productId);

      const totalReviews = filteredReviews.length;
      let sum = 0;
      const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      filteredReviews.forEach(review => {
        const r = parseInt(review.rating, 10);
        if (r >= 1 && r <= 5) {
          ratingCount[r]++;
          sum += r;
        }
      });

      const avg = totalReviews ? (sum / totalReviews).toFixed(1) : '0.0';
      document.getElementById('averageScoreText').textContent = `${avg} / 5.0`;

      // Зірки
      const starIcons = document.getElementById('starIcons');
      starIcons.innerHTML = '';

      function getStarSVG(fillPercent = 100) {
      const gradientId = `grad${Math.random().toString(36).substr(2, 9)}`;
      return `
      <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="${fillPercent}%" stop-color="#008CF6"/>
            <stop offset="${fillPercent}%" stop-color="#231F20"/>
          </linearGradient>
        </defs>
        <g transform="translate(1.4 1.4) scale(2.8)">
          <path d="M 47.755 3.765 l 11.525 23.353 c 0.448 0.907 1.313 1.535 2.314 1.681 
                    l 25.772 3.745 c 2.52 0.366 3.527 3.463 1.703 5.241 L 70.42 55.962 
                    c -0.724 0.706 -1.055 1.723 -0.884 2.72 l 4.402 25.667 
                    c 0.431 2.51 -2.204 4.424 -4.458 3.239 L 46.43 75.47 
                    c -0.895 -0.471 -1.965 -0.471 -2.86 0 L 20.519 87.588 
                    c -2.254 1.185 -4.889 -0.729 -4.458 -3.239 l 4.402 -25.667 
                    c 0.171 -0.997 -0.16 -2.014 -0.884 -2.72 L 0.931 37.784 
                    c -1.824 -1.778 -0.817 -4.875 1.703 -5.241 l 25.772 -3.745 
                    c 1.001 -0.145 1.866 -0.774 2.314 -1.681 L 42.245 3.765 
                    C 43.372 1.481 46.628 1.481 47.755 3.765 z" fill="url(#${gradientId})"/>
        </g>
      </svg>`;
      }

      // Динамічні зірки
      for (let i = 1; i <= 5; i++) {
        const fill = Math.min(Math.max(avg - (i - 1), 0), 1);
        const percent = fill * 100;
        starIcons.innerHTML += getStarSVG(percent);
      }


      // Бар граф
      const ratingBars = document.getElementById('ratingBars');
      ratingBars.innerHTML = '';
      for (let i = 5; i >= 1; i--) {
        const percent = totalReviews ? (ratingCount[i] / totalReviews) * 100 : 0;
        ratingBars.innerHTML += `
          <div class="rating-bar">
            <span>${i}</span>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      }

      // --- Заголовок відгуків ---
      const reviewCountEl = document.querySelector('.review-count');
      const productNameEl = document.querySelector('.product-name');
      const productTitle = window.productTitle || 'Product';

      if (reviewCountEl && productNameEl) {
        reviewCountEl.textContent = `${filteredReviews.length} Reviews`;
        productNameEl.textContent = `of ${productTitle}`;
      }

      if (filteredReviews.length === 0) {
        container.innerHTML = "<p>No reviews for this product yet.</p>";
        return;
      }

      // --- Відображення відгуків ---
      filteredReviews.forEach(review => {
        const reviewHTML = `
          <div class="review">
            <div class="review-header">
              <div class="user-initial">${review.user[0]}</div>
              <div class="user-name">${review.user}</div>
            </div>
            <div class="review-section">
              <strong>Advantages</strong>
              <p>${review.advantages}</p>
            </div>
            <div class="review-section">
              <strong>Disadvantages</strong>
              <p>${review.disadvantages}</p>
            </div>
            <div class="review-section">
              <strong>Comment</strong>
              <p>${review.comment}</p>
            </div>
            <hr>
          </div>
        `;
        container.innerHTML += reviewHTML;
      });
    })
    .catch(error => console.error('Error loading reviews:', error));
}
