import { posts } from '../data/posts.js';
import { languages } from '../data/languages.js';
import { parseMarkdown } from '../utils/parser.js';
import { Popup } from '../components/Popup.js';

class AoiApp {
    constructor() {
        this.config = {
            theme: localStorage.getItem('aoi_theme') || 'dark',
            bgEnabled: localStorage.getItem('aoi_bg') !== 'false',
            lang: localStorage.getItem('aoi_lang') || 'vi'
        };
        this.dom = this._cacheElements([
            'content-grid', 'loader', 'overlay', 'menu-left', 
            'menu-btn', 'close-menu', 'close-viewer', 'open-settings-sub'
        ]);
        this.popup = new Popup('viewer');
    }

    _cacheElements(ids) {
        return ids.reduce((acc, id) => {
            const key = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
            acc[key] = document.getElementById(id);
            return acc;
        }, { settingsTemplate: document.getElementById('settings-template') });
    }

    init() {
        this._bindEvents();
        this._applyStyles();
        this.renderPosts();
    }

    _bindEvents() {
        const { menuBtn, closeMenu, overlay, closeViewer, openSettingsSub } = this.dom;

        menuBtn.onclick = () => this._toggleMenu(true);
        [closeMenu, overlay].forEach(el => el.onclick = () => this._toggleMenu(false));
        closeViewer.onclick = () => this.popup.close();

        openSettingsSub.onclick = () => {
            this._toggleMenu(false);
            this._openSettings();
        };

        // Delegated Event cho Card để tiết kiệm bộ nhớ
        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this._loadContent(card.dataset.file, card.querySelector('h3').innerText);
        };
    }

    _applyStyles() {
        const { theme, bgEnabled, lang } = this.config;
        document.body.className = `theme-${theme} ${bgEnabled ? 'show-bg' : ''}`;
        
        const dict = languages[lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (dict[key]) el.textContent = dict[key];
        });
    }

    async _loadContent(file, title) {
        this.dom.loader.style.width = '60%';
        try {
            const res = await fetch(`./content/${file}`);
            const md = res.ok ? await res.text() : '## Error 404';
            this.popup.open(title, parseMarkdown(md));
        } catch {
            this.popup.open('Error', 'Connection failed.');
        } finally {
            this.dom.loader.style.width = '0';
        }
    }

    renderPosts() {
        const dict = languages[this.config.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <article class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" alt="${item.title}" loading="lazy">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <span class="btn">${dict.detail_btn || 'Open'}</span>
                </div>
            </article>
        `).join('');
    }

    _toggleMenu(isOpen) {
        this.dom.menuLeft.classList.toggle('show', isOpen);
        this.dom.overlay.classList.toggle('show', isOpen);
    }
}
 
