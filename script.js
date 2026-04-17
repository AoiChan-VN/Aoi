let db = {};
let currentCategory = "Tất cả";

// Load Database từ file JSON
async function loadDatabase() {
    const response = await fetch('./data.json');
    db = await response.json();
    renderContent();
    renderFilters();
}

// Render các nút lọc bài viết
function renderFilters() {
    const filterContainer = document.querySelector('.filter-bar') || document.createElement('div');
    filterContainer.className = 'filter-bar';
    filterContainer.innerHTML = '';
    
    db[currentLang].categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${currentCategory === cat ? 'active' : ''}`;
        btn.innerText = cat;
        btn.onclick = () => {
            currentCategory = cat;
            renderFilters();
            renderContent();
        };
        filterContainer.appendChild(btn);
    });
    
    document.getElementById('hero').after(filterContainer);
}

// Render danh sách bài viết/sản phẩm
function renderContent() {
    UI.grid.innerHTML = '';
    const langData = db[currentLang];
    document.getElementById('sub-title').innerText = langData.description;

    const filteredItems = langData.items.filter(item => 
        currentCategory === "Tất cả" || currentCategory === "All" || item.cat === currentCategory
    );

    filteredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${item.img}'); height:180px; background-size:cover; border-radius:12px; margin-bottom:15px"></div>
            <span style="font-size:12px; color:var(--accent)">#${item.cat}</span>
            <h3 style="margin: 10px 0">${item.title}</h3>
            <p style="font-size:14px; opacity:0.7">${item.desc}</p>
        `;
        card.onclick = () => openDoc(item.file);
        UI.grid.appendChild(card);
    });
}

// Khởi chạy hệ thống
window.onload = () => {
    init(); // Từ phần 1
    loadDatabase();
};
