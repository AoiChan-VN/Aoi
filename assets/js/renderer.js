export async function renderContent() {
    const products = [
        { t: "Aoi Core", d: "Plugin tối ưu hóa hệ thống v1.0", s: "Ready" },
        { t: "Galaxy RPG", d: "Game thế giới mở chuẩn 2026", s: "Dev" }
    ];

    const grid = document.getElementById('products');
    if(grid) {
        grid.innerHTML = products.map(p => `
            <div class="card">
                <h3 style="color: #ff007a">${p.t}</h3>
                <p>${p.d}</p>
                <small style="opacity: 0.5">Status: ${p.s}</small>
            </div>
        `).join('');
    }

    // Tự động load file Markdown
    const viewer = document.getElementById('md-viewer');
    try {
        const res = await fetch('./content/intro.md');
        const text = await res.text();
        if(window.marked) viewer.innerHTML = marked.parse(text);
        else viewer.innerText = text;
    } catch (e) { viewer.innerHTML = "Chưa có dữ liệu bài viết."; }
}
