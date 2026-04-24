import { posts } from '../data/posts.js';
import { languages } from '../data/languages.js';
import { parseMarkdown } from './parser.js';

class AoiApp {
constructor() {
this.state = {
theme: localStorage.getItem('aoi_theme') || 'dark',
bg: localStorage.getItem('aoi_bg') !== 'false',
lang: localStorage.getItem('aoi_lang') || 'vi'
};

    this.dom = {};
}

init() {
    this.cacheDOM();
    this.bindEvents();
    this.initSettings();
    this.applyTheme();
    this.renderLanguageOptions();
    this.applyLanguage();
    this.renderPosts();
}

cacheDOM() {
    this.dom.grid = document.getElementById('content-grid');
    this.dom.loader = document.getElementById('loader');
    this.dom.themeSelect = document.getElementById('theme-select');
    this.dom.langSelect = document.getElementById('lang-select');
    this.dom.bgToggle = document.getElementById('bg-toggle');
    this.dom.viewer = document.getElementById('viewer');
    this.dom.viewerContent = document.getElementById('viewer-content');
    this.dom.overlay = document.getElementById('overlay');
    this.dom.settingsDrawer = document.getElementById('settings-drawer');

    this.dom.menuBtn = document.getElementById('menu-btn');
    this.dom.settingsBtn = document.getElementById('settings-btn');
    this.dom.closeViewer = document.getElementById('close-viewer');
}

bindEvents() {
    this.dom.grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        this.openPost(card.dataset.file);
    });

    this.dom.themeSelect.addEventListener('change', () => {
        this.state.theme = this.dom.themeSelect.value;
        localStorage.setItem('aoi_theme', this.state.theme);
        this.applyTheme();
    });

    this.dom.langSelect.addEventListener('change', () => {
        this.state.lang = this.dom.langSelect.value;
        localStorage.setItem('aoi_lang', this.state.lang);
        this.applyLanguage();
        this.renderPosts();
    });

    this.dom.bgToggle.addEventListener('change', () => {
        this.state.bg = this.dom.bgToggle.checked;
        localStorage.setItem('aoi_bg', this.state.bg);
        this.applyTheme();
    });

    this.dom.settingsBtn.addEventListener('click', () => {
        this.toggleDrawer(true);
    });

    this.dom.overlay.addEventListener('click', () => {
        this.toggleDrawer(false);
        this.closeViewer();
    });

    this.dom.closeViewer.addEventListener('click', () => {
        this.closeViewer();
    });
}

initSettings() {
    this.dom.themeSelect.value = this.state.theme;
    this.dom.bgToggle.checked = this.state.bg;
}

applyTheme() {
    document.body.className = '';

    document.body.classList.add(`theme-${this.state.theme}`);

    if (this.state.bg) {
        document.body.classList.add('show-bg');
    }
}

renderLanguageOptions() {
    const fragment = document.createDocumentFragment();

    Object.keys(languages).forEach((key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = languages[key].name;
        fragment.appendChild(option);
    });

    this.dom.langSelect.innerHTML = '';
    this.dom.langSelect.appendChild(fragment);
    this.dom.langSelect.value = this.state.lang;
}

applyLanguage() {
    const dict = languages[this.state.lang];

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
}

renderPosts() {
    const fragment = document.createDocumentFragment();
    const dict = languages[this.state.lang];

    posts.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.file = item.file;

        card.innerHTML = `
            <img 
                src="${item.thumb}" 
                class="card-img" 
                loading="lazy" 
                decoding="async"
            >
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <button class="btn">${dict.detail_btn}</button>
            </div>
        `;

        fragment.appendChild(card);
    });

    this.dom.grid.innerHTML = '';
    this.dom.grid.appendChild(fragment);
}

async openPost(file) {
    this.dom.loader.style.width = '30%';

    try {
        const res = await fetch(`./content/${file}`);
        this.dom.loader.style.width = '70%';

        const text = await res.text();
        this.dom.loader.style.width = '100%';

        this.dom.viewerContent.innerHTML = parseMarkdown(text);
        this.dom.viewer.classList.remove('hidden');
    } catch (e) {
        alert('Load failed');
    }

    requestAnimationFrame(() => {
        this.dom.loader.style.width = '0';
    });
}

closeViewer() {
    this.dom.viewer.classList.add('hidden');
}

toggleDrawer(open) {
    if (open) {
        this.dom.settingsDrawer.classList.add('show');
        this.dom.overlay.classList.add('show');
    } else {
        this.dom.settingsDrawer.classList.remove('show');
        this.dom.overlay.classList.remove('show');
    }
}

}

const app = new AoiApp();

window.addEventListener('DOMContentLoaded', () => {
app.init();
});
