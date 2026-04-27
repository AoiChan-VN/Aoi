/**
 * 🌊 AoiRender Module
 * Hiển thị danh sách bài viết và các thành phần UI động
 */
import { $ } from '../core/Utils.js';

export const Render = {
    /**
     * Render lưới bài viết
     * @param {Array} posts - Danh sách bài viết từ data/posts.js
     * @param {Object} dict - Từ điển ngôn ngữ hiện tại
     */
    grid(posts, dict) {
        const container = $('#content-grid');
        if (!container) return;

        container.innerHTML = posts.map(post => `
            <article class="card" data-file="${post.file}" role="button" tabindex="0">
                <div class="card-media">
                    <img src="${post.thumb}" class="card-img" alt="${post.title}" 
                         onerror="this.src='./assets/img/fallback.png'" loading="lazy">
                </div>
                <div class="card-info">
                    <h3>${post.title}</h3>
                    <p>${post.desc}</p>
                    <span class="btn">${dict.detail_btn || 'Xem thêm'}</span>
                </div>
            </article>
        `).join('');
    },

    /**
     * Render Menu ngăn kéo
     */
    menu(dict) {
        const menu = $('#menu-left');
        if (!menu) return;

        menu.innerHTML = `
            <div class="menu-header">
                <div class="avatar-mini"><img src="./assets/img/Logo.png" alt="logo"></div>
                <button id="close-menu" class="close-btn-mini">✘</button>
            </div>
            <nav class="menu-links">
                <button class="menu-item" onclick="location.reload()">🏠 ${dict.home || 'Trang chủ'}</button>
                <button id="info-btn" class="menu-item">ⓘ ${dict.info || 'Thông tin'}</button>
                <hr class="divider">
                <button id="open-settings-sub" class="menu-item">⚙ ${dict.setting_title || 'Cài đặt'}</button>
            </nav>
            <div class="menu-footer">
                <p>︵»𝓐𝓸𝓲𝓒𝓱𝓪𝓷 © 2026«︵</p>
            </div>
        `;
    }
};
 
