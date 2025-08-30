// script.js
document.addEventListener('DOMContentLoaded', () => { 
    // Запрашиваем пост с id=1 для теста
    fetchDataAndDisplay(1);
});

async function fetchDataAndDisplay(postId) {
    const container = document.getElementById('posts-container');

    try {
        // 1. Отправляем запрос, добавив в конец ?id=...
        const response = await fetch(`/.netlify/functions/get-data?id=${postId}`);
        
        // Проверяем, что сервер не вернул ошибку (как 404 или 500)
        if (!response.ok) {
            // response.json() тоже вернет ошибку, которую мы обработаем в catch
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