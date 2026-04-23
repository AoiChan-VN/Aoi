import { translations } from 'assets/i18n/lang.js';

const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark',
    bg: localStorage.getItem('aoi_bg') !== 'false'
};

// Cấu hình Marked (Tùy chỉnh để render xuống dòng chuẩn)
marked.setOptions({ gfm: true, breaks: true });

const translateUI = () => {
    const dict = translations[state.lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = dict[el.getAttribute('data-i18n')];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = dict[el.getAttribute('data-i18n-placeholder')];
    });
};

const applySettings = () => {
    document.body.className = `theme-${state.theme} ${state.bg ? 'show-bg' : ''}`;
    document.getElementById('bg-toggle').checked = state.bg;
    document.getElementById('theme-select').value = state.theme;
    document.getElementById('lang-select').value = state.lang;
    translateUI();
};

// Đưa hàm ra phạm vi global để HTML có thể gọi
window.ctrl = {
    updateSettings: () => {
        state.theme = document.getElementById('theme-select').value;
        state.bg = document.getElementById('bg-toggle').checked;
        localStorage.setItem('aoi_theme', state.theme);
        localStorage.setItem('aoi_bg', state.bg);
        applySettings();
    },
    updateLang: (val) => {
        state.lang = val;
        localStorage.setItem('aoi_lang', val);
        applySettings();
        render();
    },
    toggleSide: (id) => {
        document.getElementById(id).classList.toggle('show');
        document.getElementById('global-overlay').classList.toggle('show');
    },
    closeAll: () => {
        document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
        document.getElementById('global-overlay').classList.remove('show');
    },
    openDoc: async (file) => {
        window.ctrl.closeAll();
        const loader = document.getElementById('loader');
        loader.style.width = '100%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = await res.text();
            // Sử dụng Marked.js thay vì replace thủ công
            document.getElementById('md-render-area').innerHTML = marked.parse(text);
            document.getElementById('viewer').classList.remove('hidden');
        } catch (e) { 
            alert(translations[state.lang].error_load); 
        }
        setTimeout(() => loader.style.width = '0', 400);
    },
    closeDoc: () => document.getElementById('viewer').classList.add('hidden')
};

const render = async () => {
    try {
        const res = await fetch('./data.json');
        const posts = await res.json();
        const grid = document.getElementById('content-grid');
        const dict = translations[state.lang];

        grid.innerHTML = posts.map(item => `
            <div class="card">
                <img src="${item.thumb}" class="card-img" alt="thumb">
                <div class="card-info">
                    <h3>${item.title[state.lang] || item.title['vi']}</h3>
                    <p>${item.desc[state.lang] || item.desc['vi']}</p>
                    <button class="btn-detail" onclick="ctrl.openDoc('${item.file[state.lang] || item.file['vi']}')">
                        ${dict.detail_btn}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) { console.error("Render Error:", e); }
};

window.onload = () => { applySettings(); render(); };
 
