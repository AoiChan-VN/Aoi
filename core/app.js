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
        const ids = ['content-grid', 'loader', 'theme-select', 'lang-select', 'bg-toggle', 'viewer', 'viewer-content', 'overlay', 'settings-drawer', 'close-viewer', 'settings-btn', 'menu-btn'];
        ids.forEach(id => {
            const camelId = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
            this.dom[camelId] = document.getElementById(id);
        });
    }

    bindEvents() {
        this.dom.contentGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) this.openPost(card.dataset.file);
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
            this.renderPosts(); // Re-render để cập nhật text trong card
        });

        this.dom.bgToggle.addEventListener('change', () => {
            this.state.bg = this.dom.bgToggle.checked;
            localStorage.setItem('aoi_bg', this.state.bg);
            this.applyTheme();
        });

        this.dom.settingsBtn.addEventListener('click', () => this.toggleDrawer(true));
        this.dom.menuBtn.addEventListener('click', () => this.toggleDrawer(true));
        this.dom.overlay.addEventListener('click', () => this.toggleDrawer(false));
        this.dom.closeViewer.addEventListener('click', () => this.closeViewer());
    }

    initSettings() {
        this.dom.themeSelect.value = this.state.theme;
        this.dom.bgToggle.checked = this.state.bg;
        this.dom.langSelect.value = this.state.lang;
    }

    applyTheme() {
        document.body.className = `theme-${this.state.theme}`;
        if (this.state.bg) document.body.classList.add('show-bg');
    }

    renderLanguageOptions() {
        this.dom.langSelect.innerHTML = Object.keys(languages)
            .map(key => `<option value="${key}">${languages[key].name}</option>`)
            .join('');
    }

    applyLanguage() {
        const dict = languages[this.state.lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (dict[key]) el.textContent = dict[key];
        });
    }

    renderPosts() {
        const dict = languages[this.state.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" loading="lazy" onerror="this.src='./assets/img/fallback.webp'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <button class="btn">${dict.detail_btn}</button>
                </div>
            </div>
        `).join('');
    }

    async openPost(file) {
        this.dom.loader.style.width = '40%';
        try {
            const res = await fetch(`./content/${file}`);
            if (!res.ok) throw new Error();
            const text = await res.text();
            this.dom.viewerContent.innerHTML = parseMarkdown(text);
            this.dom.viewer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.dom.loader.style.width = '100%';
        } catch {
            alert('Không thể tải nội dung!');
        }
        setTimeout(() => { this.dom.loader.style.width = '0'; }, 300);
    }

    closeViewer() {
        this.dom.viewer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    toggleDrawer(open) {
        this.dom.settingsDrawer.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }
}

const app = new AoiApp();
window.addEventListener('DOMContentLoaded', () => app.init());
 
