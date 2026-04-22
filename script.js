const AoiApp = {
    state: {
        lang: localStorage.getItem('aoi_lang') || 'vi',
        theme: localStorage.getItem('aoi_theme') || 'dark',
        data: null
    },

    async init() {
        this.applyTheme();
        await this.loadData();
        this.bindEvents();
        // Tắt loader ngay lập tức sau khi init xong
        document.getElementById('loader').style.width = '0';
    },

    applyTheme() {
        document.body.className = `theme-${this.state.theme}`;
        const bgImg = this.state.theme === 'dark' ? 'assets/aoi-theme/Theme-Reading.webp' : 'assets/aoi-theme/Theme-Pale.webp';
        document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bgImg}') center/cover no-repeat fixed`;
        
        const sel = document.getElementById('theme-select');
        if(sel) sel.value = this.state.theme;
    },

    async loadData() {
        const loader = document.getElementById('loader');
        loader.style.width = '50%';
        try {
            const res = await fetch('./data.json');
            if (!res.ok) throw new Error("Không thấy data.json");
            this.state.data = await res.json();
            this.renderMenu();
        } catch (e) {
            console.error("Lỗi:", e);
            document.getElementById('content-grid').innerHTML = '<p style="padding:20px; opacity:0.5">Vui lòng kiểm tra file data.json</p>';
        } finally {
            loader.style.width = '100%';
            setTimeout(() => loader.style.width = '0', 400);
        }
    },

    renderMenu() {
        const grid = document.getElementById('content-grid');
        const langData = this.state.data[this.state.lang];
        if (!grid || !langData) return;

        grid.innerHTML = '';
        langData.categories.forEach((group, idx) => {
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span>${group.group_name}</span><span>▾</span>`;
            
            const container = document.createElement('div');
            container.className = 'group-content';
            
            group.posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${post.title}</h3><p>${post.desc}</p>`;
                card.onclick = () => this.openDoc(post.file);
                container.appendChild(card);
            });

            header.onclick = () => {
                const isOpen = container.classList.contains('show');
                document.querySelectorAll('.group-content').forEach(c => c.classList.remove('show'));
                document.querySelectorAll('.group-header').forEach(h => h.classList.remove('active'));
                if (!isOpen) {
                    container.classList.add('show');
                    header.classList.add('active');
                }
            };
            grid.appendChild(header);
            grid.appendChild(container);
        });
    },

    async openDoc(file) {
        this.closeAll();
        const loader = document.getElementById('loader');
        loader.style.width = '100%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = await res.text();
            document.getElementById('md-render-area').innerHTML = text
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\n/gim, '<br>');
            document.getElementById('viewer').classList.remove('hidden');
        } catch (e) { alert("Lỗi tải bài viết"); }
        setTimeout(() => loader.style.width = '0', 400);
    },

    bindEvents() {
        document.getElementById('theme-select').onchange = (e) => {
            this.state.theme = e.target.value;
            localStorage.setItem('aoi_theme', this.state.theme);
            this.applyTheme();
        };
        document.getElementById('lang-switch').onchange = (e) => {
            this.state.lang = e.target.value;
            localStorage.setItem('aoi_lang', this.state.lang);
            this.renderMenu();
        };
        document.getElementById('search-input').oninput = (e) => {
            const k = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(c => {
                c.style.display = c.innerText.toLowerCase().includes(k) ? 'block' : 'none';
            });
        };
    },

    closeAll() {
        document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
        document.getElementById('global-click-area').classList.remove('show');
    }
};

window.onload = () => AoiApp.init();
function toggleSide(id, e) { AoiApp.closeAll(); document.getElementById(id).classList.add('show'); document.getElementById('global-click-area').classList.add('show'); e.stopPropagation(); }
function closeDoc() { document.getElementById('viewer').classList.add('hidden'); }
