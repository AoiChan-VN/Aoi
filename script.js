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
    },

    applyTheme() {
        document.body.className = `theme-${this.state.theme}`;
        const bgImg = this.state.theme === 'dark' ? 'assets/aoi-theme/Theme-Reading.webp' : 'assets/aoi-theme/Theme-Pale.webp';
        document.body.style.background = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${bgImg}') center/cover no-repeat fixed`;
    },

    async loadData() {
        try {
            const res = await fetch('./data.json');
            this.state.data = await res.json();
            this.renderMenu();
        } catch (e) { console.error("Data error"); }
    },

    renderMenu() {
        const grid = document.getElementById('content-grid');
        const content = this.state.data[this.state.lang];
        if (!grid || !content) return;

        grid.innerHTML = '';
        content.categories.forEach((group, idx) => {
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span>${group.group_name}</span><span class="arrow">▾</span>`;
            
            const container = document.createElement('div');
            container.className = 'group-content';
            
            group.posts.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="card-footer">chi tiết</div>
                `;
                // Sửa lỗi delay: Click trực tiếp vào nút chi tiết
                card.querySelector('.card-footer').onclick = (e) => {
                    e.stopPropagation();
                    this.openDoc(item.file);
                };
                container.appendChild(card);
            });

            header.onclick = () => {
                const isOpen = container.classList.contains('show');
                document.querySelectorAll('.group-content').forEach(c => c.classList.remove('show'));
                if (!isOpen) container.classList.add('show');
            };

            grid.appendChild(header);
            grid.appendChild(container);
        });
    },

    async openDoc(file) {
        const viewer = document.getElementById('viewer');
        const loader = document.getElementById('loader');
        loader.style.width = '100%';
        try {
            const res = await fetch(`./content/${file}`);
            const text = await res.text();
            // Parser giữ chuẩn bài viết cũ
            document.getElementById('md-render-area').innerHTML = text.replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/\n/gim, '<br>');
            viewer.classList.add('show');
            this.closeAll();
        } catch (e) { alert("Lỗi tải"); }
        setTimeout(() => loader.style.width = '0', 400);
    },

    closeAll() {
        document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
        document.getElementById('global-click-area').classList.remove('show');
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
            this.loadData();
        };
    }
};

window.onload = () => AoiApp.init();

// Global Helpers
function toggleSide(id, e) {
    e.stopPropagation();
    const el = document.getElementById(id);
    const isShow = el.classList.contains('show');
    AoiApp.closeAll();
    if(!isShow) {
        el.classList.add('show');
        document.getElementById('global-click-area').classList.add('show');
    }
}
function closeDoc() { document.getElementById('viewer').classList.remove('show'); }
function closeAll() { AoiApp.closeAll(); }
