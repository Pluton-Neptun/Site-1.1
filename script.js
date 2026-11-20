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
  if (!btn) return;

  let isLaunching = false;

  btn.addEventListener("click", () => {
    if (isLaunching) return;
    isLaunching = true;

    // 3 крупных самолёта на разной высоте
    const planeHeights = ["8%", "24%", "40%"];
    planeHeights.forEach((topPos, index) => {
      const plane = document.createElement("img");
      plane.src = "images/plane.gif";
      plane.className = "fx-gif-plane";
      plane.style.top = topPos;
      plane.style.animationDelay = `${index * 0.25}s`;
      document.body.appendChild(plane);
    });

    // 4 крупных динозавра бегут по низу экрана
    const dinoConfigs = [
      { bottom: "10px", delay: 0 },
      { bottom: "45px", delay: 0.35 },
      { bottom: "15px", delay: 0.7 },
      { bottom: "55px", delay: 1.05 }
    ];

    dinoConfigs.forEach((cfg) => {
      const dino = document.createElement("img");
      dino.src = "images/dino.gif";
      dino.className = "fx-gif-dino";
      dino.style.bottom = cfg.bottom;
      dino.style.animationDelay = `${cfg.delay}s`;
      document.body.appendChild(dino);
    });

    // Переход на страницу барабана после завершения пролёта
    setTimeout(() => {
      window.location.href = "roulette.html";
    }, 3200);
  });
});