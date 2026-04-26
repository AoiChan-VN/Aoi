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
    }

    init() {
        this.popup = new Popup('main-popup');
        this.bindEvents();
        this.applySettings();
        this.renderPosts();
    }

    bindEvents() {
        document.getElementById('menu-btn').onclick = () => this.toggleMenu(true);
        document.getElementById('close-menu').onclick = () => this.toggleMenu(false);
        document.getElementById('overlay').onclick = () => this.toggleMenu(false);
        
        document.getElementById('open-settings-sub').onclick = () => {
            this.toggleMenu(false);
            this.openSettings();
        };

        document.getElementById('info-btn').onclick = () => {
            this.toggleMenu(false);
            this.popup.show('ⓘ Thông tin', '<div style="text-align:center"><h3>𝓐𝓸𝓲𝓒𝓱𝓪𝓷</h3><p>Version 2.0</p></div>');
        };

        document.getElementById('content-grid').onclick = (e) => {
            const card = e.target.closest('.card');
            if (card) this.loadPost(card.dataset.file, card.querySelector('h3').textContent);
        };
    }

    openSettings() {
        const dict = languages[this.state.lang];
        const temp = document.getElementById('settings-template').content.cloneNode(true);
        const themeSel = temp.querySelector('.pop-theme-select');
        const langSel = temp.querySelector('.pop-lang-select');
        const bgTog = temp.querySelector('.pop-bg-toggle');

        themeSel.value = this.state.theme;
        bgTog.checked = this.state.bg;
        langSel.innerHTML = Object.keys(languages).map(k => 
            `<option value="${k}" ${k === this.state.lang ? 'selected' : ''}>${languages[k].name}</option>`
        ).join('');

        themeSel.onchange = (e) => this.update('theme', e.target.value);
        bgTog.onchange = (e) => this.update('bg', e.target.checked);
        langSel.onchange = (e) => { 
            this.update('lang', e.target.value); 
            this.renderPosts(); 
            this.popup.hide(); 
        };

        this.popup.show(`⚙ ${dict.setting_title}`, temp, false);
    }

    update(key, val) {
        this.state[key] = val;
        localStorage.setItem(`aoi_${key}`, val);
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

    async loadPost(file, title) {
        const loader = document.getElementById('loader');
        loader.style.width = '70%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = res.ok ? await res.text() : '# 404 Not Found';
            this.popup.show(title, parseMarkdown(text));
        } catch { alert('Lỗi tải dữ liệu'); }
        loader.style.width = '0';
    }

    renderPosts() {
        const grid = document.getElementById('content-grid');
        const btnText = languages[this.state.lang].detail_btn || 'Xem';
        grid.innerHTML = posts.map(p => `
            <div class="card" data-file="${p.file}">
                <img src="${p.thumb}" class="card-img" onerror="this.src='./assets/img/fallback.png'">
                <div class="card-info">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="btn-detail">${btnText}</div>
                </div>
            </div>
        `).join('');
    }

    toggleMenu(show) {
        document.getElementById('menu-left').classList.toggle('show', show);
        document.getElementById('overlay').classList.toggle('show', show);
    }
}
const app = new AoiApp();
window.onload = () => app.init();
