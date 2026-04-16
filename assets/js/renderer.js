export async function renderProducts() {
    // Dữ liệu sản phẩm (Có thể tách ra file JSON nếu nhiều)
    const products = [
        { name: "Aoi Core", desc: "Plugin tối ưu hóa hệ thống", tags: ["Java", "Performance"] },
        { name: "Star Dust", desc: "Game RPG phong cách Nebula", tags: ["C#", "Unity"] },
        { name: "Cosmo Ads", desc: "Hệ thống quảng cáo thông minh", tags: ["JS", "Ads"] }
    ];

    const container = document.getElementById('product-grid');
    if(container) {
        container.innerHTML = products.map(p => `
            <div class="card">
                <div class="card-glow"></div>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="tags">${p.tags.map(t => `<span>#${t}</span>`).join('')}</div>
            </div>
        `).join('');
    }

    // Tự động load Markdown vào Viewer
    loadMarkdown();
}

async function loadMarkdown() {
    const viewer = document.getElementById('md-viewer');
    try {
        const res = await fetch('./content/intro.md');
        const text = await res.text();
        // Sử dụng marked (đã thêm vào index.html trước đó)
        if (window.marked) {
            viewer.innerHTML = marked.parse(text);
        } else {
            viewer.innerText = text;
        }
    } catch (e) {
        console.error("Markdown error:", e);
    }
}
