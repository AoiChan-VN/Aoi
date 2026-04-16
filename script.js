// Dữ liệu mẫu (Có thể chuyển sang file JSON riêng nếu cần)
const products = [
    { title: "Quantum Plugin", desc: "Tối ưu hóa Server tốc độ cao.", link: "#" },
    { title: "Galaxy War Game", desc: "Game RPG phong cách vũ trụ.", link: "#" }
];

// 1. Đa ngôn ngữ
async function updateLanguage(lang) {
    const response = await fetch('lang.json');
    const data = await response.json();
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = data[lang][key];
    });
    localStorage.setItem('pref-lang', lang);
}

document.getElementById('lang-switcher').addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// 2. Load Markdown
async function loadMarkdown(file) {
    try {
        const response = await fetch(`./content/${file}.md`);
        const text = await response.text();
        document.getElementById('md-viewer').innerHTML = marked.parse(text);
    } catch (err) {
        document.getElementById('md-viewer').innerHTML = "Chưa có nội dung bài viết.";
    }
}

// 3. Khởi tạo Website
window.onload = () => {
    // Ngôn ngữ mặc định
    const savedLang = localStorage.getItem('pref-lang') || 'vi';
    document.getElementById('lang-switcher').value = savedLang;
    updateLanguage(savedLang);

    // Load Sản phẩm
    const prodList = document.getElementById('product-list');
    products.forEach(p => {
        prodList.innerHTML += `
            <div class="card">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <a href="${p.link}" style="color:var(--accent); text-decoration:none; margin-top:10px; display:inline-block;">Chi tiết →</a>
            </div>
        `;
    });

    // Load bài Markdown mặc định (Ví dụ file about.md)
    loadMarkdown('about');
};
 
