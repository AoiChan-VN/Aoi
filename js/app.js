// Dùng dữ liệu trực tiếp trong file này để đảm bảo 100% không lỗi kết nối
const DATA = {
    categories: [
        {
            id: 1, name: "Khởi đầu", color: "#bc85ff",
            items: [
                { id: "1.1", title: "Hệ thế giới này", desc: "Tổng quan về thế giới, con người và những quy luật cơ bản chi phối thực tại.", content: "Nội dung bài viết chi tiết..." },
                { id: "1.2", title: "Con đường thức tỉnh", desc: "Những dấu hiệu, giai đoạn và trải nghiệm trên hành trình thức tỉnh.", content: "Thức tỉnh không phải là một đích đến, mà là một hành trình quay về bản chất thật của bạn." },
                { id: "1.3", title: "Tâm trí và nhận thức", desc: "Hiểu về tâm trí, niềm tin, bản ngã và cách chúng ta tạo ra thực tại.", content: "Tâm trí là công cụ mạnh mẽ..." }
            ]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-render');
    grid.innerHTML = DATA.categories.map(cat => `
        <div class="section-header"><span style="color:${cat.color}">✦</span> ${cat.id}. ${cat.name}</div>
        <div class="card-grid">
            ${cat.items.map(item => `
                <div class="premium-card" onclick="openPost('${item.id}', '${item.title}', '${item.content}')">
                    <div class="card-img-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div class="card-title">${item.id}. ${item.title}</div>
                    <p class="card-desc">${item.desc}</p>
                    <div style="color:var(--accent); font-size:0.75rem; margin-top:16px;">Chi tiết ></div>
                </div>
            `).join('')}
        </div>
    `).join('');
});

function openPost(id, title, content) {
    const box = document.getElementById('detail-box');
    box.style.display = 'block';
    box.innerHTML = `
        <div style="display:flex; justify-content:space-between; color:var(--accent); font-family:monospace; font-size:0.85rem;">
            <span># ${id}. ${title}</span>
            <span style="cursor:pointer; color:var(--text-dim)" onclick="this.parentElement.parentElement.style.display='none'">✕</span>
        </div>
        <h1 style="font-size:2.5rem; margin:16px 0; font-weight:700;">${title}</h1>
        <div class="progress-line"><div class="progress-fill"></div></div>
        <p style="font-size:1.1rem; line-height:1.8; color:var(--text-main); font-style:italic;">"${content}"</p>
    `;
    box.scrollIntoView({ behavior: 'smooth' });
}
