// LOGIC HỆ THỐNG - Ưu tiên lấy từ bộ nhớ máy người dùng
const state = {
    lang: localStorage.getItem('aoi_lang') || 'vi',
    theme: localStorage.getItem('aoi_theme') || 'dark'
};

// MINI MARKDOWN PARSER (Giữ nguyên và tối ưu ngắt dòng)
const parseMD = (text) => {
    return text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="md-img-container"><img alt="$1" src="$2" loading="lazy"></div>')
        .replace(/@\[video\]\((.*?)\)/gim, '<video controls class="md-video"><source src="$1" type="video/mp4"></video>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" class="md-link">$1</a>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n/gim, '<br>');
};

// HÀM CẬP NHẬT GIAO DIỆN & ẢNH NỀN (Xử lý lỗi nháy và vạch trắng)
const applyTheme = () => {
    const root = document.documentElement;
    document.body.className = `theme-${state.theme}`;
    
    // Sử dụng ảnh nội bộ từ thư mục assets để tránh lag
    const bgImg = state.theme === 'dark' ? 
        'assets/aoi-theme/Theme-Reading.webp' :
        'assets/aoi-theme/Theme-Pale.webp';
    document.body.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${bgImg}')`;
    
    // Chống vạch trắng bằng cách ép màu nền trùng với màu theme
    document.body.style.backgroundColor = state.theme === 'dark' ? '#050505' : '#f5f5f7';
};

const init = () => {
    applyTheme(); // Chạy ngay lập tức khi load trang
    document.getElementById('lang-switch').value = state.lang;
    render();
    
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    if (postFile) openDoc(postFile);
};

// TỰ ĐỘNG RENDER CARD (Sửa logic fetch để mượt hơn)
const render = async () => {
    try {
        const response = await fetch('./data.json');
        const dataAll = await response.json();
        const data = dataAll[state.lang];

        document.getElementById('sub-title').innerText = data.sub;
        const grid = document.getElementById('content-grid');
        grid.innerHTML = '';

        data.posts.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            // Không gán sự kiện onclick vào Card để tránh bấm nhầm
            card.innerHTML = `
                <div class="card-icon">📁</div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">Xem chi tiết →</div>
            `;
            
            // Chỉ nhấn vào nút mới mở bài viết
            card.querySelector('.card-footer').onclick = () => openDoc(item.file);
            grid.appendChild(card);
        });
    } catch (e) {
        console.error("Lỗi tải data.json");
    }
};

// Mở tài liệu (Thêm hiệu ứng Loader mượt)
const openDoc = async (file) => {
    const viewer = document.getElementById('viewer');
    const area = document.getElementById('md-render-area');
    const loader = document.getElementById('loader');
    
    loader.style.width = '100%';
    loader.style.opacity = '1';
    
    try {
        const res = await fetch(`./content/${file}`);
        const text = await res.text();
        area.innerHTML = parseMD(text);
        viewer.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính khi đang xem bài
    } catch (e) {
        area.innerHTML = "Không tìm thấy file nội dung.";
    }
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.width = '0', 300);
    }, 400);
};

const closeDoc = () => {
    document.getElementById('viewer').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Mở lại cuộn trang
};

// EVENT LISTENERS (Tối ưu hóa đổi theme tức thì)
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
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? 'block' : 'none';
    });
};

init();
