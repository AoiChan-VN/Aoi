import { Storage } from '../core/Utils.js';

export class ThemeManager {
    constructor() {
        this.config = {
            mode: Storage.get('theme', 'dark'),
            bg: Storage.get('bg', true)
        };
    }

    init() {
        this.apply();
    }

    apply() {
        const { mode, bg } = this.config;
        document.body.className = `theme-${mode}`;
        document.body.classList.toggle('show-bg', bg);
        
        // Cập nhật các meta tag liên quan đến màu sắc hệ thống (nếu có)
        const metaTheme = $('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = mode === 'dark' ? '#0b0b0c' : '#ffffff';
    }

    set(key, value) {
        this.config[key] = value;
        Storage.set(key, value);
        this.apply();
    }
}
