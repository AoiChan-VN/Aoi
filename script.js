// CƠ SỞ DỮ LIỆU CÁ NHÂN (Dễ dàng mở rộng)
const DB = {
    vi: {
        sub: "🌿🥀𝓐𝓸𝓲𝓒𝓱𝓪𝓷🥀🌿 - Plugin & Game System",
        // Bạn chỉ cần thêm tên file .md vào đây, mọi thứ khác web tự lo
        posts: ["aoi-Plugin.md", "plugin-v1.md", "my-game.md", "tutorial.md"] 
    },
    en: {
        sub: "🌿🥀AoiChan🥀🌿 - Specialized in Plugins & Games",
        posts: ["plugin-v1.md", "my-game.md"]
    }
};

// MINI MARKDOWN PARSER (Tự viết, không dùng thư viện ngoài)
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

// LOGIC HỆ THỐNG
const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

const init = () => {
    document.body.className = `theme-${state.theme}`;
    document.getElementById('lang-switch').value = state.lang;
    render();
    
    // Tự động mở bài viết từ URL (Ví dụ: index.html?post=game.md)
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    if (postFile) openDoc(postFile);
};

// TỰ ĐỘNG RENDER CARD (Tối ưu cực độ)
const render = () => {
    const data = DB[state.lang];
    document.getElementById('sub-title').innerText = data.sub;
    const grid = document.getElementById('content-grid');
    grid.innerHTML = '';

    data.posts.forEach((fileName, index) => {
        // Tự động tạo Title từ tên file (ví dụ: 'aoi-game.md' -> 'Aoi Game')
        const autoTitle = fileName.replace('.md', '').replace(/-/g, ' ').toUpperCase();
        
        const card = document.createElement('div');
        card.className = 'card fade-in';
        card.style.animationDelay = `${index * 0.1}s`; // Hiệu ứng hiện từng cái một
        card.innerHTML = `
            <div class="card-icon">📁</div>
            <h3>${autoTitle}</h3>
            <p>Nhấp để xem chi tiết bài viết: ${fileName}</p>
            <div class="card-footer">Read More →</div>
        `;
        card.onclick = () => openDoc(fileName);
        grid.appendChild(card);
    });
};

// Tìm kiếm bài viết,..
const searchPosts = () => {
    const input = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? 'block' : 'none';
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

// EVENT LISTENERS
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
