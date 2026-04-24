import { MarkdownParser } from './parser.js';

export class AoiFramework {
    constructor() {
        this.i18n = {};
        this.state = {
            theme: localStorage.getItem('aoi_theme') || 'dark',
            bg: localStorage.getItem('aoi_bg') !== 'false',
            lang: localStorage.getItem('aoi_lang') || 'vi'
        };
    }

    async init() {
        await this.loadLanguages();
        this.applySettings();
        await this.renderUI();
    }

    async loadLanguages() {
        try {
            const res = await fetch('./app/languages.json');
            this.i18n = await res.json();
        } catch (e) { console.error("Language file missing"); }
    }

    applySettings() {
        document.body.className = `theme-${this.state.theme} ${this.state.bg ? 'show-bg' : ''}`;
        document.getElementById('bg-toggle').checked = this.state.bg;
        document.getElementById('theme-select').value = this.state.theme;
        document.getElementById('lang-select').value = this.state.lang;

        const dict = this.i18n[this.state.lang];
        if (dict) {
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (dict[key]) el.innerText = dict[key];
            });
        }
    }

    updateSettings() {
        this.state.theme = document.getElementById('theme-select').value;
        this.state.bg = document.getElementById('bg-toggle').checked;
        localStorage.setItem('aoi_theme', this.state.theme);
        localStorage.setItem('aoi_bg', this.state.bg);
        this.applySettings();
    }

    changeLanguage(lang) {
        this.state.lang = lang;
        localStorage.setItem('aoi_lang', lang);
        this.applySettings();
        this.renderUI();
    }

    async renderUI() {
        try {
            const res = await fetch('./app/data.json');
            const posts = await res.json();
            const grid = document.getElementById('content-grid');
            const btnText = this.i18n[this.state.lang]?.detail_btn || '...';

            grid.innerHTML = posts.map(item => `
                <div class="card" onclick="window.app.openDoc('${item.file}')">
                    <img src="${item.thumb}" class="card-img" onerror="this.src='https://placeholder.com'">
                    <div class="card-info">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                        <button class="btn-detail">${btnText}</button>
                    </div>
                </div>
            `).join('');
        } catch (e) { console.error("Data file missing"); }
    }

    async openDoc(file) {
        const loader = document.getElementById('loader');
        loader.style.width = '100%';
        try {
            const res = await fetch(`./app/content/${file}`);
            const text = await res.text();
            document.getElementById('md-render-area').innerHTML = MarkdownParser.parse(text);
            document.getElementById('viewer').classList.remove('hidden');
        } catch (e) { alert("Load failed!"); }
        setTimeout(() => loader.style.width = '0', 400);
    }

    closeDoc() { document.getElementById('viewer').classList.add('hidden'); }
    toggleSide(id) {
        document.getElementById(id).classList.toggle('show');
        document.getElementById('global-overlay').classList.toggle('show');
    }
    closeAll() {
        document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
        document.getElementById('global-overlay').classList.remove('show');
    }
}
