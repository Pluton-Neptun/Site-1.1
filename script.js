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
  const actor = document.getElementById("raptorActor");
  const btn = document.getElementById("rouletteBtn");
  const phraseEl = document.getElementById("raptorPhrase");
  const numEl = document.getElementById("raptorReactionNum");
  if (!actor || !btn) return;

  const reactions = [
    { cls: "react-1",  phrase: "Бегу срывать куш! 🦖",       title: "Реакция №1: Спринт по полю" },
    { cls: "react-2",  phrase: "Лыжный слалом по сайту! 🎿", title: "Реакция №2: Горные лыжи" },
    { cls: "react-3",  phrase: "Огненный джекпот! 🔥",       title: "Реакция №3: Огонь изо рта" },
    { cls: "react-4",  phrase: "Р-Р-Р! Ставки вверх! 🦖",    title: "Реакция №4: Ярость" },
    { cls: "react-5",  phrase: "Прыжок хищника! ⚡",         title: "Реакция №5: Сальто вверх" },
    { cls: "react-6",  phrase: "Танцуем на профит! 💃",      title: "Реакция №6: Танец победы" },
    { cls: "react-7",  phrase: "Выслеживаю крупный банк...", title: "Реакция №7: Засада" },
    { cls: "react-8",  phrase: "Время инвестиций ₸! 💰",     title: "Реакция №8: Золотой вихрь" },
    { cls: "react-9",  phrase: "Прицел на максимум! 🎯",     title: "Реакция №9: Лазер из глаз" },
    { cls: "react-10", phrase: "Разворот хвостом! 🌪️",       title: "Реакция №10: Удар хвостом" }
  ];

  let deck = [];
  let lastIdx = -1;
  let timer = null;

  function pickNextReaction() {
    if (deck.length === 0) {
      deck = reactions.map((_, i) => i).sort(() => Math.random() - 0.5);
      if (deck[0] === lastIdx) {
        [deck[0], deck[1]] = [deck[1], deck[0]];
      }
    }
    const idx = deck.shift();
    lastIdx = idx;
    return reactions[idx];
  }

  function playReaction(goToRoulette = false) {
    clearTimeout(timer);
    reactions.forEach(r => actor.classList.remove(r.cls));
    void actor.offsetWidth; // сброс анимации

    const current = pickNextReaction();
    actor.classList.add(current.cls);
    phraseEl.textContent = current.phrase;
    numEl.textContent = current.title;

    timer = setTimeout(() => {
      reactions.forEach(r => actor.classList.remove(r.cls));
      if (goToRoulette) {
        window.location.href = "roulette.html";
      }
    }, 2500);
  }

  // Клик по велоцераптору — смена реакции на месте
  actor.addEventListener("click", () => playReaction(false));

  // Клик по кнопке — мощная реакция и переход на лист с барабаном
  btn.addEventListener("click", () => playReaction(true));
}); 