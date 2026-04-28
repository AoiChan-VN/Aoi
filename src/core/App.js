import { posts } from '../../data/posts.js';
import { languages } from '../../data/languages.js';
import { parseMarkdown } from '../utils/Parser.js';
import { cacheElements } from '../utils/Dom.js';
import { Popup } from '../components/Popup.js';
import { State } from './State.js';
import { Settings } from '../components/Settings.js';

class AoiApp {
    constructor() {
        this.state = new State();
        this.dom = cacheElements([
            'content-grid', 'loader', 'overlay', 'menu-left', 
            'menu-btn', 'close-menu', 'close-viewer', 'open-settings-sub'
        ]);
        this.popup = new Popup('viewer');
        this.settingsModule = new Settings(this.state, (k, v) => this._updateConfig(k, v));
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

    _updateConfig(key, value) {
        this.state.update(key, value);
        this._applySettings();
        if (key === 'lang') {
            this.renderPosts();
            this.popup.close();
        }
    }

    _applySettings() {
        const theme = this.state.get('theme');
        const bg = this.state.get('bg');
        const lang = this.state.get('lang');
        document.body.className = `theme-${theme} ${bg ? 'show-bg' : ''}`;
        const dict = languages[lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const k = el.getAttribute('data-key');
            if (dict[k]) el.textContent = dict[k];
        });
    }

    _openSettings() {
        const dict = languages[this.state.get('lang')];
        this.popup.open(`⚙ ${dict.setting_title}`, this.settingsModule.render(), false);
    }

    async _loadContent(file, title) {
        this.dom.loader.style.width = '60%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = res.ok ? await res.text() : '## 404\nFile not found.';
            this.popup.open(title, parseMarkdown(text));
        } catch {
            this.popup.open('Error', 'Connection failed.');
        } finally {
            this.dom.loader.style.width = '0';
        }
    }

    renderPosts() {
        const dict = languages[this.state.get('lang')];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <article class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" loading="lazy" onerror="this.src='https://placeholder.com'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn-accent">${dict.detail_btn || 'Open'}</div>
                </div>
            </article>
        `).join('');
    }

    _toggleMenu(show) {
        this.dom.menuLeft.classList.toggle('show', show);
        this.dom.overlay.classList.toggle('show', show);
    }
}

const app = new AoiApp();
window.onload = () => app.init();
