/**
 * 🌊 AoiApp Core
 * Khởi tạo và quản lý toàn bộ vòng đời ứng dụng
 */
import { $, fetchData, Storage } from './Utils.js';
import { ThemeManager } from '../modules/Theme.js';
import { Popup } from '../modules/Popup.js';
import { parseMarkdown } from '../modules/Markdown.js';
import { Render } from '../modules/Render.js';

// Mock data (Trong thực tế sẽ import từ file data/)
import { posts } from '../data/posts.js';
import { languages } from '../data/languages.js';

class AoiApp {
    constructor() {
        this.theme = new ThemeManager();
        this.popup = new Popup('viewer');
        this.lang = Storage.get('lang', 'vi');
    }

    async init() {
        this.theme.init();
        this.updateUI();
        this.bindEvents();
        
        // Hiệu ứng hoàn tất tải trang
        const loader = $('#loader');
        if (loader) {
            loader.style.width = '100%';
            setTimeout(() => loader.style.display = 'none', 400);
        }
    }

    updateUI() {
        const dict = languages[this.lang];
        Render.menu(dict);
        Render.grid(posts, dict);
    }

    bindEvents() {
        // Event Delegation cho Grid bài viết (Tối ưu hiệu suất)
        $('#content-grid').onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.handleLoadPost(card.dataset.file, card.querySelector('h3').innerText);
        };

        // Menu Toggle
        $('#menu-btn').onclick = () => this.toggleMenu(true);
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-menu' || e.target.id === 'overlay') this.toggleMenu(false);
        });

        // Xử lý Popup Thông tin & Cài đặt
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.menu-item');
            if (!btn) return;

            if (btn.id === 'info-btn') {
                this.toggleMenu(false);
                this.popup.open('ⓘ Thông tin', `<div class="info-box"><h3>𝓐𝓸𝓲𝓒𝓱𝓪𝓷 Framework</h3><p>Version 2.0 Modular</p></div>`);
            }
            if (btn.id === 'open-settings-sub') {
                this.toggleMenu(false);
                // Logic mở settings, tái sử dụng tại đây
            }
        });

        $('#close-viewer').onclick = () => this.popup.close();
    }

    async handleLoadPost(file, title) {
        $('#loader').style.display = 'block';
        $('#loader').style.width = '50%';
        
        const content = await fetchData(`./content/${file}`);
        this.popup.open(title, content ? parseMarkdown(content) : '## 👻 Lỗi nạp dữ liệu');
        
        $('#loader').style.width = '100%';
        setTimeout(() => $('#loader').style.display = 'none', 300);
    }

    toggleMenu(show) {
        $('#menu-left').classList.toggle('show', show);
        $('#overlay').classList.toggle('show', show);
    }
}

// Khởi chạy ứng dụng
const app = new AoiApp();
window.addEventListener('DOMContentLoaded', () => app.init());
 
