const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const applyTheme = () => {
    document.body.className = `theme-${state.theme}`;
    const bgImg = state.theme === 'dark' ? 'assets/bg-dark.jpg' : 'assets/bg-light.jpg';
    // Ép màu nền tối đồng bộ
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${bgImg}')`;
    document.getElementById('theme-select').value = state.theme;
};

const closeAll = () => {
    document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
    document.getElementById('global-click-area').classList.remove('show');
};

const toggleSide = (id, event) => {
    if (event) event.stopPropagation();
    const el = document.getElementById(id);
    const area = document.getElementById('global-click-area');
    const isShow = el.classList.contains('show');

    closeAll();
    if (!isShow) {
        el.classList.add('show');
        area.classList.add('show');
    }
};

const render = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        const content = data[state.lang];
        // Cập nhật sub ngầm (nếu cần dùng ở chỗ khác)
        const grid = document.getElementById('content-grid');
        grid.innerHTML = '';
        content.posts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">VIEW DETAILS →</div>
            `;
            card.querySelector('.card-footer').onclick = () => openDoc(item.file);
            grid.appendChild(card);
        });
    } catch (e) { console.error("Error loading data"); }
};

const openDoc = async (file) => {
    closeAll();
    const loader = document.getElementById('loader');
    loader.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        // Parser đơn giản cho Markdown
        document.getElementById('md-render-area').innerHTML = text
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\n/gim, '<br>');
        document.getElementById('viewer').classList.remove('hidden');
    } catch (e) { alert("Post not found"); }
    setTimeout(() => loader.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

const searchPosts = () => {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(keyword) ? 'block' : 'none';
    });
};

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
