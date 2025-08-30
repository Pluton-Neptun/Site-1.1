// Путь к файлу: netlify/functions/get-data.js

import { neon } from '@netlify/neon';

// Эта функция автоматически найдет вашу базу данных,
// так как Netlify уже добавил переменную окружения NETLIFY_DATABASE_URL
const sql = neon();

export const handler = async (event, context) => {
  try {
    // Выполняем SQL-запрос к вашей таблице.
    // Замените 'posts' на имя вашей таблицы.
    const posts = await sql`SELECT * FROM posts`;

    // Возвращаем данные в формате JSON
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };

  } catch (error) {
    // В случае ошибки возвращаем сообщение об ошибке
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Не удалось получить данные' }),
    };
  }
};