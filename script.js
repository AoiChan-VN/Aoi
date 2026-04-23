const state = {
    theme: localStorage.getItem('aoi_theme') || 'dark',
    bg: localStorage.getItem('aoi_bg') !== 'false'
};

const applySettings = () => {
    document.body.className = `theme-${state.theme} ${state.bg ? 'show-bg' : ''}`;
    document.getElementById('bg-toggle').checked = state.bg;
    document.getElementById('theme-select').value = state.theme;
};

const updateSettings = () => {
    state.theme = document.getElementById('theme-select').value;
    state.bg = document.getElementById('bg-toggle').checked;
    localStorage.setItem('aoi_theme', state.theme);
    localStorage.setItem('aoi_bg', state.bg);
    applySettings();
};

const toggleSide = (id) => {
    document.getElementById(id).classList.toggle('show');
    document.getElementById('global-overlay').classList.toggle('show');
};

const closeAll = () => {
    document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
    document.getElementById('global-overlay').classList.remove('show');
};

const render = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        const posts = data.vi.posts;
        
        const grid = document.getElementById('content-grid');
        grid.innerHTML = posts.map(item => `
            <div class="card">
                <img src="${item.thumb || 'assets/default.jpg'}" class="card-img">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <button class="btn-detail" onclick="openDoc('${item.file}')">Chi tiết</button>
                </div>
            </div>
        `).join('');
    } catch (e) { console.error("Data error", e); }
};

const openDoc = async (file) => {
    const loader = document.getElementById('loader');
    loader.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        document.getElementById('md-render-area').innerHTML = text.replace(/\n/g, '<br>');
        document.getElementById('viewer').classList.remove('hidden');
    } catch (e) { alert("Không thể tải nội dung"); }
    setTimeout(() => loader.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

window.onload = () => {
    applySettings();
    render();
};
