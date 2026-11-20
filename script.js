// script.js
// script.js

// Сразу после загрузки страницы запускаем обе функции:
// одну для получения поста, другую для получения отзывов.
document.addEventListener('DOMContentLoaded', () => {
    // Запрашиваем пост с id=1 для теста
    fetchDataAndDisplay(1);
    // Добавляем вызов новой функции для отзывов
    fetchReviewsAndDisplay();
});

// --- Функция для загрузки одного поста ---
async function fetchDataAndDisplay(postId) {
    const container = document.getElementById('posts-container');

    try {
        // 1. Отправляем запрос, добавив в конец ?id=...
        const response = await fetch(`/.netlify/functions/get-data?id=${postId}`);

        // Проверяем, что сервер не вернул ошибку (как 404 или 500)
        if (!response.ok) { 
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }

        // 2. Получаем ОДИН пост (уже не массив)
        const post = await response.json();

        container.innerHTML = '';

        // 3. Отображаем данные одного поста
        const postElement = document.createElement('h2'); // Сделаем заголовок побольше
        // Снова предполагаем, что у вас есть колонка 'title'
        postElement.textContent = post.title;
        container.appendChild(postElement);

    } catch (error) {
        container.innerHTML = `Ошибка: ${error.message}`;
        console.error('Ошибка при получении данных:', error);
    }
}

// --- Новая функция для загрузки отзывов ---
async function fetchReviewsAndDisplay() {
    const container = document.getElementById('reviews-container');
    try {
        const response = await fetch('/.netlify/functions/get-reviews');
        if (!response.ok) {
            throw new Error('Ошибка сети при загрузке отзывов');
        }
        const reviews = await response.json();

        container.innerHTML = ''; // Очищаем контейнер

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.style.border = '1px solid #ccc';
            reviewElement.style.padding = '10px';
            reviewElement.style.marginBottom = '10px';

            const authorElement = document.createElement('h4');
            authorElement.textContent = review.author_name;

            const textElement = document.createElement('p');
            textElement.textContent = review.review_text;

            reviewElement.appendChild(authorElement);
            reviewElement.appendChild(textElement);
            container.appendChild(reviewElement);
        });

    } catch (error) {
        container.textContent = 'Не удалось загрузить отзывы.';
        console.error(error);
    }
}
// Добавьте этот код в ваш script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Останавливаем перезагрузку страницы

            // Собираем данные из полей формы
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                days: document.getElementById('days').value,
                price: document.getElementById('price').value,
                teamWait: document.getElementById('team-wait').value,
                tournamentType: document.getElementById('tournament-type').value
            };

            try {
                // Отправляем данные в нашу новую Netlify-функцию
                const response = await fetch('/.netlify/functions/submit-app', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Заявка успешно отправлена!');
                    form.reset(); // Очищаем форму после отправки
                } else {
                    alert('Ошибка при отправке заявки.');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось связаться с сервером.');
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("rouletteBtn");
  const raptor = document.getElementById("raptorCompanion");
  const bubble = document.getElementById("raptorBubble");
  if (!btn || !raptor) return;

  const reactions = [
    { cls: "react-run",      text: "Бегу к банку!" },
    { cls: "react-ski",      text: "Лыжный слалом!" },
    { cls: "react-fire",     text: "Огненный куш!" },
    { cls: "react-angry",    text: "Р-Р-Р! Ставки вверх!" },
    { cls: "react-jump",     text: "Сальто хищника!" },
    { cls: "react-dance",    text: "Танцуем на профит!" },
    { cls: "react-stealth",  text: "Охота за джекпотом..." },
    { cls: "react-rich",     text: "Время инвестиций ₸!" },
    { cls: "react-laser",    text: "Лазерный прицел!" },
    { cls: "react-tailwhip", text: "Удар хвостом!" }
  ];

  let deck = [];
  let lastIndex = -1;
  let resetTimer = null;

  // Берём случайную реакцию без повторения предыдущей
  function getNextReaction() {
    if (deck.length === 0) {
      deck = reactions.map((_, i) => i).sort(() => Math.random() - 0.5);
      if (deck[0] === lastIndex) {
        [deck[0], deck[1]] = [deck[1], deck[0]];
      }
    }
    const idx = deck.shift();
    lastIndex = idx;
    return reactions[idx];
  }

  function triggerRaptor(redirectAfter = false) {
    clearTimeout(resetTimer);
    reactions.forEach(r => raptor.classList.remove(r.cls));
    void raptor.offsetWidth; // перезапуск CSS-анимации

    const chosen = getNextReaction();
    raptor.classList.add(chosen.cls);
    bubble.textContent = chosen.text;
    bubble.classList.add("show");

    resetTimer = setTimeout(() => {
      reactions.forEach(r => raptor.classList.remove(r.cls));
      bubble.classList.remove("show");
      if (redirectAfter) {
        window.location.href = "roulette.html";
      }
    }, 2300);
  }

  // Нажатие на велоцераптора — тест реакций прямо на странице
  raptor.addEventListener("click", () => triggerRaptor(false));

  // Нажатие на кнопку — реакция + переход на лист с барабаном
  btn.addEventListener("click", () => triggerRaptor(true));
});




  
