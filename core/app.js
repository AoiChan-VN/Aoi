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
    }

    cacheDOM() {
        // Danh sách ID khớp 100% với file HTML mới của anh
        const elements = {
            contentGrid: 'content-grid',
            loader: 'loader',
            themeSelect: 'theme-select',
            langSelect: 'lang-select',
            bgToggle: 'bg-toggle',
            viewer: 'viewer',
            viewerContent: 'viewer-content',
            overlay: 'overlay',
            menuLeft: 'menu-left',
            closeViewer: 'close-viewer',
            menuBtn: 'menu-btn',
            closeMenu: 'close-menu',
            openSettingsSub: 'open-settings-sub',
            settingsSubPanel: 'settings-sub-panel'
        };

        for (const [key, id] of Object.entries(elements)) {
            this.dom[key] = document.getElementById(id);
        }
    }

    bindEvents() {
        // Điều khiển Menu Trái
        if (this.dom.menuBtn) this.dom.menuBtn.onclick = () => this.toggleMenu(true);
        if (this.dom.closeMenu) this.dom.closeMenu.onclick = () => this.toggleMenu(false);
        if (this.dom.overlay) this.dom.overlay.onclick = () => this.toggleMenu(false);
        
        // Mở bảng Cài đặt con trong Menu
        if (this.dom.openSettingsSub) {
            this.dom.openSettingsSub.onclick = () => {
                this.dom.settingsSubPanel.classList.toggle('hidden');
            };
        }

        // Đóng trình xem bài viết
        if (this.dom.closeViewer) this.dom.closeViewer.onclick = () => this.closeViewer();

        // Thay đổi Giao diện
        this.dom.themeSelect.onchange = () => {
            this.state.theme = this.dom.themeSelect.value;
            localStorage.setItem('aoi_theme', this.state.theme);
            this.applyTheme();
        };

        // Thay đổi Ngôn ngữ
        this.dom.langSelect.onchange = () => {
            this.state.lang = this.dom.langSelect.value;
            localStorage.setItem('aoi_lang', this.state.lang);
            this.applyLanguage();
            this.renderPosts(); // Cập nhật lại nút "Chi tiết" theo ngôn ngữ mới
        };

        // Bật/Tắt Ảnh nền
        this.dom.bgToggle.onchange = () => {
            this.state.bg = this.dom.bgToggle.checked;
            localStorage.setItem('aoi_bg', this.state.bg);
            this.applyTheme();
        };

        // Bấm vào Card để mở bài viết
        this.dom.contentGrid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.openPost(card.dataset.file);
        };
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
            alert('Không thể tải bài viết!'); 
        }
        setTimeout(() => { this.dom.loader.style.width = '0'; }, 300);
    }

    closeViewer() {
        this.dom.viewer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    toggleMenu(open) {
        this.dom.menuLeft.classList.toggle('show', open);
        this.dom.overlay.classList.toggle('show', open);
        document.body.style.overflow = open ? 'hidden' : '';
        // Đóng luôn bảng cài đặt khi thoát menu để lần sau mở lại cho gọn
        if(!open) this.dom.settingsSubPanel.classList.add('hidden');
    }

    initSettings() {
        this.dom.themeSelect.value = this.state.theme;
        this.dom.bgToggle.checked = this.state.bg;
    }
}

const app = new AoiApp();
window.addEventListener('DOMContentLoaded', () => app.init());
