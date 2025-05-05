function displayBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  // Перевірка на наявність window.productTitle
  if (window.productTitle) {
    console.log(`Displaying breadcrumb with product title: ${window.productTitle}`);
  } else {
    console.log('No product title in window.productTitle');
  }

  // Отримуємо поточний URL
  const pathArray = window.location.pathname.split("/").filter(Boolean); // Розбиваємо URL на частини
  const baseUrl = window.location.origin; // Базовий URL

  // Початковий HTML для breadcrumb
  let html = `<a href="main_page.html">Main</a>`;

  // Додаємо кожен етап шляху
  let currentPath = baseUrl;

  pathArray.forEach((part, index) => {
    currentPath += `/${part}`;
    const title = getPageTitleFromUrl(part); // Отримуємо title для поточної частини URL

    // Якщо це останній етап, показуємо його як поточний (неактивний лінк)
    if (index === pathArray.length - 1) {
      // Перевірка на продукт
      if (window.productTitle) {
        html += `<span class="separator">›</span><span class="current">${window.productTitle}</span>`;
      } else {
        html += `<span class="separator">›</span><span class="current">${title}</span>`;
      }
    } else {
      html += `<span class="separator">›</span><a href="${currentPath}">${title}</a>`;
    }
  });

  // Вставляємо HTML в контейнер breadcrumb
  breadcrumb.innerHTML = html;
}

// Функція для отримання заголовка сторінки на основі її шляху
function getPageTitleFromUrl(urlPart) {
  // Перевіряємо, чи є метатег для кожної сторінки
  const metaTag = document.querySelector(`meta[name="breadcrumb-title"][content="${urlPart}"]`);
  
  if (metaTag) {
    return metaTag.getAttribute('content'); // Якщо є метатег для цього шляху
  }

  // Якщо метатег відсутній, отримуємо стандартний заголовок сторінки через document.title
  return document.title || decodeURIComponent(urlPart);
}

// Автоматичний виклик при завантаженні сторінки
document.addEventListener("DOMContentLoaded", displayBreadcrumb);
