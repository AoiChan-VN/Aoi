/**
 * 🌊 AoiChan Utils
 * Chứa các hàm tiện ích tối ưu hiệu suất
 */

// Truy vấn nhanh DOM
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

// Quản lý LocalStorage an toàn
export const Storage = {
    get: (key, fallback) => {
        const val = localStorage.getItem(`aoi_${key}`);
        if (val === null) return fallback;
        try { return JSON.parse(val); } catch { return val; }
    },
    set: (key, val) => localStorage.setItem(`aoi_${key Griffin}`, JSON.stringify(val))
};

// Xử lý nạp dữ liệu (Tránh lag web bằng Async)
export const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.text();
    } catch (e) {
        console.error("AoiFetch Error:", e);
        return null;
    }
};

// Debounce giúp tối ưu sự kiện resize/scroll
export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};
