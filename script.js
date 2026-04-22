const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const applyTheme = () => {
    document.body.className = `theme-${state.theme}`;
    
    /const bgImg = state.theme === 'dark' ? 'assets/aoi-theme/Theme-Reading.webp' : 'assets/aoi-theme/Theme-Pale.webp';
    
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bgImg}')`;
    document.getElementById('theme-select').value = state.theme;
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
            // 1. Tạo thanh tiêu đề nhóm
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span>${group.group_name}</span><span class="arrow">▾</span>`;
            
            // 2. Tạo khung chứa các bài viết (mặc định ẩn)
            const container = document.createElement('div');
            container.className = 'group-content';
            container.id = `group-${index}`;

            group.posts.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p><div class="card-footer">chi tiết</div>`;
                card.querySelector('.card-footer').onclick = (e) => {
                    e.stopPropagation(); // Ngăn việc bấm nút mà lại đóng nhóm
                    openDoc(item.file);
                };
                container.appendChild(card);
            });

            // 3. Sự kiện bấm để đóng/mở
            header.onclick = () => {
                const isOpen = container.classList.contains('show');
                // Đóng tất cả các nhóm khác (nếu muốn chỉ mở 1 cái duy nhất)
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
    } catch (e) { console.error(e); }
};

const searchPosts = () => {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const desc = card.querySelector('p').innerText.toLowerCase();
        card.style.display = (title.includes(keyword) || desc.includes(keyword)) ? 'block' : 'none';
    });
};

const openDoc = async (file) => {
    closeAll();
    const loader = document.getElementById('loader');
    loader.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        document.getElementById('md-render-area').innerHTML = text.replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/\n/gim, '<br>');
        document.getElementById('viewer').classList.remove('hidden');
    } catch (e) { alert("Lỗi tải bài viết"); }
    setTimeout(() => loader.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

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

window.onload = () => { applyTheme(); render(); }; 
