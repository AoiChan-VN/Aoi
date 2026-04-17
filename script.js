const CONFIG = {
    lang: localStorage.getItem('lang') || 'vi',
    theme: localStorage.getItem('theme') || 'dark'
};

const translations = {
    vi: { desc: "Nhà phát triển Plugin, Game & Sản phẩm sáng tạo", view: "Xem chi tiết" },
    en: { desc: "Plugin, Game & Creative Developer", view: "View Details" }
};

// Khởi tạo Lucide Icons
lucide.createIcons();

// Xử lý Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 800);
});

// Chuyển đổi Theme
const toggleTheme = () => {
    const body = document.body;
    CONFIG.theme = CONFIG.theme === 'dark' ? 'light' : 'dark';
    body.className = `theme-${CONFIG.theme}`;
    localStorage.setItem('theme', CONFIG.theme);
    document.getElementById('theme-toggle').innerHTML = `<i data-lucide="${CONFIG.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    lucide.createIcons();
};

// Tự động lấy dữ liệu (Database cá nhân)
async function fetchData() {
    try {
        // Giả lập fetching từ file data/content.json
        // Trong thực tế, bạn tạo file content.json trong folder data
        const response = await fetch('./data/content.json');
        const data = await response.json();
        renderContent(data);
    } catch (err) {
        console.error("Database not found, using demo data");
        renderContent(demoData);
    }
}

function renderContent(items) {
    const container = document.getElementById('content-grid');
    container.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.image}" alt="${item.title}" style="width:100%; border-radius:10px;">
            <h3 style="margin: 15px 0 10px">${item.title}</h3>
            <p style="font-size: 0.9rem; opacity: 0.8">${item.desc}</p>
            <div style="margin-top: 15px; color: var(--accent); font-weight: bold;">${translations[CONFIG.lang].view} →</div>
        </div>
    `).join('');
}

// Demo Data (Khi chưa có file json)
const demoData = [
    { title: "Aoi Plugin Manager", desc: "Tối ưu hóa hệ thống plugin Minecraft.", image: "https://picsum.photos" },
    { title: "Galaxy War Game", desc: "Game indie bắn súng không gian.", image: "https://picsum.photos" }
];

// Event Listeners
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('lang-switch').addEventListener('click', () => {
    CONFIG.lang = CONFIG.lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('lang', CONFIG.lang);
    location.reload(); // Reload để nhận ngôn ngữ mới nhanh nhất
});

// Khởi chạy
document.body.className = `theme-${CONFIG.theme}`;
document.getElementById('hero-desc').innerText = translations[CONFIG.lang].desc;
fetchData();
 
