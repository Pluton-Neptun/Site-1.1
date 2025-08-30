// functions/get-data.js
import { neon } from '@netlify/neon';

const sql = neon(); 

export const handler = async (event, context) => {
  try {
    // 1. Получаем 'id' из параметров URL запроса
    const postId = event.queryStringParameters.id;

    // 2. Если 'id' не был передан, возвращаем ошибку
    if (!postId) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ error: 'ID поста не указан' }),
      };
    }

    // 3. Выполняем SQL-запрос с полученным 'id'
    const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
    
    // Если пост с таким id не найден, posts будет пустым массивом
    if (posts.length === 0) {
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({ error: 'Пост не найден' }),
      };
    }
    
    // 4. Возвращаем найденный пост (первый элемент массива)
    return {
      statusCode: 200,
      body: JSON.stringify(posts[0]),
    };

  } catch (error) {
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: 'Не удалось получить данные' }),
    };
  }
};