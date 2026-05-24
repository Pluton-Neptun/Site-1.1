// table.js
document.addEventListener('DOMContentLoaded', () => {
    loadApplications();
});

async function loadApplications() {
    const tbody = document.querySelector('.styled-table tbody');
    
    try {
        const response = await fetch('/.netlify/functions/get-apps');
        if (!response.ok) throw new Error('Ошибка при загрузке данных');
        
        const apps = await response.json();
        
        // Очищаем статичные пустые строки, которые мы написали в HTML
        tbody.innerHTML = '';

        // Заполняем таблицу реальными данными из базы
        apps.forEach(app => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.name || '—'}</td>
                <td>${app.price ? app.price + ' ₸' : '—'}</td>
            `;
            tbody.appendChild(tr);
        });

        // Если заявок в базе меньше 20, дорисовываем пустые строки для красоты
        const emptyRowsNeeded = 20 - apps.length;
        for (let i = 0; i < emptyRowsNeeded; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>&nbsp;</td><td>&nbsp;</td>`;
            tbody.appendChild(tr);
        }

    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;">Ошибка загрузки данных</td></tr>';
    }
}