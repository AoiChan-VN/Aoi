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
        this.applySettings();
        this.renderPosts();
    }

    cacheDOM() {
        const ids = [
            'content-grid', 'loader', 'overlay', 'menu-left', 
            'menu-btn', 'close-menu', 'close-viewer', 'open-settings-sub'
        ];
        ids.forEach(id => {
            const camelCase = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
            this.dom[camelCase] = document.getElementById(id);
        });
        this.dom.settingsTemplate = document.getElementById('settings-template');
    }

    bindEvents() {
        this.dom.menuBtn.onclick = () => this.toggleMenu(true);
        this.dom.closeMenu.onclick = () => this.toggleMenu(false);
        this.dom.overlay.onclick = () => this.toggleMenu(false);
        this.dom.closeViewer.onclick = () => this.popup.close();

        // Mở Settings dưới dạng Popup
        this.dom.openSettingsSub.onclick = () => {
            this.toggleMenu(false);
            this.openSettingsPopup();
        };

        // Mở Thông tin (Nút thứ 2 trong menu)
        document.querySelectorAll('.menu-item')[1].onclick = () => {
            this.toggleMenu(false);
            const dict = languages[this.state.lang];
            this.popup.open('ⓘ Info', `<div style="text-align:center"><h3>AoiChan App</h3><p>© 2026</p></div>`);
        };

        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.loadContent(card.dataset.file, card.querySelector('h3').innerText);
        };
    }

    updateState(key, value) {
        this.state[key] = value;
        localStorage.setItem(`aoi_${key}`, value);
        this.applySettings();
    }

    applySettings() {
        document.body.className = `theme-${this.state.theme}`;
        this.state.bg ? document.body.classList.add('show-bg') : document.body.classList.remove('show-bg');
        
        const dict = languages[this.state.lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const k = el.getAttribute('data-key');
            if (dict[k]) el.textContent = dict[k];
        });
    }

    openSettingsPopup() {
        const dict = languages[this.state.lang];
        const content = this.dom.settingsTemplate.content.cloneNode(true);
        
        const themeSelect = content.querySelector('.pop-theme-select');
        const langSelect = content.querySelector('.pop-lang-select');
        const bgToggle = content.querySelector('.pop-bg-toggle');

        // Khởi tạo giá trị
        themeSelect.value = this.state.theme;
        bgToggle.checked = this.state.bg;
        langSelect.innerHTML = Object.keys(languages).map(k => 
            `<option value="${k}" ${k === this.state.lang ? 'selected' : ''}>${languages[k].name}</option>`
        ).join('');

        // Sự kiện
        themeSelect.onchange = (e) => this.updateState('theme', e.target.value);
        bgToggle.onchange = (e) => this.updateState('bg', e.target.checked);
        langSelect.onchange = (e) => {
            this.updateState('lang', e.target.value);
            this.renderPosts();
            this.popup.close();
        };

        this.popup.open(`⚙ ${dict.setting_title}`, content, false);
    }

    async loadContent(file, title) {
        this.dom.loader.style.width = '60%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = await res.ok ? await res.text() : '## 👻 Error 404\nFile not found.';
            this.popup.open(title, parseMarkdown(text));
        } catch {
            this.popup.open('Error', 'Could not connect to server.');
        }
        this.dom.loader.style.width = '0';
    }

    renderPosts() {
        const dict = languages[this.state.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" onerror="this.src='./assets/img/fallback.png'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn">${dict.detail_btn || 'Open'}</div>
                </div>
            </div>
        `).join('');
    }

    toggleMenu(open) {
        this.dom.menuLeft.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
    }
}

const app = new AoiApp();
window.onload = () => app.init();
 
