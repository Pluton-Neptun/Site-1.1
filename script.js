// Находим заголовок h1 на странице
const heading = document.querySelector('h1');

// Добавляем обработчик события клика
heading.addEventListener('click', () => {
    alert('Вы кликнули на заголовок!');
});