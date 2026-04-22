document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            renderContent(data.categories);
        });
});

function renderContent(categories) {
    const container = document.getElementById('content-area');
    container.innerHTML = categories.map(cat => `
        <div style="margin-bottom: 40px;">
            <div class="section-title">
                <span style="color:${cat.color}">●</span> ${cat.id}. ${cat.name}
            </div>
            <div class="grid">
                ${cat.items.map(item => `
                    <div class="card" onclick="showDetail('${item.id}', '${item.title}', '${item.content}')">
                        <div class="card-id">${item.id}. ${item.title}</div>
                        <p class="card-desc">${item.desc}</p>
                        <div style="color:#58a6ff; font-size:0.7rem; margin-top:15px;">Chi tiết ></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function showDetail(id, title, content) {
    const view = document.getElementById('detail-view');
    view.style.display = 'block';
    view.innerHTML = `
        <div style="color:#58a6ff; font-family:monospace; margin-bottom:10px;"># ${id}. ${title}</div>
        <h1 style="font-size:2rem; margin-bottom:10px;">${title}</h1>
        <div class="progress-bg"><div class="progress-bar"></div></div>
        <p style="line-height:1.8; color:#c9d1d9; font-style:italic;">${content}</p>
    `;
    view.scrollIntoView({ behavior: 'smooth' });
}
