import { products } from './products.js';

// Button Navigation
const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      // Активна кнопка
      navItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      // Показати відповідний блок
      const target = item.getAttribute("data-target");
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === target) {
          section.classList.add("active");
        }
      });
    });
});



// За замовчуванням активний профіль
const loyaltyData = {
  levels: [
    { name: "Basic", min: 0, max: 10000 },
    { name: "Medium", min: 10000, max: 30000 },
    { name: "Pro", min: 30000, max: 50000 }
  ],
  currentPoints: 150000
};

function updateLoyaltyUI() {
  const { levels, currentPoints } = loyaltyData;
  const title = document.getElementById("loyalty-level");
  const points = document.getElementById("points-earned");
  const progressBar = document.getElementById("progress-bar");
  const pointsLeft = document.getElementById("points-left");

  if (!title || !points || !progressBar || !pointsLeft) {
    console.warn("Loyalty UI elements not found.");
    return;
  }

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (currentPoints >= levels[i].min) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
    }
  }

  title.innerText = currentLevel.name;

  if (nextLevel) {
    const progress = ((currentPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100;
    progressBar.style.width = `${progress}%`;
    points.innerText = `${currentPoints}`;
    const needed = nextLevel.min - currentPoints;
    pointsLeft.innerText = `Need ${needed} more points to reach ${nextLevel.name}`;
  } else {
    progressBar.style.width = "100%";
    points.innerText = `${currentPoints} (Max level)`;
    pointsLeft.innerText = `You have reached the maximum level`;
  }
}
document.addEventListener("DOMContentLoaded", updateLoyaltyUI);


//  Page loader 
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");

  function activateSection(targetId) {
    // Перемикаємо активну кнопку
    navItems.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.target === targetId);
    });

    // Перемикаємо контент
    contentSections.forEach(section => {
      section.style.display = section.id === targetId ? "block" : "none";
    });
  }

    // Обробник кліків по кнопках
  navItems.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
        activateSection(target);
    });
  });

    // ✅ Відкрити автоматично "Personal account"
    activateSection("profile");
});

  //DELIVERY
document.addEventListener("DOMContentLoaded", () => {
  const deliveryElement = document.getElementById("delivery-date");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);

  const day = tomorrow.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  const month = monthNames[tomorrow.getMonth()];

  deliveryElement.innerHTML = `We'll deliver in<br />${day} ${month} 10:00 – 22:00`;
});

  //RECOMMENDATIONS
function getRandomProducts(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
  
function renderRecommendations() {
  const container = document.getElementById('recommendation-list');
  if (!container) return;

  const randomProducts = getRandomProducts(products, 4);

  randomProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'recommend-card';
    card.innerHTML = `
      <div class="card-top">
        <button class="like-btn">♡</button>
      </div>
      <img src="${product.image}" alt="${product.title}" class="product-img">
      <p class="product-category">${product.category}</p>
      <h3 class="product-title">${product.title}</h3>
      <div class="card-bottom">
        <a href="#" class="go-btn">Go to</a>
        <span class="product-price">${product.price}₴</span>
      </div>
    `;
    container.appendChild(card);
  });
}
  
document.addEventListener('DOMContentLoaded', renderRecommendations);

