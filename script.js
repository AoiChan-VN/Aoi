const App = {
    // Dữ liệu ngôn ngữ nhúng trực tiếp để không tốn thời gian fetch file .json lúc đầu
    langData: {
        vi: { hero: "Chuyên gia phát triển Plugin & Game", title: "Sản phẩm" },
        en: { hero: "Expert Plugin & Game Developer", title: "Products" }
    },

    init() {
        // 1. Tắt màn hình loading ngay khi DOM sẵn sàng
        const loader = document.getElementById('loader');
        if(loader) loader.style.opacity = '0';
        setTimeout(() => loader?.remove(), 400);

        // 2. Render nhanh dữ liệu tĩnh
        this.renderContent();

        // 3. Trì hoãn các tác vụ nặng (Markdown, hiệu ứng xa)
        window.requestIdleCallback(() => {
            this.loadExtraModules();
        });
    },

    renderContent() {
        const lang = localStorage.getItem('lang') || 'vi';
        document.getElementById('hero-text').innerText = this.langData[lang].hero;
        
        // Render card sản phẩm nhanh từ mảng có sẵn
        const products = [
            { t: "Aoi Plugin", d: "High performance." },
            { t: "Star Game", d: "Cosmic RPG." }
        ];
        const container = document.getElementById('product-list');
        container.innerHTML = products.map(p => `
            <div class="card" style="opacity:0; animation: fadeIn 0.5s forwards;">
                <h3>${p.t}</h3><p>${p.d}</p>
            </div>
        `).join('');
    },

    loadExtraModules() {
        // Chỉ tải Markdown khi người dùng cuộn xuống hoặc sau khi trang chính đã mượt
        console.log("Hệ thống đã sẵn sàng 100%");
        // Gọi fetch Markdown ở đây nếu cần
    }
};

// Chạy khởi tạo
document.addEventListener('DOMContentLoaded', () => App.init());
