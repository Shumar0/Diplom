let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const slideIndicator = document.getElementById('slide-indicator');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  updateSlideIndicator();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function updateSlideIndicator() {
  slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// Автоматичне перемикання кожні 5 секунд
setInterval(nextSlide, 5000);

// Кнопки ручного перемикання
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Показуємо індикатор при завантаженні
updateSlideIndicator();
