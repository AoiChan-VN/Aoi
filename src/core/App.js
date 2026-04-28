import { posts } from '../../data/posts.js';
import { languages } from '../../data/languages.js';
import { parseMarkdown } from '../utils/Parser.js';
import { cacheElements } from '../utils/Dom.js';
import { Popup } from '../components/Popup.js';

class AoiApp {
    constructor() {
        this.config = {
            theme: localStorage.getItem('aoi_theme') || 'dark',
            bg: localStorage.getItem('aoi_bg') !== 'false',
            lang: localStorage.getItem('aoi_lang') || 'vi'
        };
        this.dom = cacheElements([
            'content-grid', 'loader', 'overlay', 'menu-left', 
            'menu-btn', 'close-menu', 'close-viewer', 'open-settings-sub'
        ]);
        this.popup = new Popup('viewer');
    }

    init() {
        this._bindEvents();
        this._applySettings();
        this.renderPosts();
    }

    _bindEvents() {
        this.dom.menuBtn.onclick = () => this._toggleMenu(true);
        [this.dom.closeMenu, this.dom.overlay].forEach(el => el.onclick = () => this._toggleMenu(false));
        this.dom.closeViewer.onclick = () => this.popup.close();
        this.dom.openSettingsSub.onclick = () => { this._toggleMenu(false); this._openSettings(); };

        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this._loadContent(card.dataset.file, card.querySelector('h3').innerText);
        };
    }

    _applySettings() {
        const { theme, bg, lang } = this.config;
        document.body.className = `theme-${theme} ${bg ? 'show-bg' : ''}`;
        const dict = languages[lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const k = el.getAttribute('data-key');
            if (dict[k]) el.textContent = dict[k];
        });
    }

    async _loadContent(file, title) {
        this.dom.loader.style.width = '60%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = res.ok ? await res.text() : '## 404 Not Found';
            this.popup.open(title, parseMarkdown(text));
        } catch {
            this.popup.open('Error', 'Connection failed.');
        } finally {
            this.dom.loader.style.width = '0';
        }
    }

    renderPosts() {
        const dict = languages[this.config.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" loading="lazy">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn">${dict.detail_btn || 'Detail'}</div>
                </div>
            </div>
        `).join('');
    }

    _toggleMenu(show) {
        this.dom.menuLeft.classList.toggle('show', show);
        this.dom.overlay.classList.toggle('show', show);
    }
}

const app = new AoiApp();
window.onload = () => app.init();
