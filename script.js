const UI = {
    themeBtn: document.getElementById('theme-toggle'),
    langSelect: document.getElementById('lang-switch'),
    grid: document.getElementById('content-grid'),
    viewer: document.getElementById('viewer'),
    loader: document.getElementById('loader')
};

// 1. Database ảo (Tự động nhận file qua JSON này)
const database = {
    vi: {
        welcome: "Chào mừng đến với AoiChan",
        items: [
            { id: 1, title: "Aoi Plugin v1", type: "Plugin", file: "plugin.md", thumb: "https://picsum.photos" },
            { id: 2, title: "Game Chiến Thuật Aoi", type: "Game", file: "game.md", thumb: "https://picsum.photos" }
        ]
    },
    en: {
        welcome: "Welcome to AoiChan",
        items: [
            { id: 1, title: "Aoi Plugin v1", type: "Plugin", file: "plugin_en.md", thumb: "https://picsum.photos" },
            { id: 2, title: "Aoi Strategy Game", type: "Game", file: "game_en.md", thumb: "https://picsum.photos" }
        ]
    }
};

// 2. Quản lý Settings (LocalStorage)
let currentLang = localStorage.getItem('aoi_lang') || 'vi';
let currentTheme = localStorage.getItem('aoi_theme') || 'dark';

const init = () => {
    document.body.className = `theme-${currentTheme}`;
    UI.langSelect.value = currentLang;
    renderApp();
};

// 3. Render nội dung cực nhanh
const renderApp = () => {
    UI.loader.style.transform = 'scaleX(1)';
    UI.grid.innerHTML = '';
    
    database[currentLang].items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card fade-in';
        card.innerHTML = `
            <img src="${item.thumb}" style="width:100%; border-radius:10px; margin-bottom:15px">
            <h3>${item.title}</h3>
            <span class="badge">${item.type}</span>
        `;
        card.onclick = () => openDoc(item.file);
        UI.grid.appendChild(card);
    });

    setTimeout(() => UI.loader.style.transform = 'scaleX(0)', 500);
};

// 4. Đọc Markdown tự động (Docs)
const openDoc = async (fileName) => {
    UI.viewer.classList.remove('hidden');
    try {
        const res = await fetch(`./content/${fileName}`);
        const text = await res.text();
        document.getElementById('md-render-area').innerHTML = marked.parse(text);
    } catch (e) {
        document.getElementById('md-render-area').innerHTML = "Lỗi tải file bài viết!";
    }
};

// 5. Sự kiện (Settings)
UI.themeBtn.onclick = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = `theme-${currentTheme}`;
    localStorage.setItem('aoi_theme', currentTheme);
};

UI.langSelect.onchange = (e) => {
    currentLang = e.target.value;
    localStorage.setItem('aoi_lang', currentLang);
    renderApp();
};

document.querySelector('.close-btn').onclick = () => UI.viewer.classList.add('hidden');

init();
