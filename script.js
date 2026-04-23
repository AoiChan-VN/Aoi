const toggleBg = () => {
    const isShow = document.getElementById('bg-toggle').checked;
    document.body.classList.toggle('show-bg', isShow);
    localStorage.setItem('aoi_bg', isShow);
};

const renderPosts = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        const posts = data.vi.posts; // Mặc định lấy tiếng Việt
        
        const grid = document.getElementById('content-grid');
        grid.innerHTML = posts.map(item => `
            <div class="card">
                <div class="card-content">
                    <img src="${item.thumb || 'assets/default.jpg'}" class="card-img">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <button class="btn-detail" onclick="openDoc('${item.file}')">Chi tiết</button>
                </div>
            </div>
        `).join('');
    } catch (e) { console.error("Lỗi data:", e); }
};

// Khởi tạo trạng thái
window.onload = () => {
    const savedBg = localStorage.getItem('aoi_bg');
    if (savedBg === 'false') {
        document.getElementById('bg-toggle').checked = false;
        document.body.classList.remove('show-bg');
    }
    renderPosts();
};

// Các hàm đóng mở menu giữ nguyên từ code cũ của bạn
function toggleDrawer(id) {
    document.getElementById(id).classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
}
