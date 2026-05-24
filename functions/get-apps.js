// functions/get-apps.js
import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async (event, context) => {
  try {
    // Берем из базы только имя и цену, сортируем по новизне
    const apps = await sql`SELECT name, price FROM applications ORDER BY id DESC LIMIT 20`;

    return {
      statusCode: 200,
      body: JSON.stringify(apps),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Не удалось загрузить список участников' }),
    };
  }
};