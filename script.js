const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const applyTheme = () => {
    document.body.className = `theme-${state.theme}`;
    const bgImg = state.theme === 'dark' ? 'assets/aoi-theme/Theme-Reading.webp' : 'assets/aoi-theme/Theme-Pale.webp';
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${bgImg}')`;
};

const closeAll = () => {
    document.getElementById('menu-drawer').classList.remove('show');
    document.getElementById('settings-drawer').classList.remove('show');
    document.getElementById('global-click-area').classList.remove('show');
};

const toggleSide = (id, event) => {
    event.stopPropagation(); // Ngăn sự kiện chạm lan ra click-area
    const el = document.getElementById(id);
    const area = document.getElementById('global-click-area');
    const isShow = el.classList.contains('show');

    closeAll();
    if (!isShow) {
        el.classList.add('show');
        area.classList.add('show');
    }
};

const parseMD = (text) => {
    return text.replace(/^# (.*$)/gim, '<h1>$1</h1>')
               .replace(/^## (.*$)/gim, '<h2>$1</h2>')
               .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" style="width:100%; border-radius:10px;">')
               .replace(/\n/gim, '<br>');
};

const render = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        const content = data[state.lang];
        document.getElementById('sub-title').innerText = content.sub;
        const grid = document.getElementById('content-grid');
        grid.innerHTML = '';
        content.posts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p><div class="card-footer">XEM →</div>`;
            card.querySelector('.card-footer').onclick = () => openDoc(item.file);
            grid.appendChild(card);
        });
    } catch (e) { console.log(e); }
};

const openDoc = async (file) => {
    closeAll();
    const res = await fetch(`./content/${file}`);
    const text = await res.text();
    document.getElementById('md-render-area').innerHTML = parseMD(text);
    document.getElementById('viewer').classList.remove('hidden');
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

document.getElementById('theme-toggle').onclick = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aoi_theme', state.theme);
    applyTheme();
};

document.getElementById('lang-switch').onchange = (e) => {
    state.lang = e.target.value;
    localStorage.setItem('aoi_lang', state.lang);
    render();
};

window.onload = () => { applyTheme(); render(); };
