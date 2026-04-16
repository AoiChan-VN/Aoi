import { initI18n, updateContent } from './i18n.js';
import { renderProducts } from './renderer.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Chạy song song các tác vụ để tiết kiệm thời gian
    const [lang] = await Promise.all([
        initI18n(),
        renderProducts()
    ]);

    // Hiệu ứng Fade-in khi mọi thứ đã sẵn sàng
    document.body.classList.add('ready');
    
    console.log("System 2026 Ready.");
});
 
