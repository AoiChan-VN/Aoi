const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const applyTheme = () => {
    document.body.className = `theme-${state.theme}`;
    const bgImg = state.theme === 'dark' ? 'assets/aoi-theme/Theme-Pale.webp' : 'assets/aoi-theme/Theme-Reading.webp';
    document.body.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${bgImg}')`;
};

const parseMD = (text) => {
    return text
        // Tiêu đề
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        // Ảnh: ![alt](url)
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="md-img-container"><img alt="$1" src="$2" loading="lazy"></div>')
        // Video: @[video](url) - Cú pháp tự chế của Aoi
        .replace(/@\[video\]\((.*?)\)/gim, '<video controls class="md-video"><source src="$1" type="video/mp4"></video>')
        // Link: [text](url)
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" class="md-link">$1</a>')
        // Bold & Italic
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        // Danh sách gạch đầu dòng
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        // Ngắt dòng
        .replace(/\n/gim, '<br>');
};

const render = async () => {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const content = data[state.lang];
        
        document.getElementById('sub-title').innerText = content.sub;
        const grid = document.getElementById('content-grid');
        grid.innerHTML = '';

        content.posts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">XEM CHI TIẾT →</div>
            `;
            card.querySelector('.card-footer').onclick = () => openDoc(item.file);
            grid.appendChild(card);
        });
    } catch (e) { console.error("Data error"); }
};

const openDoc = async (file) => {
    const loader = document.getElementById('loader');
    loader.style.width = '100%';
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        document.getElementById('md-render-area').innerHTML = parseMD(text);
        document.getElementById('viewer').classList.remove('hidden');
        document.getElementById('menu-drawer').classList.remove('show');
    } catch (e) { alert("Lỗi tải bài viết"); }
    setTimeout(() => loader.style.width = '0', 400);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

const toggleSide = (id) => document.getElementById(id).classList.toggle('show');

document.getElementById('menu-open').onclick = () => toggleSide('menu-drawer');
document.getElementById('settings-open').onclick = () => toggleSide('settings-drawer');

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

const searchPosts = () => {
    const input = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? 'block' : 'none';
    });
};

const init = () => { applyTheme(); render(); };
init();
