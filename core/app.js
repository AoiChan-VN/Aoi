import { posts } from '../data/posts.js';
import { languages } from '../data/languages.js';
import { parseMarkdown } from './parser.js';
import { Popup } from './popup.js';

class AoiApp {
    constructor() {
        this.state = {
            theme: localStorage.getItem('aoi_theme') || 'dark',
            bg: localStorage.getItem('aoi_bg') !== 'false',
            lang: localStorage.getItem('aoi_lang') || 'vi'
        };
        this.popup = null;
        this.dom = {};
    }

    init() {
        this.cacheDOM();
        this.popup = new Popup('viewer');
        this.bindEvents();
        this.renderLanguageOptions();
        this.applySettings();
        this.renderPosts();
    }

    cacheDOM() {
        const elements = {
            contentGrid: 'content-grid',
            loader: 'loader',
            themeSelect: 'theme-select',
            langSelect: 'lang-select',
            bgToggle: 'bg-toggle',
            overlay: 'overlay',
            menuLeft: 'menu-left',
            menuBtn: 'menu-btn',
            closeMenu: 'close-menu',
            closeViewer: 'close-viewer',
            openSettingsSub: 'open-settings-sub',
            settingsSubPanel: 'settings-sub-panel',
            infoBtn: 'info-btn'
        };
        for (const [key, id] of Object.entries(elements)) {
            this.dom[key] = document.getElementById(id);
        }
    }

    bindEvents() {
        this.dom.menuBtn.onclick = () => this.toggleMenu(true);
        this.dom.closeMenu.onclick = () => this.toggleMenu(false);
        this.dom.overlay.onclick = () => this.toggleMenu(false);
        this.dom.closeViewer.onclick = () => this.popup.close();
        this.dom.openSettingsSub.onclick = () => this.dom.settingsSubPanel.classList.toggle('hidden');

        // Cài đặt
        this.dom.themeSelect.onchange = (e) => this.updateState('theme', e.target.value);
        this.dom.langSelect.onchange = (e) => {
            this.updateState('lang', e.target.value);
            this.renderPosts();
        };
        this.dom.bgToggle.onchange = (e) => this.updateState('bg', e.target.checked);

        // Grid Click
        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.loadContent(card.dataset.file);
        };
    }

    updateState(key, value) {
        this.state[key] = value;
        localStorage.setItem(`aoi_${key}`, value);
        this.applySettings();
    }

    applySettings() {
        // Theme
        document.body.className = `theme-${this.state.theme}`;
        this.state.bg ? document.body.classList.add('show-bg') : document.body.classList.remove('show-bg');
        
        // Sync UI
        this.dom.themeSelect.value = this.state.theme;
        this.dom.bgToggle.checked = this.state.bg;
        this.dom.langSelect.value = this.state.lang;

        // Language
        const dict = languages[this.state.lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const k = el.getAttribute('data-key');
            if (dict[k]) el.textContent = dict[k];
        });
    }

    async loadContent(file) {
        this.dom.loader.style.width = '50%';
        try {
            const res = await fetch(`./content/${file}`);
            if (!res.ok) throw new Error();
            const text = await res.text();
            this.popup.open('︵»📖«︵', parseMarkdown(text));
        } catch {
            alert('🥀 Lỗi tải dữ liệu...');
        }
        this.dom.loader.style.width = '0';
    }

    renderPosts() {
        const dict = languages[this.state.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" alt="thumb">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn">${dict.detail_btn || 'Chi tiết'}</div>
                </div>
            </div>
        `).join('');
    }

    renderLanguageOptions() {
        this.dom.langSelect.innerHTML = Object.keys(languages)
            .map(k => `<option value="${k}">${languages[k].name}</option>`).join('');
    }

    toggleMenu(open) {
        this.dom.menuLeft.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
    }
}

const app = new AoiApp();
window.onload = () => app.init();
 
