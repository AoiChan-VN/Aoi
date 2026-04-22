document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data.json'); // Kết nối file JSON nội bộ
        const data = await response.json();
        renderApp(data);
    } catch (error) {
        console.error("Không thể tải dữ liệu:", error);
    }
});

function renderApp(data) {
    const container = document.getElementById('main-content');
    let html = '';

    data.categories.forEach(cat => {
        html += `
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-${cat.icon}-500"></span>
                    ${cat.id}. ${cat.name}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${cat.items.map(item => `
                        <div class="glass-card p-5 cursor-pointer" onclick="showDetail('${item.id}', '${encodeURIComponent(JSON.stringify(item))}')">
                            <img src="${item.image}" class="w-full h-32 object-cover rounded-lg mb-4 bg-gray-800">
                            <h3 class="font-bold mb-1">${item.id}. ${item.title}</h3>
                            <p class="text-sm text-gray-500 line-clamp-2">${item.desc}</p>
                            <div class="mt-4 text-blue-400 text-xs font-semibold">Chi tiết ></div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    });
    container.innerHTML = html;
}

function showDetail(id, itemStr) {
    const item = JSON.parse(decodeURIComponent(itemStr));
    const detailBox = document.getElementById('detail-box');
    
    document.getElementById('detail-id').innerText = id;
    document.getElementById('detail-title').innerText = item.title;
    document.getElementById('detail-content').innerText = item.content;
    
    detailBox.style.display = 'block';
    detailBox.scrollIntoView({ behavior: 'smooth' });
}

function closeDetail() {
    document.getElementById('detail-box').style.display = 'none';
}
 
