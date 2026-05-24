import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async () => {
  try {
    // Выполняем SQL-запрос на создание таблицы напрямую из кода
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          name TEXT,
          phone TEXT,
          days TEXT,
          price INT,
          team_wait TEXT,
          tournament_type TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return {
      statusCode: 200,
      body: "Супер! Таблица applications успешно создана.",
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: "Ошибка: " + error.message,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    };
  }
};