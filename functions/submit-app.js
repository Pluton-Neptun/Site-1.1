// functions/submit-app.js
import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async (event, context) => {
  // Разрешаем только POST запросы (для отправки данных)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Получаем данные, которые прислал пользователь из формы
    const data = JSON.parse(event.body);
    const { name, phone, days, price, teamWait, tournamentType } = data;

    // Записываем данные в таблицу приложений/заявок (назовем её applications)
    // Убедитесь, что в вашей базе Neon создана такая таблица
    await sql`
      INSERT INTO applications (name, phone, days, price, team_wait, tournament_type) 
      VALUES (${name}, ${phone}, ${days}, ${Number(price)}, ${teamWait}, ${tournamentType})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Заявка успешно сохранена!' }),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Не удалось сохранить заявку' }),
    };
  }
};