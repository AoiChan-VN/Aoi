const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const applyTheme = () => {
    document.body.className = `theme-${state.theme}`;
    const bgImg = state.theme === 'dark' 
        ? 'assets/aoi-theme/Theme-Reading.webp' 
        : 'assets/aoi-theme/Theme-Pale.webp';
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bgImg}')`;
    const ts = document.getElementById('theme-select');
    if(ts) ts.value = state.theme;
};

const closeAll = () => {
    document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
    document.getElementById('global-click-area').classList.remove('show');
};

const toggleSide = (id, event) => {
    event.stopPropagation();
    const el = document.getElementById(id);
    const isShow = el.classList.contains('show');
    closeAll();
    if (!isShow) {
        el.classList.add('show');
        document.getElementById('global-click-area').classList.add('show');
    }
};

const render = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        const content = data[state.lang];
        const grid = document.getElementById('content-grid');
        grid.innerHTML = '';

        content.categories.forEach((group, index) => {
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span>${group.group_name}</span><span class="arrow">▾</span>`;
            
            const container = document.createElement('div');
            container.className = 'group-content';
            
            group.posts.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p><div class="card-footer">chi tiết</div>`;
                card.querySelector('.card-footer').onclick = (e) => { e.stopPropagation(); openDoc(item.file); };
                container.appendChild(card);
            });

            header.onclick = () => {
                const isOpen = container.classList.contains('show');
                document.querySelectorAll('.group-content').forEach(c => { c.classList.remove('show'); c.style.maxHeight = '0'; });
                document.querySelectorAll('.group-header').forEach(h => h.classList.remove('active'));
                if (!isOpen) {
                    container.classList.add('show');
                    header.classList.add('active');
                    container.style.maxHeight = container.scrollHeight + "px";
                }
            };
            grid.appendChild(header);
            grid.appendChild(container);
        });

        // Chèn Footer vào đáy Menu
        const menu = document.getElementById('menu-drawer');
        if (!menu.querySelector('.drawer-footer')) {
            const f = document.createElement('div');
            f.className = 'drawer-footer';
            f.innerHTML = `<img src="assets/aoi-logo/Aoi-Logo.png" class="footer-logo-inside">
                <div class="copyright-inside"><p>𝓐𝓸𝓲𝓒𝓱𝓪𝓷❤</p><p>© 2026</p></div>`;
            menu.appendChild(f);
        }
    } catch (e) { console.error(e); }
};

const searchPosts = () => {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.group-content').forEach(group => {
        let hasMatch = false;
        group.querySelectorAll('.card').forEach(card => {
            const match = card.innerText.toLowerCase().includes(keyword);
            card.style.display = match ? 'block' : 'none';
            if(match) hasMatch = true;
        });
        const header = group.previousElementSibling;
        if (keyword && hasMatch) {
            header.style.display = 'flex';
            header.classList.add('active');
            group.style.maxHeight = group.scrollHeight + "px";
        } else if (keyword && !hasMatch) {
            header.style.display = 'none';
            group.style.maxHeight = '0';
        } else {
            header.style.display = 'flex';
            header.classList.remove('active');
            group.style.maxHeight = '0';
        }
    });
};

const openDoc = async (file) => {
    closeAll();
    const ld = document.getElementById('loader');
    ld.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        document.getElementById('md-render-area').innerHTML = text.replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/\n/gim, '<br>');
        document.getElementById('viewer').classList.remove('hidden');
    } catch (e) { alert("Lỗi tải file"); }
    setTimeout(() => ld.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

window.onload = () => {
    applyTheme(); render();
    document.getElementById('theme-select').onchange = (e) => { state.theme = e.target.value; localStorage.setItem('aoi_theme', state.theme); applyTheme(); };
    document.getElementById('lang-switch').onchange = (e) => { state.lang = e.target.value; localStorage.setItem('aoi_lang', state.lang); render(); };
};
 
