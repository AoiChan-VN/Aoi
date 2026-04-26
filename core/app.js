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
        if (!this.dom.contentGrid) return;
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
            viewer: 'viewer',
            viewerContent: 'viewer-content',
            viewerWindow: document.querySelector('.viewer-window'),
            viewerHeader: document.getElementById('viewer-header'),
            overlay: 'overlay',
            menuLeft: 'menu-left',
            closeViewer: 'close-viewer',
            menuBtn: 'menu-btn',
            closeMenu: 'close-menu',
            openSettingsSub: 'open-settings-sub',
            settingsSubPanel: 'settings-sub-panel'
        };
        for (const [key, id] of Object.entries(elements)) {
            this.dom[key] = typeof id === 'string' ? document.getElementById(id) : id;
        }
    }

    bindEvents() {
        this.dom.menuBtn.onclick = () => this.toggleMenu(true);
        this.dom.closeMenu.onclick = () => this.toggleMenu(false);
        this.dom.overlay.onclick = () => this.toggleMenu(false);
        this.dom.closeViewer.onclick = () => this.closeViewer();
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
            if (card) this.openPost(card.dataset.file);
        };
    }

    async openPost(file) {
        this.dom.loader.style.width = '40%';
        try {
            const res = await fetch(`./content/${file}`);
            if (!res.ok) throw new Error("👻「404」");

            const text = await res.text();
            this.dom.viewerContent.innerHTML = parseMarkdown(text);
            
            // Reset vị trí bảng về trung tâm
            this.dom.viewerWindow.style.left = '50%';
            this.dom.viewerWindow.style.top = '50%';
            this.dom.viewerWindow.style.transform = 'translate(-50%, -50%)';
            
            this.dom.viewer.classList.remove('hidden');
        } catch (err) {
            alert('📖 〈 Dữ liệu không tồn tại 〉');
        }
        this.dom.loader.style.width = '0';
    }

    closeViewer() {
        this.dom.viewer.classList.add('hidden');
    }

    initDraggable() {
        const header = this.dom.viewerHeader;
        const win = this.dom.viewerWindow;
        if (!header || !win) return;

        let isDragging = false, offset = { x: 0, y: 0 };

        const start = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            isDragging = true;
            const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            offset.x = cx - win.offsetLeft;
            offset.y = cy - win.offsetTop;
            header.style.cursor = 'grabbing';
        };

        const move = (e) => {
            if (!isDragging) return;
            const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            win.style.left = cx - offset.x + 'px';
            win.style.top = cy - offset.y + 'px';
        };

        const stop = () => { isDragging = false; header.style.cursor = 'move'; };

        header.onmousedown = start; document.onmousemove = move; document.onmouseup = stop;
        header.ontouchstart = start; document.ontouchmove = move; document.ontouchend = stop;
    }

    applyTheme() {
        document.body.className = `theme-${this.state.theme}`;
        if (this.state.bg) document.body.classList.add('show-bg');
        else document.body.classList.remove('show-bg');
    }

    applyLanguage() {
        const dict = languages[this.state.lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (dict[key]) el.textContent = dict[key];
        });
    }

    renderLanguageOptions() {
        this.dom.langSelect.innerHTML = Object.keys(languages)
            .map(key => `<option value="${key}">${languages[key].name}</option>`).join('');
        this.dom.langSelect.value = this.state.lang;
    }

    renderPosts() {
        const dict = languages[this.state.lang];
        this.dom.contentGrid.innerHTML = posts.map(item => `
            <div class="card" data-file="${item.file}">
                <img src="${item.thumb}" class="card-img" onerror="this.src='./assets/img/fallback.webp'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="btn">${dict.detail_btn}</div>
                </div>
            </div>
        `).join('');
    }

    toggleMenu(open) {
        this.dom.menuLeft.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
        if(!open) this.dom.settingsSubPanel.classList.add('hidden');
    }

    initSettings() {
        this.dom.themeSelect.value = this.state.theme;
        this.dom.bgToggle.checked = this.state.bg;
    }
}

const app = new AoiApp();
window.addEventListener('DOMContentLoaded', () => app.init());
 
