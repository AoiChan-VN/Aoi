import { initI18n } from './i18n.js';
import { renderContent } from './renderer.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loading');

    try {
        // Chạy đồng thời để tối ưu tốc độ
        await Promise.all([
            initI18n(),
            renderContent()
        ]);
        
        // Tắt màn hình chờ
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    } catch (err) {
        console.error("Lỗi hệ thống:", err);
        if(loader) loader.remove();
    }
});
