import { products } from './products.js';

// Додавання стилів для пошукових результатів і помилки
const style = document.createElement('style');
style.innerHTML = `
    /* Стилі для результатів пошуку */
#search-results {
    margin-top: 20px;
    position: absolute;
    top: 60px;
    left: 70%;
    transform: translateX(-50%);
    width: 400px;
    z-index: 1000;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: none;
    max-height: auto;
    overflow-y: auto;
    border-radius: var(--border-radius);
}

.search-result-item {
    display: flex;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: var(--border-radius);
    background: white;
    transition: background 0.2s;
    align-items: center;
}

.search-result-item img {
    width: 80px;
    height: auto;
    margin-right: 10px;
    object-fit: contain;
}

.search-result-item h3 {
    margin: 0;
    font-size: 16px;
}

.search-result-item p {
    margin: 5px 0 0;
    color: #555;
    font-size: 14px;
}

/* Лінія розділення */
.result-separator {
    border: 0;
    border-top: 2px solid #ADACAC;
    margin: 10px 0;
    width: 100%;
}

/* Стиль помилки */
.input-error {
    border: 2px solid red !important;
    outline: none;
    border-radius: var(--border-radius);
}
`;
document.head.appendChild(style);

// Функція пошуку
export function search() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('search-results');

    if (!searchTerm) {
        searchInput.classList.add('input-error');
        resultsContainer.innerHTML = '<p>Введіть текст для пошуку.</p>';
        resultsContainer.style.display = 'block';
        return;
    } else {
        searchInput.classList.remove('input-error');
    }

    const searchResults = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );

    displaySearchResults(searchResults);
}

// Функція для відображення результатів пошуку
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Товари не знайдено.</p>';
    } else {
        results.forEach((product, index) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
    
            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.title;
    
            const textContainer = document.createElement('div');
            const productTitle = document.createElement('h3');
            productTitle.innerText = product.title;
    
            const productPrice = document.createElement('p');
            productPrice.innerText = `${product.price}₴`;
    
            textContainer.appendChild(productTitle);
            textContainer.appendChild(productPrice);
    
            resultItem.appendChild(productImage);
            resultItem.appendChild(textContainer);
    
            resultItem.onclick = () => {
                resultsContainer.style.display = 'none';
                window.location.href = `product_page.html?id=${product.id}`;
            };
    
            resultsContainer.appendChild(resultItem);
    
            // Додаємо лінію розділення між товарами, але не всередині
            if (index < results.length - 1) {
                const separator = document.createElement('hr');
                separator.classList.add('result-separator');
                resultsContainer.appendChild(separator);
            }
        });
    }

    resultsContainer.style.display = 'block';
}

// Події після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton) {
        searchButton.addEventListener('click', search);
    }

    // Видалити червону рамку при введенні
    searchInput.addEventListener('input', () => {
        if (searchInput.classList.contains('input-error') && searchInput.value.trim() !== '') {
            searchInput.classList.remove('input-error');
        }
    });

    // Закриття результатів при кліку поза пошуком
    document.addEventListener('click', (event) => {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        const isClickInsideSearch = event.target.closest('#search-results') ||
            event.target.closest('#search-input') ||
            event.target.closest('#search-button');

        if (!isClickInsideSearch) {
            resultsContainer.style.display = 'none';
        }
    });
});
