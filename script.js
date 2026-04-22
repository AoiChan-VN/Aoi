/**
 * AoiChan Premium Web App Core
 * Optimized for GitHub Pages & Offline use
 */

const AoiApp = {
    // 1. Quản lý trạng thái
    state: {
        lang: localStorage.getItem('aoi_lang') || 'vi',
        theme: localStorage.getItem('aoi_theme') || 'dark',
        data: null // Cache dữ liệu để không phải fetch nhiều lần
    },

    // 2. Khởi tạo ứng dụng
    init() {
        this.applyTheme();
        this.loadData();
        this.bindEvents();
    },

    // 3. Giao diện & Chủ đề
    applyTheme() {
        const { theme } = this.state;
        document.body.className = `theme-${theme}`;
        
        // Tối ưu hình nền: Sử dụng hiệu ứng mờ kết hợp gradient
        const bgImg = theme === 'dark' 
            ? 'assets/aoi-theme/Theme-Reading.webp' 
            : 'assets/aoi-theme/Theme-Pale.webp';
        
        document.body.style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${bgImg}') center/cover no-repeat fixed`;
        
        const select = document.getElementById('theme-select');
        if(select) select.value = theme;
    },

    // 4. Xử lý dữ liệu (Cải tiến tốc độ)
    async loadData() {
        try {
            if (!this.state.data) {
                const res = await fetch('./data.json');
                this.state.data = await res.json();
            }
            this.renderMenu();
        } catch (e) {
            console.error("Lỗi dữ liệu:", e);
        }
    },

    renderMenu() {
        const content = this.state.data[this.state.lang];
        const grid = document.getElementById('content-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        content.categories.forEach((group, index) => {
            // Header nhóm với hiệu ứng Icon xoay
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `
                <span>${group.group_name}</span>
                <span class="arrow">✦</span>
            `;
            
            const container = document.createElement('div');
            container.className = 'group-content';
            container.id = `group-${index}`;

            group.posts.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card premium-card';
                card.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="card-footer">Read More</div>
                `;
                card.onclick = () => this.openDoc(item.file);
                container.appendChild(card);
            });

            header.onclick = () => {
                const isActive = header.classList.toggle('active');
                container.classList.toggle('show', isActive);
                
                // Hiệu ứng đóng các nhóm khác (Accordion mode)
                if (isActive) {
                    document.querySelectorAll('.group-header').forEach(h => {
                        if (h !== header) {
                            h.classList.remove('active');
                            h.nextElementSibling.classList.remove('show');
                        }
                    });
                }
            };

            grid.appendChild(header);
            grid.appendChild(container);
        });
    },

    // 5. Công cụ tìm kiếm (Debounce xử lý nhanh)
    searchPosts(query) {
        const keyword = query.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(keyword) ? 'block' : 'none';
            // Tự động mở group nếu tìm thấy card bên trong
            if (text.includes(keyword)) {
                card.parentElement.classList.add('show');
                card.parentElement.previousElementSibling.classList.add('active');
            }
        });
    },

    // 6. Trình xem nội dung (Markdown Parser nâng cấp)
    async openDoc(file) {
        this.closeAll();
        const loader = document.getElementById('loader');
        loader.style.width = '100%';
        
        try {
            const res = await fetch(`./content/${file}`);
            let text = await res.text();
            
            // Premium Markdown Parser (Hỗ trợ Bold, Italic, List)
            const html = text
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                .replace(/\*(.*)\*/gim, '<i>$1</i>')
                .replace(/\n/gim, '<br>');

            document.getElementById('md-render-area').innerHTML = html;
            document.getElementById('viewer').classList.remove('hidden');
        } catch (e) {
            alert("Không thể tải nội dung.");
        } finally {
            setTimeout(() => loader.style.width = '0', 500);
        }
    },

    // 7. Event Listeners
    bindEvents() {
        document.getElementById('theme-select').onchange = (e) => {
            this.state.theme = e.target.value;
            localStorage.setItem('aoi_theme', this.state.theme);
            this.applyTheme();
        };

        document.getElementById('lang-switch').onchange = (e) => {
            this.state.lang = e.target.value;
            localStorage.setItem('aoi_lang', this.state.lang);
            this.renderMenu();
        };

        document.getElementById('search-input').oninput = (e) => {
            this.searchPosts(e.target.value);
        };
    },

    closeAll() {
        document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('show'));
        document.getElementById('global-click-area').classList.remove('show');
    }
};

// Khởi chạy khi trang sẵn sàng
window.onload = () => AoiApp.init();

// Function Global cho HTML gọi
function closeAll() { AoiApp.closeAll(); }
function toggleSide(id, e) {
    e.stopPropagation();
    const el = document.getElementById(id);
    const isShow = el.classList.contains('show');
    AoiApp.closeAll();
    if (!isShow) {
        el.classList.add('show');
        document.getElementById('global-click-area').classList.add('show');
    }
}
function closeDoc() { document.getElementById('viewer').classList.add('hidden'); }
