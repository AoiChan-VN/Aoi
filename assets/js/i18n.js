export async function initI18n() {
    const lang = localStorage.getItem('lang') || 'vi';
    document.getElementById('langSwitcher').value = lang;
    
    const response = await fetch(`./assets/lang/${lang}.json`);
    const data = await response.json();
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (data[key]) el.innerText = data[key];
    });

    document.getElementById('langSwitcher').addEventListener('change', (e) => {
        localStorage.setItem('lang', e.target.value);
        location.reload(); // Reload nhanh để áp dụng bundle mới
    });
}
 
