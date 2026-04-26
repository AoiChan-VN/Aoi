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
        this.initDraggable();
    }

    cacheDOM() {
        const elements = {
            contentGrid: 'content-grid',
            loader: 'loader',
            themeSelect: 'theme-select',
            langSelect: 'lang-select',
            bgToggle: 'bg-toggle',
            popup: 'popup-root',
            popupContent: 'popup-body',
            popupTitle: 'popup-title',
            closePopup: 'close-popup',
            menuLeft: 'menu-left',
            menuBtn: 'menu-btn',
            closeMenu: 'close-menu',
            overlay: 'overlay',
            openSettingsSub: 'open-settings-sub',
            settingsSubPanel: 'settings-sub-panel'
        };
        for (const [key, id] of Object.entries(elements)) {
            this.dom[key] = document.getElementById(id);
        }
    }

    bindEvents() {
        this.dom.menuBtn.onclick = () => this.toggleMenu(true);
        this.dom.closeMenu.onclick = () => this.toggleMenu(false);
        this.dom.overlay.onclick = () => { this.toggleMenu(false); this.closePopup(); };
        this.dom.closePopup.onclick = () => this.closePopup();
        
        this.dom.openSettingsSub.onclick = () => this.dom.settingsSubPanel.classList.toggle('hidden');
        
        this.dom.themeSelect.onchange = () => {
            this.state.theme = this.dom.themeSelect.value;
            localStorage.setItem('aoi_theme', this.state.theme);
            this.applyTheme();
        };

        this.dom.langSelect.onchange = () => {
            this.state.lang = this.dom.langSelect.value;
            localStorage.setItem('aoi_lang', this.state.lang);
            this.applyLanguage();
            this.renderPosts();
        };

        this.dom.bgToggle.onchange = () => {
            this.state.bg = this.dom.bgToggle.checked;
            localStorage.setItem('aoi_bg', this.state.bg);
            this.applyTheme();
        };

        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.openPost(card.dataset.file, card.querySelector('h3').innerText);
        };
    }

    async openPost(file, title) {
        this.dom.loader.style.width = '60%';
        try {
            const res = await fetch(`./content/${file}`);
            if (!res.ok) throw new Error();
            const text = await res.text();
            this.dom.popupContent.innerHTML = parseMarkdown(text);
            this.dom.popupTitle.innerText = title;
            
            this.dom.popup.style.display = 'flex';
            this.dom.popup.style.left = '50%';
            this.dom.popup.style.top = '50%';
            this.dom.popup.style.transform = 'translate(-50%, -50%)';
            this.dom.overlay.classList.add('show');
        } catch (err) {
            alert('📖 〈 File không tồn tại 〉');
        }
        this.dom.loader.style.width = '0';
    }

    closePopup() {
        this.dom.popup.style.display = 'none';
        this.dom.overlay.classList.remove('show');
    }

    initDraggable() {
        const win = this.dom.popup;
        const header = win.querySelector('.popup-header');
        let isDragging = false, offset = { x: 0, y: 0 };

        const start = (e) => {
            if (e.target.closest('.btn-base')) return;
            isDragging = true;
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            offset.x = cx - win.offsetLeft;
            offset.y = cy - win.offsetTop;
        };

        const move = (e) => {
            if (!isDragging) return;
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            win.style.left = `${cx - offset.x}px`;
            win.style.top = `${cy - offset.y}px`;
            win.style.transform = 'none';
        };

        const stop = () => isDragging = false;

        header.onmousedown = start; document.onmousemove = move; document.onmouseup = stop;
        header.ontouchstart = start; document.ontouchmove = move; document.ontouchend = stop;
    }

    applyTheme() {
        document.body.className = `theme-${this.state.theme}`;
        this.state.bg ? document.body.classList.add('show-bg') : document.body.classList.remove('show-bg');
    }

    applyLanguage() {
        const dict = languages[this.state.lang] || {};
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (dict[key]) el.textContent = dict[key];
        });
    }

    renderLanguageOptions() {
        this.dom.langSelect.innerHTML = Object.keys(languages)
            .map(k => `<option value="${k}">${languages[k].name}</option>`).join('');
        this.dom.langSelect.value = this.state.lang;
    }

    renderPosts() {
        const dict = languages[this.state.lang] || {};
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" loading="lazy" onerror="this.src='./assets/img/fallback.webp'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn-base btn-outline">${dict.detail_btn || 'Chi tiết'}</div>
                </div>
            </div>
        `).join('');
    }

    toggleMenu(open) {
        this.dom.menuLeft.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
    }

    initSettings() {
        this.dom.themeSelect.value = this.state.theme;
        this.dom.bgToggle.checked = this.state.bg;
    }
}

const app = new AoiApp();
window.addEventListener('DOMContentLoaded', () => app.init());
