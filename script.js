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





  
