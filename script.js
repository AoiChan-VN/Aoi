// 1. DỮ LIỆU NỘI BỘ (Thay thế database ngoài)
const DB = {
    vi: {
        sub: "Hệ thống sản phẩm cá nhân - Tối ưu cực hạn",
        items: [
            { title: "Aoi Plugin v1", cat: "Plugin", file: "aoi-plugin.md", desc: "Tối ưu hóa hệ thống server." },
            { title: "Aoi Game Pro", cat: "Game", file: "game.md", desc: "Trải nghiệm đồ họa đỉnh cao." }
        ]
    },
    en: {
        sub: "Personal Products - Extreme Optimization",
        items: [
            { title: "Aoi Plugin v1", cat: "Plugin", file: "aoi-plugin-en.md", desc: "System optimization." }
        ]
    }
};

// 2. MINI MARKDOWN PARSER (Tự viết, không dùng thư viện ngoài)
const parseMD = (text) => {
    return text
        // Tiêu đề
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        // Ảnh: ![alt](url)
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="md-img-container"><img alt="$1" src="$2" loading="lazy"></div>')
        // Video: @[video](url) - Cú pháp tự chế cho Aoi
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

// 3. LOGIC HỆ THỐNG
const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const init = () => {
    // Áp dụng theme/lang ngay lập tức (không lag)
    document.body.className = `theme-${state.theme}`;
    document.getElementById('lang-switch').value = state.lang;
    render();
};

const render = () => {
    const data = DB[state.lang];
    document.getElementById('sub-title').innerText = data.sub;
    const grid = document.getElementById('content-grid');
    grid.innerHTML = '';

    data.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-tag">${item.cat}</div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        `;
        card.onclick = () => openDoc(item.file);
        grid.appendChild(card);
    });
};

// Hàm mở file bài viết tự động
const openDoc = async (file) => {
    const viewer = document.getElementById('viewer');
    const area = document.getElementById('md-render-area');
    document.getElementById('loader').style.width = '100%';
    
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        area.innerHTML = parseMD(text); // Dùng parser tự viết
        viewer.classList.remove('hidden');
    } catch (e) {
        area.innerHTML = "Không tìm thấy file nội dung.";
    }
    
    setTimeout(() => document.getElementById('loader').style.width = '0', 300);
};

const closeDoc = () => document.getElementById('viewer').classList.add('hidden');

// 4. EVENT LISTENERS
document.getElementById('theme-toggle').onclick = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.className = `theme-${state.theme}`;
    localStorage.setItem('aoi_theme', state.theme);
};

document.getElementById('lang-switch').onchange = (e) => {
    state.lang = e.target.value;
    localStorage.setItem('aoi_lang', state.lang);
    render();
};

init();

const handleURL = () => {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('post');
    if (file) openDoc(file);
};

// Gọi handleURL() trong init
const init = () => {
    document.body.className = `theme-${state.theme}`;
    document.getElementById('lang-switch').value = state.lang;
    render();
    handleURL(); // Thêm dòng này
};
