const appState = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const i18n = {
    vi: { sub: "Plugin, Game & Sản phẩm sáng tạo", more: "Khám phá" },
    en: { sub: "Plugins, Games & Creative Works", more: "Explore" }
};

// 1. Khởi tạo ngay lập tức (Zero Delay)
document.documentElement.setAttribute('theme', appState.theme);

window.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadDatabase();
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 300);
});

// 2. Chức năng lưu Setting vĩnh viễn
function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('theme', appState.theme);
    localStorage.setItem('aoi_theme', appState.theme);
}

function toggleLang() {
    appState.lang = appState.lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('aoi_lang', appState.lang);
    updateUI();
    loadDatabase();
}

function updateUI() {
    document.getElementById('sub-title').innerText = i18n[appState.lang].sub;
    document.getElementById('lang-btn').innerText = appState.lang.toUpperCase();
}

// 3. Cơ chế Auto-fetching (Tự động nhận file)
async function loadDatabase() {
    const grid = document.getElementById('content-grid');
    try {
        const res = await fetch('./data/content.json');
        const data = await res.json();
        
        grid.innerHTML = data.map(item => `
            <div class="card">
                <img src="${item.img}" alt="Aoi">
                <h3>${item.title}</h3>
                <p>${item.desc[appState.lang]}</p>
                <a href="${item.url}" style="color:var(--accent); text-decoration:none">${i18n[appState.lang].more} →</a>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = `<p>/data/content.json</p>`;
    }
}
