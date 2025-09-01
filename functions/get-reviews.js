// functions/get-reviews.js
import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async (event, context) => {
  try {
    const reviews = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;

    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Не удалось получить отзывы' }),
    };
  }
};