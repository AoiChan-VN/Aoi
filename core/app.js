import { posts } from '../data/posts.js';
import { languages } from '../data/languages.js';
import { parseMarkdown } from './parser.js';

class AoiApp {
    constructor() {
        this.state = {
            theme: localStorage.getItem('aoi_theme') || 'dark',
            lang: localStorage.getItem('aoi_lang') || 'vi'
        };
        this.dom = {};
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.applyTheme();
        this.renderPosts();
        this.initDraggable();
    }

    cacheDOM() {
        this.dom = {
            grid: document.getElementById('content-grid'),
            overlay: document.getElementById('overlay'),
            drawer: document.getElementById('menu-left'),
            popup: document.getElementById('popup-root'),
            themeSelect: document.getElementById('theme-select'),
            loader: document.getElementById('loader')
        };
    }

    bindEvents() {
        document.getElementById('menu-btn').onclick = () => this.toggleMenu(true);
        document.getElementById('close-menu').onclick = () => this.toggleMenu(false);
        document.getElementById('close-popup').onclick = () => this.closePopup();
        this.dom.overlay.onclick = () => { this.toggleMenu(false); this.closePopup(); };
        document.getElementById('open-settings').onclick = () => document.getElementById('settings-panel').classList.toggle('hidden');
        
        this.dom.themeSelect.onchange = (e) => {
            this.state.theme = e.target.value;
            localStorage.setItem('aoi_theme', this.state.theme);
            this.applyTheme();
        };

        this.dom.grid.onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.openPost(card.dataset.file, card.querySelector('h3').innerText);
        };
    }

    async openPost(file, title) {
        this.dom.loader.style.width = '50%';
        try {
            const res = await fetch(`content/${file}`);
            const text = await res.text();
            document.getElementById('popup-body').innerHTML = parseMarkdown(text);
            document.getElementById('popup-title').innerText = title;
            
            this.dom.popup.style.display = 'flex';
            this.dom.overlay.classList.add('show');
        } catch (e) { console.error("Lỗi tải nội dung"); }
        this.dom.loader.style.width = '0';
    }

    closePopup() { this.dom.popup.style.display = 'none'; this.dom.overlay.classList.remove('show'); }
    toggleMenu(open) { this.dom.drawer.classList.toggle('show', open); this.dom.overlay.classList.toggle('show', open); }
    applyTheme() { document.body.className = `theme-${this.state.theme}`; this.dom.themeSelect.value = this.state.theme; }

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
}

new AoiApp().init();
 
