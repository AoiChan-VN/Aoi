async function initApp() {
    const res = await fetch('./data.json');
    const data = await res.json();
    renderContent(data.categories);

    // Xử lý tìm kiếm
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = data.categories.map(cat => ({
            ...cat,
            items: cat.items.filter(i => i.title.toLowerCase().includes(term))
        }));
        renderContent(filtered);
    });
}

function renderContent(categories) {
    const container = document.getElementById('main-flow');
    container.innerHTML = categories.map(cat => `
        <div class="mb-12">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
                <span style="color: ${cat.color}">✦</span> ${cat.id}. ${cat.name}
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${cat.items.map(item => `
                    <div class="premium-card" onclick="viewDetail('${item.id}', '${encodeURIComponent(JSON.stringify(item))}')">
                        <img src="${item.image}" class="card-icon">
                        <div class="text-sm text-gray-400 mb-1">${item.id}. ${item.title}</div>
                        <p class="text-xs text-gray-500 leading-relaxed">${item.desc}</p>
                        <div class="mt-4 text-blue-400 text-xs">Chi tiết ></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function viewDetail(id, dataStr) {
    const item = JSON.parse(decodeURIComponent(dataStr));
    const detail = document.getElementById('detail-section');
    detail.classList.remove('hidden');
    detail.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <span class="text-blue-400 font-mono"># ${item.id}. ${item.title}</span>
            <button onclick="this.parentElement.parentElement.classList.add('hidden')">✕</button>
        </div>
        <h1 class="text-4xl font-bold mb-6">${item.title}</h1>
        <div class="progress-container"><div class="progress-bar"></div></div>
        <p class="text-gray-300 italic text-lg leading-loose">${item.content}</p>
    `;
    detail.scrollIntoView({ behavior: 'smooth' });
}

initApp();
