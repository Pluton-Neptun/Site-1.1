// script.js

// Сразу после загрузки страницы запускаем функцию, чтобы получить данные
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndDisplay();
});

// Асинхронная функция для получения и отображения данных
async function fetchDataAndDisplay() {
    // Находим контейнер на странице
    const container = document.getElementById('posts-container');

    try {
        // 1. Отправляем запрос на адрес нашей серверной функции
        const response = await fetch('/.netlify/functions/get-data');
        
        // 2. Преобразуем ответ из формата JSON в JavaScript-объект
        const posts = await response.json();

        // Очищаем контейнер от надписи "Загрузка..."
        container.innerHTML = '';

        // 3. Отображаем данные на странице
        posts.forEach(post => {
            // Предполагая, что в вашей таблице `posts` есть колонка `title`
            const postElement = document.createElement('p');
            postElement.textContent = post.title; // Замените 'title' на имя вашей колонки
            container.appendChild(postElement);
        });

    } catch (error) {
        // Если произошла ошибка, выводим ее в контейнер
        container.innerHTML = 'Не удалось загрузить данные.';
        console.error('Ошибка при получении данных:', error);
    }
}