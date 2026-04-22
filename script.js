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
    const themeSelect = document.getElementById('theme-select');
    if(themeSelect) themeSelect.value = state.theme;
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
        if(!grid) return;
        grid.innerHTML = '';

        content.categories.forEach((group, index) => {
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span>${group.group_name}</span><span class="arrow">▾</span>`;
            
            const container = document.createElement('div');
            container.className = 'group-content';
            container.id = `group-${index}`;

            group.posts.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p><div class="card-footer">chi tiết</div>`;
                card.querySelector('.card-footer').onclick = (e) => {
                    e.stopPropagation();
                    openDoc(item.file);
                };
                container.appendChild(card);
            });

            header.onclick = () => {
                const isOpen = container.classList.contains('show');
                document.querySelectorAll('.group-content').forEach(c => {
                    c.classList.remove('show');
                    c.style.maxHeight = null;
                });
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
    } catch (e) { console.error("Lỗi Render:", e); }
};

const openDoc = async (file) => {
    closeAll();
    const loader = document.getElementById('loader');
    if(loader) loader.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        if(!res.ok) throw new Error();
        const text = await res.text();
        // Render Markdown cơ bản
        document.getElementById('md-render-area').innerHTML = text
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br>').join('');
            
        document.getElementById('viewer').classList.remove('hidden');
    } catch (e) { 
        alert("Lỗi: Không tìm thấy file bài viết trong thư mục /content/"); 
    }
    if(loader) setTimeout(() => loader.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

// Gán sự kiện sau khi DOM load xong
window.onload = () => { 
    applyTheme(); 
    render(); 

    document.getElementById('theme-select').onchange = (e) => {
        state.theme = e.target.value;
        localStorage.setItem('aoi_theme', state.theme);
        applyTheme();
    };

    document.getElementById('lang-switch').onchange = (e) => {
        state.lang = e.target.value;
        localStorage.setItem('aoi_lang', state.lang);
        render();
    };
};
